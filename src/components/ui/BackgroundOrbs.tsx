import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface OrbData {
  x: number
  y: number
  vx: number
  vy: number
  baseSpeed: number
  radius: number
  boundsX: number
  boundsY: number
  seed: number
  palette: [string, string, string]
}

const soapBubbleVertexShader = /* glsl */ `
  varying vec3 vNormalView;
  varying vec3 vViewPosition;

  void main() {
    vNormalView = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const soapBubbleFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform vec3 uColorLight;
  uniform vec3 uColorMid;
  uniform vec3 uColorDeep;

  varying vec3 vNormalView;
  varying vec3 vViewPosition;

  // Fast 2-wave organic noise for smooth pastel marbling
  float pastelFlowNoise(vec3 p) {
    return 0.5 * (
      sin(p.x * 2.2 + p.y * 1.9 + p.z * 1.5) +
      cos(p.y * 2.5 - p.x * 2.1 + p.z * 1.8)
    );
  }

  vec3 getBubblePastel(float t) {
    float w1 = 0.5 + 0.5 * sin(t * 6.2831853);
    float w2 = 0.5 + 0.5 * cos(t * 4.3982297 + 1.2);
    vec3 blend = mix(uColorMid, uColorDeep, w1);
    return mix(blend, uColorLight, w2 * 0.65);
  }

  void main() {
    vec3 N = normalize(vNormalView);
    vec3 V = normalize(vViewPosition);

    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 right = normalize(cross(up, V));
    vec3 OrthoUp = cross(V, right);

    vec2 uv = vec2(dot(N, right), dot(N, OrthoUp));
    float r2 = clamp(dot(uv, uv), 0.0, 1.0);
    float r = sqrt(r2);
    float nz = sqrt(max(0.0, 1.0 - r2));
    float angle = atan(uv.y, uv.x);

    vec3 samplePos = vec3(uv * 1.5, nz * 1.3) + vec3(uSeed * 3.1, uSeed * 5.7, uSeed * 2.3);
    float t = uTime * 0.28;

    float wave1 = pastelFlowNoise(samplePos + vec3(t, -t * 0.7, t * 0.5));
    float wave2 = pastelFlowNoise(samplePos * 1.6 + vec3(wave1 - t * 0.5, wave1 + t * 0.6, -t));

    float colorPhase = wave1 * 0.55 + wave2 * 0.45 + (uv.x + uv.y) * 0.25 + uSeed;
    vec3 primaryPastel = getBubblePastel(colorPhase);
    vec3 secondaryPastel = getBubblePastel(colorPhase + 0.42);

    float marbleMask = 0.5 + 0.5 * sin(wave1 * 3.14159 + wave2 * 2.0);
    vec3 bodyPastel = mix(primaryPastel, secondaryPastel, marbleMask);
    float evenBodyCoverage = mix(0.76, 0.95, 0.5 + 0.5 * wave2);

    float ultraThinOutline = smoothstep(0.93, 0.985, r);
    float fresnelRim = r2 * r * smoothstep(0.50, 0.98, r);
    float rimWave = 0.70 + 0.30 * wave1;

    float hlAngle1 = smoothstep(0.52, 0.94, cos(angle - 2.38));
    float hlRad1 = smoothstep(0.56, 0.74, r) * (1.0 - smoothstep(0.76, 0.87, r));
    float mainWindowHighlight = (hlAngle1 * hlRad1) * 0.95;

    float catchlight1 = smoothstep(0.90, 0.985, cos(angle - 1.92))
                      * smoothstep(0.60, 0.71, r) * (1.0 - smoothstep(0.71, 0.81, r)) * 0.75;

    float hlAngle2 = smoothstep(0.42, 0.92, cos(angle + 0.82));
    float hlRad2 = smoothstep(0.64, 0.80, r) * (1.0 - smoothstep(0.81, 0.92, r));
    float backWallReflection = hlAngle2 * hlRad2 * 0.78;

    float bottomCrescent = smoothstep(0.55, 0.95, cos(angle + 1.52))
                         * smoothstep(0.82, 0.94, r) * (1.0 - smoothstep(0.95, 0.995, r)) * 0.85;

    vec3 rimColor = mix(uColorDeep, uColorLight, 0.45);
    vec3 highlightTint = mix(vec3(1.0), uColorLight, 0.20);

    float wRim = ultraThinOutline * 0.95 + fresnelRim * 0.65 * rimWave + bottomCrescent * 0.80;
    float wBody = evenBodyCoverage * 0.85;
    float wHighlight = mainWindowHighlight + catchlight1 + backWallReflection;

    float totalWeight = max(wRim + wBody + wHighlight, 0.0001);
    vec3 finalColor = (rimColor * wRim + bodyPastel * wBody + highlightTint * wHighlight) / totalWeight;
    finalColor = clamp(finalColor * 1.05 + vec3(wHighlight * 0.25), 0.0, 1.0);

    float alpha = clamp(
      wBody * 0.68 +
      ultraThinOutline * 0.85 +
      fresnelRim * 0.42 * rimWave +
      bottomCrescent * 0.60 +
      wHighlight * 0.92,
      0.0,
      0.94
    );

    gl_FragColor = vec4(finalColor, alpha);
  }
`

