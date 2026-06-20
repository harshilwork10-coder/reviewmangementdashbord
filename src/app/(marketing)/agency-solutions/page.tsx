import { Metadata } from "next";
import { CheckCircle2, Star, Shield, ArrowRight, Briefcase, BarChart2, Coins, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Agency Review Management Solutions | ReviewManagement",
    description: "Scale your agency operations. Manage multiple clients, track campaign performance, create recurring revenue streams, and scale reputation services.",
};

export default function AgencySolutionsPage() {
    const highlights = [
        {
            title: "Manage Multiple Clients",
            description: "Oversee all customer profiles, integrations, and review campaigns from a single centralized parent dashboard.",
            icon: Briefcase,
            color: "from-blue-500/10 to-indigo-500/5",
            border: "border-blue-500/20",
            iconColor: "text-blue-400"
        },
        {
            title: "Track Campaign Performance",
            description: "Analyze deliverability, open rates, and conversion metrics across multiple accounts and send white-label PDF reports.",
            icon: BarChart2,
            color: "from-indigo-500/10 to-violet-500/5",
            border: "border-indigo-500/20",
            iconColor: "text-indigo-400"
        },
        {
            title: "Create Recurring Revenue",
            description: "Package reputation management services into monthly retainer subscriptions for your clients to increase agency LTV.",
            icon: Coins,
            color: "from-violet-500/10 to-purple-500/5",
            border: "border-violet-500/20",
            iconColor: "text-violet-400"
        },
        {
            title: "Scale Services Efficiently",
            description: "Automate onboarding, templates, and campaign setups to support hundreds of client locations without manual overhead.",
            icon: TrendingUp,
            color: "from-emerald-500/10 to-teal-500/5",
            border: "border-emerald-500/20",
            iconColor: "text-emerald-400"
        }
    ];

    return (
        <div className="min-h-screen bg-[#080B14] text-slate-100 font-sans pb-24 overflow-hidden relative">
            {/* Background Orbs */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Hero Section */}
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 border-b border-white/5 bg-white/[0.01]">
                <div className="container mx-auto px-6 max-w-6xl text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-6">
                        <Shield className="w-3.5 h-3.5" /> For Agencies & Multi-location
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-violet-400 leading-tight mb-6">
                        Scale Client Reputation
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        The ultimate agency dashboard for managing client reviews on autopilot. Create white-label solutions, track analytics, and generate recurring monthly revenue.
                    </p>
                </div>
            </section>

            {/* Feature Cards Grid */}
            <section className="container mx-auto px-6 max-w-6xl mt-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {highlights.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div 
                                key={idx} 
                                className={`p-8 rounded-3xl border ${item.border} bg-gradient-to-br ${item.color} space-y-4 hover:border-violet-500/30 hover:bg-white/[0.02] transition-all duration-300`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${item.iconColor}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed pt-2">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Call to Action */}
            <section className="container mx-auto px-6 max-w-6xl mt-20">
                <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <div className="flex gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="w-4.5 h-4.5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Scale Your Agency Offerings</h2>
                        <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                            Sign up for the Agency Plan to access multi-client tenant control, custom sub-dashboards, and automatic PDF reports.
                        </p>
                    </div>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-base hover:opacity-95 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-98 transition-all duration-300 whitespace-nowrap flex-shrink-0"
                    >
                        Start Your Free Trial <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
