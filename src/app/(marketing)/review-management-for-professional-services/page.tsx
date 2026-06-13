import { Metadata } from "next";
import { IndustryLandingPage } from "@/components/templates/IndustryLandingPage";

export const metadata: Metadata = {
    title: "Review Management Software for Professional Services | ReviewManagement",
    description: "Build client trust, showcase your firm's expertise, and manage review platforms securely. Tailored for legal, financial, and consulting services.",
};

export default function ProfessionalServicesPage() {
    const challenges = [
        { 
            title: "Trust and Ethics Constraints", 
            description: "Attorneys, accountants, and financial advisors have strict compliance and confidentiality rules around client soliciting." 
        },
        { 
            title: "Low Client Willingness", 
            description: "Clients hiring professional firms often prefer to keep their legal, financial, or strategic affairs private." 
        },
        { 
            title: "High-Stake Outcomes", 
            description: "A single unfair 1-star review can deter premium clients and damage a firm's hard-earned brand authority." 
        }
    ];

    const strategies = [
        { 
            title: "Discreet Post-Engagement Campaigns", 
            description: "Schedule polite, formal email requests sent automatically after closing a file or concluding a contract." 
        },
        { 
            title: "Private Feedback Route", 
            description: "Allow clients to voice sensitive criticisms in a secure internal portal instead of venting on public forums." 
        },
        { 
            title: "Polished AI Reply Drafting", 
            description: "Leverage our 'Professional' tone mode to write elite responses that respect client privacy regulations." 
        }
    ];

    const caseStudy = {
        metric: "+84% Phone Calls",
        result: "in organic leads",
        quote: "In the professional services field, reputation is everything. ReviewManagement helped us systematically collect feedback, increasing our client inquiries by 84% in six months.",
        author: "Rachel K.",
        role: "Managing Partner, RK Law Group"
    };

    return (
        <IndustryLandingPage
            industry="Professional Services"
            title="Professional Services Review Management"
            description="Acquire premium clients with a verified 5-star reputation. Secure client testimonials, manage ratings, and project expertise."
            challenges={challenges}
            strategies={strategies}
            caseStudy={caseStudy}
        />
    );
}
