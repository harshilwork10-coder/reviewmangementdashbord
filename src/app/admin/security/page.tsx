"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Lock, Shield, Users, Key, AlertTriangle, Info, Check, X,
    ShieldAlert, ShieldCheck, Terminal, Server, RefreshCw,
    LogOut, Trash, Play, HelpCircle, Activity, Globe, Monitor,
    Trash2, Database, Download, FileText, CheckCircle
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface PermissionState {
    viewDashboard: boolean;
    manageBusinesses: boolean;
    manageCustomers: boolean;
    launchCampaigns: boolean;
    viewReports: boolean;
    manageBilling: boolean;
}

interface RoleConfig {
    name: string;
    label: string;
    description: string;
    permissions: PermissionState;
    color: string;
}

interface ActiveSession {
    id: string;
    user: string;
    role: string;
    device: string;
    ip: string;
    location: string;
    lastActive: string;
    isSuspicious: boolean;
}

interface AuditLog {
    id: string;
    timestamp: string;
    event: string;
    actor: string;
    target: string;
    ip: string;
    status: "SUCCESS" | "FAILED";
    severity: "info" | "warning" | "critical";
}

interface ToastAlert {
    id: string;
    type: "success" | "warning" | "error" | "info";
    text: string;
}

// ── Initial Roles Matrix Config ───────────────────────────────────────────
const initialRoles: RoleConfig[] = [
    {
        name: "super_admin",
        label: "Super Admin",
        description: "Platform owner. Full global read/write capabilities across all modules.",
        color: "text-red-400 border-red-500/30 bg-red-500/10",
        permissions: { viewDashboard: true, manageBusinesses: true, manageCustomers: true, launchCampaigns: true, viewReports: true, manageBilling: true }
    },
    {
        name: "agency_admin",
        label: "Agency Admin",
        description: "Manages tenant businesses and compares ratings. Excludes system configurations.",
        color: "text-violet-400 border-violet-500/30 bg-violet-500/10",
        permissions: { viewDashboard: true, manageBusinesses: true, manageCustomers: true, launchCampaigns: true, viewReports: true, manageBilling: false }
    },
    {
        name: "business_owner",
        label: "Business Owner",
        description: "Single organization administrator. Controls campaigns, billing, and settings.",
        color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
        permissions: { viewDashboard: true, manageBusinesses: true, manageCustomers: true, launchCampaigns: true, viewReports: true, manageBilling: true }
    },
    {
        name: "marketing_user",
        label: "Marketing User",
        description: "Campaign execution and customer communication manager. No billing settings.",
        color: "text-orange-400 border-orange-500/30 bg-orange-500/10",
        permissions: { viewDashboard: true, manageBusinesses: false, manageCustomers: true, launchCampaigns: true, viewReports: true, manageBilling: false }
    },
    {
        name: "read_only",
        label: "Read Only User",
        description: "Viewer. Allowed to navigate ratings feed and charts without updates.",
        color: "text-slate-400 border-white/10 bg-white/5",
        permissions: { viewDashboard: true, manageBusinesses: false, manageCustomers: false, launchCampaigns: false, viewReports: true, manageBilling: false }
    }
];

// ── Initial Sessions List ─────────────────────────────────────────────────
const initialSessions: ActiveSession[] = [
    { id: "sess_01", user: "admin@reviewhub.com", role: "Super Admin", device: "Chrome / Windows 11", ip: "192.168.1.45", location: "Chicago, IL", lastActive: "Just now", isSuspicious: false },
    { id: "sess_02", user: "agency_lead@brandboost.net", role: "Agency Admin", device: "Safari / macOS Sonoma", ip: "203.0.113.88", location: "Dallas, TX", lastActive: "4 mins ago", isSuspicious: false },
    { id: "sess_03", user: "owner@acmepizza.com", role: "Business Owner", device: "Chrome / macOS Sonoma", ip: "198.51.100.12", location: "New York, NY", lastActive: "12 mins ago", isSuspicious: false },
    { id: "sess_04", user: "marketer@pizza.com", role: "Marketing User", device: "Safari / iOS 17 (iPhone 15)", ip: "172.56.21.9", location: "Los Angeles, CA", lastActive: "1 hour ago", isSuspicious: true },
    { id: "sess_05", user: "analyst@globalbrand.com", role: "Read Only User", device: "Firefox / Ubuntu 22.04", ip: "82.165.41.203", location: "London, UK", lastActive: "2 hours ago", isSuspicious: false }
];

