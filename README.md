# note to self, Read this if you need a guide AGAIN!
# Bits & Finds — Next.js Website
## 📁 Project Structure

```
bitsnfinds-react/
│
├── app/                    ← Pages (one folder = one URL)
│   ├── layout.jsx          ← Root layout (Navbar + Footer on every page)
│   ├── globals.css         ← Global styles
│   ├── page.jsx            ← Home page (/)
│   ├── products/
│   │   └── page.jsx        ← Products page (/products)
│   ├── order/
│   │   └── page.jsx        ← Order form (/order)
│   ├── faq/
│   │   └── page.jsx        ← FAQ page (/faq)
│   └── contact/
│       └── page.jsx        ← Contact page (/contact)
│
├── components/             ← Reusable UI pieces
│   ├── Navbar.jsx          ← Top navigation bar
│   ├── Footer.jsx          ← Footer
│   ├── LeafSVG.jsx         ← Botanical leaf illustrations
│   ├── ProductCard.jsx     ← Single product card
│   ├── FAQItem.jsx         ← Single FAQ accordion item
│   └── SectionHeader.jsx   ← Reusable section title block
│
├── lib/
│   └── config.js           ← EDIT to update all site content
│
├── tailwind.config.js      ← Brand colors and fonts
└── package.json            ← Dependencies
```

##  Setting up

```bash
# 1. Install dependencies (only needed once)
npm install

# 2. Start the dev server
npm run dev

# 3. Open your browser
# Go to http://localhost:3000
```

## ✏️ How to update content

**90% of the time, I only need to edit one file:**

```
lib/config.js
```

- Change text, prices, FAQ answers → edit `config.js`
- Change colors or fonts → edit `tailwind.config.js`
- Add a new page → create a new folder in `app/` with a `page.jsx` inside
- Add a product → add a new object to `CONFIG.products` in `config.js`

## 🚀 soon to Deploy


```
