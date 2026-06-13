"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getAgencies, getBusinessesByAgency, saveAgency, Agency, Business, addAuditLog } from "@/lib/store";
import { 
    CreditCard, Check, Settings, ShieldCheck, RefreshCw, 
    TrendingUp, Info, DollarSign, Users, AlertTriangle
} from "lucide-react";

export default function AgencyBillingPage() {
    const { user } = useAuth();
    const [agency, setAgency] = useState<Agency | null>(null);
    const [clients, setClients] = useState<Business[]>([]);
    const [updating, setUpdating] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    const showNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const refresh = () => {
        if (user && user.agencyId) {
            const agencyId = user.agencyId;
            const ags = getAgencies();
            const ag = ags.find(a => a.id === agencyId);
            if (ag) setAgency(ag);
            setClients(getBusinessesByAgency(agencyId));
        }
    };

    useEffect(() => {
        refresh();
    }, [user]);

    const handlePlanChange = (plan: "starter" | "growth" | "enterprise") => {
        if (!agency) return;
        setUpdating(plan);
        
        setTimeout(() => {
            const oldPlan = agency.plan;
            const updated: Agency = {
                ...agency,
                plan
            };
            saveAgency(updated);
            setAgency(updated);
            addAuditLog("Agency Plan Changed", undefined, user?.id, { oldPlan, newPlan: plan });
            setUpdating(null);
            showNotification(`Agency subscription upgraded to ${plan.toUpperCase()}!`);
            refresh();
        }, 1500);
    };

    if (!agency) return <div className="flex items-center justify-center h-screen"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;

    // Quotas: Starter (10 clients), Growth (30 clients), Enterprise (unlimited)
    const quotas: Record<string, number> = { starter: 10, growth: 30, enterprise: 999 };
    const maxQuota = quotas[agency.plan] || 10;
    const clientCount = clients.length;

    // Calculate overage: $25 per client exceeding quota
    const overageClients = Math.max(0, clientCount - maxQuota);
    const overageCharge = overageClients * 25;

    // Financial calculations
    const agencyBaseMap: Record<string, number> = { starter: 299, growth: 599, enterprise: 1499 };
    const basePrice = agencyBaseMap[agency.plan] || 299;
    const totalInvoice = basePrice + overageCharge;

    // MRR generated from client retail subscription plans
    const planMRRMap: Record<string, number> = { starter: 29, growth: 79, agency: 199, enterprise: 999 };
    const totalClientRevenue = clients.reduce((sum, c) => sum + (planMRRMap[c.subscriptionPlan || "starter"] || 29), 0);

    return (
        <div className="h-screen overflow-y-auto p-8 bg-background text-foreground relative flex flex-col">
            {/* Notification Banner */}
            {notification && (
                <div className="fixed top-4 right-4 z-[100] px-4 py-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-semibold transition-all">
                    <Check className="w-4 h-4" />
                    {notification}
                </div>
            )}

            {/* Page Title */}
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-primary" /> Agency Billing
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Configure agency subscription plans, audit additional client overages, and inspect MRR metrics.
                    </p>
                </div>
                <button onClick={refresh} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-secondary/50 border border-border text-muted-foreground hover:text-white transition-all">
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
            </div>

            {/* Financial summaries */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 shrink-0">
                <div className="glass-card rounded-2xl p-5 border border-border/60">
                    <div className="text-2xl font-extrabold text-white mb-1">${totalInvoice.toLocaleString()} /mo</div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase">Your Agency Invoice</div>
                </div>
                <div className="glass-card rounded-2xl p-5 border border-emerald-500/25 bg-emerald-500/5">
                    <div className="text-2xl font-extrabold text-emerald-400 mb-1">${totalClientRevenue.toLocaleString()} /mo</div>
                    <div className="text-xs font-semibold text-emerald-400 uppercase">Total Revenue Managed</div>
                </div>
                <div className="glass-card rounded-2xl p-5 border border-purple-500/25 bg-purple-500/5">
                    <div className="text-2xl font-extrabold text-purple-400 mb-1">
                        ${totalClientRevenue ? Math.round((totalClientRevenue - totalInvoice)) : 0} /mo
                    </div>
                    <div className="text-xs font-semibold text-purple-400 uppercase">Net Agency Profit Margin</div>
                </div>
            </div>

            {/* Split screen: Plan picker & Usage summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Plan picker panel */}
                <div className="glass-card rounded-2xl p-6 border border-border/60 lg:col-span-2 space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">Agency Subscriptions Tiers</h3>
                        <p className="text-xs text-muted-foreground">Select your agency volume plan. Upgrades/downgrades take effect immediately.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { id: "starter", name: "Agency Starter", price: "$299/mo", limits: "Up to 10 clients", desc: "Includes basic whitelabel PDF reports and custom branding." },
                            { id: "growth", name: "Agency Growth", price: "$599/mo", limits: "Up to 30 clients", desc: "Includes advanced custom domain hosting and team leadership metrics." },
                            { id: "enterprise", name: "Agency Enterprise", price: "$1,499/mo", limits: "Unlimited client licenses", desc: "Dedicated SLA specialists, unlimited team users, and custom portal integrations." }
                        ].map(plan => {
                            const isCurrent = agency.plan === plan.id;
                            const isPending = updating === plan.id;
                            return (
                                <div key={plan.id} className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                                    isCurrent 
                                        ? "bg-primary/10 border-primary" 
                                        : "bg-secondary/15 border-border/40 hover:border-border/60 hover:bg-secondary/25"
                                }`}>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-white">{plan.name}</span>
                                            {isCurrent && (
                                                <span className="text-[9px] bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded font-bold uppercase">Active Plan</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">{plan.desc}</p>
                                        <span className="text-[10px] text-muted-foreground font-semibold block">{plan.limits} · {plan.price}</span>
                                    </div>
                                    <button type="button" onClick={() => handlePlanChange(plan.id as any)} disabled={isCurrent || isPending}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                                            isCurrent 
                                                ? "bg-primary/10 text-primary border border-primary/20 cursor-default" 
                                                : "bg-primary hover:bg-primary/95 text-white"
                                        }`}>
                                        {isPending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : isCurrent ? "Active" : "Switch Plan"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Quota usage & surcharge sidebar */}
                <div className="glass-card rounded-2xl p-6 border border-border/60 h-fit space-y-5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Users className="w-4.5 h-4.5 text-primary" /> Quota & Surcharges</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Active Clients Quota Usage</span>
                                <span className="font-semibold text-white">
                                    {clientCount} / {agency.plan === "enterprise" ? "Unlimited" : maxQuota}
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{
                                    width: agency.plan === "enterprise" ? "10%" : `${Math.min(100, (clientCount / maxQuota) * 100)}%`
                                }} />
                            </div>
                        </div>

                        {overageClients > 0 && (
                            <div className="p-3.5 bg-amber-500/5 border border-amber-500/15 text-xs text-amber-400 flex items-start gap-2 rounded-xl">
                                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold mb-0.5">Overage Surcharge Detected</p>
                                    <p className="leading-relaxed text-[10px] text-muted-foreground/80">
                                        Your client catalog has exceeded the base quota of your {agency.plan.toUpperCase()} plan by <strong>{overageClients}</strong> licenses. You are billed <strong>$25/mo</strong> for each overage.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2.5 text-xs">
                            <span className="text-[10px] text-muted-foreground block border-b border-border/20 pb-1.5 uppercase font-bold tracking-wider">Invoice Cost Center</span>
                            <div className="flex justify-between py-1">
                                <span className="text-muted-foreground">Base subscription plan</span>
                                <span className="font-semibold text-white">${basePrice}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-muted-foreground">Overage charges ({overageClients} x $25)</span>
                                <span className="font-semibold text-white">${overageCharge}</span>
                            </div>
                            <div className="flex justify-between py-1 border-t border-border/10 mt-2 pt-2.5 font-bold text-white">
                                <span>Estimated Monthly Bill</span>
                                <span>${totalInvoice}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
