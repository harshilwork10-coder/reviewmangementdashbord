"use client";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getBusinessByOwner, getCampaignsByBusiness, addCampaign, toggleCampaignActive, ReviewRequestCampaign, Business, getLocationsByBusiness, Location } from "@/lib/store";
import { Smartphone, Mail, QrCode, Plus, Play, Pause, X, Printer, Link as LinkIcon, Check, Copy, ChevronRight, Users, BellRing, Sparkles } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";

export default function RequestsPage() {
    const { user, activeLocation, hasPermission } = useAuth();
    const [business, setBusiness] = useState<Business | null>(null);
    const [campaigns, setCampaigns] = useState<ReviewRequestCampaign[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showFlyerModal, setShowFlyerModal] = useState(false);
    const [flyerText, setFlyerText] = useState("We'd love your feedback! Scan the QR Code below to leave a review.");
    const [copied, setCopied] = useState(false);

    // QR Configuration State
    const [qrType, setQrType] = useState("location");
    const [qrSize, setQrSize] = useState("poster");
    const [qrLocationId, setQrLocationId] = useState("");
    const [qrCampaignId, setQrCampaignId] = useState("");
    const [qrCustomSource, setQrCustomSource] = useState("table");

    // Form state
    const [selectedTemplate, setSelectedTemplate] = useState("friendly");
    const [newCampaign, setNewCampaign] = useState({ name: "", channel: "email", templateSubject: "How was your experience with us?", templateBody: "Hi there! We hope you had a fantastic time. If you have 60 seconds, we'd love it if you could share a quick review with us.", sendDelayHours: 24 });

    const TEMPLATES = {
        friendly: {
            subject: "How was your experience with us?",
            body: "Hi there! We hope you had a fantastic time. If you have 60 seconds, we'd love it if you could share a quick review with us!"
        },
        formal: {
            subject: "Thank you for choosing our business",
            body: "Dear Guest, thank you for your recent patronage. Your feedback is vital to our operations. Please take a moment to evaluate your experience."
        },
        incentive: {
            subject: "Help us improve and win a monthly raffle!",
            body: "Hi! We are always trying to get better. Rate your visit to help us out, and you will be automatically entered into our monthly raffle drawing!"
        }
    };

    const handleTemplateChange = (tmplKey: keyof typeof TEMPLATES) => {
        setSelectedTemplate(tmplKey);
        const tmpl = TEMPLATES[tmplKey];
        setNewCampaign(prev => ({
            ...prev,
            templateSubject: tmpl.subject,
            templateBody: tmpl.body
        }));
    };

    const [locations, setLocations] = useState<Location[]>([]);

    const refresh = () => {
        if (!user) return;
        const biz = getBusinessByOwner(user.id);
        if (!biz) return;
        setBusiness(biz);
        const camps = getCampaignsByBusiness(biz.id).filter(c => !activeLocation || c.locationId === activeLocation.id);
        const locs = getLocationsByBusiness(biz.id);
        setCampaigns(camps);
        setLocations(locs);
        
        if (locs.length > 0 && !qrLocationId) setQrLocationId(locs[0].id);
        if (camps.length > 0 && !qrCampaignId) setQrCampaignId(camps[0].id);
    };

    useEffect(() => { refresh(); }, [user, activeLocation]);

    const handleCreateCampaign = (e: React.FormEvent) => {
        e.preventDefault();
        if (!business) return;
        if (!hasPermission("create")) return;
        addCampaign({
            businessId: business.id,
            name: newCampaign.name,
            channel: newCampaign.channel as any,
            templateSubject: newCampaign.channel === "email" ? newCampaign.templateSubject : undefined,
            templateBody: newCampaign.templateBody,
            sendDelayHours: newCampaign.sendDelayHours,
            isActive: true,
            locationId: activeLocation?.id,
        });
        setShowModal(false);
        setNewCampaign({ name: "", channel: "email", templateSubject: "How was your stay?", templateBody: "Hi there!", sendDelayHours: 24 });
        refresh();
    };

    const handleToggle = (id: string, currentActive: boolean) => {
        if (!hasPermission("edit")) return;
        toggleCampaignActive(id, !currentActive);
        refresh();
    };

    const handleCopy = () => {
        if (!business) return;
        const url = `${window.location.origin}/business/${business.slug}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!business) {
        return <div className="flex items-center justify-center p-12"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;
    }

    const channelDetails = {
        email: { icon: Mail, label: "Email Automation" },
        sms: { icon: Smartphone, label: "SMS Automation" },
        qr: { icon: QrCode, label: "QR Code Generation" },
    };

    const canCreate = hasPermission("create");
    const canEdit = hasPermission("edit");

    const directLink = typeof window !== "undefined" ? `${window.location.origin}/business/${business.slug}` : "";

    const workflowSteps = [
        { title: "1. Customer Checkout", desc: "Guest checks out from your system, triggering a webhook event.", icon: Users },
        { title: "2. Request Dispatched", desc: "Twilio or SendGrid automatically delivers the SMS/Email request.", icon: Smartphone },
        { title: "3. Review Submitted", desc: "Guest lands on the Direct Review Link or scans the QR to submit feedback.", icon: Sparkles },
        { title: "4. Dashboard Insights", desc: "System updates metrics, generates AI replies, and reports sentiment.", icon: BellRing }
    ];

    return (
        <div className="p-8 h-screen overflow-y-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Review Requests</h1>
                    <p className="text-muted-foreground text-sm">Automate sending review invitations to recent guests.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowFlyerModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary text-white border border-border rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors">
                        <QrCode className="w-4 h-4" />
                        Printable Flyer
                    </button>
                    <button
                        onClick={() => { if (canCreate) setShowModal(true); }}
                        disabled={!canCreate}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            canCreate 
                            ? "bg-primary text-white hover:bg-primary/95 shadow-lg shadow-primary/20" 
                            : "bg-secondary/50 text-muted-foreground cursor-not-allowed border border-border"
                        }`}>
                        <Plus className="w-4 h-4" />
                        New Campaign
                    </button>
                </div>
            </div>

            {/* Direct Link Section */}
            <div className="glass-card rounded-2xl p-6 border border-border/60 mb-8 bg-secondary/10">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-primary" /> Direct Review Link
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                    Copy and share this unique landing page link in your emails, invoices, or social media to solicit direct feedback.
                </p>
                <div className="flex gap-2">
                    <div className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-white font-mono select-all overflow-hidden text-ellipsis whitespace-nowrap">
                        {directLink}
                    </div>
                    <button
                        onClick={handleCopy}
                        className="px-4 py-3 bg-secondary border border-border hover:bg-secondary/80 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shrink-0">
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied" : "Copy Link"}
                    </button>
                </div>
            </div>

            {/* Workflow Progress Flowchart */}
            <div className="glass-card rounded-2xl p-6 border border-border/60 mb-8 overflow-hidden">
                <h3 className="text-lg font-bold text-white mb-6">Reputation Engine Workflow</h3>
                
                {/* Horizontal flow for md+, Vertical for mobile */}
                <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-4 items-stretch md:items-start">
                    {/* Animated Line for MD+ */}
                    <div className="absolute top-1/4 left-[10%] right-[10%] h-[3px] bg-border/40 hidden md:block z-0">
                        <motion.div 
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>

                    {workflowSteps.map((step, idx) => {
                        const StepIcon = step.icon;
                        return (
                            <div key={idx} className="flex-1 flex flex-col items-center text-center relative z-10">
                                <motion.div 
                                    className="w-12 h-12 rounded-full bg-secondary border-2 border-border flex items-center justify-center text-primary mb-3 shadow-lg"
                                    whileHover={{ scale: 1.1, borderColor: "var(--primary)" }}
                                >
                                    <StepIcon className="w-5 h-5" />
                                </motion.div>
                                <h4 className="font-bold text-white text-sm mb-1">{step.title}</h4>
                                <p className="text-xs text-muted-foreground max-w-[180px] leading-relaxed">{step.desc}</p>
                                
                                {idx < 3 && (
                                    <div className="flex md:hidden justify-center my-3 text-primary">
                                        <ChevronRight className="w-5 h-5 rotate-90" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Role Warning Banner */}
            {!canCreate && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold flex items-center gap-2">
                    <X className="w-5 h-5" />
                    You are in Read-Only mode as a {user?.role === "readonly" ? "Read Only User" : "Location Manager"}. Campaign creation is disabled.
                </div>
            )}

            {/* Campaign & QR Channel Performance Tracker */}
            <div className="glass-card rounded-2xl p-6 border border-border/60 mb-8">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Campaign Performance Tracking</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Email Stats */}
                    <div className="p-4 rounded-xl bg-[#6366f1]/5 border border-[#6366f1]/15">
                        <div className="text-xs font-bold text-indigo-400 mb-2 flex items-center gap-1.5">
                            <Mail className="w-4 h-4" /> Email Campaigns
                        </div>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Open Rate</span>
                                <span className="text-white font-semibold">42.8%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Click-through Rate</span>
                                <span className="text-white font-semibold">18.5%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Review Conversion</span>
                                <span className="text-emerald-400 font-bold">8.4%</span>
                            </div>
                        </div>
                    </div>
                    {/* SMS Stats */}
                    <div className="p-4 rounded-xl bg-[#c084fc]/5 border border-[#c084fc]/15">
                        <div className="text-xs font-bold text-purple-400 mb-2 flex items-center gap-1.5">
                            <Smartphone className="w-4 h-4" /> SMS Campaigns
                        </div>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Delivery Rate</span>
                                <span className="text-white font-semibold">98.2%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Click Rate</span>
                                <span className="text-white font-semibold">48.6%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Review Conversion</span>
                                <span className="text-emerald-400 font-bold">18.2%</span>
                            </div>
                        </div>
                    </div>
                    {/* QR Code Scans Stats */}
                    <div className="p-4 rounded-xl bg-[#06b6d4]/5 border border-[#06b6d4]/15">
                        <div className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-1.5">
                            <QrCode className="w-4 h-4" /> QR Code Scans
                        </div>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Flyer Scans</span>
                                <span className="text-white font-semibold">284 scans</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Reviews Generated</span>
                                <span className="text-white font-semibold">52 reviews</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Conversion Rate</span>
                                <span className="text-emerald-400 font-bold">18.3%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-lg font-bold text-white mb-4">Active Invitation Automations</h2>

            {campaigns.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center border-dashed border-2">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
                        <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">No Campaigns Yet</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">Create your first automated email or SMS campaign to start requesting more reviews.</p>
                    <button 
                        onClick={() => { if (canCreate) setShowModal(true); }} 
                        disabled={!canCreate}
                        className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                            canCreate 
                            ? "bg-primary text-white hover:bg-primary/90" 
                            : "bg-secondary text-muted-foreground cursor-not-allowed border border-border"
                        }`}>
                        Create Automation
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {campaigns.map(camp => {
                        const Icon = channelDetails[camp.channel as keyof typeof channelDetails]?.icon || Mail;
                        return (
                            <div key={camp.id} className="glass-card rounded-2xl p-5 border border-border flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary border border-border">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-white">{camp.name}</h3>
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${camp.isActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-secondary text-muted-foreground border border-border"
                                                }`}>
                                                {camp.isActive ? "Active" : "Paused"}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground/80">Sends via <span className="capitalize text-white">{camp.channel}</span> exactly {camp.sendDelayHours} hours after trigger.</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleToggle(camp.id, camp.isActive)} 
                                        disabled={!canEdit}
                                        title={!canEdit ? "Edit permission required" : camp.isActive ? "Pause Campaign" : "Resume Campaign"}
                                        className={`p-2 rounded-lg transition-colors ${
                                            canEdit 
                                            ? "bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-white cursor-pointer" 
                                            : "bg-secondary/20 text-muted-foreground/40 cursor-not-allowed border border-border/30"
                                        }`}>
                                        {camp.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <form onSubmit={handleCreateCampaign} className="glass-card rounded-2xl p-6 w-full max-w-lg border border-border max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white">Create Automation</h3>
                            <button type="button" onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-white"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">Campaign Name</label>
                                <input required value={newCampaign.name} onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })} type="text" placeholder="e.g. Post-Checkout Email" className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none text-sm text-white" />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">Select Campaign Template</label>
                                <select 
                                    value={selectedTemplate} 
                                    onChange={e => handleTemplateChange(e.target.value as any)} 
                                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-white focus:outline-none"
                                >
                                    <option value="friendly">Friendly Follow-up</option>
                                    <option value="formal">Formal Post-Checkout</option>
                                    <option value="incentive">Review Incentive Ask</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">Channel</label>
                                    <select value={newCampaign.channel} onChange={e => setNewCampaign({ ...newCampaign, channel: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-white focus:outline-none">
                                        <option value="email">Email</option>
                                        <option value="sms">SMS</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">Delay (Hours after checkout)</label>
                                    <input required type="number" min="1" value={newCampaign.sendDelayHours} onChange={e => setNewCampaign({ ...newCampaign, sendDelayHours: parseInt(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-white focus:outline-none" />
                                </div>
                            </div>

                            {newCampaign.channel === "email" && (
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">Email Subject</label>
                                    <input required value={newCampaign.templateSubject} onChange={e => setNewCampaign({ ...newCampaign, templateSubject: e.target.value })} type="text" className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-white focus:outline-none" />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">Message Body</label>
                                <textarea required rows={4} value={newCampaign.templateBody} onChange={e => setNewCampaign({ ...newCampaign, templateBody: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm resize-none text-white focus:outline-none" />
                                <p className="text-[10px] text-muted-foreground mt-1">Review link will be automatically appended to the end.</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-8">
                            <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                            <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90">Activate Campaign</button>
                        </div>
                    </form>
                </div>
            )}
            {/* Flyer / QR Generator Hub Modal */}
            {showFlyerModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print-modal overflow-y-auto">
                    <style>{`
                        @media print {
                            body * { visibility: hidden; }
                            #printable-flyer, #printable-flyer * { visibility: visible; }
                            #printable-flyer { position: absolute; left: 0; top: 0; width: 100vw !important; height: 100vh !important; border: none !important; border-radius: 0 !important; }
                        }
                    `}</style>
                    <div className="glass-card rounded-2xl p-6 w-full max-w-4xl border border-border flex flex-col lg:flex-row gap-8 max-h-[95vh] overflow-y-auto">
                        {/* Editor & Configuration Side */}
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2"><QrCode className="w-5 h-5 text-primary" /> QR Code Generator Hub</h3>
                            </div>
                            
                            {/* QR Type Selection */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1">QR Code Link Type</label>
                                    <select value={qrType} onChange={e => setQrType(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border text-xs text-white focus:outline-none">
                                        <option value="location">Location QR</option>
                                        <option value="campaign">Campaign QR</option>
                                        <option value="custom">Custom UTM Source</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Flyer Size / Layout</label>
                                    <select value={qrSize} onChange={e => setQrSize(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border text-xs text-white focus:outline-none">
                                        <option value="poster">Poster (A4)</option>
                                        <option value="table">Table Tent Card</option>
                                        <option value="business_card">Business Card</option>
                                        <option value="receipt">Receipt Slip</option>
                                    </select>
                                </div>

                                {qrType === "location" && (
                                    <div>
                                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Select Location</label>
                                        <select value={qrLocationId} onChange={e => setQrLocationId(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border text-xs text-white focus:outline-none">
                                            {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                                        </select>
                                    </div>
                                )}

                                {qrType === "campaign" && (
                                    <div>
                                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Select Campaign</label>
                                        <select value={qrCampaignId} onChange={e => setQrCampaignId(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border text-xs text-white focus:outline-none">
                                            {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                )}

                                {qrType === "custom" && (
                                    <div>
                                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Custom Channel Source</label>
                                        <select value={qrCustomSource} onChange={e => setQrCustomSource(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border text-xs text-white focus:outline-none">
                                            <option value="receipt">Receipt Coupon</option>
                                            <option value="table">Table Stand</option>
                                            <option value="business_card">Business Cards</option>
                                            <option value="posters">Indoor Posters</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">Headline text</label>
                                <textarea rows={2} value={flyerText} onChange={e => setFlyerText(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none text-xs resize-none text-white" />
                                <p className="text-[9px] text-muted-foreground/60 mt-0.5">This text will appear in bold above the QR Code.</p>
                            </div>

                            {/* QR Tracking Metrics */}
                            <div className="p-3.5 rounded-xl bg-secondary/30 border border-border">
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">QR Analytics (Selected Option)</h4>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-secondary/40 p-2 rounded-lg border border-border/50">
                                        <div className="text-sm font-extrabold text-white">
                                            {qrType === "location" ? (qrLocationId === "loc-002" ? 89 : 142) : qrType === "custom" ? (qrCustomSource === "receipt" ? 89 : 195) : 284}
                                        </div>
                                        <div className="text-[9px] text-muted-foreground font-semibold uppercase">Flyer Scans</div>
                                    </div>
                                    <div className="bg-secondary/40 p-2 rounded-lg border border-border/50">
                                        <div className="text-sm font-extrabold text-white">
                                            {qrType === "location" ? (qrLocationId === "loc-002" ? 16 : 26) : qrType === "custom" ? (qrCustomSource === "receipt" ? 12 : 40) : 52}
                                        </div>
                                        <div className="text-[9px] text-muted-foreground font-semibold uppercase">Reviews Generated</div>
                                    </div>
                                    <div className="bg-secondary/40 p-2 rounded-lg border border-border/50">
                                        <div className="text-sm font-extrabold text-emerald-400">
                                            {qrType === "location" ? (qrLocationId === "loc-002" ? "18.0%" : "18.3%") : qrType === "custom" ? (qrCustomSource === "receipt" ? "13.5%" : "20.5%") : "18.3%"}
                                        </div>
                                        <div className="text-[9px] text-muted-foreground font-semibold uppercase">Conversion Rate</div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 flex flex-col sm:flex-row gap-3">
                                <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer shadow-lg shadow-primary/10">
                                    <Printer className="w-4 h-4" /> Print Flyer
                                </button>
                                <button onClick={() => setShowFlyerModal(false)} className="flex-1 text-center px-5 py-2.5 rounded-xl bg-secondary border border-border text-white text-xs font-bold hover:bg-secondary/80 transition-colors cursor-pointer">
                                    Close Customizer
                                </button>
                            </div>
                        </div>

                        {/* Preview Side */}
                        <div className="flex-shrink-0 flex items-center justify-center bg-white/5 rounded-2xl p-4 border border-border/50 min-w-[340px]">
                            {qrSize === "business_card" ? (
                                <div id="printable-flyer" className="w-[320px] h-[185px] bg-white rounded-xl flex flex-row items-center justify-between p-4 text-left shadow-2xl relative border border-slate-200 text-slate-800">
                                    <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-primary rounded-l-xl"></div>
                                    <div className="flex-1 pr-3 pl-2">
                                        <h2 className="text-[12px] font-extrabold leading-tight mb-2 text-slate-800">{flyerText}</h2>
                                        <p className="text-[9px] font-bold text-primary uppercase tracking-widest">{business.name}</p>
                                    </div>
                                    <div className="p-1.5 bg-white rounded-lg shadow-md border border-slate-100 shrink-0">
                                        <QRCodeCanvas
                                            value={(() => {
                                                let base = `${typeof window !== 'undefined' ? window.location.origin : ''}/business/${business.slug}`;
                                                if (qrType === "location" && qrLocationId) base += `?locationId=${qrLocationId}&utm_source=qr_location`;
                                                else if (qrType === "campaign" && qrCampaignId) base += `?campaignId=${qrCampaignId}&utm_source=qr_campaign`;
                                                else if (qrType === "custom") base += `?utm_source=qr_custom&utm_medium=${qrCustomSource}`;
                                                return base;
                                            })()}
                                            size={95}
                                            level="H"
                                            fgColor="#0f172a"
                                        />
                                    </div>
                                </div>
                            ) : qrSize === "receipt" ? (
                                <div id="printable-flyer" className="w-[180px] h-[270px] bg-white rounded-lg flex flex-col items-center justify-center p-4 text-center shadow-2xl relative border-2 border-dashed border-slate-300 text-slate-800">
                                    <h2 className="text-[10px] font-bold text-slate-700 mb-2 border-b border-dashed border-slate-300 pb-1.5 w-full uppercase tracking-wider">{business.name} Feedback</h2>
                                    <p className="text-[11px] font-bold leading-snug mb-3 text-slate-800 px-1">{flyerText}</p>
                                    <div className="p-2 bg-white rounded shadow-sm border border-slate-200 mb-2">
                                        <QRCodeCanvas
                                            value={(() => {
                                                let base = `${typeof window !== 'undefined' ? window.location.origin : ''}/business/${business.slug}`;
                                                if (qrType === "location" && qrLocationId) base += `?locationId=${qrLocationId}&utm_source=qr_location`;
                                                else if (qrType === "campaign" && qrCampaignId) base += `?campaignId=${qrCampaignId}&utm_source=qr_campaign`;
                                                else if (qrType === "custom") base += `?utm_source=qr_custom&utm_medium=${qrCustomSource}`;
                                                return base;
                                            })()}
                                            size={90}
                                            level="H"
                                            fgColor="#0f172a"
                                        />
                                    </div>
                                    <p className="text-[8px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Scan receipt code</p>
                                </div>
                            ) : qrSize === "table" ? (
                                <div id="printable-flyer" className="w-[200px] h-[310px] bg-white rounded-xl flex flex-col items-center justify-center p-5 text-center shadow-2xl relative border border-slate-200 text-slate-800">
                                    <div className="absolute top-0 left-0 right-0 h-2 bg-primary rounded-t-xl"></div>
                                    <h2 className="text-xs font-black text-slate-800 mb-4 leading-tight px-1">{flyerText}</h2>
                                    <div className="p-3 bg-white rounded-xl shadow-md border border-slate-100 mb-3">
                                        <QRCodeCanvas
                                            value={(() => {
                                                let base = `${typeof window !== 'undefined' ? window.location.origin : ''}/business/${business.slug}`;
                                                if (qrType === "location" && qrLocationId) base += `?locationId=${qrLocationId}&utm_source=qr_location`;
                                                else if (qrType === "campaign" && qrCampaignId) base += `?campaignId=${qrCampaignId}&utm_source=qr_campaign`;
                                                else if (qrType === "custom") base += `?utm_source=qr_custom&utm_medium=${qrCustomSource}`;
                                                return base;
                                            })()}
                                            size={120}
                                            level="H"
                                            fgColor="#0f172a"
                                        />
                                    </div>
                                    <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1">{business.name}</p>
                                </div>
                            ) : (
                                <div id="printable-flyer" className="w-[290px] h-[380px] bg-white rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-2xl relative border border-slate-200 text-slate-800">
                                    <div className="absolute top-0 left-0 w-full h-3 bg-primary rounded-t-2xl"></div>
                                    <h2 className="text-base font-extrabold text-slate-800 mb-6 leading-snug px-2">{flyerText}</h2>
                                    <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-100 mb-4">
                                        <QRCodeCanvas
                                            value={(() => {
                                                let base = `${typeof window !== 'undefined' ? window.location.origin : ''}/business/${business.slug}`;
                                                if (qrType === "location" && qrLocationId) base += `?locationId=${qrLocationId}&utm_source=qr_location`;
                                                else if (qrType === "campaign" && qrCampaignId) base += `?campaignId=${qrCampaignId}&utm_source=qr_campaign`;
                                                else if (qrType === "custom") base += `?utm_source=qr_custom&utm_medium=${qrCustomSource}`;
                                                return base;
                                            })()}
                                            size={170}
                                            level="H"
                                            fgColor="#0f172a"
                                        />
                                    </div>
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-2">{business.name}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

