import { Review } from "./store";

export interface AIInsight {
    id: string;
    category: string;
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    actionItems: string[];
    basedOnCount: number;
    icon: string;
    trend: "up" | "down" | "stable";
}

export interface AIReply {
    text: string;
    tone: "friendly" | "professional" | "empathetic" | "brand_voice";
}

// Generate AI insights based on reviews
export function generateInsights(reviews: Review[]): AIInsight[] {
    const insights: AIInsight[] = [];
    const total = reviews.length;
    if (total === 0) return [];

    const negative = reviews.filter(r => r.sentiment === "negative");
    const neutral = reviews.filter(r => r.sentiment === "neutral");
    const positive = reviews.filter(r => r.sentiment === "positive");
    const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / total;

    const hasKeyword = (kw: string) =>
        reviews.some(r => r.keywords?.some(k => k.includes(kw)) || r.text.toLowerCase().includes(kw));

    // Pricing concerns
    if (hasKeyword("price") || hasKeyword("expensive") || hasKeyword("overpriced")) {
        insights.push({
            id: "ins-price", category: "Pricing", priority: "high", icon: "💰",
            title: "Customers Perceive High Prices", trend: "down",
            description: "Multiple reviews mention pricing as a concern. Customers feel value doesn't fully match cost.",
            actionItems: ["Introduce a value meal or bundle deal", "Highlight premium ingredients/experience in menu descriptions", "Consider a loyalty discount program for repeat customers"],
            basedOnCount: reviews.filter(r => r.text.toLowerCase().includes("price") || r.text.toLowerCase().includes("overpriced")).length,
        });
    }

    // Service excellence
    if (positive.filter(r => r.text.toLowerCase().includes("service") || r.text.toLowerCase().includes("staff")).length >= 2) {
        insights.push({
            id: "ins-service", category: "Service", priority: "low", icon: "⭐",
            title: "Staff Service Highly Rated", trend: "up",
            description: "Your team is consistently praised for exceptional service and attentiveness.",
            actionItems: ["Feature top staff in social media posts", "Create a staff recognition program", "Use positive testimonials in your marketing materials"],
            basedOnCount: positive.filter(r => r.text.toLowerCase().includes("service")).length,
        });
    }

    // Parking / accessibility
    if (hasKeyword("parking")) {
        insights.push({
            id: "ins-parking", category: "Accessibility", priority: "medium", icon: "🚗",
            title: "Parking Is a Pain Point", trend: "stable",
            description: "Customers are frustrated by parking difficulties near your location.",
            actionItems: ["Partner with nearby parking facilities for discounted rates", "Add parking info to Google Maps listing", "Offer valet service during peak hours", "Send pre-visit directions email with parking tips"],
            basedOnCount: reviews.filter(r => r.text.toLowerCase().includes("parking")).length,
        });
    }

    // Response rate low
    const unreplied = reviews.filter(r => r.status === "pending" && r.sentiment === "negative").length;
    if (unreplied >= 2) {
        insights.push({
            id: "ins-response", category: "Engagement", priority: "high", icon: "💬",
            title: `${unreplied} Negative Reviews Unanswered`, trend: "down",
            description: "Unanswered negative reviews significantly damage your online reputation and deter new customers.",
            actionItems: ["Reply to all negative reviews within 24 hours", "Use our AI reply generator for quick responses", "Acknowledge the issue and offer resolution", "Follow up with dissatisfied customers if contact info available"],
            basedOnCount: unreplied,
        });
    }

    // Wait times
    if (hasKeyword("wait") || hasKeyword("slow") || hasKeyword("long")) {
        insights.push({
            id: "ins-wait", category: "Operations", priority: "medium", icon: "⏱️",
            title: "Wait Time Complaints Detected", trend: "stable",
            description: "Customers are mentioning wait times as a frustration point for their experience.",
            actionItems: ["Review staff scheduling during peak hours", "Implement an online reservation system", "Set customer expectations with estimated wait communications", "Train staff on efficient service workflows"],
            basedOnCount: reviews.filter(r => r.text.toLowerCase().includes("wait") || r.text.toLowerCase().includes("slow")).length,
        });
    }

    // High overall rating
    if (avgRating >= 4.5 && total >= 5) {
        insights.push({
            id: "ins-brand", category: "Brand Growth", priority: "low", icon: "🚀",
            title: "Excellent Reputation — Leverage It!", trend: "up",
            description: `With a ${avgRating.toFixed(1)}★ average, your business is in the top tier. This is your competitive advantage.`,
            actionItems: ["Request 5-star reviewers to share on Google & Yelp", "Add review badges to your website", "Feature top reviews in email newsletters", "Submit for local 'Best Of' awards"],
            basedOnCount: positive.length,
        });
    }

    // Low review volume
    if (total < 10) {
        insights.push({
            id: "ins-volume", category: "Review Generation", priority: "high", icon: "📈",
            title: "Increase Review Volume", trend: "stable",
            description: "More reviews = more trust. Businesses with 50+ reviews get 4.6x more clicks than those with fewer.",
            actionItems: ["Add review QR code to receipts/tables", "Send follow-up SMS/email after visits", "Train staff to verbally encourage reviews", "Offer a small incentive (raffle entry) for leaving a review"],
            basedOnCount: total,
        });
    }

    return insights.sort((a, b) => {
        const prio = { high: 0, medium: 1, low: 2 };
        return prio[a.priority] - prio[b.priority];
    });
}

