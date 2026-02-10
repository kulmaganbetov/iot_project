/**
 * DeviceStatusGrid — Grid of small device status cards.
 *
 * Each card shows the device icon, name, a coloured status badge,
 * and the firmware version. The border colour reflects the current
 * security state (green = secure, yellow = warning, red = compromised),
 * with animated transitions when the status changes.
 *
 * @module components/dashboard/DeviceStatusGrid
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  Wifi,
  Camera,
  Lock,
  Thermometer,
  Activity,
  Lightbulb,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
} from 'lucide-react';

/** Map device `icon` string names to actual Lucide components. */
const ICON_MAP = {
  Wifi,
  Camera,
  Lock,
  Thermometer,
  Activity,
  Lightbulb,
};

/** Map status to visual configuration. */
const STATUS_CONFIG = {
  secure: {
    borderColor: '#00ff88',
    bgColor: 'rgba(0, 255, 136, 0.06)',
    dotColor: '#00ff88',
    label: 'Secure',
    StatusIcon: ShieldCheck,
  },
  warning: {
    borderColor: '#ff9900',
    bgColor: 'rgba(255, 153, 0, 0.06)',
    dotColor: '#ff9900',
    label: 'Warning',
    StatusIcon: ShieldAlert,
  },
  compromised: {
    borderColor: '#ff0044',
    bgColor: 'rgba(255, 0, 68, 0.06)',
    dotColor: '#ff0044',
    label: 'Compromised',
    StatusIcon: ShieldX,
  },
};

const DEFAULT_STATUS = STATUS_CONFIG.secure;

/**
 * Single device card.
 */
function DeviceCard({ device }) {
  const status = device.status || 'secure';
  const config = STATUS_CONFIG[status] || DEFAULT_STATUS;
  const DeviceIcon = ICON_MAP[device.icon] || Activity;
  const { StatusIcon } = config;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-2 rounded-lg border bg-gray-900/60 p-3 backdrop-blur-sm"
      style={{
        borderColor: config.borderColor,
        backgroundColor: config.bgColor,
      }}
    >
      {/* Top row: device icon + name */}
      <div className="flex items-center gap-2">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: `${config.borderColor}18` }}
        >
          <DeviceIcon size={16} style={{ color: config.borderColor }} />
        </div>
        <span className="truncate text-sm font-medium text-gray-200">
          {device.name}
        </span>
      </div>

      {/* Status badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <motion.span
            key={status}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: config.dotColor }}
          />
          <motion.span
            key={`label-${status}`}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs font-medium"
            style={{ color: config.dotColor }}
          >
            {config.label}
          </motion.span>
        </div>
        <StatusIcon size={14} style={{ color: config.dotColor, opacity: 0.7 }} />
      </div>

      {/* Firmware */}
      {device.firmware && (
        <span className="text-[10px] text-gray-500">
          Firmware {device.firmware}
        </span>
      )}
    </motion.div>
  );
}

/**
 * @param {Object}  props
 * @param {Array}   props.devices - Array of device objects with status info.
 */
export default function DeviceStatusGrid({ devices = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex h-full flex-col rounded-xl border border-gray-800 bg-gray-900/80 p-5 backdrop-blur-sm"
    >
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
        Device Status
      </h3>

      <div className="grid flex-1 auto-rows-min grid-cols-2 gap-3 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {devices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
