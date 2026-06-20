"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { 
  Star, 
  Check, 
  ArrowRight, 
  ChevronRight, 
  MessageSquare, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Users, 
  Layers, 
  Building,
  HelpCircle,
  ChevronDown
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") router.push("/admin");
      else router.push("/dashboard");
    }
  }, [user, loading, router]);

  const pricingPlans = [
    {
      name: "Starter",
      description: "For small businesses.",
      monthlyPrice: 49,
      yearlyPrice: 40,
      features: [
        "1 Business Location",
        "250 Review Requests/Month",
        "Email Campaigns",
        "Basic Dashboard",
        "Standard Support"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Growth",
      description: "For growing businesses.",
      monthlyPrice: 99,
      yearlyPrice: 82,
      features: [
        "3 Business Locations",
        "1,000 Review Requests/Month",
        "Email & SMS Campaigns",
        "Advanced Reporting",
        "Priority Support"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Agency",
      description: "For agencies managing clients.",
      monthlyPrice: 299,
      yearlyPrice: 249,
      features: [
        "Up to 10 Client Accounts",
        "Agency Dashboard",
        "Multi-Client Reporting",
        "Client Management Tools",
        "Priority Agency Support"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Enterprise",
      description: "Custom requirements.",
      monthlyPrice: "Custom" as any,
      yearlyPrice: "Custom" as any,
      features: [
        "Unlimited Locations",
        "Custom Integrations",
        "Dedicated Success Manager",
        "Custom Reporting",
        "Enterprise SLA"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      q: "What platforms do you support?",
      a: "ReviewManagement supports Google Business Profile, Facebook Pages, Yelp, TripAdvisor, Trustpilot, and other major industry directories. You can monitor and respond to reviews across all of them from one dashboard."
    },
    {
      q: "How do review requests work?",
      a: "Review requests are sent automatically via email or SMS when a client completes a transaction or check-in. You can import customer contacts manually or connect your CRM for fully automated campaigns."
    },
    {
      q: "Can agencies manage multiple clients?",
      a: "Yes! The Agency Plan is specifically designed for agencies. It offers a multi-client dashboard, client reporting capabilities, and options to white-label the reporting with your own agency branding."
    },
    {
      q: "Do you offer free trials?",
      a: "Yes, we offer a 14-day free trial on our plans so you can test all the automation, dashboard features, and campaign settings before committing."
    },
    {
      q: "How quickly can I get started?",
      a: "You can connect your Google Business Profile and set up your first review request campaign in under 15 minutes. Our onboarding wizard walks you through every step."
    }
  ];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // SEO schema injection JSON-LD
  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ReviewManagement",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "23",
      "highPrice": "499",
      "offerCount": "4"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1042"
    }
  };

  return (
    <div className="min-h-screen bg-[#080B14] relative overflow-hidden noise-overlay">
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <div className="absolute inset-0 mesh-gradient opacity-80" />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden z-10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Column Text */}
            <div className="flex-1 text-left space-y-8 max-w-2xl">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold text-violet-300 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Rated 4.9★ on G2 and Capterra
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                Turn Happy Customers Into<br />
                <span className="gradient-text">More 5-Star Reviews</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">
                Automate review requests, improve your reputation, and grow your business with ReviewManagement.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="btn-primary px-8 py-4 rounded-xl text-white font-bold text-center text-lg flex items-center justify-center gap-2 group">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/demo" className="px-8 py-4 rounded-xl border border-slate-800 bg-slate-950/40 text-slate-300 font-semibold text-center text-lg hover:border-violet-500/40 hover:bg-violet-950/10 transition-all">
                  Book a Demo
                </Link>
              </div>

              {/* Trust metrics */}
              <div className="pt-8 border-t border-slate-900 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">1.2M+</div>
                  <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Reviews Managed</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">45%</div>
                  <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Avg. Growth Rate</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">15m</div>
                  <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Setup Time</div>
                </div>
              </div>
            </div>

            {/* Right Column High-fidelity Dashboard Mockup */}
            <div className="flex-1 w-full relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl blur-xl opacity-30 animate-pulse-glow" />
              
              {/* Dashboard Frame */}
              <div className="relative glass-card border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden bg-slate-950/80">
                <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs text-slate-500 font-mono ml-2">app.reviewmanagement.com</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Live</span>
                </div>

                {/* Dashboard Stats Preview */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="text-xs text-slate-500 font-medium">Average Rating</div>
                    <div className="text-2xl font-bold text-white mt-1 flex items-center gap-1.5">
                      4.8
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-1">↑ +0.3 this month</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="text-xs text-slate-500 font-medium">New Reviews</div>
                    <div className="text-2xl font-bold text-white mt-1">184</div>
                    <div className="text-[10px] text-emerald-400 mt-1">↑ +24% increase</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="text-xs text-slate-500 font-medium">AI response rate</div>
                    <div className="text-2xl font-bold text-white mt-1">94.2%</div>
                    <div className="text-[10px] text-slate-400 mt-1">Saved 18 hours</div>
                  </div>
                </div>

                {/* Mock Review Response Feed */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-white">Sarah Jenkins</span>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map((i) => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 italic mb-3">
                      "Absolutely loved the professional service! The staff was incredibly helpful and quick. Will definitely come back."
                    </p>
                    
                    {/* Simulated AI Suggestion */}
                    <div className="border-t border-violet-500/10 pt-3 mt-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                        <span className="text-xs font-semibold text-violet-300">AI Suggested Reply (Friendly Tone)</span>
                      </div>
                      <p className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-white/5">
                        "Hi Sarah! Thank you so much for the 5-star rating. We're thrilled to hear you had a great experience with our team and we can't wait to welcome you back soon!"
                      </p>
                      <div className="flex justify-end gap-2 mt-2">
                        <button className="px-2.5 py-1 rounded text-[10px] bg-slate-900 border border-white/10 text-slate-400">Edit</button>
                        <button className="px-2.5 py-1 rounded text-[10px] bg-violet-600 font-semibold text-white">Approve & Publish</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why ReviewManagement */}
      <section id="why-us" className="py-24 relative border-t border-slate-950 bg-slate-950/40 z-10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold text-violet-400 tracking-wider uppercase">Why ReviewManagement</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">Consistently Scale Your Reputation</p>
            <p className="text-slate-400 text-lg">
              Automated review requests designed for local businesses and agencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Automated Campaign Requests", desc: "Send automated email and SMS review requests effortlessly.", icon: MessageSquare },
              { title: "Consistently Grow Reviews", desc: "Increase review volume consistently over time without manual outreach.", icon: TrendingUp },
              { title: "One Unified Dashboard", desc: "Monitor reputation performance in one centralized dashboard.", icon: Layers },
              { title: "Tailored Architecture", desc: "Specially designed for local businesses and agencies to scale.", icon: Users }
            ].map((why, idx) => {
              const Icon = why.icon;
              return (
                <div key={idx} className="glass-card rounded-2xl p-8 border border-white/5 relative group hover:border-violet-500/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-6 text-violet-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{why.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{why.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Benefits */}
      <section id="benefits" className="py-24 relative border-t border-slate-950 bg-slate-950/20 z-10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold text-cyan-400 tracking-wider uppercase">Benefits</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">Unlock Business Growth Outcomes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { title: "Increase Trust", desc: "Increase customer trust by displaying active positive sentiment.", icon: ShieldCheck },
              { title: "Boost Local SEO", desc: "Improve local SEO visibility to attract nearby traffic.", icon: Clock },
              { title: "Generate Reviews", desc: "Generate more positive reviews on autopilot.", icon: Sparkles },
              { title: "Automation Advantage", desc: "Save valuable staff time through robust automation.", icon: Check },
              { title: "Measure Returns", desc: "Track measurable ROI on every outreach dollar spent.", icon: TrendingUp }
            ].map((ben, idx) => {
              const Icon = ben.icon;
              return (
                <div key={idx} className="glass-card rounded-2xl p-6 border border-white/5 hover:border-cyan-500/30 transition-all text-center">
                  <div className="w-10 h-10 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center mb-4 mx-auto text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{ben.title}</h3>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{ben.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industries Links Grid */}
      <section className="py-24 relative z-10 border-t border-slate-950">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold text-cyan-400 tracking-wider uppercase">Tailored Industry Solutions</h2>
            <p className="text-3xl font-extrabold text-white">Specific Solutions for Your Field</p>
            <p className="text-slate-400">
              Each industry operates differently. Explore our customized strategies designed to fit your unique workflow.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Restaurants", icon: <Building className="w-5 h-5" />, href: "/review-management-for-restaurants" },
              { name: "Retail", icon: <Layers className="w-5 h-5" />, href: "/review-management-for-retail" },
              { name: "Healthcare & Clinics", icon: <Users className="w-5 h-5" />, href: "/review-management-for-clinics" },
              { name: "Liquor Stores", icon: <Building className="w-5 h-5" />, href: "/review-management-for-liquor-stores" },
              { name: "Professional Services", icon: <Layers className="w-5 h-5" />, href: "/review-management-for-professional-services" },
              { name: "Home Services", icon: <Building className="w-5 h-5" />, href: "/review-management-for-home-services" },
            ].map((ind) => (
              <Link
                key={ind.name}
                href={ind.href}
                className="p-5 rounded-2xl glass-card border border-white/5 flex flex-col items-center text-center justify-center gap-3 text-slate-300 hover:text-white transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-violet-400 group-hover:bg-violet-500/10 transition-colors">
                  {ind.icon}
                </div>
                <span className="text-sm font-semibold">{ind.name}</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-violet-400" />
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/review-management-for-franchises" className="inline-flex items-center gap-1.5 text-violet-400 hover:text-violet-300 font-semibold text-sm group">
              Managing a franchise network? View Franchise Solutions
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Toggle Section */}
      <section id="pricing" className="py-24 relative border-t border-slate-950 bg-slate-950/20 z-10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold text-violet-400 tracking-wider uppercase">Simple Pricing</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">Scale Comfortably Without Extra Fees</p>
            <p className="text-slate-400">
              Try any plan risk-free for 14 days. Switch or cancel at any time.
            </p>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-4 pt-6">
              <span className={`text-sm font-medium ${billingPeriod === "monthly" ? "text-white" : "text-slate-500"}`}>Monthly</span>
              <button 
                onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
                className="w-12 h-6.5 rounded-full bg-slate-800 p-1 relative flex items-center transition-colors focus:outline-none"
              >
                <div 
                  className={`w-4.5 h-4.5 rounded-full bg-violet-500 transition-all ${
                    billingPeriod === "yearly" ? "translate-x-5.5" : "translate-x-0"
                  }`} 
                />
              </button>
              <span className={`text-sm font-medium flex items-center gap-1.5 ${billingPeriod === "yearly" ? "text-white" : "text-slate-500"}`}>
                Annually
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  Save 20%
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan) => {
              const price = billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
              
              return (
                <div 
                  key={plan.name}
                  className={`rounded-2xl p-6.5 border flex flex-col justify-between relative transition-all ${
                    plan.popular 
                      ? "bg-slate-950/90 border-violet-500 shadow-xl shadow-violet-500/10" 
                      : "glass-card border-white/5"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-600 text-white shadow-lg">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-xs text-slate-500 min-h-10">{plan.description}</p>
                    
                    <div className="my-6">
                      {typeof price === "number" ? (
                        <>
                          <span className="text-4xl font-extrabold text-white">${price}</span>
                          <span className="text-slate-500 text-sm"> / mo</span>
                          <div className="text-[10px] text-slate-500 mt-1">
                            {billingPeriod === "yearly" ? `Billed annually ($${price * 12}/yr)` : "Billed monthly"}
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-4xl font-extrabold text-white">Custom</span>
                          <div className="text-[10px] text-slate-500 mt-1">
                            Tailored for custom scale
                          </div>
                        </>
                      )}
                    </div>

                    <ul className="space-y-3 pt-6 border-t border-slate-900">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-xs text-slate-400">
                          <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <Link 
                      href={plan.name === "Enterprise" ? "/demo" : "/register"}
                      className={`w-full py-3 rounded-xl font-bold text-sm text-center block transition-all ${
                        plan.popular
                          ? "bg-violet-600 hover:bg-violet-500 text-white"
                          : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/5"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Structured FAQ Section */}
      <section className="py-24 relative z-10 border-t border-slate-950">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold text-violet-400 tracking-wider uppercase">Support</h2>
            <p className="text-3xl font-extrabold text-white">Frequently Asked Questions</p>
            <p className="text-slate-400">
              Have questions about billing, security, or capabilities? Find your answers below.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="rounded-xl border border-white/5 bg-slate-950/40 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left text-white hover:bg-white/5 focus:outline-none transition-all"
                >
                  <span className="font-semibold text-sm sm:text-base flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-violet-400 flex-shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${activeFaq === idx ? "rotate-180" : ""}`} />
                </button>
                
                {activeFaq === idx && (
                  <div className="px-6 pb-6 pt-2 text-slate-400 text-sm leading-relaxed border-t border-white/5 bg-slate-950/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 relative overflow-hidden z-10 border-t border-slate-950">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600 rounded-full blur-[120px] opacity-15 pointer-events-none" />
        
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-4xl space-y-8">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Grow Your Online Reputation Today.<br />
            <span className="gradient-text">See ReviewManagement in Action.</span>
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link href="/register" className="btn-primary px-8 py-4 rounded-xl text-white font-bold text-lg">
              Start Your Free Trial
            </Link>
            <Link href="/demo" className="px-8 py-4 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 font-semibold hover:border-violet-500/40 hover:bg-violet-950/10 transition-all text-lg">
              Book Your Demo
            </Link>
          </div>

          <p className="text-xs text-slate-500">
            No credit card required · Cancel anytime · Instant 15-minute onboarding
          </p>
        </div>
      </section>
    </div>
  );
}
