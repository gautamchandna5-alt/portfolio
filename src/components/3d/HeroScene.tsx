import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import Desk from './Desk'
import Monitors from './Monitors'
import Character, { SCENE_POSITIONS } from './Character'

const CHAIR_COLORS = {
  cushions: '#495057',
  base: '#495057'
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

function SceneController() {
  const deskAndChairGroupRef = useRef<THREE.Group>(null)
  const chairSwivelRef = useRef<THREE.Group>(null)
  const { camera, size } = useThree()
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(() => {
    const isMobile = size.width < 768
    const vh = window.innerHeight || 1
    const scrollY = window.scrollY
    const u = THREE.MathUtils.clamp(scrollY / vh, 0, 1)

    // 1. Camera transitions from Isometric Hero [6.5, 3.2, 6.0] to Front About [0, 0.15, 8.2]
    const camProgress = smoothstep(0.05, 0.75, u)
    camera.position.set(
      THREE.MathUtils.lerp(6.5, 0.0, camProgress),
      THREE.MathUtils.lerp(3.2, 0.15, camProgress),
      THREE.MathUtils.lerp(6.0, 8.2, camProgress)
    )
    lookAtTarget.current.set(0, THREE.MathUtils.lerp(0, 0.15, camProgress), 0)
    camera.lookAt(lookAtTarget.current)

    // 2. Swivel the chair on the carpet toward the screen (0 -> 35% scroll)
    const swivel = smoothstep(0.0, 0.35, u)
    if (chairSwivelRef.current) {
      chairSwivelRef.current.rotation.y = swivel * Math.PI
    }

    // 3. Scroll the Desk, Monitors, Carpet, and Chair upward together with the Hero section
    if (deskAndChairGroupRef.current) {
      const heroCfg = isMobile ? SCENE_POSITIONS.heroMobile : SCENE_POSITIONS.heroDesktop
      const vHeight = 2 * 8.2 * Math.tan((28 * Math.PI) / 360)
      const heroScrollUpY = (scrollY / vh) * vHeight * 1.35

      deskAndChairGroupRef.current.position.set(
        heroCfg.x,
        heroCfg.y + heroScrollUpY,
        heroCfg.z
      )
      deskAndChairGroupRef.current.scale.setScalar(heroCfg.scale)
      deskAndChairGroupRef.current.visible = u < 0.95
    }
  })

  return (
    <>
      <group ref={deskAndChairGroupRef}>
        <Desk />
        <Monitors />

        {/* Chair stays planted on the carpet */}
        <group ref={chairSwivelRef} position={[0, -0.25, 1]}>
          <group position={[0, -0.1, 0]}>
            <RoundedBox
              args={[0.7, 0.08, 0.55]}
              radius={0.03}
              smoothness={4}
              position={[0, 0.05, -0.05]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color={CHAIR_COLORS.cushions} roughness={0.5} />
            </RoundedBox>

            <RoundedBox
              args={[0.7, 0.55, 0.08]}
              radius={0.03}
              smoothness={4}
              position={[0, 0.27, 0.18]}
              rotation={[0.1, 0, 0]}
              castShadow
            >
              <meshStandardMaterial color={CHAIR_COLORS.cushions} roughness={0.5} />
            </RoundedBox>

            <mesh position={[0, 0.1, 0.12]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.7, 32]} />
              <meshStandardMaterial color={CHAIR_COLORS.cushions} roughness={0.5} />
            </mesh>

            <mesh position={[0, -0.19, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.48]} />
              <meshStandardMaterial color={CHAIR_COLORS.base} roughness={0.3} metalness={0.4} />
            </mesh>

            <mesh position={[0, -0.43, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.35, 0.35, 0.04, 32]} />
              <meshStandardMaterial color={CHAIR_COLORS.base} roughness={0.3} metalness={0.4} />
            </mesh>
          </group>
        </group>
      </group>

      <Character />
    </>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [6.5, 3.2, 6.0], fov: 28 }}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
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

      <SceneController />
    </Canvas>
  )
}