import { Canvas } from '@react-three/fiber'
import Navbar from './components/ui/Navbar'
import BackgroundOrbs from './components/ui/BackgroundOrbs'
import HeroScene from './components/3d/HeroScene'
import HeroSection from './sections/HeroSection'
import AboutSection from './sections/AboutSection'
import ProjectsSection from './sections/ProjectsSection'
import ContactSection from './sections/ContactSection'

export default function App() {
  return (
    <div className="relative w-full font-sans text-gray-900 overflow-x-clip scroll-smooth">
      {/* Fixed Soap Bubbles Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 5, 5]} intensity={2.5} />
          <BackgroundOrbs />
        </Canvas>
      </div>

      <Navbar />

      {/* Wrapper for Hero + About: Bounds the sticky 3D Canvas strictly to the end of AboutSection */}
      <div className="relative w-full">
        <div className="sticky top-0 left-0 w-full h-screen pointer-events-none z-10 overflow-hidden">
          <HeroScene />
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