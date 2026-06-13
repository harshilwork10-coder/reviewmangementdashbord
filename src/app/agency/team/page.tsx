"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { 
    getUsers, createUser, updateUser, deleteUser, User, Role, addAuditLog 
} from "@/lib/store";
import { 
    Users, UserPlus, Settings, Trash2, Key, Power, X, Check, 
    ShieldAlert, ShieldCheck, Mail, Calendar, KeyRound
} from "lucide-react";

export default function AgencyTeamPage() {
    const { user } = useAuth();
    
    // Core states
    const [team, setTeam] = useState<User[]>([]);
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [passwordModalOpen, setPasswordModalOpen] = useState<User | null>(null);

    // Form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agencyRole, setAgencyRole] = useState<"owner" | "manager" | "staff" | "readonly">("staff");
    const [newPassword, setNewPassword] = useState("");

    // Custom Permissions states
    const [canManageClients, setCanManageClients] = useState(true);
    const [canManageReviews, setCanManageReviews] = useState(true);
    const [canViewReports, setCanViewReports] = useState(true);
    const [canManageTeam, setCanManageTeam] = useState(false);

    const [notification, setNotification] = useState<string | null>(null);

    const showNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const refresh = () => {
        if (user && user.agencyId) {
            const allUsers = getUsers();
            const agencyUsers = allUsers.filter(u => u.agencyId === user.agencyId);
            setTeam(agencyUsers);
        }
    };

    useEffect(() => {
        refresh();
    }, [user]);

    const handleOpenCreateModal = () => {
        setEditingUser(null);
        setName("");
        setEmail("");
        setPassword("");
        setAgencyRole("staff");
        
        // Reset permissions checkboxes
        setCanManageClients(true);
        setCanManageReviews(true);
        setCanViewReports(true);
        setCanManageTeam(false);
        
        setUserModalOpen(true);
    };

    const handleOpenEditModal = (u: User) => {
        setEditingUser(u);
        setName(u.name);
        setEmail(u.email);
        setPassword("");
        setAgencyRole(u.agencyRole || "staff");
        
        // Load custom permissions from localstorage or map from role
        const permissions = getSavedPermissions(u.id, u.agencyRole || "staff");
        setCanManageClients(permissions.clients);
        setCanManageReviews(permissions.reviews);
        setCanViewReports(permissions.reports);
        setCanManageTeam(permissions.team);
        
        setUserModalOpen(true);
    };

    const getSavedPermissions = (userId: string, role: string) => {
        const key = `rms_agency_perms_${userId}`;
        const saved = localStorage.getItem(key);
        if (saved) return JSON.parse(saved);
        
        // Default mappings based on role
        return {
            clients: role !== "readonly",
            reviews: role !== "readonly",
            reports: true,
            team: role === "owner" || role === "manager"
        };
    };

    const handleSaveUser = () => {
        if (!user || !user.agencyId) return;

        if (!name.trim() || !email.trim()) {
            alert("Please provide Name and Email");
            return;
        }

        if (editingUser) {
            // Update
            const updated: User = {
                ...editingUser,
                name,
                email,
                agencyRole
            };
            updateUser(updated);
            
            // Save custom permissions
            localStorage.setItem(`rms_agency_perms_${editingUser.id}`, JSON.stringify({
                clients: canManageClients,
                reviews: canManageReviews,
                reports: canViewReports,
                team: canManageTeam
            }));

            addAuditLog("Agency Team Member Updated", undefined, user.id, { memberId: editingUser.id, email, agencyRole });
            showNotification("Team member updated successfully");
        } else {
            // Create
            if (!password.trim()) {
                alert("Password is required for new accounts");
                return;
            }
            const created = createUser({
                name,
                email,
                password,
                role: "agency", // all agency team members are role: agency
                agencyId: user.agencyId,
                agencyRole: agencyRole
            });

            // Save custom permissions
            localStorage.setItem(`rms_agency_perms_${created.id}`, JSON.stringify({
                clients: canManageClients,
                reviews: canManageReviews,
                reports: canViewReports,
                team: canManageTeam
            }));

            addAuditLog("Agency Team Member Invited", undefined, user.id, { memberId: created.id, email, agencyRole });
            showNotification("New team member account created");
        }
        setUserModalOpen(false);
        refresh();
    };

    const handleToggleStatus = (u: User) => {
        if (!user || u.id === user.id) return; // cannot disable yourself
        const newStatus = u.status === "disabled" ? "active" : "disabled";
        const updated: User = {
            ...u,
            status: newStatus as any
        };
        updateUser(updated);
        addAuditLog(newStatus === "disabled" ? "Agency Member Disabled" : "Agency Member Re-enabled", undefined, user.id, { memberId: u.id, email: u.email });
        showNotification(`Team member is now ${newStatus}`);
        refresh();
    };

    const handleDeleteMember = (u: User) => {
        if (!user || u.id === user.id) return;
        if (confirm(`Are you sure you want to permanently delete team member ${u.email}?`)) {
            deleteUser(u.id);
            localStorage.removeItem(`rms_agency_perms_${u.id}`);
            addAuditLog("Agency Team Member Deleted", undefined, user.id, { memberId: u.id, email: u.email });
            showNotification("Team member removed from agency catalog");
            refresh();
        }
    };

    const handleResetPassword = () => {
        if (!user || !passwordModalOpen || !newPassword.trim()) return;
        const updated = {
            ...passwordModalOpen,
            password: newPassword
        };
        updateUser(updated);
        addAuditLog("Agency Member Password Reset", undefined, user.id, { memberId: passwordModalOpen.id, email: passwordModalOpen.email });
        showNotification("Password reset successfully");
        setPasswordModalOpen(null);
        setNewPassword("");
    };

    return (
        <div className="h-screen overflow-y-auto p-8 bg-background text-foreground relative flex flex-col">
            {/* Notification Banner */}
            {notification && (
                <div className="fixed top-4 right-4 z-[100] px-4 py-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-semibold transition-all">
                    <Check className="w-4 h-4" />
                    {notification}
                </div>
            )}

            {/* Page Title */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Users className="w-6 h-6 text-primary" /> Team Management
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Register agency colleagues, set specialized roles, and control dashboards permissions.
                    </p>
                </div>
                {user?.agencyRole === "owner" && (
                    <button onClick={handleOpenCreateModal}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs bg-primary hover:bg-primary/95 text-white font-bold transition-all shadow-lg shadow-primary/20">
                        <UserPlus className="w-4 h-4" /> Add Team Member
                    </button>
                )}
            </div>

            {/* Team Directory Table */}
            <div className="glass-card rounded-2xl overflow-hidden border border-border/60">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border/60">
                            <th className="text-left px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase">Member Name</th>
                            <th className="text-left px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase">Email Address</th>
                            <th className="text-center px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase">Access Role</th>
                            <th className="text-center px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase">Status</th>
                            <th className="text-right px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {team.map(member => {
                            const isSelf = member.id === user?.id;
                            return (
                                <tr key={member.id} className="border-b border-border/30 hover:bg-secondary/15 transition-all">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center text-xs font-bold text-white">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white leading-none mb-1 flex items-center gap-1.5">
                                                    {member.name}
                                                    {isSelf && <span className="text-[9px] bg-secondary/85 border border-border/30 px-1 py-0.5 rounded text-white font-bold">YOU</span>}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground">Registered {new Date(member.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-xs font-mono text-muted-foreground">{member.email}</td>
                                    <td className="px-5 py-4 text-center">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
                                            member.agencyRole === "owner" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                                            member.agencyRole === "manager" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                                            member.agencyRole === "staff" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                                            "bg-zinc-500/10 border-zinc-500/20 text-zinc-400"
                                        }`}>
                                            Agency {member.agencyRole}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                            member.status === "disabled"
                                                ? "bg-red-500/10 border-red-500/20 text-red-400"
                                                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                        }`}>
                                            {member.status === "disabled" ? "disabled" : "active"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Edit */}
                                            {user?.agencyRole === "owner" && (
                                                <button onClick={() => handleOpenEditModal(member)}
                                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-white bg-secondary/50 hover:bg-secondary transition-all"
                                                    title="Configure Permissions">
                                                    <Settings className="w-3.5 h-3.5" />
                                                </button>
                                            )}

                                            {/* Reset password */}
                                            {user?.agencyRole === "owner" && (
                                                <button onClick={() => setPasswordModalOpen(member)}
                                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-white bg-secondary/50 hover:bg-secondary transition-all"
                                                    title="Reset Password">
                                                    <Key className="w-3.5 h-3.5" />
                                                </button>
                                            )}

                                            {/* Disable toggle */}
                                            {user?.agencyRole === "owner" && !isSelf && (
                                                <button onClick={() => handleToggleStatus(member)}
                                                    className={`p-1.5 rounded-lg border transition-all ${
                                                        member.status === "disabled"
                                                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                                                            : "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                                                    }`}
                                                    title={member.status === "disabled" ? "Enable Account" : "Disable Account"}>
                                                    <Power className="w-3.5 h-3.5" />
                                                </button>
                                            )}

                                            {/* Delete */}
                                            {user?.agencyRole === "owner" && !isSelf && (
                                                <button onClick={() => handleDeleteMember(member)}
                                                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all"
                                                    title="Delete Member">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Invite/Edit Member Modal */}
            {userModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="glass-card rounded-2xl p-6 w-full max-w-md border border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-bold text-white">{editingUser ? "Configure Specialists Permissions" : "Invite Agency Specialist"}</h3>
                            <button onClick={() => setUserModalOpen(false)}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
                        </div>
                        <div className="space-y-4 text-xs">
                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Full Name</label>
                                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sarah Smith"
                                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Email Address</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. sarah@agency.com"
                                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none focus:border-primary" />
                            </div>
                            {!editingUser && (
                                <div>
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Assign Password</label>
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Type temporary password"
                                        className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none focus:border-primary" />
                                </div>
                            )}
                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Access Role</label>
                                <select value={agencyRole} onChange={e => setAgencyRole(e.target.value as any)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none focus:border-primary">
                                    <option value="owner" className="bg-neutral-900">Agency Owner (Full Control)</option>
                                    <option value="manager" className="bg-neutral-900">Agency Manager (Clients, reports)</option>
                                    <option value="staff" className="bg-neutral-900">Agency Staff (Manage reviews)</option>
                                    <option value="readonly" className="bg-neutral-900">Read Only View</option>
                                </select>
                            </div>

                            {/* Permissions checkboxes */}
                            <div className="pt-2 border-t border-border/30 space-y-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Fine-tuned Permissions</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <label className="flex items-center gap-2 p-2 rounded bg-secondary/35 border border-border/40 cursor-pointer">
                                        <input type="checkbox" checked={canManageClients} onChange={() => setCanManageClients(!canManageClients)}
                                            className="rounded text-primary focus:ring-0 bg-transparent border-border" />
                                        <span>Manage Clients</span>
                                    </label>
                                    <label className="flex items-center gap-2 p-2 rounded bg-secondary/35 border border-border/40 cursor-pointer">
                                        <input type="checkbox" checked={canManageReviews} onChange={() => setCanManageReviews(!canManageReviews)}
                                            className="rounded text-primary focus:ring-0 bg-transparent border-border" />
                                        <span>Manage Reviews</span>
                                    </label>
                                    <label className="flex items-center gap-2 p-2 rounded bg-secondary/35 border border-border/40 cursor-pointer">
                                        <input type="checkbox" checked={canViewReports} onChange={() => setCanViewReports(!canViewReports)}
                                            className="rounded text-primary focus:ring-0 bg-transparent border-border" />
                                        <span>View Reports</span>
                                    </label>
                                    <label className="flex items-center gap-2 p-2 rounded bg-secondary/35 border border-border/40 cursor-pointer">
                                        <input type="checkbox" checked={canManageTeam} onChange={() => setCanManageTeam(!canManageTeam)}
                                            className="rounded text-primary focus:ring-0 bg-transparent border-border" />
                                        <span>Manage Team</span>
                                    </label>
                                </div>
                            </div>

                            <button onClick={handleSaveUser}
                                className="w-full py-2.5 mt-2 rounded-xl btn-primary text-white font-bold flex items-center justify-center gap-1.5">
                                <Check className="w-4 h-4" /> {editingUser ? "Apply Changes" : "Create Specialist Account"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Reset Modal */}
            {passwordModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="glass-card rounded-2xl p-6 w-full max-w-sm border border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><KeyRound className="w-4 h-4 text-primary" /> Reset Password</h3>
                            <button onClick={() => setPasswordModalOpen(null)}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">Assign a new password for agency member <strong>{passwordModalOpen.name}</strong>.</p>
                        <div className="space-y-4 text-xs">
                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">New Password</label>
                                <input type="text" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Type new password"
                                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none focus:border-primary" />
                            </div>
                            <button onClick={handleResetPassword} disabled={!newPassword.trim()}
                                className="w-full py-2.5 rounded-xl btn-primary text-white font-bold flex items-center justify-center gap-1 disabled:opacity-50">
                                <Check className="w-4 h-4" /> Reset Password
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
