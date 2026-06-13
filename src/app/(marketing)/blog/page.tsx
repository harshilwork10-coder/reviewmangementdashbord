import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Calendar } from "lucide-react";

export const metadata: Metadata = {
    title: "SaaS Reputation & Review Management Blog | ReviewManagement",
    description: "Read expert guides, local SEO strategies, and AI reply insights to optimize customer satisfaction and scale business reviews.",
};

const blogPosts = [
  {
    title: "How to Get More Google Reviews for Your Business",
    slug: "how-to-get-more-google-reviews",
    category: "Guides",
    readTime: "6 min read",
    date: "June 2026",
    description: "Discover actionable strategies, optimized templates, and automation paths to consistently collect 5-star Google reviews from happy clients."
  },
  {
    title: "Best Review Management Software & Platforms in 2026",
    slug: "best-review-management-tools",
    category: "Industry",
    readTime: "8 min read",
    date: "June 2026",
    description: "A comprehensive roundup comparing starting costs, multi-location support, and white-labeling capability across top reputation tools."
  },
  {
    title: "The Complete Guide to AI-Powered Review Replies",
    slug: "ai-review-replies-guide",
    category: "AI Strategy",
    readTime: "5 min read",
    date: "June 2026",
    description: "Learn how to save 12+ hours weekly and maintain professional consistency using tone-specific AI response assistants."
  },
  {
    title: "Google Business Profile Strategy for Local Map Pack Rankings",
    slug: "google-business-review-strategy",
    category: "Local SEO",
    readTime: "7 min read",
    date: "June 2026",
    description: "Explore how review count, frequency, and sentiment analysis directly dictate local map search rankings and inbound call volume."
  },
  {
    title: "Customer Feedback Best Practices: Handling Criticisms Positively",
    slug: "customer-feedback-best-practices",
    category: "Customer Experience",
    readTime: "6 min read",
    date: "June 2026",
    description: "How to intercept negative customer experiences privately using gated surveys before they damage public profiles."
  }
];

export default function BlogHubPage() {
  return (
    <div className="min-h-screen bg-[#080B14] relative overflow-hidden noise-overlay">
      {/* Background gradients */}
      <div className="absolute inset-0 mesh-gradient opacity-60 pointer-events-none" />

      {/* Blog Hero Header */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 z-10">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold text-violet-300">
            Resource Center
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Reputation & <span className="gradient-text">SEO Resources</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Gain tactical insights on reputation management, local search visibility, and AI-powered reply automations.
          </p>
        </div>
      </section>

      {/* Articles Grid list */}
      <section className="py-12 pb-24 relative z-10 border-t border-slate-950">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div 
                key={post.slug}
                className="glass-card border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-violet-500/30 transition-all bg-slate-950/40 group"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    </div>
                  </div>

                  <h2 className="text-lg font-bold text-white mb-3 group-hover:text-violet-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-3">
                    {post.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-900 mt-6 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {post.date}
                  </span>
                  
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-violet-400 group-hover:text-violet-300 flex items-center gap-1 group/btn"
                  >
                    Read Article
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-all" />
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
