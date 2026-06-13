"use client";

import { useState, useEffect } from "react";
import {
    Calendar, ListTodo, Users, TrendingUp, DollarSign, CheckSquare, Plus,
    Activity, Clock, User, Check, X, ShieldAlert, Award, FileText, CheckCircle2,
    Briefcase, Sparkles, Filter, ChevronRight, CornerDownRight, Play, Info
} from "lucide-react";

interface JiraTicket {
    key: string;
    type: "Story" | "Task" | "Bug" | "Improvement" | "Support";
    summary: string;
    epic: string;
    priority: "Critical" | "High" | "Medium" | "Low";
    estimate: number;
    owner: string;
    status: "Backlog" | "Ready" | "In Progress" | "QA" | "Done" | "Released";
    businessValue?: string;
    dependencies?: string;
    dueDate?: string;
}

interface RoadmapItem {
    id: string;
    horizon: "30-Day" | "60-Day" | "90-Day" | "12-Month";
    title: string;
    description: string;
    status: "Scheduled" | "In Progress" | "Completed";
}

export default function SuperAdminProductPage() {
    // Audit log
    const [logs, setLogs] = useState<string[]>([
        "[INFO] Product Execution Board initialized.",
        "[INFO] Active Sprint: Sprint 14 (RM-S14) - Core Stability. Target velocity: 40 Story Points.",
        "[AUDIT] Epics RM-EPIC-1 to RM-EPIC-10 mapped successfully to Jira RM project key."
    ]);

    const addLog = (msg: string) => {
        const time = new Date().toLocaleTimeString();
        setLogs(prev => [`[${time}] ${msg}`, ...prev]);
    };

    // Sprint Tickets State
    const [tickets, setTickets] = useState<JiraTicket[]>([
        { key: "RM-101", type: "Story", summary: "As a Super Admin, I want to enforce MFA, so that platform secrets are protected.", epic: "Authentication & Security", priority: "Critical", estimate: 5, owner: "Tech Lead", status: "Done", businessValue: "Revenue protection and security compliance" },
        { key: "RM-102", type: "Story", summary: "As a Business Owner, I want to sync Google reviews, so that I can see them in my dashboard.", epic: "Review Monitoring", priority: "High", estimate: 8, owner: "Backend Dev", status: "In Progress", businessValue: "Core review ingestion stability" },
        { key: "RM-103", type: "Task", summary: "Refactor database migration scripts for Stripe webhooks schema upgrade", epic: "Billing & Subscriptions", priority: "Critical", estimate: 3, owner: "Backend Dev", status: "QA", dependencies: "RM-101" },
        { key: "RM-104", type: "Story", summary: "As a Merchant, I want to create customized email campaign flyers, so that customers review us.", epic: "Review Requests", priority: "High", estimate: 3, owner: "Frontend Dev", status: "Ready", businessValue: "Trial activation improvement" },
        { key: "RM-105", type: "Task", summary: "Research multi-tenant subdomains routing architecture on Vercel app config", epic: "Agency Portal", priority: "Medium", estimate: 5, owner: "Tech Lead", status: "Backlog" },
        { key: "RM-106", type: "Bug", summary: "Fix SMS campaign dispatcher timing logs under stress testing loads", epic: "Integrations", priority: "High", estimate: 2, owner: "QA Engineer", status: "Released" },
    ]);

    // Roadmap Items State
    const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([
        // 30 Day
        { id: "RM-RD-1", horizon: "30-Day", title: "MFA Authentication Gates", description: "Enforces 2FA login for admin and merchant roles", status: "Completed" },
        { id: "RM-RD-2", horizon: "30-Day", title: "Review Monitoring Sync Engine", description: "PostgreSQL streaming connection to fetch reviews", status: "In Progress" },
        { id: "RM-RD-3", horizon: "30-Day", title: "Billing Foundation Setup", description: "Stripe recurring plans checkout portals integration", status: "In Progress" },
        // 60 Day
        { id: "RM-RD-4", horizon: "60-Day", title: "AI Replies Editor Tone Controls", description: "Enables brand voice response tone selections", status: "Scheduled" },
        { id: "RM-RD-5", horizon: "60-Day", title: "Agency Portal Multi-Clients Portal", description: "Support sub-accounts scoping and dashboard white-labeling", status: "Scheduled" },
        // 90 Day
        { id: "RM-RD-6", horizon: "90-Day", title: "Advanced HubSpot CRM Webhooks", description: "Automated user lifecycle sync alerts to customer success", status: "Scheduled" },
        { id: "RM-RD-7", horizon: "90-Day", title: "Mobile progressive web app (PWA)", description: "Installable app package with mobile notification sync", status: "Scheduled" },
        // 12 Month
        { id: "RM-RD-8", horizon: "12-Month", title: "Phase 1: MVP Launch (SMBs)", description: "Launch starter dashboard to local business targets", status: "Completed" },
        { id: "RM-RD-9", horizon: "12-Month", title: "Phase 2: Agency Portal Expand", description: "Acquire agency partners with white-label packages", status: "In Progress" },
        { id: "RM-RD-10", horizon: "12-Month", title: "Phase 3: Dedicated Private Cloud", description: "AWS/Azure VPC isolation for national franchises", status: "Scheduled" },
    ]);

    // Ticket Creator Form State
    const [ticketType, setTicketType] = useState<"Story" | "Task">("Story");
    const [storyForm, setStoryForm] = useState({
        role: "",
        action: "",
        benefit: "",
        businessValue: "",
        epic: "Authentication & Security",
        priority: "Medium" as "Critical" | "High" | "Medium" | "Low",
        estimate: 3,
        owner: "Frontend Dev"
    });
    const [taskForm, setTaskForm] = useState({
        description: "",
        epic: "Authentication & Security",
        priority: "Medium" as "Critical" | "High" | "Medium" | "Low",
        estimate: 3,
        owner: "Frontend Dev",
        dependencies: "",
        dueDate: ""
    });

    // Epic List
    const epics = [
        "Authentication & Security",
        "Review Monitoring",
        "Review Requests",
        "AI Reply System",
        "Analytics & Reporting",
        "Billing & Subscriptions",
        "Agency Portal",
        "Customer Portal",
        "Integrations",
        "Mobile Experience"
    ];

    // Owner list
    const owners = [
        "Product Owner",
        "Tech Lead",
        "Frontend Dev",
        "Backend Dev",
        "QA Engineer",
        "Customer Success"
    ];

    // Priority colors
    const getPriorityColor = (p: string) => {
        switch (p) {
            case "Critical": return "bg-rose-500/10 border-rose-500/20 text-rose-400";
            case "High": return "bg-orange-500/10 border-orange-500/20 text-orange-400";
            case "Medium": return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
            default: return "bg-slate-500/10 border-slate-500/20 text-slate-400";
        }
    };

    // Issue Type icon color
    const getTypeColor = (t: string) => {
        switch (t) {
            case "Story": return "text-emerald-400";
            case "Task": return "text-cyan-400";
            case "Bug": return "text-rose-400";
            default: return "text-violet-400";
        }
    };

    // Calculate Active Capacity workload allocation per role
    const getWorkloadStatus = (ownerName: string) => {
        const activeStories = tickets.filter(t => t.owner === ownerName && (t.status === "In Progress" || t.status === "QA" || t.status === "Ready"));
        const totalPoints = activeStories.reduce((acc, curr) => acc + curr.estimate, 0);

        if (totalPoints > 12) return { points: totalPoints, status: "Overloaded", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
        if (totalPoints > 6) return { points: totalPoints, status: "Optimal", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
        return { points: totalPoints, status: "Under Capacity", color: "text-slate-400 bg-slate-500/10 border-slate-500/20" };
    };

    // Sprint stats
    const completedPoints = tickets
        .filter(t => t.status === "Done" || t.status === "Released")
        .reduce((acc, curr) => acc + curr.estimate, 0);

    const totalSprintPoints = tickets.reduce((acc, curr) => acc + curr.estimate, 0);
    const sprintProgressRatio = totalSprintPoints > 0 ? Math.round((completedPoints / totalSprintPoints) * 100) : 0;

    // Handle ticket movement
    const moveTicket = (ticketKey: string, direction: "next" | "prev") => {
        const columns: JiraTicket["status"][] = ["Backlog", "Ready", "In Progress", "QA", "Done", "Released"];
        
        setTickets(prev => prev.map(t => {
            if (t.key === ticketKey) {
                const currentIndex = columns.indexOf(t.status);
                let nextIndex = currentIndex;
                if (direction === "next" && currentIndex < columns.length - 1) {
                    nextIndex = currentIndex + 1;
                } else if (direction === "prev" && currentIndex > 0) {
                    nextIndex = currentIndex - 1;
                }
                const newStatus = columns[nextIndex];
                if (newStatus !== t.status) {
                    addLog(`Ticket ${t.key} status updated: ${t.status} ➔ ${newStatus}.`);
                }
                return { ...t, status: newStatus };
            }
            return t;
        }));
    };

    // Story Form Creation
    const handleCreateStory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!storyForm.role || !storyForm.action || !storyForm.benefit || !storyForm.businessValue) {
            alert("Please fill in all required user story template fields.");
            return;
        }

        const formattedSummary = `As a ${storyForm.role.trim()}, I want to ${storyForm.action.trim()}, so that ${storyForm.benefit.trim()}.`;
        const nextId = tickets.length + 101;
        const newKey = `RM-${nextId}`;

        const newStory: JiraTicket = {
            key: newKey,
            type: "Story",
            summary: formattedSummary,
            epic: storyForm.epic,
            priority: storyForm.priority,
            estimate: storyForm.estimate,
            owner: storyForm.owner,
            status: "Backlog",
            businessValue: storyForm.businessValue
        };

        setTickets(prev => [newStory, ...prev]);
        addLog(`Jira Ticket Created: ${newKey} (Story) added to Backlog.`);
        
        // Reset form
        setStoryForm(prev => ({
            ...prev,
            role: "",
            action: "",
            benefit: "",
            businessValue: ""
        }));
        alert(`User Story ${newKey} created successfully in Backlog!`);
    };

    // Task Form Creation
    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskForm.description) {
            alert("Please describe the technical scope of the task.");
            return;
        }

        const nextId = tickets.length + 101;
        const newKey = `RM-${nextId}`;

        const newT: JiraTicket = {
            key: newKey,
            type: "Task",
            summary: taskForm.description.trim(),
            epic: taskForm.epic,
            priority: taskForm.priority,
            estimate: taskForm.estimate,
            owner: taskForm.owner,
            status: "Backlog",
            dependencies: taskForm.dependencies || undefined,
            dueDate: taskForm.dueDate || undefined
        };

        setTickets(prev => [newT, ...prev]);
        addLog(`Jira Ticket Created: ${newKey} (Task) added to Backlog.`);
        
        setTaskForm(prev => ({
            ...prev,
            description: "",
            dependencies: "",
            dueDate: ""
        }));
        alert(`Technical Task ${newKey} created successfully in Backlog!`);
    };

    // Cycle Roadmap Item Status
    const cycleRoadmapStatus = (itemId: string) => {
        const states: RoadmapItem["status"][] = ["Scheduled", "In Progress", "Completed"];
        setRoadmapItems(prev => prev.map(item => {
            if (item.id === itemId) {
                const nextState = states[(states.indexOf(item.status) + 1) % states.length];
                addLog(`Roadmap [${item.title}] status cycled to: ${nextState.toUpperCase()}.`);
                return { ...item, status: nextState };
            }
            return item;
        }));
    };

    return (
        <div className="h-screen overflow-y-auto p-8 font-sans">
            
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-red-500" />
                        Jira Sprints &amp; Product Roadmapper
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Product operations console. Manage sprint boards, refine user stories using standard templates, track workload distribution, and align releases with business roadmap deliverables.
                    </p>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
                    <Clock className="w-4 h-4 animate-pulse" /> Active Sprint: Sprint 14 (RM-S14)
                </div>
            </div>

            {/* Platform KPI Board Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                
                {/* Sprint progress meter */}
                <div className="glass-card rounded-2xl p-5 border border-border/60 flex flex-col justify-between lg:col-span-1">
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                            <Activity className="w-4 h-4 text-emerald-400" /> Sprint Burn-Up
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal mb-4">
                            Velocity target: **40 SP**. Currently tracking completed points ratio.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-baseline">
                            <span className="text-2xl font-black text-white">{completedPoints} / {totalSprintPoints}</span>
                            <span className="text-xs text-emerald-400 font-bold font-mono">{sprintProgressRatio}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                                style={{ width: `${sprintProgressRatio}%` }}
                            />
                        </div>
                        <div className="text-[8px] text-slate-500 uppercase tracking-wider font-mono">
                            Done &amp; Released points vs. Sprint capacity
                        </div>
                    </div>
                </div>

                {/* KPI metrics cards */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-card rounded-2xl p-5 border border-border/60 flex items-start justify-between">
                        <div>
                            <div className="text-2xl font-black text-white mb-1">$48,200</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                <DollarSign className="w-3.5 h-3.5 text-violet-400" /> Platform MRR
                            </div>
                            <p className="text-[10px] text-slate-500">ARR: $578K | Churn: 1.8% | LTV: $1,450</p>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-violet-400" />
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-5 border border-border/60 flex items-start justify-between">
                        <div>
                            <div className="text-2xl font-black text-white mb-1">1,240</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-emerald-400" /> Active Businesses
                            </div>
                            <p className="text-[10px] text-slate-500">Review Growth: +24.5% | AI Adoption: 82%</p>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-5 border border-border/60 flex items-start justify-between">
                        <div>
                            <div className="text-2xl font-black text-white mb-1">98.2%</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                <CheckSquare className="w-3.5 h-3.5 text-cyan-400" /> Release Success Rate
                            </div>
                            <p className="text-[10px] text-slate-500">Sprint velocity: 34 SP | Active bugs: 3</p>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        </div>
                    </div>
                </div>

            </div>

            {/* Interactive Sprint Kanban Board */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                        <ListTodo className="w-4.5 h-4.5 text-red-500" /> Active Sprint Board: RM-S14
                    </h2>
                    <span className="text-[10px] text-slate-500 font-mono">
                        Workflow: Backlog ➔ Ready ➔ In Progress ➔ QA ➔ Done ➔ Released
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                    {(["Backlog", "Ready", "In Progress", "QA", "Done", "Released"] as const).map((col) => {
                        const colTickets = tickets.filter(t => t.status === col);
                        return (
                            <div key={col} className="bg-slate-950/40 border border-white/5 rounded-2xl p-3 flex flex-col min-h-[300px]">
                                <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{col}</span>
                                    <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded-full font-bold">
                                        {colTickets.length}
                                    </span>
                                </div>

                                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[400px] pr-0.5">
                                    {colTickets.map((ticket) => (
                                        <div key={ticket.key} className="bg-slate-900 border border-white/5 hover:border-white/10 rounded-xl p-3 text-xs flex flex-col justify-between gap-2 transition-all">
                                            <div>
                                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                                    <span className="font-mono text-[9px] text-slate-400 font-bold flex items-center gap-1">
                                                        <span className={getTypeColor(ticket.type)}>●</span>
                                                        {ticket.key}
                                                    </span>
                                                    <span className={`text-[8px] px-1.5 py-0.2 rounded-full font-bold border ${getPriorityColor(ticket.priority)}`}>
                                                        {ticket.priority}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-slate-200 leading-snug line-clamp-3 mb-2">{ticket.summary}</p>
                                                <span className="text-[8px] text-slate-500 font-medium block truncate">Epic: {ticket.epic}</span>
                                            </div>

                                            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                                                <div className="flex items-center gap-1 text-[9px] text-slate-400">
                                                    <User className="w-3 h-3 text-slate-500" />
                                                    <span className="truncate max-w-[60px]">{ticket.owner}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <span className="text-[8px] bg-slate-950 border border-white/5 text-slate-400 px-1.5 py-0.2 rounded font-mono font-bold">
                                                        {ticket.estimate} SP
                                                    </span>
                                                    
                                                    {/* Direction control arrows */}
                                                    <div className="flex gap-0.5">
                                                        <button 
                                                            onClick={() => moveTicket(ticket.key, "prev")}
                                                            disabled={col === "Backlog"}
                                                            className={`w-4 h-4 rounded flex items-center justify-center text-[9px] border transition-colors ${
                                                                col === "Backlog" 
                                                                    ? "border-slate-800 text-slate-700 bg-slate-950 cursor-not-allowed" 
                                                                    : "border-white/5 text-slate-400 bg-slate-950 hover:bg-slate-850 hover:text-white cursor-pointer"
                                                            }`}
                                                        >
                                                            ◀
                                                        </button>
                                                        <button 
                                                            onClick={() => moveTicket(ticket.key, "next")}
                                                            disabled={col === "Released"}
                                                            className={`w-4 h-4 rounded flex items-center justify-center text-[9px] border transition-colors ${
                                                                col === "Released" 
                                                                    ? "border-slate-800 text-slate-700 bg-slate-950 cursor-not-allowed" 
                                                                    : "border-white/5 text-slate-400 bg-slate-950 hover:bg-slate-850 hover:text-white cursor-pointer"
                                                            }`}
                                                        >
                                                            ▶
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {colTickets.length === 0 && (
                                        <div className="text-[9px] text-slate-700 text-center py-8 border border-dashed border-white/3 rounded-xl">
                                            No issues
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Jira Ticket Creator & Team Workload Capacity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Ticket Creator Form */}
                <div className="glass-card rounded-2xl p-6 border border-border/60 lg:col-span-2 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Plus className="w-4.5 h-4.5 text-red-500" />
                                Jira Issue Template Refinement
                            </h3>
                            <div className="bg-slate-950 p-1 border border-white/5 rounded-xl flex gap-1">
                                {(["Story", "Task"] as const).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setTicketType(type)}
                                        className={`text-[10px] px-3 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                                            ticketType === type ? "bg-red-600 text-white" : "text-slate-500 hover:text-white"
                                        }`}
                                    >
                                        {type === "Story" ? "User Story" : "Technical Task"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {ticketType === "Story" ? (
                            <form onSubmit={handleCreateStory} className="space-y-4 text-xs">
                                <div className="p-3 bg-slate-950 border border-white/5 rounded-xl text-[10px] text-slate-400 flex flex-col gap-1.5 leading-relaxed font-mono">
                                    <span className="text-slate-500 uppercase tracking-widest text-[8px] font-bold">Standard User Story Template:</span>
                                    <span>As a <strong className="text-emerald-400">Owner/Merchant</strong>, I want to <strong className="text-emerald-400">perform action</strong>, so that <strong className="text-emerald-400">benefit</strong>.</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-[10px] text-slate-500 block mb-1">As a [User Role] *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Small Business Owner"
                                            value={storyForm.role}
                                            onChange={(e) => setStoryForm(prev => ({ ...prev, role: e.target.value }))}
                                            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-500 block mb-1">I want to [Action] *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. edit Tone on AI drafts"
                                            value={storyForm.action}
                                            onChange={(e) => setStoryForm(prev => ({ ...prev, action: e.target.value }))}
                                            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-500 block mb-1">So that [Benefit] *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. review replies sound friendly"
                                            value={storyForm.benefit}
                                            onChange={(e) => setStoryForm(prev => ({ ...prev, benefit: e.target.value }))}
                                            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] text-slate-500 block mb-1">Business Value (Required Field) *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Increases customer trial retention P2"
                                            value={storyForm.businessValue}
                                            onChange={(e) => setStoryForm(prev => ({ ...prev, businessValue: e.target.value }))}
                                            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-500 block mb-1">Epic Mapping</label>
                                        <select
                                            value={storyForm.epic}
                                            onChange={(e) => setStoryForm(prev => ({ ...prev, epic: e.target.value }))}
                                            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                                        >
                                            {epics.map(ep => (
                                                <option key={ep} value={ep}>{ep}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-[10px] text-slate-500 block mb-1">Priority</label>
                                        <select
                                            value={storyForm.priority}
                                            onChange={(e) => setStoryForm(prev => ({ ...prev, priority: e.target.value as any }))}
                                            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                                        >
                                            <option value="Critical">Critical</option>
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-500 block mb-1">Estimate (Story Points)</label>
                                        <select
                                            value={storyForm.estimate}
                                            onChange={(e) => setStoryForm(prev => ({ ...prev, estimate: Number(e.target.value) }))}
                                            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                                        >
                                            <option value={1}>1 SP (Tiny)</option>
                                            <option value={2}>2 SP (Small)</option>
                                            <option value={3}>3 SP (Medium)</option>
                                            <option value={5}>5 SP (Large)</option>
                                            <option value={8}>8 SP (Epic)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-500 block mb-1">Owner Assignment</label>
                                        <select
                                            value={storyForm.owner}
                                            onChange={(e) => setStoryForm(prev => ({ ...prev, owner: e.target.value }))}
                                            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                                        >
                                            {owners.map(ow => (
                                                <option key={ow} value={ow}>{ow}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
                                >
                                    Refine &amp; Create User Story
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
                                <div>
                                    <label className="text-[10px] text-slate-500 block mb-1">Task Description *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Upgrade backend PostgreSQL max pool size parameters"
                                        value={taskForm.description}
                                        onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                                        className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] text-slate-500 block mb-1">Epic Mapping</label>
                                        <select
                                            value={taskForm.epic}
                                            onChange={(e) => setTaskForm(prev => ({ ...prev, epic: e.target.value }))}
                                            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                                        >
                                            {epics.map(ep => (
                                                <option key={ep} value={ep}>{ep}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-500 block mb-1">Dependencies (linked key)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. RM-101"
                                            value={taskForm.dependencies}
                                            onChange={(e) => setTaskForm(prev => ({ ...prev, dependencies: e.target.value }))}
                                            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <div>
                                        <label className="text-[10px] text-slate-500 block mb-1">Priority</label>
                                        <select
                                            value={taskForm.priority}
                                            onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.target.value as any }))}
                                            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                                        >
                                            <option value="Critical">Critical</option>
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-500 block mb-1">Estimate</label>
                                        <select
                                            value={taskForm.estimate}
                                            onChange={(e) => setTaskForm(prev => ({ ...prev, estimate: Number(e.target.value) }))}
                                            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                                        >
                                            <option value={1}>1 SP (Tiny)</option>
                                            <option value={2}>2 SP (Small)</option>
                                            <option value={3}>3 SP (Medium)</option>
                                            <option value={5}>5 SP (Large)</option>
                                            <option value={8}>8 SP (Epic)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-500 block mb-1">Owner Assignment</label>
                                        <select
                                            value={taskForm.owner}
                                            onChange={(e) => setTaskForm(prev => ({ ...prev, owner: e.target.value }))}
                                            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                                        >
                                            {owners.map(ow => (
                                                <option key={ow} value={ow}>{ow}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-500 block mb-1">Due Date</label>
                                        <input
                                            type="date"
                                            value={taskForm.dueDate}
                                            onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                                            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
                                >
                                    Create Technical Task
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Capacity Allocator */}
                <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <Users className="w-4.5 h-4.5 text-red-400" />
                            Team Capacity Allocator
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-6">
                            Real-time tracking of active story points allocated to sprint roles. Prevent overload bottlenecks.
                        </p>

                        <div className="space-y-3">
                            {owners.map((owner) => {
                                const allocation = getWorkloadStatus(owner);
                                return (
                                    <div key={owner} className="p-3 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between text-xs">
                                        <div>
                                            <span className="text-slate-300 font-bold block">{owner}</span>
                                            <span className="text-[9px] text-slate-500 block mt-0.5">Active load: {allocation.points} SP</span>
                                        </div>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${allocation.color}`}>
                                            {allocation.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-900 mt-4 text-[9px] text-slate-500 flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-slate-500" /> Capacity limits: Optimal &lt; 12 SP, Overloaded &gt; 12 SP.
                    </div>
                </div>

            </div>

            {/* Product Execution Roadmap Horizons */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Roadmap deliverables column */}
                <div className="glass-card rounded-2xl p-6 border border-border/60 lg:col-span-2 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Calendar className="w-4.5 h-4.5 text-red-400" />
                                Product Release Roadmap Horizons
                            </h3>
                            <span className="text-[9px] text-slate-500 font-mono">click items to toggle progress state</span>
                        </div>
                        
                        <div className="space-y-4">
                            {(["30-Day", "60-Day", "90-Day"] as const).map((horizon) => {
                                const horizonItems = roadmapItems.filter(item => item.horizon === horizon);
                                return (
                                    <div key={horizon} className="p-3 bg-slate-950/60 border border-white/5 rounded-xl">
                                        <div className="flex justify-between items-center mb-2.5">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                                                {horizon === "30-Day" ? "30-Day: Core Platform Stability" : 
                                                 horizon === "60-Day" ? "60-Day: Growth Features" : 
                                                 "90-Day: Scale & Optimization"}
                                            </span>
                                            <span className="text-[9px] text-slate-500 font-medium">Deliverables</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                            {horizonItems.map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => cycleRoadmapStatus(item.id)}
                                                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all group cursor-pointer ${
                                                        item.status === "Completed" ? "bg-emerald-500/10 border-emerald-500/30 text-white" :
                                                        item.status === "In Progress" ? "bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse" :
                                                        "bg-slate-900 border-white/5 text-slate-400 hover:border-white/10"
                                                    }`}
                                                >
                                                    <div>
                                                        <div className="text-[11px] font-bold flex items-center justify-between">
                                                            <span>{item.title}</span>
                                                            <span className={`text-[8px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                                                                item.status === "Completed" ? "bg-emerald-500/20 text-emerald-400" :
                                                                item.status === "In Progress" ? "bg-amber-500/20 text-amber-400" :
                                                                "bg-slate-950 text-slate-600 border border-slate-800"
                                                            }`}>
                                                                {item.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-[9px] mt-1 text-slate-400 leading-relaxed">{item.description}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-900 mt-4 text-[9px] text-slate-500">
                        Roadmap targets reviewed by Product Owner monthly.
                    </div>
                </div>

                {/* 12-Month Product Vision Phases */}
                <div className="glass-card rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <Award className="w-4.5 h-4.5 text-violet-400" />
                            12-Month Strategic Product Vision
                        </h3>
                        
                        <div className="space-y-4">
                            {roadmapItems.filter(item => item.horizon === "12-Month").map((phase, idx) => (
                                <div key={phase.id} className="relative pl-6 border-l border-white/10 last:border-0 pb-1">
                                    {/* Circle tag */}
                                    <button 
                                        onClick={() => cycleRoadmapStatus(phase.id)}
                                        className={`absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full border cursor-pointer ${
                                            phase.status === "Completed" ? "bg-emerald-500 border-emerald-500" :
                                            phase.status === "In Progress" ? "bg-amber-500 border-amber-500 animate-ping" :
                                            "bg-slate-900 border-white/20"
                                        }`}
                                    />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-200">{phase.title}</span>
                                            <span className={`text-[7px] px-1 rounded font-bold uppercase tracking-wider ${
                                                phase.status === "Completed" ? "bg-emerald-500/10 text-emerald-400" :
                                                phase.status === "In Progress" ? "bg-amber-500/10 text-amber-400" :
                                                "bg-slate-950 text-slate-600"
                                            }`}>
                                                {phase.status}
                                            </span>
                                        </div>
                                        <p className="text-[9px] text-slate-500 mt-1">{phase.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-900 mt-4 text-[9px] text-slate-500 leading-normal">
                        Goal: Scale standard SMB feature packages to Enterprise-level private cloud hosting models.
                    </div>
                </div>

            </div>

            {/* Live DevOps audit trail logs */}
            <div className="glass-card rounded-2xl p-6 border border-border/60">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <FileText className="w-4.5 h-4.5 text-slate-400" />
                        Jira Sprints Audit Trail &amp; Release Log
                    </h3>
                    <span className="text-[9px] text-slate-500 font-mono">active session</span>
                </div>
                <div className="bg-slate-950 rounded-xl p-4 border border-white/5">
                    <div className="h-[120px] overflow-y-auto font-mono text-xs text-slate-400 space-y-1.5">
                        {logs.map((log, idx) => (
                            <div key={idx} className="flex gap-1.5">
                                <span className="text-red-500 shrink-0">➔</span>
                                <span className={
                                    log.includes("Jira Ticket Created") ? "text-emerald-400" :
                                    log.includes("status updated") ? "text-cyan-400" :
                                    log.includes("cycled to") ? "text-violet-400" : ""
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
