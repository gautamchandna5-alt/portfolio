import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Navbar from './components/ui/Navbar'
import BackgroundOrbs from './components/ui/BackgroundOrbs'
import HeroScene from './components/3d/HeroScene'
import HeroSection from './sections/HeroSection'
import AboutSection from './sections/AboutSection'
import ProjectsSection from './sections/ProjectsSection'
import ContactSection from './sections/ContactSection'

export default function App() {
  const heroAboutWrapperRef = useRef<HTMLDivElement>(null)
  const [is3DSceneVisible, setIs3DSceneVisible] = useState(true)

  // Automatically pause the 3D Hero/About Canvas when scrolled down into Projects/Contact
  useEffect(() => {
    const el = heroAboutWrapperRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIs3DSceneVisible(entry.isIntersecting)
      },
      { rootMargin: '100px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative w-full font-sans text-gray-900 overflow-x-clip scroll-smooth">
      {/* Fixed Soap Bubbles Background: dpr={1} cuts Retina GPU shader load by 75% */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <Canvas
          dpr={1}
          gl={{ antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' }}
          camera={{ position: [0, 0, 10], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
        >
          <BackgroundOrbs />
        </Canvas>
      </div>

      <Navbar />

      {/* Wrapper for Hero + About: Bounds the sticky 3D Canvas strictly to the end of AboutSection */}
      <div ref={heroAboutWrapperRef} className="relative w-full">
        <div className="sticky top-0 left-0 w-full h-screen pointer-events-none z-10 overflow-hidden">
          <HeroScene isVisible={is3DSceneVisible} />
        </div>

        <div className="-mt-[100vh]">
          <HeroSection />
          <AboutSection />
        </div>
      </div>

      <ProjectsSection />
      <ContactSection />
    </div>
  )
}