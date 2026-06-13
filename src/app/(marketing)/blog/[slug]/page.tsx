import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Shield, Sparkles, Check, ArrowRight } from "lucide-react";

interface ArticleContent {
  title: string;
  category: string;
  readTime: string;
  date: string;
  description: string;
  body: React.ReactNode;
  faqs: { q: string; a: string }[];
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const articles: Record<string, ArticleContent> = {
    "how-to-get-more-google-reviews": {
      title: "How to Get More Google Reviews: The Ultimate 2026 Guide",
      category: "Guides",
      readTime: "6 min read",
      date: "June 2026",
      description: "Discover actionable strategies, optimized templates, and automation paths to consistently collect 5-star Google reviews from happy clients.",
      body: (
        <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
          <p>
            In today's digital marketplace, your online reputation is your most critical asset. Over <strong>93% of consumers</strong> read local reviews before making a purchase decision. More importantly, Google's local search algorithm uses review count, velocity, and average star ratings as key signals for local Map Pack positioning.
          </p>
          
          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Why Google Reviews Dictate Local Business Success</h2>
          <p>
            When potential clients search for services "near me", Google ranks businesses based on relevance, distance, and prominence. Reviews are the primary metric for prominence. A business with 250 reviews and a 4.8-star average will consistently capture more clicks than a competitor with 10 reviews and a 5.0-star average.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. The Doorstep SMS Request Method</h2>
          <p>
            The easiest way to get reviews is simply to ask—at the right time. Our data shows that sending an automated text message (SMS) within 30 minutes of service completion leads to a <strong>250% increase</strong> in review conversions.
          </p>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 font-mono text-xs text-slate-400">
            "Hi [Name]! Thanks for choosing [Business] today. We'd love to hear your feedback. Please leave us a quick review here: [Link]"
          </div>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. QR Codes: Capturing In-Store Shoppers</h2>
          <p>
            For walk-in retail stores, cafes, and medical offices, printed checkout cards are highly effective. Generate a custom QR code that links directly to your Google Business Profile review dialog. Empower your checkout coordinators to invite scans, offering immediate review access.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Intercepting Negative Feedback Privately</h2>
          <p>
            To protect your brand rating, you must filter out dissatisfied client reviews before they go public. By implementing a <Link href="/features/monitoring" className="text-violet-400 underline font-semibold">Gated Feedback Form</Link>, you can redirect ratings of 3 stars or lower to an internal resolution team. This allows your managers to resolve complaints privately, keeping your public Google listings clean.
          </p>
        </div>
      ),
      faqs: [
        {
          q: "How do I create a Google review link?",
          a: "Search for your business on Google, click 'Get more reviews', and copy the short URL provided by Google Business Profile."
        },
        {
          q: "Can I offer incentives/discounts for reviews?",
          a: "No. Google's Terms of Service strictly forbid offering monetary incentives, gifts, or discounts in exchange for reviews. Focus on automation instead."
        }
      ]
    },
    "best-review-management-tools": {
      title: "Best Review Management Software & Platforms in 2026",
      category: "Industry",
      readTime: "8 min read",
      date: "June 2026",
      description: "A comprehensive roundup comparing starting costs, multi-location support, and white-labeling capability across top reputation tools.",
      body: (
        <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
          <p>
            Managing reviews manually across Google, Facebook, Yelp, and TripAdvisor is almost impossible for scaling businesses. A dedicated reputation platform consolidates incoming feeds, automates requests, and generates AI draft replies.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Key Features to Look For</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li><strong className="text-white">Centralized Unified Inbox:</strong> Reads and monitors reviews from all platforms in one dashboard feed.</li>
            <li><strong className="text-white">AI Response Assistants:</strong> Generates context-aware draft replies tailored to your brand voice.</li>
            <li><strong className="text-white">Gated Complaints Forms:</strong> Catches unsatisfied feedback privately to protect public scores.</li>
            <li><strong className="text-white">White-labeling options:</strong> Allows marketing agencies to package reputation features under their brand.</li>
          </ul>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. The Contenders: ReviewManagement vs Podium vs Birdeye</h2>
          <p>
            Many legacy platforms require expensive pricing models and long contracts:
          </p>
          <div className="space-y-3 pt-2">
            <p>
              * <strong>Podium & Birdeye:</strong> Great feature suites, but require annual contract commitments and start at $250+/month per location, making them too expensive for small businesses.
            </p>
            <p>
              * <strong>ReviewManagement:</strong> Offers flexible month-to-month billing starting at just $29/mo, whitelabel agency setups, advanced tone-specific AI replies, and free client migration guides.
            </p>
          </div>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Selecting the Right Fit</h2>
          <p>
            If you are a single storefront, start with our Starter plan. If you manage an agency or oversee multiple locations, explore our whitelabel client portals to scale recurring SaaS revenue.
          </p>
        </div>
      ),
      faqs: [
        {
          q: "What is the average cost of review software?",
          a: "Standard legacy platforms charge $200-$400/month. ReviewManagement provides cost-effective tiers starting at $29/mo."
        },
        {
          q: "Do these tools import old review histories?",
          a: "Yes. Premium software automatically imports your historic reviews stream upon account connection."
        }
      ]
    },
    "ai-review-replies-guide": {
      title: "The Complete Guide to AI-Powered Review Replies",
      category: "AI Strategy",
      readTime: "5 min read",
      date: "June 2026",
      description: "Learn how to save 12+ hours weekly and maintain professional consistency using tone-specific AI response assistants.",
      body: (
        <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
          <p>
            Replying to every review—both positive and negative—is essential. It shows future customers you care about feedback and flags active engagement signals to Google's ranking search crawlers.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Why Automated AI Replies Matter</h2>
          <p>
            Writing individual responses to dozens of reviews is time-consuming. Copy-pasting the same template looks lazy. Generative AI solves this by reading review sentiments and drafting context-aware replies in seconds.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Harnessing Tone Customization</h2>
          <p>
            Different reviews require different brand tones:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li><strong className="text-white">Friendly Tone:</strong> Celebrates happy customers and encourages repeat visits.</li>
            <li><strong className="text-white">Professional Tone:</strong> Best for clinics or law firms maintaining strict privilege.</li>
            <li><strong className="text-white">Empathetic Tone:</strong> Validates critical feedback and offers direct contact pathways.</li>
          </ul>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Training Your AI Brand Voice</h2>
          <p>
            Configure custom instructions in your settings (e.g. "Culinary focus, friendly, invite back for tacos 🌮"). The AI reads these brand guidelines to generate tailored replies automatically.
          </p>
        </div>
      ),
      faqs: [
        {
          q: "Is it safe to use AI for reviews replies?",
          a: "Yes. We recommend reviewing and approving AI drafts with one click before publishing to ensure quality control."
        },
        {
          q: "How does AI impact local SEO rankings?",
          a: "Consistent, keyword-rich replies signals activity to Google, helping boost Map Pack visibility."
        }
      ]
    },
    "google-business-review-strategy": {
      title: "Google Business Profile Strategy for Local Map Pack Rankings",
      category: "Local SEO",
      readTime: "7 min read",
      date: "June 2026",
      description: "Explore how review count, frequency, and sentiment analysis directly dictate local map search rankings and inbound call volume.",
      body: (
        <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
          <p>
            For local companies, ranking in Google's "Local 3-Pack" (the map box above search results) is the holy grail. Over <strong>70% of local searches</strong> result in a click on these top three listings.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. The Local SEO Algorithm Factors</h2>
          <p>
            Google ranks local profiles using three main criteria: Relevance, Distance, and Prominence. Prominence is highly influenced by your Google Business Profile (GBP) reviews.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. The 3 Review Factors That Drive Rankings</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li><strong className="text-white">Review Volume:</strong> The sheer quantity of ratings on your profile.</li>
            <li><strong className="text-white">Review Frequency:</strong> How regularly you receive new feedback. Google values fresh reviews over old ones.</li>
            <li><strong className="text-white">Keyword Density:</strong> When clients naturally use keywords (e.g. "best plumber", "AC installation") in their comments, it increases your relevance score.</li>
          </ul>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Optimizing Your Profile</h2>
          <p>
            Always reply to every review, update photos regularly, answer patient/customer QAs, and use automated campaign software to ensure a steady stream of fresh feedback.
          </p>
        </div>
      ),
      faqs: [
        {
          q: "Does replying to reviews improve SEO?",
          a: "Yes! Review responses confirm to search algorithms that your business is active and responsive to clients."
        },
        {
          q: "What should I do if my business is not ranking?",
          a: "Deploy automated SMS campaigns to collect fresh reviews and optimize your listing details."
        }
      ]
    },
    "customer-feedback-best-practices": {
      title: "Customer Feedback Best Practices: Handling Criticisms Positively",
      category: "Customer Experience",
      readTime: "6 min read",
      date: "June 2026",
      description: "How to intercept negative customer experiences privately using gated surveys before they damage public profiles.",
      body: (
        <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
          <p>
            Customer feedback is a goldmine of insights. Negative feedback is actually a critical opportunity to resolve service gaps, retain clients, and build long-term trust.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. The 24-Hour Resolution Threshold</h2>
          <p>
            Speed is crucial for unhappy clients. Resolving a customer complaint within 24 hours often saves the account and converts them into a brand advocate.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Intercepting Complaints with Feedback Gating</h2>
          <p>
            Automate your campaign links to detect low-rating entries (1 to 3 stars). Redirect those users to a private internal feedback form, allowing them to explain their experience directly to management.
          </p>
          <p>
            This keeps negative reviews off your public Google profile while alerting your team to resolve the issue immediately.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. How to Respond to Negative Public Reviews</h2>
          <p>
            If a negative review does go public, follow these guidelines:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>Never argue or get defensive. Keep your reply brief and professional.</li>
            <li>Acknowledge and validate their frustration.</li>
            <li>Take the conversation offline by providing a direct email or phone number.</li>
          </ul>
        </div>
      ),
      faqs: [
        {
          q: "Should I delete negative reviews?",
          a: "You cannot delete reviews on Google or Yelp unless they violate content policies. Focus on collecting positive reviews to push negative ones down."
        },
        {
          q: "How does the feedback gate protect ratings?",
          a: "It routes dissatisfied customers to a private management inbox, keeping public listings clean."
        }
      ]
    }
  };

