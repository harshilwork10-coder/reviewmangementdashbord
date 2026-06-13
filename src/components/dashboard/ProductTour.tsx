"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { HelpCircle, ChevronRight, ChevronLeft, X, Sparkles } from "lucide-react";

interface TourStep {
    title: string;
    description: string;
    selector?: string; // CSS selector of element to highlight
}

const TOUR_STEPS: Record<string, TourStep[]> = {
    "/dashboard": [
        { title: "Dashboard Overview", description: "Welcome to your ReviewManagement control center! Here you can monitor overall reputation health in real-time." },
        { title: "Six-Widget Analytics Grid", description: "Monitor your Average Rating, Reviews count this month, MoM Growth %, Response rate, Pending reviews count, and Requests sent volume." },
        { title: "Core Performance KPIs", description: "Evaluate customer sentiment ratios (positive, neutral, negative reviews) alongside target rating benchmarks." },
        { title: "Activation Milestones Checklist", description: "Follow this checklist to complete critical steps: link accounts, launch automated requests, and upgrade plan to achieve Time-To-First-Value." }
    ],
    "/dashboard/reviews": [
        { title: "Unified Reviews Inbox", description: "View all reviews pulled from Google Business Profile, Facebook, TripAdvisor, and direct survey submissions in one consolidated inbox feed." },
        { title: "Location & Date Range Filters", description: "Filter your list to view reviews from a specific physical branch or specific dates (Today, Yesterday, Last 7 Days, Last 30 Days)." },
        { title: "AI Reply Center", description: "Draft response copy using Professional, Friendly, Empathetic, or Custom Brand Voice guidelines in one click to reply to guest feedback." }
    ],
    "/dashboard/requests": [
        { title: "Review Request Automations", description: "Create and launch outreach invitation lists to ask customers for feedback automatically via SMS or Email." },
        { title: "QR Code Generator Hub", description: "Configure direct review request QR flyers in Poster, Table Tent Card, Business Card, or Receipt Coupon printable layout formats with scan counters." }
    ],
    "/dashboard/analytics": [
        { title: "Reputation Analytics Reports", description: "Review deep metrics, keyword clouds from customer comments, weekly review trends, and financial MRR projections." },
        { title: "Competitor Market Benchmark", description: "Compare your ratings and review volumes directly against your top local market competitors." }
    ],
    "/dashboard/settings": [
        { title: "Unified Settings Center", description: "Configure business details, add multiple location branches, invite team members with specific roles, and adjust billing plans." },
        { title: "Custom Brand Voice Rules", description: "Set unique prompt guidelines (such as preferred words or emojis) for the AI Reply Center generator." },
        { title: "Trial Simulator Console", description: "Simulate trial day countdowns and reset onboarding states for development testing." }
    ]
};

export default function ProductTour() {
    const pathname = usePathname();
    const [steps, setSteps] = useState<TourStep[]>([]);
    const [stepIndex, setStepIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Automatically check if tour for this path was completed
        if (pathname && TOUR_STEPS[pathname]) {
            setSteps(TOUR_STEPS[pathname]);
            const completed = localStorage.getItem(`rms_tour_completed_${pathname}`);
            if (!completed) {
                // Delay slightly to allow page layout to load
                const timer = setTimeout(() => {
                    setIsOpen(true);
                    setStepIndex(0);
                }, 1000);
                return () => clearTimeout(timer);
            }
        } else {
            setIsOpen(false);
            setSteps([]);
        }
    }, [pathname]);

    const handleNext = () => {
        if (stepIndex < steps.length - 1) {
            setStepIndex(s => s + 1);
        } else {
            handleClose();
        }
    };

    const handlePrev = () => {
        setStepIndex(s => Math.max(0, s - 1));
    };

    const handleClose = () => {
        setIsOpen(false);
        if (pathname) {
            localStorage.setItem(`rms_tour_completed_${pathname}`, "true");
        }
    };

    const handleRestart = () => {
        setStepIndex(0);
        setIsOpen(true);
    };

    if (steps.length === 0) return null;

    return (
        <>
            {/* Help Button float */}
            <button
                onClick={handleRestart}
                className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 flex items-center justify-center transition-all hover:scale-105 border border-primary/20 group"
                title="Restart Page Onboarding Tour"
            >
                <HelpCircle className="w-5 h-5" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold text-xs group-hover:ml-2 whitespace-nowrap">
                    Page Tour
                </span>
            </button>

            {/* Tour Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="glass-card rounded-3xl border border-primary/30 p-6 w-full max-w-sm shadow-2xl relative overflow-hidden bg-gradient-to-br from-card to-secondary/35">
                        {/* Glow decorative decoration */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
                        
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1.5 text-primary">
                                <Sparkles className="w-4 h-4 animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Feature Guide</span>
                            </div>
                            <button onClick={handleClose} className="p-1 hover:bg-secondary/50 rounded-lg text-muted-foreground hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-2 mb-6">
                            <h3 className="text-base font-bold text-white font-display">
                                {steps[stepIndex]?.title}
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {steps[stepIndex]?.description}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border/20">
                            <span className="text-[10px] text-muted-foreground font-semibold">
                                Step {stepIndex + 1} of {steps.length}
                            </span>
                            
                            <div className="flex items-center gap-2">
                                {stepIndex > 0 && (
                                    <button
                                        onClick={handlePrev}
                                        className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all flex items-center justify-center"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    className="px-4 py-1.5 rounded-lg btn-primary text-white font-bold text-xs flex items-center gap-1 transition-all"
                                >
                                    {stepIndex === steps.length - 1 ? "Finish Tour" : "Next"}
                                    {stepIndex < steps.length - 1 && <ChevronRight className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
