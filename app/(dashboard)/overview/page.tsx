"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar
} from "recharts";
import {
  TrendingUp, Users, Star, Activity, DollarSign, Zap, Target,
  Sparkles, Cloud, Sun, ArrowUp, ArrowDown, Bell, Wind, Brain, Leaf, MapPin, Heart, BarChart3,
  Building2, Move3D, Layers, Compass, ArrowRight
} from "lucide-react";
import { KPICard } from "@/components/dashboard/kpi-card";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";
import { formatINR, formatNumber, formatPercent, timeAgo } from "@/lib/utils";

const CHART_COLORS = ["#6366f1", "#7c3aed", "#ec4899", "#f59e0b", "#22c55e", "#ef4444"];

interface KPIResponse {
  metrics: {
    occupancyRate: number; adr: number; revpar: number; revenue: number;
    guestSatisfaction: number; nps: number; staffUtilization: number; energyConsumption: number;
    prevOccupancy: number; prevAdr: number; prevRevpar: number; prevRevenue: number;
    prevSatisfaction: number; prevNps: number; prevStaffUtil: number; prevEnergy: number;
  };
  intelligenceScore: number;
  alerts: Array<{ id: string; type: string; severity: string; title: string; message: string; isRead: boolean; createdAt: string }>;
  weather: { temperature: number; humidity: number; condition: string; rainProbability: number; windSpeed: number } | null;
  aiRecommendations: Array<{ id: string; type: string; title: string; description: string; expectedImpact: string; priority: number }>;
  forecasts: Array<{ date: string; revenue: number; occupancy: number; adr: number }>;
  roomSummary: { total: number; occupied: number; available: number; cleaning: number; maintenance: number };
}

const SAMPLE_FORECAST = [
  { day: "Mon", revenue: 1680000, occupancy: 82 },
  { day: "Tue", revenue: 1520000, occupancy: 76 },
  { day: "Wed", revenue: 1610000, occupancy: 79 },
  { day: "Thu", revenue: 1850000, occupancy: 88 },
  { day: "Fri", revenue: 2240000, occupancy: 95 },
  { day: "Sat", revenue: 2580000, occupancy: 98 },
  { day: "Sun", revenue: 2410000, occupancy: 94 },
];

const SAMPLE_ENERGY = [
  { hour: "00:00", value: 180 }, { hour: "03:00", value: 165 },
  { hour: "06:00", value: 210 }, { hour: "09:00", value: 285 },
  { hour: "12:00", value: 340 }, { hour: "15:00", value: 360 },
  { hour: "18:00", value: 380 }, { hour: "21:00", value: 320 },
];

const ROOM_DIST = [
  { name: "Occupied", value: 105, color: "#6366f1" },
  { name: "Available", value: 32, color: "#22c55e" },
  { name: "Cleaning", value: 18, color: "#f59e0b" },
  { name: "Maintenance", value: 5, color: "#ef4444" },
];

