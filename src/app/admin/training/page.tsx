"use client";

import { useState } from "react";
import { 
  BookOpen, 
  Target, 
  Play, 
  ChevronRight, 
  HelpCircle, 
  ShieldAlert, 
  Coins, 
  Sparkles, 
  CheckCircle,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  Copy,
  Check,
  Calendar,
  Layers,
  Users
} from "lucide-react";

interface DemoStep {
  time: string;
  title: string;
  objective: string;
  points: string[];
  tips: string;
}

interface ProposalTemplate {
  title: string;
  description: string;
  valueProps: string[];
  structure: string[];
  copyContent: string;
}

export default function SalesTrainingPage() {
  // Global Tabs
  const [globalTab, setGlobalTab] = useState<"demo" | "proposals" | "competitors">("demo");

  // Demo Tab States
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedObjection, setSelectedObjection] = useState<number | null>(null);
  const [extraReviews, setExtraReviews] = useState<number>(20);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(100);

  // Proposal Tab States
  const [selectedProposal, setSelectedProposal] = useState<"smb" | "agency" | "enterprise">("smb");
  const [copied, setCopied] = useState<boolean>(false);

  // Competitor Tab States
  const [selectedCompetitor, setSelectedCompetitor] = useState<"podium" | "birdeye" | "nicejob" | "grade.us">("podium");
  const [battleCardCopied, setBattleCardCopied] = useState<boolean>(false);

  const competitorsData = {
    podium: {
      name: "Podium",
      position: "SMB Customer Messaging Focus",
      pricing: "$249 - $599/mo (Premium)",
      strengths: "Broad customer contact channels, SMS lead capture, unified messaging hub.",
      weaknesses: "Very expensive, requires long-term annual contracts, no reseller white-labeling.",
      killPoint: "Podium locks small businesses into rigid $3,000+ annual contracts and ignores marketing agency reseller opportunities. We offer month-to-month contracts and complete white-label agency branding starting at $49/mo.",
      script: "Podium is a strong messaging platform, but they charge premium enterprise rates (starting at $249/mo) and lock you into annual commitments. ReviewManagement does automated review collection, SMS requests, and tone-specific AI replies for just $49/mo with absolute monthly flexibility. We save you over $2,400 a year for the same core review outcomes."
    },
    birdeye: {
      name: "Birdeye",
      position: "Enterprise Reputation Management",
      pricing: "$350+/mo (Standard)",
      strengths: "Enterprise compliance, review monitoring, advanced ticketing.",
      weaknesses: "Hidden setup fees, slow and complex onboarding, overkill for simple SMBs.",
      killPoint: "Birdeye forces small merchants through weeks of consultative sales calls and setups, charging high hidden fees. ReviewManagement is self-serve, activates in 15 minutes, and delivers standard review automation at a fraction of the cost.",
      script: "Birdeye has great enterprise tools, but they come with high entry pricing (typically $350+/mo) and complex onboarding setups. ReviewManagement gives you clean reviews automation, Google profile linking, and custom AI responses for just $99/mo on our Growth plan. You can self-onboard and go live in 15 minutes, avoiding high setup costs."
    },
    nicejob: {
      name: "NiceJob",
      position: "Simple Collection for Home Services",
      pricing: "$75 - $175/mo",
      strengths: "Simple automation loops, good SMS delivery, home services popularity.",
      weaknesses: "No multi-location reporting hierarchy, lacks agency reseller capabilities or whitelabel support.",
      killPoint: "NiceJob lacks reseller portals or white-label customization. If you are an agency managing multiple accounts or a multi-location brand, NiceJob cannot scale under your brand name.",
      script: "NiceJob works well for single home service providers, but it doesn't support white-label branding or multi-client dashboards for marketing agencies. ReviewManagement is agency-first. Our Agency plan lets you rebrand the system under your logo and manage up to 10 clients from one centralized dashboard for just $299/mo, giving you a huge margin reseller asset."
    },
    "grade.us": {
      name: "Grade.us",
      position: "Agency-Focused Whitelabel Platform",
      pricing: "$180 - $350/mo",
      strengths: "Decent agency dashboard white-labeling.",
      weaknesses: "Steep learning curve, nested menus, lack of modern tone-based AI replying.",
      killPoint: "Grade.us has a dated interface and a steep learning curve. It also lacks modern generative AI responses, leaving clients to copy-paste pre-saved template snippets manually.",
      script: "Grade.us supports whitelabeling, but its user interface is dated and difficult for local business clients to learn without hand-holding. ReviewManagement is simple, visual, and modern. Plus, we feature an integrated AI Reply Engine that auto-drafts replies in 4 distinct tones—something Grade.us's manual template shortcuts can't match."
    }
  };

  const handleCopyScript = (text: string) => {
    navigator.clipboard.writeText(text);
    setBattleCardCopied(true);
    setTimeout(() => setBattleCardCopied(false), 2000);
  };

  const demoSteps: DemoStep[] = [
    {
      time: "Pre-Demo",
      title: "Preparation & Research",
      objective: "Gather intelligence before getting on the call to tailor the pitch.",
      points: [
        "Research the prospect's business structure and target audience.",
        "Review their current online profiles (Google Maps, Yelp, TripAdvisor).",
        "Identify exact gaps (e.g., low volume, unanswered reviews, competitor gaps).",
        "Prepare relevant vertical-specific case studies (e.g., medical vs. restaurant)."
      ],
      tips: "Knowing their current star rating shows you've done your homework. Use it as the anchor for the conversation."
    },
    {
      time: "2 Minutes",
      title: "Opening & Agenda",
      objective: "Introduce yourself, establish rapport, and align on goals.",
      points: [
        "Introduce yourself and ReviewManagement (built by Openrize).",
        "Confirm their business objectives for this call.",
        "Set a clear agenda for the 15-minute demonstration.",
        "Ask a crucial alignment question: 'What does a successful demo look like to you today?'"
      ],
      tips: "Establish a consultative tone immediately. You are a partner in their growth, not just a software salesperson."
    },
    {
      time: "3 Minutes",
      title: "Discovery Questions",
      objective: "Uncover pain points and establish the revenue gap.",
      points: [
        "How do you currently request reviews from customers?",
        "How many reviews do you generate monthly right now?",
        "What directory platforms (Google, Yelp, etc.) matter most to your business?",
        "What major challenges are you facing managing your online presence?",
        "What would an extra 20 positive reviews per month mean for your conversion rate?"
      ],
      tips: "Listen more than you talk. Take notes on the specific platforms they mention, and reference them during the walkthrough."
    },
    {
      time: "2 Minutes",
      title: "Product Overview",
      objective: "Introduce ReviewManagement core value proposition.",
      points: [
        "Explain ReviewManagement as a simple, automated reputation growth engine.",
        "Highlight the automation layer (email, SMS, templates) that removes manual burden.",
        "Highlight centralized monitoring, reporting, and dashboard capabilities.",
        "Emphasize the business outcomes: visibility, customer trust, and SEO rankings."
      ],
      tips: "Focus on outcomes (time saved, reviews generated) rather than feature checkboxes."
    },
    {
      time: "6 Minutes",
      title: "Live Product Walkthrough",
      objective: "Show the software in action to prove how simple it is.",
      points: [
        "Create a Campaign: Show how easy it is to customize an email/SMS request template.",
        "Import Customers: Demonstrate drag-and-drop contact CSV upload.",
        "Send Requests: Show the instant trigger of a sample review invite.",
        "Tracking Dashboard: View the feed of live, synced incoming reviews.",
        "Review Analytics: Display rating growth and platform metrics.",
        "Agency Features: Switch profiles to show multi-client accounts if pitching an agency."
      ],
      tips: "Keep it simple. Do not get bogged down in granular settings unless they ask. Show, don't tell, the simplicity."
    },
    {
      time: "2 Minutes",
      title: "ROI Conversation",
      objective: "Connect reputation improvements directly to revenue.",
      points: [
        "Estimate monthly review growth based on customer transaction volume.",
        "Explain how star ratings and fresh review volume impact local Maps SEO.",
        "Discuss trust and conversion rates (90%+ of users read reviews before buying).",
        "Quantify the value of reviews using our business-specific math."
      ],
      tips: "Use the interactive calculator below to show them how a small conversion lift pays for the software instantly."
    },
    {
      time: "2 Minutes",
      title: "Objection Handling",
      objective: "Resolve friction and clear hurdles for trial signup.",
      points: [
        "Address budget concerns by comparing RM's price ($49-$99) to Podium ($400+).",
        "Address time concerns by showing that setup takes under 15 minutes.",
        "Position against current manual methods by emphasizing automation and consistency.",
        "Answer questions about team adoption by highlighting self-serve ease."
      ],
      tips: "Expect objections. Treat them as requests for more information, and reference Podium/Birdeye price comparison."
    },
    {
      time: "2 Minutes",
      title: "Closing & Next Steps",
      objective: "Guide the prospect to trial or contract signoff.",
      points: [
        "Recommend the best plan (Starter, Growth, or Agency) based on discovery.",
        "Offer the risk-free trial (no credit card required) or guided onboarding.",
        "Define clear next steps: profile setup and linking Google Business.",
        "Schedule a follow-up check-in call in 7 days."
      ],
      tips: "Always secure a micro-commitment. Getting them registered for the trial during the demo is the ultimate success."
    }
  ];

  const objections = [
    {
      title: "Budget / Price Concerns",
      quote: "We don't have the budget right now for this software.",
      answer: "Position ReviewManagement as an investment that pays for itself. Show that at $49/mo, generating even 1 additional customer per month results in a 100%+ ROI. Highlight that Podium/Birdeye charge $300-$500/mo for similar features."
    },
    {
      title: "Time / Setup Concerns",
      quote: "My staff is already busy. We don't have time to manage another tool.",
      answer: "Emphasize that the platform is built for complete automation. Setup takes under 15 minutes. Once campaigns are configured, reviews are requested automatically via email/SMS without employee intervention."
    },
    {
      title: "Current Provider Concerns",
      quote: "We are already using Podium or sending emails manually.",
      answer: "If Podium: highlight the huge cost savings (save up to 80% with RM). If manual: show the massive bump in response rates when switching from manual copy-paste to automated SMS requests."
    },
    {
      title: "Customer Adoption Concerns",
      quote: "I don't think our customers will fill out these requests.",
      answer: "Explain that we use optimized, frictionless single-click templates. SMS requests have a 98% open rate and a 4-5x higher review conversion rate compared to verbal requests."
    }
  ];

  const proposalTemplates: Record<"smb" | "agency" | "enterprise", ProposalTemplate> = {
    smb: {
      title: "Small Business Proposal Template",
      description: "Tailored for single-location local retail, clinics, or home services clients.",
      valueProps: [
        "Increase review volume.",
        "Improve local SEO.",
        "Generate more customer trust.",
        "Automate manual review requests."
      ],
      structure: [
        "Executive Summary",
        "Current Reputation Challenges",
        "Recommended ReviewManagement Plan (Starter/Growth)",
        "Implementation Timeline (Under 15-minute setup)",
        "Pricing and Billing ($49 - $99/mo + annual incentives)",
        "Expected Outcomes",
        "Next Steps"
      ],
      copyContent: `CLIENT PROPOSAL: SMALL BUSINESS REPUTATION EXPANSION
==================================================
1. EXECUTIVE SUMMARY
We help local businesses automate the generation of positive reviews, increase customer trust, and drive new inbound traffic from local searches.

2. CURRENT REPUTATION CHALLENGES
- Inconsistent reviews collection from happy customers.
- Low local SEO visibility due to lack of fresh ratings.
- Time consuming manual review followups.

3. RECOMMENDED REVIEWMANAGEMENT PLAN
[ ] Starter Plan ($49/mo) / [ ] Growth Plan ($99/mo)
- Automated email and SMS campaign requests.
- Single-click templates and unified review monitoring inbox.

4. IMPLEMENTATION TIMELINE
- Day 1: Account setup and linking Google Business profile.
- Day 1: Automated SMS/Email template design customization.
- Day 2: First review invitations triggered.

5. PRICING AND BILLING
- Growth Subscription: $99/mo (or $82/mo billed annually)
- Guided Setup Support (Optional): $199 setup fee.

6. EXPECTED OUTCOMES
- Consistent increase in new 5-star reviews.
- Boosted rankings in local search maps.
- Time saved through autopilot collection.`
    },
    agency: {
      title: "Agency Proposal Template",
      description: "Tailored for marketing agencies looking to manage multiple client sub-accounts.",
      valueProps: [
        "Recurring revenue opportunities.",
        "Centralized client management.",
        "Scalable client onboarding.",
        "Performance reporting."
      ],
      structure: [
        "Agency Overview",
        "Multi-Client Management Benefits",
        "Agency Dashboard Features",
        "Reseller Opportunities & Margins",
        "Agency Pricing Structure ($299/mo for 10 client seats)",
        "Implementation & Setup Plan",
        "Growth Opportunities"
      ],
      copyContent: `AGENCY RESELLER PROPOSAL: MULTI-CLIENT REPUTATION SCALE
==================================================
1. AGENCY OVERVIEW
Provide your agency clients with a fully managed, white-labeled reputation builder system to improve rankings and customer trust.

2. MULTI-CLIENT DASHBOARD BENEFITS
- Log in once to oversee up to 10 sub-accounts or locations.
- Switch between client feeds with a single dropdown click.

3. KEY FEATURES
- Unified reviews inbox and automated PDF reporting exports.
- Whitelabel client invite access portals.

4. RESELLER MARGINS & PRICING
- Wholesale cost: $299/mo for up to 10 client seats (average $29.90/client seat).
- Retail recommendation: Sell for $99-$199/mo per client, generating 70%+ recurring profit margins.

5. IMPLEMENTATION TIMELINE
- Day 1: Agency primary portal configuration.
- Day 1: Whitelabel branding logo and colors setup.
- Day 2: Sub-client account profiles created.`
    },
    enterprise: {
      title: "Enterprise Proposal Template",
      description: "Tailored for franchise groups, healthcare networks, and multi-location businesses.",
      valueProps: [
        "Centralized reputation management.",
        "Multi-location visibility.",
        "Executive reporting.",
        "Scalable deployment."
      ],
      structure: [
        "Executive Summary",
        "Multi-Location Requirements & Hierarchy",
        "Custom Integration Opportunities (CRM/ERP Webhooks)",
        "Security & Compliance (Data privacy, access control)",
        "Implementation Roadmap & Dedicated Training",
        "Dedicated Support Model & SLA",
        "Custom Pricing"
      ],
      copyContent: `ENTERPRISE PROPOSAL: CENTRALIZED MULTI-LOCATION REPUTATION SYSTEM
==================================================
1. EXECUTIVE SUMMARY
Deliver unified reputation oversight, compliance, and review performance tracking across all regional branches and franchise groups.

2. MULTI-LOCATION REQUIREMENTS
- Central corporate control with nested franchise manager permissions.
- Consolidated executive dashboard reporting.

3. INTEGRATION CAPABILITIES
- Connect API webhooks to automatically trigger review requests upon CRM checkout.

4. SECURITY & COMPLIANCE
- Enterprise-grade tenant isolation, data compliance, and secure access audits.

5. ROADMAP & SERVICES
- Custom guided migration from legacy configurations (Birdeye, Podium).
- Dedicated Success Manager and SLA priority response support.`
    }
  };

  const handleCopyTemplate = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ROI calculations
  const extraConversionVal = Math.round(extraReviews * 0.15 * avgOrderValue);

  return (
    <div className="h-screen overflow-y-auto p-8 font-sans bg-[#080B14]">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-red-500" />
            ReviewManagement Sales Enablement Console
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Training resources, pitch deck discovery frameworks, interactive calculators, and client proposal templates.
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
          <Award className="w-4 h-4" /> Sales Enablement Package
        </div>
      </div>

      {/* Global Tab Selection */}
      <div className="flex gap-4 p-1.5 bg-white/5 rounded-2xl border border-white/10 max-w-2xl mb-8">
        <button
          onClick={() => setGlobalTab("demo")}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-none bg-transparent cursor-pointer ${
            globalTab === "demo"
              ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Play className="w-4 h-4" /> Demo Script &amp; ROI
        </button>
        <button
          onClick={() => setGlobalTab("proposals")}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-none bg-transparent cursor-pointer ${
            globalTab === "proposals"
              ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <FileText className="w-4 h-4" /> Proposal Templates
        </button>
        <button
          onClick={() => setGlobalTab("competitors")}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-none bg-transparent cursor-pointer ${
            globalTab === "competitors"
              ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Target className="w-4 h-4" /> Competitor Battle Cards
        </button>
      </div>

      {globalTab === "demo" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Interactive Stepper */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Demo Stepper &amp; Script Agenda
              </h2>

              {/* Steps Timeline Grid */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {demoSteps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all ${
                      activeStep === idx 
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20" 
                        : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {step.time} - {step.title.split(" ")[0]}
                  </button>
                ))}
              </div>

              {/* Selected Step Detail View */}
              <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">{demoSteps[activeStep].time} Duration</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">{demoSteps[activeStep].title}</h3>
                  </div>
                  <div className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-full font-semibold">
                    Step {activeStep + 1} of {demoSteps.length}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Objective</span>
                  <p className="text-sm text-slate-300 leading-relaxed">{demoSteps[activeStep].objective}</p>
                </div>

                <div className="space-y-4">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Key Talking Points</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {demoSteps[activeStep].points.map((point, index) => (
                      <div key={index} className="flex gap-3 p-3.5 rounded-xl bg-white/[0.01] border border-white/5 text-slate-400 hover:text-slate-300 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                        <span className="text-xs leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/10 space-y-1.5">
                  <span className="text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Sales Rep Pro Tip
                  </span>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    "{demoSteps[activeStep].tips}"
                  </p>
                </div>
              </div>
            </div>

            {/* ROI Calculator */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-emerald-400" />
                  Reputation ROI Estimator (Interactive Demo Sandbox)
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Show prospects exactly how review growth impacts conversion rates and monthly sales volume.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                      <span>Target Extra Reviews / Month</span>
                      <span className="text-emerald-400 font-mono font-bold">+{extraReviews} reviews</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="100" 
                      value={extraReviews}
                      onChange={(e) => setExtraReviews(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                      <span>Average Deal / Order Value</span>
                      <span className="text-emerald-400 font-mono font-bold">${avgOrderValue}</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="1000" 
                      step="10"
                      value={avgOrderValue}
                      onChange={(e) => setAvgOrderValue(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.02] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Estimated Value</span>
                    <h3 className="text-2xl font-bold text-white mt-1">Projected Growth Outcome</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
                      Assuming a conservative 15% conversion lift from search trust &amp; review traffic.
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-emerald-500/10 flex justify-between items-baseline">
                    <span className="text-slate-500 text-xs">Extra Monthly Value:</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">${extraConversionVal}/mo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                  Objection Handling Playbook
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Click an objection to see the recommended sales response script.
                </p>
              </div>

              <div className="space-y-3">
                {objections.map((ob, idx) => (
                  <div key={idx} className="border border-white/5 rounded-2xl bg-white/[0.01] overflow-hidden">
                    <button
                      onClick={() => setSelectedObjection(selectedObjection === idx ? null : idx)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors focus:outline-none"
                    >
                      <span className="text-xs font-bold text-white">{ob.title}</span>
                      <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${selectedObjection === idx ? "rotate-90 text-red-400" : ""}`} />
                    </button>
                    {selectedObjection === idx && (
                      <div className="p-4 bg-slate-950/40 border-t border-white/5 space-y-3 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Prospect quote</span>
                          <p className="text-slate-400 italic mt-0.5">"{ob.quote}"</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Sales Response</span>
                          <p className="text-slate-300 leading-relaxed mt-0.5">{ob.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Follow-Up Actions
              </h2>
              <ul className="space-y-3">
                {[
                  { task: "Recap Email", detail: "Send summarized notes of pain points." },
                  { task: "Pricing Guide", detail: "Attach the custom proposal sheet." },
                  { task: "Risk-Free Proposal", detail: "Share contract details/trial links." },
                  { task: "Onboarding Call", detail: "Schedule profiles integration check." }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.01] border border-white/5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-[10px] font-extrabold text-emerald-400">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.task}</h4>
                      <p className="text-[10px] text-slate-500">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {globalTab === "proposals" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Proposals templates */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    Interactive Proposal Templates
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">
                    Select a target framework to view details, core benefits, and copy outlines.
                  </p>
                </div>
                <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                  {(["smb", "agency", "enterprise"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedProposal(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                        selectedProposal === type 
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Template details card */}
              <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Client Tier</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">{proposalTemplates[selectedProposal].title}</h3>
                  </div>
                  <button
                    onClick={() => handleCopyTemplate(proposalTemplates[selectedProposal].copyContent)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600/15 border border-violet-500/20 text-violet-400 hover:text-white hover:bg-violet-600/35 active:scale-98 transition-all text-xs font-bold"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Copy Outline Text
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed italic">
                  "{proposalTemplates[selectedProposal].description}"
                </p>

                {/* Value Propositions */}
                <div className="space-y-3">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Target Value Propositions</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {proposalTemplates[selectedProposal].valueProps.map((prop, idx) => (
                      <div key={idx} className="flex gap-2.5 p-3 rounded-xl bg-white/[0.01] border border-white/5 items-center">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-xs text-slate-300 font-medium">{prop}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proposal Structure standards */}
                <div className="space-y-3">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Standard Structure checklist</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {proposalTemplates[selectedProposal].structure.map((step, idx) => (
                      <div key={idx} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-center">
                        <span className="text-[10px] font-semibold text-slate-400 block truncate">{step}</span>
                        <span className="text-[9px] text-indigo-400 font-bold font-mono uppercase tracking-widest mt-1 block">Phase 0{idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Workflow */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  Proposal Delivery &amp; Follow-Up Timeline
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Standard GTM process and timeline for delivering proposals and coordinating follow-ups.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Proposal Delivery Process */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">Proposal Delivery Process</h3>
                  <div className="space-y-3.5">
                    {[
                      { step: "Discovery Completed", desc: "Clarify prospect challenges, locations, and request counts." },
                      { step: "Proposal Customized", desc: "Adapt the template variables, add custom ROI estimations." },
                      { step: "Deliver Within 24 Hours", desc: "Ensure momentum by sending the document package in under a day." },
                      { step: "Follow-up Scheduled", desc: "Book a brief checkout call with stakeholders." },
                      { step: "Decision Date Confirmed", desc: "Establish timeline boundary for onboarding trial." }
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{item.step}</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Follow-Up Sequence */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">Follow-Up Sequence Schedule</h3>
                  <div className="space-y-3.5">
                    {[
                      { day: "Day 01", title: "Proposal Delivered", desc: "Send package with custom proposal and pricing structure sheet." },
                      { day: "Day 03", title: "Follow-Up Email", desc: "Brief checker email to verify receipt and answer minor questions." },
                      { day: "Day 07", title: "Case Study Shared", desc: "Share a vertical success story matching their industry metrics." },
                      { day: "Day 14", title: "Final Follow-Up", desc: "A final closeout message offering trial activation or billing discounts." }
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="px-2 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-[10px] font-mono font-bold text-violet-400 flex-shrink-0 h-6">
                          {item.day}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{item.title}</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: KPIs & Standards */}
          <div className="space-y-6">
            {/* Pricing Presentation Standards */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-400" />
                Pricing Presentation Standards
              </h2>
              <ul className="space-y-3.5 text-xs">
                {[
                  { title: "Good-Better-Best Options", desc: "Always offer three tiers (Starter, Growth, Agency) to anchor options and make decisions simpler." },
                  { title: "Annual Billing Incentives", desc: "Pitch the 2 Months Free annual discount to improve LTV and upfront agency cash flows." },
                  { title: "Transparent Recurring Cost", desc: "Be clear about the subscription boundaries and additional SMS/location credits options." },
                  { title: "Implementation Fees", desc: "Present Guided Setup ($199) or Agency Onboarding ($499) as a high-touch option to ensure quick launch." }
                ].map((item, idx) => (
                  <li key={idx} className="space-y-1">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed pl-5">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Proposal KPIs */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                Proposal KPIs
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { metric: "Proposal Conversion", val: "40%+" },
                  { metric: "Avg Deal Size", val: "$150+/mo" },
                  { metric: "Sales Cycle", val: "Under 14 Days" },
                  { metric: "Response Rate", val: "75%+" }
                ].map((kpi, idx) => (
                  <div key={idx} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-center">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">{kpi.metric}</span>
                    <div className="text-lg font-black text-white mt-1">{kpi.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ROI Framework pillars */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                ROI Framework Pillars
              </h2>
              <div className="space-y-2">
                {[
                  "Additional reviews generated via email/SMS campaigns.",
                  "Improved ratings leading to higher search placement.",
                  "Increased customer trust from reviews fresh rate.",
                  "Improved conversion rates of website visits.",
                  "Operational efficiency gains by eliminating manual requests."
                ].map((point, idx) => (
                  <div key={idx} className="flex gap-2 items-center p-2.5 bg-white/[0.01] border border-white/5 rounded-xl text-xs text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    <span className="text-[10px]">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {globalTab === "competitors" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Battle Cards & Pricing Matrix */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Sales Battle Cards */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4 border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-500 animate-pulse" />
                    Interactive Sales Battle Cards
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">
                    Select a competitor to view strengths, weaknesses, kill points, and copy pitch scripts.
                  </p>
                </div>
                <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
                  {(["podium", "birdeye", "nicejob", "grade.us"] as const).map((comp) => (
                    <button
                      key={comp}
                      onClick={() => setSelectedCompetitor(comp)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all border-none bg-transparent cursor-pointer ${
                        selectedCompetitor === comp 
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {comp === "grade.us" ? "Grade.us" : comp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Battle Card Detail */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono block mb-1">Competitor Profile</span>
                    <h3 className="text-base font-bold text-white">{competitorsData[selectedCompetitor].name}</h3>
                    <p className="text-[11px] text-slate-400 mt-1">{competitorsData[selectedCompetitor].position}</p>
                    <div className="mt-3 flex justify-between items-center text-xs">
                      <span className="text-slate-500">Est. Pricing:</span>
                      <span className="text-amber-400 font-bold font-mono">{competitorsData[selectedCompetitor].pricing}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] text-red-400 uppercase tracking-widest font-mono block mb-1">Vulnerability / Weakness</span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {competitorsData[selectedCompetitor].weaknesses}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4.5 rounded-xl bg-indigo-500/10 border border-indigo-500/25 space-y-2">
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    How to Beat Them (Kill Point)
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {competitorsData[selectedCompetitor].killPoint}
                  </p>
                </div>

                {/* Pitch Script Copybox */}
                <div className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Verbal Sales Pitch Script</span>
                    <button
                      onClick={() => handleCopyScript(competitorsData[selectedCompetitor].script)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:text-white hover:bg-indigo-600 transition-all text-[10px] font-bold border-none cursor-pointer"
                    >
                      {battleCardCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied ✓
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Script
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed bg-[#080B14] p-3 rounded-lg border border-white/5 font-mono">
                    "{competitorsData[selectedCompetitor].script}"
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing Comparison Matrix */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-emerald-400" />
                  GTM Pricing Comparison Matrix
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Positioning bounds referencing target pricing structures.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-500 font-semibold font-mono">
                      <th className="pb-2">Tier Plan</th>
                      <th className="pb-2 text-indigo-400 font-bold bg-indigo-500/5 px-2">ReviewManagement</th>
                      <th className="pb-2">Podium Range</th>
                      <th className="pb-2">Birdeye Range</th>
                      <th className="pb-2">NiceJob Range</th>
                      <th className="pb-2">Grade.us Range</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-slate-300">
                    <tr>
                      <td className="py-3 font-semibold text-slate-200">Starter (1 Location)</td>
                      <td className="py-3 text-indigo-400 font-bold bg-indigo-500/5 px-2">$49 - $79/mo</td>
                      <td className="py-3">$249/mo</td>
                      <td className="py-3">-</td>
                      <td className="py-3">$75/mo</td>
                      <td className="py-3">-</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-slate-200">Growth (3 Locations)</td>
                      <td className="py-3 text-indigo-400 font-bold bg-indigo-500/5 px-2">$99 - $149/mo</td>
                      <td className="py-3">$449/mo</td>
                      <td className="py-3">$350/mo</td>
                      <td className="py-3">$175/mo</td>
                      <td className="py-3">$180/mo</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-slate-200">Agency Reseller (Multi)</td>
                      <td className="py-3 text-indigo-400 font-bold bg-indigo-500/5 px-2">$299 - $399/mo</td>
                      <td className="py-3">$599+/mo</td>
                      <td className="py-3">$450+/mo</td>
                      <td className="py-3">-</td>
                      <td className="py-3">$350/mo</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: SWOT, Positioning & KPIs */}
          <div className="space-y-6">
            
            {/* SWOT Analysis */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                ReviewManagement SWOT Board
              </h2>
              <p className="text-slate-400 text-xs">
                Internal matrix guiding differentiation strategy.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Strengths</span>
                  <ul className="text-[9px] text-slate-300 space-y-1 list-disc pl-3">
                    <li>Disruptive pricing</li>
                    <li>15-min onboarding</li>
                    <li>Agency reseller tier</li>
                    <li>Simplicity focus</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl border border-rose-500/10 bg-rose-500/5 space-y-1">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider font-mono">Weaknesses</span>
                  <ul className="text-[9px] text-slate-300 space-y-1 list-disc pl-3">
                    <li>New market entrant</li>
                    <li>Low brand awareness</li>
                    <li>Smaller initial features</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl border border-cyan-500/10 bg-cyan-500/5 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono">Opportunities</span>
                  <ul className="text-[9px] text-slate-300 space-y-1 list-disc pl-3">
                    <li>SMB cost reduction</li>
                    <li>Agency white-labeling</li>
                    <li>AI response markets</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl border border-amber-500/10 bg-amber-500/5 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">Threats</span>
                  <ul className="text-[9px] text-slate-300 space-y-1 list-disc pl-3">
                    <li>Established giants</li>
                    <li>Enterprise bundling</li>
                    <li>Copycat products</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Target Market Positioning */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Target Market Positioning
              </h2>
              <div className="space-y-2">
                {[
                  { segment: "Small Businesses", desc: "Local clinics, retail shops, and services needing quick Google ratings." },
                  { segment: "Local Service Providers", desc: "Plumbers, landscapers, home techs operating out of field locations." },
                  { segment: "Marketing Agencies", desc: "Firms looking to resell white-labeled reputation dashboards for client LTV." },
                  { segment: "Multi-Location Brands", desc: "Regional franchise branches wanting centralized reporting hierarchies." }
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-white/[0.01] border border-white/5 rounded-xl text-xs space-y-0.5">
                    <span className="font-bold text-slate-200 block">{item.segment}</span>
                    <span className="text-[10px] text-slate-500 block leading-normal">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitive KPIs */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                Competitive GTM KPIs
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { metric: "Win Rate vs Podium", val: "45%" },
                  { metric: "Avg Contract value", val: "$149/mo" },
                  { metric: "CAC Target Limit", val: "$150" },
                  { metric: "Monthly Churn Limit", val: "< 3.0%" }
                ].map((kpi, idx) => (
                  <div key={idx} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-center">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">{kpi.metric}</span>
                    <div className="text-lg font-black text-white mt-1">{kpi.val}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
