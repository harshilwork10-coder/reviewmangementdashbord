"use client";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBusinessByOwner, saveBusiness, Business, Location, getLocationsByBusiness, addLocation, deleteLocation, User, Role, simulateTrialDay, resetOnboardingState } from "@/lib/store";
import { Save, Copy, Check, Globe, MapPin, CreditCard, Users as UsersIcon, Plus, Trash2, Shield, AlertTriangle, Building, Lock, Sparkles, Sliders, Smartphone, MailOpen, Terminal } from "lucide-react";

const CATEGORIES = ["Restaurant", "Retail", "Liquor Store", "Clinic", "Salon", "Hotel", "Gym", "Cafe", "Other"];

const PLAN_INFO = {
    starter: { name: "Starter", price: 29, limit: 1, desc: "Best for single-location local businesses." },
    growth: { name: "Growth", price: 79, limit: 5, desc: "Perfect for growing brands and multi-location sites." },
    agency: { name: "Agency", price: 199, limit: 9999, desc: "For marketing agencies managing multiple brands." },
    enterprise: { name: "Enterprise", price: 999, limit: 9999, desc: "Custom features and scale for national chains." },
};

export default function SettingsPage() {
    const { user, hasPermission } = useAuth();
    const router = useRouter();
    const [business, setBusiness] = useState<Business | null>(null);
    const [activeTab, setActiveTab] = useState<"profile" | "locations" | "billing" | "team">("profile");

    // Profile state
    const [form, setForm] = useState({ name: "", category: "", description: "", phone: "", website: "", address: "", brandVoice: "" });
    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);

    // Locations state
    const [locations, setLocations] = useState<Location[]>([]);
    const [newLocName, setNewLocName] = useState("");
    const [newLocAddress, setNewLocAddress] = useState("");
    const [locError, setLocError] = useState<string | null>(null);

    // Team management state
    const [team, setTeam] = useState<User[]>([]);
    const [newUserName, setNewUserName] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserRole, setNewUserRole] = useState<Role>("manager");
    const [teamError, setTeamError] = useState<string | null>(null);

    const refreshData = () => {
        if (!user) return;
        const biz = getBusinessByOwner(user.id);
        if (biz) {
            setBusiness(biz);
            setForm({
                name: biz.name,
                category: biz.category,
                description: biz.description,
                phone: biz.phone,
                website: biz.website,
                address: biz.address,
                brandVoice: biz.brandVoice || ""
            });
            
            // Get locations
            setLocations(getLocationsByBusiness(biz.id));

            // Get team
            if (typeof window !== "undefined") {
                const allUsers = JSON.parse(localStorage.getItem("rms_users") || "[]");
                setTeam(allUsers.filter((u: User) => u.businessId === biz.id));
            }
        }
    };

    useEffect(() => {
        refreshData();
    }, [user]);

    const setF = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setForm(f => ({ ...f, [k]: e.target.value }));

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        if (!business) return;
        if (!hasPermission("edit")) return;
        const updated = { ...business, ...form };
        saveBusiness(updated);
        setBusiness(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleAddLocation = (e: React.FormEvent) => {
        e.preventDefault();
        if (!business) return;
        if (!hasPermission("create")) return;
        
        const plan = business.subscriptionPlan || "starter";
        const limit = PLAN_INFO[plan].limit;
        if (locations.length >= limit) {
            setLocError(`Location limit reached for your ${PLAN_INFO[plan].name} plan (${limit} location max). Upgrade your plan to add more locations.`);
            return;
        }

        const added = addLocation({
            businessId: business.id,
            name: newLocName,
            address: newLocAddress
        });

        if (added) {
            setNewLocName("");
            setNewLocAddress("");
            setLocError(null);
            refreshData();
        } else {
            setLocError("Could not add location. Plan limit reached.");
        }
    };

    const handleDeleteLocation = (id: string) => {
        if (!hasPermission("delete")) return;
        deleteLocation(id);
        refreshData();
    };

    const handleUpdatePlan = (newPlan: "starter" | "growth" | "agency" | "enterprise") => {
        if (!business) return;
        if (!hasPermission("billing")) return;
        const updated = { ...business, subscriptionPlan: newPlan };
        saveBusiness(updated);
        setBusiness(updated);
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!business) return;
        if (!hasPermission("user_management")) return;

        if (team.some(u => u.email.toLowerCase() === newUserEmail.toLowerCase())) {
            setTeamError("A user with this email address already exists.");
            return;
        }

        if (typeof window !== "undefined") {
            const all = JSON.parse(localStorage.getItem("rms_users") || "[]");
            const newUserObj: User = {
                id: `user-${Date.now()}`,
                name: newUserName,
                email: newUserEmail,
                role: newUserRole,
                businessId: business.id,
                password: "password123",
                createdAt: new Date().toISOString()
            };
            all.push(newUserObj);
            localStorage.setItem("rms_users", JSON.stringify(all));
            
            setNewUserName("");
            setNewUserEmail("");
            setNewUserRole("manager");
            setTeamError(null);
            refreshData();
        }
    };

    const handleDeleteUser = (userId: string) => {
        if (!hasPermission("user_management")) return;
        if (user && user.id === userId) {
            setTeamError("You cannot remove yourself from the team.");
            return;
        }
        if (typeof window !== "undefined") {
            const all = JSON.parse(localStorage.getItem("rms_users") || "[]");
            const filtered = all.filter((u: User) => u.id !== userId);
            localStorage.setItem("rms_users", JSON.stringify(filtered));
            setTeamError(null);
            refreshData();
        }
    };

    const handleRoleChange = (userId: string, role: Role) => {
        if (!hasPermission("user_management")) return;
        if (typeof window !== "undefined") {
            const all = JSON.parse(localStorage.getItem("rms_users") || "[]");
            const idx = all.findIndex((u: User) => u.id === userId);
            if (idx >= 0) {
                all[idx].role = role;
                localStorage.setItem("rms_users", JSON.stringify(all));
                refreshData();
            }
        }
    };

    const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/business/${business?.slug}` : "";

    const copyLink = () => {
        navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!business) {
        return <div className="flex items-center justify-center p-12"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;
    }

    const currentPlan = business.subscriptionPlan || "starter";
    const canEdit = hasPermission("edit");
    const canManageBilling = hasPermission("billing");
    const canManageUsers = hasPermission("user_management");

    return (
        <div className="h-screen overflow-y-auto p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-muted-foreground text-sm mt-1">Configure your reputation profile, locations, subscription plans, and team access.</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-border/80 gap-6 mb-8">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`pb-4 text-sm font-semibold transition-all relative ${
                        activeTab === "profile" ? "text-white" : "text-muted-foreground hover:text-white"
                    }`}>
                    Business Profile
                    {activeTab === "profile" && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />}
                </button>
                <button
                    onClick={() => setActiveTab("locations")}
                    className={`pb-4 text-sm font-semibold transition-all relative ${
                        activeTab === "locations" ? "text-white" : "text-muted-foreground hover:text-white"
                    }`}>
                    Locations
                    {activeTab === "locations" && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />}
                </button>
                <button
                    onClick={() => setActiveTab("billing")}
                    className={`pb-4 text-sm font-semibold transition-all relative ${
                        activeTab === "billing" ? "text-white" : "text-muted-foreground hover:text-white"
                    }`}>
                    Billing & Subscriptions
                    {activeTab === "billing" && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />}
                </button>
                <button
                    onClick={() => setActiveTab("team")}
                    className={`pb-4 text-sm font-semibold transition-all relative ${
                        activeTab === "team" ? "text-white" : "text-muted-foreground hover:text-white"
                    }`}>
                    Team Management
                    {activeTab === "team" && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />}
                </button>
            </div>

            <div className="max-w-4xl">
                {/* 1. PROFILE TAB */}
                {activeTab === "profile" && (
                    <div className="space-y-6">
                        {/* Public Link Card */}
                        <div className="glass-card rounded-2xl p-5 bg-secondary/10 border border-border/60">
                            <div className="flex items-center gap-2 mb-3">
                                <Globe className="w-4 h-4 text-primary" />
                                <h2 className="text-sm font-semibold text-foreground">Your Public Review Page</h2>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">Share this link with customers so they can leave reviews for your business.</p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 px-3 py-2 rounded-xl bg-secondary/50 border border-border text-xs text-muted-foreground font-mono truncate">
                                    {publicUrl || "Loading..."}
                                </div>
                                <button onClick={copyLink}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary border border-border hover:bg-secondary/80 text-white transition-colors text-xs font-medium flex-shrink-0 cursor-pointer">
                                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                            </div>
                        </div>

                        {/* Profile Edit Card */}
                        <div className="glass-card rounded-2xl p-6">
                            <h2 className="text-sm font-semibold text-foreground mb-5">Business Profile</h2>
                            
                            {!canEdit && (
                                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Read-Only mode. Saving changes is disabled.
                                </div>
                            )}

                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Business Name</label>
                                        <input value={form.name} onChange={setF("name")} required disabled={!canEdit}
                                            className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:border-primary transition-colors text-sm disabled:opacity-50 text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Category</label>
                                        <select value={form.category} onChange={setF("category")} disabled={!canEdit}
                                            className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:border-primary transition-colors text-sm disabled:opacity-50 text-white">
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label>
                                    <textarea value={form.description} onChange={setF("description")} rows={3} disabled={!canEdit}
                                        placeholder="Tell customers about your business..."
                                        className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm resize-none disabled:opacity-50 text-white" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Phone</label>
                                        <input value={form.phone} onChange={setF("phone")} placeholder="(312) 555-0100" disabled={!canEdit}
                                            className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm disabled:opacity-50 text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Website</label>
                                        <input value={form.website} onChange={setF("website")} placeholder="https://yourbusiness.com" disabled={!canEdit}
                                            className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm disabled:opacity-50 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3 text-purple-400" /> Custom AI Brand Voice guidelines
                                    </label>
                                    <textarea value={form.brandVoice} onChange={setF("brandVoice")} rows={3} disabled={!canEdit}
                                        placeholder="Describe your brand voice and response guidelines (e.g. 'Warm and friendly, culinary-focused, thank the customer, use emojis...')"
                                        className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm resize-none disabled:opacity-50 text-white" />
                                </div>
                                <button type="submit" disabled={!canEdit}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                                        canEdit ? "bg-primary hover:bg-primary/90 text-white cursor-pointer" : "bg-secondary text-muted-foreground cursor-not-allowed border border-border"
                                    }`}>
                                    {saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                                    {saved ? "Saved!" : "Save Changes"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* 2. LOCATIONS TAB */}
                {activeTab === "locations" && (
                    <div className="space-y-6">
                        <div className="glass-card rounded-2xl p-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-white mb-1">Location Settings</h2>
                                    <p className="text-xs text-muted-foreground">
                                        Setup Type: <span className="text-primary font-semibold capitalize">
                                            {business.isFranchise ? "Franchise Setup" : locations.length > 1 ? "Multi-Location Setup" : "Single Location"}
                                        </span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-semibold text-white">
                                        Locations Limit: {locations.length} / {PLAN_INFO[currentPlan].limit === 9999 ? "Unlimited" : PLAN_INFO[currentPlan].limit}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">Active plan: <span className="capitalize">{currentPlan}</span></div>
                                </div>
                            </div>

                            {/* List of locations */}
                            <div className="space-y-3 mb-8">
                                {locations.map(loc => (
                                    <div key={loc.id} className="p-4 rounded-xl bg-secondary/30 border border-border flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{loc.name}</h4>
                                                <p className="text-xs text-muted-foreground">{loc.address}</p>
                                            </div>
                                        </div>
                                        {hasPermission("delete") && locations.length > 1 && (
                                            <button
                                                onClick={() => handleDeleteLocation(loc.id)}
                                                title="Remove Location"
                                                className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Add Location Form */}
                            {hasPermission("create") ? (
                                <form onSubmit={handleAddLocation} className="border-t border-border/60 pt-6">
                                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                        <Building className="w-4 h-4 text-primary" /> Add New Location
                                    </h3>
                                    
                                    {locError && (
                                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4" />
                                            {locError}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Location Name</label>
                                            <input required value={newLocName} onChange={e => setNewLocName(e.target.value)} placeholder="e.g. West Side Outlet"
                                                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none focus:border-primary text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Address</label>
                                            <input required value={newLocAddress} onChange={e => setNewLocAddress(e.target.value)} placeholder="e.g. 789 West Loop, Chicago, IL"
                                                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none focus:border-primary text-sm" />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 cursor-pointer">
                                        <Plus className="w-4 h-4" /> Add Location
                                    </button>
                                </form>
                            ) : (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Creating and editing locations requires Owner, Agency, or Admin permissions.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. BILLING & SUBSCRIPTIONS TAB */}
                {activeTab === "billing" && (
                    <div className="space-y-6">
                        {!canManageBilling ? (
                            <div className="glass-card rounded-2xl p-8 text-center border border-red-500/20 bg-red-500/5">
                                <Lock className="w-12 h-12 text-red-400 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-white mb-2">Access Restricted</h3>
                                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                                    Only users with the role of **Super Admin**, **Agency Admin**, or **Business Owner** can access billing settings and upgrade subscription plans.
                                </p>
                            </div>
                        ) : (
                            <div className="glass-card rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/60">
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Billing & Subscription</h2>
                                        <p className="text-xs text-muted-foreground mt-0.5">Manage subscription tiers, payment methods, and account usage limits.</p>
                                    </div>
                                    <div className="px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 font-bold text-sm uppercase tracking-wider shrink-0">
                                        Current Plan: {PLAN_INFO[currentPlan].name}
                                    </div>
                                </div>

                                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-primary" /> Subscription Tiers Sandbox
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(PLAN_INFO).map(([key, info]) => {
                                        const isCurrent = currentPlan === key;
                                        return (
                                            <div 
                                                key={key} 
                                                className={`p-5 rounded-2xl border transition-all flex flex-col ${
                                                    isCurrent 
                                                    ? "bg-primary/5 border-primary/60 shadow-lg shadow-primary/5" 
                                                    : "bg-secondary/10 border-border hover:bg-secondary/20 hover:border-border/80"
                                                }`}>
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h4 className="font-extrabold text-white text-base capitalize">{info.name}</h4>
                                                        <p className="text-xs text-muted-foreground/80 mt-1 max-w-[200px] leading-relaxed">{info.desc}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-lg font-extrabold text-white">${info.price}</span>
                                                        <span className="text-[10px] text-muted-foreground">/mo</span>
                                                    </div>
                                                </div>

                                                <ul className="text-xs text-muted-foreground space-y-2 mb-6 mt-4">
                                                    <li className="flex items-center gap-1.5">
                                                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                                                        Limit: {info.limit === 9999 ? "Unlimited" : `${info.limit} Location${info.limit > 1 ? "s" : ""}`}
                                                    </li>
                                                    <li className="flex items-center gap-1.5">
                                                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                                                        {key === "starter" ? "Standard Dashboard Widgets" : "AI Reply tone generation & workflow"}
                                                    </li>
                                                    <li className="flex items-center gap-1.5">
                                                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                                                        {key === "starter" || key === "growth" ? "Email & SMS Invites" : "Agency branding & White-Label tools"}
                                                    </li>
                                                </ul>

                                                <button
                                                    onClick={() => handleUpdatePlan(key as any)}
                                                    disabled={isCurrent}
                                                    className={`mt-auto w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                                        isCurrent 
                                                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default" 
                                                        : "bg-secondary hover:bg-secondary/80 border border-border text-white"
                                                    }`}>
                                                    {isCurrent ? "Active Plan" : `Simulate ${info.name} Tier`}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 4. TEAM MANAGEMENT TAB */}
                {activeTab === "team" && (
                    <div className="space-y-6">
                        {!canManageUsers ? (
                            <div className="glass-card rounded-2xl p-8 text-center border border-red-500/20 bg-red-500/5">
                                <Lock className="w-12 h-12 text-red-400 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-white mb-2">Access Restricted</h3>
                                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                                    Only users with the role of **Super Admin**, **Agency Admin**, or **Business Owner** can access user accounts management.
                                </p>
                            </div>
                        ) : (
                            <div className="glass-card rounded-2xl p-6">
                                <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                    <UsersIcon className="w-5 h-5 text-primary" /> Team Management
                                </h2>
                                <p className="text-xs text-muted-foreground mb-6">Manage login credentials and authorization roles for business operators and managers.</p>

                                {teamError && (
                                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        {teamError}
                                    </div>
                                )}

                                {/* Team List Table */}
                                <div className="overflow-x-auto mb-8">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-border/80 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                                                <th className="pb-3 pr-4">User Details</th>
                                                <th className="pb-3 pr-4">Role</th>
                                                <th className="pb-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {team.map(member => (
                                                <tr key={member.id} className="border-b border-border/40 text-sm">
                                                    <td className="py-4 pr-4">
                                                        <div className="font-bold text-white">{member.name}</div>
                                                        <div className="text-xs text-muted-foreground mt-0.5">{member.email}</div>
                                                    </td>
                                                    <td className="py-4 pr-4">
                                                        <select
                                                            value={member.role}
                                                            onChange={e => handleRoleChange(member.id, e.target.value as Role)}
                                                            disabled={user?.id === member.id}
                                                            className="px-2.5 py-1.5 rounded-lg bg-secondary/50 border border-border text-white text-xs font-semibold focus:outline-none capitalize disabled:opacity-50">
                                                            <option value="owner">Business Owner</option>
                                                            <option value="manager">Location Manager</option>
                                                            <option value="readonly">Read Only</option>
                                                        </select>
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        {user && user.id !== member.id && (
                                                            <button
                                                                onClick={() => handleDeleteUser(member.id)}
                                                                title="Delete Team Member"
                                                                className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Add Team Member Form */}
                                <form onSubmit={handleAddUser} className="border-t border-border/60 pt-6">
                                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
                                        <Plus className="w-4 h-4 text-primary" /> Invite New Team Member
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name</label>
                                            <input required value={newUserName} onChange={e => setNewUserName(e.target.value)} placeholder="e.g. John Doe"
                                                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none focus:border-primary text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email Address</label>
                                            <input required type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} placeholder="e.g. john@business.com"
                                                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none focus:border-primary text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Initial Role</label>
                                            <select value={newUserRole} onChange={e => setNewUserRole(e.target.value as Role)}
                                                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none text-sm">
                                                <option value="owner">Business Owner</option>
                                                <option value="manager">Location Manager</option>
                                                <option value="readonly">Read Only</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 cursor-pointer">
                                        <Plus className="w-4 h-4" /> Add Team Member
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* ========================================== */}
                        {/* ONBOARDING & TRIAL EMAIL SIMULATOR CONSOLE */}
                        {/* ========================================== */}
                        <div className="mt-12 border-t border-border/80 pt-8">
                            <div className="glass-card rounded-3xl p-6 border border-primary/20 bg-primary/5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Terminal className="w-5 h-5 text-primary" />
                                    <h3 className="text-base font-bold text-white font-display">Developer Onboarding & Trial Simulation Console</h3>
                                </div>
                                <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                                    Use these controls to simulate trial age transitions, trigger day-specific upgrade alerts, reset the onboarding wizard, or preview the automated transactional customer success emails.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {/* Simulators */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5 text-primary" /> Time & State Controls</h4>
                                        <div className="p-4 rounded-2xl bg-secondary/30 border border-border/20 space-y-3">
                                            <label className="block text-[11px] font-bold text-muted-foreground">Simulate Days Into Trial:</label>
                                            <div className="grid grid-cols-5 gap-1.5">
                                                {[0, 3, 7, 12, 15].map((day) => {
                                                    const currentDay = business.trialStartDate 
                                                        ? Math.floor((Date.now() - new Date(business.trialStartDate).getTime()) / 86400000)
                                                        : 0;
                                                    const active = (day === 15 && currentDay >= 14) || (day !== 15 && currentDay === day);
                                                    return (
                                                        <button
                                                            key={day}
                                                            type="button"
                                                            onClick={() => {
                                                                simulateTrialDay(business.id, day);
                                                                refreshData();
                                                                window.location.reload();
                                                            }}
                                                            className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border transition-all ${
                                                                active 
                                                                    ? "bg-primary border-primary text-white" 
                                                                    : "bg-secondary/50 border-border text-muted-foreground hover:text-white"
                                                            }`}
                                                        >
                                                            {day === 15 ? "Expired" : `Day ${day}`}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <p className="text-[10px] text-muted-foreground italic">
                                                * Day 15 locks out normal dashboards and shows the upgrade modal screen.
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-secondary/30 border border-border/20 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-bold text-white">Reset Onboarding</p>
                                                <p className="text-[10px] text-muted-foreground">Puts business in un-onboarded state</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    resetOnboardingState(business.id);
                                                    router.push("/dashboard/setup");
                                                    window.location.reload();
                                                }}
                                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs rounded-xl transition-all"
                                            >
                                                Reset & Go to Wizard
                                            </button>
                                        </div>
                                    </div>

                                    {/* Email Previews */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5"><MailOpen className="w-3.5 h-3.5 text-primary" /> Onboarding Email Campaigns</h4>
                                        <div className="space-y-2">
                                            {[
                                                { id: 1, name: "Email 1: Welcome & Setup Guide", subject: "Welcome to ReviewManagement!", body: `Thank you for signing up! We are thrilled to help you scale your business reputation. Complete our 15-minute onboarding setup wizard to connect your Google Business Profile and launch your campaigns.`, cta: "Launch Setup Wizard" },
                                                { id: 2, name: "Email 2: Connect Google Profile", subject: "Boost trust - Link Google Business Profile", body: `Unlock the full potential of your brand! Connecting your GMB account lets you import historical reviews, track live ratings in real-time, and show credibility.`, cta: "Sync Google Account" },
                                                { id: 3, name: "Email 3: Launch First Campaign", subject: "Ready to collect 5-star reviews?", body: `Getting feedback has never been easier. Use our automated SMS and Email outbound tools. Draft your message templates, copy your direct QR-code links, and send.`, cta: "Send Campaigns" },
                                                { id: 4, name: "Email 4: AI Auto-Reply Guide", subject: "Draft and publish AI replies in seconds", body: `Save time and effort responding to customer feedback! Setup tone preferences like Friendly or Professional, define custom guidelines, and authorize AI reply drafts.`, cta: "Try AI Tone Reply" },
                                                { id: 5, name: "Email 5: Expiration Alert (Day 12)", subject: "Upgrade alert: Trial ends in 48 hours", body: `Your 14-day trial period is coming to an end. Upgrade your account now to ensure uninterrupted access to AI auto-replies, multi-location dashboards, and outreach analytics.`, cta: "Unlock Full Plan" }
                                            ].map((email) => (
                                                <div key={email.id} className="p-3 bg-secondary/20 border border-border/10 rounded-xl space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-white">{email.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => alert(`Simulated email dispatched successfully to ${user?.email}!\n\nSubject: ${email.subject}`)}
                                                            className="text-[9px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/20 hover:bg-primary/30 transition-all"
                                                        >
                                                            Test Dispatch
                                                        </button>
                                                    </div>
                                                    <div className="bg-black/40 border border-border/10 p-2.5 rounded-lg text-[9px] text-muted-foreground space-y-1">
                                                        <p className="font-bold text-white">Subject: {email.subject}</p>
                                                        <p className="leading-relaxed">{email.body}</p>
                                                        <div className="pt-2 text-center">
                                                            <span className="inline-block px-3 py-1 bg-primary text-white font-bold rounded text-[8px]">{email.cta}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
