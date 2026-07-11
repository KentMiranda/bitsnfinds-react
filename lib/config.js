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
    { label: 'Gallery',     href: '/products' },
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

  // ── Gallery (Products page) ────────────────────────────────────
  // Past customer work — inspiration, not items for sale.
  gallery: {
    eyebrow:    'Past Work',
    title:      'Some of the pieces',
    titleEm:    'we\'ve made',
    subtitle:   'These are real orders from past customers — shown here as inspiration, not as items in stock. Every piece we make is fully custom.',
    footerNote: 'Have an idea in mind? Tell us what you\'d like engraved and we\'ll make something uniquely yours.',
    orderLink:  { label: 'Start a custom order', href: '/order' },
  },

  // To add a piece: copy one object {}, paste it, fill in the details
  // To remove a piece: delete its object {}
  // image: paste a URL, or leave '' to show the emoji placeholder
  products: [
    {
      slug:  'Ellie',
      name:  'Ellie',
      desc:  'Meet Ellie—beautifully engraved on natural slate, turning a cherished photo into a timeless keepsake that will last for years.',
      emoji: '🪵',
      image: '/images/products/ellie.jpeg',
    },
    {
      slug:  'Home Sweet Home',
      name:  'Home Sweet Home',
      desc:  'A beautiful reminder of what truly matters. Crafted on natural slate and permanently engraved, this piece brings warmth and meaning to any space.',
      emoji: '🖼️',
      image: '/images/products/home.jpeg',
    },
    {
      slug:  'engraved-cutting-board',
      name:  'Engraved Cutting Board',
      desc:  'A kitchen essential with timeless character. Featuring a detailed harvest engraving on premium wood, this cutting board is perfect for preparing meals, serving guests, or adding rustic charm to your countertop..',
      emoji: '🍳',
      image: '/images/products/cutting-board.jpeg',
    },
    {
      slug:  'Classic Engraved Pen',
      name:  'Classic Engraved Pen',
      desc:  'Combining sustainability with timeless style, our engraved bamboo pen is designed for everyday use while leaving a lasting impression. Perfect for corporate giveaways, promotional events, and personalized gifts.',
      emoji: '💍',
      image: '/images/products/Pens.jpeg',
    },
    {
      slug:  'Personalized Wooden Coaster',
      name:  'Personalized Wooden Coaster',
      desc:  'A beautifully engraved wooden coaster that blends functionality with heartfelt design. Perfect for daily use, home décor, or as a thoughtful gift for family and friends..',
      emoji: '✨',
      image: '/images/products/coaster.jpeg',
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
      { label: 'Gallery',  href: '/products' },
      { label: 'Order',    href: '/order'    },
      { label: 'Contact',  href: '/contact'  },
    ],
  },

}
