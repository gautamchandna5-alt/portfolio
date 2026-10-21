import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Main Navbar Pill */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto bg-[var(--color-portfolio-nav)] px-6 md:px-8 py-3 rounded-full shadow-sm flex items-center justify-between gap-8 text-sm font-semibold tracking-wide">
        
        {/* Mobile: Hamburger Button */}
        <button className="md:hidden p-1 text-gray-800" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        {/* Mobile: Simple branding when menu is collapsed */}
        <span className="md:hidden font-bold text-gray-800 tracking-widest">PORTFOLIO</span>

        {/* Desktop: Standard Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="hover:text-orange-500 transition-colors">ABOUT</a>
          <a href="#projects" className="hover:text-orange-500 transition-colors">PROJECTS</a>
          <a href="#contact" className="hover:text-orange-500 transition-colors">CONTACT</a>
          <a href="#contact" className="bg-orange-500 text-white px-5 py-2 rounded-full hover:bg-orange-600 transition-colors ml-4">
            GET IN TOUCH
          </a>
        </div>
      </nav>

      {/* Mobile: Dropdown Menu Overlay */}
      {isOpen && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 w-[90%] bg-white rounded-3xl shadow-xl flex flex-col items-center py-8 gap-6 text-lg font-bold md:hidden">
          <a href="#about" onClick={() => setIsOpen(false)}>ABOUT</a>
          <a href="#projects" onClick={() => setIsOpen(false)}>PROJECTS</a>
          <a href="#contact" onClick={() => setIsOpen(false)}>CONTACT</a>
          <a href="#contact" className="bg-orange-500 text-white px-8 py-3 rounded-full mt-2" onClick={() => setIsOpen(false)}>
            GET IN TOUCH
          </a>
        </div>
      )}
    </>
  )
}