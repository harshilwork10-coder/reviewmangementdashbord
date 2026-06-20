"use client";

import { useState, useEffect } from "react";
import {
    Rocket, Users, Calendar, Plus, RefreshCw, Check, X, ShieldAlert,
    Briefcase, Sparkles, ChevronRight, Play, Info, Activity, TrendingUp,
    DollarSign, CheckSquare, MessageSquare, Target, ListTodo, CheckCircle,
    UserCheck, Send, BarChart2, Star, AlertCircle, Share2, Award, Heart, Link2, Eye, Shield,
    Clock, FileText, ArrowRight
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface OpenrizeClient {
    id: string;
    name: string;
    industry: string;
    reviewsCount: number;
    dependency: "Critical (Local Traffic)" | "High (SEO Dependent)" | "Medium (AdWords)" | "Low (B2B)";
    status: "Uncontacted" | "Beta Offered" | "Converted";
    contactPerson: string;
}

interface SalesLead {
    id: string;
    name: string;
    source: "Local Outreach" | "Agency Partner" | "Referral" | "Founder Call";
    value: number;
    stage: "Lead" | "Contacted" | "Demo Scheduled" | "Closed Won";
}

interface ReferralPartner {
    id: string;
    referrer: string;
    type: "Customer Advocate" | "Agency Partner";
    code: string;
    customersReferred: number;
    commissionPaid: number;
    commissionPending: number;
    status: "Active" | "Pending Review";
}

interface FeedbackItem {
    id: string;
    business: string;
    comment: string;
    rating: number;
    status: "Pending" | "Escalated" | "Addressed";
}

interface ToastMessage {
    id: string;
    type: "success" | "warning" | "error" | "info";
    text: string;
}

interface RoadmapMilestone {
    id: string;
    month: 1 | 2 | 3;
    text: string;
    checked: boolean;
}

export default function SuperAdminLaunchPage() {
    const [activeTab, setActiveTab] = useState<"mission" | "channels" | "outreach" | "referrals" | "roadmap">("mission");

    // General Audit Log state
    const [launchLogs, setLaunchLogs] = useState<string[]>([
        "[INFO] Go-To-Market and Launch Control Center active.",
        "[INFO] Target Launch Milestone: First 100 Customers Plan initialized.",
        "[AUDIT] Pre-launch security audits, encryption gates, and Stripe sandbox pipelines verified."
    ]);

    const addLog = (msg: string) => {
        const time = new Date().toLocaleTimeString();
        setLaunchLogs(prev => [`[${time}] ${msg}`, ...prev]);
    };

    // Toasts state
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const addToast = (type: ToastMessage["type"], text: string) => {
        const id = Math.random().toString(36).substring(7);
        setToasts(prev => [...prev, { id, type, text }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    // ── Tab 1: Mission & Targets States ──
    const acquisitionTargets = [
        { phase: "Month 1-3", target: 10, current: 12, status: "Achieved", desc: "First 10 customers & beta launch" },
        { phase: "Month 4-6", target: 30, current: 12, status: "In Progress", desc: "Scale to 30 paying locations" },
        { phase: "Month 7-9", target: 60, current: 0, status: "Upcoming", desc: "Reach 60 paying locations" },
        { phase: "Month 10-12", target: 100, current: 0, status: "Upcoming", desc: "Hit 100 paying customers ($10k+ MRR)" },
    ];

    const channelPriorities = [
        { rank: 1, name: "Existing Openrize Clients", type: "Warm Database", status: "Primary Focus" },
        { rank: 2, name: "LinkedIn Network", type: "Social Selling", status: "High Priority" },
        { rank: 3, name: "Referrals Engine", type: "Advocacy Rewards", status: "Medium Priority" },
        { rank: 4, name: "Agency Partners", type: "Reseller Program", status: "Medium Priority" },
        { rank: 5, name: "Cold Outreach", type: "Direct Targeting", status: "Secondary Focus" },
    ];

    // ── Tab 2: Openrize Conversion States ──
    const [openrizeClients, setOpenrizeClients] = useState<OpenrizeClient[]>([
        { id: "OR-01", name: "Summit Medical Group", industry: "Medical Practice", reviewsCount: 14, dependency: "High (SEO Dependent)", status: "Uncontacted", contactPerson: "Dr. Sarah Jenkins" },
        { id: "OR-02", name: "Marina Bay Bistro", industry: "Restaurant", reviewsCount: 32, dependency: "Critical (Local Traffic)", status: "Beta Offered", contactPerson: "Chef Marco" },
        { id: "OR-03", name: "Green Valley Plumbers", industry: "Home Services", reviewsCount: 5, dependency: "Medium (AdWords)", status: "Converted", contactPerson: "Ryan Reynolds" },
        { id: "OR-04", name: "Cascade Dental Care", industry: "Dental Office", reviewsCount: 19, dependency: "Critical (Local Traffic)", status: "Uncontacted", contactPerson: "Dr. Emily Vance" },
        { id: "OR-05", name: "Vanguard Lawyers", industry: "Professional Services", reviewsCount: 2, dependency: "Low (B2B)", status: "Uncontacted", contactPerson: "Harvey Specter" },
    ]);

    const [selectedIndustryPitch, setSelectedIndustryPitch] = useState<string | null>("Restaurants");

    const industryPitches = [
        { name: "Restaurants", pain: "Extreme dependence on aggregate Google/Yelp stars for walk-ins.", hook: "Automated SMS QR codes at check-out tables to capture instant 5-star reviews." },
        { name: "Medical practices", pain: "Strict HIPAA compliance concerns, patient privacy, and manual follow-ups.", hook: "Secure email post-visit feedback loops that filter compliant patient reviews." },
        { name: "Dental offices", pain: "Patients forget to review, and office staff are too busy to request manually.", hook: "Integration with appointment calendars to trigger automated feedback requests." },
        { name: "Home service companies", pain: "Technicians in the field fail to capture reviews on-site.", hook: "Simple SMS link dispatched immediately upon job invoice closing." },
        { name: "Professional service firms", pain: "Reluctance to ask clients for reviews due to formal relationships.", hook: "Personalized executive email request templates highlighting mutual growth." },
    ];

    // Open Beta Simulator
    const [openBetaCount, setOpenBetaCount] = useState(12);
    const [csatScore, setCsatScore] = useState(88);

    // GTM Campaigns States
    const [campaignLogs, setCampaignLogs] = useState<string[]>([]);
    const [campaignRunning, setCampaignRunning] = useState<string | null>(null);
    const [projectedTraffic, setProjectedTraffic] = useState(250);
    const [projectedLeads, setProjectedLeads] = useState(48);

    const handleUpdateOpenrizeStatus = (id: string, nextStatus: OpenrizeClient["status"]) => {
        setOpenrizeClients(prev => prev.map(c => {
            if (c.id === id) {
                addLog(`Openrize conversion pipeline update: ${c.name} ➔ ${nextStatus}.`);
                if (nextStatus === "Converted") {
                    addToast("success", `Upgraded & Bundled ${c.name} with website + marketing services! 🎉`);
                } else {
                    addToast("info", `Beta access invite dispatched to ${c.name}.`);
                }
                return { ...c, status: nextStatus };
            }
            return c;
        }));
    };

    const handleRunCampaign = (channel: string) => {
        if (campaignRunning) return;
        setCampaignRunning(channel);
        addLog(`[GTM Campaign] Deploying outreach campaign: ${channel}.`);
        addToast("info", `Deploying campaign: ${channel}...`);
        
        setCampaignLogs([`[0.0s] Connecting to broadcast gateway for: ${channel}...`]);

        setTimeout(() => {
            setCampaignLogs(prev => [...prev, `[1.2s] Targeting matching local businesses lists...`]);
            setTimeout(() => {
                setCampaignLogs(prev => [...prev, `[2.5s] Dispensing personalized messages. Copy variations active.`]);
                setTimeout(() => {
                    const extraTraffic = Math.floor(60 + Math.random() * 50);
                    const extraLeads = Math.floor(8 + Math.random() * 6);
                    setProjectedTraffic(prev => prev + extraTraffic);
                    setProjectedLeads(prev => prev + extraLeads);
                    setCampaignRunning(null);
                    setCampaignLogs(prev => [
                        ...prev,
                        `[3.8s] BROADCAST SUCCESSFUL.`,
                        `[GTM RESULT] Channel: ${channel} | Traffic Clicks: +${extraTraffic} | New Registrations: +${extraLeads}`
                    ]);
                    addLog(`[GTM Campaign] Broadcast completed for ${channel}. Traffic: +${extraTraffic}, Leads: +${extraLeads}`);
                    addToast("success", `Campaign ${channel} completed successfully!`);
                }, 1000);
            }, 1000);
        }, 1000);
    };

    // ── Tab 3: LinkedIn & Sales Outreach States ──
    const [dailyActivity, setDailyActivity] = useState({
        linkedinRequests: 8,
        followUps: 4,
        conversations: 2,
        discoveryCalls: 1,
        proposalsDelivered: 0
    });

    const dailyTargets = {
        linkedinRequests: 20,
        followUps: 10,
        conversations: 5,
        discoveryCalls: 2,
        proposalsDelivered: 1
    };

    const [selectedRhythmDay, setSelectedRhythmDay] = useState<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday">("Monday");
    const [salesFrameworkTab, setSalesFrameworkTab] = useState<"discovery" | "demo" | "proposal" | "followup">("discovery");
    
    const [deliverables, setDeliverables] = useState({
        salesSystemApproved: true,
        rhythmDocumented: true,
        kpiDashboardDefined: true,
        roadmapEstablished: true,
        commercializationKitCompleted: false
    });

    const [weeklyActivity, setWeeklyActivity] = useState({
        linkedinMessages: 28,
        coldEmails: 12,
        discoveryCalls: 3,
        productDemos: 1,
        proposalsSent: 2
    });

    const weeklyTargets = {
        linkedinMessages: 50,
        coldEmails: 20,
        discoveryCalls: 5,
        productDemos: 3,
        proposalsSent: 5 // 1 per day
    };

    const [activityType, setActivityType] = useState<keyof typeof weeklyActivity>("linkedinMessages");
    const [activityQty, setActivityQty] = useState(1);

    const handleLogActivity = (e: React.FormEvent) => {
        e.preventDefault();
        setWeeklyActivity(prev => {
            const currentVal = prev[activityType];
            const newVal = currentVal + activityQty;
            
            const labelMap: Record<keyof typeof weeklyActivity, string> = {
                linkedinMessages: "LinkedIn Outreach Message(s)",
                coldEmails: "Cold Email(s)",
                discoveryCalls: "Discovery Call(s)",
                productDemos: "Product Demo(s)",
                proposalsSent: "Proposal(s) Sent"
            };

            addLog(`[Outreach] Logged ${activityQty} ${labelMap[activityType]}.`);
            addToast("success", `Logged ${activityQty} new activity entries!`);
            return {
                ...prev,
                [activityType]: newVal
            };
        });
    };

    // CRM sales pipeline
    const [salesPipeline, setSalesPipeline] = useState<SalesLead[]>([
        { id: "LD-01", name: "Greenwood Med Spa", source: "Local Outreach", value: 99, stage: "Demo Scheduled" },
        { id: "LD-02", name: "Skyline SEO Agency", source: "Agency Partner", value: 299, stage: "Closed Won" },
        { id: "LD-03", name: "Grand Luxe Hotel", source: "Founder Call", value: 299, stage: "Contacted" },
        { id: "LD-04", name: "True Blue Plumbing", source: "Referral", value: 49, stage: "Lead" },
        { id: "LD-05", name: "Pristine Dental Care", source: "Local Outreach", value: 99, stage: "Closed Won" },
    ]);

    const [newLeadName, setNewLeadName] = useState("");
    const [newLeadSource, setNewLeadSource] = useState<SalesLead["source"]>("Local Outreach");
    const [newLeadValue, setNewLeadValue] = useState(99);

    const handleAddLead = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLeadName) {
            addToast("warning", "Please provide a lead business name.");
            return;
        }
        const newLead: SalesLead = {
            id: `LD-0${salesPipeline.length + 1}`,
            name: newLeadName,
            source: newLeadSource,
            value: newLeadValue,
            stage: "Lead"
        };
        setSalesPipeline(prev => [...prev, newLead]);
        addLog(`[Pipeline] New lead captured: ${newLeadName} | Target Value: $${newLeadValue}/mo.`);
        addToast("success", `Added lead: ${newLeadName}`);
        setNewLeadName("");
    };

    const handleMoveLead = (id: string, direction: "forward" | "backward") => {
        const stages: SalesLead["stage"][] = ["Lead", "Contacted", "Demo Scheduled", "Closed Won"];
        setSalesPipeline(prev => prev.map(lead => {
            if (lead.id === id) {
                const currentIdx = stages.indexOf(lead.stage);
                let nextIdx = currentIdx;
                if (direction === "forward" && currentIdx < stages.length - 1) {
                    nextIdx = currentIdx + 1;
                } else if (direction === "backward" && currentIdx > 0) {
                    nextIdx = currentIdx - 1;
                }
                const nextStage = stages[nextIdx];
                if (nextStage !== lead.stage) {
                    addLog(`[Pipeline] Lead ${lead.name} moved: ${lead.stage} ➔ ${nextStage}.`);
                    if (nextStage === "Closed Won") {
                        addToast("success", `Deal closed! $${lead.value}/mo MRR added! 🎉`);
                    }
                }
                return { ...lead, stage: nextStage };
            }
            return lead;
        }));
    };

    // ── Tab 4: Referral Engine & Agency Resellers States ──
    const [referralPartners, setReferralPartners] = useState<ReferralPartner[]>([
        { id: "REF-01", referrer: "Apex Dental Clinic", type: "Customer Advocate", code: "APEX20", customersReferred: 3, commissionPaid: 150, commissionPending: 50, status: "Active" },
        { id: "REF-02", referrer: "Blue Wave Marketing", type: "Agency Partner", code: "BLUEWAVEAGENCY", customersReferred: 8, commissionPaid: 1600, commissionPending: 400, status: "Active" },
        { id: "REF-03", referrer: "Metro Local SEO", type: "Agency Partner", code: "METROSEO", customersReferred: 4, commissionPaid: 800, commissionPending: 200, status: "Active" },
        { id: "REF-04", referrer: "Dr. Emily Vance", type: "Customer Advocate", code: "VANCEDENTAL", customersReferred: 1, commissionPaid: 0, commissionPending: 50, status: "Pending Review" },
    ]);

    const [newPartnerName, setNewPartnerName] = useState("");
    const [newPartnerType, setNewPartnerType] = useState<ReferralPartner["type"]>("Customer Advocate");
    const [newPartnerCode, setNewPartnerCode] = useState("");

    const handleAddPartner = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPartnerName || !newPartnerCode) {
            addToast("warning", "Please provide partner name and referral code.");
            return;
        }
        const newPartner: ReferralPartner = {
            id: `REF-0${referralPartners.length + 1}`,
            referrer: newPartnerName,
            type: newPartnerType,
            code: newPartnerCode.toUpperCase().replace(/\s+/g, ""),
            customersReferred: 0,
            commissionPaid: 0,
            commissionPending: 0,
            status: "Active"
        };
        setReferralPartners(prev => [...prev, newPartner]);
        addLog(`[Referral Engine] Registered partner: ${newPartnerName} | Code: ${newPartner.code}`);
        addToast("success", `Registered partner code: ${newPartner.code}`);
        setNewPartnerName("");
        setNewPartnerCode("");
    };

    const handleApproveCommission = (id: string) => {
        setReferralPartners(prev => prev.map(p => {
            if (p.id === id) {
                const pending = p.commissionPending;
                if (pending <= 0) return p;
                addLog(`[Referral Engine] Approved commission payout of $${pending} to ${p.referrer}.`);
                addToast("success", `Paid $${pending} commission to ${p.referrer}!`);
                return {
                    ...p,
                    commissionPaid: p.commissionPaid + pending,
                    commissionPending: 0,
                    status: "Active"
                };
            }
            return p;
        }));
    };

    // ── Tab 5: 90-Day Roadmap & KPI States ──
    const [roadmapMilestones, setRoadmapMilestones] = useState<RoadmapMilestone[]>([
        // Month 1
        { id: "m1_1", month: 1, text: "Acquire first 10 beta/paying customers", checked: true },
        { id: "m1_2", month: 1, text: "Finalize and document agency onboarding process", checked: true },
        { id: "m1_3", month: 1, text: "Setup active Openrize client outreach bundling options", checked: true },
        // Month 2
        { id: "m2_1", month: 2, text: "Launch customer referral reward tracking engine", checked: false },
        { id: "m2_2", month: 2, text: "Create first 3 customer success case studies", checked: false },
        { id: "m2_3", month: 2, text: "Reach 30 active locations threshold", checked: false },
        // Month 3
        { id: "m3_1", month: 3, text: "Onboard 5 agency resellers under White-label tier", checked: false },
        { id: "m3_2", month: 3, text: "Scale cold email outreach sequences to 100+/week", checked: false },
        { id: "m3_3", month: 3, text: "Reach 60 paying locations threshold", checked: false },
    ]);

    const toggleMilestone = (id: string) => {
        setRoadmapMilestones(prev => prev.map(m => {
            if (m.id === id) {
                const nextVal = !m.checked;
                addLog(`[Roadmap] Milestone: "${m.text}" toggled to ${nextVal ? "COMPLETED" : "PENDING"}`);
                addToast("success", "Roadmap milestone status updated.");
                return { ...m, checked: nextVal };
            }
            return m;
        }));
    };

    // KPI Values
    const [trialSignups, setTrialSignups] = useState(84);
    const [trialConversions, setTrialConversions] = useState(16.5); // %
    const [projectedMRR, setProjectedMRR] = useState(3150); // $

    const [feedbackBoard, setFeedbackBoard] = useState<FeedbackItem[]>([
        { id: "FB-01", business: "Apex Dental Clinic", comment: "The SMS review dispatch loops increased our Google rating from 4.1 to 4.7 in 30 days.", rating: 5, status: "Addressed" },
        { id: "FB-02", business: "Marina Bay Bistro", comment: "Excellent dashboard, but we need custom domain mapping for clients.", rating: 4, status: "Pending" },
        { id: "FB-03", business: "Green Valley Plumbers", comment: "Billing setup is very clean. The integration with our CRM is saving us 3 hours a week.", rating: 5, status: "Addressed" },
    ]);

    const handleEscalateFeedback = (id: string) => {
        setFeedbackBoard(prev => prev.map(item => {
            if (item.id === id) {
                addLog(`[Feedback] Escalate feedback from ${item.business} to product Roadmap: "${item.comment}"`);
                addToast("success", `Feedback from ${item.business} pushed to Roadmap sprints.`);
                return { ...item, status: "Escalated" };
            }
            return item;
        }));
    };

    // Calculate dynamic stats
    const closedDealsCount = salesPipeline.filter(l => l.stage === "Closed Won").length;
    const openrizeConvertedCount = openrizeClients.filter(c => c.status === "Converted").length;
    
    // Average plan pricing calculation based on active accounts
    useEffect(() => {
        const pipelineMRR = salesPipeline
            .filter(l => l.stage === "Closed Won")
            .reduce((acc, curr) => acc + curr.value, 0);
        
        // Openrize bundled customers pay $99/mo (average bundle rate)
        const openrizeMRR = openrizeConvertedCount * 99;
        
        // Customer advocates referrals contribute conversion value
        const referralCount = referralPartners.reduce((acc, curr) => acc + curr.customersReferred, 0);
        const referralMRR = referralCount * 49; // Starter plan rate
        
        const calculatedMRR = pipelineMRR + openrizeMRR + referralMRR + 1200; // Base baseline MRR
        setProjectedMRR(calculatedMRR);
    }, [salesPipeline, openrizeConvertedCount, referralPartners]);

    const currentOnboardedCustomers = openBetaCount + closedDealsCount + openrizeConvertedCount;
    const roadmapReadiness = Math.round((roadmapMilestones.filter(m => m.checked).length / roadmapMilestones.length) * 100);

    return (
        <div className="h-screen overflow-y-auto p-8 font-sans bg-[#080B14] text-slate-100 relative">
            
            {/* Custom toast overlay container */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto p-4 rounded-xl shadow-2xl flex items-center gap-3 border backdrop-blur-lg transform transition-all duration-300 animate-slide-up ${
                            toast.type === "success" ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" :
                            toast.type === "warning" ? "bg-amber-500/20 border-amber-500/30 text-amber-400" :
                            toast.type === "error" ? "bg-rose-500/20 border-rose-500/30 text-rose-400" :
                            "bg-indigo-500/20 border-indigo-500/30 text-indigo-400"
                        }`}
                    >
                        {toast.type === "success" && <Check className="w-4 h-4 shrink-0" />}
                        {toast.type === "warning" && <AlertCircle className="w-4 h-4 shrink-0" />}
                        {toast.type === "error" && <X className="w-4 h-4 shrink-0" />}
                        {toast.type === "info" && <Info className="w-4 h-4 shrink-0" />}
                        <span className="text-xs font-semibold">{toast.text}</span>
                        <button
                            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                            className="ml-auto text-white/40 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Rocket className="w-6 h-6 text-red-500 animate-pulse" />
                        Go-To-Market &amp; Launch Console
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        First 100 Customers Plan Hub. Monitor acquisition channels, log outreach targets, track referral commissions, and execute the 90-day roadmap.
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">GTM Goal: First 100 Customers</span>
                        <span className="text-sm font-black text-indigo-400">{currentOnboardedCustomers} / 100 Paying Users</span>
                    </div>
                    <div className="w-24 h-2 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-indigo-500 transition-all duration-500"
                            style={{ width: `${Math.min(100, (currentOnboardedCustomers / 100) * 100)}%` }} />
                    </div>
                </div>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 p-1 bg-slate-950 border border-white/5 rounded-2xl mb-8 overflow-x-auto">
                {[
                    { id: "mission", label: "Mission & Targets", icon: Target },
                    { id: "channels", label: "Openrize & Channels", icon: Share2 },
                    { id: "outreach", label: "LinkedIn & Sales Outreach", icon: Users },
                    { id: "referrals", label: "Referral Engine", icon: Award },
                    { id: "roadmap", label: "Roadmap & KPIs", icon: TrendingUp },
                ].map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id as any);
                                addLog(`Changed navigation context to: ${tab.label.toUpperCase()}`);
                            }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none bg-transparent whitespace-nowrap ${
                                activeTab === tab.id ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "text-slate-400 hover:text-white"
                            }`}
                        >
                            <Icon className="w-3.5 h-3.5" /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ── Tab 1: Mission & Targets ── */}
            {activeTab === "mission" && (
                <div className="space-y-6">
                    {/* Mission Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            { title: "Paying Customers", stat: "100", label: "Target inside 12 months", icon: Users, color: "from-blue-500 to-indigo-600" },
                            { title: "Monthly Recurring Revenue", stat: "$10,000+", label: "Target predictable base", icon: DollarSign, color: "from-emerald-500 to-teal-600" },
                            { title: "Acquisition Channels", stat: "Repeatable", label: "Validate product-market fit", icon: Share2, color: "from-purple-500 to-indigo-600" },
                            { title: "Target Retention", stat: "95%+", label: "Establish stable growth", icon: Heart, color: "from-red-500 to-pink-600" }
                        ].map((card, idx) => {
                            const Icon = card.icon;
                            return (
                                <div key={idx} className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all">
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-5 blur-2xl group-hover:opacity-10 transition-all`} />
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
                                        <Icon className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div className="text-2xl font-black text-white font-mono mb-1">{card.stat}</div>
                                    <p className="text-[10px] text-slate-500">{card.label}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Targets Timeline Progress */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-white/5">
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <Calendar className="w-4.5 h-4.5 text-indigo-400" />
                                Month-by-Month Acquisition Targets
                            </h3>
                            <p className="text-xs text-slate-400 mb-6">
                                Track progression gates toward 100 paying clients.
                            </p>
                            
                            <div className="space-y-4">
                                {acquisitionTargets.map((item, idx) => {
                                    const percentage = item.target === 100 
                                        ? Math.round((currentOnboardedCustomers / 100) * 100)
                                        : item.target === 30
                                        ? Math.round((currentOnboardedCustomers / 30) * 100)
                                        : Math.round((item.current / item.target) * 100);

                                    return (
                                        <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-200">{item.phase}</span>
                                                    <span className="text-[10px] text-slate-500 font-medium">({item.desc})</span>
                                                </div>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                    item.status === "Achieved" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" :
                                                    item.status === "In Progress" ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400" :
                                                    "bg-slate-800 border border-white/5 text-slate-500"
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-red-500 to-indigo-500 transition-all duration-500"
                                                        style={{ width: `${Math.min(100, percentage)}%` }} />
                                                </div>
                                                <span className="text-[11px] font-bold font-mono text-slate-300 shrink-0">
                                                    {item.target === 100 ? currentOnboardedCustomers : item.target === 30 ? Math.min(30, currentOnboardedCustomers) : item.current} / {item.target}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Priorities & Success Checklist */}
                        <div className="space-y-6">
                            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5">
                                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                    <Target className="w-4.5 h-4.5 text-red-500" />
                                    Acquisition Channels Priority
                                </h3>
                                <div className="space-y-2.5">
                                    {channelPriorities.map((ch, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-white/5 rounded-xl text-xs">
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-5 h-5 rounded bg-slate-900 border border-white/5 flex items-center justify-center font-bold font-mono text-[10px] text-slate-400">
                                                    {ch.rank}
                                                </span>
                                                <div>
                                                    <div className="font-bold text-slate-200">{ch.name}</div>
                                                    <div className="text-[9px] text-slate-500 font-medium">{ch.type}</div>
                                                </div>
                                            </div>
                                            <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                                                {ch.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 2: Openrize & Channels ── */}
            {activeTab === "channels" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Openrize client conversion pipeline */}
                        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        <UserCheck className="w-4.5 h-4.5 text-emerald-400" />
                                        Openrize Client Conversion strategy
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Identify existing clients dependent on local online reviews and pitch/bundle them.
                                    </p>
                                </div>
                                <span className="text-[10px] text-slate-500 font-mono">{openrizeConvertedCount} / {openrizeClients.length} Bundled</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 text-slate-500 font-semibold">
                                            <th className="pb-2">Business</th>
                                            <th className="pb-2">Industry</th>
                                            <th className="pb-2">Est. Dependency</th>
                                            <th className="pb-2">Status</th>
                                            <th className="pb-2 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {openrizeClients.map(client => (
                                            <tr key={client.id} className="border-b border-white/5 text-slate-300 hover:bg-white/1 font-mono text-[11px]">
                                                <td className="py-3 font-bold text-slate-200">
                                                    <div>{client.name}</div>
                                                    <div className="text-[9px] text-slate-500 font-normal">Contact: {client.contactPerson}</div>
                                                </td>
                                                <td className="py-3">{client.industry}</td>
                                                <td className="py-3 text-orange-400">{client.dependency}</td>
                                                <td className="py-3">
                                                    <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                                        client.status === "Uncontacted" ? "bg-slate-800 text-slate-400" :
                                                        client.status === "Beta Offered" ? "bg-amber-500/10 border border-amber-500/20 text-amber-400" :
                                                        "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                                    }`}>
                                                        {client.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <div className="inline-flex gap-1.5">
                                                        {client.status === "Uncontacted" && (
                                                            <button
                                                                onClick={() => handleUpdateOpenrizeStatus(client.id, "Beta Offered")}
                                                                className="text-[9px] bg-amber-600/20 hover:bg-amber-600 border border-amber-500/30 text-amber-300 hover:text-white px-2 py-0.5 rounded transition-all cursor-pointer"
                                                            >
                                                                Offer Beta
                                                            </button>
                                                        )}
                                                        {client.status !== "Converted" && (
                                                            <button
                                                                onClick={() => handleUpdateOpenrizeStatus(client.id, "Converted")}
                                                                className="text-[9px] bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white px-2 py-0.5 rounded transition-all cursor-pointer font-bold animate-pulse"
                                                            >
                                                                Convert &amp; Bundle
                                                            </button>
                                                        )}
                                                        {client.status === "Converted" && (
                                                            <span className="text-[9px] text-slate-500 font-semibold">Bundled ✓</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Local outreach sector details */}
                        <div className="space-y-6">
                            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5">
                                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                    <Briefcase className="w-4.5 h-4.5 text-indigo-400" />
                                    Outreach Target Pitch Hooks
                                </h3>
                                <p className="text-xs text-slate-400 mb-4">
                                    Click a local outreach sector to view specific pain point hooks.
                                </p>

                                <div className="space-y-2">
                                    {industryPitches.map((pitch, idx) => (
                                        <div key={idx} className="border border-white/5 rounded-xl overflow-hidden bg-slate-950/60">
                                            <button
                                                onClick={() => setSelectedIndustryPitch(selectedIndustryPitch === pitch.name ? null : pitch.name)}
                                                className="w-full p-3 text-left flex justify-between items-center text-xs font-bold text-slate-200 border-none bg-transparent hover:text-white transition-all cursor-pointer"
                                            >
                                                <span>{pitch.name}</span>
                                                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedIndustryPitch === pitch.name ? "rotate-95 text-indigo-400" : "text-slate-500"}`} />
                                            </button>
                                            
                                            {selectedIndustryPitch === pitch.name && (
                                                <div className="p-3 border-t border-white/5 bg-slate-900/20 space-y-2 text-[11px] leading-relaxed">
                                                    <div>
                                                        <span className="text-red-400 font-bold block mb-0.5">Pain Point:</span>
                                                        <span className="text-slate-400">{pitch.pain}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-emerald-400 font-bold block mb-0.5">Pitch / Bundle:</span>
                                                        <span className="text-slate-300">{pitch.hook}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Campaign broadcast simulator */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-white/5">
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <Share2 className="w-4.5 h-4.5 text-indigo-400" />
                                GTM Outreach Campaign Simulator
                            </h3>
                            <p className="text-xs text-slate-400 mb-6">
                                Trigger simulated multi-channel GTM campaigns to populate leads into the sales pipeline.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: "linkedin", name: "LinkedIn Announcement", desc: "Founders personal social network broadcast targeting regional business managers.", icon: Target, accent: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                                    { id: "cold_email", name: "Email Marketing Sequences", desc: "Automated cold outreach campaigns sharded across local SEO business lists.", icon: Send, accent: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
                                    { id: "referrals", name: "Referral Program Activation", desc: "Launch existing user free-month incentive links inside merchant portfolios.", icon: Sparkles, accent: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
                                    { id: "partner_outreach", name: "Partner SEO Agencies", desc: "Bulk direct package discounts pitched to independent digital marketing agencies.", icon: Briefcase, accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" }
                                ].map((c) => {
                                    const Icon = c.icon;
                                    return (
                                        <div key={c.id} className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex flex-col justify-between h-[150px] hover:border-white/10 transition-all">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <div className={`p-1.5 rounded ${c.accent}`}>
                                                        <Icon className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-200">{c.name}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 leading-normal">{c.desc}</p>
                                            </div>
                                            <button
                                                disabled={campaignRunning !== null}
                                                onClick={() => handleRunCampaign(c.name)}
                                                className={`w-full py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all border-none ${
                                                    campaignRunning === c.name
                                                        ? "bg-slate-900 text-slate-500 cursor-not-allowed"
                                                        : campaignRunning !== null
                                                        ? "bg-slate-900 text-slate-600 cursor-not-allowed"
                                                        : "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                                                }`}
                                            >
                                                {campaignRunning === c.name ? "Broadcasting..." : "Deploy Campaign Broadcast"}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Broadcast terminal simulator logs */}
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                    <Activity className="w-4.5 h-4.5 text-orange-400" />
                                    Outreach Broadcast Logs
                                </h3>
                                <p className="text-xs text-slate-400 mb-4">
                                    Monitoring payload dispatches and simulated conversion traffic.
                                </p>

                                <div className="bg-slate-950 rounded-xl p-3.5 border border-white/5 h-[160px] overflow-y-auto font-mono text-[10px] text-slate-400 space-y-1.5">
                                    {campaignLogs.length === 0 ? (
                                        <div className="text-slate-600 italic">Awaiting GTM campaign execution trigger...</div>
                                    ) : (
                                        campaignLogs.map((log, idx) => (
                                            <div key={idx} className="flex gap-1.5">
                                                <span className="text-indigo-400 shrink-0">➔</span>
                                                <span className={log.includes("RESULT") ? "text-emerald-400 font-bold" : ""}>{log}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-900 mt-6 grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Inbound Traffic</span>
                                    <span className="text-lg font-black text-indigo-400 font-mono">{projectedTraffic} Clicks</span>
                                </div>
                                <div>
                                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Simulated Leads</span>
                                    <span className="text-lg font-black text-emerald-400 font-mono">+{projectedLeads}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 3: LinkedIn & Sales Outreach ── */}
            {activeTab === "outreach" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Weekly operating rhythm selector */}
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        <Calendar className="w-4.5 h-4.5 text-indigo-400" />
                                        Weekly Sales Operating System
                                    </h3>
                                    <span className="text-[10px] text-slate-500 font-mono">rhythm</span>
                                </div>
                                <p className="text-xs text-slate-400 mb-4">
                                    Click any weekday to view key founder focus areas and action items.
                                </p>
                                
                                <div className="flex gap-1.5 p-1 bg-slate-950 border border-white/5 rounded-xl mb-4">
                                    {(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const).map(day => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => {
                                                setSelectedRhythmDay(day);
                                                addLog(`Inspected GTM weekly rhythm focus for ${day}.`);
                                            }}
                                            className={`flex-1 py-1.5 text-[9px] font-bold rounded-lg transition-all border-none bg-transparent cursor-pointer ${
                                                selectedRhythmDay === day ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                                            }`}
                                        >
                                            {day.slice(0, 3)}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-4 bg-slate-950/60 border border-white/5 rounded-xl space-y-3">
                                    {selectedRhythmDay === "Monday" && (
                                        <>
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-bold text-indigo-400">Pipeline Review & Prospecting</span>
                                                <span className="text-[8px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-1.5 py-0.5 rounded font-mono uppercase font-bold">Mon Focus</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 leading-normal">
                                                Review active sales pipeline in the CRM. Clean stale deals, verify follow-up statuses, and compile a list of 20 new local targets.
                                            </p>
                                            <ul className="text-[10px] text-slate-300 space-y-1.5 pl-4 list-disc">
                                                <li>Audit all open deals and move stages if outdated</li>
                                                <li>Source 20 new prospects meeting the ICP</li>
                                                <li>Pre-populate LinkedIn connection requests</li>
                                            </ul>
                                        </>
                                    )}
                                    {selectedRhythmDay === "Tuesday" && (
                                        <>
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-bold text-orange-400">Outreach & Follow-Up Cadence</span>
                                                <span className="text-[8px] bg-orange-500/10 text-orange-300 border border-orange-500/20 px-1.5 py-0.5 rounded font-mono uppercase font-bold">Tue Focus</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 leading-normal">
                                                Execute main outbound sequences. Reach out to new prospects and process follow-up steps for pending proposals.
                                            </p>
                                            <ul className="text-[10px] text-slate-300 space-y-1.5 pl-4 list-disc">
                                                <li>Dispatch 20 LinkedIn connection requests</li>
                                                <li>Send 10 follow-up messages using playbooks</li>
                                                <li>Respond to warm responses and book discovery calls</li>
                                            </ul>
                                        </>
                                    )}
                                    {selectedRhythmDay === "Wednesday" && (
                                        <>
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-bold text-blue-400">LinkedIn Content & Authority</span>
                                                <span className="text-[8px] bg-blue-500/10 text-blue-300 border border-blue-500/20 px-1.5 py-0.5 rounded font-mono uppercase font-bold">Wed Focus</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 leading-normal">
                                                Share reputation management authority posts and network in regional business owner channels.
                                            </p>
                                            <ul className="text-[10px] text-slate-300 space-y-1.5 pl-4 list-disc">
                                                <li>Publish authority post (e.g. 5-star review impact)</li>
                                                <li>Engage with 15 local business posts or comments</li>
                                                <li>Connect with regional marketing agency leads</li>
                                            </ul>
                                        </>
                                    )}
                                    {selectedRhythmDay === "Thursday" && (
                                        <>
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-bold text-emerald-400">Product Demos & Proposals</span>
                                                <span className="text-[8px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono uppercase font-bold">Thu Focus</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 leading-normal">
                                                Host scheduled 1-on-1 walkthroughs and customize proposals highlighting Good-Better-Best tiers and ROI.
                                            </p>
                                            <ul className="text-[10px] text-slate-300 space-y-1.5 pl-4 list-disc">
                                                <li>Deliver booked discovery/demo calls</li>
                                                <li>Draft and send proposal documents within 24 hours</li>
                                                <li>Incorporate client reviews ROI calculator pitch</li>
                                            </ul>
                                        </>
                                    )}
                                    {selectedRhythmDay === "Friday" && (
                                        <>
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-bold text-red-400">Deal Reviews & Next-Week Planning</span>
                                                <span className="text-[8px] bg-red-500/10 text-red-300 border border-red-500/20 px-1.5 py-0.5 rounded font-mono uppercase font-bold">Fri Focus</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 leading-normal">
                                                Audit weekly metrics and targets. Complete admin checkoffs and plan the upcoming week's outreach queue.
                                            </p>
                                            <ul className="text-[10px] text-slate-300 space-y-1.5 pl-4 list-disc">
                                                <li>Analyze CRM win rates and closed MRR growth</li>
                                                <li>Confirm next week's scheduled demos & follow-ups</li>
                                                <li>Prepare queue for Monday's prospecting batch</li>
                                            </ul>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[10px] text-indigo-300 leading-normal flex items-start gap-2 mt-4">
                                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                <span>Rhythm keeps efforts consistent. Dedicate 60 minutes daily to outreach operations.</span>
                            </div>
                        </div>

                        {/* Daily targets progress tracker with sliders */}
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        <Activity className="w-4.5 h-4.5 text-indigo-400" />
                                        Daily Activity Targets Tracker
                                    </h3>
                                    <span className="text-xs font-bold text-indigo-400 font-mono">
                                        {Math.round(
                                            ((Math.min(dailyActivity.linkedinRequests, dailyTargets.linkedinRequests) / dailyTargets.linkedinRequests +
                                              Math.min(dailyActivity.followUps, dailyTargets.followUps) / dailyTargets.followUps +
                                              Math.min(dailyActivity.conversations, dailyTargets.conversations) / dailyTargets.conversations +
                                              Math.min(dailyActivity.discoveryCalls, dailyTargets.discoveryCalls) / dailyTargets.discoveryCalls +
                                              Math.min(dailyActivity.proposalsDelivered, dailyTargets.proposalsDelivered) / dailyTargets.proposalsDelivered) / 5) * 100
                                        )}% Done
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mb-6">
                                    Adjust sliders to track and log your completed daily GTM activities.
                                </p>

                                <div className="space-y-4">
                                    {[
                                        { key: "linkedinRequests", label: "LinkedIn Connect Requests", target: dailyTargets.linkedinRequests, current: dailyActivity.linkedinRequests, max: 30 },
                                        { key: "followUps", label: "Follow-Up Messages Sent", target: dailyTargets.followUps, current: dailyActivity.followUps, max: 20 },
                                        { key: "conversations", label: "Prospect Conversations", target: dailyTargets.conversations, current: dailyActivity.conversations, max: 10 },
                                        { key: "discoveryCalls", label: "Discovery Calls Completed", target: dailyTargets.discoveryCalls, current: dailyActivity.discoveryCalls, max: 5 },
                                        { key: "proposalsDelivered", label: "Proposals Delivered", target: dailyTargets.proposalsDelivered, current: dailyActivity.proposalsDelivered, max: 3 }
                                    ].map((item) => {
                                        const percentage = Math.min(100, Math.round((item.current / item.target) * 100));
                                        return (
                                            <div key={item.key} className="space-y-1.5">
                                                <div className="flex justify-between items-center text-[10px] font-bold">
                                                    <span className="text-slate-300">{item.label}</span>
                                                    <span className="text-slate-400 font-mono">{item.current} / {item.target}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max={item.max}
                                                        value={item.current}
                                                        onChange={(e) => {
                                                            const val = Number(e.target.value);
                                                            setDailyActivity(prev => ({ ...prev, [item.key]: val }));
                                                        }}
                                                        className="flex-1 accent-indigo-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer border border-white/5"
                                                    />
                                                    <div className="w-10 text-right shrink-0">
                                                        <span className={`text-[10px] font-mono font-bold ${percentage >= 100 ? "text-emerald-400" : "text-indigo-400"}`}>
                                                            {percentage}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    addLog(`[Outreach] Logged daily targets. Completion rate: ${Math.round(
                                        ((Math.min(dailyActivity.linkedinRequests, dailyTargets.linkedinRequests) / dailyTargets.linkedinRequests +
                                          Math.min(dailyActivity.followUps, dailyTargets.followUps) / dailyTargets.followUps +
                                          Math.min(dailyActivity.conversations, dailyTargets.conversations) / dailyTargets.conversations +
                                          Math.min(dailyActivity.discoveryCalls, dailyTargets.discoveryCalls) / dailyTargets.discoveryCalls +
                                          Math.min(dailyActivity.proposalsDelivered, dailyTargets.proposalsDelivered) / dailyTargets.proposalsDelivered) / 5) * 100
                                    )}%.`);
                                    addToast("success", "Daily activities synced to CRM & targets!");
                                }}
                                className="w-full mt-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none"
                            >
                                <Check className="w-3.5 h-3.5" /> Save Daily Progress
                            </button>
                        </div>

                        {/* LinkedIn Strategy & ICP */}
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                    <Send className="w-4.5 h-4.5 text-blue-400" />
                                    LinkedIn Strategy &amp; ICP
                                </h3>
                                <p className="text-xs text-slate-400 mb-4">
                                    LinkedIn growth guidelines and definition of Ideal Customer Profile.
                                </p>

                                <div className="space-y-3">
                                    <div className="p-3 bg-slate-950/60 border border-white/5 rounded-xl space-y-1.5">
                                        <div className="text-[10px] font-bold text-slate-200">LinkedIn Growth Strategy</div>
                                        <ul className="text-[9px] text-slate-400 list-disc pl-3.5 space-y-1 leading-normal font-sans">
                                            <li>Post twice weekly sharing review marketing insights</li>
                                            <li>Publish customer success stories &amp; case studies</li>
                                            <li>Engage with local business owners to build authority</li>
                                            <li>Build authority around reputation management</li>
                                        </ul>
                                    </div>
                                    <div className="p-3 bg-slate-950/60 border border-white/5 rounded-xl space-y-1.5">
                                        <div className="text-[10px] font-bold text-slate-200">Ideal Customer Profile (ICP)</div>
                                        <ul className="text-[9px] text-slate-400 list-disc pl-3.5 space-y-1 leading-normal font-sans">
                                            <li>Local businesses with &lt; 10 locations dependent on reviews</li>
                                            <li>Service-based companies (dental, medical, home services)</li>
                                            <li>Marketing agencies managing multiple local clients</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[10px] text-blue-300 leading-normal flex items-start gap-2 mt-4 font-sans">
                                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                <span>Focus on local operators where review rating changes impact immediate inbound traffic.</span>
                            </div>
                        </div>
                    </div>

                    {/* Sales Playbooks & Frameworks tabbed viewer */}
                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-4">
                            <div>
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <FileText className="w-4.5 h-4.5 text-indigo-400" />
                                    Founder Sales Playbooks &amp; Frameworks
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Access structured guides to execute the sales workflow from initial call to proposal and follow-up.
                                </p>
                            </div>
                            <div className="flex gap-1.5 p-1 bg-slate-950 border border-white/5 rounded-xl overflow-x-auto">
                                {[
                                    { id: "discovery", label: "Discovery Call Framework", color: "text-indigo-400" },
                                    { id: "demo", label: "Demo to Close Process", color: "text-emerald-400" },
                                    { id: "proposal", label: "Proposal Workflow", color: "text-orange-400" },
                                    { id: "followup", label: "Follow-Up System", color: "text-red-400" }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setSalesFrameworkTab(tab.id as any)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border-none bg-transparent cursor-pointer whitespace-nowrap ${
                                            salesFrameworkTab === tab.id 
                                                ? "bg-slate-900 text-white border border-white/10" 
                                                : "text-slate-400 hover:text-white"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-slate-950/60 border border-white/5 rounded-xl">
                            {salesFrameworkTab === "discovery" && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-xs font-bold text-white">Discovery Call Framework</h4>
                                            <p className="text-[10px] text-slate-400 mt-0.5">Focus: Understand business goals and review challenges.</p>
                                        </div>
                                        <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono">15 Mins</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 pt-2">
                                        {[
                                            { step: "1. Understand Goals", desc: "Ask: 'What are your customer acquisition goals this quarter? How much of that is driven by local search?'" },
                                            { step: "2. Identify Challenges", desc: "Ask: 'How are you currently collecting reviews? Are negative reviews slipping through onto Google?'" },
                                            { step: "3. Quantify Impact", desc: "Explain: 'A dentist with a 4.2 rating loses 20-30% of search traffic compared to one with 4.8. That is $10k+ in lost patient value monthly.'" },
                                            { step: "4. Present Solution", desc: "Say: 'ReviewManagement automatically prompts customers at check-out via SMS, and filters negative feedback before it hits Google.'" },
                                            { step: "5. Schedule Demo", desc: "Close: 'I can set up a draft review portal for your business and show you a demo this Thursday. Does 10 AM or 2 PM work better?'" }
                                        ].map((card, idx) => (
                                            <div key={idx} className="p-3 bg-slate-900/60 border border-white/5 rounded-lg space-y-1.5">
                                                <span className="text-[10px] font-bold text-indigo-300 block">{card.step}</span>
                                                <p className="text-[9px] text-slate-400 leading-normal font-sans">{card.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {salesFrameworkTab === "demo" && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-xs font-bold text-white">Demo to Close Process</h4>
                                            <p className="text-[10px] text-slate-400 mt-0.5">Focus: Structured progression map from initial call to active merchant onboarding.</p>
                                        </div>
                                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">5 Steps</span>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 pt-2">
                                        {[
                                            { step: "1. Discovery Call", desc: "Assess lead requirements, check current Google Maps visibility and stars." },
                                            { step: "2. Product Demo", desc: "Show dashboard automation, review templates, and multi-location agency dashboards." },
                                            { step: "3. Proposal Delivery", desc: "Send G-B-B proposal within 24 hours of demo with custom ROI slide." },
                                            { step: "4. Follow-Up", desc: "Activate automated follow-up steps (Day 1, 3, 7, 14 outreach sequences)." },
                                            { step: "5. Close & Onboard", desc: "Collect credit card payment, set up GMB API integration, and dispatch first SMS campaign." }
                                        ].map((card, idx) => (
                                            <div key={idx} className="flex-1 p-3 bg-slate-900/60 border border-white/5 rounded-lg flex flex-col justify-between gap-2 relative">
                                                <div>
                                                    <span className="text-[10px] font-bold text-emerald-300 block mb-1">{card.step}</span>
                                                    <p className="text-[9px] text-slate-400 leading-normal font-sans">{card.desc}</p>
                                                </div>
                                                {idx < 4 && (
                                                    <div className="hidden md:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 bg-slate-950 p-1 rounded-full border border-white/5">
                                                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {salesFrameworkTab === "proposal" && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-xs font-bold text-white">Proposal &amp; Pricing Workflow</h4>
                                            <p className="text-[10px] text-slate-400 mt-0.5">Focus: Pitching high-conversion proposals with tiered pricing.</p>
                                        </div>
                                        <span className="text-[9px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded font-mono">24 Hours</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 pt-2">
                                        {[
                                            { title: "24-Hour Rule", desc: "Proposals sent within 24 hours of the demo have a 60% higher close rate. Keep the momentum." },
                                            { title: "Good-Better-Best Pricing", desc: "Starter: $49/mo (basic reviews). Growth: $99/mo (SMS + integrations - Recommended). Agency: $299/mo (multi-location + reseller)." },
                                            { title: "Include ROI Discussion", desc: "Illustrate that generating just 1 new high-value customer per month completely covers the $99/mo tool cost." },
                                            { title: "Schedule Follow-up Meeting", desc: "Do not email a proposal in a vacuum. Always book a 10-minute follow-up calendar slot to walk through it together." }
                                        ].map((card, idx) => (
                                            <div key={idx} className="p-3 bg-slate-900/60 border border-white/5 rounded-lg space-y-1.5">
                                                <span className="text-[10px] font-bold text-orange-300 block">{card.title}</span>
                                                <p className="text-[9px] text-slate-400 leading-normal font-sans">{card.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {salesFrameworkTab === "followup" && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-xs font-bold text-white">Follow-Up System Cadence</h4>
                                            <p className="text-[10px] text-slate-400 mt-0.5">Focus: Systematic outreach sequence for deals that did not close on the demo.</p>
                                        </div>
                                        <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-mono">14 Days</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 pt-2">
                                        {[
                                            { day: "Day 1: Proposal Follow-up", desc: "Send proposal deck link. Ask: 'Dr. Emily, did you have a chance to review the Growth plan custom integrations we discussed?'" },
                                            { day: "Day 3: Value Reminder", desc: "Send value drop. Show how competitors are ranking. 'Thought you would find this local search review map pack chart interesting!'" },
                                            { day: "Day 7: Client Case Study", desc: "Share case study. 'Here is a quick look at how Green Valley Plumbers grew their business 25% by automating review requests.'" },
                                            { day: "Day 14: Final Outreach", desc: "Polite close. 'We are closing this batch of beta onboardings. If you'd like to reserve the $99/mo rate for later, let me know by Friday.'" }
                                        ].map((card, idx) => (
                                            <div key={idx} className="p-3 bg-slate-900/60 border border-white/5 rounded-lg space-y-1.5">
                                                <span className="text-[10px] font-bold text-red-300 block">{card.day}</span>
                                                <p className="text-[9px] text-slate-400 leading-normal font-sans">{card.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sales Pipelines Stages columns */}
                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Target className="w-4.5 h-4.5 text-indigo-400" />
                                    Active Sales Pipeline CRM
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Move leads through validation columns. Deals moved to "Closed Won" add MRR instantly.
                                </p>
                            </div>
                            <form onSubmit={handleAddLead} className="flex flex-wrap items-center gap-2.5">
                                <input
                                    type="text"
                                    placeholder="Lead Business Name"
                                    value={newLeadName}
                                    onChange={(e) => setNewLeadName(e.target.value)}
                                    className="bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none font-mono"
                                />
                                <select
                                    value={newLeadSource}
                                    onChange={(e) => setNewLeadSource(e.target.value as any)}
                                    className="bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                >
                                    <option value="Local Outreach">Local Outreach</option>
                                    <option value="Agency Partner">Agency Partner</option>
                                    <option value="Referral">Referral</option>
                                    <option value="Founder Call">Founder Call</option>
                                </select>
                                <select
                                    value={newLeadValue}
                                    onChange={(e) => setNewLeadValue(Number(e.target.value))}
                                    className="bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none font-mono"
                                >
                                    <option value={49}>Starter ($49/mo)</option>
                                    <option value={99}>Growth ($99/mo)</option>
                                    <option value={299}>Agency ($299/mo)</option>
                                </select>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all border-none cursor-pointer"
                                >
                                    Add Lead
                                </button>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {(["Lead", "Contacted", "Demo Scheduled", "Closed Won"] as const).map((stage) => {
                                const stageLeads = salesPipeline.filter(l => l.stage === stage);
                                return (
                                    <div key={stage} className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex flex-col justify-between min-h-[300px]">
                                        <div>
                                            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                                                <span className="text-xs font-bold text-slate-400 capitalize">{stage}</span>
                                                <span className="text-[10px] bg-slate-900 border border-white/5 text-slate-300 px-1.5 py-0.2 rounded-full font-bold">{stageLeads.length}</span>
                                            </div>
                                            
                                            <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                                                {stageLeads.map((lead) => (
                                                    <div key={lead.id} className="p-3 bg-slate-900/60 border border-white/5 rounded-lg text-left flex flex-col justify-between gap-2">
                                                        <div>
                                                            <div className="text-xs font-bold text-slate-200 truncate">{lead.name}</div>
                                                            <div className="flex justify-between items-center mt-1">
                                                                <span className="text-[8px] text-slate-500 font-mono">{lead.source}</span>
                                                                <span className="text-[10px] text-emerald-400 font-bold font-mono">${lead.value}/mo</span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex justify-between pt-1 border-t border-white/5">
                                                            <button
                                                                disabled={stage === "Lead"}
                                                                onClick={() => handleMoveLead(lead.id, "backward")}
                                                                className={`text-[9px] px-1 hover:text-white transition-colors cursor-pointer border-none bg-transparent ${
                                                                    stage === "Lead" ? "text-slate-700 cursor-not-allowed" : "text-slate-500"
                                                                }`}
                                                            >
                                                                ◀ Back
                                                            </button>
                                                            <button
                                                                disabled={stage === "Closed Won"}
                                                                onClick={() => handleMoveLead(lead.id, "forward")}
                                                                className={`text-[9px] px-1 hover:text-white transition-colors cursor-pointer border-none bg-transparent ${
                                                                    stage === "Closed Won" ? "text-slate-700 cursor-not-allowed" : "text-slate-500"
                                                                }`}
                                                            >
                                                                Next ▶
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="text-[9px] text-slate-500 font-mono pt-3 border-t border-slate-900 text-center">
                                            Stage MRR: ${stageLeads.reduce((acc, curr) => acc + curr.value, 0)}/mo
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 4: Referral Engine ── */}
            {activeTab === "referrals" && (
                <div className="space-y-6">
                    {/* Reseller Strategy Banner */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#121624] to-[#1a1f33] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Award className="w-5 h-5 text-indigo-400" />
                                Reseller &amp; Customer Referral Engines
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                                We incentivize marketing agencies and local business champions with recurring commission structures. Resellers leverage the **Agency Plan ($299/mo)** to manage up to 10 clients under their brand, creating high-margin SaaS revenue streams.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="p-4 bg-slate-950/80 rounded-xl border border-white/5 text-center shrink-0">
                                <span className="text-[9px] text-slate-500 uppercase block font-bold">Reseller Pricing</span>
                                <span className="text-lg font-black text-indigo-400 font-mono">$299/mo</span>
                            </div>
                            <div className="p-4 bg-slate-950/80 rounded-xl border border-white/5 text-center shrink-0">
                                <span className="text-[9px] text-slate-500 uppercase block font-bold">Standard Rewards</span>
                                <span className="text-lg font-black text-emerald-400 font-mono">20% Recurring</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Leaderboard Table */}
                        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Activity className="w-4.5 h-4.5 text-indigo-400" />
                                    Referral Program Leaderboard
                                </h3>
                                <span className="text-[10px] text-indigo-300 font-bold font-mono">Reseller &amp; Advocate Network</span>
                            </div>

                            <div className="overflow-x-auto font-mono">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 text-slate-500 font-semibold">
                                            <th className="pb-2">Referrer Partner</th>
                                            <th className="pb-2">Type</th>
                                            <th className="pb-2">Referral Code</th>
                                            <th className="pb-2">Referred Accounts</th>
                                            <th className="pb-2">Paid Comm.</th>
                                            <th className="pb-2">Pending Payout</th>
                                            <th className="pb-2 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {referralPartners.map(p => (
                                            <tr key={p.id} className="border-b border-white/5 text-slate-300 hover:bg-white/1 text-[11px]">
                                                <td className="py-3 font-bold text-slate-200">{p.referrer}</td>
                                                <td className="py-3">
                                                    <span className={`inline-flex items-center text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                                                        p.type === "Agency Partner" ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25" : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                                                    }`}>
                                                        {p.type.split(" ")[0]}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-slate-400">{p.code}</td>
                                                <td className="py-3 text-center text-white font-bold">{p.customersReferred}</td>
                                                <td className="py-3 text-slate-500">${p.commissionPaid}</td>
                                                <td className="py-3 text-amber-400 font-bold">${p.commissionPending}</td>
                                                <td className="py-3 text-right">
                                                    {p.commissionPending > 0 ? (
                                                        <button
                                                            onClick={() => handleApproveCommission(p.id)}
                                                            className="text-[9px] bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white px-2 py-0.5 rounded transition-all cursor-pointer font-bold border-none"
                                                        >
                                                            Payout
                                                        </button>
                                                    ) : (
                                                        <span className="text-[9px] text-slate-500">Paid-up ✓</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Register Referral partner form */}
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                    <Plus className="w-4.5 h-4.5 text-indigo-400" />
                                    Register Partner / Code
                                </h3>
                                <p className="text-xs text-slate-400 mb-4">
                                    Create new affiliate referral codes to distribute commissions automatically.
                                </p>

                                <form onSubmit={handleAddPartner} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1.5">Partner Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Apex Dental Clinic"
                                            value={newPartnerName}
                                            onChange={(e) => setNewPartnerName(e.target.value)}
                                            className="bg-slate-950 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none w-full font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1.5">Affiliate Type</label>
                                        <select
                                            value={newPartnerType}
                                            onChange={(e) => setNewPartnerType(e.target.value as any)}
                                            className="bg-slate-950 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none w-full"
                                        >
                                            <option value="Customer Advocate">Customer Advocate (20% Off)</option>
                                            <option value="Agency Partner">Agency Partner (Reseller Pricing)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1.5">Referral Code</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. APEXGTM"
                                            value={newPartnerCode}
                                            onChange={(e) => setNewPartnerCode(e.target.value)}
                                            className="bg-slate-950 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none w-full font-mono font-bold"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none"
                                    >
                                        <Link2 className="w-3.5 h-3.5" /> Register Code
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 5: Roadmap & KPIs ── */}
            {activeTab === "roadmap" && (
                <div className="space-y-6">
                    {/* KPI indicators row - Founder KPI Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 flex items-start justify-between relative overflow-hidden group">
                            <div>
                                <div className="text-2xl font-black text-white mb-1 font-mono">
                                    {weeklyActivity.linkedinMessages + weeklyActivity.coldEmails + dailyActivity.linkedinRequests + dailyActivity.followUps}
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5 text-violet-400" /> Prospects Contacted
                                </div>
                                <p className="text-[10px] text-slate-500">LinkedIn + Cold Email reach</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                                <Activity className="w-4 h-4 text-violet-400" />
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 flex items-start justify-between relative overflow-hidden group">
                            <div>
                                <div className="text-2xl font-black text-white mb-1 font-mono">
                                    {weeklyActivity.discoveryCalls + dailyActivity.discoveryCalls}
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                    <BarChart2 className="w-3.5 h-3.5 text-cyan-400" /> Discovery Calls
                                </div>
                                <p className="text-[10px] text-slate-500">Initial qualification calls</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                                <TrendingUp className="w-4 h-4 text-cyan-400" />
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 flex items-start justify-between relative overflow-hidden group">
                            <div>
                                <div className="text-2xl font-black text-white mb-1 font-mono">
                                    {weeklyActivity.productDemos}
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                    <Play className="w-3.5 h-3.5 text-orange-400" /> Demos Completed
                                </div>
                                <p className="text-[10px] text-slate-500">Live dashboard walkthroughs</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                                <Play className="w-4 h-4 text-orange-400" />
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 flex items-start justify-between relative overflow-hidden group">
                            <div>
                                <div className="text-2xl font-black text-white mb-1 font-mono">
                                    {weeklyActivity.proposalsSent + dailyActivity.proposalsDelivered}
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                    <FileText className="w-3.5 h-3.5 text-emerald-400" /> Proposals Sent
                                </div>
                                <p className="text-[10px] text-slate-500">Tiered pricing agreements sent</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                                <FileText className="w-4 h-4 text-emerald-400" />
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 flex items-start justify-between relative overflow-hidden group">
                            <div>
                                <div className="text-2xl font-black text-white mb-1 font-mono">
                                    {currentOnboardedCustomers}
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                    <UserCheck className="w-3.5 h-3.5 text-blue-400" /> Customers Acquired
                                </div>
                                <p className="text-[10px] text-slate-500">Paying + active beta seats</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                <UserCheck className="w-4 h-4 text-blue-400" />
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 flex items-start justify-between relative overflow-hidden group">
                            <div>
                                <div className="text-2xl font-black text-white mb-1 font-mono">
                                    ${projectedMRR}
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                    <DollarSign className="w-3.5 h-3.5 text-yellow-400" /> MRR Growth
                                </div>
                                <p className="text-[10px] text-slate-500">Live projected recurring baseline</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
                                <DollarSign className="w-4 h-4 text-yellow-400" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* 90-Day GTM Execution Roadmap */}
                        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-white/5">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        <ListTodo className="w-4.5 h-4.5 text-indigo-400" />
                                        90-Day Founder Execution Plan
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Mark off milestones as we progress through Month 1, Month 2, and Month 3 gates.
                                    </p>
                                </div>
                                <span className="text-xs font-bold text-indigo-400 font-mono">{roadmapReadiness}% Ready</span>
                            </div>

                            <div className="space-y-6">
                                {[1, 2, 3].map((month) => {
                                    const monthMilestones = roadmapMilestones.filter(m => m.month === month);
                                    const monthTitle = month === 1 ? "Month 1: Acquire First Customers (Beta)" :
                                                       month === 2 ? "Month 2: Build Referrals & Success Case Studies" :
                                                       "Month 3: Expand Agency Partnerships";
                                    return (
                                        <div key={month} className="p-4 bg-slate-950/60 border border-white/5 rounded-xl space-y-3">
                                            <span className="text-xs font-bold text-indigo-300 block border-b border-white/5 pb-1.5">{monthTitle}</span>
                                            <div className="space-y-2">
                                                {monthMilestones.map(m => (
                                                    <button
                                                        key={m.id}
                                                        onClick={() => toggleMilestone(m.id)}
                                                        className={`w-full p-2.5 rounded-lg border text-left text-xs flex items-center justify-between gap-3 cursor-pointer transition-all border-none ${
                                                            m.checked
                                                                ? "bg-indigo-500/10 text-white"
                                                                : "bg-slate-900 text-slate-500 hover:text-slate-400"
                                                        }`}
                                                    >
                                                        <span>{m.text}</span>
                                                        <div className={`w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center ${
                                                            m.checked ? "bg-indigo-600 border-indigo-500" : "bg-slate-950 border-slate-700"
                                                        }`}>
                                                            {m.checked && <Check className="w-2.5 h-2.5 text-white" />}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Part 14 Deliverables Checklist */}
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                    <ListTodo className="w-4.5 h-4.5 text-red-500" />
                                    Part 14 Gate Deliverables
                                </h3>
                                <p className="text-xs text-slate-400 mb-4">
                                    Track progress toward finalizing the founder commercialization kit.
                                </p>

                                <div className="space-y-2">
                                    {[
                                        { key: "salesSystemApproved", label: "Founder sales system approved" },
                                        { key: "rhythmDocumented", label: "Weekly operating rhythm documented" },
                                        { key: "kpiDashboardDefined", label: "KPI dashboard defined" },
                                        { key: "roadmapEstablished", label: "Revenue roadmap established" },
                                        { key: "commercializationKitCompleted", label: "Commercialization kit completed" }
                                    ].map((del) => (
                                        <button
                                            key={del.key}
                                            onClick={() => {
                                                setDeliverables(prev => {
                                                    const updated = { ...prev, [del.key]: !prev[del.key as keyof typeof prev] };
                                                    addLog(`GTM Gate: "${del.label}" updated.`);
                                                    addToast("success", "Deliverable status updated.");
                                                    return updated;
                                                });
                                            }}
                                            className={`w-full p-2.5 rounded-xl border text-left text-xs flex items-center justify-between gap-3 cursor-pointer transition-all border-none ${
                                                deliverables[del.key as keyof typeof deliverables]
                                                    ? "bg-emerald-500/10 text-white font-bold"
                                                    : "bg-slate-900 text-slate-500 hover:text-slate-400"
                                            }`}
                                        >
                                            <span>{del.label}</span>
                                            <div className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center ${
                                                deliverables[del.key as keyof typeof deliverables] ? "bg-emerald-600 border-emerald-500" : "bg-slate-950 border-slate-700"
                                            }`}>
                                                {deliverables[del.key as keyof typeof deliverables] && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-300 leading-normal flex items-start gap-2 mt-4 font-sans">
                                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                <span>Completing these gates ensures commercial readiness for the target $10K MRR.</span>
                            </div>
                        </div>
                    </div>

                    {/* Revenue Milestones Timeline & Beta Feedback Board */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Revenue Milestones Timeline */}
                        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                    <TrendingUp className="w-4.5 h-4.5 text-indigo-400" />
                                    Revenue Milestones Timeline
                                </h3>
                                <p className="text-xs text-slate-400 mb-6">
                                    Dynamic trajectory indicators toward achieving our first $10K MRR.
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2">
                                    {[
                                        { title: "Customer #1", cond: currentOnboardedCustomers >= 1, label: `${currentOnboardedCustomers}/1 active` },
                                        { title: "First 10 Customers", cond: currentOnboardedCustomers >= 10, label: `${currentOnboardedCustomers}/10 active` },
                                        { title: "$1K MRR", cond: projectedMRR >= 1000, label: `$${projectedMRR}/$1K MRR` },
                                        { title: "$5K MRR", cond: projectedMRR >= 5000, label: `$${projectedMRR}/$5K MRR` },
                                        { title: "$10K MRR", cond: projectedMRR >= 10000, label: `$${projectedMRR}/$10K MRR` },
                                        { title: "100 Customers", cond: currentOnboardedCustomers >= 100, label: `${currentOnboardedCustomers}/100 active` }
                                    ].map((m, idx) => (
                                        <div key={idx} className={`p-3 rounded-xl border text-center flex flex-col justify-between gap-2.5 ${
                                            m.cond 
                                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                                                : (idx === 0 || idx === 1 || idx === 2 || (idx === 3 && projectedMRR >= 2000))
                                                ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 animate-pulse"
                                                : "bg-slate-950/60 border-white/5 text-slate-500"
                                        }`}>
                                            <div>
                                                <span className="text-[10px] font-bold block mb-1">{m.title}</span>
                                                <span className="text-[9px] font-mono block opacity-80">{m.label}</span>
                                            </div>
                                            <div className="flex justify-center">
                                                {m.cond ? (
                                                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                                        <Check className="w-2.5 h-2.5" /> Done
                                                    </span>
                                                ) : (idx === 0 || idx === 1 || idx === 2 || (idx === 3 && projectedMRR < 5000)) ? (
                                                    <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="text-[9px] bg-slate-900 text-slate-600 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                                        Locked
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Customer feedback board */}
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                    <MessageSquare className="w-4.5 h-4.5 text-emerald-400" />
                                    Beta Feedback &amp; Product Requests
                                </h3>
                                <p className="text-xs text-slate-400 mb-4">
                                    Review feedback from clients. Escalate items to roadmap to flag development sprints.
                                </p>

                                <div className="space-y-3.5 max-h-[220px] overflow-y-auto font-mono">
                                    {feedbackBoard.map((item) => (
                                        <div key={item.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-slate-200">{item.business}</span>
                                                <div className="flex gap-0.5">
                                                    {Array.from({ length: 5 }).map((_, idx) => (
                                                        <Star key={idx} className={`w-2.5 h-2.5 ${idx < item.rating ? "text-yellow-400 star-filled" : "text-slate-700"}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-slate-400 italic">"{item.comment}"</p>
                                            
                                            <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                                    item.status === "Pending" ? "bg-slate-800 text-slate-400" :
                                                    item.status === "Escalated" ? "bg-indigo-500/15 border border-indigo-500/30 text-indigo-400" :
                                                    "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                                                }`}>
                                                    {item.status}
                                                </span>
                                                {item.status === "Pending" && (
                                                    <button
                                                        onClick={() => handleEscalateFeedback(item.id)}
                                                        className="text-[9px] bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white px-2 py-0.5 rounded transition-all cursor-pointer font-bold border-none"
                                                    >
                                                        Escalate
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* General DevOps Terminal Log console */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <CheckCircle className="w-4.5 h-4.5 text-slate-400" />
                        GTM &amp; Operations Audit Logs
                    </h3>
                    <span className="text-[9px] text-slate-500 font-mono">active connection</span>
                </div>
                <div className="bg-slate-950 rounded-xl p-4 border border-white/5">
                    <div className="h-[140px] overflow-y-auto font-mono text-xs text-slate-400 space-y-2">
                        {launchLogs.map((log, idx) => (
                            <div key={idx} className="flex gap-1.5">
                                <span className="text-red-500 shrink-0">➔</span>
                                <span className={
                                    log.includes("complete") || log.includes("SUCCESS") || log.includes("Closed Won") || log.includes("Converted") ? "text-emerald-400 font-bold" :
                                    log.includes("Campaign") ? "text-indigo-400" :
                                    log.includes("Invitation") || log.includes("Invite") || log.includes("Offered") ? "text-orange-400 font-semibold" :
                                    log.includes("Outreach") || log.includes("Referral") ? "text-yellow-400" : ""
                                }>
                                    {log}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
