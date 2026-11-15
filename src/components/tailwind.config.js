/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#0d0f0e',
        panel: '#151816',
        panel2: '#1c201d',
        line: '#2a302b',
        fg: '#e9efe7',
        cream: '#e9efe7',
        muted: '#8d988f',
        leaf: '#4cc15f',
        leafbg: '#14301b',
        army: '#2b7a3d',
        olive: '#2f7d40',
        bark: '#8a5d2b',
        ink: '#0b0d0c',
        gold: '#d9a62e',
        rust: '#c9483c',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: { soft: '0 8px 24px rgba(0,0,0,0.35)' },
      keyframes: {
        pop: {
          from: { opacity: '0', transform: 'translateY(-12px) scale(0.97)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: { pop: 'pop 0.25s ease-out' },
    },
  },
  plugins: [],
};
