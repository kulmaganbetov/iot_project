/**
 * ProtocolShield.jsx
 * -------------------
 * Visual shield dome rendered around the smart home when the security
 * protocol is enabled.
 *
 * Props:
 *   enabled  - Boolean; toggles visibility and animation
 *   position - [x, y, z] centre of the dome (typically centre of the house)
 *
 * Visual style:
 *   - Semi-transparent dome (sphere, top hemisphere only) around the house
 *   - Hexagonal wireframe pattern via an IcosahedronGeometry wireframe overlay
 *   - Gentle pulsing animation on opacity and scale
 *   - Colour shifts from cyber-blue (#00aaff) to green (#00ff88)
 *   - When disabled the entire group is invisible (no rendering cost)
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const DOME_RADIUS = 4.8;
const DOME_DETAIL = 3; // icosahedron subdivision level -- gives hex-like facets
const COLOR_BLUE = new THREE.Color('#00aaff');
const COLOR_GREEN = new THREE.Color('#00ff88');

/* -------------------------------------------------------------------------- */
/*  HexGrid wireframe overlay                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Renders a wireframe icosahedron with matching radius to create the
 * hexagonal-panel look on the shield surface.
 */
function HexOverlay({ radius, detail, opacity }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // Slow counter-rotation for visual interest
    ref.current.rotation.y = clock.getElapsedTime() * 0.05;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[radius, detail]} />
      <meshBasicMaterial
        color="#00ddff"
        wireframe
        transparent
        opacity={opacity}
        toneMapped={false}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*  Inner glow sphere (slightly smaller, additive feel)                       */
/* -------------------------------------------------------------------------- */

function InnerGlow({ radius, color, opacity }) {
  return (
    <mesh>
      <sphereGeometry args={[radius * 0.96, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity * 0.3}
        side={THREE.BackSide}
        toneMapped={false}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*  Animated ring at the base of the dome                                     */
/* -------------------------------------------------------------------------- */

function BaseRing({ radius }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.material.opacity = 0.25 + Math.sin(t * 2) * 0.15;
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <ringGeometry args={[radius - 0.08, radius + 0.08, 64]} />
      <meshBasicMaterial
        color="#00ffaa"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main ProtocolShield export                                                */
/* -------------------------------------------------------------------------- */

export default function ProtocolShield({
  enabled = false,
  position = [0, 0, 0],
}) {
  const groupRef = useRef();
  const domeMaterialRef = useRef();
  const hexOverlayRef = useRef();

  // Interpolation colour target – memoised so we don't re-create each frame
  const lerpColor = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    // ---- Visibility & activation animation ----
    // We keep the group mounted but fade in/out so we get a smooth transition.
    const target = enabled ? 1 : 0;
    const current = groupRef.current.userData.activation ?? 0;
    const next = THREE.MathUtils.lerp(current, target, 0.04);
    groupRef.current.userData.activation = next;

    // Hide entirely when fully faded out (saves draw calls)
    groupRef.current.visible = next > 0.005;
    if (!groupRef.current.visible) return;

    const t = clock.getElapsedTime();

    // ---- Pulsing scale ----
    const pulse = 1 + Math.sin(t * 1.2) * 0.015;
    const scale = pulse * (0.7 + next * 0.3); // shrink to 70% when deactivating
    groupRef.current.scale.setScalar(scale);

    // ---- Colour oscillation (blue <-> green) ----
    const blend = (Math.sin(t * 0.6) + 1) / 2; // 0..1
    lerpColor.copy(COLOR_BLUE).lerp(COLOR_GREEN, blend);

    // Update dome material
    if (domeMaterialRef.current) {
      domeMaterialRef.current.color.copy(lerpColor);
      domeMaterialRef.current.opacity = (0.08 + Math.sin(t * 1.5) * 0.04) * next;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* ---- Main dome (upper hemisphere) --------------------------------- */}
      <mesh>
        {/* phiStart=0, phiLength=2PI, thetaStart=0, thetaLength=PI/2 => top half */}
        <sphereGeometry args={[DOME_RADIUS, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          ref={domeMaterialRef}
          color={COLOR_BLUE}
          transparent
          opacity={0.1}
          roughness={0.2}
          metalness={0.1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* ---- Hexagonal wireframe overlay ---------------------------------- */}
      <HexOverlay
        radius={DOME_RADIUS + 0.02}
        detail={DOME_DETAIL}
        opacity={0.12}
      />

      {/* ---- Inner glow --------------------------------------------------- */}
      <InnerGlow radius={DOME_RADIUS} color={COLOR_GREEN} opacity={0.15} />

      {/* ---- Base ring on the ground -------------------------------------- */}
      <BaseRing radius={DOME_RADIUS} />

      {/* ---- Ambient point light inside the dome -------------------------- */}
      <pointLight color="#00ddff" intensity={0.4} distance={DOME_RADIUS * 1.5} />
    </group>
  );
}
