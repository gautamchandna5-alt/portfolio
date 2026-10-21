import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

// Flickering glow from the monitors onto the character
function MonitorSetup() {
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    if (lightRef.current) {
      const t = clock.getElapsedTime()
      // Dynamic flicker simulating moving code / screen glow
      lightRef.current.intensity = 1.8 + Math.sin(t * 8) * 0.4 + Math.sin(t * 19) * 0.2
    }
  })

  return (
    <group position={[0.2, 0.95, -0.2]}>
      {/* Main Coding Monitor */}
      <group position={[0.6, 0, 0]} rotation={[0, -0.2, 0]}>
        {/* Frame */}
        <RoundedBox args={[1.5, 1.0, 0.08]} radius={0.04} smoothness={4}>
          <meshStandardMaterial color="#22272e" roughness={0.3} />
        </RoundedBox>
        {/* Screen with code tint */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[1.38, 0.88]} />
          <meshBasicMaterial color="#1e2430" />
        </mesh>
        {/* Stand */}
        <mesh position={[0, -0.45, -0.1]}>
          <cylinderGeometry args={[0.04, 0.04, 0.4]} />
          <meshStandardMaterial color="#1a1c23" />
        </mesh>
        <mesh position={[0, -0.65, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 32]} />
          <meshStandardMaterial color="#1a1c23" />
        </mesh>
      </group>

      {/* Secondary Monitor */}
      <group position={[-0.9, 0, 0.15]} rotation={[0, 0.35, 0]}>
        <RoundedBox args={[1.4, 0.95, 0.08]} radius={0.04} smoothness={4}>
          <meshStandardMaterial color="#22272e" roughness={0.3} />
        </RoundedBox>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[1.28, 0.83]} />
          <meshBasicMaterial color="#161b22" />
        </mesh>
        <mesh position={[0, -0.45, -0.1]}>
          <cylinderGeometry args={[0.04, 0.04, 0.4]} />
          <meshStandardMaterial color="#1a1c23" />
        </mesh>
        <mesh position={[0, -0.65, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 32]} />
          <meshStandardMaterial color="#1a1c23" />
        </mesh>
      </group>

      {/* Screen casting light backward toward the character */}
      <pointLight
        ref={lightRef}
        position={[0, 0.2, 0.6]}
        color="#70a5ff"
        distance={3.5}
        decay={2}
      />
    </group>
  )
}

function CharacterWithAnimation() {
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)

  // Infinite typing animation loop
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (leftArmRef.current) {
      leftArmRef.current.position.y = 0.48 + Math.sin(t * 14) * 0.025
      leftArmRef.current.rotation.x = -0.4 + Math.cos(t * 14) * 0.05
    }
    if (rightArmRef.current) {
      rightArmRef.current.position.y = 0.48 + Math.sin(t * 14 + 1.5) * 0.025
      rightArmRef.current.rotation.x = -0.4 + Math.cos(t * 14 + 1.5) * 0.05
    }
    if (headRef.current) {
      // Subtle head movement while reading code
      headRef.current.rotation.y = Math.sin(t * 1.5) * 0.08
      headRef.current.rotation.x = 0.15 + Math.sin(t * 3) * 0.02
    }
  })

  return (
    <group position={[0, 0, 0.75]}>
      {/* Head */}
      <group ref={headRef} position={[0, 1.05, 0]}>
        {/* Face */}
        <mesh castShadow>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshStandardMaterial color="#eac096" roughness={0.6} />
        </mesh>
        {/* Hair (clay swoosh style) */}
        <mesh position={[0, 0.1, -0.05]}>
          <sphereGeometry args={[0.34, 32, 32]} />
          <meshStandardMaterial color="#533529" roughness={0.5} />
        </mesh>
      </group>

      {/* Torso (dark t-shirt) */}
      <RoundedBox args={[0.55, 0.65, 0.35]} radius={0.12} smoothness={4} position={[0, 0.55, 0]} castShadow>
        <meshStandardMaterial color="#2d2d30" roughness={0.7} />
      </RoundedBox>

      {/* Typing Arms */}
      <group ref={leftArmRef} position={[-0.32, 0.48, 0.2]}>
        <RoundedBox args={[0.14, 0.35, 0.14]} radius={0.06} smoothness={4}>
          <meshStandardMaterial color="#2d2d30" roughness={0.7} />
        </RoundedBox>
        {/* Hand */}
        <mesh position={[0, -0.2, 0.08]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#eac096" roughness={0.6} />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.32, 0.48, 0.2]}>
        <RoundedBox args={[0.14, 0.35, 0.14]} radius={0.06} smoothness={4}>
          <meshStandardMaterial color="#2d2d30" roughness={0.7} />
        </RoundedBox>
        {/* Hand */}
        <mesh position={[0, -0.2, 0.08]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#eac096" roughness={0.6} />
        </mesh>
      </group>

      {/* Modern White Office Chair */}
      <group position={[0, -0.2, -0.05]}>
        {/* Backrest */}
        <RoundedBox args={[0.6, 0.6, 0.08]} radius={0.04} smoothness={4} position={[0, 0.45, 0.22]} rotation={[-0.05, 0, 0]}>
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </RoundedBox>
        {/* Seat */}
        <RoundedBox args={[0.6, 0.08, 0.55]} radius={0.04} smoothness={4} position={[0, 0.15, 0]}>
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </RoundedBox>
        {/* Orange metal sled base matching the original */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.5]} />
          <meshStandardMaterial color="#ea7a32" roughness={0.4} />
        </mesh>
        <RoundedBox args={[0.55, 0.04, 0.5]} radius={0.02} smoothness={2} position={[0, -0.38, 0]}>
          <meshStandardMaterial color="#ea7a32" roughness={0.4} />
        </RoundedBox>
      </group>
    </group>
  )
}

