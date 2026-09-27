"use client";

import { useEffect, useState } from "react";
import { Package, AlertTriangle, TrendingUp, Sparkles } from "lucide-react";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";
import { cn, formatINR } from "@/lib/utils";

interface Item { id: string; sku: string; name: string; category: string; unit: string; currentStock: number; minStock: number; maxStock: number; reorderPoint: number; unitCost: number; predictedDemand: number; }

const ITEMS: Item[] = [
  { id: "1", sku: "FOOD-MLK-001", name: "Fresh Milk (Full Cream)", category: "FOOD", unit: "Liters", currentStock: 62, minStock: 30, maxStock: 200, reorderPoint: 50, unitCost: 55, predictedDemand: 81 },
  { id: "2", sku: "FOOD-EGG-001", name: "Farm Fresh Eggs", category: "FOOD", unit: "Dozen", currentStock: 180, minStock: 60, maxStock: 400, reorderPoint: 100, unitCost: 120, predictedDemand: 210 },
  { id: "3", sku: "FOOD-CHK-001", name: "Chicken (Fresh)", category: "FOOD", unit: "KG", currentStock: 85, minStock: 30, maxStock: 200, reorderPoint: 50, unitCost: 320, predictedDemand: 110 },
  { id: "4", sku: "FOOD-VEG-001", name: "Mixed Vegetables", category: "FOOD", unit: "KG", currentStock: 120, minStock: 50, maxStock: 300, reorderPoint: 80, unitCost: 85, predictedDemand: 145 },
  { id: "5", sku: "BEV-WTR-001", name: "Mineral Water (500ml)", category: "BEVERAGE", unit: "Cases", currentStock: 240, minStock: 80, maxStock: 500, reorderPoint: 120, unitCost: 450, predictedDemand: 280 },
  { id: "6", sku: "BEV-COF-001", name: "Arabica Coffee Beans", category: "BEVERAGE", unit: "KG", currentStock: 28, minStock: 10, maxStock: 80, reorderPoint: 20, unitCost: 1800, predictedDemand: 35 },
  { id: "7", sku: "HK-TWL-001", name: "Bath Towels (Premium)", category: "HOUSEKEEPING", unit: "Pieces", currentStock: 450, minStock: 200, maxStock: 800, reorderPoint: 300, unitCost: 850, predictedDemand: 500 },
  { id: "8", sku: "HK-BED-001", name: "Bed Linen Sets", category: "HOUSEKEEPING", unit: "Sets", currentStock: 320, minStock: 150, maxStock: 600, reorderPoint: 200, unitCost: 2400, predictedDemand: 350 },
  { id: "9", sku: "MNT-FLT-001", name: "HVAC Air Filters", category: "MAINTENANCE", unit: "Pieces", currentStock: 18, minStock: 10, maxStock: 50, reorderPoint: 15, unitCost: 2200, predictedDemand: 24 },
  { id: "10", sku: "AMN-ROB-001", name: "Luxury Bathrobes", category: "AMENITIES", unit: "Pieces", currentStock: 180, minStock: 80, maxStock: 400, reorderPoint: 120, unitCost: 3500, predictedDemand: 210 },
  { id: "11", sku: "AMN-SLP-001", name: "Premium Slippers", category: "AMENITIES", unit: "Pairs", currentStock: 320, minStock: 150, maxStock: 600, reorderPoint: 200, unitCost: 450, predictedDemand: 380 },
  { id: "12", sku: "HK-SHP-001", name: "Shampoo (100ml)", category: "HOUSEKEEPING", unit: "Pieces", currentStock: 1200, minStock: 500, maxStock: 2000, reorderPoint: 700, unitCost: 85, predictedDemand: 1350 },
];

export default function InventoryPage() {
  const lowStock = ITEMS.filter((i) => i.currentStock < i.reorderPoint);
  const atRisk = ITEMS.filter((i) => i.predictedDemand > i.currentStock);

  return (
    <PageContainer>
      <PageHeader title="Inventory Management" description="Smart stock tracking with predictive demand" icon={Package} badge="AI" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="kpi-card"><div className="metric-label">SKUs Tracked</div><div className="metric-value">{ITEMS.length}</div></div>
        <div className="kpi-card"><div className="metric-label">Total Value</div><div className="metric-value text-success-light">{formatINR(ITEMS.reduce((s, i) => s + i.currentStock * i.unitCost, 0))}</div></div>
        <div className="kpi-card"><div className="metric-label">Below Reorder</div><div className="metric-value text-warning-light">{lowStock.length}</div></div>
        <div className="kpi-card"><div className="metric-label">Stockout Risk</div><div className="metric-value text-danger-light">{atRisk.length}</div></div>
      </div>

      {atRisk.length > 0 && (
        <div className="glass-card p-4 mb-4 border-warning-DEFAULT/30">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-warning-light" />
            <span className="text-white font-semibold">AI Stockout Risk Predictions</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {atRisk.map((i) => (
              <div key={i.id} className="flex items-center justify-between glass-card p-2.5">
                <div>
                  <div className="text-white font-medium text-sm">{i.name}</div>
                  <div className="text-white/40 text-xs">Stock: {i.currentStock} {i.unit} • Demand: {i.predictedDemand} {i.unit}</div>
                </div>
                <span className="badge-red text-[10px]">+{i.predictedDemand - i.currentStock} needed</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-xs uppercase border-b border-white/5">
                <th className="text-left py-2 px-3">Item</th>
                <th className="text-left py-2 px-3">Category</th>
                <th className="text-right py-2 px-3">Stock</th>
                <th className="text-right py-2 px-3">Predicted</th>
                <th className="text-center py-2 px-3">Status</th>
                <th className="text-right py-2 px-3">Value</th>
              </tr>
            </thead>
            <tbody>
              {ITEMS.map((i) => {
                const pct = (i.currentStock / i.maxStock) * 100;
                const isLow = i.currentStock < i.reorderPoint;
                const isAtRisk = i.predictedDemand > i.currentStock;
                return (
                  <tr key={i.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-3 px-3">
                      <div className="text-white font-medium">{i.name}</div>
                      <div className="text-white/40 text-xs">{i.sku}</div>
                    </td>
                    <td className="py-3 px-3 text-white/70 text-xs">{i.category}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="text-white font-semibold">{i.currentStock} <span className="text-white/40 text-xs">{i.unit}</span></div>
                      <div className="w-24 h-1 bg-white/10 rounded-full ml-auto mt-1">
                        <div className={cn("h-full rounded-full", isLow ? "bg-danger-gradient" : isAtRisk ? "bg-gradient-to-r from-warning-DEFAULT to-accent-500" : "bg-success-gradient")} style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right text-white/70">{i.predictedDemand}</td>
                    <td className="py-3 px-3 text-center">
                      {isAtRisk ? <span className="badge-red text-[10px]">AT RISK</span> : isLow ? <span className="badge-yellow text-[10px]">LOW</span> : <span className="badge-green text-[10px]">OK</span>}
                    </td>
                    <td className="py-3 px-3 text-right text-white font-medium">{formatINR(i.currentStock * i.unitCost)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
}
