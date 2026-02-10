import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Activity, Zap } from 'lucide-react';

/**
 * AnimatedCounter
 *
 * Smoothly counts up from a previous value to the current target value.
 * Uses requestAnimationFrame for fluid number transitions.
 */
function AnimatedCounter({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplay(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        prevValue.current = end;
      }
    }

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, duration]);

  return <span>{display.toLocaleString()}</span>;
}

/**
 * AttackStats — Stats Overlay Panel
 *
 * Displays key attack metrics as an overlay panel on the world map.
 * Each stat card features an animated counter, a color-coded icon,
 * and smooth entrance animations via framer-motion.
 *
 * Props:
 *  - stats: { totalAttacks, blockedAttacks, activeThreats, attacksPerMinute }
 */
export default function AttackStats({ stats }) {
  const {
    totalAttacks = 0,
    blockedAttacks = 0,
    activeThreats = 0,
    attacksPerMinute = 0,
  } = stats || {};

  const cards = [
    {
      label: 'Total Attacks',
      value: totalAttacks,
      icon: Activity,
      color: 'text-cyber-blue',
      bgGlow: 'shadow-[0_0_20px_rgba(0,170,255,0.15)]',
      borderColor: 'border-cyber-blue/20',
      iconBg: 'bg-cyber-blue/10',
    },
    {
      label: 'Blocked',
      value: blockedAttacks,
      icon: Shield,
      color: 'text-cyber-green',
      bgGlow: 'shadow-[0_0_20px_rgba(0,255,136,0.15)]',
      borderColor: 'border-cyber-green/20',
      iconBg: 'bg-cyber-green/10',
    },
    {
      label: 'Active Threats',
      value: activeThreats,
      icon: AlertTriangle,
      color: 'text-cyber-red',
      bgGlow: 'shadow-[0_0_20px_rgba(255,51,102,0.15)]',
      borderColor: 'border-cyber-red/20',
      iconBg: 'bg-cyber-red/10',
    },
    {
      label: 'Attacks / Min',
      value: attacksPerMinute,
      icon: Zap,
      color: 'text-cyber-yellow',
      bgGlow: 'shadow-[0_0_20px_rgba(255,170,0,0.15)]',
      borderColor: 'border-cyber-yellow/20',
      iconBg: 'bg-cyber-yellow/10',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col gap-3 w-64"
    >
      {/* Panel header */}
      <div className="cyber-panel px-4 py-2.5 flex items-center gap-2">
        <Activity className="w-4 h-4 text-cyber-blue" />
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">
          Live Threat Monitor
        </span>
      </div>

      {/* Stat cards */}
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
            className={`
              cyber-panel px-4 py-3 flex items-center gap-3
              ${card.bgGlow} ${card.borderColor}
              hover:scale-[1.02] transition-transform duration-200
            `}
          >
            <div className={`p-2 rounded-lg ${card.iconBg}`}>
              <Icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                {card.label}
              </span>
              <span className={`text-xl font-bold tabular-nums ${card.color}`}>
                <AnimatedCounter value={card.value} />
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
