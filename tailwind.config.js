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
        dark: {
          950: '#04060A',
          900: '#080B12',
          850: '#0C101B',
          800: '#101826',
          700: '#182235',
          600: '#223048',
          500: '#334466',
        },
        brand: {
          blue: '#4F6BFF',
          cyan: '#00C2FF',
          purple: '#8B5CF6',
          red: '#F43F5E',
          rose: '#FF4D6D',
          accent: '#3B82F6',
          glow: '#2563EB',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B8C2D3',
          muted: '#7C8596',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(79, 107, 255, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(0, 194, 255, 0.4)',
        'glow-red': '0 0 25px -5px rgba(244, 63, 94, 0.45)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
