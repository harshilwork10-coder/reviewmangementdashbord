"use client";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import {
    getBusinessByOwner, getReviewsByBusiness, Review, replyToReview,
    updateReviewStatus, deleteReview, getUsers, getLocationsByBusiness, getAIReplyStats, trackAIReplyGenerated, trackAIReplyApproved
} from "@/lib/store";
import { generateAIReply } from "@/lib/ai-analysis";
import { Star, Search, Filter, Send, Sparkles, X, Trash2, Archive, Flag, MessageSquare, AlertCircle, UserPlus, Lock, Check, Clock } from "lucide-react";

function StarDisplay({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className={`w-3 h-3 ${i <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
            ))}
        </div>
    );
}

function PlatformIcon({ source, className = "w-3.5 h-3.5" }: { source: string; className?: string }) {
    const src = source.toLowerCase();
    if (src.includes("google")) {
        return (
            <svg className={`${className} text-red-400`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.243 4.114-3.555 0-6.437-2.882-6.437-6.437 0-3.555 2.882-6.437 6.437-6.437 1.625 0 3.102.602 4.237 1.597l3.056-3.056C19.26 2.375 15.992 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.126 0 10.98-4.306 10.98-10.98 0-.648-.069-1.25-.185-1.815H12.24z"/>
            </svg>
        );
    }
    if (src.includes("facebook")) {
        return (
            <svg className={`${className} text-blue-500`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
        );
    }
    if (src.includes("tripadvisor")) {
        return (
            <svg className={`${className} text-emerald-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="8" cy="11.5" r="2.5"/>
                <circle cx="16" cy="11.5" r="2.5"/>
                <path d="M8 16c2 1.5 6 1.5 8 0"/>
            </svg>
        );
    }
    if (src.includes("booking")) {
        return (
            <div className="bg-[#003580] text-white flex items-center justify-center font-extrabold text-[8px] rounded-sm shrink-0" style={{ width: "14px", height: "14px" }}>
                B
            </div>
        );
    }
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
    );
}

