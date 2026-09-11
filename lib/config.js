export const CONFIG = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://bitsnfinds-backend.onrender.com',

  brand: {
    name: 'Bits & Finds',
    tagline: 'Thoughtfully crafted. Personally yours.',
    domain: 'bitsnfinds.com',
  },

  navLinks: [
    { label: 'About', href: '/#about' },
    { label: 'Services', href: '/#services' },
    { label: 'Gallery', href: '/products' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
    { label: 'Order Now', href: '/order', cta: true },
  ],

  hero: {
    eyebrow: 'Bits & Finds',
    titleLine1: 'Thoughtfully crafted.',
    titleLine2: 'Personally yours.',
    subtitle: 'Unique gifts, personalized keepsakes, and memorable creations made to make every occasion more special.',
    cta1: { label: 'Shop Our Collection', href: '/products' },
    cta2: { label: 'Request a Custom Order', href: '/order' },
    image: '',
  },

  about: {
    eyebrow: 'Our Story',
    title: 'Every detail tells',
    titleEm: 'a story',
    body: 'At Bits & Finds, we transform quality materials into thoughtful gifts and memorable pieces. Through precision laser engraving and cutting, we create personalized products made especially for you.',
    image: '',
  },

  services: {
    eyebrow: 'Made with quality materials',
    title: 'Natural materials.',
    titleEm: 'Beautifully crafted.',
    items: [
      {
        number: '01',
        title: 'Personalized gifts',
        icon: '✦',
        body: 'Add a name, special date, message, or meaningful design to create a gift that is truly one of a kind.',
      },
      {
        number: '02',
        title: 'Thoughtful keepsakes',
        icon: '✎',
        body: 'We create pieces for birthdays, weddings, anniversaries, home accents, and the moments you want to remember.',
      },
      {
        number: '03',
        title: 'Custom creations',
        icon: '✂',
        body: 'Have a logo, photo, name, or idea in mind? We will work with you to turn your concept into something tangible.',
      },
    ],
  },

  gallery: {
    eyebrow: 'Find Something Special',
    title: 'Gifts with meaning.',
    titleEm: 'Keepsakes with memories.',
    subtitle: 'Explore personalized pieces, home accents, event memorabilia, and thoughtful gifts made to be remembered.',
    footerNote: 'Sometimes, the perfect gift is not something you find on a shelf. It is something made just for them.',
    orderLink: { label: 'Request a custom order', href: '/order' },
  },

  products: [
    {
      slug: 'Ellie',
      name: 'Ellie',
      desc: 'Meet Ellie—beautifully engraved on natural slate, turning a cherished photo into a timeless keepsake that will last for years.',
      emoji: '🪵',
      image: '/images/products/ellie.jpeg',
    },
    {
      slug: 'Home Sweet Home',
      name: 'Home Sweet Home',
      desc: 'A beautiful reminder of what truly matters. Crafted on natural slate and permanently engraved, this piece brings warmth and meaning to any space.',
      emoji: '🖼️',
      image: '/images/products/home.jpeg',
    },
    {
      slug: 'engraved-cutting-board',
      name: 'Engraved Cutting Board',
      desc: 'A kitchen essential with timeless character. Featuring a detailed harvest engraving on premium wood, this cutting board is perfect for preparing meals, serving guests, or adding rustic charm to your countertop..',
      emoji: '🍳',
      image: '/images/products/cutting-board.jpeg',
    },
    {
      slug: 'Classic Engraved Pen',
      name: 'Classic Engraved Pen',
      desc: 'Combining sustainability with timeless style, our engraved bamboo pen is designed for everyday use while leaving a lasting impression. Perfect for corporate giveaways, promotional events, and personalized gifts.',
      emoji: '💍',
      image: '/images/products/Pens.jpeg',
    },
    {
      slug: 'Personalized Wooden Coaster',
      name: 'Personalized Wooden Coaster',
      desc: 'A beautifully engraved wooden coaster that blends functionality with heartfelt design. Perfect for daily use, home décor, or as a thoughtful gift for family and friends..',
      emoji: '✨',
      image: '/images/products/coaster.jpeg',
    },
  ],

  order: {
    eyebrow: 'Custom Orders Welcome',
    title: 'Have something',
    titleEm: 'in mind?',
    subtitle: 'Tell us your idea, design, logo, preferred material, quantity, and deadline. We\'ll be happy to discuss your project.',
    infoItems: [
      'Names, dates, logos, artwork, and meaningful messages welcome',
      'Send us a reference photo, design, or simply an idea',
      'We will discuss the design and details before creating',
      'One special gift or a larger event order — let\'s make it memorable',
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

  faqs: [
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
  ],

  contact: {
    eyebrow: 'Get in Touch',
    title: 'Let\'s make',
    titleEm: 'something together',
    subtitle: 'For custom orders, questions, or a new idea — we\'d love to hear from you.',
    links: [
      { icon: '📘', label: 'Facebook', value: 'Bits & Finds', href: 'https://facebook.com' },
      { icon: '📸', label: 'Instagram', value: '@bitsnfinds', href: 'https://instagram.com' },
      { icon: '💬', label: 'Messenger', value: 'Message us directly', href: 'https://m.me/bitsnfinds' },
      { icon: '📧', label: 'Email', value: 'hello@bitsnfinds.com', href: 'mailto:hello@bitsnfinds.com' },
    ],
  },

  footer: {
    copy: '© 2026 Bits & Finds. All rights reserved.',
    links: [
      { label: 'Gallery', href: '/products' },
      { label: 'Order', href: '/order' },
      { label: 'Contact', href: '/contact' },
    ],
  },
}
