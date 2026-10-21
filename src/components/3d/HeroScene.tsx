import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Desk from './Desk'
import Monitors from './Monitors'
import Character from './Character'


export default function HeroScene() {
  return (
    <Canvas
      shadows
      // The Sweet Spot: Y is set to 3.2, balancing the top-down and straight-on perspectives
      camera={{ position: [6.5, 3.2, 6.0], fov: 28 }}
      style={{ width: '100%', height: '100%' }}
      
    >
      <ambientLight intensity={0.85} color="#fff8ee" />
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.4} color="#bcd2e8" />

      <group position={[-0.2, 0, 0]}>
        <Desk />
        <Monitors />
        <Character />
      </group>

      <OrbitControls
        enableZoom={false}
        // Relaxed the vertical locks to give you a comfortable tilt range 
        // Math.PI / 3.5 allows a nice top-down peek, Math.PI / 2.2 stops right before it gets too flat
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 2.2}
        minAzimuthAngle={-Math.PI / 6}
        maxAzimuthAngle={Math.PI / 3}
      />
      {/* <BackgroundOrbs /> */}
    </Canvas>
  )
}