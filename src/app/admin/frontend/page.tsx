"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Monitor, FolderOpen, Folder, ChevronDown, ChevronRight,
    Layers, Check, CheckCircle2, AlertTriangle, Clock,
    RefreshCw, Terminal, BarChart2, Shield, ArrowRight,
    Play, X, Info, Sparkles, User, Lock, Eye, EyeOff,
    Building, Server, Settings, ShieldAlert, HelpCircle,
    Layout, Bell, FileText, CheckCircle
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface FolderNode {
    name: string;
    type: "folder" | "file";
    children?: FolderNode[];
    color?: string;
}

interface ComponentDef {
    name: string;
    description: string;
    type: string;
}

interface ClientContext {
    id: string;
    name: string;
    orgId: string;
    activeCampaigns: number;
    totalCustomers: number;
    rating: string;
}

interface ToastMessage {
    id: string;
    type: "success" | "warning" | "error" | "info";
    text: string;
}

// ── Folder Tree Data ───────────────────────────────────────────────────────
const appTree: FolderNode[] = [
    { name: "src", type: "folder", color: "text-slate-300", children: [
        { name: "app", type: "folder", color: "text-red-400", children: [
            { name: "admin", type: "folder", color: "text-rose-400", children: [
                { name: "layout.tsx", type: "file" },
                { name: "page.tsx", type: "file" },
                { name: "frontend/", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ]},
            { name: "dashboard", type: "folder", color: "text-orange-400", children: [
                { name: "layout.tsx", type: "file" },
                { name: "page.tsx", type: "file" },
                { name: "businesses/", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
                { name: "campaigns/", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
                { name: "customers/", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
                { name: "reviews/", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
                { name: "billing/", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
                { name: "settings/", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ]},
            { name: "login", type: "folder", color: "text-yellow-400", children: [
                { name: "page.tsx", type: "file" },
            ]},
            { name: "globals.css", type: "file" },
            { name: "layout.tsx", type: "file" },
        ]},
        { name: "components", type: "folder", color: "text-emerald-400", children: [
            { name: "ui", type: "folder", children: [
                { name: "button.tsx", type: "file" },
                { name: "card.tsx", type: "file" },
                { name: "table.tsx", type: "file" },
                { name: "modal.tsx", type: "file" },
                { name: "toast.tsx", type: "file" },
            ]},
            { name: "charts", type: "folder", children: [
                { name: "rating-trends.tsx", type: "file" },
                { name: "campaign-performance.tsx", type: "file" },
            ]},
        ]},
        { name: "layouts", type: "folder", color: "text-cyan-400", children: [
            { name: "sidebar.tsx", type: "file" },
            { name: "navbar.tsx", type: "file" },
        ]},
        { name: "hooks", type: "folder", color: "text-sky-400", children: [
            { name: "useAuth.ts", type: "file" },
            { name: "useBusiness.ts", type: "file" },
            { name: "useCampaigns.ts", type: "file" },
        ]},
        { name: "services", type: "folder", color: "text-indigo-400", children: [
            { name: "api.ts", type: "file" },
            { name: "auth.service.ts", type: "file" },
            { name: "campaign.service.ts", type: "file" },
        ]},
        { name: "store", type: "folder", color: "text-violet-400", children: [
            { name: "authStore.ts", type: "file" },
            { name: "businessStore.ts", type: "file" },
        ]},
        { name: "types", type: "folder", color: "text-fuchsia-400", children: [
            { name: "index.ts", type: "file" },
        ]},
        { name: "utils", type: "folder", color: "text-pink-400", children: [
            { name: "format.ts", type: "file" },
        ]},
    ]},
];

// ── Component Specs ────────────────────────────────────────────────────────
const compSpecs: ComponentDef[] = [
    { name: "Buttons", description: "Glassmorphism styling matching the dashboard aesthetic.", type: "Interactive" },
    { name: "Cards", description: "Subtle borders, backdrop filter blurs, and hover scale micro-animations.", type: "Visual Containers" },
    { name: "Tables", description: "Responsive lists, header sorting capabilities, and page navigations.", type: "Data Display" },
    { name: "Charts", description: "Themed Recharts configs using custom colors and hover tooltips.", type: "Visualization" },
    { name: "Forms", description: "React Hook Form integration coupled with inline Zod validations.", type: "User Input" },
    { name: "Modals", description: "Portal-based accessibility layouts featuring backdrop animated drops.", type: "Overlays" },
    { name: "Notifications", description: "Context-sensitive floating notifications with timed auto-clear.", type: "Feedback" },
    { name: "Navigation Components", description: "Unified path breadcrumbs, action pills, and status tags.", type: "Routing Guides" },
];

// ── Client Locations Contexts ──────────────────────────────────────────────
const clientLocations: ClientContext[] = [
    { id: "loc_acme_01", name: "Acme Corporate HQ", orgId: "org_acme_883", activeCampaigns: 4, totalCustomers: 1250, rating: "4.8" },
    { id: "loc_acme_02", name: "Acme Retail - Downtown", orgId: "org_acme_883", activeCampaigns: 2, totalCustomers: 620, rating: "4.5" },
    { id: "loc_pizza_01", name: "Pizza Palace - Westside", orgId: "org_pizza_911", activeCampaigns: 1, totalCustomers: 3400, rating: "4.9" },
    { id: "loc_pizza_02", name: "Pizza Palace - Uptown", orgId: "org_pizza_911", activeCampaigns: 3, totalCustomers: 2890, rating: "4.2" },
    { id: "loc_global_01", name: "Global Logistics Inc", orgId: "org_global_002", activeCampaigns: 0, totalCustomers: 120, rating: "4.0" },
];

// ── TreeNode Component ────────────────────────────────────────────────────
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

// ── Main Page Component ────────────────────────────────────────────────────
export default function SuperAdminFrontendPage() {
    const [activeTab, setActiveTab] = useState<"folders" | "components" | "navstate" | "securityperf" | "deliverables">("folders");

    // Component states
    const [clickCount, setClickCount] = useState(0);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [emailInput, setEmailInput] = useState("");
    const [emailError, setEmailError] = useState("");

    // Nav & State switcher
    const [activeLocation, setActiveLocation] = useState<ClientContext>(clientLocations[0]);

    // Security Simulator state
    const [simulatedRole, setSimulatedRole] = useState<"admin" | "owner" | "manager" | "agent">("owner");

    // Deliverables state
    const [deliverables, setDeliverables] = useState([
        { id: "fd1", label: "Frontend architecture approved", checked: true },
        { id: "fd2", label: "Page hierarchy documented", checked: true },
        { id: "fd3", label: "Component library defined", checked: true },
        { id: "fd4", label: "Navigation finalized", checked: true },
        { id: "fd5", label: "Development ready", checked: false },
    ]);

    // Toast generator
    const addToast = (type: ToastMessage["type"], text: string) => {
        const id = Math.random().toString(36).substring(7);
        setToasts(prev => [...prev, { id, type, text }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    // Email live validator
    useEffect(() => {
        if (!emailInput) {
            setEmailError("");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput)) {
            setEmailError("Please enter a valid email address.");
        } else {
            setEmailError("");
        }
    }, [emailInput]);

    const doneDels = deliverables.filter(d => d.checked).length;

    const tabs = [
        { id: "folders", label: "Folder Tree", icon: Folder },
        { id: "components", label: "Components Showcase", icon: Layers },
        { id: "navstate", label: "Navigation & State", icon: Layout },
        { id: "securityperf", label: "Security & Perf", icon: Shield },
        { id: "deliverables", label: "Part 5 Gates", icon: CheckCircle2 },
    ] as const;

    return (
        <div className="h-screen overflow-y-auto p-8 font-sans relative">
            {/* Custom toast overlay container */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto p-4 rounded-xl shadow-2xl flex items-center gap-3 border backdrop-blur-lg transform transition-all duration-300 animate-slide-up ${
                            toast.type === "success" ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" :
                            toast.type === "warning" ? "bg-amber-500/20 border-amber-500/30 text-amber-400" :
                            toast.type === "error" ? "bg-rose-500/20 border-rose-500/30 text-rose-400" :
                            "bg-blue-500/20 border-blue-500/30 text-blue-400"
                        }`}
                    >
                        {toast.type === "success" && <Check className="w-4 h-4 shrink-0" />}
                        {toast.type === "warning" && <AlertTriangle className="w-4 h-4 shrink-0" />}
                        {toast.type === "error" && <X className="w-4 h-4 shrink-0" />}
                        {toast.type === "info" && <Info className="w-4 h-4 shrink-0" />}
                        <span className="text-xs font-semibold">{toast.text}</span>
                        <button
                            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                            className="ml-auto text-white/40 hover:text-white transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Monitor className="w-6 h-6 text-red-500" />
                        Frontend Architecture Console
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Visualize folder layout structures, component libraries, state switchers, and Part 5 deliverables gate controls.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
                        Next.js Router · Tailwind CSS
                    </div>
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold">
                        Client Switcher Active
                    </div>
                </div>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 p-1 bg-slate-950 border border-white/5 rounded-2xl mb-8 overflow-x-auto">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === tab.id ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "text-slate-400 hover:text-white"
                            }`}
                        >
                            <Icon className="w-3.5 h-3.5" /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ── Folder Tree Tab ── */}
            {activeTab === "folders" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-border/60">
                        <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                            <Folder className="w-4.5 h-4.5 text-red-400" /> App Router Structure
                        </h3>
                        <p className="text-xs text-slate-400 mb-5">
                            Expand and collapse the tree layout structure. All routes are client-controlled wrappers targeting API services.
                        </p>
                        <div className="bg-slate-950 border border-white/5 rounded-xl p-4 max-h-[520px] overflow-y-auto">
                            {appTree.map((node, i) => <TreeNode key={i} node={node} depth={0} />)}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="glass-card rounded-2xl p-5 border border-border/60">
                            <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                                <Layout className="w-3.5 h-3.5 text-cyan-400" /> App Router Conventions
                            </h4>
                            <div className="space-y-2">
                                {[
                                    { segment: "page.tsx", rule: "Renders route layout view. Client component.", color: "text-red-400" },
                                    { segment: "layout.tsx", rule: "Common persistent wrapper (e.g. Sidebars, Contexts).", color: "text-rose-400" },
                                    { segment: "loading.tsx", rule: "Automatic fallback skeleton loading page state.", color: "text-amber-400" },
                                    { segment: "/components", rule: "Reusable atomic UI component files.", color: "text-emerald-400" },
                                    { segment: "/hooks", rule: "Encapsulated state logic handlers.", color: "text-sky-400" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-2 p-2.5 bg-slate-950/60 rounded-xl border border-white/5 text-[10px]">
                                        <span className={`font-mono font-bold shrink-0 w-24 ${item.color}`}>{item.segment}</span>
                                        <span className="text-slate-400">{item.rule}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-5 border border-border/60">
                            <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                                <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Technology Settings
                            </h4>
                            <div className="space-y-1.5 text-[10px] text-slate-400">
                                {[
                                    ["Bundler", "Next.js 14 App Router"],
                                    ["Styles", "Tailwind CSS v3"],
                                    ["Typography", "Inter / Outfit"],
                                    ["Icons", "Lucide React"],
                                    ["Query Manager", "React Query (TanStack)"],
                                    ["API Client", "Axios Interceptor"],
                                    ["Charts", "Recharts Wrapper"],
                                    ["Form State", "React Hook Form + Zod"],
                                ].map(([k, v], i) => (
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

            {/* ── Components Showcase Tab ── */}
            {activeTab === "components" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Interactive Buttons & Inputs */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-yellow-400" /> Interactive UI elements
                                </h3>
                                <p className="text-xs text-slate-400">Preview UI style guides and handle click/validation triggers.</p>
                            </div>

                            {/* Buttons subsection */}
                            <div className="space-y-2.5">
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Button Library</div>
                                <div className="flex flex-wrap gap-2.5">
                                    <button
                                        onClick={() => {
                                            setClickCount(c => c + 1);
                                            addToast("success", "Primary Action Triggered!");
                                        }}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                                    >
                                        Primary Action
                                    </button>
                                    <button
                                        onClick={() => {
                                            setClickCount(c => c + 1);
                                            addToast("info", "Secondary Action Triggered!");
                                        }}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all active:scale-95 border border-white/5"
                                    >
                                        Secondary
                                    </button>
                                    <button
                                        onClick={() => {
                                            setClickCount(c => c + 1);
                                            addToast("warning", "Glass Action Triggered!");
                                        }}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold backdrop-blur-md border border-white/10 transition-all active:scale-95"
                                    >
                                        Glass Card Button
                                    </button>
                                    <button
                                        onClick={() => {
                                            setClickCount(c => c + 1);
                                            addToast("error", "Ghost Action Triggered!");
                                        }}
                                        className="px-4 py-2 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-all active:scale-95"
                                    >
                                        Ghost Style
                                    </button>
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                    Action counters: <span className="text-red-400 font-bold">{clickCount} clicks logged</span>
                                </div>
                            </div>

                            {/* Toast Triggers */}
                            <div className="space-y-2.5 border-t border-white/5 pt-4">
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Toast Alert System</div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => addToast("success", "Review successfully ingested.")}
                                        className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold"
                                    >
                                        Trigger Success
                                    </button>
                                    <button
                                        onClick={() => addToast("warning", "Twilio rate limit near capacity.")}
                                        className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-xs font-semibold"
                                    >
                                        Trigger Warning
                                    </button>
                                    <button
                                        onClick={() => addToast("error", "Failed to compile reporting data.")}
                                        className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-semibold"
                                    >
                                        Trigger Error
                                    </button>
                                    <button
                                        onClick={() => addToast("info", "Token automatically refreshed.")}
                                        className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-semibold"
                                    >
                                        Trigger Info
                                    </button>
                                </div>
                            </div>

                            {/* Inputs validations */}
                            <div className="space-y-2.5 border-t border-white/5 pt-4">
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Form Validation Sandbox (Real-time checking)</div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400 font-medium">Customer Email Addr</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={emailInput}
                                            onChange={e => setEmailInput(e.target.value)}
                                            placeholder="enter email to validate..."
                                            className={`w-full px-3 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 ${
                                                emailError ? "border-rose-500/50 focus:ring-rose-500" :
                                                emailInput && !emailError ? "border-emerald-500/50 focus:ring-emerald-500" :
                                                "border-white/10 focus:ring-red-500"
                                            }`}
                                        />
                                    </div>
                                    {emailError ? (
                                        <p className="text-[9px] text-rose-400 flex items-center gap-1 mt-1 font-semibold">
                                            <AlertTriangle className="w-3 h-3" /> {emailError}
                                        </p>
                                    ) : emailInput ? (
                                        <p className="text-[9px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
                                            <Check className="w-3 h-3" /> Email conforms to standard criteria
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {/* Visual Containers (Cards, Breadcrumbs, Charts) */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-cyan-400" /> Visual Containers & Charts
                                </h3>
                                <p className="text-xs text-slate-400">Verify layout panels, route breadcrumbs, and SVG visualizations.</p>
                            </div>

                            {/* Breadcrumbs */}
                            <div className="space-y-2">
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Dynamic Breadcrumb Component</div>
                                <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-white/5 font-mono">
                                    <span className="hover:text-white cursor-pointer transition-colors">Campaigns</span>
                                    <ChevronRight className="w-3 h-3 text-slate-600" />
                                    <span className="hover:text-white cursor-pointer transition-colors">Westside Pizza Promos</span>
                                    <ChevronRight className="w-3 h-3 text-slate-600" />
                                    <span className="text-red-400 font-semibold">Execution logs</span>
                                </div>
                            </div>

                            {/* CSS-Based Chart Preview Component */}
                            <div className="space-y-2">
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">CSS Performance Chart Wrapper</div>
                                <div className="bg-slate-950 rounded-xl p-4 border border-white/5 space-y-3">
                                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                                        <span className="font-bold text-white">Monthly Review Volume</span>
                                        <span className="text-emerald-400 font-bold">+28% growth</span>
                                    </div>
                                    <div className="flex items-end justify-between h-20 pt-4 px-2">
                                        {[
                                            { month: "Jan", val: "h-[30%]", num: 45 },
                                            { month: "Feb", val: "h-[45%]", num: 62 },
                                            { month: "Mar", val: "h-[40%]", num: 55 },
                                            { month: "Apr", val: "h-[70%]", num: 98 },
                                            { month: "May", val: "h-[90%]", num: 125 },
                                        ].map((bar, i) => (
                                            <div key={i} className="flex flex-col items-center gap-1.5 flex-1 group cursor-pointer">
                                                <div className="relative w-full flex items-end justify-center h-full">
                                                    {/* Tooltip on hover */}
                                                    <div className="absolute bottom-full mb-1 bg-red-600 text-white font-mono text-[8px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                        {bar.num} reqs
                                                    </div>
                                                    <div className={`w-4/5 rounded-t bg-gradient-to-t from-red-600 to-orange-500 ${bar.val} transition-all duration-300 group-hover:brightness-125`} />
                                                </div>
                                                <span className="text-[9px] text-slate-600 group-hover:text-slate-300 transition-colors font-mono">{bar.month}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Component definitions list */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60">
                        <h3 className="text-sm font-bold text-white mb-4">Standardized Frontend Component Inventory</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            {compSpecs.map((spec, i) => (
                                <div key={i} className="p-4 bg-slate-950 rounded-xl border border-white/5 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-1.5">
                                            <span className="text-xs font-bold text-slate-200">{spec.name}</span>
                                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-bold uppercase tracking-wider">{spec.type}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 leading-relaxed">{spec.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Navigation & State Tab ── */}
            {activeTab === "navstate" && (
                <div className="space-y-6">
                    {/* Business Context SWITCHER Simulator */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60">
                        <div className="mb-4">
                            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                <Building className="w-4.5 h-4.5 text-red-400" /> Multi-location Client Switcher Simulator
                            </h3>
                            <p className="text-xs text-slate-400">
                                SaaS layouts query the active business ID using context stores. Click on a business below to switch context.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Locations selector list */}
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Available Locations Contexts</div>
                                {clientLocations.map((loc, i) => (
                                    <button
                                        key={loc.id}
                                        onClick={() => {
                                            setActiveLocation(loc);
                                            addToast("info", `Switched Context: ${loc.name}`);
                                        }}
                                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex justify-between items-center cursor-pointer ${
                                            activeLocation.id === loc.id
                                                ? "bg-red-500/10 border-red-500/30 text-white"
                                                : "bg-slate-900 border-white/5 text-slate-400 hover:border-white/10 hover:text-white"
                                        }`}
                                    >
                                        <div>
                                            <div className="font-bold text-slate-200">{loc.name}</div>
                                            <div className="text-[9px] text-slate-500 font-mono mt-0.5">{loc.id}</div>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                                    </button>
                                ))}
                            </div>

                            {/* Active Context state variables displays */}
                            <div className="lg:col-span-2 p-5 bg-slate-950 rounded-xl border border-white/5 space-y-4">
                                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Global State Store Dump (Zustand Schema)</div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-slate-500 block uppercase">business_id</span>
                                        <span className="text-xs font-mono font-bold text-white bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-white/5 block truncate">{activeLocation.id}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-slate-500 block uppercase">organization_id</span>
                                        <span className="text-xs font-mono font-bold text-white bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-white/5 block truncate">{activeLocation.orgId}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-slate-500 block uppercase">Active Campaigns</span>
                                        <span className="text-xs font-mono font-bold text-red-400 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-white/5 block">{activeLocation.activeCampaigns} campaigns</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-slate-500 block uppercase">Rating Cache</span>
                                        <span className="text-xs font-mono font-bold text-yellow-400 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-white/5 block font-bold">★ {activeLocation.rating} Avg</span>
                                    </div>
                                </div>
                                <div className="border-t border-white/5 pt-4 text-[10px] text-slate-400 space-y-1.5">
                                    <div className="flex justify-between">
                                        <span>Subscribed organization name:</span>
                                        <strong className="text-white">
                                            {activeLocation.name.split(" - ")[0]}
                                        </strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>CRM Customers linked:</span>
                                        <strong className="text-white">{activeLocation.totalCustomers} customers</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Layout Navigation Blueprint card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-card rounded-2xl p-5 border border-border/60">
                            <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                                <Layout className="w-3.5 h-3.5 text-cyan-400" /> Page Navigation Blueprints
                            </h4>
                            <div className="space-y-2">
                                {[
                                    { name: "Left Sidebar Nav", target: "Main page routes router navigation controls.", rules: "Role-based visibility, active route styling highlighted." },
                                    { name: "Top Navigation Bar", target: "Context selector dropdown, user profiles, alert drawer.", rules: "Location switching scope, current user state trigger." },
                                    { name: "Breadcrumb Component", target: "Traces hierarchy paths dynamically.", rules: "Parses Next.js pathnames segments automatically." },
                                    { name: "Responsive Hamburger", target: "Slide-out drawer mobile overlay navigation.", rules: "Optimized touch targets size (minimum 44px height/width)." },
                                ].map((n, i) => (
                                    <div key={i} className="p-3 bg-slate-950/60 border border-white/5 rounded-xl text-[10px]">
                                        <div className="font-bold text-slate-200">{n.name}</div>
                                        <div className="text-slate-400 mt-0.5">{n.target}</div>
                                        <div className="text-slate-600 mt-1 text-[9px] font-mono">{n.rules}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-5 border border-border/60">
                            <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                                <Server className="w-3.5 h-3.5 text-violet-400" /> State Management Domains
                            </h4>
                            <div className="space-y-2.5">
                                {[
                                    { domain: "Auth State", store: "AuthContext / JWT Cache", desc: "Maintains current user session token and user profile." },
                                    { domain: "Business Context", store: "Zustand (activeLocationStore)", desc: "Scopes customer lists, rating feeds, and reviews queries." },
                                    { domain: "Campaign Data", store: "React Hook Form + React Query", desc: "Manages invite configurations drafts and launch events." },
                                    { domain: "Report Filters", store: "Url SearchParams Context", desc: "Coordinates graph widgets date parameters and metrics switches." },
                                    { domain: "Billing Context", store: "React Query Stripe Cache", desc: "Limits location capacities based on subscription tier." },
                                ].map((d, i) => (
                                    <div key={i} className="flex justify-between items-start gap-4 border-b border-white/5 pb-2">
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-200 block">{d.domain}</span>
                                            <span className="text-[9px] text-slate-500 block">{d.desc}</span>
                                        </div>
                                        <span className="text-[9px] font-mono bg-violet-500/10 border border-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded shrink-0">{d.store}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Security & Performance Tab ── */}
            {activeTab === "securityperf" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* RBAC SIMULATOR */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-5">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                    <ShieldAlert className="w-4.5 h-4.5 text-red-500" /> Role-Based Rendering (RBAC) Simulator
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Toggle the user role to simulate dynamic layout rendering controls.
                                </p>
                            </div>

                            {/* Selector buttons */}
                            <div className="flex gap-2">
                                {(["admin", "owner", "manager", "agent"] as const).map(role => (
                                    <button
                                        key={role}
                                        onClick={() => {
                                            setSimulatedRole(role);
                                            addToast("info", `Role simulated: ${role.toUpperCase()}`);
                                        }}
                                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer border ${
                                            simulatedRole === role
                                                ? "bg-red-600 text-white border-red-500 shadow-md"
                                                : "bg-slate-900 border-white/5 text-slate-400 hover:text-white"
                                        }`}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>

                            {/* Live Layout Simulator box */}
                            <div className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-4">
                                <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider pb-2 border-b border-white/5">
                                    <span>Simulated Sidebar View</span>
                                    <span className="text-red-400 font-mono text-[9px]">Logged as: {simulatedRole.toUpperCase()}</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-semibold p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                                        <Check className="w-3.5 h-3.5" /> Dashboard Overview (Accessible to all roles)
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-semibold p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                                        <Check className="w-3.5 h-3.5" /> Reviews & Feedback (Accessible to all roles)
                                    </div>

                                    {/* Campaign management: Manager, Owner, Admin */}
                                    {["admin", "owner", "manager"].includes(simulatedRole) ? (
                                        <div className="flex items-center justify-between text-[10px] text-emerald-400 font-semibold p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10 animate-fade-in">
                                            <span className="flex items-center gap-2">
                                                <Check className="w-3.5 h-3.5" /> Campaign Creator
                                            </span>
                                            <span className="text-[8px] bg-slate-900 text-slate-500 px-1 py-0.2 rounded font-mono">Owner / Manager / Admin</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between text-[10px] text-slate-600 font-medium p-2 bg-slate-900/30 rounded-lg border border-white/5 opacity-50 animate-fade-out">
                                            <span className="flex items-center gap-2">
                                                <Lock className="w-3.5 h-3.5" /> Campaign Creator (Restricted)
                                            </span>
                                            <span className="text-[8px] bg-rose-500/10 border border-rose-500/20 text-rose-400 px-1 py-0.2 rounded font-mono">Requires Manager+</span>
                                        </div>
                                    )}

                                    {/* Billing & settings: Owner, Admin */}
                                    {["admin", "owner"].includes(simulatedRole) ? (
                                        <div className="flex items-center justify-between text-[10px] text-emerald-400 font-semibold p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                                            <span className="flex items-center gap-2">
                                                <Check className="w-3.5 h-3.5" /> Stripe Subscriptions
                                            </span>
                                            <span className="text-[8px] bg-slate-900 text-slate-500 px-1 py-0.2 rounded font-mono">Owner / Admin Only</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between text-[10px] text-slate-600 font-medium p-2 bg-slate-900/30 rounded-lg border border-white/5 opacity-50">
                                            <span className="flex items-center gap-2">
                                                <Lock className="w-3.5 h-3.5" /> Stripe Subscriptions (Restricted)
                                            </span>
                                            <span className="text-[8px] bg-rose-500/10 border border-rose-500/20 text-rose-400 px-1 py-0.2 rounded font-mono">Requires Owner+</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Performance Budget checklist */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-5">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                    <BarChart2 className="w-4.5 h-4.5 text-cyan-400" /> Performance Standards & Budgets
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Targets set to ensure clean page speed indexes on mobile and desktop layout views.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { metric: "Initial Page Load Budget", value: "< 3.0 seconds", impl: "Route-level chunk splitting + image compression", status: "Active" },
                                    { metric: "Bundle size splitting", value: "Code-split heavy charts", impl: "Utilizing Next.js dynamic() loaders", status: "Active" },
                                    { metric: "Query hydration latency", value: "< 100ms hydration", impl: "React Query prefetching on layout server side", status: "Active" },
                                    { metric: "Touch target hit sizes", value: "Minimum 44px x 44px", impl: "Padded interactive components classes", status: "Conformed" },
                                    { metric: "Image optimizations", value: "WebP / AVIF formats", impl: "Next.js <Image /> next-gen formats", status: "Enforced" },
                                ].map((p, i) => (
                                    <div key={i} className="p-3 bg-slate-950/60 border border-white/5 rounded-xl flex items-center justify-between gap-4 text-[10px]">
                                        <div>
                                            <div className="font-bold text-slate-200">{p.metric}</div>
                                            <div className="text-slate-500 text-[9px] mt-0.5">{p.impl}</div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-red-400 font-bold font-mono">{p.value}</div>
                                            <div className="text-emerald-400 text-[9px] font-semibold mt-0.5">{p.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Part 5 Gates Checklist Tab ── */}
            {activeTab === "deliverables" && (
                <div className="max-w-2xl mx-auto">
                    <div className="glass-card rounded-2xl p-8 border border-border/60">
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" /> Part 5 Deliverables Gates
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-8">
                            Verify individual frontend architecture goals and toggle completion checkboxes.
                        </p>

                        <div className="space-y-3 mb-8">
                            {deliverables.map(d => (
                                <button
                                    key={d.id}
                                    onClick={() => {
                                        setDeliverables(prev =>
                                            prev.map(del => (del.id === d.id ? { ...del, checked: !del.checked } : del))
                                        );
                                        addToast(d.checked ? "warning" : "success", `Updated Gate: ${d.label}`);
                                    }}
                                    className={`w-full p-4 rounded-xl border text-left text-xs flex items-center justify-between gap-3 cursor-pointer transition-all ${
                                        d.checked
                                            ? "bg-emerald-500/10 border-emerald-500/30 text-white"
                                            : "bg-slate-900 border-white/5 text-slate-500 hover:border-white/10"
                                    }`}
                                >
                                    <span className="font-semibold">{d.label}</span>
                                    <div
                                        className={`w-5 h-5 rounded border shrink-0 flex items-center justify-center ${
                                            d.checked ? "bg-emerald-500 border-emerald-500" : "bg-slate-950 border-slate-700"
                                        }`}
                                    >
                                        {d.checked && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Part 5 Completion progress</span>
                                <span className="text-emerald-400 font-bold">{doneDels}/5</span>
                            </div>
                            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                                    style={{ width: `${(doneDels / deliverables.length) * 100}%` }}
                                />
                            </div>
                            {doneDels === deliverables.length && (
                                <div className="pt-3 flex items-center gap-2 text-emerald-400 text-xs font-bold animate-pulse">
                                    <CheckCircle className="w-4 h-4" /> Part 5 Complete — Frontend Architecture Ready for Development!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
