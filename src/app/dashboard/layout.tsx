"use client";
import { useAuth } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { getBusinessById, Business } from "@/lib/store";
import { AlertCircle, CreditCard } from "lucide-react";
import Link from "next/link";
import ProductTour from "@/components/dashboard/ProductTour";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [business, setBusiness] = useState<Business | null>(null);

    useEffect(() => {
        if (!loading && !user) router.push("/login");
        if (!loading && user?.role === "admin") router.push("/admin");
    }, [user, loading, router]);

    useEffect(() => {
        if (!loading && user?.businessId) {
            const biz = getBusinessById(user.businessId);
            if (biz) {
                setBusiness(biz);
                if (!biz.isOnboarded && pathname !== "/dashboard/setup") {
                    router.push("/dashboard/setup");
                }
            }
        }
    }, [user, loading, pathname, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    // Check trial expiration (14 days limit)
    const isSetupPage = pathname === "/dashboard/setup";
    let isTrialExpired = false;
    let trialDaysRemaining = 14;

    if (business && business.trialStartDate) {
        const start = new Date(business.trialStartDate).getTime();
        const diffDays = Math.floor((Date.now() - start) / 86400000);
        trialDaysRemaining = Math.max(0, 14 - diffDays);
        if (diffDays >= 14 && !business.subscriptionActivated) {
            isTrialExpired = true;
        }
    }

    if (isTrialExpired && !isSetupPage && pathname !== "/dashboard/settings") {
        return (
            <div className="flex min-h-screen">
                <DashboardSidebar />
                <main className="flex-1 overflow-hidden relative p-8 flex items-center justify-center">
                    <div className="absolute inset-0 mesh-gradient opacity-85" />
                    <div className="relative z-10 w-full max-w-md glass-card rounded-2xl p-8 border border-red-500/25 text-center shadow-2xl">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6 text-red-500">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 font-display">14-Day Trial Expired</h2>
                        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                            Your trial period for <strong className="text-white">{business?.name}</strong> has ended. To continue managing reviews, using AI auto-replies, and running invite campaigns, please upgrade your subscription plan.
                        </p>
                        
                        <div className="space-y-3">
                            <Link href="/dashboard/settings" className="w-full py-3 rounded-xl btn-primary text-white font-semibold flex items-center justify-center gap-2 text-sm">
                                <CreditCard className="w-4 h-4" />
                                Choose a Plan
                            </Link>
                            <button onClick={() => {
                                if (user?.businessId) {
                                    const businesses = JSON.parse(localStorage.getItem("rms_businesses") || "[]");
                                    const idx = businesses.findIndex((b: any) => b.id === user.businessId);
                                    if (idx >= 0) {
                                        businesses[idx].trialStartDate = new Date().toISOString();
                                        localStorage.setItem("rms_businesses", JSON.stringify(businesses));
                                        window.location.reload();
                                    }
                                }
                            }} className="w-full py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground font-medium text-xs transition-colors border border-border">
                                Restart Trial (Simulation Reset)
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <main className="flex-1 overflow-hidden relative">
                {children}
                <ProductTour />
            </main>
        </div>
    );
}
