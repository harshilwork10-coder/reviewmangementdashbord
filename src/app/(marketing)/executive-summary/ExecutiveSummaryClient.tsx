"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  AlertCircle, 
  CheckCircle2, 
  Target, 
  TrendingUp, 
  Coins, 
  Users, 
  Rocket, 
  ShieldCheck, 
  Layers, 
  Activity, 
  Briefcase, 
  Globe, 
  Sparkles,
  ArrowRight,
  TrendingDown
} from "lucide-react";

export default function ExecutiveSummaryClient() {
  const [activeTab, setActiveTab] = useState<"overview" | "problem-solution" | "market-advantage" | "revenue-goals">("overview");

  const tabs = [
    { id: "overview", label: "Overview & Vision", icon: Target },
    { id: "problem-solution", label: "Problem & Solution", icon: AlertCircle },
    { id: "market-advantage", label: "Market & Advantage", icon: ShieldCheck },
    { id: "revenue-goals", label: "Revenue & Goals", icon: Coins },
  ] as const;

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.08 }
    },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-slate-100 font-sans pb-24 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 border-b border-white/5 bg-white/[0.01]">
        <div className="container mx-auto px-6 max-w-6xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" /> Openrize Ecosystem
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-violet-400 leading-tight mb-6"
          >
            Executive Summary
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            ReviewManagement is a SaaS platform designed to help local businesses generate more positive online reviews, automate campaigns, and maximize recurring revenue.
          </motion.p>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="sticky top-16 z-30 bg-[#080B14]/80 backdrop-blur-md border-b border-white/5 py-4">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-wrap md:flex-nowrap gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive 
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25" 
                      : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? "scale-110" : ""}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tab Contents */}
      <section className="container mx-auto px-6 max-w-6xl mt-12 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-10"
            >
              {/* Mission Statement Banner */}
              <motion.div 
                variants={itemVariants}
                className="p-8 rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/10 via-indigo-600/5 to-transparent relative overflow-hidden group hover:border-violet-500/30 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-start gap-5 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-violet-400">Core Mission</h3>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">Growth Vision</h2>
                    <p className="text-slate-300 text-lg leading-relaxed max-w-4xl pt-2">
                      Build recurring SaaS revenue through Openrize, scaling into a global leader in reputation management.
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Company Overview Card */}
                <motion.div 
                  variants={itemVariants}
                  className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Company Overview</h3>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    ReviewManagement is a SaaS platform designed to help local businesses generate more positive online reviews, improve reputation, and increase customer trust. 
                  </p>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    The platform automates review requests through email and SMS while providing analytics and reporting dashboards. Developed under Openrize, ReviewManagement focuses on affordability, simplicity, and measurable business outcomes.
                  </p>
                </motion.div>

                {/* Long-Term Vision Card */}
                <motion.div 
                  variants={itemVariants}
                  className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-violet-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Long-Term Vision</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Become a leading SMB reputation management platform.",
                      "Expand into advanced AI-powered automated response generation.",
                      "Support thousands of local businesses globally.",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === "problem-solution" && (
            <motion.div
              key="problem-solution"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Problem Section */}
              <motion.div 
                variants={itemVariants}
                className="p-8 rounded-3xl border border-red-500/10 bg-red-500/[0.01] space-y-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-3 border-b border-red-500/10 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-red-400">The Friction</h3>
                    <h2 className="text-2xl font-bold text-white">Problem Statement</h2>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    "Most local businesses struggle to consistently collect customer reviews.",
                    "Manual review requests are time-consuming, inconsistent, and error-prone.",
                    "Poor online reputation directly reduces customer trust and hurts sales conversion.",
                    "Business owners lack clear visibility and consolidated insights into review performance."
                  ].map((problem, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                      <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 text-red-400 text-xs font-bold">
                        0{idx + 1}
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{problem}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Solution Section */}
              <motion.div 
                variants={itemVariants}
                className="p-8 rounded-3xl border border-emerald-500/10 bg-emerald-500/[0.01] space-y-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-3 border-b border-emerald-500/10 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400">The Automations</h3>
                    <h2 className="text-2xl font-bold text-white">Solution Suite</h2>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { title: "Automated Campaigns", desc: "Automated review request workflows that execute without manual intervention." },
                    { title: "Omnichannel Delivery", desc: "Reach customers directly via high-open-rate Email and SMS routes." },
                    { title: "Monitoring Dashboard", desc: "A unified, sleek interface to monitor online reviews in real-time." },
                    { title: "Analytics & Reporting", desc: "Actionable metrics on request performance, conversion, and reviews." },
                    { title: "Agency Capabilities", desc: "Manage multiple clients, franchises, or branches from one parent account." }
                  ].map((sol, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-emerald-500/20 transition-all duration-300">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-400 text-xs font-bold">
                        ✓
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-0.5">{sol.title}</h4>
                        <p className="text-slate-400 text-xs leading-relaxed">{sol.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "market-advantage" && (
            <motion.div
              key="market-advantage"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              {/* Markets Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Target Markets */}
                <motion.div 
                  variants={itemVariants}
                  className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Target Market</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: "Restaurants", icon: "🍔" },
                      { name: "Medical Practices", icon: "🏥" },
                      { name: "Home Services", icon: "🛠️" },
                      { name: "Professional Services", icon: "💼" },
                      { name: "Retail Businesses", icon: "🛍️" },
                      { name: "Marketing Agencies", icon: "📣" }
                    ].map((market) => (
                      <div key={market.name} className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all duration-200 flex items-center gap-3">
                        <span className="text-xl">{market.icon}</span>
                        <span className="text-sm font-medium text-slate-300">{market.name}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Market Opportunity */}
                <motion.div 
                  variants={itemVariants}
                  className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-violet-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Market Opportunity</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { title: "SMB Dependency", desc: "Millions of small and medium businesses depend heavily on search ranking and reviews for survival." },
                      { title: "Impact on Conversion", desc: "Online reputation directly impacts consumer purchasing decisions and overall advertising conversion rates." },
                      { title: "Scaling Demand", desc: "As directories restrict raw traffic, the demand for automated, compliant reputation management software continues to accelerate." }
                    ].map((opp, idx) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-0.5">{opp.title}</h4>
                          <p className="text-slate-400 text-xs leading-relaxed">{opp.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Competitive Advantage */}
              <motion.div 
                variants={itemVariants}
                className="p-8 rounded-3xl border border-indigo-500/10 bg-indigo-500/[0.01] space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Competitive Advantage</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: "Affordable Pricing", desc: "High value at a fraction of competitor pricing, specifically tailored for tight SMB margins." },
                    { title: "Agency-Friendly", desc: "Multi-tenant sub-account configurations and white-label options built-in from day one." },
                    { title: "Frictionless Setup", desc: "Super simple onboarding flow allowing businesses to go live and request reviews in under 5 minutes." },
                    { title: "Automated Engine", desc: "No manual scheduling headaches. Seamlessly schedules, triggers, and tracks via SMS and Email." },
                    { title: "AI-Powered Options", desc: "Future AI reply features allow automatic responding with smart sentiment customization." }
                  ].map((adv, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-indigo-500/20 transition-all duration-300 space-y-2">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="text-xs text-indigo-400 font-mono">0{idx + 1}</span>
                        {adv.title}
                      </h4>
                      <p className="text-slate-400 text-xs leading-relaxed">{adv.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "revenue-goals" && (
            <motion.div
              key="revenue-goals"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-10"
            >
              {/* Revenue Models & Pricing */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-2">Monetization</h3>
                  <h2 className="text-3xl font-bold text-white">Revenue Model</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { tier: "Starter Plan", focus: "Basic automated reviews", term: "Monthly Subscription", price: "$29/mo", color: "from-blue-500/10 to-indigo-500/5", border: "border-blue-500/15" },
                    { tier: "Growth Plan", focus: "Multi-location + AI tools", term: "Monthly Subscription", price: "$79/mo", color: "from-indigo-500/15 to-violet-500/10", border: "border-indigo-500/25" },
                    { tier: "Agency Plan", focus: "Multi-client branding", term: "White-label Portal", price: "$199/mo", color: "from-violet-500/10 to-purple-500/5", border: "border-violet-500/15" },
                    { tier: "Enterprise", focus: "Franchise & integrations", term: "Custom Pricing", price: "Custom", color: "from-slate-500/10 to-slate-500/5", border: "border-slate-500/15" }
                  ].map((model) => (
                    <div key={model.tier} className={`p-6 rounded-2xl border ${model.border} bg-gradient-to-b ${model.color} flex flex-col justify-between h-48`}>
                      <div>
                        <span className="text-xs text-slate-400 font-mono">{model.term}</span>
                        <h4 className="text-lg font-bold text-white mt-1">{model.tier}</h4>
                        <p className="text-slate-400 text-xs mt-2 leading-relaxed">{model.focus}</p>
                      </div>
                      <div className="text-xl font-extrabold text-white">{model.price}</div>
                    </div>
                  ))}
                </div>
                <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🤝</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">Professional Services</h4>
                      <p className="text-slate-400 text-xs">Implementation support, historic review migrations, and premium onboarding help.</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Add-on Stream</span>
                </div>
              </div>

              {/* Goals & GTM */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 12-Month Targets */}
                <motion.div 
                  variants={itemVariants}
                  className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">12-Month Goals</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { goal: "Launch MVP", target: "Production launch" },
                      { goal: "Acquire first 100 customers", target: "SMB onboarding milestone" },
                      { goal: "Reach $10K+ MRR", target: "Financial stability target" },
                      { goal: "Build agency partner network", target: "Multi-tenant channels" },
                      { goal: "Establish repeatable acquisition systems", target: "Paid & outreach playbook" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
                        <span className="text-sm text-slate-300 font-medium">{item.goal}</span>
                        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">{item.target}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Go-To-Market Strategy */}
                <motion.div 
                  variants={itemVariants}
                  className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Go-To-Market Strategy</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { channel: "Openrize Client Base", details: "Upsell to existing network and clients within the parent agency ecosystem." },
                      { channel: "LinkedIn Outreach", details: "Direct target campaigns aimed at managers and owners of local SMB service entities." },
                      { channel: "Local Partnerships", details: "Work with regional business chambers and local networking leagues." },
                      { channel: "Agency Alliances", details: "Partner directly with marketing agencies seeking white-labeled reputation setups." },
                      { channel: "Referral Program", details: "Implement recursive incentives for current business accounts pointing peers to us." }
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-400 text-xs font-bold font-mono">
                          0{idx + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-0.5">{item.channel}</h4>
                          <p className="text-slate-400 text-xs leading-relaxed">{item.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Call to Action banner */}
      <section className="container mx-auto px-6 max-w-6xl mt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4.5 h-4.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Scale your reputation recurringly</h2>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              Openrize's ReviewManagement powers reviews, conversions, and growth metrics under one highly customizable SaaS banner.
            </p>
          </div>
          <a
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-base hover:opacity-95 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-98 transition-all duration-300 whitespace-nowrap flex-shrink-0"
          >
            Start Your Free Trial <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </section>
    </div>
  );
}