  const article = articles[slug];

  if (!article) {
    notFound();
  }

  // Schema mappings JSON-LD
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "datePublished": "2026-06-01",
    "author": {
      "@type": "Organization",
      "name": "ReviewManagement SEO Editorial Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ReviewManagement",
      "logo": {
        "@type": "ImageObject",
        "url": "https://reviewmanagement.com/logo.png"
      }
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": article.faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://reviewmanagement.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://reviewmanagement.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `https://reviewmanagement.com/blog/${slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#080B14] relative overflow-hidden noise-overlay">
      {/* Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="absolute inset-0 mesh-gradient opacity-60 pointer-events-none" />

      {/* Navigation Breadcrumb */}
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl pt-32 pb-4 z-10 relative">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors group">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Blog Center
        </Link>
      </div>

      {/* Main Content Layout */}
      <section className="relative pb-24 z-10">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left/Middle: Article body */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Meta information */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  {article.title}
                </h1>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-2 border-b border-slate-900 pb-4">
                  <Calendar className="w-3.5 h-3.5" /> Published {article.date} · Written by Reputation Research Editors
                </div>
              </div>

              {/* Body */}
              <div className="article-body">
                {article.body}
              </div>

              {/* FAQ Section */}
              <div className="pt-10 border-t border-slate-900 mt-12 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-violet-400" />
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {article.faqs.map((faq, idx) => (
                    <div key={idx} className="p-4.5 bg-slate-950/40 border border-white/5 rounded-xl space-y-2">
                      <h4 className="text-sm font-bold text-white">{faq.q}</h4>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right: Sidebar widget CTA */}
            <div className="space-y-6">
              
              {/* Trial callout card */}
              <div className="glass-card border border-white/10 rounded-2xl p-6.5 bg-slate-950/80 shadow-2xl sticky top-24 space-y-6 text-center">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400">
                  <Shield className="w-5.5 h-5.5" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-base">Automate Your Business Reviews</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Stop losing local customers to competitors. Start sending automated SMS review invitations and generating smart AI replies in 15 minutes.
                  </p>
                </div>

                <div className="pt-4 space-y-3">
                  <Link 
                    href="/register" 
                    className="btn-primary w-full py-3 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1 group"
                  >
                    Start Free 14-Day Trial
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link 
                    href="/demo" 
                    className="w-full py-3 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400 font-semibold text-xs sm:text-sm block hover:text-white transition-colors"
                  >
                    Book A Product Demo
                  </Link>
                </div>

                <p className="text-[10px] text-slate-500">
                  No credit card required · Cancel at any time
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
