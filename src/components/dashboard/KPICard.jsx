/**
 * KPICard — Key Performance Indicator metric card.
 *
 * Renders a single dark-themed KPI panel with a colored left accent border,
 * an icon in a tinted circle, a large animated number, and a subtle trend
 * indicator arrow showing whether the metric is rising, falling, or stable.
 *
 * @module components/dashboard/KPICard
 */

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Colour-to-Tailwind-compatible rgba helpers.
 * We use inline styles for the accent colour since the exact hex
 * comes from props and cannot be expressed as a static Tailwind class.
 */

const trendConfig = {
  up: { Icon: TrendingUp, color: '#ff4466', label: 'Increasing' },
  down: { Icon: TrendingDown, color: '#00ff88', label: 'Decreasing' },
  stable: { Icon: Minus, color: '#888888', label: 'Stable' },
};

/**
 * @param {Object}   props
 * @param {string}   props.title    - Metric label (e.g. "Connected Devices").
 * @param {number}   props.value    - Numeric value displayed prominently.
 * @param {string}   [props.subtitle] - Small secondary text below the value.
 * @param {import('lucide-react').LucideIcon} props.icon - Lucide icon component.
 * @param {string}   props.color    - Hex accent colour for the left border and icon circle.
 * @param {'up'|'down'|'stable'} [props.trend='stable'] - Direction trend arrow.
 */
export default function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = '#00ccff',
  trend = 'stable',
}) {
  const { Icon: TrendIcon, color: trendColor, label: trendLabel } =
    trendConfig[trend] || trendConfig.stable;

  /* Animate the number counting up via framer-motion spring. */
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const displayed = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    spring.set(typeof value === 'number' ? value : 0);
  }, [value, spring]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative flex items-center gap-4 rounded-xl bg-gray-900/80 p-5 backdrop-blur-sm border border-gray-800 overflow-hidden"
      style={{ borderLeftWidth: '4px', borderLeftColor: color }}
    >
      {/* Icon circle */}
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={22} style={{ color }} />
      </div>

      {/* Text content */}
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <motion.span
            className="text-2xl font-bold text-white"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {displayed}
          </motion.span>
          {subtitle && (
            <span className="truncate text-xs text-gray-500">{subtitle}</span>
          )}
        </div>
      </div>

      {/* Trend indicator */}
      <div
        className="ml-auto flex items-center gap-1 rounded-full px-2 py-0.5"
        style={{ backgroundColor: `${trendColor}15` }}
        title={trendLabel}
      >
        <TrendIcon size={14} style={{ color: trendColor }} />
      </div>
    </motion.div>
  );
}
