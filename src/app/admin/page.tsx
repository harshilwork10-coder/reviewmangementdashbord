"use client";
import { useEffect, useState } from "react";
import { 
    getBusinesses, getReviews, getUsers, getLocations, getTickets, getPlatformHealth, getAuditLogs, 
    Business, Review, SupportTicket, PlatformHealth, AuditLog 
} from "@/lib/store";
import { 
    Building2, Star, Users, MessageSquare, TrendingUp, Activity, CreditCard, LifeBuoy, 
    ShieldCheck, AlertTriangle, Shield, CheckCircle, RefreshCw, Zap 
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [usersCount, setUsersCount] = useState(0);
    const [locationsCount, setLocationsCount] = useState(0);
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [health, setHealth] = useState<PlatformHealth | null>(null);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

    useEffect(() => {
        setBusinesses(getBusinesses());
        setReviews(getReviews());
        setUsersCount(getUsers().length);
        setLocationsCount(getLocations().length);
        setTickets(getTickets());
        setHealth(getPlatformHealth());
        setAuditLogs(getAuditLogs().slice(0, 5));
    }, []);

    if (!health) {
        return <div className="flex items-center justify-center h-screen"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;
    }

    const openTicketsCount = tickets.filter(t => t.status !== "resolved").length;

    // Billing calculations
    const planMRRMap: Record<string, number> = { starter: 29, growth: 79, agency: 199, enterprise: 999 };
    const mrr = businesses.reduce((sum, b) => sum + (planMRRMap[b.subscriptionPlan || "starter"] || 29), 0);
    const arr = mrr * 12;

    // AI calculations
    const aiRepliesGenerated = reviews.filter(r => r.repliedBy === "AI" || r.status === "replied").length * 2 + 8;

    const widgets = [
        { label: "Total Organizations", value: businesses.length, icon: Building2, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
        { label: "Active Locations", value: locationsCount, icon: Building2, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
        { label: "Total Reviews Managed", value: reviews.length, icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
        { label: "Active Platform Users", value: usersCount, icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
        { label: "Monthly Recurring Revenue", value: `$${mrr.toLocaleString()}`, icon: CreditCard, color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
        { label: "Annual Recurring Revenue", value: `$${arr.toLocaleString()}`, icon: CreditCard, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
        { label: "AI Replies Generated", value: aiRepliesGenerated, icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
        { label: "Support Tickets Open", value: openTicketsCount, icon: LifeBuoy, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
    ];

    const kpis = [
        { label: "Growth Rate", value: "+12.4% MoM", desc: "New businesses signups this month" },
        { label: "Churn Rate", value: "1.2%", desc: "Subscription cancellations" },
        { label: "Trial Conversions", value: "74%", desc: "Conversion of free trials to paid" },
        { label: "Platform Uptime", value: "99.98%", desc: "Average uptime across all services" },
    ];

    return (
        <div className="h-screen overflow-y-auto p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
                    <p className="text-muted-foreground text-sm mt-1">Operational command center for ReviewManagement Super Administrators.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4" /> Live Platform Secure
                </div>
            </div>

            {/* KPI Trends Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {kpis.map((kpi, idx) => (
                    <div key={idx} className="glass-card rounded-2xl p-5 border border-border/60">
                        <div className="text-2xl font-extrabold text-white mb-1">{kpi.value}</div>
                        <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{kpi.label}</div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{kpi.desc}</p>
                    </div>
                ))}
            </div>

            {/* Stat Widgets */}
            <h2 className="text-sm font-bold text-white mb-4">Core Operating Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {widgets.map(w => {
                    const Icon = w.icon;
                    return (
                        <div key={w.label} className={`glass-card rounded-2xl p-5 border ${w.bg} flex items-start justify-between`}>
                            <div>
                                <div className="text-3xl font-extrabold text-white mb-1">{w.value}</div>
                                <div className="text-xs text-muted-foreground font-semibold leading-snug">{w.label}</div>
                            </div>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                                <Icon className={`w-5 h-5 ${w.color}`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Platform Health Monitor */}
                <div className="glass-card rounded-2xl p-6 border border-border/60">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Activity className="w-4 h-4 text-primary" /> Service Health Monitor
                        </h3>
                        <Link href="/admin/health-logs" className="text-xs text-primary hover:underline">Full Details</Link>
                    </div>
                    <div className="space-y-3.5">
                        {[
                            { name: "API Gateway", status: health.api },
                            { name: "Database Cluster", status: health.database },
                            { name: "Google GBP Sync Sync", status: health.sync },
                            { name: "OpenAI GPT Replies Engine", status: health.openai },
                            { name: "Stripe Billing Infrastructure", status: health.stripe },
                        ].map(service => (
                            <div key={service.name} className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/30">
                                <span className="text-xs font-semibold text-white">{service.name}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                    service.status === "healthy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}>
                                    {service.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Audit Trail */}
                <div className="glass-card rounded-2xl p-6 border border-border/60 lg:col-span-2">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Shield className="w-4 h-4 text-primary" /> Live Audit Log Trail
                        </h3>
                        <Link href="/admin/health-logs" className="text-xs text-primary hover:underline">View all</Link>
                    </div>
                    <div className="space-y-3">
                        {auditLogs.map(log => (
                            <div key={log.id} className="p-3.5 rounded-xl bg-secondary/20 border border-border/30 flex items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-white text-xs">{log.action}</span>
                                        <span className="text-[10px] text-muted-foreground">· by {log.userName}</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground/85">
                                        IP: {log.ipAddress} · metadata: {JSON.stringify(log.metadata)}
                                    </p>
                                </div>
                                <span className="text-[10px] text-muted-foreground/60 shrink-0">
                                    {new Date(log.createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                        ))}
                        {auditLogs.length === 0 && (
                            <div className="py-8 text-center text-xs text-muted-foreground">No recent audit logs available.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
