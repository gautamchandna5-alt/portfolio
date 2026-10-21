export default function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 bg-[var(--color-portfolio-nav)] px-8 py-3 rounded-full shadow-sm text-sm font-semibold tracking-wide">
      <a href="#about" className="hover:text-orange-500 transition-colors">ABOUT</a>
      <a href="#projects" className="hover:text-orange-500 transition-colors">PROJECTS</a>
      <a href="#contact" className="hover:text-orange-500 transition-colors">CONTACT</a>
      <a href="#contact" className="bg-orange-500 text-white px-5 py-2 rounded-full hover:bg-orange-600 transition-colors ml-4">
        GET IN TOUCH
      </a>
    </nav>
  )
}