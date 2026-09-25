/** @type {import('tailwindcss').Config} */
// Design tokens live in src/styles/tokens.css. This file only maps them.
const rgb = (v) => `rgb(var(${v}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: rgb('--canvas'),
        surface: { DEFAULT: rgb('--surface'), 2: rgb('--surface-2') },
        fg: { DEFAULT: rgb('--fg'), muted: 'var(--fg-muted)', subtle: 'var(--fg-subtle)' },
        line: { DEFAULT: 'var(--line)', strong: 'var(--line-strong)' },
        accent: {
          DEFAULT: rgb('--accent'),
          hover: rgb('--accent-hover'),
          fg: rgb('--accent-fg'),
          soft: 'var(--accent-soft)',
        },
        pos: rgb('--pos'),
        neg: rgb('--neg'),
      },
      fontFamily: {
        // Plus Jakarta Sans has no Cyrillic; Manrope fills those glyphs per character.
        sans: ['"Plus Jakarta Sans"', 'Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      // Type scale: 11 (micro) / 12 / 14 / 16 / 20 / 28 / 44. Larger Tailwind
      // steps collapse onto the scale so nothing drifts off it.
      fontSize: {
        '2xs': ['11px', { lineHeight: '16px', letterSpacing: '0.06em' }],
        xs: ['12px', { lineHeight: '18px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['16px', { lineHeight: '24px' }],
        xl: ['20px', { lineHeight: '28px', letterSpacing: '-0.02em' }],
        '2xl': ['28px', { lineHeight: '34px', letterSpacing: '-0.02em' }],
        '3xl': ['28px', { lineHeight: '34px', letterSpacing: '-0.02em' }],
        '4xl': ['44px', { lineHeight: '48px', letterSpacing: '-0.02em' }],
        '5xl': ['44px', { lineHeight: '48px', letterSpacing: '-0.02em' }],
      },
      fontWeight: {
        bold: '600',
        extrabold: '650',
        black: '650',
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: 'var(--radius)',
        md: 'var(--radius)',
        lg: 'var(--radius)',
        xl: 'var(--radius)',
        '2xl': 'var(--radius)',
        '3xl': 'var(--radius)',
      },
      // No elevation on surfaces. Only floating layers (drawer, modal, toast) get one.
      boxShadow: {
        sm: 'none',
        DEFAULT: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none',
        '2xl': 'none',
        overlay: '0 16px 48px -12px rgb(0 0 0 / 0.5)',
      },
      transitionDuration: { DEFAULT: '150ms' },
      transitionTimingFunction: { DEFAULT: 'cubic-bezier(0.2, 0, 0, 1)' },
    },
  },
  plugins: [],
};
