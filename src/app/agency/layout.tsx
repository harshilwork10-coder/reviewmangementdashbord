"use client";
import { useAuth } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
    LayoutDashboard, Users, MapPin, Palette, ShieldAlert, 
    BarChart3, CreditCard, LogOut, ChevronRight, Briefcase, Search, Star, Bookmark
} from "lucide-react";
import { getBusinessesByAgency, getAgencies, Agency, Business } from "@/lib/store";

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout, switchClientBusiness } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const [agency, setAgency] = useState<Agency | null>(null);
    const [clients, setClients] = useState<Business[]>([]);
    const [clientSelectorOpen, setClientSelectorOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [recentClients, setRecentClients] = useState<Business[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]); // client IDs

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
            return;
        }
        if (!loading && user && user.role !== "agency") {
            router.push("/dashboard");
            return;
        }

        if (user && user.agencyId) {
            const ags = getAgencies();
            const ag = ags.find(a => a.id === user.agencyId);
            if (ag) setAgency(ag);
            
            const cls = getBusinessesByAgency(user.agencyId);
            setClients(cls);
            if (cls.length > 0) {
                // Seed recent list
                setRecentClients(cls.slice(0, 3));
            }
        }
    }, [user, loading, router]);

    const toggleFavorite = (clientId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (favorites.includes(clientId)) {
            setFavorites(favorites.filter(id => id !== clientId));
        } else {
            setFavorites([...favorites, clientId]);
        }
    };

    const handleSwitchClient = (client: Business) => {
        switchClientBusiness(client.id);
        setClientSelectorOpen(false);
        router.push("/dashboard");
    };

    if (loading || !user || user.role !== "agency") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const navItems = [
        { href: "/agency", icon: LayoutDashboard, label: "Overview" },
        { href: "/agency/clients", icon: Users, label: "Client Directory" },
        { href: "/agency/locations", icon: MapPin, label: "Locations Health" },
        { href: "/agency/branding", icon: Palette, label: "White Labeling" },
        { href: "/agency/team", icon: Users, label: "Team Management" },
        { href: "/agency/reports", icon: BarChart3, label: "Reports Center" },
        { href: "/agency/billing", icon: CreditCard, label: "Agency Billing" },
    ];

    const currentAgencyName = agency?.name || "Apex Reputation Partners";
    const currentAgencyLogo = agency?.logo || "🚀";

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-64 min-h-screen flex flex-col border-r border-border bg-card/30 backdrop-blur-xl">
                <div className="p-6 border-b border-border">
                    <Link href="/agency" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center flex-shrink-0 text-xl">
                            {currentAgencyLogo}
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white leading-none truncate max-w-[150px]">{currentAgencyName}</div>
                            <div className="text-[10px] text-primary font-medium mt-1 uppercase tracking-wider">Agency Workspace</div>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 p-3 space-y-1 mt-2">
                    {navItems.map(({ href, icon: Icon, label }) => {
                        const active = pathname === href;
                        return (
                            <Link key={href} href={href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                                    active 
                                        ? "bg-primary/10 text-primary border border-primary/20" 
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                }`}>
                                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-primary" : ""}`} />
                                {label}
                                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-primary" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-border">
                    <div className="flex items-center gap-3 px-3 py-2 mb-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                            <p className="text-[10px] text-muted-foreground capitalize leading-none mt-0.5">{user.agencyRole || "staff"} Account</p>
                        </div>
                    </div>
                    <button onClick={() => { logout(); router.push("/login"); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header with Client Switcher */}
                <header className="h-16 border-b border-border bg-card/10 backdrop-blur-xl flex items-center justify-between px-8 z-40 shrink-0">
                    <div className="relative">
                        <button onClick={() => setClientSelectorOpen(!clientSelectorOpen)}
                            className="flex items-center gap-2.5 px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border rounded-xl text-sm text-white font-medium transition-all">
                            <Briefcase className="w-4 h-4 text-primary" />
                            <span>Impersonate Client Business</span>
                            <ChevronRight className={`w-4 h-4 transition-transform rotate-90 ${clientSelectorOpen ? "-rotate-90" : ""}`} />
                        </button>

                        {/* Client Switcher Dropdown */}
                        {clientSelectorOpen && (
                            <div className="absolute left-0 mt-2 w-80 glass-card border border-border rounded-2xl shadow-2xl p-4 space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search clients..."
                                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-secondary/45 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-xs" />
                                </div>

                                {/* Favorites Section */}
                                {favorites.length > 0 && searchQuery === "" && (
                                    <div className="space-y-1">
                                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                            <Bookmark className="w-3 h-3 text-primary fill-primary" /> Favorites
                                        </div>
                                        <div className="space-y-1">
                                            {clients.filter(c => favorites.includes(c.id)).map(client => (
                                                <button key={client.id} onClick={() => handleSwitchClient(client)}
                                                    className="w-full flex items-center justify-between p-2 rounded-lg bg-secondary/20 hover:bg-secondary/40 text-left text-xs transition-all">
                                                    <span className="font-medium text-white">{client.name}</span>
                                                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 cursor-pointer" onClick={(e) => toggleFavorite(client.id, e)} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recent Switched Clients */}
                                {recentClients.length > 0 && searchQuery === "" && (
                                    <div className="space-y-1">
                                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Recent Views</div>
                                        <div className="space-y-1">
                                            {recentClients.map(client => (
                                                <button key={client.id} onClick={() => handleSwitchClient(client)}
                                                    className="w-full flex items-center justify-between p-2 rounded-lg bg-secondary/20 hover:bg-secondary/40 text-left text-xs transition-all">
                                                    <span className="text-muted-foreground hover:text-white truncate max-w-[180px]">{client.name}</span>
                                                    <Star className={`w-3.5 h-3.5 cursor-pointer ${favorites.includes(client.id) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground hover:text-white"}`} 
                                                        onClick={(e) => toggleFavorite(client.id, e)} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Main Client List */}
                                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">All Agency Clients ({filteredClients.length})</div>
                                    {filteredClients.map(client => (
                                        <button key={client.id} onClick={() => handleSwitchClient(client)}
                                            className="w-full flex items-center justify-between p-2 rounded-lg bg-secondary/10 hover:bg-secondary/30 text-left text-xs transition-all">
                                            <div className="min-w-0">
                                                <span className="font-semibold text-white truncate block">{client.name}</span>
                                                <span className="text-[9px] text-muted-foreground capitalize">{client.category}</span>
                                            </div>
                                            <Star className={`w-3.5 h-3.5 shrink-0 cursor-pointer ${favorites.includes(client.id) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground hover:text-white"}`} 
                                                onClick={(e) => toggleFavorite(client.id, e)} />
                                        </button>
                                    ))}
                                    {filteredClients.length === 0 && (
                                        <div className="text-center py-4 text-xs text-muted-foreground">No clients found.</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Sub Pages content */}
                <main className="flex-1 overflow-hidden relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
