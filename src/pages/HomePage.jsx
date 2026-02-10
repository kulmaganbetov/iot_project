/**
 * HomePage.jsx
 * ------------
 * Home page featuring the full 3D SmartHomeScene with overlay panels.
 *
 * Overlay structure:
 *   - Top bar:    Quick KPI stats (total attacks, blocked, active threats, attacks/min)
 *   - Right side: Protocol toggle, device list, active attacks list
 *   - Bottom:     Attack simulation controls (launch & stop)
 *   - Left side:  Device detail panel (when a device is selected)
 *
 * All simulation state is consumed via useSimulationContext and passed to
 * the SmartHomeScene Three.js component.
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ShieldOff,
  ShieldCheck,
  Wifi,
  Camera,
  Lock,
  Thermometer,
  Activity,
  Lightbulb,
  Zap,
  Crosshair,
  AlertTriangle,
  XCircle,
  X,
  BarChart3,
  CircleDot,
  Info,
  ChevronRight,
  Radio,
} from 'lucide-react';
import SmartHomeScene from '../components/three/SmartHomeScene';
import { useSimulationContext } from '../context/SimulationContext';
import { ATTACK_TYPES } from '../data/attacks';

/* ── Icon map for device types ───────────────────────────────────────────── */
const deviceIconMap = {
  Wifi,
  Camera,
  Lock,
  Thermometer,
  Activity,
  Lightbulb,
};

/* ── Status color & label helpers ────────────────────────────────────────── */
const statusConfig = {
  secure: { color: '#00ff88', label: 'Secure', dotClass: 'green' },
  warning: { color: '#ffaa00', label: 'Warning', dotClass: 'yellow' },
  compromised: { color: '#ff3366', label: 'Compromised', dotClass: 'red' },
};

/* ── Attack button definitions ───────────────────────────────────────────── */
const attackButtons = [
  {
    type: ATTACK_TYPES.BRUTE_FORCE,
    label: 'Launch Brute Force',
    color: '#ff3366',
  },
  {
    type: ATTACK_TYPES.MITM,
    label: 'Launch MITM',
    color: '#ff0044',
  },
  {
    type: ATTACK_TYPES.UNAUTHORIZED_ACCESS,
    label: 'Launch Unauth Access',
    color: '#ff6600',
  },
];

