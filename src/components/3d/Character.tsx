import { Suspense, useEffect, useRef } from 'react'
import { RoundedBox, useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

// Import the GLB file directly from your assets folder
import characterModel from '../../assets/hehhhhhh.glb'

const CHAIR_COLORS = {
  cushions: '#495057',
  base: '#495057'
}

function AnimatedAvatar() {
  const group = useRef<THREE.Group>(null)
  
  const { scene, animations } = useGLTF(characterModel)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    // Traverse the model to enable shadows and inject brand new materials
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        
        const name = (child.name + ' ' + (child.material?.name || '')).toLowerCase()
        
        // Inject fresh materials with your exact colors
        if (name.includes('skin') || name.includes('face') || name.includes('ear')) {
          child.material = new THREE.MeshStandardMaterial({ color: '#ffcba4', roughness: 0.6 })
        } else if (name.includes('head') || name.includes('hair')) {
          child.material = new THREE.MeshStandardMaterial({ color: '#4a3022', roughness: 0.9 })
        } else if (name.includes('gray') || name.includes('arm') || name.includes('shirt')) {
          child.material = new THREE.MeshStandardMaterial({ color: '#27272a', roughness: 0.8 })
        } else if (name.includes('black') || name.includes('pant')) {
          child.material = new THREE.MeshStandardMaterial({ color: '#18181b', roughness: 0.9 })
        } else if (name.includes('white') || name.includes('shoe')) {
          child.material = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5 })
        }
      }
    })
  }, [scene])

  useEffect(() => {
    if (actions['left-desktop']) {
      actions['left-desktop'].reset().fadeIn(0.5).play()
    } else if (actions['idle']) {
      actions['idle'].reset().fadeIn(0.5).play()
    }
    
    return () => {
      actions['left-desktop']?.fadeOut(0.5)
      actions['idle']?.fadeOut(0.5)
    }
  }, [actions])

  return (
    // position: [X (left/right), Y (up/down), Z (forward/backward)]
    // I lowered Y to -0.52 to match the new dropped seat!
    <group ref={group} position={[0, -0.53, -0.3]} rotation={[0, -Math.PI / 2, 0]} scale={0.47} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}

export default function Character() {
  return (
    <group position={[0, -0.25, 1]} rotation={[0, 0, 0]}>
      
      {/* THE CHAIR (Wider, deeper, and lowered) */}
      <group position={[0, -0.1, 0]}>
        <RoundedBox args={[0.7, 0.08, 0.55]} radius={0.03} smoothness={4} position={[0, 0.05, -0.05]} castShadow receiveShadow>
          <meshStandardMaterial color={CHAIR_COLORS.cushions} roughness={0.5} />
        </RoundedBox>
        
        <RoundedBox args={[0.7, 0.55, 0.08]} radius={0.03} smoothness={4} position={[0, 0.27, 0.18]} rotation={[0.1, 0, 0]} castShadow>
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

      {/* THE IMPORTED 3D MODEL */}
      <group position={[0, 0, 0]}>
        <Suspense fallback={null}>
          <AnimatedAvatar />
        </Suspense>
      </group>

    </group>
  )
}

useGLTF.preload(characterModel)