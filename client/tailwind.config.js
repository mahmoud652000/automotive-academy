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
      fontSize: {
        'heading-xs': ['0.75rem', { lineHeight: '1rem' }],
        'heading-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'heading-base': ['1rem', { lineHeight: '1.5rem' }],
        'heading-lg': ['1.125rem', { lineHeight: '1.5rem' }],
        'heading-xl': ['1.25rem', { lineHeight: '1.3' }],
        'heading-2xl': ['1.5rem', { lineHeight: '1.25' }],
        'heading-3xl': ['1.75rem', { lineHeight: '1.2' }],
        'heading-4xl': ['2rem', { lineHeight: '1.15' }],
        'heading-5xl': ['2.5rem', { lineHeight: '1.1' }],
        'heading-6xl': ['3rem', { lineHeight: '1.1' }],
      },
    },
    plugins: [
      function({ addVariant }) {
        addVariant('light', '.light')
      },
    ],
  },
}