// ── Initial Audit Logs ────────────────────────────────────────────────────
const initialLogs: AuditLog[] = [
    { id: "aud_01", timestamp: "2026-06-12 01:22:45", event: "auth.login", actor: "admin@reviewhub.com", target: "Session Started", ip: "192.168.1.45", status: "SUCCESS", severity: "info" },
    { id: "aud_02", timestamp: "2026-06-12 01:14:12", event: "billing.update", actor: "owner@acmepizza.com", target: "Stripe Plan: Pro tier upgraded", ip: "198.51.100.12", status: "SUCCESS", severity: "info" },
    { id: "aud_03", timestamp: "2026-06-12 01:05:01", event: "auth.failed", actor: "attacker@unknown.net", target: "Failed Password (Attempt 4)", ip: "89.23.155.12", status: "FAILED", severity: "warning" },
    { id: "aud_04", timestamp: "2026-06-12 00:54:30", event: "rbac.change", actor: "admin@reviewhub.com", target: "Upgraded user acme_agent to owner", ip: "192.168.1.45", status: "SUCCESS", severity: "critical" },
    { id: "aud_05", timestamp: "2026-06-12 00:32:15", event: "campaign.launch", actor: "marketer@pizza.com", target: "Campaign: Westside Pizza Promos", ip: "172.56.21.9", status: "SUCCESS", severity: "info" },
    { id: "aud_06", timestamp: "2026-06-12 00:11:04", event: "auth.failed", actor: "marketer@pizza.com", target: "Failed Password (Attempt 1)", ip: "172.56.21.9", status: "FAILED", severity: "info" },
];

