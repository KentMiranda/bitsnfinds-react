# Bits & Finds frontend UI checklist

Reference: [Basic UI Rules Every Front-End Developer Should Know](https://medium.com/multitude-it-labs/basic-ui-rules-every-front-end-developer-should-know-e4eff8ad0dbc)

This checklist translates the reference article into project-specific checks. It is a summary, not a reproduction of the article.

## Design principles

- [x] **Font pairing:** The site uses two families only: Playfair Display for display headings and DM Sans for interface/body text.
- [x] **Spacing:** Existing sections use consistent Tailwind spacing steps and shared content widths rather than arbitrary per-element spacing.
- [x] **Color and contrast:** The Carrd reference palette is reused consistently through shared theme tokens: deep navy, blue, coral, mint, lavender, white, and neutral gray. Interactive focus uses coral for clear visibility.
- [x] **Responsiveness:** Hero, event showcase, navigation, forms, and admin pages use responsive breakpoints; mobile navigation has touch-sized controls.
- [x] **Icons:** Existing icons remain familiar and paired with text or accessible labels; the mobile menu button now exposes its state to assistive technology.
- [x] **Hierarchy:** Display headings, uppercase eyebrow labels, muted supporting text, and primary/secondary buttons establish a consistent reading order.

## Practical implementation

- [x] **Relative sizing:** Tailwind typography and spacing utilities use rem-based values; no global fixed-pixel type system was introduced.
- [x] **Global styles:** Focus visibility, tap behavior, and reduced-motion behavior are centralized in `app/globals.css`.
- [x] **Avoiding `!important`:** New styles use normal CSS cascade and utility classes without `!important`.
- [x] **Shared patterns:** Navigation focus behavior and global motion preferences are defined once instead of repeated per page.
- [x] **Keyboard access:** Links and the mobile menu have visible `:focus-visible` states; menu state is exposed with `aria-expanded` and `aria-controls`.
- [x] **Motion preferences:** Slideshow and hover animations are disabled/reduced when the user requests reduced motion.
- [x] **Background treatment:** A layered navy/mint/coral/lavender gradient, dot texture, and organic outline create a distinctive background without adding image dependencies or competing with content.
- [x] **Atmosphere detail:** Mint is now a primary background tone, with a subtle geometric line pattern, concentric color rings, and slow ambient movement for a more memorable surface.

## Intentionally preserved

- The Carrd reference visual identity is represented through the shared navy/coral/mint palette instead of page-specific color overrides.
- Existing event hover behavior remains on desktop, while mobile continues to show event details without requiring hover.
