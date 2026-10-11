import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdfbf2',
          100: '#f9f5e1',
          200: '#f2e8be',
          300: '#ebd896',
          400: '#e3c368',
          500: '#d4af37', // Classic metallic gold
          600: '#b89228',
          700: '#947220',
          800: '#795b20',
          900: '#674d20',
        },
        royal: {
          dark: '#0e131f',
          deep: '#141c2e',
          accent: '#1e2942',
        },
        emerald: {
          royal: '#062920',
          rich: '#0a3d30',
        },
        burgundy: {
          royal: '#2e0a16',
          rich: '#451022',
        },
        champagne: {
          light: '#fdfaf5',
          gold: '#f7ede2',
          accent: '#e8d4be',
        }
      },
      fontFamily: {
        serif: ['var(--font-cinzel)', 'Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['var(--font-outfit)', 'Outfit', 'Inter', 'sans-serif'],
        amharic: ['var(--font-noto-ethiopic)', 'Nyala', 'Abyssinica SIL', 'sans-serif'],
        script: ['var(--font-great-vibes)', 'Great Vibes', 'cursive', 'Alex Brush'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
};

export default config;
