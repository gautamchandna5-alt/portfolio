import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, RenderTexture, OrthographicCamera } from '@react-three/drei'
import * as THREE from 'three'

function DynamicCode() {
  const linesRef = useRef<THREE.Group[]>([])
  const colors = ['#c678dd', '#98c379', '#e5c07b', '#61afef', '#abb2bf', '#d19a66']

  const initialLines = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => {
      const numSegments = Math.floor(Math.random() * 3) + 1
      const segments = []
      let currentX = 0

      for (let j = 0; j < numSegments; j++) {
        const width = 0.15 + Math.random() * 0.25
        segments.push({
          color: colors[Math.floor(Math.random() * colors.length)],
          width: width,
          x: currentX + width / 2
        })
        currentX += width + (0.03 + Math.random() * 0.05)
      }
      return { y: -0.6 + i * 0.08, segments }
    })
  }, [])

  useFrame(({ clock }, delta) => {
    // Stop updating code lines when user has scrolled past the Hero section
    if (window.scrollY > window.innerHeight * 0.8) return

    const time = clock.getElapsedTime()
    const burst = Math.max(0, Math.sin(time * 2.5) * Math.cos(time * 1.5))
    const currentSpeed = 0.04 + burst * 0.4

    linesRef.current.forEach((line) => {
      if (!line) return
      line.position.y += delta * currentSpeed

      if (line.position.y > 0.6) {
        line.position.y -= 24 * 0.08
      }
    })
  })

  return (
    <group position={[-0.4, 0, 0]}>
      {initialLines.map((line, i) => (
        <group
          key={i}
          position={[0, line.y, 0]}
          ref={(el) => {
            if (el) linesRef.current[i] = el
          }}
        >
          {line.segments.map((seg, j) => (
            <mesh key={j} position={[seg.x, 0, 0]}>
              <planeGeometry args={[seg.width, 0.022]} />
              <meshBasicMaterial color={seg.color} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function EditorSidebar() {
  return (
    <group>
      <mesh position={[-0.58, 0, 0]}>
        <planeGeometry args={[0.25, 0.94]} />
        <meshBasicMaterial color="#21252b" />
      </mesh>
      <mesh position={[-0.58, 0.35, 0.01]}>
        <planeGeometry args={[0.15, 0.02]} />
        <meshBasicMaterial color="#abb2bf" />
      </mesh>
      <mesh position={[-0.58, 0.28, 0.01]}>
        <planeGeometry args={[0.12, 0.02]} />
        <meshBasicMaterial color="#5c6370" />
      </mesh>
      <mesh position={[-0.58, 0.21, 0.01]}>
        <planeGeometry args={[0.18, 0.02]} />
        <meshBasicMaterial color="#5c6370" />
      </mesh>
    </group>
  )
}

function DiscordStatic() {
  const onlineUser = useMemo(() => Math.floor(Math.random() * 2), [])
  const serverPing = useMemo(() => Math.floor(Math.random() * 3), [])

  return (
    <group>
      <mesh position={[-0.58, 0, 0]}>
        <planeGeometry args={[0.15, 0.89]} />
        <meshBasicMaterial color="#202225" />
      </mesh>

      <group position={[-0.58, 0.3, 0.01]}>
        <mesh>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#5865F2" />
        </mesh>
        <mesh position={[0.028, -0.028, 0.01]}>
          <circleGeometry args={[0.012, 12]} />
          <meshBasicMaterial color="#23a559" />
        </mesh>
      </group>

      <group position={[-0.58, 0.15, 0.01]}>
        <mesh>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#4f545c" />
        </mesh>
        {(serverPing === 0 || serverPing === 2) && (
          <mesh position={[0.028, 0.028, 0.01]}>
            <circleGeometry args={[0.012, 12]} />
            <meshBasicMaterial color="#ed4245" />
          </mesh>
        )}
      </group>

      <group position={[-0.58, 0.0, 0.01]}>
        <mesh>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#4f545c" />
        </mesh>
        {(serverPing === 1 || serverPing === 2) && (
          <mesh position={[0.028, 0.028, 0.01]}>
            <circleGeometry args={[0.012, 12]} />
            <meshBasicMaterial color="#ed4245" />
          </mesh>
        )}
      </group>

      <mesh position={[-0.32, 0, 0]}>
        <planeGeometry args={[0.3, 0.89]} />
        <meshBasicMaterial color="#2f3136" />
      </mesh>
      <mesh position={[-0.32, 0.3, 0.01]}>
        <planeGeometry args={[0.2, 0.03]} />
        <meshBasicMaterial color="#8e9297" />
      </mesh>
      <mesh position={[-0.32, 0.2, 0.01]}>
        <planeGeometry args={[0.15, 0.03]} />
        <meshBasicMaterial color="#4f545c" />
      </mesh>
      <mesh position={[-0.32, 0.1, 0.01]}>
        <planeGeometry args={[0.18, 0.03]} />
        <meshBasicMaterial color="#4f545c" />
      </mesh>

      <group position={[0.1, 0.05, 0]}>
        <group position={[-0.05, 0.25, 0]}>
          <mesh>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial color="#faa61a" />
          </mesh>
          {onlineUser === 0 && (
            <mesh position={[0.028, -0.028, 0.01]}>
              <circleGeometry args={[0.012, 12]} />
              <meshBasicMaterial color="#23a559" />
            </mesh>
          )}
        </group>
        <mesh position={[0.2, 0.27, 0]}>
          <planeGeometry args={[0.3, 0.03]} />
          <meshBasicMaterial color="#dcddde" />
        </mesh>
        <mesh position={[0.3, 0.21, 0]}>
          <planeGeometry args={[0.5, 0.03]} />
          <meshBasicMaterial color="#b9bbbe" />
        </mesh>

        <group position={[-0.05, 0.0, 0]}>
          <mesh>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial color="#3ba55c" />
          </mesh>
          {onlineUser === 1 && (
            <mesh position={[0.028, -0.028, 0.01]}>
              <circleGeometry args={[0.012, 12]} />
              <meshBasicMaterial color="#23a559" />
            </mesh>
          )}
        </group>
        <mesh position={[0.15, 0.02, 0]}>
          <planeGeometry args={[0.2, 0.03]} />
          <meshBasicMaterial color="#dcddde" />
        </mesh>
        <mesh position={[0.25, -0.04, 0]}>
          <planeGeometry args={[0.4, 0.03]} />
          <meshBasicMaterial color="#b9bbbe" />
        </mesh>
      </group>

      <mesh position={[0.22, -0.35, 0]}>
        <planeGeometry args={[0.7, 0.08]} />
        <meshBasicMaterial color="#40444b" />
      </mesh>
    </group>
  )
}

const MONITOR_COLORS = {
  frame: '#faedcd',
  screenBg: '#36393f',
  stand: '#faedcd'
}

export default function Monitors() {
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    if (window.scrollY > window.innerHeight * 0.8) return
    if (lightRef.current) {
      const t = clock.getElapsedTime()
      lightRef.current.intensity = 1.8 + Math.sin(t * 8) * 0.4 + Math.sin(t * 19) * 0.2
    }
  })

  return (
    <group position={[0.2, 0.59, -0.2]}>
      {/* Primary Monitor (Right Side) - Capped at 256x256 offscreen resolution */}
      <group position={[0.6, 0, 0]} rotation={[0, -0.2, 0]}>
        <RoundedBox args={[1.5, 1.0, 0.03]} radius={0.015} smoothness={2}>
          <meshLambertMaterial color={MONITOR_COLORS.frame} />
        </RoundedBox>
        <mesh position={[0, 0, 0.016]}>
          <planeGeometry args={[1.44, 0.94]} />
          <meshBasicMaterial>
            <RenderTexture attach="map" width={256} height={256} anisotropy={2}>
              <color attach="background" args={[MONITOR_COLORS.screenBg]} />
              <OrthographicCamera
                makeDefault
                manual
                left={-1.44 / 2}
                right={1.44 / 2}
                top={0.94 / 2}
                bottom={-0.94 / 2}
                near={0.1}
                far={10}
                position={[0, 0, 1]}
              />
              <EditorSidebar />
              <DynamicCode />
            </RenderTexture>
          </meshBasicMaterial>
        </mesh>
        <mesh position={[0, -0.45, -0.05]}>
          <cylinderGeometry args={[0.04, 0.04, 0.36, 16]} />
          <meshLambertMaterial color={MONITOR_COLORS.stand} />
        </mesh>
        <mesh position={[0, -0.63, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 24]} />
          <meshLambertMaterial color={MONITOR_COLORS.stand} />
        </mesh>
      </group>

      {/* Secondary Monitor (Left Side) - frames={1} renders the static Discord UI ONCE instead of 60fps! */}
      <group position={[-0.9, 0, 0.15]} rotation={[0, 0.35, 0]}>
        <RoundedBox args={[1.4, 0.95, 0.03]} radius={0.015} smoothness={2}>
          <meshLambertMaterial color={MONITOR_COLORS.frame} />
        </RoundedBox>
        <mesh position={[0, 0, 0.016]}>
          <planeGeometry args={[1.34, 0.89]} />
          <meshBasicMaterial>
            <RenderTexture attach="map" frames={1} width={256} height={256}>
              <color attach="background" args={[MONITOR_COLORS.screenBg]} />
              <OrthographicCamera
                makeDefault
                manual
                left={-1.34 / 2}
                right={1.34 / 2}
                top={0.89 / 2}
                bottom={-0.89 / 2}
                near={0.1}
                far={10}
                position={[0, 0, 1]}
              />
              <DiscordStatic />
            </RenderTexture>
          </meshBasicMaterial>
        </mesh>
        <mesh position={[0, -0.45, -0.05]}>
          <cylinderGeometry args={[0.04, 0.04, 0.36, 16]} />
          <meshLambertMaterial color={MONITOR_COLORS.stand} />
        </mesh>
        <mesh position={[0, -0.63, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 24]} />
          <meshLambertMaterial color={MONITOR_COLORS.stand} />
        </mesh>
      </group>

      <pointLight ref={lightRef} position={[0, 0.2, 0.9]} color="#b9bbbe" distance={3.5} decay={2} />
    </group>
  )
}