const SENTINEL_COLORS: Record<string, string> = {
    positive: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    negative: "bg-red-500/10 text-red-400 border-red-500/20",
    neutral: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const STATUS_COLORS: Record<string, string> = {
    replied: "bg-emerald-500/10 text-emerald-400",
    pending: "bg-amber-500/10 text-amber-400",
    flagged: "bg-red-500/10 text-red-400",
    archived: "bg-secondary text-muted-foreground",
};

export default function ReviewsPage() {
    const { user, activeLocation, hasPermission } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [filtered, setFiltered] = useState<Review[]>([]);
    const [search, setSearch] = useState("");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sourceFilter, setSourceFilter] = useState("all");
    const [urgencyFilter, setUrgencyFilter] = useState("all");
    const [locationFilter, setLocationFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [businessLocations, setBusinessLocations] = useState<{ id: string, name: string }[]>([]);
    const [aiStats, setAiStats] = useState<{ repliesGenerated: number; repliesApproved: number; timeSaved: number }>({ repliesGenerated: 12, repliesApproved: 8, timeSaved: 20 });
    
    const [replyModal, setReplyModal] = useState<Review | null>(null);
    const [replyText, setReplyText] = useState("");
    const [aiReplies, setAiReplies] = useState<{ text: string; tone: string }[]>([]);
    const [selectedTone, setSelectedTone] = useState<"friendly" | "professional" | "empathetic" | "brand_voice">("friendly");
    const [submitting, setSubmitting] = useState(false);
    const [users, setUsers] = useState<{ id: string, name: string }[]>([]);

    const refresh = () => {
        if (!user) return;
        const biz = getBusinessByOwner(user.id);
        if (!biz) return;
        
        // Exclude isPrivate gated complaints from public reviews feed
        const all = getReviewsByBusiness(biz.id).filter(r => r.isPrivate !== true && (!activeLocation || r.locationId === activeLocation.id));
        const allUsers = getUsers().map(u => ({ id: u.id, name: u.name }));
        const locs = getLocationsByBusiness(biz.id);
        const stats = getAIReplyStats(biz.id);
        
        setReviews(all);
        setFiltered(all);
        setUsers(allUsers);
        setBusinessLocations(locs);
        setAiStats(stats);
    };

    useEffect(() => { refresh(); }, [user, activeLocation]);

    useEffect(() => {
        let r = [...reviews];
        if (search) r = r.filter(rv => rv.customerName.toLowerCase().includes(search.toLowerCase()) || rv.text.toLowerCase().includes(search.toLowerCase()));
        if (ratingFilter !== "all") r = r.filter(rv => rv.rating === parseInt(ratingFilter));
        if (statusFilter !== "all") r = r.filter(rv => rv.status === statusFilter);
        if (sourceFilter !== "all") r = r.filter(rv => rv.source === sourceFilter);
        if (urgencyFilter === "urgent") r = r.filter(rv => rv.isUrgent);
        
        // Location filter
        if (locationFilter !== "all") r = r.filter(rv => rv.locationId === locationFilter);
        
        // Date range filter
        if (dateFilter !== "all") {
            const now = new Date();
            r = r.filter(rv => {
                const date = new Date(rv.createdAt);
                const diffTime = Math.abs(now.getTime() - date.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (dateFilter === "today") {
                    return date.toDateString() === now.toDateString();
                } else if (dateFilter === "yesterday") {
                    const yesterday = new Date(now);
                    yesterday.setDate(now.getDate() - 1);
                    return date.toDateString() === yesterday.toDateString();
                } else if (dateFilter === "7days") {
                    return diffDays <= 7;
                } else if (dateFilter === "30days") {
                    return diffDays <= 30;
                }
                return true;
            });
        }
        
        setFiltered(r);
    }, [search, ratingFilter, statusFilter, sourceFilter, urgencyFilter, locationFilter, dateFilter, reviews]);

    const canEdit = hasPermission("edit");

    const openReply = (r: Review) => {
        if (!canEdit) return;
        setReplyModal(r);
        setReplyText(r.reply || "");
        
        const biz = getBusinessByOwner(user?.id || "");
        const toneGen = generateAIReply(r, biz?.brandVoice);
        setAiReplies(toneGen);
        
        const defaultTone = r.rating >= 4 ? "friendly" : r.rating === 3 ? "professional" : "empathetic";
        setSelectedTone(defaultTone);
        const matching = toneGen.find(tg => tg.tone === defaultTone) || toneGen[0];
        if (matching && !r.reply) {
            setReplyText(matching.text);
        }
        
        if (biz) {
            trackAIReplyGenerated(biz.id);
        }
    };

    const submitReply = () => {
        if (!canEdit) return;
        if (!replyModal || !replyText.trim()) return;
        setSubmitting(true);
        const biz = getBusinessByOwner(user?.id || "");
        setTimeout(() => {
            replyToReview(replyModal.id, replyText, user?.name || "Owner");
            if (biz) {
                trackAIReplyApproved(biz.id);
            }
            setReplyModal(null); setReplyText(""); setSubmitting(false); refresh();
        }, 500);
    };

    const handleStatus = (id: string, status: Review["status"]) => {
        if (!canEdit) return;
        updateReviewStatus(id, status); refresh();
    };

    const toggleUrgent = (id: string) => {
        if (!canEdit) return;
        const reviews = JSON.parse(localStorage.getItem("rms_reviews") || "[]") as Review[];
        const idx = reviews.findIndex(r => r.id === id);
        if (idx !== -1) {
            reviews[idx].isUrgent = !reviews[idx].isUrgent;
            localStorage.setItem("rms_reviews", JSON.stringify(reviews));
            refresh();
        }
    };

    const handleAssign = (reviewId: string, userId: string) => {
        if (!canEdit) return;
        const reviews = JSON.parse(localStorage.getItem("rms_reviews") || "[]") as Review[];
        const idx = reviews.findIndex(r => r.id === reviewId);
        if (idx !== -1) {
            reviews[idx].assignedTo = userId || undefined;
            localStorage.setItem("rms_reviews", JSON.stringify(reviews));
            refresh();
        }
    };

    const handleDelete = (id: string) => {
        if (!hasPermission("delete")) return;
        if (confirm("Delete this review permanently?")) { deleteReview(id); refresh(); }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    return (
        <div className="h-screen overflow-y-auto">
            <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Reviews Feed</h1>
                        <p className="text-muted-foreground text-sm mt-1">{filtered.length} reviews found</p>
                    </div>
                    
                    {!canEdit && (
                        <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md">
                            <Lock className="w-3.5 h-3.5" /> Read-Only Mode
                        </div>
                    )}
                </div>

                {/* AI Reply Center Stats Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="glass-card rounded-2xl p-4 border border-purple-500/20 bg-purple-500/5">
                        <div className="text-xs font-bold text-purple-400 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                            <Sparkles className="w-4 h-4 text-purple-400" /> AI Replies Generated
                        </div>
                        <div className="text-2xl font-extrabold text-white">{aiStats.repliesGenerated}</div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Total drafted suggestions</p>
                    </div>
                    <div className="glass-card rounded-2xl p-4 border border-emerald-500/20 bg-emerald-500/5">
                        <div className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                            <Check className="w-4 h-4 text-emerald-400" /> Approval Rate
                        </div>
                        <div className="text-2xl font-extrabold text-white">
                            {Math.round((aiStats.repliesApproved / Math.max(aiStats.repliesGenerated, 1)) * 100)}%
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{aiStats.repliesApproved} of {aiStats.repliesGenerated} approved</p>
                    </div>
                    <div className="glass-card rounded-2xl p-4 border border-cyan-500/20 bg-cyan-500/5">
                        <div className="text-xs font-bold text-cyan-400 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                            <Clock className="w-4 h-4 text-cyan-400" /> Time Saved
                        </div>
                        <div className="text-2xl font-extrabold text-white">{aiStats.timeSaved} mins</div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Based on 2.5 mins per review reply</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className="relative flex-1 min-w-[200px] max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reviews..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm" />
                    </div>
                    <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)} className="px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-white focus:outline-none">
                        <option value="all">All Ratings</option>
                        {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                    </select>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-white focus:outline-none">
                        <option value="all">Status</option>
                        <option value="pending">Pending</option>
                        <option value="replied">Replied</option>
                    </select>
                    <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-white focus:outline-none">
                        <option value="all">Source</option>
                        <option value="Google">Google</option>
                        <option value="Facebook">Facebook</option>
                        <option value="TripAdvisor">TripAdvisor</option>
                        <option value="Booking.com">Booking.com</option>
                    </select>
                    <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-white focus:outline-none">
                        <option value="all">All Locations</option>
                        {businessLocations.map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                    </select>
                    <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-white focus:outline-none">
                        <option value="all">Date Range</option>
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                    </select>
                    <select value={urgencyFilter} onChange={e => setUrgencyFilter(e.target.value)} className="px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-white focus:outline-none">
                        <option value="all">Urgency</option>
                        <option value="urgent">Urgent Only</option>
                    </select>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {filtered.map(review => (
                        <div key={review.id} className="glass-card rounded-2xl p-5 border border-border/60 hover:bg-white/5 transition-all">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-cyan-500/40 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                                    {review.customerName.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="font-bold text-white">{review.customerName}</span>
                                            <StarDisplay rating={review.rating} />
                                            {review.sentiment && (
                                                <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold capitalize ${SENTINEL_COLORS[review.sentiment]}`}>
                                                    {review.sentiment}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap md:justify-end">
                                            {review.isUrgent && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold tracking-wider uppercase flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> Urgent
                                                </span>
                                            )}
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/50 border border-border text-muted-foreground flex items-center gap-1.5 font-semibold">
                                                <PlatformIcon source={review.source} />
                                                {review.source}
                                            </span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border border-border/40 ${STATUS_COLORS[review.status]}`}>
                                                {review.status}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{review.text}</p>

                                    {review.reply && (
                                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-4">
                                            <div className="text-xs text-primary font-bold mb-1">Your Reply · {review.repliedBy}</div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{review.reply}</p>
                                        </div>
                                    )}

                                    {canEdit ? (
                                        <div className="flex items-center flex-wrap gap-2 pt-2 border-t border-border/30">
                                            <button onClick={() => openReply(review)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-primary/10 hover:bg-primary/25 border border-primary/25 hover:border-primary/40 text-primary transition-all font-bold cursor-pointer">
                                                <MessageSquare className="w-3.5 h-3.5" />
                                                {review.reply ? "Edit Reply" : "Reply"}
                                            </button>

                                            <button onClick={() => toggleUrgent(review.id)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all font-semibold cursor-pointer ${
                                                    review.isUrgent 
                                                    ? "bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25" 
                                                    : "bg-secondary hover:bg-secondary/80 text-muted-foreground border-border hover:text-white"
                                                }`}>
                                                <AlertCircle className="w-3.5 h-3.5" /> {review.isUrgent ? "Remove Urgent" : "Mark Urgent"}
                                            </button>

                                            <div className="relative group/assign">
                                                <select
                                                    value={review.assignedTo || ""}
                                                    onChange={(e) => handleAssign(review.id, e.target.value)}
                                                    className="flex items-center gap-1.5 pl-8 pr-6 py-1.5 rounded-lg text-xs bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-white border border-border transition-all appearance-none cursor-pointer font-medium focus:outline-none"
                                                >
                                                    <option value="">Assign To...</option>
                                                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                                </select>
                                                <UserPlus className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                            </div>

                                            {review.status !== "archived" && (
                                                <button onClick={() => handleStatus(review.id, "archived")}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-white border border-border transition-all ml-auto cursor-pointer font-semibold">
                                                    <Archive className="w-3.5 h-3.5" /> Archive
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-[10px] text-muted-foreground/60 italic flex items-center gap-1 mt-2">
                                            <Lock className="w-3 h-3" /> Actions locked. Owner, Admin, or Manager role required.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="text-center py-16 glass-card rounded-2xl border border-dashed">
                            <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3 animate-spin" />
                            <p className="text-muted-foreground">No reviews found matching your filters.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reply Modal */}
            {replyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass-card rounded-2xl p-6 w-full max-w-lg border border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">Reply to Review</h3>
                            <button onClick={() => setReplyModal(null)}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
                        </div>
                        <div className="p-3 rounded-xl bg-secondary/50 mb-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">{replyModal.customerName}</span>
                                <StarDisplay rating={replyModal.rating} />
                            </div>
                            <p className="text-xs text-muted-foreground">{replyModal.text}</p>
                        </div>
                        <div className="mb-3">
                            <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold mb-2">
                                <Sparkles className="w-3.5 h-3.5" /> AI Suggested Replies
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {aiReplies.map((r, i) => (
                                    <button key={i} type="button" onClick={() => { setReplyText(r.text); setSelectedTone(r.tone as any); }}
                                        className={`text-left p-3 rounded-xl border transition-all ${
                                            selectedTone === r.tone 
                                            ? "bg-purple-500/20 border-purple-500/50 shadow-md shadow-purple-500/5" 
                                            : "bg-purple-500/5 border-purple-500/10 hover:border-purple-500/30"
                                        }`}>
                                        <span className="text-[10px] text-purple-400 font-bold capitalize block mb-1">{r.tone.replace("_", " ")}</span>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{r.text}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={4}
                            placeholder="Write your reply..."
                            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm resize-none mb-4" />
                        <button onClick={submitReply} disabled={submitting || !replyText.trim()}
                            className="w-full py-3 rounded-xl bg-primary text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-primary/90 transition-colors cursor-pointer">
                            <Send className="w-4 h-4" />
                            {submitting ? "Sending..." : "Send Reply"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
