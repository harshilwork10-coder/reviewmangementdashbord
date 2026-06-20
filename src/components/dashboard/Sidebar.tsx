"use client";
import { useAuth } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard, Star, BarChart3, Lightbulb,
    Settings, LogOut, Zap, ChevronRight, Globe,
    Bell, CheckSquare, Send, Trophy, Crosshair, Blocks, BookOpen
} from "lucide-react";
import { getBusinessByOwner, getBusinessById, Business } from "@/lib/store";
import { useEffect, useState } from "react";

const NAV = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/onboarding", icon: BookOpen, label: "Onboarding Kit" },
    { href: "/dashboard/reviews", icon: Star, label: "Inbox" },
    { href: "/dashboard/tasks", icon: CheckSquare, label: "Action Tracker" },
    { href: "/dashboard/alerts", icon: Bell, label: "Alerts" },
    { href: "/dashboard/requests", icon: Send, label: "Automations" },
    { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/dashboard/ai-insights", icon: Lightbulb, label: "AI Insights" },
    { href: "/dashboard/team", icon: Trophy, label: "Team Leaderboard" },
    { href: "/dashboard/competitors", icon: Crosshair, label: "Competitors" },
    { href: "/dashboard/integrations", icon: Blocks, label: "Integrations" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardSidebar() {
    const { user, logout, activeLocation, availableLocations, setActiveLocation, switchClientBusiness } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [businessSlug, setBusinessSlug] = useState("");
    const [business, setBusiness] = useState<Business | null>(null);

    useEffect(() => {
        if (user?.businessId) {
            const biz = getBusinessById(user.businessId);
            if (biz) {
                setBusiness(biz);
                setBusinessSlug(biz.slug);
            }
        }
    }, [user, pathname]); // reload whenever path changes to capture mock updates

    const handleLogout = () => { logout(); router.push("/login"); };

    // Trial Calculations
    let trialDaysRemaining = 14;
    let isTrialActive = false;
    if (business && business.trialStartDate && !business.subscriptionActivated) {
        isTrialActive = true;
        const start = new Date(business.trialStartDate).getTime();
        const diffDays = Math.floor((Date.now() - start) / 86400000);
        trialDaysRemaining = Math.max(0, 14 - diffDays);
    }

    return (
        <aside className="w-64 min-h-screen flex flex-col border-r border-border bg-card/30 backdrop-blur-xl">
            {/* Logo */}
            <div className="p-6 border-b border-border">
                <Link href="/dashboard" className="flex items-center gap-2.5">
                    <span className="text-2xl">⚡</span>
                    <span className="text-xl font-bold gradient-text-primary">ReviewManagement</span>
                </Link>
            </div>

            {/* Switched Client Agency Back Button */}
            {user?.role === "agency" && typeof window !== "undefined" && sessionStorage.getItem("rms_agency_active_business_id") && (
                <div className="mx-3 mt-3">
                    <button
                        onClick={() => {
                            switchClientBusiness(null);
                            router.push("/agency");
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-primary/15 border border-primary/25 text-primary hover:bg-primary/25 transition-all"
                    >
                        Back to Agency Portal
                    </button>
                </div>
            )}

            {/* Demo Banner */}
            {user?.id === "user-demo" && (
                <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="text-xs text-amber-400 font-medium">Demo Account</span>
                </div>
            )}

            {/* Location Selector */}
            {availableLocations.length > 0 && (
                <div className="mx-4 mt-5">
                    <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1.5 block">Location</label>
                    <div className="relative">
                        <select
                            value={activeLocation?.id || ""}
                            onChange={(e) => {
                                const match = availableLocations.find(l => l.id === e.target.value);
                                if (match) setActiveLocation(match);
                            }}
                            className="w-full bg-secondary border border-border text-sm text-foreground rounded-xl px-3 py-2 appearance-none focus:outline-none focus:border-primary transition-colors cursor-pointer"
                        >
                            {availableLocations.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                        </select>
                        <ChevronRight className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none rotate-90" />
                    </div>
                </div>
            )}

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-1 mt-2">
                {NAV.map(({ href, icon: Icon, label }) => {
                    const active = pathname === href;
                    const isLocked = business && !business.isOnboarded && href !== "/dashboard/setup";
                    if (isLocked) {
                        return (
                            <div key={href} 
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground/30 cursor-not-allowed select-none"
                                title="Please complete setup wizard"
                            >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                <span>{label}</span>
                                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted-foreground/10 text-muted-foreground/40">🔒</span>
                            </div>
                        );
                    }
                    return (
                        <Link key={href} href={href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${active
                                ? "bg-primary/20 text-primary border border-primary/30"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                }`}>
                            <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-primary" : "group-hover:text-foreground"}`} />
                            {label}
                            {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-primary" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Trial Badge */}
            {isTrialActive && business && (
                <div className="mx-3 mb-2 p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-cyan-500/10 border border-primary/20 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-white">Trial Period</span>
                        <span className={`${
                            trialDaysRemaining <= 3 ? "text-red-400 animate-pulse" : trialDaysRemaining <= 7 ? "text-amber-400" : "text-emerald-400"
                        }`}>{trialDaysRemaining} days remaining</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                                trialDaysRemaining <= 3 ? "bg-red-500 animate-pulse" : trialDaysRemaining <= 7 ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${(trialDaysRemaining / 14) * 100}%` }}
                        />
                    </div>
                    <Link href="/dashboard/settings" className="w-full py-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary hover:text-primary-foreground rounded-lg text-[9px] font-bold text-center block transition-all">
                        Upgrade Account
                    </Link>
                </div>
            )}

            {/* Public link */}
            {businessSlug && (
                <div className="px-3 mb-2">
                    <Link href={`/business/${businessSlug}`} target="_blank"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all border border-border/50">
                        <Globe className="w-3.5 h-3.5" />
                        View Public Page
                        <ChevronRight className="w-3 h-3 ml-auto" />
                    </Link>
                </div>
            )}

            {/* User */}
            <div className="p-3 border-t border-border">
                <div className="flex items-center gap-3 px-3 py-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                </div>
                <button onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
