"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { type LucideIcon, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  badge?: string;
  showBackButton?: boolean;
}

export function PageHeader({ title, description, icon: Icon, actions, badge, showBackButton = true }: PageHeaderProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-line"
    >
      <div className="flex items-center gap-3">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            title="Go Back"
            className="w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer flex-shrink-0 shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-brand-400" />
          </button>
        )}
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow-brand flex-shrink-0">
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-normal text-white">{title}</h1>
            {badge && <span className="badge-blue text-[10px]">{badge}</span>}
          </div>
          {description && <p className="text-white/50 text-sm mt-2 leading-relaxed">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </motion.div>
  );
}

export function PageContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-4 sm:p-6 lg:p-8 max-w-[1800px] mx-auto", className)}>{children}</div>;
}
