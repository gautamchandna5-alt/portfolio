import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

export default function Character() {
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)

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
      headRef.current.rotation.y = Math.sin(t * 1.5) * 0.08
      headRef.current.rotation.x = 0.15 + Math.sin(t * 3) * 0.02
    }
  })

  return (
    <group position={[0, 0, 0.75]}>
      {/* Head & Hair */}
      <group ref={headRef} position={[0, 1.05, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshStandardMaterial color="#eac096" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.1, -0.05]}>
          <sphereGeometry args={[0.34, 32, 32]} />
          <meshStandardMaterial color="#533529" roughness={0.5} />
        </mesh>
      </group>

      {/* Torso */}
      <RoundedBox args={[0.55, 0.65, 0.35]} radius={0.12} smoothness={4} position={[0, 0.55, 0]} castShadow>
        <meshStandardMaterial color="#2d2d30" roughness={0.7} />
      </RoundedBox>

      {/* Arms */}
      <group ref={leftArmRef} position={[-0.32, 0.48, 0.2]}>
        <RoundedBox args={[0.14, 0.35, 0.14]} radius={0.06} smoothness={4}>
          <meshStandardMaterial color="#2d2d30" roughness={0.7} />
        </RoundedBox>
        <mesh position={[0, -0.2, 0.08]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#eac096" roughness={0.6} />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.32, 0.48, 0.2]}>
        <RoundedBox args={[0.14, 0.35, 0.14]} radius={0.06} smoothness={4}>
          <meshStandardMaterial color="#2d2d30" roughness={0.7} />
        </RoundedBox>
        <mesh position={[0, -0.2, 0.08]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#eac096" roughness={0.6} />
        </mesh>
      </group>

      {/* Office Chair */}
      <group position={[0, -0.2, -0.05]}>
        <RoundedBox args={[0.6, 0.6, 0.08]} radius={0.04} smoothness={4} position={[0, 0.45, 0.22]} rotation={[-0.05, 0, 0]}>
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </RoundedBox>
        <RoundedBox args={[0.6, 0.08, 0.55]} radius={0.04} smoothness={4} position={[0, 0.15, 0]}>
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </RoundedBox>
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