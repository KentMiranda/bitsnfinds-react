// components/LeafSVG.jsx
// ================================================================
// Reusable botanical SVG illustrations used across all sections.
// Three variants: 'branch', 'single', 'sprig'
// Usage: <LeafSVG variant="branch" className="..." />
// ================================================================

export default function LeafSVG({ variant = 'branch', className = '' }) {

  if (variant === 'branch') return (
    <svg viewBox="0 0 300 500" fill="none" className={className} aria-hidden="true">
      <path d="M150 480 C150 480 145 380 148 300 C151 220 140 140 130 60"
            stroke="#3E5C3F" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M148 300 C148 300 80 270 50 210 C20 150 70 100 110 140 C135 165 148 220 148 300Z"
            stroke="#3E5C3F" strokeWidth="1" fill="#3E5C3F" fillOpacity="0.15"/>
      <path d="M148 300 C120 260 80 230 50 210"
            stroke="#3E5C3F" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M150 260 C150 260 220 230 250 170 C280 110 230 65 188 105 C163 130 152 195 150 260Z"
            stroke="#3E5C3F" strokeWidth="1" fill="#3E5C3F" fillOpacity="0.15"/>
      <path d="M150 260 C178 222 215 198 250 170"
            stroke="#3E5C3F" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M145 180 C145 180 95 160 75 120 C60 90 90 65 115 90 C132 108 143 148 145 180Z"
            stroke="#3E5C3F" strokeWidth="1" fill="#3E5C3F" fillOpacity="0.12"/>
      <path d="M148 140 C148 140 190 118 205 82 C218 52 193 32 170 52 C155 67 149 108 148 140Z"
            stroke="#3E5C3F" strokeWidth="1" fill="#3E5C3F" fillOpacity="0.12"/>
      <path d="M140 80 C130 60 115 45 105 30"
            stroke="#3E5C3F" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M142 70 C148 50 152 35 155 18"
            stroke="#3E5C3F" strokeWidth="0.8" strokeLinecap="round"/>
    </svg>
  )

  if (variant === 'single') return (
    <svg viewBox="0 0 200 280" fill="none" className={className} aria-hidden="true">
      <path d="M100 260 C100 260 95 180 98 120 C101 60 85 20 80 5"
            stroke="#3E5C3F" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M99 200 C99 200 40 170 15 120 C-5 80 30 40 65 75 C85 95 98 150 99 200Z"
            fill="#3E5C3F" fillOpacity="0.18" stroke="#3E5C3F" strokeWidth="0.8"/>
      <path d="M99 200 C75 165 42 140 15 120"
            stroke="#3E5C3F" strokeWidth="0.6" strokeLinecap="round"/>
      <path d="M100 160 C100 160 158 132 178 88 C195 50 168 18 140 45 C120 65 102 118 100 160Z"
            fill="#3E5C3F" fillOpacity="0.18" stroke="#3E5C3F" strokeWidth="0.8"/>
      <path d="M100 160 C125 128 155 108 178 88"
            stroke="#3E5C3F" strokeWidth="0.6" strokeLinecap="round"/>
    </svg>
  )

  // Default: sprig
  return (
    <svg viewBox="0 0 120 200" fill="none" className={className} aria-hidden="true">
      <path d="M60 190 C60 190 58 130 60 90 C62 50 55 20 52 5"
            stroke="#5A7A4A" strokeWidth="1" strokeLinecap="round"/>
      <path d="M60 140 C60 140 25 122 12 92 C0 65 22 42 44 62 C56 73 60 110 60 140Z"
            fill="#5A7A4A" fillOpacity="0.2" stroke="#5A7A4A" strokeWidth="0.7"/>
      <path d="M60 108 C60 108 90 92 100 66 C110 42 92 24 72 40 C61 50 60 82 60 108Z"
            fill="#5A7A4A" fillOpacity="0.2" stroke="#5A7A4A" strokeWidth="0.7"/>
    </svg>
  )
}
