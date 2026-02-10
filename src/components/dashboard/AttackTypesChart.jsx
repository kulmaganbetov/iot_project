/**
 * AttackTypesChart — Donut / pie chart of attack type distribution.
 *
 * Shows the relative frequency of each attack type as a recharts PieChart
 * with a hollow centre that displays the total count.
 *
 * Colours are sourced from the attack definitions in `../../data/attacks.js`
 * so they remain consistent across the whole platform.
 *
 * @module components/dashboard/AttackTypesChart
 */

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { attackDefinitions } from '../../data/attacks';

/**
 * Build a colour lookup from attack type ID to its defined hex colour.
 */
const colorMap = Object.fromEntries(
  attackDefinitions.map((def) => [def.id, def.color])
);

/** Fallback palette if an attack type is somehow not in the definitions. */
const FALLBACK_COLORS = [
  '#ff3366', '#ff6600', '#ff9900', '#cc3399', '#ff0066', '#ff0044',
];

/**
 * Custom dark tooltip.
 */
function DarkTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value, payload: entry } = payload[0];

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900/95 px-3 py-2 text-xs shadow-xl backdrop-blur-sm">
      <p className="font-medium" style={{ color: entry.color }}>
        {name}
      </p>
      <p className="text-gray-300">
        Count: <span className="font-semibold text-white">{value}</span>
      </p>
      {entry.percent != null && (
        <p className="text-gray-400">{(entry.percent * 100).toFixed(1)}%</p>
      )}
    </div>
  );
}

/**
 * Custom label rendered inside each pie slice showing the percentage.
 */
function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) {
  if (percent < 0.05) return null; // skip tiny slices
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      className="text-[10px] font-medium fill-white pointer-events-none"
    >
      {(percent * 100).toFixed(0)}%
    </text>
  );
}

/**
 * @param {Object}  props
 * @param {Array}   props.attacks - Array of active attack event objects, each with a `type` field.
 */
export default function AttackTypesChart({ attacks = [] }) {
  /**
   * Aggregate attacks by type and compute counts.
   */
  const chartData = useMemo(() => {
    const counts = {};
    attacks.forEach((atk) => {
      const key = atk.type || atk.attackType || 'unknown';
      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts).map(([type, count]) => {
      const def = attackDefinitions.find((d) => d.id === type);
      return {
        name: def?.shortName || type,
        value: count,
        color: colorMap[type] || FALLBACK_COLORS[Math.floor(Math.random() * FALLBACK_COLORS.length)],
      };
    });
  }, [attacks]);

  const total = useMemo(
    () => chartData.reduce((sum, d) => sum + d.value, 0),
    [chartData]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="flex h-full flex-col rounded-xl border border-gray-800 bg-gray-900/80 p-5 backdrop-blur-sm"
    >
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
        Attack Types
      </h3>

      <div className="relative flex-1 min-h-0">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-600">
            No attack data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="85%"
                dataKey="value"
                nameKey="name"
                paddingAngle={2}
                label={renderCustomLabel}
                labelLine={false}
                isAnimationActive={false}
                stroke="none"
              >
                {chartData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<DarkTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}

        {/* Centre label showing total count */}
        {chartData.length > 0 && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{total}</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-500">
              total
            </span>
          </div>
        )}
      </div>

      {/* Compact legend below the chart */}
      <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1">
        {chartData.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-[10px] text-gray-400">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
