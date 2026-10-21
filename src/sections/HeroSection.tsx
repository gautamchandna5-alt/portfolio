import HeroScene from '../components/3d/HeroScene'

export default function HeroSection() {
  return (
    <section id="home" className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-start md:justify-between px-6 md:px-20 pt-32 md:pt-0">
      
      {/* 2D Typography Layer - Top on Mobile, Left on Desktop */}
      <div className="z-10 relative w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left pointer-events-none mt-4 md:mt-20">
        <h1 className="text-5xl md:text-[5rem] leading-[1.1] font-extrabold text-[#2d2d2d] mb-4">
          Gautam<br className="hidden md:block" />
          <span className="md:hidden"> </span>Chandana
        </h1>
        <div className="inline-block bg-[var(--color-portfolio-badge)] text-white font-bold tracking-widest px-4 py-2 text-sm md:text-xl -rotate-3 transform shadow-md">
          WEB DEVELOPER
        </div>
      </div>

      {/* 3D Scene Layer - Bottom on Mobile, Right on Desktop */}
      <div className="relative md:absolute top-0 right-0 w-full h-[60vh] md:h-full md:w-[60%] z-0 cursor-grab active:cursor-grabbing mt-8 md:mt-0">
        <HeroScene />
      </div>
      
    </section>
  )
}