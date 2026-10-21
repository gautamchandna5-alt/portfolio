import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface OrbData {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  boundsX: number
  boundsY: number
}

export default function BackgroundOrbs() {
  const orb1Ref = useRef<THREE.Mesh>(null!)
  const orb2Ref = useRef<THREE.Mesh>(null!)
  const orb3Ref = useRef<THREE.Mesh>(null!)
  const orb4Ref = useRef<THREE.Mesh>(null!)
  const orb5Ref = useRef<THREE.Mesh>(null!)
  const orb6Ref = useRef<THREE.Mesh>(null!)

  // Include radius for accurate collision detection
  const orbsData = useRef<OrbData[]>([
    { x: -5.0, y: 2.5, vx: 0.015, vy: 0.010, radius: 0.8, boundsX: 7.2, boundsY: 3.8 },
    { x: 5.0, y: -2.0, vx: -0.018, vy: 0.012, radius: 1.2, boundsX: 7.5, boundsY: 3.5 },
    { x: -2.0, y: -3.0, vx: 0.012, vy: -0.014, radius: 0.7, boundsX: 7.0, boundsY: 3.6 },
    { x: 4.0, y: 2.8, vx: -0.014, vy: -0.011, radius: 0.9, boundsX: 7.4, boundsY: 3.9 },
    { x: -6.0, y: -1.0, vx: 0.016, vy: 0.013, radius: 0.6, boundsX: 7.3, boundsY: 3.7 },
    { x: 1.0, y: 3.2, vx: -0.013, vy: -0.015, radius: 1.0, boundsX: 7.1, boundsY: 3.8 }
  ])

  useFrame(() => {
    const data = orbsData.current
    const refs = [orb1Ref, orb2Ref, orb3Ref, orb4Ref, orb5Ref, orb6Ref]

    // 1. Update positions and screen bounds collision
    data.forEach((orb, index) => {
      orb.x += orb.vx
      orb.y += orb.vy

      if (orb.x > orb.boundsX || orb.x < -orb.boundsX) orb.vx *= -1
      if (orb.y > orb.boundsY || orb.y < -orb.boundsY) orb.vy *= -1
    })

    // 2. Check orb-to-orb collisions (elastic collision response)
    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        const orb1 = data[i]
        const orb2 = data[j]

        const dx = orb2.x - orb1.x
        const dy = orb2.y - orb1.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const minDist = orb1.radius + orb2.radius

        // If they overlap/collide
        if (distance < minDist) {
          // Normal vector
          const nx = dx / distance
          const ny = dy / distance

          // Separate them slightly to prevent sticking
          const overlap = minDist - distance
          orb1.x -= nx * overlap * 0.5
          orb1.y -= ny * overlap * 0.5
          orb2.x += nx * overlap * 0.5
          orb2.y += ny * overlap * 0.5

          // Swap/reflect velocities along the normal vector
          const kx = orb1.vx - orb2.vx
          const ky = orb1.vy - orb2.vy
          const p = 2 * (nx * kx + ny * ky) / 2

          orb1.vx -= p * nx
          orb1.vy -= p * ny
          orb2.vx += p * nx
          orb2.vy += p * ny
        }
      }
    }

    // 3. Apply final coordinates to meshes
    refs.forEach((ref, index) => {
      if (!ref.current) return
      ref.current.position.x = data[index].x
      ref.current.position.y = data[index].y
    })
  })

  return (
    <group>
      <mesh ref={orb1Ref}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#60a5fa" roughness={0.1} emissive="#3b82f6" emissiveIntensity={0.6} transparent opacity={0.45} />
      </mesh>
      <mesh ref={orb2Ref}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#f472b6" roughness={0.1} emissive="#ec4899" emissiveIntensity={0.5} transparent opacity={0.35} />
      </mesh>
      <mesh ref={orb3Ref}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#facc15" roughness={0.1} emissive="#eab308" emissiveIntensity={0.6} transparent opacity={0.45} />
      </mesh>
      <mesh ref={orb4Ref}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial color="#2dd4bf" roughness={0.1} emissive="#14b8a6" emissiveIntensity={0.6} transparent opacity={0.4} />
      </mesh>
      <mesh ref={orb5Ref}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#a78bfa" roughness={0.1} emissive="#8b5cf6" emissiveIntensity={0.6} transparent opacity={0.45} />
      </mesh>
      <mesh ref={orb6Ref}>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshStandardMaterial color="#fb923c" roughness={0.1} emissive="#f97316" emissiveIntensity={0.5} transparent opacity={0.38} />
      </mesh>
    </group>
  )
}