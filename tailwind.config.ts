import { text } from 'stream/consumers'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
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

