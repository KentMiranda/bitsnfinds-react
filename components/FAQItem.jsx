'use client'

import { useState } from 'react'

export default function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  const answerId = `faq-answer-${question.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return (
    <li className="border-b border-mist">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={answerId}
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

      <div id={answerId} className={`faq-answer text-ink-muted text-sm font-light leading-relaxed
                       ${open ? 'open' : ''}`}>
        {answer}
      </div>
    </li>
  )
}
