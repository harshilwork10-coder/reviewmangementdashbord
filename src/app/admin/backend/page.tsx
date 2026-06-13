"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Cpu, FolderOpen, Folder, ChevronDown, ChevronRight, GitBranch,
    Layers, Zap, FileText, Check, CheckCircle2, AlertTriangle,
    Clock, RefreshCw, Terminal, BarChart2, Shield, ArrowRight,
    Mail, MessageSquare, BarChart, Webhook, Play, X, Info
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface FolderNode { name: string; type: "folder" | "file"; children?: FolderNode[]; color?: string }
interface ServiceDef { name: string; color: string; responsibility: string; deps: string[]; icon: React.ElementType }
interface Job { id: string; name: string; status: "queued" | "processing" | "done" | "failed"; retries: number; ts: string }
interface QueueDef { name: string; icon: React.ElementType; color: string; processor: string; jobs: Job[] }
interface LogEntry { type: string; color: string; fields: Record<string, string> }

// ── Folder Tree Data ───────────────────────────────────────────────────────
const srcTree: FolderNode[] = [
    { name: "src", type: "folder", color: "text-slate-300", children: [
        { name: "auth", type: "folder", color: "text-violet-400", children: [
            { name: "auth.controller.ts", type: "file" },
            { name: "auth.service.ts", type: "file" },
            { name: "auth.module.ts", type: "file" },
            { name: "strategies/", type: "folder", children: [{ name: "jwt.strategy.ts", type: "file" }] },
            { name: "guards/", type: "folder", children: [{ name: "jwt-auth.guard.ts", type: "file" }, { name: "roles.guard.ts", type: "file" }] },
        ]},
        { name: "users", type: "folder", color: "text-blue-400", children: [
            { name: "users.controller.ts", type: "file" },
            { name: "users.service.ts", type: "file" },
            { name: "users.repository.ts", type: "file" },
            { name: "dto/", type: "folder", children: [{ name: "create-user.dto.ts", type: "file" }, { name: "update-user.dto.ts", type: "file" }] },
            { name: "users.module.ts", type: "file" },
        ]},
        { name: "businesses", type: "folder", color: "text-emerald-400", children: [
            { name: "businesses.controller.ts", type: "file" },
            { name: "businesses.service.ts", type: "file" },
            { name: "businesses.repository.ts", type: "file" },
            { name: "dto/", type: "folder", children: [{ name: "create-business.dto.ts", type: "file" }] },
            { name: "businesses.module.ts", type: "file" },
        ]},
        { name: "customers", type: "folder", color: "text-cyan-400", children: [
            { name: "customers.controller.ts", type: "file" },
            { name: "customers.service.ts", type: "file" },
            { name: "customers.repository.ts", type: "file" },
            { name: "dto/", type: "folder", children: [{ name: "create-customer.dto.ts", type: "file" }, { name: "import-customers.dto.ts", type: "file" }] },
            { name: "customers.module.ts", type: "file" },
        ]},
        { name: "campaigns", type: "folder", color: "text-orange-400", children: [
            { name: "campaigns.controller.ts", type: "file" },
            { name: "campaigns.service.ts", type: "file" },
            { name: "campaigns.repository.ts", type: "file" },
            { name: "dto/", type: "folder", children: [{ name: "create-campaign.dto.ts", type: "file" }, { name: "launch-campaign.dto.ts", type: "file" }] },
            { name: "campaigns.module.ts", type: "file" },
        ]},
        { name: "reviews", type: "folder", color: "text-yellow-400", children: [
            { name: "reviews.controller.ts", type: "file" },
            { name: "reviews.service.ts", type: "file" },
            { name: "reviews.repository.ts", type: "file" },
            { name: "reviews.module.ts", type: "file" },
        ]},
        { name: "reports", type: "folder", color: "text-pink-400", children: [
            { name: "reports.controller.ts", type: "file" },
            { name: "reports.service.ts", type: "file" },
            { name: "reports.repository.ts", type: "file" },
            { name: "reports.module.ts", type: "file" },
        ]},
        { name: "billing", type: "folder", color: "text-rose-400", children: [
            { name: "billing.controller.ts", type: "file" },
            { name: "billing.service.ts", type: "file" },
            { name: "billing.repository.ts", type: "file" },
            { name: "dto/", type: "folder", children: [{ name: "create-subscription.dto.ts", type: "file" }] },
            { name: "billing.module.ts", type: "file" },
        ]},
        { name: "common", type: "folder", color: "text-slate-400", children: [
            { name: "decorators/", type: "folder", children: [{ name: "roles.decorator.ts", type: "file" }, { name: "current-user.decorator.ts", type: "file" }] },
            { name: "filters/", type: "folder", children: [{ name: "global-exception.filter.ts", type: "file" }] },
            { name: "interceptors/", type: "folder", children: [{ name: "logging.interceptor.ts", type: "file" }, { name: "transform.interceptor.ts", type: "file" }] },
            { name: "middleware/", type: "folder", children: [{ name: "request-id.middleware.ts", type: "file" }, { name: "rate-limit.middleware.ts", type: "file" }] },
            { name: "utils/", type: "folder", children: [{ name: "pagination.util.ts", type: "file" }, { name: "csv-parser.util.ts", type: "file" }] },
        ]},
        { name: "jobs", type: "folder", color: "text-indigo-400", children: [
            { name: "email.processor.ts", type: "file" },
            { name: "sms.processor.ts", type: "file" },
            { name: "campaign.processor.ts", type: "file" },
            { name: "report.processor.ts", type: "file" },
            { name: "webhook.processor.ts", type: "file" },
        ]},
        { name: "app.module.ts", type: "file" },
        { name: "main.ts", type: "file" },
    ]},
];