export default function SuperAdminSecurityPage() {
    const [activeTab, setActiveTab] = useState<"rbac" | "sessions" | "audit" | "compliance" | "deliverables">("rbac");

    // Dynamic state matrices
    const [roles, setRoles] = useState<RoleConfig[]>(initialRoles);
    const [isEditMode, setIsEditMode] = useState(false);
    const [sessions, setSessions] = useState<ActiveSession[]>(initialSessions);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialLogs);
    const [toasts, setToasts] = useState<ToastAlert[]>([]);

    // Log filters state
    const [severityFilter, setSeverityFilter] = useState<string>("all");
    const [eventFilter, setEventFilter] = useState<string>("all");

    // Compliance GDPR Sandbox state
    const [gdprEmail, setGdprEmail] = useState("");
    const [purgeStep, setPurgeStep] = useState(0);
    const [purging, setPurging] = useState(false);
    const [purgeLogs, setPurgeLogs] = useState<string[]>([]);

    // Deliverables state
    const [deliverables, setDeliverables] = useState([
        { id: "sd1", label: "Authentication architecture approved", checked: true },
        { id: "sd2", label: "RBAC model approved", checked: true },
        { id: "sd3", label: "Audit logging defined", checked: true },
        { id: "sd4", label: "Session strategy documented", checked: true },
        { id: "sd5", label: "Security implementation ready", checked: false },
    ]);

    const doneDels = deliverables.filter(d => d.checked).length;

    // Toast alert triggers
    const addToast = (type: ToastAlert["type"], text: string) => {
        const id = Math.random().toString(36).substring(7);
        setToasts(prev => [...prev, { id, type, text }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    // Toggle single permission check in Edit Mode
    const togglePermission = (roleName: string, permKey: keyof PermissionState) => {
        if (!isEditMode) return;
        setRoles(prev =>
            prev.map(r => {
                if (r.name === roleName) {
                    const newPerms = { ...r.permissions, [permKey]: !r.permissions[permKey] };
                    addToast("info", `Updated ${r.label}: ${permKey.replace(/([A-Z])/g, " $1")} → ${newPerms[permKey] ? "ALLOWED" : "RESTRICTED"}`);
                    return { ...r, permissions: newPerms };
                }
                return r;
            })
        );
    };

    // Session Revocation handlers
    const revokeSession = (id: string, user: string) => {
        setSessions(prev => prev.filter(s => s.id !== id));
        addToast("warning", `Revoked active session for ${user}.`);

        // Inject audit log
        const newLog: AuditLog = {
            id: `aud_rev_${Math.random().toString(36).substring(7)}`,
            timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
            event: "auth.revoke",
            actor: "admin@reviewhub.com",
            target: `Session revoked for ${user}`,
            ip: "192.168.1.45",
            status: "SUCCESS",
            severity: "warning"
        };
        setAuditLogs(prev => [newLog, ...prev]);
    };

    const revokeAllSessions = () => {
        setSessions([]);
        addToast("error", "All active user sessions have been terminated.");
        const newLog: AuditLog = {
            id: `aud_revall_${Math.random().toString(36).substring(7)}`,
            timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
            event: "auth.revoke_all",
            actor: "admin@reviewhub.com",
            target: "Mass session invalidation triggered",
            ip: "192.168.1.45",
            status: "SUCCESS",
            severity: "critical"
        };
        setAuditLogs(prev => [newLog, ...prev]);
    };

    // Dynamic audit log injector
    const injectAuditLog = () => {
        const events = [
            { ev: "auth.login", actor: "analyst@globalbrand.com", target: "Session Started", ip: "82.165.41.203", status: "SUCCESS" as const, severity: "info" as const },
            { ev: "campaign.launch", actor: "marketer@pizza.com", target: "Campaign: Uptown Pizza Promos", ip: "172.56.21.9", status: "SUCCESS" as const, severity: "info" as const },
            { ev: "auth.failed", actor: "attacker@unknown.net", target: "API Key Validation Error", ip: "145.92.11.23", status: "FAILED" as const, severity: "critical" as const },
            { ev: "billing.update", actor: "owner@pizza.com", target: "Updated subscription credit card", ip: "172.56.21.9", status: "SUCCESS" as const, severity: "info" as const },
            { ev: "auth.reset", actor: "owner@acmepizza.com", target: "Triggered password reset workflow", ip: "198.51.100.12", status: "SUCCESS" as const, severity: "warning" as const },
        ];
        const choice = events[Math.floor(Math.random() * events.length)];
        const newLog: AuditLog = {
            id: `aud_inj_${Math.random().toString(36).substring(7)}`,
            timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
            event: choice.ev,
            actor: choice.actor,
            target: choice.target,
            ip: choice.ip,
            status: choice.status,
            severity: choice.severity,
        };
        setAuditLogs(prev => [newLog, ...prev]);
        addToast("success", `Security audit log generated: ${choice.ev}`);
    };

    // GDPR Purge sequence simulator
    const triggerGDPRPurge = () => {
        if (!gdprEmail) {
            addToast("error", "Email field cannot be blank.");
            return;
        }
        setPurging(true);
        setPurgeStep(0);
        setPurgeLogs(["[INIT] Fetching customer accounts scoping contexts..."]);

        setTimeout(() => {
            setPurgeStep(1);
            setPurgeLogs(prev => [...prev, "[OK] Found 4 review requests records and 1 CRM mapping index."]);
        }, 1000);

        setTimeout(() => {
            setPurgeStep(2);
            setPurgeLogs(prev => [...prev, "[OK] Hard purging email and phone fields from active CRM locations..."]);
        }, 2200);

        setTimeout(() => {
            setPurgeStep(3);
            setPurgeLogs(prev => [...prev, "[SUCCESS] Cascaded soft-deletion records validated. GDPR right to be forgotten complete."]);
            setPurging(false);
            addToast("success", `Data deleted for ${gdprEmail}`);
            // Log it
            const newLog: AuditLog = {
                id: `aud_gdpr_${Math.random().toString(36).substring(7)}`,
                timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
                event: "compliance.gdpr_purge",
                actor: "admin@reviewhub.com",
                target: `GDPR deletion target: ${gdprEmail}`,
                ip: "192.168.1.45",
                status: "SUCCESS",
                severity: "critical"
            };
            setAuditLogs(prev => [newLog, ...prev]);
        }, 3500);
    };

    // Filtered Logs
    const filteredLogs = auditLogs.filter(log => {
        const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;
        const matchesEvent = eventFilter === "all" || log.event.startsWith(eventFilter);
        return matchesSeverity && matchesEvent;
    });

    const tabs = [
        { id: "rbac", label: "RBAC Matrix", icon: Users },
        { id: "sessions", label: "Session Monitor", icon: Monitor },
        { id: "audit", label: "Audit Logs", icon: Terminal },
        { id: "compliance", label: "Compliance & Data", icon: ShieldCheck },
        { id: "deliverables", label: "Part 6 Gates", icon: CheckCircle },
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
                        <Lock className="w-6 h-6 text-red-500" />
                        Security & Auth Console
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Evaluate the RBAC permissions configurations, active user sessions monitoring, compliance filters, and Part 6 gates.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
                        Argon2id · AES-256-GCM
                    </div>
                    <div className="px-4 py-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl text-xs font-semibold">
                        TLS 1.3 Mandated
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

            {/* ── RBAC Permission Matrix Tab ── */}
            {activeTab === "rbac" && (
                <div className="space-y-6">
                    <div className="glass-card rounded-2xl p-6 border border-border/60">
                        <div className="flex justify-between items-center mb-5">
                            <div>
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Key className="w-4.5 h-4.5 text-red-400" /> Role-Based Access Control matrix
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Assign access flags across roles. Click <strong className="text-white">Customize Permissions</strong> to simulate changes.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsEditMode(!isEditMode)}
                                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                    isEditMode ? "bg-emerald-600 text-white" : "bg-slate-900 text-slate-300 border border-white/10 hover:text-white"
                                }`}
                            >
                                {isEditMode ? "Save Configurations" : "Customize Permissions"}
                            </button>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/60">
                            <table className="w-full text-[11px] text-slate-300">
                                <thead>
                                    <tr className="bg-slate-950 border-b border-white/5 text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                                        <th className="text-left p-4">Permissions Scopes</th>
                                        {roles.map(r => (
                                            <th key={r.name} className="text-center p-4 min-w-[120px]">{r.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        { key: "viewDashboard", label: "View Dashboard" },
                                        { key: "manageBusinesses", label: "Manage Businesses" },
                                        { key: "manageCustomers", label: "Manage Customers" },
                                        { key: "launchCampaigns", label: "Launch Campaigns" },
                                        { key: "viewReports", label: "View Reports" },
                                        { key: "manageBilling", label: "Manage Billing" },
                                    ].map(perm => (
                                        <tr key={perm.key} className="hover:bg-slate-900/30 transition-colors">
                                            <td className="p-4 font-bold text-slate-200">{perm.label}</td>
                                            {roles.map(role => {
                                                const hasAccess = role.permissions[perm.key as keyof PermissionState];
                                                return (
                                                    <td key={role.name} className="text-center p-4">
                                                        <button
                                                            disabled={!isEditMode || role.name === "super_admin"}
                                                            onClick={() => togglePermission(role.name, perm.key as keyof PermissionState)}
                                                            className={`w-6 h-6 rounded-lg mx-auto flex items-center justify-center transition-all ${
                                                                hasAccess
                                                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                                    : "bg-slate-900/60 text-slate-600 border border-white/5"
                                                            } ${isEditMode && role.name !== "super_admin" ? "cursor-pointer hover:bg-emerald-500/30 hover:border-emerald-500/40" : ""}`}
                                                        >
                                                            {hasAccess ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                                                        </button>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Role summaries list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                        {roles.map((r, i) => (
                            <div key={i} className={`p-4 rounded-xl border ${r.color} flex flex-col justify-between`}>
                                <div>
                                    <span className="text-xs font-bold block mb-1">{r.label}</span>
                                    <p className="text-[10px] text-slate-300 leading-relaxed">{r.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Session Monitor Tab ── */}
            {activeTab === "sessions" && (
                <div className="space-y-6">
                    <div className="glass-card rounded-2xl p-6 border border-border/60">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Monitor className="w-4.5 h-4.5 text-cyan-400" /> Active Session Registry
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Simulate dynamic user login lifecycles and trigger revocation commands to expire refresh tokens.
                                </p>
                            </div>
                            <button
                                onClick={revokeAllSessions}
                                disabled={sessions.length === 0}
                                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95"
                            >
                                Revoke All Active Sessions
                            </button>
                        </div>

                        {sessions.length === 0 ? (
                            <div className="p-8 text-center bg-slate-950 border border-white/5 rounded-xl space-y-2">
                                <Shield className="w-8 h-8 text-slate-600 mx-auto" />
                                <div className="text-xs text-slate-300 font-bold">No active sessions cached</div>
                                <div className="text-[10px] text-slate-500">Redis sessions store cleared. All users redirected to /login.</div>
                                <button
                                    onClick={() => setSessions(initialSessions)}
                                    className="px-3 py-1.5 bg-white/5 border border-white/10 text-white rounded-lg text-[10px] font-bold mt-2"
                                >
                                    Repopulate Sandbox Sessions
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/60">
                                <table className="w-full text-[11px] text-slate-300">
                                    <thead>
                                        <tr className="bg-slate-950 border-b border-white/5 text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                                            <th className="text-left p-4">User Email / Role</th>
                                            <th className="text-left p-4">Browser & Device</th>
                                            <th className="text-left p-4">IP Address</th>
                                            <th className="text-left p-4">Location</th>
                                            <th className="text-left p-4">Last Activity</th>
                                            <th className="text-center p-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {sessions.map(sess => (
                                            <tr key={sess.id} className="hover:bg-slate-900/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-200 flex items-center gap-1.5">
                                                        {sess.user}
                                                        {sess.isSuspicious && (
                                                            <span className="px-1.5 py-0.2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-bold rounded flex items-center gap-0.5 animate-pulse">
                                                                <AlertTriangle className="w-2.5 h-2.5" /> Suspect
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-[9px] text-slate-500 font-mono mt-0.5">{sess.role}</div>
                                                </td>
                                                <td className="p-4 font-mono text-[10px] text-slate-400">{sess.device}</td>
                                                <td className="p-4 font-mono text-[10px] text-slate-400">{sess.ip}</td>
                                                <td className="p-4 text-slate-400 flex items-center gap-1 mt-1">
                                                    <Globe className="w-3.5 h-3.5 text-slate-600" /> {sess.location}
                                                </td>
                                                <td className="p-4 text-slate-400">{sess.lastActive}</td>
                                                <td className="p-4 text-center">
                                                    <button
                                                        onClick={() => revokeSession(sess.id, sess.user)}
                                                        className="px-2 py-1 bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 border border-white/5 hover:border-rose-500/20 rounded-lg text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1 mx-auto"
                                                    >
                                                        <Trash2 className="w-3 h-3" /> Revoke
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Audit Logs Tab ── */}
            {activeTab === "audit" && (
                <div className="space-y-6">
                    <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Terminal className="w-4.5 h-4.5 text-cyan-400" /> Security Audit logs
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Track authentication events and configuration modifications. Click <strong className="text-white">Inject Audit Log</strong> to feed mock data.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={injectAuditLog}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-md"
                                >
                                    <Play className="w-3.5 h-3.5" /> Inject Audit Log
                                </button>
                            </div>
                        </div>

                        {/* Filters row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-950/80 rounded-xl border border-white/5">
                            <div className="space-y-1">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Severity</label>
                                <select
                                    value={severityFilter}
                                    onChange={e => setSeverityFilter(e.target.value)}
                                    className="w-full bg-slate-900 border border-white/10 rounded-lg text-xs text-white p-1.5 focus:outline-none focus:ring-1 focus:ring-red-500"
                                >
                                    <option value="all">All Levels</option>
                                    <option value="info">Info</option>
                                    <option value="warning">Warning</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Event Domain</label>
                                <select
                                    value={eventFilter}
                                    onChange={e => setEventFilter(e.target.value)}
                                    className="w-full bg-slate-900 border border-white/10 rounded-lg text-xs text-white p-1.5 focus:outline-none focus:ring-1 focus:ring-red-500"
                                >
                                    <option value="all">All Domains</option>
                                    <option value="auth">Authentication (auth.*)</option>
                                    <option value="rbac">Permissions (rbac.*)</option>
                                    <option value="billing">Payments (billing.*)</option>
                                    <option value="campaign">Invites (campaign.*)</option>
                                </select>
                            </div>
                        </div>

                        {/* Logs table */}
                        <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/60 max-h-[400px]">
                            <table className="w-full text-[10px] text-slate-300">
                                <thead className="sticky top-0 bg-slate-950 z-10">
                                    <tr className="border-b border-white/5 text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                                        <th className="text-left p-3">Timestamp (UTC)</th>
                                        <th className="text-left p-3">Event Code</th>
                                        <th className="text-left p-3">Actor ID</th>
                                        <th className="text-left p-3">Target / Event</th>
                                        <th className="text-left p-3">IP Address</th>
                                        <th className="text-center p-3">Status</th>
                                        <th className="text-center p-3">Severity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 font-mono">
                                    {filteredLogs.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                                                No audit logs match active filter parameters.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredLogs.map(log => (
                                            <tr key={log.id} className="hover:bg-slate-900/30 transition-colors">
                                                <td className="p-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                                                <td className="p-3 font-bold text-slate-200">{log.event}</td>
                                                <td className="p-3 text-slate-400">{log.actor}</td>
                                                <td className="p-3 text-slate-300">{log.target}</td>
                                                <td className="p-3 text-slate-500">{log.ip}</td>
                                                <td className="p-3 text-center">
                                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                                        log.status === "SUCCESS" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                                    }`}>
                                                        {log.status}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                                                        log.severity === "critical" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                                                        log.severity === "warning" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                                                        "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                                    }`}>
                                                        {log.severity}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Compliance & Data Tab ── */}
            {activeTab === "compliance" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* GDPR CCPA Data deletion sandbox */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                <Trash className="w-4.5 h-4.5 text-red-400" /> Right to be Forgotten Sandbox
                            </h3>
                            <p className="text-xs text-slate-400">
                                Simulate compliance requests to permanently purge user/customer parameters from data stores.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 font-medium">Customer Email Scope</label>
                                <input
                                    type="email"
                                    value={gdprEmail}
                                    disabled={purging}
                                    onChange={e => setGdprEmail(e.target.value)}
                                    placeholder="customer-gdpr@example.com"
                                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-red-500"
                                />
                            </div>
                            <button
                                onClick={triggerGDPRPurge}
                                disabled={purging}
                                className="w-full py-2 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                            >
                                {purging ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                {purging ? "Purging customer records..." : "Execute CCPA/GDPR Hard Purge"}
                            </button>
                        </div>

                        {/* Output console log */}
                        {(purging || purgeLogs.length > 0) && (
                            <div className="bg-slate-950 rounded-xl border border-white/5 p-4 font-mono text-[9px] text-slate-300 space-y-1.5 max-h-[160px] overflow-y-auto">
                                {purgeLogs.map((log, idx) => (
                                    <div key={idx} className={log.includes("SUCCESS") ? "text-emerald-400" : ""}>{log}</div>
                                ))}
                                {purging && (
                                    <div className="flex items-center gap-1 text-slate-500 italic">
                                        <RefreshCw className="w-3 h-3 animate-spin" /> Cascading operations...
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Data Protection Standards info card */}
                    <div className="space-y-5">
                        <div className="glass-card rounded-2xl p-5 border border-border/60">
                            <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Data Protection Rules
                            </h4>
                            <div className="space-y-3">
                                {[
                                    { spec: "Encryption in Transit", val: "TLS 1.3 / HSTS enforced", detail: "SHA-256 signatures, forward secrecy", status: "VERIFIED" },
                                    { spec: "Encryption at Rest", val: "AES-256 ciphers", detail: "PostgreSQL databases, Redis cache registries", status: "ENFORCED" },
                                    { spec: "Backups Cryptography", val: "GPG envelope encryption", detail: "Daily cloud backups, rotatable keys", status: "ACTIVE" },
                                    { spec: "Rate Limiting", val: "Express rate-limit / Redis", detail: "5 blocks per email on login failures", status: "VERIFIED" },
                                ].map((p, i) => (
                                    <div key={i} className="p-3 bg-slate-950/60 border border-white/5 rounded-xl flex items-center justify-between gap-4 text-[10px]">
                                        <div>
                                            <div className="font-bold text-slate-200">{p.spec}</div>
                                            <div className="text-slate-500 text-[9px] mt-0.5">{p.detail}</div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-emerald-400 font-bold font-mono">{p.val}</div>
                                            <div className="text-slate-400 text-[8px] font-bold mt-0.5 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 uppercase tracking-wide">{p.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* GDPR Opt-outs consent panel */}
                        <div className="glass-card rounded-2xl p-5 border border-border/60">
                            <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-violet-400" /> Consent & Privacy Parameters
                            </h4>
                            <div className="space-y-2 text-[10px] text-slate-400">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span>Cookie Consent Manager:</span>
                                    <strong className="text-emerald-400">Strictly Necessary Enabled</strong>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span>Transactional Email Opt-Out:</span>
                                    <strong className="text-emerald-400">RFC 8058 List-Unsubscribe</strong>
                                </div>
                                <div className="flex justify-between pb-1">
                                    <span>Audit retention minimum:</span>
                                    <strong className="text-white">12 Months (Rolling)</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Part 6 Gates Checklist Tab ── */}
            {activeTab === "deliverables" && (
                <div className="max-w-2xl mx-auto">
                    <div className="glass-card rounded-2xl p-8 border border-border/60">
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4.5 h-4.5 text-emerald-400" /> Part 6 Deliverables Gates
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-8">
                            Toggle individual authentication and security gates to complete the architectural validation phase.
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
                                <span className="text-slate-400">Part 6 Completion progress</span>
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
                                    <CheckCircle className="w-4 h-4" /> Part 6 Complete — Authentication & Security Ready for Implementation!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
