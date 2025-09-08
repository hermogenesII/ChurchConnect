import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Custom color palette for church application
      colors: {
        // Primary brand colors
        primary: {
          50: '#eff6ff',   // Lightest blue
          100: '#dbeafe',  
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // Base blue
          600: '#1e40af',  // Deep blue (main primary)
          700: '#1d4ed8',
          800: '#1e3a8a',
          900: '#1e293b',  // Darkest
          950: '#0f172a',
        },
        // Secondary warm gold
        secondary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // Warm gold (main secondary)
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Accent sage green
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',  // Sage green (main accent)
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Spiritual purple
        spiritual: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',  // Gentle purple
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        // Neutral grays with warmth
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#6b7280',  // Warm gray
          700: '#57534e',
          800: '#44403c',
          900: '#292524',
          950: '#1c1917',
        },
        // Semantic colors
        success: {
          50: '#ecfdf5',
          500: '#059669',  // Sage green
          600: '#047857',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',  // Warm gold
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',  // Soft coral
          600: '#dc2626',
        },
        // Background colors
        cream: {
          50: '#fefce8',   // Soft cream
          100: '#fef9c3',
          200: '#fef08a',
        },
      },
      // Custom fonts
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      // Custom spacing for mobile/desktop differences
      spacing: {
        '18': '4.5rem',   // 72px
        '88': '22rem',    // 352px
        '100': '25rem',   // 400px
        '112': '28rem',   // 448px
        '128': '32rem',   // 512px
      },
      // Custom breakpoints optimized for church app
      screens: {
        'xs': '375px',    // Small phones
        'sm': '640px',    // Large phones  
        'md': '768px',    // Tablets
        'lg': '1024px',   // Desktop threshold (admin)
        'xl': '1280px',   // Large desktop
        '2xl': '1536px',  // Ultra-wide
      },
      // Custom border radius for warmth
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      // Custom shadows for depth
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'gentle': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      // Animation for smooth interactions
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;