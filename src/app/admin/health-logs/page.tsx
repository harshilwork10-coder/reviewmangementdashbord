"use client";
import { useEffect, useState } from "react";
import { 
    getPlatformHealth, updatePlatformHealth, getFeatureFlags, toggleFeatureFlag, 
    updateFlagTargets, getAnnouncements, createAnnouncement, getAuditLogs, 
    getBusinesses, PlatformHealth, FeatureFlag, Announcement, AuditLog, Business 
} from "@/lib/store";
import { 
    Activity, ShieldCheck, ToggleLeft, ToggleRight, Radio, Bell, Shield, 
    Check, AlertTriangle, AlertOctagon, Terminal, Search, Calendar, Filter, Plus, Info
} from "lucide-react";

export default function AdminHealthLogsPage() {
    const [activeTab, setActiveTab] = useState<"health" | "flags" | "announcements" | "audit">("health");
    
    // Core states
    const [health, setHealth] = useState<PlatformHealth | null>(null);
    const [flags, setFlags] = useState<FeatureFlag[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [businesses, setBusinesses] = useState<Business[]>([]);
    
    // Search / Filter states
    const [auditSearch, setAuditSearch] = useState("");
    const [auditActionFilter, setAuditActionFilter] = useState("all");
    const [auditOrgFilter, setAuditOrgFilter] = useState("all");

    // Announcement Form states
    const [annTitle, setAnnTitle] = useState("");
    const [annContent, setAnnContent] = useState("");
    const [annType, setAnnType] = useState<"notice" | "feature" | "disruption">("notice");
    const [annTargetPlans, setAnnTargetPlans] = useState<string[]>([]);
    const [annTargetOrgs, setAnnTargetOrgs] = useState("");

    // Flag editing targets state
    const [editingFlagKey, setEditingFlagKey] = useState<string | null>(null);
    const [flagPlans, setFlagPlans] = useState<string[]>([]);
    const [flagOrgs, setFlagOrgs] = useState("");

    // Toast notification
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showNotification = (msg: string, type: "success" | "error" = "success") => {
        setNotification({ message: msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const refresh = () => {
        setHealth(getPlatformHealth());
        setFlags(getFeatureFlags());
        setAnnouncements(getAnnouncements());
        setAuditLogs(getAuditLogs());
        setBusinesses(getBusinesses());
    };

    useEffect(() => {
        refresh();
    }, []);

    // Health Simulator Handler
    const handleServiceStatusChange = (serviceKey: keyof Omit<PlatformHealth, "lastChecked">, newStatus: "healthy" | "degraded" | "down") => {
        if (!health) return;
        const updatedHealth: PlatformHealth = {
            ...health,
            [serviceKey]: newStatus,
            lastChecked: new Date().toISOString()
        };
        updatePlatformHealth(updatedHealth);
        setHealth(updatedHealth);
        
        // Log simulation in audit trail
        const serviceNames: Record<string, string> = {
            api: "API Gateway",
            database: "Database Cluster",
            sync: "GBP Sync Workers",
            email: "SendGrid Dispatcher",
            sms: "Twilio Routing Gateway",
            openai: "OpenAI Auto-Responder",
            stripe: "Stripe Billing Infrastructure"
        };
        
        // Mock audit log for simulation
        // The store helper requires session user or handles undefined
        try {
            const logs = JSON.parse(localStorage.getItem("rms_audit_logs") || "[]");
            logs.unshift({
                id: `audit-${Date.now()}`,
                userName: "System Admin",
                action: "Service Health Mapped",
                ipAddress: "127.0.0.1",
                userAgent: "System Operator Override",
                metadata: { service: serviceNames[serviceKey], status: newStatus },
                createdAt: new Date().toISOString()
            });
            localStorage.setItem("rms_audit_logs", JSON.stringify(logs));
        } catch { /* ignore */ }
        
        showNotification(`${serviceNames[serviceKey]} status simulation updated to ${newStatus.toUpperCase()}`);
        refresh();
    };

    // Feature Flag Handlers
    const handleToggleFlag = (key: string, currentEnabled: boolean) => {
        toggleFeatureFlag(key, !currentEnabled);
        showNotification(`Feature flag '${key}' toggled ${!currentEnabled ? "ON" : "OFF"}`);
        refresh();
    };

    const startEditingFlagTargets = (flag: FeatureFlag) => {
        setEditingFlagKey(flag.key);
        setFlagPlans(flag.targetPlans || []);
        setFlagOrgs((flag.targetOrgs || []).join(", "));
    };

    const saveFlagTargets = (key: string) => {
        const orgsArray = flagOrgs.split(",")
            .map(o => o.trim())
            .filter(o => o.length > 0);
            
        updateFlagTargets(key, orgsArray, flagPlans);
        setEditingFlagKey(null);
        showNotification(`Targeting rules saved for flag '${key}'`);
        refresh();
    };

    const handlePlanTargetCheckbox = (plan: string, targetList: string[], setList: (l: string[]) => void) => {
        if (targetList.includes(plan)) {
            setList(targetList.filter(p => p !== plan));
        } else {
            setList([...targetList, plan]);
        }
    };

    // Announcement Handlers
    const handlePublishAnnouncement = (e: React.FormEvent) => {
        e.preventDefault();
        if (!annTitle.trim() || !annContent.trim()) {
            showNotification("Please provide title and content", "error");
            return;
        }

        const orgsArray = annTargetOrgs.split(",")
            .map(o => o.trim())
            .filter(o => o.length > 0);

        createAnnouncement({
            title: annTitle,
            content: annContent,
            type: annType,
            targetOrgs: orgsArray,
            targetPlans: annTargetPlans
        });

        // Reset form
        setAnnTitle("");
        setAnnContent("");
        setAnnType("notice");
        setAnnTargetPlans([]);
        setAnnTargetOrgs("");

        showNotification("Announcement published globally!");
        refresh();
    };

    // Audit logs filtering logic
    const uniqueActions = Array.from(new Set(auditLogs.map(l => l.action)));
    
    const filteredAuditLogs = auditLogs.filter(log => {
        const matchesSearch = 
            log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
            (log.userName || "").toLowerCase().includes(auditSearch.toLowerCase()) ||
            JSON.stringify(log.metadata || {}).toLowerCase().includes(auditSearch.toLowerCase());
            
        const matchesAction = auditActionFilter === "all" || log.action === auditActionFilter;
        const matchesOrg = auditOrgFilter === "all" || log.businessId === auditOrgFilter;
        
        return matchesSearch && matchesAction && matchesOrg;
    });

    if (!health) {
        return <div className="flex items-center justify-center h-screen"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;
    }

    return (
        <div className="h-screen overflow-y-auto p-8 relative flex flex-col">
            {/* Notification Banner */}
            {notification && (
                <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border text-sm font-semibold transition-all duration-300 ${
                    notification.type === "success" 
                        ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" 
                        : "bg-red-500/10 border-red-500/25 text-red-400"
                }`}>
                    <Check className="w-4 h-4" />
                    {notification.message}
                </div>
            )}

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Shield className="w-6 h-6 text-primary" /> Health & Logs
                </h1>
                <p className="text-muted-foreground text-sm mt-1">Platform control dashboard. Monitor system operations, audit actions, toggle feature gates, and post announcements.</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-border/60 mb-6 gap-2">
                {[
                    { id: "health", label: "Platform Health", icon: Radio },
                    { id: "flags", label: "Feature Flags (Gates)", icon: ToggleRight },
                    { id: "announcements", label: "Announcement Center", icon: Bell },
                    { id: "audit", label: "Audit Log Trail", icon: Terminal }
                ].map(tab => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition-all ${
                                active 
                                    ? "border-primary text-white bg-primary/5" 
                                    : "border-transparent text-muted-foreground hover:text-white hover:bg-secondary/20"
                            }`}>
                            <Icon className="w-4.5 h-4.5" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Panels */}
            <div className="flex-1 min-h-0">
                {activeTab === "health" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Service Indicators */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60 lg:col-span-2 space-y-6">
                            <div>
                                <h3 className="text-base font-bold text-white mb-1">Service Status Monitors</h3>
                                <p className="text-xs text-muted-foreground">Detailed status tracking of platform microservices. Toggle status dropdowns to simulate failure/degradations.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { key: "api", name: "API Gateway Node", desc: "Core GraphQL/REST routes" },
                                    { key: "database", name: "PostgreSQL Database Cluster", desc: "Multi-tenant schemas" },
                                    { key: "sync", name: "GBP Sync Service Workers", desc: "Google review scrapers" },
                                    { key: "email", name: "SendGrid Dispatcher", desc: "Campaign notification sender" },
                                    { key: "sms", name: "Twilio SMS Routing Gateway", desc: "Text invitation codes" },
                                    { key: "openai", name: "OpenAI GPT Engine", desc: "Autopilot reply assistant" },
                                    { key: "stripe", name: "Stripe Billing Infrastructure", desc: "SaaS subscriptions hooks" }
                                ].map(service => {
                                    const status = health[service.key as keyof PlatformHealth] as "healthy" | "degraded" | "down";
                                    return (
                                        <div key={service.key} className="p-4 rounded-xl bg-secondary/15 border border-border/40 flex flex-col justify-between gap-3">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <span className="font-bold text-sm text-white block">{service.name}</span>
                                                    <span className="text-[10px] text-muted-foreground">{service.desc}</span>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                                    status === "healthy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                                    status === "degraded" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                                                    "bg-red-500/10 text-red-400 border-red-500/20"
                                                }`}>
                                                    {status}
                                                </span>
                                            </div>
                                            
                                            {/* Status Controller (Simulator) */}
                                            <div className="flex items-center justify-between border-t border-border/10 pt-2.5">
                                                <span className="text-[10px] font-semibold text-muted-foreground">Simulate State</span>
                                                <select value={status} onChange={e => handleServiceStatusChange(service.key as any, e.target.value as any)}
                                                    className="px-2 py-1 rounded bg-secondary border border-border text-[10px] text-white focus:outline-none focus:border-primary">
                                                    <option value="healthy">Healthy</option>
                                                    <option value="degraded">Degraded</option>
                                                    <option value="down">Down / Outage</option>
                                                </select>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Health Timeline Summary */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60 h-fit space-y-5">
                            <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Activity className="w-4 h-4 text-primary" /> Overall Health Summary</h3>
                            
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-xs text-emerald-400 space-y-1">
                                    <div className="flex items-center gap-1 font-bold">
                                        <ShieldCheck className="w-4 h-4" /> Uptime Guarantee
                                    </div>
                                    <p className="text-[11px] text-muted-foreground">Platform SLA is currently tracking at <strong>99.98%</strong> uptime for the last 30 billing cycles.</p>
                                </div>

                                <div className="space-y-3.5">
                                    <h4 className="text-[10px] font-bold text-white uppercase tracking-wider border-b border-border/20 pb-1">Incident Report Alert Box</h4>
                                    
                                    {/* Mock alerts list */}
                                    <div className="space-y-2 text-[11px] leading-relaxed">
                                        <div className="flex gap-2 p-2 rounded bg-secondary/25 border-l-2 border-amber-500">
                                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-white">Google Sync Load Spike</p>
                                                <p className="text-muted-foreground">Scraper queue experienced 1500ms delay during Google API update period (resolved 2h ago).</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 p-2 rounded bg-secondary/25 border-l-2 border-emerald-500">
                                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-white">Stripe Hooks REST API restored</p>
                                                <p className="text-muted-foreground">Verification signature validations successfully migrated to webhook v3 endpoints.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-[10px] text-muted-foreground text-center pt-2">
                                    Last checked: {new Date(health.lastChecked).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "flags" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Flags directory */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60 lg:col-span-2 space-y-4">
                            <div>
                                <h3 className="text-base font-bold text-white mb-1">Feature Gates & Toggles</h3>
                                <p className="text-xs text-muted-foreground">Globally deploy features or restrict rollouts to specific subscription plans and organizations.</p>
                            </div>

                            <div className="space-y-4">
                                {flags.map(flag => (
                                    <div key={flag.key} className="p-4 rounded-xl bg-secondary/10 border border-border/30 flex flex-col sm:flex-row justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm text-white font-mono">{flag.key}</span>
                                                {flag.isBeta && (
                                                    <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded font-bold uppercase">Beta</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">{flag.description}</p>
                                            
                                            {/* Targets details */}
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1.5 text-[10px] text-muted-foreground border-t border-border/10">
                                                <span>Plans: {flag.targetPlans?.length ? flag.targetPlans.map(p => p.toUpperCase()).join(", ") : "All Plans"}</span>
                                                <span>Orgs: {flag.targetOrgs?.length ? flag.targetOrgs.join(", ") : "All Organizations"}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-between items-end gap-2 shrink-0">
                                            {/* Toggle switch */}
                                            <button onClick={() => handleToggleFlag(flag.key, flag.enabled)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                                    flag.enabled 
                                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                                                        : "bg-secondary text-muted-foreground border-border"
                                                }`}>
                                                {flag.enabled ? <><Check className="w-3.5 h-3.5" /> Active</> : "Disabled"}
                                            </button>

                                            <button onClick={() => startEditingFlagTargets(flag)}
                                                className="text-[10px] text-primary hover:underline font-semibold">
                                                Configure Rules
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Rules configurations sidebar */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60 h-fit space-y-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Filter className="w-4 h-4 text-primary" /> Target Routing Rules</h3>
                            
                            {editingFlagKey ? (
                                <div className="space-y-4 text-xs">
                                    <p className="text-[11px] text-muted-foreground">Editing routing constraints for flag: <strong className="text-white font-mono">{editingFlagKey}</strong></p>
                                    
                                    {/* Plans checkbox */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase block">Restrict to Plans</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {["starter", "growth", "agency", "enterprise"].map(plan => (
                                                <label key={plan} className="flex items-center gap-2 p-2 rounded bg-secondary/35 border border-border/40 cursor-pointer hover:bg-secondary/60">
                                                    <input type="checkbox" checked={flagPlans.includes(plan)} onChange={() => handlePlanTargetCheckbox(plan, flagPlans, setFlagPlans)}
                                                        className="rounded text-primary focus:ring-0 bg-transparent border-border" />
                                                    <span className="capitalize">{plan}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <p className="text-[9px] text-muted-foreground">If none checked, the flag applies to all plans by default.</p>
                                    </div>

                                    {/* Organization filter */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase block">Restrict to Organization IDs</label>
                                        <input value={flagOrgs} onChange={e => setFlagOrgs(e.target.value)} placeholder="e.g. biz-001, biz-003"
                                            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-white text-xs focus:outline-none focus:border-primary" />
                                        <p className="text-[9px] text-muted-foreground">Comma-separated lists of specific merchant IDs.</p>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <button onClick={() => setEditingFlagKey(null)}
                                            className="flex-1 py-2 text-center rounded-lg border border-border bg-transparent text-xs hover:bg-secondary transition-all">
                                            Cancel
                                        </button>
                                        <button onClick={() => saveFlagTargets(editingFlagKey)}
                                            className="flex-1 py-2 text-center rounded-lg btn-primary text-white text-xs font-bold transition-all">
                                            Save Rules
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
                                    <Info className="w-8 h-8 text-border mb-1" />
                                    <span>Select 'Configure Rules' on any flag to restrict rollouts to specific SaaS plans or organization IDs.</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "announcements" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Publish form */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-5 h-fit lg:col-span-1">
                            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                                <Plus className="w-4.5 h-4.5 text-primary" /> Write Notification
                            </h3>

                            <form onSubmit={handlePublishAnnouncement} className="space-y-4 text-xs">
                                <div>
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Subject Header</label>
                                    <input value={annTitle} onChange={e => setAnnTitle(e.target.value)} placeholder="e.g. API Gateway Window Maintenance"
                                        className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white text-xs focus:outline-none focus:border-primary" />
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Announcement Type</label>
                                    <select value={annType} onChange={e => setAnnType(e.target.value as any)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white text-xs focus:outline-none focus:border-primary">
                                        <option value="notice">General Info / Notice</option>
                                        <option value="feature">New Product Release</option>
                                        <option value="disruption">System Disruption / SLA Warning</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Body Text Content</label>
                                    <textarea value={annContent} onChange={e => setAnnContent(e.target.value)} rows={4} placeholder="Type announcement message details here..."
                                        className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-white text-xs focus:outline-none focus:border-primary resize-none" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase block">Plan Target</label>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {["starter", "growth", "agency", "enterprise"].map(plan => (
                                            <label key={plan} className="flex items-center gap-2 p-1.5 rounded bg-secondary/20 border border-border/40 cursor-pointer">
                                                <input type="checkbox" checked={annTargetPlans.includes(plan)} onChange={() => handlePlanTargetCheckbox(plan, annTargetPlans, setAnnTargetPlans)}
                                                    className="rounded text-primary focus:ring-0 bg-transparent border-border" />
                                                <span className="capitalize text-[10px]">{plan}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Target Org IDs</label>
                                    <input value={annTargetOrgs} onChange={e => setAnnTargetOrgs(e.target.value)} placeholder="e.g. biz-001 (leave blank for all)"
                                        className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white text-xs focus:outline-none focus:border-primary" />
                                </div>

                                <button type="submit"
                                    className="w-full py-3 rounded-xl btn-primary text-white font-bold transition-all flex items-center justify-center gap-1.5">
                                    <Bell className="w-4 h-4" /> Publish Notification
                                </button>
                            </form>
                        </div>

                        {/* Recent postings */}
                        <div className="glass-card rounded-2xl p-6 border border-border/60 lg:col-span-2 space-y-4">
                            <div>
                                <h3 className="text-base font-bold text-white mb-1">Notification Bulletin Board</h3>
                                <p className="text-xs text-muted-foreground">Active announcements currently pushed to merchants dashboard alerts.</p>
                            </div>

                            <div className="space-y-4">
                                {announcements.map(ann => {
                                    const typeColors = {
                                        notice: "bg-blue-500/10 border-blue-500/20 text-blue-400",
                                        feature: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                                        disruption: "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                    };

                                    return (
                                        <div key={ann.id} className="p-4 rounded-xl bg-secondary/15 border border-border/40 flex flex-col gap-3">
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide border ${typeColors[ann.type]} mb-2 inline-block`}>
                                                        {ann.type}
                                                    </span>
                                                    <h4 className="font-bold text-sm text-white leading-snug">{ann.title}</h4>
                                                    <p className="text-[10px] text-muted-foreground mt-1">
                                                        Target Plans: {ann.targetPlans?.length ? ann.targetPlans.map(p => p.toUpperCase()).join(", ") : "All plans"}
                                                        {ann.targetOrgs?.length ? ` · Orgs: ${ann.targetOrgs.join(", ")}` : ""}
                                                    </p>
                                                </div>
                                                <span className="text-[10px] text-muted-foreground/60 shrink-0">
                                                    {new Date(ann.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed bg-secondary/30 p-3 rounded-lg border border-border/20">
                                                {ann.content}
                                            </p>
                                        </div>
                                    );
                                })}
                                {announcements.length === 0 && (
                                    <div className="py-12 text-center text-xs text-muted-foreground">No recent announcements published.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "audit" && (
                    <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col h-[65vh] overflow-hidden">
                        {/* Search & Filters */}
                        <div className="flex flex-col md:flex-row gap-4 mb-4 items-center justify-between">
                            <div className="relative w-full md:max-w-xs">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input value={auditSearch} onChange={e => setAuditSearch(e.target.value)} placeholder="Search audit trails..."
                                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-secondary/35 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-xs" />
                            </div>

                            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                                {/* Action Filter */}
                                <select value={auditActionFilter} onChange={e => setAuditActionFilter(e.target.value)}
                                    className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs text-white focus:outline-none">
                                    <option value="all">All Actions</option>
                                    {uniqueActions.map(act => (
                                        <option key={act} value={act}>{act}</option>
                                    ))}
                                </select>

                                {/* Merchant/Org Filter */}
                                <select value={auditOrgFilter} onChange={e => setAuditOrgFilter(e.target.value)}
                                    className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs text-white focus:outline-none">
                                    <option value="all">All Organizations</option>
                                    {businesses.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Audit Log Table */}
                        <div className="flex-1 overflow-auto rounded-xl border border-border/40 bg-secondary/10">
                            <table className="w-full border-collapse">
                                <thead className="sticky top-0 bg-neutral-900 border-b border-border/60 z-10">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground">Action</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground">Performed By</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground">IP / Client</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground">Metadata Specs</th>
                                        <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground">Date / Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/25">
                                    {filteredAuditLogs.map(log => (
                                        <tr key={log.id} className="hover:bg-secondary/15 transition-all text-xs">
                                            <td className="px-4 py-3.5 font-bold text-white shrink-0">{log.action}</td>
                                            <td className="px-4 py-3.5 text-muted-foreground">
                                                <span>{log.userName || "System"}</span>
                                                {log.businessId && (
                                                    <span className="text-[9px] bg-secondary/65 px-1 py-0.5 rounded border border-border/30 text-white ml-2">
                                                        {businesses.find(b => b.id === log.businessId)?.name || log.businessId}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 text-muted-foreground font-mono text-[10px]">
                                                {log.ipAddress} <br />
                                                <span className="text-[8px] text-muted-foreground/60 leading-none">{log.userAgent.slice(0, 30)}...</span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                {log.metadata ? (
                                                    <pre className="font-mono text-[9px] bg-secondary/40 border border-border/30 rounded p-1.5 text-purple-300 max-w-[250px] overflow-hidden truncate">
                                                        {JSON.stringify(log.metadata)}
                                                    </pre>
                                                ) : (
                                                    <span className="text-muted-foreground/50">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 text-right text-muted-foreground/60 text-[10px]">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredAuditLogs.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground">No audit trails match your filter search.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
