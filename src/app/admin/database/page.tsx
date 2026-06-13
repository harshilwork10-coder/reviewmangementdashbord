"use client";

import { useState } from "react";
import {
    Database, ChevronDown, ChevronRight, Check, X, CheckCircle2,
    Key, Link2, ShieldCheck, Code2, Table, FileJson,
    ArrowRight, Info, Lock, Zap, ToggleLeft
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
interface Column { name: string; type: string; constraints: string[] }
interface TableDef { id: string; name: string; color: string; columns: Column[] }
interface Endpoint { method: "GET" | "POST" | "PUT" | "DELETE"; path: string; description: string; body?: object; response: object }
interface EndpointGroup { group: string; color: string; endpoints: Endpoint[] }

// ── Schema Data ───────────────────────────────────────────────────────────────
const tables: TableDef[] = [
    {
        id: "users", name: "users", color: "violet",
        columns: [
            { name: "user_id",           type: "UUID",          constraints: ["PK", "DEFAULT gen_random_uuid()"] },
            { name: "name",              type: "VARCHAR(255)",   constraints: ["NOT NULL"] },
            { name: "email",             type: "VARCHAR(320)",   constraints: ["NOT NULL", "UNIQUE"] },
            { name: "password_hash",     type: "TEXT",           constraints: ["NOT NULL"] },
            { name: "status",            type: "ENUM",           constraints: ["NOT NULL", "DEFAULT 'pending'"] },
            { name: "email_verified_at", type: "TIMESTAMP",      constraints: ["NULLABLE"] },
            { name: "created_at",        type: "TIMESTAMP",      constraints: ["NOT NULL", "DEFAULT NOW()"] },
            { name: "updated_at",        type: "TIMESTAMP",      constraints: ["NOT NULL", "DEFAULT NOW()"] },
        ]
    },
    {
        id: "organizations", name: "organizations", color: "blue",
        columns: [
            { name: "organization_id",   type: "UUID",          constraints: ["PK", "DEFAULT gen_random_uuid()"] },
            { name: "name",              type: "VARCHAR(255)",   constraints: ["NOT NULL"] },
            { name: "plan_type",         type: "ENUM",           constraints: ["NOT NULL", "DEFAULT 'starter'"] },
            { name: "owner_user_id",     type: "UUID",           constraints: ["FK → users"] },
            { name: "billing_status",    type: "ENUM",           constraints: ["NOT NULL", "DEFAULT 'trialing'"] },
            { name: "stripe_customer_id",type: "VARCHAR(255)",   constraints: ["NULLABLE", "UNIQUE"] },
            { name: "created_at",        type: "TIMESTAMP",      constraints: ["NOT NULL"] },
            { name: "updated_at",        type: "TIMESTAMP",      constraints: ["NOT NULL"] },
        ]
    },
    {
        id: "businesses", name: "businesses", color: "emerald",
        columns: [
            { name: "business_id",       type: "UUID",          constraints: ["PK"] },
            { name: "organization_id",   type: "UUID",           constraints: ["NOT NULL", "FK → organizations"] },
            { name: "business_name",     type: "VARCHAR(255)",   constraints: ["NOT NULL"] },
            { name: "review_link",       type: "TEXT",           constraints: ["NULLABLE"] },
            { name: "address",           type: "TEXT",           constraints: ["NULLABLE"] },
            { name: "phone",             type: "VARCHAR(30)",    constraints: ["NULLABLE"] },
            { name: "logo_url",          type: "TEXT",           constraints: ["NULLABLE"] },
            { name: "industry",          type: "VARCHAR(100)",   constraints: ["NULLABLE"] },
            { name: "deleted_at",        type: "TIMESTAMP",      constraints: ["NULLABLE", "SOFT DELETE"] },
        ]
    },
    {
        id: "customers", name: "customers", color: "cyan",
        columns: [
            { name: "customer_id",       type: "UUID",          constraints: ["PK"] },
            { name: "business_id",       type: "UUID",           constraints: ["NOT NULL", "FK → businesses"] },
            { name: "first_name",        type: "VARCHAR(100)",   constraints: ["NOT NULL"] },
            { name: "last_name",         type: "VARCHAR(100)",   constraints: ["NULLABLE"] },
            { name: "email",             type: "VARCHAR(320)",   constraints: ["NULLABLE"] },
            { name: "phone",             type: "VARCHAR(30)",    constraints: ["NULLABLE"] },
            { name: "last_contacted",    type: "TIMESTAMP",      constraints: ["NULLABLE"] },
            { name: "tags",              type: "TEXT[]",         constraints: ["NULLABLE"] },
            { name: "deleted_at",        type: "TIMESTAMP",      constraints: ["NULLABLE", "SOFT DELETE"] },
        ]
    },
    {
        id: "campaigns", name: "campaigns", color: "orange",
        columns: [
            { name: "campaign_id",       type: "UUID",          constraints: ["PK"] },
            { name: "business_id",       type: "UUID",           constraints: ["NOT NULL", "FK → businesses"] },
            { name: "campaign_name",     type: "VARCHAR(255)",   constraints: ["NOT NULL"] },
            { name: "campaign_type",     type: "ENUM",           constraints: ["NOT NULL"] },
            { name: "status",            type: "ENUM",           constraints: ["NOT NULL", "DEFAULT 'draft'"] },
            { name: "launch_date",       type: "TIMESTAMP",      constraints: ["NULLABLE"] },
            { name: "template_body",     type: "TEXT",           constraints: ["NULLABLE"] },
        ]
    },
    {
        id: "review_requests", name: "review_requests", color: "rose",
        columns: [
            { name: "request_id",        type: "UUID",          constraints: ["PK"] },
            { name: "campaign_id",       type: "UUID",           constraints: ["NOT NULL", "FK → campaigns"] },
            { name: "customer_id",       type: "UUID",           constraints: ["NOT NULL", "FK → customers"] },
            { name: "delivery_method",   type: "ENUM",           constraints: ["NOT NULL"] },
            { name: "sent_at",           type: "TIMESTAMP",      constraints: ["NULLABLE"] },
            { name: "opened_at",         type: "TIMESTAMP",      constraints: ["NULLABLE"] },
            { name: "clicked_at",        type: "TIMESTAMP",      constraints: ["NULLABLE"] },
            { name: "review_submitted",  type: "BOOLEAN",        constraints: ["DEFAULT FALSE"] },
        ]
    },
    {
        id: "reviews", name: "reviews", color: "yellow",
        columns: [
            { name: "review_id",         type: "UUID",          constraints: ["PK"] },
            { name: "business_id",       type: "UUID",           constraints: ["NOT NULL", "FK → businesses"] },
            { name: "platform",          type: "ENUM",           constraints: ["NOT NULL"] },
            { name: "reviewer_name",     type: "VARCHAR(255)",   constraints: ["NULLABLE"] },
            { name: "rating",            type: "SMALLINT",       constraints: ["CHECK 1–5"] },
            { name: "review_text",       type: "TEXT",           constraints: ["NULLABLE"] },
            { name: "review_date",       type: "TIMESTAMP",      constraints: ["NULLABLE"] },
            { name: "platform_review_id",type: "VARCHAR(255)",   constraints: ["NULLABLE", "UNIQUE"] },
        ]
    },
    {
        id: "subscriptions", name: "subscriptions", color: "pink",
        columns: [
            { name: "subscription_id",       type: "UUID",      constraints: ["PK"] },
            { name: "organization_id",       type: "UUID",       constraints: ["NOT NULL", "FK → organizations"] },
            { name: "stripe_subscription_id",type: "VARCHAR(255)",constraints: ["NOT NULL", "UNIQUE"] },
            { name: "plan_type",             type: "ENUM",       constraints: ["NOT NULL"] },
            { name: "billing_cycle",         type: "ENUM",       constraints: ["NOT NULL"] },
            { name: "status",                type: "ENUM",       constraints: ["NOT NULL"] },
            { name: "current_period_start",  type: "TIMESTAMP",  constraints: ["NOT NULL"] },
            { name: "current_period_end",    type: "TIMESTAMP",  constraints: ["NOT NULL"] },
        ]
    },
    {
        id: "audit_logs", name: "audit_logs", color: "slate",
        columns: [
            { name: "log_id",            type: "UUID",          constraints: ["PK"] },
            { name: "user_id",           type: "UUID",           constraints: ["NULLABLE", "FK → users"] },
            { name: "organization_id",   type: "UUID",           constraints: ["NULLABLE", "FK → organizations"] },
            { name: "action",            type: "VARCHAR(255)",   constraints: ["NOT NULL"] },
            { name: "resource_type",     type: "VARCHAR(100)",   constraints: ["NOT NULL"] },
            { name: "resource_id",       type: "UUID",           constraints: ["NULLABLE"] },
            { name: "ip_address",        type: "VARCHAR(45)",    constraints: ["NULLABLE"] },
            { name: "metadata",          type: "JSONB",          constraints: ["NULLABLE"] },
            { name: "created_at",        type: "TIMESTAMP",      constraints: ["NOT NULL"] },
        ]
    },
    {
        id: "user_roles", name: "user_roles", color: "indigo",
        columns: [
            { name: "role_id",           type: "UUID",          constraints: ["PK"] },
            { name: "user_id",           type: "UUID",           constraints: ["NOT NULL", "FK → users"] },
            { name: "organization_id",   type: "UUID",           constraints: ["NOT NULL", "FK → organizations"] },
            { name: "role",              type: "ENUM",           constraints: ["NOT NULL"] },
            { name: "created_at",        type: "TIMESTAMP",      constraints: ["NOT NULL"] },
        ]
    },
];

// ── FK Relationship Map ───────────────────────────────────────────────────────
const relationships = [
    { from: "organizations", to: "users",         label: "owner_user_id" },
    { from: "businesses",    to: "organizations",  label: "organization_id" },
    { from: "customers",     to: "businesses",     label: "business_id" },
    { from: "campaigns",     to: "businesses",     label: "business_id" },
    { from: "review_requests",to: "campaigns",     label: "campaign_id" },
    { from: "review_requests",to: "customers",     label: "customer_id" },
    { from: "reviews",       to: "businesses",     label: "business_id" },
    { from: "subscriptions", to: "organizations",  label: "organization_id" },
    { from: "user_roles",    to: "users",          label: "user_id" },
    { from: "user_roles",    to: "organizations",  label: "organization_id" },
    { from: "audit_logs",    to: "users",          label: "user_id" },
    { from: "audit_logs",    to: "organizations",  label: "organization_id" },
];

// ── Role-Permission Matrix ───────────────────────────────────────────────────
const roles = ["Super Admin", "Agency Admin", "Business Owner", "Marketing User", "Read Only"];
const permissions = ["Create Campaigns", "Edit Businesses", "Manage Customers", "View Reports", "Manage Billing"];
const permMatrix: boolean[][] = [
    [true,  true,  true,  true,  true ],   // Super Admin
    [true,  true,  true,  true,  true ],   // Agency Admin
    [true,  true,  true,  true,  false],   // Business Owner
    [true,  false, true,  true,  false],   // Marketing User
    [false, false, false, true,  false],   // Read Only
];

// ── API Endpoint Groups ──────────────────────────────────────────────────────
const apiGroups: EndpointGroup[] = [
    {
        group: "Auth", color: "violet",
        endpoints: [
            { method: "POST", path: "/auth/register",       description: "Create a new user account",          body: { name: "string", email: "string", password: "string", plan: "starter|growth|agency" }, response: { user_id: "uuid", email: "string", status: "pending", token: "jwt-string" } },
            { method: "POST", path: "/auth/login",          description: "Authenticate and receive JWT tokens", body: { email: "string", password: "string" }, response: { access_token: "jwt-string", refresh_token: "jwt-string", expires_in: 900 } },
            { method: "POST", path: "/auth/logout",         description: "Invalidate the active session",       body: { refresh_token: "string" }, response: { success: true, message: "Session terminated." } },
            { method: "POST", path: "/auth/reset-password", description: "Send password reset email",           body: { email: "string" }, response: { success: true, message: "Reset link sent if account exists." } },
            { method: "GET",  path: "/auth/profile",        description: "Get current authenticated user",      response: { user_id: "uuid", name: "string", email: "string", role: "string", organization_id: "uuid" } },
        ]
    },
    {
        group: "Businesses", color: "emerald",
        endpoints: [
            { method: "GET",    path: "/businesses",       description: "List all businesses in organization", response: { data: [{ business_id: "uuid", business_name: "string", review_link: "string" }], total: 12, page: 1 } },
            { method: "POST",   path: "/businesses",       description: "Create a new business profile",      body: { business_name: "string", review_link: "string", address: "string", phone: "string" }, response: { business_id: "uuid", business_name: "string", created_at: "timestamp" } },
            { method: "PUT",    path: "/businesses/{id}", description: "Update a business by ID",            body: { business_name: "string", phone: "string" }, response: { business_id: "uuid", updated_at: "timestamp" } },
            { method: "DELETE", path: "/businesses/{id}", description: "Soft-delete a business by ID",       response: { success: true, deleted_at: "timestamp" } },
        ]
    },
    {
        group: "Campaigns", color: "orange",
        endpoints: [
            { method: "GET",  path: "/campaigns",              description: "List all campaigns for business", response: { data: [{ campaign_id: "uuid", campaign_name: "string", status: "active" }], total: 8 } },
            { method: "POST", path: "/campaigns",              description: "Create a new campaign",           body: { campaign_name: "string", campaign_type: "email|sms|both", launch_date: "timestamp" }, response: { campaign_id: "uuid", status: "draft" } },
            { method: "PUT",  path: "/campaigns/{id}",        description: "Update a campaign by ID",         body: { status: "active", template_body: "string" }, response: { campaign_id: "uuid", updated_at: "timestamp" } },
            { method: "GET",  path: "/campaigns/{id}/metrics", description: "Retrieve open/click/submit stats", response: { sent: 120, opened: 84, clicked: 42, submitted: 18, conversion_rate: "15%" } },
        ]
    },
    {
        group: "Customers", color: "cyan",
        endpoints: [
            { method: "GET",  path: "/customers",         description: "List all customers for business", response: { data: [{ customer_id: "uuid", first_name: "string", email: "string", last_contacted: "timestamp" }], total: 248 } },
            { method: "POST", path: "/customers",         description: "Create a single customer",        body: { first_name: "string", last_name: "string", email: "string", phone: "string" }, response: { customer_id: "uuid", created_at: "timestamp" } },
            { method: "POST", path: "/customers/import",  description: "Bulk import from CSV payload",    body: { csv_data: "base64-encoded-csv" }, response: { imported: 42, failed: 1, errors: ["Row 3: invalid email"] } },
            { method: "PUT",  path: "/customers/{id}",   description: "Update a customer record",         body: { phone: "string", tags: ["vip"] }, response: { customer_id: "uuid", updated_at: "timestamp" } },
        ]
    },
    {
        group: "Reports", color: "rose",
        endpoints: [
            { method: "GET", path: "/reports/reviews",   description: "Review volume, ratings, platform breakdown", response: { total_reviews: 284, avg_rating: 4.7, by_platform: { google: 198, yelp: 62, facebook: 24 }, trend: "+12% vs last month" } },
            { method: "GET", path: "/reports/campaigns", description: "Campaign open, click, and conversion rates",  response: { total_campaigns: 18, avg_open_rate: "70%", avg_click_rate: "35%", avg_conversion: "15%" } },
            { method: "GET", path: "/reports/customers", description: "Customer growth and request stats",            response: { total_customers: 248, new_this_month: 34, requests_sent: 420, opt_outs: 3 } },
        ]
    },
];

// ── Color helpers ────────────────────────────────────────────────────────────
const colMap: Record<string, string> = {
    violet: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    blue:   "text-blue-400   border-blue-500/30   bg-blue-500/10",
    emerald:"text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    cyan:   "text-cyan-400   border-cyan-500/30   bg-cyan-500/10",
    orange: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    rose:   "text-rose-400   border-rose-500/30   bg-rose-500/10",
    yellow: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
    pink:   "text-pink-400   border-pink-500/30   bg-pink-500/10",
    slate:  "text-slate-300  border-slate-500/30  bg-slate-500/10",
    indigo: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
};

const methodColors: Record<string, string> = {
    GET:    "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    POST:   "bg-blue-500/20   text-blue-400   border-blue-500/30",
    PUT:    "bg-amber-500/20  text-amber-400  border-amber-500/30",
    DELETE: "bg-rose-500/20   text-rose-400   border-rose-500/30",
};

const apiGroupColors: Record<string, string> = {
    Auth:       "text-violet-400",
    Businesses: "text-emerald-400",
    Campaigns:  "text-orange-400",
    Customers:  "text-cyan-400",
    Reports:    "text-rose-400",
};

// ── Component ────────────────────────────────────────────────────────────────
export default function SuperAdminDatabasePage() {
    const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set(["users"]));
    const [activeEndpoint, setActiveEndpoint] = useState<Endpoint | null>(null);
    const [activeTab, setActiveTab] = useState<"schema" | "relations" | "roles" | "api" | "security">("schema");
    const [deliverables, setDeliverables] = useState([
        { id: "d1", label: "Database schema approved",      checked: true  },
        { id: "d2", label: "API specifications approved",   checked: true  },
        { id: "d3", label: "Role model approved",           checked: true  },
        { id: "d4", label: "Security model documented",     checked: true  },
        { id: "d5", label: "Development ready",             checked: false },
    ]);

    const toggleTable = (id: string) => {
        setExpandedTables(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleDeliverable = (id: string) => {
        setDeliverables(prev => prev.map(d => d.id === id ? { ...d, checked: !d.checked } : d));
    };

    const doneDels = deliverables.filter(d => d.checked).length;

    const tabs = [
        { id: "schema",   label: "Schema Browser",       icon: Table },
        { id: "relations",label: "Relationship Map",      icon: Link2 },
        { id: "roles",    label: "Role Permissions",      icon: ShieldCheck },
        { id: "api",      label: "API Explorer",          icon: Code2 },
        { id: "security", label: "Security Model",        icon: Lock },
    ] as const;

    return (
        <div className="h-screen overflow-y-auto p-8 font-sans">

            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Database className="w-6 h-6 text-red-500" />
                        Database Schema &amp; API Design Console
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Browse the PostgreSQL schema, explore FK relationships, validate role permissions, test API endpoints, and track Part 3 delivery gates.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> {tables.length} Tables · 20 Endpoints · {doneDels}/5 Gates
                </div>
            </div>

            {/* Tab selector */}
            <div className="flex gap-1 p-1 bg-slate-950 border border-white/5 rounded-2xl mb-8 overflow-x-auto">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === tab.id
                                    ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            <Icon className="w-3.5 h-3.5" /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ── Schema Browser ── */}
            {activeTab === "schema" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {tables.map(table => {
                        const expanded = expandedTables.has(table.id);
                        const colors = colMap[table.color] || colMap.slate;
                        return (
                            <div key={table.id} className={`glass-card rounded-2xl border overflow-hidden transition-all ${colors}`}>
                                <button
                                    onClick={() => toggleTable(table.id)}
                                    className="w-full flex items-center justify-between p-4 cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <Table className="w-4 h-4" />
                                        <span className="font-bold text-sm font-mono">{table.name}</span>
                                        <span className="text-[9px] bg-black/20 px-1.5 py-0.5 rounded font-mono">
                                            {table.columns.length} cols
                                        </span>
                                    </div>
                                    {expanded ? <ChevronDown className="w-4 h-4 opacity-60" /> : <ChevronRight className="w-4 h-4 opacity-60" />}
                                </button>

                                {expanded && (
                                    <div className="px-4 pb-4 space-y-1.5 border-t border-white/5 pt-3">
                                        {table.columns.map((col, i) => (
                                            <div key={i} className="flex items-start justify-between gap-2 text-[10px]">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    {col.constraints.includes("PK") && <Key className="w-3 h-3 text-yellow-400 shrink-0" />}
                                                    {col.constraints.some(c => c.startsWith("FK")) && <Link2 className="w-3 h-3 text-cyan-400 shrink-0" />}
                                                    <span className="font-mono text-slate-200 font-semibold truncate">{col.name}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1 justify-end shrink-0">
                                                    <span className="bg-black/30 px-1.5 py-0.5 rounded font-mono text-slate-300">{col.type}</span>
                                                    {col.constraints.filter(c => c !== "PK").slice(0, 1).map((c, ci) => (
                                                        <span key={ci} className="bg-black/20 px-1.5 py-0.5 rounded text-[8px] text-slate-400 max-w-[100px] truncate">{c}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Relationship Map ── */}
            {activeTab === "relations" && (
                <div className="glass-card rounded-2xl p-6 border border-border/60">
                    <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                        <Link2 className="w-4.5 h-4.5 text-cyan-400" /> Foreign Key Relationship Map
                    </h3>
                    <p className="text-xs text-slate-400 mb-6">12 FK relationships across 10 tables.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {relationships.map((rel, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-950/60 border border-white/5 rounded-xl text-xs hover:border-cyan-500/20 transition-all">
                                <div className="flex-1 min-w-0">
                                    <span className="font-mono text-orange-400 font-bold truncate block">{rel.from}</span>
                                </div>
                                <div className="flex flex-col items-center gap-0.5 shrink-0">
                                    <ArrowRight className="w-4 h-4 text-slate-500" />
                                    <span className="text-[8px] font-mono text-slate-600 truncate max-w-[80px]">{rel.label}</span>
                                </div>
                                <div className="flex-1 min-w-0 text-right">
                                    <span className="font-mono text-violet-400 font-bold truncate block">{rel.to}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Core hierarchy diagram */}
                    <div className="mt-6 p-4 bg-slate-950 border border-white/5 rounded-xl font-mono text-[10px] text-slate-400 leading-loose">
                        <div className="text-[9px] text-slate-600 uppercase tracking-widest mb-3">Tenant Hierarchy</div>
                        <div><span className="text-violet-400">users</span> → <span className="text-blue-400">organizations</span> (owner)</div>
                        <div className="ml-4">└── <span className="text-emerald-400">businesses</span> → organization</div>
                        <div className="ml-8">├── <span className="text-cyan-400">customers</span> → business</div>
                        <div className="ml-8">├── <span className="text-orange-400">campaigns</span> → business</div>
                        <div className="ml-12">└── <span className="text-rose-400">review_requests</span> → campaign + customer</div>
                        <div className="ml-8">├── <span className="text-yellow-400">reviews</span> → business</div>
                        <div className="ml-4">└── <span className="text-pink-400">subscriptions</span> → organization</div>
                        <div><span className="text-indigo-400">user_roles</span> → users + organizations</div>
                        <div><span className="text-slate-400">audit_logs</span> → users + organizations</div>
                    </div>
                </div>
            )}

            {/* ── Role-Permission Matrix ── */}
            {activeTab === "roles" && (
                <div className="glass-card rounded-2xl p-6 border border-border/60">
                    <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                        <ShieldCheck className="w-4.5 h-4.5 text-violet-400" /> Role-Based Permission Matrix
                    </h3>
                    <p className="text-xs text-slate-400 mb-6">5 roles × 5 permissions. Enforced via middleware RBAC checks on every API route.</p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-left py-3 pr-4 text-slate-400 font-semibold text-[10px] uppercase tracking-wide w-40">Permission</th>
                                    {roles.map(role => (
                                        <th key={role} className="text-center py-3 px-2 text-slate-300 font-bold text-[10px]">{role}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {permissions.map((perm, pi) => (
                                    <tr key={pi} className="border-t border-white/5 hover:bg-white/1">
                                        <td className="py-3 pr-4 text-slate-300 font-medium text-[11px]">{perm}</td>
                                        {roles.map((_, ri) => (
                                            <td key={ri} className="text-center py-3 px-2">
                                                {permMatrix[ri][pi] ? (
                                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 border border-white/5">
                                                        <X className="w-3.5 h-3.5 text-slate-700" />
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 text-[9px] text-slate-500 flex items-center gap-1.5 pt-3 border-t border-white/5">
                        <Info className="w-3.5 h-3.5" /> RBAC rules are enforced server-side via JWT payload role claims. Client-side UI also hides controls based on role context.
                    </div>
                </div>
            )}

            {/* ── API Explorer ── */}
            {activeTab === "api" && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Endpoint list */}
                    <div className="lg:col-span-2 space-y-4">
                        {apiGroups.map(group => (
                            <div key={group.group} className="glass-card rounded-2xl p-4 border border-border/60">
                                <div className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${apiGroupColors[group.group]}`}>
                                    {group.group} API
                                </div>
                                <div className="space-y-1.5">
                                    {group.endpoints.map((ep, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveEndpoint(ep)}
                                            className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-left cursor-pointer transition-all text-xs border ${
                                                activeEndpoint?.path === ep.path && activeEndpoint?.method === ep.method
                                                    ? "bg-red-500/10 border-red-500/30"
                                                    : "bg-slate-900/60 border-white/5 hover:border-white/10"
                                            }`}
                                        >
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono font-bold shrink-0 ${methodColors[ep.method]}`}>
                                                {ep.method}
                                            </span>
                                            <span className="font-mono text-slate-300 truncate text-[10px]">{ep.path}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Response viewer */}
                    <div className="lg:col-span-3">
                        <div className="glass-card rounded-2xl p-6 border border-border/60 sticky top-0">
                            {activeEndpoint ? (
                                <>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-lg border font-mono font-black ${methodColors[activeEndpoint.method]}`}>
                                            {activeEndpoint.method}
                                        </span>
                                        <code className="text-sm font-mono text-white font-bold">{activeEndpoint.path}</code>
                                    </div>
                                    <p className="text-xs text-slate-400 mb-4">{activeEndpoint.description}</p>

                                    {activeEndpoint.body && (
                                        <div className="mb-4">
                                            <div className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mb-1.5">Request Body</div>
                                            <pre className="bg-slate-950 border border-white/5 rounded-xl p-3 text-[10px] font-mono text-blue-300 overflow-x-auto">
                                                {JSON.stringify(activeEndpoint.body, null, 2)}
                                            </pre>
                                        </div>
                                    )}

                                    <div>
                                        <div className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mb-1.5">Mock Response (200 OK)</div>
                                        <pre className="bg-slate-950 border border-white/5 rounded-xl p-3 text-[10px] font-mono text-emerald-300 overflow-x-auto max-h-[280px]">
                                            {JSON.stringify(activeEndpoint.response, null, 2)}
                                        </pre>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[300px] text-slate-600 text-sm">
                                    <FileJson className="w-10 h-10 mb-3" />
                                    Select an endpoint from the left to inspect its request/response schema.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Security Model ── */}
            {activeTab === "security" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            icon: Key, color: "violet", title: "JWT Authentication",
                            points: ["Bearer token required in Authorization header.", "Access tokens expire in 15 minutes.", "Refresh tokens expire in 7 days.", "Token refresh endpoint: POST /auth/refresh."]
                        },
                        {
                            icon: ShieldCheck, color: "emerald", title: "Role-Based Access Control (RBAC)",
                            points: ["Role is embedded in JWT claims payload.", "Server-side middleware validates role before processing.", "5 roles: super_admin, agency_admin, business_owner, marketing_user, read_only.", "UI controls hidden client-side to match server permissions."]
                        },
                        {
                            icon: Database, color: "cyan", title: "Row-Level Security (RLS)",
                            points: ["PostgreSQL RLS policies enabled on all tenant tables.", "Every query filtered by organization_id automatically.", "Prevents cross-tenant data leakage at the database layer.", "Tested via simulation of cross-org API calls."]
                        },
                        {
                            icon: Zap, color: "orange", title: "Rate Limiting",
                            points: ["Public endpoints: 60 requests/minute per IP.", "Authenticated endpoints: 300 requests/minute per user.", "Burst headers returned: X-RateLimit-Remaining.", "Exceeded requests return HTTP 429 Too Many Requests."]
                        },
                        {
                            icon: CheckCircle2, color: "rose", title: "Input Validation",
                            points: ["All payloads validated with Zod schemas before DB write.", "SQL injection prevented via parameterized queries (pg driver).", "XSS sanitization on all user-supplied text fields.", "File uploads restricted to PNG/JPG/SVG with 5MB max."]
                        },
                        {
                            icon: Table, color: "slate", title: "Audit Logging",
                            points: ["All write operations auto-log to audit_logs table.", "Captures: user_id, organization_id, action, resource, IP.", "Logs are immutable — no UPDATE or DELETE permitted.", "Retained for minimum 12 months for compliance."]
                        },
                    ].map((item, i) => {
                        const Icon = item.icon;
                        const colors = colMap[item.color] || colMap.slate;
                        return (
                            <div key={i} className={`glass-card rounded-2xl p-5 border ${colors}`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <Icon className="w-4.5 h-4.5" />
                                    <span className="text-sm font-bold text-white">{item.title}</span>
                                </div>
                                <ul className="space-y-1.5">
                                    {item.points.map((pt, pi) => (
                                        <li key={pi} className="flex items-start gap-2 text-[10px] text-slate-300">
                                            <span className="mt-0.5 shrink-0 opacity-60">•</span>
                                            {pt}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}

                    {/* Part 3 Deliverables inside security tab */}
                    <div className="md:col-span-2 glass-card rounded-2xl p-6 border border-border/60">
                        <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" /> Part 3 Deliverables
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
                            {deliverables.map(d => (
                                <button
                                    key={d.id}
                                    onClick={() => toggleDeliverable(d.id)}
                                    className={`p-3 rounded-xl border text-xs flex flex-col items-center gap-2 cursor-pointer transition-all text-center ${
                                        d.checked
                                            ? "bg-emerald-500/10 border-emerald-500/30 text-white"
                                            : "bg-slate-900 border-white/5 text-slate-500 hover:border-white/10"
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${d.checked ? "bg-emerald-500 border-emerald-500" : "bg-slate-950 border-slate-700"}`}>
                                        {d.checked && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className="font-semibold leading-tight">{d.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" style={{ width: `${(doneDels / deliverables.length) * 100}%` }} />
                            </div>
                            <span className="text-xs font-bold text-emerald-400 shrink-0">{doneDels}/5</span>
                        </div>
                        {doneDels === deliverables.length && (
                            <div className="mt-3 flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                <CheckCircle2 className="w-4 h-4" /> Part 3 Complete — Ready for Backend Development!
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}
