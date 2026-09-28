/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          accent: '#8b5cf6',
          cyan: '#06b6d4',
          emerald: '#10b981',
        },
        dark: {
          bg: '#090d16',
          card: 'rgba(15, 23, 42, 0.75)',
          border: 'rgba(255, 255, 255, 0.1)',
          surface: '#111827',
          hover: '#1e293b'
        },
        light: {
          bg: '#f8fafc',
          card: 'rgba(255, 255, 255, 0.85)',
          border: 'rgba(226, 232, 240, 0.8)',
          surface: '#ffffff',
          hover: '#f1f5f9'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.15)',
        'glass-md': '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        'glass-glow': '0 0 25px -5px rgba(99, 102, 241, 0.35)',
        'glass-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { opacity: '0.4', filter: 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.4))' },
          '100%': { opacity: '0.9', filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.7))' },
        }
      }
    },
  },
  plugins: [],
}
