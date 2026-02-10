/**
 * HouseModel.jsx
 * ---------------
 * Procedural 3D house built entirely from basic Three.js geometries.
 * No external GLTF / OBJ models required.
 *
 * Visual style:
 *   - Semi-transparent physical-material walls (transmission) so the
 *     interior devices are visible
 *   - A wireframe overlay on every surface for a cyber/hacker aesthetic
 *   - Glowing edge outlines via EdgesGeometry + LineSegments
 *   - Dark blue/gray base colours with a bright cyber-blue (#00aaff) edge glow
 *
 * Approximate dimensions: 6 (x) x 3 (y) x 5 (z) units.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Edges } from '@react-three/drei';

/* -------------------------------------------------------------------------- */
/*  Shared materials                                                          */
/* -------------------------------------------------------------------------- */

/** Semi-transparent wall panel */
const WALL_MATERIAL_PROPS = {
  color: '#0a1628',
  transparent: true,
  opacity: 0.18,
  roughness: 0.3,
  metalness: 0.6,
  side: THREE.DoubleSide,
};

/** Wireframe overlay that sits on top of every surface */
const WIREFRAME_PROPS = {
  color: '#0055aa',
  transparent: true,
  opacity: 0.12,
  wireframe: true,
  side: THREE.DoubleSide,
};

/** Glowing edge colour */
const EDGE_COLOR = '#00ccff';

/* -------------------------------------------------------------------------- */
/*  Reusable panel component (wall / floor / roof slab)                       */
/* -------------------------------------------------------------------------- */

function Panel({ args, position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Solid semi-transparent face */}
      <mesh>
        <boxGeometry args={args} />
        <meshPhysicalMaterial {...WALL_MATERIAL_PROPS} />
        {/* Glowing edges via drei helper */}
        <Edges scale={1} threshold={15} color={EDGE_COLOR} lineWidth={1.2} />
      </mesh>

      {/* Wireframe overlay for cyber look */}
      <mesh>
        <boxGeometry args={args} />
        <meshBasicMaterial {...WIREFRAME_PROPS} />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Roof component – two sloped planes forming a pitched roof                 */
/* -------------------------------------------------------------------------- */

function Roof({ width, depth, peakHeight, baseY }) {
  // Roof is two rectangular planes angled inward to form a ridge
  const halfWidth = width / 2;
  const slopeLength = Math.sqrt(halfWidth * halfWidth + peakHeight * peakHeight);
  const angle = Math.atan2(peakHeight, halfWidth);

  return (
    <group position={[0, baseY, 0]}>
      {/* Left slope */}
      <Panel
        args={[slopeLength, 0.06, depth]}
        position={[-halfWidth / 2, peakHeight / 2, 0]}
        rotation={[0, 0, angle]}
      />
      {/* Right slope */}
      <Panel
        args={[slopeLength, 0.06, depth]}
        position={[halfWidth / 2, peakHeight / 2, 0]}
        rotation={[0, 0, -angle]}
      />

      {/* Ridge beam – glowing line along the top */}
      <mesh position={[0, peakHeight, 0]}>
        <boxGeometry args={[0.06, 0.06, depth]} />
        <meshBasicMaterial color={EDGE_COLOR} />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  GlowingFrame – subtle vertical / horizontal edge beams at wall corners    */
/* -------------------------------------------------------------------------- */

function GlowingFrame({ width, height, depth }) {
  const hw = width / 2;
  const hd = depth / 2;
  const beamSize = 0.04;
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: EDGE_COLOR }), []);

  // 4 vertical corner pillars + 4 horizontal base edges + 4 horizontal top edges
  const pillars = [
    [-hw, height / 2, -hd],
    [hw, height / 2, -hd],
    [-hw, height / 2, hd],
    [hw, height / 2, hd],
  ];

  const hBarsBottom = [
    [0, 0, -hd, width],
    [0, 0, hd, width],
    [-hw, 0, 0, depth, true],
    [hw, 0, 0, depth, true],
  ];

  const hBarsTop = hBarsBottom.map(([x, , z, len, rotated]) => [x, height, z, len, rotated]);

  return (
    <group>
      {/* Vertical corner pillars */}
      {pillars.map(([x, y, z], i) => (
        <mesh key={`vp-${i}`} position={[x, y, z]} material={mat}>
          <boxGeometry args={[beamSize, height, beamSize]} />
        </mesh>
      ))}

      {/* Horizontal edges (bottom + top) */}
      {[...hBarsBottom, ...hBarsTop].map(([x, y, z, len, rotated], i) => (
        <mesh
          key={`hb-${i}`}
          position={[x, y, z]}
          rotation={rotated ? [0, Math.PI / 2, 0] : [0, 0, 0]}
          material={mat}
        >
          <boxGeometry args={[len, beamSize, beamSize]} />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main HouseModel export                                                    */
/* -------------------------------------------------------------------------- */

export default function HouseModel({ position = [0, 0, 0] }) {
  const groupRef = useRef();

  // House dimensions
  const W = 6; // width  (x)
  const H = 3; // height (y)
  const D = 5; // depth  (z)
  const wallThickness = 0.06;

  // Gentle idle animation – very slow breathing scale
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      groupRef.current.scale.setScalar(1 + Math.sin(t * 0.4) * 0.003);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* ---- Floor -------------------------------------------------------- */}
      <Panel args={[W, wallThickness, D]} position={[0, 0, 0]} rotation={[0, 0, 0]} />

      {/* ---- Walls -------------------------------------------------------- */}
      {/* Front wall (z = +D/2) */}
      <Panel
        args={[W, H, wallThickness]}
        position={[0, H / 2, D / 2]}
        rotation={[0, 0, 0]}
      />
      {/* Back wall (z = -D/2) */}
      <Panel
        args={[W, H, wallThickness]}
        position={[0, H / 2, -D / 2]}
        rotation={[0, 0, 0]}
      />
      {/* Left wall (x = -W/2) */}
      <Panel
        args={[wallThickness, H, D]}
        position={[-W / 2, H / 2, 0]}
        rotation={[0, 0, 0]}
      />
      {/* Right wall (x = +W/2) */}
      <Panel
        args={[wallThickness, H, D]}
        position={[W / 2, H / 2, 0]}
        rotation={[0, 0, 0]}
      />

      {/* ---- Roof --------------------------------------------------------- */}
      <Roof width={W + 0.6} depth={D + 0.6} peakHeight={1.2} baseY={H} />

      {/* ---- Glowing structural frame ------------------------------------- */}
      <GlowingFrame width={W} height={H} depth={D} />
    </group>
  );
}
