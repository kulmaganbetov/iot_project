/**
 * AttacksChart — Animated area chart showing attacks over time.
 *
 * Renders a recharts AreaChart with two stacked areas:
 *   - Total attacks (red gradient)
 *   - Blocked attacks (green gradient)
 *
 * The chart auto-generates a mock time series and appends a new data point
 * every 3 seconds, keeping the most recent 20 points visible.
 *
 * @module components/dashboard/AttacksChart
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';

/** Number of visible data points on the x-axis. */
const MAX_POINTS = 20;

/** Interval in milliseconds between new data points. */
const TICK_INTERVAL = 3000;

/**
 * Format the current time as HH:MM:SS for x-axis labels.
 *
 * @param {Date} [d=new Date()] - Date to format.
 * @returns {string} Time string, e.g. "14:07:03".
 */
function timeLabel(d = new Date()) {
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Generate the initial 20-point seed data so the chart is never empty
 * on first render. Values start lower to make the initial ramp visible.
 *
 * @param {boolean} protocolEnabled - Whether the protocol is active.
 * @returns {Array<{ time: string, attacks: number, blocked: number }>}
 */
function generateSeedData(protocolEnabled) {
  const now = Date.now();
  return Array.from({ length: MAX_POINTS }, (_, i) => {
    const t = new Date(now - (MAX_POINTS - i) * TICK_INTERVAL);
    const attacks = Math.floor(Math.random() * 10) + 3;
    const blocked = protocolEnabled
      ? Math.floor(attacks * (0.7 + Math.random() * 0.3))
      : Math.floor(attacks * Math.random() * 0.3);
    return { time: timeLabel(t), attacks, blocked };
  });
}

/**
 * Custom dark-themed tooltip component for recharts.
 */
function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900/95 px-3 py-2 text-xs shadow-xl backdrop-blur-sm">
      <p className="mb-1 font-medium text-gray-300">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}: <span className="font-semibold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

/**
 * @param {Object}  props
 * @param {Array}   [props.data]           - Optional external data array (overrides auto-gen).
 * @param {boolean} [props.protocolEnabled] - Whether the security protocol is active.
 */
export default function AttacksChart({ data: externalData, protocolEnabled = true }) {
  const [series, setSeries] = useState(() => generateSeedData(protocolEnabled));
  const protocolRef = useRef(protocolEnabled);

  /* Keep the ref in sync so the interval closure always reads the latest value. */
  useEffect(() => {
    protocolRef.current = protocolEnabled;
  }, [protocolEnabled]);

  /**
   * Append a new random data point every TICK_INTERVAL ms.
   * If external data is provided this effect is skipped.
   */
  const tick = useCallback(() => {
    const attacks = Math.floor(Math.random() * 14) + 4;
    const blocked = protocolRef.current
      ? Math.floor(attacks * (0.7 + Math.random() * 0.3))
      : Math.floor(attacks * Math.random() * 0.25);

    setSeries((prev) => [
      ...prev.slice(-(MAX_POINTS - 1)),
      { time: timeLabel(), attacks, blocked },
    ]);
  }, []);

  useEffect(() => {
    if (externalData) return; // skip auto-gen when external data is provided
    const id = setInterval(tick, TICK_INTERVAL);
    return () => clearInterval(id);
  }, [tick, externalData]);

  const chartData = externalData || series;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex h-full flex-col rounded-xl border border-gray-800 bg-gray-900/80 p-5 backdrop-blur-sm"
    >
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
        Attacks Over Time
      </h3>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gradAttacks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff3366" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ff3366" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradBlocked" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ff88" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#00ff88" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 6" stroke="#1f2937" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: '#6b7280', fontSize: 10 }}
              axisLine={{ stroke: '#374151' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<DarkTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, color: '#9ca3af', paddingBottom: 4 }}
            />

            <Area
              type="monotone"
              dataKey="attacks"
              name="Total Attacks"
              stroke="#ff3366"
              strokeWidth={2}
              fill="url(#gradAttacks)"
              dot={false}
              activeDot={{ r: 4, stroke: '#ff3366', strokeWidth: 2, fill: '#111827' }}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="blocked"
              name="Blocked"
              stroke="#00ff88"
              strokeWidth={2}
              fill="url(#gradBlocked)"
              dot={false}
              activeDot={{ r: 4, stroke: '#00ff88', strokeWidth: 2, fill: '#111827' }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
