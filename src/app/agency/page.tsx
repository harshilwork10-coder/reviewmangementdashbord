"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { 
    getBusinessesByAgency, getLocations, getReviews, getTasks, 
    Business, Location, Review, IssueTask, getAgencies, Agency 
} from "@/lib/store";
import { 
    Users, MapPin, Star, CreditCard, CheckSquare, MessageSquare, 
    TrendingUp, ShieldCheck, ChevronRight, Activity, Zap
} from "lucide-react";
import Link from "next/link";

export default function AgencyDashboard() {
    const { user } = useAuth();
    
    // Core data lists
    const [clients, setClients] = useState<Business[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [tasks, setTasks] = useState<IssueTask[]>([]);
    const [agency, setAgency] = useState<Agency | null>(null);

    useEffect(() => {
        if (user && user.agencyId) {
            const agencyId = user.agencyId;
            
            // Get current agency details
            const ags = getAgencies();
            const ag = ags.find(a => a.id === agencyId);
            if (ag) setAgency(ag);

            // Get clients for this agency
            const cls = getBusinessesByAgency(agencyId);
            setClients(cls);
            
            const clientIds = new Set(cls.map(c => c.id));

            // Get locations for agency clients
            const allLocs = getLocations().filter(l => clientIds.has(l.businessId));
            setLocations(allLocs);

            // Get reviews for agency clients
            const allRevs = getReviews().filter(r => clientIds.has(r.businessId));
            setReviews(allRevs);

            // Get tasks for agency clients
            const allTasks = getTasks().filter(t => clientIds.has(t.businessId));
            setTasks(allTasks);
        }
    }, [user]);

    // Financial / Plan details
    const planMRRMap: Record<string, number> = { starter: 29, growth: 79, agency: 199, enterprise: 999 };
    const mrrManaged = clients.reduce((sum, c) => sum + (planMRRMap[c.subscriptionPlan || "starter"] || 29), 0);

    const openTasks = tasks.filter(t => t.status !== "resolved").length;
    const pendingReviews = reviews.filter(r => r.status === "pending").length;
    
    // Average rating
    const avgRating = reviews.length
        ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
        : 0;

    const widgets = [
        { label: "Total Clients", value: clients.length, icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
        { label: "Total Locations", value: locations.length, icon: MapPin, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
        { label: "Reviews Managed", value: reviews.length, icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
        { label: "Consolidated Rating", value: avgRating ? `${avgRating} ★` : "N/A", icon: Star, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
        { label: "MRR Under Management", value: `$${mrrManaged.toLocaleString()}`, icon: CreditCard, color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
        { label: "Active Client Staff", value: clients.length * 3 + 2, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
        { label: "Open Client Tasks", value: openTasks, icon: CheckSquare, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
        { label: "Pending Reviews Feed", value: pendingReviews, icon: MessageSquare, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    ];

    const kpis = [
        { label: "Client Growth", value: "+15.4% MoM", desc: "Net new brand acquisitions" },
        { label: "Review Growth", value: "+24.8% MoM", desc: "Automated invite submission velocity" },
        { label: "Client Retention", value: "98.6%", desc: "Average agency client tenure rate" },
    ];

    return (
        <div className="h-screen overflow-y-auto p-8 bg-background">
            {/* Header banner */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Agency Command Center</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Overview metrics for <strong className="text-white">{agency?.name || "Apex Reputation Partners"}</strong>.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-xl text-xs font-semibold w-fit">
                    <ShieldCheck className="w-4 h-4 text-primary" /> Active Whitelabel Sandbox Mode
                </div>
            </div>

            {/* KPIs Trend Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {kpis.map((kpi, idx) => (
                    <div key={idx} className="glass-card rounded-2xl p-5 border border-border/60">
                        <div className="text-2xl font-extrabold text-white mb-1">{kpi.value}</div>
                        <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{kpi.label}</div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{kpi.desc}</p>
                    </div>
                ))}
            </div>

            {/* Core Widgets Grid */}
            <h2 className="text-sm font-bold text-white mb-4">Agency Consolidated Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

            {/* Split screen: client overview and review feeds */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Client Size Breakdown */}
                <div className="glass-card rounded-2xl p-6 border border-border/60 lg:col-span-1">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                            <Activity className="w-4 h-4 text-primary" /> Portfolio Performance
                        </h3>
                        <Link href="/agency/clients" className="text-xs text-primary hover:underline">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {clients.map(client => {
                            const clientRevs = reviews.filter(r => r.businessId === client.id);
                            const clientAvg = clientRevs.length
                                ? (clientRevs.reduce((sum, r) => sum + r.rating, 0) / clientRevs.length).toFixed(1)
                                : "N/A";
                            return (
                                <div key={client.id} className="p-3 rounded-xl bg-secondary/10 border border-border/30 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-lg shrink-0">
                                            {client.logo}
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-xs font-bold text-white block truncate max-w-[120px]">{client.name}</span>
                                            <span className="text-[9px] text-muted-foreground capitalize">{client.subscriptionPlan} Plan</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-extrabold text-white block">{clientAvg}★</span>
                                        <span className="text-[9px] text-muted-foreground">{clientRevs.length} reviews</span>
                                    </div>
                                </div>
                            );
                        })}
                        {clients.length === 0 && (
                            <div className="py-6 text-center text-xs text-muted-foreground">No clients added.</div>
                        )}
                    </div>
                </div>

                {/* Consolidated Feed */}
                <div className="glass-card rounded-2xl p-6 border border-border/60 lg:col-span-2">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4 text-primary" /> Recent Client Reviews Feed
                        </h3>
                        <Link href="/agency/clients" className="text-xs text-primary hover:underline font-semibold">Switch & Reply</Link>
                    </div>
                    <div className="space-y-3">
                        {reviews.slice(0, 4).map(rev => {
                            const biz = clients.find(c => c.id === rev.businessId);
                            return (
                                <div key={rev.id} className="p-3.5 rounded-xl bg-secondary/15 border border-border/30 flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3 min-w-0">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                            {rev.customerName.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <span className="font-bold text-xs text-white leading-none">{rev.customerName}</span>
                                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary">{biz?.name || "Client"}</span>
                                                <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-2.5 h-2.5 ${i <= rev.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"}`} />)}</div>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground line-clamp-1 leading-relaxed">{rev.text}</p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] text-muted-foreground shrink-0 mt-0.5">
                                        {new Date(rev.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            );
                        })}
                        {reviews.length === 0 && (
                            <div className="py-8 text-center text-xs text-muted-foreground">No recent review data imported.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
