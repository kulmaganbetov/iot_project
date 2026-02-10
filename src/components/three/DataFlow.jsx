/**
 * DataFlow.jsx
 * -------------
 * Draws animated data-flow lines between every device and the central router.
 *
 * Props:
 *   devices         - Array of device objects; each must have a `position` field
 *   routerPosition  - [x, y, z] of the router / hub (default [0, 1.2, 0])
 *   protocolEnabled - Boolean; toggles visual style:
 *       enabled  => bright green animated lines with flowing particles
 *       disabled => dim gray dashed lines (no particles)
 *
 * Technique:
 *   Each flow line is a set of small spheres ("data packets") that travel
 *   from the device toward the router and back. The dashed-line effect is
 *   created with Three.js LineDashedMaterial and an animated dashOffset.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const PACKET_COUNT = 4; // data-packet spheres per line
const PACKET_SIZE = 0.025;
const ACTIVE_COLOR = new THREE.Color('#00ff88');
const INACTIVE_COLOR = new THREE.Color('#1a2a3a');
const LINE_ACTIVE_COLOR = '#00cc66';
const LINE_INACTIVE_COLOR = '#1a2a3a';

/* -------------------------------------------------------------------------- */
/*  Single flow line between a device and the router                          */
/* -------------------------------------------------------------------------- */

function FlowLine({ from, to, active, deviceId }) {
  const lineRef = useRef();
  const packetsRef = useRef([]);

  // Build BufferGeometry for a straight line
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...from),
      new THREE.Vector3(...to),
    ]);
    // computeLineDistances is required for dashed material to work
    geo.computeLineDistances();
    return geo;
  }, [from, to]);

  // Direction and length for particle animation
  const { dir, len } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const d = b.clone().sub(a);
    return { dir: d.clone().normalize(), len: d.length() };
  }, [from, to]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Animate dash offset to create flowing-line illusion
    if (lineRef.current) {
      lineRef.current.material.dashOffset = active ? -t * 1.5 : -t * 0.2;
      lineRef.current.material.opacity = active ? 0.6 : 0.15;
    }

    // Animate data-packet spheres along the path
    if (active) {
      packetsRef.current.forEach((mesh, i) => {
        if (!mesh) return;
        // Offset each packet evenly along the path; use sin for back-and-forth
        const idHash = (typeof deviceId === 'number' ? deviceId : 0) * 0.37;
        const phase = (t * 0.8 + i / PACKET_COUNT + idHash) % 1;
        const pos = new THREE.Vector3(...from).addScaledVector(dir, phase * len);
        mesh.position.copy(pos);

        // Brightness pulse at midpoint
        const brightness = 0.4 + Math.sin(phase * Math.PI) * 0.6;
        mesh.material.opacity = brightness;
        mesh.visible = true;
      });
    } else {
      // Hide packets when protocol is off
      packetsRef.current.forEach((mesh) => {
        if (mesh) mesh.visible = false;
      });
    }
  });

  return (
    <group>
      {/* Dashed line */}
      <line_ ref={lineRef} geometry={geometry}>
        <lineDashedMaterial
          color={active ? LINE_ACTIVE_COLOR : LINE_INACTIVE_COLOR}
          transparent
          opacity={active ? 0.6 : 0.15}
          dashSize={0.15}
          gapSize={0.1}
          linewidth={1}
        />
      </line_>

      {/* Data-packet spheres */}
      {Array.from({ length: PACKET_COUNT }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            packetsRef.current[i] = el;
          }}
          visible={false}
        >
          <sphereGeometry args={[PACKET_SIZE, 6, 6]} />
          <meshBasicMaterial
            color={active ? ACTIVE_COLOR : INACTIVE_COLOR}
            transparent
            opacity={0.7}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Alternate approach: use primitive lines so it works in all R3F versions   */
/* -------------------------------------------------------------------------- */

function FlowLinePrimitive({ from, to, active, deviceId }) {
  const groupRef = useRef();
  const packetsRef = useRef([]);
  const lineObjRef = useRef();

  // Build a THREE.Line manually and attach it
  const lineObj = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...from),
      new THREE.Vector3(...to),
    ]);
    geo.computeLineDistances();

    const mat = new THREE.LineDashedMaterial({
      color: active ? LINE_ACTIVE_COLOR : LINE_INACTIVE_COLOR,
      transparent: true,
      opacity: active ? 0.6 : 0.15,
      dashSize: 0.15,
      gapSize: 0.1,
    });

    const line = new THREE.Line(geo, mat);
    return line;
  }, [from, to, active]);

  // Keep a ref for frame updates
  useMemo(() => {
    lineObjRef.current = lineObj;
  }, [lineObj]);

  // Direction and length for particle animation
  const { dir, len } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const d = b.clone().sub(a);
    return { dir: d.clone().normalize(), len: d.length() };
  }, [from, to]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Animate dash offset
    if (lineObjRef.current) {
      lineObjRef.current.material.dashOffset = active ? -t * 1.5 : -t * 0.2;
      lineObjRef.current.material.opacity = active ? 0.6 : 0.15;
      lineObjRef.current.material.color.set(active ? LINE_ACTIVE_COLOR : LINE_INACTIVE_COLOR);
    }

    // Animate data-packet spheres
    if (active) {
      packetsRef.current.forEach((mesh, i) => {
        if (!mesh) return;
        const idHash = (typeof deviceId === 'number' ? deviceId : 0) * 0.37;
        const phase = (t * 0.8 + i / PACKET_COUNT + idHash) % 1;
        const pos = new THREE.Vector3(...from).addScaledVector(dir, phase * len);
        mesh.position.copy(pos);
        const brightness = 0.4 + Math.sin(phase * Math.PI) * 0.6;
        mesh.material.opacity = brightness;
        mesh.visible = true;
      });
    } else {
      packetsRef.current.forEach((mesh) => {
        if (mesh) mesh.visible = false;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Attach the THREE.Line as a primitive */}
      <primitive object={lineObj} />

      {/* Data-packet spheres */}
      {Array.from({ length: PACKET_COUNT }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            packetsRef.current[i] = el;
          }}
          visible={false}
        >
          <sphereGeometry args={[PACKET_SIZE, 6, 6]} />
          <meshBasicMaterial
            color={active ? ACTIVE_COLOR : INACTIVE_COLOR}
            transparent
            opacity={0.7}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main DataFlow export                                                      */
/* -------------------------------------------------------------------------- */

export default function DataFlow({
  devices = [],
  routerPosition = [0, 1.2, 0],
  protocolEnabled = false,
}) {
  return (
    <group>
      {devices.map((device) => {
        // Skip drawing a line from the router to itself
        if (device.type === 'router') return null;
        if (!device.position) return null;

        return (
          <FlowLinePrimitive
            key={`flow-${device.id}`}
            from={device.position}
            to={routerPosition}
            active={protocolEnabled}
            deviceId={device.id}
          />
        );
      })}
    </group>
  );
}
