/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bark:       '#123B57',
        walnut:     '#2B6680',
        tan:        '#EF8F9C',
        forest:     '#123B57',
        sage:       '#A8DDE0',
        mist:       '#D9EEF0',
        wheat:      '#F2C66D',
        cream:      '#FFFDF0',
        paper:      '#FFFFFF',
        parchment:  '#F7F4ED',
        ink:        '#183044',
        'ink-muted':'#607786',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        sm: '3px',
        md: '8px',
        lg: '16px',
      },
    },
  },
  plugins: [],
}
