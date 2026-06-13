"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { 
    getBusinessesByAgency, getLocations, getReviews, 
    Business, Location, Review 
} from "@/lib/store";
import { 
    MapPin, Search, Filter, Shield, Activity, Star, CheckCircle, 
    AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw
} from "lucide-react";

export default function AgencyLocationsPage() {
    const { user } = useAuth();
    
    // Core states
    const [clients, setClients] = useState<Business[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [selectedClientFilter, setSelectedClientFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const refresh = () => {
        if (user && user.agencyId) {
            const agencyId = user.agencyId;
            const cls = getBusinessesByAgency(agencyId);
            setClients(cls);
            
            const clientIds = new Set(cls.map(c => c.id));
            setLocations(getLocations().filter(l => clientIds.has(l.businessId)));
            setReviews(getReviews().filter(r => clientIds.has(r.businessId)));
        }
    };

    useEffect(() => {
        refresh();
    }, [user]);

    const filteredLocations = locations.filter(loc => {
        const matchesClient = selectedClientFilter === "all" || loc.businessId === selectedClientFilter;
        
        const client = clients.find(c => c.id === loc.businessId);
        const matchesSearch = 
            loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (client?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
            
        return matchesClient && matchesSearch;
    });

    return (
        <div className="h-screen overflow-y-auto p-8 bg-background text-foreground flex flex-col">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-primary" /> Locations Health
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Monitor reputation metrics, average ratings, and health statuses across all client branches.
                    </p>
                </div>
                <button onClick={refresh} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-secondary/50 border border-border text-muted-foreground hover:text-white transition-all">
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between bg-card/20 border border-border/60 p-4 rounded-2xl">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search locations..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-secondary/35 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-xs" />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <select value={selectedClientFilter} onChange={e => setSelectedClientFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs text-white focus:outline-none focus:border-primary cursor-pointer">
                        <option value="all">All Clients</option>
                        {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Locations health grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 flex-1 min-h-0">
                {filteredLocations.map(loc => {
                    const client = clients.find(c => c.id === loc.businessId);
                    
                    // Analytics for this specific location
                    const locRevs = reviews.filter(r => r.locationId === loc.id);
                    const totalCount = locRevs.length;
                    
                    const avgRating = totalCount
                        ? parseFloat((locRevs.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1))
                        : 0;

                    const repliedCount = locRevs.filter(r => r.status === "replied").length;
                    const replyRate = totalCount ? Math.round((repliedCount / totalCount) * 100) : 0;

                    // Calculate Health Score: (rating / 5) * 60 + (replyRate / 100) * 40
                    const healthScore = totalCount
                        ? Math.round((avgRating / 5) * 60 + replyRate * 0.4)
                        : 100; // Default healthy if no reviews yet

                    // Simulated trend
                    const trendDirection = healthScore >= 80 ? "up" : healthScore >= 65 ? "flat" : "down";

                    return (
                        <div key={loc.id} className="glass-card rounded-2xl p-5 border border-border/60 flex flex-col justify-between space-y-4">
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <span className="text-xs font-bold text-white block">{loc.name}</span>
                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary uppercase font-bold tracking-wider">{client?.name || "Client"}</span>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                        {loc.address}
                                    </span>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold border ${
                                        healthScore >= 80 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                        healthScore >= 60 ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                                        "bg-red-500/10 border-red-500/20 text-red-400"
                                    }`}>
                                        {healthScore}% Health
                                    </span>
                                </div>
                            </div>

                            {/* Stats info */}
                            <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-border/10">
                                <div className="text-center">
                                    <span className="text-sm font-bold text-white block">{avgRating ? `${avgRating} ★` : "N/A"}</span>
                                    <span className="text-[9px] text-muted-foreground uppercase">Avg Rating</span>
                                </div>
                                <div className="text-center">
                                    <span className="text-sm font-bold text-white block">{totalCount}</span>
                                    <span className="text-[9px] text-muted-foreground uppercase">Reviews</span>
                                </div>
                                <div className="text-center">
                                    <span className="text-sm font-bold text-white block">{replyRate}%</span>
                                    <span className="text-[9px] text-muted-foreground uppercase">Replied</span>
                                </div>
                            </div>

                            {/* Trend chart / timeline simulation */}
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-[10px] text-muted-foreground">Rating Trend (30d)</span>
                                <div className="flex items-center gap-1 text-[10px] font-bold">
                                    {trendDirection === "up" && (
                                        <span className="text-emerald-400 flex items-center gap-0.5"><ArrowUpRight className="w-3.5 h-3.5" /> Improving</span>
                                    )}
                                    {trendDirection === "flat" && (
                                        <span className="text-muted-foreground flex items-center gap-0.5">Stable</span>
                                    )}
                                    {trendDirection === "down" && (
                                        <span className="text-red-400 flex items-center gap-0.5"><ArrowDownRight className="w-3.5 h-3.5" /> Declining</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {filteredLocations.length === 0 && (
                    <div className="col-span-3 py-12 text-center text-xs text-muted-foreground">No locations found.</div>
                )}
            </div>
        </div>
    );
}
