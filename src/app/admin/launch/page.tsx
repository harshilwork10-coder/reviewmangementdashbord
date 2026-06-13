"use client";

import { useState, useEffect } from "react";
import {
    Rocket, Users, Calendar, Plus, RefreshCw, Check, X, ShieldAlert,
    Briefcase, Sparkles, ChevronRight, Play, Info, Activity, TrendingUp,
    DollarSign, CheckSquare, MessageSquare, Target, ListTodo, CheckCircle,
    UserCheck, Send, BarChart2, Star, AlertCircle, Share2
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface BetaBusiness {
    id: string;
    name: string;
    industry: string;
    discount: string;
    status: "Invited" | "Onboarded" | "Feedback Active" | "Completed";
    contactPerson: string;
}

interface SalesLead {
    id: string;
    name: string;
    source: "Local Outreach" | "Agency Partner" | "Referral" | "Founder Call";
    value: number;
    stage: "Lead" | "Contacted" | "Demo Scheduled" | "Closed Won";
}

interface FeedbackItem {
    id: string;
    business: string;
    comment: string;
    rating: number;
    status: "Pending" | "Escalated" | "Addressed";
}

interface ToastMessage {
    id: string;
    type: "success" | "warning" | "error" | "info";
    text: string;
}

export default function SuperAdminLaunchPage() {
    const [activeTab, setActiveTab] = useState<"beta" | "gtm" | "pipeline" | "checklists" | "kpis">("beta");

    // General Audit Log state
    const [launchLogs, setLaunchLogs] = useState<string[]>([
        "[INFO] Go-To-Market and Launch Control Center active.",
        "[INFO] Target Launch Milestone: 100 Paying Businesses | initial $10k MRR goal.",
        "[AUDIT] Pre-launch security audits, encryption gates, and Stripe sandbox pipelines verified."
    ]);

    const addLog = (msg: string) => {
        const time = new Date().toLocaleTimeString();
        setLaunchLogs(prev => [`[${time}] ${msg}`, ...prev]);
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

    // ── Tab 1: Beta Program States ──
    const [internalTesting, setInternalTesting] = useState([
        { id: "it_1", label: "Founder self-onboarding verification", checked: true },
        { id: "it_2", label: "Team billing & Stripe sandbox testing", checked: true },
        { id: "it_3", label: "SMS queue dispatch latency check", checked: true },
        { id: "it_4", label: "AI reply engine tone model checks", checked: false },
        { id: "it_5", label: "Super Admin audit logs accessibility", checked: false },
    ]);

    const [betaBusinesses, setBetaBusinesses] = useState<BetaBusiness[]>([
        { id: "BB-01", name: "Apex Dental Clinic", industry: "Healthcare", discount: "50% Lifetime", status: "Feedback Active", contactPerson: "Dr. Sarah Jenkins" },
        { id: "BB-02", name: "Gourmet Bistro", industry: "Restaurant", discount: "Free for 6 Months", status: "Onboarded", contactPerson: "Chef Marco" },
        { id: "BB-03", name: "Elite Fitness Gym", industry: "Retail/Health", discount: "30% Lifetime", status: "Completed", contactPerson: "Ryan Reynolds" },
        { id: "BB-04", name: "Downtown Law Group", industry: "Professional Services", discount: "20% Lifetime", status: "Invited", contactPerson: "Harvey Specter" },
    ]);

    const [newBetaName, setNewBetaName] = useState("");
    const [newBetaIndustry, setNewBetaIndustry] = useState("Healthcare");
    const [newBetaDiscount, setNewBetaDiscount] = useState("30% Lifetime");
    const [newBetaContact, setNewBetaContact] = useState("");

    // Open Beta Simulator
    const [openBetaCount, setOpenBetaCount] = useState(12);
    const [openBetaTarget, setOpenBetaTarget] = useState(35);
    const [csatScore, setCsatScore] = useState(88);
    const [simulatingBeta, setSimulatingBeta] = useState(false);

    const handleAddBetaBusiness = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBetaName || !newBetaContact) {
            addToast("warning", "Please provide a business name and contact name.");
            return;
        }
        const newBusiness: BetaBusiness = {
            id: `BB-0${betaBusinesses.length + 1}`,
            name: newBetaName,
            industry: newBetaIndustry,
            discount: newBetaDiscount,
            status: "Invited",
            contactPerson: newBetaContact
        };
        setBetaBusinesses(prev => [...prev, newBusiness]);
        addLog(`Closed Beta invitation sent to: ${newBetaName} (${newBetaContact}).`);
        addToast("success", `Invited ${newBetaName} to Closed Beta!`);
        setNewBetaName("");
        setNewBetaContact("");
    };

    const handleUpdateBetaStatus = (id: string, nextStatus: BetaBusiness["status"]) => {
        setBetaBusinesses(prev => prev.map(b => {
            if (b.id === id) {
                addLog(`Closed Beta status update: ${b.name} ➔ ${nextStatus}.`);
                return { ...b, status: nextStatus };
            }
            return b;
        }));
        addToast("success", "Beta participant updated.");
    };

    const simulateSelfOnboarding = () => {
        if (simulatingBeta) return;
        setSimulatingBeta(true);
        addLog("[Open Beta] Running organic self-onboarding campaign simulation...");
        addToast("info", "Starting Open Beta simulator...");

        let currentIncrement = 0;
        const interval = setInterval(() => {
            setOpenBetaCount(prev => {
                if (prev >= openBetaTarget) {
                    clearInterval(interval);
                    setSimulatingBeta(false);
                    addLog(`[Open Beta] Simulation complete. Onboarded count scaled to target of ${openBetaTarget}.`);
                    addToast("success", "Open Beta target scaled successfully!");
                    return prev;
                }
                const step = Math.min(2, openBetaTarget - prev);
                currentIncrement += step;
                addLog(`[Open Beta] Simulated ${step} new self-onboarded business(es) from SEO inbound.`);
                return prev + step;
            });
            setCsatScore(prev => Math.min(100, Math.max(80, prev + (Math.random() > 0.5 ? 1 : -1))));
        }, 1200);
    };

    // ── Tab 2: GTM & Campaigns States ──
    const [campaignLogs, setCampaignLogs] = useState<string[]>([]);
    const [campaignRunning, setCampaignRunning] = useState<string | null>(null);
    const [projectedTraffic, setProjectedTraffic] = useState(250);
    const [projectedLeads, setProjectedLeads] = useState(48);

    const handleRunCampaign = (channel: string) => {
        if (campaignRunning) return;
        setCampaignRunning(channel);
        addLog(`[GTM Campaign] Starting outreach broadcast campaign: ${channel}.`);
        addToast("info", `Deploying campaign: ${channel}...`);
        
        setCampaignLogs([`[0.0s] Connecting to broadcast gateway for: ${channel}...`]);

        setTimeout(() => {
            setCampaignLogs(prev => [...prev, `[1.2s] Inbound list sharded. Parsing 500 targeted contacts.`]);
            setTimeout(() => {
                setCampaignLogs(prev => [...prev, `[2.5s] Dispensing personalized messages. Insertion tags verified.`]);
                setTimeout(() => {
                    const extraTraffic = Math.floor(80 + Math.random() * 60);
                    const extraLeads = Math.floor(10 + Math.random() * 8);
                    setProjectedTraffic(prev => prev + extraTraffic);
                    setProjectedLeads(prev => prev + extraLeads);
                    setCampaignRunning(null);
                    setCampaignLogs(prev => [
                        ...prev,
                        `[3.8s] BROADCAST SUCCESSFUL.`,
                        `[GTM RESULT] Channel: ${channel} | New Clicks: +${extraTraffic} | New Registrations: +${extraLeads}`
                    ]);
                    addLog(`[GTM Campaign] Broadcast completed for ${channel}. Traffic: +${extraTraffic}, Leads: +${extraLeads}`);
                    addToast("success", `Campaign ${channel} completed successfully!`);
                }, 1200);
            }, 1200);
        }, 1200);
    };

    // ── Tab 3: First 100 Pipeline States ──
    const [salesPipeline, setSalesPipeline] = useState<SalesLead[]>([
        { id: "LD-01", name: "Greenwood Med Spa", source: "Local Outreach", value: 79, stage: "Demo Scheduled" },
        { id: "LD-02", name: "Skyline SEO Agency", source: "Agency Partner", value: 199, stage: "Closed Won" },
        { id: "LD-03", name: "Grand Luxe Hotel", source: "Founder Call", value: 299, stage: "Contacted" },
        { id: "LD-04", name: "True Blue Plumbing", source: "Referral", value: 29, stage: "Lead" },
        { id: "LD-05", name: "Pristine Dental Care", source: "Local Outreach", value: 79, stage: "Closed Won" },
    ]);

    const [newLeadName, setNewLeadName] = useState("");
    const [newLeadSource, setNewLeadSource] = useState<SalesLead["source"]>("Local Outreach");
    const [newLeadValue, setNewLeadValue] = useState(79);

    const handleAddLead = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLeadName) {
            addToast("warning", "Please provide a lead business name.");
            return;
        }
        const newLead: SalesLead = {
            id: `LD-0${salesPipeline.length + 1}`,
            name: newLeadName,
            source: newLeadSource,
            value: newLeadValue,
            stage: "Lead"
        };
        setSalesPipeline(prev => [...prev, newLead]);
        addLog(`[Pipeline] New lead captured: ${newLeadName} | Value: $${newLeadValue}/mo.`);
        addToast("success", `Added lead: ${newLeadName}`);
        setNewLeadName("");
    };

    const handleMoveLead = (id: string, direction: "forward" | "backward") => {
        const stages: SalesLead["stage"][] = ["Lead", "Contacted", "Demo Scheduled", "Closed Won"];
        setSalesPipeline(prev => prev.map(lead => {
            if (lead.id === id) {
                const currentIdx = stages.indexOf(lead.stage);
                let nextIdx = currentIdx;
                if (direction === "forward" && currentIdx < stages.length - 1) {
                    nextIdx = currentIdx + 1;
                } else if (direction === "backward" && currentIdx > 0) {
                    nextIdx = currentIdx - 1;
                }
                const nextStage = stages[nextIdx];
                if (nextStage !== lead.stage) {
                    addLog(`[Pipeline] Lead ${lead.name} moved: ${lead.stage} ➔ ${nextStage}.`);
                    if (nextStage === "Closed Won") {
                        addToast("success", `Deal closed! $${lead.value}/mo MRR added! 🎉`);
                    }
                }
                return { ...lead, stage: nextStage };
            }
            return lead;
        }));
    };

    // Calculate customer pipelines
    const closedDealsCount = salesPipeline.filter(l => l.stage === "Closed Won").length;
    const currentOnboardedCustomers = openBetaCount + closedDealsCount;

    // ── Tab 4: Launch Checklists States ──
    const [salesChecklist, setSalesChecklist] = useState([
        { id: "sc_1", label: "Proposal decks & templates finalized", checked: true },
        { id: "sc_2", label: "Mock Demo environment fully seeded", checked: true },
        { id: "sc_3", label: "Stripe pricing configurations validated", checked: true },
        { id: "sc_4", label: "Internal CRM pipeline stages mapped", checked: false },
        { id: "sc_5", label: "Sales outreach KPIs and templates configured", checked: false },
    ]);

    const [marketingChecklist, setMarketingChecklist] = useState([
        { id: "mc_1", label: "Core public landing pages published", checked: true },
        { id: "mc_2", label: "First 30 days content marketing calendar active", checked: false },
        { id: "mc_3", label: "Closed Beta case study drafts prepared", checked: false },
        { id: "mc_4", label: "Onboarding and dunning email flows configured", checked: true },
        { id: "mc_5", label: "Conversion trackers and SEO site index complete", checked: false },
    ]);

    const toggleSalesChecklist = (id: string) => {
        setSalesChecklist(prev => prev.map(item => {
            if (item.id === id) {
                const nextVal = !item.checked;
                addLog(`[Checklist] Sales Gate: ${item.label} toggled to ${nextVal ? "COMPLETED" : "PENDING"}`);
                return { ...item, checked: nextVal };
            }
            return item;
        }));
    };

    const toggleMarketingChecklist = (id: string) => {
        setMarketingChecklist(prev => prev.map(item => {
            if (item.id === id) {
                const nextVal = !item.checked;
                addLog(`[Checklist] Marketing Gate: ${item.label} toggled to ${nextVal ? "COMPLETED" : "PENDING"}`);
                return { ...item, checked: nextVal };
            }
            return item;
        }));
    };

    // Overall Readiness calculations
    const totalChecklistItems = salesChecklist.length + marketingChecklist.length;
    const checkedChecklistItems = salesChecklist.filter(c => c.checked).length + marketingChecklist.filter(c => c.checked).length;
    const readinessPercentage = Math.round((checkedChecklistItems / totalChecklistItems) * 100);

    // ── Tab 5: Launch KPIs & Feedback States ──
    const [trialSignups, setTrialSignups] = useState(84);
    const [trialConversions, setTrialConversions] = useState(16.5); // %
    const [projectedMRR, setProjectedMRR] = useState(3150); // $

    // Customer Feedback Board
    const [feedbackBoard, setFeedbackBoard] = useState<FeedbackItem[]>([
        { id: "FB-01", business: "Apex Dental Clinic", comment: "Need custom domains mapping for client white-label portals.", rating: 4, status: "Pending" },
        { id: "FB-02", business: "Elite Fitness Gym", comment: "The AI reply tonality customization saves our front desk 2 hours a day.", rating: 5, status: "Addressed" },
        { id: "FB-03", business: "Gourmet Bistro", comment: "Billing setup was super clean, but we want an invoice history panel.", rating: 4, status: "Pending" },
    ]);

    const handleEscalateFeedback = (id: string) => {
        setFeedbackBoard(prev => prev.map(item => {
            if (item.id === id) {
                addLog(`[Feedback] Escalaned request from ${item.business} to product Roadmap: "${item.comment}"`);
                addToast("success", `Feedback from ${item.business} escalated to Sprint backlog.`);
                return { ...item, status: "Escalated" };
            }
            return item;
        }));
    };

    // Calculate dynamic MRR based on Closed Won pipeline deals & Open Beta scale
    useEffect(() => {
        const closedValue = salesPipeline
            .filter(l => l.stage === "Closed Won")
            .reduce((acc, curr) => acc + curr.value, 0);
        // Assume beta active converted users pay an average of $59/mo
        const betaConvertedCount = Math.floor(openBetaCount * 0.15); // 15% conversion rate
        const calculatedMRR = closedValue + (betaConvertedCount * 59);
        setProjectedMRR(calculatedMRR);
    }, [salesPipeline, openBetaCount]);

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
                        {toast.type === "warning" && <AlertCircle className="w-4 h-4 shrink-0" />}
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
                        <Rocket className="w-6 h-6 text-red-500 animate-float" />
                        Go-To-Market &amp; Launch Console
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Platform launch and GTM control center. Execute testing phases, trigger marketing sequences, monitor sales lead conversions, and track early product launch readiness metrics.
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Launch Readiness</span>
                        <span className="text-sm font-black text-indigo-400">{readinessPercentage}% Complete</span>
                    </div>
                    <div className="w-20 h-2 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-indigo-500 transition-all duration-500"
                            style={{ width: `${readinessPercentage}%` }} />
                    </div>
                </div>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 p-1 bg-slate-950 border border-white/5 rounded-2xl mb-8 overflow-x-auto">
                {[
                    { id: "beta", label: "Beta Program", icon: Users },
                    { id: "gtm", label: "GTM Campaigns", icon: Share2 },
                    { id: "pipeline", label: "First 100 Pipeline", icon: Target },
                    { id: "checklists", label: "Launch Readiness", icon: ListTodo },
                    { id: "kpis", label: "KPIs & Feedback", icon: TrendingUp },
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

            {/* ── Tab 1: Beta Program ── */}
            {activeTab === "beta" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Internal testing checkoff */}
                        <div className="glass-card rounded-2xl p-5 border border-border/60 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                    <CheckSquare className="w-4 h-4 text-orange-400" /> Phase 1: Internal Testing
                                </h3>
                                <p className="text-[10px] text-slate-500 mb-4 leading-normal">
                                    Ensure internal smoke testing protocols are signed off by developers and founders.
                                </p>
                                <div className="space-y-2.5">
                                    {internalTesting.map((step) => (
                                        <button
                                            key={step.id}
                                            onClick={() => {
                                                setInternalTesting(prev => prev.map(s => {
                                                    if (s.id === step.id) {
                                                        const nextVal = !s.checked;
                                                        addLog(`[Internal Testing] ${s.label} toggled to ${nextVal ? "PASSED" : "PENDING"}`);
                                                        addToast("success", "Testing gate status updated.");
                                                        return { ...s, checked: nextVal };
                                                    }
                                                    return s;
                                                }));
                                            }}
                                            className={`w-full p-2.5 rounded-xl border text-left text-[11px] flex items-center justify-between gap-3 cursor-pointer transition-all ${
                                                step.checked ? "bg-orange-500/10 border-orange-500/20 text-orange-200" : "bg-slate-900 border-white/5 text-slate-500"
                                            }`}
                                        >
                                            <span>{step.label}</span>
                                            <div className={`w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center ${
                                                step.checked ? "bg-orange-500 border-orange-500 text-white" : "bg-slate-950 border-slate-700"
                                            }`}>
                                                {step.checked && <Check className="w-2.5 h-2.5" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-3 border-t border-slate-900 text-[9px] text-slate-500 font-mono mt-4">
                                Status: {internalTesting.filter(s => s.checked).length === 5 ? "Fully Cleared" : "Testing In-Progress"}
                            </div>
                        </div>

                        {/* Open Beta Simulator */}
                        <div className="glass-card rounded-2xl p-5 border border-border/60 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                    <Activity className="w-4 h-4 text-indigo-400" /> Phase 3: Open Beta Scaling
                                </h3>
                                <p className="text-[10px] text-slate-500 mb-4 leading-normal">
                                    Simulate self-serve customer onboarding channels scaling to target limits.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400">Target Businesses:</span>
                                        <span className="text-white font-bold font-mono">{openBetaTarget} Locations</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10"
                                        max="60"
                                        value={openBetaTarget}
                                        onChange={(e) => setOpenBetaTarget(Number(e.target.value))}
                                        disabled={simulatingBeta}
                                        className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                    <div className="p-3 bg-slate-950/80 rounded-xl border border-white/5 grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <span className="text-[9px] text-slate-500 uppercase font-bold block">Onboarded</span>
                                            <span className="text-lg font-black text-indigo-400 font-mono">{openBetaCount}</span>
                                        </div>
                                        <div>
                                            <span className="text-[9px] text-slate-500 uppercase font-bold block">Avg CSAT Score</span>
                                            <span className="text-lg font-black text-emerald-400 font-mono">{csatScore}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                disabled={simulatingBeta || openBetaCount >= openBetaTarget}
                                onClick={simulateSelfOnboarding}
                                className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all mt-4 ${
                                    simulatingBeta || openBetaCount >= openBetaTarget
                                        ? "bg-slate-900 text-slate-600 border border-white/5 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-lg shadow-indigo-600/20"
                                }`}
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${simulatingBeta ? "animate-spin" : ""}`} />
                                {simulatingBeta ? "Onboarding Inbounds..." : "Simulate Inbound Scaling"}
                            </button>
                        </div>

                        {/* Add closed beta business */}
                        <div className="glass-card rounded-2xl p-5 border border-border/60 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                    <Plus className="w-4 h-4 text-emerald-400" /> Recruit Beta Client
                                </h3>
                                <p className="text-[10px] text-slate-500 mb-4 leading-normal">
                                    Invite a new local merchant to the Closed Beta discount tier program.
                                </p>
                                <form onSubmit={handleAddBetaBusiness} className="space-y-2.5">
                                    <input
                                        type="text"
                                        placeholder="Business Name (e.g. Oak Dental)"
                                        value={newBetaName}
                                        onChange={(e) => setNewBetaName(e.target.value)}
                                        className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <select
                                            value={newBetaIndustry}
                                            onChange={(e) => setNewBetaIndustry(e.target.value)}
                                            className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white focus:outline-none"
                                        >
                                            <option value="Healthcare">Healthcare</option>
                                            <option value="Restaurant">Restaurant</option>
                                            <option value="Retail">Retail</option>
                                            <option value="Services">Services</option>
                                        </select>
                                        <select
                                            value={newBetaDiscount}
                                            onChange={(e) => setNewBetaDiscount(e.target.value)}
                                            className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white focus:outline-none"
                                        >
                                            <option value="30% Lifetime">30% Lifetime</option>
                                            <option value="50% Lifetime">50% Lifetime</option>
                                            <option value="Free for 6 Months">Free for 6 Months</option>
                                        </select>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Contact Name (e.g. Jane Doe)"
                                        value={newBetaContact}
                                        onChange={(e) => setNewBetaContact(e.target.value)}
                                        className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                                    >
                                        <Send className="w-3 h-3" /> Send Closed Invitation
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Closed Beta list */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <UserCheck className="w-4.5 h-4.5 text-emerald-400" />
                                Phase 2: Closed Beta Recruits Pipeline
                            </h3>
                            <span className="text-[10px] text-slate-500 font-mono">5-10 business recruitment targets</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 text-slate-500 font-semibold">
                                        <th className="pb-2">Merchant Name</th>
                                        <th className="pb-2">Industry</th>
                                        <th className="pb-2">Discount Incentive</th>
                                        <th className="pb-2">Contact Person</th>
                                        <th className="pb-2">Operational State</th>
                                        <th className="pb-2 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {betaBusinesses.map((b) => (
                                        <tr key={b.id} className="border-b border-white/5 text-slate-300 hover:bg-white/1 font-mono text-[11px]">
                                            <td className="py-3 font-bold text-slate-200">{b.name}</td>
                                            <td className="py-3">{b.industry}</td>
                                            <td className="py-3 text-orange-400">{b.discount}</td>
                                            <td className="py-3">{b.contactPerson}</td>
                                            <td className="py-3">
                                                <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                    b.status === "Invited" ? "bg-slate-800 text-slate-400" :
                                                    b.status === "Onboarded" ? "bg-blue-500/10 border border-blue-500/20 text-blue-400" :
                                                    b.status === "Feedback Active" ? "bg-amber-500/10 border border-amber-500/20 text-amber-400 animate-pulse" :
                                                    "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                                }`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="py-3 text-right">
                                                <div className="inline-flex gap-1.5">
                                                    {b.status === "Invited" && (
                                                        <button
                                                            onClick={() => handleUpdateBetaStatus(b.id, "Onboarded")}
                                                            className="text-[9px] bg-indigo-600/25 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 hover:text-white px-2 py-0.5 rounded transition-all cursor-pointer"
                                                        >
                                                            Onboard
                                                        </button>
                                                    )}
                                                    {b.status === "Onboarded" && (
                                                        <button
                                                            onClick={() => handleUpdateBetaStatus(b.id, "Feedback Active")}
                                                            className="text-[9px] bg-amber-600/25 hover:bg-amber-600 border border-amber-500/30 text-amber-300 hover:text-white px-2 py-0.5 rounded transition-all cursor-pointer"
                                                        >
                                                            Collect Feedback
                                                        </button>
                                                    )}
                                                    {b.status === "Feedback Active" && (
                                                        <button
                                                            onClick={() => handleUpdateBetaStatus(b.id, "Completed")}
                                                            className="text-[9px] bg-emerald-600/25 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white px-2 py-0.5 rounded transition-all cursor-pointer"
                                                        >
                                                            Sign Off
                                                        </button>
                                                    )}
                                                    {b.status === "Completed" && (
                                                        <span className="text-[9px] text-slate-500">Completed ✓</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 2: GTM Campaigns ── */}
            {activeTab === "gtm" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Campaign channels list */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="glass-card rounded-2xl p-6 border border-border/60">
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <Share2 className="w-4.5 h-4.5 text-indigo-400" />
                                Go-To-Market Multi-Channel Campaigns
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                Dispatch promotional assets and launch templates across outbound networks to boost trial acquisitions.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: "linkedin", name: "LinkedIn Announcement", desc: "Founders personal social network broadcast targeting regional business managers.", icon: Target, accent: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                                    { id: "cold_email", name: "Email Marketing Sequences", desc: "Automated cold outreach campaigns sharded across local SEO business lists.", icon: Send, accent: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
                                    { id: "referrals", name: "Referral Program Activation", desc: "Launch existing user free-month incentive links inside merchant portfolios.", icon: Sparkles, accent: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
                                    { id: "partner_outreach", name: "Partner SEO Agencies", desc: "Bulk direct package discounts pitched to independent digital marketing agencies.", icon: Briefcase, accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" }
                                ].map((c) => {
                                    const Icon = c.icon;
                                    return (
                                        <div key={c.id} className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col justify-between h-[150px] hover:border-white/10 transition-all">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <div className={`p-1.5 rounded ${c.accent}`}>
                                                        <Icon className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-200">{c.name}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 leading-normal">{c.desc}</p>
                                            </div>
                                            <button
                                                disabled={campaignRunning !== null}
                                                onClick={() => handleRunCampaign(c.name)}
                                                className={`w-full py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
                                                    campaignRunning === c.name
                                                        ? "bg-slate-950 text-slate-500 border border-white/5 cursor-not-allowed"
                                                        : campaignRunning !== null
                                                        ? "bg-slate-950 text-slate-600 border border-white/5 cursor-not-allowed"
                                                        : "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                                                }`}
                                            >
                                                {campaignRunning === c.name ? "Broadcasting..." : "Deploy Campaign Broadcast"}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right: Broadcast emulator output */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <Activity className="w-4.5 h-4.5 text-orange-400" />
                                Outreach Broadcast Logs
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                Monitoring live payload dispatches and simulated recipient interaction.
                            </p>

                            <div className="bg-slate-950 rounded-xl p-3.5 border border-white/5 h-[170px] overflow-y-auto">
                                <div className="font-mono text-[10px] text-slate-400 space-y-1.5">
                                    {campaignLogs.length === 0 ? (
                                        <div className="text-slate-600 italic">Awaiting GTM campaign execution trigger...</div>
                                    ) : (
                                        campaignLogs.map((log, idx) => (
                                            <div key={idx} className="flex gap-1.5">
                                                <span className="text-indigo-400 shrink-0">➔</span>
                                                <span className={log.includes("RESULT") ? "text-emerald-400 font-bold" : ""}>{log}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-900 mt-6 grid grid-cols-2 gap-4 text-center">
                            <div>
                                <span className="text-[9px] text-slate-500 uppercase font-bold block">Inbound Clicks</span>
                                <span className="text-lg font-black text-indigo-400 font-mono">{projectedTraffic}</span>
                            </div>
                            <div>
                                <span className="text-[9px] text-slate-500 uppercase font-bold block">Simulated Registrations</span>
                                <span className="text-lg font-black text-emerald-400 font-mono">+{projectedLeads}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 3: First 100 Pipeline ── */}
            {activeTab === "pipeline" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Summary Widget */}
                        <div className="glass-card rounded-2xl p-5 border border-border/60 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                    <Target className="w-4 h-4 text-indigo-400" /> First 100 Goal
                                </h3>
                                <p className="text-[10px] text-slate-500 mb-4 leading-normal">
                                    Track converted clients against our first 100 paying customers milestone.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-2xl font-black text-white font-mono">{currentOnboardedCustomers} / 100</span>
                                        <span className="text-xs text-slate-400 font-bold">Closed Won &amp; Beta</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                                            style={{ width: `${Math.min(100, (currentOnboardedCustomers / 100) * 100)}%` }} />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-slate-900 text-[9px] text-slate-500 mt-4">
                                Average Customer value: $59 - $199/mo.
                            </div>
                        </div>

                        {/* Add Lead Form */}
                        <div className="glass-card rounded-2xl p-5 border border-border/60 lg:col-span-3 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                    <Plus className="w-4 h-4 text-emerald-400" /> Capture Sales Lead
                                </h3>
                                <p className="text-[10px] text-slate-500 mb-3 leading-normal">
                                    Add a local prospect targeted for direct, founder-led demo pitches.
                                </p>
                                <form onSubmit={handleAddLead} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <div className="md:col-span-2">
                                        <input
                                            type="text"
                                            placeholder="Lead Business Name (e.g. Skyline Car Care)"
                                            value={newLeadName}
                                            onChange={(e) => setNewLeadName(e.target.value)}
                                            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none w-full font-mono"
                                        />
                                    </div>
                                    <div>
                                        <select
                                            value={newLeadSource}
                                            onChange={(e) => setNewLeadSource(e.target.value as any)}
                                            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none w-full"
                                        >
                                            <option value="Local Outreach">Local Outreach</option>
                                            <option value="Agency Partner">Agency Partner</option>
                                            <option value="Referral">Referral</option>
                                            <option value="Founder Call">Founder Call</option>
                                        </select>
                                    </div>
                                    <div>
                                        <select
                                            value={newLeadValue}
                                            onChange={(e) => setNewLeadValue(Number(e.target.value))}
                                            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none w-full font-mono"
                                        >
                                            <option value={29}>Starter ($29/mo)</option>
                                            <option value={79}>Growth ($79/mo)</option>
                                            <option value={199}>Agency ($199/mo)</option>
                                            <option value={299}>Enterprise ($299/mo)</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-4 flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/15"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Capture Lead
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Sales Pipelines Stages columns */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {(["Lead", "Contacted", "Demo Scheduled", "Closed Won"] as const).map((stage) => {
                            const stageLeads = salesPipeline.filter(l => l.stage === stage);
                            return (
                                <div key={stage} className="glass-card rounded-2xl p-4 border border-border/60 flex flex-col justify-between min-h-[350px]">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold text-slate-400 capitalize">{stage}</span>
                                            <span className="text-[10px] bg-slate-950 border border-white/5 text-slate-300 px-1.5 py-0.2 rounded-full font-bold">{stageLeads.length}</span>
                                        </div>
                                        
                                        <div className="space-y-2.5 max-h-[320px] overflow-y-auto">
                                            {stageLeads.map((lead) => (
                                                <div key={lead.id} className="p-3 bg-slate-950/70 border border-white/5 rounded-xl text-left flex flex-col justify-between gap-2">
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-200 truncate">{lead.name}</div>
                                                        <div className="flex justify-between items-center mt-1">
                                                            <span className="text-[8px] text-slate-500 font-mono">{lead.source}</span>
                                                            <span className="text-[10px] text-emerald-400 font-bold font-mono">${lead.value}/mo</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex justify-between pt-1 border-t border-white/5">
                                                        <button
                                                            disabled={stage === "Lead"}
                                                            onClick={() => handleMoveLead(lead.id, "backward")}
                                                            className={`text-[9px] px-1 hover:text-white transition-colors cursor-pointer ${
                                                                stage === "Lead" ? "text-slate-700 cursor-not-allowed" : "text-slate-500"
                                                            }`}
                                                        >
                                                            ◀ Back
                                                        </button>
                                                        <button
                                                            disabled={stage === "Closed Won"}
                                                            onClick={() => handleMoveLead(lead.id, "forward")}
                                                            className={`text-[9px] px-1 hover:text-white transition-colors cursor-pointer ${
                                                                stage === "Closed Won" ? "text-slate-700 cursor-not-allowed" : "text-slate-500"
                                                            }`}
                                                        >
                                                            Next ▶
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="text-[8px] text-slate-600 font-mono pt-3 border-t border-slate-900 text-center">
                                        Value: ${stageLeads.reduce((acc, curr) => acc + curr.value, 0)}/mo
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Tab 4: Launch Checklists ── */}
            {activeTab === "checklists" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sales Checklist */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Briefcase className="w-4.5 h-4.5 text-orange-400" />
                                    Sales GTM Checklist
                                </h3>
                                <span className="text-[10px] bg-orange-500/10 border border-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-bold">
                                    {salesChecklist.filter(c => c.checked).length} / {salesChecklist.length} Checked
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                Establish proposal presentations, localized pricing pipelines, and CRM systems.
                            </p>

                            <div className="space-y-3">
                                {salesChecklist.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => toggleSalesChecklist(item.id)}
                                        className={`w-full p-3.5 rounded-xl border text-left text-xs flex items-center justify-between gap-3 cursor-pointer transition-all ${
                                            item.checked
                                                ? "bg-orange-500/10 border-orange-500/30 text-white"
                                                : "bg-slate-900 border-white/5 text-slate-500 hover:border-white/10"
                                        }`}
                                    >
                                        <span className="font-semibold">{item.label}</span>
                                        <div className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center ${
                                            item.checked ? "bg-orange-500 border-orange-500" : "bg-slate-950 border-slate-700"
                                        }`}>
                                            {item.checked && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-900 mt-6 text-[10px] text-slate-500">
                            Updates live readiness metric weights automatically.
                        </div>
                    </div>

                    {/* Marketing Checklist */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
                                    Marketing GTM Checklist
                                </h3>
                                <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold">
                                    {marketingChecklist.filter(c => c.checked).length} / {marketingChecklist.length} Checked
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                Publish search-optimized landing pages, setup email dunning workflows, and configure analytics.
                            </p>

                            <div className="space-y-3">
                                {marketingChecklist.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => toggleMarketingChecklist(item.id)}
                                        className={`w-full p-3.5 rounded-xl border text-left text-xs flex items-center justify-between gap-3 cursor-pointer transition-all ${
                                            item.checked
                                                ? "bg-indigo-500/10 border-indigo-500/30 text-white"
                                                : "bg-slate-900 border-white/5 text-slate-500 hover:border-white/10"
                                        }`}
                                    >
                                        <span className="font-semibold">{item.label}</span>
                                        <div className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center ${
                                            item.checked ? "bg-indigo-500 border-indigo-500" : "bg-slate-950 border-slate-700"
                                        }`}>
                                            {item.checked && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-900 mt-6 text-[10px] text-slate-500">
                            Confirm and publish inbound marketing resources.
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 5: KPIs & Feedback ── */}
            {activeTab === "kpis" && (
                <div className="space-y-6">
                    {/* Launch metrics dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="glass-card rounded-2xl p-5 border border-border/60 flex items-start justify-between">
                            <div>
                                <div className="text-2xl font-black text-white mb-1 font-mono">{trialSignups}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5 text-violet-400" /> Trial Signups
                                </div>
                                <p className="text-[10px] text-slate-500">Total organic signup trials</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-violet-400" />
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-5 border border-border/60 flex items-start justify-between">
                            <div>
                                <div className="text-2xl font-black text-white mb-1 font-mono">{trialConversions}%</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                    <BarChart2 className="w-3.5 h-3.5 text-cyan-400" /> Trial Conversion
                                </div>
                                <p className="text-[10px] text-slate-500">Paid subscription transitions</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-cyan-400" />
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-5 border border-border/60 flex items-start justify-between">
                            <div>
                                <div className="text-2xl font-black text-white mb-1 font-mono">${projectedMRR}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Monthly Revenue
                                </div>
                                <p className="text-[10px] text-slate-500">Active monthly recurring rate</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-emerald-400" />
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-5 border border-border/60 flex items-start justify-between">
                            <div>
                                <div className="text-2xl font-black text-white mb-1 font-mono">{csatScore}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 text-yellow-400" /> Promoter Score (NPS)
                                </div>
                                <p className="text-[10px] text-slate-500">Beta customer loyalty ratio</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                                <Star className="w-4 h-4 text-yellow-400 star-filled" />
                            </div>
                        </div>
                    </div>

                    {/* Feedback board & Roadmap priority triggers */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <MessageSquare className="w-4.5 h-4.5 text-emerald-400" />
                                Customer Feedback &amp; Product Roadmapping
                            </h3>
                            <span className="text-[10px] text-slate-500 font-mono">Simulate customer feedback loops</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-6">
                            Review qualitative reports from beta participants. Click "Escalate to Roadmap" to push items directly into the product sprint backlog.
                        </p>

                        <div className="space-y-3">
                            {feedbackBoard.map((item) => (
                                <div key={item.id} className="p-4 rounded-xl bg-slate-950/70 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-slate-200">{item.business}</span>
                                            <div className="flex gap-0.5">
                                                {Array.from({ length: 5 }).map((_, idx) => (
                                                    <Star key={idx} className={`w-3 h-3 ${idx < item.rating ? "text-yellow-400 star-filled" : "text-slate-700"}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-slate-400 italic">"{item.comment}"</p>
                                    </div>
                                    <div className="shrink-0 flex items-center gap-3">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            item.status === "Pending" ? "bg-slate-800 text-slate-400" :
                                            item.status === "Escalated" ? "bg-indigo-500/15 border border-indigo-500/30 text-indigo-400" :
                                            "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                                        }`}>
                                            {item.status}
                                        </span>
                                        {item.status === "Pending" && (
                                            <button
                                                onClick={() => handleEscalateFeedback(item.id)}
                                                className="text-[10px] bg-emerald-600/25 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white px-2.5 py-1 rounded transition-all cursor-pointer font-bold"
                                            >
                                                Escalate to Roadmap
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* General DevOps Terminal Log console */}
            <div className="glass-card rounded-2xl p-6 border border-border/60 mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <CheckCircle className="w-4.5 h-4.5 text-slate-400" />
                        GTM &amp; Operations Audit Logs
                    </h3>
                    <span className="text-[9px] text-slate-500 font-mono">active connection</span>
                </div>
                <div className="bg-slate-950 rounded-xl p-4 border border-white/5">
                    <div className="h-[140px] overflow-y-auto font-mono text-xs text-slate-400 space-y-2">
                        {launchLogs.map((log, idx) => (
                            <div key={idx} className="flex gap-1.5">
                                <span className="text-red-500 shrink-0">➔</span>
                                <span className={
                                    log.includes("complete") || log.includes("SUCCESS") || log.includes("Closed Won") ? "text-emerald-400" :
                                    log.includes("Campaign") ? "text-indigo-400" :
                                    log.includes("Invitation") || log.includes("Invite") ? "text-orange-400 font-semibold" :
                                    log.includes("Feedback") ? "text-yellow-400" : ""
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
