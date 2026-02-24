/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        page: '#0B1220',
        card: '#111827',
        elevated: '#1F2937',
        'icon-bg': '#E5E7EB',
        'text-primary': '#FFFFFF',
        'text-secondary': 'rgba(255,255,255,0.7)',
        'text-muted': 'rgba(255,255,255,0.5)',
        border: 'rgba(255,255,255,0.05)',
        'border-hover': 'rgba(124,58,237,0.4)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
      },
      boxShadow: {
        card: '0 10px 30px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
};
