import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, X, Star, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

interface ComparisonData {
  competitor: string;
  tagline: string;
  pricingUs: string;
  pricingThem: string;
  bullets: string[];
  features: {
    name: string;
    us: boolean | string;
    them: boolean | string;
    note?: string;
  }[];
}

export default async function ComparePage({ params }: { params: Promise<{ competitor: string }> }) {
  const { competitor } = await params;

  const comparisons: Record<string, ComparisonData> = {
    "podium": {
      competitor: "Podium",
      tagline: "Get a modern, feature-rich reputation dashboard at a fraction of Podium's price.",
      pricingUs: "$49 - $299/mo",
      pricingThem: "$249 - $599/mo",
      bullets: [
        "No long-term contracts: Podium demands rigid annual commitments. Cancel ReviewManagement at any time.",
        "Agency White Labeling: Rebrand the dashboard for clients—something Podium does not support.",
        "Smart AI Replies: Leverage specialized tone-specific AI suggestions instead of plain templated shortcuts.",
        "Fast self-serve setup: Go live in 15 minutes, bypassing painful sales onboarding calls."
      ],
      features: [
        { name: "Starting Cost", us: "$49/mo", them: "$249/mo", note: "Save up to $2,400+ annually" },
        { name: "Contract Commitment", us: "None", them: "Annual Lock", note: "Flexible monthly options" },
        { name: "AI response writer", us: true, them: true, note: "Our AI supports 4 distinct tones" },
        { name: "White-label branding", us: true, them: false, note: "Essential for marketing agencies" },
        { name: "Gated Negative Reviews", us: true, them: false, note: "Intercept bad reviews privately first" },
        { name: "SMS Campaigns", us: true, them: true, note: "SMS dispatch is fully integrated" }
      ]
    },
    "birdeye": {
      competitor: "Birdeye",
      tagline: "All the enterprise power, none of the setup friction or hidden fees.",
      pricingUs: "$99/mo (Growth plan)",
      pricingThem: "$350+/mo (Standard)",
      bullets: [
        "Transparent billing: No hidden activation fees or surprise API request charges.",
        "Instant setup: Simply link your Google Business Profiles and start campaign dispatches in minutes.",
        "Custom Brand Tones: Train our AI on your brand guidelines to draft highly relevant client replies.",
        "Optimized for agencies: White-labeled dashboards, client portals, and automated PDF report scheduling."
      ],
      features: [
        { name: "Monthly Pricing", us: "$99/mo", them: "$350+/mo", note: "Save over $3,000 every year" },
        { name: "Onboarding Time", us: "15 minutes", them: "2+ Weeks", note: "Self-serve vs slow sales calls" },
        { name: "AI Reply Center", us: true, them: true, note: "Drafts review responses in seconds" },
        { name: "Agency White-Label", us: true, them: false, note: "Add client portals under your logo" },
        { name: "Interactive QR codes", us: true, them: false, note: "Print local review collect cards" },
        { name: "HIPAA-Compliant Replies", us: true, them: true, note: "Safety filters for medical accounts" }
      ]
    },
    "nicejob": {
      competitor: "NiceJob",
      tagline: "Move past basic review gathering into professional multi-location control and agency expansion.",
      pricingUs: "$49 - $99/mo",
      pricingThem: "$75 - $175/mo",
      bullets: [
        "Multi-location leadership: Compare ratings and review velocities across all branches.",
        "Brand Voice replies: Auto-generate replies that match your specific voice (NiceJob uses basic shortcuts).",
        "White label capabilities: Present our platform under your logo to clients to grow agency value.",
        "Advanced Gated Forms: Filter out disgruntled customer concerns to keep listings clean."
      ],
      features: [
        { name: "Multi-location support", us: true, them: false, note: "Centralized regional management" },
        { name: "AI Reply Customization", us: true, them: false, note: "NiceJob does not support custom AI voices" },
        { name: "Agency Whitelabeling", us: true, them: false, note: "Present the platform under your brand" },
        { name: "Centralized SMS & Email", us: true, them: true, note: "Collect reviews through dual channels" },
        { name: "Negative feedback gates", us: true, them: false, note: "Resolve issues privately first" }
      ]
    },
    "grade.us": {
      competitor: "Grade.us",
      tagline: "A simpler, more intuitive agency review builder without the steep learning curve.",
      pricingUs: "$299/mo (Agency Plan)",
      pricingThem: "$180 - $350/mo (Standard Agency)",
      bullets: [
        "No complex hierarchy: Grade.us setups require deep nested organization. We keep client sub-accounts simple.",
        "Modern AI reply integration: ReviewManagement has tone-specific AI generation; Grade.us relies on pre-saved snippets.",
        "Intuitive self-serve UI: Help clients navigate their dashboards without providing hours of hands-on training.",
        "Frictionless SMS campaigns: Trigger text review invites directly from client contact spreadsheets in seconds."
      ],
      features: [
        { name: "Starting Cost", us: "$299/mo (10 clients)", them: "$180/mo (3 clients)", note: "We offer better scaling margins" },
        { name: "Learning Curve", us: "Under 15 mins", them: "Steep / Complex", note: "Bypass intensive client training" },
        { name: "AI reply helper", us: true, them: false, note: "Grade.us lacks tone-based AI replying" },
        { name: "Agency Whitelabeling", us: true, them: true, note: "Both systems support white labeling" },
        { name: "Multi-location reports", us: true, them: true, note: "Track performance across accounts" }
      ]
    },
    "grade": {
      competitor: "Grade.us",
      tagline: "A simpler, more intuitive agency review builder without the steep learning curve.",
      pricingUs: "$299/mo (Agency Plan)",
      pricingThem: "$180 - $350/mo (Standard Agency)",
      bullets: [
        "No complex hierarchy: Grade.us setups require deep nested organization. We keep client sub-accounts simple.",
        "Modern AI reply integration: ReviewManagement has tone-specific AI generation; Grade.us relies on pre-saved snippets.",
        "Intuitive self-serve UI: Help clients navigate their dashboards without providing hours of training.",
        "Frictionless SMS campaigns: Trigger text review invites directly from client contact spreadsheets in seconds."
      ],
      features: [
        { name: "Starting Cost", us: "$299/mo (10 clients)", them: "$180/mo (3 clients)", note: "We offer better scaling margins" },
        { name: "Learning Curve", us: "Under 15 mins", them: "Steep / Complex", note: "Bypass intensive client training" },
        { name: "AI reply helper", us: true, them: false, note: "Grade.us lacks tone-based AI replying" },
        { name: "Agency Whitelabeling", us: true, them: true, note: "Both systems support white labeling" },
        { name: "Multi-location reports", us: true, them: true, note: "Track performance across accounts" }
      ]
    },
    "broadly": {
      competitor: "Broadly",
      tagline: "Automate your local business operations without the high entry pricing of Broadly.",
      pricingUs: "$49 - $299/mo",
      pricingThem: "$200 - $350/mo",
      bullets: [
        "Cost Efficiency: Start collecting reviews for just $49/mo compared to Broadly's expensive entry tiers.",
        "Smart AI Assistant: Generate context-aware review replies in multiple tones instantly.",
        "No Contract Commitments: Month-to-month flexibility. Cancel whenever you wish.",
        "Custom Brand Voices: Define and train the AI on your specific terminology."
      ],
      features: [
        { name: "Starting Cost", us: "$49/mo", them: "$200/mo", note: "Save over $1,800+ annually" },
        { name: "Contract Commitment", us: "None", them: "Annual Lock", note: "Bypass rigid long-term commitments" },
        { name: "AI reply helper", us: true, them: false, note: "Broadly lacks tone-based AI responders" },
        { name: "White-label branding", us: true, them: false, note: "Keep agency brand intact" },
        { name: "Gated Negative Reviews", us: true, them: false, note: "Resolve issues privately" },
        { name: "SMS Campaigns", us: true, them: true, note: "Collect reviews via text messages" }
      ]
    },
    "reputation": {
      competitor: "Reputation.com",
      tagline: "Enterprise multi-location oversight with none of the hidden API fees or software complexity.",
      pricingUs: "$99 - $299/mo",
      pricingThem: "$450+/mo",
      bullets: [
        "Pricing Transparency: Clear, upfront billing with zero hidden set-up fees or API requests surcharges.",
        "Rapid Onboarding: Sync listings and launch campaign flows in under 15 minutes.",
        "Modern AI replying: Tap friendly/empathetic AI templates rather than generic enterprise forms.",
        "No Contract Lockups: Control your subscription on your own terms."
      ],
      features: [
        { name: "Starting Cost", us: "$99/mo", them: "$450/mo", note: "Save $4,200+ annually per store" },
        { name: "Self-serve onboarding", us: "15 minutes", them: "2-4 Weeks", note: "Instant dashboard activation" },
        { name: "AI Reply suggestions", us: true, them: true, note: "We support customized brand voice directives" },
        { name: "White-Label Portal", us: true, them: false, note: "Offer software under your agency name" },
        { name: "Interactive QR flyer", us: true, them: false, note: "Generate local check-out scan templates" }
      ]
    },
    "reputation.com": {
      competitor: "Reputation.com",
      tagline: "Enterprise multi-location oversight with none of the hidden API fees or software complexity.",
      pricingUs: "$99 - $299/mo",
      pricingThem: "$450+/mo",
      bullets: [
        "Pricing Transparency: Clear, upfront billing with zero hidden set-up fees or API requests surcharges.",
        "Rapid Onboarding: Sync listings and launch campaign flows in under 15 minutes.",
        "Modern AI replying: Tap friendly/empathetic AI templates rather than generic enterprise forms.",
        "No Contract Lockups: Control your subscription on your own terms."
      ],
      features: [
        { name: "Starting Cost", us: "$99/mo", them: "$450/mo", note: "Save $4,200+ annually per store" },
        { name: "Self-serve onboarding", us: "15 minutes", them: "2-4 Weeks", note: "Instant dashboard activation" },
        { name: "AI Reply suggestions", us: true, them: true, note: "We support customized brand voice directives" },
        { name: "White-Label Portal", us: true, them: false, note: "Offer software under your agency name" },
        { name: "Interactive QR flyer", us: true, them: false, note: "Generate local check-out scan templates" }
      ]
    }
  };

  const comp = comparisons[competitor.toLowerCase()];

  if (!comp) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#080B14] relative overflow-hidden noise-overlay">
      <div className="absolute inset-0 mesh-gradient opacity-60 pointer-events-none" />

      {/* Compare Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden z-10">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-semibold text-cyan-300">
            Platform Comparison
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            ReviewManagement vs <span className="gradient-text">{comp.competitor}</span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            {comp.tagline}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link href="/register" className="btn-primary px-8 py-3.5 rounded-xl text-white font-bold text-sm">
              Start Free 14-Day Trial
            </Link>
            <Link href="/demo" className="px-8 py-3.5 rounded-xl border border-slate-800 bg-slate-950/40 text-slate-300 font-semibold hover:border-violet-500/40 transition-all text-sm">
              Book A Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Grid & Matrix */}
      <section className="py-20 relative z-10 border-t border-slate-950 bg-slate-950/20">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          
          {/* Bullet Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold text-white">Why Businesses Switch</h2>
              <ul className="space-y-4">
                {comp.bullets.map((bullet, idx) => {
                  const [bold, rest] = bullet.split(": ");
                  return (
                    <li key={idx} className="flex items-start gap-3 text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 text-violet-400 mt-1">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong className="text-white font-semibold text-sm block">{bold}</strong>
                        <span className="text-xs text-slate-400 block mt-0.5">{rest}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="glass-card border border-white/5 bg-slate-950/40 rounded-2xl p-6.5 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Pricing Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-sm font-semibold text-slate-300">ReviewManagement</span>
                    <span className="text-sm font-bold text-emerald-400">{comp.pricingUs}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-sm text-slate-400">{comp.competitor}</span>
                    <span className="text-sm font-bold text-rose-400">{comp.pricingThem}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                  ReviewManagement is priced to support local businesses and scaling marketing agencies. We don't charge hidden onboarding fees.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-900 mt-6">
                <Link href="/pricing" className="text-xs text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1 group">
                  View Full Pricing Chart
                  <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>
          </div>

          {/* Side by Side Matrix */}
          <div className="glass-card border border-white/10 rounded-2xl overflow-hidden bg-slate-950/80 shadow-2xl">
            <div className="px-6 py-4.5 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Features Side-by-Side</span>
              <span className="text-[10px] text-slate-500">Last updated: 2026</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-white/5 bg-slate-950">
                    <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Feature capability</th>
                    <th className="p-4.5 text-xs font-bold text-violet-400 uppercase text-center bg-violet-950/20">ReviewManagement</th>
                    <th className="p-4.5 text-xs font-bold text-slate-400 uppercase text-center">{comp.competitor}</th>
                    <th className="p-4.5 text-xs font-bold text-slate-500 uppercase">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {comp.features.map((feat, idx) => (
                    <tr key={idx} className="hover:bg-white/2">
                      <td className="p-4.5 text-sm font-semibold text-white">{feat.name}</td>
                      <td className="p-4.5 text-center bg-violet-950/10">
                        {typeof feat.us === "boolean" ? (
                          feat.us ? (
                            <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-slate-600 mx-auto" />
                          )
                        ) : (
                          <span className="text-xs font-bold text-emerald-400">{feat.us}</span>
                        )}
                      </td>
                      <td className="p-4.5 text-center">
                        {typeof feat.them === "boolean" ? (
                          feat.them ? (
                            <Check className="w-4.5 h-4.5 text-slate-400 mx-auto" />
                          ) : (
                            <X className="w-4.5 h-4.5 text-slate-600 mx-auto" />
                          )
                        ) : (
                          <span className="text-xs font-semibold text-slate-400">{feat.them}</span>
                        )}
                      </td>
                      <td className="p-4.5 text-xs text-slate-400">{feat.note || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Box */}
      <section className="py-24 relative overflow-hidden z-10 border-t border-slate-950">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-3xl space-y-6">
          <h2 className="text-3xl font-extrabold text-white">Switch to ReviewManagement Risk-Free</h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Ready to import your reviews and save hundreds of dollars a month? We offer free migration services. We will transfer all your reviews campaign contacts and settings in 24 hours.
          </p>
          <div className="pt-4">
            <Link href="/register" className="btn-primary px-8 py-3.5 rounded-xl text-white font-bold text-sm">
              Start Free 14-Day Trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
