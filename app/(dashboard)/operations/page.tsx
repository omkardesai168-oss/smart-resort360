"use client";

import { useEffect, useState } from "react";
import { Hotel, Users, Wrench, Package, LayoutDashboard } from "lucide-react";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";

const SUB_PAGES = [
  { href: "/operations/revenue-simulator", label: "Revenue Intelligence Simulator", icon: Hotel, description: "Live Digital Twin bookings & dynamic rates", color: "from-brand-500 to-brand-700" },
  { href: "/operations/occupancy", label: "Occupancy", icon: Hotel, description: "Room status & availability", color: "from-brand-500 to-brand-700" },
  { href: "/operations/staff", label: "Staff Management", icon: Users, description: "Workforce optimization", color: "from-emerald-500 to-emerald-700" },
  { href: "/operations/maintenance", label: "Maintenance", icon: Wrench, description: "Assets & work orders", color: "from-warning-DEFAULT to-accent-500" },
  { href: "/operations/inventory", label: "Inventory", icon: Package, description: "Stock & suppliers", color: "from-ai-DEFAULT to-purple-700" },
];

export default function OperationsPage() {
  return (
    <PageContainer>
      <PageHeader title="Operations" description="Manage every facet of your property operations" icon={LayoutDashboard} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUB_PAGES.map((p) => (
          <a key={p.href} href={p.href} className="glass-card-hover p-6 group block">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <p.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-white font-semibold mb-1">{p.label}</div>
            <div className="text-white/50 text-sm">{p.description}</div>
          </a>
        ))}
      </div>
    </PageContainer>
  );
}
