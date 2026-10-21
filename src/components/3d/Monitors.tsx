import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

export default function Monitors() {
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    if (lightRef.current) {
      const t = clock.getElapsedTime()
      lightRef.current.intensity = 1.8 + Math.sin(t * 8) * 0.4 + Math.sin(t * 19) * 0.2
    }
  })

  return (
    <group position={[0.2, 0.95, -0.2]}>
      {/* Primary Monitor */}
      <group position={[0.6, 0, 0]} rotation={[0, -0.2, 0]}>
        <RoundedBox args={[1.5, 1.0, 0.08]} radius={0.04} smoothness={4}>
          <meshStandardMaterial color="#22272e" roughness={0.3} />
        </RoundedBox>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[1.38, 0.88]} />
          <meshBasicMaterial color="#1e2430" />
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

      {/* Dynamic Screen Glow */}
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