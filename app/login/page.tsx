"use client";

import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Eye, EyeOff, ShieldCheck, Wrench, Sparkles,
  ArrowRight, Play, FastForward, Lock, ChevronRight
} from "lucide-react";

const PORTAL_LOGINS = [
  {
    id: "manager",
    label: "Manager Login",
    sublabel: "Resort Intelligence & Operations Control",
    email: "manager@azurehills.com",
    role: "RESORT_MANAGER",
    targetRoute: "/overview",
    icon: ShieldCheck,
    color: "from-blue-600 via-indigo-600 to-brand-700",
    glowColor: "hover:border-blue-400/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.35)]",
    cardBg: "bg-blue-950/30 border-blue-500/20 hover:border-blue-400/50",
    badge: "Management",
    badgeStyle: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    btnColor: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500",
  },
  {
    id: "staff",
    label: "Staff Login",
    sublabel: "Tasks, Schedules & Guest Requests",
    email: "staff@azurehills.com",
    role: "STAFF",
    targetRoute: "/operations/staff",
    icon: Wrench,
    color: "from-emerald-500 via-teal-600 to-emerald-800",
    glowColor: "hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]",
    cardBg: "bg-emerald-950/30 border-emerald-500/20 hover:border-emerald-400/50",
    badge: "Operations",
    badgeStyle: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
    btnColor: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500",
  },
  {
    id: "guest",
    label: "Guest Login",
    sublabel: "VIP Experience, AI Concierge & Services",
    email: "guest@azurehills.com",
    role: "GUEST",
    targetRoute: "/guests/concierge",
    icon: Sparkles,
    color: "from-amber-500 via-yellow-600 to-amber-700",
    glowColor: "hover:border-amber-400/60 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)]",
    cardBg: "bg-amber-950/30 border-amber-500/20 hover:border-amber-400/50",
    badge: "VIP Guest",
    badgeStyle: "bg-amber-500/20 text-amber-300 border-amber-400/30",
    btnColor: "bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500",
  },
];

