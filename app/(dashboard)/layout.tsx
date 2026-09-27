"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Building2, Cpu, Users, Star,
  TrendingUp, Brain, Leaf, Shield, AlertTriangle,
  Zap, Settings, ChevronDown, ChevronRight, Menu, X,
  Bell, Search, Bot, CircleDot, LogOut, User,
  Hotel, Wrench, Package, Wind, Activity,
  MessageSquare, MapPin, Heart, DollarSign,
  BarChart3, Target, Megaphone, Sparkles,
  LineChart, FlaskConical, BatteryCharging, Lock,
  Workflow, Flame, Sun, Moon, ChevronLeft, ArrowLeft, Home, CloudRain,
  CheckSquare, CalendarClock, ListTodo, Sliders
} from "lucide-react";
import { useResortStore } from "@/lib/store/resort-store";
import { signOut } from "next-auth/react";

// ============================================
// STAFF-ONLY NAVIGATION (Exact 4 Prioritized Features)
// ============================================

const STAFF_NAV_ITEMS = [
  {
    id: "staff-tasks",
    label: "Task Dashboard",
    icon: CheckSquare,
    href: "/operations/staff?tab=tasks",
    badge: "⭐",
    roles: ["STAFF", "HOUSEKEEPING", "MAINTENANCE"],
  },
  {
    id: "staff-schedule",
    label: "AI Schedule",
    icon: CalendarClock,
    href: "/operations/staff?tab=schedule",
    badge: "⭐ AI",
    roles: ["STAFF", "HOUSEKEEPING", "MAINTENANCE"],
  },
  {
    id: "staff-requests",
    label: "Guest Requests",
    icon: MessageSquare,
    href: "/operations/staff?tab=requests",
    badge: "Live",
    roles: ["STAFF", "HOUSEKEEPING", "MAINTENANCE"],
  },
  {
    id: "staff-notifications",
    label: "Notifications",
    icon: Bell,
    href: "/operations/staff?tab=notifications",
    roles: ["STAFF", "HOUSEKEEPING", "MAINTENANCE"],
  },
  {
    id: "inventory-staff",
    label: "Inventory Staff",
    icon: Package,
    href: "/operations/inventory-staff",
    badge: "AI",
    roles: ["STAFF", "HOUSEKEEPING", "MAINTENANCE"],
  },
];

// ============================================
// FULL NAVIGATION STRUCTURE (Manager & Admin)
// ============================================

const NAV_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    href: "/overview",
    roles: ["SUPER_ADMIN", "RESORT_MANAGER", "OPERATIONS_MANAGER", "REVENUE_MANAGER"],
  },
  {
    id: "digital-twin",
    label: "Digital Twin",
    icon: Building2,
    href: "/digital-twin",
    roles: ["SUPER_ADMIN", "RESORT_MANAGER", "OPERATIONS_MANAGER", "REVENUE_MANAGER"],
    badge: "3D",
  },
  {
    id: "operations",
    label: "Operations",
    icon: Cpu,
    roles: ["SUPER_ADMIN", "RESORT_MANAGER", "OPERATIONS_MANAGER", "HOUSEKEEPING", "MAINTENANCE"],
    children: [
      { id: "revenue-simulator", label: "Revenue Simulator", icon: Sliders, href: "/operations/revenue-simulator", roles: ["SUPER_ADMIN", "RESORT_MANAGER", "OPERATIONS_MANAGER", "REVENUE_MANAGER"] },
      { id: "occupancy", label: "Occupancy", icon: Hotel, href: "/operations/occupancy" },
      { id: "staff", label: "Staff", icon: Users, href: "/operations/staff" },
      { id: "staff-directory", label: "Staff Directory", icon: Users, href: "/operations/staff-directory", badge: "NEW" },
      { id: "maintenance", label: "Maintenance", icon: Wrench, href: "/operations/maintenance" },
      { id: "inventory", label: "Inventory", icon: Package, href: "/operations/inventory" },
    ],
  },
  {
    id: "guests",
    label: "Guest Experience",
    icon: Star,
    roles: ["SUPER_ADMIN", "CONCIERGE", "GUEST"],
    children: [
      { id: "guest-list", label: "Guests", icon: Users, href: "/guests", roles: ["SUPER_ADMIN", "CONCIERGE"] },
      { id: "guest-digital-twin", label: "Digital Twin", icon: Building2, href: "/guests/digital-twin", badge: "3D", roles: ["SUPER_ADMIN", "CONCIERGE", "GUEST"] },
      { id: "concierge", label: "AI Concierge", icon: MessageSquare, href: "/guests/concierge", badge: "AI" },
      { id: "guest-weather", label: "Weather & India Map", icon: CloudRain, href: "/guests/weather", badge: "LIVE" },
      { id: "journey", label: "Guest Journey", icon: MapPin, href: "/guests/journey", roles: ["SUPER_ADMIN", "CONCIERGE"] },
      { id: "recovery", label: "Service Recovery", icon: Activity, href: "/guests/recovery", roles: ["SUPER_ADMIN", "CONCIERGE"] },
    ],
  },
  {
    id: "ai",
    label: "AI Intelligence",
    icon: Brain,
    roles: ["SUPER_ADMIN", "RESORT_MANAGER", "REVENUE_MANAGER", "OPERATIONS_MANAGER"],
    badge: "AI",
    children: [
      { id: "agents", label: "Multi-Agent Hub", icon: Brain, href: "/ai/agents", badge: "⭐ Gen AI" },
      { id: "copilot", label: "AI Copilot", icon: Bot, href: "/ai/copilot", badge: "AI" },
      { id: "actions", label: "Next Best Actions", icon: Sparkles, href: "/ai/actions" },
    ],
  },

  {
    id: "crisis",
    label: "Crisis Center",
    icon: Flame,
    href: "/crisis",
    roles: ["SUPER_ADMIN", "RESORT_MANAGER", "OPERATIONS_MANAGER"],
    badge: "LIVE",
  },
  {
    id: "automation",
    label: "Automation",
    icon: Workflow,
    href: "/automation",
    roles: ["SUPER_ADMIN", "RESORT_MANAGER"],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/settings",
    roles: ["all"],
  },
];