// Generate AI reply suggestions for a review
export function generateAIReply(review: Review, brandVoice?: string): AIReply[] {
    const rating = review.rating;
    const customer = review.customerName || "there";
    const bvPrompt = brandVoice || "We are warm, customer-focused, and committed to excellence.";

    let brandVoiceText = "";
    if (rating >= 4) {
        if (bvPrompt.toLowerCase().includes("stellar") || bvPrompt.toLowerCase().includes("culinary")) {
            brandVoiceText = `Thank you so much for your wonderful review, ${customer}! 🍽️ We are absolutely thrilled you enjoyed your experience. We take immense pride in our farm-to-table culinary focus and fresh ingredients. We can't wait to welcome you back for another stellar meal! 🌟`;
        } else {
            brandVoiceText = `Thank you for the review, ${customer}! 🌟 We are committed to our brand values: "${bvPrompt}". We look forward to serving you again soon!`;
        }
    } else if (rating === 3) {
        if (bvPrompt.toLowerCase().includes("stellar") || bvPrompt.toLowerCase().includes("culinary")) {
            brandVoiceText = `Hi ${customer}, thank you for your honest feedback. 🍽️ We appreciate your insights regarding your visit. We are dedicated to our fresh, culinary standards and will continue improving our service. We hope to welcome you back soon to show you our progress! 🌟`;
        } else {
            brandVoiceText = `Thank you for sharing your thoughts, ${customer}. Based on our brand guidelines ("${bvPrompt}"), we appreciate your input and will address your concerns to deliver a better experience.`;
        }
    } else {
        if (bvPrompt.toLowerCase().includes("stellar") || bvPrompt.toLowerCase().includes("culinary")) {
            brandVoiceText = `We sincerely apologize for falling short during your visit, ${customer}. 🍽️ We take our culinary and service quality very seriously, and we are disappointed to hear your experience did not reflect our standard. Please contact us directly so we can resolve this. — The Bistro Team 🌟`;
        } else {
            brandVoiceText = `We apologize for the disappointing experience, ${customer}. Following our standards ("${bvPrompt}"), we take your feedback seriously and want to make things right. Please contact us to assist you.`;
        }
    }

    if (rating >= 4) {
        return [
            {
                tone: "friendly",
                text: `Thank you so much for your wonderful review! 🌟 We're absolutely delighted to hear you had such a great experience. Your kind words mean the world to our entire team. We can't wait to welcome you back soon!`,
            },
            {
                tone: "professional",
                text: `Thank you for taking the time to share your positive feedback. We're pleased to hear that your experience met your expectations. We look forward to serving you again in the future and appreciate your continued support.`,
            },
            {
                tone: "empathetic",
                text: `Thank you for your warm review. Knowing that we were able to provide you with such a positive, comfortable experience truly warms our hearts. We look forward to welcome you back.`,
            },
            {
                tone: "brand_voice",
                text: brandVoiceText,
            },
        ];
    } else if (rating === 3) {
        return [
            {
                tone: "friendly",
                text: `Thanks for the honest review! We're glad some aspects of your visit were enjoyable, and we definitely hear you on the areas that could be better. We're always working to improve and hope you'll give us another chance soon! 😊`,
            },
            {
                tone: "professional",
                text: `Thank you for your honest feedback. We appreciate you sharing both what went well and where we can improve. Your insights help us deliver a better experience for everyone. We hope to serve you again in the future.`,
            },
            {
                tone: "empathetic",
                text: `Thank you for sharing your experience. We understand that your visit was just okay, and we want to apologize for not exceeding your expectations. We appreciate your patience and will use this feedback to improve.`,
            },
            {
                tone: "brand_voice",
                text: brandVoiceText,
            },
        ];
    } else {
        return [
            {
                tone: "friendly",
                text: `Oh no, we are so sorry to hear you had a disappointing visit! 😢 We definitely want to make this up to you. Please reach out to us directly so we can chat and get this sorted out. We hope to see you again soon!`,
            },
            {
                tone: "professional",
                text: `Thank you for your candid feedback. We're truly sorry to hear your experience did not meet our usual standards. We have taken note of your concerns and will be addressing them with our team immediately. We appreciate your patience.`,
            },
            {
                tone: "empathetic",
                text: `We are deeply sorry to hear about your experience. We completely understand your frustration and feel terrible for falling short. We want to apologize sincerely and would appreciate the chance to connect with you directly to make this right.`,
            },
            {
                tone: "brand_voice",
                text: brandVoiceText,
            },
        ];
    }
}
