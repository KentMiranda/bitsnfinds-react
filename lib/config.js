/* ================================================================
   lib/config.js — EDIT THIS FILE TO UPDATE THE WHOLE SITE
   This is the only file you'll touch 90% of the time.
   ================================================================ */

export const CONFIG = {

  // ── API ────────────────────────────────────────────────────────
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',

  // ── Brand ──────────────────────────────────────────────────────
  brand: {
    name:    'Bits & Finds',
    tagline: 'Burned into wood, built to last',
    domain:  'bitsnfinds.com',
  },

  // ── Navigation ─────────────────────────────────────────────────
  navLinks: [
    { label: 'About',     href: '/#about'   },
    { label: 'Products',  href: '/products' },
    { label: 'FAQ',       href: '/faq'      },
    { label: 'Contact',   href: '/contact'  },
    { label: 'Order Now', href: '/order', cta: true },
  ],

  // ── Home page ──────────────────────────────────────────────────
  hero: {
    eyebrow:    'Bits & Finds Wood Engraving',
    titleLine1: 'Burned by hand,',
    titleLine2: 'made with heart',
    subtitle:   'Custom wood engravings and personalized pieces — burned into native Philippine hardwood, made to order with love.',
    cta1: { label: 'See Our Work',   href: '/products' },
    cta2: { label: 'Place an Order', href: '/order'    },
    image: '',
  },

  // ── About ──────────────────────────────────────────────────────
  about: {
    eyebrow: 'Our Story',
    title:   'Every burn tells',
    titleEm: 'a story',
    body:    'Bits & Finds started as a passion project in a small workshop in the Philippines — where a wood burner and a blank piece of hardwood became a canvas. Tita Mari has spent years perfecting the art of pyrography, turning raw wood into personalized pieces that carry meaning and last a lifetime.',
    image:   '',
    values: [
      { icon: '🔥', title: 'Hand Burned',       desc: 'Every line is burned by hand using a pyrography pen — no laser, no shortcuts.'      },
      { icon: '🌿', title: 'Native Wood',        desc: 'Sustainably sourced Philippine hardwood — molave, narra, acacia, and more.'          },
      { icon: '✏️',  title: 'Fully Custom',      desc: 'Send us a name, a quote, a portrait, a logo — we can engrave almost anything.'       },
      { icon: '📦', title: 'Ships Nationwide',   desc: 'We deliver anywhere in the Philippines, packaged with care.'                         },
    ],
  },

  // ── Products ───────────────────────────────────────────────────
  // To add a product: copy one object {}, paste it, fill in the details
  // To remove a product: delete its object {}
  // image: paste a URL, or leave '' to show the emoji placeholder
  products: [
    {
      slug:  'engraved-name-board',
      name:  'Engraved Name Board',
      desc:  'Personalized name or word burned into solid wood. Perfect for doors, desks, nurseries, or as a gift.',
      price: 'From ₱450',
      tag:   'Bestseller',
      emoji: '🪵',
      image: '',
    },
    {
      slug:  'portrait-engraving',
      name:  'Portrait Engraving',
      desc:  'Send us a photo and we\'ll burn it into wood — people, pets, or places. A truly one-of-a-kind keepsake.',
      price: 'From ₱1,800',
      tag:   'Most Meaningful',
      emoji: '🖼️',
      image: '',
    },
    {
      slug:  'engraved-cutting-board',
      name:  'Engraved Cutting Board',
      desc:  'A functional narra or acacia cutting board with a custom name, quote, or design burned in.',
      price: 'From ₱950',
      tag:   'Gift Idea',
      emoji: '🍳',
      image: '',
    },
    {
      slug:  'wedding-guest-book',
      name:  'Wedding Guest Book Board',
      desc:  'A large wood panel where guests sign their names — engraved with your names and wedding date.',
      price: 'From ₱2,500',
      tag:   'Weddings',
      emoji: '💍',
      image: '',
    },
    {
      slug:  'engraved-jewelry-box',
      name:  'Engraved Jewelry Box',
      desc:  'A wooden jewelry box with a custom name, initial, or design burned on the lid.',
      price: 'From ₱1,200',
      tag:   'Custom',
      emoji: '✨',
      image: '',
    },
    {
      slug:  'logo-signage',
      name:  'Logo & Business Signage',
      desc:  'Get your business logo or brand name engraved on wood — ideal for storefronts, cafés, and offices.',
      price: 'From ₱1,500',
      tag:   'Business',
      emoji: '🏪',
      image: '',
    },
  ],

  // ── Order form ─────────────────────────────────────────────────
  order: {
    eyebrow:  'Place an Order',
    title:    'Request a custom',
    titleEm:  'engraving',
    subtitle:  'Fill out the form and we\'ll get back to you within 24–48 hours to discuss the details.',
    infoItems: [
      'We engrave names, quotes, portraits, logos, and more',
      'Send us a reference photo or design — we\'ll take it from there',
      'Lead time is typically 3–7 days depending on complexity',
      '50% down payment required upon order confirmation',
    ],
    productOptions: [
      'Name / Word Board',
      'Portrait (Person or Pet)',
      'Cutting Board',
      'Wedding / Event Piece',
      'Jewelry Box',
      'Business Logo / Signage',
      'Other (describe below)',
    ],
  },

  // ── FAQ ────────────────────────────────────────────────────────
  faqs: [
    {
      q: 'What is pyrography / wood engraving?',
      a: 'Pyrography is the art of burning designs into wood using a heated pen. Every line is drawn by hand — it\'s like drawing, but with fire. The result is a permanent, detailed design burned directly into the surface of the wood.',
    },
    {
      q: 'What can you engrave?',
      a: 'Almost anything — names, quotes, logos, portraits of people or pets, wedding details, maps, mandalas, and more. If you can describe it or send us a reference image, we can work with it.',
    },
    {
      q: 'How do I place a custom order?',
      a: 'Fill out our Order Form with your details and what you\'d like engraved. Attach a reference photo if you have one. We\'ll reach out within 24–48 hours to confirm and discuss.',
    },
    {
      q: 'How long does an order take?',
      a: 'Most orders take 3–7 days depending on size and complexity. Rush orders may be available — just let us know your deadline when ordering.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept GCash, Maya, and bank transfers (BDO, BPI). A 50% down payment is required to start, with the balance due upon completion.',
    },
    {
      q: 'Do you ship outside the Philippines?',
      a: 'Currently we ship within the Philippines only. International shipping is something we\'re looking into — stay tuned!',
    },
    {
      q: 'Can I see it before it ships?',
      a: 'Always. We send you a photo and short video of the finished piece for your approval before we pack and ship it.',
    },
  ],

  // ── Contact ────────────────────────────────────────────────────
  contact: {
    eyebrow:  'Get in Touch',
    title:    'Let\'s make',
    titleEm:  'something together',
    subtitle: 'For orders, questions, or just to share what you have in mind — we\'d love to hear from you.',
    links: [
      { icon: '📘', label: 'Facebook',  value: 'Bits & Finds',         href: 'https://facebook.com'        },
      { icon: '📸', label: 'Instagram', value: '@bitsnfinds',          href: 'https://instagram.com'       },
      { icon: '💬', label: 'Messenger', value: 'Message us directly',  href: 'https://m.me/bitsnfinds'     },
      { icon: '📧', label: 'Email',     value: 'hello@bitsnfinds.com', href: 'mailto:hello@bitsnfinds.com' },
    ],
  },

  // ── Footer ─────────────────────────────────────────────────────
  footer: {
    copy:  '© 2025 Bits & Finds. All rights reserved.',
    links: [
      { label: 'Products', href: '/products' },
      { label: 'Order',    href: '/order'    },
      { label: 'Contact',  href: '/contact'  },
    ],
  },

}
