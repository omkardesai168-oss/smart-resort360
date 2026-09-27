"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Search, Filter, Phone, Mail, MapPin,
  Zap, Wrench, Wind, Sparkles, Star, Shield,
  ChefHat, Flower2, Monitor, TreePine, RefreshCw,
  CheckCircle2, Clock, XCircle, Coffee, Badge,
  ChevronDown, X
} from "lucide-react";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
interface StaffMember {
  id: string;
  name: string;
  department: string;
  role: string;
  skill: string;
  shift: string;
  status: string;
  phone: string;
  email: string;
  zone: string;
  experience: string;
  certifications: string[];
  availability: string;
}

// --------------------------------------------------------------------------
// Department config (icon + color)
// --------------------------------------------------------------------------
const DEPT_CONFIG: Record<string, { icon: any; color: string; bg: string; border: string }> = {
  Electrical:       { icon: Zap,       color: "text-yellow-400",  bg: "bg-yellow-400/10",  border: "border-yellow-400/20" },
  Plumbing:         { icon: Wrench,    color: "text-blue-400",    bg: "bg-blue-400/10",    border: "border-blue-400/20" },
  HVAC:             { icon: Wind,      color: "text-cyan-400",    bg: "bg-cyan-400/10",    border: "border-cyan-400/20" },
  Housekeeping:     { icon: Sparkles,  color: "text-pink-400",    bg: "bg-pink-400/10",    border: "border-pink-400/20" },
  Maintenance:      { icon: Wrench,    color: "text-orange-400",  bg: "bg-orange-400/10",  border: "border-orange-400/20" },
  Concierge:        { icon: Star,      color: "text-purple-400",  bg: "bg-purple-400/10",  border: "border-purple-400/20" },
  Security:         { icon: Shield,    color: "text-red-400",     bg: "bg-red-400/10",     border: "border-red-400/20" },
  "Food & Beverage":{ icon: ChefHat,   color: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-400/20" },
  Spa:              { icon: Flower2,   color: "text-rose-400",    bg: "bg-rose-400/10",    border: "border-rose-400/20" },
  "Front Desk":     { icon: Users,     color: "text-indigo-400",  bg: "bg-indigo-400/10",  border: "border-indigo-400/20" },
  Grounds:          { icon: TreePine,  color: "text-green-400",   bg: "bg-green-400/10",   border: "border-green-400/20" },
  IT:               { icon: Monitor,   color: "text-sky-400",     bg: "bg-sky-400/10",     border: "border-sky-400/20" },
};

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  ON_DUTY:  { label: "On Duty",  icon: CheckCircle2, color: "text-green-400" },
  OFF_DUTY: { label: "Off Duty", icon: XCircle,      color: "text-red-400" },
  BREAK:    { label: "On Break", icon: Coffee,       color: "text-yellow-400" },
  ON_LEAVE: { label: "On Leave", icon: Clock,        color: "text-blue-400" },
};

