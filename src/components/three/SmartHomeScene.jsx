/**
 * SmartHomeScene.jsx
 * ------------------
 * Main 3D scene wrapper for the IoT Security Platform.
 * Renders a cyberpunk / SOC-style smart-home environment inside a
 * @react-three/fiber Canvas with orbit controls, atmospheric lighting,
 * a starfield backdrop, the procedural house, IoT devices, attack beams,
 * data-flow lines, and a protocol shield dome.
 *
 * Props:
 *   devices          - Array of device objects ({ id, name, type, position, status })
 *   activeAttacks    - Array of attack objects ({ id, targetDeviceId, color, blocked })
 *   protocolEnabled  - Boolean indicating whether the security protocol is active
 *   onDeviceClick    - Callback invoked when a device mesh is clicked
 */

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Grid } from '@react-three/drei';
import ErrorBoundary from '../common/ErrorBoundary';

import HouseModel from './HouseModel';
import IoTDevice from './IoTDevice';
import AttackBeam from './AttackBeam';
import DataFlow from './DataFlow';
import ProtocolShield from './ProtocolShield';

/* -------------------------------------------------------------------------- */
/*  Simple fallback grid (plain gridHelper) in case drei Grid shader fails    */
/* -------------------------------------------------------------------------- */

function SimpleGrid() {
  return (
    <gridHelper
      args={[40, 40, '#0a3060', '#0a2040']}
      position={[0, -0.01, 0]}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Cyber Grid — tries drei Grid first, falls back to simple gridHelper       */
/* -------------------------------------------------------------------------- */

function CyberGrid() {
  try {
    return (
      <Grid
        position={[0, -0.01, 0]}
        args={[40, 40]}
        cellSize={0.5}
        cellThickness={0.4}
        cellColor="#0a3060"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#0077ff"
        fadeDistance={25}
        fadeStrength={1.2}
        infiniteGrid
      />
    );
  } catch {
    return <SimpleGrid />;
  }
}

/* -------------------------------------------------------------------------- */
/*  Internal scene contents (everything that lives inside the Canvas)         */
/* -------------------------------------------------------------------------- */

function SceneContents({ devices, activeAttacks, protocolEnabled, onDeviceClick }) {
  // Pre-compute which device ids are currently under attack
  const attackedDeviceIds = useMemo(() => {
    const ids = new Set();
    if (activeAttacks) {
      activeAttacks.forEach((a) => ids.add(a.targetDeviceId));
    }
    return ids;
  }, [activeAttacks]);

  // Build a device-id → position lookup for computing beam targets
  const devicePositionMap = useMemo(() => {
    const map = {};
    if (devices) {
      devices.forEach((d) => { map[d.id] = d.position || [0, 1, 0]; });
    }
    return map;
  }, [devices]);

  // Generate beam data: each attack gets a "from" position above/outside
  // the house and a "to" position at the target device
  const beams = useMemo(() => {
    if (!activeAttacks) return [];
    return activeAttacks.map((attack, i) => {
      const to = devicePositionMap[attack.targetDeviceId] || [0, 1, 0];
      // Distribute attack origins around the house in a circle above
      const angle = (i / Math.max(activeAttacks.length, 1)) * Math.PI * 2 + i * 1.3;
      const from = [
        Math.cos(angle) * 7,
        4 + Math.sin(angle * 0.5) * 1.5,
        Math.sin(angle) * 7,
      ];
      return { ...attack, from, to };
    });
  }, [activeAttacks, devicePositionMap]);

  return (
    <>
      {/* ---- Lighting rig ------------------------------------------------- */}
      <ambientLight intensity={0.15} color="#4488ff" />
      <directionalLight position={[8, 12, 6]} intensity={0.6} color="#aaccff" />
      <pointLight position={[-4, 6, -4]} intensity={0.4} color="#0066ff" distance={20} />
      <pointLight position={[4, 6, 4]} intensity={0.3} color="#00ffaa" distance={20} />
      <pointLight position={[0, 1, 0]} intensity={0.25} color="#6633ff" distance={12} />

      {/* ---- Starfield backdrop ------------------------------------------- */}
      <Stars radius={80} depth={60} count={4000} factor={4} saturation={0.3} fade speed={0.6} />

      {/* ---- Cyber grid floor --------------------------------------------- */}
      <CyberGrid />

      {/* ---- House model -------------------------------------------------- */}
      <HouseModel position={[0, 0, 0]} />

      {/* ---- IoT devices -------------------------------------------------- */}
      {devices &&
        devices.map((device) => (
          <IoTDevice
            key={device.id}
            device={device}
            status={device.status || 'secure'}
            isUnderAttack={attackedDeviceIds.has(device.id)}
            protocolEnabled={protocolEnabled}
            onClick={() => onDeviceClick && onDeviceClick(device)}
          />
        ))}

      {/* ---- Attack beams ------------------------------------------------- */}
      {beams.map((beam) => (
        <AttackBeam
          key={beam.id}
          from={beam.from}
          to={beam.to}
          color={beam.color || '#ff3366'}
          blocked={beam.blocked}
        />
      ))}

      {/* ---- Data-flow lines between devices and router ------------------- */}
      {devices && (
        <DataFlow
          devices={devices}
          routerPosition={[0, 1.2, 0]}
          protocolEnabled={protocolEnabled}
        />
      )}

      {/* ---- Protocol shield dome ----------------------------------------- */}
      <ProtocolShield enabled={protocolEnabled} position={[0, 1.5, 0]} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  3D fallback when Canvas fails                                             */
/* -------------------------------------------------------------------------- */

function Scene3DFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#030712] text-gray-500 text-sm">
      <div className="text-center">
        <p className="mb-2">3D scene could not load</p>
        <p className="text-xs text-gray-600">WebGL may not be available</p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Public SmartHomeScene component                                           */
/* -------------------------------------------------------------------------- */

export default function SmartHomeScene({
  devices = [],
  activeAttacks = [],
  protocolEnabled = false,
  onDeviceClick,
}) {
  return (
    <ErrorBoundary fallback={<Scene3DFallback />}>
      <Canvas
        style={{ background: '#030712' }}
        camera={{ position: [8, 7, 8], fov: 50, near: 0.1, far: 200 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <fog attach="fog" args={['#030712', 15, 40]} />

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={5}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.1}
          autoRotate
          autoRotateSpeed={0.3}
        />

        <Suspense fallback={null}>
          <SceneContents
            devices={devices}
            activeAttacks={activeAttacks}
            protocolEnabled={protocolEnabled}
            onDeviceClick={onDeviceClick}
          />
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  );
}
