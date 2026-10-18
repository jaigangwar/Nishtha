import React, { Component, Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Float, Html, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

function canUseWebGL() {
  if (typeof document === 'undefined') return true
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

class SceneErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    // Keep the failure local to the decorative scene. The investigation flow must remain usable.
    if (import.meta.env?.DEV) console.warn('Nishtha 3D scene fallback:', error)
  }

  render() {
    return this.state.hasError ? <SceneFallback /> : this.props.children
  }
}

const LOOP_SECONDS = 8.4

function loopProgress(elapsed) {
  const phase = (elapsed % LOOP_SECONDS) / LOOP_SECONDS
  return 0.5 - 0.5 * Math.cos(phase * Math.PI * 2)
}

function PaperDocument({ timeRef, reducedMotion }) {
  const group = useRef(null)
  const sweep = useRef(null)

  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return
    const progress = loopProgress(timeRef.current)
    const examine = THREE.MathUtils.smoothstep(progress, 0.25, 0.78)
    const pointerX = state.pointer.x * 0.04
    const pointerY = state.pointer.y * 0.025
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, -0.04 + progress * 0.15, 5, delta)
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, 0.82 + progress * 0.18, 5, delta))
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, -0.045 + pointerX, 6, delta)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, pointerY, 6, delta)
    if (sweep.current) {
      sweep.current.position.x = THREE.MathUtils.lerp(-0.92, 0.92, examine)
      sweep.current.material.opacity = 0.12 * Math.sin(examine * Math.PI)
    }
  })

  return (
    <group
      ref={group}
      position={[0.15, -0.04 + progress * 0.15, 0.28]}
      rotation={[0.04, -0.08, -0.045]}
      scale={0.82 + progress * 0.18}
    >
      <RoundedBox args={[2.55, 1.62, 0.055]} radius={0.055} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color="#f4f1e9" roughness={0.78} />
      </RoundedBox>
      <mesh position={[-0.72, 0.47, 0.044]}>
        <planeGeometry args={[0.64, 0.08]} />
        <meshBasicMaterial color="#69745a" />
      </mesh>
      <mesh position={[-0.82, 0.24, 0.044]}>
        <planeGeometry args={[0.86, 0.035]} />
        <meshBasicMaterial color="#b9b6a9" />
      </mesh>
      <mesh position={[-0.68, 0.06, 0.044]}>
        <planeGeometry args={[0.59, 0.035]} />
        <meshBasicMaterial color="#b9b6a9" />
      </mesh>
      <mesh position={[-0.6, -0.27, 0.044]}>
        <planeGeometry args={[0.74, 0.035]} />
        <meshBasicMaterial color="#b9b6a9" />
      </mesh>
      <mesh position={[0.67, -0.22, 0.047]} rotation={[0, 0, -0.25]}>
        <planeGeometry args={[0.54, 0.22]} />
        <meshBasicMaterial color="#d6dfc8" />
      </mesh>
      <Html position={[0.67, -0.22, 0.1]} center distanceFactor={5} transform>
        <span className="scene-stamp">OPEN QUESTION</span>
      </Html>
      <mesh position={[0.78, 0.4, 0.048]} rotation={[0, 0, -0.2]}>
        <planeGeometry args={[0.48, 0.04]} />
        <meshBasicMaterial color="#b94e35" transparent opacity={0.8} />
      </mesh>
      <mesh ref={sweep} position={[-0.92, 0, 0.071]}>
        <planeGeometry args={[0.025, 1.22]} />
        <meshBasicMaterial color="#b94e35" transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

function MagnifyingGlass({ timeRef, reducedMotion }) {
  const group = useRef(null)

  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return
    const examine = THREE.MathUtils.smoothstep(loopProgress(timeRef.current), 0.2, 0.82)
    const drift = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.025
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, 1.08 - examine * 0.62 + drift, 5, delta)
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, 0.74 - examine * 0.42, 5, delta)
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, -0.56 + examine * 0.2, 5, delta)
  })

  return (
    <group ref={group} position={[1.08, 0.74, 0.46]} rotation={[0, 0, -0.56]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.53, 0.055, 14, 48]} />
        <meshStandardMaterial color="#b94e35" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0.34, -0.42, 0]} rotation={[0, 0, -0.12]} castShadow>
        <cylinderGeometry args={[0.075, 0.105, 0.95, 12]} />
        <meshStandardMaterial color="#202420" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0, -0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.43, 32]} />
        <meshPhysicalMaterial color="#dce6de" transparent opacity={0.24} roughness={0.08} transmission={0.25} />
      </mesh>
    </group>
  )
}