// ============================================
// SIDEBAR NAV ITEM
// ============================================

function NavItem({ item, depth = 0, collapsed }: { item: any; depth?: number; collapsed: boolean }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(
    item.children?.some((c: any) => pathname.startsWith(c.href || ""))
  );

  const isActive = item.href ? pathname.startsWith(item.href) : false;
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren && !collapsed) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
            ${expanded ? "text-white bg-white/[0.06]" : "text-white/50 hover:text-white hover:bg-white/[0.04]"}`}
        >
          <item.icon className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badge === "AI" ? "bg-ai-DEFAULT/30 text-ai-light" : "bg-brand-500/30 text-brand-300"}`}>
              {item.badge}
            </span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-3 mt-1 space-y-0.5 border-l border-white/[0.06] pl-3"
            >
              {item.children.map((child: any) => (
                <NavItem key={child.id} item={child} depth={1} collapsed={collapsed} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (!item.href) return null;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
        ${isActive
          ? "text-white bg-brand-500/20 border border-brand-500/30 shadow-glow-brand/20"
          : "text-white/50 hover:text-white hover:bg-white/[0.06]"
        } ${collapsed ? "justify-center" : ""}`}
    >
      <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-brand-400" : ""}`} />
      {!collapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              item.badge === "AI" ? "bg-ai-DEFAULT/30 text-ai-light" :
              item.badge === "LIVE" ? "bg-danger-DEFAULT/30 text-danger-light" :
              "bg-brand-500/30 text-brand-300"}`}>
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

// ============================================
// DASHBOARD LAYOUT
// ============================================

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const sidebarCollapsed = useResortStore(s => s.sidebarCollapsed);
  const toggleSidebar = useResortStore(s => s.toggleSidebar);
  const alerts = useResortStore(s => s.alerts);
  const unreadCount = alerts.filter(a => !a.isRead).length;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center animate-pulse">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="text-white/40 text-sm">Loading Smart Resort 360...</div>
        </div>
      </div>
    );
  }

  const userRole = (session?.user as any)?.role || "CONCIERGE";
  const userEmail = (session?.user as any)?.email || "";
  const isStaff = userRole === "STAFF" || userRole === "HOUSEKEEPING" || userRole === "MAINTENANCE" || userEmail.toLowerCase().includes("staff");

  const filteredNav = isStaff 
    ? STAFF_NAV_ITEMS 
    : NAV_ITEMS
        .filter(item => item.roles?.includes("all") || item.roles?.includes(userRole))
        .map(item => {
          if (!item.children) return item;
          return {
            ...item,
            children: item.children.filter((child: any) =>
              !child.roles || child.roles.includes("all") || child.roles.includes(userRole)
            ),
          };
        });

  return (
    <div className="min-h-screen bg-surface-950 flex overflow-hidden">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`hidden lg:flex flex-col h-screen bg-surface-900/80 backdrop-blur-xl border-r border-white/[0.05] flex-shrink-0 overflow-hidden`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 p-4 border-b border-white/[0.05] h-16 flex-shrink-0 ${sidebarCollapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 bg-brand-gradient rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow-brand">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <div className="text-white font-display font-bold text-sm leading-tight whitespace-nowrap">Smart Resort 360</div>
              <div className="text-white/30 text-[10px] whitespace-nowrap">AI Intelligence Platform</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto no-scrollbar">
          {filteredNav.map(item => (
            <NavItem key={item.id} item={item} collapsed={sidebarCollapsed} />
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/[0.05]">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.06] transition-all text-sm"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: mobileOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="lg:hidden fixed left-0 top-0 h-full w-72 bg-surface-900 border-r border-white/[0.05] z-50 flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/[0.05] h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-gradient rounded-xl flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="text-white font-display font-bold text-sm">Smart Resort 360</div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {filteredNav.map(item => (
            <NavItem key={item.id} item={item} collapsed={false} />
          ))}
        </nav>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <header className="h-16 bg-surface-900/60 backdrop-blur-xl border-b border-white/[0.05] flex items-center px-4 gap-2.5 flex-shrink-0">
          <button
            className="lg:hidden text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick Navigation: Back & Home buttons */}
          <div className="flex items-center gap-1.5">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              title="Go back to previous page"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-white/90 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-brand-400" />
              <span className="hidden sm:inline">Back</span>
            </button>

            {/* Home Button */}
            <Link
              href={userRole === "GUEST" ? "/guests/concierge" : isStaff ? "/operations/staff" : "/overview"}
              title="Go to Homepage"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-white/90 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>

          {/* Resort selector */}
          <div className="hidden xl:flex items-center gap-2 glass-card px-3 py-1.5 cursor-pointer hover:border-brand-500/30 transition-colors">
            <div className="w-5 h-5 bg-accent-gradient rounded-lg flex items-center justify-center flex-shrink-0">
              <Star className="w-3 h-3 text-white" />
            </div>
            <span className="text-white/80 text-sm font-medium">Azure Hills Resort</span>
            <ChevronDown className="w-3.5 h-3.5 text-white/40" />
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search guests, rooms, alerts..."
                className="input pl-9 py-2 text-sm"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* AI Status */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 glass-card">
              <div className="w-1.5 h-1.5 rounded-full bg-ai-light animate-pulse" />
              <span className="text-ai-light text-xs font-medium">AI Active</span>
            </div>

            {/* Direct Sign Out Button */}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Sign Out of Smart Resort 360"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-xs font-bold text-red-300 hover:text-red-200 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                id="notifications-btn"
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-9 h-9 glass-card flex items-center justify-center hover:border-brand-500/30 transition-colors"
              >
                <Bell className="w-4 h-4 text-white/60" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger-DEFAULT rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-12 w-80 glass-card shadow-elevated z-50 overflow-hidden"
                  >
                    <div className="p-3 border-b border-white/[0.06] flex items-center justify-between">
                      <span className="text-white font-semibold text-sm">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="badge-red">{unreadCount} new</span>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04]">
                      {alerts.slice(0, 8).map(alert => (
                        <div key={alert.id} className={`p-3 hover:bg-white/[0.03] cursor-pointer ${!alert.isRead ? "bg-brand-500/5" : ""}`}>
                          <div className="flex items-start gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                              alert.severity === "CRITICAL" ? "bg-danger-DEFAULT" :
                              alert.severity === "WARNING" ? "bg-warning-DEFAULT" : "bg-brand-500"
                            }`} />
                            <div>
                              <div className="text-white text-xs font-semibold">{alert.title}</div>
                              <div className="text-white/40 text-xs mt-0.5 line-clamp-2">{alert.message}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {alerts.length === 0 && (
                        <div className="p-6 text-center text-white/30 text-sm">No notifications</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User profile */}
            <div className="relative">
              <button
                id="profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 glass-card px-3 py-1.5 hover:border-brand-500/30 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-brand-gradient flex items-center justify-center text-xs font-bold text-white">
                  {session?.user?.name?.[0] || "U"}
                </div>
                <span className="text-white/80 text-sm font-medium hidden md:block">
                  {session?.user?.name?.split(" ")[0] || "User"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-white/40 hidden md:block" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-12 w-52 glass-card shadow-elevated z-50 overflow-hidden"
                  >
                    <div className="p-3 border-b border-white/[0.06]">
                      <div className="text-white font-semibold text-sm">{session?.user?.name}</div>
                      <div className="text-white/40 text-xs">{(session?.user as any)?.role?.replace("_", " ")}</div>
                    </div>
                    <div className="p-2">
                      <Link href="/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] text-sm">
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-danger-light hover:bg-danger-DEFAULT/10 text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
