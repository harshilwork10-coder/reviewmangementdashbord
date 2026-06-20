import { Metadata } from "next";
import ExecutiveSummaryClient from "./ExecutiveSummaryClient";

export const metadata: Metadata = {
    title: "Executive Summary | ReviewManagement",
    description: "Read the ReviewManagement business overview, market opportunity, revenue model, and growth vision under the Openrize ecosystem.",
};

export default function ExecutiveSummaryPage() {
    return <ExecutiveSummaryClient />;
}
