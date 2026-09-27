"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Package, AlertTriangle, CheckCircle2, XCircle, Clock,
  RefreshCw, Zap, ShieldCheck, Filter, TrendingDown,
  ArrowUpRight, Bot, Sparkles, ChevronRight, Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface InventoryRequest {
  id: string;
  sku: string;
  itemName: string;
  category: string;
  currentStock: number;
  requestedQty: number;
  unit: string;
  estimatedCost: number;
  priority: string;
  reason: string;
  vendor: string | null;
  status: string;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectionNote: string | null;
  raisedBy: string;
  poNumber: string | null;
  createdAt: string;
}

// ──────────────────────────────────────────────
// Seed Data — simulates critical requests that
// the InventoryManagementAgent would auto-raise
// ──────────────────────────────────────────────
const SEED_REQUESTS = [
  {
    sku: "FOOD-MLK-001", itemName: "Fresh Milk (Full Cream)", category: "FOOD",
    currentStock: 12, requestedQty: 80, unit: "Liters",
    estimatedCost: 4400, priority: "CRITICAL",
    reason: "Stock critically below minimum threshold (30 L). Weekend demand surge predicted. Immediate restock required.",
    vendor: "Amul Fresh Dairy Pvt Ltd", raisedBy: "InventoryManagementAgent",
  },
  {
    sku: "BEV-COF-001", itemName: "Arabica Coffee Beans", category: "BEVERAGE",
    currentStock: 8, requestedQty: 50, unit: "KG",
    estimatedCost: 90000, priority: "CRITICAL",
    reason: "Predicted demand (35 KG) exceeds current stock (8 KG). High-volume breakfast service tomorrow.",
    vendor: "Blue Tokai Coffee Roasters", raisedBy: "InventoryManagementAgent",
  },
  {
    sku: "MNT-FLT-001", itemName: "HVAC Air Filters", category: "MAINTENANCE",
    currentStock: 18, requestedQty: 30, unit: "Pieces",
    estimatedCost: 66000, priority: "HIGH",
    reason: "Quarterly preventive maintenance cycle begins next week. 5 units at reorder point.",
    vendor: "Honeywell India Industrial", raisedBy: "InventoryManagementAgent",
  },
  {
    sku: "HK-TWL-001", itemName: "Bath Towels (Premium)", category: "HOUSEKEEPING",
    currentStock: 250, requestedQty: 200, unit: "Pieces",
    estimatedCost: 170000, priority: "HIGH",
    reason: "Presidential Villa turnaround requires premium linen. Current stock will deplete by end of week.",
    vendor: "Trident Luxury Textiles", raisedBy: "InventoryManagementAgent",
  },
  {
    sku: "AMN-ROB-001", itemName: "Luxury Bathrobes", category: "AMENITIES",
    currentStock: 60, requestedQty: 100, unit: "Pieces",
    estimatedCost: 350000, priority: "HIGH",
    reason: "Occupancy forecast at 94% for this weekend. Diamond VIP guests require premium amenities.",
    vendor: "Welspun Hospitality Solutions", raisedBy: "InventoryManagementAgent",
  },
];

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  CRITICAL: { label: "CRITICAL", color: "text-red-300", bg: "bg-red-500/20", border: "border-red-500/40", icon: AlertTriangle },
  HIGH:     { label: "HIGH",     color: "text-amber-300", bg: "bg-amber-500/20", border: "border-amber-500/30", icon: TrendingDown },
  MEDIUM:   { label: "MEDIUM",   color: "text-blue-300", bg: "bg-blue-500/20", border: "border-blue-500/30", icon: Package },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PENDING:  { label: "Pending Approval", color: "text-amber-300", bg: "bg-amber-500/20", icon: Clock },
  APPROVED: { label: "Approved ✓",       color: "text-emerald-300", bg: "bg-emerald-500/20", icon: CheckCircle2 },
  REJECTED: { label: "Rejected",          color: "text-red-300",    bg: "bg-red-500/20",     icon: XCircle },
};

