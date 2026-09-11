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
        // ── Logo-derived palette ──────────────────────────────
        bark:       '#123B57',   // deep blue — text, nav, primary actions
        walnut:     '#2B6680',   // softened blue — headings and secondary actions
        tan:        '#EF8F9C',   // blush coral — accent
        forest:     '#123B57',   // deep blue — buttons and highlights
        sage:       '#A8DDE0',   // pale aqua — borders and dividers
        mist:       '#D9EEF0',   // soft aqua — subtle surfaces
        wheat:      '#F2C66D',   // golden yellow — tags and hover accents
        cream:      '#FFFDF0',   // warm cream — main background
        paper:      '#FFFFFF',   // white — card background
        ink:        '#183044',   // blue-black — body text
        'ink-muted':'#607786',   // slate blue — secondary text
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
