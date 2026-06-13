"use client";

import { useState } from "react";
import {
    Layers, Check, Monitor, Smartphone, Tablet, ChevronRight, ChevronDown,
    Layout, Users, FileText, BarChart2, CreditCard, Settings, Star, Mail,
    MessageSquare, UserPlus, Link, Upload, Play, CheckCircle2, Info,
    MousePointer, Type, Table, Bell, Square, List, PieChart, ToggleLeft,
    AlertCircle, Eye, Pencil, Zap, BookOpen
} from "lucide-react";

interface Screen {
    id: string;
    name: string;
    section: string;
    status: "Approved" | "In Review" | "Designed";
    description: string;
}

interface NavNode {
    label: string;
    icon: React.ElementType;
    path: string;
    children?: { label: string; path: string }[];
    expanded?: boolean;
}

interface OnboardingStep {
    step: number;
    title: string;
    description: string;
    cta: string;
    icon: React.ElementType;
}

const statusColors = {
    Approved: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    "In Review": "bg-amber-500/10 border-amber-500/30 text-amber-400",
    Designed: "bg-violet-500/10 border-violet-500/30 text-violet-400",
};

export default function SuperAdminUxPage() {
    const [logs, setLogs] = useState<string[]>([]);
    const addLog = (msg: string) => {
        const t = new Date().toLocaleTimeString();
        setLogs(prev => [`[${t}] ${msg}`, ...prev]);
    };

    // ── Screen Inventory ──────────────────────────────────────────
    const [screens, setScreens] = useState<Screen[]>([
        { id: "s1",  name: "Login Page",               section: "Auth",          status: "Approved",   description: "Email/password + Google OAuth login." },
        { id: "s2",  name: "Registration Page",         section: "Auth",          status: "Approved",   description: "Name, email, plan selection, terms." },
        { id: "s3",  name: "Forgot Password",           section: "Auth",          status: "Approved",   description: "Email reset link request." },
        { id: "s4",  name: "Reset Password",            section: "Auth",          status: "Approved",   description: "New password with expiry countdown." },
        { id: "s5",  name: "Email Verification",        section: "Auth",          status: "Approved",   description: "Token confirm + resend link." },
        { id: "s6",  name: "Main Dashboard",            section: "Dashboard",     status: "Approved",   description: "KPI stats, activity feed, quick actions." },
        { id: "s7",  name: "Business Profile",          section: "Businesses",    status: "Approved",   description: "Name, logo, address, review links." },
        { id: "s8",  name: "Customer List",             section: "Customers",     status: "Approved",   description: "Table, search, filters, import CSV." },
        { id: "s9",  name: "Customer Detail",           section: "Customers",     status: "In Review",  description: "History drawer, tags, communication log." },
        { id: "s10", name: "Campaign Builder",          section: "Campaigns",     status: "Approved",   description: "Channel, template, audience, schedule." },
        { id: "s11", name: "Campaign Monitor",          section: "Campaigns",     status: "In Review",  description: "Live sent/opened/clicked stats." },
        { id: "s12", name: "Review Monitoring Inbox",   section: "Reviews",       status: "Approved",   description: "Aggregated feed, source badges, filters." },
        { id: "s13", name: "Reports Overview",          section: "Reports",       status: "Approved",   description: "Charts, KPIs, PDF/CSV export." },
        { id: "s14", name: "Billing & Plans",           section: "Billing",       status: "Approved",   description: "Stripe portal, plan comparison, invoices." },
        { id: "s15", name: "Settings",                  section: "Settings",      status: "In Review",  description: "Account, notifications, integrations, team." },
        { id: "s16", name: "Agency Client Switcher",    section: "Agency",        status: "Designed",   description: "Persistent dropdown for multi-client context." },
        { id: "s17", name: "Agency Reports",            section: "Agency",        status: "Designed",   description: "Consolidated metrics across all client accounts." },
    ]);

    const cycleStatus = (id: string) => {
        const cycle: Screen["status"][] = ["Designed", "In Review", "Approved"];
        setScreens(prev => prev.map(s => {
            if (s.id !== id) return s;
            const next = cycle[(cycle.indexOf(s.status) + 1) % cycle.length];
            addLog(`Screen "${s.name}" status → ${next}`);
            return { ...s, status: next };
        }));
    };

    const approvedCount = screens.filter(s => s.status === "Approved").length;

    // ── Navigation Tree ───────────────────────────────────────────
    const [navNodes, setNavNodes] = useState<NavNode[]>([
        { label: "Dashboard",       icon: Layout,      path: "/dashboard",  expanded: false, children: [
            { label: "KPI Overview",     path: "/dashboard" },
            { label: "Activity Feed",    path: "/dashboard" },
            { label: "Quick Actions",    path: "/dashboard" },
        ]},
        { label: "Businesses",      icon: Star,        path: "/dashboard",  expanded: false, children: [
            { label: "Business Profile", path: "/dashboard/setup" },
            { label: "Locations",        path: "/dashboard/setup" },
            { label: "Review Links",     path: "/dashboard/setup" },
        ]},
        { label: "Review Campaigns",icon: Mail,        path: "/dashboard/requests", expanded: false, children: [
            { label: "Campaign Builder", path: "/dashboard/requests" },
            { label: "Templates",        path: "/dashboard/requests" },
            { label: "Campaign History", path: "/dashboard/requests" },
        ]},
        { label: "Customers",       icon: Users,       path: "/dashboard/team", expanded: false, children: [
            { label: "Customer List",    path: "/dashboard/team" },
            { label: "Import CSV",       path: "/dashboard/team" },
            { label: "Communication Log",path: "/dashboard/team" },
        ]},
        { label: "Reports",         icon: BarChart2,   path: "/dashboard/analytics", expanded: false, children: [
            { label: "Review Growth",    path: "/dashboard/analytics" },
            { label: "Rating Trends",    path: "/dashboard/analytics" },
            { label: "Campaign Stats",   path: "/dashboard/analytics" },
            { label: "Export PDF/CSV",   path: "/dashboard/analytics" },
        ]},
        { label: "Billing",         icon: CreditCard,  path: "/dashboard", expanded: false, children: [
            { label: "Current Plan",     path: "/dashboard" },
            { label: "Invoice History",  path: "/dashboard" },
            { label: "Upgrade Plan",     path: "/pricing" },
        ]},
        { label: "Settings",        icon: Settings,    path: "/dashboard/settings", expanded: false, children: [
            { label: "Account Info",     path: "/dashboard/settings" },
            { label: "Notifications",    path: "/dashboard/alerts" },
            { label: "Integrations",     path: "/dashboard/integrations" },
            { label: "Team Members",     path: "/dashboard/team" },
        ]},
    ]);

    const toggleNode = (idx: number) => {
        setNavNodes(prev => prev.map((n, i) => i === idx ? { ...n, expanded: !n.expanded } : n));
        addLog(`Nav node "${navNodes[idx].label}" ${navNodes[idx].expanded ? "collapsed" : "expanded"}.`);
    };

    // ── Onboarding Steps ──────────────────────────────────────────
    const [activeStep, setActiveStep] = useState(1);

    const steps: OnboardingStep[] = [
        { step: 1, title: "Create Account",         description: "Register with email & select a pricing plan.",                   cta: "Create My Account",       icon: UserPlus },
        { step: 2, title: "Verify Email",            description: "Confirm identity via email verification token.",                 cta: "Verify My Email",         icon: Mail },
        { step: 3, title: "Business Profile",        description: "Enter business name, logo, address, and category.",             cta: "Save & Continue",         icon: Star },
        { step: 4, title: "Add Google Review Link",  description: "Paste your Google Business review URL to connect.",             cta: "Link Google Profile",     icon: Link },
        { step: 5, title: "Import Customers",        description: "Upload a CSV or manually enter customer contacts.",              cta: "Import Contacts",         icon: Upload },
        { step: 6, title: "Launch First Campaign",   description: "Send Email or SMS review requests to your contacts.",           cta: "Send My First Campaign",  icon: Play },
        { step: 7, title: "View Dashboard",          description: "Explore your review activity, ratings, and quick actions.",     cta: "Go to Dashboard",         icon: Layout },
    ];

    // ── Part 2 Deliverables ───────────────────────────────────────
    const [deliverables, setDeliverables] = useState([
        { id: "d1", label: "Screen inventory complete",           checked: true  },
        { id: "d2", label: "Navigation structure approved",       checked: true  },
        { id: "d3", label: "User journeys documented",            checked: true  },
        { id: "d4", label: "Dashboard wireframes approved",       checked: true  },
        { id: "d5", label: "MVP UI requirements finalized",       checked: false },
    ]);

    const toggleDeliverable = (id: string) => {
        setDeliverables(prev => prev.map(d => {
            if (d.id !== id) return d;
            const next = !d.checked;
            addLog(`Deliverable "${d.label}" → ${next ? "APPROVED" : "PENDING"}`);
            return { ...d, checked: next };
        }));
    };

    const deliverablesDone = deliverables.filter(d => d.checked).length;

    // ── Render ────────────────────────────────────────────────────
    return (
        <div className="h-screen overflow-y-auto p-8 font-sans">

            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Layers className="w-6 h-6 text-red-500" />
                        UI/UX Design, Wireframes &amp; Screen Inventory
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        UX command center. Manage screen approvals, explore the navigation tree, walk through onboarding steps, preview the component library, and track Part 2 delivery gates.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> {approvedCount}/{screens.length} Screens Approved
                </div>
            </div>

            {/* ── Top Metrics Row ── */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Screens",       value: screens.length,                                        color: "text-white",       sub: "All app screens inventoried" },
                    { label: "Approved",            value: screens.filter(s => s.status === "Approved").length,   color: "text-emerald-400", sub: "Ready for development" },
                    { label: "In Review",           value: screens.filter(s => s.status === "In Review").length,  color: "text-amber-400",   sub: "Awaiting sign-off" },
                    { label: "Deliverables Done",   value: `${deliverablesDone}/5`,                               color: "text-violet-400",  sub: "Part 2 completion gates" },
                ].map((m, i) => (
                    <div key={i} className="glass-card rounded-2xl p-5 border border-border/60 flex items-start justify-between">
                        <div>
                            <div className={`text-2xl font-black mb-1 ${m.color}`}>{m.value}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{m.label}</div>
                            <p className="text-[10px] text-slate-500 mt-0.5">{m.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Screen Inventory + Nav Tree ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Screen Inventory */}
                <div className="glass-card rounded-2xl p-6 border border-border/60 lg:col-span-2">
                    <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                        <Monitor className="w-4.5 h-4.5 text-violet-400" /> Screen Inventory Tracker
                    </h3>
                    <p className="text-xs text-slate-400 mb-5">Click status badges to cycle: Designed → In Review → Approved.</p>

                    <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                        {["Auth", "Dashboard", "Businesses", "Customers", "Campaigns", "Reviews", "Reports", "Billing", "Settings", "Agency"].map(section => {
                            const group = screens.filter(s => s.section === section);
                            if (!group.length) return null;
                            return (
                                <div key={section}>
                                    <div className="text-[9px] text-slate-600 uppercase tracking-widest font-bold px-1 pb-1 pt-2">{section}</div>
                                    {group.map(screen => (
                                        <div key={screen.id} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-white/10 transition-all text-xs mb-1.5">
                                            <div className="flex-1 min-w-0">
                                                <span className="text-slate-200 font-semibold block truncate">{screen.name}</span>
                                                <span className="text-[9px] text-slate-500">{screen.description}</span>
                                            </div>
                                            <button
                                                onClick={() => cycleStatus(screen.id)}
                                                className={`shrink-0 text-[9px] px-2 py-0.5 rounded-full border font-bold cursor-pointer transition-all ${statusColors[screen.status]}`}
                                            >
                                                {screen.status}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation Tree */}
                <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col">
                    <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                        <List className="w-4.5 h-4.5 text-cyan-400" /> Navigation Structure
                    </h3>
                    <p className="text-xs text-slate-400 mb-5">7 top-level nodes. Click to expand sub-routes.</p>

                    <div className="space-y-1 flex-1 overflow-y-auto">
                        {navNodes.map((node, idx) => {
                            const Icon = node.icon;
                            return (
                                <div key={idx}>
                                    <button
                                        onClick={() => toggleNode(idx)}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-900/60 hover:text-white transition-all cursor-pointer"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                            {node.label}
                                        </span>
                                        {node.expanded
                                            ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                                            : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                                    </button>
                                    {node.expanded && node.children && (
                                        <div className="ml-6 mt-0.5 space-y-0.5 border-l border-white/5 pl-3">
                                            {node.children.map((child, ci) => (
                                                <div key={ci} className="flex items-center gap-1.5 py-1.5 text-[10px] text-slate-400 font-mono">
                                                    <span className="text-slate-700">└</span>
                                                    {child.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* ── Onboarding Journey Emulator ── */}
            <div className="glass-card rounded-2xl p-6 border border-border/60 mb-8">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Zap className="w-4.5 h-4.5 text-red-500" /> New User Onboarding Journey — 7-Step Emulator
                        </h3>
                        <p className="text-[10px] text-slate-500 mt-0.5">Click each step node to preview the mock UI viewport.</p>
                    </div>
                </div>

                {/* Step selector */}
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mb-6">
                    {steps.map(s => {
                        const Icon = s.icon;
                        return (
                            <button
                                key={s.step}
                                onClick={() => { setActiveStep(s.step); addLog(`Onboarding emulator: Step ${s.step} — ${s.title}`); }}
                                className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                                    activeStep === s.step
                                        ? "bg-red-500/20 border-red-500 text-red-400"
                                        : "bg-slate-900 border-white/5 text-slate-400 hover:border-white/10"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-[9px] font-bold leading-tight">{s.title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Emulator viewport */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 bg-slate-950 border border-white/10 rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: 260 }}>
                        <div className="bg-white/5 px-3 py-2 border-b border-white/10 text-[9px] text-slate-500 flex items-center justify-between font-mono">
                            <span>Mock Viewport: Step {activeStep} — {steps[activeStep - 1].title}</span>
                            <span className="text-red-400 font-bold">UX Prototype</span>
                        </div>
                        <div className="p-6 flex flex-col gap-4 flex-1">
                            {activeStep === 1 && (
                                <>
                                    <div className="text-sm font-bold text-white">Create Your ReviewHub Account</div>
                                    <div className="grid grid-cols-2 gap-3 text-[10px]">
                                        <div className="p-2 bg-white/3 border border-white/5 rounded">Full Name: <strong className="text-white">Sarah Johnson</strong></div>
                                        <div className="p-2 bg-white/3 border border-white/5 rounded">Email: <strong className="text-white">sarah@medclinic.com</strong></div>
                                    </div>
                                    <div className="p-2 bg-white/3 border border-white/5 rounded text-[10px] text-slate-300">Plan selected: <strong className="text-emerald-400">Growth ($79/mo)</strong></div>
                                    <div className="h-8 bg-red-600 rounded flex items-center justify-center text-[10px] font-bold text-white">Create My Account</div>
                                </>
                            )}
                            {activeStep === 2 && (
                                <>
                                    <div className="text-sm font-bold text-white">Verify Your Email Address</div>
                                    <p className="text-[10px] text-slate-400">We sent a verification link to <strong className="text-white">sarah@medclinic.com</strong>. Click the link to continue.</p>
                                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] text-amber-300">Link expires in: <strong>14:32</strong></div>
                                    <div className="text-[10px] text-slate-500 cursor-pointer hover:text-white transition-colors">Didn't receive it? <u>Resend verification email</u></div>
                                </>
                            )}
                            {activeStep === 3 && (
                                <>
                                    <div className="text-sm font-bold text-white">Set Up Your Business Profile</div>
                                    <div className="space-y-2 text-[10px]">
                                        <div className="p-2 bg-white/3 border border-white/5 rounded">Business Name: <strong className="text-white">Metro Dental Clinic</strong></div>
                                        <div className="p-2 bg-white/3 border border-white/5 rounded">Industry: <strong className="text-white">Healthcare & Dental</strong></div>
                                        <div className="p-2 bg-white/3 border border-white/5 rounded">Address: <strong className="text-white">142 Oak Street, Chicago, IL</strong></div>
                                    </div>
                                    <div className="h-8 bg-red-600 rounded flex items-center justify-center text-[10px] font-bold text-white">Save & Continue</div>
                                </>
                            )}
                            {activeStep === 4 && (
                                <>
                                    <div className="text-sm font-bold text-white">Add Your Google Review Link</div>
                                    <p className="text-[10px] text-slate-400">Paste your Google Business review URL so customers can leave reviews directly.</p>
                                    <div className="p-2 bg-white/3 border border-white/5 rounded text-[10px] font-mono text-slate-300 truncate">https://g.page/r/metro-dental-chicago/review</div>
                                    <div className="h-8 bg-emerald-600 rounded flex items-center justify-center text-[10px] font-bold text-white">Link Google Profile ✓</div>
                                </>
                            )}
                            {activeStep === 5 && (
                                <>
                                    <div className="text-sm font-bold text-white">Import Your Customers</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-white/3 border border-dashed border-white/10 rounded-xl text-[10px] text-center text-slate-400 flex flex-col items-center gap-1">
                                            <Upload className="w-5 h-5 text-violet-400" />
                                            Upload CSV file
                                        </div>
                                        <div className="p-3 bg-white/3 border border-white/5 rounded-xl text-[10px] text-center text-slate-400 flex flex-col items-center gap-1">
                                            <UserPlus className="w-5 h-5 text-cyan-400" />
                                            Add manually
                                        </div>
                                    </div>
                                    <div className="text-[9px] text-slate-500">42 contacts loaded from previous import.</div>
                                </>
                            )}
                            {activeStep === 6 && (
                                <>
                                    <div className="text-sm font-bold text-white">Launch Your First Campaign</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className={`p-3 rounded-xl border text-[10px] flex items-center gap-2 bg-violet-500/10 border-violet-500/30 text-violet-400`}>
                                            <Mail className="w-4 h-4" /> Email Campaign
                                        </div>
                                        <div className="p-3 rounded-xl border border-white/5 bg-slate-900 text-[10px] flex items-center gap-2 text-slate-400">
                                            <MessageSquare className="w-4 h-4" /> SMS Campaign
                                        </div>
                                    </div>
                                    <div className="h-8 bg-red-600 rounded flex items-center justify-center text-[10px] font-bold text-white">Send My First Campaign →</div>
                                </>
                            )}
                            {activeStep === 7 && (
                                <>
                                    <div className="text-sm font-bold text-white">Welcome to Your Dashboard 🎉</div>
                                    <div className="grid grid-cols-3 gap-2 text-[9px]">
                                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-center"><div className="font-black text-base">12</div>Requests Sent</div>
                                        <div className="p-2 bg-violet-500/10 border border-violet-500/20 rounded text-violet-400 text-center"><div className="font-black text-base">4</div>Reviews In</div>
                                        <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded text-amber-400 text-center"><div className="font-black text-base">4.8★</div>Avg Rating</div>
                                    </div>
                                    <div className="h-8 bg-slate-900 border border-white/10 rounded flex items-center justify-center text-[10px] text-slate-300 font-bold">Go to Full Dashboard</div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Step details panel */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <div className="p-5 bg-slate-950/80 border border-white/5 rounded-2xl flex-1">
                            <div className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mb-3">Step {activeStep} of {steps.length}</div>
                            <div className="text-sm font-bold text-white mb-2">{steps[activeStep - 1].title}</div>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">{steps[activeStep - 1].description}</p>
                            <div className="h-8 bg-slate-900 border border-white/10 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-300">
                                CTA: "{steps[activeStep - 1].cta}"
                            </div>
                        </div>
                        <div className="p-4 bg-slate-950/80 border border-white/5 rounded-2xl">
                            <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
                                <span>Journey Progress</span>
                                <span className="text-red-400 font-bold">{Math.round((activeStep / steps.length) * 100)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-500"
                                    style={{ width: `${(activeStep / steps.length) * 100}%` }} />
                            </div>
                            <div className="flex gap-1 mt-2.5">
                                {steps.map(s => (
                                    <div key={s.step} className={`flex-1 h-1 rounded-full ${s.step <= activeStep ? "bg-red-500" : "bg-slate-800"}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Component Library + Part 2 Deliverables ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Component Library Showcase */}
                <div className="glass-card rounded-2xl p-6 border border-border/60 lg:col-span-2">
                    <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                        <BookOpen className="w-4.5 h-4.5 text-orange-400" /> UI Component Library Showcase
                    </h3>
                    <p className="text-xs text-slate-400 mb-5">Platform dark glassmorphism design system primitives.</p>

                    <div className="space-y-5">
                        {/* Buttons */}
                        <div>
                            <div className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mb-2 flex items-center gap-1"><MousePointer className="w-3 h-3" /> Buttons</div>
                            <div className="flex flex-wrap gap-2">
                                <button className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer">Primary</button>
                                <button className="px-4 py-2 bg-transparent border border-white/20 hover:border-white/40 text-slate-300 text-xs font-bold rounded-lg transition-colors cursor-pointer">Secondary</button>
                                <button className="px-4 py-2 bg-rose-950/40 border border-rose-500/30 hover:border-rose-500 text-rose-400 text-xs font-bold rounded-lg transition-colors cursor-pointer">Danger</button>
                                <button disabled className="px-4 py-2 bg-slate-900 border border-white/5 text-slate-600 text-xs font-bold rounded-lg cursor-not-allowed">Disabled</button>
                            </div>
                        </div>

                        {/* Notification Badges */}
                        <div>
                            <div className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mb-2 flex items-center gap-1"><Bell className="w-3 h-3" /> Notifications</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div className="flex items-start gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /><span>Success: Campaign dispatched to 42 contacts.</span></div>
                                <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-400"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>Warning: Google profile sync delayed 5 min.</span></div>
                                <div className="flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>Error: Twilio SMS quota exceeded for this month.</span></div>
                                <div className="flex items-start gap-2 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-xs text-cyan-400"><Info className="w-4 h-4 shrink-0 mt-0.5" /><span>Info: New review received from Google (4 stars).</span></div>
                            </div>
                        </div>

                        {/* Cards & Stat */}
                        <div>
                            <div className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mb-2 flex items-center gap-1"><Square className="w-3 h-3" /> KPI Stat Cards</div>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: "Reviews In", val: "284", color: "text-emerald-400" },
                                    { label: "Avg Rating", val: "4.7★", color: "text-yellow-400" },
                                    { label: "Campaigns", val: "18", color: "text-violet-400" },
                                ].map((c, i) => (
                                    <div key={i} className="p-4 bg-slate-900/60 border border-white/5 rounded-xl">
                                        <div className={`text-xl font-black mb-0.5 ${c.color}`}>{c.val}</div>
                                        <div className="text-[9px] text-slate-500 uppercase tracking-wide">{c.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Toggle & Form elements */}
                        <div>
                            <div className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mb-2 flex items-center gap-1"><ToggleLeft className="w-3 h-3" /> Form Elements</div>
                            <div className="flex flex-wrap gap-3 items-center">
                                <input type="text" readOnly value="Input field" className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none w-32" />
                                <select className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none">
                                    <option>Dropdown</option>
                                    <option>Option 2</option>
                                </select>
                                <div className="flex items-center gap-2 text-xs text-slate-300">
                                    <div className="w-9 h-5 bg-red-600 rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
                                    </div>
                                    Toggle (On)
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <div className="w-9 h-5 bg-slate-700 rounded-full relative cursor-pointer">
                                        <div className="absolute left-1 top-0.5 w-4 h-4 bg-slate-400 rounded-full shadow" />
                                    </div>
                                    Toggle (Off)
                                </div>
                            </div>
                        </div>

                        {/* Chart skeletons */}
                        <div>
                            <div className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mb-2 flex items-center gap-1"><PieChart className="w-3 h-3" /> Chart Skeletons</div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-3 bg-slate-900/60 border border-white/5 rounded-xl flex flex-col items-center gap-1">
                                    <div className="flex items-end gap-0.5 h-10">
                                        {[60, 80, 45, 90, 55, 75, 65].map((h, i) => (
                                            <div key={i} className="w-2 bg-red-500/60 rounded-sm" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                    <span className="text-[8px] text-slate-500">Bar Chart</span>
                                </div>
                                <div className="p-3 bg-slate-900/60 border border-white/5 rounded-xl flex flex-col items-center gap-1">
                                    <div className="w-10 h-10 rounded-full border-4 border-violet-500/60 border-t-violet-500 flex items-center justify-center">
                                        <span className="text-[8px] text-slate-300 font-bold">82%</span>
                                    </div>
                                    <span className="text-[8px] text-slate-500">Donut</span>
                                </div>
                                <div className="p-3 bg-slate-900/60 border border-white/5 rounded-xl flex flex-col items-center gap-1 justify-center">
                                    <svg className="w-16 h-10" viewBox="0 0 64 32">
                                        <polyline points="2,28 12,18 24,22 36,10 48,14 62,4" fill="none" stroke="rgb(6,182,212)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="text-[8px] text-slate-500">Line Chart</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Part 2 Deliverables */}
                <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" /> Part 2 Deliverables
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-6">
                            Toggle gates to mark UX definition milestones approved.
                        </p>

                        <div className="space-y-3">
                            {deliverables.map(d => (
                                <button
                                    key={d.id}
                                    onClick={() => toggleDeliverable(d.id)}
                                    className={`w-full p-3.5 rounded-xl border text-left text-xs flex items-center justify-between gap-3 cursor-pointer transition-all ${
                                        d.checked
                                            ? "bg-emerald-500/10 border-emerald-500/30 text-white"
                                            : "bg-slate-900 border-white/5 text-slate-500 hover:border-white/10"
                                    }`}
                                >
                                    <span className="font-semibold">{d.label}</span>
                                    <div className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center ${
                                        d.checked ? "bg-emerald-500 border-emerald-500" : "bg-slate-950 border-slate-700"
                                    }`}>
                                        {d.checked && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-900 mt-6 space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Part 2 Completion</span>
                            <span className="text-emerald-400 font-bold">{deliverablesDone}/5</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                                style={{ width: `${(deliverablesDone / deliverables.length) * 100}%` }} />
                        </div>
                        {deliverablesDone === deliverables.length && (
                            <div className="pt-2 flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                <CheckCircle2 className="w-4 h-4" /> Part 2 Complete — Ready for Development!
                            </div>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
}
