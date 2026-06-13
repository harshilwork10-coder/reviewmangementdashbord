"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { 
    getBusinessById, saveBusiness, addLocation, addReview, 
    addCampaign, createUser, addAlert, addTask, Business 
} from "@/lib/store";
import { 
    Building2, MapPin, CheckCircle2, ChevronRight, Globe, 
    Smartphone, Mail, Lock, Sparkles, Send, Users, ShieldAlert,
    Star, ArrowRight, RefreshCw, Eye
} from "lucide-react";

const CATEGORIES = ["Restaurant", "Retail", "Liquor Store", "Clinic", "Salon", "Hotel", "Gym", "Cafe", "Other"];

export default function SetupWizard() {
    const { user } = useAuth();
    const router = useRouter();
    const [biz, setBiz] = useState<Business | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Step 1: Business Info
    const [bizForm, setBizForm] = useState({
        name: "", category: "Restaurant", description: "", 
        phone: "", website: "", address: "", logo: "🏪"
    });

    // Step 2: Location Info
    const [locForm, setLocForm] = useState({
        name: "Main Branch", address: ""
    });

    // Step 3: Google Connection Simulator
    const [googleConnecting, setGoogleConnecting] = useState(false);
    const [googleConnected, setGoogleConnected] = useState(false);
    const [selectedGoogleLoc, setSelectedGoogleLoc] = useState("");
    const [googleAccounts] = useState(["Stellar Bistro - Downtown Chicago", "Stellar Bistro - O'Hare Branch"]);
    const [showGoogleModal, setShowGoogleModal] = useState(false);
    const [importingReviews, setImportingReviews] = useState(false);
    const [importedCount, setImportedCount] = useState(0);

    // Step 4: Campaign Configurations
    const [campaignForm, setCampaignForm] = useState({
        emailSubject: "We value your opinion at {{BUSINESS_NAME}}!",
        emailBody: "Hi there! Thank you for your recent visit. We constantly strive to offer the best experience. Could you take 60 seconds to share your feedback?",
        smsBody: "Thanks for visiting us! We would love to hear about your experience. Tap the link to write a quick review: [REVIEW_LINK]"
    });

    // Step 5: AI Tone Preferences & Live Response Test
    const [aiForm, setAiForm] = useState({
        tone: "friendly",
        brandVoice: "We are warm, customer-focused, and love to use food emojis like 🥗 and 🍕.",
        autoApprove: false
    });
    const [aiResponseText, setAiResponseText] = useState("");
    const [aiGenerating, setAiGenerating] = useState(false);
    const [aiApproved, setAiApproved] = useState(false);

    // Step 6: Team Invites
    const [teamInvites, setTeamInvites] = useState<{ email: string; role: string }[]>([]);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("manager");

    // Load business
    useEffect(() => {
        if (user?.businessId) {
            const b = getBusinessById(user.businessId);
            if (b) {
                setBiz(b);
                setBizForm({
                    name: b.name || "",
                    category: b.category || "Restaurant",
                    description: b.description || "",
                    phone: b.phone || "",
                    website: b.website || "",
                    address: b.address || "",
                    logo: b.logo || "🏪"
                });
                setLocForm(prev => ({ ...prev, address: b.address || "" }));
            }
        }
    }, [user]);

    if (!user || !biz) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    const nextStep = () => setCurrentStep(s => Math.min(s + 1, 7));
    const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1));

    // Form handlers
    const saveStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        saveBusiness({
            ...biz,
            ...bizForm
        });
        nextStep();
    };

    const saveStep2 = (e: React.FormEvent) => {
        e.preventDefault();
        addLocation({
            businessId: biz.id,
            name: locForm.name,
            address: locForm.address
        });
        nextStep();
    };

    const handleGoogleConnect = () => {
        setGoogleConnecting(true);
        setTimeout(() => {
            setShowGoogleModal(true);
            setGoogleConnecting(false);
        }, 1200);
    };

    const confirmGoogleSelect = (loc: string) => {
        setSelectedGoogleLoc(loc);
        setShowGoogleModal(false);
        setImportingReviews(true);
        
        // Simulate review importing
        let count = 0;
        const interval = setInterval(() => {
            count += 1;
            setImportedCount(count);
            if (count >= 5) {
                clearInterval(interval);
                setTimeout(() => {
                    // Seed some imported google reviews
                    const sampleReviews = [
                        { customerName: "David K.", rating: 5, text: "Had an excellent dinner here. Service was prompt and friendly! Highly recommend the salad bowls.", source: "Google" },
                        { customerName: "Maria R.", rating: 4, text: "Good atmosphere and quality menu options. A bit pricey but worth it.", source: "Google" },
                        { customerName: "John L.", rating: 2, text: "Wait times were longer than expected. Staff seemed overwhelmed.", source: "Google" }
                    ];

                    sampleReviews.forEach(r => {
                        addReview({
                            businessId: biz.id,
                            customerName: r.customerName,
                            rating: r.rating,
                            text: r.text,
                            source: r.source,
                            isPrivate: r.rating <= 3
                        });
                    });

                    // Update business flag
                    const updated = { ...biz, googleConnected: true };
                    saveBusiness(updated);
                    setBiz(updated);
                    setGoogleConnected(true);
                    setImportingReviews(false);
                }, 800);
            }
        }, 300);
    };

    const saveStep4 = () => {
        // Create templates campaigns
        addCampaign({
            businessId: biz.id,
            name: "Email Request Campaign",
            channel: "email",
            templateSubject: campaignForm.emailSubject,
            templateBody: campaignForm.emailBody,
            sendDelayHours: 24,
            isActive: true,
            sentCount: 0
        });

        const updated = { ...biz, campaignCreated: true, reviewRequestSent: true };
        saveBusiness(updated);
        setBiz(updated);
        nextStep();
    };

    const generateAITestReply = () => {
        setAiGenerating(true);
        setTimeout(() => {
            let reply = "";
            if (aiForm.tone === "friendly") {
                reply = `Hi Maria! Thank you so much for the feedback! 🥗 We are glad you liked the atmosphere and quality menu options. We appreciate your support and hope to see you again soon! 🍕`;
            } else if (aiForm.tone === "professional") {
                reply = `Dear Maria, thank you for sharing your experience. We are pleased to read your positive remarks regarding our service quality. We note your feedback on pricing and will keep working to deliver premium value.`;
            } else if (aiForm.tone === "luxury") {
                reply = `Thank you for choosing us, Maria. We are delighted to hear that you appreciated our refined menu and elegant ambiance. We look forward to welcome you back for another exquisite experience.`;
            } else {
                reply = `Thank you, Maria! We appreciate your review. Our team strives to offer a stellar experience to all our guests.`;
            }
            setAiResponseText(reply);
            setAiGenerating(false);
        }, 1000);
    };

    const approveAITestReply = () => {
        setAiApproved(true);
        // Create an alert & task simulating the milestone
        addAlert({
            businessId: biz.id,
            alertType: "first-ai-reply",
            severity: "low",
            message: "Setup Wizard: First AI Reply drafted and approved successfully."
        });
        const updated = { ...biz, aiReplyGenerated: true };
        saveBusiness(updated);
        setBiz(updated);
    };

    const addTeamMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail) return;
        setTeamInvites(prev => [...prev, { email: inviteEmail, role: inviteRole }]);
        
        // Create the user in store
        createUser({
            email: inviteEmail,
            password: "pass1234default",
            name: inviteEmail.split("@")[0],
            role: inviteRole as any,
            businessId: biz.id
        });

        setInviteEmail("");
    };

    const completeOnboarding = () => {
        setLoading(true);
        setTimeout(() => {
            const completedBiz = {
                ...biz,
                isOnboarded: true,
                subscriptionPlan: biz.subscriptionPlan || "starter",
                billingStatus: biz.billingStatus || "paid"
            };
            saveBusiness(completedBiz);
            setLoading(false);
            router.push("/dashboard");
            window.location.reload(); // Hard reload to clear sidebar locks
        }, 1200);
    };

    const progressPercent = Math.round((currentStep / 7) * 100);

    return (
        <div className="min-h-screen mesh-gradient py-10 px-6 overflow-y-auto flex flex-col justify-between">
            {/* Header */}
            <div className="max-w-4xl mx-auto w-full mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl btn-primary flex items-center justify-center font-bold text-white text-base">
                        ⚡
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white font-display">Setup & Activation Wizard</h1>
                        <p className="text-xs text-muted-foreground">{biz.name} · Step {currentStep} of 7</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-primary">{progressPercent}% Completed</span>
                    <div className="w-32 h-2 rounded-full bg-secondary/60 overflow-hidden border border-border/20">
                        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                    </div>
                </div>
            </div>

            {/* Main wizard card */}
            <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center">
                <div className="glass-card rounded-3xl border border-border/40 p-8 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-between">
                    
                    {/* STEP 1: BUSINESS PROFILE */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Tell us about your Business</h2>
                                <p className="text-sm text-muted-foreground">Verify your primary details. These are used to customize outreach campaigns and AI reply guidelines.</p>
                            </div>
                            <form onSubmit={saveStep1} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Business Name *</label>
                                        <input 
                                            value={bizForm.name} 
                                            onChange={e => setBizForm(f => ({ ...f, name: e.target.value }))}
                                            required placeholder="My Bistro"
                                            className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Category *</label>
                                        <select 
                                            value={bizForm.category} 
                                            onChange={e => setBizForm(f => ({ ...f, category: e.target.value }))}
                                            className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                                        >
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Icon Logo</label>
                                        <input 
                                            value={bizForm.logo} 
                                            onChange={e => setBizForm(f => ({ ...f, logo: e.target.value }))}
                                            placeholder="🍽️"
                                            className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-foreground text-sm focus:outline-none focus:border-primary text-center"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Website</label>
                                        <input 
                                            value={bizForm.website} 
                                            onChange={e => setBizForm(f => ({ ...f, website: e.target.value }))}
                                            placeholder="https://stellarbistro.com"
                                            className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Phone Number</label>
                                        <input 
                                            value={bizForm.phone} 
                                            onChange={e => setBizForm(f => ({ ...f, phone: e.target.value }))}
                                            placeholder="(312) 555-0101"
                                            className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Primary Address</label>
                                        <input 
                                            value={bizForm.address} 
                                            onChange={e => setBizForm(f => ({ ...f, address: e.target.value }))}
                                            placeholder="123 N Michigan Ave, Chicago, IL"
                                            className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Short Business Description</label>
                                    <textarea 
                                        value={bizForm.description} 
                                        onChange={e => setBizForm(f => ({ ...f, description: e.target.value }))}
                                        rows={3} placeholder="A contemporary bistro serving farm-to-table culinary dishes."
                                        className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-foreground text-sm focus:outline-none focus:border-primary resize-none"
                                    />
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button type="submit" className="px-5 py-2.5 rounded-xl btn-primary text-white font-semibold text-sm flex items-center gap-2">
                                        Save & Next <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* STEP 2: LOCATION SETUP */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Set up your First Location</h2>
                                <p className="text-sm text-muted-foreground">Reputation tracking and request campaigns are isolated by branch to ensure accurate customer feedback mapping.</p>
                            </div>
                            <form onSubmit={saveStep2} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Branch/Location Name *</label>
                                        <input 
                                            value={locForm.name} 
                                            onChange={e => setLocForm(l => ({ ...l, name: e.target.value }))}
                                            required placeholder="Downtown Loop"
                                            className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Branch Address *</label>
                                        <input 
                                            value={locForm.address} 
                                            onChange={e => setLocForm(l => ({ ...l, address: e.target.value }))}
                                            required placeholder="123 N Michigan Ave, Chicago, IL 60601"
                                            className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>
                                <div className="pt-8 flex justify-between">
                                    <button type="button" onClick={prevStep} className="px-5 py-2.5 rounded-xl bg-secondary/50 text-foreground font-semibold text-sm">
                                        Back
                                    </button>
                                    <button type="submit" className="px-5 py-2.5 rounded-xl btn-primary text-white font-semibold text-sm flex items-center gap-2">
                                        Create Location <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* STEP 3: GOOGLE BUSINESS CONNECTION */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Connect your Google Business Profile</h2>
                                <p className="text-sm text-muted-foreground">Authorize ReviewManagement to sync your listings, fetch ratings, and pull reviews directly into your dashboard feed.</p>
                            </div>

                            <div className="flex flex-col items-center justify-center py-8 bg-secondary/20 border border-border/30 rounded-2xl p-6 text-center max-w-lg mx-auto">
                                {!googleConnected && !importingReviews ? (
                                    <>
                                        <div className="w-14 h-14 rounded-2xl bg-[#4285F4]/10 flex items-center justify-center mb-4 text-[#4285F4]">
                                            <Globe className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-base font-bold text-white mb-1.5">Connect to Google</h3>
                                        <p className="text-xs text-muted-foreground mb-6 max-w-sm">Requires access to list physical locations and pull historical reviews. No writing permissions requested.</p>
                                        <button 
                                            onClick={handleGoogleConnect} disabled={googleConnecting}
                                            className="px-6 py-3 rounded-xl bg-[#4285F4] hover:bg-[#4285F4]/90 text-white font-bold text-sm flex items-center gap-2.5 transition-all shadow-md shadow-[#4285F4]/20"
                                        >
                                            {googleConnecting ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.488 0-6.32-2.832-6.32-6.32s2.832-6.32 6.32-6.32c1.616 0 3.084.61 4.217 1.616l3.155-3.155C19.106 2.233 15.938 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.898 0 10.97-4.225 10.97-11.24 0-.712-.068-1.398-.198-1.955H12.24z"/></svg>
                                            )}
                                            {googleConnecting ? "Connecting Account..." : "Connect Google Account"}
                                        </button>
                                    </>
                                ) : importingReviews ? (
                                    <>
                                        <div className="w-14 h-14 rounded-full border-2 border-primary border-t-transparent animate-spin flex items-center justify-center mb-4" />
                                        <h3 className="text-base font-bold text-white mb-1.5">Importing Google Reviews...</h3>
                                        <p className="text-xs text-muted-foreground max-w-sm">Syncing latest ratings from <strong>{selectedGoogleLoc}</strong>. Loaded {importedCount} of 5 reviews.</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400 animate-pulse">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-base font-bold text-white mb-1">Google Listing Linked!</h3>
                                        <p className="text-xs text-muted-foreground mb-1">Imported reviews successfully. Linked branch:</p>
                                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{selectedGoogleLoc}</span>
                                    </>
                                )}
                            </div>

                            <div className="pt-8 flex justify-between">
                                <button type="button" onClick={prevStep} className="px-5 py-2.5 rounded-xl bg-secondary/50 text-foreground font-semibold text-sm">
                                    Back
                                </button>
                                <button 
                                    type="button" onClick={nextStep} disabled={!googleConnected}
                                    className="px-5 py-2.5 rounded-xl btn-primary text-white font-semibold text-sm flex items-center gap-2 disabled:opacity-50"
                                >
                                    Next Step <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: REVIEW REQUEST CONFIGURATION */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Configure Invitation Campaigns</h2>
                                <p className="text-sm text-muted-foreground">Setup default message structures. We render a live preview on a mobile card viewport.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                {/* Copy Edit */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email Subject Line</label>
                                        <input 
                                            value={campaignForm.emailSubject} 
                                            onChange={e => setCampaignForm(c => ({ ...c, emailSubject: e.target.value }))}
                                            className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-foreground text-sm focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email Message Body</label>
                                        <textarea 
                                            value={campaignForm.emailBody} 
                                            onChange={e => setCampaignForm(c => ({ ...c, emailBody: e.target.value }))}
                                            rows={4}
                                            className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-foreground text-sm focus:outline-none resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">SMS Message Body</label>
                                        <textarea 
                                            value={campaignForm.smsBody} 
                                            onChange={e => setCampaignForm(c => ({ ...c, smsBody: e.target.value }))}
                                            rows={2}
                                            className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-foreground text-sm focus:outline-none resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Preview Frame */}
                                <div className="flex justify-center">
                                    <div className="w-[280px] h-[360px] rounded-3xl bg-black border-4 border-neutral-800 p-4 shadow-xl relative overflow-hidden flex flex-col justify-between select-none">
                                        <div className="h-4 w-28 bg-neutral-800 rounded-full mx-auto mb-3 absolute top-1.5 left-1/2 -translate-x-1/2" />
                                        
                                        <div className="flex-1 mt-4 overflow-y-auto space-y-3">
                                            {/* Preview Message */}
                                            <div className="bg-secondary/40 border border-border/20 rounded-2xl p-3 text-[10px] text-muted-foreground leading-relaxed">
                                                <div className="flex items-center gap-1 text-[11px] font-bold text-white mb-1">
                                                    <Mail className="w-3.5 h-3.5 text-primary" /> Email Invite
                                                </div>
                                                <div className="border-b border-border/20 pb-1 mb-1 font-bold text-white">
                                                    Subj: {campaignForm.emailSubject.replace("{{BUSINESS_NAME}}", biz.name)}
                                                </div>
                                                <p>{campaignForm.emailBody}</p>
                                                <div className="mt-3 py-1.5 bg-primary/20 border border-primary/30 rounded-lg text-center text-primary font-bold text-[9px]">
                                                    Leave a Review
                                                </div>
                                            </div>

                                            <div className="bg-neutral-900 border border-border/10 rounded-2xl p-3 text-[10px] text-muted-foreground leading-relaxed">
                                                <div className="flex items-center gap-1 text-[11px] font-bold text-white mb-1">
                                                    <Smartphone className="w-3.5 h-3.5 text-primary" /> SMS Invite
                                                </div>
                                                <p>{campaignForm.smsBody}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 flex justify-between">
                                <button type="button" onClick={prevStep} className="px-5 py-2.5 rounded-xl bg-secondary/50 text-foreground font-semibold text-sm">
                                    Back
                                </button>
                                <button 
                                    type="button" onClick={saveStep4}
                                    className="px-5 py-2.5 rounded-xl btn-primary text-white font-semibold text-sm flex items-center gap-2"
                                >
                                    Save Outreach <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 5: AI AUTO-REPLY PREFERENCES */}
                    {currentStep === 5 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Configure AI Reply preferences</h2>
                                <p className="text-sm text-muted-foreground">Select response tones, write custom guidelines, and run a simulator draft reply to complete activation.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                {/* Config */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Response Tone Preset</label>
                                        <select 
                                            value={aiForm.tone} 
                                            onChange={e => setAiForm(a => ({ ...a, tone: e.target.value }))}
                                            className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-foreground text-sm focus:outline-none"
                                        >
                                            <option value="friendly">😊 Friendly</option>
                                            <option value="professional">💼 Professional</option>
                                            <option value="luxury">✨ Luxury & Sophisticated</option>
                                            <option value="healthcare">🩺 Healthcare & Empathetic</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Custom Brand Voice Prompt / Guidelines</label>
                                        <textarea 
                                            value={aiForm.brandVoice} 
                                            onChange={e => setAiForm(a => ({ ...a, brandVoice: e.target.value }))}
                                            rows={3}
                                            className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-foreground text-sm focus:outline-none resize-none"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/20">
                                        <div>
                                            <p className="text-xs font-bold text-white">Auto-Publish Replies</p>
                                            <p className="text-[10px] text-muted-foreground">Publish reviews without manual click approval</p>
                                        </div>
                                        <input 
                                            type="checkbox" checked={aiForm.autoApprove}
                                            onChange={e => setAiForm(a => ({ ...a, autoApprove: e.target.checked }))}
                                            className="w-4 h-4 accent-primary"
                                        />
                                    </div>
                                </div>

                                {/* Simulation test */}
                                <div className="glass-card rounded-2xl p-4 border border-border/20 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Test Simulator Review</span>
                                        <span className="flex gap-0.5">
                                            {[1, 2, 3, 4].map(i => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-foreground italic">"Good atmosphere and quality menu options. A bit pricey but worth it." · Maria G.</p>
                                    
                                    <button 
                                        type="button" onClick={generateAITestReply} disabled={aiGenerating || aiApproved}
                                        className="w-full py-2 rounded-xl bg-primary/20 border border-primary/30 hover:bg-primary/30 text-primary text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                                    >
                                        {aiGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                                        Generate AI Reply
                                    </button>

                                    {aiResponseText && (
                                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-xs text-muted-foreground animate-fadeIn">
                                            <p className="font-semibold text-white text-[10px] mb-1">Suggested draft ({aiForm.tone}):</p>
                                            <p className="leading-relaxed">{aiResponseText}</p>
                                            
                                            {!aiApproved ? (
                                                <button 
                                                    type="button" onClick={approveAITestReply}
                                                    className="mt-3 w-full py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Publish Draft
                                                </button>
                                            ) : (
                                                <div className="mt-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold text-center">
                                                    ✓ First AI Reply Published!
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-8 flex justify-between">
                                <button type="button" onClick={prevStep} className="px-5 py-2.5 rounded-xl bg-secondary/50 text-foreground font-semibold text-sm">
                                    Back
                                </button>
                                <button 
                                    type="button" onClick={nextStep} disabled={!aiApproved}
                                    className="px-5 py-2.5 rounded-xl btn-primary text-white font-semibold text-sm flex items-center gap-2 disabled:opacity-50"
                                >
                                    Next Step <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 6: TEAM INVITATIONS */}
                    {currentStep === 6 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Invite your Team Members</h2>
                                <p className="text-sm text-muted-foreground">Add colleagues, local branch managers, or read-only supervisors to build a collaborative feedback workflow.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                {/* Form */}
                                <form onSubmit={addTeamMember} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email Address</label>
                                        <input 
                                            type="email" value={inviteEmail} 
                                            onChange={e => setInviteEmail(e.target.value)}
                                            placeholder="manager@mybusiness.com"
                                            className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-foreground text-sm focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Permission Role</label>
                                        <select 
                                            value={inviteRole} 
                                            onChange={e => setInviteRole(e.target.value)}
                                            className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-foreground text-sm focus:outline-none"
                                        >
                                            <option value="manager">💼 Location Manager (Assign & Reply)</option>
                                            <option value="staff">👤 Staff Member (Assign & Flag)</option>
                                            <option value="readonly">👁️ Read-Only Viewer (View Analytics)</option>
                                        </select>
                                    </div>
                                    <button 
                                        type="submit" disabled={!inviteEmail}
                                        className="w-full py-2.5 bg-primary/20 border border-primary/30 hover:bg-primary/30 text-primary rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                                    >
                                        <Send className="w-3.5 h-3.5" /> Send Simulated Invitation
                                    </button>
                                </form>

                                {/* List */}
                                <div className="bg-secondary/10 border border-border/20 rounded-2xl p-5 min-h-[160px] space-y-3">
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Simulated Invites List ({teamInvites.length})</h4>
                                    {teamInvites.length === 0 ? (
                                        <p className="text-xs text-muted-foreground text-center py-6">No invitations sent yet. Skip this step if you'd like to invite team members later.</p>
                                    ) : (
                                        <div className="space-y-2 max-h-[150px] overflow-y-auto">
                                            {teamInvites.map((member, i) => (
                                                <div key={i} className="flex items-center justify-between p-2 bg-secondary/20 border border-border/10 rounded-lg text-xs">
                                                    <div>
                                                        <p className="text-white font-medium">{member.email}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase">{member.role}</p>
                                                    </div>
                                                    <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">Pending</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-8 flex justify-between">
                                <button type="button" onClick={prevStep} className="px-5 py-2.5 rounded-xl bg-secondary/50 text-foreground font-semibold text-sm">
                                    Back
                                </button>
                                <button 
                                    type="button" onClick={nextStep}
                                    className="px-5 py-2.5 rounded-xl btn-primary text-white font-semibold text-sm flex items-center gap-2"
                                >
                                    Skip/Next <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 7: CONGRATULATIONS & DASHBOARD LAUNCH */}
                    {currentStep === 7 && (
                        <div className="space-y-6 text-center max-w-xl mx-auto py-4">
                            <div className="text-6xl mb-4">🚀</div>
                            <h2 className="text-3xl font-bold text-white mb-2 font-display">Onboarding Completed!</h2>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-6">
                                Congratulations! You have connected your channels, drafted request campaigns, configured response presets, and simulated invitations. You are fully ready to take control of your reputation.
                            </p>

                            <div className="bg-secondary/20 border border-border/20 rounded-2xl p-5 text-left space-y-3 mb-8">
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Onboarding Checklist Verification</h4>
                                <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        <span>Setup Wizard Complete</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {googleConnected ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        ) : (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> /* Force mock pass */
                                        )}
                                        <span>Google Business Connection</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        <span>Outreach Campaign Configured</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        <span>AI Replies Previews Enabled</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={completeOnboarding} disabled={loading}
                                className="w-full max-w-sm mx-auto py-3.5 rounded-xl btn-primary text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                            >
                                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                                {loading ? "Launching Workspace..." : "Go to Reputation Dashboard"}
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* Simulated Google Account Selection Modal */}
            {showGoogleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="glass-card rounded-2xl border border-border/50 p-6 w-full max-w-md shadow-2xl relative">
                        <div className="text-center mb-6">
                            <span className="text-2xl">🔑</span>
                            <h3 className="text-lg font-bold text-white mt-2">Sign in with Google</h3>
                            <p className="text-xs text-muted-foreground">Select an account to authorize ReviewManagement</p>
                        </div>
                        <div className="space-y-2">
                            {googleAccounts.map((account, i) => (
                                <button 
                                    key={i} onClick={() => confirmGoogleSelect(account)}
                                    className="w-full p-3 bg-secondary/30 hover:bg-secondary/50 border border-border/10 hover:border-primary/30 rounded-xl text-left text-xs font-bold text-white transition-all flex items-center justify-between group"
                                >
                                    <span>{account}</span>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
