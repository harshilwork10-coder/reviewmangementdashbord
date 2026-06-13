"use client";

import { useState } from "react";
import {
    Target, Check, X, Lock, FileText, ChevronRight, Terminal, Info, Play,
    Sliders, CheckCircle2, ArrowRight, UserCheck, Smartphone, Cpu, Award,
    Database, Mail, MessageSquare, Download, Calendar, Layers, ShieldCheck
} from "lucide-react";

interface MustHaveFeature {
    id: string;
    name: string;
    description: string;
    week: string;
    checked: boolean;
}

interface OutOfScopeFeature {
    name: string;
    description: string;
    targetPhase: string;
}

interface UserFlowStep {
    step: number;
    title: string;
    description: string;
    mockView: string;
}

interface BacklogTicket {
    key: string;
    summary: string;
    type: "Story" | "Task";
    estimate: number;
    priority: "Critical" | "High" | "Medium";
}

export default function SuperAdminPrdPage() {
    // Audit logs
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => {
        const time = new Date().toLocaleTimeString();
        setLogs(prev => [`[${time}] ${msg}`, ...prev]);
    };

    // Must-have features state
    const [mustHaves, setMustHaves] = useState<MustHaveFeature[]>([
        { id: "1", name: "User Authentication", description: "Secure login, signup, role checking", week: "W1-2", checked: true },
        { id: "2", name: "Business Profile Setup", description: "Wizard for name, industry, logo upload", week: "W3-4", checked: true },
        { id: "3", name: "Google Review Request Links", description: "Generates quick review redirects", week: "W3-4", checked: true },
        { id: "4", name: "Email Review Requests", description: "Resend email templates dispatcher", week: "W5-6", checked: true },
        { id: "5", name: "SMS Review Requests", description: "Twilio integration SMS campaign dispatch", week: "W5-6", checked: true },
        { id: "6", name: "Review Monitoring Dashboard", description: "Aggregated reviews feed component", week: "W7-8", checked: true },
        { id: "7", name: "Basic PDF Reporting", description: "Monthly analytics reports exporter", week: "W9-10", checked: false },
        { id: "8", name: "Agency Multi-Client View", description: "Context switcher dropdown menu", week: "W9-10", checked: true },
    ]);

    // Out-of-scope list
    const outOfScopes: OutOfScopeFeature[] = [
        { name: "AI Review Responses", description: "Tone configuration replies editor", targetPhase: "60-Day Roadmap" },
        { name: "Advanced Sentiment Analysis", description: "Keyword sentiment tagging algorithms", targetPhase: "90-Day Roadmap" },
        { name: "Custom CRM Integrations", description: "Webhooks for Salesforce and HubSpot workflows", targetPhase: "90-Day Roadmap" },
        { name: "White-Label Portals", description: "Custom domains branding for agency clients", targetPhase: "Phase 2" },
        { name: "Advanced Cohort Analytics", description: "User retention cohorts and MRR reports", targetPhase: "Phase 3" },
    ];

    // User Flow Emulator State
    const [activeFlowStep, setActiveFlowStep] = useState<number>(1);
    
    const userFlowSteps: UserFlowStep[] = [
        { step: 1, title: "1. Sign Up", description: "User creates an account and picks a recurring subscription tier.", mockView: "signup" },
        { step: 2, title: "2. Create Profile", description: "User sets up organization details, contact info, and uploads brand logo.", mockView: "profile" },
        { step: 3, title: "3. Link Platforms", description: "User enters Google Business parameters to link reviews syncing.", mockView: "platforms" },
        { step: 4, title: "4. Send Requests", description: "User triggers SMS/Email invitation campaigns to client lists.", mockView: "requests" },
        { step: 5, title: "5. Monitor Inbox", description: "User reviews consolidated feedback stars, sources, and review texts.", mockView: "monitor" },
        { step: 6, title: "6. Export Reports", description: "User downloads 30-day review growth PDF overview metrics.", mockView: "reports" },
    ];

    // Timeline Week selector state
    const [selectedTimelineWeek, setSelectedTimelineWeek] = useState<string>("W9-10");

    const timelineMilestones = [
        { key: "W1-2", label: "Weeks 1–2", task: "Database & Authentication", details: "Implement PostgreSQL relational schemas, row-level tenant isolation parameters, user registration, JWT login routes, and role verification gates.", status: "Completed" },
        { key: "W3-4", label: "Weeks 3–4", task: "Business Profiles", details: "Develop profile setup onboarding wizard, brand logo asset uploads, object storage, and Google review platform integration redirects.", status: "Completed" },
        { key: "W5-6", label: "Weeks 5–6", task: "Review Requests", details: "Integrate Resend email API, Twilio SMS gateway, and custom SMS template editor. Setup dispatcher queues.", status: "Completed" },
        { key: "W7-8", label: "Weeks 7–8", task: "Dashboard Inbox", details: "Build consolidated reviews feed inbox page, source badge components (Google, Yelp), sorting filters, and average ratings meters.", status: "Completed" },
        { key: "W9-10", label: "Weeks 9–10", task: "Stripe Billing & PDF Reports", details: "Integrate Stripe recurring checkout webhooks, annual billing modifiers, and develop PDF report rendering layouts.", status: "In Progress" },
        { key: "W11-12", label: "Weeks 11–12", task: "QA & Launch Release", details: "Perform vulnerability audits, penetration logs audits, load testing, compile bundle validations, and execute production smoke testing.", status: "Scheduled" }
    ];

    // Jira Backlog Tickets state
    const backlogTickets: BacklogTicket[] = [
        { key: "RM-MVP-01", summary: "Setup PostgreSQL schemas, tenant tables and RLS isolation parameters", type: "Task", estimate: 5, priority: "Critical" },
        { key: "RM-MVP-02", summary: "Implement NextJS auth check middleware, registration and login UI forms", type: "Story", estimate: 3, priority: "Critical" },
        { key: "RM-MVP-03", summary: "Build business profile onboarding wizard and upload logos APIs", type: "Story", estimate: 3, priority: "High" },
        { key: "RM-MVP-04", summary: "Integrate Google Business Profile review sync redirect links creator", type: "Story", estimate: 3, priority: "High" },
        { key: "RM-MVP-05", summary: "Connect Resend API and Twilio SMS review requests dispatchers", type: "Task", estimate: 5, priority: "Critical" },
        { key: "RM-MVP-06", summary: "Create unified reviews monitoring feed page layout", type: "Story", estimate: 5, priority: "High" },
        { key: "RM-MVP-07", summary: "Integrate Stripe subscription tiers, checkout session and webhooks", type: "Task", estimate: 5, priority: "Critical" },
        { key: "RM-MVP-08", summary: "Generate 30-day feedback metrics and export PDF reports", type: "Story", estimate: 3, priority: "Medium" }
    ];

    // Calculations
    const totalMustHaves = mustHaves.length;
    const completedMustHaves = mustHaves.filter(m => m.checked).length;
    const scopeCompletionRatio = Math.round((completedMustHaves / totalMustHaves) * 100);

    const toggleFeature = (id: string) => {
        setMustHaves(prev => prev.map(m => {
            if (m.id === id) {
                const nextChecked = !m.checked;
                addLog(`MVP Scope checklist updated: [${m.name}] marked as ${nextChecked ? "COMPLETED" : "INCOMPLETE"}.`);
                return { ...m, checked: nextChecked };
            }
            return m;
        }));
    };

    const handleFlowStepClick = (stepNum: number) => {
        setActiveFlowStep(stepNum);
        addLog(`User Flow Emulator: Displaying Step ${stepNum} (${userFlowSteps[stepNum - 1].title}).`);
    };

    const handleExportBacklog = () => {
        addLog("Jira Backlog Exporter triggered. Compiled 8 standard MVP backlog tickets to CSV.");
        alert("Success: Backlog exported. CSV generated with RM-MVP-01 to RM-MVP-08 metadata.");
    };

    return (
        <div className="h-screen overflow-y-auto p-8 font-sans">
            
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Target className="w-6 h-6 text-red-500" />
                        MVP Scope &amp; Product Requirements (PRD)
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        MVP definitions console. Manage target features scope boundaries, preview user flows in the interactive emulator, track the 12-week Gantt schedule, and download the development backlog.
                    </p>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> MVP Scope: Frozen
                </div>
            </div>

            {/* MVP Completion Gauge & Key success metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                
                {/* Onboarding Speed Dial */}
                <div className="glass-card rounded-2xl p-5 border border-border/60 flex flex-col justify-between">
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                            <Layers className="w-4 h-4 text-violet-400" /> Scope Launch Readiness
                        </div>
                        <p className="text-[10px] text-slate-500 mb-4">
                            Must-have MVP feature checklist completion score.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-baseline">
                            <span className="text-2xl font-black text-white">{completedMustHaves} / {totalMustHaves}</span>
                            <span className="text-xs text-violet-400 font-bold font-mono">{scopeCompletionRatio}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all duration-500"
                                style={{ width: `${scopeCompletionRatio}%` }}
                            />
                        </div>
                        <div className="text-[8px] text-slate-500 uppercase tracking-wider font-mono">
                            Must-have launch gates passed
                        </div>
                    </div>
                </div>

                {/* KPI Dials */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-card rounded-2xl p-5 border border-border/60 flex items-start justify-between">
                        <div>
                            <div className="text-2xl font-black text-white mb-1">4.2 mins</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Onboarding Speed
                            </div>
                            <p className="text-[10px] text-slate-500">Target limit: &lt; 15 minutes setup</p>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 animate-pulse" />
                    </div>

                    <div className="glass-card rounded-2xl p-5 border border-border/60 flex items-start justify-between">
                        <div>
                            <div className="text-2xl font-black text-white mb-1">124 active</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                <Smartphone className="w-3.5 h-3.5 text-cyan-400" /> Active Campaigns
                            </div>
                            <p className="text-[10px] text-slate-500">Email Resend &amp; SMS Twilio queues active</p>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-cyan-400 mt-1.5" />
                    </div>

                    <div className="glass-card rounded-2xl p-5 border border-border/60 flex items-start justify-between">
                        <div>
                            <div className="text-2xl font-black text-white mb-1">8 / 10</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-orange-400" /> Paying Customers
                            </div>
                            <p className="text-[10px] text-slate-500">Target Phase 1 milestone progress</p>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-orange-400 mt-1.5 animate-pulse" />
                    </div>
                </div>

            </div>

            {/* Scope Tracker Matrix: Must-Have vs Out-of-Scope */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                
                {/* Must-Have Feature Checklist */}
                <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                            Must-Have Features Checklist (In Scope)
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-5">
                            Core components required for MVP deployment. Select items to simulate completed milestones.
                        </p>

                        <div className="space-y-2.5">
                            {mustHaves.map((feature) => (
                                <button
                                    key={feature.id}
                                    onClick={() => toggleFeature(feature.id)}
                                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between w-full cursor-pointer ${
                                        feature.checked 
                                            ? "bg-emerald-500/10 border-emerald-500/30 text-white" 
                                            : "bg-slate-900 border-white/5 text-slate-500 hover:border-white/10"
                                    }`}
                                >
                                    <div className="flex flex-col gap-0.5 max-w-[80%]">
                                        <span className="font-bold flex items-center gap-1">
                                            {feature.name}
                                            <span className="text-[8px] bg-slate-950 px-1 py-0.2 rounded font-mono border border-white/5 text-slate-500">
                                                {feature.week}
                                            </span>
                                        </span>
                                        <p className="text-[9px] text-slate-400 leading-normal">{feature.description}</p>
                                    </div>
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                        feature.checked ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-800 bg-slate-950"
                                    }`}>
                                        {feature.checked && <Check className="w-3 h-3" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-900 mt-4 text-[9px] text-slate-500">
                        Scope frozen to comply with 90-day time-to-market.
                    </div>
                </div>

                {/* Not Included in MVP (Out of Scope) */}
                <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <Lock className="w-4.5 h-4.5 text-rose-400" />
                            Not Included in MVP (Out of Scope)
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-5">
                            Features locked out of the initial release to protect velocity.
                        </p>

                        <div className="space-y-2.5">
                            {outOfScopes.map((feature, idx) => (
                                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between text-xs opacity-75">
                                    <div className="max-w-[75%]">
                                        <span className="text-slate-400 font-bold block flex items-center gap-1">
                                            {feature.name}
                                            <Lock className="w-3 h-3 text-rose-500" />
                                        </span>
                                        <p className="text-[9px] text-slate-500 mt-0.5 leading-normal">{feature.description}</p>
                                    </div>
                                    <span className="text-[8px] bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 font-mono">
                                        {feature.targetPhase}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-900 mt-4 text-[9px] text-slate-500 flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-slate-500" /> Map out-of-scope tasks in the backlog to track future phases.
                    </div>
                </div>

            </div>

            {/* Interactive User Flow Emulator */}
            <div className="glass-card rounded-2xl p-6 border border-border/60 mb-8">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h3 className="text-sm font-bold text-white">MVP Interactive Onboarding &amp; User Flow Emulator</h3>
                        <p className="text-[10px] text-slate-500 mt-0.5">Click user journey steps below to trigger mock view simulations.</p>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono">MVP Flow Nodes</span>
                </div>

                {/* Nodes selector */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6">
                    {userFlowSteps.map((step) => (
                        <button
                            key={step.step}
                            onClick={() => handleFlowStepClick(step.step)}
                            className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                                activeFlowStep === step.step 
                                    ? "bg-red-500/20 border-red-500 text-red-400" 
                                    : "bg-slate-900 border-white/5 text-slate-400 hover:border-white/10"
                            }`}
                        >
                            <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-mono mb-0.5">Step 0{step.step}</span>
                            <span className="truncate block">{step.title}</span>
                        </button>
                    ))}
                </div>

                {/* Simulated emulator viewport */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Viewport emulator frame */}
                    <div className="lg:col-span-2 bg-slate-950 border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[280px]">
                        <div className="bg-white/5 px-3 py-2 border-b border-white/10 text-[9px] text-slate-500 flex items-center justify-between font-mono">
                            <span>Mock UI Viewport: {userFlowSteps[activeFlowStep - 1].title}</span>
                            <span className="text-red-500 font-bold">MVP Simulation Mode</span>
                        </div>
                        
                        {/* Mock App layout content based on step */}
                        <div className="p-6 flex-1 flex flex-col justify-between overflow-y-auto">
                            {activeFlowStep === 1 && (
                                <div className="space-y-3">
                                    <div className="text-sm font-bold text-white">Create your ReviewHub Account</div>
                                    <div className="grid grid-cols-2 gap-3 text-[10px]">
                                        <div className="p-2 bg-white/3 rounded border border-white/5">Name: <strong className="text-white">John Doe</strong></div>
                                        <div className="p-2 bg-white/3 rounded border border-white/5">Email: <strong className="text-white">john@localbiz.com</strong></div>
                                    </div>
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-slate-300">
                                        Selected Plan: <strong>Growth Plan ($79/month)</strong>. Direct redirecting to Stripe payment secure link...
                                    </div>
                                </div>
                            )}

                            {activeFlowStep === 2 && (
                                <div className="space-y-3">
                                    <div className="text-sm font-bold text-white">Business Profile Wizard</div>
                                    <div className="space-y-2 text-[10px]">
                                        <div className="p-2 bg-white/3 rounded border border-white/5">Organization Name: <strong className="text-white">Metro Dental Clinic</strong></div>
                                        <div className="p-2 bg-white/3 rounded border border-white/5">Industry: <strong className="text-white">Healthcare &amp; Dental</strong></div>
                                        <div className="p-2 bg-white/3 rounded border border-white/5">Primary Contact Phone: <strong className="text-white">+1 (555) 482-1920</strong></div>
                                    </div>
                                </div>
                            )}

                            {activeFlowStep === 3 && (
                                <div className="space-y-3">
                                    <div className="text-sm font-bold text-white">Link Google Business Profile</div>
                                    <p className="text-[10px] text-slate-400">Connect endpoints to fetch Google reviews inbox feed.</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value="https://g.page/r/metro-dental-clinic/review"
                                            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-300 font-mono flex-1 focus:outline-none"
                                        />
                                        <button className="px-3 bg-emerald-600 rounded-lg text-[10px] font-bold text-white flex items-center gap-1">
                                            <ShieldCheck className="w-3.5 h-3.5" /> Linked
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeFlowStep === 4 && (
                                <div className="space-y-3">
                                    <div className="text-sm font-bold text-white">Trigger Request Campaign</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-white/3 rounded-xl border border-white/5 text-[10px]">
                                            <div className="font-bold flex items-center gap-1 text-violet-400 mb-1">
                                                <Mail className="w-3.5 h-3.5" /> Email requests (Resend)
                                            </div>
                                            <span>Format: HTML campaign templates</span>
                                        </div>
                                        <div className="p-3 bg-white/3 rounded-xl border border-white/5 text-[10px]">
                                            <div className="font-bold flex items-center gap-1 text-cyan-400 mb-1">
                                                <MessageSquare className="w-3.5 h-3.5" /> SMS requests (Twilio)
                                            </div>
                                            <span>Format: SMS quick links</span>
                                        </div>
                                    </div>
                                    <div className="h-8 bg-red-600 hover:bg-red-500 rounded flex items-center justify-center text-[10px] font-bold text-white cursor-pointer transition-colors">
                                        Dispatch to 42 Contacts
                                    </div>
                                </div>
                            )}

                            {activeFlowStep === 5 && (
                                <div className="space-y-2">
                                    <div className="text-sm font-bold text-white pb-1 border-b border-white/5">Review Monitoring Inbox</div>
                                    <div className="p-2.5 rounded bg-white/3 border border-white/5 text-[9px] flex justify-between items-start">
                                        <div>
                                            <span className="font-bold text-white block">Dr. Sarah Adams is fantastic!</span>
                                            <span className="text-slate-500 block mt-0.5 font-mono">Google Business Profile | 5 Stars</span>
                                        </div>
                                        <span className="text-[8px] bg-slate-900 text-slate-500 px-1 py-0.2 rounded font-mono">10 mins ago</span>
                                    </div>
                                </div>
                            )}

                            {activeFlowStep === 6 && (
                                <div className="space-y-3">
                                    <div className="text-sm font-bold text-white">Export 30-Day Metrics</div>
                                    <p className="text-[10px] text-slate-400">Generate basic reputation reports summarizing ratings volume changes.</p>
                                    <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-red-500/30 rounded-lg text-[10px] font-bold text-white flex items-center gap-1 cursor-pointer transition-all">
                                        <Download className="w-3.5 h-3.5 text-red-500" /> Export PDF Report
                                    </button>
                                </div>
                            )}

                            {/* Viewport footer description */}
                            <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500">
                                {userFlowSteps[activeFlowStep - 1].description}
                            </div>
                        </div>
                    </div>

                    {/* Emulator actions logs */}
                    <div className="bg-slate-950 border border-white/10 rounded-2xl p-4 flex flex-col justify-between h-[280px]">
                        <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 font-mono flex items-center gap-1">
                                <Terminal className="w-4 h-4 text-red-500" /> Emulator Action Logs
                            </span>
                            <div className="h-[200px] overflow-y-auto font-mono text-[10px] text-slate-400 space-y-1.5 pr-0.5">
                                {logs.map((log, idx) => (
                                    <div key={idx} className="flex gap-1">
                                        <span className="text-red-600 shrink-0">➔</span>
                                        <span className={log.includes("COMPLETED") ? "text-emerald-400" : log.includes("User Flow") ? "text-cyan-400" : ""}>{log}</span>
                                    </div>
                                ))}
                                {logs.length === 0 && (
                                    <div className="text-slate-700 py-12 text-center">Click nodes or check features above to generate simulation log entries.</div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* 12-Week Launch Timeline Gantt Chart */}
            <div className="glass-card rounded-2xl p-6 border border-border/60 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Calendar className="w-4.5 h-4.5 text-violet-400" />
                        12-Week Product Development &amp; Launch Timeline
                    </h3>
                    <span className="text-[9px] text-slate-500 font-mono">click week blocks to view milestone scopes</span>
                </div>

                {/* Gantt columns */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6">
                    {timelineMilestones.map((week) => (
                        <button
                            key={week.key}
                            onClick={() => {
                                setSelectedTimelineWeek(week.key);
                                addLog(`Timeline context: Switched to ${week.label} (${week.task}).`);
                            }}
                            className={`p-3 rounded-xl border text-left flex flex-col justify-between h-[120px] transition-all cursor-pointer ${
                                selectedTimelineWeek === week.key 
                                    ? "bg-violet-600/10 border-violet-500 text-violet-400" 
                                    : "bg-slate-900 border-white/5 text-slate-400 hover:border-white/10"
                            }`}
                        >
                            <div>
                                <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-mono">{week.label}</span>
                                <span className="text-xs font-bold text-white block mt-0.5 truncate w-full">{week.task}</span>
                            </div>
                            <div className="flex items-center justify-between w-full mt-2">
                                <span className={`text-[8px] px-1.5 py-0.2 rounded font-bold font-mono ${
                                    week.status === "Completed" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/10" :
                                    week.status === "In Progress" ? "bg-amber-500/20 text-amber-400 border border-amber-500/10 animate-pulse" :
                                    "bg-slate-950 text-slate-600 border border-white/5"
                                }`}>
                                    {week.status}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Milestone Detail Card */}
                {selectedTimelineWeek && (
                    <div className="p-4 bg-slate-950/80 border border-white/5 rounded-xl text-xs flex gap-3 items-start">
                        <Info className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold text-slate-200 block mb-1">
                                {timelineMilestones.find(w => w.key === selectedTimelineWeek)?.label} Deliverable:{" "}
                                <strong className="text-violet-400">
                                    {timelineMilestones.find(w => w.key === selectedTimelineWeek)?.task}
                                </strong>
                            </span>
                            <p className="text-slate-400 leading-relaxed">
                                {timelineMilestones.find(w => w.key === selectedTimelineWeek)?.details}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Jira Backlog Exporter Table */}
            <div className="glass-card rounded-2xl p-6 border border-border/60">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Layers className="w-4.5 h-4.5 text-cyan-400" />
                        Jira Backlog Exporter (Standard RM-MVP Tickets)
                    </h3>
                    <button
                        onClick={handleExportBacklog}
                        className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/30 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                        <Download className="w-3.5 h-3.5 text-cyan-400" /> Export Backlog CSV
                    </button>
                </div>

                {/* Tickets Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-slate-500 font-semibold font-mono">
                                <th className="pb-2">Jira Key</th>
                                <th className="pb-2">Requirement summary</th>
                                <th className="pb-2">Issue Type</th>
                                <th className="pb-2">Priority</th>
                                <th className="pb-2 text-right">Story Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {backlogTickets.map((bk) => (
                                <tr key={bk.key} className="border-b border-white/5 text-slate-300 hover:bg-white/1 font-mono text-[11px]">
                                    <td className="py-2.5 font-bold text-slate-200">{bk.key}</td>
                                    <td className="py-2.5 text-slate-300">{bk.summary}</td>
                                    <td className="py-2.5">
                                        <span className={bk.type === "Story" ? "text-emerald-400" : "text-cyan-400"}>
                                            {bk.type}
                                        </span>
                                    </td>
                                    <td className="py-2.5">
                                        <span className={`text-[9px] px-1.5 py-0.2 rounded border ${
                                            bk.priority === "Critical" ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
                                            bk.priority === "High" ? "bg-orange-500/10 border-orange-500/20 text-orange-400" :
                                            "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                                        }`}>
                                            {bk.priority}
                                        </span>
                                    </td>
                                    <td className="py-2.5 text-right font-bold text-slate-200">{bk.estimate} SP</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
