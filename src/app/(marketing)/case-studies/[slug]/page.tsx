import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, ArrowLeft, ArrowRight, Quote, Shield, Award, Sparkles, Heart } from "lucide-react";

interface CaseStudyDetails {
  slug: string;
  title: string;
  industry: string;
  clientName: string;
  metricLabel: string;
  metricValue: string;
  challenge: string;
  solution: string;
  results: string;
  quote: string;
  author: string;
  role: string;
  visualHighlight: React.ReactNode;
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const caseStudiesData: Record<string, CaseStudyDetails> = {
    "restaurant-success": {
      slug: "restaurant-success",
      title: "How Bistro 87 Doubled Bookings Using Autopilot Reviews",
      industry: "Restaurant",
      clientName: "Bistro 87",
      metricLabel: "Increase in Reservations",
      metricValue: "+120%",
      challenge: "Bistro 87 had exceptional cuisine and regular diners, but a low digital footprint. Their Google listing had only 42 reviews and averaged 3.8 stars. Because of this, lower-quality restaurants with higher review counts consistently outranked Bistro 87 in Google Maps search listings, diverting new local customers.",
      solution: "Bistro 87 integrated their Point-of-Sale (POS) terminal to ReviewManagement to automatically trigger review invitations via SMS 45 minutes after checking out. They also deployed our gated complaints filter, capturing negative dining comments in an internal feedback system rather than on public sites, allowing staff to call guests to apologize and offer discounts.",
      results: "Over 90 days, Bistro 87's rating increased from 3.8★ to 4.7★. They generated 481 new reviews, making them the top-rated bistro in the neighborhood. Bistro 87's Google Maps visibility climbed, driving a 120% growth in weekly reservation requests.",
      quote: "We went from page four of local search results to the top spot. We are fully booked almost every weekend now, and the reviews system runs completely on autopilot.",
      author: "Marco S.",
      role: "General Manager, Bistro 87",
      visualHighlight: (
        <div className="space-y-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4.5 text-center">
            <div className="text-3xl font-extrabold text-emerald-400">4.7★</div>
            <div className="text-xs text-slate-400 mt-1">New Average rating (up from 3.8)</div>
          </div>
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 flex justify-between text-xs">
            <div>
              <div className="text-slate-500">Before</div>
              <div className="text-white font-bold mt-0.5">42 Reviews</div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 font-bold">After</div>
              <div className="text-white font-bold mt-0.5">523 Reviews</div>
            </div>
          </div>
        </div>
      )
    },
    "healthcare-success": {
      slug: "healthcare-success",
      title: "Patient Acquisition and HIPAA Compliance: BrightSmile Dental",
      industry: "Healthcare",
      clientName: "BrightSmile Dental",
      metricLabel: "Patient growth rate",
      metricValue: "125%",
      challenge: "BrightSmile Dental wanted to increase patient referrals. However, they were concerned about HIPAA compliance guidelines when requesting client reviews. Receptionists spent hours manually responding to patient feedback, diverting time from patient care.",
      solution: "The clinic connected patient management software to ReviewManagement, scheduling automated patient invitations via email. They trained their response assistants using our HIPAA-safe AI Reply Center filters, guaranteeing public responses never disclosed patient names or clinical operations.",
      results: "The practice increased total reviews to 350, maintaining patient privacy. Response times decreased from days to seconds, saving the receptionist 15 hours weekly, while new client phone calls increased by 125%.",
      quote: "We were afraid of HIPAA issues, but ReviewManagement's privacy safeguards solved our fears. Our patient review count has doubled, and response management is now a breeze.",
      author: "Dr. Amanda L.",
      role: "Lead Dentist, BrightSmile Dental",
      visualHighlight: (
        <div className="space-y-4">
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-4.5 text-center">
            <div className="text-3xl font-extrabold text-violet-400">15 hrs</div>
            <div className="text-xs text-slate-400 mt-1">Weekly receptionist time saved</div>
          </div>
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 text-center text-xs">
            <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
              <Shield className="w-3.5 h-3.5" /> HIPAA Compliance Filter Active
            </span>
          </div>
        </div>
      )
    },
    "retail-success": {
      slug: "retail-success",
      title: "How Urban Styles Boutique Captured Doorstep Reviews at Checkout",
      industry: "Retail",
      clientName: "Urban Styles Boutique",
      metricLabel: "Review volume growth",
      metricValue: "3x More",
      challenge: "Urban Styles Boutique had thousands of walk-in customers but only 15 reviews on Google. Happy shoppers left without reviewing, leaving the brand vulnerable to random 1-star complaints.",
      solution: "The store configured print receipt checkout cards containing customized QR codes. They also activated our automated email invitations linked with POS transactions.",
      results: "Boutique managers generated 254 new reviews in 60 days, maintaining a 4.9★ rating. The storefront's Google Maps impressions increased to 12,000 monthly, boosting walk-in traffic by 35%.",
      quote: "Customers scan the QR code right at our checkout desk. ReviewManagement made it incredibly easy for happy shoppers to review us instantly.",
      author: "Chloe R.",
      role: "Owner, Urban Styles Boutique",
      visualHighlight: (
        <div className="space-y-4">
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4.5 text-center">
            <div className="text-3xl font-extrabold text-cyan-400">12k</div>
            <div className="text-xs text-slate-400 mt-1">Monthly Google Search impressions</div>
          </div>
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 text-center text-xs">
            <span className="text-slate-300">QR Code Scan Conversion: <strong className="text-emerald-400 font-bold">28.4%</strong></span>
          </div>
        </div>
      )
    },
    "agency-success": {
      slug: "agency-success",
      title: "Scaling Agency Value and MRR: Vanguard Partners",
      industry: "Marketing Agency",
      clientName: "Vanguard Partners",
      metricLabel: "Agency recurring revenue",
      metricValue: "+$2,985",
      challenge: "Vanguard Partners wanted a high-margin, scalable software solution to bundle with their local SEO retainers. They needed a client-facing portal branded entirely under their own logo and domain.",
      solution: "They set up our 100% White-Label Agency plan, configuring branded client log-ins, customized dashboard colors, and automated PDF progress report dispatch.",
      results: "They onboarded 15 clients at $199/month, adding $2,985 in recurring SaaS margin with virtually zero support overhead.",
      quote: "Our clients love logging into our branded reputation portal. ReviewManagement gave us a premium software product to sell under our agency brand with zero development costs.",
      author: "Liam T.",
      role: "Partner, Vanguard Partners",
      visualHighlight: (
        <div className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4.5 text-center">
            <div className="text-3xl font-extrabold text-amber-400">+$2,985</div>
            <div className="text-xs text-slate-400 mt-1">Monthly recurring margin added</div>
          </div>
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 text-center text-xs">
            <span className="text-slate-300">Client retention rate: <strong className="text-emerald-400 font-bold">98.2%</strong></span>
          </div>
        </div>
      )
    }
  };

