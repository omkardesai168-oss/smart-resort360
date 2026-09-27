"use client";

import { useState } from "react";
import { 
  MessageSquare, Heart, AlertCircle, Share2, TrendingUp,
  Sparkles, Bot, Filter, ShieldCheck, CheckCircle2, User, Radio, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SocialSignal {
  id: string;
  source: "TWITTER" | "INSTAGRAM" | "TRIPADVISOR" | "WEATHER_WATCH" | "LOCAL_NEWS";
  handle: string;
  avatar: string;
  author: string;
  content: string;
  sentiment: "POSITIVE" | "NEUTRAL" | "ANXIOUS" | "CRITICAL";
  timestamp: string;
  location: string;
  aiExtractedAction: string;
  verified: boolean;
}

const SAMPLE_SIGNALS: SocialSignal[] = [
  {
    id: "sig-101",
    source: "WEATHER_WATCH",
    handle: "@CoorgWeatherWatch",
    author: "Coorg Weather & Tourism Watch",
    avatar: "⛈️",
    content: "Monsoon precipitation active across Madikeri-Suntikoppa belt. Heavy cloudburst recorded near Western Ghats ridge. Road pass open with caution speed limits.",
    sentiment: "ANXIOUS",
    timestamp: "8m ago",
    location: "Coorg Highway Pass",
    aiExtractedAction: "Alert Inventory Staff for warehouse delivery buffer.",
    verified: true,
  },
  {
    id: "sig-102",
    source: "INSTAGRAM",
    handle: "@ananya_travels",
    author: "Ananya Sharma (Guest in Villa 104)",
    avatar: "📸",
    content: "Surprised by sudden monsoon shower at Azure Hills Resort! 🌧️ Amazing how fast the resort team moved our evening high-tea into the Spa Pavilion. Loving the hot Coorg coffee!",
    sentiment: "POSITIVE",
    timestamp: "14m ago",
    location: "Azure Hills Spa Pavilion",
    aiExtractedAction: "Positive sentiment +15%. Guest delight rating high.",
    verified: true,
  },
  {
    id: "sig-103",
    source: "TRIPADVISOR",
    handle: "@vikram_explorer",
    author: "Vikram R. (Verified Guest)",
    avatar: "⭐",
    content: "Rainy weather in Coorg is breathtaking! Pool deck closed due to heavy rain as expected, but spa therapist Meera gave an incredible herbal massage. Staff handling monsoon smoothly.",
    sentiment: "POSITIVE",
    timestamp: "28m ago",
    location: "Azure Hills Resort",
    aiExtractedAction: "Confirm Spa staffing reallocation success.",
    verified: true,
  },
  {
    id: "sig-104",
    source: "TWITTER",
    handle: "@KarnatakaTraffic",
    author: "Karnataka State Traffic Alerts",
    avatar: "🚨",
    content: "Advisory: Minor mist and water accumulation on Highway SH-88 leading to Coorg resorts. Vehicles advised to keep headlights on.",
    sentiment: "NEUTRAL",
    timestamp: "42m ago",
    location: "SH-88 Access Highway",
    aiExtractedAction: "Send arrival advisory SMS to 14 arriving guests.",
    verified: true,
  },
  {
    id: "sig-105",
    source: "LOCAL_NEWS",
    handle: "@KodaguNews24",
    author: "Kodagu Times Live",
    avatar: "📰",
    content: "Monsoon showers expected to continue over next 36 hours across South Coorg. Coffee estates & luxury resorts operating normally with indoor protocols.",
    sentiment: "NEUTRAL",
    timestamp: "1h ago",
    location: "Kodagu District",
    aiExtractedAction: "Maintain indoor dining & spa shift extensions.",
    verified: true,
  },
];

export function SocialSignalFeed() {
  const [filter, setFilter] = useState<"ALL" | "POSITIVE" | "ANXIOUS" | "WEATHER_WATCH">("ALL");

  const displayed = filter === "ALL" 
    ? SAMPLE_SIGNALS 
    : filter === "WEATHER_WATCH" 
    ? SAMPLE_SIGNALS.filter(s => s.source === "WEATHER_WATCH" || s.source === "LOCAL_NEWS")
    : SAMPLE_SIGNALS.filter(s => s.sentiment === filter);

  return (
    <div className="glass-card p-5 space-y-4 border-amber-500/30 bg-gradient-to-br from-surface-900 via-surface-950 to-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Radio className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-display font-bold text-white">Real-World Social Signals & Sentiment</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE SOCIAL FEED
              </span>
            </div>
            <p className="text-xs text-white/50 mt-0.5">
              Real-time traveler posts, local news, weather watch signals & AI sentiment processing
            </p>
          </div>
        </div>

        {/* Sentiment Score Summary */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
            68% Positive
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
            22% Neutral
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
            10% Anxious
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-white/40" />
        {(["ALL", "POSITIVE", "ANXIOUS", "WEATHER_WATCH"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1 rounded-xl text-xs font-semibold transition-all",
              filter === f
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-white/[0.04] hover:bg-white/[0.08] text-white/60 border border-white/10"
            )}
          >
            {f === "ALL" ? "All Signals" : f === "WEATHER_WATCH" ? "📡 Weather & Traffic News" : f}
          </button>
        ))}
      </div>

      {/* Feed List */}
      <div className="space-y-3">
        {displayed.map((sig) => (
          <div
            key={sig.id}
            className="p-4 rounded-2xl bg-surface-900/90 border border-white/10 hover:border-amber-500/30 transition-all space-y-2.5"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{sig.avatar}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{sig.author}</span>
                    <span className="text-[10px] font-mono text-white/40">{sig.handle}</span>
                    {sig.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="text-[10px] text-white/40">{sig.location} · {sig.timestamp}</div>
                </div>
              </div>

              <span className={cn(
                "text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-mono",
                sig.sentiment === "POSITIVE" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
                sig.sentiment === "ANXIOUS" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
                "bg-blue-500/20 text-blue-300 border-blue-500/30"
              )}>
                {sig.sentiment} SENTIMENT
              </span>
            </div>

            <p className="text-xs text-white/80 leading-relaxed font-sans">
              "{sig.content}"
            </p>

            {/* AI Extracted Insight Box */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="text-amber-300 font-mono text-[11px] flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-amber-400" />
                <strong>AI Signal Insight:</strong> {sig.aiExtractedAction}
              </span>
              <span className="text-[10px] text-white/40 flex items-center gap-1">
                Verified Social Telemetry <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
