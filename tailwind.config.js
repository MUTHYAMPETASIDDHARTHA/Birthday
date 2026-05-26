/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        romantic: {
          dark: '#C94C4C',
          accent: '#EAB8B8',
          pastel: '#F2D6D6',
          warm: '#F9E4E4',
          white: '#FFFFFF',
          text: '#5C3A3A',
          charcoal: '#332222',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Outfit"', '"Inter"', 'sans-serif'],
      },
      animation: {
        'ken-burns': 'kenburns 30s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1) translate(0px, 0px)' },
          '100%': { transform: 'scale(1.15) translate(-1%, -1%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
