import { Suspense, useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

import characterModel from '../../assets/hehhhhhh.glb'

// ============================================================================
// 1. CHOOSE WHICH PRELOADED STANDING ANIMATION FROM hehhhhhh.glb TO PLAY:
//    Options inside your GLB: 'idle' | 'wave' | 'contact-idle' | 't-idle'
// ============================================================================
const STANDING_ANIMATION: 'idle' | 'wave' | 'contact-idle' | 't-idle' = 'contact-idle'

// ============================================================================
// 2. SCREEN PLACEMENT CONFIG (Tweak X, Y, Scale, and Rotation here!)
//    - x: Negative = Left side of screen, 0 = Center, Positive = Right side
//    - y: Negative = Lower on screen, 0 = Center, Positive = Upper on screen
// ============================================================================
export const SCENE_POSITIONS = {
  heroDesktop: {
    x: 0.95,
    y: -0.05,
    z: -1.05,
    scale: 0.95
  },
  heroMobile: {
    x: -0.1,
    y: -0.68,
    z: -0.1,
    scale: 0.58
  },
  aboutDesktop: {
    x: -1.55,      // Left side of the screen on Desktop
    y: -0.58,      // Vertical height in About section
    z: 0.0,
    scale: 1.05,
    rotationY: 0.25 // Slight angle toward the Skills on the right
  },
  aboutMobile: {
    x: 0.0,        // Centered horizontally on Mobile
    y: 0.08,       // Stands in the top 60% of the screen on Mobile
    z: 0.0,
    scale: 0.82,
    rotationY: 0.0
  }
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

function AnimatedAvatar({ isStandingRef }: { isStandingRef: React.MutableRefObject<boolean> }) {
  const group = useRef<THREE.Group>(null)
  const currentAnimRef = useRef<'sitting' | 'standing'>('sitting')
  const normalizedRef = useRef(false)

  const { scene, animations } = useGLTF(characterModel)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    // Apply colors and shadows to the character meshes
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        child.frustumCulled = false

        const name = (child.name + ' ' + (child.material?.name || '')).toLowerCase()
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

    // Normalize the baked Blender room offset on hipsBone ONCE so that 'idle', 'wave',
    // and 'contact-idle' stand up in the exact same spot as 'left-desktop' instead of teleporting!
    // Normalize the baked Blender room offset...
    if (!normalizedRef.current && animations.length > 0) {
      const sitClip = animations.find((a: THREE.AnimationClip) => a.name === 'left-desktop')
      const sitPosTrack = sitClip?.tracks.find((t: THREE.KeyframeTrack) => t.name.endsWith('hipsBone.position'))
      const sitQuatTrack = sitClip?.tracks.find((t: THREE.KeyframeTrack) => t.name.endsWith('hipsBone.quaternion'))

      if (sitPosTrack && sitQuatTrack) {
        const sitX = sitPosTrack.values[0]
        const sitY = sitPosTrack.values[1]
        const sitZ = sitPosTrack.values[2]
        const sitQuat = new THREE.Quaternion(
          sitQuatTrack.values[0],
          sitQuatTrack.values[1],
          sitQuatTrack.values[2],
          sitQuatTrack.values[3]
        )

        ;['idle', 'wave', 'contact-idle', 't-idle'].forEach((clipName) => {
          const clip = animations.find((a: THREE.AnimationClip) => a.name === clipName)
          if (!clip) return

          const posTrack = clip.tracks.find((t: THREE.KeyframeTrack) => t.name.endsWith('hipsBone.position'))
          if (posTrack && posTrack.values.length >= 3) {
            // ... (keep the inside of this block exactly the same) ...
          }

          const quatTrack = clip.tracks.find((t: THREE.KeyframeTrack) => t.name.endsWith('hipsBone.quaternion'))
          if (quatTrack && quatTrack.values.length >= 4) {
            // ... (keep the inside of this block exactly the same) ...
          }
        })
      }
      normalizedRef.current = true
    }
    // Start with the preloaded sitting animation
    const sitAction = actions['left-desktop']
    if (sitAction) {
      sitAction.reset().fadeIn(0.3).play()
    }

    return () => {
      sitAction?.fadeOut(0.3)
    }
  }, [scene, animations, actions])

  // Switch between preloaded GLB animations inside useFrame via ref (NO React re-renders!)
  useFrame((_, delta) => {
    const wantStanding = isStandingRef.current
    const sitAction = actions['left-desktop']
    const standAction = actions[STANDING_ANIMATION] || actions['idle']

    if (wantStanding && currentAnimRef.current !== 'standing') {
      currentAnimRef.current = 'standing'
      sitAction?.fadeOut(0.4)
      standAction?.reset().fadeIn(0.4).play()
    } else if (!wantStanding && currentAnimRef.current !== 'sitting') {
      currentAnimRef.current = 'sitting'
      standAction?.fadeOut(0.4)
      sitAction?.reset().fadeIn(0.4).play()
    }

    // Smoothly adjust local Y/Z offset between sitting in chair (-0.53) and standing on floor (-0.12)
    if (group.current) {
      const targetLocalY = wantStanding ? -0.12 : -0.53
      const targetLocalZ = wantStanding ? -0.1 : -0.3
      const dt = Math.min(delta, 0.05)
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetLocalY, 6, dt)
      group.current.position.z = THREE.MathUtils.damp(group.current.position.z, targetLocalZ, 6, dt)
    }
  })

  return (
    <group
      ref={group}
      position={[0, -0.53, -0.3]}
      rotation={[0, -Math.PI / 2, 0]}
      scale={0.47}
      dispose={null}
    >
      <primitive object={scene} />
    </group>
  )
}