  const cs = caseStudiesData[slug];

  if (!cs) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#080B14] relative overflow-hidden noise-overlay">
      <div className="absolute inset-0 mesh-gradient opacity-60 pointer-events-none" />

      {/* Navigation breadcrumb */}
      <div className="container mx-auto px-6 lg:px-8 max-w-4xl pt-32 pb-4 z-10 relative">
        <Link href="/case-studies" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors group">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Case Studies Hub
        </Link>
      </div>

      {/* Case Study details */}
      <section className="relative pb-24 z-10">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl space-y-12">
          
          {/* Header Title */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
                {cs.industry} Case Study
              </span>
              <span className="text-xs text-slate-500">Client: {cs.clientName}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              {cs.title}
            </h1>
          </div>

          {/* Key Metrics and Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              
              {/* Challenge */}
              <div className="space-y-3.5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  The Challenge
                </h2>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  {cs.challenge}
                </p>
              </div>

              {/* Solution */}
              <div className="space-y-3.5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  The Solution
                </h2>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  {cs.solution}
                </p>
              </div>

              {/* Results */}
              <div className="space-y-3.5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  The Results
                </h2>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  {cs.results}
                </p>
              </div>

            </div>

            {/* Sidebar Metric card */}
            <div className="space-y-6">
              <div className="glass-card border border-white/10 rounded-2xl p-6.5 bg-slate-950/80 shadow-2xl relative">
                <div className="absolute top-2 right-2 text-violet-400">
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-500 font-medium">{cs.metricLabel}</div>
                <div className="text-4xl font-extrabold text-white mt-1">{cs.metricValue}</div>
                
                <div className="pt-6 border-t border-slate-900 mt-6">
                  {cs.visualHighlight}
                </div>
              </div>

              {/* Testimonial Quote */}
              <div className="glass-card border border-white/5 rounded-2xl p-6.5 bg-slate-950/40 italic text-slate-300 text-xs sm:text-sm leading-relaxed relative">
                <Quote className="w-8 h-8 text-violet-500/10 absolute -top-2 -left-1" />
                <p className="relative z-10">
                  "{cs.quote}"
                </p>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-900 not-italic">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center font-bold text-violet-300 text-xs">
                    {cs.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">{cs.author}</div>
                    <div className="text-[10px] text-slate-500">{cs.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* final CTA */}
      <section className="py-20 relative overflow-hidden z-10 border-t border-slate-950">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-3xl space-y-6">
          <h2 className="text-3xl font-extrabold text-white">Achieve Similar Results for Your Brand</h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Get started today. Setup takes under 15 minutes, and we provide automated migration support to help transfer client rosters from other platforms.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="btn-primary px-8 py-3.5 rounded-xl text-white font-bold text-sm">
              Start Free 14-Day Trial
            </Link>
            <Link href="/demo" className="px-8 py-3.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-400 font-semibold text-sm hover:text-white hover:border-violet-500/40 transition-all">
              Book A Live Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
