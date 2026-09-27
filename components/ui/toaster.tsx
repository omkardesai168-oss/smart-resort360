"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";
interface Toast {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
}

const ToastContext = createContext<{
  toasts: Toast[];
  toast: (t: Omit<Toast, "id">) => void;
  remove: (id: number) => void;
} | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = (id: number) => setToasts((p) => p.filter((t) => t.id !== id));

  const toast = (t: Omit<Toast, "id">) => {
    const id = ++toastId;
    setToasts((p) => [...p, { ...t, id }]);
    setTimeout(() => remove(id), 4000);
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, remove }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              className="pointer-events-auto glass-card shadow-elevated p-3 min-w-[280px] max-w-sm flex items-start gap-2.5"
            >
              {t.type === "success" && <CheckCircle className="w-5 h-5 text-success-light flex-shrink-0" />}
              {t.type === "error" && <XCircle className="w-5 h-5 text-danger-light flex-shrink-0" />}
              {t.type === "warning" && <AlertTriangle className="w-5 h-5 text-warning-light flex-shrink-0" />}
              {t.type === "info" && <Info className="w-5 h-5 text-brand-400 flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-semibold">{t.title}</div>
                {t.description && <div className="text-white/50 text-xs mt-0.5">{t.description}</div>}
              </div>
              <button onClick={() => remove(t.id)} className="text-white/30 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function Toaster() {
  return null;
}
