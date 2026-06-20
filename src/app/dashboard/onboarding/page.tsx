"use client";

import { useState } from "react";
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Mail, 
  Calendar, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  Users, 
  Trophy, 
  ArrowRight,
  Video,
  ShieldCheck,
  Coins
} from "lucide-react";

interface ChecklistItem {
  id: string;
  task: string;
  checked: boolean;
}

export default function OnboardingKitPage() {
  // Checklist State
  const [day1Items, setDay1Items] = useState<ChecklistItem[]>([
    { id: "d1-1", task: "Create account & complete profile settings", checked: true },
    { id: "d1-2", task: "Link review platform profiles (Google Business, Yelp)", checked: false },
    { id: "d1-3", task: "Import customer contacts database (.CSV)", checked: false },
    { id: "d1-4", task: "Complete the initial dashboard walkthrough", checked: true }
  ]);

  const [week1Items, setWeek1Items] = useState<ChecklistItem[]>([
    { id: "w1-1", task: "Configure and launch first review campaign", checked: false },
    { id: "w1-2", task: "Monitor email and SMS campaign dispatch limits", checked: false },
    { id: "w1-3", task: "Review initial analytics dashboard metrics", checked: false }
  ]);

  const [month1Items, setMonth1Items] = useState<ChecklistItem[]>([
    { id: "m1-1", task: "Generate first new reviews and replies", checked: false },
    { id: "m1-2", task: "Analyze and optimize campaign dispatch copy", checked: false },
    { id: "m1-3", task: "Establish monthly PDF reporting cadence", checked: false }
  ]);

  // Tab State
  const [activeSection, setActiveSection] = useState<"checklist" | "materials" | "calls">("checklist");

  // Calculations
  const allItems = [...day1Items, ...week1Items, ...month1Items];
  const checkedItemsCount = allItems.filter(item => item.checked).length;
  const progressPercent = Math.round((checkedItemsCount / allItems.length) * 100);

  const toggleCheck = (id: string, listType: "day1" | "week1" | "month1") => {
    if (listType === "day1") {
      setDay1Items(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    } else if (listType === "week1") {
      setWeek1Items(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    } else {
      setMonth1Items(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    }
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-slate-100 font-sans p-8 overflow-y-auto relative">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-indigo-600/5 rounded-full blur-[110px] pointer-events-none" />

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Trophy className="w-8 h-8 text-violet-400" />
            Customer Onboarding Kit
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">
            Welcome to ReviewManagement! Track your setup checkpoints, access training materials, and schedule your onboarding session.
          </p>
        </div>
        <div className="px-4 py-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl text-xs font-bold uppercase tracking-wider">
          Onboarding Vision: Value in 7 Days
        </div>
      </div>

      {/* Onboarding Health Progress Gauge */}
      <div className="glass-card rounded-3xl p-6 border border-white/5 mb-8 relative z-10 bg-white/[0.01]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Onboarding Progress</h3>
            <h2 className="text-2xl font-black text-white mt-1">Profile Activation Score</h2>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-violet-400 font-mono">{progressPercent}%</span>
            <span className="text-slate-500 text-xs block font-medium">({checkedItemsCount} of {allItems.length} completed)</span>
          </div>
        </div>
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-500 tracking-wide uppercase font-semibold">
          Complete the tasks below to accelerate reviews adoption and unlock local search visibility.
        </p>
      </div>

      {/* Nav Tabs */}
      <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 max-w-lg mb-8 relative z-10">
        <button
          onClick={() => setActiveSection("checklist")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeSection === "checklist"
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Setup Checklists
        </button>
        <button
          onClick={() => setActiveSection("materials")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeSection === "materials"
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Training Materials
        </button>
        <button
          onClick={() => setActiveSection("calls")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeSection === "calls"
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Calls &amp; Timelines
        </button>
      </div>

      {/* Section Content */}
      <div className="relative z-10">
        {activeSection === "checklist" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Day 1 Setup */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Clock className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Day 1 Setup Checklist</h3>
              </div>
              <div className="space-y-2">
                {day1Items.map((item) => (
                  <label key={item.id} className="flex gap-3 p-3.5 rounded-xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] cursor-pointer transition-all">
                    <input 
                      type="checkbox" 
                      checked={item.checked} 
                      onChange={() => toggleCheck(item.id, "day1")}
                      className="w-4.5 h-4.5 rounded border-white/10 text-indigo-600 bg-slate-900 focus:ring-indigo-600 cursor-pointer flex-shrink-0 mt-0.5"
                    />
                    <span className={`text-xs leading-relaxed ${item.checked ? "text-slate-500 line-through" : "text-slate-300"}`}>{item.task}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Week 1 Plan */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <h3 className="text-base font-bold text-white">Week 1 Success Plan</h3>
              </div>
              <div className="space-y-2">
                {week1Items.map((item) => (
                  <label key={item.id} className="flex gap-3 p-3.5 rounded-xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] cursor-pointer transition-all">
                    <input 
                      type="checkbox" 
                      checked={item.checked} 
                      onChange={() => toggleCheck(item.id, "week1")}
                      className="w-4.5 h-4.5 rounded border-white/10 text-indigo-600 bg-slate-900 focus:ring-indigo-600 cursor-pointer flex-shrink-0 mt-0.5"
                    />
                    <span className={`text-xs leading-relaxed ${item.checked ? "text-slate-500 line-through" : "text-slate-300"}`}>{item.task}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 30-Day Milestone */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">30-Day Milestones</h3>
              </div>
              <div className="space-y-2">
                {month1Items.map((item) => (
                  <label key={item.id} className="flex gap-3 p-3.5 rounded-xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] cursor-pointer transition-all">
                    <input 
                      type="checkbox" 
                      checked={item.checked} 
                      onChange={() => toggleCheck(item.id, "month1")}
                      className="w-4.5 h-4.5 rounded border-white/10 text-indigo-600 bg-slate-900 focus:ring-indigo-600 cursor-pointer flex-shrink-0 mt-0.5"
                    />
                    <span className={`text-xs leading-relaxed ${item.checked ? "text-slate-500 line-through" : "text-slate-300"}`}>{item.task}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "materials" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Start Guide */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Quick Start Guides</h3>
              </div>
              <div className="space-y-3.5">
                {[
                  { title: "Review Request Setup", detail: "Learn to design custom email and text message campaigns." },
                  { title: "Linking Business Profiles", detail: "Step-by-step to connecting Google & Facebook directories." },
                  { title: "Contact Importing Guide", detail: "Tips for exporting and formatting CSV contact list sheets." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center text-xs font-bold text-indigo-400 flex-shrink-0">
                      0{idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Walkthroughs */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Video className="w-5 h-5 text-violet-400" />
                <h3 className="text-base font-bold text-white">Video Walkthroughs</h3>
              </div>
              <div className="space-y-3">
                {[
                  { title: "Dashboard Tour", length: "2 mins" },
                  { title: "Your First Review Campaign", length: "4 mins" },
                  { title: "AI Assistant Configuration", length: "3 mins" }
                ].map((video, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-white/[0.01] border border-white/5 rounded-xl hover:border-violet-500/20 transition-all cursor-pointer">
                    <span className="text-xs font-bold text-white">{video.title}</span>
                    <span className="text-[10px] bg-violet-500/10 text-violet-400 px-2.5 py-1 rounded-lg font-mono font-bold">{video.length}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Channels & FAQs */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Support Channels</h3>
              </div>
              <div className="space-y-3.5 text-xs text-slate-400">
                {[
                  { channel: "Email Support", details: "Reach out via support@reviewmanagement.com for general help." },
                  { channel: "Knowledge Base", details: "Self-serve documentation articles, setup logs, and search audits." },
                  { channel: "Onboarding Specialist", details: "1-on-1 assistance calls available to customize campaigns." },
                  { channel: "Priority SLA Support", details: "Fast response guarantee for Growth and Agency subscription tiers." }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <h4 className="font-bold text-white flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      {item.channel}
                    </h4>
                    <p className="text-[10px] text-slate-500 pl-5 leading-relaxed">{item.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "calls" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Onboarding Call Agenda */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Onboarding Call Agenda</h3>
              </div>
              <div className="space-y-3.5">
                {[
                  { step: "Business Goals Review", desc: "Define target platforms, average ratings targets, and monthly volume." },
                  { step: "Platform Walkthrough", desc: "General layout check, linking integrations profiles." },
                  { step: "Campaign Setup", desc: "Design conversion-optimized templates and custom messaging." },
                  { step: "Success Metrics Review", desc: "Clarify KPIs like campaign conversion and time-to-first-review." },
                  { step: "Next Steps Plan", desc: "Schedule Q1 progress follow-up checks." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 flex-shrink-0 mt-0.5">
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

            {/* Customer Communication Timeline */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Mail className="w-5 h-5 text-violet-400" />
                <h3 className="text-base font-bold text-white">Customer Communications</h3>
              </div>
              <div className="space-y-3.5">
                {[
                  { day: "Day 01", title: "Welcome Sequence", desc: "Activate account, review dashboard setup checklists." },
                  { day: "Day 07", title: "Success Check-In", desc: "Review campaign launch status and email/SMS delivery metrics." },
                  { day: "Day 30", title: "Milestone Audit", desc: "Analyze ratings increase and optimize templates copy." },
                  { day: "QBR", title: "Business Reviews", desc: "Deep metrics analysis and referral rewards activation." }
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

            {/* Adoption Framework */}
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Layers className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Adoption Framework</h3>
              </div>
              <div className="space-y-3">
                {[
                  { stage: "Profile Completion", desc: "Link directories, upload branding and logo parameters." },
                  { stage: "Campaign Activation", desc: "Send first SMS/Email review invitation sequences." },
                  { stage: "Review Generation", desc: "Collect positive ratings and reply using template prompts." },
                  { stage: "Reporting Usage", desc: "Configure monthly PDF reviews analytics report exports." },
                  { stage: "Advanced Adoption", desc: "Integrate APIs and train custom AI templates." }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.stage}</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">Stage 0{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Referral Program Banner */}
      <section className="mt-12 relative z-10">
        <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Earn Recurring Referral Rewards</h2>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              Introduce peer business owners or partner marketing agencies to ReviewManagement and receive recurring rewards for every account activated.
            </p>
          </div>
          <button
            onClick={() => alert("Partner program: referral links generation complete.")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-base hover:opacity-95 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-98 transition-all duration-300 whitespace-nowrap flex-shrink-0"
          >
            Activate Referral Link <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
