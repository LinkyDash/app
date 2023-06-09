/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        shibi: '#12DFDD',
        zerak: '#0A86D9',
        weird: '#DFE3F7',
        looksLikeWhite: '#f6f5f4',
        roseGold: '#E7DFDB'
      },
      fontFamily: {
        'helvetica': ['Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