// ── Services Data ─────────────────────────────────────────────────────────
const services: ServiceDef[] = [
    { name: "Authentication",  color: "violet",  icon: Shield,       responsibility: "JWT issuance, refresh tokens, email verification, password reset.", deps: ["Users", "Redis"] },
    { name: "Business",        color: "emerald", icon: Layers,       responsibility: "Business CRUD, Google review link management, location settings.",  deps: ["Organizations", "Users"] },
    { name: "Customer",        color: "cyan",    icon: FileText,     responsibility: "Customer CRUD, CSV bulk import, segmentation, communication tags.",   deps: ["Businesses"] },
    { name: "Campaign",        color: "orange",  icon: Play,         responsibility: "Campaign creation, scheduling, triggering BullMQ job queues.",        deps: ["Customers", "BullMQ"] },
    { name: "Review",          color: "yellow",  icon: BarChart2,    responsibility: "Review ingestion from platforms, sync, rating aggregation.",           deps: ["Businesses", "Google API"] },
    { name: "Reporting",       color: "pink",    icon: BarChart,     responsibility: "Aggregation queries, chart data, PDF/CSV export generation.",          deps: ["Reviews", "Campaigns"] },
    { name: "Billing",         color: "rose",    icon: GitBranch,    responsibility: "Stripe subscription management, webhook handling, invoice sync.",      deps: ["Organizations", "Stripe"] },
    { name: "Notification",    color: "indigo",  icon: Mail,         responsibility: "Email/SMS dispatch, delivery tracking, retry logic.",                  deps: ["Resend", "Twilio"] },
];

const svcColor: Record<string, string> = {
    violet:  "border-violet-500/30 bg-violet-500/10 text-violet-400",
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    cyan:    "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
    orange:  "border-orange-500/30 bg-orange-500/10 text-orange-400",
    yellow:  "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
    pink:    "border-pink-500/30 bg-pink-500/10 text-pink-400",
    rose:    "border-rose-500/30 bg-rose-500/10 text-rose-400",
    indigo:  "border-indigo-500/30 bg-indigo-500/10 text-indigo-400",
};

// ── Queue Initial State ────────────────────────────────────────────────────
const makeJobs = (prefix: string, count: number): Job[] =>
    Array.from({ length: count }, (_, i) => ({
        id: `${prefix}-${(1000 + i).toString()}`,
        name: `job_${Math.random().toString(36).slice(2, 7)}`,
        status: (["queued", "processing", "done", "failed"] as Job["status"][])[Math.floor(Math.random() * 4)],
        retries: Math.floor(Math.random() * 3),
        ts: new Date(Date.now() - Math.random() * 600000).toLocaleTimeString(),
    }));

