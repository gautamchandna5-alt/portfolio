import { RoundedBox } from '@react-three/drei'

export default function Desk() {
  return (
    <group position={[0, -0.25, 0]}>
      {/* Desk Surface */}
      <RoundedBox args={[3.2, 0.12, 1.6]} radius={0.05} smoothness={4} position={[0, 0.5, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </RoundedBox>

      {/* Wooden Legs */}
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

      {/* Keyboard */}
      <RoundedBox args={[0.8, 0.025, 0.28]} radius={0.01} smoothness={2} position={[0.1, 0.58, 0.35]}>
        <meshStandardMaterial color="#e5e5e5" roughness={0.4} />
      </RoundedBox>

      {/* Layered Floor Rug - FIXED */}
      <group position={[0.2, -0.45, 0.4]}>
        {/* Base orange rug */}
        <RoundedBox args={[3.4, 0.02, 2.4]} radius={0.01} smoothness={4}>
          <meshStandardMaterial color="#f0a53b" roughness={0.8} />
        </RoundedBox>
        
        {/* Inner yellow rug */}
        <RoundedBox args={[2.9, 0.02, 1.9]} radius={0.01} smoothness={4} position={[0, 0.01, 0]}>
          <meshStandardMaterial color="#f7cf57" roughness={0.8} />
        </RoundedBox>
      </group>
    </group>
  )
}