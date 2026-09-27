"use client";

import { Brain, Sparkles, Bot } from "lucide-react";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";

const SUB = [
  { href: "/ai/agents", label: "Multi-Agent Command Center", icon: Brain, description: "Master Orchestrator, Staff & Inventory Gen AI Agents", color: "from-ai-DEFAULT via-purple-600 to-brand-700", badge: "⭐ Gen AI" },
  { href: "/ai/copilot", label: "AI Copilot", icon: Bot, description: "Conversational intelligence", color: "from-ai-DEFAULT to-purple-700", badge: "AI" },
  { href: "/ai/actions", label: "Next Best Actions", icon: Sparkles, description: "Prioritized recommendations", color: "from-accent-500 to-warning-DEFAULT", badge: "AI" },
];

export default function AIPage() {
  return (
    <PageContainer>
      <PageHeader title="AI Intelligence" description="Autonomous multi-agent orchestration, conversational copilot, and next best actions" icon={Brain} badge="AI" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUB.map((p) => (
          <a key={p.href} href={p.href} className="glass-card-hover p-6 group block">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow-ai`}>
                <p.icon className="w-6 h-6 text-white" />
              </div>
              {p.badge && <span className="badge-purple">{p.badge}</span>}
            </div>
            <div className="text-white font-semibold mb-1">{p.label}</div>
            <div className="text-white/50 text-sm">{p.description}</div>
          </a>
        ))}
      </div>
    </PageContainer>
  );
}
