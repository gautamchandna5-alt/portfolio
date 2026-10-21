import { RoundedBox } from '@react-three/drei'

const DESK_COLORS = {
  surface: '#ffffff',
  legs: '#b88358',
  keyboard: '#e5e5e5',
  rugOuter: '#aa0022',
  rugInner: '#ff0033'
}

export default function Desk() {
  return (
    <group position={[0, -0.38, -0.1]}>
      
      {/* Desk Surface - Lowered Y position to 0.28 */}
      <RoundedBox args={[3.0, 0.05, 1.2]} radius={0.02} smoothness={4} position={[0, 0.28, 0]} receiveShadow castShadow>
        <meshStandardMaterial color={DESK_COLORS.surface} roughness={0.2} />
      </RoundedBox>

      {/* Wooden Legs - Shortened height to 0.65 */}
      <mesh position={[-1.15, -0.12, 0.4]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.65]} />
        <meshStandardMaterial color={DESK_COLORS.legs} roughness={0.8} />
      </mesh>
      <mesh position={[1.15, -0.12, 0.4]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.65]} />
        <meshStandardMaterial color={DESK_COLORS.legs} roughness={0.8} />
      </mesh>
      <mesh position={[-1.15, -0.12, -0.4]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.65]} />
        <meshStandardMaterial color={DESK_COLORS.legs} roughness={0.8} />
      </mesh>
      <mesh position={[1.15, -0.12, -0.4]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.65]} />
        <meshStandardMaterial color={DESK_COLORS.legs} roughness={0.8} />
      </mesh>

      {/* Keyboard - Lowered to match the new desk height (0.32) */}
      <RoundedBox args={[1, 0.025, 0.28]} radius={0.01} smoothness={2} position={[-0.06, 0.32, 0.38]}>
        <meshStandardMaterial color={DESK_COLORS.keyboard} roughness={0.4} />
      </RoundedBox>

      {/* Layered Floor Rug */}
      <group position={[0, -0.45, 0]}>
        <RoundedBox args={[3.4, 0.02, 2.4]} radius={0.01} smoothness={4} receiveShadow>
          <meshLambertMaterial color={DESK_COLORS.rugOuter} />
        </RoundedBox>
        <RoundedBox args={[2.9, 0.02, 1.9]} radius={0.01} smoothness={4} position={[0, 0.01, 0]} receiveShadow>
          <meshLambertMaterial color={DESK_COLORS.rugInner} />
        </RoundedBox>
      </group>
      
    </group>
  )
}