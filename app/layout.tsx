import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smart Resort 360 — AI-Powered Resort Intelligence Platform",
  description: "Predict. Optimize. Personalize. Automate. The AI-powered intelligence layer for modern resort operations, guest experience, and revenue optimization.",
  keywords: ["resort management", "hotel AI", "revenue management", "digital twin", "hospitality technology"],
  openGraph: {
    title: "Smart Resort 360",
    description: "AI-Powered Resort Intelligence Platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-surface-950 text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
