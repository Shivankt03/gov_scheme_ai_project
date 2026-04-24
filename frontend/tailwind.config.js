/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'niti-primary': '#7C3AED',
        'niti-light': '#9F67FF',
        'niti-dark': '#4C1D95',
        'niti-accent': '#FF4F1F',
        'niti-accent-light': '#FF8C42',
        'niti-bg': '#07090F',
        'niti-card': '#0F1320',
        'niti-success': '#10B981',
        'niti-cyan': '#22D3EE',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
