import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0D7377',
        'primary-dark': '#0A5C5F',
        secondary: '#F4A81D',
        'secondary-dark': '#D49210',
        accent: '#E8698A',
        soft: '#FDE8EF',
        'light-teal': '#E8F5F5',
        'gold-light': '#FEF3CD',
        cream: '#FFFDF7',
        charcoal: '#1A1A2E',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
        quote: ['Lora', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'count-up': 'countUp 2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