export default function LoginPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activePortal, setActivePortal] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(progress || 0);
    }
  };

  const handleVideoEnded = () => {
    setShowLogin(true);
    if (videoRef.current) {
      videoRef.current.loop = true;
      videoRef.current.play().catch(() => {});
    }
  };

  const skipToLogin = () => {
    setShowLogin(true);
    if (videoRef.current) {
      videoRef.current.loop = true;
    }
  };

  const replayIntro = () => {
    setShowLogin(false);
    if (videoRef.current) {
      videoRef.current.loop = false;
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      if (email.toLowerCase().includes("guest")) {
        router.push("/guests/concierge");
      } else if (email.toLowerCase().includes("staff") || email.toLowerCase().includes("housekeeping") || email.toLowerCase().includes("maintenance")) {
        router.push("/operations/staff");
      } else {
        router.push("/overview");
      }
    } else {
      setError("Invalid credentials. Please try again or use the 1-click portals.");
      setLoading(false);
    }
  };

  const loginAsPortal = async (portal: typeof PORTAL_LOGINS[0]) => {
    setActivePortal(portal.id);
    setLoading(true);
    setError("");
    setEmail(portal.email);
    setPassword("resort360");

    const result = await signIn("credentials", {
      email: portal.email,
      password: "resort360",
      redirect: false,
    });

    if (result?.ok) {
      router.push(portal.targetRoute);
    } else {
      setError("Login failed. Please verify database is seeded.");
      setLoading(false);
      setActivePortal(null);
    }
  };

  return (
    <div className="hero-theme relative min-h-screen w-full bg-surface-950 text-white overflow-hidden select-none font-sans">
      {/* Background Video (Fullscreen throughout) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          className={`w-full h-full object-cover transition-all duration-1000 ease-out ${
            showLogin 
              ? "scale-105" 
              : "scale-100"
          }`}
        >
          <source src="/videos/landing-resort.mp4" type="video/mp4" />
        </video>

      </div>

      {/* STAGE 1: Fullscreen Intro Mode */}
      <AnimatePresence>
        {!showLogin && (
          <motion.div
            key="intro-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-10 lg:p-14 pointer-events-auto"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-3 bg-black/40 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/15 shadow-2xl"
              >
                <div className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center shadow-glow-brand border border-white/20">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-display font-bold text-base tracking-wide">Smart Resort 360</div>
                  <div className="text-white/60 text-xs font-medium">Azure Hills Sanctuary • Coorg</div>
                </div>
              </motion.div>

              {/* Skip / Enter Button */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                onClick={skipToLogin}
                className="group flex items-center gap-2.5 bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-xl border border-white/25 hover:border-white/40 text-white font-semibold text-sm px-5 py-3 rounded-full transition-all duration-300 shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                <span>Enter Resort Portals</span>
                <FastForward className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </div>

            {/* Center Cinematic Title */}
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold tracking-widest uppercase"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live 360° Drone Aerial Feed
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="video-copy text-4xl sm:text-6xl font-display font-black tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
              >
                Azure Hills Resort
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="video-copy text-white/85 text-base sm:text-lg max-w-lg mx-auto font-light leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
              >
                The next-generation intelligence system for modern hospitality, operations, and guest experience.
              </motion.p>
            </div>

            {/* Bottom Progress & Enter Button */}
            <div className="space-y-4 max-w-xl mx-auto w-full">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="video-copy flex items-center justify-between text-xs text-white/70 font-medium px-1"
              >
                <span>Drone Aerial Tour</span>
                <span>Auto-entering portal in a moment...</span>
              </motion.div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden border border-white/10 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-brand-400 via-emerald-400 to-amber-300 transition-all duration-150 ease-linear rounded-full shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>

              {/* Instant Action CTA */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={skipToLogin}
                  className="btn-primary py-3.5 px-8 rounded-2xl shadow-glow-brand flex items-center gap-3 font-semibold text-sm hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <span>Select Login Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 2: Clean, Elegant Login Portals */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            key="login-screen"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 min-h-screen flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-y-auto"
          >
            {/* Top Navigation */}
            <div className="flex items-center justify-between w-full max-w-5xl mx-auto mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center shadow-glow-brand border border-white/20">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="video-copy text-white font-display font-bold text-lg leading-tight">Smart Resort 360</div>
                  <div className="video-copy text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Azure Hills Luxury Sanctuary • Coorg
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowManualModal(!showManualModal)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md border border-white/15 text-white/80 hover:text-white text-xs font-medium transition-all shadow-lg"
                >
                  <Lock className="w-3.5 h-3.5 text-brand-300" />
                  <span>Manual Login</span>
                </button>

                <button
                  onClick={replayIntro}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md border border-white/15 text-white/80 hover:text-white text-xs font-medium transition-all shadow-lg"
                >
                  <Play className="w-3.5 h-3.5 text-brand-300" />
                  <span>Replay Video</span>
                </button>
              </div>
            </div>

            {/* Headline Section */}
            <div className="w-full max-w-5xl mx-auto text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-brand-200 font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Select Your Access Portal
              </div>
              <h2 className="video-copy text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                Welcome to Smart Resort 360
              </h2>
              <p className="video-copy text-white/60 text-sm max-w-md mx-auto mt-1.5">
                Click below to enter your customized resort workspace
              </p>
            </div>

            {/* 3 Clean Portal Login Cards */}
            <div className="w-full max-w-5xl mx-auto my-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {PORTAL_LOGINS.map((portal) => {
                const Icon = portal.icon;
                const isSelected = activePortal === portal.id;
                return (
                  <div
                    key={portal.id}
                    className={`portal-card relative rounded-3xl p-7 flex flex-col justify-between backdrop-blur-2xl border transition-all duration-300 group shadow-2xl ${portal.cardBg} ${portal.glowColor}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${portal.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${portal.badgeStyle}`}>
                          {portal.badge}
                        </span>
                      </div>

                      <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-white transition-colors">
                        {portal.label}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed mb-6">
                        {portal.sublabel}
                      </p>
                    </div>

                    {/* 1-Click Launch Button */}
                    <div className="pt-4 border-t border-white/10">
                      <button
                        id={`login-${portal.id}`}
                        type="button"
                        onClick={() => loginAsPortal(portal)}
                        disabled={loading}
                        className={`w-full py-4 px-5 rounded-2xl ${portal.btnColor} text-white font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-95 shadow-lg group-hover:shadow-xl disabled:opacity-60`}
                      >
                        {loading && isSelected ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Opening Portal...</span>
                          </>
                        ) : (
                          <>
                            <span>Enter {portal.label.replace(" Login", "")}</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                      <div className="text-center text-xs text-white/30 mt-2.5 font-mono">
                        {portal.email}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Optional Manual Login Modal */}
            <AnimatePresence>
              {showManualModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="light-panel w-full max-w-md p-6 sm:p-7 rounded-3xl bg-surface-900/95 border border-white/20 shadow-2xl relative"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg font-display font-bold text-white">
                        Manual Sign In
                      </h3>
                      <button
                        onClick={() => setShowManualModal(false)}
                        className="text-white/40 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-white/10"
                      >
                        Close
                      </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                          Email Address
                        </label>
                        <input
                          id="email-input"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="manager@azurehills.com"
                          className="input bg-white/10 border-white/20 focus:border-brand-400 text-white placeholder:text-white/40 w-full"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            id="password-input"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="input bg-white/10 border-white/20 focus:border-brand-400 text-white placeholder:text-white/40 pr-10 w-full"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {error && (
                        <div className="alert-critical text-xs text-danger-light bg-red-500/20 border border-red-500/40 p-2.5 rounded-xl">
                          {error}
                        </div>
                      )}

                      <button
                        id="login-btn"
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3.5 rounded-xl shadow-glow-brand flex items-center justify-center gap-2 text-sm font-semibold tracking-wide mt-2"
                      >
                        {loading && !activePortal ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Signing in...</span>
                          </>
                        ) : (
                          <span>Sign In Directly</span>
                        )}
                      </button>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Bottom Status Bar */}
            <div className="resort-footer w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50 p-6 rounded-2xl mt-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>All systems nominal • Azure Hills Resort & Spa</span>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
