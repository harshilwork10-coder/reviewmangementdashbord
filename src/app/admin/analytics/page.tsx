"use client";

import { useEffect, useState } from "react";
import { 
    getBusinesses, getReviews, getLocations, 
    Business, Review 
} from "@/lib/store";
import { 
    TrendingUp, ArrowUpRight, DollarSign, Users, Sparkles, Zap, 
    ShieldAlert, Calendar, Clock, BarChart3, Plus, Send, Check, X,
    RefreshCw, Layers, Database, Cpu, Activity, Info, CheckCircle, Search,
    Flame, Target, ArrowRight, Star, AlertTriangle, Terminal
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface ReferrerItem {
    id: string;
    merchant: string;
    code: string;
    signups: number;
    converted: number;
    commission: number;
}

interface AgencyPartner {
    id: string;
    name: string;
    domain: string;
    slots: string;
    discount: string;
    status: "Active" | "Pending" | "Configuring";
}

interface KeywordItem {
    keyword: string;
    volume: string;
    rank: number;
    targetPage: string;
}

interface ToastMessage {
    id: string;
    type: "success" | "warning" | "error" | "info";
    text: string;
}

export default function PlatformAnalyticsPage() {
    const [activeTab, setActiveTab] = useState<"financial" | "referrals" | "agency" | "seo" | "scale">("financial");
    const [viewType, setViewType] = useState<"weekly" | "monthly" | "quarterly">("monthly");
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [locationsCount, setLocationsCount] = useState(0);

    // General Audit Log state
    const [growthLogs, setGrowthLogs] = useState<string[]>([
        "[INFO] Growth & Scaling Command Center initialized.",
        "[INFO] Target 12-Month Milestone: 100 Customers | $10K MRR.",
        "[AUDIT] Multi-tenant database RLS, PgBouncer pool limits, and edge caching verified."
    ]);

    const addLog = (msg: string) => {
        const time = new Date().toLocaleTimeString();
        setGrowthLogs(prev => [`[${time}] ${msg}`, ...prev]);
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

    useEffect(() => {
        setBusinesses(getBusinesses());
        setReviews(getReviews());
        setLocationsCount(getLocations().length);
    }, []);

    // ── Tab 1: Financial & Executive Analytics Calculations ──
    const planPrices: Record<string, number> = { starter: 29, growth: 79, agency: 199, enterprise: 999 };
    const baseMrr = businesses.reduce((sum, b) => sum + (planPrices[b.subscriptionPlan || "starter"] || 79), 0) + 12500;
    
    const viewMultiplier = {
        weekly: 7 / 30,
        monthly: 1,
        quarterly: 3
    }[viewType];

    const currentMrr = Math.round(baseMrr);
    const currentArr = Math.round(baseMrr * 12);
    const activeBusinessesCount = businesses.length + 140; 
    const arpa = Math.round(currentMrr / activeBusinessesCount);
    const churnRate = 0.012; // 1.2%
    const ltv = Math.round(arpa / churnRate);

    const signupsCount = Math.round(180 * viewMultiplier);
    const demoBookingsCount = Math.round(62 * viewMultiplier);
    const organicVisitorCount = Math.round(14500 * viewMultiplier);

    const cohorts = [
        { month: "Jan 2026", size: 148, m1: "100%", m2: "96.4%", m3: "94.2%", m4: "92.0%", m5: "91.2%", m6: "90.0%" },
        { month: "Feb 2026", size: 162, m1: "100%", m2: "97.1%", m3: "93.8%", m4: "91.5%", m5: "90.1%", m6: "88.4%" },
        { month: "Mar 2026", size: 184, m1: "100%", m2: "95.5%", m3: "92.4%", m4: "90.2%", m5: "88.5%", m6: "87.0%" },
        { month: "Apr 2026", size: 210, m1: "100%", m2: "96.2%", m3: "94.0%", m4: "91.1%", m5: "89.2%", m6: "-" },
        { month: "May 2026", size: 248, m1: "100%", m2: "98.0%", m3: "95.2%", m4: "92.8%", m5: "-", m6: "-" },
    ];

    const industries = [
        { name: "Restaurants", mrrShare: 32, value: Math.round(currentMrr * 0.32), color: "bg-indigo-500 animate-pulse" },
        { name: "Healthcare & Clinics", mrrShare: 24, value: Math.round(currentMrr * 0.24), color: "bg-violet-500" },
        { name: "Retail & E-commerce", mrrShare: 18, value: Math.round(currentMrr * 0.18), color: "bg-cyan-500" },
        { name: "Home Services", mrrShare: 14, value: Math.round(currentMrr * 0.14), color: "bg-emerald-500" },
        { name: "Professional Services", mrrShare: 8, value: Math.round(currentMrr * 0.08), color: "bg-amber-500" },
        { name: "Franchise Operators", mrrShare: 4, value: Math.round(currentMrr * 0.04), color: "bg-rose-500" }
    ];

    // ── Tab 2: Referral Engine States ──
    const [referrers, setReferrers] = useState<ReferrerItem[]>([
        { id: "RF-01", merchant: "Greenwood Med Spa", code: "GREENWOOD20", signups: 8, converted: 3, commission: 237 },
        { id: "RF-02", merchant: "Skyline Car Care", code: "SKYLINE10", signups: 12, converted: 5, commission: 395 },
        { id: "RF-03", merchant: "Apex Dental Clinic", code: "APEXDENT50", signups: 4, converted: 1, commission: 79 },
    ]);
    const [referralLogs, setReferralLogs] = useState<string[]>([]);
    const [simulatingReferrals, setSimulatingReferrals] = useState(false);
    const [referralCount, setReferralCount] = useState(24);
    const [cacSaved, setCacSaved] = useState(1250);

    const handleRunReferralCampaign = () => {
        if (simulatingReferrals) return;
        setSimulatingReferrals(true);
        addLog("[Referral Engine] Initiated automated referral broadcast sequence targeting top promoters.");
        addToast("info", "Starting referral broadcast...");
        
        setReferralLogs([`[0.0s] Identifying top 20% active promoters (CSAT > 90%)...`]);

        setTimeout(() => {
            setReferralLogs(prev => [...prev, `[1.2s] Dispatched referral share links with Stripe 1-month-free coupon tags.`]);
            setTimeout(() => {
                const newSignups = Math.floor(4 + Math.random() * 4);
                const converted = Math.floor(1 + Math.random() * 2);
                const saved = converted * 150; // $150 CAC saved per conversion
                
                setReferralCount(prev => prev + newSignups);
                setCacSaved(prev => prev + saved);
                setReferrers(prev => prev.map((r, i) => i === 0 ? {
                    ...r,
                    signups: r.signups + newSignups,
                    converted: r.converted + converted,
                    commission: r.commission + (converted * 79)
                } : r));

                setSimulatingReferrals(false);
                setReferralLogs(prev => [
                    ...prev,
                    `[2.5s] CAMPAIGN DISPATCH SUCCESS.`,
                    `[REFERRAL RESULT] New Signups: +${newSignups} | Paid Conversions: +${converted} | CAC Saved: +$${saved}`
                ]);
                addLog(`[Referral Engine] Broadcast complete. Signups: +${newSignups}, Conversions: +${converted}, CAC Saved: +$${saved}`);
                addToast("success", "Referral sequence broadcast successfully!");
            }, 1200);
        }, 1200);
    };

    // ── Tab 3: Agency Program States ──
    const [agencies, setAgencies] = useState<AgencyPartner[]>([
        { id: "AG-01", name: "Skyward SEO Agency", domain: "reviews.skywardseo.com", slots: "8 / 10 locations", discount: "20% Partner Disc", status: "Active" },
        { id: "AG-02", name: "Apex Marketing Media", domain: "rep.apexmedia.com", slots: "15 / 25 locations", discount: "30% Partner Disc", status: "Active" },
        { id: "AG-03", name: "Summit Digital Growth", domain: "reviews.summitdigital.co", slots: "0 / 10 locations", discount: "20% Partner Disc", status: "Configuring" },
    ]);

    const [newAgencyName, setNewAgencyName] = useState("");
    const [newAgencyDomain, setNewAgencyDomain] = useState("");
    const [newAgencySlots, setNewAgencySlots] = useState("10");
    const [newAgencyDiscount, setNewAgencyDiscount] = useState("20% Partner Disc");

    const handleAddAgency = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAgencyName || !newAgencyDomain) {
            addToast("warning", "Please provide agency name and whitelabel domain.");
            return;
        }
        const newAgency: AgencyPartner = {
            id: `AG-0${agencies.length + 1}`,
            name: newAgencyName,
            domain: newAgencyDomain,
            slots: `0 / ${newAgencySlots} locations`,
            discount: newAgencyDiscount,
            status: "Configuring"
        };
        setAgencies(prev => [...prev, newAgency]);
        addLog(`[Agency Program] Registered new Agency Partner: ${newAgencyName} | Whitelabel Domain: ${newAgencyDomain}.`);
        addToast("success", `Agency ${newAgencyName} registered successfully!`);
        setNewAgencyName("");
        setNewAgencyDomain("");
    };

    // Whitelabel Roadmap checklist
    const [whitelabelRoadmap, setWhitelabelRoadmap] = useState([
        { id: "wl_1", label: "Whitelabel brand color & logos configurations", checked: true },
        { id: "wl_2", label: "Subdomain CNAME DNS routing automation", checked: true },
        { id: "wl_3", label: "Custom SMTP transactional email configurations", checked: false },
        { id: "wl_4", label: "Client sub-account scoping & permissions gating", checked: false },
        { id: "wl_5", label: "Agency-specific billing invoice consolidation", checked: false },
    ]);

    const toggleWhitelabelGate = (id: string) => {
        setWhitelabelRoadmap(prev => prev.map(w => {
            if (w.id === id) {
                const nextVal = !w.checked;
                addLog(`[Agency Program] Whitelabel Gate: ${w.label} set to ${nextVal ? "COMPLETED" : "PENDING"}`);
                addToast("success", "Whitelabel roadmap updated.");
                return { ...w, checked: nextVal };
            }
            return w;
        }));
    };

    // ── Tab 4: SEO & Content States ──
    const [seoKeywords, setSeoKeywords] = useState<KeywordItem[]>([
        { keyword: "how to get google reviews for dentists", volume: "1,200/mo", rank: 3, targetPage: "/review-management-for-healthcare" },
        { keyword: "best whitelabel reputation management tool", volume: "850/mo", rank: 5, targetPage: "/pricing" },
        { keyword: "review management software for restaurants", volume: "980/mo", rank: 2, targetPage: "/review-management-for-restaurants" },
        { keyword: "automated review reply generator", volume: "450/mo", rank: 8, targetPage: "/why-us" },
        { keyword: "increase google review velocity", volume: "320/mo", rank: 11, targetPage: "/blog" },
    ]);

    const [contentChecklist, setContentChecklist] = useState([
        { id: "cnt_1", label: "Weekly SEO blog publishing campaign (4 active posts/month)", checked: true },
        { id: "cnt_2", label: "Client review case study publication (Dentistry & HVAC)", checked: false },
        { id: "cnt_3", label: "Annual Local Search Ranking Report publication", checked: false },
        { id: "cnt_4", label: "Developer documentation and API integrations handbook", checked: true },
        { id: "cnt_5", label: "Customer success video tutorials sequence", checked: false },
    ]);

    const toggleContentChecklist = (id: string) => {
        setContentChecklist(prev => prev.map(c => {
            if (c.id === id) {
                const nextVal = !c.checked;
                addLog(`[SEO Content] Asset: ${c.label} toggled to ${nextVal ? "COMPLETED" : "PENDING"}`);
                addToast("success", "Content checklist updated.");
                return { ...c, checked: nextVal };
            }
            return c;
        }));
    };

    // ── Tab 5: Scale & Hiring Gates States ──
    const [dbPooling, setDbPooling] = useState(32); // active PgBouncer pool (%)
    const [workerQueueLoad, setWorkerQueueLoad] = useState(48); // redis job queue capacity (%)
    const [cachingHitRate, setCachingHitRate] = useState(94.2); // edge cache rate (%)

    // Hiring milestones calculations
    const hiringMilestones = [
        { id: "hr_1", role: "Customer Success Manager", condition: "100 Customers", current: `${activeBusinessesCount} / 100`, met: activeBusinessesCount >= 100 },
        { id: "hr_2", role: "Sales Representative", condition: "$10K MRR", current: `$${(currentMrr/1000).toFixed(1)}k / $10k`, met: currentMrr >= 10000 },
        { id: "hr_3", role: "Second Developer", condition: "$15K MRR", current: `$${(currentMrr/1000).toFixed(1)}k / $15k`, met: currentMrr >= 15000 },
        { id: "hr_4", role: "Operations Manager", condition: "$25K MRR", current: `$${(currentMrr/1000).toFixed(1)}k / $25k`, met: currentMrr >= 25000 },
    ];

    const metHiringCount = hiringMilestones.filter(m => m.met).length;

    // Part 14 Deliverables checklist
    const [deliverables, setDeliverables] = useState([
        { id: "pd14_1", label: "Growth strategy approved", checked: true },
        { id: "pd14_2", label: "Referral system documented", checked: true },
        { id: "pd14_3", label: "Agency program defined", checked: true },
        { id: "pd14_4", label: "Revenue expansion plan approved", checked: true },
        { id: "pd14_5", label: "Scaling blueprint finalized", checked: false },
    ]);

    const toggleDeliverable = (id: string) => {
        setDeliverables(prev => prev.map(d => {
            if (d.id === id) {
                const nextVal = !d.checked;
                addLog(`[Growth Gate] ${d.label} status: ${nextVal ? "PASSED" : "PENDING"}.`);
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
                        <TrendingUp className="w-6 h-6 text-red-500 animate-float" />
                        Growth &amp; Scaling Control Console
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Consolidated growth logs, revenue metrics, referrals acquisition, whitelabel agency programs, and infrastructure scaling parameters.
                    </p>
                </div>

                {/* Reporting view selector */}
                <div className="bg-slate-950 border border-white/5 rounded-xl p-1 flex">
                    {(["weekly", "monthly", "quarterly"] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => {
                                setViewType(type);
                                addLog(`Analytics view interval adjusted to: ${type.toUpperCase()}`);
                            }}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                viewType === type 
                                    ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 p-1 bg-slate-950 border border-white/5 rounded-2xl mb-8 overflow-x-auto">
                {[
                    { id: "financial", label: "Executive Analytics", icon: BarChart3 },
                    { id: "referrals", label: "Referral Engine", icon: Flame },
                    { id: "agency", label: "Agency Program", icon: Layers },
                    { id: "seo", label: "SEO & Content", icon: Search },
                    { id: "scale", label: "Scale & Hiring Gates", icon: Cpu },
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

            {/* ── Tab 1: Financial & Executive Analytics ── */}
            {activeTab === "financial" && (
                <div className="space-y-6">
                    {/* Financial stats row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            { label: "Platform MRR", value: `$${Math.round(currentMrr * viewMultiplier).toLocaleString()}`, desc: `Billed recurring yield (${viewType})` },
                            { label: "Platform ARR", value: `$${currentArr.toLocaleString()}`, desc: "Annualized forward-run projection" },
                            { label: "ARPA", value: `$${arpa}`, desc: "Average Revenue Per Account" },
                            { label: "LTV Projection", value: `$${ltv.toLocaleString()}`, desc: "Lifetime Value based on 1.2% churn" }
                        ].map((stat, idx) => (
                            <div key={idx} className="glass-card rounded-2xl p-5 border border-border/60">
                                <div className="text-2xl font-black text-white mb-1 font-mono">{stat.value}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{stat.label}</div>
                                <p className="text-[10px] text-slate-500 leading-normal">{stat.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Cohort retention table */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60">
                            <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                                <Clock className="w-4.5 h-4.5 text-cyan-400" />
                                Customer Cohort Retention (NRR)
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse font-mono">
                                    <thead>
                                        <tr className="border-b border-white/5 text-slate-500 font-semibold">
                                            <th className="pb-2">Cohort Month</th>
                                            <th className="pb-2">Active size</th>
                                            <th className="pb-2">Month 1</th>
                                            <th className="pb-2">Month 2</th>
                                            <th className="pb-2">Month 3</th>
                                            <th className="pb-2">Month 4</th>
                                            <th className="pb-2">Month 5</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cohorts.map((c, idx) => (
                                            <tr key={idx} className="border-b border-white/5 text-slate-300 hover:bg-white/1 text-[11px]">
                                                <td className="py-2.5 font-bold text-slate-200">{c.month}</td>
                                                <td className="py-2.5 text-slate-400 font-bold">{c.size} locations</td>
                                                <td className="py-2.5 text-emerald-400 font-bold">{c.m1}</td>
                                                <td className="py-2.5 text-emerald-400/90">{c.m2}</td>
                                                <td className="py-2.5 text-emerald-400/80">{c.m3}</td>
                                                <td className="py-2.5 text-indigo-400">{c.m4}</td>
                                                <td className="py-2.5">{c.m5}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Industry revenue share */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60">
                            <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                                <Layers className="w-4.5 h-4.5 text-violet-400" />
                                Revenue Share by Industry
                            </h3>
                            <div className="space-y-4">
                                {industries.map((ind) => (
                                    <div key={ind.name} className="space-y-1 text-xs">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-300 font-semibold">{ind.name}</span>
                                            <span className="text-white font-bold">
                                                {ind.mrrShare}% <span className="text-slate-500 font-normal">(${ind.value.toLocaleString()}/mo MRR)</span>
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                                            <div className={`h-full ${ind.color}`} style={{ width: `${ind.mrrShare}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 2: Referral Growth Engine ── */}
            {activeTab === "referrals" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: referral metrics & campaign */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-card rounded-2xl p-6 border border-border/60">
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <Flame className="w-4.5 h-4.5 text-orange-400" />
                                Platform Referral Growth Engine
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                Auto-dispatch reward coupon structures targeting active merchants and agencies. Saves marketing customer acquisition cost (CAC).
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-900/60 border border-white/5 rounded-xl">
                                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Referred Signups</span>
                                    <span className="text-2xl font-black text-white mt-1 block font-mono">{referralCount} Users</span>
                                </div>
                                <div className="p-4 bg-slate-900/60 border border-white/5 rounded-xl">
                                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Total CAC Saved</span>
                                    <span className="text-2xl font-black text-emerald-400 mt-1 block font-mono">${cacSaved.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                disabled={simulatingReferrals}
                                onClick={handleRunReferralCampaign}
                                className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all mt-6 ${
                                    simulatingReferrals
                                        ? "bg-slate-900 text-slate-600 border border-white/5 cursor-not-allowed"
                                        : "bg-orange-600 hover:bg-orange-500 text-white cursor-pointer shadow-lg shadow-orange-600/20"
                                }`}
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${simulatingReferrals ? "animate-spin" : ""}`} />
                                {simulatingReferrals ? "Broadcasting Sequence..." : "Broadcast Referral Promo Sequence"}
                            </button>
                        </div>

                        {/* Referrers list table */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <Users className="w-4.5 h-4.5 text-indigo-400" />
                                Active Promoters &amp; Referrers
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse font-mono">
                                    <thead>
                                        <tr className="border-b border-white/5 text-slate-500 font-semibold">
                                            <th className="pb-2">Merchant</th>
                                            <th className="pb-2">Referral Code</th>
                                            <th className="pb-2">Signups</th>
                                            <th className="pb-2">Converted Paid</th>
                                            <th className="pb-2 text-right">Commission Earned</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {referrers.map((r) => (
                                            <tr key={r.id} className="border-b border-white/5 text-slate-300 hover:bg-white/1 text-[11px]">
                                                <td className="py-2.5 font-bold text-slate-200">{r.merchant}</td>
                                                <td className="py-2.5 text-indigo-400 font-bold">{r.code}</td>
                                                <td className="py-2.5">{r.signups}</td>
                                                <td className="py-2.5 text-emerald-400 font-bold">{r.converted}</td>
                                                <td className="py-2.5 text-right text-slate-200 font-bold font-mono">${r.commission}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right: Broadcast simulator log */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <Activity className="w-4.5 h-4.5 text-orange-400" />
                                Referral Broadcast Monitor
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                Live track of referred trial coupon creations.
                            </p>

                            <div className="bg-slate-950 rounded-xl p-3.5 border border-white/5 h-[230px] overflow-y-auto">
                                <div className="font-mono text-[10px] text-slate-400 space-y-1.5">
                                    {referralLogs.length === 0 ? (
                                        <div className="text-slate-600 italic">Awaiting campaign execution trigger...</div>
                                    ) : (
                                        referralLogs.map((log, idx) => (
                                            <div key={idx} className="flex gap-1.5">
                                                <span className="text-orange-400 shrink-0">➔</span>
                                                <span className={log.includes("RESULT") ? "text-emerald-400 font-bold" : ""}>{log}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-900 mt-6 text-[9px] text-slate-500 font-mono">
                            Referrals tracked via Stripe Checkout sessions.
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 3: Agency Program ── */}
            {activeTab === "agency" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: whitelabel agency registry */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-card rounded-2xl p-6 border border-border/60">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <Layers className="w-4.5 h-4.5 text-violet-400" />
                                Registered Agency Partners Network
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 text-slate-500 font-semibold">
                                            <th className="pb-2">Agency Name</th>
                                            <th className="pb-2">Whitelabel Custom Domain</th>
                                            <th className="pb-2">Onboarded Slots</th>
                                            <th className="pb-2">Discount</th>
                                            <th className="pb-2 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {agencies.map((a) => (
                                            <tr key={a.id} className="border-b border-white/5 text-slate-300 hover:bg-white/1 font-mono text-[11px]">
                                                <td className="py-3 font-bold text-slate-200">{a.name}</td>
                                                <td className="py-3 text-cyan-400 font-bold">{a.domain}</td>
                                                <td className="py-3">{a.slots}</td>
                                                <td className="py-3 text-violet-400 font-bold">{a.discount}</td>
                                                <td className="py-3 text-right">
                                                    <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                        a.status === "Active" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
                                                    }`}>
                                                        {a.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Whitelabel roadmap checklist */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60">
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <Target className="w-4.5 h-4.5 text-indigo-400" />
                                Agency Whitelabel Features Roadmap
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                Gated whitelabel architecture implementation roadmap items.
                            </p>

                            <div className="space-y-2.5">
                                {whitelabelRoadmap.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => toggleWhitelabelGate(item.id)}
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
                    </div>

                    {/* Right: Onboard Agency Partner wizard */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <Plus className="w-4.5 h-4.5 text-emerald-400" />
                                Onboard Agency Partner
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                Configure dedicated whitelabel slots and contract details for new agencies.
                            </p>

                            <form onSubmit={handleAddAgency} className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Agency Name (e.g. Apex Marketing)"
                                    value={newAgencyName}
                                    onChange={(e) => setNewAgencyName(e.target.value)}
                                    className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                                />
                                <input
                                    type="text"
                                    placeholder="CNAME Domain (e.g. rep.apex.com)"
                                    value={newAgencyDomain}
                                    onChange={(e) => setNewAgencyDomain(e.target.value)}
                                    className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full font-mono"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <select
                                        value={newAgencySlots}
                                        onChange={(e) => setNewAgencySlots(e.target.value)}
                                        className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white focus:outline-none"
                                    >
                                        <option value="10">10 Locations Slot</option>
                                        <option value="25">25 Locations Slot</option>
                                        <option value="50">50 Locations Slot</option>
                                    </select>
                                    <select
                                        value={newAgencyDiscount}
                                        onChange={(e) => setNewAgencyDiscount(e.target.value)}
                                        className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white focus:outline-none"
                                    >
                                        <option value="20% Partner Disc">20% Discount</option>
                                        <option value="30% Partner Disc">30% Discount</option>
                                        <option value="Custom Partner Disc">Custom Partner</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                                >
                                    <Send className="w-3.5 h-3.5" /> Register Agency Partner
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 4: SEO & Content strategy ── */}
            {activeTab === "seo" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: SEO ranking keyword planner */}
                    <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-border/60">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Search className="w-4.5 h-4.5 text-cyan-400" />
                                Target SEO Keyword Planner
                            </h3>
                            <span className="text-[10px] text-slate-500 font-mono">Organic inbound acquisition keywords tracker</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 text-slate-500 font-semibold">
                                        <th className="pb-2">Target Keyword</th>
                                        <th className="pb-2">Search Volume</th>
                                        <th className="pb-2">Current Rank</th>
                                        <th className="pb-2 text-right">Target landing page</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {seoKeywords.map((k, idx) => (
                                        <tr key={idx} className="border-b border-white/5 text-slate-300 hover:bg-white/1 font-mono text-[11px]">
                                            <td className="py-3 font-bold text-slate-200">{k.keyword}</td>
                                            <td className="py-3">{k.volume}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                    k.rank <= 3 ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-400"
                                                }`}>
                                                    #{k.rank}
                                                </span>
                                            </td>
                                            <td className="py-3 text-right text-cyan-400 font-bold">{k.targetPage}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right: Content assets checklist */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
                                Content Marketing Assets
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                Confirm published content pieces to drive organic backlinks.
                            </p>

                            <div className="space-y-3">
                                {contentChecklist.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => toggleContentChecklist(item.id)}
                                        className={`w-full p-3.5 rounded-xl border text-left text-xs flex items-center justify-between gap-3 cursor-pointer transition-all ${
                                            item.checked
                                                ? "bg-indigo-500/10 border-indigo-500/30 text-white"
                                                : "bg-slate-900 border-white/5 text-slate-500 hover:border-white/10"
                                        }`}
                                    >
                                        <span className="font-semibold leading-normal">{item.label}</span>
                                        <div className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center ${
                                            item.checked ? "bg-indigo-500 border-indigo-500" : "bg-slate-950 border-slate-700"
                                        }`}>
                                            {item.checked && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 5: Scale & Hiring Gates ── */}
            {activeTab === "scale" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Left: Scaling & Hiring */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Scaling gauges */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <Database className="w-4.5 h-4.5 text-cyan-400" />
                                Scaling Infrastructure Monitors
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-900/60 border border-white/5 rounded-xl space-y-2">
                                    <span className="text-[10px] text-slate-500 uppercase font-bold block">PgBouncer DB Pool</span>
                                    <span className="text-xl font-black text-white font-mono">{dbPooling}%</span>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={dbPooling}
                                        onChange={(e) => setDbPooling(Number(e.target.value))}
                                        className="w-full h-1 bg-slate-950 accent-cyan-500 rounded-lg"
                                    />
                                    <span className="text-[9px] text-slate-500 block leading-normal">Active postgres connection threads.</span>
                                </div>

                                <div className="p-4 bg-slate-900/60 border border-white/5 rounded-xl space-y-2">
                                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Redis Worker Queue</span>
                                    <span className="text-xl font-black text-white font-mono">{workerQueueLoad}%</span>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={workerQueueLoad}
                                        onChange={(e) => setWorkerQueueLoad(Number(e.target.value))}
                                        className="w-full h-1 bg-slate-950 accent-cyan-500 rounded-lg"
                                    />
                                    <span className="text-[9px] text-slate-500 block leading-normal">Active review importing jobs delay.</span>
                                </div>

                                <div className="p-4 bg-slate-900/60 border border-white/5 rounded-xl space-y-2">
                                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Edge Cache Hit-Rate</span>
                                    <span className="text-xl font-black text-emerald-400 font-mono">{cachingHitRate}%</span>
                                    <div className="w-full h-1 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: `${cachingHitRate}%` }} />
                                    </div>
                                    <span className="text-[9px] text-slate-500 block leading-normal">Static landing asset edge delivery.</span>
                                </div>
                            </div>
                        </div>

                        {/* Hiring milestones */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60">
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <Users className="w-4.5 h-4.5 text-violet-400" />
                                Strategic Hiring Milestones Tracker
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                Hire staff based on business revenue scale and total active customers count targets.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {hiringMilestones.map((m, idx) => (
                                    <div key={idx} className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                                        m.met 
                                            ? "bg-emerald-500/10 border-emerald-500/30 text-white" 
                                            : "bg-slate-900 border-white/5 text-slate-500"
                                    }`}>
                                        <div>
                                            <span className="font-bold block">{m.role}</span>
                                            <span className="text-[10px] text-slate-500">Trigger: {m.condition} ({m.current})</span>
                                        </div>
                                        {m.met ? (
                                            <span className="text-[10px] text-emerald-400 font-bold">Authorized ✓</span>
                                        ) : (
                                            <span className="text-[10px] text-slate-600 font-bold">Locked</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Part 14 Deliverables checklist */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4.5 h-4.5 text-emerald-400" /> Part 14 Deliverables
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                Toggle gates to approve Growth &amp; Scaling milestones.
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
                                <span className="text-slate-400">Part 14 Completion</span>
                                <span className="text-emerald-400 font-bold">{doneDels}/5</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                                    style={{ width: `${(doneDels / deliverables.length) * 100}%` }} />
                            </div>
                            {doneDels === deliverables.length && (
                                <div className="pt-2 flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                    <CheckCircle className="w-4 h-4" /> Part 14 Complete — Growth Blueprint Active!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* General DevOps Terminal Log console */}
            <div className="glass-card rounded-2xl p-6 border border-border/60">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Terminal className="w-4.5 h-4.5 text-slate-400" />
                        Live Growth &amp; Scaling Audit Logs
                    </h3>
                    <span className="text-[9px] text-slate-500 font-mono">active connection</span>
                </div>
                <div className="bg-slate-950 rounded-xl p-4 border border-white/5">
                    <div className="h-[140px] overflow-y-auto font-mono text-xs text-slate-400 space-y-2">
                        {growthLogs.map((log, idx) => (
                            <div key={idx} className="flex gap-1.5">
                                <span className="text-red-500 shrink-0">➔</span>
                                <span className={
                                    log.includes("complete") || log.includes("SUCCESS") || log.includes("Registered") || log.includes("met") ? "text-emerald-400 font-bold" :
                                    log.includes("Referral") ? "text-orange-400" :
                                    log.includes("SEO") || log.includes("whitelabel") ? "text-cyan-400" : ""
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