const CATEGORY_EMOJI: Record<string, string> = {
  FOOD: "🍽️", BEVERAGE: "☕", HOUSEKEEPING: "🛏️",
  MAINTENANCE: "🔧", AMENITIES: "🛁", LINEN: "🧺", GENERAL: "📦",
};

export default function InventoryStaffPage() {
  const [requests, setRequests] = useState<InventoryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "PENDING" | "APPROVED" | "REJECTED">("all");
  const [seedLoading, setSeedLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectionNote, setRejectionNote] = useState<Record<string, string>>({});
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch(`/api/inventory/requests${filter !== "all" ? `?status=${filter}` : ""}`);
      const json = await res.json();
      if (json.success) setRequests(json.requests);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  }, [filter]);

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  const seedRequests = async () => {
    setSeedLoading(true);
    try {
      const res = await fetch("/api/inventory/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync_engine" }),
      });
      const json = await res.json();
      if (!json.requests || json.requests.length === 0) {
        // Fallback seed if needed
        for (const req of SEED_REQUESTS) {
          await fetch("/api/inventory/requests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req),
          });
        }
      }
    } catch (e) {
      console.error("Sync predictive engine error:", e);
    } finally {
      await fetchRequests();
      setSeedLoading(false);
    }
  };

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/inventory/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id, action,
          approvedBy: "Inventory Staff",
          rejectionNote: action === "reject" ? (rejectionNote[id] || "Request deferred by Inventory Staff") : undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setRejectingId(null);
        await fetchRequests();
      }
    } finally {
      setProcessingId(null);
    }
  };

  const pending = requests.filter((r) => r.status === "PENDING");
  const approved = requests.filter((r) => r.status === "APPROVED");
  const rejected = requests.filter((r) => r.status === "REJECTED");
  const critical = requests.filter((r) => r.status === "PENDING" && r.priority === "CRITICAL");

  const displayed = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  return (
    <div className="min-h-screen bg-surface-950 text-white px-4 py-8 md:px-8 max-w-7xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Package className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">Inventory Staff Portal</h1>
              <p className="text-xs text-white/50">AI-raised critical restock requests · Approve or reject to sync with Command Center</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Live · {lastRefreshed.toLocaleTimeString()}
          </div>

          <button
            onClick={fetchRequests}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs text-white/80 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>

          <button
            onClick={seedRequests}
            disabled={seedLoading}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-xs text-white font-semibold transition-all shadow-md disabled:opacity-60"
          >
            {seedLoading ? (
              <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Scanning Depletion Risks...</>
            ) : (
              <><Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> Run Predictive Depletion Scan</>
            )}
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pending Approval", value: pending.length, color: "text-amber-300", bg: "from-amber-950/40", icon: Clock },
          { label: "CRITICAL Priority", value: critical.length, color: "text-red-300", bg: "from-red-950/40", icon: AlertTriangle },
          { label: "Approved Today", value: approved.length, color: "text-emerald-300", bg: "from-emerald-950/40", icon: CheckCircle2 },
          { label: "Rejected", value: rejected.length, color: "text-white/50", bg: "from-surface-900", icon: XCircle },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={cn("glass-card p-5 bg-gradient-to-br to-surface-950", kpi.bg)}>
              <div className="flex items-center justify-between mb-2">
                <Icon className={cn("w-4 h-4", kpi.color)} />
              </div>
              <div className={cn("text-3xl font-bold font-display", kpi.color)}>{kpi.value}</div>
              <div className="text-xs text-white/40 mt-1">{kpi.label}</div>
            </div>
          );
        })}
      </div>

      {/* ── AI Agent Banner ── */}
      <div className="glass-card p-4 border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-surface-900 to-surface-950 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">InventoryManagementAgent</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">AI AGENT</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            </div>
            <p className="text-xs text-white/60 mt-0.5">
              Monitors real-time stock levels, predicts demand and auto-raises CRITICAL restock requests that require your approval before being dispatched to suppliers.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/50 self-start sm:self-center whitespace-nowrap">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>Approved requests sync to <strong className="text-white/80">Multi-Agent Command Center</strong></span>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-white/40" />
        {(["all", "PENDING", "APPROVED", "REJECTED"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all",
              filter === f
                ? "bg-white/20 text-white border border-white/30"
                : "bg-white/[0.04] hover:bg-white/[0.09] text-white/60 border border-white/10"
            )}
          >
            {f === "all" ? `All (${requests.length})` : `${f === "PENDING" ? "⏳ " : f === "APPROVED" ? "✅ " : "❌ "}${f} (${requests.filter(r => r.status === f).length})`}
          </button>
        ))}
      </div>

      {/* ── Request List ── */}
      {loading ? (
        <div className="glass-card p-10 text-center text-white/40 text-sm animate-pulse">
          Loading inventory requests from database...
        </div>
      ) : displayed.length === 0 ? (
        <div className="glass-card p-10 text-center space-y-3">
          <Package className="w-10 h-10 text-white/20 mx-auto" />
          <p className="text-white/40 text-sm">
            No inventory requests found.
            {filter === "all" && " Click \"Simulate Agent Requests\" to generate AI-raised critical requests."}
          </p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {displayed.map((req, i) => {
              const pc = PRIORITY_CONFIG[req.priority] || PRIORITY_CONFIG.MEDIUM;
              const sc = STATUS_CONFIG[req.status] || STATUS_CONFIG.PENDING;
              const PIcon = pc.icon;
              const SIcon = sc.icon;
              const isProcessing = processingId === req.id;
              const isRejectOpen = rejectingId === req.id;

              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className={cn(
                    "glass-card p-5 border transition-all duration-200",
                    req.status === "PENDING" && req.priority === "CRITICAL" ? "border-red-500/40 bg-gradient-to-br from-red-950/20 via-surface-900 to-surface-950" :
                    req.status === "PENDING" ? "border-amber-500/30" :
                    req.status === "APPROVED" ? "border-emerald-500/30 bg-gradient-to-br from-emerald-950/10 via-surface-900 to-surface-950" :
                    "border-white/10 opacity-75"
                  )}
                >
                  {/* ── Card Header ── */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl mt-0.5">{CATEGORY_EMOJI[req.category] || "📦"}</div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm">{req.itemName}</span>
                          <span className="font-mono text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded">{req.sku}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={cn("flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border", pc.color, pc.bg, pc.border)}>
                            <PIcon className="w-3 h-3" />
                            {pc.label}
                          </span>
                          <span className={cn("flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full", sc.color, sc.bg)}>
                            <SIcon className="w-3 h-3" />
                            {sc.label}
                          </span>
                          {(req.raisedBy.includes("Predictive Engine") || req.raisedBy.includes("InventoryManagementAgent")) && (
                            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                              <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
                              PREDICTIVE ENGINE ALERT
                            </span>
                          )}
                          <span className="text-[10px] text-white/40">{req.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right self-start">
                      <div className="text-lg font-bold text-white font-display">₹{req.estimatedCost.toLocaleString("en-IN")}</div>
                      <div className="text-xs text-white/40">Estimated Cost</div>
                    </div>
                  </div>

                  {/* ── Stock Info ── */}
                  <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                    <div className="bg-black/30 rounded-xl p-2.5 border border-white/5">
                      <div className="text-lg font-bold text-red-300">{req.currentStock}</div>
                      <div className="text-[10px] text-white/40">{req.unit} Current</div>
                    </div>
                    <div className="bg-black/30 rounded-xl p-2.5 border border-white/5 flex flex-col items-center justify-center">
                      <ArrowUpRight className="w-4 h-4 text-amber-400" />
                      <div className="text-[10px] text-white/40">Reorder</div>
                    </div>
                    <div className="bg-black/30 rounded-xl p-2.5 border border-white/5">
                      <div className="text-lg font-bold text-emerald-300">{req.requestedQty}</div>
                      <div className="text-[10px] text-white/40">{req.unit} Requested</div>
                    </div>
                  </div>

                  {/* ── Reason + Meta ── */}
                  <div className="bg-black/40 rounded-xl p-3 mb-4 border border-white/5">
                    <div className="text-[10px] text-white/40 font-bold uppercase mb-1">AI Agent Reasoning</div>
                    <p className="text-xs text-white/80 leading-relaxed">{req.reason}</p>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-white/50 mb-4">
                    <span>🏷️ Vendor: <strong className="text-white/70">{req.vendor || "Not assigned"}</strong></span>
                    <span>📋 PO: <strong className="font-mono text-amber-300">{req.poNumber}</strong></span>
                    <span>🤖 By: <strong className="text-white/70">{req.raisedBy}</strong></span>
                    <span>🕐 {new Date(req.createdAt).toLocaleString()}</span>
                  </div>

                  {/* ── Approval Status (if not pending) ── */}
                  {req.status === "APPROVED" && (
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Approved by <strong>{req.approvedBy}</strong> · {req.approvedAt ? new Date(req.approvedAt).toLocaleString() : "—"} · <strong className="text-white/70">Now visible in Multi-Agent Command Center ↗</strong></span>
                    </div>
                  )}

                  {req.status === "REJECTED" && req.rejectionNote && (
                    <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      <span>Rejected · Note: {req.rejectionNote}</span>
                    </div>
                  )}

                  {/* ── Action Buttons (PENDING only) ── */}
                  {req.status === "PENDING" && (
                    <div className="space-y-2 mt-2">
                      {isRejectOpen && (
                        <input
                          type="text"
                          placeholder="Rejection reason (optional)..."
                          value={rejectionNote[req.id] || ""}
                          onChange={(e) => setRejectionNote(prev => ({ ...prev, [req.id]: e.target.value }))}
                          className="w-full text-xs px-3 py-2 rounded-xl bg-white/5 border border-red-500/30 text-white placeholder:text-white/30 outline-none focus:border-red-400"
                        />
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(req.id, "approve")}
                          disabled={isProcessing}
                          className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white transition-all shadow-md disabled:opacity-60 flex items-center justify-center gap-1.5"
                        >
                          {isProcessing ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <><CheckCircle2 className="w-3.5 h-3.5" /> Approve &amp; Dispatch to Supplier</>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            if (isRejectOpen) {
                              handleAction(req.id, "reject");
                            } else {
                              setRejectingId(req.id);
                            }
                          }}
                          disabled={isProcessing}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-all disabled:opacity-60 flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          {isRejectOpen ? "Confirm Reject" : "Reject"}
                        </button>
                        {isRejectOpen && (
                          <button
                            onClick={() => setRejectingId(null)}
                            className="px-3 py-2.5 rounded-xl text-xs text-white/40 hover:text-white/70 border border-white/10 hover:border-white/20 transition-all"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}

      {/* ── Info Footer ── */}
      <div className="glass-card p-4 border-white/10 text-xs text-white/40 flex items-center gap-3">
        <Zap className="w-4 h-4 text-amber-400 shrink-0" />
        <p>
          <strong className="text-white/70">How it works:</strong> The InventoryManagementAgent continuously scans stock levels and predicts demand. When a CRITICAL or HIGH threshold is crossed, it auto-raises a restock request here. You <strong className="text-white/70">approve</strong> it → it immediately appears in the <strong className="text-white/70">Multi-Agent Gen AI Command Center → Inventory Forecast & POs tab</strong> as an approved action.
        </p>
      </div>
    </div>
  );
}
