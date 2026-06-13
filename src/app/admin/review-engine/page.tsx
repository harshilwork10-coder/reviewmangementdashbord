"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Send, Zap, Mail, MessageSquare, AlertTriangle, Play, X, Info,
    Check, CheckCircle, ChevronRight, ChevronDown, RefreshCw,
    Layers, Clock, Settings, BarChart2, Calendar, FileText,
    Ban, Trash2, Terminal, Activity
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface QueueLane {
    name: string;
    icon: React.ElementType;
    color: string;
    depth: number;
    completed: number;
    failed: number;
}

interface FailedJob {
    id: string;
    queue: string;
    reason: string;
    attempts: number;
    status: "failed" | "retrying" | "resolved";
}

interface TrackingEvent {
    id: string;
    customer: string;
    campaign: string;
    channel: "Email" | "SMS";
    event: "Sent" | "Delivered" | "Opened" | "Clicked" | "Review Submitted" | "Failed";
    timestamp: string;
}

interface SuppressionEntry {
    id: string;
    identity: string;
    channel: "Email" | "SMS";
    method: string;
    timestamp: string;
}

interface ToastMessage {
    id: string;
    type: "success" | "warning" | "error" | "info";
    text: string;
}

// ── Initial Queues State ──────────────────────────────────────────────────
const initialQueues: QueueLane[] = [
    { name: "email-queue", icon: Mail, color: "text-violet-400 border-violet-500/30 bg-violet-500/10", depth: 14, completed: 320, failed: 2 },
    { name: "sms-queue", icon: MessageSquare, color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10", depth: 8, completed: 450, failed: 3 },
    { name: "tracking-queue", icon: Clock, color: "text-orange-400 border-orange-500/30 bg-orange-500/10", depth: 3, completed: 890, failed: 0 },
    { name: "webhook-queue", icon: Zap, color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10", depth: 0, completed: 120, failed: 1 },
    { name: "report-queue", icon: BarChart2, color: "text-pink-400 border-pink-500/30 bg-pink-500/10", depth: 1, completed: 180, failed: 0 },
];

// ── Initial Failures Registry ──────────────────────────────────────────────
const initialFailures: FailedJob[] = [
    { id: "job_em_3211", queue: "email-queue", reason: "Resend API Timeout (HTTP 504)", attempts: 2, status: "failed" },
    { id: "job_sm_4401", queue: "sms-queue", reason: "Twilio Rate Limit Exceeded (HTTP 429)", attempts: 1, status: "failed" },
    { id: "job_wh_9021", queue: "webhook-queue", reason: "Client Endpoint Timeout (5000ms limit)", attempts: 3, status: "failed" },
];

// ── Initial Suppression Registry ───────────────────────────────────────────
const initialSuppression: SuppressionEntry[] = [
    { id: "sup_01", identity: "customer-optout@gmail.com", channel: "Email", method: "Unsubscribe Link", timestamp: "2026-06-12 00:15:02" },
    { id: "sup_02", identity: "+15550198234", channel: "SMS", method: "SMS STOP Keyword", timestamp: "2026-06-11 23:44:19" },
    { id: "sup_03", identity: "unsubscribe-user@yahoo.com", channel: "Email", method: "List-Unsubscribe Header", timestamp: "2026-06-11 21:05:40" },
];

// ── Initial Conversion Tracking Events ─────────────────────────────────────
const initialEvents: TrackingEvent[] = [
    { id: "evt_01", customer: "Alice Vance", campaign: "Acme Pizza Promos", channel: "Email", event: "Review Submitted", timestamp: "03:14:20Z" },
    { id: "evt_02", customer: "Bob Miller", campaign: "Acme Pizza Promos", channel: "Email", event: "Clicked", timestamp: "03:12:15Z" },
    { id: "evt_03", customer: "Charlie Davis", campaign: "Downtown Retail collect", channel: "SMS", event: "Opened", timestamp: "03:10:44Z" },
    { id: "evt_04", customer: "Diana Prince", campaign: "Acme Pizza Promos", channel: "Email", event: "Delivered", timestamp: "03:09:00Z" },
    { id: "evt_05", customer: "Ethan Hunt", campaign: "Downtown Retail collect", channel: "SMS", event: "Sent", timestamp: "03:08:12Z" },
    { id: "evt_06", customer: "Fiona Gallagher", campaign: "Acme Pizza Promos", channel: "Email", event: "Failed", timestamp: "03:05:30Z" },
];

export default function SuperAdminReviewEnginePage() {
    const [activeTab, setActiveTab] = useState<"scheduler" | "queues" | "tracker" | "analytics" | "deliverables">("scheduler");

    // Dynamic state
    const [queues, setQueues] = useState<QueueLane[]>(initialQueues);
    const [failures, setFailures] = useState<FailedJob[]>(initialFailures);
    const [events, setEvents] = useState<TrackingEvent[]>(initialEvents);
    const [suppressions, setSuppressions] = useState<SuppressionEntry[]>(initialSuppression);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    // Scheduler states
    const [campaignType, setCampaignType] = useState<"one_time" | "scheduled" | "post_service" | "post_purchase">("post_service");
    const [channel, setChannel] = useState<"Email" | "SMS">("Email");
    const [quietHours, setQuietHours] = useState(true);
    const [timezoneAware, setTimezoneAware] = useState(true);
    const [customerName, setCustomerName] = useState("");
    const [customerContact, setCustomerContact] = useState("");
    const [dispatching, setDispatching] = useState(false);
    const [dispatchLogs, setDispatchLogs] = useState<string[]>([]);

    // Opt-out states
    const [suppressIdentity, setSuppressIdentity] = useState("");
    const [suppressChannel, setSuppressChannel] = useState<"Email" | "SMS">("Email");

    // Deliverables state
    const [deliverables, setDeliverables] = useState([
        { id: "rd1", label: "Campaign workflow documented", checked: true },
        { id: "rd2", label: "Queue architecture approved", checked: true },
        { id: "rd3", label: "Tracking model finalized", checked: true },
        { id: "rd4", label: "Analytics requirements approved", checked: true },
        { id: "rd5", label: "Review engine ready for implementation", checked: false },
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

    // Campaign Dispatch Flow Simulator
    const triggerDispatch = () => {
        if (!customerName || !customerContact) {
            addToast("error", "Name and contact coordinates are required.");
            return;
        }
        setDispatching(true);
        setDispatchLogs(["[INIT] Poking campaign automation dispatcher..."]);

        setTimeout(() => {
            setDispatchLogs(prev => [...prev, `[AUDIT] Scoping delivery channel restrictions: ${channel}`]);
        }, 800);

        setTimeout(() => {
            setDispatchLogs(prev => [...prev, `[AUDIT] Quiet hours check: ${quietHours ? "Enforced (9am-8pm window)" : "Disabled"}`]);
        }, 1600);

        setTimeout(() => {
            // Check if identity is suppressed
            const isBlacklisted = suppressions.some(s => s.identity.toLowerCase() === customerContact.toLowerCase());
            if (isBlacklisted) {
                setDispatchLogs(prev => [...prev, `[ERR] Dispatch blocked: ${customerContact} is in Suppression Registry.`]);
                setDispatching(false);
                addToast("error", "Recipient has opted-out. Outreach suppressed.");
            } else {
                setDispatchLogs(prev => [...prev, `[QUEUE] Enqueueing dispatch job in ${channel === "Email" ? "email-queue" : "sms-queue"}...`]);
                
                // Update queue depth
                setQueues(prev => prev.map(q => {
                    if (channel === "Email" && q.name === "email-queue") return { ...q, depth: q.depth + 1 };
                    if (channel === "SMS" && q.name === "sms-queue") return { ...q, depth: q.depth + 1 };
                    return q;
                }));

                setTimeout(() => {
                    setDispatchLogs(prev => [...prev, `[SUCCESS] Job dispatched successfully. ID: job_${Math.random().toString(36).substring(7)}`]);
                    setDispatching(false);
                    addToast("success", "Review request scheduled successfully!");
                    
                    // Inject event
                    const newEvent: TrackingEvent = {
                        id: `evt_in_${Math.random().toString(36).substring(7)}`,
                        customer: customerName,
                        campaign: campaignType.toUpperCase().replace("_", " "),
                        channel: channel,
                        event: "Sent",
                        timestamp: new Date().toISOString().split("T")[1].substring(0, 8) + "Z"
                    };
                    setEvents(prev => [newEvent, ...prev]);
                }, 1000);
            }
        }, 2500);
    };

    // Retry Queue failures simulator
    const processRetries = () => {
        setFailures(prev => prev.map(f => ({ ...f, status: "retrying" as const })));
        addToast("info", "Re-queuing failed jobs using exponential backoff...");

        setTimeout(() => {
            setFailures(prev => prev.map(f => {
                if (f.id === "job_em_3211") {
                    // resolved
                    setQueues(qPrev => qPrev.map(q => q.name === "email-queue" ? { ...q, completed: q.completed + 1, failed: q.failed - 1 } : q));
                    return { ...f, status: "resolved" as const };
                }
                if (f.id === "job_sm_4401") {
                    setQueues(qPrev => qPrev.map(q => q.name === "sms-queue" ? { ...q, completed: q.completed + 1, failed: q.failed - 1 } : q));
                    return { ...f, status: "resolved" as const };
                }
                // webhook still fails (max attempts reached)
                return { ...f, attempts: f.attempts + 1, status: "failed" as const, reason: "Max retry threshold exceeded. Escalated." };
            }));
            addToast("success", "Retry execution cycle finished. 2 jobs resolved, 1 escalated.");
        }, 2000);
    };

    // Add manual suppression registry
    const addSuppression = () => {
        if (!suppressIdentity) {
            addToast("error", "Email/Phone field cannot be blank.");
            return;
        }
        const newEntry: SuppressionEntry = {
            id: `sup_${Math.random().toString(36).substring(7)}`,
            identity: suppressIdentity,
            channel: suppressChannel,
            method: "Admin Manual suppression",
            timestamp: new Date().toISOString().replace("T", " ").substring(0, 19)
        };
        setSuppressions(prev => [newEntry, ...prev]);
        setSuppressIdentity("");
        addToast("success", `${suppressIdentity} added to Suppression Registry.`);
    };

    const removeSuppression = (id: string, identity: string) => {
        setSuppressions(prev => prev.filter(s => s.id !== id));
        addToast("info", `Removed ${identity} from Suppression list.`);
    };

    const tabs = [
        { id: "scheduler", label: "Campaign Scheduler", icon: Calendar },
        { id: "queues", label: "Queue Monitor", icon: Layers },
        { id: "tracker", label: "Event Tracker", icon: Send },
        { id: "analytics", label: "Campaign Analytics", icon: BarChart2 },
        { id: "deliverables", label: "Part 7 Gates", icon: CheckCircle },
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
                        <Send className="w-6 h-6 text-red-500" />
                        Review Request Engine Console
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Orchestrate invite dispatches, monitor BullMQ lanes, track email/SMS open metrics, and toggle Part 7 gates.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
                        Resend API · Twilio SMS
                    </div>
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold">
                        5 Active Queue Lanes
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

            {/* ── Campaign Scheduler Tab ── */}
            {activeTab === "scheduler" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Scheduling sandbox inputs */}
                    <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-border/60 space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                <Settings className="w-4.5 h-4.5 text-red-400" /> Campaign Orchestrator Sandbox
                            </h3>
                            <p className="text-xs text-slate-400">Configure scheduling parameters and dispatch a live mock invitation.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 font-medium">Campaign Model</label>
                                <select
                                    value={campaignType}
                                    onChange={e => setCampaignType(e.target.value as any)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl text-xs text-white p-2.5 focus:outline-none focus:ring-1 focus:ring-red-500"
                                >
                                    <option value="one_time">One-Time Bulk Campaign</option>
                                    <option value="scheduled">Scheduled Collection</option>
                                    <option value="post_service">Post-Service Trigger (1-4 hours)</option>
                                    <option value="post_purchase">Post-Purchase Invite (3-7 days)</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 font-medium">Delivery Channel</label>
                                <select
                                    value={channel}
                                    onChange={e => setChannel(e.target.value as any)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl text-xs text-white p-2.5 focus:outline-none focus:ring-1 focus:ring-red-500"
                                >
                                    <option value="Email">Email Outreach (Resend SDK)</option>
                                    <option value="SMS">SMS Outreach (Twilio SDK)</option>
                                </select>
                            </div>
                        </div>

                        {/* Sending Rules Toggles */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-950 rounded-xl border border-white/5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] text-slate-200 font-bold block">Quiet Hours Restriction</span>
                                    <span className="text-[9px] text-slate-500 block">Restrict dispatches to 9:00 AM - 8:00 PM</span>
                                </div>
                                <button
                                    onClick={() => setQuietHours(!quietHours)}
                                    className={`w-10 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                                        quietHours ? "bg-red-600" : "bg-slate-800"
                                    }`}
                                >
                                    <span className={`w-5 h-5 rounded-full bg-white transition-transform ${
                                        quietHours ? "translate-x-4" : "translate-x-0"
                                    }`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] text-slate-200 font-bold block">Time-Zone Aware Send</span>
                                    <span className="text-[9px] text-slate-500 block">Buffer delivery targeting recipient's time</span>
                                </div>
                                <button
                                    onClick={() => setTimezoneAware(!timezoneAware)}
                                    className={`w-10 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                                        timezoneAware ? "bg-red-600" : "bg-slate-800"
                                    }`}
                                >
                                    <span className={`w-5 h-5 rounded-full bg-white transition-transform ${
                                        timezoneAware ? "translate-x-4" : "translate-x-0"
                                    }`} />
                                </button>
                            </div>
                        </div>

                        {/* Customer Form */}
                        <div className="space-y-4 border-t border-white/5 pt-4">
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Recipient Coordinates</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400 font-medium">Customer Full Name</label>
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        placeholder="e.g. John Doe"
                                        className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-red-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400 font-medium">
                                        {channel === "Email" ? "Email Address" : "SMS Phone Number"}
                                    </label>
                                    <input
                                        type="text"
                                        value={customerContact}
                                        onChange={e => setCustomerContact(e.target.value)}
                                        placeholder={channel === "Email" ? "customer@example.com" : "+15550199999"}
                                        className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-red-500"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={triggerDispatch}
                                disabled={dispatching}
                                className="w-full py-2 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shadow-md"
                            >
                                {dispatching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                                {dispatching ? "Evaluating send queue..." : "Trigger Review Request Dispatch"}
                            </button>
                        </div>
                    </div>

                    {/* Output logs stream */}
                    <div className="space-y-4">
                        <div className="glass-card rounded-2xl p-5 border border-border/60 h-full flex flex-col justify-between">
                            <div>
                                <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                                    <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Dispatch Stream Console
                                </h4>
                                <div className="bg-slate-950 rounded-xl border border-white/5 p-4 font-mono text-[9px] text-slate-400 space-y-2 min-h-[200px] max-h-[300px] overflow-y-auto">
                                    {dispatchLogs.length === 0 ? (
                                        <div className="text-slate-600 italic">Logs will stream here during dispatch events.</div>
                                    ) : (
                                        dispatchLogs.map((log, idx) => (
                                            <div key={idx} className={log.includes("SUCCESS") ? "text-emerald-400" : log.includes("ERR") ? "text-rose-400" : ""}>{log}</div>
                                        ))
                                    )}
                                    {dispatching && (
                                        <div className="flex items-center gap-1 text-slate-500 italic">
                                            <RefreshCw className="w-3 h-3 animate-spin" /> Fetching delivery routes...
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-white/5 pt-4 mt-4 text-[10px] text-slate-400 space-y-1.5">
                                <div className="flex justify-between">
                                    <span>Template:</span>
                                    <strong className="text-white">Default Business Feedback Invite</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span>Link shortener redirect:</span>
                                    <strong className="text-red-400">https://rvw.hub/t/f8x2</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Queue Monitor Tab ── */}
            {activeTab === "queues" && (
                <div className="space-y-6">
                    {/* Lanes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {queues.map((q, i) => {
                            const Icon = q.icon;
                            return (
                                <div key={i} className={`glass-card rounded-2xl p-5 border ${q.color} flex flex-col justify-between`}>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Icon className="w-4 h-4" />
                                            <span className="text-xs font-bold text-white font-mono">{q.name}</span>
                                        </div>
                                        <div className="text-[20px] font-bold text-white font-mono">{q.depth}</div>
                                        <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wide mt-1">Pending Depth</span>
                                    </div>
                                    <div className="border-t border-white/5 pt-2 mt-4 flex justify-between text-[9px] text-slate-400 font-mono">
                                        <span className="text-emerald-400">{q.completed} done</span>
                                        {q.failed > 0 && <span className="text-rose-400">{q.failed} failed</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Failures and retry registry */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <AlertTriangle className="w-4.5 h-4.5 text-rose-400" /> Dispatch Failure Registry
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Track invitations that failed due to connection errors. Reprocess failures to trigger exponential backoff.
                                </p>
                            </div>
                            <button
                                onClick={processRetries}
                                disabled={failures.every(f => f.status === "resolved")}
                                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95"
                            >
                                Trigger Reprocess & Retries
                            </button>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/60">
                            <table className="w-full text-[11px] text-slate-300">
                                <thead>
                                    <tr className="bg-slate-950 border-b border-white/5 text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                                        <th className="text-left p-4">Job ID</th>
                                        <th className="text-left p-4">Queue Lane</th>
                                        <th className="text-left p-4">Error Context</th>
                                        <th className="text-center p-4">Attempts logged</th>
                                        <th className="text-center p-4">State</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {failures.map(job => (
                                        <tr key={job.id} className="hover:bg-slate-900/30 transition-colors">
                                            <td className="p-4 font-mono font-bold text-slate-200">{job.id}</td>
                                            <td className="p-4 font-mono text-slate-400">{job.queue}</td>
                                            <td className="p-4 text-slate-400 flex items-center gap-1.5">
                                                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" /> {job.reason}
                                            </td>
                                            <td className="p-4 text-center font-mono text-slate-400">{job.attempts} / 3</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                                    job.status === "resolved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                                    job.status === "retrying" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse" :
                                                    "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                                }`}>
                                                    {job.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Event Tracker Tab ── */}
            {activeTab === "tracker" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Ingestion timeline stream */}
                    <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-border/60 space-y-5">
                        <div>
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Activity className="w-4.5 h-4.5 text-cyan-400" /> Invite conversion timeline
                            </h3>
                            <p className="text-xs text-slate-400">Real-time callbacks captured by tracking queues.</p>
                        </div>

                        <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2">
                            {events.map((evt, idx) => (
                                <div key={evt.id} className="p-3 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                            evt.channel === "Email" ? "bg-violet-500/10 text-violet-400" : "bg-cyan-500/10 text-cyan-400"
                                        }`}>
                                            {evt.channel === "Email" ? <Mail className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-200 text-xs">{evt.customer}</div>
                                            <div className="text-[9px] text-slate-500 font-mono mt-0.5">{evt.campaign}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase font-mono ${
                                            evt.event === "Review Submitted" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                            evt.event === "Clicked" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                            evt.event === "Opened" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                                            evt.event === "Failed" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                                            "bg-slate-800 text-slate-400"
                                        }`}>
                                            {evt.event}
                                        </span>
                                        <span className="text-[9px] text-slate-600 font-mono shrink-0">{evt.timestamp}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Opt-out suppression registry */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-5">
                        <div>
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Ban className="w-4.5 h-4.5 text-red-500" /> Suppression Registry
                            </h3>
                            <p className="text-xs text-slate-400">Suppressed recipients are audited before SDK calls.</p>
                        </div>

                        {/* Add opt-out form */}
                        <div className="p-3.5 bg-slate-950 rounded-xl border border-white/5 space-y-3">
                            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Manual Blacklist</div>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={suppressIdentity}
                                    onChange={e => setSuppressIdentity(e.target.value)}
                                    placeholder="customer@email.com or +1555..."
                                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSuppressChannel("Email")}
                                        className={`flex-1 py-1 text-[9px] font-bold rounded border ${
                                            suppressChannel === "Email" ? "bg-violet-600 text-white border-violet-500" : "bg-slate-900 text-slate-400 border-white/5"
                                        }`}
                                    >
                                        Email Hash
                                    </button>
                                    <button
                                        onClick={() => setSuppressChannel("SMS")}
                                        className={`flex-1 py-1 text-[9px] font-bold rounded border ${
                                            suppressChannel === "SMS" ? "bg-cyan-600 text-white border-cyan-500" : "bg-slate-900 text-slate-400 border-white/5"
                                        }`}
                                    >
                                        SMS Phone
                                    </button>
                                </div>
                                <button
                                    onClick={addSuppression}
                                    className="w-full py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                                >
                                    Suppress Recipient
                                </button>
                            </div>
                        </div>

                        {/* Blacklist scroll */}
                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                            {suppressions.map(sup => (
                                <div key={sup.id} className="p-2.5 bg-slate-950/60 border border-white/5 rounded-xl flex items-center justify-between gap-3 text-[10px]">
                                    <div>
                                        <div className="font-bold text-slate-200">{sup.identity}</div>
                                        <div className="text-[8px] text-slate-500 font-mono mt-0.5">{sup.method} · {sup.channel}</div>
                                    </div>
                                    <button
                                        onClick={() => removeSuppression(sup.id, sup.identity)}
                                        className="text-slate-600 hover:text-red-400 transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Campaign Analytics Tab ── */}
            {activeTab === "analytics" && (
                <div className="space-y-6">
                    {/* Metrics KPI grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                            { label: "Total Invites Sent", val: "1,240 requests", desc: "Outbound dispatches", color: "text-violet-400" },
                            { label: "Clicks Logged", val: "580 clicks", desc: "46.7% click-through rate", color: "text-cyan-400" },
                            { label: "Reviews Submitted", val: "298 reviews", desc: "Verified submissions", color: "text-emerald-400" },
                            { label: "Conversion Rate", val: "24.0%", desc: "Invites-to-Reviews ratio", color: "text-red-400" },
                            { label: "Campaign Average Rating", val: "4.7 / 5.0", desc: "★ Out of 298 reviews", color: "text-yellow-400" },
                        ].map((kpi, i) => (
                            <div key={i} className="glass-card rounded-2xl p-5 border border-border/60">
                                <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wide">{kpi.label}</span>
                                <div className={`text-lg font-bold font-mono mt-1 ${kpi.color}`}>{kpi.val}</div>
                                <span className="text-[9px] text-slate-400 block mt-1">{kpi.desc}</span>
                            </div>
                        ))}
                    </div>

                    {/* Chart diagrams */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="glass-card rounded-2xl p-6 border border-border/60">
                            <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
                                <BarChart2 className="w-3.5 h-3.5 text-violet-400" /> Channel conversion performance (Email vs SMS)
                            </h4>
                            <div className="space-y-4">
                                {[
                                    { channel: "Email Invites (Resend API)", sent: 700, reviews: 120, rate: "17.1% conversion", width: "w-[17%]", color: "bg-violet-500" },
                                    { channel: "SMS Invites (Twilio API)", sent: 540, reviews: 178, rate: "32.9% conversion", width: "w-[33%]", color: "bg-cyan-500" },
                                ].map((item, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <div className="flex justify-between text-[10px]">
                                            <span className="font-bold text-slate-200">{item.channel}</span>
                                            <span className="text-slate-400">{item.reviews} reviews / {item.sent} sent · <strong className="text-white">{item.rate}</strong></span>
                                        </div>
                                        <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                            <div className={`h-full ${item.color} ${item.width} transition-all duration-500`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-6 border border-border/60">
                            <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-orange-400" /> Top campaigns by rating
                            </h4>
                            <div className="space-y-3">
                                {[
                                    { name: "Post-Service Auto Trigger", type: "Transactional", conversion: "34.5%", rating: "4.8" },
                                    { name: "SMS Bulk Campaign 04", type: "One-Time Bulk", conversion: "28.0%", rating: "4.6" },
                                    { name: "Post-Purchase Follow-up", type: "Transactional", conversion: "19.2%", rating: "4.5" },
                                ].map((camp, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-slate-950/60 border border-white/5 rounded-xl text-[10px]">
                                        <div>
                                            <span className="font-bold text-slate-200 block">{camp.name}</span>
                                            <span className="text-[9px] text-slate-500">{camp.type} · {camp.conversion} conv</span>
                                        </div>
                                        <span className="text-yellow-400 font-bold font-mono">★ {camp.rating} Avg</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Part 7 Gates Checklist Tab ── */}
            {activeTab === "deliverables" && (
                <div className="max-w-2xl mx-auto">
                    <div className="glass-card rounded-2xl p-8 border border-border/60">
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4.5 h-4.5 text-emerald-400" /> Part 7 Deliverables Gates
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-8">
                            Toggle individual Review Request Engine checkpoints to mark this architecture domain as validated.
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
                                <span className="text-slate-400">Part 7 Completion progress</span>
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
                                    <CheckCircle className="w-4 h-4" /> Part 7 Complete — Review Request Engine Ready for Implementation!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
