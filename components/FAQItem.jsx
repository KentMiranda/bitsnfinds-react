// components/FAQItem.jsx
// ================================================================
// A single FAQ accordion item.
// Clicking the question toggles the answer open/closed.
// ================================================================

'use client'

import { useState } from 'react'

export default function FAQItem({ question, answer }) {
  // 'open' tracks whether this item is expanded
  const [open, setOpen] = useState(false)

  return (
    <li className="border-b border-mist">

      {/* Question button */}
      <button
        className="w-full text-left py-5 flex justify-between items-center gap-6
                   font-display text-lg font-normal text-moss
                   hover:text-fern transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span>{question}</span>

        {/* The + rotates to × when open */}
        <span className={`text-sage text-xl leading-none flex-shrink-0
                          transition-transform duration-300
                          ${open ? 'rotate-45 text-fern' : ''}`}>
          +
        </span>
      </button>

      {/* Answer — slides open/closed */}
      <div className={`faq-answer text-ink-muted text-sm font-light leading-relaxed
                       ${open ? 'open' : ''}`}>
        {answer}
      </div>

    </li>
  )
}
