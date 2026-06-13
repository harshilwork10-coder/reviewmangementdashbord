"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    getBusinessById, getReviewsByBusiness, saveBusiness,
    replyToReview, deleteReview, updateReviewStatus, Review, Business,
    getUsers, createUser, updateUser, deleteUser, User, Role, addAuditLog
} from "@/lib/store";
import { generateAIReply } from "@/lib/ai-analysis";
import { 
    ArrowLeft, Star, Send, Sparkles, X, Trash2, Archive, Globe, 
    CreditCard, Users as UsersIcon, Settings, Shield, ShieldAlert, 
    Key, UserPlus, Power, Check, AlertTriangle, RefreshCw
} from "lucide-react";
import Link from "next/link";

export default function AdminMerchantDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [business, setBusiness] = useState<Business | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [orgUsers, setOrgUsers] = useState<User[]>([]);
    const [activeTab, setActiveTab] = useState<"reviews" | "billing" | "users">("reviews");
    
    // Review Modals & States
    const [replyModal, setReplyModal] = useState<Review | null>(null);
    const [replyText, setReplyText] = useState("");
    const [aiReplies, setAiReplies] = useState<{ text: string; tone: string }[]>([]);

    // User Modals & States
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userRole, setUserRole] = useState<Role>("owner");

    const [passwordResetModal, setPasswordResetModal] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState("");

    const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showNotification = (msg: string, type: "success" | "error" = "success") => {
        setNotification({ message: msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const refresh = () => {
        const biz = getBusinessById(id);
        if (biz) { 
            setBusiness(biz); 
            setReviews(getReviewsByBusiness(biz.id)); 
            setOrgUsers(getUsers().filter(u => u.businessId === biz.id));
        }
    };

    useEffect(() => { refresh(); }, [id]);

    const openReply = (r: Review) => { 
        setReplyModal(r); 
        setReplyText(r.reply || ""); 
        setAiReplies(generateAIReply(r)); 
    };

    const submitReply = () => {
        if (!replyModal || !replyText.trim()) return;
        replyToReview(replyModal.id, replyText, "Admin");
        setReplyModal(null); 
        setReplyText(""); 
        refresh();
        showNotification("Reply submitted successfully!");
    };

    // Billing Handlers
    const handlePlanChange = (plan: "starter" | "growth" | "agency" | "enterprise") => {
        if (!business) return;
        const oldPlan = business.subscriptionPlan || "starter";
        const updated = { ...business, subscriptionPlan: plan };
        saveBusiness(updated);
        setBusiness(updated);
        addAuditLog("Plan Upgrade/Downgrade", business.id, undefined, { oldPlan, newPlan: plan });
        showNotification(`Subscription plan updated to ${plan.toUpperCase()}!`);
    };

    const handleBillingStatusChange = (status: "paid" | "past_due" | "unpaid" | "paused") => {
        if (!business) return;
        const oldStatus = business.billingStatus || "paid";
        const updated = { ...business, billingStatus: status };
        saveBusiness(updated);
        setBusiness(updated);
        addAuditLog("Billing Status Changed", business.id, undefined, { oldStatus, newStatus: status });
        showNotification(`Billing status set to ${status.toUpperCase()}!`);
    };

    const handleFranchiseToggle = () => {
        if (!business) return;
        const updated = { ...business, isFranchise: !business.isFranchise };
        saveBusiness(updated);
        setBusiness(updated);
        addAuditLog("Franchise Option Toggled", business.id, undefined, { isFranchise: updated.isFranchise });
        showNotification(`Franchise mode ${updated.isFranchise ? "enabled" : "disabled"}`);
    };

    // User Handlers
    const openCreateUserModal = () => {
        setEditingUser(null);
        setUserName("");
        setUserEmail("");
        setUserPassword("");
        setUserRole("owner");
        setUserModalOpen(true);
    };

    const openEditUserModal = (u: User) => {
        setEditingUser(u);
        setUserName(u.name);
        setUserEmail(u.email);
        setUserPassword(""); // Don't prefill password
        setUserRole(u.role);
        setUserModalOpen(true);
    };

    const saveUserHandler = () => {
        if (!business) return;
        if (!userName.trim() || !userEmail.trim()) {
            showNotification("Name and Email are required", "error");
            return;
        }

        if (editingUser) {
            // Update User
            const updated = { 
                ...editingUser, 
                name: userName, 
                email: userEmail, 
                role: userRole 
            };
            updateUser(updated);
            addAuditLog("User Details Updated", business.id, undefined, { userId: updated.id, email: updated.email, role: updated.role });
            showNotification("User updated successfully");
        } else {
            // Create User
            if (!userPassword.trim()) {
                showNotification("Password is required for new users", "error");
                return;
            }
            const newUser = createUser({
                name: userName,
                email: userEmail,
                password: userPassword,
                role: userRole,
                businessId: business.id
            });
            addAuditLog("User Created", business.id, undefined, { userId: newUser.id, email: newUser.email, role: newUser.role });
            showNotification("New user account created");
        }
        setUserModalOpen(false);
        refresh();
    };

    const toggleUserStatus = (u: User) => {
        if (!business) return;
        const newStatus: "active" | "disabled" = u.status === "disabled" ? "active" : "disabled";
        const updated: User = { ...u, status: newStatus };
        updateUser(updated);
        addAuditLog(newStatus === "disabled" ? "User Disabled" : "User Re-enabled", business.id, undefined, { userId: u.id, email: u.email });
        showNotification(`User account is now ${newStatus}`);
        refresh();
    };

    const handlePasswordReset = () => {
        if (!business || !passwordResetModal || !newPassword.trim()) return;
        const updated = { ...passwordResetModal, password: newPassword };
        updateUser(updated);
        addAuditLog("User Password Reset", business.id, undefined, { userId: passwordResetModal.id, email: passwordResetModal.email });
        showNotification(`Password for ${passwordResetModal.name} has been reset`);
        setPasswordResetModal(null);
        setNewPassword("");
    };

    const handleDeleteUser = (userId: string, email: string) => {
        if (!business) return;
        if (confirm(`Are you sure you want to permanently delete user ${email}?`)) {
            deleteUser(userId);
            addAuditLog("User Deleted", business.id, undefined, { userId, email });
            showNotification("User deleted successfully");
            refresh();
        }
    };

    if (!business) return <div className="flex items-center justify-center h-screen"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;

    const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "N/A";

    return (
        <div className="h-screen overflow-y-auto p-8 relative">
            {/* Notification Banner */}
            {notification && (
                <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border text-sm font-semibold transition-all duration-300 ${
                    notification.type === "success" 
                        ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" 
                        : "bg-red-500/10 border-red-500/25 text-red-400"
                }`}>
                    {notification.type === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    {notification.message}
                </div>
            )}

            <button onClick={() => router.push("/admin/merchants")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Merchants
            </button>

            {/* Business Header */}
            <div className="glass-card rounded-2xl p-6 mb-6 border border-border/60">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl">{business.logo}</div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-bold text-white">{business.name}</h1>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${business.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>{business.status}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium border border-primary/20 capitalize">{business.subscriptionPlan || "starter"} Plan</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{business.category} · {business.address}</p>
                        <p className="text-xs text-muted-foreground mt-1">{business.phone} · {business.website}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-white">{avg}★</div>
                        <div className="text-xs text-muted-foreground">{reviews.length} reviews</div>
                        <Link href={`/business/${business.slug}`} target="_blank"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                            <Globe className="w-3 h-3" /> Public page
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-border/60 mb-6 gap-2">
                {[
                    { id: "reviews", label: "Reviews & AI Responses", icon: Star },
                    { id: "billing", label: "Subscription & Billing", icon: CreditCard },
                    { id: "users", label: "Organization Users", icon: UsersIcon }
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
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content Tabs */}
            {activeTab === "reviews" && (
                <div>
                    <h2 className="text-base font-semibold text-white mb-4">All Reviews ({reviews.length})</h2>
                    <div className="space-y-4">
                        {reviews.map(review => (
                            <div key={review.id} className="glass-card rounded-2xl p-5 border border-border/60">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500/40 to-orange-500/40 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                                        {review.customerName.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-foreground">{review.customerName}</span>
                                                <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-3 h-3 ${i <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />)}</div>
                                            </div>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${review.status === "replied" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>{review.status}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">{review.text}</p>
                                        {review.reply && (
                                            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-3">
                                                <p className="text-xs text-primary font-medium mb-1">Reply · {review.repliedBy}</p>
                                                <p className="text-xs text-muted-foreground">{review.reply}</p>
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <button onClick={() => openReply(review)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">
                                                <Sparkles className="w-3 h-3" /> {review.reply ? "Edit Reply" : "Reply as Admin"}
                                            </button>
                                            <button onClick={() => { updateReviewStatus(review.id, "archived"); refresh(); }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-secondary text-muted-foreground border border-border hover:text-foreground transition-colors">
                                                <Archive className="w-3 h-3" /> Archive
                                            </button>
                                            <button onClick={() => { if (confirm("Delete?")) { deleteReview(review.id); refresh(); } }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors ml-auto">
                                                <Trash2 className="w-3 h-3" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {reviews.length === 0 && (
                            <div className="py-12 text-center text-muted-foreground text-sm">No reviews found.</div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === "billing" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Plan Config */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60 md:col-span-2 space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Plan & Limits Configuration</h3>
                            <p className="text-xs text-muted-foreground">Modify subscription tier, plan features, and operational limits.</p>
                        </div>

                        {/* Plan selection grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { id: "starter", name: "Starter", price: "$29/mo", desc: "1 location limit, essential monitoring" },
                                { id: "growth", name: "Growth", price: "$79/mo", desc: "5 locations limit, campaigns, AI drafts" },
                                { id: "agency", name: "Agency", price: "$199/mo", desc: "Unlimited locations, custom phone codes" },
                                { id: "enterprise", name: "Enterprise", price: "$999/mo", desc: "Unlimited locations, AI auto-replies, SLA support" }
                            ].map(tier => {
                                const selected = (business.subscriptionPlan || "starter") === tier.id;
                                return (
                                    <button key={tier.id} onClick={() => handlePlanChange(tier.id as any)}
                                        className={`p-4 rounded-xl text-left border transition-all ${
                                            selected 
                                                ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(239,68,68,0.1)] text-white" 
                                                : "bg-secondary/20 border-border/60 text-muted-foreground hover:border-border hover:bg-secondary/40"
                                        }`}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-sm text-foreground">{tier.name}</span>
                                            <span className="text-xs text-primary font-semibold">{tier.price}</span>
                                        </div>
                                        <p className="text-[11px] leading-snug">{tier.desc}</p>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Billing Status selection */}
                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-white block">Billing Status</label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { id: "paid", label: "Paid / Active", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                                    { id: "past_due", label: "Past Due / Warning", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
                                    { id: "unpaid", label: "Unpaid / Suspended", color: "bg-red-500/10 text-red-400 border-red-500/20" },
                                    { id: "paused", label: "Paused", color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" }
                                ].map(st => {
                                    const selected = (business.billingStatus || "paid") === st.id;
                                    return (
                                        <button key={st.id} onClick={() => handleBillingStatusChange(st.id as any)}
                                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                                                selected 
                                                    ? `${st.color} ring-2 ring-primary/40` 
                                                    : "bg-secondary/35 border-border text-muted-foreground hover:bg-secondary/60"
                                            }`}>
                                            {st.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Enterprise Settings / Franchise */}
                        <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold text-white block">Franchise & Multi-Entity Mode</span>
                                <span className="text-[10px] text-muted-foreground">Allows entity to group multiple location managers and aggregate analytics reporting.</span>
                            </div>
                            <button onClick={handleFranchiseToggle}
                                className={`w-12 h-6.5 rounded-full p-1 transition-colors flex items-center ${
                                    business.isFranchise ? "bg-primary justify-end" : "bg-secondary border border-border justify-start"
                                }`}>
                                <div className="w-4.5 h-4.5 rounded-full bg-white shadow-md" />
                            </button>
                        </div>
                    </div>

                    {/* Quick limits summary */}
                    <div className="glass-card rounded-2xl p-6 border border-border/60 h-fit space-y-5">
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                            <Settings className="w-4 h-4 text-primary" /> Active Limits & Allocation
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-muted-foreground">Max Locations limit</span>
                                    <span className="font-semibold text-white">
                                        {business.subscriptionPlan === "starter" ? "1" : business.subscriptionPlan === "growth" ? "5" : "Unlimited"}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{
                                        width: business.subscriptionPlan === "starter" ? "100%" : business.subscriptionPlan === "growth" ? "40%" : "10%"
                                    }} />
                                </div>
                            </div>

                            <div className="space-y-2 text-xs">
                                <span className="text-[11px] text-muted-foreground block border-b border-border/30 pb-1.5 uppercase font-bold tracking-wider">Features Access</span>
                                <div className="flex items-center justify-between py-1">
                                    <span>AI Assistant reply suggestions</span>
                                    <span className="text-emerald-400 font-bold">Enabled</span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <span>Custom SMS sender IDs</span>
                                    <span className={business.subscriptionPlan === "agency" || business.subscriptionPlan === "enterprise" ? "text-emerald-400 font-bold" : "text-muted-foreground"}>
                                        {business.subscriptionPlan === "agency" || business.subscriptionPlan === "enterprise" ? "Enabled" : "Disabled"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <span>Automated response sync</span>
                                    <span className={business.subscriptionPlan === "enterprise" ? "text-emerald-400 font-bold animate-pulse" : "text-muted-foreground"}>
                                        {business.subscriptionPlan === "enterprise" ? "Auto-pilot" : "Manual review"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "users" && (
                <div>
                    <div className="flex justify-between items-center mb-5">
                        <div>
                            <h3 className="text-sm font-bold text-white">Organization Users</h3>
                            <p className="text-xs text-muted-foreground">List of staff members, managers, and administrators assigned to this organization.</p>
                        </div>
                        <button onClick={openCreateUserModal}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all font-semibold">
                            <UserPlus className="w-3.5 h-3.5" /> Add New User
                        </button>
                    </div>

                    <div className="glass-card rounded-2xl overflow-hidden border border-border/60">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/60">
                                    <th className="text-left px-5 py-3.5 text-xs font-bold text-muted-foreground">User</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-bold text-muted-foreground">Email</th>
                                    <th className="text-center px-5 py-3.5 text-xs font-bold text-muted-foreground">Access Role</th>
                                    <th className="text-center px-5 py-3.5 text-xs font-bold text-muted-foreground">Status</th>
                                    <th className="text-right px-5 py-3.5 text-xs font-bold text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orgUsers.map(u => (
                                    <tr key={u.id} className="border-b border-border/30 hover:bg-secondary/15 transition-all">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center text-xs font-bold text-white">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-white leading-none mb-1">{u.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">Joined {new Date(u.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-muted-foreground">{u.email}</td>
                                        <td className="px-5 py-4 text-center">
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-primary/20 bg-primary/10 text-primary uppercase tracking-wider">
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                                u.status === "disabled" 
                                                    ? "bg-red-500/10 border-red-500/20 text-red-400" 
                                                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                            }`}>
                                                {u.status === "disabled" ? "disabled" : "active"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEditUserModal(u)}
                                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-white bg-secondary/50 hover:bg-secondary transition-all"
                                                    title="Edit User">
                                                    <Settings className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => setPasswordResetModal(u)}
                                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-white bg-secondary/50 hover:bg-secondary transition-all"
                                                    title="Reset Password">
                                                    <Key className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => toggleUserStatus(u)}
                                                    className={`p-1.5 rounded-lg transition-all border ${
                                                        u.status === "disabled" 
                                                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20" 
                                                            : "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                                                    }`}
                                                    title={u.status === "disabled" ? "Enable User" : "Disable User"}>
                                                    <Power className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => handleDeleteUser(u.id, u.email)}
                                                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all"
                                                    title="Delete User">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {orgUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground">No users registered for this organization yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Reply Modal */}
            {replyModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="glass-card rounded-2xl p-6 w-full max-w-lg border border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">Admin Reply</h3>
                            <button onClick={() => setReplyModal(null)}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
                        </div>
                        <div className="p-3 rounded-xl bg-secondary/50 mb-4">
                            <span className="text-sm font-medium">{replyModal.customerName}</span>
                            <p className="text-xs text-muted-foreground mt-1">{replyModal.text}</p>
                        </div>
                        <div className="space-y-2 mb-3">
                            {aiReplies.map((r, i) => (
                                <button key={i} onClick={() => setReplyText(r.text)}
                                    className="w-full text-left p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                                    <span className="text-xs text-purple-400 font-medium capitalize block mb-1">{r.tone}</span>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{r.text}</p>
                                </button>
                            ))}
                        </div>
                        <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={4}
                            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:border-primary text-sm resize-none mb-4" />
                        <button onClick={submitReply} disabled={!replyText.trim()}
                            className="w-full py-3 rounded-xl btn-primary text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                            <Send className="w-4 h-4" /> Send Reply
                        </button>
                    </div>
                </div>
            )}

            {/* Create/Edit User Modal */}
            {userModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="glass-card rounded-2xl p-6 w-full max-w-md border border-border/80">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-bold text-white">{editingUser ? "Edit User Details" : "Create Organization Account"}</h3>
                            <button onClick={() => setUserModalOpen(false)}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Full Name</label>
                                <input value={userName} onChange={e => setUserName(e.target.value)} placeholder="e.g. John Doe"
                                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white text-sm focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email Address</label>
                                <input type="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} placeholder="e.g. john@company.com"
                                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white text-sm focus:outline-none focus:border-primary" />
                            </div>
                            {!editingUser && (
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Password</label>
                                    <input type="password" value={userPassword} onChange={e => setUserPassword(e.target.value)} placeholder="Minimum 6 characters"
                                        className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white text-sm focus:outline-none focus:border-primary" />
                                </div>
                            )}
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Access Role</label>
                                <select value={userRole} onChange={e => setUserRole(e.target.value as Role)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white text-sm focus:outline-none focus:border-primary">
                                    <option value="owner" className="bg-neutral-900">Owner (Admin access)</option>
                                    <option value="manager" className="bg-neutral-900">Manager (Operations, replies)</option>
                                    <option value="readonly" className="bg-neutral-900">Read Only</option>
                                </select>
                            </div>

                            <button onClick={saveUserHandler}
                                className="w-full py-2.5 mt-2 rounded-xl btn-primary text-white font-semibold flex items-center justify-center gap-1">
                                <Check className="w-4 h-4" /> {editingUser ? "Apply Changes" : "Create Account"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Reset Modal */}
            {passwordResetModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="glass-card rounded-2xl p-6 w-full max-w-sm border border-border/80">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Key className="w-4 h-4 text-primary" /> Reset Password</h3>
                            <button onClick={() => setPasswordResetModal(null)}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">Assign a new password for <strong>{passwordResetModal.name}</strong> ({passwordResetModal.email}).</p>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground mb-1 block">New Password</label>
                                <input type="text" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Type new password"
                                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white text-sm focus:outline-none focus:border-primary" />
                            </div>
                            <button onClick={handlePasswordReset} disabled={!newPassword.trim()}
                                className="w-full py-2.5 rounded-xl btn-primary text-white font-semibold flex items-center justify-center gap-1 disabled:opacity-50">
                                <Check className="w-4 h-4" /> Reset Password
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
