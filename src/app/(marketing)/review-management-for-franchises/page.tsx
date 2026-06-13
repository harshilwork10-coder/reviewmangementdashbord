import { Metadata } from "next";
import { IndustryLandingPage } from "@/components/templates/IndustryLandingPage";

export const metadata: Metadata = {
    title: "Franchise Reputation Management Software | ReviewManagement",
    description: "Manage reviews across 10 or 1,000 locations. Compare health scores, enforce brand guidelines, and assign local roles. Built for franchise brands.",
};

export default function FranchisesPage() {
    const challenges = [
        { 
            title: "Brand Voice Inconsistency", 
            description: "Individual local operators responding to public reviews with poor grammar or violating official corporate guidelines." 
        },
        { 
            title: "Oversight Blind Spots", 
            description: "No unified dashboard for corporate headquarters to see which regional divisions are lagging in customer sentiment." 
        },
        { 
            title: "Access Control Logistical Nightmares", 
            description: "Managing thousands of review platform credentials for shifting local staff without compromising security." 
        }
    ];

    const strategies = [
        { 
            title: "Global AI Template Control", 
            description: "Enforce corporate-approved AI response guidelines and tone constraints globally across all directories." 
        },
        { 
            title: "Location Sentiment Leaderboards", 
            description: "Compare reputation health metrics side-by-side to optimize customer service at underperforming outlets." 
        },
        { 
            title: "Granular Multi-User Hierarchies", 
            description: "Give franchise owners, regional directors, and local store managers isolated dashboard interfaces." 
        }
    ];

    const caseStudy = {
        metric: "99.2% Reply Rate",
        result: "across 150+ locations",
        quote: "ReviewManagement gave our corporate team complete visibility and control over our 150 burger outlets, while keeping local operators engaged in customer success.",
        author: "Stephanie G.",
        role: "VP of Brand Marketing, Burger Crave Inc."
    };

    return (
        <IndustryLandingPage
            industry="Franchises"
            title="Franchise Reputation Management"
            description="Protect your brand reputation at scale. Unify reviews across hundreds of storefronts, compare scores, and drive local customer loyalty."
            challenges={challenges}
            strategies={strategies}
            caseStudy={caseStudy}
        />
    );
}