function EvidenceMarker({ position, color, label, timeRef, start = 0.25, phase = 0, onClick, reducedMotion }) {
  const dot = useRef(null)
  const ring = useRef(null)

  useFrame(({ clock }) => {
    if (!dot.current || !ring.current || reducedMotion) return
    const visibility = THREE.MathUtils.smoothstep(loopProgress(timeRef.current), start, Math.min(start + 0.35, 1))
    const pulse = 0.5 + 0.5 * Math.sin(clock.getElapsedTime() * 1.05 + phase)
    dot.current.material.opacity = 0.18 + visibility * 0.82
    ring.current.material.opacity = visibility * (0.16 + pulse * 0.16)
    ring.current.scale.setScalar(1 + pulse * 0.12)
  })

  return (
    <group position={position} onClick={(event) => { event.stopPropagation(); onClick?.() }}>
      <mesh ref={dot} castShadow>
        <sphereGeometry args={[0.1, 18, 18]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.16} transparent opacity={0.2} />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.14, 0.17, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
      <Html position={[0.2, 0.16, 0]} center distanceFactor={5} transform>
        <span className={`scene-tag ${color === '#b94e35' ? 'scene-tag-rust' : ''}`}>
          {label}
        </span>
      </Html>
    </group>
  )
}

function PaperNishi({ reducedMotion }) {
  const group = useRef(null)
  useFrame((state) => {
    if (!group.current || reducedMotion) return
    group.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.9) * 0.035
    group.current.rotation.y = -0.16 + state.pointer.x * 0.08
  })

  return (
    <Float speed={reducedMotion ? 0 : 1.15} rotationIntensity={reducedMotion ? 0 : 0.04} floatIntensity={reducedMotion ? 0 : 0.12}>
      <group ref={group} position={[-1.52, -0.54, 0.48]} rotation={[0, -0.16, 0]}>
        <RoundedBox args={[0.58, 0.78, 0.26]} radius={0.12} smoothness={3} castShadow>
          <meshStandardMaterial color="#d6dfc8" roughness={0.78} />
        </RoundedBox>
        <mesh position={[-0.11, 0.08, 0.16]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#202420" />
        </mesh>
        <mesh position={[0.11, 0.08, 0.16]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#202420" />
        </mesh>
        <mesh position={[0, -0.02, 0.16]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.09, 0.018, 8, 20, Math.PI]} />
          <meshStandardMaterial color="#202420" />
        </mesh>
        <mesh position={[-0.35, 0.02, 0]} rotation={[0, 0, -0.55]}>
          <capsuleGeometry args={[0.035, 0.25, 5, 10]} />
          <meshStandardMaterial color="#d6dfc8" />
        </mesh>
        <mesh position={[0.35, 0.02, 0]} rotation={[0, 0, 0.55]}>
          <capsuleGeometry args={[0.035, 0.25, 5, 10]} />
          <meshStandardMaterial color="#d6dfc8" />
        </mesh>
      </group>
    </Float>
  )
}

