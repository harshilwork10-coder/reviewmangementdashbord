"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { 
    addBusiness, addLocation, addReview, addCampaign, addAuditLog, 
    Business, Location, Review, getBusinesses 
} from "@/lib/store";
import { 
    ArrowLeft, ArrowRight, Check, Building2, MapPin, Globe, Sparkles, 
    Send, Database, RefreshCw, Smartphone, Mail, Settings 
} from "lucide-react";

export default function ClientOnboardingPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);

    // Step 1: Client Profile Details
    const [clientName, setClientName] = useState("");
    const [clientCategory, setClientCategory] = useState("Restaurant");
    const [clientAddress, setClientAddress] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [clientWebsite, setClientWebsite] = useState("");
    const [clientLogo, setClientLogo] = useState("🏢");

    // Step 2: Add Location Details
    const [locName, setLocName] = useState("");
    const [locAddress, setLocAddress] = useState("");

    // Step 3: Connect Google GBP
    const [selectedGbpEntity, setSelectedGbpEntity] = useState("");
    const [gbpConnected, setGbpConnected] = useState(false);

    // Step 4: Import Reviews
    const [importing, setImporting] = useState(false);
    const [importFinished, setImportFinished] = useState(false);
    const [importedCount, setImportedCount] = useState(0);

    // Step 5: Configure Invite Requests
    const [smsTemplate, setSmsTemplate] = useState("Thanks for visiting [BUSINESS_NAME]! We would love your feedback: [REVIEW_LINK]");
    const [emailSubject, setEmailSubject] = useState("How was your experience at [BUSINESS_NAME]?");
    const [emailTemplate, setEmailTemplate] = useState("Dear Customer, thank you for choosing us. We would appreciate it if you could take 60 seconds to review your experience.");

    // Step 6: AI Auto Replies
    const [aiRepliesEnabled, setAiRepliesEnabled] = useState(false);
    const [defaultTone, setDefaultTone] = useState("friendly");

    // Intermediate created objects
    const [createdBiz, setCreatedBiz] = useState<Business | null>(null);

    const handleNext = async () => {
        if (!user || !user.agencyId) return;

        if (currentStep === 1) {
            if (!clientName.trim() || !clientAddress.trim()) {
                alert("Please fill in Client Name and Address");
                return;
            }
            // Generate unique slug
            const slug = clientName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            
            // Check if slug exists, append random if needed
            const existing = getBusinesses().find(b => b.slug === slug);
            const finalSlug = existing ? `${slug}-${Math.floor(Math.random() * 1000)}` : slug;

            const biz = addBusiness({
                name: clientName,
                slug: finalSlug,
                category: clientCategory,
                description: `Reputation profile for ${clientName}`,
                phone: clientPhone || "(555) 000-0000",
                website: clientWebsite || "https://example.com",
                address: clientAddress,
                logo: clientLogo,
                ownerId: user.id,
                subscriptionPlan: "starter",
                agencyId: user.agencyId
            });

            setCreatedBiz(biz);
            setLocName(clientName + " - Main Location");
            setLocAddress(clientAddress);
            setCurrentStep(2);
        } else if (currentStep === 2) {
            if (!createdBiz) return;
            if (!locName.trim() || !locAddress.trim()) {
                alert("Please fill in Location Name and Address");
                return;
            }
            addLocation({
                businessId: createdBiz.id,
                name: locName,
                address: locAddress
            });
            setCurrentStep(3);
        } else if (currentStep === 3) {
            if (!gbpConnected) {
                alert("Please select a GBP Entity and click 'Connect Entity'");
                return;
            }
            setCurrentStep(4);
        } else if (currentStep === 4) {
            if (!importFinished) {
                alert("Please run the review importer first");
                return;
            }
            setCurrentStep(5);
        } else if (currentStep === 5) {
            if (!createdBiz) return;
            // Add inviter campaigns
            addCampaign({
                businessId: createdBiz.id,
                name: "Standard Onboarding SMS",
                channel: "sms",
                templateBody: smsTemplate,
                sendDelayHours: 2,
                isActive: true
            });
            addCampaign({
                businessId: createdBiz.id,
                name: "Standard Onboarding Email",
                channel: "email",
                templateSubject: emailSubject,
                templateBody: emailTemplate,
                sendDelayHours: 24,
                isActive: true
            });
            setCurrentStep(6);
        } else if (currentStep === 6) {
            if (!createdBiz) return;
            // Configure AI reply options
            // We can store flag rules or write configurations
            if (aiRepliesEnabled) {
                // Mock toggle flag in store
                try {
                    const flags = JSON.parse(localStorage.getItem("rms_feature_flags") || "[]");
                    const aiAutoIdx = flags.findIndex((f: any) => f.key === "ai-auto-approve");
                    if (aiAutoIdx >= 0) {
                        flags[aiAutoIdx].targetOrgs.push(createdBiz.id);
                        localStorage.setItem("rms_feature_flags", JSON.stringify(flags));
                    }
                } catch { /* ignore */ }
            }
            addAuditLog("Onboarding Completed", createdBiz.id, undefined, { steps: 6 });
            router.push("/agency/clients");
        }
    };

    const handleGbpConnect = () => {
        if (!selectedGbpEntity) {
            alert("Please select a GBP entity to link");
            return;
        }
        setGbpConnected(true);
    };

    const handleImportReviews = () => {
        if (!createdBiz) return;
        setImporting(true);
        
        // Simulate importing reviews in steps
        setTimeout(() => {
            // Seed 4 initial reviews for the client
            addReview({
                businessId: createdBiz.id,
                customerName: "Jane Doe",
                customerEmail: "jane@doe.com",
                rating: 5,
                text: "Wonderful customer service! We loved the atmosphere and the responsiveness of the management team.",
                source: "Google"
            });
            setImportedCount(1);
        }, 1000);

        setTimeout(() => {
            addReview({
                businessId: createdBiz.id,
                customerName: "Robert Miller",
                rating: 4,
                text: "Clean, professional setup and friendly staff. Highly recommend giving this place a visit.",
                source: "Google"
            });
            setImportedCount(2);
        }, 2000);

        setTimeout(() => {
            addReview({
                businessId: createdBiz.id,
                customerName: "Arthur Pendelton",
                rating: 2,
                text: "Services were adequate but the wait times were frustratingly long. Hope they improve scheduling.",
                source: "Google"
            });
            setImportedCount(3);
        }, 3200);

        setTimeout(() => {
            addReview({
                businessId: createdBiz.id,
                customerName: "Clara Oswald",
                rating: 5,
                text: "Perfect experience. Absolutely flawless attention to detail. Will definitely recommend to friends!",
                source: "Google"
            });
            setImportedCount(4);
            setImporting(false);
            setImportFinished(true);
        }, 4500);
    };

    const stepHeaders = [
        { title: "Brand Profile", desc: "Basic company metadata details" },
        { title: "Manage Locations", desc: "Register physical branch addresses" },
        { title: "Connect Google GBP", desc: "Authorize API review integrations" },
        { title: "Import History", desc: "Retrieve past reputational listings" },
        { title: "Configure Invitations", desc: "Setup Email & SMS follow-ups" },
        { title: "Enable AI Replies", desc: "Set automatic response tone controls" }
    ];

    return (
        <div className="h-screen overflow-y-auto p-8 bg-background flex flex-col items-center">
            {/* Back Shortcut */}
            <div className="w-full max-w-2xl mb-6">
                <button onClick={() => router.push("/agency/clients")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Cancel Onboarding
                </button>
            </div>

            {/* Stepper Progress bar */}
            <div className="w-full max-w-2xl glass-card rounded-2xl p-6 border border-border/60 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">Step {currentStep} of 6</span>
                        <h2 className="text-base font-bold text-white leading-tight">{stepHeaders[currentStep-1].title}</h2>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{stepHeaders[currentStep-1].desc}</p>
                    </div>
                </div>
                
                {/* Visual steps track */}
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6].map(step => (
                        <div key={step} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            step < currentStep ? "bg-primary" :
                            step === currentStep ? "bg-primary shadow-[0_0_8px_rgba(239,68,68,0.3)] animate-pulse" :
                            "bg-secondary/60"
                        }`} />
                    ))}
                </div>
            </div>

            {/* Form Panels */}
            <div className="w-full max-w-2xl glass-card rounded-2xl p-6 border border-border/60 min-h-[350px] flex flex-col justify-between">
                <div className="space-y-4">
                    {currentStep === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Brand/Client Name</label>
                                <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. Acme Coffee Co."
                                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Industry Category</label>
                                <select value={clientCategory} onChange={e => setClientCategory(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none focus:border-primary">
                                    <option value="Restaurant">Restaurant / Bistro</option>
                                    <option value="Clinic">Medical Clinic</option>
                                    <option value="Liquor Store">Beverage / Liquor Store</option>
                                    <option value="Retail">Retail Store</option>
                                    <option value="Hotel">Hotel / Hospitality</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Headquarters Address</label>
                                <input value={clientAddress} onChange={e => setClientAddress(e.target.value)} placeholder="e.g. 123 Main St, Chicago, IL"
                                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Website URL</label>
                                <input value={clientWebsite} onChange={e => setClientWebsite(e.target.value)} placeholder="e.g. https://acmecoffee.com"
                                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Phone Number</label>
                                <input value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="e.g. (312) 555-0100"
                                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Logo Avatar Emoji</label>
                                <input value={clientLogo} onChange={e => setClientLogo(e.target.value)} placeholder="e.g. ☕"
                                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white text-center focus:outline-none focus:border-primary text-xl" />
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-4 text-xs">
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 flex items-start gap-2.5 mb-2">
                                <InfoIcon className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                    Every brand requires at least one registered location to track reviews and launch campaigns. You can add additional locations in Settings later.
                                </p>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Primary Location Name</label>
                                <input value={locName} onChange={e => setLocName(e.target.value)} placeholder="e.g. Downtown Chicago Coffeehouse"
                                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Location Physical Address</label>
                                <input value={locAddress} onChange={e => setLocAddress(e.target.value)} placeholder="e.g. 123 N Clark St, Chicago, IL"
                                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-white focus:outline-none focus:border-primary" />
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-5 text-xs">
                            <div className="p-5 rounded-2xl bg-secondary/25 border border-border/40 text-center space-y-4">
                                <Building2 className="w-12 h-12 text-primary mx-auto animate-pulse" />
                                <div>
                                    <h3 className="font-bold text-white text-sm mb-1">Google Business API Connection Simulator</h3>
                                    <p className="text-[11px] text-muted-foreground">Select a business profile entity discovered in Google Cloud GBP directory</p>
                                </div>
                                <div className="flex gap-2 justify-center max-w-sm mx-auto">
                                    <select value={selectedGbpEntity} onChange={e => setSelectedGbpEntity(e.target.value)}
                                        className="flex-1 px-3 py-2 rounded-xl bg-secondary border border-border text-xs text-white focus:outline-none">
                                        <option value="">-- Discovered Profiles --</option>
                                        <option value="acme-coffee-chicago">Acme Coffee - Chicago Loop</option>
                                        <option value="acme-coffee-hq">Acme Coffee Group HQ</option>
                                    </select>
                                    <button type="button" onClick={handleGbpConnect} disabled={gbpConnected}
                                        className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold transition-all disabled:opacity-50 text-xs shrink-0">
                                        {gbpConnected ? "Connected ✓" : "Connect Entity"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-5 text-xs">
                            <div className="p-5 rounded-2xl bg-secondary/25 border border-border/40 text-center space-y-4">
                                <Database className="w-12 h-12 text-primary mx-auto" />
                                <div>
                                    <h3 className="font-bold text-white text-sm mb-1">Import Historic Reviews</h3>
                                    <p className="text-[11px] text-muted-foreground">Pull previous customer reviews history directly from connected GBP entity.</p>
                                </div>
                                
                                {importing ? (
                                    <div className="space-y-2 max-w-xs mx-auto">
                                        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
                                        <p className="text-[11px] text-primary font-semibold">Importing review {importedCount} of 4...</p>
                                    </div>
                                ) : importFinished ? (
                                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 font-bold max-w-xs mx-auto flex items-center justify-center gap-1.5">
                                        <Check className="w-4 h-4" /> 4 reviews imported successfully!
                                    </div>
                                ) : (
                                    <button type="button" onClick={handleImportReviews}
                                        className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold transition-all text-xs shadow-md shadow-primary/10">
                                        Run Review Importer
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="space-y-4 text-xs">
                            <div className="p-3.5 rounded-xl bg-secondary/15 border border-border/40 space-y-3">
                                <h4 className="font-bold text-white flex items-center gap-1.5"><Mail className="w-4 h-4 text-primary" /> Email Invite Template</h4>
                                <div>
                                    <label className="text-[9px] text-muted-foreground font-semibold mb-1 block">Subject Header</label>
                                    <input value={emailSubject} onChange={e => setEmailSubject(e.target.value)}
                                        className="w-full px-3.5 py-2 rounded-xl bg-secondary/40 border border-border text-white text-xs focus:outline-none" />
                                </div>
                                <div>
                                    <label className="text-[9px] text-muted-foreground font-semibold mb-1 block">Body Message Content</label>
                                    <textarea value={emailTemplate} onChange={e => setEmailTemplate(e.target.value)} rows={3}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/40 border border-border text-white text-xs focus:outline-none resize-none" />
                                </div>
                            </div>

                            <div className="p-3.5 rounded-xl bg-secondary/15 border border-border/40 space-y-2">
                                <h4 className="font-bold text-white flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-primary" /> SMS Template</h4>
                                <textarea value={smsTemplate} onChange={e => setSmsTemplate(e.target.value)} rows={2}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/40 border border-border text-white text-xs focus:outline-none resize-none" />
                            </div>
                        </div>
                    )}

                    {currentStep === 6 && (
                        <div className="space-y-5 text-xs">
                            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15 flex items-start gap-2.5">
                                <Sparkles className="w-4.5 h-4.5 text-purple-400 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-white mb-0.5">OpenAI GPT Auto Reply Autopilot</h4>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                        Optionally enable auto-reply drafts. AI replies will be generated immediately when new reviews arrive.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/15 border border-border/30">
                                <div>
                                    <span className="font-bold text-white block">Auto Draft Generation</span>
                                    <span className="text-[10px] text-muted-foreground">Automatically construct answers for review manager approvals.</span>
                                </div>
                                <button onClick={() => setAiRepliesEnabled(!aiRepliesEnabled)}
                                    className={`w-12 h-6.5 rounded-full p-1 transition-colors flex items-center ${
                                        aiRepliesEnabled ? "bg-primary justify-end" : "bg-secondary border border-border justify-start"
                                    }`}>
                                    <div className="w-4.5 h-4.5 rounded-full bg-white shadow-md" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase block">Default Reply Tone</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {["friendly", "professional", "apologetic"].map(tone => (
                                        <button key={tone} type="button" onClick={() => setDefaultTone(tone)}
                                            className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                                                defaultTone === tone 
                                                    ? "bg-purple-500/10 border-purple-500/30 text-purple-400" 
                                                    : "bg-secondary/35 border-border text-muted-foreground hover:bg-secondary/50 hover:text-white"
                                            }`}>
                                            {tone}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-border/20 mt-6">
                    <button type="button" onClick={() => currentStep > 1 && setCurrentStep(currentStep-1)} disabled={currentStep === 1}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs bg-secondary border border-border text-muted-foreground hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button type="button" onClick={handleNext}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs btn-primary text-white font-bold transition-all shadow-md shadow-primary/10">
                        {currentStep === 6 ? "Finish Onboarding" : "Continue"} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Help widget
function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
    );
}
