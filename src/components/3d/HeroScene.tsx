import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Desk from './Desk'
import Monitors from './Monitors'
import Character from './Character'

export default function HeroScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [6.5, 4.2, 5.5], fov: 28 }}
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
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.3}
        minAzimuthAngle={-Math.PI / 6}
        maxAzimuthAngle={Math.PI / 3}
      />
    </Canvas>
  )
}