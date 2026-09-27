"use client";

import { Bot } from "lucide-react";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";
import ConciergeChat from "@/app/(dashboard)/guests/concierge/concierge-chat";
const MANAGER_SUGGESTIONS = [
  "What is today’s occupancy rate?",
  "Show staff schedule for the next shift",
  "Any pending maintenance tickets?",
  "Revenue forecast for this week",
  "Guest satisfaction trends",
  "Upcoming events and bookings",
];
export default function CopilotPage() {
  return (
    <PageContainer>
      <PageHeader title="AI Copilot" description="Conversational AI with full resort context" icon={Bot} badge="AI" />
      <div className="h-[calc(100vh-220px)]">
        <ConciergeChat suggestions={MANAGER_SUGGESTIONS} />
      </div>
    </PageContainer>
  );
}
