import { Metadata } from "next";
import { IndustryLandingPage } from "@/components/templates/IndustryLandingPage";

export const metadata: Metadata = {
    title: "Review Management Software for Home Services | ReviewManagement",
    description: "Rank #1 on Google Maps, collect SMS reviews at the doorstep, and win more local booking jobs. Built for plumbers, HVAC, and contractors.",
};

export default function HomeServicesPage() {
    const challenges = [
        { 
            title: "Technician Friction on the Field", 
            description: "Field technicians focus on repairs and forget to ask for reviews, while clients promise to do it later but forget." 
        },
        { 
            title: "Local Map Pack Dependencies", 
            description: "Home services rely entirely on local SEO. If you don't rank in the top 3 on Google Maps, you lose 70% of bookings." 
        },
        { 
            title: "Immediate Heat-of-Moment Reviews", 
            description: "An delayed service or misunderstanding leads to quick 1-star reviews that can crush call volumes overnight." 
        }
    ];

    const strategies = [
        { 
            title: "Doorstep SMS Request Triggers", 
            description: "Technicians trigger automated review text invitations while completing invoicing at the client's home." 
        },
        { 
            title: "Employee Attribution Tracking", 
            description: "Assign incoming reviews to specific field techs and reward top performers on the team leaderboard." 
        },
        { 
            title: "Instant Mobile Alert Dispatch", 
            description: "Receive immediate notifications of critical ratings, letting service managers call disgruntled clients immediately." 
        }
    ];

    const caseStudy = {
        metric: "3.2x More Reviews",
        result: "within 90 days",
        quote: "Our technicians send review text requests before leaving the customer's driveway. Our review counts tripled, and we are now the top-ranked plumber in the city.",
        author: "Derrick M.",
        role: "Founder, Peak Flow Plumbing"
    };

    return (
        <IndustryLandingPage
            industry="Home Services"
            title="Home Services Review Management"
            description="Dominate your service area. Collect doorstep text reviews, rank top on Google Maps, and secure more incoming service calls."
            challenges={challenges}
            strategies={strategies}
            caseStudy={caseStudy}
        />
    );
}
