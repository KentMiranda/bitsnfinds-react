'use client'

import { useState } from 'react'

export default function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)

  return (
    <li className="border-b border-mist">
      <button
        className="w-full text-left py-5 flex justify-between items-center gap-6
                   font-display text-lg font-normal text-bark
                   hover:text-walnut transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span>{question}</span>
        <span className={`text-walnut text-xl leading-none flex-shrink-0
                          transition-transform duration-300
                          ${open ? 'rotate-45 text-bark' : ''}`}>
          +
        </span>
      </button>

      <div className={`faq-answer text-ink-muted text-sm font-light leading-relaxed
                       ${open ? 'open' : ''}`}>
        {answer}
      </div>
    </li>
  )
}
