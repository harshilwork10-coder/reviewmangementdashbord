"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getAgencies, saveAgency, Agency, addAuditLog } from "@/lib/store";
import { 
    Palette, Upload, Globe, Check, Eye, Layout, ShieldCheck, 
    RefreshCw, Sparkles, AlertCircle
} from "lucide-react";

export default function AgencyBrandingPage() {
    const { user } = useAuth();
    const [agency, setAgency] = useState<Agency | null>(null);

    // Form states
    const [name, setName] = useState("");
    const [logo, setLogo] = useState("🚀");
    const [primaryColor, setPrimaryColor] = useState("#ef4444");
    const [secondaryColor, setSecondaryColor] = useState("#3b82f6");
    const [domain, setDomain] = useState("");
    const [reportHeader, setReportHeader] = useState("Apex Performance Summary");
    const [showWatermark, setShowWatermark] = useState(false);

    const [notification, setNotification] = useState<string | null>(null);

    const showNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const refresh = () => {
        if (user && user.agencyId) {
            const ags = getAgencies();
            const ag = ags.find(a => a.id === user.agencyId);
            if (ag) {
                setAgency(ag);
                setName(ag.name);
                setLogo(ag.logo);
                setPrimaryColor(ag.primaryColor);
                setSecondaryColor(ag.secondaryColor);
                
                // Get other mock branding variables from localStorage if saved
                const customDomain = localStorage.getItem(`rms_agency_domain_${ag.id}`) || "";
                setDomain(customDomain);

                const mockReportHeader = localStorage.getItem(`rms_agency_report_header_${ag.id}`) || "Reputation Performance Summary";
                setReportHeader(mockReportHeader);

                const mockWatermark = localStorage.getItem(`rms_agency_report_watermark_${ag.id}`) === "true";
                setShowWatermark(mockWatermark);
            }
        }
    };

    useEffect(() => {
        refresh();
    }, [user]);

    const handleSaveBranding = (e: React.FormEvent) => {
        e.preventDefault();
        if (!agency) return;

        const updated: Agency = {
            ...agency,
            name,
            logo,
            primaryColor,
            secondaryColor
        };
        
        saveAgency(updated);
        
        // Save additional whitelabel variables
        localStorage.setItem(`rms_agency_domain_${agency.id}`, domain);
        localStorage.setItem(`rms_agency_report_header_${agency.id}`, reportHeader);
        localStorage.setItem(`rms_agency_report_watermark_${agency.id}`, showWatermark ? "true" : "false");

        // Force a page refresh in parent elements by raising an audit log
        addAuditLog("Agency Branding Updated", undefined, user?.id, { name, logo, primaryColor });
        showNotification("Branding guidelines saved successfully!");
        refresh();
    };

    if (!agency) return <div className="flex items-center justify-center h-screen"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;

    return (
        <div className="h-screen overflow-y-auto p-8 bg-background text-foreground relative">
            {/* Notification Banner */}
            {notification && (
                <div className="fixed top-4 right-4 z-[100] px-4 py-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-semibold transition-all">
                    <Check className="w-4 h-4" />
                    {notification}
                </div>
            )}

            {/* Page Title */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Palette className="w-6 h-6 text-primary" /> White Labeling & Branding
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Upload agency logos, choose colors, set custom domains, and construct report layouts.
                </p>
            </div>

            {/* Split Screen Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customizer Panel */}
                <form onSubmit={handleSaveBranding} className="glass-card rounded-2xl p-6 border border-border/60 lg:col-span-2 space-y-6">
                    <div>
                        <h3 className="text-base font-bold text-white mb-1">Branding Parameters</h3>
                        <p className="text-xs text-muted-foreground">Adjust your custom logo, dashboard colors, and whitelist domain settings.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 block">Agency Brand Name</label>
                            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Apex Agency"
                                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 block">Brand Avatar Logo emoji</label>
                            <input value={logo} onChange={e => setLogo(e.target.value)} placeholder="e.g. 🚀"
                                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white text-center focus:outline-none focus:border-primary text-xl" />
                        </div>

                        {/* Colors */}
                        <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 block">Primary Color</label>
                            <div className="flex gap-2">
                                <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} 
                                    className="w-10 h-10 rounded-xl bg-secondary border border-border cursor-pointer" />
                                <input value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none focus:border-primary font-mono text-xs uppercase" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 block">Secondary Color</label>
                            <div className="flex gap-2">
                                <input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} 
                                    className="w-10 h-10 rounded-xl bg-secondary border border-border cursor-pointer" />
                                <input value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none focus:border-primary font-mono text-xs uppercase" />
                            </div>
                        </div>

                        {/* Domain configuration */}
                        <div className="sm:col-span-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 block">Custom Domain (Whitelabel CNAME)</label>
                            <div className="flex gap-2">
                                <span className="flex items-center px-4 rounded-xl bg-secondary/50 border border-border text-muted-foreground text-xs font-mono">https://</span>
                                <input value={domain} onChange={e => setDomain(e.target.value)} placeholder="reviews.apexrep.com"
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none focus:border-primary text-xs" />
                            </div>
                            <p className="text-[9px] text-muted-foreground mt-1.5 leading-snug">
                                <AlertCircle className="w-3.5 h-3.5 text-primary inline mr-1" />
                                Requires setting a CNAME record in your DNS manager pointing to <code className="text-white font-mono bg-secondary/40 px-1 py-0.5 rounded">cname.reviewmanagement.com</code>.
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border/30">
                        <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Reports Header Configurations</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="sm:col-span-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 block">Report Title Header</label>
                                <input value={reportHeader} onChange={e => setReportHeader(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none" />
                            </div>
                            <div className="sm:col-span-2 flex items-center justify-between py-1 border-t border-border/10 mt-2">
                                <div>
                                    <span className="text-xs font-semibold text-white block">Remove 'Powered by ReviewManagement'</span>
                                    <span className="text-[10px] text-muted-foreground">Excludes watermark markings from PDF reports and dashboards footer.</span>
                                </div>
                                <button type="button" onClick={() => setShowWatermark(!showWatermark)}
                                    className={`w-12 h-6.5 rounded-full p-1 transition-colors flex items-center ${
                                        showWatermark ? "bg-primary justify-end" : "bg-secondary border border-border justify-start"
                                    }`}>
                                    <div className="w-4.5 h-4.5 rounded-full bg-white shadow-md" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <button type="submit"
                        className="w-full py-3 rounded-xl btn-primary text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-primary/20">
                        <Check className="w-4.5 h-4.5" /> Save Whitelabel Configurations
                    </button>
                </form>

                {/* Dashboard preview */}
                <div className="glass-card rounded-2xl p-6 border border-border/60 lg:col-span-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Eye className="w-4.5 h-4.5 text-primary" /> Live Portal Preview</h3>
                        <p className="text-[10px] text-muted-foreground">Real-time simulation of client-facing dashboards re-themed using your parameters.</p>
                    </div>

                    {/* Preview Screen */}
                    <div className="border border-border/60 rounded-2xl bg-neutral-900 p-4 shadow-xl space-y-4 scale-95 origin-top relative overflow-hidden">
                        {/* Switched logo & colors */}
                        <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                            <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-sm shrink-0" style={{ border: `1px solid ${primaryColor}` }}>
                                {logo}
                            </div>
                            <span className="text-xs font-bold text-white leading-none">{name || "Apex Agency"}</span>
                            <span className="ml-auto w-12 h-1 rounded-full" style={{ backgroundColor: primaryColor }} />
                        </div>

                        {/* Dummy Card */}
                        <div className="p-3.5 rounded-xl border border-border/20 space-y-2.5 relative overflow-hidden bg-secondary/10">
                            {/* Glow */}
                            <div className="absolute right-0 top-0 w-8 h-8 rounded-full blur-xl opacity-20" style={{ backgroundColor: secondaryColor }} />
                            
                            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Average Customer Rating</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-extrabold text-white">4.8 ★</span>
                                <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5">
                                    <Sparkles className="w-3 h-3 text-emerald-400 fill-emerald-400" /> +0.2 this month
                                </span>
                            </div>
                        </div>

                        {/* Dummy button */}
                        <button type="button" className="w-full py-2 rounded-xl text-[10px] font-bold text-white text-center transition-all" 
                            style={{ backgroundColor: primaryColor, boxShadow: `0px 4px 10px rgba(0,0,0,0.15)` }}>
                            Export Report
                        </button>

                        {!showWatermark && (
                            <div className="text-[8px] text-center text-muted-foreground/45 mt-2">
                                Powered by ReviewManagement
                            </div>
                        )}
                    </div>

                    {/* Helper text */}
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-xs text-primary flex items-start gap-2">
                        <Layout className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                        <p className="leading-relaxed text-[11px] text-muted-foreground/80">
                            Client dashboards (rendered under custom subdomains) will completely mask all ReviewManagement naming references, featuring your custom logos, colors, and whitelabel templates.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
