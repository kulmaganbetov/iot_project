/**
 * DashboardPage — Full security dashboard for the IoT Security Platform.
 *
 * Layout (responsive Tailwind grid):
 *   Top row    : 4 KPI cards (Connected Devices, Risk Level, Attacks/Min, Blocked Rate)
 *   Middle row : Attacks Over Time line chart (left, 2/3 width) + Attack Types donut (right, 1/3)
 *   Bottom row : Device Status grid (left) + Live Event Log (right)
 *
 * All live data is sourced from SimulationContext, which is populated by
 * the useSimulation hook higher in the component tree.
 *
 * @module pages/DashboardPage
 */

import { useMemo } from 'react';
import { useSimulationContext } from '../context/SimulationContext';
import { motion } from 'framer-motion';
import {
  Cpu,
  ShieldAlert,
  Zap,
  ShieldCheck,
} from 'lucide-react';

import KPICard from '../components/dashboard/KPICard';
import AttacksChart from '../components/dashboard/AttacksChart';
import AttackTypesChart from '../components/dashboard/AttackTypesChart';
import DeviceStatusGrid from '../components/dashboard/DeviceStatusGrid';
import EventLog from '../components/dashboard/EventLog';

/**
 * Derive a human-readable risk level and associated colour/trend
 * from the current simulation statistics.
 */
function deriveRiskMeta(stats, protocolEnabled) {
  if (protocolEnabled && stats.activeThreats === 0) {
    return { label: 'Low', value: 1, color: '#00ff88', trend: 'down' };
  }
  if (stats.activeThreats <= 2) {
    return { label: 'Medium', value: 2, color: '#ff9900', trend: 'stable' };
  }
  if (stats.activeThreats <= 4) {
    return { label: 'High', value: 3, color: '#ff3366', trend: 'up' };
  }
  return { label: 'Critical', value: 4, color: '#ff0044', trend: 'up' };
}

export default function DashboardPage() {
  const {
    devices,
    activeAttacks,
    protocolEnabled,
    events,
    stats,
  } = useSimulationContext();

  /* ── Derived KPI values ──────────────────────────────────────────── */

  const connectedCount = devices.length;

  const riskMeta = useMemo(
    () => deriveRiskMeta(stats, protocolEnabled),
    [stats, protocolEnabled]
  );

  const attacksPerMin = stats.attacksPerMinute ?? 0;

  const blockedRate = useMemo(() => {
    if (stats.totalAttacks === 0) return 100;
    return Math.round((stats.blockedAttacks / stats.totalAttacks) * 100);
  }, [stats.totalAttacks, stats.blockedAttacks]);

  const blockedTrend = useMemo(() => {
    if (blockedRate >= 85) return 'up';
    if (blockedRate >= 50) return 'stable';
    return 'down';
  }, [blockedRate]);

  /* ── Render ──────────────────────────────────────────────────────── */

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 p-4 md:p-6"
    >
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Security Dashboard</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Real-time IoT network monitoring and threat analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: protocolEnabled ? '#00ff88' : '#ff0044' }}
          />
          <span className="text-xs text-gray-400">
            Protocol {protocolEnabled ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* ── Top row: KPI cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          title="Connected Devices"
          value={connectedCount}
          subtitle="on network"
          icon={Cpu}
          color="#00ccff"
          trend="stable"
        />
        <KPICard
          title="Risk Level"
          value={riskMeta.value}
          subtitle={riskMeta.label}
          icon={ShieldAlert}
          color={riskMeta.color}
          trend={riskMeta.trend}
        />
        <KPICard
          title="Attacks / Min"
          value={attacksPerMin}
          subtitle="rolling 60s"
          icon={Zap}
          color="#ff3366"
          trend={attacksPerMin > 10 ? 'up' : 'stable'}
        />
        <KPICard
          title="Blocked Rate"
          value={blockedRate}
          subtitle="%"
          icon={ShieldCheck}
          color="#00ff88"
          trend={blockedTrend}
        />
      </div>

      {/* ── Middle row: charts ──────────────────────────────────────── */}
      <div className="grid min-h-[320px] grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttacksChart protocolEnabled={protocolEnabled} />
        </div>
        <div className="lg:col-span-1">
          <AttackTypesChart attacks={events} />
        </div>
      </div>

      {/* ── Bottom row: device grid + event log ─────────────────────── */}
      <div className="grid min-h-[340px] grid-cols-1 gap-4 lg:grid-cols-2">
        <DeviceStatusGrid devices={devices} />
        <EventLog events={events} />
      </div>
    </motion.div>
  );
}