export default function BackgroundOrbs() {
  const orb1Ref = useRef<THREE.Mesh>(null!)
  const orb2Ref = useRef<THREE.Mesh>(null!)
  const orb3Ref = useRef<THREE.Mesh>(null!)
  const orb4Ref = useRef<THREE.Mesh>(null!)
  const orb5Ref = useRef<THREE.Mesh>(null!)
  const orb6Ref = useRef<THREE.Mesh>(null!)

  const orbsData = useRef<OrbData[]>([
    {
      x: -4.8, y: 2.2, vx: 0.75, vy: 0.55, baseSpeed: 0.9, radius: 0.85, boundsX: 6.8, boundsY: 3.4, seed: 0.35,
      palette: ['#FFF0E5', '#FFB88C', '#FF8E53']
    },
    {
      x: 4.6, y: -1.8, vx: -0.68, vy: 0.52, baseSpeed: 0.85, radius: 1.2, boundsX: 6.5, boundsY: 3.2, seed: 1.75,
      palette: ['#F4EBFF', '#C8A2FF', '#9B6BFF']
    },
    {
      x: -2.0, y: -2.6, vx: 0.65, vy: -0.72, baseSpeed: 0.95, radius: 0.75, boundsX: 6.9, boundsY: 3.5, seed: 3.15,
      palette: ['#E6FFF5', '#94F0C8', '#4CD69B']
    },
    {
      x: 3.8, y: 2.4, vx: -0.72, vy: -0.58, baseSpeed: 0.9, radius: 0.95, boundsX: 6.7, boundsY: 3.4, seed: 4.55,
      palette: ['#FFEBF2', '#FF9EBB', '#FF6B98']
    },
    {
      x: -5.6, y: -1.0, vx: 0.82, vy: 0.64, baseSpeed: 1.0, radius: 0.65, boundsX: 7.0, boundsY: 3.6, seed: 5.95,
      palette: ['#E8F6FF', '#94D2FF', '#52B2FF']
    },
    {
      x: 1.0, y: 2.8, vx: -0.64, vy: -0.70, baseSpeed: 0.88, radius: 1.0, boundsX: 6.6, boundsY: 3.3, seed: 7.35,
      palette: ['#FFFDE6', '#FFE680', '#FFBD4A']
    }
  ])

  const materials = useMemo(() => {
    return orbsData.current.map((orb) =>
      new THREE.ShaderMaterial({
        vertexShader: soapBubbleVertexShader,
        fragmentShader: soapBubbleFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uSeed: { value: orb.seed },
          uColorLight: { value: new THREE.Color(orb.palette[0]) },
          uColorMid: { value: new THREE.Color(orb.palette[1]) },
          uColorDeep: { value: new THREE.Color(orb.palette[2]) }
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
        side: THREE.FrontSide
      })
    )
  }, [])

  useFrame(({ clock }, delta) => {
    const data = orbsData.current
    const refs = [orb1Ref, orb2Ref, orb3Ref, orb4Ref, orb5Ref, orb6Ref]
    const elapsed = clock.getElapsedTime()
    const dt = Math.min(delta, 0.05)

    data.forEach((orb, idx) => {
      const floatForceX = Math.sin(elapsed * 0.7 + orb.seed * 2.0) * 0.18
      const floatForceY = Math.cos(elapsed * 0.55 + orb.seed * 1.5) * 0.18

      orb.vx += floatForceX * dt
      orb.vy += floatForceY * dt

      const currentSpeed = Math.hypot(orb.vx, orb.vy)
      if (currentSpeed > 0.001) {
        const speedScale = THREE.MathUtils.lerp(currentSpeed, orb.baseSpeed, dt * 1.5) / currentSpeed
        orb.vx *= speedScale
        orb.vy *= speedScale
      }

      orb.x += orb.vx * dt
      orb.y += orb.vy * dt

      if (orb.x > orb.boundsX) {
        orb.x = orb.boundsX
        orb.vx = -Math.abs(orb.vx)
      } else if (orb.x < -orb.boundsX) {
        orb.x = -orb.boundsX
        orb.vx = Math.abs(orb.vx)
      }

      if (orb.y > orb.boundsY) {
        orb.y = orb.boundsY
        orb.vy = -Math.abs(orb.vy)
      } else if (orb.y < -orb.boundsY) {
        orb.y = -orb.boundsY
        orb.vy = Math.abs(orb.vy)
      }

      materials[idx].uniforms.uTime.value = elapsed
    })

    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        const orb1 = data[i]
        const orb2 = data[j]

        const dx = orb2.x - orb1.x
        const dy = orb2.y - orb1.y
        const distance = Math.hypot(dx, dy)
        const minDist = orb1.radius + orb2.radius

        if (distance < minDist && distance > 0.0001) {
          const nx = dx / distance
          const ny = dy / distance
          const overlap = minDist - distance

          const m1 = orb1.radius * orb1.radius
          const m2 = orb2.radius * orb2.radius
          const totalMass = m1 + m2

          orb1.x -= nx * overlap * (m2 / totalMass)
          orb1.y -= ny * overlap * (m2 / totalMass)
          orb2.x += nx * overlap * (m1 / totalMass)
          orb2.y += ny * overlap * (m1 / totalMass)

          const rvx = orb2.vx - orb1.vx
          const rvy = orb2.vy - orb1.vy
          const velAlongNormal = rvx * nx + rvy * ny

          if (velAlongNormal < 0) {
            const restitution = 0.92
            const impulse = (-(1 + restitution) * velAlongNormal) / (1 / m1 + 1 / m2)

            orb1.vx -= (impulse / m1) * nx
            orb1.vy -= (impulse / m1) * ny
            orb2.vx += (impulse / m2) * nx
            orb2.vy += (impulse / m2) * ny
          }
        }
      }
    }

    refs.forEach((ref, index) => {
      const mesh = ref.current
      if (!mesh) return
      const orb = data[index]

      mesh.position.x = orb.x
      mesh.position.y = orb.y

      const wobble = Math.sin(elapsed * 2.2 + orb.seed * 3.0) * 0.025
      mesh.scale.set(1 + wobble, 1 - wobble, 1)
    })
  })

  return (
    <group key="pastel-monochrome-soap-bubbles">
      <mesh ref={orb1Ref} material={materials[0]}>
        <sphereGeometry args={[0.85, 32, 32]} />
      </mesh>
      <mesh ref={orb2Ref} material={materials[1]}>
        <sphereGeometry args={[1.2, 32, 32]} />
      </mesh>
      <mesh ref={orb3Ref} material={materials[2]}>
        <sphereGeometry args={[0.75, 32, 32]} />
      </mesh>
      <mesh ref={orb4Ref} material={materials[3]}>
        <sphereGeometry args={[0.95, 32, 32]} />
      </mesh>
      <mesh ref={orb5Ref} material={materials[4]}>
        <sphereGeometry args={[0.65, 32, 32]} />
      </mesh>
      <mesh ref={orb6Ref} material={materials[5]}>
        <sphereGeometry args={[1.0, 32, 32]} />
      </mesh>
    </group>
  )
}