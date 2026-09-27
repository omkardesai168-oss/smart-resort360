"use client";

import { useSession } from "next-auth/react";
import { Settings, User, Bell, Lock, Sparkles, Database } from "lucide-react";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";

export default function SettingsPage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  return (
    <PageContainer>
      <PageHeader title="Settings" description="Manage your profile, notifications, and integrations" icon={Settings} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <div className="section-header mb-4 flex items-center gap-2"><User className="w-4 h-4 text-brand-400" /> Profile</div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-brand-gradient flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.[0] || "U"}
            </div>
            <div>
              <div className="text-white font-semibold">{user?.name}</div>
              <div className="text-white/50 text-sm">{user?.email}</div>
              <span className="badge-purple mt-1 inline-block">{(user?.role || "").replace("_", " ")}</span>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-white/50">Department</span><span className="text-white">{user?.department || "Management"}</span></div>
            <div className="flex justify-between"><span className="text-white/50">Last Login</span><span className="text-white">Just now</span></div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="section-header mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-warning-light" /> Notifications</div>
          <div className="space-y-3 text-sm">
            {[
              { name: "Critical Alerts", desc: "Guest, maintenance, crisis", enabled: true },
              { name: "AI Recommendations", desc: "New suggestions to review", enabled: true },
              { name: "Daily Digest", desc: "8:00 AM summary email", enabled: true },
              { name: "Revenue Milestones", desc: "Goals hit + variance alerts", enabled: true },
              { name: "Weather Warnings", desc: "Severe conditions forecast", enabled: false },
            ].map((n) => (
              <div key={n.name} className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{n.name}</div>
                  <div className="text-white/40 text-xs">{n.desc}</div>
                </div>
                <div className={`w-10 h-5 rounded-full ${n.enabled ? "bg-brand-500" : "bg-white/10"} relative transition-colors`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${n.enabled ? "left-5" : "left-0.5"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="section-header mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-ai-light" /> AI Integrations</div>
          <div className="space-y-3">
            <div className="glass-card p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold text-sm">OpenAI</div>
                  <div className="text-white/40 text-xs">GPT-4 for AI Copilot</div>
                </div>
                <span className="badge-yellow text-[10px]">DEMO</span>
              </div>
              <div className="text-white/50 text-xs mt-2">Add OPENAI_API_KEY to .env.local to enable.</div>
            </div>
            <div className="glass-card p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold text-sm">OpenWeather</div>
                  <div className="text-white/40 text-xs">Real-time weather feed</div>
                </div>
                <span className="badge-gray text-[10px]">DISABLED</span>
              </div>
            </div>
            <div className="glass-card p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold text-sm">Channel Manager</div>
                  <div className="text-white/40 text-xs">Booking.com, Expedia sync</div>
                </div>
                <span className="badge-blue text-[10px]">CONNECTED</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="section-header mb-4 flex items-center gap-2"><Database className="w-4 h-4 text-cyan-400" /> Resort Info</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-white/50">Name</span><span className="text-white font-medium">Azure Hills Resort</span></div>
            <div className="flex justify-between"><span className="text-white/50">Location</span><span className="text-white">Coorg, Karnataka</span></div>
            <div className="flex justify-between"><span className="text-white/50">Total Rooms</span><span className="text-white">120 + 20 Villas</span></div>
            <div className="flex justify-between"><span className="text-white/50">Star Rating</span><span className="text-white">5 ⭐</span></div>
            <div className="flex justify-between"><span className="text-white/50">Currency</span><span className="text-white">INR (₹)</span></div>
            <div className="flex justify-between"><span className="text-white/50">Timezone</span><span className="text-white">Asia/Kolkata</span></div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="section-header mb-4 flex items-center gap-2"><Lock className="w-4 h-4 text-danger-light" /> Security</div>
          <div className="space-y-2 text-sm">
            <button className="btn-secondary w-full text-xs justify-start">Change Password</button>
            <button className="btn-secondary w-full text-xs justify-start">Two-Factor Auth</button>
            <button className="btn-secondary w-full text-xs justify-start">Active Sessions</button>
            <button className="btn-secondary w-full text-xs justify-start">Login History</button>
            <button className="btn-danger w-full text-xs justify-start">Sign Out All Devices</button>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="section-header mb-4">System Status</div>
          <div className="space-y-2 text-sm">
            {[
              { name: "API", status: "Operational", color: "bg-success-light", text: "text-success-light" },
              { name: "Database", status: "Operational", color: "bg-success-light", text: "text-success-light" },
              { name: "AI Engine", status: "Demo Mode", color: "bg-warning-light", text: "text-warning-light" },
              { name: "Realtime Streams", status: "Operational", color: "bg-success-light", text: "text-success-light" },
              { name: "Email Service", status: "Operational", color: "bg-success-light", text: "text-success-light" },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${s.color} animate-pulse`} />
                  <span className="text-white/80">{s.name}</span>
                </div>
                <span className={`${s.text} text-xs font-semibold`}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
