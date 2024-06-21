import { text } from 'stream/consumers'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      keyframes: {
        bg: {
          '0%, 100%': {
            backgroundColor: 'rgba(30, 0, 148, var(--tw-bg-opacity))',
          },
          '33%': {
            backgroundColor: 'rgba(201, 115, 212, var(--tw-bg-opacity))',
          },
          '66%': {
            backgroundColor: 'rgba(89, 201, 110, var(--tw-bg-opacity))',
          },
        },
      },
      animation: {
        bg: 'bg 60s infinite',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#1e0094',
          secondary: '#cc9de1',
          accent: '#c973d4',
          neutral: '#170f3d',
          'base-100': '#f8f7fd',
        },
      },
    ],
  },
  darkMode: 'class',
}
export default config

