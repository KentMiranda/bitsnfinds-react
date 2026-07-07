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
        // ── Golf Palette (Tyler the Creator) ──────────────────
        // Change these to retheme the whole site
        bark:       '#3B2F1E',   // darkest brown — text, nav
        walnut:     '#6B4F2A',   // mid brown — headings
        tan:        '#9C7A4A',   // lighter brown — accents
        forest:     '#4A6741',   // deep green — buttons, highlights
        sage:       '#7A9E6E',   // muted green — borders, dividers
        mist:       '#C8DDB8',   // very light green — subtle bg
        wheat:      '#C4A96B',   // warm gold — prices, tags
        cream:      '#F2ECD8',   // main background
        paper:      '#FAF7EE',   // card background
        ink:        '#1E1608',   // near black — body text
        'ink-muted':'#7A6A50',   // muted — secondary text
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
