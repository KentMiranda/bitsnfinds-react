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
        // ── Bits & Finds reference palette ────────────────────
        bark:       '#162869',   // deep navy — text, nav, primary actions
        walnut:     '#3B5DAD',   // blue — headings and secondary actions
        tan:        '#A464A1',   // lavender — accent
        forest:     '#162869',   // navy — buttons and highlights
        sage:       '#88D8C0',   // mint — borders and dividers
        mist:       '#D1D1D1',   // light gray — subtle surfaces
        wheat:      '#FF9385',   // coral — prices, tags, hover accents
        cream:      '#F7F9FC',   // cool white — main background
        paper:      '#FFFFFF',   // white — card background
        ink:        '#000000',   // black — body text
        'ink-muted':'#757575',   // neutral gray — secondary text
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
