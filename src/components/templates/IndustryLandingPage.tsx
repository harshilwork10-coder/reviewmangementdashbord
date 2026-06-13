import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Star, ArrowRight, ShieldAlert, Sparkles, Trophy } from "lucide-react";

interface Challenge {
    title: string;
    description: string;
}

interface Strategy {
    title: string;
    description: string;
}

interface CaseStudy {
    metric: string;
    result: string;
    quote: string;
    author: string;
    role: string;
}

interface IndustryLandingPageProps {
    industry: string;
    title: string;
    description: string;
    challenges?: Challenge[];
    strategies?: Strategy[];
    caseStudy?: CaseStudy;
}

export function IndustryLandingPage({ 
    industry, 
    title, 
    description,
    challenges,
    strategies,
    caseStudy
}: IndustryLandingPageProps) {
    const defaultBenefits = [
        `Get more reviews from ${industry} customers`,
        `Boost your local SEO ranking for '${industry} near me'`,
        "Manage feedback across Google, Yelp, and Facebook",
        "Increase customer trust and loyalty",
        "Automate review requests after service",
        "Showcase your best reviews on your website"
    ];

    const finalChallenges = challenges || [
        { title: "Low Review Volume", description: `Customers love your ${industry.toLowerCase()} service but forget to leave feedback online.` },
        { title: "Negative Bias", description: "Unhappy customers are highly motivated to write bad reviews, while happy ones stay silent." },
        { title: "Yelp & Google Rules", description: "Navigating complex platform guidelines without getting accounts flagged." }
    ];

    const finalStrategies = strategies || [
        { title: "Instant SMS Dispatch", description: "Text clients a direct reviews link immediately after their service completion." },
        { title: "QR Code Checkout Cards", description: "Empower front desk staff with printed custom QR codes to capture reviews live." },
        { title: "AI Neutralizer Reply", description: "Respond to negative notes instantly with empathetic, professional templates." }
    ];

    const finalCaseStudy = caseStudy || {
        metric: "200% Growth",
        result: "in positive reviews",
        quote: `Since using ReviewManagement, our ${industry.toLowerCase()} has seen a massive increase in positive reviews. The automation saves us 10+ hours every week!`,
        author: "James L.",
        role: `${industry} Owner`
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#080B14] relative overflow-hidden noise-overlay">
            {/* Ambient gradients */}
            <div className="absolute inset-0 mesh-gradient opacity-60 pointer-events-none" />

            {/* Hero Section */}
            <section className="relative py-24 lg:py-36 overflow-hidden z-10">
                <div className="container px-6 md:px-8 mx-auto relative">
                    <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold text-violet-300">
                            {industry} Industry Solution
                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-cyan-300 leading-tight">
                            {title}
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl leading-relaxed">
                            {description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/register">
                                <Button size="lg" className="h-12 px-8 text-base font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-lg cursor-pointer">
                                    Start Free 14-Day Trial
                                </Button>
                            </Link>
                            <Link href="/demo">
                                <Button variant="outline" size="lg" className="h-12 px-8 text-base border-slate-800 text-slate-300 bg-slate-950/40 hover:bg-slate-900 cursor-pointer">
                                    Book Live Demo
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Industry Challenges */}
            <section className="py-20 relative z-10 border-t border-slate-950 bg-slate-950/20">
                <div className="container px-6 md:px-8 mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                        <h2 className="text-xs font-bold text-rose-400 tracking-wider uppercase">The Obstacles</h2>
                        <p className="text-3xl font-extrabold text-white">Why Reputation is Hard for {industry}s</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {finalChallenges.map((challenge, idx) => (
                          <div key={idx} className="glass-card rounded-2xl p-6.5 border border-white/5 bg-slate-950/40">
                              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-5 text-rose-400">
                                  <ShieldAlert className="w-5 h-5" />
                              </div>
                              <h3 className="font-bold text-white mb-2">{challenge.title}</h3>
                              <p className="text-sm text-slate-400 leading-relaxed">{challenge.description}</p>
                          </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Smart Strategy & Implementation */}
            <section className="py-20 relative z-10 border-t border-slate-950">
                <div className="container px-6 md:px-8 mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <h2 className="text-xs font-bold text-violet-400 tracking-wider uppercase">Our Strategy</h2>
                                <h3 className="text-3xl font-extrabold text-white">
                                    How We Solve Reputation for {industry}s
                                </h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Specific automations tailored to help {industry.toLowerCase()} brands capture reviews effortlessly.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {finalStrategies.map((strat, idx) => (
                                    <div key={idx} className="flex gap-4 p-4.5 rounded-xl bg-white/5 border border-white/5">
                                        <div className="bg-violet-500/10 p-2 border border-violet-500/20 rounded-lg flex-shrink-0 text-violet-400 h-10 w-10 flex items-center justify-center">
                                            <Check className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{strat.title}</h4>
                                            <p className="text-xs text-slate-400 leading-relaxed mt-1">{strat.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Customer Case Study Metric card */}
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-3xl blur-xl opacity-20 transform rotate-2"></div>
                            <div className="relative p-8 border border-white/10 rounded-3xl bg-slate-950 shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
                                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                    <Trophy className="w-6 h-6" />
                                </div>
                                
                                <div className="space-y-1">
                                    <div className="text-4xl font-extrabold text-white">{finalCaseStudy.metric}</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{finalCaseStudy.result}</div>
                                </div>

                                <blockquote className="text-base text-slate-300 italic leading-relaxed pt-4 border-t border-white/5">
                                    "{finalCaseStudy.quote}"
                                </blockquote>

                                <div className="flex items-center space-x-3.5 pt-4">
                                    <div className="h-10 w-10 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center font-bold text-violet-300 text-sm">
                                        {finalCaseStudy.author.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-white text-sm">{finalCaseStudy.author}</p>
                                        <p className="text-xs text-slate-500">{finalCaseStudy.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden z-10 border-t border-slate-950">
                <div className="absolute inset-0 bg-violet-900/5 -z-10"></div>
                <div className="container px-6 md:px-8 text-center relative max-w-3xl space-y-6">
                    <h2 className="text-3xl font-extrabold text-white leading-tight">
                        Grow Your {industry} Brand Today
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                        Join thousands of {industry.toLowerCase()} managers who automated review invitations and boosted their local visibility.
                    </p>
                    <div className="pt-4">
                        <Link href="/register">
                            <Button size="lg" className="h-14 px-10 text-base font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-2xl hover:scale-102 transition-transform cursor-pointer">
                                Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
