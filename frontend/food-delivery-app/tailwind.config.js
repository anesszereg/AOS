/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF5722',
          hover: '#F4511E',
          light: '#FF7043',
          dark: '#E64A19',
        },
        secondary: {
          DEFAULT: '#00C853',
          hover: '#00B248',
          light: '#69F0AE',
        },
        navy: '#2C3E50',
        charcoal: '#34495E',
        'gray-medium': '#7F8C8D',
        'gray-light': '#ECF0F1',
        'gray-lighter': '#F8F9FA',
        'yellow-badge': '#FFC107',
        'red-badge': '#F44336',
        'blue-social': '#4267B2',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
        DEFAULT: '0 4px 12px rgba(0, 0, 0, 0.1)',
        md: '0 4px 12px rgba(0, 0, 0, 0.1)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.15)',
        xl: '0 12px 32px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '350ms',
      },
    },
  },
  plugins: [],
};
