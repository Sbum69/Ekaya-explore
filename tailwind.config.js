/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ekaya: {
          orange: '#e8510a',
          'orange-light': '#fde8d8',
          purple: '#7F77DD',
          pink: '#D4537E',
          blue: '#2563eb',
          teal: '#1D9E75',
          amber: '#d97706',
          green: '#16a34a',
          red: '#c0392b',
          bg: '#f5f5f3',
        },
      },
      borderRadius: {
        xl: '14px',
        '2xl': '16px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
