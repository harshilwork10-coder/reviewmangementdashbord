"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { 
    getBusinessesByAgency, getLocations, getReviews, getUsers, saveBusiness, 
    Business, Location, Review, User, addAuditLog 
} from "@/lib/store";
import { 
    Search, Plus, Eye, Archive, ShieldAlert, Star, Building2, MapPin, 
    Users as UsersIcon, ChevronRight, Settings, Check, X, ShieldCheck
} from "lucide-react";

export default function AgencyClientsPage() {
    const { user, switchClientBusiness } = useAuth();
    const router = useRouter();

    // Data states
    const [clients, setClients] = useState<Business[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [usersList, setUsersList] = useState<User[]>([]);
    const [selectedClient, setSelectedClient] = useState<Business | null>(null);
    const [search, setSearch] = useState("");

    // Modal state for team assignment
    const [teamModalOpen, setTeamModalOpen] = useState(false);
    const [agencyStaff, setAgencyStaff] = useState<User[]>([]);
    const [assignedStaffIds, setAssignedStaffIds] = useState<string[]>([]); // mock assignment

    const [notification, setNotification] = useState<string | null>(null);

    const showNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const refresh = () => {
        if (user && user.agencyId) {
            const agencyId = user.agencyId;
            const cls = getBusinessesByAgency(agencyId);
            
            // Get even archived businesses to allow restoring them
            const allBusinesses = JSON.parse(localStorage.getItem("rms_businesses") || "[]") as Business[];
            const agencyAll = allBusinesses.filter(b => b.agencyId === agencyId);
            setClients(agencyAll);

            // Set default selected client if not set or update details
            if (selectedClient) {
                const updated = agencyAll.find(b => b.id === selectedClient.id);
                if (updated) setSelectedClient(updated);
            } else if (agencyAll.length > 0) {
                setSelectedClient(agencyAll.filter(b => !b.isArchived)[0] || agencyAll[0]);
            }

            const clientIds = new Set(agencyAll.map(c => c.id));
            setLocations(getLocations().filter(l => clientIds.has(l.businessId)));
            setReviews(getReviews().filter(r => clientIds.has(r.businessId)));
            setUsersList(getUsers().filter(u => clientIds.has(u.businessId || "")));
            setAgencyStaff(getUsers().filter(u => u.agencyId === agencyId));
        }
    };

    useEffect(() => {
        refresh();
    }, [user]);

    const handleToggleArchive = (client: Business) => {
        const updated = { ...client, isArchived: !client.isArchived };
        // Save to store
        saveBusiness(updated);
        addAuditLog(updated.isArchived ? "Client Archived" : "Client Restored", client.id, undefined, { name: client.name });
        showNotification(updated.isArchived ? "Client archived successfully" : "Client restored successfully");
        refresh();
    };

    const handleSwitch = (client: Business) => {
        switchClientBusiness(client.id);
        router.push("/dashboard");
    };

    const openAssignTeamModal = () => {
        if (!selectedClient) return;
        // Mock team assignment setup: filter staff users already assigned
        // For simplicity, we randomly toggle staff check states or save them locally
        const savedAssignments = localStorage.getItem(`rms_agency_assigned_staff_${selectedClient.id}`);
        if (savedAssignments) {
            setAssignedStaffIds(JSON.parse(savedAssignments));
        } else {
            setAssignedStaffIds([]);
        }
        setTeamModalOpen(true);
    };

    const saveTeamAssignments = () => {
        if (!selectedClient) return;
        localStorage.setItem(`rms_agency_assigned_staff_${selectedClient.id}`, JSON.stringify(assignedStaffIds));
        setTeamModalOpen(false);
        showNotification("Staff assignments updated!");
        addAuditLog("Client Team Assignment Updated", selectedClient.id, undefined, { assignedCount: assignedStaffIds.length });
        refresh();
    };

    const toggleStaffAssign = (staffId: string) => {
        if (assignedStaffIds.includes(staffId)) {
            setAssignedStaffIds(assignedStaffIds.filter(id => id !== staffId));
        } else {
            setAssignedStaffIds([...assignedStaffIds, staffId]);
        }
    };

    const activeClients = clients.filter(c => !c.isArchived);
    const archivedClients = clients.filter(c => c.isArchived);

    const filteredClients = activeClients.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="h-screen overflow-y-auto p-8 relative flex flex-col bg-background text-foreground">
            {/* Notification Banner */}
            {notification && (
                <div className="fixed top-4 right-4 z-[100] px-4 py-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-semibold transition-all">
                    <Check className="w-4 h-4" />
                    {notification}
                </div>
            )}

            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-primary" /> Client Directory
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manage all brands under your agency, configure locations, and assign account team members.
                    </p>
                </div>
                <button onClick={() => router.push("/agency/clients/onboarding")}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs bg-primary hover:bg-primary/95 text-white font-bold transition-all shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" /> Onboard New Client
                </button>
            </div>

            {/* Split panels */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 overflow-hidden">
                {/* Left: Client Directory List */}
                <div className="glass-card rounded-2xl border border-border/60 flex flex-col overflow-hidden lg:col-span-1">
                    <div className="p-4 border-b border-border/60">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..."
                                className="w-full pl-9 pr-4 py-2 rounded-xl bg-secondary/35 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-xs" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {filteredClients.map(client => {
                            const clientRevs = reviews.filter(r => r.businessId === client.id);
                            const avg = clientRevs.length ? (clientRevs.reduce((sum, r) => sum + r.rating, 0) / clientRevs.length).toFixed(1) : "N/A";
                            const isSelected = selectedClient?.id === client.id;
                            
                            return (
                                <button key={client.id} onClick={() => setSelectedClient(client)}
                                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                                        isSelected 
                                            ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(239,68,68,0.08)]" 
                                            : "bg-secondary/10 border-border/30 hover:border-border/60 hover:bg-secondary/20"
                                    }`}>
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl shrink-0">
                                            {client.logo}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-xs font-bold text-white truncate max-w-[130px] leading-snug">{client.name}</h4>
                                            <span className="text-[9px] text-muted-foreground block capitalize">{client.category}</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="text-xs font-extrabold text-white block">{avg} ★</span>
                                        <span className="text-[9px] text-muted-foreground block">{clientRevs.length} reviews</span>
                                    </div>
                                </button>
                            );
                        })}

                        {/* Archived Clients Section */}
                        {archivedClients.length > 0 && (
                            <div className="pt-4 border-t border-border/20 mt-4">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block px-2 mb-2">Archived Brands</span>
                                {archivedClients.map(client => (
                                    <button key={client.id} onClick={() => setSelectedClient(client)}
                                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 opacity-60 ${
                                            selectedClient?.id === client.id 
                                                ? "bg-primary/10 border-primary" 
                                                : "bg-secondary/5 border-border/20 hover:bg-secondary/15"
                                        }`}>
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-500/10 border border-zinc-500/20 flex items-center justify-center text-2xl shrink-0 grayscale">
                                                {client.logo}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-bold text-white truncate max-w-[130px] leading-snug">{client.name}</h4>
                                                <span className="text-[9px] text-muted-foreground block capitalize">{client.category}</span>
                                            </div>
                                        </div>
                                        <span className="text-[9px] bg-zinc-500/15 border border-zinc-500/25 px-1.5 py-0.5 rounded text-zinc-400 font-bold uppercase tracking-wider shrink-0">Archived</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {clients.length === 0 && (
                            <div className="py-12 text-center text-xs text-muted-foreground">No clients added. Click 'Onboard' to add.</div>
                        )}
                    </div>
                </div>

                {/* Right: Client Profile details */}
                <div className="glass-card rounded-2xl border border-border/60 lg:col-span-2 overflow-hidden flex flex-col">
                    {selectedClient ? (
                        <div className="flex-1 flex flex-col h-full overflow-hidden">
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-border/60 bg-secondary/10 flex items-start justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center text-3xl shrink-0">
                                        {selectedClient.logo}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <h2 className="text-base font-bold text-white leading-none">{selectedClient.name}</h2>
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                                selectedClient.isArchived 
                                                    ? "bg-zinc-500/15 text-zinc-400 border-zinc-500/20" 
                                                    : selectedClient.status === "active" 
                                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                                        : "bg-red-500/10 text-red-400 border-red-500/20"
                                            }`}>
                                                {selectedClient.isArchived ? "Archived" : selectedClient.status}
                                            </span>
                                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary capitalize font-bold">
                                                {selectedClient.subscriptionPlan || "starter"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{selectedClient.category} · {selectedClient.address}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {!selectedClient.isArchived && (
                                        <button onClick={() => handleSwitch(selectedClient)}
                                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs btn-primary text-white font-bold transition-all shadow-md shadow-primary/20">
                                            <Eye className="w-3.5 h-3.5" /> Impersonate Brand
                                        </button>
                                    )}
                                    <button onClick={() => handleToggleArchive(selectedClient)}
                                        className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                                            selectedClient.isArchived 
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" 
                                                : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                                        }`}>
                                        <Archive className="w-3.5 h-3.5" /> {selectedClient.isArchived ? "Restore Brand" : "Archive Brand"}
                                    </button>
                                </div>
                            </div>

                            {/* Drawer details body */}
                            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                                {/* Performance Stats Grid */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-secondary/15 border border-border/20 text-center">
                                        <span className="text-xl font-extrabold text-white block">
                                            {reviews.filter(r => r.businessId === selectedClient.id).length}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground uppercase">Reviews</span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-secondary/15 border border-border/20 text-center">
                                        <span className="text-xl font-extrabold text-white block">
                                            {reviews.filter(r => r.businessId === selectedClient.id).length
                                                ? (reviews.filter(r => r.businessId === selectedClient.id).reduce((sum, r) => sum + r.rating, 0) / reviews.filter(r => r.businessId === selectedClient.id).length).toFixed(1)
                                                : "N/A"
                                            } ★
                                        </span>
                                        <span className="text-[10px] text-muted-foreground uppercase">Avg Rating</span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-secondary/15 border border-border/20 text-center">
                                        <span className="text-xl font-extrabold text-white block">
                                            {reviews.filter(r => r.businessId === selectedClient.id).length
                                                ? Math.round((reviews.filter(r => r.businessId === selectedClient.id && r.status === "replied").length / reviews.filter(r => r.businessId === selectedClient.id).length) * 100)
                                                : 0
                                            }%
                                        </span>
                                        <span className="text-[10px] text-muted-foreground uppercase">Reply Rate</span>
                                    </div>
                                </div>

                                {/* assigned team members */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center border-b border-border/30 pb-2">
                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                            <UsersIcon className="w-4 h-4 text-primary" /> Assigned Agency Specialists
                                        </h4>
                                        {!selectedClient.isArchived && (
                                            <button onClick={openAssignTeamModal}
                                                className="text-[10px] text-primary hover:underline font-semibold flex items-center gap-1">
                                                <Settings className="w-3 h-3" /> Adjust Specialists
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {agencyStaff.filter(staff => {
                                            const saved = localStorage.getItem(`rms_agency_assigned_staff_${selectedClient.id}`);
                                            const list = saved ? JSON.parse(saved) : [];
                                            return list.includes(staff.id);
                                        }).map(staff => (
                                            <div key={staff.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/35 border border-border/50 rounded-xl text-xs">
                                                <div className="w-4.5 h-4.5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                                    {staff.name.charAt(0)}
                                                </div>
                                                <span className="text-white font-medium">{staff.name}</span>
                                            </div>
                                        ))}
                                        {agencyStaff.filter(staff => {
                                            const saved = localStorage.getItem(`rms_agency_assigned_staff_${selectedClient.id}`);
                                            const list = saved ? JSON.parse(saved) : [];
                                            return list.includes(staff.id);
                                        }).length === 0 && (
                                            <p className="text-xs text-muted-foreground leading-relaxed">No agency team members explicitly assigned to manage this client yet.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Locations */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-border/30 pb-2 flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-primary" /> Locations ({locations.filter(l => l.businessId === selectedClient.id).length})
                                    </h4>
                                    <div className="space-y-2">
                                        {locations.filter(l => l.businessId === selectedClient.id).map(loc => (
                                            <div key={loc.id} className="p-3 bg-secondary/10 border border-border/20 rounded-xl flex items-center justify-between text-xs">
                                                <div>
                                                    <span className="font-bold text-white block">{loc.name}</span>
                                                    <span className="text-[10px] text-muted-foreground">{loc.address}</span>
                                                </div>
                                                <span className="text-[10px] text-muted-foreground/60">Registered {new Date(loc.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Users */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-border/30 pb-2 flex items-center gap-1.5">
                                        <UsersIcon className="w-4 h-4 text-primary" /> Registered Brand Accounts ({usersList.filter(u => u.businessId === selectedClient.id).length})
                                    </h4>
                                    <div className="space-y-2">
                                        {usersList.filter(u => u.businessId === selectedClient.id).map(u => (
                                            <div key={u.id} className="p-3 bg-secondary/10 border border-border/20 rounded-xl flex items-center justify-between text-xs">
                                                <div>
                                                    <span className="font-bold text-white block">{u.name}</span>
                                                    <span className="text-[10px] text-muted-foreground">{u.email}</span>
                                                </div>
                                                <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold uppercase tracking-wider">{u.role}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                            <Building2 className="w-12 h-12 text-border mb-3" />
                            <h3 className="text-sm font-bold text-white mb-1">No Client Selected</h3>
                            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">Select a client business from the left index directory to review allocations, configure specialist teams, or impersonate dashboard screens.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Team assignment popup modal */}
            {teamModalOpen && selectedClient && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="glass-card rounded-2xl p-6 w-full max-w-md border border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-bold text-white flex items-center gap-1.5"><UsersIcon className="w-4.5 h-4.5 text-primary" /> Assign Agency Specialists</h3>
                            <button onClick={() => setTeamModalOpen(false)}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">Select the agency team members responsible for managing <strong>{selectedClient.name}</strong> reviews and alerts.</p>
                        
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {agencyStaff.map(staff => {
                                const isAssigned = assignedStaffIds.includes(staff.id);
                                return (
                                    <button key={staff.id} onClick={() => toggleStaffAssign(staff.id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                                            isAssigned 
                                                ? "bg-primary/10 border-primary text-white" 
                                                : "bg-secondary/20 border-border/60 text-muted-foreground hover:border-border hover:bg-secondary/40"
                                        }`}>
                                        <div>
                                            <span className="font-bold text-white block">{staff.name}</span>
                                            <span className="text-[10px] text-muted-foreground font-mono">{staff.email}</span>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase ${
                                            staff.agencyRole === "owner" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                                            staff.agencyRole === "manager" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                                            "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                        }`}>
                                            {staff.agencyRole}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <button onClick={saveTeamAssignments}
                            className="w-full py-2.5 mt-4 rounded-xl btn-primary text-white font-bold flex items-center justify-center gap-1">
                            <Check className="w-4 h-4" /> Save Assignments
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
