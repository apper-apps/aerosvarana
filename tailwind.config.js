/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#B8860B',
        secondary: '#2C3E50',
        accent: '#E74C3C',
        success: '#27AE60',
        warning: '#F39C12',
        error: '#E74C3C',
        info: '#3498DB',
        surface: {
          50: '#FAF9F6',
          100: '#F5F5F0',
          200: '#EBEBD9',
          300: '#E0E0CC',
          400: '#D6D6BF',
          500: '#CCCCB2',
          600: '#A3A392',
          700: '#7A7A71',
          800: '#515151',
          900: '#282830'
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Playfair Display', 'serif']
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '.7',
            transform: 'scale(1.05)',
          },
        }
      }
    },
  },
  plugins: [],
}