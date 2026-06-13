"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { 
    getBusinessesByAgency, getReviews, getLocations, 
    Business, Review, Location 
} from "@/lib/store";
import { 
    BarChart3, Download, Mail, Calendar, FileText, Check, 
    RefreshCw, ChevronRight, Share2, Printer, Search
} from "lucide-react";

export default function AgencyReportsPage() {
    const { user } = useAuth();
    
    // Core states
    const [clients, setClients] = useState<Business[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedClient, setSelectedClient] = useState("all");
    const [reportType, setReportType] = useState<"performance" | "location" | "response" | "growth">("performance");

    // Email Scheduler states
    const [schedulerEmail, setSchedulerEmail] = useState("");
    const [schedulerFrequency, setSchedulerFrequency] = useState("weekly");
    const [schedulerFormat, setSchedulerFormat] = useState("pdf");

    // Loading / Action states
    const [exportingPdf, setExportingPdf] = useState(false);
    const [exportingCsv, setExportingCsv] = useState(false);
    const [scheduling, setScheduling] = useState(false);

    const [notification, setNotification] = useState<string | null>(null);

    const showNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const refresh = () => {
        if (user && user.agencyId) {
            const agencyId = user.agencyId;
            const cls = getBusinessesByAgency(agencyId);
            setClients(cls);
            
            const clientIds = new Set(cls.map(c => c.id));
            setReviews(getReviews().filter(r => clientIds.has(r.businessId)));
            setLocations(getLocations().filter(l => clientIds.has(l.businessId)));
        }
    };

    useEffect(() => {
        refresh();
    }, [user]);

    // Export Handlers (Simulated)
    const handlePdfExport = () => {
        setExportingPdf(true);
        setTimeout(() => {
            setExportingPdf(false);
            showNotification("PDF Report downloaded successfully!");
        }, 2500);
    };

    const handleCsvExport = () => {
        setExportingCsv(true);
        setTimeout(() => {
            setExportingCsv(false);
            showNotification("CSV Spreadsheet exported successfully!");
        }, 1500);
    };

    const handleScheduleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!schedulerEmail.trim()) {
            alert("Please provide email address");
            return;
        }
        setScheduling(true);
        setTimeout(() => {
            setScheduling(false);
            showNotification(`Scheduled report sent to ${schedulerEmail} successfully!`);
            setSchedulerEmail("");
        }, 2000);
    };

    // Calculate aggregated metrics
    const currentReviews = reviews.filter(r => 
        selectedClient === "all" ? true : r.businessId === selectedClient
    );

    const totalReviews = currentReviews.length;
    const avgRating = totalReviews
        ? parseFloat((currentReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
        : 0;

    const repliedReviews = currentReviews.filter(r => r.status === "replied").length;
    const responseRate = totalReviews ? Math.round((repliedReviews / totalReviews) * 100) : 0;

    const positiveReviews = currentReviews.filter(r => r.rating >= 4).length;
    const neutralReviews = currentReviews.filter(r => r.rating === 3).length;
    const negativeReviews = currentReviews.filter(r => r.rating <= 2).length;

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
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-primary" /> Reports Console
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Build whitelabel reputational performance summaries, download data, or schedule email reports.
                    </p>
                </div>
                <button onClick={refresh} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-secondary/50 border border-border text-muted-foreground hover:text-white transition-all">
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
            </div>

            {/* Controls Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between bg-card/20 border border-border/60 p-4 rounded-2xl shrink-0">
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    {/* Client Selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Client:</span>
                        <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}
                            className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs text-white focus:outline-none focus:border-primary cursor-pointer">
                            <option value="all">Consolidated (All Clients)</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Report Type Selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Report Type:</span>
                        <div className="flex bg-secondary rounded-lg p-0.5 border border-border">
                            {[
                                { id: "performance", label: "Performance" },
                                { id: "location", label: "Locations" },
                                { id: "response", label: "Response Rate" },
                                { id: "growth", label: "Growth" }
                            ].map(t => (
                                <button key={t.id} onClick={() => setReportType(t.id as any)}
                                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                                        reportType === t.id 
                                            ? "bg-primary text-white" 
                                            : "text-muted-foreground hover:text-white"
                                    }`}>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Exporters */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <button onClick={handlePdfExport} disabled={exportingPdf}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-primary hover:bg-primary/95 text-white font-bold transition-all disabled:opacity-50">
                        {exportingPdf ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                        Download Whitelabel PDF
                    </button>
                    <button onClick={handleCsvExport} disabled={exportingCsv}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-secondary/80 border border-border hover:bg-secondary text-white font-bold transition-all disabled:opacity-50">
                        {exportingCsv ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Split Panel: preview & scheduler */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 overflow-hidden">
                {/* Left/Middle: Visual Report Preview */}
                <div className="glass-card rounded-2xl border border-border/60 lg:col-span-2 overflow-y-auto p-6 space-y-6 bg-card/10">
                    <div className="border-b border-border/40 pb-4 flex justify-between items-center flex-wrap gap-2">
                        <div>
                            <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">Apex Reputation Report</span>
                            <h2 className="text-base font-bold text-white leading-tight capitalize">{reportType} Analytics Summary</h2>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">Run: {new Date().toLocaleDateString()}</span>
                    </div>

                    {/* Review performance stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-secondary/25 border border-border/40 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Reviews Analyzed</span>
                                <div className="text-2xl font-extrabold text-white mt-1">{totalReviews}</div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-secondary/25 border border-border/40 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Reputation Rating</span>
                                <div className="text-2xl font-extrabold text-white mt-1">{avgRating ? `${avgRating} ★` : "N/A"}</div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-secondary/25 border border-border/40 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Response Ratio</span>
                                <div className="text-2xl font-extrabold text-white mt-1">{responseRate}%</div>
                            </div>
                        </div>
                    </div>

                    {/* Breakdown graphics simulation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border/10">
                        {/* Sentiment chart */}
                        <div className="p-5 rounded-2xl bg-secondary/15 border border-border/30 space-y-4">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Sentiment Distributions</h4>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-emerald-400">Positive (4-5★)</span>
                                        <span className="font-semibold text-white">{positiveReviews} reviews ({totalReviews ? Math.round((positiveReviews/totalReviews)*100) : 0}%)</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-400" style={{ width: totalReviews ? `${(positiveReviews/totalReviews)*100}%` : "0%" }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-amber-400">Neutral (3★)</span>
                                        <span className="font-semibold text-white">{neutralReviews} reviews ({totalReviews ? Math.round((neutralReviews/totalReviews)*100) : 0}%)</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-400" style={{ width: totalReviews ? `${(neutralReviews/totalReviews)*100}%` : "0%" }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-red-400">Negative (1-2★)</span>
                                        <span className="font-semibold text-white">{negativeReviews} reviews ({totalReviews ? Math.round((negativeReviews/totalReviews)*100) : 0}%)</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-400" style={{ width: totalReviews ? `${(negativeReviews/totalReviews)*100}%` : "0%" }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Source Distribution */}
                        <div className="p-5 rounded-2xl bg-secondary/15 border border-border/30 space-y-4">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Integration sources</h4>
                            <div className="space-y-2.5 text-xs">
                                {[
                                    { name: "Google Business Profile", count: currentReviews.filter(r => r.source === "Google").length, color: "bg-blue-400" },
                                    { name: "Facebook Ratings", count: currentReviews.filter(r => r.source === "Facebook" || r.source === "TripAdvisor").length, color: "bg-indigo-400" },
                                    { name: "TripAdvisor Travel", count: currentReviews.filter(r => r.source === "Booking.com" || r.source === "Booking").length, color: "bg-emerald-400" }
                                ].map(src => {
                                    const pct = totalReviews ? Math.round((src.count / totalReviews) * 100) : 0;
                                    return (
                                        <div key={src.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${src.color}`} />
                                                <span className="text-muted-foreground">{src.name}</span>
                                            </div>
                                            <span className="font-semibold text-white">{src.count} ({pct}%)</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Email Delivery scheduler */}
                <div className="glass-card rounded-2xl p-6 border border-border/60 lg:col-span-1 h-fit space-y-5">
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                            <Mail className="w-4.5 h-4.5 text-primary" /> Delivery Scheduler
                        </h3>
                        <p className="text-[10px] text-muted-foreground">Automate report deliveries. Schedule email dispatches to client contacts or managers.</p>
                    </div>

                    <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
                        <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Recipient Email Address</label>
                            <input type="email" value={schedulerEmail} onChange={e => setSchedulerEmail(e.target.value)} placeholder="e.g. client-ceo@domain.com"
                                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white text-xs focus:outline-none focus:border-primary" />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Dispatch Frequency</label>
                            <select value={schedulerFrequency} onChange={e => setSchedulerFrequency(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white text-xs focus:outline-none cursor-pointer">
                                <option value="daily">Daily dispatches</option>
                                <option value="weekly">Weekly dispatches (Monday AM)</option>
                                <option value="monthly">Monthly dispatches (1st of month)</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Export Format</label>
                            <div className="grid grid-cols-2 gap-2">
                                {["pdf", "csv"].map(format => (
                                    <button key={format} type="button" onClick={() => setSchedulerFormat(format)}
                                        className={`py-2 rounded-xl border text-xs font-semibold uppercase transition-all ${
                                            schedulerFormat === format 
                                                ? "bg-primary/10 border-primary text-primary" 
                                                : "bg-secondary/35 border-border text-muted-foreground hover:bg-secondary/50"
                                        }`}>
                                        {format} Format
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button type="submit" disabled={scheduling}
                            className="w-full py-3 rounded-xl btn-primary text-white font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 disabled:opacity-50">
                            {scheduling ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                            Schedule Automatic Delivery
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