function WorkspaceDesk() {
  return (
    <group position={[0, -0.25, 0]}>
      {/* Desk Top - Rounded edges */}
      <RoundedBox args={[3.2, 0.12, 1.6]} radius={0.05} smoothness={4} position={[0, 0.5, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </RoundedBox>

      {/* Wooden Desk Legs */}
      <mesh position={[-1.4, 0, 0.6]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.9]} />
        <meshStandardMaterial color="#b88358" roughness={0.5} />
      </mesh>
      <mesh position={[1.4, 0, 0.6]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.9]} />
        <meshStandardMaterial color="#b88358" roughness={0.5} />
      </mesh>
      <mesh position={[-1.4, 0, -0.6]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.9]} />
        <meshStandardMaterial color="#b88358" roughness={0.5} />
      </mesh>
      <mesh position={[1.4, 0, -0.6]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.9]} />
        <meshStandardMaterial color="#b88358" roughness={0.5} />
      </mesh>

      {/* Minimalist Keyboard */}
      <RoundedBox args={[0.8, 0.025, 0.28]} radius={0.01} smoothness={2} position={[0.1, 0.58, 0.35]}>
        <meshStandardMaterial color="#e5e5e5" roughness={0.4} />
      </RoundedBox>

      {/* Yellow/Orange Layered Floor Rug */}
      <group position={[0.2, -0.45, 0.4]}>
        <RoundedBox args={[3.4, 0.02, 2.4]} radius={0.2} smoothness={4}>
          <meshStandardMaterial color="#f0a53b" roughness={0.8} />
        </RoundedBox>
        <RoundedBox args={[2.9, 0.025, 1.9]} radius={0.16} smoothness={4} position={[0, 0.01, 0]}>
          <meshStandardMaterial color="#f7cf57" roughness={0.8} />
        </RoundedBox>
      </group>
    </group>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      shadows
      // Isometric view: high focal length (small FOV) pushed further away eliminates harsh perspective distortion
      camera={{ position: [6.5, 4.2, 5.5], fov: 28 }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Warm ambient base lighting */}
      <ambientLight intensity={0.85} color="#fff8ee" />

      {/* Main warm soft sun casting gentle shadows */}
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Subtle blue fill light from the left to create depth */}
      <directionalLight position={[-6, 4, -4]} intensity={0.4} color="#bcd2e8" />

      <group position={[-0.2, 0, 0]}>
        <WorkspaceDesk />
        <MonitorSetup />
        <CharacterWithAnimation />
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