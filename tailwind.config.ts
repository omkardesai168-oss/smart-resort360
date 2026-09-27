import type { Config } from "tailwindcss";

const hospitalityPalette = { 50: '#FAF7F0', 100: '#F3ECDD', 200: '#E6D6B9', 300: '#A88851', 400: '#A88851', 500: '#A88851', 600: '#92713E', 700: '#806338', 800: '#806338', 900: '#806338', 950: '#806338' };

const neutralPalette = { 50: '#FFFFFF', 100: '#FCFAF6', 200: '#F5F0E7', 300: '#EBE3D5', 400: '#938674', 500: '#7C7162', 600: '#E6DDCF', 700: '#F1EBE1', 800: '#F6F2EB', 900: '#FCFAF6', 950: '#F5F0E7' };

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "bg-success-DEFAULT", "bg-warning-DEFAULT", "bg-danger-DEFAULT", "bg-ai-DEFAULT",
    "text-success-DEFAULT", "text-warning-DEFAULT", "text-danger-DEFAULT", "text-ai-DEFAULT",
    "border-success-DEFAULT", "border-warning-DEFAULT", "border-danger-DEFAULT", "border-ai-DEFAULT",
  ],
  theme: {
    extend: {
      colors: {
        // Ivory, champagne and brushed bronze hospitality theme.
        white: '#FFFFFF',
        black: '#5F5547',
        slate: neutralPalette,
        gray: neutralPalette,
        zinc: neutralPalette,
        neutral: neutralPalette,
        stone: neutralPalette,
        charcoal: '#5F5547',
        muted: '#847867',
        line: '#E8DFD1',
        ink: '#5F5547',
        blue: hospitalityPalette,
        indigo: hospitalityPalette,
        violet: hospitalityPalette,
        purple: hospitalityPalette,
        pink: hospitalityPalette,
        cyan: hospitalityPalette,
        sky: hospitalityPalette,
        teal: hospitalityPalette,
        emerald: hospitalityPalette,
        green: hospitalityPalette,
        lime: hospitalityPalette,
        yellow: hospitalityPalette,
        amber: hospitalityPalette,
        orange: hospitalityPalette,
        red: hospitalityPalette,
        rose: hospitalityPalette,
        // Brand colors
        brand: hospitalityPalette,
        // Accent - champagne for hospitality
        accent: hospitalityPalette,
        // Warm hospitality surfaces
        surface: { 950: '#FAF8F3', 900: '#FAF8F3', 850: '#FFFFFF', 800: '#FFFFFF', 750: '#FAF8F3', 700: '#FAF8F3', 600: '#E8DFD1', 500: '#847867' },
        // Status colors
        success: { light: '#A88851', DEFAULT: '#A88851', dark: '#5F5547', glow: 'rgba(168,136,81,0.15)' },
        warning: { light: '#A88851', DEFAULT: '#A88851', dark: '#5F5547', glow: 'rgba(168,136,81,0.15)' },
        danger: { light: '#A88851', DEFAULT: '#A88851', dark: '#5F5547', glow: 'rgba(168,136,81,0.15)' },
        ai: { light: '#A88851', DEFAULT: '#A88851', dark: '#5F5547', glow: 'rgba(168,136,81,0.15)' },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'Outfit', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(251,244,234,0.05), rgba(251,244,234,0.02))',
        'brand-gradient': 'linear-gradient(135deg, #A88851, #A88851)',
        'ai-gradient': 'linear-gradient(135deg, #A88851, #A88851)',
        'success-gradient': 'linear-gradient(135deg, #A88851, #A88851)',
        'danger-gradient': 'linear-gradient(135deg, #A88851, #A88851)',
        'accent-gradient': 'linear-gradient(135deg, #A88851, #A88851)',
        'dark-gradient': 'linear-gradient(180deg, #FFFFFF, #FAF8F3)',
      },
      boxShadow: {
        'glow-brand': '0 0 20px rgba(168,136,81,0.16)',
        'glow-ai': '0 0 20px rgba(168,136,81,0.16)',
        'glow-success': '0 0 15px rgba(168,136,81,0.16)',
        'glow-danger': '0 0 15px rgba(168,136,81,0.16)',
        'glow-accent': '0 0 15px rgba(168,136,81,0.16)',
        'glass': '0 8px 32px 0 rgba(119,102,75,0.08)',
        'card': '0 4px 24px rgba(119,102,75,0.08)',
        'elevated': '0 8px 40px rgba(119,102,75,0.08)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 8s linear infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
