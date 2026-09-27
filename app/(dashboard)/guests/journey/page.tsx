"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MapPin, Plane, Bed, Coffee, Sparkles, LogIn, Utensils, BedDouble, Sun } from "lucide-react";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";

const STAGES = [
  { stage: "Pre-Arrival", icon: Plane, color: "from-blue-500 to-cyan-500", count: 12, description: "Booking, preferences, arrival prep" },
  { stage: "Arrival", icon: LogIn, color: "from-brand-500 to-ai-DEFAULT", count: 8, description: "Welcome, check-in, escort" },
  { stage: "Stay", icon: Bed, color: "from-success-DEFAULT to-emerald-500", count: 35, description: "Room service, activities, wellness" },
  { stage: "Dining", icon: Utensils, color: "from-accent-500 to-warning-DEFAULT", count: 24, description: "Restaurant, F&B, room service" },
  { stage: "Activities", icon: Sun, color: "from-pink-500 to-rose-500", count: 18, description: "Spa, pool, excursions, events" },
  { stage: "Departure", icon: BedDouble, color: "from-purple-500 to-pink-500", count: 5, description: "Checkout, feedback, follow-up" },
];

const TOUCHPOINTS = [
  { stage: "Pre-Arrival", time: "T-7d", action: "Personalized welcome email sent", sentiment: 4.5 },
  { stage: "Pre-Arrival", time: "T-24h", action: "Pre-check-in completed via app", sentiment: 4.7 },
  { stage: "Pre-Arrival", time: "T-2h", action: "Room preference confirmed (high floor, ocean view)", sentiment: 4.8 },
  { stage: "Arrival", time: "T-0", action: "VIP airport pickup with butler", sentiment: 4.9 },
  { stage: "Arrival", time: "T+5min", action: "Welcome drink & cool towel at lobby", sentiment: 4.8 },
  { stage: "Arrival", time: "T+15min", action: "Escort to suite with property tour", sentiment: 4.7 },
  { stage: "Stay", time: "T+2h", action: "In-room dining order delivered (20 min)", sentiment: 4.6 },
  { stage: "Stay", time: "Day 2 AM", action: "Spa appointment reminder sent", sentiment: 4.5 },
  { stage: "Stay", time: "Day 2 PM", action: "Poolside butler service", sentiment: 4.9 },
  { stage: "Dining", time: "Day 1 Eve", action: "Spice Garden dinner reservation", sentiment: 4.8 },
  { stage: "Activities", time: "Day 2", action: "Cooking class booked via app", sentiment: 4.7 },
  { stage: "Activities", time: "Day 3", action: "Sunset yoga session attended", sentiment: 4.9 },
  { stage: "Departure", time: "Day 4", action: "Express checkout via WhatsApp", sentiment: 4.8 },
  { stage: "Departure", time: "T+1d", action: "Thank you email with photos", sentiment: 4.6 },
  { stage: "Departure", time: "T+3d", action: "Feedback survey completed", sentiment: 4.5 },
];

export default function JourneyPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const role = (session?.user as any)?.role;
    if (role === "GUEST") {
      router.replace("/guests/concierge");
    }
  }, [session, router]);
  return (
    <PageContainer>
      <PageHeader title="Guest Journey" description="End-to-end experience map across every touchpoint" icon={MapPin} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {STAGES.map((s) => (
          <div key={s.stage} className="glass-card p-4 text-center">
            <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-2`}>
              <s.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-white font-semibold text-sm">{s.stage}</div>
            <div className="text-white/40 text-xs mt-1">{s.count} guests</div>
          </div>
        ))}
      </div>

      <div className="glass-card p-5">
        <div className="section-header mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-ai-light" /> Real-Time Touchpoint Stream</div>
        <div className="space-y-2">
          {TOUCHPOINTS.map((t, i) => (
            <div key={i} className="flex items-center gap-3 glass-card p-3">
              <div className="text-white/40 text-xs font-mono w-16 flex-shrink-0">{t.time}</div>
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm">{t.action}</div>
                <div className="text-white/40 text-xs">{t.stage}</div>
              </div>
              <div className="flex items-center gap-1 text-xs text-accent-400">
                <Sparkles className="w-3 h-3" />
                <span className="font-semibold">{t.sentiment}</span>
                <span className="text-white/30">/5</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
