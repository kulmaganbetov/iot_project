/**
 * IoTDevice.jsx
 * --------------
 * Renders a single IoT device as a 3D object inside the smart-home scene.
 *
 * Props:
 *   device          - { id, name, type, position: [x, y, z] }
 *   status          - 'secure' | 'warning' | 'compromised'
 *   isUnderAttack   - Boolean; triggers fast red pulse
 *   protocolEnabled - Boolean; triggers gentle green aura when secure
 *   onClick         - Callback when the device mesh is clicked
 *
 * Device types and their geometry:
 *   router        - Torus (ring)
 *   camera        - Cone + cylinder (lens body)
 *   lock          - Cylinder + small box (shackle)
 *   thermostat    - Sphere
 *   motion_sensor - Octahedron
 *   light         - Small emissive sphere
 *
 * Visual behaviour:
 *   - Constant slow float (sin-wave hover)
 *   - Status-coloured ring / halo orbiting the device
 *   - Under-attack  => rapid red pulse on the halo + emissive
 *   - Secure + protocol => gentle green glow
 *   - Html label on hover (drei)
 */

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

/* -------------------------------------------------------------------------- */
/*  Colour helpers                                                            */
/* -------------------------------------------------------------------------- */

const STATUS_COLORS = {
  secure: '#00ff88',
  warning: '#ffaa00',
  compromised: '#ff3366',
};

function getStatusColor(status) {
  return STATUS_COLORS[status] || STATUS_COLORS.secure;
}

/* -------------------------------------------------------------------------- */
/*  Device geometry sub-components                                            */
/* -------------------------------------------------------------------------- */

/** Router - torus ring lying flat */
function RouterGeometry({ color }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.3, 0.08, 16, 32]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.6} roughness={0.3} />
    </mesh>
  );
}

/** Camera - cone (lens) + cylinder (body) */
function CameraGeometry({ color }) {
  return (
    <group>
      <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.15, 0.25, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, -0.05]}>
        <cylinderGeometry args={[0.12, 0.12, 0.2, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

/** Lock - cylinder body + small box (shackle representation) */
function LockGeometry({ color }) {
  return (
    <group>
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.25, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Shackle arc (approximated with a torus segment) */}
      <mesh position={[0, 0.15, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.1, 0.03, 8, 16, Math.PI]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  );
}

/** Thermostat - sphere */
function ThermostatGeometry({ color }) {
  return (
    <mesh>
      <sphereGeometry args={[0.22, 24, 24]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} metalness={0.4} roughness={0.3} />
    </mesh>
  );
}

/** Motion sensor - octahedron */
function MotionSensorGeometry({ color }) {
  return (
    <mesh>
      <octahedronGeometry args={[0.22, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} metalness={0.5} roughness={0.3} />
    </mesh>
  );
}

/** Light - small glowing sphere */
function LightGeometry({ color }) {
  return (
    <mesh>
      <sphereGeometry args={[0.16, 16, 16]} />
      <meshStandardMaterial
        color="#ffffcc"
        emissive={color}
        emissiveIntensity={0.9}
        toneMapped={false}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*  Geometry selector                                                         */
/* -------------------------------------------------------------------------- */

function DeviceShape({ type, color }) {
  switch (type) {
    case 'router':
      return <RouterGeometry color={color} />;
    case 'camera':
      return <CameraGeometry color={color} />;
    case 'door_lock':
    case 'lock':
      return <LockGeometry color={color} />;
    case 'thermostat':
      return <ThermostatGeometry color={color} />;
    case 'motion_sensor':
      return <MotionSensorGeometry color={color} />;
    case 'smart_light':
    case 'light':
      return <LightGeometry color={color} />;
    default:
      // Fallback: generic icosahedron
      return (
        <mesh>
          <icosahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </mesh>
      );
  }
}

/* -------------------------------------------------------------------------- */
/*  Status halo ring                                                          */
/* -------------------------------------------------------------------------- */

function StatusHalo({ color, intensity }) {
  const ref = useRef();

  // Rotate the halo slowly for visual interest
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.6;
    }
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.38, 0.42, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={intensity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main IoTDevice export                                                     */
/* -------------------------------------------------------------------------- */

export default function IoTDevice({
  device,
  status = 'secure',
  isUnderAttack = false,
  protocolEnabled = false,
  onClick,
}) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Base colour driven by status
  const color = useMemo(() => getStatusColor(status), [status]);

  // Position from device object (default to origin)
  const pos = device.position || [0, 1, 0];

  /* ---- Per-frame animation --------------------------------------------- */
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Gentle hover / float (sin wave offset by device id hash so devices float out of sync)
    const idOffset = (device.id || 0) * 1.7;
    groupRef.current.position.y = pos[1] + Math.sin(t * 1.5 + idOffset) * 0.08;

    // Under-attack rapid scale pulse
    if (isUnderAttack) {
      const pulse = 1 + Math.sin(t * 12) * 0.12;
      groupRef.current.scale.setScalar(pulse);
    } else {
      groupRef.current.scale.setScalar(1);
    }
  });

  /* ---- Halo intensity logic -------------------------------------------- */
  let haloColor = color;
  let haloIntensity = 0.35;

  if (isUnderAttack) {
    haloColor = '#ff3366';
    haloIntensity = 0.8;
  } else if (status === 'secure' && protocolEnabled) {
    haloColor = '#00ff88';
    haloIntensity = 0.55;
  }

  return (
    <group
      ref={groupRef}
      position={[pos[0], pos[1], pos[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(device);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Device geometry */}
      <DeviceShape type={device.type} color={color} />

      {/* Status halo ring */}
      <StatusHalo color={haloColor} intensity={haloIntensity} />

      {/* Point light glow matching status */}
      <pointLight
        color={isUnderAttack ? '#ff3366' : color}
        intensity={isUnderAttack ? 1.2 : protocolEnabled && status === 'secure' ? 0.6 : 0.3}
        distance={2.5}
      />

      {/* Hover label using drei Html */}
      {hovered && (
        <Html
          center
          distanceFactor={8}
          position={[0, 0.55, 0]}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              background: 'rgba(0, 10, 30, 0.85)',
              border: `1px solid ${color}`,
              borderRadius: '6px',
              padding: '4px 10px',
              color: '#e0f0ff',
              fontSize: '11px',
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              whiteSpace: 'nowrap',
              textShadow: `0 0 6px ${color}`,
            }}
          >
            {device.name || device.type}
          </div>
        </Html>
      )}
    </group>
  );
}
