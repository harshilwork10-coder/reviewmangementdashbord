"use client";

import { useState, useEffect } from "react";
import {
    Briefcase, AlertTriangle, ArrowRight, Check, X, ShieldCheck,
    Sparkles, UserCheck, CalendarDays, TrendingUp, Handshake, Users,
    LifeBuoy, Terminal, Info, ShieldAlert, AlertCircle, Clock, CheckCircle,
    Play, ChevronRight, Settings, Sliders, MessageSquare, ShieldCheck as VerifiedIcon,
    Plus, Send, Star
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface OnboardingMerchant {
    id: string;
    name: string;
    step: number; // 1 to 5
    progress: number; // %
    emailSent: boolean;
    gbpConnected: boolean;
    campaignSent: boolean;
}

interface SupportTicket {
    id: string;
    merchant: string;
    topic: string;
    tier: "L1 - General" | "L2 - Specialist" | "L3 - Engineering" | "Executive Escalation";
    status: "Open" | "In Progress" | "Resolved";
    description: string;
}

interface RenewalMerchant {
    id: string;
    name: string;
    plan: string;
    date: string;
    stage: "90-Day Review" | "60-Day Check" | "30-Day Outreach" | "Renewed";
    outreachSent: boolean;
}

interface ToastMessage {
    id: string;
    type: "success" | "warning" | "error" | "info";
    text: string;
}

export default function SuperAdminCRMPage() {
    const [activeTab, setActiveTab] = useState<"onboarding" | "support" | "health" | "renewals" | "kpis">("onboarding");

    // General Audit Log state
    const [opsLogs, setOpsLogs] = useState<string[]>([
        "[INFO] Customer Success and Operations command center initialized.",
        "[INFO] HubSpot CRM synchronization active. Smart dunning loops armed.",
        "[AUDIT] Multi-tenant database scopes and support routing tables verified."
    ]);

    const addLog = (msg: string) => {
        const time = new Date().toLocaleTimeString();
        setOpsLogs(prev => [`[${time}] ${msg}`, ...prev]);
    };

    // Toasts state
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const addToast = (type: ToastMessage["type"], text: string) => {
        const id = Math.random().toString(36).substring(7);
        setToasts(prev => [...prev, { id, type, text }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    // ── Tab 1: Onboarding & SOPs States ──
    const [onboarders, setOnboarders] = useState<OnboardingMerchant[]>([
        { id: "OB-01", name: "Greenwood Med Spa", step: 3, progress: 60, emailSent: true, gbpConnected: true, campaignSent: false },
        { id: "OB-02", name: "Apex Dental Clinic", step: 1, progress: 20, emailSent: true, gbpConnected: false, campaignSent: false },
        { id: "OB-03", name: "Skyline Car Care", step: 4, progress: 80, emailSent: true, gbpConnected: true, campaignSent: true },
    ]);

    const [selectedSOP, setSelectedSOP] = useState<string>("New Customer Onboarding");
    const sopScripts: Record<string, string[]> = {
        "New Customer Onboarding": [
            "Welcome email containing system credentials dispatched via HubSpot triggers.",
            "Schedule onboarding walkthrough call via Calendly sync link.",
            "Verify Google Business Profile directory connection status.",
            "Setup first review dispatcher campaign and print location QR flyer."
        ],
        "Campaign Troubleshooting": [
            "Verify Twilio/Resend gateway connection status in logs.",
            "Review customer template variables to prevent parsing crashes.",
            "Execute test SMS broadcast and audit delivery status response.",
            "If delivery fails due to carrier spam block, escalate to Level 2."
        ],
        "Billing Issue Resolution": [
            "Access Stripe dashboard to parse failed invoice payment metadata.",
            "Audit Smart Dunning cycle attempts (Smart Retries attempt 1 to 4).",
            "Send localized dunning warning emails with direct billing portal links.",
            "If payment is outstanding for >7 days, downgrade account to Quota Lock."
        ],
        "Account Upgrades": [
            "Validate merchant usage logs against active plan limits.",
            "Generate Stripe upgrade check-out session link with proration items.",
            "Send upgrade approval email sequence outlining advanced feature access.",
            "Once upgraded in webhook, verify custom domain or location scopes."
        ],
        "Customer Offboarding": [
            "Suspend active review sync engines and API polling workers.",
            "Cancel Stripe subscription, disabling billing renewal crons.",
            "Send exit feedback survey to gather cancellation metrics.",
            "Schedule automatic private API tokens purge after 30 days."
        ]
    };

    const handleAdvanceOnboarding = (id: string) => {
        setOnboarders(prev => prev.map(m => {
            if (m.id === id) {
                const nextStep = Math.min(5, m.step + 1);
                const nextProgress = nextStep * 20;
                addLog(`[Onboarding] Advanced ${m.name} to Step ${nextStep} (${nextProgress}%).`);
                addToast("success", `${m.name} onboarding advanced!`);
                return {
                    ...m,
                    step: nextStep,
                    progress: nextProgress,
                    gbpConnected: nextStep >= 3 ? true : m.gbpConnected,
                    campaignSent: nextStep >= 4 ? true : m.campaignSent,
                };
            }
            return m;
        }));
    };

    // ── Tab 2: Support Ticketing States ──
    const [tickets, setTickets] = useState<SupportTicket[]>([
        { id: "TK-101", merchant: "Apex Dental Clinic", topic: "Billing Error", tier: "L2 - Specialist", status: "In Progress", description: "Double charged on Growth annual subscription proration item." },
        { id: "TK-102", merchant: "Greenwood Med Spa", topic: "API Directory connection", tier: "L1 - General", status: "Open", description: "Google Business directory returns invalid authentication token." },
        { id: "TK-103", merchant: "Skyline Car Care", topic: "SMS Campaign Delay", tier: "L3 - Engineering", status: "Open", description: "Custom review flyer QR returns gateway 502 error during scans." },
    ]);

    const [newTicketMerchant, setNewTicketMerchant] = useState("");
    const [newTicketTopic, setNewTicketTopic] = useState("API Directory connection");
    const [newTicketTier, setNewTicketTier] = useState<SupportTicket["tier"]>("L1 - General");
    const [newTicketDesc, setNewTicketDesc] = useState("");

    const handleCreateTicket = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTicketMerchant || !newTicketDesc) {
            addToast("warning", "Please provide a merchant name and description.");
            return;
        }
        const newTicket: SupportTicket = {
            id: `TK-${tickets.length + 101}`,
            merchant: newTicketMerchant,
            topic: newTicketTopic,
            tier: newTicketTier,
            status: "Open",
            description: newTicketDesc
        };
        setTickets(prev => [...prev, newTicket]);
        addLog(`[Support Ticket] Created ${newTicket.id} for ${newTicketMerchant} | Tier: ${newTicketTier}`);
        addToast("success", `Ticket ${newTicket.id} created successfully.`);
        setNewTicketMerchant("");
        setNewTicketDesc("");
    };

    const handleEscalateTicket = (id: string) => {
        const tiers: SupportTicket["tier"][] = ["L1 - General", "L2 - Specialist", "L3 - Engineering", "Executive Escalation"];
        setTickets(prev => prev.map(t => {
            if (t.id === id) {
                const currentIdx = tiers.indexOf(t.tier);
                if (currentIdx < tiers.length - 1) {
                    const nextTier = tiers[currentIdx + 1];
                    addLog(`[Support Ticket] Escalated ${t.id} to: ${nextTier}`);
                    addToast("info", `Escalated ticket ${t.id} to ${nextTier}`);
                    return { ...t, tier: nextTier };
                }
            }
            return t;
        }));
    };

    const handleResolveTicket = (id: string) => {
        setTickets(prev => prev.map(t => {
            if (t.id === id) {
                addLog(`[Support Ticket] Resolved ${t.id} for ${t.merchant}.`);
                addToast("success", `Resolved ticket ${t.id}.`);
                return { ...t, status: "Resolved" };
            }
            return t;
        }));
    };

    // ── Tab 3: Health Scoring Calculator States ──
    const [calcMerchant, setCalcMerchant] = useState("Greenwood Med Spa");
    const [loginFreq, setLoginFreq] = useState(6); // logins per week
    const [campaignActivity, setCampaignActivity] = useState(45); // requests sent per month
    const [reviewRate, setReviewRate] = useState(12); // reviews generated per month
    const [openP1Tickets, setOpenP1Tickets] = useState(0); // number of open tickets
    const [stripeStatus, setStripeStatus] = useState<"Active" | "Dunning">("Active");

    // Upsell States
    const [upsellLocations, setUpsellLocations] = useState(false); // +$30
    const [upsellReporting, setUpsellReporting] = useState(false); // +$20
    const [upsellPrioritySupport, setUpsellPrioritySupport] = useState(false); // +$15
    const [upsellAiFeatures, setUpsellAiFeatures] = useState(false); // +$25

    const upsellTotal = 
        (upsellLocations ? 30 : 0) +
        (upsellReporting ? 20 : 0) +
        (upsellPrioritySupport ? 15 : 0) +
        (upsellAiFeatures ? 25 : 0);

    // Compute Health score logic
    const loginScore = Math.min(100, loginFreq * 10);
    const campaignScore = Math.min(100, campaignActivity * 2);
    const reviewScore = Math.min(100, reviewRate * 4);
    const ticketDeduction = openP1Tickets * 20;
    const stripeScore = stripeStatus === "Active" ? 100 : 30;

    const aggregateHealthScore = Math.round(
        (loginScore * 0.20) +
        (campaignScore * 0.25) +
        (reviewScore * 0.20) -
        ticketDeduction +
        (stripeScore * 0.20)
    );

    const boundedHealthScore = Math.max(0, Math.min(100, aggregateHealthScore));
    const healthBand = boundedHealthScore >= 80 ? "Green (Healthy)" : boundedHealthScore >= 50 ? "Amber (Declining)" : "Red (Churn Risk)";
    const healthColor = boundedHealthScore >= 80 ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" : boundedHealthScore >= 50 ? "text-amber-400 border-amber-500/20 bg-amber-500/10" : "text-rose-400 border-rose-500/20 bg-rose-500/10 animate-pulse";

    // ── Tab 4: Renewals & Retention States ──
    const [renewals, setRenewals] = useState<RenewalMerchant[]>([
        { id: "RN-01", name: "Skyline Car Care", plan: "Starter ($29/mo)", date: "2026-07-10", stage: "90-Day Review", outreachSent: false },
        { id: "RN-02", name: "Apex Dental Clinic", plan: "Growth ($79/mo)", date: "2026-06-25", stage: "30-Day Outreach", outreachSent: true },
        { id: "RN-03", name: "Greenwood Med Spa", plan: "Growth ($79/mo)", date: "2026-07-02", stage: "60-Day Check", outreachSent: false },
        { id: "RN-04", name: "Elite Fitness Gym", plan: "Agency ($199/mo)", date: "2026-06-15", stage: "30-Day Outreach", outreachSent: false },
    ]);

    const handleSendRenewalOutreach = (id: string) => {
        setRenewals(prev => prev.map(m => {
            if (m.id === id) {
                addLog(`[Renewal] Renewal outreach dispatched to ${m.name} for contract on ${m.date}.`);
                addToast("success", `Outreach email sent to ${m.name}!`);
                return { ...m, outreachSent: true };
            }
            return m;
        }));
    };

    const handleConfirmRenewal = (id: string) => {
        setRenewals(prev => prev.map(m => {
            if (m.id === id) {
                addLog(`[Renewal] Contract renewal CONFIRMED for ${m.name} on plan: ${m.plan}.`);
                addToast("success", `${m.name} subscription renewed! 🎉`);
                return { ...m, stage: "Renewed" };
            }
            return m;
        }));
    };

    // ── Tab 5: Operations KPIs & Gates States ──
    const [deliverables, setDeliverables] = useState([
        { id: "pd13_1", label: "Retention framework approved", checked: true },
        { id: "pd13_2", label: "Renewal playbook documented", checked: true },
        { id: "pd13_3", label: "Upsell strategy finalized", checked: true },
        { id: "pd13_4", label: "Health scoring model approved", checked: true },
        { id: "pd13_5", label: "Customer success program ready", checked: false },
    ]);

    const toggleDeliverable = (id: string) => {
        setDeliverables(prev => prev.map(d => {
            if (d.id === id) {
                const nextVal = !d.checked;
                addLog(`[Operations Gate] ${d.label} status: ${nextVal ? "PASSED" : "PENDING"}.`);
                addToast(nextVal ? "success" : "warning", `Gate checklist updated.`);
                return { ...d, checked: nextVal };
            }
            return d;
        }));
    };

    const doneDels = deliverables.filter(d => d.checked).length;

    return (
        <div className="h-screen overflow-y-auto p-8 font-sans relative mesh-gradient">
            
            {/* Custom toast overlay container */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto p-4 rounded-xl shadow-2xl flex items-center gap-3 border backdrop-blur-lg transform transition-all duration-300 animate-slide-up ${
                            toast.type === "success" ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" :
                            toast.type === "warning" ? "bg-amber-500/20 border-amber-500/30 text-amber-400" :
                            toast.type === "error" ? "bg-rose-500/20 border-rose-500/30 text-rose-400" :
                            "bg-indigo-500/20 border-indigo-500/30 text-indigo-400"
                        }`}
                    >
                        {toast.type === "success" && <Check className="w-4 h-4 shrink-0" />}
                        {toast.type === "warning" && <AlertTriangle className="w-4 h-4 shrink-0" />}
                        {toast.type === "error" && <X className="w-4 h-4 shrink-0" />}
                        {toast.type === "info" && <Info className="w-4 h-4 shrink-0" />}
                        <span className="text-xs font-semibold">{toast.text}</span>
                        <button
                            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                            className="ml-auto text-white/40 hover:text-white transition-colors cursor-pointer"
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
                        <Briefcase className="w-6 h-6 text-red-500 animate-float" />
                        Customer Success &amp; Operations Dashboard
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Operational pipeline control panel. Qualify trial leads, manage support escalations, track user health scoring models, and schedule contract renewals.
                    </p>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4" /> HubSpot Sync Active
                </div>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 p-1 bg-slate-950 border border-white/5 rounded-2xl mb-8 overflow-x-auto">
                {[
                    { id: "onboarding", label: "Onboarding & SOPs", icon: UserCheck },
                    { id: "support", label: "Support Queue", icon: LifeBuoy },
                    { id: "health", label: "Health Calculator", icon: Sliders },
                    { id: "renewals", label: "Renewals & Retention", icon: CalendarDays },
                    { id: "kpis", label: "KPIs & Operations Gates", icon: TrendingUp },
                ].map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id as any);
                                addLog(`Changed navigation context to: ${tab.label.toUpperCase()}`);
                            }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === tab.id ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "text-slate-400 hover:text-white"
                            }`}
                        >
                            <Icon className="w-3.5 h-3.5" /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ── Tab 1: Onboarding & SOPs ── */}
            {activeTab === "onboarding" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Onboarding queue */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="glass-card rounded-2xl p-6 border border-border/60">
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <UserCheck className="w-4.5 h-4.5 text-indigo-400" />
                                Active Onboarding Merchants Queue
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                Guide trial merchants through directory API hookups, first campaign drafts, and onboarding SOPs.
                            </p>

                            <div className="space-y-3">
                                {onboarders.map((m) => (
                                    <div key={m.id} className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-slate-200">{m.name}</span>
                                                <span className="text-indigo-400 font-bold font-mono">Step {m.step}/5 ({m.progress}%)</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-red-500 to-indigo-500 transition-all duration-500"
                                                    style={{ width: `${m.progress}%` }} />
                                            </div>
                                            <div className="flex gap-4 text-[9px] text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    {m.emailSent ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />} Welcome Email
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    {m.gbpConnected ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />} Directory Connected
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    {m.campaignSent ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />} Campaign Configured
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            disabled={m.step === 5}
                                            onClick={() => handleAdvanceOnboarding(m.id)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                                                m.step === 5
                                                    ? "bg-slate-950 text-slate-600 border border-white/5 cursor-not-allowed"
                                                    : "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                                            }`}
                                        >
                                            {m.step === 5 ? "Completed" : "Advance Step"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Operational SOPs selector */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <Settings className="w-4.5 h-4.5 text-orange-400" />
                                Operations SOPs script
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                Standard Operating Procedures script reference library.
                            </p>

                            <select
                                value={selectedSOP}
                                onChange={(e) => {
                                    setSelectedSOP(e.target.value);
                                    addLog(`SOP script loaded: ${e.target.value.toUpperCase()}`);
                                }}
                                className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full mb-4"
                            >
                                {Object.keys(sopScripts).map((sop) => (
                                    <option key={sop} value={sop}>{sop}</option>
                                ))}
                            </select>

                            <div className="bg-slate-950/80 rounded-xl p-3.5 border border-white/5 space-y-2">
                                <span className="text-[9px] font-mono text-orange-400 font-bold block uppercase">Active Steps</span>
                                <div className="font-mono text-[10px] text-slate-400 space-y-2">
                                    {sopScripts[selectedSOP].map((step, idx) => (
                                        <div key={idx} className="flex gap-2 items-start">
                                            <span className="text-orange-500 shrink-0 font-bold">{idx + 1}.</span>
                                            <span>{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="text-[9px] text-slate-500 pt-3 border-t border-slate-900 mt-6 font-mono">
                            Referenced from standard ops playbook.
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 2: Support Queue ── */}
            {activeTab === "support" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Support queue columns */}
                    <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-border/60">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <LifeBuoy className="w-4.5 h-4.5 text-violet-400" />
                                Active Help Desk Tickets Queue
                            </h3>
                            <span className="text-[10px] text-slate-500 font-mono">{tickets.filter(t => t.status !== "Resolved").length} Open Tickets</span>
                        </div>

                        <div className="space-y-3">
                            {tickets.map((t) => (
                                <div key={t.id} className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                                    t.status === "Resolved"
                                        ? "bg-slate-950/50 border-white/5 text-slate-600 opacity-60"
                                        : "bg-slate-900 border-white/5 text-slate-300"
                                }`}>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-200 font-mono">{t.id}</span>
                                            <span className="text-xs font-bold text-white">{t.merchant}</span>
                                            <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full ${
                                                t.tier.includes("L1") ? "bg-slate-800 text-slate-400" :
                                                t.tier.includes("L2") ? "bg-blue-500/10 border border-blue-500/20 text-blue-400" :
                                                t.tier.includes("L3") ? "bg-amber-500/10 border border-amber-500/20 text-amber-400 animate-pulse" :
                                                "bg-rose-500/10 border border-rose-500/20 text-rose-400 font-black"
                                            }`}>
                                                {t.tier}
                                            </span>
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-400 mt-1">{t.topic}</p>
                                        <p className="text-[10px] text-slate-500 leading-normal mt-0.5">{t.description}</p>
                                    </div>
                                    
                                    {t.status !== "Resolved" ? (
                                        <div className="inline-flex gap-2 shrink-0">
                                            <button
                                                disabled={t.tier === "Executive Escalation"}
                                                onClick={() => handleEscalateTicket(t.id)}
                                                className={`text-[9px] px-2 py-1 border rounded font-semibold transition-all cursor-pointer ${
                                                    t.tier === "Executive Escalation"
                                                        ? "border-slate-800 text-slate-600 cursor-not-allowed"
                                                        : "border-orange-500/20 hover:border-orange-500/50 text-orange-400 hover:text-white"
                                                }`}
                                            >
                                                Escalate
                                            </button>
                                            <button
                                                onClick={() => handleResolveTicket(t.id)}
                                                className="text-[9px] px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-400 hover:text-white rounded font-bold transition-all cursor-pointer"
                                            >
                                                Resolve
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-emerald-500 font-bold shrink-0">Resolved ✓</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Submit Support Ticket */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <Plus className="w-4.5 h-4.5 text-emerald-400" />
                                File Customer Incident Ticket
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                Route support ticket requests directly to client records.
                            </p>

                            <form onSubmit={handleCreateTicket} className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Merchant Name (e.g. Apex Clinic)"
                                    value={newTicketMerchant}
                                    onChange={(e) => setNewTicketMerchant(e.target.value)}
                                    className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <select
                                        value={newTicketTopic}
                                        onChange={(e) => setNewTicketTopic(e.target.value)}
                                        className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white focus:outline-none"
                                    >
                                        <option value="API Directory connection">API Connection</option>
                                        <option value="Billing Error">Billing Issue</option>
                                        <option value="SMS Campaign Delay">Campaign Bug</option>
                                        <option value="Upgrade requests">Upgrade Request</option>
                                    </select>
                                    <select
                                        value={newTicketTier}
                                        onChange={(e) => setNewTicketTier(e.target.value as any)}
                                        className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white focus:outline-none"
                                    >
                                        <option value="L1 - General">L1 - General</option>
                                        <option value="L2 - Specialist">L2 - Specialist</option>
                                        <option value="L3 - Engineering">L3 - Engineering</option>
                                        <option value="Executive Escalation">Executive</option>
                                    </select>
                                </div>
                                <textarea
                                    rows={3}
                                    placeholder="Incident description..."
                                    value={newTicketDesc}
                                    onChange={(e) => setNewTicketDesc(e.target.value)}
                                    className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none w-full resize-none font-mono"
                                />
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                                >
                                    <Send className="w-3.5 h-3.5" /> Dispatch Ticket Request
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 3: Health Scoring Calculator ── */}
            {activeTab === "health" && (
                <div className="glass-card rounded-2xl p-6 border border-border/60 max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Sliders className="w-4.5 h-4.5 text-cyan-400" />
                            Multi-Vector Health &amp; Upsell Modeler
                        </h3>
                        <span className="text-[10px] text-slate-500 font-mono">Customer adoption &amp; retention health</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6">
                        Evaluate real-time Customer Health Scores to coordinate proactive churn prevention, upsell campaigns, and referral outreach.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {/* Metrics selectors */}
                        <div className="lg:col-span-1 space-y-4">
                            <div>
                                <label className="text-[9px] text-slate-500 block mb-1">Target Merchant</label>
                                <select
                                    value={calcMerchant}
                                    onChange={(e) => setCalcMerchant(e.target.value)}
                                    className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                                >
                                    {onboarders.map(m => (
                                        <option key={m.id} value={m.name}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-400">Login Frequency</span>
                                    <span className="text-white font-bold font-mono">{loginFreq} logins/week</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={loginFreq}
                                    onChange={(e) => setLoginFreq(Number(e.target.value))}
                                    className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-400">Campaign Activity</span>
                                    <span className="text-white font-bold font-mono">{campaignActivity} dispatches/mo</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={campaignActivity}
                                    onChange={(e) => setCampaignActivity(Number(e.target.value))}
                                    className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-400">Review Generation Rate</span>
                                    <span className="text-white font-bold font-mono">{reviewRate} reviews/mo</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={reviewRate}
                                    onChange={(e) => setReviewRate(Number(e.target.value))}
                                    className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[9px] text-slate-500 block mb-1">Open Tickets</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="5"
                                        value={openP1Tickets}
                                        onChange={(e) => setOpenP1Tickets(Number(e.target.value))}
                                        className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none w-full font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] text-slate-500 block mb-1">Billing Status</label>
                                    <select
                                        value={stripeStatus}
                                        onChange={(e) => setStripeStatus(e.target.value as any)}
                                        className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none w-full"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Dunning">Dunning</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Calculated Score Display */}
                        <div className={`lg:col-span-2 p-6 rounded-2xl border flex flex-col md:flex-row gap-6 ${healthColor}`}>
                            <div className="flex-1 flex flex-col justify-between text-center min-h-[220px]">
                                <div>
                                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Aggregate Health Score</span>
                                    <div className="text-6xl font-black font-mono mt-3">{boundedHealthScore}</div>
                                    <span className="text-xs font-bold block mt-2">Band: {healthBand}</span>
                                </div>

                                <div className="space-y-3.5 pt-4 border-t border-white/5">
                                    {boundedHealthScore >= 80 ? (
                                        <>
                                            <span className="text-[10px] block font-semibold leading-normal">Merchant is in the Advocacy phase. Ideal candidate for referrals and upsells.</span>
                                            <button
                                                onClick={() => {
                                                    addLog(`[CS Advocacy] Dispatched referral incentive program invitation to ${calcMerchant}.`);
                                                    addToast("success", "Referral invitation dispatched!");
                                                }}
                                                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-lg shadow-indigo-500/15"
                                            >
                                                Request Referral (Incentives Active)
                                            </button>
                                        </>
                                    ) : boundedHealthScore >= 50 ? (
                                        <>
                                            <span className="text-[10px] block font-semibold leading-normal">Merchant adoption is stable. Monitor usage and run education campaigns.</span>
                                            <button
                                                onClick={() => {
                                                    addLog(`[CS Outreach] Scheduled routine success call with ${calcMerchant}.`);
                                                    addToast("info", "Walkthrough scheduled.");
                                                }}
                                                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-lg shadow-amber-500/15"
                                            >
                                                Schedule Adoption Check
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-[10px] block font-semibold leading-normal animate-pulse">At Churn Risk! Decline in metrics detected. Run targeted CS consultations.</span>
                                            <button
                                                onClick={() => {
                                                    addLog(`[CS Intercept] Urgent CS Churn Intercept Consultation scheduled for ${calcMerchant}.`);
                                                    addToast("error", "CS Intercept Alert Dispatched!");
                                                }}
                                                className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-lg shadow-rose-500/15 animate-bounce"
                                            >
                                                Trigger CS consultation
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Upsell Modeler Panel for healthy customers */}
                            <div className="flex-1 p-4 bg-slate-950/80 border border-white/5 rounded-xl flex flex-col justify-between text-left text-slate-300">
                                <div>
                                    <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> CS Upsell Modeler
                                    </h4>
                                    <div className="space-y-2 text-[10px] font-mono">
                                        <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-white/5">
                                            <input
                                                type="checkbox"
                                                checked={upsellLocations}
                                                onChange={e => setUpsellLocations(e.target.checked)}
                                                className="accent-indigo-500"
                                            />
                                            <span>Additional Locations (+$30/mo)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-white/5">
                                            <input
                                                type="checkbox"
                                                checked={upsellReporting}
                                                onChange={e => setUpsellReporting(e.target.checked)}
                                                className="accent-indigo-500"
                                            />
                                            <span>Premium Reporting (+$20/mo)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-white/5">
                                            <input
                                                type="checkbox"
                                                checked={upsellPrioritySupport}
                                                onChange={e => setUpsellPrioritySupport(e.target.checked)}
                                                className="accent-indigo-500"
                                            />
                                            <span>Priority Support (+$15/mo)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-white/5">
                                            <input
                                                type="checkbox"
                                                checked={upsellAiFeatures}
                                                onChange={e => setUpsellAiFeatures(e.target.checked)}
                                                className="accent-indigo-500"
                                            />
                                            <span>Future AI Features (+$25/mo)</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-white/5 space-y-3">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span>Upsell MRR Added:</span>
                                        <span className="text-indigo-400 font-mono">+${upsellTotal}/mo</span>
                                    </div>
                                    <button
                                        disabled={upsellTotal === 0 || boundedHealthScore < 80}
                                        onClick={() => {
                                            addLog(`[CS Upsell] Executed Contract Upgrade for ${calcMerchant} | Added: +$${upsellTotal}/mo.`);
                                            addToast("success", "Upsell contract executed!");
                                            setUpsellLocations(false);
                                            setUpsellReporting(false);
                                            setUpsellPrioritySupport(false);
                                            setUpsellAiFeatures(false);
                                        }}
                                        className={`w-full py-1.5 rounded text-[10px] font-bold transition-all ${
                                            upsellTotal === 0 || boundedHealthScore < 80
                                                ? "bg-slate-900 border border-white/5 text-slate-500 cursor-not-allowed"
                                                : "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                                        }`}
                                    >
                                        Execute Contract Upsell
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* ── Tab 4: Renewals & QBR Playbook ── */}
            {activeTab === "renewals" && (
                <div className="space-y-6">
                    <div className="glass-card rounded-2xl p-6 border border-border/60">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <CalendarDays className="w-4.5 h-4.5 text-orange-400" />
                                Customer Renewal Pipeline
                            </h3>
                            <span className="text-[10px] text-slate-500 font-mono">90/60/30-day renewal cycle checkpoints</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-6">
                            Monitor contract expiration schedules. Dispatch proactive outreach checkups to secure subscription renewals.
                        </p>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 text-slate-500 font-semibold">
                                        <th className="pb-2">Merchant</th>
                                        <th className="pb-2">Current subscription</th>
                                        <th className="pb-2">Expiration Date</th>
                                        <th className="pb-2">Renewal Stage</th>
                                        <th className="pb-2">Outreach</th>
                                        <th className="pb-2 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renewals.map((r) => (
                                        <tr key={r.id} className="border-b border-white/5 text-slate-300 hover:bg-white/1 font-mono text-[11px]">
                                            <td className="py-3 font-bold text-slate-200">{r.name}</td>
                                            <td className="py-3">{r.plan}</td>
                                            <td className="py-3">{r.date}</td>
                                            <td className="py-3">
                                                <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                    r.stage === "90-Day Review" ? "bg-slate-800 text-slate-400" :
                                                    r.stage === "60-Day Check" ? "bg-blue-500/10 border border-blue-500/20 text-blue-400" :
                                                    r.stage === "30-Day Outreach" ? "bg-amber-500/10 border border-amber-500/20 text-amber-400" :
                                                    "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold"
                                                }`}>
                                                    {r.stage}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                {r.outreachSent ? (
                                                    <span className="text-[10px] text-emerald-400 font-bold">Sent ✓</span>
                                                ) : (
                                                    <span className="text-[10px] text-slate-500">Pending</span>
                                                )}
                                            </td>
                                            <td className="py-3 text-right">
                                                {r.stage !== "Renewed" ? (
                                                    <div className="inline-flex gap-1.5">
                                                        <button
                                                            disabled={r.outreachSent}
                                                            onClick={() => handleSendRenewalOutreach(r.id)}
                                                            className={`text-[9px] px-2 py-0.5 rounded border transition-all cursor-pointer ${
                                                                r.outreachSent
                                                                    ? "border-slate-800 text-slate-600 cursor-not-allowed"
                                                                    : "border-indigo-500/30 text-indigo-400 hover:bg-indigo-600 hover:text-white"
                                                            }`}
                                                        >
                                                            Outreach
                                                        </button>
                                                        <button
                                                            onClick={() => handleConfirmRenewal(r.id)}
                                                            className="text-[9px] bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-400 hover:text-white px-2 py-0.5 rounded transition-all cursor-pointer font-bold"
                                                        >
                                                            Confirm Renewal
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-emerald-500 font-bold">Renewed ✓</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* QBR Scheduler & ROI Dashboard */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* QBR logs */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                    <Clock className="w-4.5 h-4.5 text-indigo-400" /> Quarterly Business Reviews (QBR) Scheduler
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Schedule QBRs, align on business goals, and review optimization recommendations.
                                </p>
                            </div>
                            <div className="space-y-3 font-mono text-[10.5px]">
                                {[
                                    { partner: "Greenwood Med Spa", date: "Q2 QBR - Completed", metrics: "+420 reviews, 4.8★ local SEO ranking improved." },
                                    { partner: "Apex Dental Clinic", date: "Q2 QBR - Scheduled (June 28)", metrics: "Target: Align review capture rate to transaction volume." },
                                    { partner: "Skyline Car Care", date: "Q3 QBR - Pending Setup", metrics: "Focus: Optimize campaign templates text messaging." }
                                ].map((item, idx) => (
                                    <div key={idx} className="p-3 bg-slate-950/60 border border-white/5 rounded-xl text-xs space-y-1">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-slate-200">{item.partner}</span>
                                            <span className="text-[9px] font-bold text-indigo-400">{item.date}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-sans leading-relaxed">{item.metrics}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CS ROI outcome dashboard */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4 flex flex-col justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                    <TrendingUp className="w-4.5 h-4.5 text-emerald-400" /> ROI Outcomes &amp; Value Metrics
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Demonstrated ROI results used to fuel referrals and expansion upsells.
                                </p>
                            </div>
                            <div className="space-y-2.5 text-[11px] text-slate-400 font-mono">
                                <div className="flex justify-between">
                                    <span>Average GBP traffic growth:</span>
                                    <span className="text-white font-bold font-sans">+38% YoY increase</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Review-to-customer conversion:</span>
                                    <span className="text-emerald-400 font-bold">18.4% (Industry Avg: 9%)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Estimated revenue generated / client:</span>
                                    <span className="text-emerald-400 font-bold">+$2,450/month</span>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    addLog("[QBR] Dispatched automated co-branded ROI reports to all active customers.");
                                    addToast("success", "ROI reports sent to merchants.");
                                }}
                                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                            >
                                Dispatch ROI Reports to Merchants
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 5: CS KPIs & Part 13 Gates ── */}
            {activeTab === "kpis" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Left: KPIs widgets */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="glass-card rounded-2xl p-5 border border-border/60 flex items-start justify-between">
                                <div>
                                    <div className="text-2xl font-black text-white mb-1 font-mono">94.8%</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Customer Retention
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-sans">Yearly logo retention rate</p>
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                </div>
                            </div>

                            <div className="glass-card rounded-2xl p-5 border border-border/60 flex items-start justify-between">
                                <div>
                                    <div className="text-2xl font-black text-white mb-1 font-mono">108.5%</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                        <TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> Net Revenue Retention
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-sans">Adoption &amp; expansion indicator</p>
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-indigo-400" />
                                </div>
                            </div>

                            <div className="glass-card rounded-2xl p-5 border border-border/60 flex items-start justify-between">
                                <div>
                                    <div className="text-2xl font-black text-white mb-1 font-mono">92%</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                        <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> CSAT Score
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-sans">Customer satisfaction ratio</p>
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                                    <Star className="w-4 h-4 text-yellow-400 star-filled" />
                                </div>
                            </div>
                        </div>

                        {/* CS Playbook Metrics Card */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                <Info className="w-4 h-4 text-indigo-400" /> Customer Success Adoption Metrics
                            </h4>
                            <p className="text-[10px] text-slate-500 leading-normal mb-4">
                                Strategic KPIs monitoring renewals, upsell expansion velocity, and referral program conversions.
                            </p>
                            <div className="p-4 bg-slate-950/80 border border-white/5 rounded-xl space-y-3 font-mono text-[11px] text-slate-400">
                                <div className="flex justify-between">
                                    <span>Contract Renewal Rate:</span>
                                    <span className="text-emerald-400 font-bold">91.2% (Target: &gt;90%)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Active Upsell Expansion Rate:</span>
                                    <span className="text-emerald-400 font-bold">18.4% of accounts upgraded</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Advocacy Referral Conversion Rate:</span>
                                    <span className="text-emerald-400 font-bold">8.5% referral links shared</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Smart Retry Billing recovery rate:</span>
                                    <span className="text-white font-bold">88.5% of failed card updates</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Part 13 Deliverables checklist */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4.5 h-4.5 text-emerald-400" /> Part 13 Deliverables
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                Toggle gates to approve Customer Success and Playbook milestones.
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
                                <span className="text-slate-400">Part 13 Completion</span>
                                <span className="text-emerald-400 font-bold">{doneDels}/5</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                                    style={{ width: `${(doneDels / deliverables.length) * 100}%` }} />
                            </div>
                            {doneDels === deliverables.length && (
                                <div className="pt-2 flex items-center gap-2 text-emerald-400 text-xs font-bold animate-pulse">
                                    <CheckCircle className="w-4 h-4" /> Part 13 Complete — Customer Success Playbook active!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* General DevOps Terminal Log console */}
            <div className="glass-card rounded-2xl p-6 border border-border/60 mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Terminal className="w-4.5 h-4.5 text-slate-400" />
                        Live Operations &amp; Customer Success Audit Logs
                    </h3>
                    <span className="text-[9px] text-slate-500 font-mono">active connection</span>
                </div>
                <div className="bg-slate-950 rounded-xl p-4 border border-white/5">
                    <div className="h-[140px] overflow-y-auto font-mono text-xs text-slate-400 space-y-2">
                        {opsLogs.map((log, idx) => (
                            <div key={idx} className="flex gap-1.5">
                                <span className="text-red-500 shrink-0">➔</span>
                                <span className={
                                    log.includes("SOP script") || log.includes("Active Steps") ? "text-orange-400" :
                                    log.includes("advanced") || log.includes("CONFIRMED") || log.includes("Resolved") ? "text-emerald-400 font-bold" :
                                    log.includes("outreach") || log.includes("Outreach") ? "text-indigo-400" :
                                    log.includes("Created") ? "text-cyan-400 font-semibold" : ""
                                }>
                                    {log}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
