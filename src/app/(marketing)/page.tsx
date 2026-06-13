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
      description: "Perfect for single-location local businesses looking to automate reviews.",
      monthlyPrice: 29,
      yearlyPrice: 23,
      features: [
        "1 Location",
        "SMS & Email Review Requests",
        "Basic AI Reply Templates",
        "Google & Facebook Integration",
        "Analytics Dashboard",
        "Email Support"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Growth",
      description: "Designed for expanding businesses needing full automated operations.",
      monthlyPrice: 79,
      yearlyPrice: 63,
      features: [
        "Up to 5 Locations",
        "Advanced AI Reply Assistant (Tone Selection)",
        "Automated Scheduling Campaigns",
        "Unified Reviews Inbox",
        "Priority SMS Dispatch Limits",
        "Priority Email & Chat Support"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Agency",
      description: "Scale client management with full whitelabel branding capabilities.",
      monthlyPrice: 199,
      yearlyPrice: 159,
      features: [
        "Up to 25 Clients / Locations",
        "100% White Label Branding",
        "Custom Client Dashboards",
        "Automatic PDF Reporting",
        "Team Members Assignment",
        "Dedicated Success Manager"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Enterprise",
      description: "Tailored for franchises and multi-unit organizations with custom needs.",
      monthlyPrice: 499,
      yearlyPrice: 399,
      features: [
        "Unlimited Locations",
        "Custom CRM Integrations",
        "Dedicated AI Voice Training",
        "SLA & Priority Support",
        "Multi-Organization Hierarchy",
        "Custom API Access"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      q: "How does the 14-day free trial work?",
      a: "You get full, unrestricted access to the Growth plan features for 14 days. No credit card is required. You can upgrade, downgrade, or cancel at any time directly from your settings dashboard."
    },
    {
      q: "Can I cancel my subscription at any time?",
      a: "Yes! There are no long-term contracts or lock-ins. If you decide to cancel, you will keep access to your paid features until the end of your current billing period, and you won't be charged again."
    },
    {
      q: "How do AI reply suggestions work?",
      a: "Our advanced AI reads the sentiment, keywords, and tone of incoming reviews. It automatically generates high-quality draft responses tailored to the review. You can select the tone (Professional, Friendly, Empathetic, Brand Voice), edit if needed, and publish with one click."
    },
    {
      q: "Do you support SMS and Email review campaigns?",
      a: "Absolutely. You can import contacts or connect via CRM to trigger automated review requests via text messages (SMS) and emails. We provide conversion-optimized templates and a QR code generator for in-store collection."
    },
    {
      q: "Can I white-label the dashboard for my agency?",
      a: "Yes! With our Agency Plan, you can upload your custom logo, configure custom branding colors, generate PDF reports with your own agency header, and invite clients to log into a fully branded interface."
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
                Automate Your Reputation.<br />
                <span className="gradient-text">Grow 5-Star Reviews.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">
                Connect your business profiles, dispatch automated request campaigns via SMS or Email, and let AI craft professional responses in seconds. Get the visibility your business deserves.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="btn-primary px-8 py-4 rounded-xl text-white font-bold text-center text-lg flex items-center justify-center gap-2 group">
                  Start 14-Day Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/demo" className="px-8 py-4 rounded-xl border border-slate-800 bg-slate-950/40 text-slate-300 font-semibold text-center text-lg hover:border-violet-500/40 hover:bg-violet-950/10 transition-all">
                  Book A Live Demo
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

      {/* Core Benefits / Features */}
      <section id="benefits" className="py-24 relative border-t border-slate-950 bg-slate-950/20 z-10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold text-violet-400 tracking-wider uppercase">Value Proposition</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">Designed to Scale Your Local Presence</p>
            <p className="text-slate-400 text-lg">
              Manual review collection takes hours. Let ReviewManagement automate the process from initial transaction to final response.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card rounded-2xl p-8 border border-white/5 relative group">
              <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-6 text-violet-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Save 12+ Hours Weekly</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Automatically generate personalized review responses. Select your brand tone, audit in one click, and push directly to Google and Yelp in real-time.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 border border-white/5 relative group">
              <div className="w-12 h-12 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center mb-6 text-cyan-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Higher Google Maps SEO</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Review frequency, keywords, and response rates are primary factors for local searches. Automatically improve your listing rankings.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 border border-white/5 relative group">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Intercept Negative Feedback</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Create custom landing page filters to capture dissatisfied clients privately, letting your managers resolve complaints before they reach public forums.
              </p>
            </div>
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
                      <span className="text-4xl font-extrabold text-white">${price}</span>
                      <span className="text-slate-500 text-sm"> / mo</span>
                      <div className="text-[10px] text-slate-500 mt-1">
                        {billingPeriod === "yearly" ? `Billed annually ($${price * 12}/yr)` : "Billed monthly"}
                      </div>
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
            Stop Losing Customers to Competitors.<br />
            <span className="gradient-text">Take Control of Your Reputation.</span>
          </h2>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Join thousands of small businesses and agencies using ReviewManagement to turn happy clients into reviews automatically.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link href="/register" className="btn-primary px-8 py-4 rounded-xl text-white font-bold text-lg">
              Start Free 14-Day Trial
            </Link>
            <Link href="/demo" className="px-8 py-4 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 font-semibold hover:border-violet-500/40 hover:bg-violet-950/10 transition-all text-lg">
              Talk to an Expert
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
