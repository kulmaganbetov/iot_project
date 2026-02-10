/**
 * DataFlow.jsx
 * -------------
 * Draws animated data-flow lines between every device and the central router.
 * Uses only simple spheres as "data packets" to avoid THREE.Line / primitive issues.
 *
 * Props:
 *   devices         - Array of device objects; each must have a `position` field
 *   routerPosition  - [x, y, z] of the router / hub (default [0, 1.2, 0])
 *   protocolEnabled - Boolean; toggles visual style
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Line } from '@react-three/drei';

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const PACKET_COUNT = 4;
const PACKET_SIZE = 0.025;

/* -------------------------------------------------------------------------- */
/*  Single flow line using drei Line (no primitive object swap issues)        */
/* -------------------------------------------------------------------------- */

function FlowLine({ from, to, active, deviceId }) {
  const packetsRef = useRef([]);

  const points = useMemo(
    () => [new THREE.Vector3(...from), new THREE.Vector3(...to)],
    [from, to]
  );

  // Direction and length for particle animation
  const { dir, len } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const d = b.clone().sub(a);
    return { dir: d.clone().normalize(), len: d.length() };
  }, [from, to]);

  // Compute a stable numeric hash from the device id string
  const idHash = useMemo(() => {
    return String(deviceId || '').split('').reduce((s, c) => s + c.charCodeAt(0), 0) * 0.037;
  }, [deviceId]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Animate data-packet spheres along the path
    packetsRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      if (active) {
        const phase = (t * 0.8 + i / PACKET_COUNT + idHash) % 1;
        const pos = new THREE.Vector3(...from).addScaledVector(dir, phase * len);
        mesh.position.copy(pos);
        const brightness = 0.4 + Math.sin(phase * Math.PI) * 0.6;
        mesh.material.opacity = brightness;
        mesh.material.color.setStyle('#00ff88');
        mesh.visible = true;
      } else {
        mesh.visible = false;
      }
    });
  });

  return (
    <group>
      {/* Static line using drei Line — safe re-render */}
      <Line
        points={points}
        color={active ? '#00cc66' : '#1a2a3a'}
        lineWidth={1}
        transparent
        opacity={active ? 0.4 : 0.1}
        dashed
        dashSize={0.15}
        gapSize={0.1}
      />

      {/* Data-packet spheres */}
      {Array.from({ length: PACKET_COUNT }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { packetsRef.current[i] = el; }}
          visible={false}
        >
          <sphereGeometry args={[PACKET_SIZE, 6, 6]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.7} toneMapped={false} />
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
        if (device.type === 'router') return null;
        if (!device.position) return null;

        return (
          <FlowLine
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
