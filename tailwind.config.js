/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        army: '#4b5320',
        olive: '#6b7b3a',
        sand: '#e8d9a8',
        cream: '#f6efd8',
        bark: '#7a5230',
        ink: '#1f1f1a',
        gold: '#c9962b',
        rust: '#a1362a',
      },
      fontFamily: {
        display: ['"Lilita One"', 'Impact', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: { soft: '0 5px 14px rgba(31,31,26,0.22)' },
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
