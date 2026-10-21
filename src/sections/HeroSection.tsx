import HeroScene from '../components/3d/HeroScene'
import BackgroundOrbs from '../components/ui/BackgroundOrbs.tsx' // Make sure to import your background orbs!
import { Canvas } from '@react-three/fiber'

export default function HeroSection() {
  return (
    <section id="home" className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-start md:justify-between px-6 md:px-20 pt-32 md:pt-0 overflow-hidden">
      
<div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
  <Canvas 
    camera={{ position: [0, 0, 10], fov: 50 }}
    style={{ position: 'absolute', width: '100%', height: '100%' }}
  >
    <ambientLight intensity={1.2} />
    <directionalLight position={[5, 5, 5]} intensity={2.5} />
    <BackgroundOrbs />
  </Canvas>
</div>

      {/* 2D Typography Layer - Top on Mobile, Left on Desktop */}
      <div className="hero-content z-10">
        <h1 className="text-6xl font-bold tracking-tight text-gray-900">
          Gautam Chandana
        </h1>
        
        {/* Playful Claymorphic Badge */}
        <div className="mt-6 inline-block">
          <span className="clay-badge">
            Fullstack Developer
          </span>
        </div>
      </div>

      {/* 3D Scene Layer (Desk & Character) - Bottom on Mobile, Right on Desktop */}
      <div className="relative md:absolute top-0 right-0 w-full h-[60vh] md:h-full md:w-[60%] z-0 cursor-grab active:cursor-grabbing mt-8 md:mt-0">
        <HeroScene />
      </div>
      
    </section>
  )
}