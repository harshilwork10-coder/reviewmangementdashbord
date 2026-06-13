import Link from "next/link";
import { Star, ArrowRight, Quote, Trophy, TrendingUp, Users, Sparkles } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Case Studies & Success Stories | ReviewManagement",
  description: "Read real stories of how local businesses and agencies used ReviewManagement to collect reviews, boost SEO rankings, and grow revenue.",
};

const caseStudiesList = [
  {
    title: "How Bistro 87 Doubled Bookings Using Autopilot Reviews",
    slug: "restaurant-success",
    industry: "Restaurant",
    clientName: "Bistro 87",
    summary: "Collected 450+ 5-star reviews on Google and Yelp in 3 months by automating post-dining text message requests.",
    metric: "+120% Bookings",
    icon: <TrendingUp className="w-5 h-5 text-emerald-400" />
  },
  {
    title: "Patient Acquisition and HIPAA Compliance: BrightSmile Dental",
    slug: "healthcare-success",
    industry: "Healthcare",
    clientName: "BrightSmile Dental",
    summary: "Dr. Amanda L. increased local clinic patient referrals by 125% while maintaining HIPAA-compliant response workflows.",
    metric: "125% Patient Growth",
    icon: <Users className="w-5 h-5 text-violet-400" />
  },
  {
    title: "How Urban Styles Boutique Captured Doorstep Reviews at Checkout",
    slug: "retail-success",
    industry: "Retail",
    clientName: "Urban Styles Boutique",
    summary: "Capturing in-store reviews using printed receipt QR codes, leading to a 300% growth in positive Google listings.",
    metric: "3x Review Volume",
    icon: <Trophy className="w-5 h-5 text-cyan-400" />
  },
  {
    title: "Scaling Agency Value and MRR: Vanguard Partners",
    slug: "agency-success",
    industry: "Marketing Agency",
    clientName: "Vanguard Partners",
    summary: "Upselling white-labeled reputation packages to 25 local clients, increasing agency recurring revenue by $3k+/mo.",
    metric: "+$2,985 MRR",
    icon: <Sparkles className="w-5 h-5 text-amber-400" />
  }
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-[#080B14] relative overflow-hidden noise-overlay">
      <div className="absolute inset-0 mesh-gradient opacity-60 pointer-events-none" />

      {/* Case Studies Header */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 z-10">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold text-violet-300">
            Proven Results
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Client <span className="gradient-text">Success Stories</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover how local businesses, clinics, and marketing agencies scale their visibility and reviews using our platform.
          </p>
        </div>
      </section>

      {/* Case Studies Cards List */}
      <section className="py-12 pb-24 relative z-10">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudiesList.map((cs) => (
              <div 
                key={cs.slug}
                className="glass-card border border-white/5 rounded-2xl p-6.5 flex flex-col justify-between hover:border-violet-500/30 transition-all bg-slate-950/40 relative group"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
                      {cs.industry}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{cs.clientName}</span>
                  </div>

                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-violet-400 transition-colors">
                    {cs.title}
                  </h2>

                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                    {cs.summary}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-900 mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      {cs.icon}
                    </div>
                    <span className="text-sm font-extrabold">{cs.metric}</span>
                  </div>
                  
                  <Link 
                    href={`/case-studies/${cs.slug}`}
                    className="text-xs font-bold text-violet-400 group-hover:text-violet-300 flex items-center gap-1 group/btn"
                  >
                    Read Story
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-all" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