export default function Character() {
  const avatarPivotRef = useRef<THREE.Group>(null)
  const isStandingRef = useRef(false)
  const smoothScroll = useRef(0)
  const { size } = useThree()

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const isMobile = size.width < 768
    const vh = window.innerHeight || 1
    const scrollY = window.scrollY

    // Scroll progress from Hero (0) to About (1)
    const rawProgress = THREE.MathUtils.clamp(scrollY / vh, 0, 1)
    smoothScroll.current = THREE.MathUtils.damp(smoothScroll.current, rawProgress, 7, dt)
    const u = smoothScroll.current

    // Trigger the GLB standing animation as soon as the user scrolls past 22% of Hero
    isStandingRef.current = rawProgress > 0.22

    // 1. Swivel 180° with the chair toward the screen (0.0 -> 0.35)
    const swivel = smoothstep(0.0, 0.35, u)
    // 2. Glide from the chair to the About section position (0.22 -> 0.92)
    const moveToAbout = smoothstep(0.22, 0.92, u)

    const heroCfg = isMobile ? SCENE_POSITIONS.heroMobile : SCENE_POSITIONS.heroDesktop
    const aboutCfg = isMobile ? SCENE_POSITIONS.aboutMobile : SCENE_POSITIONS.aboutDesktop

    // Chair seat starting position in world space
    const vHeight = 2 * 8.2 * Math.tan((28 * Math.PI) / 360)
    const heroScrollUpY = (scrollY / vh) * vHeight * 1.35 * (1 - moveToAbout)

    const startX = heroCfg.x
    const startY = heroCfg.y - 0.25 * heroCfg.scale + heroScrollUpY
    const startZ = heroCfg.z + 1.0 * heroCfg.scale

    if (avatarPivotRef.current) {
      avatarPivotRef.current.position.set(
        THREE.MathUtils.lerp(startX, aboutCfg.x, moveToAbout),
        THREE.MathUtils.lerp(startY, aboutCfg.y, moveToAbout),
        THREE.MathUtils.lerp(startZ, aboutCfg.z, moveToAbout)
      )

      // Rotates 180° (Math.PI) to face the screen, plus optional side angle in About
      avatarPivotRef.current.rotation.y = swivel * Math.PI + aboutCfg.rotationY * moveToAbout

      const currentScale = THREE.MathUtils.lerp(heroCfg.scale, aboutCfg.scale, moveToAbout)
      avatarPivotRef.current.scale.setScalar(currentScale)
    }
  })

  return (
    <group ref={avatarPivotRef}>
      <Suspense fallback={null}>
        <AnimatedAvatar isStandingRef={isStandingRef} />
      </Suspense>
    </group>
  )
}

useGLTF.preload(characterModel)