"use client";

import { useState, useEffect } from "react";
import { 
  CloudRain, Sun, Thermometer, Wind, RefreshCw, Sparkles,
  Bot, ShieldCheck, MapPin, Coffee, Utensils, Activity, Radio
} from "lucide-react";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";
import { IndiaGeospatialMap } from "@/components/dashboard/india-geospatial-map";
import { SocialSignalFeed } from "@/components/dashboard/social-signal-feed";
import { cn } from "@/lib/utils";

export default function GuestWeatherPage() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/weather");
      const json = await res.json();
      if (json.success) {
        setWeatherData(json.data);
      }
    } catch (e) {
      console.error("Failed to fetch live weather:", e);
    } finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 30000);
    return () => clearInterval(interval);
  }, []);

  const cur = weatherData?.current;

  return (
    <PageContainer>
      <PageHeader
        title="Live Weather & India Geospatial Map"
        description="Real-time resort weather telemetry · India regional geospatial map · Real-world traveler social signals"
        icon={CloudRain}
        badge="GUEST EXPERIENCE"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live · {lastRefreshed.toLocaleTimeString()}
            </div>
            <button
              onClick={fetchWeather}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs text-white/80 transition-all cursor-pointer"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
              Sync Weather
            </button>
          </div>
        }
      />

      {/* ── Live Weather Telemetry Header Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4 border-brand-500/30 bg-gradient-to-br from-brand-950/30 to-surface-950">
          <div className="flex items-center justify-between text-white/50 text-xs mb-1">
            <span>Coorg Live Temp</span>
            <Thermometer className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-bold font-display text-white">
            {loading ? "..." : `${cur?.temp ?? 24.2}°C`}
          </div>
          <div className="text-[10px] text-brand-300 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            {cur?.condition ?? "Monsoon Overcast"}
          </div>
        </div>

        <div className="glass-card p-4 border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 to-surface-950">
          <div className="flex items-center justify-between text-white/50 text-xs mb-1">
            <span>Precipitation Risk</span>
            <CloudRain className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-display text-cyan-300">
            {loading ? "..." : `${cur?.precipitationProb ?? 78}%`}
          </div>
          <div className="text-[10px] text-cyan-200 mt-1 font-mono">
            Outdoor Risk: {weatherData?.aiImpactAnalysis?.outdoorPoolRiskPct ?? 84}%
          </div>
        </div>

        <div className="glass-card p-4 border-amber-500/30 bg-gradient-to-br from-amber-950/30 to-surface-950">
          <div className="flex items-center justify-between text-white/50 text-xs mb-1">
            <span>Wind & Humidity</span>
            <Wind className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-display text-amber-300">
            {loading ? "..." : `${cur?.windSpeed ?? 14.5} km/h`}
          </div>
          <div className="text-[10px] text-amber-200 mt-1 font-mono">
            Humidity: {cur?.humidity ?? 86}%
          </div>
        </div>

        <div className="glass-card p-4 border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 to-surface-950">
          <div className="flex items-center justify-between text-white/50 text-xs mb-1">
            <span>AI Spa & Dining Boost</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-display text-emerald-300">
            +{weatherData?.aiImpactAnalysis?.spaDemandBoostPct ?? 35}%
          </div>
          <div className="text-[10px] text-emerald-200 mt-1 font-mono">
            Indoor Experiences Active
          </div>
        </div>
      </div>

      {/* ── AI Guest Concierge Weather Recommendation ── */}
      {weatherData?.aiImpactAnalysis && (
        <div className="glass-card p-4 border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-surface-900 to-surface-950 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300">AI CONCIERGE WEATHER RECOMMENDATION</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  REAL-TIME ADVISORY
                </span>
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                {weatherData.aiImpactAnalysis.aiRecommendation}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-white/40 whitespace-nowrap self-start sm:self-center">
            Source: {weatherData.source}
          </span>
        </div>
      )}

      {/* ── SECTION 1: Geospatial Location Map of India ── */}
      <div className="mb-6">
        <IndiaGeospatialMap />
      </div>

      {/* ── SECTION 2: Real-World Social Signals Feed ── */}
      <div className="mb-6">
        <SocialSignalFeed />
      </div>

      {/* ── SECTION 3: 7-Day Weather Forecast & Guest Experiences ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass-card p-5 space-y-4">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            7-Day Weather Forecast (Coorg, India)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {(weatherData?.forecast || []).map((f: any, i: number) => (
              <div key={i} className="p-3 rounded-xl bg-surface-900/80 border border-white/10 text-center space-y-1">
                <div className="text-xs font-bold text-white">{f.date}</div>
                <div className="text-lg font-bold text-amber-300">{f.maxTemp}°C</div>
                <div className="text-[10px] text-white/40">{f.minTemp}°C min</div>
                <div className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 py-0.5 rounded">
                  💧 {f.precipProb}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5 space-y-3">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <Coffee className="w-4 h-4 text-amber-400" />
            Curated Weather Experiences
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Ayurvedic Hot Herbal Massage
              </div>
              <p className="text-white/60">Perfect during monsoon rains. Spa therapists available at Spa Pavilion.</p>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-amber-400" />
                Artisan Coorg Coffee & Tea Tasting
              </div>
              <p className="text-white/60">Served hot in the Fine Dining indoor lounge during rain showers.</p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
