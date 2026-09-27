"use client";

import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, type LucideIcon } from "lucide-react";
import { cn, formatINR, formatPercent, formatNumber } from "@/lib/utils";

interface KPICardProps {
  label: string;
  value: number;
  previous?: number;
  format?: "number" | "percent" | "currency" | "decimal";
  icon: LucideIcon;
  color?: "brand" | "success" | "warning" | "danger" | "ai" | "accent";
  suffix?: string;
  decimals?: number;
}

const COLOR_MAP = {
  brand: "from-brand-500/20 to-brand-500/0 text-brand-400 border-brand-500/20",
  success: "from-success-DEFAULT/20 to-success-DEFAULT/0 text-success-light border-success-DEFAULT/20",
  warning: "from-warning-DEFAULT/20 to-warning-DEFAULT/0 text-warning-light border-warning-DEFAULT/20",
  danger: "from-danger-DEFAULT/20 to-danger-DEFAULT/0 text-danger-light border-danger-DEFAULT/20",
  ai: "from-ai-DEFAULT/20 to-ai-DEFAULT/0 text-ai-light border-ai-DEFAULT/20",
  accent: "from-accent-500/20 to-accent-500/0 text-accent-400 border-accent-500/20",
};

export function KPICard({
  label,
  value,
  previous,
  format = "number",
  icon: Icon,
  color = "brand",
  suffix,
  decimals,
}: KPICardProps) {
  const change = previous && previous > 0 ? ((value - previous) / previous) * 100 : 0;
  const isPositive = change >= 0;

  let displayValue: string;
  if (format === "currency") displayValue = formatINR(value);
  else if (format === "percent") displayValue = formatPercent(value, decimals ?? 1);
  else if (format === "decimal") displayValue = value.toFixed(decimals ?? 1);
  else displayValue = formatNumber(value);

  if (suffix) displayValue = `${displayValue}${suffix}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("kpi-card relative overflow-hidden", `bg-gradient-to-br ${COLOR_MAP[color]}`)}
    >
      <div className="absolute inset-0 bg-surface-800/60 backdrop-blur-md -z-10" />
      <div className="flex items-start justify-between">
        <div>
          <div className="metric-label">{label}</div>
          <div className="metric-value mt-2 count-animate">{displayValue}</div>
        </div>
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border", COLOR_MAP[color].split(" ").slice(-2).join(" "))}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      {previous !== undefined && previous > 0 && (
        <div className="flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-semibold",
              isPositive ? "text-success-light" : "text-danger-light"
            )}
          >
            {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {Math.abs(change).toFixed(1)}%
          </span>
          <span className="text-white/40">vs previous</span>
        </div>
      )}
    </motion.div>
  );
}