const initialQueues: QueueDef[] = [
    { name: "email-queue",    icon: Mail,           color: "violet",  processor: "email.processor.ts → Resend SDK",     jobs: makeJobs("em", 6) },
    { name: "sms-queue",      icon: MessageSquare,  color: "cyan",    processor: "sms.processor.ts → Twilio SDK",       jobs: makeJobs("sm", 5) },
    { name: "campaign-queue", icon: Play,           color: "orange",  processor: "campaign.processor.ts",               jobs: makeJobs("cp", 4) },
    { name: "report-queue",   icon: BarChart,       color: "pink",    processor: "report.processor.ts",                 jobs: makeJobs("rp", 3) },
    { name: "webhook-queue",  icon: Webhook,        color: "rose",    processor: "webhook.processor.ts → Stripe/Google",jobs: makeJobs("wh", 4) },
];

// ── Log Sample Data ────────────────────────────────────────────────────────
const logSamples: LogEntry[] = [
    { type: "API Request", color: "cyan",    fields: { method: "POST", path: "/campaigns", status: "201", duration_ms: "124", traceId: "req_a1b2c3" } },
    { type: "Auth",        color: "violet",  fields: { user_id: "usr_...", event: "login_success", ip: "203.0.113.45", timestamp: "03:12:44Z" } },
    { type: "Billing",     color: "rose",    fields: { org_id: "org_...", event: "subscription.created", amount: "$79.00", stripe_event_id: "evt_..." } },
    { type: "User Activity",color: "emerald",fields: { user_id: "usr_...", action: "campaign.launched", resource: "campaign_id=...", timestamp: "03:14:01Z" } },
    { type: "System Error", color: "red",    fields: { error: "Twilio rate limit exceeded", severity: "ERROR", traceId: "req_z9y8x7", stack: "sms.processor.ts:42" } },
];

const statusStyle: Record<Job["status"], string> = {
    queued:     "bg-slate-700 text-slate-300",
    processing: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    done:       "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    failed:     "bg-rose-500/20 text-rose-400 border border-rose-500/30",
};

