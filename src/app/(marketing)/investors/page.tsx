import { Metadata } from "next";
import InvestorsClient from "./InvestorsClient";

export const metadata: Metadata = {
    title: "Investor Relations & Pitch Deck | ReviewManagement",
    description: "View the 14-slide ReviewManagement investor pitch deck outlining problem statements, solutions, target markets, financial projections, and roadmap.",
};

export default function InvestorsPage() {
    return <InvestorsClient />;
}