// --------------------------------------------------------------------------
// Staff Card Component
// --------------------------------------------------------------------------
function StaffCard({ member, onClick }: { member: StaffMember; onClick: () => void }) {
  const dept = DEPT_CONFIG[member.department] || DEPT_CONFIG["Maintenance"];
  const status = STATUS_CONFIG[member.status] || STATUS_CONFIG["OFF_DUTY"];
  const DeptIcon = dept.icon;
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      onClick={onClick}
      className={`glass-card p-4 cursor-pointer border ${dept.border} hover:shadow-lg transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${dept.bg} flex items-center justify-center flex-shrink-0`}>
            <DeptIcon className={`w-5 h-5 ${dept.color}`} />
          </div>
          <div>
            <div className="text-white font-semibold text-sm leading-tight">{member.name}</div>
            <div className="text-white/50 text-xs mt-0.5">{member.role}</div>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-xs ${status.color}`}>
          <StatusIcon className="w-3 h-3" />
          <span className="hidden sm:inline">{status.label}</span>
        </div>
      </div>

      {/* Department Badge */}
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${dept.bg} ${dept.color} mb-3`}>
        <DeptIcon className="w-3 h-3" />
        {member.department}
      </div>

      {/* Info rows */}
      <div className="space-y-1.5 text-xs text-white/50">
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{member.zone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 flex-shrink-0" />
          <span>{member.shift} Shift • {member.experience}</span>
        </div>
      </div>

      {/* Certs */}
      {member.certifications.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {member.certifications.slice(0, 2).map((c) => (
            <span key={c} className="text-[10px] bg-white/5 border border-white/10 text-white/40 px-2 py-0.5 rounded-full">
              {c}
            </span>
          ))}
          {member.certifications.length > 2 && (
            <span className="text-[10px] bg-white/5 border border-white/10 text-white/40 px-2 py-0.5 rounded-full">
              +{member.certifications.length - 2}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

// --------------------------------------------------------------------------
// Detail Modal
// --------------------------------------------------------------------------
function StaffModal({ member, onClose }: { member: StaffMember; onClose: () => void }) {
  const dept = DEPT_CONFIG[member.department] || DEPT_CONFIG["Maintenance"];
  const status = STATUS_CONFIG[member.status] || STATUS_CONFIG["OFF_DUTY"];
  const DeptIcon = dept.icon;
  const StatusIcon = status.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative glass-card p-6 w-full max-w-md z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 rounded-2xl ${dept.bg} flex items-center justify-center`}>
            <DeptIcon className={`w-8 h-8 ${dept.color}`} />
          </div>
          <div>
            <h3 className="text-white text-lg font-bold">{member.name}</h3>
            <p className="text-white/50 text-sm">{member.role}</p>
            <div className={`flex items-center gap-1.5 mt-1 text-sm ${status.color}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{status.label}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-3">
              <div className="text-white/40 text-xs mb-1">Department</div>
              <div className={`font-semibold text-sm ${dept.color}`}>{member.department}</div>
            </div>
            <div className="glass-card p-3">
              <div className="text-white/40 text-xs mb-1">Shift</div>
              <div className="text-white font-semibold text-sm">{member.shift}</div>
            </div>
            <div className="glass-card p-3">
              <div className="text-white/40 text-xs mb-1">Experience</div>
              <div className="text-white font-semibold text-sm">{member.experience}</div>
            </div>
            <div className="glass-card p-3">
              <div className="text-white/40 text-xs mb-1">Zone</div>
              <div className="text-white font-semibold text-sm">{member.zone}</div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-2 mb-5">
          <a
            href={`tel:${member.phone}`}
            className="flex items-center gap-3 glass-card p-3 hover:border-brand-500/30 transition-all group"
          >
            <Phone className="w-4 h-4 text-white/40 group-hover:text-brand-300" />
            <span className="text-white/70 text-sm group-hover:text-white">{member.phone}</span>
          </a>
          <a
            href={`mailto:${member.email}`}
            className="flex items-center gap-3 glass-card p-3 hover:border-brand-500/30 transition-all group"
          >
            <Mail className="w-4 h-4 text-white/40 group-hover:text-brand-300" />
            <span className="text-white/70 text-sm group-hover:text-white">{member.email}</span>
          </a>
        </div>

        {/* Certifications */}
        {member.certifications.length > 0 && (
          <div>
            <div className="text-white/40 text-xs uppercase font-semibold mb-2">Certifications</div>
            <div className="flex flex-wrap gap-2">
              {member.certifications.map((c) => (
                <span key={c} className={`text-xs ${dept.bg} ${dept.color} border ${dept.border} px-3 py-1 rounded-full font-medium`}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Main Page
// --------------------------------------------------------------------------
const ALL_DEPARTMENTS = [
  "All", "Electrical", "Plumbing", "HVAC", "Housekeeping",
  "Maintenance", "Concierge", "Security", "Food & Beverage",
  "Spa", "Front Desk", "Grounds", "IT",
];

export default function StaffDirectoryPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedDept !== "All") params.set("department", selectedDept);
      if (selectedStatus !== "All") params.set("status", selectedStatus);

      const res = await fetch(`/api/staff/directory?${params.toString()}`);
      if (!res.ok) throw new Error("Backend unavailable");
      const data = await res.json();
      if (!Array.isArray(data) || !data.every((member) =>
        member && typeof member === "object" &&
        ["id", "name", "department", "role", "skill", "shift", "status", "phone", "email", "zone", "experience", "availability"]
          .every((key) => typeof member[key] === "string") &&
        Array.isArray(member.certifications) &&
        member.certifications.every((value: unknown) => typeof value === "string")
      )) {
        throw new Error("Invalid staff directory response");
      }
      setStaff(data);
    } catch (e: any) {
      setError("Unable to load the staff directory. Please try Refresh in a moment.");
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedDept, selectedStatus]);

  useEffect(() => {
    const timer = setTimeout(fetchStaff, 300);
    return () => clearTimeout(timer);
  }, [fetchStaff]);

  // Group by department
  const grouped = staff.reduce((acc, s) => {
    const key = s.department;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {} as Record<string, StaffMember[]>);

  const totalOnDuty = staff.filter(s => s.status === "ON_DUTY").length;

  return (
    <PageContainer>
      <PageHeader
        title="Staff Directory"
        description="All hotel staff organized by department and skills"
        icon={Users}
        badge="LIVE"
        actions={
          <button onClick={fetchStaff} className="btn-secondary">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Staff", value: staff.length, color: "text-brand-300" },
          { label: "On Duty", value: totalOnDuty, color: "text-green-400" },
          { label: "Departments", value: Object.keys(grouped).length, color: "text-purple-400" },
          { label: "On Leave", value: staff.filter(s => s.status === "ON_LEAVE").length, color: "text-blue-400" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4">
            <div className="text-white/40 text-xs mb-1">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, role or department..."
            className="input pl-9 w-full"
          />
        </div>

        {/* Department filter */}
        <div className="flex gap-2 flex-wrap">
          {["All", "Electrical", "Plumbing", "HVAC", "Housekeeping", "Maintenance", "Security", "Food & Beverage", "Spa", "IT"].map((d) => {
            const cfg = DEPT_CONFIG[d];
            return (
              <button
                key={d}
                onClick={() => setSelectedDept(d)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  selectedDept === d
                    ? `${cfg?.bg || "bg-brand-500/20"} ${cfg?.color || "text-brand-300"} ${cfg?.border || "border-brand-500/30"}`
                    : "bg-white/5 border-white/10 text-white/50 hover:text-white"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>

        {/* Status filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="input w-auto"
        >
          <option value="All">All Status</option>
          <option value="ON_DUTY">On Duty</option>
          <option value="OFF_DUTY">Off Duty</option>
          <option value="BREAK">On Break</option>
          <option value="ON_LEAVE">On Leave</option>
        </select>
      </div>

      {/* Error banner */}
      {error && (
        <div className="glass-card p-4 border border-red-500/30 bg-red-500/10 mb-6 text-red-300 text-sm flex items-center gap-3">
          <XCircle className="w-4 h-4 flex-shrink-0" />
          <div>
            <p className="font-semibold">{error}</p>
            <p className="text-red-400/60 text-xs mt-1">
              Run: <code className="bg-black/30 px-1.5 py-0.5 rounded">cd backend && uvicorn main:app --reload --port 8000</code>
            </p>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-44 shimmer rounded-2xl" />
          ))}
        </div>
      )}

      {/* Staff grouped by department */}
      {!loading && Object.keys(grouped).length === 0 && !error && (
        <div className="text-center py-16 text-white/30">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No staff members found</p>
        </div>
      )}

      {!loading && (
        <div className="space-y-8">
          {Object.entries(grouped).map(([dept, members]) => {
            const cfg = DEPT_CONFIG[dept] || DEPT_CONFIG["Maintenance"];
            const DeptIcon = cfg.icon;
            return (
              <div key={dept}>
                {/* Department heading */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center`}>
                    <DeptIcon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <h2 className="text-white font-bold text-base">{dept}</h2>
                  <span className={`text-xs ${cfg.bg} ${cfg.color} border ${cfg.border} px-2.5 py-0.5 rounded-full font-medium`}>
                    {members.length} staff
                  </span>
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-xs text-white/30">
                    {members.filter(m => m.status === "ON_DUTY").length} on duty
                  </span>
                </div>

                {/* Staff cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {members.map((member) => (
                    <StaffCard
                      key={member.id}
                      member={member}
                      onClick={() => setSelectedMember(member)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <StaffModal member={selectedMember} onClose={() => setSelectedMember(null)} />
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
