export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-start md:justify-between px-6 md:px-20 pt-32 md:pt-0 overflow-hidden"
    >
      {/* 2D Typography Layer - Top on Mobile, Left on Desktop */}
      <div className="hero-content relative z-20">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
          Gautam Chandana
        </h1>

        {/* Playful Claymorphic Badge */}
        <div className="mt-6 inline-block">
          <span className="clay-badge">Fullstack Developer</span>
        </div>
      </div>

      {/* 3D Scene Spacer - Bottom 60vh on Mobile, Right 60% on Desktop */}
      <div className="w-full h-[60vh] md:h-screen md:w-[60%] pointer-events-none" />
    </section>
  )
}