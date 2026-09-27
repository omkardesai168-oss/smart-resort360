"use client";

import { FlaskConical, TrendingUp, Users, Wrench, DollarSign, Sparkles } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";
import { formatINR } from "@/lib/utils";

const PREDICTIONS = [
  { label: "Tomorrow's Occupancy", predicted: 91, actual: null, confidence: 0.92, color: "from-brand-500 to-ai-DEFAULT" },
  { label: "Weekend Revenue", predicted: 4832000, actual: null, confidence: 0.88, color: "from-success-DEFAULT to-emerald-500", format: "currency" },
  { label: "Maintenance Failures (7d)", predicted: 2, actual: null, confidence: 0.85, color: "from-warning-DEFAULT to-danger-DEFAULT" },
  { label: "Guest Churn Risk", predicted: 8, actual: null, confidence: 0.78, color: "from-pink-500 to-rose-700" },
  { label: "Staff Shortage Events", predicted: 1, actual: null, confidence: 0.81, color: "from-cyan-500 to-blue-500" },
  { label: "Energy Peak (kWh)", predicted: 3640, actual: null, confidence: 0.94, color: "from-accent-500 to-warning-DEFAULT" },
];

const ACCURACY = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  predicted: 75 + Math.sin(i / 3) * 8 + Math.random() * 4,
  actual: 75 + Math.sin(i / 3) * 7 + Math.random() * 6,
}));

export default function PredictionsPage() {
  return (
    <PageContainer>
      <PageHeader title="Predictive Analytics" description="Forward-looking AI predictions with confidence scores" icon={FlaskConical} badge="AI" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {PREDICTIONS.map((p) => (
          <div key={p.label} className="kpi-card relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-10`} />
            <div className="relative">
              <div className="metric-label">{p.label}</div>
              <div className="metric-value mt-2">{p.format === "currency" ? formatINR(p.predicted) : p.predicted}</div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="badge-purple">AI {(p.confidence * 100).toFixed(0)}% confidence</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-5">
          <div className="section-header mb-3">Occupancy Prediction Accuracy</div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={ACCURACY}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={10} interval={3} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} domain={[60, 95]} />
                <Tooltip contentStyle={{ background: "rgba(15,15,26,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="predicted" stroke="#7c3aed" strokeWidth={2.5} dot={false} name="Predicted" />
                <Line type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Actual" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-white/60 mt-2">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-ai-DEFAULT" />Predicted</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success-light" />Actual</div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="section-header mb-3">Model Performance (30d)</div>
          <div className="space-y-3 text-sm">
            {[
              { model: "Occupancy Predictor", accuracy: 94, mape: 2.4, color: "text-success-light" },
              { model: "Revenue Forecaster", accuracy: 88, mape: 5.2, color: "text-success-light" },
              { model: "Maintenance Failure", accuracy: 85, mape: 8.1, color: "text-warning-light" },
              { model: "Guest Churn Model", accuracy: 78, mape: 11.4, color: "text-warning-light" },
              { model: "Demand Forecaster (Spa)", accuracy: 91, mape: 3.8, color: "text-success-light" },
              { model: "Energy Predictor", accuracy: 94, mape: 2.1, color: "text-success-light" },
            ].map((m) => (
              <div key={m.model}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-white/80 font-medium">{m.model}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40">MAPE: {m.mape}%</span>
                    <span className={m.color + " font-bold"}>{m.accuracy}%</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className={`progress-fill ${m.accuracy > 85 ? "bg-success-gradient" : "bg-gradient-to-r from-warning-DEFAULT to-accent-500"}`} style={{ width: `${m.accuracy}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="section-header mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-ai-light" /> Active ML Models</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="glass-card p-3"><div className="text-white/40 text-xs">PRIMARY STACK</div><div className="text-white font-semibold mt-1">XGBoost + LSTM Ensemble</div><div className="text-white/50 text-xs mt-1">Time series + feature engineering</div></div>
          <div className="glass-card p-3"><div className="text-white/40 text-xs">TRAINING DATA</div><div className="text-white font-semibold mt-1">3.2M records</div><div className="text-white/50 text-xs mt-1">3 years historical operations</div></div>
          <div className="glass-card p-3"><div className="text-white/40 text-xs">RETRAIN FREQUENCY</div><div className="text-white font-semibold mt-1">Nightly (2:00 AM)</div><div className="text-white/50 text-xs mt-1">Auto-deploy on accuracy gain</div></div>
        </div>
      </div>
    </PageContainer>
  );
}
