"use client";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getBusinessByOwner, getBusinessAnalytics, getReviewsByBusiness, Review, Business, saveDraftReply, replyToReview, trackAIReplyGenerated, trackAIReplyApproved } from "@/lib/store";
import { generateAIReply } from "@/lib/ai-analysis";
import {
    Star, TrendingUp, MessageSquare, Clock, Zap, X, Send, Sparkles, FileText, Check
} from "lucide-react";
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

function StarDisplay({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? "star-filled fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
            ))}
        </div>
    );
}

const SENTIMENT_COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

export default function DashboardPage() {
    const { user, activeLocation } = useAuth();
    const [business, setBusiness] = useState<Business | null>(null);
    const [analytics, setAnalytics] = useState<ReturnType<typeof getBusinessAnalytics> | null>(null);
    const [recent, setRecent] = useState<Review[]>([]);
    const [replyModal, setReplyModal] = useState<Review | null>(null);
    const [replyText, setReplyText] = useState("");
    const [aiReplies, setAiReplies] = useState<{ text: string; tone: string }[]>([]);
    const [selectedTone, setSelectedTone] = useState<"friendly" | "professional" | "empathetic" | "brand_voice">("friendly");
    const [submitting, setSubmitting] = useState(false);

    const refresh = () => {
        if (!user) return;
        const biz = getBusinessByOwner(user.id);
        if (!biz) return;
        setBusiness(biz);
        const stats = getBusinessAnalytics(biz.id, activeLocation?.id);
        setAnalytics(stats);
        setRecent(getReviewsByBusiness(biz.id).filter(r => !activeLocation || r.locationId === activeLocation.id).slice(0, 6));
    };

    useEffect(() => { refresh(); }, [user, activeLocation]);

    const openReply = (review: Review) => {
        setReplyModal(review);
        setReplyText(review.reply || "");
        
        // Pass custom brand guidelines
        const toneGen = generateAIReply(review, business?.brandVoice);
        setAiReplies(toneGen);
        
        const defaultTone = review.rating >= 4 ? "friendly" : review.rating === 3 ? "professional" : "empathetic";
        setSelectedTone(defaultTone);
        const matching = toneGen.find(r => r.tone === defaultTone) || toneGen[0];
        if (matching && !review.reply) {
            setReplyText(matching.text);
        }

        // Track AI Replies generated
        if (business) {
            trackAIReplyGenerated(business.id);
        }
    };

    const submitReply = (isDraft: boolean) => {
        if (!replyModal || !replyText.trim()) return;
        setSubmitting(true);
        setTimeout(() => {
            if (isDraft) {
                saveDraftReply(replyModal.id, replyText);
            } else {
                replyToReview(replyModal.id, replyText, user?.name || "Owner");
                // Track AI Replies approved
                if (business) {
                    trackAIReplyApproved(business.id);
                }
            }
            setReplyModal(null);
            setReplyText("");
            setSubmitting(false);
            refresh();
        }, 500);
    };

    if (!analytics || !business) {
        return <div className="flex items-center justify-center h-screen"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;
    }

    const sentimentData = [
        { name: "Positive", value: analytics.sentimentCounts.positive, color: "#22c55e" },
        { name: "Neutral", value: analytics.sentimentCounts.neutral, color: "#f59e0b" },
        { name: "Negative", value: analytics.sentimentCounts.negative, color: "#ef4444" },
    ];

    const statCards = [
        { label: "Average Rating", value: `${analytics.avgRating}★`, icon: Star, color: "from-cyan-500 to-blue-600", change: "Overall score" },
        { label: "Reviews This Month", value: analytics.reviewsThisMonth, icon: TrendingUp, color: "from-violet-500 to-purple-600", change: `+${analytics.newThisWeek} this week` },
        { label: "Review Growth", value: analytics.growthMoM, icon: Zap, color: "from-indigo-500 to-indigo-600", change: "Volume trend" },
        { label: "Response Rate", value: `${analytics.responseRate}%`, icon: MessageSquare, color: "from-emerald-500 to-green-600", change: `${analytics.replied} replied` },
        { label: "Pending Reviews", value: analytics.pending, icon: Clock, color: "from-amber-500 to-orange-500", change: "Needs attention" },
        { label: "Review Requests Sent", value: analytics.requestsSent, icon: Send, color: "from-pink-500 to-rose-500", change: "Campaign invites" },
    ];

    return (
        <div className="h-screen overflow-y-auto">
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{business.logo}</span>
                        <h1 className="text-2xl font-bold text-white">{business.name}</h1>
                    </div>
                    <p className="text-muted-foreground">{business.category} · {business.address}</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                    {statCards.map(({ label, value, icon: Icon, color, change }) => (
                        <div key={label} className="glass-card rounded-2xl p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{value}</div>
                            <div className="text-sm font-medium text-muted-foreground mb-0.5">{label}</div>
                            <div className="text-xs text-muted-foreground/70">{change}</div>
                        </div>
                    ))}
                </div>

                {/* Core Performance KPIs Panel */}
                <div className="glass-card rounded-2xl p-5 mb-8 border border-primary/20 bg-primary/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-primary" /> Key Performance Indicators (KPIs)
                            </h2>
                            <p className="text-xs text-muted-foreground">Consolidated reputation performance metrics overview.</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1 max-w-2xl md:ml-8">
                            <div className="text-center md:text-left border-l border-border/60 pl-4">
                                <div className="text-xl font-bold text-white">{analytics.total}</div>
                                <div className="text-[10px] text-muted-foreground font-semibold uppercase">Review Volume</div>
                            </div>
                            <div className="text-center md:text-left border-l border-border/60 pl-4">
                                <div className="text-xl font-bold text-yellow-400">{analytics.avgRating}★</div>
                                <div className="text-[10px] text-muted-foreground font-semibold uppercase">Average Rating</div>
                            </div>
                            <div className="text-center md:text-left border-l border-border/60 pl-4">
                                <div className="text-xl font-bold text-emerald-400">{analytics.responseRate}%</div>
                                <div className="text-[10px] text-muted-foreground font-semibold uppercase">Response Rate</div>
                            </div>
                            <div className="text-center md:text-left border-l border-border/60 pl-4">
                                <div className="text-xl font-bold text-purple-400">
                                    {Math.round((analytics.sentimentCounts.positive / Math.max(analytics.total, 1)) * 100)}% Pos
                                </div>
                                <div className="text-[10px] text-muted-foreground font-semibold uppercase">Sentiment score</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activation Milestones Checklist Card */}
                {business && (
                    <div className="glass-card rounded-2xl p-5 mb-8 border border-border/80 bg-gradient-to-br from-card to-secondary/10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                    🚀 Activation Milestones & Customer Success
                                </h3>
                                <p className="text-xs text-muted-foreground">Complete these key tasks to activate your account and start getting value.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-primary">{
                                    Math.round(((
                                        (business.googleConnected ? 1 : 0) + 
                                        (business.campaignCreated ? 1 : 0) + 
                                        (business.reviewRequestSent ? 1 : 0) + 
                                        (business.aiReplyGenerated ? 1 : 0) + 
                                        (business.subscriptionActivated ? 1 : 0)
                                    ) / 5) * 100)
                                }% Done</span>
                                <div className="w-24 h-1.5 rounded-full bg-secondary/80 overflow-hidden">
                                    <div className="h-full bg-primary transition-all duration-300" style={{
                                        width: `${((
                                            (business.googleConnected ? 1 : 0) + 
                                            (business.campaignCreated ? 1 : 0) + 
                                            (business.reviewRequestSent ? 1 : 0) + 
                                            (business.aiReplyGenerated ? 1 : 0) + 
                                            (business.subscriptionActivated ? 1 : 0)
                                        ) / 5) * 100}%`
                                    }} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5 mt-2">
                            {[
                                { 
                                    label: "Link Google GMB", 
                                    done: business.googleConnected, 
                                    desc: "Fetch Google reviews", 
                                    href: "/dashboard/integrations" 
                                },
                                { 
                                    label: "Configure Campaign", 
                                    done: business.campaignCreated, 
                                    desc: "Setup request templates", 
                                    href: "/dashboard/requests" 
                                },
                                { 
                                    label: "Send First Request", 
                                    done: business.reviewRequestSent, 
                                    desc: "Invite guest feedback", 
                                    href: "/dashboard/requests" 
                                },
                                { 
                                    label: "Publish AI Reply", 
                                    done: business.aiReplyGenerated, 
                                    desc: "Auto tone response test", 
                                    href: "/dashboard/reviews" 
                                },
                                { 
                                    label: "Upgrade Account", 
                                    done: business.subscriptionActivated, 
                                    desc: "Activate paid license", 
                                    href: "/dashboard/settings" 
                                }
                            ].map((item, i) => (
                                <a 
                                    key={i} 
                                    href={item.href}
                                    className={`p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between hover:scale-[1.01] ${
                                        item.done 
                                            ? "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10" 
                                            : "bg-secondary/20 border-border/60 hover:border-primary/45 hover:bg-secondary/40"
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                            item.done ? "text-emerald-400" : "text-muted-foreground"
                                        }`}>{item.done ? "✓ Completed" : `Milestone ${i+1}`}</span>
                                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                                            item.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-muted-foreground/30"
                                        }`}>
                                            {item.done && <Check className="w-2.5 h-2.5" />}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white mb-0.5">{item.label}</p>
                                        <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Charts Row */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {/* Rating Trend */}
                    <div className="col-span-2 glass-card rounded-2xl p-5">
                        <h2 className="text-sm font-semibold text-foreground mb-4">Rating Trend (Last 8 Weeks)</h2>
                        <ResponsiveContainer width="100%" height={180}>
                            <LineChart data={analytics.weeklyTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} />
                                <YAxis domain={[0, 5]} tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ background: "#0f1629", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", color: "#f1f5f9" }} />
                                <Line type="monotone" dataKey="avgRating" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: "#6366f1", r: 4 }} name="Avg Rating" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Sentiment Donut */}
                    <div className="glass-card rounded-2xl p-5">
                        <h2 className="text-sm font-semibold text-foreground mb-4">Sentiment Mix</h2>
                        <ResponsiveContainer width="100%" height={120}>
                            <PieChart>
                                <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                                    {sentimentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: "#0f1629", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", color: "#f1f5f9" }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-1.5 mt-2">
                            {sentimentData.map(s => (
                                <div key={s.name} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                                        <span className="text-muted-foreground">{s.name}</span>
                                    </div>
                                    <span className="text-foreground font-medium">{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-3 gap-4">
                    {/* Recent Reviews */}
                    <div className="col-span-2 glass-card rounded-2xl p-5">
                        <h2 className="text-sm font-semibold text-foreground mb-4">Recent Reviews</h2>
                        <div className="space-y-3">
                            {recent.map(r => (
                                <div key={r.id} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-cyan-500/40 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                        {r.customerName.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className="text-sm font-medium text-foreground">{r.customerName}</span>
                                            <StarDisplay rating={r.rating} />
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{r.text}</p>
                                    </div>
                                    {r.status === "pending" && (
                                        <button onClick={() => openReply(r)}
                                            disabled={user?.role === "readonly"}
                                            className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                            Reply
                                        </button>
                                    )}
                                    {r.status === "replied" && (
                                        <span className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Replied</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Keywords */}
                    <div className="glass-card rounded-2xl p-5">
                        <h2 className="text-sm font-semibold text-foreground mb-4">Top Keywords</h2>
                        <div className="flex flex-wrap gap-2">
                            {analytics.topKeywords.slice(0, 12).map(({ word, count }) => (
                                <span key={word} className="px-2.5 py-1 rounded-lg text-xs bg-primary/10 text-primary border border-primary/20">
                                    {word} <span className="text-primary/60 ml-1">×{count}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reply Modal */}
            {replyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass-card rounded-2xl p-6 w-full max-w-lg border border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">Reply to Review</h3>
                            <button onClick={() => setReplyModal(null)} className="text-muted-foreground hover:text-white"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="p-3 rounded-xl bg-secondary/50 mb-4">
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-foreground">{replyModal.customerName}</span>
                                    <StarDisplay rating={replyModal.rating} />
                                </div>
                                {replyModal.sentiment && (
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full border uppercase font-bold tracking-wider ${
                                        replyModal.sentiment === "positive" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                        replyModal.sentiment === "negative" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                        "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                    }`}>
                                        {replyModal.sentiment} Sentiment
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">{replyModal.text}</p>
                        </div>

                        {/* AI Section with plan limit enforcement */}
                        {business.subscriptionPlan === "starter" ? (
                            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs mb-4 flex gap-2 items-start">
                                <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold">AI Autopilot Locked (Starter Plan)</p>
                                    <p className="mt-0.5 opacity-90">Upgrade to the Growth or Agency plan to unlock AI-powered suggested replies, custom tone controls, and sentiment insights!</p>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-4">
                                <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold mb-2">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    AI Reply Generator — Select Tone
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {(["friendly", "professional", "empathetic", "brand_voice"] as const).map((tone) => (
                                        <button
                                            type="button"
                                            key={tone}
                                            onClick={() => {
                                                setSelectedTone(tone);
                                                const matching = aiReplies.find(r => r.tone === tone);
                                                if (matching) setReplyText(matching.text);
                                            }}
                                            className={`flex-1 py-1.5 px-1 rounded-xl text-[11px] font-semibold border transition-all capitalize whitespace-nowrap ${
                                                selectedTone === tone
                                                    ? "bg-[#6366f1]/20 text-[#818cf8] border-[#6366f1]/40"
                                                    : "bg-secondary/40 text-muted-foreground border-border hover:text-foreground"
                                            }`}
                                        >
                                            {tone.replace("_", " ")}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={4} placeholder="Write your reply..."
                            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm resize-none mb-4" />

                        {user?.role === "readonly" ? (
                            <div className="text-center text-xs text-red-400 border border-red-500/20 bg-red-500/10 p-2.5 rounded-xl">
                                You have Read-Only permissions. You cannot reply to reviews.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => submitReply(true)}
                                    disabled={submitting || !replyText.trim()}
                                    className="py-3 rounded-xl border border-border hover:bg-secondary text-white font-semibold flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-50"
                                >
                                    <FileText className="w-4 h-4" />
                                    Save Draft
                                </button>
                                <button
                                    onClick={() => submitReply(false)}
                                    disabled={submitting || !replyText.trim()}
                                    className="py-3 rounded-xl btn-primary text-white font-semibold flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-50"
                                >
                                    <Check className="w-4 h-4" />
                                    Approve & Send
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
