/**
 * AttackBeam.jsx
 * ---------------
 * Visual attack beam that travels from an attacker origin to a target device.
 *
 * Props:
 *   from    - [x, y, z] origin of the attack
 *   to      - [x, y, z] target device position
 *   color   - CSS colour string for the beam (default '#ff3366')
 *   blocked - Boolean; when true the beam hits a shield near the device and
 *             scatters with a green flash instead of reaching the target
 *
 * Visual components:
 *   1. Animated tube/line beam with a pulsing dash effect
 *   2. Small spheres (particles) that flow along the beam path
 *   3. When blocked: a shield disc near the target that flashes green,
 *      and the beam terminates early
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const PARTICLE_COUNT = 8;
const BEAM_RADIUS = 0.025;
const SHIELD_RADIUS = 0.4;

/* -------------------------------------------------------------------------- */
/*  Flowing particles along the beam path                                     */
/* -------------------------------------------------------------------------- */

function BeamParticles({ from, to, color, count, speed }) {
  const refs = useRef([]);

  // Direction vector and length
  const { dir, len } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const d = new THREE.Vector3().subVectors(b, a);
    return { dir: d.clone().normalize(), len: d.length() };
  }, [from, to]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      // Each particle is offset evenly, loops along [0..1]
      const progress = ((t * speed + i / count) % 1);
      const pos = new THREE.Vector3(...from).addScaledVector(dir, progress * len);
      mesh.position.copy(pos);
      // Fade near endpoints
      const fade = Math.sin(progress * Math.PI);
      mesh.scale.setScalar(0.6 + fade * 0.5);
      mesh.material.opacity = 0.35 + fade * 0.65;
    });
  });

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Shield impact effect (shown when beam is blocked)                         */
/* -------------------------------------------------------------------------- */

function ShieldImpact({ position }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    // Pulsing scale + opacity
    const pulse = 0.8 + Math.sin(t * 8) * 0.25;
    ref.current.scale.setScalar(pulse);
    ref.current.material.opacity = 0.35 + Math.sin(t * 6) * 0.25;
  });

  return (
    <group position={position}>
      {/* Green flash sphere */}
      <mesh ref={ref}>
        <sphereGeometry args={[SHIELD_RADIUS, 16, 16]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Small scatter sparks around the impact */}
      <ScatterSparks position={[0, 0, 0]} />

      {/* Point light for the flash */}
      <pointLight color="#00ff88" intensity={1.5} distance={3} />
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scatter sparks - small spheres that orbit the impact point                */
/* -------------------------------------------------------------------------- */

function ScatterSparks({ position }) {
  const groupRef = useRef();
  const sparkCount = 6;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const angle = (i / sparkCount) * Math.PI * 2 + t * 4;
      const r = 0.3 + Math.sin(t * 6 + i) * 0.15;
      child.position.set(
        Math.cos(angle) * r,
        Math.sin(t * 5 + i * 1.2) * 0.2,
        Math.sin(angle) * r,
      );
      child.material.opacity = 0.4 + Math.sin(t * 8 + i) * 0.3;
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {Array.from({ length: sparkCount }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.03, 4, 4]} />
          <meshBasicMaterial color="#00ffaa" transparent opacity={0.6} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Beam tube mesh with animated dash                                         */
/* -------------------------------------------------------------------------- */

function BeamTube({ from, to, color, blocked }) {
  const meshRef = useRef();

  // Build a TubeGeometry along a straight line between from -> endpoint
  const { geometry, endpoint } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);

    // If blocked, the beam stops 0.5 units short of the target (at the shield)
    const ep = blocked
      ? a.clone().lerp(b, 0.85)
      : b.clone();

    const path = new THREE.LineCurve3(a, ep);
    const geo = new THREE.TubeGeometry(path, 32, BEAM_RADIUS, 8, false);

    return { geometry: geo, endpoint: ep };
  }, [from, to, blocked]);

  // Animate emissive intensity for pulsing
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const pulse = 0.5 + Math.sin(t * (blocked ? 4 : 8)) * 0.5;
    meshRef.current.material.emissiveIntensity = pulse;
    meshRef.current.material.opacity = 0.3 + pulse * 0.4;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.6}
        toneMapped={false}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main AttackBeam export                                                    */
/* -------------------------------------------------------------------------- */

export default function AttackBeam({
  from = [0, 4, -8],
  to = [0, 1, 0],
  color = '#ff3366',
  blocked = false,
}) {
  // Shield impact position: 85% of the way along the beam
  const shieldPos = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    return a.lerp(b, 0.85).toArray();
  }, [from, to]);

  return (
    <group>
      {/* Core beam tube */}
      <BeamTube from={from} to={to} color={blocked ? '#ff6644' : color} blocked={blocked} />

      {/* Flowing particles along the beam */}
      <BeamParticles
        from={from}
        to={blocked ? shieldPos : to}
        color={blocked ? '#ff6644' : color}
        count={PARTICLE_COUNT}
        speed={blocked ? 0.6 : 1.0}
      />

      {/* Outer glow beam (wider, more transparent) */}
      <BeamTube
        from={from}
        to={to}
        color={blocked ? '#ff8844' : color}
        blocked={blocked}
      />

      {/* Shield impact effect when beam is blocked */}
      {blocked && <ShieldImpact position={shieldPos} />}

      {/* Point light at beam origin for glow */}
      <pointLight
        position={from}
        color={color}
        intensity={0.8}
        distance={4}
      />
    </group>
  );
}