export default function OverviewPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [data, setData] = useState<KPIResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ((session?.user as any)?.role === "GUEST") {
      router.replace("/guests/concierge");
    }
  }, [session, router]);

  useEffect(() => {
    fetch("/api/dashboard/kpis")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <PageContainer>
        <div className="space-y-4">
          <div className="h-20 shimmer rounded-2xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 shimmer rounded-2xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 h-80 shimmer rounded-2xl" />
            <div className="h-80 shimmer rounded-2xl" />
          </div>
        </div>
      </PageContainer>
    );
  }

  const m = data.metrics;
  const weather = data.weather || { temperature: 26.4, humidity: 72, condition: "CLOUDY", rainProbability: 0.68, windSpeed: 14.2 };
  const forecast = data.forecasts.length > 0 ? data.forecasts.map((f) => ({
    day: new Date(f.date).toLocaleDateString("en", { weekday: "short" }),
    revenue: f.revenue, occupancy: f.occupancy * 100,
  })) : SAMPLE_FORECAST;

  return (
    <PageContainer>
      <PageHeader
        title="Resort Overview"
        description="Real-time intelligence across the entire Azure Hills property"
        icon={Sparkles}
        badge="LIVE"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard label="Occupancy Rate" value={m.occupancyRate} previous={m.prevOccupancy} format="percent" icon={Target} color="brand" />
        <KPICard label="Today's Revenue" value={m.revenue} previous={m.prevRevenue} format="currency" icon={DollarSign} color="success" />
        <KPICard label="ADR" value={m.adr} previous={m.prevAdr} format="currency" icon={TrendingUp} color="accent" />
        <KPICard label="RevPAR" value={m.revpar} previous={m.prevRevpar} format="currency" icon={BarChart3} color="ai" />
        <KPICard label="Guest Satisfaction" value={m.guestSatisfaction} previous={m.prevSatisfaction} format="decimal" icon={Star} color="success" decimals={1} suffix="/100" />
        <KPICard label="NPS Score" value={m.nps} previous={m.prevNps} icon={Heart} color="brand" />
        <KPICard label="Staff Utilization" value={m.staffUtilization} previous={m.prevStaffUtil} format="percent" icon={Users} color="warning" />
        <KPICard label="Energy (kWh)" value={m.energyConsumption} previous={m.prevEnergy} icon={Zap} color="warning" />
      </div>

      {/* Intelligence Score + Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Intelligence Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 lg:col-span-1 relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-ai-DEFAULT/20 rounded-full blur-3xl" />
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-ai-light" />
            <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">Resort Intelligence Score</span>
          </div>
          <div className="flex items-end gap-3">
            <div className="text-6xl font-display font-bold gradient-text-ai">{data.intelligenceScore}</div>
            <div className="text-white/30 text-xl mb-2">/100</div>
          </div>
          <div className="text-white/50 text-sm mt-2">Composite AI health metric across operations, guests & revenue</div>

          <div className="h-32 mt-4 -mx-2">
            <ResponsiveContainer>
              <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{ name: "Score", value: data.intelligenceScore, fill: "#7c3aed" }]} startAngle={90} endAngle={-270}>
                <RadialBar background={{ fill: "rgba(255,255,255,0.05)" }} dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="section-header">7-Day Revenue Forecast</div>
              <div className="section-sub">AI-predicted revenue trajectory</div>
            </div>
            <span className="badge-purple"><Sparkles className="w-3 h-3" /> AI Forecast</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={forecast}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip
                  contentStyle={{ background: "rgba(15,15,26,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
                  formatter={(v: any) => [formatINR(v), "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Middle Row: Room Status + Energy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <div className="section-header mb-1">Room Status</div>
          <div className="section-sub mb-4">{data.roomSummary.total} rooms & villas</div>
          <div className="h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={ROOM_DIST} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {ROOM_DIST.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(15,15,26,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {ROOM_DIST.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-white/70">{d.name}</span>
                </div>
                <span className="text-white font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="section-header flex items-center gap-2"><Zap className="w-4 h-4 text-warning-light" /> Energy Consumption (Last 24h)</div>
              <div className="section-sub">Total: {formatNumber(m.energyConsumption)} kWh</div>
            </div>
            <span className="badge-green"><Leaf className="w-3 h-3" /> 12% below target</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={SAMPLE_ENERGY}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <Tooltip contentStyle={{ background: "rgba(15,15,26,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} formatter={(v: any) => [`${v} kWh`, "Consumption"]} />
                <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* 3D Digital Twin Property Showcase Card */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 mb-6 relative overflow-hidden border border-blue-500/20 bg-gradient-to-r from-blue-950/30 via-slate-900/40 to-slate-950/50">
        <div className="absolute top-0 right-0 w-80 h-full bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 flex-shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-base">3D Digital Twin Property Canvas</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  LIVE 3D
                </span>
              </div>
              <div className="text-white/60 text-xs mt-0.5 max-w-xl">
                Real-time interactive WebGL digital twin with 10-floor navigator, dynamic daylight & twilight simulation, and interactive 3D room interior tours.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-300 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>10 Floors • 240 Rooms</span>
            </div>
            <a
              href="/digital-twin"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Explore 3D Digital Twin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Bottom Row: Weather + Alerts + AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weather */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            {weather.condition === "RAINY" ? <Cloud className="w-4 h-4 text-brand-400" /> : <Sun className="w-4 h-4 text-accent-400" />}
            <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">Weather & Impact</span>
          </div>
          <div className="flex items-end gap-2 mb-3">
            <div className="text-5xl font-display font-bold text-white">{weather.temperature.toFixed(1)}°</div>
            <div className="text-white/40 text-sm mb-2">C • {weather.condition}</div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="glass-card p-2.5">
              <div className="text-white/40 text-[10px] uppercase">Humidity</div>
              <div className="text-white text-lg font-semibold">{weather.humidity}%</div>
            </div>
            <div className="glass-card p-2.5">
              <div className="text-white/40 text-[10px] uppercase">Wind</div>
              <div className="text-white text-lg font-semibold">{weather.windSpeed.toFixed(1)} km/h</div>
            </div>
          </div>
          <div className="alert-info text-xs">
            <div className="text-brand-300 font-semibold">Rain Probability</div>
            <div className="text-white/70 mt-1">{(weather.rainProbability * 100).toFixed(0)}% — Pool demand -42%, Spa +24%</div>
          </div>
        </motion.div>

        {/* Alerts */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-warning-light" />
              <span className="text-white font-semibold">Active Alerts</span>
            </div>
            <span className="badge-yellow">{data.alerts.length}</span>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {data.alerts.slice(0, 6).map((a) => (
              <div key={a.id} className={`p-2.5 rounded-xl ${
                a.severity === "CRITICAL" ? "alert-critical" : a.severity === "WARNING" ? "alert-warning" : "alert-info"
              }`}>
                <div className="text-white text-xs font-semibold">{a.title}</div>
                <div className="text-white/50 text-[11px] mt-0.5 line-clamp-2">{a.message}</div>
                <div className="text-white/30 text-[10px] mt-1">{timeAgo(a.createdAt)}</div>
              </div>
            ))}
            {data.alerts.length === 0 && <div className="text-white/30 text-sm text-center py-6">All clear ✨</div>}
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-ai-DEFAULT/10 rounded-full blur-3xl" />
          <div className="flex items-center justify-between mb-3 relative">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-ai-light" />
              <span className="text-white font-semibold">AI Recommendations</span>
            </div>
            <span className="badge-purple">AI</span>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto relative">
            {data.aiRecommendations.slice(0, 5).map((r) => (
              <div key={r.id} className="glass-card p-2.5 border-ai-DEFAULT/20">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-white text-xs font-semibold flex-1">{r.title}</div>
                  <span className={`badge text-[9px] ${r.priority <= 2 ? "badge-red" : "badge-yellow"}`}>P{r.priority}</span>
                </div>
                <div className="text-white/50 text-[11px] mt-1 line-clamp-2">{r.description}</div>
                <div className="text-ai-light text-[10px] mt-1.5 font-medium">→ {r.expectedImpact}</div>
              </div>
            ))}
            {data.aiRecommendations.length === 0 && <div className="text-white/30 text-sm text-center py-6">No pending recommendations</div>}
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
}

