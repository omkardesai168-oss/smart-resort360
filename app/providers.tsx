"use client";

import { SessionProvider } from "next-auth/react";
import { ResortStoreProvider } from "@/lib/store/resort-store";
import { ToastProvider } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ResortStoreProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ResortStoreProvider>
    </SessionProvider>
  );
}
