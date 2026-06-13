"use client";
import { useEffect, useState } from "react";
import { 
    getTickets, updateTicket, getUsers, getBusinesses, 
    SupportTicket, User, Business, addAuditLog 
} from "@/lib/store";
import { 
    LifeBuoy, ShieldAlert, CheckCircle, RefreshCw, AlertTriangle, 
    User as UserIcon, Clock, MessageSquare, Star, ArrowUpRight, Search, Check
} from "lucide-react";

export default function AdminSupportPage() {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [statusFilter, setStatusFilter] = useState<"all" | "open" | "assigned" | "escalated" | "resolved">("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Simulated reply text
    const [resolutionNote, setResolutionNote] = useState("");
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showNotification = (msg: string, type: "success" | "error" = "success") => {
        setNotification({ message: msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const refresh = () => {
        const t = getTickets();
        setTickets(t);
        setUsers(getUsers());
        setBusinesses(getBusinesses());

        // Update selected ticket details if it is currently viewed
        if (selectedTicket) {
            const updated = t.find(tk => tk.id === selectedTicket.id);
            if (updated) setSelectedTicket(updated);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    // Filter tickets
    const filteredTickets = tickets.filter(ticket => {
        const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
        
        const biz = businesses.find(b => b.id === ticket.businessId);
        const bizName = biz?.name.toLowerCase() || "";
        const matchesSearch = 
            ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bizName.includes(searchQuery.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
            
        return matchesStatus && matchesSearch;
    });

    const handleAssign = (assigneeName: string) => {
        if (!selectedTicket) return;
        const updated: SupportTicket = {
            ...selectedTicket,
            assignedTo: assigneeName,
            status: selectedTicket.status === "open" ? "assigned" : selectedTicket.status
        };
        updateTicket(updated);
        addAuditLog("Ticket Assigned", selectedTicket.businessId, undefined, { ticketId: selectedTicket.id, assignedTo: assigneeName });
        showNotification(`Ticket assigned to ${assigneeName}`);
        refresh();
    };

    const handlePriorityChange = (priority: "P1" | "P2" | "P3" | "P4") => {
        if (!selectedTicket) return;
        const updated: SupportTicket = {
            ...selectedTicket,
            priority
        };
        updateTicket(updated);
        addAuditLog("Ticket Priority Updated", selectedTicket.businessId, undefined, { ticketId: selectedTicket.id, newPriority: priority });
        showNotification(`Ticket priority updated to ${priority}`);
        refresh();
    };

    const handleEscalate = () => {
        if (!selectedTicket) return;
        const updated: SupportTicket = {
            ...selectedTicket,
            status: "escalated"
        };
        updateTicket(updated);
        addAuditLog("Ticket Escalated", selectedTicket.businessId, undefined, { ticketId: selectedTicket.id });
        showNotification(`Ticket escalated to Tier-2 Engineering!`);
        refresh();
    };

    const handleResolve = () => {
        if (!selectedTicket) return;
        
        // Simulate a CSAT score submission from the user after resolution
        const simulatedCSAT = Math.floor(Math.random() * 2) + 4; // Generate a 4 or 5 star CSAT rating
        
        const updated: SupportTicket = {
            ...selectedTicket,
            status: "resolved",
            csat: simulatedCSAT
        };
        
        updateTicket(updated);
        addAuditLog("Ticket Resolved", selectedTicket.businessId, undefined, { ticketId: selectedTicket.id, csatScore: simulatedCSAT, note: resolutionNote });
        showNotification(`Ticket resolved! Merchant rated CSAT: ${simulatedCSAT}★`);
        setResolutionNote("");
        refresh();
    };

    // CSAT Calculations
    const resolvedTickets = tickets.filter(t => t.status === "resolved");
    const csatTickets = resolvedTickets.filter(t => t.csat !== undefined);
    const avgCsat = csatTickets.length 
        ? parseFloat((csatTickets.reduce((sum, t) => sum + (t.csat || 0), 0) / csatTickets.length).toFixed(1)) 
        : 0;

    const openCount = tickets.filter(t => t.status !== "resolved").length;

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

            {/* Page Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <LifeBuoy className="w-6 h-6 text-primary" /> Support Desk
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage merchant support queries, platform failures, SLAs, and CSAT feedbacks.</p>
                </div>
                <button onClick={refresh} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-secondary/50 border border-border text-muted-foreground hover:text-white transition-all">
                    <RefreshCw className="w-3.5 h-3.5" /> Reload Data
                </button>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="glass-card rounded-2xl p-5 border border-border/60">
                    <div className="text-2xl font-extrabold text-white mb-1">{tickets.length}</div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase">Total Tickets Raised</div>
                </div>
                <div className="glass-card rounded-2xl p-5 border border-red-500/20 bg-red-500/5">
                    <div className="text-2xl font-extrabold text-red-400 mb-1">{openCount}</div>
                    <div className="text-xs font-semibold text-red-400 uppercase">Open / Escalated Tickets</div>
                </div>
                <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/5">
                    <div className="text-2xl font-extrabold text-emerald-400 mb-1">{resolvedTickets.length}</div>
                    <div className="text-xs font-semibold text-emerald-400 uppercase">Resolved Inquiries</div>
                </div>
                <div className="glass-card rounded-2xl p-5 border border-purple-500/20 bg-purple-500/5">
                    <div className="text-2xl font-extrabold text-purple-400 mb-1">{avgCsat ? `${avgCsat} ★` : "N/A"}</div>
                    <div className="text-xs font-semibold text-purple-400 uppercase">Customer Satisfaction (CSAT)</div>
                </div>
            </div>

            {/* Split Panel */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 overflow-hidden">
                {/* Tickets list panel */}
                <div className="glass-card rounded-2xl border border-border/60 flex flex-col overflow-hidden lg:col-span-1">
                    {/* Search & Filters */}
                    <div className="p-4 border-b border-border/60 space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search tickets..."
                                className="w-full pl-9 pr-4 py-2 rounded-xl bg-secondary/35 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-xs" />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                { id: "all", label: "All" },
                                { id: "open", label: "Open" },
                                { id: "assigned", label: "Assigned" },
                                { id: "escalated", label: "Escalated" },
                                { id: "resolved", label: "Resolved" }
                            ].map(filter => (
                                <button key={filter.id} onClick={() => setStatusFilter(filter.id as any)}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                        statusFilter === filter.id 
                                            ? "bg-primary text-white" 
                                            : "bg-secondary/40 text-muted-foreground hover:bg-secondary/60 hover:text-white"
                                    }`}>
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scrollable list */}
                    <div className="flex-1 overflow-y-auto divide-y divide-border/30 p-2 space-y-2">
                        {filteredTickets.map(ticket => {
                            const biz = businesses.find(b => b.id === ticket.businessId);
                            const selected = selectedTicket?.id === ticket.id;
                            
                            // Priority colors
                            const priMap = {
                                P1: "bg-red-500/10 text-red-400 border-red-500/20",
                                P2: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                                P3: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
                                P4: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                            };

                            const statusMap = {
                                open: "bg-red-500/15 text-red-400",
                                assigned: "bg-blue-500/15 text-blue-400",
                                escalated: "bg-purple-500/15 text-purple-400",
                                resolved: "bg-emerald-500/15 text-emerald-400"
                            };

                            return (
                                <button key={ticket.id} onClick={() => { setSelectedTicket(ticket); setResolutionNote(""); }}
                                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-2 ${
                                        selected 
                                            ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(239,68,68,0.08)]" 
                                            : "bg-secondary/10 border-border/30 hover:border-border/60 hover:bg-secondary/20"
                                    }`}>
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-[10px] text-muted-foreground font-mono">{ticket.id}</span>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${priMap[ticket.priority]}`}>
                                            {ticket.priority}
                                        </span>
                                    </div>
                                    <h4 className="text-xs font-bold text-white line-clamp-1 leading-snug">{ticket.subject}</h4>
                                    <p className="text-[10px] text-muted-foreground line-clamp-1">{biz?.name || "Unknown Business"}</p>
                                    
                                    <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-border/10">
                                        <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full ${statusMap[ticket.status]}`}>
                                            {ticket.status}
                                        </span>
                                        <span className="text-[9px] text-muted-foreground/60">
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                        {filteredTickets.length === 0 && (
                            <div className="py-12 text-center text-xs text-muted-foreground">No support tickets found.</div>
                        )}
                    </div>
                </div>

                {/* Ticket Details Panel */}
                <div className="glass-card rounded-2xl border border-border/60 lg:col-span-2 overflow-hidden flex flex-col">
                    {selectedTicket ? (
                        <div className="flex-1 flex flex-col h-full overflow-hidden">
                            {/* Panel Header */}
                            <div className="p-6 border-b border-border/60 flex items-start justify-between gap-4 flex-wrap bg-secondary/10">
                                <div>
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span className="text-xs font-mono text-primary font-semibold">{selectedTicket.id}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                            selectedTicket.priority === "P1" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                            selectedTicket.priority === "P2" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                            selectedTicket.priority === "P3" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                                            "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                                        }`}>
                                            Priority {selectedTicket.priority}
                                        </span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                            selectedTicket.status === "open" ? "bg-red-500/15 text-red-400" :
                                            selectedTicket.status === "assigned" ? "bg-blue-500/15 text-blue-400" :
                                            selectedTicket.status === "escalated" ? "bg-purple-500/15 text-purple-400" :
                                            "bg-emerald-500/15 text-emerald-400"
                                        }`}>
                                            {selectedTicket.status}
                                        </span>
                                    </div>
                                    <h2 className="text-base font-bold text-white leading-snug">{selectedTicket.subject}</h2>
                                    <p className="text-xs text-muted-foreground mt-1.5">
                                        Organization: <strong className="text-foreground">{businesses.find(b => b.id === selectedTicket.businessId)?.name || "Unknown"}</strong>
                                    </p>
                                </div>
                                <div className="text-[10px] text-muted-foreground text-right">
                                    <p>Raised {new Date(selectedTicket.createdAt).toLocaleString()}</p>
                                    {selectedTicket.csat && (
                                        <div className="mt-2 flex items-center justify-end gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold">
                                            CSAT score: {selectedTicket.csat} ★
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Ticket Description */}
                            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Merchant Description</h4>
                                    <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 text-sm leading-relaxed text-muted-foreground">
                                        {selectedTicket.description}
                                    </div>
                                </div>

                                {selectedTicket.status !== "resolved" ? (
                                    <div className="space-y-4 pt-4 border-t border-border/30">
                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resolve Support Request</h4>
                                        <textarea value={resolutionNote} onChange={e => setResolutionNote(e.target.value)} rows={3} placeholder="Provide internal resolution details or reply to the merchant..."
                                            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:border-primary resize-none" />
                                        
                                        <div className="flex justify-end gap-2">
                                            {selectedTicket.status !== "escalated" && (
                                                <button onClick={handleEscalate}
                                                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 font-bold transition-all">
                                                    <ArrowUpRight className="w-3.5 h-3.5" /> Escalate Ticket
                                                </button>
                                            )}
                                            <button onClick={handleResolve}
                                                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs btn-primary text-white font-bold transition-all">
                                                <CheckCircle className="w-3.5 h-3.5" /> Resolve & Close Ticket
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-400 flex items-start gap-2">
                                        <CheckCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-bold mb-0.5">Ticket Resolved & Archived</p>
                                            <p className="leading-relaxed text-[11px] text-muted-foreground/80">
                                                This issue is closed. Any further message from the customer will automatically re-open the workflow.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Control Sidebar (Right/Bottom) */}
                            <div className="p-6 border-t border-border/60 bg-secondary/10 flex flex-wrap gap-6 items-center justify-between">
                                {/* Assignment Selector */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Assigned Specialist</label>
                                    <div className="flex items-center gap-2">
                                        <select value={selectedTicket.assignedTo || ""} onChange={e => handleAssign(e.target.value)}
                                            className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs text-white focus:outline-none">
                                            <option value="">Unassigned</option>
                                            {users.filter(u => u.role === "admin" || u.role === "manager").map(u => (
                                                <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Set Priority Buttons */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Set SLA Priority</label>
                                    <div className="flex gap-1">
                                        {(["P1", "P2", "P3", "P4"] as const).map(p => (
                                            <button key={p} onClick={() => handlePriorityChange(p)}
                                                className={`px-2 py-1 rounded text-xs font-bold transition-all border ${
                                                    selectedTicket.priority === p
                                                        ? "bg-primary text-white border-primary"
                                                        : "bg-secondary border-border text-muted-foreground hover:text-white"
                                                }`}>
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                            <LifeBuoy className="w-12 h-12 text-border mb-3 animate-pulse" />
                            <h3 className="text-sm font-bold text-white mb-1">No Ticket Selected</h3>
                            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">Select a support request from the list on the left to inspect detail logs, assign technicians, adjust priority, or resolve issues.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
