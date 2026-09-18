import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: '#0a0d18',
          light: '#12162a',
          lighter: '#1a1f38',
        },
        charcoal: {
          DEFAULT: '#111218',
          light: '#1b1c24',
        },
        burgundy: {
          DEFAULT: '#5c1420',
          light: '#7a1f2d',
          dark: '#3d0d16',
        },
        gold: {
          DEFAULT: '#c6a15b',
          light: '#dcc189',
          dark: '#9c7c3f',
          muted: '#8a7550',
        },
        parchment: {
          DEFAULT: '#ece0c3',
          light: '#f5ecd6',
          dark: '#d9c9a3',
        },
        emerald: {
          DEFAULT: '#1c4d3e',
          light: '#286a55',
        },
        bronze: '#8a6a45',
        house: {
          gryffindor: '#7a1f2d',
          slytherin: '#1c4d3e',
          ravenclaw: '#2b3a67',
          hufflepuff: '#b8860b',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'stars': "radial-gradient(circle at 20% 20%, rgba(198,161,91,0.08), transparent 40%), radial-gradient(circle at 80% 60%, rgba(28,77,62,0.10), transparent 45%)",
      },
      boxShadow: {
        candle: '0 0 24px rgba(198,161,91,0.25), 0 0 4px rgba(198,161,91,0.4)',
        parchment: '0 8px 30px rgba(0,0,0,0.45)',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        drift: {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
          '10%': { opacity: '0.8' },
          '90%': { opacity: '0.4' },
          '100%': { transform: 'translateY(-140px) translateX(20px)', opacity: '0' },
        },
        'spell-pop': {
          '0%': { transform: 'scale(1)', boxShadow: '0 0 0 rgba(198,161,91,0)' },
          '40%': { transform: 'scale(1.03)', boxShadow: '0 0 30px rgba(198,161,91,0.55)' },
          '100%': { transform: 'scale(1)', boxShadow: '0 0 0 rgba(198,161,91,0)' },
        },
      },
      animation: {
        flicker: 'flicker 4s ease-in-out infinite',
        drift: 'drift 6s linear infinite',
        'spell-pop': 'spell-pop 0.6s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