// ── Tree Node Component ────────────────────────────────────────────────────
function TreeNode({ node, depth = 0 }: { node: FolderNode; depth?: number }) {
    const [open, setOpen] = useState(depth < 2);
    const isFolder = node.type === "folder";
    const color = node.color ?? "text-slate-400";

    return (
        <div style={{ paddingLeft: depth * 14 }}>
            <div
                className={`flex items-center gap-1.5 py-0.5 cursor-pointer hover:text-white transition-colors text-[11px] ${color}`}
                onClick={() => isFolder && setOpen(o => !o)}
            >
                {isFolder ? (
                    <>
                        {open ? <ChevronDown className="w-3 h-3 shrink-0" /> : <ChevronRight className="w-3 h-3 shrink-0" />}
                        {open ? <FolderOpen className="w-3.5 h-3.5 shrink-0" /> : <Folder className="w-3.5 h-3.5 shrink-0" />}
                    </>
                ) : (
                    <span className="w-3 h-3 shrink-0 inline-block" />
                )}
                <span className={`font-mono ${isFolder ? "font-bold" : "font-normal text-slate-400"}`}>{node.name}</span>
            </div>
            {isFolder && open && node.children?.map((child, i) => (
                <TreeNode key={i} node={child} depth={depth + 1} />
            ))}
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function SuperAdminBackendPage() {
    const [activeTab, setActiveTab] = useState<"folders" | "services" | "queues" | "logging" | "deliverables">("folders");
    const [queues, setQueues] = useState<QueueDef[]>(initialQueues);
    const [processing, setProcessing] = useState(false);
    const [deliverables, setDeliverables] = useState([
        { id: "d1", label: "Folder structure approved",          checked: true  },
        { id: "d2", label: "Service architecture documented",    checked: true  },
        { id: "d3", label: "Queue architecture documented",      checked: true  },
        { id: "d4", label: "Logging strategy approved",          checked: true  },
        { id: "d5", label: "Backend ready for implementation",   checked: false },
    ]);

    const doneDels = deliverables.filter(d => d.checked).length;

    const processAll = useCallback(() => {
        setProcessing(true);
        setQueues(prev => prev.map(q => ({
            ...q,
            jobs: q.jobs.map(j => j.status === "queued" || j.status === "processing" ? { ...j, status: "done" as const } : j),
        })));
        setTimeout(() => setProcessing(false), 1200);
    }, []);

    const resetQueues = useCallback(() => {
        setQueues(initialQueues.map(q => ({ ...q, jobs: makeJobs(q.name.slice(0, 2), q.jobs.length) })));
    }, []);

    const tabs = [
        { id: "folders",      label: "Folder Tree",       icon: Folder },
        { id: "services",     label: "Service Map",        icon: GitBranch },
        { id: "queues",       label: "Queue Monitor",      icon: Zap },
        { id: "logging",      label: "Logging & Perf",     icon: Terminal },
        { id: "deliverables", label: "Part 4 Gates",        icon: CheckCircle2 },
    ] as const;

    const totalJobs = queues.reduce((s, q) => s + q.jobs.length, 0);
    const doneJobs  = queues.reduce((s, q) => s + q.jobs.filter(j => j.status === "done").length, 0);
    const failedJobs = queues.reduce((s, q) => s + q.jobs.filter(j => j.status === "failed").length, 0);

    return (
        <div className="h-screen overflow-y-auto p-8 font-sans">

            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Cpu className="w-6 h-6 text-red-500" />
                        Backend Architecture Console
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Explore the NestJS module tree, service map, queue monitor, logging standards, and Part 4 delivery gates.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl text-xs font-semibold">
                        10 Modules · 8 Services
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-xs font-semibold border ${failedJobs > 0 ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
                        {doneJobs}/{totalJobs} Jobs Done {failedJobs > 0 && `· ${failedJobs} Failed`}
                    </div>
                </div>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 p-1 bg-slate-950 border border-white/5 rounded-2xl mb-8 overflow-x-auto">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "text-slate-400 hover:text-white"}`}>
                            <Icon className="w-3.5 h-3.5" /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ── Folder Tree ── */}
            {activeTab === "folders" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-border/60">
                        <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                            <Folder className="w-4.5 h-4.5 text-orange-400" /> NestJS Project Structure
                        </h3>
                        <p className="text-xs text-slate-400 mb-5">Click folder nodes to expand/collapse. Each module follows controller → service → repository → dto convention.</p>
                        <div className="bg-slate-950 border border-white/5 rounded-xl p-4 max-h-[520px] overflow-y-auto">
                            {srcTree.map((node, i) => <TreeNode key={i} node={node} depth={0} />)}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="glass-card rounded-2xl p-5 border border-border/60">
                            <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2"><Layers className="w-3.5 h-3.5 text-cyan-400" /> Repository Pattern</h4>
                            <div className="space-y-2">
                                {[
                                    { layer: "Controller", rule: "Route handling only. No business logic.", color: "text-violet-400" },
                                    { layer: "Service",    rule: "Orchestration & workflow. No SQL.",       color: "text-emerald-400" },
                                    { layer: "Repository", rule: "All DB queries via ORM only here.",       color: "text-cyan-400" },
                                    { layer: "DTO",        rule: "Input validation schemas per endpoint.",  color: "text-orange-400" },
                                    { layer: "Guard",      rule: "JWT + RBAC enforcement at route level.",  color: "text-rose-400" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-2 p-2.5 bg-slate-950/60 rounded-xl border border-white/5 text-[10px]">
                                        <span className={`font-bold shrink-0 w-20 ${item.color}`}>{item.layer}</span>
                                        <span className="text-slate-400">{item.rule}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="glass-card rounded-2xl p-5 border border-border/60">
                            <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2"><Terminal className="w-3.5 h-3.5 text-yellow-400" /> Tech Stack</h4>
                            <div className="space-y-1.5 text-[10px] text-slate-400">
                                {[["Runtime","Node.js 20 LTS"],["Framework","NestJS"],["Database","PostgreSQL 15"],["Cache/Queue","Redis 7 + BullMQ"],["Payments","Stripe SDK"],["SMS","Twilio SDK"],["Email","Resend SDK"],["ORM","Drizzle / Prisma"],["Docs","Swagger/OpenAPI"]].map(([k, v], i) => (
                                    <div key={i} className="flex justify-between border-b border-white/5 pb-1">
                                        <span className="text-slate-500">{k}</span>
                                        <span className="text-slate-200 font-mono font-bold">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Service Map ── */}
            {activeTab === "services" && (
                <div className="space-y-6">
                    {/* Layer diagram */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <GitBranch className="w-4.5 h-4.5 text-cyan-400" /> Service Layer Architecture
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold justify-center">
                            {[
                                { label: "HTTP Request", color: "bg-slate-800 text-slate-300" },
                                { label: "Controller", color: "bg-violet-500/20 text-violet-400" },
                                { label: "Service", color: "bg-emerald-500/20 text-emerald-400" },
                                { label: "Repository", color: "bg-cyan-500/20 text-cyan-400" },
                                { label: "PostgreSQL", color: "bg-blue-500/20 text-blue-400" },
                            ].map((step, i, arr) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className={`px-3 py-2 rounded-xl ${step.color}`}>{step.label}</span>
                                    {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600" />}
                                </div>
                            ))}
                            <div className="flex items-center gap-2 ml-4">
                                <span className="text-slate-600 text-[9px]">↓ async</span>
                                <span className="px-3 py-2 rounded-xl bg-orange-500/20 text-orange-400 font-mono font-bold text-[10px]">BullMQ Jobs</span>
                                <ArrowRight className="w-4 h-4 text-slate-600" />
                                <span className="px-3 py-2 rounded-xl bg-indigo-500/20 text-indigo-400 font-mono font-bold text-[10px]">Notification Service</span>
                            </div>
                        </div>
                    </div>

                    {/* Service cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        {services.map((svc, i) => {
                            const Icon = svc.icon;
                            const colors = svcColor[svc.color] || svcColor.indigo;
                            return (
                                <div key={i} className={`glass-card rounded-2xl p-5 border ${colors}`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Icon className="w-4.5 h-4.5" />
                                        <span className="text-sm font-bold text-white">{svc.name} Service</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 leading-relaxed mb-3">{svc.responsibility}</p>
                                    <div className="border-t border-white/5 pt-3">
                                        <div className="text-[8px] text-slate-600 uppercase tracking-widest mb-1.5">Dependencies</div>
                                        <div className="flex flex-wrap gap-1">
                                            {svc.deps.map((dep, di) => (
                                                <span key={di} className="text-[9px] px-1.5 py-0.5 rounded bg-black/30 text-slate-300 font-mono">{dep}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Queue Monitor ── */}
            {activeTab === "queues" && (
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-400">5 BullMQ queues backed by Redis. Click <strong className="text-white">Process All</strong> to drain queued jobs.</div>
                        <div className="flex gap-2">
                            <button onClick={resetQueues} className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-slate-300 hover:text-white transition-colors cursor-pointer">
                                <RefreshCw className="w-3.5 h-3.5" /> Reset
                            </button>
                            <button onClick={processAll} disabled={processing}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${processing ? "bg-amber-600 text-white" : "bg-red-600 hover:bg-red-500 text-white"}`}>
                                {processing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                                {processing ? "Processing..." : "Process All"}
                            </button>
                        </div>
                    </div>

                    {queues.map((queue, qi) => {
                        const Icon = queue.icon;
                        const colors = svcColor[queue.color] || svcColor.indigo;
                        const qDone = queue.jobs.filter(j => j.status === "done").length;
                        const qFail = queue.jobs.filter(j => j.status === "failed").length;
                        return (
                            <div key={qi} className={`glass-card rounded-2xl p-5 border ${colors}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-4 h-4" />
                                        <span className="font-mono font-bold text-sm text-white">{queue.name}</span>
                                        <span className="text-[9px] text-slate-500 font-mono">{queue.processor}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                        <span className="text-emerald-400 font-bold">{qDone} done</span>
                                        {qFail > 0 && <span className="text-rose-400 font-bold">{qFail} failed</span>}
                                        <span className="text-slate-500">{queue.jobs.length} total</span>
                                    </div>
                                </div>
                                <div className="flex gap-1.5 flex-wrap">
                                    {queue.jobs.map((job, ji) => (
                                        <div key={ji} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-mono ${statusStyle[job.status]}`}>
                                            {job.status === "done"   && <Check className="w-3 h-3" />}
                                            {job.status === "failed" && <X className="w-3 h-3" />}
                                            {job.status === "processing" && <RefreshCw className="w-3 h-3 animate-spin" />}
                                            {job.status === "queued" && <Clock className="w-3 h-3" />}
                                            <span>{job.id}</span>
                                            {job.retries > 0 && <span className="text-amber-400">↻{job.retries}</span>}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 h-1 bg-slate-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                                        style={{ width: `${(qDone / queue.jobs.length) * 100}%` }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Logging & Performance ── */}
            {activeTab === "logging" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Log viewer */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60">
                        <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                            <Terminal className="w-4.5 h-4.5 text-cyan-400" /> Structured Log Stream
                        </h3>
                        <p className="text-xs text-slate-400 mb-5">JSON log entries — all 5 categories captured to stdout for aggregation.</p>
                        <div className="bg-slate-950 rounded-xl border border-white/5 p-4 space-y-3 max-h-[420px] overflow-y-auto font-mono text-[10px]">
                            {logSamples.map((entry, i) => (
                                <div key={i} className="border-b border-white/5 pb-3">
                                    <div className={`text-[8px] uppercase tracking-widest font-bold mb-1.5 ${
                                        entry.color === "cyan"    ? "text-cyan-400"    :
                                        entry.color === "violet"  ? "text-violet-400"  :
                                        entry.color === "rose"    ? "text-rose-400"    :
                                        entry.color === "emerald" ? "text-emerald-400" : "text-red-400"
                                    }`}>▸ {entry.type}</div>
                                    <pre className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                        {JSON.stringify(entry.fields, null, 2)}
                                    </pre>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Performance standards + log retention */}
                    <div className="space-y-5">
                        <div className="glass-card rounded-2xl p-5 border border-border/60">
                            <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2"><BarChart2 className="w-3.5 h-3.5 text-orange-400" /> Performance Standards</h4>
                            <div className="space-y-3">
                                {[
                                    { label: "API Response Time", target: "< 500ms p95", impl: "Redis cache on high-frequency reads", ok: true },
                                    { label: "DB Query Time",     target: "< 100ms p95", impl: "FK indexes + composite indexes",      ok: true },
                                    { label: "Redis Cache TTL",   target: "5–60 minutes",impl: "Business profiles, aggregations",      ok: true },
                                    { label: "Pagination",        target: "All list endpoints", impl: "Default 25, max 100 per page", ok: true },
                                    { label: "N+1 Queries",       target: "Zero",         impl: "ORM include / explicit JOINs",        ok: true },
                                ].map((s, i) => (
                                    <div key={i} className="flex items-start justify-between gap-3 p-3 bg-slate-950/60 border border-white/5 rounded-xl text-[10px]">
                                        <div>
                                            <div className="font-bold text-slate-200 mb-0.5">{s.label}</div>
                                            <div className="text-slate-500">{s.impl}</div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            <span className="text-orange-400 font-bold">{s.target}</span>
                                            {s.ok && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-5 border border-border/60">
                            <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-violet-400" /> Log Retention Policy</h4>
                            <table className="w-full text-[10px]">
                                <thead>
                                    <tr className="text-[8px] text-slate-600 uppercase tracking-widest border-b border-white/5">
                                        <th className="text-left pb-2">Log Type</th>
                                        <th className="text-center pb-2">Retention</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        ["User Activity",  "90 days"],
                                        ["API Request",    "30 days"],
                                        ["Billing",        "12 months"],
                                        ["Authentication", "90 days"],
                                        ["System Error",   "12 months"],
                                    ].map(([type, ret], i) => (
                                        <tr key={i}>
                                            <td className="py-2 text-slate-300 font-medium">{type}</td>
                                            <td className="py-2 text-center text-emerald-400 font-bold">{ret}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Part 4 Deliverables ── */}
            {activeTab === "deliverables" && (
                <div className="max-w-2xl mx-auto">
                    <div className="glass-card rounded-2xl p-8 border border-border/60">
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" /> Part 4 Deliverables
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-8">
                            Toggle gates to mark backend architecture milestones as approved.
                        </p>

                        <div className="space-y-3 mb-8">
                            {deliverables.map(d => (
                                <button key={d.id} onClick={() => setDeliverables(prev => prev.map(del => del.id === d.id ? { ...del, checked: !del.checked } : del))}
                                    className={`w-full p-4 rounded-xl border text-left text-xs flex items-center justify-between gap-3 cursor-pointer transition-all ${d.checked ? "bg-emerald-500/10 border-emerald-500/30 text-white" : "bg-slate-900 border-white/5 text-slate-500 hover:border-white/10"}`}>
                                    <span className="font-semibold">{d.label}</span>
                                    <div className={`w-5 h-5 rounded border shrink-0 flex items-center justify-center ${d.checked ? "bg-emerald-500 border-emerald-500" : "bg-slate-950 border-slate-700"}`}>
                                        {d.checked && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Part 4 Completion</span>
                                <span className="text-emerald-400 font-bold">{doneDels}/5</span>
                            </div>
                            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                                    style={{ width: `${(doneDels / deliverables.length) * 100}%` }} />
                            </div>
                            {doneDels === deliverables.length && (
                                <div className="pt-3 flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                    <CheckCircle2 className="w-4 h-4" /> Part 4 Complete — Backend Ready for Implementation!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
