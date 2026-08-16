/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#dc2626',
          dark: '#b91c1c',
          light: '#ef4444',
        },
        dark: {
          DEFAULT: 'var(--color-bg)',
          light: 'var(--color-surface-light)',
          lighter: 'var(--color-surface-lighter)',
          border: 'var(--color-border)',
          card: 'var(--color-card)',
        },
        surface: 'var(--color-surface)',
        heading: 'rgb(var(--heading-rgb) / <alpha-value>)',
        body: 'rgb(var(--body-rgb) / <alpha-value>)',
        muted: 'rgb(var(--muted-rgb) / <alpha-value>)',
        faint: 'rgb(var(--faint-rgb) / <alpha-value>)',
        overlay: 'rgb(var(--overlay-rgb) / <alpha-value>)',
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        sans: ['Cairo', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
