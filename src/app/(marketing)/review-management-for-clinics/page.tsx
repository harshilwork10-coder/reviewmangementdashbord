import { Metadata } from "next";
import { IndustryLandingPage } from "@/components/templates/IndustryLandingPage";

export const metadata: Metadata = {
    title: "Review Management Software for Medical Clinics | ReviewManagement",
    description: "Build patient trust, rank higher in local search, and manage feedback. HIPAA-compliant review tools for dental offices, doctors, and clinics.",
};

export default function ClinicPage() {
    const challenges = [
        { 
            title: "Confidentiality & Compliance Rules", 
            description: "Healthcare providers must never disclose patient identity or clinical procedures when replying to public comments." 
        },
        { 
            title: "Internal Resolution Barriers", 
            description: "Patients frustrated by wait times or copays vent publicly instead of utilizing direct clinic feedback channels." 
        },
        { 
            title: "Insurance Friction Damage", 
            description: "Many bad reviews are about billing disputes or insurance policies, which unfairly lowers the rating of medical staff." 
        }
    ];

    const strategies = [
        { 
            title: "Confidentiality-Guarded AI Replies", 
            description: "AI filters ensure response suggestions never reference patient details, maintaining strict professional boundaries." 
        },
        { 
            title: "Gated Patient Resolutions", 
            description: "Direct dissatisfied patients to private resolution coordinators before they write public reviews." 
        },
        { 
            title: "Respectful Email Surveys", 
            description: "Schedule clean, gentle post-visit surveys asking patients to evaluate their office care experience." 
        }
    ];

    const caseStudy = {
        metric: "+125% Patient Growth",
        result: "in organic search bookings",
        quote: "Patient acquisition is highly driven by online ratings. ReviewManagement helped us double our review count while ensuring our replies remain strictly compliant.",
        author: "Dr. Amanda L.",
        role: "Lead Dentist, BrightSmile Dental"
    };

    return (
        <IndustryLandingPage
            industry="Healthcare"
            title="Review Management for Clinics"
            description="Build patient trust, safeguard patient satisfaction, and rank at the top of local healthcare search listings."
            challenges={challenges}
            strategies={strategies}
            caseStudy={caseStudy}
        />
    );
}
