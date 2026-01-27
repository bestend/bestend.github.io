/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'bg': {
          'primary': '#ffffff',
          'secondary': '#f9fafb',
          'tertiary': '#f3f4f6',
        },
        'text': {
          'primary': '#111827',
          'secondary': '#4b5563',
          'tertiary': '#9ca3af',
        },
        'accent': {
          DEFAULT: '#10B981',
          'hover': '#059669',
        },
        'border': {
          DEFAULT: '#e5e7eb',
          'hover': '#d1d5db',
        },
      },
    },
  },
  plugins: [],
};
