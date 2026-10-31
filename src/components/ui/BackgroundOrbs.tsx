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
  palette: [string, string, string] // [Light Tint, Mid Pastel, Deep Pastel Accent]
}

const soapBubbleVertexShader = /* glsl */ `
  varying vec3 vNormalView;
  varying vec3 vViewPosition;
  varying vec3 vObjectNormal;

  void main() {
    vNormalView = normalize(normalMatrix * normal);
    vObjectNormal = normalize(normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vec4 mvPosition = viewMatrix * worldPosition;
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
  varying vec3 vObjectNormal;

  // Seamless 3D organic wave field so colors spread evenly across the whole sphere without seams
  float pastelFlowNoise(vec3 p) {
    return (
      sin(p.x * 2.2 + cos(p.y * 2.5 + p.z * 1.8)) +
      sin(p.y * 2.6 + cos(p.z * 2.1 - p.x * 2.3)) +
      cos(p.z * 2.4 + sin(p.x * 2.7 + p.y * 2.0))
    ) / 3.0; // Range: [-1.0, 1.0]
  }

  // Smoothly cycles between the 3 shades of this bubble's dedicated pastel palette
  vec3 getBubblePastel(float t) {
    float w1 = 0.5 + 0.5 * sin(t * 6.2831853);
    float w2 = 0.5 + 0.5 * cos(t * 6.2831853 * 0.7 + 1.2);
    vec3 blend = mix(uColorMid, uColorDeep, w1);
    return mix(blend, uColorLight, w2 * 0.65);
  }

  void main() {
    vec3 N = normalize(vNormalView);
    vec3 V = normalize(vViewPosition);

    // Perspective-correct 2D sphere coordinates (keeps edge bubbles perfectly round)
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 right = normalize(cross(up, V));
    vec3 OrthoUp = cross(V, right);

    vec2 uv = vec2(dot(N, right), dot(N, OrthoUp));
    float r = clamp(length(uv), 0.0, 1.0);
    float nz = sqrt(max(0.0, 1.0 - r * r)); // 1.0 at center, 0.0 at silhouette rim
    float angle = atan(uv.y, uv.x);

    // -------------------------------------------------------------------------
    // 1. EVEN, SEAMLESS PASTEL DISTRIBUTION THROUGHOUT THE ENTIRE BUBBLE
    // -------------------------------------------------------------------------
    vec3 seedOffset = vec3(
      sin(uSeed * 11.3) * 5.0,
      cos(uSeed * 23.7) * 5.0,
      sin(uSeed * 17.1) * 5.0
    );

    // Use 3D sphere coordinates (uv.x, uv.y, nz) so color flows smoothly across the middle
    vec3 samplePos = vec3(uv * 1.5, nz * 1.3) + seedOffset;
    float t = uTime * 0.28;

    float wave1 = pastelFlowNoise(samplePos + vec3(t, -t * 0.7, t * 0.5));
    float wave2 = pastelFlowNoise(samplePos * 1.65 + vec3(wave1 * 1.3 - t * 0.5, wave1 * 1.1 + t * 0.6, -t));

    // Phase driven purely by 3D waves & smooth cartesian coordinates (NO atan seam!)
    float colorPhase = wave1 * 0.55
                     + wave2 * 0.45
                     + (uv.x * cos(uSeed) + uv.y * sin(uSeed)) * 0.35
                     + uSeed;

    vec3 primaryPastel   = getBubblePastel(colorPhase);
    vec3 secondaryPastel = getBubblePastel(colorPhase + 0.42);

    // Smooth organic marbled blend across the whole surface
    float marbleMask = 0.5 + 0.5 * sin(wave1 * 3.14159 + wave2 * 2.0);
    vec3 bodyPastel  = mix(primaryPastel, secondaryPastel, marbleMask);

    // Even interior coverage: keeps the center lush and colored (75% to 95% strength everywhere)
    float evenBodyCoverage = mix(0.76, 0.95, 0.5 + 0.5 * wave2);

    // -------------------------------------------------------------------------
    // 2. GLASSY 3D PASTEL RIM
    // -------------------------------------------------------------------------
    float ultraThinOutline = smoothstep(0.93, 0.985, r);
    float fresnelRim       = pow(r, 2.6) * smoothstep(0.50, 0.98, r);
    float rimWave          = 0.70 + 0.30 * wave1;

    // -------------------------------------------------------------------------
    // 3. GLOSSY CURVED WINDOW REFLECTIONS (All multiplication '*' fixed!)
    // -------------------------------------------------------------------------
    // Top-left studio window arc
    float hlAngle1 = smoothstep(0.52, 0.94, cos(angle - 2.38));
    float hlRad1   = smoothstep(0.56, 0.74, r) * (1.0 - smoothstep(0.76, 0.87, r));
    float mainWindowHighlight = pow(hlAngle1 * hlRad1, 1.2) * 0.95;

    // Secondary crisp catchlight
    float catchlight1 = smoothstep(0.90, 0.985, cos(angle - 1.92))
                      * smoothstep(0.60, 0.71, r) * (1.0 - smoothstep(0.71, 0.81, r)) * 0.75;

    // Bottom-right concave internal wall reflection
    float hlAngle2 = smoothstep(0.42, 0.92, cos(angle + 0.82));
    float hlRad2   = smoothstep(0.64, 0.80, r) * (1.0 - smoothstep(0.81, 0.92, r));
    float backWallReflection = hlAngle2 * hlRad2 * 0.78;

    // Soft bottom rim glow crescent
    float bottomCrescent = smoothstep(0.55, 0.95, cos(angle + 1.52))
                         * smoothstep(0.82, 0.94, r) * (1.0 - smoothstep(0.95, 0.995, r)) * 0.85;

    // -------------------------------------------------------------------------
    // 4. COMPOSITE COLOR & ALPHA
    // -------------------------------------------------------------------------
    vec3 rimColor      = mix(uColorDeep, uColorLight, 0.45);
    vec3 highlightTint = mix(vec3(1.0), uColorLight, 0.20);

    float wRim       = ultraThinOutline * 0.95 + fresnelRim * 0.65 * rimWave + bottomCrescent * 0.80;
    float wBody      = evenBodyCoverage * 0.85;
    float wHighlight = mainWindowHighlight + catchlight1 + backWallReflection;

    float totalWeight = max(wRim + wBody + wHighlight, 0.0001);
    vec3 finalColor = (
      rimColor * wRim +
      bodyPastel * wBody +
      highlightTint * wHighlight
    ) / totalWeight;

    // Subtle specular pop for a glossy soap-bubble finish
    finalColor = clamp(finalColor * 1.05 + vec3(wHighlight * 0.25), 0.0, 1.0);

    // Even, milky-glass pastel opacity across both center and edges
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

  // Each bubble has its own dedicated single-hue Pastel Palette: [Light, Mid, Deep]
  const orbsData = useRef<OrbData[]>([
    {
      // 1. Pastel Peach / Apricot Orange
      x: -4.8, y: 2.2, vx: 0.75, vy: 0.55, baseSpeed: 0.9, radius: 0.85, boundsX: 6.8, boundsY: 3.4, seed: 0.35,
      palette: ['#FFF0E5', '#ffcbaa', '#ffb688']
    },
    {
      // 2. Pastel Lavender / Lilac Purple
      x: 4.6, y: -1.8, vx: -0.68, vy: 0.52, baseSpeed: 0.85, radius: 1.2, boundsX: 6.5, boundsY: 3.2, seed: 1.75,
      palette: ['#F4EBFF', '#dcc3fe', '#b799f7']
    },
    {
      // 3. Pastel Mint / Seafoam Green
      x: -2.0, y: -2.6, vx: 0.65, vy: -0.72, baseSpeed: 0.95, radius: 0.75, boundsX: 6.9, boundsY: 3.5, seed: 3.15,
      palette: ['#E6FFF5', '#94F0C8', '#4CD69B']
    },
    {
      // 4. Pastel Rose / Cotton-Candy Pink
      x: 3.8, y: 2.4, vx: -0.72, vy: -0.58, baseSpeed: 0.9, radius: 0.95, boundsX: 6.7, boundsY: 3.4, seed: 4.55,
      palette: ['#FFEBF2', '#FF9EBB', '#FF6B98']
    },
    {
      // 5. Pastel Periwinkle / Sky Blue
      x: -5.6, y: -1.0, vx: 0.82, vy: 0.64, baseSpeed: 1.0, radius: 0.65, boundsX: 7.0, boundsY: 3.6, seed: 5.95,
      palette: ['#E8F6FF', '#94D2FF', '#52B2FF']
    },
    {
      // 6. Pastel Buttercup / Warm Lemon Yellow
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

    // Clamp delta so switching browser tabs never causes bubbles to teleport off-screen
    const dt = Math.min(delta, 0.05)

    // 1. Update positions with buoyant air-current drift + safe boundary bounce
    data.forEach((orb, idx) => {
      // Gentle sinusoidal updraft & sway so bubbles float organically instead of moving in robotic straight lines
      const floatForceX = Math.sin(elapsed * 0.7 + orb.seed * 2.0) * 0.18
      const floatForceY = Math.cos(elapsed * 0.55 + orb.seed * 1.5) * 0.18

      orb.vx += floatForceX * dt
      orb.vy += floatForceY * dt

      // Smoothly regulate speed back toward each bubble's natural cruising speed
      const currentSpeed = Math.hypot(orb.vx, orb.vy)
      if (currentSpeed > 0.001) {
        const targetSpeed = orb.baseSpeed
        const speedScale = THREE.MathUtils.lerp(currentSpeed, targetSpeed, dt * 1.5) / currentSpeed
        orb.vx *= speedScale
        orb.vy *= speedScale
      }

      orb.x += orb.vx * dt
      orb.y += orb.vy * dt

      // Clamp position inside bounds BEFORE reversing velocity so bubbles never get stuck vibrating in a wall
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

    // 2. Mass-aware, soft-repulsion bubble-to-bubble collisions
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

          // Mass proportional to bubble surface area (r^2)
          const m1 = orb1.radius * orb1.radius
          const m2 = orb2.radius * orb2.radius
          const totalMass = m1 + m2

          // Push apart proportionally to mass (smaller bubbles move more than larger ones)
          orb1.x -= nx * overlap * (m2 / totalMass)
          orb1.y -= ny * overlap * (m2 / totalMass)
          orb2.x += nx * overlap * (m1 / totalMass)
          orb2.y += ny * overlap * (m1 / totalMass)

          // Relative velocity along collision normal
          const rvx = orb2.vx - orb1.vx
          const rvy = orb2.vy - orb1.vy
          const velAlongNormal = rvx * nx + rvy * ny

          // Only resolve if bubbles are moving toward each other
          if (velAlongNormal < 0) {
            const restitution = 0.92 // Bouncy, cushioned soap-bubble elasticity
            const impulse = (-(1 + restitution) * velAlongNormal) / (1 / m1 + 1 / m2)

            orb1.vx -= (impulse / m1) * nx
            orb1.vy -= (impulse / m1) * ny
            orb2.vx += (impulse / m2) * nx
            orb2.vy += (impulse / m2) * ny
          }
        }
      }
    }

    // 3. Apply positions + subtle 3D squash/wobble on the meshes
    refs.forEach((ref, index) => {
      const mesh = ref.current
      if (!mesh) return
      const orb = data[index]

      mesh.position.x = orb.x
      mesh.position.y = orb.y

      // Subtle organic soap-bubble breathing deform
      const wobble = Math.sin(elapsed * 2.2 + orb.seed * 3.0) * 0.025
      mesh.scale.set(1 + wobble, 1 - wobble, 1)
    })
  })

  return (
    <group key="pastel-monochrome-soap-bubbles">
      <mesh ref={orb1Ref} material={materials[0]}>
        <sphereGeometry args={[0.85, 64, 64]} />
      </mesh>
      <mesh ref={orb2Ref} material={materials[1]}>
        <sphereGeometry args={[1.2, 64, 64]} />
      </mesh>
      <mesh ref={orb3Ref} material={materials[2]}>
        <sphereGeometry args={[0.75, 64, 64]} />
      </mesh>
      <mesh ref={orb4Ref} material={materials[3]}>
        <sphereGeometry args={[0.95, 64, 64]} />
      </mesh>
      <mesh ref={orb5Ref} material={materials[4]}>
        <sphereGeometry args={[0.65, 64, 64]} />
      </mesh>
      <mesh ref={orb6Ref} material={materials[5]}>
        <sphereGeometry args={[1.0, 64, 64]} />
      </mesh>
    </group>
  )
}