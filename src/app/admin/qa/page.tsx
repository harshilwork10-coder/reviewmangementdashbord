"use client";

import { useState } from "react";
import {
    Shield, Check, X, AlertTriangle, Play, RefreshCw, Cpu, Activity,
    Smartphone, Tablet, Monitor, Info, CheckCircle, ChevronRight,
    Terminal, BarChart2, ShieldAlert, Zap, Server, Settings, FileText
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface CoverageMetric {
    name: string;
    value: number;
    target: number;
    color: string;
}

interface StagingDefect {
    id: string;
    title: string;
    module: string;
    severity: "critical" | "high" | "medium" | "low";
    status: "open" | "retesting" | "resolved";
    rca: string;
}

interface ToastMessage {
    id: string;
    type: "success" | "warning" | "error" | "info";
    text: string;
}

// ── Initial Coverage Metrics ──────────────────────────────────────────────
const initialCoverage: CoverageMetric[] = [
    { name: "Unit Test Coverage", value: 82, target: 80, color: "text-violet-400" },
    { name: "Integration Coverage", value: 90, target: 85, color: "text-cyan-400" },
    { name: "API Coverage", value: 88, target: 80, color: "text-emerald-400" },
    { name: "UI Coverage", value: 75, target: 75, color: "text-orange-400" },
];

// ── Defect Management Queue ────────────────────────────────────────────────
const initialDefects: StagingDefect[] = [
    { id: "bug_qa_1021", title: "Prorated credit refund logic double charging balance", module: "Stripe Billing", severity: "critical", status: "open", rca: "5 Whys analysis: Stripe webhook event parsed integer cents instead of decimals. Impacts billing sharding models." },
    { id: "bug_qa_4901", title: "Twilio outbound alphanumeric ID blocking SMS sends", module: "Campaign SMS", severity: "high", status: "open", rca: "Sender ID verification mismatch inside Twilio alphanumeric settings. Blocks UK recipients." },
    { id: "bug_qa_8830", title: "Location switch context dropdown locks during state transition", module: "Frontend Layout", severity: "medium", status: "resolved", rca: "Race condition in state caching. Hook triggered before context store hydrated." },
    { id: "bug_qa_9011", title: "Dashboard metrics sparkline colors do not match theme settings", module: "Dashboard Widgets", severity: "low", status: "resolved", rca: "Typo in Tailwind className background variables." }
];

export default function SuperAdminQaPage() {
    const [activeTab, setActiveTab] = useState<"strategy" | "sandbox" | "defects" | "release" | "deliverables">("strategy");

    // Dynamic states
    const [defects, setDefects] = useState<StagingDefect[]>(initialDefects);
    const [selectedDefect, setSelectedDefect] = useState<StagingDefect>(initialDefects[0]);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    // Simulator states
    const [simLogs, setSimLogs] = useState<string[]>([]);
    const [simulating, setSimulating] = useState<string | null>(null);
    const [emulatorDevice, setEmulatorDevice] = useState<"phone" | "tablet" | "desktop">("desktop");

    // Release Checklist gates state
    const [gates, setGates] = useState({
        qaApproved: false,
        securityVerified: false,
        billingVerified: false,
        integrationsWorking: false,
        noCriticalBugs: false,
        rollbackConfigured: false
    });
    const [releaseStatus, setReleaseStatus] = useState<"pending" | "approved">("pending");

    // Part 11 Gates checklist state
    const [deliverables, setDeliverables] = useState([
        { id: "qd1", label: "QA strategy approved", checked: true },
        { id: "qd2", label: "Test cases documented", checked: true },
        { id: "qd3", label: "Release checklist finalized", checked: true },
        { id: "qd4", label: "Defect process established", checked: true },
        { id: "qd5", label: "Launch quality gate approved", checked: false },
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

    // Run Staging Tests sandbox
    const runStagingTests = () => {
        setSimulating("staging_tests");
        setSimLogs(["[INIT] Spawning Jest unit & API test runner..."]);

        setTimeout(() => {
            setSimLogs(prev => [
                ...prev,
                " PASS  src/utils/format.spec.ts (65ms)",
                " PASS  src/hooks/useAuth.spec.ts (110ms)",
                " PASS  src/services/billing.spec.ts (240ms)"
            ]);
        }, 800);

        setTimeout(() => {
            setSimLogs(prev => [
                ...prev,
                " PASS  src/app/admin/security/security.spec.ts (310ms)",
                "[INTEGRATION] Pinging database migrations sharding routes...",
                " PASS  src/app/admin/database/database.spec.ts (450ms)"
            ]);
        }, 1800);

        setTimeout(() => {
            setSimLogs(prev => [
                ...prev,
                "Test Suites: 5 passed, 5 total",
                "Tests:       32 passed, 32 total",
                "Snapshots:   0 total",
                "Time:        2.8s",
                "[SUCCESS] Staging Unit & Integration suites complete (Zero failures)."
            ]);
            setSimulating(null);
            addToast("success", "Staging test suites compiled successfully.");
        }, 3000);
    };

    // Simulate API faults and retries
    const handleSimulateFault = (apiName: string) => {
        setSimulating(apiName);
        setSimLogs([`[SIMULATION START] Initiating ${apiName} connection fault...`]);

        setTimeout(() => {
            setSimLogs(prev => [...prev, "[RETRY 1] Connection timed out (504 Gateway). Retrying in 1s..."]);
            setTimeout(() => {
                setSimLogs(prev => [...prev, "[RETRY 2] Socket error (503 Service Unavailable). Backoff 2s..."]);
                setTimeout(() => {
                    setSimLogs(prev => [
                        ...prev,
                        `[SUCCESS 200] ${apiName} synchronized successfully after 2 retries (Response time: 480ms).`,
                        `[SIMULATION END] Fault recovery completed.`
                    ]);
                    setSimulating(null);
                    addToast("success", `${apiName} fault recovery verified!`);
                }, 2000);
            }, 1000);
        }, 800);
    };

    // Defect resolution simulator
    const resolveDefect = (id: string, title: string) => {
        setDefects(prev =>
            prev.map(d => {
                if (d.id === id) {
                    const nextStatus = d.status === "open" ? ("retesting" as const) : ("resolved" as const);
                    addToast("info", `Defect status: ${title} → ${nextStatus.toUpperCase()}`);
                    return { ...d, status: nextStatus };
                }
                return d;
            })
        );
    };

    const handleGateChange = (key: keyof typeof gates) => {
        setGates(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const allGatesPassed = Object.values(gates).every(val => val === true);

    const handleApproveRelease = () => {
        if (!allGatesPassed) return;
        setReleaseStatus("approved");
        addToast("success", "Release signed-off and approved for production.");
        setSimLogs(prev => [`[RELEASE SIGN-OFF] Production release approved by Super Admin at ${new Date().toLocaleTimeString()}`, ...prev]);
    };

    const tabs = [
        { id: "strategy", label: "Testing Strategy", icon: Cpu },
        { id: "sandbox", label: "Integration Sandbox", icon: Activity },
        { id: "defects", label: "Defect Management", icon: AlertTriangle },
        { id: "release", label: "Release Checklist", icon: Shield },
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
                        <Shield className="w-6 h-6 text-red-500" />
                        Quality Assurance & Testing
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Run test scripts, simulate connection faults, manage defect classifications, and verify production release gates.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
                        Staging Env Ready
                    </div>
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold">
                        Jest & Playwright suites
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

            {/* ── Testing Strategy Tab ── */}
            {activeTab === "strategy" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Coverage Indicators */}
                    <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-border/60 space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                <Cpu className="w-4.5 h-4.5 text-violet-400" /> Testing Code Coverage
                            </h3>
                            <p className="text-xs text-slate-400">CI/CD pipelines enforce strict statement coverage. Run the runner sandbox below.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {initialCoverage.map((c, i) => (
                                <div key={i} className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-2">
                                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                                        <span className="font-bold text-slate-200">{c.name}</span>
                                        <span className={`${c.color} font-bold`}>{c.value}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                                        <div style={{ width: `${c.value}%` }} className="h-full bg-gradient-to-r from-red-500 to-orange-500" />
                                    </div>
                                    <span className="text-[8px] text-slate-500 block font-mono">Target threshold: {c.target}%</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={runStagingTests}
                            disabled={simulating !== null}
                            className="w-full py-2 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                            {simulating === "staging_tests" ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                            {simulating === "staging_tests" ? "Executing Staging Test Suite..." : "Run Staging Tests Suite"}
                        </button>
                    </div>

                    {/* Console Logs */}
                    <div className="space-y-4">
                        <div className="glass-card rounded-2xl p-5 border border-border/60 h-full flex flex-col justify-between">
                            <div>
                                <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                                    <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Jest CLI Output
                                </h4>
                                <div className="bg-slate-950 rounded-xl border border-white/5 p-4 font-mono text-[9px] text-slate-400 space-y-1.5 min-h-[220px] max-h-[300px] overflow-y-auto">
                                    {simLogs.length === 0 ? (
                                        <div className="text-slate-600 italic">Trigger Staging Test Suite to run CLI validations.</div>
                                    ) : (
                                        simLogs.map((log, idx) => (
                                            <div key={idx} className={log.includes("PASS") ? "text-emerald-400" : log.includes("SUCCESS") ? "text-cyan-400" : log.includes("INTEGRATION") ? "text-violet-400" : ""}>{log}</div>
                                        ))
                                    )}
                                </div>
                            </div>
                            <div className="border-t border-white/5 pt-4 mt-4 text-[9px] text-slate-500 font-mono">
                                CI/CD trigger rule: git checkout production blocks unless tests pass.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Integration Sandbox Tab ── */}
            {activeTab === "sandbox" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Viewport Frame */}
                    <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-border/60 space-y-5">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-sm font-bold text-white">Device Spacing Emulator</h3>
                                <p className="text-[10px] text-slate-500 mt-0.5">Evaluate CSS spacing responsive rules across breakpoints.</p>
                            </div>
                            <div className="bg-slate-900 border border-white/10 rounded-xl p-1 flex gap-1">
                                {[
                                    { device: "phone", icon: Smartphone },
                                    { device: "tablet", icon: Tablet },
                                    { device: "desktop", icon: Monitor }
                                ].map((d) => {
                                    const Icon = d.icon;
                                    return (
                                        <button
                                            key={d.device}
                                            onClick={() => setEmulatorDevice(d.device as any)}
                                            className={`p-2 rounded-lg transition-all cursor-pointer ${
                                                emulatorDevice === d.device ? "bg-red-500/20 text-red-400" : "text-slate-500 hover:text-white"
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Simulated workspace frame */}
                        <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-6 flex justify-center">
                            <div
                                className="bg-slate-950 border border-white/10 rounded-xl overflow-hidden transition-all duration-300 flex flex-col"
                                style={{
                                    width: emulatorDevice === "phone" ? "320px" : emulatorDevice === "tablet" ? "640px" : "100%",
                                    height: "220px"
                                }}
                            >
                                <div className="bg-white/5 px-3 py-2 border-b border-white/10 text-[9px] text-slate-500 flex items-center justify-between font-mono">
                                    <span>Viewport: {emulatorDevice === "phone" ? "320px × 568px" : emulatorDevice === "tablet" ? "640px × 768px" : "100% × 1080px"}</span>
                                    <span className="text-emerald-400">Responsive OK</span>
                                </div>
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                        <span className="text-[10px] font-bold text-white">ReviewManagement Inbox</span>
                                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 my-2">
                                        <div className="p-2 rounded bg-white/5 text-[9px] text-slate-400">Reviews: <strong className="text-white">124</strong></div>
                                        <div className="p-2 rounded bg-white/5 text-[9px] text-slate-400">Rating: <strong className="text-white">4.8★</strong></div>
                                    </div>
                                    <div className="h-8 bg-violet-600 rounded flex items-center justify-center text-[10px] font-bold text-white">
                                        Action Button
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* API Fault Simulator */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <Activity className="w-4.5 h-4.5 text-cyan-400" /> API Fault Simulator
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                Simulate third-party API timeouts and retry backoff codes.
                            </p>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {[
                                    { name: "OpenAI GPT Replies", label: "OpenAI GPT" },
                                    { name: "Google GBP Listings", label: "Google GBP" },
                                    { name: "Stripe Webhooks Billing", label: "Stripe API" },
                                    { name: "Twilio SMS Dispatcher", label: "Twilio SMS" },
                                    { name: "Resend Email Dispatcher", label: "Resend Email" }
                                ].map((api) => (
                                    <button
                                        key={api.name}
                                        disabled={simulating !== null}
                                        onClick={() => handleSimulateFault(api.name)}
                                        className={`p-2 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between group cursor-pointer ${
                                            simulating === api.name
                                                ? "bg-amber-500/10 border-amber-500 text-amber-400"
                                                : "bg-slate-900 border-white/5 text-slate-300 hover:border-cyan-500/30 hover:bg-slate-800"
                                        }`}
                                    >
                                        <span>{api.label}</span>
                                        {simulating === api.name ? (
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                                        ) : (
                                            <Play className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Simulation logs */}
                        <div className="bg-slate-950 rounded-xl p-3 border border-white/5">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2 font-mono">Sandbox Logs</span>
                            <div className="h-[90px] overflow-y-auto font-mono text-[9px] text-slate-400 space-y-1.5">
                                {simLogs.map((log, idx) => (
                                    <div key={idx} className="flex gap-1">
                                        <span className="text-cyan-600 shrink-0">➔</span>
                                        <span className={log.includes("SUCCESS") ? "text-emerald-400" : log.includes("RETRY") ? "text-amber-400" : ""}>{log}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Defect Management Tab ── */}
            {activeTab === "defects" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Defect list */}
                    <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-border/60 space-y-4">
                        <div className="mb-2">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <ShieldAlert className="w-4.5 h-4.5 text-red-500" /> Staging Defect Registry
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Track severity classifications and execute retests. Click a defect to load its Root Cause Analysis (RCA).
                            </p>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/60">
                            <table className="w-full text-[11px] text-slate-300">
                                <thead>
                                    <tr className="bg-slate-950 border-b border-white/5 text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                                        <th className="text-left p-3">ID / Defect Title</th>
                                        <th className="text-left p-3">Module</th>
                                        <th className="text-center p-3">Severity</th>
                                        <th className="text-center p-3">Status</th>
                                        <th className="text-center p-3">Retest Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {defects.map(def => (
                                        <tr key={def.id} onClick={() => setSelectedDefect(def)}
                                            className={`hover:bg-slate-900/30 transition-colors cursor-pointer ${
                                                selectedDefect.id === def.id ? "bg-red-500/5" : ""
                                            }`}>
                                            <td className="p-3">
                                                <div className="font-bold text-slate-200">{def.title}</div>
                                                <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">{def.id}</span>
                                            </td>
                                            <td className="p-3 text-slate-400 font-mono text-[10px]">{def.module}</td>
                                            <td className="p-3 text-center">
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                                    def.severity === "critical" ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse" :
                                                    def.severity === "high" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                                                    "bg-slate-800 text-slate-400"
                                                }`}>
                                                    {def.severity}
                                                </span>
                                            </td>
                                            <td className="p-3 text-center font-mono">
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                                    def.status === "resolved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                                    def.status === "retesting" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                                                    "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                                }`}>
                                                    {def.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        resolveDefect(def.id, def.title);
                                                    }}
                                                    className="px-2.5 py-1 bg-white/5 border border-white/5 hover:border-white/10 rounded-lg text-[9px] font-bold cursor-pointer"
                                                >
                                                    {def.status === "open" ? "Test Hotfix" : def.status === "retesting" ? "Mark Done" : "Reopen"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* RCA Panel */}
                    <div className="glass-card rounded-2xl p-5 border border-border/60 flex flex-col justify-between">
                        <div>
                            <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-violet-400" /> Root Cause Analysis (RCA)
                            </h4>
                            <div className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-3">
                                <div>
                                    <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wide">Selected Defect</span>
                                    <strong className="text-[11px] text-slate-200 block mt-0.5">{selectedDefect.id}: {selectedDefect.title}</strong>
                                </div>
                                <div className="border-t border-white/5 pt-3">
                                    <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wide">Root Cause & Remediation</span>
                                    <p className="text-[10px] text-slate-400 leading-relaxed mt-1 font-mono">{selectedDefect.rca}</p>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-900 mt-4 text-[9px] text-slate-500">
                            RCA process: timeline document → 5 Whys check → regression unit test code.
                        </div>
                    </div>
                </div>
            )}

            {/* ── Release Checklist Tab ── */}
            {activeTab === "release" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Checklist gates */}
                    <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                                <CheckCircle className="w-4.5 h-4.5 text-emerald-400" /> Production Release Gates
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { key: "qaApproved", label: "Staging QA approved checks complete" },
                                    { key: "securityVerified", label: "Security token audit verification ok" },
                                    { key: "billingVerified", label: "Stripe webhook payment failure test ok" },
                                    { key: "integrationsWorking", label: "GBP, OpenAI, Twilio status verified" },
                                    { key: "noCriticalBugs", label: "Zero open severity blocker bugs" },
                                    { key: "rollbackConfigured", label: "Rollback template script verified" }
                                ].map((gate) => {
                                    const k = gate.key as keyof typeof gates;
                                    return (
                                        <button
                                            key={k}
                                            onClick={() => handleGateChange(k)}
                                            className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                                                gates[k]
                                                    ? "bg-emerald-500/10 border-emerald-500/30 text-white"
                                                    : "bg-slate-900 border-white/5 text-slate-500 hover:border-white/10"
                                            }`}
                                        >
                                            <span>{gate.label}</span>
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                                gates[k] ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-800 bg-slate-950"
                                            }`}>
                                                {gates[k] && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-900 mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="text-xs text-slate-500 flex items-center gap-1.5">
                                <Info className="w-4 h-4" />
                                {allGatesPassed ? (
                                    <span className="text-emerald-400 font-semibold">All release gates passed. Approved for deploy.</span>
                                ) : (
                                    <span>Check all gates to unlock production deployment.</span>
                                )}
                            </div>

                            {releaseStatus === "approved" ? (
                                <span className="px-6 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold text-xs">
                                    Release Sign-off Approved
                                </span>
                            ) : (
                                <button
                                    disabled={!allGatesPassed}
                                    onClick={handleApproveRelease}
                                    className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                                        allGatesPassed
                                            ? "bg-red-600 hover:bg-red-500 text-white cursor-pointer shadow-lg shadow-red-600/25 active:scale-95"
                                            : "bg-slate-900 text-slate-600 border border-white/5 cursor-not-allowed"
                                    }`}
                                >
                                    Approve Production Release
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Git Rollback target */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-bold text-white">Git Rollback Target</h3>
                                <span className="text-[9px] text-slate-500 font-mono">active tag</span>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-[10px] text-slate-500 block">Production Stable Tag</span>
                                    <span className="text-xs font-mono text-white block mt-0.5 font-bold">v1.4.2-stable</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-500 block">Rollback Command</span>
                                    <pre className="bg-slate-950 p-2.5 rounded border border-white/5 font-mono text-[9px] text-rose-400 block mt-1 overflow-x-auto">
                                        git checkout v1.4.2-stable
                                    </pre>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-900 mt-4 text-[9px] text-slate-500">
                            Rollback strategy: git tag checkout + DB migrate rollback trigger.
                        </div>
                    </div>
                </div>
            )}

            {/* ── Part 11 Gates Checklist Tab ── */}
            {activeTab === "deliverables" && (
                <div className="max-w-2xl mx-auto">
                    <div className="glass-card rounded-2xl p-8 border border-border/60">
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4.5 h-4.5 text-emerald-400" /> Part 11 Deliverables Gates
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-8">
                            Toggle individual QA & testing milestones checklist.
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
                                <span className="text-slate-400">Part 11 Completion progress</span>
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
                                    <CheckCircle className="w-4 h-4" /> Part 11 Complete — QA Strategy Ready for Deploys!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
