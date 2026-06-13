import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  Star, 
  Check, 
  ArrowRight, 
  Sparkles, 
  MessageSquare, 
  LineChart, 
  Mail, 
  Building2, 
  Briefcase 
} from "lucide-react";

interface FeatureDetail {
  slug: string;
  title: string;
  badge: string;
  icon: React.ReactNode;
  description: string;
  benefits: string[];
  screenshotTitle: string;
  useCase: string;
  stats: { value: string; label: string }[];
  visualMockup: React.ReactNode;
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const featuresData: Record<string, FeatureDetail> = {
    "monitoring": {
      slug: "monitoring",
      title: "Real-Time Review Monitoring",
      badge: "Reputation Tracking",
      icon: <MessageSquare className="w-6 h-6 text-violet-400" />,
      description: "Monitor and track customer feedback from Google, Yelp, Facebook, TripAdvisor, and 20+ specialized review sites in one unified dashboard.",
      benefits: [
        "Consolidated Unified Inbox: No more logging into 10 different platforms to read customer feedback.",
        "Real-Time Slack & Email Alerts: Receive push notifications the second a customer leaves a critical rating.",
        "Keyword Highlight Extraction: AI automatically flags common topics like 'staff', 'wait time', or 'pricing'.",
        "Competitor Tracking Matrices: Monitor reviews and ratings of your top 3 local competitors in real-time."
      ],
      screenshotTitle: "Centralized Reputation Inbox",
      useCase: "A restaurant manager filters reviews by 'Critical' on the dashboard. They see a 2-star Yelp complaint, click to reply, and resolve the client's dining issue before they even leave the parking lot.",
      stats: [
        { value: "20+", label: "Integrated Platforms" },
        { value: "< 2m", label: "Notification Delay" },
        { value: "100%", label: "Visibility Control" }
      ],
      visualMockup: (
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6.5 font-sans">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unified Stream</span>
            <span className="flex items-center gap-1.5 text-xs text-violet-400">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
              Live Feed active
            </span>
          </div>
          <div className="space-y-3">
            {[
              { author: "Marcus Vance", rating: 5, platform: "Google", text: "Exceptional service, friendly staff. Highly recommend!", date: "Just now" },
              { author: "Delilah K.", rating: 2, platform: "Yelp", text: "Waited 30 minutes for a table even with reservation.", date: "10 mins ago" },
              { author: "Robert Smith", rating: 4, platform: "Facebook", text: "Solid experience. Will return.", date: "1 hour ago" }
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{item.author}</span>
                  <span className="text-slate-500">{item.date}</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < item.rating ? "text-amber-400 fill-amber-400" : "text-slate-600"}`} />
                    ))}
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-semibold uppercase">{item.platform}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">"{item.text}"</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    "ai-replies": {
      slug: "ai-replies",
      title: "Smart AI-Generated Responses",
      badge: "AI Automation",
      icon: <Sparkles className="w-6 h-6 text-violet-400" />,
      description: "Write context-aware, hyper-personalized review replies in seconds. Seamlessly integrate your custom brand voice.",
      benefits: [
        "Custom Brand Voice Settings: Choose between Professional, Friendly, Empathetic, or upload custom brand directives.",
        "One-Click Dispatch: Review suggestions, click publish, and push directly to Google and Yelp API integrations.",
        "Sentiment-Aware AI Engine: Drafts responses that neutralize negative concerns and celebrate positive feedback.",
        "Multi-lingual Support: Automatically translate and reply to reviews written in other languages."
      ],
      screenshotTitle: "AI Response Composer",
      useCase: "A dental clinic receptionist saves 15 hours per week by auto-generating friendly responses to positive patient testimonials and empathetic notes to critical complaints with a single tap.",
      stats: [
        { value: "3s", label: "Reply Generation" },
        { value: "15 hrs", label: "Weekly Time Saved" },
        { value: "96.4%", label: "Approval Rating" }
      ],
      visualMockup: (
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6.5 font-sans">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tone Presets</span>
            <div className="flex gap-1.5">
              {["Professional", "Friendly", "Empathetic"].map((tone, idx) => (
                <span key={tone} className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${idx === 1 ? "bg-violet-500/10 border-violet-500 text-violet-400" : "bg-white/5 border-white/5 text-slate-400"}`}>
                  {tone}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs">
              <div className="font-bold text-white mb-1">Incoming Review:</div>
              <p className="text-slate-400 italic">"The service was fantastic, but the receptionist was slightly disorganized."</p>
            </div>
            
            <div className="bg-violet-950/20 border border-violet-500/20 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-bounce" />
                <span className="text-xs font-semibold text-white">Suggested Draft (Friendly)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-2.5 rounded border border-white/5">
                "Thank you for the feedback! We're glad you enjoyed the service, and we'll certainly share your feedback with our front desk team to ensure our organization stays top-notch. Hope to see you again soon!"
              </p>
              <div className="flex justify-end gap-2 text-[10px]">
                <button className="px-2 py-1 bg-slate-950 border border-white/10 text-slate-400 rounded">Edit Response</button>
                <button className="px-2.5 py-1 bg-violet-600 text-white rounded font-bold">Approve & Publish</button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    "requests": {
      slug: "requests",
      title: "Automated Review Request Campaigns",
      badge: "Review Collection",
      icon: <Mail className="w-6 h-6 text-violet-400" />,
      description: "Send automated, beautifully designed review invitations via SMS and email. Leverage printable QR codes to capture feedback live.",
      benefits: [
        "SMS & Email Campaigns: Schedule dispatch parameters based on customer check-out or service completion.",
        "Gated Complaints Routing: Capture unsatisfied user feedback privately before it hits Google or Yelp reviews.",
        "Beautiful QR Codes Generator: Embed location-specific QR codes on table cards, menus, or checkout desks.",
        "Customer CRM Integrations: Automatically trigger requests through Zapier or CRM integrations."
      ],
      screenshotTitle: "Campaign Builder Hub",
      useCase: "An HVAC contractor finishes a home repair and hits 'Job Done' in their CRM. ReviewManagement sends a text message 10 minutes later. The client clicks, leaves a 5-star review, boosting the local listing ranking.",
      stats: [
        { value: "250%", label: "Increase in Reviews" },
        { value: "48%", label: "SMS Open Rate" },
        { value: "0%", label: "Credit Card Required" }
      ],
      visualMockup: (
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6.5 font-sans">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SMS Campaign Simulator</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 uppercase font-bold">Active</span>
          </div>
          <div className="space-y-4">
            <div className="max-w-[240px] mx-auto bg-slate-950 rounded-2xl p-4 border border-white/10 shadow-xl relative">
              <div className="w-16 h-4 bg-slate-800 rounded-full mx-auto mb-3.5" />
              <div className="space-y-2 bg-slate-900/90 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-500 block">Sender: ReviewMgmt</span>
                <p className="text-[10px] text-slate-300 leading-normal">
                  "Hi Joshua! Thanks for visiting us today. How was your experience? Leave a review and help us grow: <span className="text-violet-400 underline cursor-pointer">rm.co/g/7k2a</span>"
                </p>
              </div>
              <div className="mt-3.5 text-center text-[9px] text-slate-500">Delivered · Read 2m ago</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-center pt-2">
              <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                <div className="text-slate-500">Total Sent</div>
                <div className="text-white font-bold text-sm mt-0.5">1,248</div>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                <div className="text-slate-500">Conversion Rate</div>
                <div className="text-emerald-400 font-bold text-sm mt-0.5">34.2%</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    "analytics": {
      slug: "analytics",
      title: "Advanced Sentiment & Analytics",
      badge: "Reputation Intelligence",
      icon: <LineChart className="w-6 h-6 text-violet-400" />,
      description: "Gain complete transparency into your customer service quality. Detect rating trends, sentiment charts, and competitor analytics.",
      benefits: [
        "AI Sentiment Trends: Automatically group reviews into positive, neutral, and negative sentiment clusters.",
        "Response Time Metrics: Monitor the speed and frequency of review responses to optimize customer service.",
        "Leaderboards & Competitors: Compare reviews growth curves against three of your closest local competitors.",
        "PDF Automated Reporting: Schedule weekly or monthly email delivery of clean PDF report metrics to stakes."
      ],
      screenshotTitle: "Sentiment Performance Console",
      useCase: "An agency reviews the sentiment analysis grid and notices customer complaints about 'waiting times' increased by 20%. They advise the store owner to adjust staffing, preventing future 1-star reviews.",
      stats: [
        { value: "99.8%", label: "Accuracy Rate" },
        { value: "Daily", label: "Insight Audits" },
        { value: "4.8", label: "Average rating" }
      ],
      visualMockup: (
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6.5 font-sans">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sentiment Breakdown</span>
            <span className="text-[10px] text-emerald-400">Rating: 4.8★</span>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              {[
                { label: "Positive Sentiment (AI)", percent: 84, color: "bg-emerald-500", text: "Excellent, friendly, quick" },
                { label: "Neutral Sentiment (AI)", percent: 12, color: "bg-amber-500", text: "Ok, average, standard" },
                { label: "Negative Sentiment (AI)", percent: 4, color: "bg-rose-500", text: "Slow, rude, expensive" }
              ].map((bar) => (
                <div key={bar.label} className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-300 font-semibold">{bar.label}</span>
                    <span className="text-white font-bold">{bar.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full ${bar.color}`} style={{ width: `${bar.percent}%` }} />
                  </div>
                  <div className="text-[8px] text-slate-500 font-mono">{bar.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    "locations": {
      slug: "locations",
      title: "Multi-Location & Franchise Settings",
      badge: "Multi-Location Scale",
      icon: <Building2 className="w-6 h-6 text-violet-400" />,
      description: "Scale your business reputation across 10 or 1,000 locations. Compare health scores, deploy unified templates, and manage admin roles.",
      benefits: [
        "Franchise Organizational Grid: View all regions, franchise divisions, and locations from one interface.",
        "Store Rating Leaderboard: Compare reputation metrics side-by-side to highlight lagging locations.",
        "Granular Role Assignments: Grant regional managers, local store managers, or read-only viewers access.",
        "Global Template Syncing: Dispatch brand-approved AI response guidelines and request campaigns instantly."
      ],
      screenshotTitle: "Franchise Health Console",
      useCase: "A franchise group owner notes that their Chicago location has an average rating of 4.9, while their Detroit location sits at 3.4. They immediately push Chicago's campaign parameters to Detroit.",
      stats: [
        { value: "Unlimited", label: "Locations" },
        { value: "Global", label: "Configuration" },
        { value: "100%", "label": "Role Security" }
      ],
      visualMockup: (
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6.5 font-sans">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Locations Leaderboard</span>
            <span className="text-[10px] text-slate-400">Total: 12 Stores</span>
          </div>
          <div className="space-y-2.5">
            {[
              { name: "1. Chicago Downtown", rating: "4.9★", reviews: "481 reviews", health: "98/100", healthColor: "text-emerald-400" },
              { name: "2. New York Midtown", rating: "4.7★", reviews: "312 reviews", health: "92/100", healthColor: "text-emerald-400" },
              { name: "3. Detroit Metro", rating: "3.5★", reviews: "89 reviews", health: "58/100", healthColor: "text-rose-400" }
            ].map((loc, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 rounded bg-white/5 border border-white/5 text-xs">
                <div>
                  <div className="font-bold text-white">{loc.name}</div>
                  <div className="text-[10px] text-slate-500">{loc.reviews} · Avg: {loc.rating}</div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${loc.healthColor}`}>{loc.health}</div>
                  <div className="text-[8px] text-slate-500 uppercase tracking-wider">Health</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    "agency": {
      slug: "agency",
      title: "Agency White-Label Portal",
      badge: "Agency Growth",
      icon: <Briefcase className="w-6 h-6 text-violet-400" />,
      description: "Scale client retention and build a recurring revenue stream. Offer state-of-the-art reputation management fully branded under your agency.",
      benefits: [
        "100% White-Label Branding: Insert custom logo, select colors, add a custom domain, and style email alerts.",
        "Granular Client Portals: Set up isolated logins for each client business owner with view-only or manager privileges.",
        "Scheduled PDF Dispatch: Automatically send white-labeled reviews progress reports with custom client headers.",
        "Add-On Recurring SaaS Revenue: Package reputation management into your client marketing retainers for passive MRR."
      ],
      screenshotTitle: "Whitelabel Client Dashboard",
      useCase: "A digital marketing agency configures their branding on our Agency plan. They upsell 15 clients a reputation management package at $199/month, adding $2,985 in recurring margins.",
      stats: [
        { value: "100%", label: "White-Labeled" },
        { value: "24/7", label: "Client Access" },
        { value: "+$3k", label: "Average Extra MRR" }
      ],
      visualMockup: (
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6.5 font-sans">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="w-5.5 h-5.5 rounded bg-violet-600 flex items-center justify-center font-bold text-[10px] text-white">VP</span>
              <span className="text-xs font-semibold text-white">Vanguard Partners Agency</span>
            </div>
            <span className="text-[9px] text-slate-500 font-mono">whitelabel active</span>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center text-xs">
              <div className="text-slate-400 font-medium mb-1">Custom Branding Configuration</div>
              <div className="text-[10px] text-violet-400 font-mono">dashboard.vanguardpartners.com</div>
            </div>

            <div className="border border-white/5 p-3 rounded-xl bg-slate-950/80 space-y-2">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Client PDF Report preview</div>
              <div className="h-10 bg-slate-900 rounded border border-white/5 flex items-center justify-between px-3 text-[9px] text-slate-300">
                <span>Vanguard Partners Monthly Report</span>
                <span className="font-bold text-emerald-400">Download PDF</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  const feature = featuresData[slug];

  if (!feature) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#080B14] relative overflow-hidden noise-overlay">
      <div className="absolute inset-0 mesh-gradient opacity-80" />

      {/* Hero Header */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden z-10">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Column Description */}
            <div className="flex-1 text-left space-y-8 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold text-violet-300 backdrop-blur-md">
                {feature.badge}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                {feature.title}
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Action */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/register" className="btn-primary px-8 py-4 rounded-xl text-white font-bold text-center text-lg flex items-center justify-center gap-2 group">
                  Start Free 14-Day Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/demo" className="px-8 py-4 rounded-xl border border-slate-800 bg-slate-950/40 text-slate-300 font-semibold text-center text-lg hover:border-violet-500/40 hover:bg-violet-950/10 transition-all">
                  Request Private Demo
                </Link>
              </div>

              {/* Micro Stats */}
              <div className="pt-8 border-t border-slate-900 grid grid-cols-3 gap-6">
                {feature.stats.map((stat, idx) => (
                  <div key={idx}>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white">{stat.value}</div>
                    <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column Visual Mockup */}
            <div className="flex-1 w-full relative max-w-lg mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl blur-xl opacity-20" />
              
              <div className="relative glass-card border border-white/10 rounded-2xl p-5 shadow-2xl bg-slate-950/80">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-slate-500 font-mono ml-2">Preview Panel · {feature.screenshotTitle}</span>
                </div>
                {feature.visualMockup}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Deep-dive Benefits */}
      <section className="py-24 relative border-t border-slate-950 bg-slate-950/20 z-10">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* Bullet Point Benefits */}
            <div className="space-y-8">
              <h2 className="text-3xl font-extrabold text-white">What You Can Do</h2>
              <ul className="space-y-4">
                {feature.benefits.map((benefit, idx) => {
                  const [title, desc] = benefit.split(": ");
                  return (
                    <li key={idx} className="flex gap-3 text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 text-violet-400 mt-1">
                        <Check className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="font-bold text-white text-sm block">{title}</span>
                        {desc && <span className="text-xs text-slate-400 leading-relaxed block mt-1">{desc}</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Structured Real-world Use Case */}
            <div className="glass-card rounded-2xl p-8 border border-white/5 bg-slate-950/40 relative flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-6">
                  <Sparkles className="w-4 h-4" />
                  Real-world Use Case
                </div>
                <h3 className="text-xl font-bold text-white mb-3">How it works in practice</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  "{feature.useCase}"
                </p>
              </div>

              <div className="pt-8 border-t border-slate-900 mt-8 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">Module active for all plans</span>
                <Link href="/register" className="text-xs text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1 group">
                  Try it now
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Secondary CTA */}
      <section className="py-24 relative overflow-hidden z-10 border-t border-slate-950">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-3xl space-y-6">
          <h2 className="text-3xl font-extrabold text-white">Boost Your Reputation Today</h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Get instant access to this and all other automated modules. Set up in less than 15 minutes, with full Google and Facebook integrations.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="btn-primary px-8 py-3.5 rounded-xl text-white font-bold text-sm">
              Start Free 14-Day Trial
            </Link>
            <Link href="/pricing" className="px-8 py-3.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-400 font-semibold text-sm hover:text-white hover:border-violet-500/40 transition-all">
              Compare Pricing Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
