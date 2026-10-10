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
        bark:       '#103B5C',
        walnut:     '#2478A0',
        tan:        '#E4BE47',
        forest:     '#0D3554',
        sage:       '#A9D9ED',
        mist:       '#DDEEF6',
        wheat:      '#E4BE47',
        cream:      '#FFF8E3',
        paper:      '#FFFEF8',
        parchment:  '#F7F1DF',
        ink:        '#183044',
        'ink-muted':'#5A7487',
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
