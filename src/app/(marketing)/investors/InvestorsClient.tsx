"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Star, 
  AlertCircle, 
  TrendingUp, 
  CheckCircle2, 
  Layers, 
  Users, 
  Coins, 
  ShieldCheck, 
  Activity, 
  Milestone, 
  Heart, 
  DollarSign,
  Play,
  Rocket,
  Compass,
  ArrowRight,
  Info,
  Target
} from "lucide-react";

type SlideCategory = "all" | "foundation" | "product" | "market-revenue" | "growth-roadmap";

interface SlideData {
  id: number;
  title: string;
  category: Exclude<SlideCategory, "all">;
  icon: any;
  points: string[];
  color: string;
  glow: string;
}

export default function InvestorsClient() {
  const [selectedCategory, setSelectedCategory] = useState<SlideCategory>("all");

  const categories = [
    { id: "all", label: "All Slides" },
    { id: "foundation", label: "Foundation & Vision" },
    { id: "product", label: "Product & Solution" },
    { id: "market-revenue", label: "Market & Business Model" },
    { id: "growth-roadmap", label: "Roadmap & Funding" },
  ];

  const slides: SlideData[] = [
    {
      id: 1,
      title: "Cover",
      category: "foundation",
      icon: Rocket,
      points: [
        "ReviewManagement",
        "Automated Reputation Growth for Local Businesses",
        "Powered by Openrize",
      ],
      color: "from-indigo-600 to-violet-600",
      glow: "rgba(99, 102, 241, 0.15)",
    },
    {
      id: 2,
      title: "The Problem",
      category: "foundation",
      icon: AlertCircle,
      points: [
        "Businesses struggle to consistently collect reviews.",
        "Manual processes lead to low response rates.",
        "Poor reputation impacts revenue and trust.",
      ],
      color: "from-red-600 to-rose-600",
      glow: "rgba(239, 68, 68, 0.15)",
    },
    {
      id: 3,
      title: "Market Opportunity",
      category: "market-revenue",
      icon: Globe,
      points: [
        "Millions of SMBs rely on online reviews.",
        "Reviews directly influence buying decisions.",
        "Growing demand for automated reputation management.",
      ],
      color: "from-blue-600 to-indigo-600",
      glow: "rgba(59, 130, 246, 0.15)",
    },
    {
      id: 4,
      title: "The Solution",
      category: "product",
      icon: CheckCircle2,
      points: [
        "Automated email review requests.",
        "Automated SMS review requests.",
        "Review tracking and analytics.",
        "Agency management tools.",
      ],
      color: "from-emerald-600 to-teal-600",
      glow: "rgba(16, 185, 129, 0.15)",
    },
    {
      id: 5,
      title: "Product Demo Overview",
      category: "product",
      icon: Play,
      points: [
        "Simple onboarding.",
        "Campaign builder.",
        "Review dashboard.",
        "Reporting and analytics.",
      ],
      color: "from-amber-600 to-orange-600",
      glow: "rgba(245, 158, 11, 0.15)",
    },
    {
      id: 6,
      title: "Target Customers",
      category: "market-revenue",
      icon: Users,
      points: [
        "Restaurants",
        "Medical offices",
        "Home services",
        "Professional services",
        "Retail businesses",
        "Marketing agencies",
      ],
      color: "from-indigo-600 to-blue-600",
      glow: "rgba(99, 102, 241, 0.15)",
    },
    {
      id: 7,
      title: "Business Model",
      category: "market-revenue",
      icon: Coins,
      points: [
        "Starter Subscription",
        "Growth Subscription",
        "Agency Subscription",
        "Enterprise Plans",
        "Implementation Services",
      ],
      color: "from-purple-600 to-violet-600",
      glow: "rgba(139, 92, 246, 0.15)",
    },
    {
      id: 8,
      title: "Competitive Advantage",
      category: "product",
      icon: ShieldCheck,
      points: [
        "Affordable pricing.",
        "Fast onboarding.",
        "Agency-friendly platform.",
        "Future AI-powered capabilities.",
      ],
      color: "from-cyan-600 to-blue-600",
      glow: "rgba(6, 182, 212, 0.15)",
    },
    {
      id: 9,
      title: "Go-To-Market Strategy",
      category: "market-revenue",
      icon: Layers,
      points: [
        "Openrize client base.",
        "LinkedIn outreach.",
        "Referral programs.",
        "Agency partnerships.",
        "Local business outreach.",
      ],
      color: "from-violet-600 to-indigo-600",
      glow: "rgba(124, 58, 237, 0.15)",
    },
    {
      id: 10,
      title: "Financial Projections",
      category: "growth-roadmap",
      icon: DollarSign,
      points: [
        "Year 1: MVP launch and validation.",
        "Year 2: Scaling recurring revenue.",
        "Year 3: Agency expansion and growth.",
      ],
      color: "from-emerald-600 to-green-600",
      glow: "rgba(16, 185, 129, 0.15)",
    },
    {
      id: 11,
      title: "Roadmap",
      category: "growth-roadmap",
      icon: Milestone,
      points: [
        "MVP Development",
        "Beta Program",
        "Public Launch",
        "Agency Program",
        "AI Expansion",
      ],
      color: "from-pink-600 to-purple-600",
      glow: "rgba(219, 39, 119, 0.15)",
    },
    {
      id: 12,
      title: "Investment Opportunity",
      category: "growth-roadmap",
      icon: Target,
      points: [
        "Capital for product development.",
        "Sales and marketing growth.",
        "Infrastructure scaling.",
        "Customer acquisition.",
      ],
      color: "from-blue-600 to-cyan-600",
      glow: "rgba(59, 130, 246, 0.15)",
    },
    {
      id: 13,
      title: "Team",
      category: "foundation",
      icon: Heart,
      points: [
        "Founder: Openrize Leadership",
        "Development Team",
        "Customer Success",
        "Future Growth Hires",
      ],
      color: "from-indigo-600 to-violet-600",
      glow: "rgba(99, 102, 241, 0.15)",
    },
    {
      id: 14,
      title: "Closing",
      category: "foundation",
      icon: Compass,
      points: [
        "Automating reputation growth for SMBs.",
        "Scalable SaaS revenue opportunity.",
        "Ready for launch and growth.",
      ],
      color: "from-violet-600 to-purple-600",
      glow: "rgba(139, 92, 246, 0.15)",
    },
  ];

  const filteredSlides = selectedCategory === "all" 
    ? slides 
    : slides.filter(slide => slide.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-slate-100 font-sans pb-24 overflow-hidden relative">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Header */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 border-b border-white/5 bg-white/[0.01]">
        <div className="container mx-auto px-6 max-w-6xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Info className="w-3.5 h-3.5" /> Investor Presentation
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-violet-400 leading-tight mb-6"
          >
            Investor Pitch Deck
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            ReviewManagement — Automated Reputation Growth for Local Businesses. Slide-by-slide investor pitch breakdown.
          </motion.p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-16 z-30 bg-[#080B14]/80 backdrop-blur-md border-b border-white/5 py-4">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as SlideCategory)}
                className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === cat.id 
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Slide Grid */}
      <section className="container mx-auto px-6 max-w-6xl mt-12 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredSlides.map((slide) => {
            const Icon = slide.icon;
            return (
              <motion.div
                key={slide.id}
                variants={cardVariants}
                className="group relative rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden hover:bg-white/[0.04] hover:border-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/[0.03] transition-all duration-300 flex flex-col justify-between"
                style={{
                  boxShadow: `0 10px 40px -10px ${slide.glow}`
                }}
              >
                {/* Visual slide border glow element */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${slide.color}`} />

                <div className="p-8 space-y-6">
                  {/* Top card row */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-extrabold text-slate-500 uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                      Slide {slide.id < 10 ? `0${slide.id}` : slide.id}
                    </span>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${slide.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                    {slide.title}
                  </h3>

                  {/* Bullet points */}
                  <ul className="space-y-4">
                    {slide.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-indigo-400 group-hover:scale-125 transition-transform`} />
                        <span className="text-slate-400 group-hover:text-slate-300 text-sm leading-relaxed transition-colors">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card tag footer */}
                <div className="px-8 pb-8 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-md">
                    {slide.category.replace("-", " ")}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-6 max-w-6xl mt-20">
        <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-indigo-600/10 to-transparent p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Interested in Partnering?</h2>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              We are actively preparing for public launch and looking for qualified agencies, local business leaders, and investors.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <a
              href="/contact"
              className="flex-1 md:flex-initial text-center inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-base hover:opacity-95 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-98 transition-all duration-300 whitespace-nowrap"
            >
              Contact Relations <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// Temporary inline definition for lucide-react Globe icon fallback if not imported
function Globe(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
