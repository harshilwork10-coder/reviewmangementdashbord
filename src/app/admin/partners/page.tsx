"use client";

import { useState, useEffect } from "react";
import {
    Handshake, Users, Award, TrendingUp, DollarSign, Calendar,
    BookOpen, FileText, CheckCircle, Clock, AlertTriangle, ArrowUpRight,
    Copy, Check, Info, ShieldCheck, Play, Plus, Trash2, X, RefreshCw, Layers
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface PartnerApplication {
    id: string;
    agencyName: string;
    agencyType: string;
    website: string;
    location: string;
    status: "pending" | "approved" | "rejected";
    appliedDate: string;
}

interface ToastMessage {
    id: string;
    type: "success" | "warning" | "error" | "info";
    text: string;
}

// ── Mock Initial Data ──────────────────────────────────────────────────────
const initialApplications: PartnerApplication[] = [
    { id: "app_apex", agencyName: "Apex Reputation Partners", agencyType: "Digital Marketing Agency", website: "apexrep.com", location: "New York, USA", status: "pending", appliedDate: "2026-06-18" },
    { id: "app_pixel", agencyName: "PixelForge Media", agencyType: "SEO & Web Design Firm", website: "pixelforgemedia.io", location: "London, UK", status: "pending", appliedDate: "2026-06-19" },
    { id: "app_vanguard", agencyName: "Vanguard Marketing Consultants", agencyType: "Local Business Consultants", website: "vanguardlocal.com", location: "Toronto, Canada", status: "pending", appliedDate: "2026-06-20" }
];

export default function AgencyPartnerConsole() {
    const [activeTab, setActiveTab] = useState<"recruitment" | "revenue" | "onboarding" | "enablement" | "roadmap">("recruitment");
    const [applications, setApplications] = useState<PartnerApplication[]>(initialApplications);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    // Revenue Simulator States
    const [referralsCount, setReferralsCount] = useState<number>(10);
    const [arpaPerReferral, setArpaPerReferral] = useState<number>(99);
    const [partnerTier, setPartnerTier] = useState<"registered" | "certified" | "growth" | "strategic">("certified");
    const [wholesaleDiscount, setWholesaleDiscount] = useState<number>(30); // in percent

    // Training Modules
    const [trainingModules, setTrainingModules] = useState([
        { id: "m1", title: "Product Overview & Features", enrolled: 12, completed: 10, percent: 83 },
        { id: "m2", title: "SaaS Sales & Positioning", enrolled: 12, completed: 8, percent: 66 },
        { id: "m3", title: "Sales Demo Certification", enrolled: 8, completed: 6, percent: 75 },
        { id: "m4", title: "Customer Onboarding Best Practices", enrolled: 6, completed: 4, percent: 66 },
        { id: "m5", title: "Reporting & Analytics Training", enrolled: 6, completed: 5, percent: 83 }
    ]);

    // Part 12 Gate Deliverables
    const [deliverables, setDeliverables] = useState([
        { id: "bp1", label: "Partner program approved", checked: true },
        { id: "bp2", label: "Commission structure documented", checked: true },
        { id: "bp3", label: "Training framework established", checked: true },
        { id: "bp4", label: "Partner onboarding process defined", checked: true },
        { id: "bp5", label: "Agency growth model ready", checked: false }
    ]);

    const doneDels = deliverables.filter(d => d.checked).length;

    // Toast alert triggers
    const addToast = (type: ToastMessage["type"], text: string) => {
        const id = Math.random().toString(36).substring(7);
        setToasts(prev => [...prev, { id, type, text }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    // Calculate Partner Commissions
    const getCommissionRate = () => {
        switch (partnerTier) {
            case "registered": return { yr1: 0.20, ongoing: 0.10 };
            case "certified": return { yr1: 0.20, ongoing: 0.10 };
            case "growth": return { yr1: 0.25, ongoing: 0.12 }; // growth partner bonus tier
            case "strategic": return { yr1: 0.30, ongoing: 0.15 }; // strategic partner special incentives
        }
    };

    const rates = getCommissionRate();
    const totalMRR = referralsCount * arpaPerReferral;
    const yr1Commission = totalMRR * rates.yr1;
    const ongoingCommission = totalMRR * rates.ongoing;
    const retainedSaaSMRR = totalMRR - yr1Commission;

    // Reseller Markup Math
    const wholesalePrice = arpaPerReferral * (1 - wholesaleDiscount / 100);
    const profitMarginPerSeat = arpaPerReferral - wholesalePrice;
    const profitMarginPercent = wholesaleDiscount;

    // Manage application actions
    const handleAppAction = (id: string, action: "approved" | "rejected") => {
        setApplications(prev =>
            prev.map(app => (app.id === id ? { ...app, status: action } : app))
        );
        const app = applications.find(a => a.id === id);
        if (app) {
            addToast(
                action === "approved" ? "success" : "warning",
                `Application for ${app.agencyName} has been ${action}.`
            );
        }
    };

    // Simulate certifying academies
    const runSimCertify = () => {
        setTrainingModules(prev =>
            prev.map(mod => {
                const newCompleted = Math.min(mod.enrolled, mod.completed + 1);
                return {
                    ...mod,
                    completed: newCompleted,
                    percent: Math.round((newCompleted / mod.enrolled) * 100)
                };
            })
        );
        addToast("success", "Simulated certification tests. 1 new partner verified across academies!");
    };

    const tabs = [
        { id: "recruitment", label: "Tiers & Applications", icon: Users },
        { id: "revenue", label: "Revenue Share Model", icon: DollarSign },
        { id: "onboarding", label: "Training & Onboarding", icon: BookOpen },
        { id: "enablement", label: "Sales Enablement", icon: FileText },
        { id: "roadmap", label: "Part 12 Gates & Roadmap", icon: CheckCircle }
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
                        <Handshake className="w-6 h-6 text-red-500" />
                        Agency Partner Program Console
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Recruit agency marketing partners, configure tier levels, track revenue shares, and administer Part 12 deliverables.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
                        Affiliate Tracking Active
                    </div>
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold">
                        Wholesale Reseller Enabled
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

            {/* ── Tab 1: Tiers & Applications ── */}
            {activeTab === "recruitment" && (
                <div className="space-y-6">
                    {/* Ideal Partners Cards */}
                    <div>
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Ideal Agency Partners</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                            {[
                                { title: "Digital Marketing Agencies", desc: "Integrate review services into standard client growth offerings." },
                                { title: "SEO Agencies", desc: "Help local brands scale search rankings via continuous review generation." },
                                { title: "Website Development Firms", desc: "Embed review capture widgets during website build handoffs." },
                                { title: "Local Marketing Consultants", desc: "Advise brick-and-mortar stores on reputation acquisition." },
                                { title: "Business Automation Consultants", desc: "Connect CRM dispatches to ReviewManagement request triggers." }
                            ].map((item, idx) => (
                                <div key={idx} className="glass-card rounded-2xl p-5 border border-border/60 flex flex-col justify-between">
                                    <div>
                                        <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
                                            <Award className="w-4.5 h-4.5 text-red-400" />
                                        </div>
                                        <h3 className="text-xs font-bold text-white mb-1.5">{item.title}</h3>
                                        <p className="text-[10px] text-slate-400 leading-normal">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Partner Program Tiers */}
                    <div>
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Program Tiers Configuration</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { tier: "Registered Partner", reqs: "0-2 active clients", comm: "20% Yr 1 / 10% ongoing", color: "border-slate-800 bg-slate-900/40 text-slate-400", desc: "Basic entry tier. Access to basic templates and tracking dashboards." },
                                { tier: "Certified Partner", reqs: "3-9 active clients", comm: "20% Yr 1 / 10% ongoing + certification badge", color: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400", desc: "Completed sales certification. Listed in partner directory." },
                                { tier: "Growth Partner", reqs: "10-24 active clients", comm: "25% Yr 1 / 12% ongoing + performance bonuses", color: "border-violet-500/30 bg-violet-500/10 text-violet-400", desc: "Dedicated co-marketing support, priority leads, enhanced revenue splits." },
                                { tier: "Strategic Partner", reqs: "25+ active clients", comm: "30% Yr 1 / 15% ongoing + custom wholesale pricing", color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400", desc: "Custom integrations, dedicated support manager, joint press opportunities." }
                            ].map((item, idx) => (
                                <div key={idx} className={`glass-card rounded-2xl p-5 border ${item.color} flex flex-col justify-between`}>
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-white">{item.tier}</span>
                                            <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/5 text-slate-300">{item.reqs}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 leading-normal mb-3">{item.desc}</p>
                                        <div className="text-[10px] font-mono border-t border-white/5 pt-2 text-slate-400">
                                            Commission Rate: <strong className="text-white">{item.comm}</strong>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Applications Manager Table */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60">
                        <div className="mb-4">
                            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                <Handshake className="w-4.5 h-4.5 text-red-400" /> Incoming Partner Applications
                            </h3>
                            <p className="text-xs text-slate-400">
                                Review qualifications and approve new agency partners into the program.
                            </p>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/60">
                            <table className="w-full text-[11px] text-slate-300">
                                <thead>
                                    <tr className="bg-slate-950 border-b border-white/5 text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                                        <th className="text-left p-4">Agency Name</th>
                                        <th className="text-left p-4">Agency Type</th>
                                        <th className="text-left p-4">Location</th>
                                        <th className="text-left p-4">Applied Date</th>
                                        <th className="text-center p-4">Status</th>
                                        <th className="text-center p-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {applications.map(app => (
                                        <tr key={app.id} className="hover:bg-slate-900/30 transition-colors">
                                            <td className="p-4 font-bold text-slate-200">
                                                {app.agencyName}
                                                <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">{app.website}</span>
                                            </td>
                                            <td className="p-4 text-slate-300">{app.agencyType}</td>
                                            <td className="p-4 text-slate-400">{app.location}</td>
                                            <td className="p-4 text-slate-400 font-mono">{app.appliedDate}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                                                    app.status === "approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                                    app.status === "rejected" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                                                    "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                {app.status === "pending" ? (
                                                    <div className="flex gap-2 justify-center">
                                                        <button
                                                            onClick={() => handleAppAction(app.id, "approved")}
                                                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold cursor-pointer transition-all"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleAppAction(app.id, "rejected")}
                                                            className="px-2.5 py-1 bg-rose-600/15 border border-rose-500/20 hover:bg-rose-600/30 text-rose-400 rounded text-[10px] font-bold cursor-pointer transition-all"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-500 text-[10px] italic">Resolved</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 2: Revenue Share Model ── */}
            {activeTab === "revenue" && (
                <div className="space-y-6">
                    {/* Model Calculators Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Commission Simulator */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                    <TrendingUp className="w-4.5 h-4.5 text-red-400" /> Referral Revenue Share Simulator
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Model the recurring commission earnings distributed to referral partners.
                                </p>
                            </div>

                            <div className="space-y-4 text-xs">
                                {/* Partner Tier Select */}
                                <div className="space-y-1">
                                    <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Partner Tier Level</label>
                                    <select
                                        value={partnerTier}
                                        onChange={e => setPartnerTier(e.target.value as any)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-lg text-xs text-white p-2 focus:outline-none"
                                    >
                                        <option value="registered">Registered Tier (20% Yr 1 / 10% ongoing)</option>
                                        <option value="certified">Certified Tier (20% Yr 1 / 10% ongoing)</option>
                                        <option value="growth">Growth Tier (25% Yr 1 / 12% ongoing)</option>
                                        <option value="strategic">Strategic Tier (30% Yr 1 / 15% ongoing)</option>
                                    </select>
                                </div>

                                {/* Referrals count slider */}
                                <div>
                                    <div className="flex justify-between text-slate-400 font-semibold mb-1">
                                        <span>Referred Clients Count</span>
                                        <span className="text-indigo-400 font-bold font-mono">{referralsCount} clients</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        step="1"
                                        value={referralsCount}
                                        onChange={e => setReferralsCount(Number(e.target.value))}
                                        className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                </div>

                                {/* Custom ARPA slider */}
                                <div>
                                    <div className="flex justify-between text-slate-400 font-semibold mb-1">
                                        <span>Average Client Subscription MRR</span>
                                        <span className="text-indigo-400 font-bold font-mono">${arpaPerReferral}/mo</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="49"
                                        max="299"
                                        step="10"
                                        value={arpaPerReferral}
                                        onChange={e => setArpaPerReferral(Number(e.target.value))}
                                        className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                    <span className="text-[9px] text-slate-500 font-mono block mt-0.5">(Based on Starter: $49, Growth: $99, Agency: $299 pricing tiers)</span>
                                </div>

                                {/* Calculations output block */}
                                <div className="p-4 bg-slate-950/80 border border-white/5 rounded-xl space-y-2.5 font-mono text-[11px] text-slate-400">
                                    <div className="flex justify-between">
                                        <span>Total Referred MRR Generated:</span>
                                        <span className="text-white font-bold">${totalMRR.toLocaleString()}/mo</span>
                                    </div>
                                    <div className="flex justify-between text-emerald-400">
                                        <span>Year 1 Partner Monthly Share ({rates.yr1 * 100}%):</span>
                                        <span className="font-bold">${yr1Commission.toLocaleString()}/mo</span>
                                    </div>
                                    <div className="flex justify-between text-emerald-500">
                                        <span>Ongoing Partner Monthly Share ({rates.ongoing * 100}%):</span>
                                        <span className="font-bold">${ongoingCommission.toLocaleString()}/mo</span>
                                    </div>
                                    <div className="flex justify-between border-t border-white/5 pt-2 text-xs font-sans">
                                        <span className="text-slate-300 font-bold">Retained SaaS MRR (Year 1):</span>
                                        <span className="text-indigo-400 font-mono font-bold">${retainedSaaSMRR.toLocaleString()}/mo</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reseller Pricing & Margin Modeler */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4 flex flex-col justify-between">
                            <div>
                                <div className="mb-2">
                                    <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                        <Layers className="w-4.5 h-4.5 text-cyan-400" /> Reseller Markup & Growth Modeler
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        Model wholesale discounts allowed for partners purchasing in bulk and marking up under their own white-label.
                                    </p>
                                </div>

                                <div className="space-y-4 text-xs">
                                    {/* Wholesale discount slider */}
                                    <div>
                                        <div className="flex justify-between text-slate-400 font-semibold mb-1">
                                            <span>Wholesale Program Discount</span>
                                            <span className="text-cyan-400 font-bold font-mono">{wholesaleDiscount}% discount</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="15"
                                            max="50"
                                            step="5"
                                            value={wholesaleDiscount}
                                            onChange={e => setWholesaleDiscount(Number(e.target.value))}
                                            className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                        />
                                    </div>

                                    {/* Reseller margin grid */}
                                    <div className="grid grid-cols-3 gap-2.5 text-center">
                                        <div className="p-3 bg-slate-950/60 border border-white/5 rounded-xl">
                                            <span className="text-[8px] text-slate-500 uppercase font-bold block mb-0.5">Wholesale Cost/seat</span>
                                            <span className="text-sm font-extrabold text-white font-mono">${wholesalePrice.toFixed(2)}</span>
                                        </div>
                                        <div className="p-3 bg-slate-950/60 border border-white/5 rounded-xl">
                                            <span className="text-[8px] text-slate-500 uppercase font-bold block mb-0.5">Standard Sell Price</span>
                                            <span className="text-sm font-extrabold text-white font-mono">${arpaPerReferral}</span>
                                        </div>
                                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                            <span className="text-[8px] text-emerald-500 uppercase font-bold block mb-0.5">Agency Profit/seat</span>
                                            <span className="text-sm font-extrabold text-emerald-400 font-mono">${profitMarginPerSeat.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Wholesale details */}
                                    <div className="p-3.5 bg-slate-950 rounded-xl border border-white/5 space-y-1.5 text-[10px] text-slate-400 font-mono">
                                        <div className="flex justify-between">
                                            <span>Wholesale Price (10 client slot block):</span>
                                            <span>${(wholesalePrice * 10).toLocaleString()}/mo</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Client Markup Margin Percent:</span>
                                            <span className="text-emerald-400">{profitMarginPercent}% Margin</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Reseller Profit (10 active clients):</span>
                                            <span className="text-emerald-400 font-bold">${(profitMarginPerSeat * 10).toLocaleString()}/mo</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[10px] text-indigo-300 leading-normal flex items-start gap-2">
                                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                <span>Agency partners have pricing markup flexibility. They buy wholesale slot bundles and charge clients custom prices.</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 3: Onboarding & Training ── */}
            {activeTab === "onboarding" && (
                <div className="space-y-6">
                    {/* Onboarding Stages */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <Clock className="w-4.5 h-4.5 text-amber-400" /> Partner Onboarding Lifecycle Stages
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                            {[
                                { stage: "1. Application Review", desc: "Verify agency website and target business alignment.", active: true },
                                { stage: "2. Qualification Call", desc: "Align on co-marketing goals and target clients count.", active: true },
                                { stage: "3. Acceptance", desc: "Contract execution and sandbox white-label setup.", active: true },
                                { stage: "4. Academy Training", desc: "Perform product, sales, and onboarding certifications.", active: true },
                                { stage: "5. Launch Support", desc: "Launch first campaign for agency client pilot.", active: false }
                            ].map((step, idx) => (
                                <div key={idx} className={`p-4 rounded-xl border flex flex-col justify-between ${
                                    step.active
                                        ? "bg-red-500/10 border-red-500/30 text-white"
                                        : "bg-slate-950 border-white/5 text-slate-500"
                                }`}>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{step.stage}</span>
                                            {step.active && <Check className="w-3 h-3 text-red-400" />}
                                        </div>
                                        <p className="text-[10px] text-slate-400 leading-normal">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Training Framework */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60">
                        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                    <BookOpen className="w-4.5 h-4.5 text-cyan-400" /> Partner Enablement Training Framework
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Track partner cohort progression through core certification tracks.
                                </p>
                            </div>
                            <button
                                onClick={runSimCertify}
                                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shadow-md self-start"
                            >
                                <Play className="w-3.5 h-3.5" /> Simulate Partner Certifications
                            </button>
                        </div>

                        <div className="space-y-4">
                            {trainingModules.map(mod => (
                                <div key={mod.id} className="p-4 bg-slate-950/60 border border-white/5 rounded-xl space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-slate-200">{mod.title}</span>
                                        <span className="text-[10px] font-mono text-slate-400">
                                            {mod.completed} / {mod.enrolled} agencies certified
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
                                                style={{ width: `${mod.percent}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-bold text-red-400 font-mono w-8 text-right">{mod.percent}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 4: Sales Enablement & Support ── */}
            {activeTab === "enablement" && (
                <div className="space-y-6">
                    {/* Enablement Assets */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60">
                        <div className="mb-4">
                            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                <FileText className="w-4.5 h-4.5 text-red-400" /> Sales Enablement Resource Library
                            </h3>
                            <p className="text-xs text-slate-400 font-normal">
                                Copy links to co-branded partner pitch materials.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                { title: "Partner Sales Deck", type: "Keynote / PDF", detail: "Consultative pitch presentation targeting brick-and-mortar stores.", link: "reviewhub.com/resources/partner-sales-deck" },
                                { title: "Proposal Templates", type: "Word / Markdown", detail: "SMB, Agency reseller and Enterprise RFP bid structures.", link: "reviewhub.com/resources/proposal-templates" },
                                { title: "Pricing & Markup Guide", type: "Google Sheet", detail: "Wholesale tier margins modeling templates for agencies.", link: "reviewhub.com/resources/pricing-guide" },
                                { title: "Demo Scripts (15m Framework)", type: "PDF Document", detail: "Step-by-step discovery, walkthrough script, and closing hooks.", link: "reviewhub.com/resources/demo-script-15m" },
                                { title: "Success Case Studies", type: "HTML Portal", detail: "White-labeled conversion studies to show review volume ROI.", link: "reviewhub.com/resources/case-studies-white-label" }
                            ].map((asset, idx) => (
                                <div key={idx} className="p-4 bg-slate-950 border border-white/5 rounded-xl flex flex-col justify-between h-36">
                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="font-bold text-xs text-white">{asset.title}</span>
                                            <span className="text-[8px] bg-slate-900 border border-white/10 px-1.5 py-0.2 rounded font-semibold text-slate-400 font-mono">{asset.type}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 leading-normal">{asset.detail}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(asset.link);
                                            addToast("success", `${asset.title} link copied to clipboard!`);
                                        }}
                                        className="py-1 border border-white/10 hover:bg-white/5 text-white rounded text-[9px] font-bold transition-all w-full flex items-center justify-center gap-1 cursor-pointer"
                                    >
                                        <Copy className="w-2.5 h-2.5" /> Copy Resource Link
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Support & Co-Marketing */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Co-Marketing Opportunities */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1">Co-Marketing Opportunities</h3>
                                <p className="text-xs text-slate-400">Joint growth campaigns run in partnership with marketing firms.</p>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { title: "Joint Webinars", desc: "Co-host webinar events on 'Reputation SEO' for local businesses.", status: "Quarterly" },
                                    { title: "Partner Spotlight Campaigns", desc: "Highlight top performing certified partners in ReviewHub's newsletter.", status: "Monthly" },
                                    { title: "Case Studies Collaboration", desc: "Publish and market performance metrics from pilot clients.", status: "Ad-hoc" },
                                    { title: "Content Collaborations", desc: "Guest blogging, local SEO whitepapers, and joint templates releases.", status: "Active" }
                                ].map((item, idx) => (
                                    <div key={idx} className="p-3 bg-slate-950/60 border border-white/5 rounded-xl text-xs flex justify-between items-center">
                                        <div>
                                            <span className="font-bold text-slate-200 block">{item.title}</span>
                                            <span className="text-[9px] text-slate-500 mt-0.5 block">{item.desc}</span>
                                        </div>
                                        <span className="text-[8px] bg-red-500/10 border border-red-500/20 text-red-400 font-bold px-1.5 py-0.5 rounded font-mono uppercase">{item.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Partner Support Model */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4 flex flex-col justify-between">
                            <div>
                                <div className="mb-4">
                                    <h3 className="text-sm font-bold text-white mb-1">Partner Support Model</h3>
                                    <p className="text-xs text-slate-400">High-touch SLA metrics for strategic agency accounts.</p>
                                </div>

                                <div className="space-y-3 font-mono text-[10px] text-slate-400">
                                    <div className="p-3 bg-slate-950 rounded-xl border border-white/5 space-y-1.5">
                                        <div className="flex justify-between">
                                            <span>Dedicated Partner Contact:</span>
                                            <span className="text-white">partners@reviewhub.com</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>SLA Response Window:</span>
                                            <span className="text-emerald-400 font-bold">&lt; 2 Hours Priority Support</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Partner Knowledge Base:</span>
                                            <span className="text-white underline">docs.reviewhub.com/partners</span>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-slate-950 rounded-xl border border-white/5 space-y-1.5">
                                        <div className="flex justify-between text-slate-400">
                                            <span className="font-bold text-slate-300">Quarterly Business Review (QBR) Logs:</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Apex Reputation Partners QBR:</span>
                                            <span className="text-emerald-500 font-bold">Completed (Q2)</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>PixelForge Media QBR:</span>
                                            <span className="text-amber-500 font-bold">Scheduled (July 15)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => addToast("info", "Opening QBR scheduler modal...")}
                                className="w-full py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                            >
                                Schedule Partner QBR
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 5: Part 12 Gates & Roadmap ── */}
            {activeTab === "roadmap" && (
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Growth Roadmap */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60">
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <TrendingUp className="w-4.5 h-4.5 text-indigo-400" /> Agency Partner Growth Roadmap
                        </h3>
                        <p className="text-xs text-slate-400 mb-6">Execution phases for program scaling and enablement.</p>

                        <div className="space-y-4 font-mono text-[11px]">
                            {[
                                { phase: "Phase 1: Recruit first 5 partners", desc: "Focus on local marketing consultants and web dev boutiques for pilot testing.", progress: 100 },
                                { phase: "Phase 2: Scale to 20 certified partners", desc: "Launch the self-service partner application portal and LMS training academies.", progress: 60 },
                                { phase: "Phase 3: Launch wholesale volume reseller portal", desc: "Enable automated wholesale checkout slot bundle purchases directly in dashboard.", progress: 30 },
                                { phase: "Phase 4: Launch strategic partnership channel", desc: "Onboard large franchise marketing agencies, integrating with enterprise API keys.", progress: 10 }
                            ].map((item, idx) => (
                                <div key={idx} className="p-4 bg-slate-950/60 border border-white/5 rounded-xl space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-slate-200">{item.phase}</span>
                                        <span className="text-[10px] text-slate-400 font-mono">{item.progress}% Completed</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-sans leading-normal">{item.desc}</p>
                                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Part 12 Checklist */}
                    <div className="glass-card rounded-2xl p-8 border border-border/60">
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4.5 h-4.5 text-emerald-400" /> Part 12 Deliverables Gates
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-6">
                            Approve GTM partner program milestones to authorize cohort recruitment.
                        </p>

                        <div className="space-y-3 mb-6">
                            {deliverables.map(d => (
                                <button
                                    key={d.id}
                                    onClick={() => {
                                        setDeliverables(prev =>
                                            prev.map(del => (del.id === d.id ? { ...del, checked: !del.checked } : del))
                                        );
                                        addToast(d.checked ? "warning" : "success", `Updated Gate: ${d.label}`);
                                    }}
                                    className={`w-full p-4 rounded-xl border text-left text-xs flex items-center justify-between gap-3 cursor-pointer transition-all border-none bg-transparent ${
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
                                <span className="text-slate-400">Part 12 Completion Progress</span>
                                <span className="text-emerald-400 font-bold">{doneDels}/5</span>
                            </div>
                            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                                    style={{ width: `${(doneDels / deliverables.length) * 100}%` }}
                                ></div>
                            </div>
                            {doneDels === deliverables.length && (
                                <div className="pt-3 flex items-center gap-2 text-emerald-400 text-xs font-bold animate-pulse">
                                    <CheckCircle className="w-4.5 h-4.5" /> Part 12 Completed — Agency Partner Program approved!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