function SceneWorld({ reducedMotion }) {
  const timeRef = useRef(0)
  const stage = useRef(null)
  const warmLight = useRef(null)
  const [activeMarker, setActiveMarker] = useState(null)

  useFrame((state, delta) => {
    timeRef.current = state.clock.getElapsedTime()
    if (stage.current && !reducedMotion) {
      stage.current.rotation.y = THREE.MathUtils.damp(stage.current.rotation.y, state.pointer.x * 0.018, 4, delta)
      stage.current.rotation.x = THREE.MathUtils.damp(stage.current.rotation.x, state.pointer.y * 0.012, 4, delta)
    }
    if (warmLight.current && !reducedMotion) {
      warmLight.current.intensity = 7 + Math.sin(state.clock.getElapsedTime() * 0.65) * 0.3
    }
  })

  return (
    <>
      <color attach="background" args={["#202420"]} />
      <fog attach="fog" args={["#202420", 5.5, 10]} />
      <ambientLight intensity={1.05} color="#f4f1e9" />
      <directionalLight position={[-3, 5, 4]} intensity={3.4} color="#fff4dd" castShadow shadow-mapSize={[512, 512]} />
      <pointLight ref={warmLight} position={[2, 1, 2]} intensity={7} distance={6} color="#b94e35" />
      <pointLight position={[-2, -1, 1]} intensity={4} distance={5} color="#a9b99b" />

      <mesh position={[0, -1.12, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#292d27" roughness={0.92} />
      </mesh>
      <mesh position={[0, -1.06, 0.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5.8, 3.75]} />
        <meshStandardMaterial color="#41463b" roughness={0.86} />
      </mesh>
      <mesh position={[-2.2, -0.84, -0.35]} rotation={[0.1, 0.1, -0.05]} castShadow>
        <boxGeometry args={[0.9, 0.08, 0.48]} />
        <meshStandardMaterial color="#b94e35" roughness={0.55} />
      </mesh>

      <group ref={stage}>
        <mesh position={[0, 0.24, -0.9]} rotation={[0, 0, -0.16]}>
          <torusGeometry args={[2.15, 0.012, 8, 64, Math.PI * 1.42]} />
          <meshBasicMaterial color="#a9b99b" transparent opacity={0.13} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.24, -0.86]} rotation={[0, 0, 0.18]}>
          <torusGeometry args={[1.7, 0.008, 8, 64, Math.PI * 1.2]} />
          <meshBasicMaterial color="#b94e35" transparent opacity={0.12} depthWrite={false} />
        </mesh>
        <PaperDocument timeRef={timeRef} reducedMotion={reducedMotion} />
        <MagnifyingGlass timeRef={timeRef} reducedMotion={reducedMotion} />
        <EvidenceMarker position={[-0.62, -0.1, 0.5]} color="#a9b99b" label="SOURCE" timeRef={timeRef} start={0.38} phase={0} reducedMotion={reducedMotion} onClick={() => setActiveMarker(activeMarker === 'SOURCE' ? null : 'SOURCE')} />
        <EvidenceMarker position={[0.86, 0.34, 0.5]} color="#b94e35" label="CLAIM" timeRef={timeRef} start={0.2} phase={Math.PI * 0.8} reducedMotion={reducedMotion} onClick={() => setActiveMarker(activeMarker === 'CLAIM' ? null : 'CLAIM')} />
        <PaperNishi reducedMotion={reducedMotion} />
        {activeMarker && <Html position={activeMarker === 'SOURCE' ? [-0.72, 0.5, 0.55] : [1.03, 0.58, 0.55]} center distanceFactor={5} transform><button className="scene-hotspot" onClick={(event) => { event.stopPropagation(); setActiveMarker(null) }}><strong>{activeMarker === 'SOURCE' ? 'SOURCE TRACE' : 'CLAIM SIGNAL'}</strong><span>{activeMarker === 'SOURCE' ? 'A path to follow, not proof.' : 'A promise needs its source.'}</span><i>×</i></button></Html>}
      </group>
      <ContactShadows position={[0, -1.02, 0]} opacity={0.62} scale={5.6} blur={2.8} far={2.7} />
    </>
  )
}

function SceneFallback() {
  return (
    <div className="scene-fallback" aria-label="A layered illustration of an evidence desk">
      <div className="fallback-orbit fallback-orbit-one" />
      <div className="fallback-document"><span>OPPORTUNITY<br /><strong>evidence ledger</strong></span><i>OPEN<br />QUESTION</i></div>
      <div className="fallback-lens" />
      <div className="fallback-pin fallback-pin-one">SOURCE</div>
      <div className="fallback-pin fallback-pin-two">CLAIM</div>
      <div className="fallback-nishi" aria-hidden="true"><b /><b /><em>⌣</em></div>
      <p>WebGL is unavailable, so the desk is shown as a still study.</p>
    </div>
  )
}

export function InvestigationScene({ reducedMotion = false }) {
  const [webgl, setWebgl] = useState(() => canUseWebGL())
  const frameRef = useRef(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!frameRef.current || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.05 })
    observer.observe(frameRef.current)
    return () => observer.disconnect()
  }, [])

  if (!webgl) return <SceneFallback />

  return (
    <div className="scene-frame" ref={frameRef} role="img" aria-labelledby="scene-description">
      <span id="scene-description" className="sr-only">Evidence desk illustration showing a document, magnifying glass, source marker, claim marker, and Nishi companion.</span>
      <SceneErrorBoundary>
        <Canvas
          shadows
          dpr={reducedMotion ? 1 : [1, 1.25]}
          frameloop={reducedMotion || !isVisible ? 'demand' : 'always'}
          camera={{ position: [0, 0.2, 5.9], fov: 38 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          onCreated={() => setWebgl(true)}
          fallback={<SceneFallback />}
        >
          <Suspense fallback={null}>
            <SceneWorld reducedMotion={reducedMotion} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
      <div className="scene-caption"><span className="live-dot" /> Live evidence desk <span>•</span> loop 08.4s</div>
      <div className="scene-interaction-hint"><span>click a marker</span><i>↗</i></div>
    </div>
  )
}
