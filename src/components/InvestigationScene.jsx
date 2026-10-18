import { Suspense, useRef, useState } from 'react'
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

function PaperDocument({ loop, reducedMotion }) {
  const progress = Math.min(loop / 1.8, 1)
  const examine = Math.max(0, Math.min((loop - 1.45) / 2, 1))
  const group = useRef(null)

  useFrame((state) => {
    if (!group.current || reducedMotion) return
    const pointerX = state.pointer.x * 0.04
    const pointerY = state.pointer.y * 0.025
    group.current.rotation.z = -0.045 + pointerX
    group.current.rotation.x = pointerY
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
        <meshBasicMaterial color="#b94e35" transparent opacity={0.4 + examine * 0.6} />
      </mesh>
    </group>
  )
}

function MagnifyingGlass({ loop, reducedMotion }) {
  const group = useRef(null)

  useFrame((state) => {
    if (!group.current || reducedMotion) return
    const examine = Math.max(0, Math.min((loop - 1.1) / 2.7, 1))
    const drift = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.025
    group.current.position.x = 1.08 - examine * 0.62 + drift
    group.current.position.y = 0.74 - examine * 0.42
    group.current.rotation.z = -0.56 + examine * 0.2
  })

  const examine = Math.max(0, Math.min((loop - 1.1) / 2.7, 1))
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
        <meshPhysicalMaterial color="#dce6de" transparent opacity={0.16 + examine * 0.1} roughness={0.08} transmission={0.25} />
      </mesh>
    </group>
  )
}

function EvidenceMarker({ position, color, label, opacity }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.1, 18, 18]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.16} transparent opacity={opacity} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.14, 0.17, 24]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.35} />
      </mesh>
      <Html position={[0.2, 0.16, 0]} center distanceFactor={5} transform>
        <span className={`scene-tag ${color === '#b94e35' ? 'scene-tag-rust' : ''}`} style={{ opacity }}>
          {label}
        </span>
      </Html>
    </group>
  )
}

function PaperNishi({ loop, reducedMotion }) {
  const group = useRef(null)
  useFrame((state) => {
    if (!group.current || reducedMotion) return
    group.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.9) * 0.035
    group.current.rotation.y = -0.16 + state.pointer.x * 0.08
  })

  return (
    <Float speed={reducedMotion ? 0 : 1.15} rotationIntensity={0.04} floatIntensity={0.12}>
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
  const loopRef = useRef(0)
  const tickRef = useRef(-1)
  const [loop, setLoop] = useState(0)

  useFrame((state) => {
    const next = state.clock.getElapsedTime() % 8.4
    loopRef.current = next
    const tick = Math.floor(next * 8)
    if (tick !== tickRef.current) {
      tickRef.current = tick
      setLoop(next)
    }
  })

  const markerOpacity = Math.min(1, Math.max(0.14, (loop - 2.2) / 1.2))
  const sourceOpacity = Math.min(1, Math.max(0.1, (loop - 3.1) / 1.2))

  return (
    <>
      <color attach="background" args={["#202420"]} />
      <fog attach="fog" args={["#202420", 5.5, 10]} />
      <ambientLight intensity={1.35} color="#f4f1e9" />
      <directionalLight position={[-3, 5, 4]} intensity={3.2} color="#fff4dd" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[2, 1, 2]} intensity={7} distance={6} color="#b94e35" />
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

      <PaperDocument loop={loop} reducedMotion={reducedMotion} />
      <MagnifyingGlass loop={loop} reducedMotion={reducedMotion} />
      <EvidenceMarker position={[-0.62, -0.1, 0.5]} color="#a9b99b" label="SOURCE" opacity={sourceOpacity} />
      <EvidenceMarker position={[0.86, 0.34, 0.5]} color="#b94e35" label="CLAIM" opacity={markerOpacity} />
      <PaperNishi loop={loop} reducedMotion={reducedMotion} />
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

  if (!webgl) return <SceneFallback />

  return (
    <div className="scene-frame" aria-label="Interactive 3D evidence desk">
      <Canvas
        shadows
        dpr={reducedMotion ? 1 : [1, 1.5]}
        frameloop={reducedMotion ? 'demand' : 'always'}
        camera={{ position: [0, 0.2, 5.9], fov: 38 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={() => setWebgl(true)}
        fallback={<SceneFallback />}
      >
        <Suspense fallback={null}>
          <SceneWorld reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
      <div className="scene-caption"><span className="live-dot" /> Real-time evidence desk <span>•</span> loop 08.4s</div>
    </div>
  )
}
