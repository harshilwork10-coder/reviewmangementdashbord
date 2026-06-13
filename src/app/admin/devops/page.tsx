"use client";

import { useState, useEffect } from "react";
import {
    Server, Activity, ShieldAlert, Key, Database, RefreshCw, Play, Check, X,
    ChevronRight, Info, Lock, Unlock, Settings, AlertCircle, Terminal, Sliders,
    Cpu, History, ArrowRight, AlertTriangle, ShieldCheck, HardDrive, Wifi, CheckCircle
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface CICDStep {
    id: number;
    name: string;
    description: string;
    status: "idle" | "running" | "success" | "failed";
}

interface SecretItem {
    key: string;
    value: string;
    rotatedAt: string;
    status: "Active" | "Rotated";
}

interface BackupItem {
    id: string;
    timestamp: string;
    size: string;
    type: "Automated" | "Manual";
    status: "Verified" | "Failed";
}

interface ToastMessage {
    id: string;
    type: "success" | "warning" | "error" | "info";
    text: string;
}

export default function SuperAdminDevOpsPage() {
    const [activeTab, setActiveTab] = useState<"infrastructure" | "secrets" | "cicd" | "backups" | "incidents">("infrastructure");

    // Traffic load multiplier
    const [trafficLoad, setTrafficLoad] = useState<number>(1);
    
    // CI/CD simulator states
    const [cicdSteps, setCicdSteps] = useState<CICDStep[]>([
        { id: 1, name: "Lint Check", description: "Enforces ESLint and Prettier rules", status: "idle" },
        { id: 2, name: "Unit & Integration Tests", description: "Runs test suite (Jest)", status: "idle" },
        { id: 3, name: "Security Audit Scan", description: "Scans packages with npm audit & snyk", status: "idle" },
        { id: 4, name: "Production Build Compile", description: "Runs next build optimization", status: "idle" },
    ]);
    const [cicdRunning, setCicdRunning] = useState<boolean>(false);
    const [lastDeploymentStatus, setLastDeploymentStatus] = useState<"Success" | "Failed" | "None">("Success");
    const [deploymentsCount, setDeploymentsCount] = useState<number>(42);

    // Environment & Secrets
    const [activeEnv, setActiveEnv] = useState<"development" | "staging" | "production">("production");
    const [secrets, setSecrets] = useState<Record<string, SecretItem[]>>({
        development: [
            { key: "DATABASE_URL", value: "postgresql://dev_user:*****@localhost:5432/review_dev", rotatedAt: "2026-05-10", status: "Active" },
            { key: "STRIPE_SECRET_KEY", value: "sk_test_51N8d...", rotatedAt: "2026-05-10", status: "Active" },
            { key: "OPENAI_API_KEY", value: "sk-proj-dev-gpt...", rotatedAt: "2026-05-10", status: "Active" },
            { key: "TWILIO_AUTH_TOKEN", value: "tw_token_dev_...", rotatedAt: "2026-05-10", status: "Active" },
        ],
        staging: [
            { key: "DATABASE_URL", value: "postgresql://staging_user:*****@db.staging:5432/review_stage", rotatedAt: "2026-04-15", status: "Active" },
            { key: "STRIPE_SECRET_KEY", value: "sk_test_51N8s...", rotatedAt: "2026-04-15", status: "Active" },
            { key: "OPENAI_API_KEY", value: "sk-proj-stage-gpt...", rotatedAt: "2026-04-15", status: "Active" },
            { key: "TWILIO_AUTH_TOKEN", value: "tw_token_stage_...", rotatedAt: "2026-04-15", status: "Active" },
        ],
        production: [
            { key: "DATABASE_URL", value: "postgresql://prod_cluster_admin:*****@aws-aurora.us-east-1:5432/review_prod", rotatedAt: "2026-03-20", status: "Active" },
            { key: "STRIPE_SECRET_KEY", value: "sk_live_51N8p...", rotatedAt: "2026-03-20", status: "Active" },
            { key: "OPENAI_API_KEY", value: "sk-proj-live-gpt4...", rotatedAt: "2026-03-20", status: "Active" },
            { key: "TWILIO_AUTH_TOKEN", value: "tw_token_live_...", rotatedAt: "2026-03-20", status: "Active" },
        ]
    });
    const [revealSecrets, setRevealSecrets] = useState<boolean>(false);

    // Database Backups & PITR
    const [backups, setBackups] = useState<BackupItem[]>([
        { id: "DB-BK-20260610", timestamp: "2026-06-10 02:00:15 UTC", size: "482 MB", type: "Automated", status: "Verified" },
        { id: "DB-BK-20260609", timestamp: "2026-06-09 02:00:22 UTC", size: "479 MB", type: "Automated", status: "Verified" },
        { id: "DB-BK-20260608", timestamp: "2026-06-08 02:00:11 UTC", size: "475 MB", type: "Automated", status: "Verified" },
        { id: "DB-BK-20260607", timestamp: "2026-06-07 02:00:43 UTC", size: "472 MB", type: "Automated", status: "Verified" },
    ]);
    const [pitrTime, setPitrTime] = useState<string>("2026-06-10T12:00");
    const [restoring, setRestoring] = useState<boolean>(false);

    // P1 Outage Incident state
    const [p1Active, setP1Active] = useState<boolean>(false);
    const [p1Stage, setP1Stage] = useState<number>(0);
    const [p1Logs, setP1Logs] = useState<string[]>([]);
    const [restoringBackupId, setRestoringBackupId] = useState<string>("");

    // Toasts state
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    // Part 12 Gates checklist state
    const [deliverables, setDeliverables] = useState([
        { id: "pd12_1", label: "DevOps hosting architecture approved", checked: true },
        { id: "pd12_2", label: "Secrets and environment vault configured", checked: true },
        { id: "pd12_3", label: "Automated daily backups verified", checked: true },
        { id: "pd12_4", label: "Incident escalation protocols documented", checked: true },
        { id: "pd12_5", label: "Production rollback tags configured", checked: false },
    ]);

    // General Audit Log
    const [devOpsLogs, setDevOpsLogs] = useState<string[]>([
        "[INFO] DevOps and Hosting command center initialized.",
        `[INFO] Target environment set to: PRODUCTION. Active VPC subnet: 10.0.0.0/16.`,
        `[AUDIT] Security review: TLS 1.3 verified, HSTS active, MFA enforced.`,
    ]);

    // Toast alert triggers
    const addToast = (type: ToastMessage["type"], text: string) => {
        const id = Math.random().toString(36).substring(7);
        setToasts(prev => [...prev, { id, type, text }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    // Update terminal logs helper
    const addLog = (msg: string) => {
        const time = new Date().toLocaleTimeString();
        setDevOpsLogs(prev => [`[${time}] ${msg}`, ...prev]);
    };

    // CPU and Node loads calculation based on traffic load and P1 State
    const cpuUtilization = p1Active ? 99 : Math.min(100, Math.floor(22 + trafficLoad * 9.5 + Math.random() * 4));
    const activeNodes = p1Active ? 1 : Math.max(2, Math.floor(2 + trafficLoad * 1.5));
    const bandwidth = p1Active ? 0.05 : Number((2.4 + trafficLoad * 1.8 + Math.random() * 0.5).toFixed(2));
    const uptimePercentage = p1Active ? 99.82 : 99.98;

    // Simulation: Run CI/CD Pipeline
    const handleRunCICD = () => {
        if (cicdRunning) return;
        setCicdRunning(true);
        addLog("CI/CD Build Pipeline run initiated on branch 'main'.");
        addToast("info", "Starting CI/CD build run...");
        
        // Reset steps to running/idle
        setCicdSteps(prev => prev.map(s => ({ ...s, status: s.id === 1 ? "running" : "idle" })));

        const runStep = (stepId: number) => {
            setTimeout(() => {
                setCicdSteps(prev => prev.map(s => {
                    if (s.id === stepId) return { ...s, status: "success" };
                    if (s.id === stepId + 1) return { ...s, status: "running" };
                    return s;
                }));
                addLog(`CI/CD Step [${cicdSteps[stepId - 1].name}] passed successfully.`);

                if (stepId < 4) {
                    runStep(stepId + 1);
                } else {
                    setCicdRunning(false);
                    setLastDeploymentStatus("Success");
                    setDeploymentsCount(prev => prev + 1);
                    addLog("CI/CD Pipeline run COMPLETED. Deployment production artifacts pushed successfully to Vercel.");
                    addToast("success", "Production build successfully deployed!");
                }
            }, 1200);
        };

        runStep(1);
    };

    // Secret Key Rotation
    const handleRotateSecret = (secretKey: string) => {
        const confirmRotation = window.confirm(`Are you sure you want to rotate the ${secretKey} token in ${activeEnv.toUpperCase()}? This will regenerate the token and update the vault.`);
        if (!confirmRotation) return;

        setSecrets(prev => {
            const currentSecrets = [...prev[activeEnv]];
            const index = currentSecrets.findIndex(s => s.key === secretKey);
            if (index !== -1) {
                currentSecrets[index] = {
                    ...currentSecrets[index],
                    rotatedAt: new Date().toISOString().split("T")[0],
                    status: "Rotated"
                };
            }
            return {
                ...prev,
                [activeEnv]: currentSecrets
            };
        });

        addLog(`Vault token rotated: ${secretKey} in ${activeEnv.toUpperCase()} environment.`);
        addToast("success", `${secretKey} successfully rotated in ${activeEnv.toUpperCase()} vault!`);
    };

    // Trigger SQL Backup
    const handleTriggerBackup = () => {
        addLog("Database Administrator initiated manual backup dump command...");
        const newBackupId = `DB-BK-MAN-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`;
        addToast("info", "Starting database dump...");
        
        setTimeout(() => {
            const newBackup: BackupItem = {
                id: newBackupId,
                timestamp: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
                size: "484 MB",
                type: "Manual",
                status: "Verified"
            };
            setBackups(prev => [newBackup, ...prev]);
            addLog(`Manual SQL database snapshot successfully verified and stored: ${newBackupId}.`);
            addToast("success", `Database snapshot ${newBackupId} stored & verified!`);
        }, 1500);
    };

    // Point-in-Time Recovery Simulation
    const handlePITRRestore = () => {
        const dateObj = new Date(pitrTime);
        const confirmRestore = window.confirm(`WARNING: You are simulating a database Point-in-Time Restoration to ${dateObj.toLocaleString()}. This will lock current DB pool connections and revert table states. Proceed?`);
        if (!confirmRestore) return;

        setRestoring(true);
        addLog(`[PITR] Initiating point-in-time recovery restore targeting timestamp: ${dateObj.toISOString()}`);
        addToast("warning", "Starting database restoration...");
        
        setTimeout(() => {
            addLog("[PITR] Step 1: Suspending incoming application connection pool connections (Safe Lock mode).");
            setTimeout(() => {
                addLog("[PITR] Step 2: Provisioning transient PostgreSQL restoration container from Cloud Object Storage.");
                setTimeout(() => {
                    addLog(`[PITR] Step 3: Replaying WAL binary logs to timestamp state: ${dateObj.toISOString()}`);
                    setTimeout(() => {
                        addLog("[PITR] Step 4: Re-linking primary database pool configurations and running automated integrity validations.");
                        setTimeout(() => {
                            setRestoring(false);
                            addLog("[PITR RESTORE COMPLETE] System recovered successfully. Connection pools re-enabled.");
                            addToast("success", `Restored database to ${dateObj.toLocaleString()} successfully.`);
                        }, 1200);
                    }, 1200);
                }, 1200);
            }, 1000);
        }, 800);
    };

    // Trigger P1 Incident Outage
    const handleTriggerP1 = () => {
        if (p1Active) return;
        setP1Active(true);
        setP1Stage(1);
        setP1Logs([
            "CRITICAL: Application Health check endpoints failing (502 Bad Gateway / Connection Timeout).",
            "Incident severity assessed: P1 - Platform Down.",
            "PagerDuty Alert dispatched: Calling On-Call DevOps Engineer.",
            "DevOps Incident Slack Room established."
        ]);
        addLog("[P1 ALERT] Outage detected. Health check failure. Gateway ping returned 502.");
        addToast("error", "CRITICAL P1 OUTAGE TRIGGERED!");

        // Simulate notification loop
        setTimeout(() => {
            setP1Stage(2);
            setP1Logs(prev => [
                ...prev,
                "Status Page Updated: ReviewManagement reports 'Investigating critical connectivity errors.'",
                "Automated Diagnostics: Database connection count exceeds max pool limit (100/100). Threads locked."
            ]);
            addLog("[P1 ALERT] DB connection leak detected. Max client threads exhausted.");
        }, 2500);

        setTimeout(() => {
            setP1Stage(3);
            setP1Logs(prev => [
                ...prev,
                "Support Desk escalated: Multi-tenant API routes locked. Customer tickets increasing rapidly.",
                "Action Required: Select recovery backup snapshot and trigger rollback."
            ]);
            addLog("[P1 ALERT] Active requests piling. Awaiting engineer recovery trigger.");
        }, 5000);
    };

    // Recover from P1 Outage
    const handleP1Recover = () => {
        if (!p1Active) return;
        addLog("[P1 RECOVERY] DevOps engineer initiated emergency system restoration protocol...");
        addToast("info", "Initiating rollback recovery...");
        setP1Stage(4);
        setP1Logs(prev => [
            ...prev,
            "Reverting container configuration to previous stable tagged build: v1.4.2-stable",
            "Clearing PostgreSQL zombie connection threads and increasing pool limits (max_connections = 250)",
            "Running smoke test validations on health checks..."
        ]);

        setTimeout(() => {
            setP1Active(false);
            setP1Stage(0);
            setP1Logs([]);
            addLog("[P1 RECOVERY SUCCESS] System returned online. SSL and DB connections verified. Gateway response time: 140ms.");
            addToast("success", "Rollback successful! System is fully operational.");
        }, 3000);
    };

    const toggleDeliverable = (id: string) => {
        setDeliverables(prev =>
            prev.map(d => {
                if (d.id === id) {
                    const nextVal = !d.checked;
                    addLog(`Gate ${d.label} toggled to ${nextVal ? "PASSED" : "PENDING"}`);
                    addToast(nextVal ? "success" : "warning", `Gate: ${d.label} status updated.`);
                    return { ...d, checked: nextVal };
                }
                return d;
            })
        );
    };

    const doneDels = deliverables.filter(d => d.checked).length;

    const tabs = [
        { id: "infrastructure", label: "Infrastructure Monitor", icon: Server },
        { id: "secrets", label: "Secrets Vault", icon: Key },
        { id: "cicd", label: "CI/CD Pipeline", icon: Activity },
        { id: "backups", label: "Backups & PITR", icon: Database },
        { id: "incidents", label: "Incidents & Gates", icon: ShieldAlert },
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
                        <Server className="w-6 h-6 text-red-500" />
                        DevOps, Hosting &amp; CI/CD Console
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        System operations center. Monitor serverless hosting nodes, manage environment secrets, trigger manual backup operations, and run rollback validation simulators.
                    </p>
                </div>
                
                {p1Active ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold animate-pulse">
                        <ShieldAlert className="w-4 h-4 animate-bounce" /> Platform Down (P1 Severity)
                    </div>
                ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold">
                        <Check className="w-4 h-4" /> Uptime SLA Stable ({uptimePercentage}%)
                    </div>
                )}
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

            {/* ── Tab 1: Infrastructure Monitor ── */}
            {activeTab === "infrastructure" && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    {/* Traffic Load controller */}
                    <div className="glass-card rounded-2xl p-5 border border-border/60 flex flex-col justify-between lg:col-span-1">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                <Sliders className="w-4 h-4 text-orange-400" /> Traffic Load Simulator
                            </div>
                            <p className="text-[10px] text-slate-500 mb-4 leading-normal">
                                Slide to increase concurrent customer traffic and watch auto-scaling nodes spin up.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-400">Current Load:</span>
                                <span className="text-orange-400 font-bold font-mono">{trafficLoad}x Standard</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="8"
                                value={trafficLoad}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setTrafficLoad(val);
                                    addLog(`Traffic load simulator adjusted to: ${val}x. Load balancer forwarding updates.`);
                                }}
                                disabled={p1Active}
                                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                            <div className="flex justify-between text-[8px] text-slate-600 font-mono">
                                <span>1x (Idle)</span>
                                <span>4x (Peak)</span>
                                <span>8x (Stress)</span>
                            </div>
                        </div>
                    </div>

                    {/* System Gauges */}
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass-card rounded-2xl p-5 border border-border/60 flex items-start justify-between">
                            <div>
                                <div className="text-2xl font-black text-white mb-1 flex items-baseline gap-1">
                                    <span className={cpuUtilization > 85 ? "text-rose-400" : "text-white"}>{cpuUtilization}%</span>
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                    <Cpu className="w-3.5 h-3.5 text-violet-400" /> CPU Utilization
                                </div>
                                <p className="text-[10px] text-slate-500">
                                    {cpuUtilization > 80 ? "High Load. Warning." : "Standard server cluster load."}
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                <Activity className={`w-4 h-4 text-violet-400 ${p1Active ? "animate-ping text-rose-500" : ""}`} />
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-5 border border-border/60 flex items-start justify-between">
                            <div>
                                <div className="text-2xl font-black text-white mb-1">{activeNodes} / 20</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                    <Server className="w-3.5 h-3.5 text-emerald-400" /> Active Edge Nodes
                                </div>
                                <p className="text-[10px] text-slate-500">Auto-scaled serverless processes</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <Wifi className="w-4 h-4 text-emerald-400" />
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-5 border border-border/60 flex items-start justify-between">
                            <div>
                                <div className="text-2xl font-black text-white mb-1">{bandwidth} GB/s</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                    <HardDrive className="w-3.5 h-3.5 text-cyan-400" /> Bandwidth Throughput
                                </div>
                                <p className="text-[10px] text-slate-500">API payload networking capacity</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-cyan-400" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 2: Secrets Vault ── */}
            {activeTab === "secrets" && (
                <div className="glass-card rounded-2xl p-6 border border-border/60 max-w-3xl mx-auto flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Key className="w-4.5 h-4.5 text-violet-400" />
                                Vault Environment Secrets
                            </h3>
                            <button
                                onClick={() => setRevealSecrets(!revealSecrets)}
                                className="text-[10px] text-violet-400 hover:text-violet-300 font-semibold cursor-pointer"
                            >
                                {revealSecrets ? "Mask Keys" : "Reveal Keys"}
                            </button>
                        </div>
                        
                        {/* Env select tabs */}
                        <div className="flex bg-slate-950 p-1 border border-white/5 rounded-xl mb-4">
                            {(["development", "staging", "production"] as const).map((env) => (
                                <button
                                    key={env}
                                    onClick={() => {
                                        setActiveEnv(env);
                                        addLog(`Secrets profile context changed to: ${env.toUpperCase()}`);
                                    }}
                                    className={`flex-1 text-[10px] py-1.5 font-bold rounded-lg capitalize transition-all cursor-pointer ${
                                        activeEnv === env ? "bg-violet-600 text-white" : "text-slate-500 hover:text-white"
                                    }`}
                                >
                                    {env}
                                </button>
                            ))}
                        </div>

                        {/* Keys checklist */}
                        <div className="space-y-2.5">
                            {secrets[activeEnv].map((secret) => (
                                <div key={secret.key} className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 text-xs flex flex-col justify-between gap-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-slate-300 font-bold">{secret.key}</span>
                                        {secret.status === "Rotated" ? (
                                            <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">Rotated</span>
                                        ) : (
                                            <span className="text-[8px] bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded-full font-bold">Stable</span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between gap-4 mt-1">
                                        <span className="font-mono text-[10px] text-slate-500 truncate flex-1">
                                            {revealSecrets ? secret.value : "••••••••••••••••••••••••"}
                                        </span>
                                        <button
                                            onClick={() => handleRotateSecret(secret.key)}
                                            className="text-[9px] text-slate-400 hover:text-violet-400 flex items-center gap-0.5 shrink-0 transition-colors cursor-pointer"
                                        >
                                            <RefreshCw className="w-2.5 h-2.5" /> Rotate
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-900 mt-4 text-[9px] text-slate-500 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Credentials encrypted using AES-256-GCM.
                    </div>
                </div>
            )}

            {/* ── Tab 3: CI/CD Pipeline ── */}
            {activeTab === "cicd" && (
                <div className="glass-card rounded-2xl p-6 border border-border/60 max-w-4xl mx-auto flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Activity className="w-4.5 h-4.5 text-rose-400" />
                                Automated CI/CD Deployment Pipeline
                            </h3>
                            <div className="text-[10px] text-slate-400 font-mono">
                                History: <span className="text-white font-bold">{deploymentsCount} Runs</span> | Last: <span className="text-emerald-400 font-bold">{lastDeploymentStatus}</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-6">
                            Run automated commits verification. Checks formatting lints, unit testing coverage, high-risk security audits, and production bundling tags.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
                            {cicdSteps.map((step) => (
                                <div key={step.id} className={`p-3 rounded-xl border text-left flex flex-col justify-between h-[110px] ${
                                    step.status === "running" ? "bg-amber-500/10 border-amber-500 text-amber-400" :
                                    step.status === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                                    "bg-slate-900/60 border-white/5 text-slate-500"
                                }`}>
                                    <div>
                                        <div className="text-xs font-bold flex items-center justify-between">
                                            <span>{step.name}</span>
                                            {step.status === "running" && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                                            {step.status === "success" && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                                            {step.status === "idle" && <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />}
                                        </div>
                                        <p className="text-[9px] mt-1 text-slate-400 leading-normal">{step.description}</p>
                                    </div>
                                    <div className="text-[8px] font-mono uppercase tracking-wider">
                                        {step.status === "idle" && "Queue waiting"}
                                        {step.status === "running" && "Testing..."}
                                        {step.status === "success" && "Verification ok"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-900 mt-4 flex items-center justify-between gap-4">
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Info className="w-3.5 h-3.5" /> Pipeline pushes compiled output to Vercel/AWS staging clusters.
                        </span>
                        <button
                            disabled={cicdRunning || p1Active}
                            onClick={handleRunCICD}
                            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                                cicdRunning
                                    ? "bg-slate-900 text-slate-600 border border-white/5 cursor-not-allowed"
                                    : p1Active
                                    ? "bg-slate-900 text-slate-600 border border-white/5 cursor-not-allowed"
                                    : "bg-red-600 hover:bg-red-500 text-white cursor-pointer shadow-lg shadow-red-600/20"
                            }`}
                        >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            {cicdRunning ? "Deploying..." : "Trigger Deploy Run"}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Tab 4: Backups & PITR ── */}
            {activeTab === "backups" && (
                <div className="glass-card rounded-2xl p-6 border border-border/60 max-w-4xl mx-auto flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Database className="w-4.5 h-4.5 text-cyan-400" />
                                Database Backups &amp; PITR Restorer
                            </h3>
                            <button
                                disabled={p1Active}
                                onClick={handleTriggerBackup}
                                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/30 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                            >
                                <Database className="w-3 h-3 text-cyan-400" /> Trigger Manual Backup
                            </button>
                        </div>

                        {/* Recent backups table */}
                        <div className="overflow-x-auto mb-6">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 text-slate-500 font-semibold">
                                        <th className="pb-2">Backup Snapshot ID</th>
                                        <th className="pb-2">Creation Time</th>
                                        <th className="pb-2">Size</th>
                                        <th className="pb-2">Method</th>
                                        <th className="pb-2 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {backups.map((bk) => (
                                        <tr key={bk.id} className="border-b border-white/5 text-slate-300 hover:bg-white/1 font-mono text-[11px]">
                                            <td className="py-2.5 font-bold text-slate-200">{bk.id}</td>
                                            <td className="py-2.5">{bk.timestamp}</td>
                                            <td className="py-2.5">{bk.size}</td>
                                            <td className="py-2.5">{bk.type}</td>
                                            <td className="py-2.5 text-right">
                                                <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded-full">
                                                    ✓ {bk.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* PITR controls */}
                        <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5">
                            <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                                <Sliders className="w-4 h-4 text-cyan-400" /> Continuous Point-in-Time Recovery Engine
                            </h4>
                            <p className="text-[10px] text-slate-500 mb-4 leading-normal">
                                Replay Write-Ahead Logs (WAL) to restore database clusters to the precise second of choice.
                            </p>
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="flex-1">
                                    <label className="text-[9px] text-slate-500 block mb-1">Target Restoration Timestamp</label>
                                    <input
                                        type="datetime-local"
                                        value={pitrTime}
                                        onChange={(e) => setPitrTime(e.target.value)}
                                        disabled={restoring || p1Active}
                                        className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none w-full font-mono"
                                    />
                                </div>
                                <button
                                    disabled={restoring || p1Active}
                                    onClick={handlePITRRestore}
                                    className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shrink-0 transition-all ${
                                        restoring
                                            ? "bg-slate-900 text-slate-600 border border-white/5 cursor-not-allowed"
                                            : p1Active
                                            ? "bg-slate-900 text-slate-600 border border-white/5 cursor-not-allowed"
                                            : "bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer shadow-lg shadow-cyan-600/20"
                                    }`}
                                >
                                    {restoring ? "Restoring Logs..." : "Initiate PITR Restore"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-900 mt-4 text-[9px] text-slate-500">
                        Retention cycle: 30 days minimum. Automated cron triggers nightly at 02:00 UTC.
                    </div>
                </div>
            )}

            {/* ── Tab 5: Incidents & Gates ── */}
            {activeTab === "incidents" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Left: Incident Simulator & Revert Action */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        <ShieldAlert className="w-4.5 h-4.5 text-rose-500" />
                                        P1 Outage Incident Console
                                    </h3>
                                    <span className="text-[8px] bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded-full font-bold">EMERGENCY ONLY</span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                    Simulate platform outage scenarios. Triggers notification sirens, updates public status displays, pages engineers, and unlocks emergency tagged rollbacks.
                                </p>

                                {/* State indicator */}
                                <div className={`p-4 rounded-xl mb-4 border flex flex-col items-center justify-center text-center ${
                                    p1Active 
                                        ? "bg-rose-500/10 border-rose-500 text-rose-400 animate-pulse" 
                                        : "bg-slate-950 border-white/5 text-slate-500"
                                }`}>
                                    {p1Active ? (
                                        <>
                                            <AlertTriangle className="w-8 h-8 text-rose-400 mb-2 animate-bounce" />
                                            <span className="text-xs font-black uppercase tracking-wider">SYSTEM OUTAGE IN PROGRESS</span>
                                            <p className="text-[10px] text-rose-300/80 mt-1 max-w-[200px]">
                                                Services throwing HTTP 502/504. Users reporting auth lockouts.
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="w-8 h-8 text-emerald-500 mb-2" />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">All Systems Operational</span>
                                            <p className="text-[9px] text-slate-600 mt-1">
                                                Ping gates returned HTTP 200 OK.
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Diagnostic logs feed for P1 */}
                                {p1Active && (
                                    <div className="bg-slate-950 rounded-xl p-3 border border-white/5 mb-4">
                                        <span className="text-[9px] font-mono text-rose-400 font-bold block mb-1.5 uppercase">Emergency Feed</span>
                                        <div className="max-h-[120px] overflow-y-auto font-mono text-[9px] text-slate-400 space-y-1.5">
                                            {p1Logs.map((log, idx) => (
                                                <div key={idx} className="flex gap-1">
                                                    <span className="text-rose-500 shrink-0">➔</span>
                                                    <span>{log}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-slate-900 flex flex-col gap-2">
                                {p1Active ? (
                                    <div className="space-y-2">
                                        <label className="text-[9px] text-slate-500 block">Select rollback recovery snapshot</label>
                                        <select
                                            value={restoringBackupId}
                                            onChange={(e) => setRestoringBackupId(e.target.value)}
                                            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                                        >
                                            <option value="">-- Select Stable Backup Snapshot --</option>
                                            {backups.map(bk => (
                                                <option key={bk.id} value={bk.id}>{bk.id} ({bk.timestamp})</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={handleP1Recover}
                                            disabled={!restoringBackupId}
                                            className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                                                restoringBackupId 
                                                    ? "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-lg shadow-emerald-600/25" 
                                                    : "bg-slate-900 text-slate-600 border border-white/5 cursor-not-allowed"
                                            }`}
                                        >
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Trigger Revert &amp; Recover
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleTriggerP1}
                                        className="w-full py-2.5 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-500/20 hover:border-rose-500 text-rose-400 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <ShieldAlert className="w-4 h-4" /> Simulate P1 Platform Outage
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Part 12 Gates checklist */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4.5 h-4.5 text-emerald-400" /> Part 12 Deliverables
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                Toggle gates to mark DevOps definition milestones approved.
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
                                <span className="text-slate-400">Part 12 Completion</span>
                                <span className="text-emerald-400 font-bold">{doneDels}/5</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                                    style={{ width: `${(doneDels / deliverables.length) * 100}%` }} />
                            </div>
                            {doneDels === deliverables.length && (
                                <div className="pt-2 flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                    <CheckCircle className="w-4 h-4" /> Part 12 Complete — DevOps Strategy Active!
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
                        Live DevOps Operations &amp; Audit Logs
                    </h3>
                    <span className="text-[9px] text-slate-500 font-mono">active connection</span>
                </div>
                <div className="bg-slate-950 rounded-xl p-4 border border-white/5">
                    <div className="h-[140px] overflow-y-auto font-mono text-xs text-slate-400 space-y-2">
                        {devOpsLogs.map((log, idx) => (
                            <div key={idx} className="flex gap-1.5">
                                <span className="text-red-500 shrink-0">➔</span>
                                <span className={
                                    log.includes("COMPLETED") || log.includes("SUCCESS") ? "text-emerald-400" :
                                    log.includes("Vault token rotated") ? "text-violet-400" :
                                    log.includes("P1 ALERT") ? "text-rose-400 animate-pulse font-bold" :
                                    log.includes("PITR") ? "text-cyan-400" : ""
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