/* ── Panel wrapper for consistent glass styling ──────────────────────────── */
function GlassPanel({ children, className = '' }) {
  return (
    <div
      className={`bg-[rgba(15,23,42,0.85)] border border-[rgba(0,170,255,0.15)] rounded-xl backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}

/* ── Framer variants ─────────────────────────────────────────────────────── */
const slideRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: 40, transition: { duration: 0.2 } },
};

const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.2 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

/* ════════════════════════════════════════════════════════════════════════════
   Main Page Component
   ════════════════════════════════════════════════════════════════════════════ */

export default function HomePage() {
  const {
    devices,
    activeAttacks,
    protocolEnabled,
    toggleProtocol,
    startAttack,
    stopAttack,
    events,
    stats,
  } = useSimulationContext();

  const [selectedDevice, setSelectedDevice] = useState(null);

  /** Handler when a device mesh is clicked in the 3D scene */
  const handleDeviceClick = useCallback((device) => {
    setSelectedDevice((prev) => (prev?.id === device.id ? null : device));
  }, []);

  /** Stop all active attacks */
  const stopAllAttacks = useCallback(() => {
    activeAttacks.forEach((attack) => stopAttack(attack.id));
  }, [activeAttacks, stopAttack]);

  /* Find the full runtime device (with status) for the selected device */
  const selectedDeviceFull = selectedDevice
    ? devices.find((d) => d.id === selectedDevice.id) || selectedDevice
    : null;

  /* ═════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#030712]">
      {/* ── 3D Scene (fills entire viewport) ─────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <SmartHomeScene
          devices={devices}
          activeAttacks={activeAttacks}
          protocolEnabled={protocolEnabled}
          onDeviceClick={handleDeviceClick}
        />
      </div>

      {/* ── Top Overlay: KPI Stats Bar ───────────────────────────────────── */}
      <motion.div
        className="absolute top-4 left-4 right-4 z-20"
        variants={slideUp}
        initial="hidden"
        animate="visible"
      >
        <GlassPanel className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <BarChart3 size={14} className="text-cyan-400" />
            <span>IOT SECURITY MONITOR</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs">
            {/* Total attacks */}
            <div className="flex items-center gap-1.5">
              <Zap size={12} className="text-red-400" />
              <span className="text-slate-500">Attacks:</span>
              <span className="font-bold text-slate-200">
                {stats.totalAttacks}
              </span>
            </div>

            {/* Blocked */}
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-green-400" />
              <span className="text-slate-500">Blocked:</span>
              <span className="font-bold text-green-400">
                {stats.blockedAttacks}
              </span>
            </div>

            {/* Active threats */}
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={12} className="text-amber-400" />
              <span className="text-slate-500">Active Threats:</span>
              <span
                className={`font-bold ${
                  stats.activeThreats > 0
                    ? 'text-red-400 threat-pulse'
                    : 'text-slate-200'
                }`}
              >
                {stats.activeThreats}
              </span>
            </div>

            {/* Attacks/min */}
            <div className="flex items-center gap-1.5">
              <Activity size={12} className="text-cyan-400" />
              <span className="text-slate-500">Atk/min:</span>
              <span className="font-bold text-slate-200">
                {stats.attacksPerMinute}
              </span>
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      {/* ── Right Sidebar Overlay ────────────────────────────────────────── */}
      <motion.div
        className="absolute top-20 right-4 z-20 w-72 flex flex-col gap-3 max-h-[calc(100vh-10rem)] overflow-y-auto"
        variants={slideRight}
        initial="hidden"
        animate="visible"
      >
        {/* Protocol Toggle */}
        <GlassPanel className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Protocol
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                protocolEnabled
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {protocolEnabled ? 'ACTIVE' : 'DISABLED'}
            </span>
          </div>

          <button
            onClick={toggleProtocol}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
              protocolEnabled
                ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 shadow-[0_0_20px_rgba(0,255,136,0.1)]'
                : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 shadow-[0_0_20px_rgba(255,51,102,0.1)]'
            }`}
          >
            {protocolEnabled ? (
              <>
                <Shield size={18} />
                Protocol ON
              </>
            ) : (
              <>
                <ShieldOff size={18} />
                Protocol OFF
              </>
            )}
          </button>
        </GlassPanel>

        {/* Device List */}
        <GlassPanel className="p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Radio size={12} />
            Devices ({devices.length})
          </h3>

          <div className="space-y-1.5">
            {devices.map((device) => {
              const statusCfg =
                statusConfig[device.status] || statusConfig.secure;
              const DeviceIcon = deviceIconMap[device.icon] || Wifi;
              const isSelected = selectedDevice?.id === device.id;

              return (
                <button
                  key={device.id}
                  onClick={() => handleDeviceClick(device)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-cyan-500/15 border border-cyan-500/30'
                      : 'hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <DeviceIcon size={14} className="text-slate-400 flex-shrink-0" />
                  <span className="flex-grow text-slate-300 truncate">
                    {device.name}
                  </span>
                  <span
                    className="status-dot flex-shrink-0"
                    style={{
                      background: statusCfg.color,
                      boxShadow: `0 0 6px ${statusCfg.color}`,
                    }}
                  />
                </button>
              );
            })}
          </div>
        </GlassPanel>

        {/* Active Attacks */}
        {activeAttacks.length > 0 && (
          <GlassPanel className="p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Crosshair size={12} className="text-red-400" />
              Active Attacks ({activeAttacks.length})
            </h3>

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {activeAttacks.slice(0, 10).map((attack) => (
                <div
                  key={attack.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                  style={{ background: `${attack.color}10` }}
                >
                  <Zap
                    size={12}
                    className="flex-shrink-0"
                    style={{ color: attack.color }}
                  />
                  <span className="flex-grow text-slate-300 truncate">
                    {attack.shortName || attack.name}
                  </span>
                  {attack.blocked ? (
                    <span className="text-[10px] font-bold text-green-400 bg-green-500/15 px-1.5 py-0.5 rounded">
                      BLOCKED
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-red-400 bg-red-500/15 px-1.5 py-0.5 rounded threat-pulse">
                      ACTIVE
                    </span>
                  )}
                </div>
              ))}
            </div>
          </GlassPanel>
        )}
      </motion.div>

      {/* ── Left Overlay: Device Detail Panel ────────────────────────────── */}
      <AnimatePresence>
        {selectedDeviceFull && (
          <motion.div
            key="device-detail"
            className="absolute top-20 left-4 z-20 w-72"
            variants={slideLeft}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <GlassPanel className="p-5">
              {/* Close button */}
              <button
                onClick={() => setSelectedDevice(null)}
                className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X size={16} />
              </button>

              {/* Device header */}
              <div className="flex items-center gap-3 mb-4">
                {(() => {
                  const DeviceIcon =
                    deviceIconMap[selectedDeviceFull.icon] || Wifi;
                  const statusCfg =
                    statusConfig[selectedDeviceFull.status] ||
                    statusConfig.secure;
                  return (
                    <>
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ background: `${statusCfg.color}15` }}
                      >
                        <DeviceIcon
                          size={22}
                          style={{ color: statusCfg.color }}
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-200">
                          {selectedDeviceFull.name}
                        </h3>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            background: `${statusCfg.color}20`,
                            color: statusCfg.color,
                          }}
                        >
                          {statusCfg.label.toUpperCase()}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Details */}
              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">
                    Type
                  </p>
                  <p className="text-slate-300">
                    {selectedDeviceFull.type?.replace('_', ' ')}
                  </p>
                </div>

                {selectedDeviceFull.description && (
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">
                      Description
                    </p>
                    <p className="text-slate-400">
                      {selectedDeviceFull.description}
                    </p>
                  </div>
                )}

                {selectedDeviceFull.firmware && (
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">
                      Firmware
                    </p>
                    <p className="text-slate-300 font-mono">
                      {selectedDeviceFull.firmware}
                    </p>
                  </div>
                )}

                {selectedDeviceFull.protocol && (
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">
                      Protocol
                    </p>
                    <p className="text-slate-300">
                      {selectedDeviceFull.protocol}
                    </p>
                  </div>
                )}

                {selectedDeviceFull.vulnerabilities &&
                  selectedDeviceFull.vulnerabilities.length > 0 && (
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1.5">
                        Known Vulnerabilities
                      </p>
                      <ul className="space-y-1">
                        {selectedDeviceFull.vulnerabilities.map((vuln, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-1.5 text-amber-400/80"
                          >
                            <AlertTriangle
                              size={10}
                              className="mt-0.5 flex-shrink-0"
                            />
                            <span>{vuln}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom Overlay: Attack Simulation Controls ───────────────────── */}
      <motion.div
        className="absolute bottom-4 left-4 right-4 z-20"
        variants={slideUp}
        initial="hidden"
        animate="visible"
      >
        <GlassPanel className="px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Crosshair size={14} className="text-red-400" />
            <span className="uppercase tracking-wider">Attack Simulation</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Individual attack launch buttons */}
            {attackButtons.map((btn) => (
              <button
                key={btn.type}
                onClick={() => startAttack(btn.type)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105 active:scale-95 border"
                style={{
                  color: btn.color,
                  borderColor: `${btn.color}40`,
                  background: `${btn.color}10`,
                }}
                title={btn.label}
              >
                <AlertTriangle size={12} />
                <span className="hidden sm:inline">{btn.label}</span>
                <span className="sm:hidden">
                  {btn.label.replace('Launch ', '')}
                </span>
              </button>
            ))}

            {/* Stop All */}
            <button
              onClick={stopAllAttacks}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95 bg-slate-700/60 text-slate-300 border border-slate-600/40 hover:bg-slate-700/80"
            >
              <XCircle size={12} />
              <span>Stop All</span>
            </button>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
