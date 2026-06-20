"use client";

import { useState, useEffect } from "react";
import {
    CreditCard, DollarSign, RefreshCw, Activity, AlertTriangle, Layers,
    Play, Check, CheckCircle, ChevronRight, ChevronDown, BarChart2,
    ShieldCheck, Mail, Database, Info, Trash2, X
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    locations: string;
    invites: number;
    sms: number;
    color: string;
}

interface TenantUsage {
    id: string;
    name: string;
    plan: string;
    invitesSent: number;
    invitesLimit: number;
    smsSent: number;
    smsLimit: number;
    isLocked: boolean;
}

interface WebhookTemplate {
    event: string;
    description: string;
    payload: Record<string, any>;
}

interface ToastMessage {
    id: string;
    type: "success" | "warning" | "error" | "info";
    text: string;
}

// ── Initial Subscription Plans Data ───────────────────────────────────────
const subscriptionPlans: SubscriptionPlan[] = [
    { id: "starter", name: "Starter Plan", price: 49, locations: "1 Location", invites: 500, sms: 50, color: "text-violet-400 border-violet-500/30 bg-violet-500/10" },
    { id: "growth", name: "Growth Plan", price: 99, locations: "3 Locations", invites: 2500, sms: 250, color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
    { id: "agency", name: "Agency Plan", price: 299, locations: "Unlimited Locations", invites: 15000, sms: 1500, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
    { id: "enterprise", name: "Enterprise Plan", price: 999, locations: "Negotiated limits", invites: 100000, sms: 10000, color: "text-pink-400 border-pink-500/30 bg-pink-500/10" },
];

// ── Usage Quotas Tenant List ──────────────────────────────────────────────
const initialTenants: TenantUsage[] = [
    { id: "org_acme_883", name: "Acme Corporates LLC", plan: "Starter Plan", invitesSent: 480, invitesLimit: 500, smsSent: 42, smsLimit: 50, isLocked: false },
    { id: "org_pizza_911", name: "Pizza Palace Group", plan: "Growth Plan", invitesSent: 2450, invitesLimit: 2500, smsSent: 210, smsLimit: 250, isLocked: false },
    { id: "org_global_002", name: "Global Logistics Inc", plan: "Agency Plan", invitesSent: 120, invitesLimit: 15000, smsSent: 10, smsLimit: 1500, isLocked: false }
];

// ── Stripe Webhook Event Mock Templates ───────────────────────────────────
const webhookTemplates: WebhookTemplate[] = [
    {
        event: "invoice.payment_succeeded",
        description: "Triggered when Stripe successfully charges the payment card.",
        payload: {
            id: "evt_pay_ok_1928",
            type: "invoice.payment_succeeded",
            data: {
                object: {
                    id: "in_1N3x82B",
                    customer: "cus_N2x83b2",
                    amount_paid: 7900,
                    status: "paid",
                    subscription: "sub_1N3x82C"
                }
            }
        }
    },
    {
        event: "invoice.payment_failed",
        description: "Triggered when a charge fails. Commences dunning smart-retries.",
        payload: {
            id: "evt_pay_err_2091",
            type: "invoice.payment_failed",
            data: {
                object: {
                    id: "in_1N4f82B",
                    customer: "cus_N2x83b2",
                    amount_due: 7900,
                    attempt_count: 1,
                    next_payment_attempt: 1781212800,
                    status: "open"
                }
            }
        }
    },
    {
        event: "customer.subscription.updated",
        description: "Dispatched upon upgrade or downgrade plan event adjustments.",
        payload: {
            id: "evt_sub_upd_7781",
            type: "customer.subscription.updated",
            data: {
                object: {
                    id: "sub_1N3x82C",
                    customer: "cus_N2x83b2",
                    plan: { id: "price_growth_monthly", amount: 7900 },
                    status: "active",
                    current_period_end: 1781212800
                }
            }
        }
    },
    {
        event: "customer.subscription.deleted",
        description: "Dispatched if a subscription churns or gets canceled.",
        payload: {
            id: "evt_sub_del_0019",
            type: "customer.subscription.deleted",
            data: {
                object: {
                    id: "sub_1N3x82C",
                    customer: "cus_N2x83b2",
                    status: "canceled"
                }
            }
        }
    }
];

export default function SuperAdminBillingPage() {
    const [activeTab, setActiveTab] = useState<"plans" | "webhooks" | "quotas" | "revops" | "deliverables">("plans");

    // Dynamic state matrices
    const [tenants, setTenants] = useState<TenantUsage[]>(initialTenants);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    // Proration Calculator states
    const [calcCurrent, setCalcCurrent] = useState<string>("starter");
    const [calcTarget, setCalcTarget] = useState<string>("growth");
    const [calcResults, setCalcResults] = useState<{ credit: number; charge: number; net: number } | null>(null);

    // Webhook simulation states
    const [activeWebhook, setActiveWebhook] = useState<WebhookTemplate>(webhookTemplates[0]);
    const [webhookLogs, setWebhookLogs] = useState<string[]>([]);
    const [webhookDispatching, setWebhookDispatching] = useState(false);

    // Financial Model States
    const [financeScenario, setFinanceScenario] = useState<"expected" | "best" | "worst">("expected");
    const [arpaAssumed, setArpaAssumed] = useState<number>(99);
    const [fixedCostsAssumed, setFixedCostsAssumed] = useState<number>(3500); // cloud hosting + marketing + sales reps
    const [deliveryCostsAssumed, setDeliveryCostsAssumed] = useState<number>(10); // SMS & Email variable costs per client
    const [supportCostsAssumed, setSupportCostsAssumed] = useState<number>(5); // customer support variable costs per client

    // Deliverables gates state (Part 11)
    const [deliverables, setDeliverables] = useState([
        { id: "bp1", label: "Revenue projections approved", checked: true },
        { id: "bp2", label: "Growth assumptions approved", checked: true },
        { id: "bp3", label: "Break-even model defined", checked: true },
        { id: "bp4", label: "KPI framework established", checked: true },
        { id: "bp5", label: "Financial roadmap ready", checked: false },
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

    // Calculate Prorations
    const runProrationCalc = () => {
        const cPlan = subscriptionPlans.find(p => p.id === calcCurrent);
        const tPlan = subscriptionPlans.find(p => p.id === calcTarget);
        if (!cPlan || !tPlan) return;

        // Mock 18 remaining days in a 30-day billing period
        const remainingDays = 18;
        const cDaily = cPlan.price / 30;
        const tDaily = tPlan.price / 30;

        const credit = parseFloat((cDaily * remainingDays).toFixed(2));
        const charge = parseFloat((tDaily * remainingDays).toFixed(2));
        const net = parseFloat((charge - credit).toFixed(2));

        setCalcResults({ credit, charge, net });
        addToast("success", "Prorations calculated for remaining 18 cycle days.");
    };

    // Webhook event execution simulator
    const runWebhookSim = () => {
        setWebhookDispatching(true);
        setWebhookLogs(["[INIT] Validating Stripe signature headers..."]);

        setTimeout(() => {
            setWebhookLogs(prev => [...prev, `[OK] Event authenticated: ${activeWebhook.event}`]);
        }, 850);

        setTimeout(() => {
            setWebhookLogs(prev => [...prev, `[DB] Fetching mapping metadata lookup target: ${activeWebhook.payload.data.object.customer}`]);
        }, 1700);

        setTimeout(() => {
            if (activeWebhook.event === "invoice.payment_failed") {
                setWebhookLogs(prev => [
                    ...prev,
                    "[DUNNING] Initiating retry dunning policies...",
                    "[DUNNING] Dispatching failed payment invoice link to customer...",
                    "[WARN] Active campaign queues flagged with 7-day grace period."
                ]);
            } else if (activeWebhook.event === "customer.subscription.deleted") {
                setWebhookLogs(prev => [
                    ...prev,
                    "[LOCKOUT] Deleting organization Redis cache registry...",
                    "[LOCKOUT] Locking active locations. Campaign dispatches Suspended."
                ]);
            } else {
                setWebhookLogs(prev => [...prev, "[OK] Database synced. Active period extended in workspace."]);
            }
            setWebhookDispatching(false);
            addToast("success", `Webhook processed: ${activeWebhook.event}`);
        }, 2600);
    };

    // Exceed limits simulator
    const triggerExceeded = (id: string) => {
        setTenants(prev =>
            prev.map(t => {
                if (t.id === id) {
                    const isNewLock = !t.isLocked;
                    addToast(isNewLock ? "error" : "success", isNewLock ? `${t.name} blocked: Quota limit exceeded!` : `${t.name} quota limits reset.`);
                    return {
                        ...t,
                        invitesSent: isNewLock ? t.invitesLimit + 1 : t.invitesLimit - 20,
                        isLocked: isNewLock
                    };
                }
                return t;
            })
        );
    };

    const tabs = [
        { id: "plans", label: "Subscription Manager", icon: CreditCard },
        { id: "webhooks", label: "Webhook Simulator", icon: RefreshCw },
        { id: "quotas", label: "Quota Monitor", icon: Database },
        { id: "revops", label: "Revenue Ops", icon: BarChart2 },
        { id: "deliverables", label: "Part 11 Gates", icon: CheckCircle },
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
                        <CreditCard className="w-6 h-6 text-red-500" />
                        Billing & Subscription Console
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Evaluate Stripe integration tiers, dispatch webhook callbacks, monitor tenant usage quotas, and check Part 9 gates.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
                        Stripe API Elements · PCI Compliant
                    </div>
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold">
                        Dunning Smart-Retries Active
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

            {/* ── Subscription Manager Tab ── */}
            {activeTab === "plans" && (
                <div className="space-y-6">
                    {/* Plans display grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        {subscriptionPlans.map((plan, i) => (
                            <div key={i} className={`glass-card rounded-2xl p-5 border ${plan.color} flex flex-col justify-between`}>
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-white block">{plan.name}</span>
                                        <span className="text-[14px] font-bold text-white font-mono">${plan.price}/mo</span>
                                    </div>
                                    <div className="space-y-1.5 border-t border-white/5 pt-3 text-[10px] text-slate-400">
                                        <div className="flex justify-between">
                                            <span>Locations Allowed:</span>
                                            <strong className="text-white">{plan.locations}</strong>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Email Invites Limit:</span>
                                            <strong className="text-white font-mono">{plan.invites}</strong>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>SMS Invites Limit:</span>
                                            <strong className="text-white font-mono">{plan.sms}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Prorations Transition Sandbox */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60">
                        <div className="mb-4">
                            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                <DollarSign className="w-4.5 h-4.5 text-red-400" /> Prorated Plan Transition Calculator
                            </h3>
                            <p className="text-xs text-slate-400">
                                SaaS upgrades require real-time proration allocations. Select plans to calculate the mock Stripe item charges.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Inputs */}
                            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-white/5">
                                <div className="space-y-1">
                                    <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Current Tier</label>
                                    <select
                                        value={calcCurrent}
                                        onChange={e => setCalcCurrent(e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-lg text-xs text-white p-2 focus:outline-none"
                                    >
                                        <option value="starter">Starter Plan ($49/mo)</option>
                                        <option value="growth">Growth Plan ($99/mo)</option>
                                        <option value="agency">Agency Plan ($299/mo)</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Target Upgrade Tier</label>
                                    <select
                                        value={calcTarget}
                                        onChange={e => setCalcTarget(e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-lg text-xs text-white p-2 focus:outline-none"
                                    >
                                        <option value="starter">Starter Plan ($49/mo)</option>
                                        <option value="growth">Growth Plan ($99/mo)</option>
                                        <option value="agency">Agency Plan ($299/mo)</option>
                                        <option value="enterprise">Enterprise Plan ($999/mo)</option>
                                    </select>
                                </div>
                                <button
                                    onClick={runProrationCalc}
                                    className="w-full py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                                >
                                    Calculate Prorated Change
                                </button>
                            </div>

                            {/* Outputs */}
                            <div className="lg:col-span-2 p-5 bg-slate-950 rounded-xl border border-white/5 flex flex-col justify-between">
                                <div>
                                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-3">Prorated invoice items (18 remaining days)</div>
                                    {calcResults ? (
                                        <div className="space-y-2 text-[11px] text-slate-400 font-mono">
                                            <div className="flex justify-between">
                                                <span>Unused current plan credit:</span>
                                                <span className="text-emerald-400 font-bold">-${calcResults.credit}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>New plan period charge:</span>
                                                <span className="text-white font-bold">+${calcResults.charge}</span>
                                            </div>
                                            <div className="flex justify-between border-t border-white/5 pt-2 text-xs font-sans">
                                                <span className="text-slate-300 font-bold">Immediate Net Upgrade Charge:</span>
                                                <span className="text-red-400 font-mono font-bold">${calcResults.net}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-slate-600 italic text-[11px]">Configure tiers and click calculate to render proration items.</div>
                                    )}
                                </div>
                                {calcResults && (
                                    <button
                                        onClick={() => {
                                            addToast("success", "Stripe Checkout session update succeeded.");
                                            setCalcResults(null);
                                        }}
                                        className="mt-4 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-[10px] font-bold transition-all"
                                    >
                                        Execute Sandbox Upgrade Checkout
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Webhook Simulator Tab ── */}
            {activeTab === "webhooks" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Trigger Controls */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                <RefreshCw className="w-4.5 h-4.5 text-red-400" /> Stripe Webhook simulator
                            </h3>
                            <p className="text-xs text-slate-400">Select standard webhook templates to dispatch mock responses.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 font-medium">Stripe Event callback type</label>
                                <select
                                    value={activeWebhook.event}
                                    onChange={e => {
                                        const found = webhookTemplates.find(w => w.event === e.target.value);
                                        if (found) setActiveWebhook(found);
                                    }}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl text-xs text-white p-2.5 focus:outline-none"
                                >
                                    {webhookTemplates.map(w => (
                                        <option key={w.event} value={w.event}>{w.event}</option>
                                    ))}
                                </select>
                            </div>
                            <p className="text-[10px] text-slate-500 italic">{activeWebhook.description}</p>
                            <button
                                onClick={runWebhookSim}
                                disabled={webhookDispatching}
                                className="w-full py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shadow-md"
                            >
                                {webhookDispatching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                                {webhookDispatching ? "Parsing payload..." : "Dispatch Stripe webhook"}
                            </button>
                        </div>
                    </div>

                    {/* JSON Display */}
                    <div className="glass-card rounded-2xl p-5 border border-border/60 h-full flex flex-col justify-between">
                        <div>
                            <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                                <Database className="w-3.5 h-3.5 text-cyan-400" /> Mock Payload JSON
                            </h4>
                            <pre className="bg-slate-950 rounded-xl border border-white/5 p-4 font-mono text-[9px] text-slate-400 overflow-x-auto max-h-[200px]">
                                {JSON.stringify(activeWebhook.payload, null, 2)}
                            </pre>
                        </div>
                    </div>

                    {/* console output logs */}
                    <div className="glass-card rounded-2xl p-5 border border-border/60 h-full flex flex-col justify-between">
                        <div>
                            <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5 text-emerald-400" /> Ingestion Webhook Logs
                            </h4>
                            <div className="bg-slate-950 rounded-xl border border-white/5 p-4 font-mono text-[9px] text-slate-400 space-y-2 min-h-[200px] max-h-[240px] overflow-y-auto">
                                {webhookLogs.length === 0 ? (
                                    <div className="text-slate-600 italic">Logs will stream here during webhook triggers.</div>
                                ) : (
                                    webhookLogs.map((log, idx) => (
                                        <div key={idx} className={log.includes("SUCCESS") || log.includes("OK") ? "text-emerald-400" : log.includes("WARN") || log.includes("DUNNING") ? "text-amber-400" : log.includes("LOCKOUT") ? "text-rose-400" : ""}>{log}</div>
                                    ))
                                )}
                                {webhookDispatching && (
                                    <div className="flex items-center gap-1 text-slate-500 italic">
                                        <RefreshCw className="w-3 h-3 animate-spin" /> Fetching key mappings...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Quota Monitor Tab ── */}
            {activeTab === "quotas" && (
                <div className="space-y-6">
                    <div className="glass-card rounded-2xl p-6 border border-border/60">
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                <Database className="w-4.5 h-4.5 text-cyan-400" /> Multi-tenant Usage registry
                            </h3>
                            <p className="text-xs text-slate-400">
                                Verify location limits and test lockout block logic by triggering a mock limit overflow on active clients.
                            </p>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/60">
                            <table className="w-full text-[11px] text-slate-300">
                                <thead>
                                    <tr className="bg-slate-950 border-b border-white/5 text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                                        <th className="text-left p-4">Organization Name</th>
                                        <th className="text-left p-4">Active Plan</th>
                                        <th className="text-left p-4">Requests Ingested / Limit</th>
                                        <th className="text-left p-4">SMS used / Limit</th>
                                        <th className="text-center p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {tenants.map(tenant => (
                                        <tr key={tenant.id} className="hover:bg-slate-900/30 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-slate-200 flex items-center gap-2">
                                                    {tenant.name}
                                                    {tenant.isLocked && (
                                                        <span className="px-1.5 py-0.2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[8px] font-bold rounded flex items-center gap-0.5 animate-pulse">
                                                            <AlertTriangle className="w-2.5 h-2.5" /> Quota Lockout
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">{tenant.id}</span>
                                            </td>
                                            <td className="p-4 text-slate-300 font-semibold">{tenant.plan}</td>
                                            <td className="p-4">
                                                <div className="flex justify-between text-[9px] text-slate-400 mb-1.5 font-mono">
                                                    <span>{tenant.invitesSent} sent</span>
                                                    <span>Limit: {tenant.invitesLimit}</span>
                                                </div>
                                                <div className="h-1.5 w-40 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                                    <div
                                                        style={{ width: `${Math.min((tenant.invitesSent / tenant.invitesLimit) * 100, 100)}%` }}
                                                        className={`h-full transition-all duration-300 ${
                                                            tenant.invitesSent > tenant.invitesLimit ? "bg-rose-500" : "bg-gradient-to-r from-cyan-500 to-blue-500"
                                                        }`}
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-between text-[9px] text-slate-400 mb-1.5 font-mono">
                                                    <span>{tenant.smsSent} SMS</span>
                                                    <span>Limit: {tenant.smsLimit}</span>
                                                </div>
                                                <div className="h-1.5 w-40 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                                    <div
                                                        style={{ width: `${Math.min((tenant.smsSent / tenant.smsLimit) * 100, 100)}%` }}
                                                        className={`h-full bg-gradient-to-r from-violet-500 to-fuchsia-500`}
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => triggerExceeded(tenant.id)}
                                                    className={`px-3 py-1 border rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                                        tenant.isLocked
                                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                    }`}
                                                >
                                                    {tenant.isLocked ? "Reset limits" : "Simulate Overlimit"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Revenue Ops Tab ── */}
            {activeTab === "revops" && (
                <div className="space-y-6">
                    {/* Scenario Selector & Assumptions Sliders */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Financial Assumptions */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                                    Financial Assumptions
                                </h3>
                                <p className="text-[10px] text-slate-500 leading-normal">
                                    Adjust values to simulate growth variables and calculate custom breakeven metrics.
                                </p>
                            </div>

                            <div className="space-y-3.5 text-xs">
                                <div>
                                    <div className="flex justify-between text-slate-400 font-semibold mb-1">
                                        <span>Average Revenue Per Account (ARPA)</span>
                                        <span className="text-indigo-400 font-bold font-mono">${arpaAssumed}/mo</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="49"
                                        max="199"
                                        step="10"
                                        value={arpaAssumed}
                                        onChange={e => setArpaAssumed(Number(e.target.value))}
                                        className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between text-slate-400 font-semibold mb-1">
                                        <span>Fixed Monthly Operating Costs</span>
                                        <span className="text-indigo-400 font-bold font-mono">${fixedCostsAssumed}/mo</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1000"
                                        max="10000"
                                        step="500"
                                        value={fixedCostsAssumed}
                                        onChange={e => setFixedCostsAssumed(Number(e.target.value))}
                                        className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                    <span className="text-[9px] text-slate-500 font-mono block mt-0.5">(hosting + support + marketing)</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Variable Delivery/client</span>
                                        <input
                                            type="number"
                                            value={deliveryCostsAssumed}
                                            onChange={e => setDeliveryCostsAssumed(Math.max(0, Number(e.target.value)))}
                                            className="w-full bg-slate-900 border border-white/10 rounded-lg p-1.5 text-xs text-white focus:outline-none font-mono font-bold"
                                        />
                                    </div>
                                    <div>
                                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Variable Support/client</span>
                                        <input
                                            type="number"
                                            value={supportCostsAssumed}
                                            onChange={e => setSupportCostsAssumed(Math.max(0, Number(e.target.value)))}
                                            className="w-full bg-slate-900 border border-white/10 rounded-lg p-1.5 text-xs text-white focus:outline-none font-mono font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Break-Even Calculator */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                                    Break-Even Analysis
                                </h3>
                                <p className="text-[10px] text-slate-500 leading-normal mb-4">
                                    Breakeven target computed against fixed operating and variable service expenses.
                                </p>

                                {(() => {
                                    const contributionMargin = arpaAssumed - deliveryCostsAssumed - supportCostsAssumed;
                                    const breakEvenCustomers = contributionMargin > 0 ? Math.ceil(fixedCostsAssumed / contributionMargin) : 99999;
                                    const grossMargin = arpaAssumed > 0 ? Math.round((contributionMargin / arpaAssumed) * 100) : 0;
                                    return (
                                        <div className="space-y-4">
                                            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-white/5 grid grid-cols-2 gap-4 text-center">
                                                <div>
                                                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Breakeven Target</span>
                                                    <span className="text-base font-black text-indigo-400 font-mono">{breakEvenCustomers} clients</span>
                                                </div>
                                                <div>
                                                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Gross Margin</span>
                                                    <span className={`text-base font-black font-mono ${grossMargin >= 70 ? "text-emerald-400" : "text-rose-400"}`}>{grossMargin}%</span>
                                                </div>
                                            </div>

                                            <div className="text-[11px] text-slate-400 space-y-1.5 leading-relaxed font-mono">
                                                <div className="flex justify-between">
                                                    <span>Contribution Margin/User:</span>
                                                    <span className="text-slate-300 font-bold">${contributionMargin}/mo</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Breakeven MRR needed:</span>
                                                    <span className="text-slate-300 font-bold">${(breakEvenCustomers * arpaAssumed).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] text-emerald-300 leading-normal flex items-start gap-2 mt-4">
                                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                <span>Breakeven target achieved within Year 1 under Expected and Best Case scenarios.</span>
                            </div>
                        </div>

                        {/* Scenario Picker & Targets */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                                    Revenue Scenario Simulator
                                </h3>
                                <p className="text-[10px] text-slate-500 leading-normal mb-4">
                                    Toggle GTM scenarios to evaluate model projections.
                                </p>

                                <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-white/5">
                                    {(["worst", "expected", "best"] as const).map(sc => (
                                        <button
                                            key={sc}
                                            onClick={() => setFinanceScenario(sc)}
                                            className={`py-2 rounded-lg text-[10px] font-bold uppercase transition-all border-none bg-transparent cursor-pointer ${
                                                financeScenario === sc
                                                    ? "bg-red-600 text-white shadow-md"
                                                    : "text-slate-500 hover:text-slate-300"
                                            }`}
                                        >
                                            {sc === "worst" ? "Worst" : sc === "expected" ? "Expected" : "Best Case"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-900 mt-4 space-y-2 text-xs">
                                <div className="flex justify-between font-mono">
                                    <span className="text-slate-500">Year 1 Target MRR:</span>
                                    <span className="text-white font-bold">
                                        {financeScenario === "best" ? "$14,850+" : financeScenario === "expected" ? "$9,900+" : "$4,950+"}
                                    </span>
                                </div>
                                <div className="flex justify-between font-mono">
                                    <span className="text-slate-500">Year 2 Target MRR:</span>
                                    <span className="text-white font-bold">
                                        {financeScenario === "best" ? "$34,650+" : financeScenario === "expected" ? "$24,750+" : "$11,880+"}
                                    </span>
                                </div>
                                <div className="flex justify-between font-mono">
                                    <span className="text-slate-500">Year 3 Target MRR:</span>
                                    <span className="text-white font-bold">
                                        {financeScenario === "best" ? "$74,250+" : financeScenario === "expected" ? "$49,500+" : "$24,750+"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Projections Table & Channels */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Projections Grid */}
                        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-border/60">
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <BarChart2 className="w-4.5 h-4.5 text-violet-400" />
                                Interactive Revenue Forecast Projections
                            </h3>
                            <p className="text-xs text-slate-400 mb-6">
                                Projections generated dynamically based on selected assumptions and scenarios.
                             </p>

                            <div className="overflow-x-auto font-mono text-xs">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 text-slate-500 font-semibold">
                                            <th className="pb-2">Timeline Phase</th>
                                            <th className="pb-2">Expected Customer Count</th>
                                            <th className="pb-2 text-right">Projected MRR</th>
                                            <th className="pb-2 text-right">Projected ARR</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-slate-300">
                                        <tr>
                                            <td className="py-3 font-semibold text-slate-200">Year 1 - Month 3</td>
                                            <td className="py-3">{financeScenario === "best" ? 15 : financeScenario === "expected" ? 10 : 5} customers</td>
                                            <td className="py-3 text-right text-emerald-400 font-bold">
                                                ${((financeScenario === "best" ? 15 : financeScenario === "expected" ? 10 : 5) * arpaAssumed).toLocaleString()}
                                            </td>
                                            <td className="py-3 text-right text-slate-400">
                                                ${((financeScenario === "best" ? 15 : financeScenario === "expected" ? 10 : 5) * arpaAssumed * 12).toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-semibold text-slate-200">Year 1 - Month 6</td>
                                            <td className="py-3">{financeScenario === "best" ? 45 : financeScenario === "expected" ? 30 : 15} customers</td>
                                            <td className="py-3 text-right text-emerald-400 font-bold">
                                                ${((financeScenario === "best" ? 45 : financeScenario === "expected" ? 30 : 15) * arpaAssumed).toLocaleString()}
                                            </td>
                                            <td className="py-3 text-right text-slate-400">
                                                ${((financeScenario === "best" ? 45 : financeScenario === "expected" ? 30 : 15) * arpaAssumed * 12).toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-semibold text-slate-200">Year 1 - Month 9</td>
                                            <td className="py-3">{financeScenario === "best" ? 90 : financeScenario === "expected" ? 60 : 30} customers</td>
                                            <td className="py-3 text-right text-emerald-400 font-bold">
                                                ${((financeScenario === "best" ? 90 : financeScenario === "expected" ? 60 : 30) * arpaAssumed).toLocaleString()}
                                            </td>
                                            <td className="py-3 text-right text-slate-400">
                                                ${((financeScenario === "best" ? 90 : financeScenario === "expected" ? 60 : 30) * arpaAssumed * 12).toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-semibold text-slate-200">Year 1 - Month 12</td>
                                            <td className="py-3">{financeScenario === "best" ? 150 : financeScenario === "expected" ? 100 : 50} customers</td>
                                            <td className="py-3 text-right text-emerald-400 font-bold">
                                                ${((financeScenario === "best" ? 150 : financeScenario === "expected" ? 100 : 50) * arpaAssumed).toLocaleString()}
                                            </td>
                                            <td className="py-3 text-right text-slate-400">
                                                ${((financeScenario === "best" ? 150 : financeScenario === "expected" ? 100 : 50) * arpaAssumed * 12).toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr className="bg-white/1 font-bold">
                                            <td className="py-3 text-slate-200 font-semibold">Year 2 - Year End</td>
                                            <td className="py-3">{financeScenario === "best" ? 350 : financeScenario === "expected" ? 250 : 120} customers</td>
                                            <td className="py-3 text-right text-emerald-400 font-bold">
                                                ${((financeScenario === "best" ? 350 : financeScenario === "expected" ? 250 : 120) * arpaAssumed).toLocaleString()}
                                            </td>
                                            <td className="py-3 text-right text-indigo-400">
                                                ${((financeScenario === "best" ? 350 : financeScenario === "expected" ? 250 : 120) * arpaAssumed * 12).toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr className="bg-white/2 font-bold">
                                            <td className="py-3 text-slate-200 font-semibold">Year 3 - Year End</td>
                                            <td className="py-3">{financeScenario === "best" ? 750 : financeScenario === "expected" ? 500 : 250} customers</td>
                                            <td className="py-3 text-right text-emerald-400 font-bold">
                                                ${((financeScenario === "best" ? 750 : financeScenario === "expected" ? 500 : 250) * arpaAssumed).toLocaleString()}
                                            </td>
                                            <td className="py-3 text-right text-indigo-400">
                                                ${((financeScenario === "best" ? 750 : financeScenario === "expected" ? 500 : 250) * arpaAssumed * 12).toLocaleString()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Customer Acquisition Assumptions */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                    <Activity className="w-4.5 h-4.5 text-indigo-400" />
                                    Acquisition Cost Assumptions
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { ch: "Openrize Bundle Option", detail: "Warm lead conversions with $0 additional CAC.", efficiency: "Very High" },
                                        { ch: "LinkedIn Social Outreach", desc: "Founder-led, low initial cash expenditure.", efficiency: "High" },
                                        { ch: "Customer Referral Engine", desc: "Dual advocacy rewards structure reduces CAC.", efficiency: "High" },
                                        { ch: "Agency reseller program", desc: "Bulk licensing slots shifts support / CAC burden.", efficiency: "High" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="p-3 bg-slate-950/60 border border-white/5 rounded-xl text-xs space-y-1">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-slate-200">{item.ch}</span>
                                                <span className="text-[9px] font-bold text-emerald-400 font-mono">{item.efficiency}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 leading-relaxed">{item.desc || item.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Part 11 Gates Checklist Tab ── */}
            {activeTab === "deliverables" && (
                <div className="max-w-2xl mx-auto">
                    <div className="glass-card rounded-2xl p-8 border border-border/60">
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4.5 h-4.5 text-emerald-400" /> Part 11 Financial Gates
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-8">
                            Toggle individual GTM financial checkpoints to sign off the strategic revenue roadmap.
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
                                <span className="text-slate-400">Part 11 Completion progress</span>
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
                                    <CheckCircle className="w-4.5 h-4.5" /> Part 11 Complete — GTM Financial Model and Roadmap approved!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
