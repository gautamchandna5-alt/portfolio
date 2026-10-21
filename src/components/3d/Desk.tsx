import { RoundedBox, useTexture } from '@react-three/drei'
import { useEffect } from 'react'
import * as THREE from 'three'

import tableTextureImg from '../../assets/images/ice-age.png'
import rugTextureImg from '../../assets/images/back-pattern.png'

const DESK_COLORS = {
  surfaceBase: '#ffffff',       // Solid base color for the table
  surfacePattern: '#000000',    // Color for the table pattern overlay
  legs: '#b88358',
  keyboard: '#e5e5e5',
  rugOuter: '#aa0022',
  rugInnerBase: '#ff0033',      // Solid base color for the inner rug
  rugPatternColor: '#111111'    // Color for the rug pattern overlay
}

export default function Desk() {
  const [tableTexture, rugTexture] = useTexture([tableTextureImg, rugTextureImg])

  useEffect(() => {
    if (tableTexture) {
      tableTexture.wrapS = THREE.RepeatWrapping
      tableTexture.wrapT = THREE.RepeatWrapping
      tableTexture.repeat.set(8, 4)
      tableTexture.needsUpdate = true
    }
    if (rugTexture) {
      rugTexture.wrapS = THREE.RepeatWrapping
      rugTexture.wrapT = THREE.RepeatWrapping
      rugTexture.repeat.set(10, 6)
      rugTexture.needsUpdate = true
    }
  }, [tableTexture, rugTexture])

  return (
    <group position={[0, -0.38, -0.1]}>
      
      {/* --- DESK SURFACE (Double Layered) --- */}
      <group position={[0, 0.28, 0]}>
        {/* Layer 1: Solid Color Base */}
        <RoundedBox args={[3.0, 0.05, 1.2]} radius={0.02} smoothness={4} position={[0, 0, 0]} receiveShadow castShadow>
          <meshStandardMaterial color={DESK_COLORS.surfaceBase} roughness={0.2} />
        </RoundedBox>
        {/* Layer 2: Transparent Pattern Overlay (Nudged up slightly on Y to prevent z-fighting) */}
        <RoundedBox args={[3.0, 0.05, 1.2]} radius={0.02} smoothness={4} position={[0, 0.026, 0]} receiveShadow>
          <meshStandardMaterial 
            map={tableTexture} 
            transparent={true} 
            depthWrite={false}
            color={DESK_COLORS.surfacePattern} 
            roughness={0.2} 
          />
        </RoundedBox>
      </group>

      {/* Wooden Legs */}
      <mesh position={[-1.15, -0.12, 0.4]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.75]} />
        <meshStandardMaterial color={DESK_COLORS.legs} roughness={0.8} />
      </mesh>
      <mesh position={[1.15, -0.12, 0.4]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.75]} />
        <meshStandardMaterial color={DESK_COLORS.legs} roughness={0.8} />
      </mesh>
      <mesh position={[-1.15, -0.12, -0.4]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.75]} />
        <meshStandardMaterial color={DESK_COLORS.legs} roughness={0.8} />
      </mesh>
      <mesh position={[1.15, -0.12, -0.4]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.75]} />
        <meshStandardMaterial color={DESK_COLORS.legs} roughness={0.8} />
      </mesh>

      {/* Keyboard */}
      <RoundedBox args={[1, 0.025, 0.28]} radius={0.01} smoothness={2} position={[-0.06, 0.32, 0.38]}>
        <meshStandardMaterial color={DESK_COLORS.keyboard} roughness={0.4} />
      </RoundedBox>

      {/* --- LAYERED FLOOR RUG (Double Layered Inner Section) --- */}
      <group position={[0, -0.45, 0]}>
        {/* Outer Border Rug */}
        <RoundedBox args={[3.4, 0.02, 2.6]} radius={0.01} smoothness={4} receiveShadow>
          <meshLambertMaterial color={DESK_COLORS.rugOuter} />
        </RoundedBox>
        
        {/* Inner Rug Layer 1: Solid Color Base */}
        <RoundedBox args={[2.9, 0.02, 2.1]} radius={0.01} smoothness={4} position={[0, 0.01, 0]} receiveShadow>
          <meshLambertMaterial color={DESK_COLORS.rugInnerBase} />
        </RoundedBox>

        {/* Inner Rug Layer 2: Transparent Pattern Overlay (Nudged up slightly on Y) */}
        <RoundedBox args={[2.9, 0.02, 2.1]} radius={0.01} smoothness={4} position={[0, 0.021, 0]} receiveShadow>
          <meshStandardMaterial 
            map={rugTexture} 
            transparent={true} 
            depthWrite={false}
            color={DESK_COLORS.rugPatternColor} 
          />
        </RoundedBox>
      </group>
      
    </group>
  )
}