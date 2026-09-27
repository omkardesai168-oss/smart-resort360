"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";

interface Message { role: "user" | "assistant"; content: string; }

const SUGGESTIONS = [
  "Why is revenue up today?",
  "Which rooms need attention?",
  "Show me high-friction guests",
  "How will the rain affect us?",
  "What maintenance is urgent?",
  "Optimize staff allocation",
];

export default function ConciergeChat({ suggestions }: { suggestions?: string[] }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "👋 Hello! I'm your **AI Copilot** for Azure Hills Resort. I have real-time access to occupancy, revenue, guests, maintenance, weather, and more. Ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [...messages, userMsg] }) });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.content }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <div key={i}>
          {parts.map((p, j) => p.startsWith("**") && p.endsWith("**") ? <strong key={j} className="text-white">{p.slice(2, -2)}</strong> : <span key={j}>{p}</span>)}
        </div>
      );
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
      <div className="glass-card flex flex-col lg:col-span-3 overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${m.role === "user" ? "bg-brand-gradient" : "bg-ai-gradient shadow-glow-ai"}`}>
                {m.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${m.role === "user" ? "bg-brand-500/20 text-white" : "glass-card text-white/80"}`}>
                <div className="leading-relaxed space-y-1">{formatContent(m.content)}</div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-ai-gradient flex items-center justify-center"><Bot className="w-4 h-4 text-white" /></div>
              <div className="glass-card p-3 flex items-center gap-2 text-white/60 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing resort data...
              </div>
            </div>
          )}
        </div>
        <div className="p-3 border-t border-white/5">
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about revenue, occupancy, guests, maintenance..." className="input flex-1" disabled={loading} />
            <button type="submit" disabled={loading || !input.trim()} className="btn-ai"><Send className="w-4 h-4" /></button>
          </form>
        </div>
      </div>

      <div className="space-y-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3 text-white"><Sparkles className="w-4 h-4 text-ai-light" /><span className="font-semibold text-sm">Quick Questions</span></div>
          <div className="space-y-2">
            {(suggestions ?? SUGGESTIONS).map((s) => (
              <button key={s} onClick={() => send(s)} disabled={loading} className="w-full text-left text-xs glass-card p-2.5 hover:border-brand-500/30 transition-all text-white/70 hover:text-white disabled:opacity-50">
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
