import HeroScene from '../components/3d/HeroScene'

export default function HeroSection() {
  return (
    <section id="home" className="relative w-full h-screen flex items-center justify-between px-10 md:px-20">
      {/* 2D Typography */}
      <div className="z-10 relative mt-20 pointer-events-none w-full md:w-1/2">
        <h1 className="text-5xl md:text-[5rem] leading-[1.1] font-extrabold text-[#2d2d2d] mb-4">
          Gautam<br />Chandana
        </h1>
        <div className="inline-block bg-[var(--color-portfolio-badge)] text-white font-bold tracking-widest px-4 py-2 text-lg md:text-xl -rotate-3 transform shadow-md">
          WEB DEVELOPER
        </div>
      </div>

      {/* 3D Scene Layer */}
      <div className="absolute top-0 right-0 w-full md:w-[60%] h-full z-0 cursor-grab active:cursor-grabbing">
        <HeroScene />
      </div>
    </section>
  )
}