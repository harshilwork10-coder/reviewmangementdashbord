"use client";

import { useState, useEffect } from "react";
import {
    BarChart, TrendingUp, Download, Clock, AlertTriangle, Play, X, Info,
    Check, CheckCircle, ChevronRight, ChevronDown, RefreshCw,
    Layout, Star, Building, Users, Activity, FileText, Bell, Sparkles, Mail
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface DashboardMetric {
    label: string;
    val: string;
    desc: string;
    color: string;
}

interface RecentReview {
    id: string;
    customer: string;
    location: string;
    rating: number;
    text: string;
    source: "Google" | "Yelp" | "Facebook";
    timestamp: string;
}

interface AgencyClient {
    name: string;
    locations: number;
    totalReviews: number;
    avgRating: string;
    healthScore: number;
}

interface NotificationAlert {
    id: string;
    type: "new_review" | "negative_alert" | "delivery_failure" | "subscription";
    title: string;
    text: string;
    timestamp: string;
    unread: boolean;
}

interface ToastMessage {
    id: string;
    type: "success" | "warning" | "error" | "info";
    text: string;
}

// ── Dashboard Metrics Presets ──────────────────────────────────────────────
const execMetrics: DashboardMetric[] = [
    { label: "Total Requests Sent", val: "12,450 invites", desc: "Outbound outreach sum", color: "text-violet-400" },
    { label: "Reviews Received", val: "3,120 reviews", desc: "Successfully indexed feed", color: "text-cyan-400" },
    { label: "Average Star Rating", val: "4.75 / 5.00", desc: "★ Cumulative platform score", color: "text-yellow-400" },
    { label: "Conversion Rate", val: "25.1%", desc: "Invites-to-Reviews ratio", color: "text-red-400" },
    { label: "Business Health Score", val: "92 / 100", desc: "Excellent brand standing", color: "text-emerald-400" }
];

const bizMetrics: DashboardMetric[] = [
    { label: "Location Active Invites", val: "240 pending", desc: "Currently in Redis queues", color: "text-violet-400" },
    { label: "Response Rate", val: "42.8%", desc: "Customers opening links", color: "text-cyan-400" },
    { label: "Unsubscribe count", val: "14 opt-outs", desc: "0.1% of total list size", color: "text-slate-400" },
    { label: "Campaigns Launched", val: "8 campaigns", desc: "Active location promos", color: "text-orange-400" },
    { label: "Google Redirects", val: "680 clicks", desc: "Directing to review forms", color: "text-emerald-400" }
];

// ── Recent Reviews Data ────────────────────────────────────────────────────
const initialReviews: RecentReview[] = [
    { id: "rev_01", customer: "Sophia Martinez", location: "Acme Corporate HQ", rating: 5, text: "Incredible support and service. Very professional team!", source: "Google", timestamp: "10 mins ago" },
    { id: "rev_02", customer: "James Cooper", location: "Pizza Palace - Westside", rating: 2, text: "Pizza arrived cold, and service was slow today.", source: "Yelp", timestamp: "1 hour ago" },
    { id: "rev_03", customer: "Emma Watson", location: "Pizza Palace - Uptown", rating: 5, text: "Best pepperoni pizzas in town! Highly recommend.", source: "Google", timestamp: "2 hours ago" },
    { id: "rev_04", customer: "Liam Neeson", location: "Global Logistics Inc", rating: 4, text: "Good courier service, deliveries arrive on time.", source: "Facebook", timestamp: "4 hours ago" }
];

// ── Agency Comparative Location Data ───────────────────────────────────────
const agencyClients: AgencyClient[] = [
    { name: "Acme Corporates LLC", locations: 2, totalReviews: 1870, avgRating: "4.65", healthScore: 91 },
    { name: "Pizza Palace Group", locations: 3, totalReviews: 6290, avgRating: "4.55", healthScore: 88 },
    { name: "Global Logistics Group", locations: 1, totalReviews: 120, avgRating: "4.00", healthScore: 82 },
];

// ── Notification Alerts Data ────────────────────────────────────────────────
const initialAlerts: NotificationAlert[] = [
    { id: "alt_01", type: "new_review", title: "New Google Review", text: "Acme Corporate HQ received a ★★★★★ review from Sophia Martinez.", timestamp: "10 mins ago", unread: true },
    { id: "alt_02", type: "negative_alert", title: "Critical Negative Review", text: "Pizza Palace - Westside received a ★★☆☆☆ review from James Cooper.", timestamp: "1 hour ago", unread: true },
    { id: "alt_03", type: "delivery_failure", title: "SMS Dispatch Bounce", text: "SMS invite to +15550198223 failed (Invalid Carrier Routing Code).", timestamp: "2 hours ago", unread: false },
    { id: "alt_04", type: "subscription", title: "Billing Limit Warning", text: "Pizza Palace Group reached 95% of active monthly invite capacities.", timestamp: "1 day ago", unread: false }
];

// ── Trend Graph Data Samples ───────────────────────────────────────────────
const weeklyVolume = [
    { label: "Mon", val: 32, rating: 4.8 },
    { label: "Tue", val: 45, rating: 4.6 },
    { label: "Wed", val: 55, rating: 4.7 },
    { label: "Thu", val: 78, rating: 4.5 },
    { label: "Fri", val: 92, rating: 4.8 },
    { label: "Sat", val: 110, rating: 4.9 },
    { label: "Sun", val: 84, rating: 4.7 }
];

const monthlyVolume = [
    { label: "Jan", val: 120, rating: 4.5 },
    { label: "Feb", val: 180, rating: 4.6 },
    { label: "Mar", val: 240, rating: 4.6 },
    { label: "Apr", val: 380, rating: 4.7 },
    { label: "May", val: 420, rating: 4.8 },
    { label: "Jun", val: 590, rating: 4.8 }
];

export default function SuperAdminReportingPage() {
    const [activeTab, setActiveTab] = useState<"dashboards" | "sandbox" | "exports" | "notifications" | "deliverables">("dashboards");

    // Scope selection inside Dashboards tab
    const [dashboardScope, setDashboardScope] = useState<"exec" | "biz" | "agency">("exec");

    // KPI Sandbox chart configurations
    const [timeframe, setTimeframe] = useState<"7d" | "30d" | "12m">("7d");
    const [locationFilter, setLocationFilter] = useState<string>("all");
    const [chartMetric, setChartMetric] = useState<"volume" | "sentiment">("volume");

    // Export states
    const [reportFormat, setReportFormat] = useState<"pdf" | "csv" | "summary" | "agency">("pdf");
    const [exporting, setExporting] = useState(false);
    const [exportLogs, setExportLogs] = useState<string[]>([]);
    const [schedulePeriod, setSchedulePeriod] = useState<"weekly" | "monthly">("weekly");
    const [scheduleEmail, setScheduleEmail] = useState("");

    // Notifications state
    const [alerts, setAlerts] = useState<NotificationAlert[]>(initialAlerts);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    // Deliverables check
    const [deliverables, setDeliverables] = useState([
        { id: "dp1", label: "Dashboard requirements approved", checked: true },
        { id: "dp2", label: "KPI definitions finalized", checked: true },
        { id: "dp3", label: "Report templates documented", checked: true },
        { id: "dp4", label: "Notification framework approved", checked: true },
        { id: "dp5", label: "Analytics implementation ready", checked: false },
    ]);

    const doneDels = deliverables.filter(d => d.checked).length;

    // Toast triggers
    const addToast = (type: ToastMessage["type"], text: string) => {
        const id = Math.random().toString(36).substring(7);
        setToasts(prev => [...prev, { id, type, text }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    // Report compilation simulation
    const triggerExport = () => {
        setExporting(true);
        setExportLogs(["[INIT] Spawning reporting compilation worker..."]);

        setTimeout(() => {
            setExportLogs(prev => [...prev, `[QUERY] Compiling metrics sharded by: ${locationFilter === "all" ? "All Locations" : locationFilter}`]);
        }, 800);

        setTimeout(() => {
            setExportLogs(prev => [...prev, `[RENDER] Formatting layout structure: ${reportFormat.toUpperCase()} template`]);
        }, 1600);

        setTimeout(() => {
            setExportLogs(prev => [...prev, "[OK] Compressing graphic charts vector SVGs..."]);
        }, 2400);

        setTimeout(() => {
            setExportLogs(prev => [...prev, `[SUCCESS] Compiled download ready: ReviewHub_Report_${Math.random().toString(36).substring(7)}.${reportFormat === "csv" ? "csv" : "pdf"}`]);
            setExporting(false);
            addToast("success", "Report compiled and downloaded successfully!");
        }, 3600);
    };

    // Scheduled reports
    const addSchedule = () => {
        if (!scheduleEmail) {
            addToast("error", "Email parameter is required.");
            return;
        }
        addToast("success", `Scheduled ${schedulePeriod} reports for ${scheduleEmail}`);
        setScheduleEmail("");
    };

    // Notification alert injectors
    const injectNotification = (type: "positive" | "negative" | "bounce") => {
        const id = `alt_inj_${Math.random().toString(36).substring(7)}`;
        const timestamp = "Just now";
        let newAlert: NotificationAlert;

        if (type === "positive") {
            newAlert = {
                id,
                type: "new_review",
                title: "New Google Review",
                text: "Pizza Palace - Westside received a ★★★★★ review from Mark Peterson.",
                timestamp,
                unread: true
            };
            addToast("success", "New review alert injected.");
        } else if (type === "negative") {
            newAlert = {
                id,
                type: "negative_alert",
                title: "Negative Review Escalation",
                text: "Global Logistics Inc received a ★☆☆☆☆ review. Support ticket created.",
                timestamp,
                unread: true
            };
            addToast("error", "CRITICAL Negative review alert triggered!");
        } else {
            newAlert = {
                id,
                type: "delivery_failure",
                title: "Carrier Send Failure",
                text: "Twilio SMS callback: +15550293849 blocked (Spam filter trigger).",
                timestamp,
                unread: true
            };
            addToast("warning", "SMS delivery failure warning logged.");
        }

        setAlerts(prev => [newAlert, ...prev]);
    };

    const markAllRead = () => {
        setAlerts(prev => prev.map(a => ({ ...a, unread: false })));
        addToast("info", "All alerts marked as read.");
    };

    const tabs = [
        { id: "dashboards", label: "Dashboard Views", icon: Layout },
        { id: "sandbox", label: "KPI Sandbox", icon: TrendingUp },
        { id: "exports", label: "Export Reports", icon: Download },
        { id: "notifications", label: "Notification Alerts", icon: Bell },
        { id: "deliverables", label: "Part 8 Gates", icon: CheckCircle },
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
                        <BarChart className="w-6 h-6 text-red-500" />
                        Dashboard & Reporting Console
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Select dashboard profiles scopes, customize KPI visualizers, compile PDF reports, and verify negative alerts.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
                        Recharts SVG · head-Chromium
                    </div>
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold">
                        Real-Time Pub/Sub Alerting
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

            {/* ── Dashboard Views Tab ── */}
            {activeTab === "dashboards" && (
                <div className="space-y-6">
                    {/* Switcher */}
                    <div className="flex gap-2 p-1 bg-slate-950 border border-white/5 rounded-xl max-w-md">
                        {[
                            { id: "exec", label: "Executive Dashboard" },
                            { id: "biz", label: "Location Dashboard" },
                            { id: "agency", label: "Agency Dashboard" }
                        ].map(s => (
                            <button
                                key={s.id}
                                onClick={() => setDashboardScope(s.id as any)}
                                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                    dashboardScope === s.id ? "bg-red-600/25 text-red-400 border border-red-500/20" : "text-slate-400 hover:text-white"
                                }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    {/* Dashboard preset renderer */}
                    {dashboardScope === "exec" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                {execMetrics.map((kpi, idx) => (
                                    <div key={idx} className="glass-card rounded-2xl p-5 border border-border/60">
                                        <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wide">{kpi.label}</span>
                                        <div className={`text-lg font-bold font-mono mt-1 ${kpi.color}`}>{kpi.val}</div>
                                        <span className="text-[9px] text-slate-400 block mt-1">{kpi.desc}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="glass-card rounded-2xl p-5 border border-border/60 bg-red-500/5 text-xs text-red-400 border-red-500/10">
                                <strong>Executive Insights Summary</strong>: Platform health average stands at 92/100, driven by a solid 25.1% invites-to-reviews conversion rate across sharded locations.
                            </div>
                        </div>
                    )}

                    {dashboardScope === "biz" && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* KPI Widgets */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                    {bizMetrics.map((kpi, idx) => (
                                        <div key={idx} className="glass-card rounded-2xl p-4 border border-border/60">
                                            <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wide">{kpi.label}</span>
                                            <div className={`text-sm font-bold font-mono mt-1 ${kpi.color}`}>{kpi.val}</div>
                                            <span className="text-[8px] text-slate-400 block mt-0.5">{kpi.desc}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Recent reviews */}
                                <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4">
                                    <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                        <Star className="w-4 h-4 text-yellow-400" /> Recent Location Reviews Activity
                                    </div>
                                    <div className="space-y-3">
                                        {initialReviews.map(rev => (
                                            <div key={rev.id} className="p-3 bg-slate-950/60 border border-white/5 rounded-xl flex items-start justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <strong className="text-xs text-slate-200">{rev.customer}</strong>
                                                        <span className="text-[9px] text-slate-500">{rev.location}</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{rev.text}</p>
                                                    <span className="text-[9px] text-red-400 font-mono mt-1 block">via {rev.source}</span>
                                                </div>
                                                <div className="flex text-yellow-400 shrink-0">
                                                    {Array.from({ length: rev.rating }).map((_, idx) => (
                                                        <Star key={idx} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                    {Array.from({ length: 5 - rev.rating }).map((_, idx) => (
                                                        <Star key={idx} className="w-3 h-3 text-slate-700" />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Action Panel */}
                            <div className="space-y-4">
                                <div className="glass-card rounded-2xl p-5 border border-border/60 space-y-4">
                                    <div className="text-xs font-bold text-white uppercase tracking-wider">Store Quick Actions</div>
                                    <div className="space-y-2.5">
                                        {[
                                            { action: "Manually Import Customers", rule: "Upload customer data CSV lists directly" },
                                            { action: "Sync Location API Feed", rule: "Refresh google profile reviews index scraper" },
                                            { action: "Send Single Invites", rule: "Trigger immediate dispatch coordinates form" }
                                        ].map((act, i) => (
                                            <button key={i} onClick={() => addToast("info", `${act.action} triggered.`)}
                                                className="w-full p-3 bg-slate-950 border border-white/5 hover:border-white/10 text-left rounded-xl transition-all cursor-pointer">
                                                <div className="text-[10px] font-bold text-slate-200">{act.action}</div>
                                                <div className="text-[8px] text-slate-500 mt-0.5 leading-none">{act.rule}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {dashboardScope === "agency" && (
                        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4">
                            <div className="text-xs font-bold text-white uppercase tracking-wider">Multi-Client Portfolio Performance</div>
                            <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/60">
                                <table className="w-full text-[11px] text-slate-300">
                                    <thead>
                                        <tr className="bg-slate-950 border-b border-white/5 text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                                            <th className="text-left p-4">Client Brand Name</th>
                                            <th className="text-center p-4">Active Locations</th>
                                            <th className="text-center p-4">Total Reviews generated</th>
                                            <th className="text-center p-4">Average Star rating</th>
                                            <th className="text-center p-4">Portfolio health score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {agencyClients.map((client, idx) => (
                                            <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                                                <td className="p-4 font-bold text-slate-200">{client.name}</td>
                                                <td className="p-4 text-center text-slate-400">{client.locations} locations</td>
                                                <td className="p-4 text-center font-mono text-slate-400">{client.totalReviews} reviews</td>
                                                <td className="p-4 text-center font-mono text-yellow-400 font-bold">★ {client.avgRating}</td>
                                                <td className="p-4 text-center">
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                                        client.healthScore >= 90 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                    }`}>
                                                        {client.healthScore} / 100
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── KPI Sandbox Tab ── */}
            {activeTab === "sandbox" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chart visualizers */}
                    <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-border/60 space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Activity className="w-4.5 h-4.5 text-cyan-400" /> Interactive KPI Trend Visualizer
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">Toggle parameters below to re-render trend SVG vector mocks.</p>
                            </div>
                        </div>

                        {/* Sandbox settings */}
                        <div className="grid grid-cols-3 gap-3 p-3 bg-slate-950/80 rounded-xl border border-white/5">
                            <div className="space-y-1">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Scope</label>
                                <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)}
                                    className="w-full bg-slate-900 border border-white/10 rounded-lg text-xs text-white p-1.5 focus:outline-none">
                                    <option value="all">All Locations</option>
                                    <option value="acme">Acme Corporate</option>
                                    <option value="pizza">Pizza Palace Westside</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Interval</label>
                                <select value={timeframe} onChange={e => setTimeframe(e.target.value as any)}
                                    className="w-full bg-slate-900 border border-white/10 rounded-lg text-xs text-white p-1.5 focus:outline-none">
                                    <option value="7d">Last 7 Days</option>
                                    <option value="30d">Last 30 Days</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Metrics Parameter</label>
                                <select value={chartMetric} onChange={e => setChartMetric(e.target.value as any)}
                                    className="w-full bg-slate-900 border border-white/10 rounded-lg text-xs text-white p-1.5 focus:outline-none">
                                    <option value="volume">Review Volume</option>
                                    <option value="sentiment">Rating Sentiment</option>
                                </select>
                            </div>
                        </div>

                        {/* SVG Chart display */}
                        <div className="bg-slate-950 rounded-xl p-4 border border-white/5 space-y-3">
                            <div className="flex justify-between items-center text-[10px] text-slate-400">
                                <span className="font-bold text-white">
                                    {chartMetric === "volume" ? "Review Ingestion Volume Feed" : "Average Rating Sentiment"}
                                </span>
                                <span className="text-red-400 font-mono font-bold">{timeframe === "7d" ? "Interval: Daily" : "Interval: Monthly"}</span>
                            </div>
                            <div className="flex items-end justify-between h-40 pt-6 px-2">
                                {(timeframe === "7d" ? weeklyVolume : monthlyVolume).map((point, idx) => {
                                    const scale = chartMetric === "volume" ? (point.val / 150) * 100 : (point.rating / 5.0) * 100;
                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 group cursor-pointer">
                                            <div className="relative w-full flex items-end justify-center h-full">
                                                <div className="absolute bottom-full mb-1.5 bg-red-600 text-white font-mono text-[8px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                                    {chartMetric === "volume" ? `${point.val} reviews` : `★ ${point.rating}`}
                                                </div>
                                                <div style={{ height: `${scale}%` }}
                                                    className={`w-3/5 rounded-t bg-gradient-to-t from-red-600 to-orange-500 transition-all duration-500 group-hover:brightness-125`} />
                                            </div>
                                            <span className="text-[9px] text-slate-600 group-hover:text-slate-300 transition-colors font-mono">{point.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Explanations card */}
                    <div className="space-y-4">
                        <div className="glass-card rounded-2xl p-5 border border-border/60">
                            <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Visualization Guidelines
                            </h4>
                            <div className="space-y-3 text-[10px] text-slate-400">
                                <div>
                                    <strong className="text-slate-200 block">p95 Load Target: &lt; 3.0s</strong>
                                    <span>Dashboard rendering routines code-split heavy visualization packages asynchronously.</span>
                                </div>
                                <div className="border-t border-white/5 pt-2.5">
                                    <strong className="text-slate-200 block">Caching TTL window</strong>
                                    <span>Database aggregation results cached in Redis for 15 minutes before refreshing.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Export Reports Tab ── */}
            {activeTab === "exports" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Action Card */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                <Download className="w-4.5 h-4.5 text-red-400" /> Export Compilation Sandbox
                            </h3>
                            <p className="text-xs text-slate-400">Simulate backend report formatting pipelines and export raw spreadsheets.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 font-medium">Export Template</label>
                                <select value={reportFormat} onChange={e => setReportFormat(e.target.value as any)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl text-xs text-white p-2.5 focus:outline-none focus:ring-1 focus:ring-red-500">
                                    <option value="pdf">PDF Executive Summary Report</option>
                                    <option value="csv">CSV Spreadsheet raw records</option>
                                    <option value="summary">One-Page Executive Summary</option>
                                    <option value="agency">Consolidated Agency Report</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 font-medium">Locations Scoping</label>
                                <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl text-xs text-white p-2.5 focus:outline-none focus:ring-1 focus:ring-red-500">
                                    <option value="all">All Brand Locations</option>
                                    <option value="acme">Acme Corporate HQ only</option>
                                </select>
                            </div>
                        </div>

                        <button onClick={triggerExport} disabled={exporting}
                            className="w-full py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shadow-md">
                            {exporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                            {exporting ? "Formatting PDF pages..." : "Generate Export file"}
                        </button>

                        {/* logs */}
                        {(exporting || exportLogs.length > 0) && (
                            <div className="bg-slate-950 rounded-xl border border-white/5 p-4 font-mono text-[9px] text-slate-300 space-y-1.5 max-h-[160px] overflow-y-auto">
                                {exportLogs.map((log, idx) => (
                                    <div key={idx} className={log.includes("SUCCESS") ? "text-emerald-400" : ""}>{log}</div>
                                ))}
                                {exporting && (
                                    <div className="flex items-center gap-1 text-slate-500 italic">
                                        <RefreshCw className="w-3 h-3 animate-spin" /> Fetching database replicas...
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Scheduler */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-5">
                        <div>
                            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                <Clock className="w-4.5 h-4.5 text-cyan-400" /> Recurring Reports Scheduler
                            </h3>
                            <p className="text-xs text-slate-400">Configure cron jobs to automatically email PDF summaries to owners.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400 font-medium">Recur Period</label>
                                    <select value={schedulePeriod} onChange={e => setSchedulePeriod(e.target.value as any)}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl text-xs text-white p-2.5 focus:outline-none">
                                        <option value="weekly">Weekly (Every Monday 9 AM)</option>
                                        <option value="monthly">Monthly (1st of month)</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400 font-medium">Recipient email</label>
                                    <input type="email" value={scheduleEmail} onChange={e => setScheduleEmail(e.target.value)}
                                        placeholder="owner@acmepizza.com"
                                        className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-red-500" />
                                </div>
                            </div>
                            <button onClick={addSchedule}
                                className="w-full py-2 bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all">
                                Schedule Recurring Report
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Notification Alerts Tab ── */}
            {activeTab === "notifications" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Alerts feed */}
                    <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-border/60 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Bell className="w-4.5 h-4.5 text-cyan-400" /> Reputation Alerts Feed
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">Real-time alerts triggered by scraper webhooks or delivery queues.</p>
                            </div>
                            <button onClick={markAllRead}
                                className="text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer font-bold">
                                Mark all as read
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2">
                            {alerts.map(a => (
                                <div key={a.id} className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-all ${
                                    a.unread ? "bg-red-500/5 border-red-500/20" : "bg-slate-950/60 border-white/5"
                                }`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                            a.type === "negative_alert" ? "bg-rose-500/10 text-rose-400" :
                                            a.type === "new_review" ? "bg-emerald-500/10 text-emerald-400" :
                                            a.type === "delivery_failure" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"
                                        }`}>
                                            {a.type === "negative_alert" ? <AlertTriangle className="w-4 h-4" /> :
                                             a.type === "new_review" ? <Star className="w-4 h-4 fill-emerald-400/20" /> :
                                             a.type === "delivery_failure" ? <Mail className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <strong className="text-xs text-slate-200">{a.title}</strong>
                                                {a.unread && <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />}
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{a.text}</p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] text-slate-600 font-mono shrink-0">{a.timestamp}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Alert Injector Sandbox */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4">
                        <div className="text-xs font-bold text-white uppercase tracking-wider">Alert Simulation Sandbox</div>
                        <p className="text-[10px] text-slate-400">Trigger real-time notifications to evaluate callback pub/sub channels.</p>
                        <div className="space-y-2.5 pt-2">
                            <button onClick={() => injectNotification("positive")}
                                className="w-full p-3 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-white/10 text-left rounded-xl transition-all cursor-pointer flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-200 block">Inject 5-Star Google Review</span>
                                    <span className="text-[8px] text-slate-500 mt-0.5">Simulate happy customer submission</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-600" />
                            </button>

                            <button onClick={() => injectNotification("negative")}
                                className="w-full p-3 bg-slate-950 hover:bg-slate-900 border border-rose-500/10 hover:border-rose-500/20 text-left rounded-xl transition-all cursor-pointer flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-rose-400 block">Inject Critical Negative review</span>
                                    <span className="text-[8px] text-slate-500 mt-0.5">Rating &lt;= 2. Escalates to sms/ticket</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-600" />
                            </button>

                            <button onClick={() => injectNotification("bounce")}
                                className="w-full p-3 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-white/10 text-left rounded-xl transition-all cursor-pointer flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-200 block">Inject SMS Send Bounce</span>
                                    <span className="text-[8px] text-slate-500 mt-0.5">Simulate carrier network rejection logs</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-600" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Part 8 Gates Checklist Tab ── */}
            {activeTab === "deliverables" && (
                <div className="max-w-2xl mx-auto">
                    <div className="glass-card rounded-2xl p-8 border border-border/60">
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4.5 h-4.5 text-emerald-400" /> Part 8 Deliverables Gates
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-8">
                            Toggle individual Dashboard & Reporting checkpoints to mark this architecture domain as validated.
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
                                <span className="text-slate-400">Part 8 Completion progress</span>
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
                                    <CheckCircle className="w-4 h-4" /> Part 8 Complete — Dashboard & Reporting Ready for Implementation!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
