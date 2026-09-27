"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart, Smile, Frown, Meh, TrendingUp, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";

const SENTIMENT = [
  { name: "Positive", value: 72, color: "#22c55e" },
  { name: "Neutral", value: 18, color: "#facc15" },
  { name: "Negative", value: 10, color: "#ef4444" },
];

const CATEGORIES = [
  { name: "Spa", positive: 92, negative: 8 },
  { name: "F&B", positive: 88, negative: 12 },
  { name: "Pool", positive: 84, negative: 16 },
  { name: "Staff", positive: 90, negative: 10 },
  { name: "Rooms", positive: 76, negative: 24 },
  { name: "Wi-Fi", positive: 42, negative: 58 },
];

const REVIEWS = [
  { platform: "Google", rating: 4.8, title: "Exceptional stay!", text: "Everything was perfect. The spa is world-class and the staff went above and beyond.", sentiment: "POSITIVE", time: "2d ago" },
  { platform: "TripAdvisor", rating: 5.0, title: "Best resort in South India", text: "Absolutely breathtaking. The infinity pool views, the food, the hospitality - 10/10.", sentiment: "POSITIVE", time: "3d ago" },
  { platform: "Booking", rating: 4.2, title: "Great resort but Wi-Fi issues", text: "Beautiful property. However, the Wi-Fi was unreliable in Block C.", sentiment: "NEUTRAL", time: "4d ago" },
  { platform: "Booking", rating: 3.5, title: "Room AC malfunction", text: "AC was not working properly. Maintenance came but took 3 hours.", sentiment: "NEGATIVE", time: "5d ago" },
  { platform: "Google", rating: 4.9, title: "Luxury redefined", text: "From airport transfer to checkout, every touchpoint was flawless.", sentiment: "POSITIVE", time: "6d ago" },
];

export default function SentimentPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if ((session?.user as any)?.role === "GUEST") {
      router.replace("/guests/concierge");
    }
  }, [session, router]);

  return (
    <PageContainer>
      <PageHeader title="Sentiment Analysis" description="AI-powered review analysis from all platforms" icon={Heart} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="kpi-card">
          <div className="metric-label">Overall NPS</div>
          <div className="metric-value text-success-light">72</div>
          <div className="flex items-center gap-1 text-xs text-success-light">
            <TrendingUp className="w-3 h-3" /> +4 vs last week
          </div>
        </div>
        <div className="kpi-card">
          <div className="metric-label">Total Reviews (7d)</div>
          <div className="metric-value">148</div>
          <div className="flex items-center gap-1 text-xs text-success-light">
            <TrendingUp className="w-3 h-3" /> +12%
          </div>
        </div>
        <div className="kpi-card">
          <div className="metric-label">Avg Rating</div>
          <div className="metric-value text-accent-400">4.4</div>
          <div className="text-white/40 text-xs">across all platforms</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-5">
          <div className="section-header mb-3">Sentiment Split</div>
          <div className="h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={SENTIMENT} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                  {SENTIMENT.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(15,15,26,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} formatter={(v: any) => [`${v}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5">
            {SENTIMENT.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-white/70">{s.name}</span>
                </div>
                <span className="text-white font-semibold">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5 lg:col-span-2">
          <div className="section-header mb-3">Sentiment by Category</div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={CATEGORIES} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.4)" fontSize={11} width={70} />
                <Tooltip contentStyle={{ background: "rgba(15,15,26,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                <Bar dataKey="positive" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} />
                <Bar dataKey="negative" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="alert-warning mt-3 text-xs">
            <div className="text-warning-light font-semibold">⚠️ Wi-Fi complaints trending up 21%</div>
            <div className="text-white/70 mt-1">Concentrated in Block C. AI recommends AP upgrade (₹1.8L cost, 30-day ROI).</div>
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="section-header mb-3">Recent Reviews</div>
        <div className="space-y-2">
          {REVIEWS.map((r, i) => (
            <div key={i} className="glass-card p-3">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <div className="text-white font-semibold text-sm">{r.title}</div>
                  <div className="text-white/40 text-xs">{r.platform} • {r.time} • {"⭐".repeat(Math.round(r.rating))}</div>
                </div>
                <span className={r.sentiment === "POSITIVE" ? "badge-green" : r.sentiment === "NEGATIVE" ? "badge-red" : "badge-yellow"}>{r.sentiment}</span>
              </div>
              <div className="text-white/70 text-sm">{r.text}</div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
