import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ShieldOff,
  Globe,
  Radio,
  Clock,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { useSimulationContext } from '../context/SimulationContext';
import WorldMap from '../components/map/WorldMap';
import AttackStats from '../components/map/AttackStats';
import {
  attackOrigins,
  attackDefinitions,
  targetLocation,
} from '../data/attacks';

/**
 * generateAttackLine
 *
 * Converts an active attack from the simulation context into the shape
 * expected by WorldMap's attackLines prop, randomly picking an origin.
 */
function generateAttackLine(attack, protocolEnabled) {
  const origin =
    attackOrigins[Math.floor(Math.random() * attackOrigins.length)];
  const def = attackDefinitions.find((d) => d.id === attack.type);

  return {
    id: attack.id || `attack-${Date.now()}-${Math.random()}`,
    from: { lat: origin.lat, lng: origin.lng },
    to: { lat: targetLocation.lat, lng: targetLocation.lng },
    color: def?.color || '#ff3366',
    blocked: protocolEnabled,
    country: origin.country,
    type: def?.shortName || attack.type || 'Unknown',
    timestamp: attack.timestamp || Date.now(),
  };
}

/**
 * AttackTypeBadge
 *
 * Renders a small colored badge for an attack type in the distribution list.
 */
function AttackTypeBadge({ name, count, color, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}50` }}
        />
        <span className="text-xs text-slate-300 truncate">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-slate-400">{count}</span>
        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <span className="text-[10px] text-slate-500 w-8 text-right">
          {pct}%
        </span>
      </div>
    </div>
  );
}

/**
 * EventFeedItem
 *
 * Single row in the scrolling attack event feed at the bottom of the page.
 */
function EventFeedItem({ event, index }) {
  const timeStr = new Date(event.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="flex items-center gap-3 px-4 py-2 border-b border-slate-800/50 last:border-b-0 hover:bg-slate-800/30 transition-colors"
    >
      {/* Blocked status indicator */}
      <div className="shrink-0">
        {event.blocked ? (
          <Shield className="w-3.5 h-3.5 text-cyber-green" />
        ) : (
          <ShieldOff className="w-3.5 h-3.5 text-cyber-red" />
        )}
      </div>

      {/* Country + flag */}
      <div className="flex items-center gap-1.5 w-28 shrink-0">
        <MapPin className="w-3 h-3 text-slate-500" />
        <span className="text-xs text-slate-300 truncate">
          {event.country}
        </span>
      </div>

      {/* Attack type */}
      <span
        className="text-xs font-medium w-24 shrink-0 truncate"
        style={{ color: event.color || '#ff3366' }}
      >
        {event.type}
      </span>

      {/* Status badge */}
      <span
        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full shrink-0 ${
          event.blocked
            ? 'bg-cyber-green/10 text-cyber-green'
            : 'bg-cyber-red/10 text-cyber-red'
        }`}
      >
        {event.blocked ? 'Blocked' : 'Active'}
      </span>

      {/* Timestamp */}
      <div className="flex items-center gap-1 ml-auto shrink-0">
        <Clock className="w-3 h-3 text-slate-600" />
        <span className="text-[10px] font-mono text-slate-500">{timeStr}</span>
      </div>
    </motion.div>
  );
}

/**
 * AttackMapPage — World Cyber Attack Map
 *
 * Full-screen interactive page displaying a dark-themed world map with
 * live animated attack arcs, overlay stat panels, attack type distribution,
 * and a real-time scrolling event feed.
 *
 * Reads simulation state from SimulationContext and converts active attacks
 * into map-renderable attack lines with random geographic origins.
 */
export default function AttackMapPage() {
  const {
    devices,
    activeAttacks,
    protocolEnabled,
    toggleProtocol,
    events,
    stats,
  } = useSimulationContext();

  const [attackLines, setAttackLines] = useState([]);
  const [eventFeed, setEventFeed] = useState([]);
  const [attackTypeCounts, setAttackTypeCounts] = useState({});
  const attackLineMapRef = useRef(new Map());

  // Convert active attacks from context into map attack lines
  useEffect(() => {
    if (!activeAttacks || activeAttacks.length === 0) {
      setAttackLines([]);
      return;
    }

    const lineMap = attackLineMapRef.current;
    const newLines = [];

    activeAttacks.forEach((attack) => {
      const key = attack.id || attack.type + '-' + (attack.targetDevice || '');
      if (lineMap.has(key)) {
        // Update blocked status if protocol state changed
        const existing = lineMap.get(key);
        existing.blocked = protocolEnabled;
        newLines.push(existing);
      } else {
        const line = generateAttackLine(attack, protocolEnabled);
        lineMap.set(key, line);
        newLines.push(line);
      }
    });

    // Clean up old entries
    const activeKeys = new Set(
      activeAttacks.map(
        (a) => a.id || a.type + '-' + (a.targetDevice || '')
      )
    );
    for (const k of lineMap.keys()) {
      if (!activeKeys.has(k)) lineMap.delete(k);
    }

    setAttackLines(newLines);
  }, [activeAttacks, protocolEnabled]);

  // Build the scrolling event feed from attack lines (last 10)
  useEffect(() => {
    if (attackLines.length === 0) return;

    setEventFeed((prev) => {
      const existingIds = new Set(prev.map((e) => e.id));
      const newEvents = attackLines
        .filter((line) => !existingIds.has(line.id))
        .map((line) => ({
          id: line.id,
          country: line.country,
          type: line.type,
          color: line.color,
          blocked: line.blocked,
          timestamp: line.timestamp,
        }));

      if (newEvents.length === 0) return prev;

      const merged = [...newEvents, ...prev].slice(0, 10);
      return merged;
    });
  }, [attackLines]);

  // Compute attack type distribution counts
  useEffect(() => {
    const counts = {};
    eventFeed.forEach((evt) => {
      counts[evt.type] = (counts[evt.type] || 0) + 1;
    });
    setAttackTypeCounts(counts);
  }, [eventFeed]);

  // Prepare stats for the overlay panel
  const mapStats = useMemo(() => {
    const totalAttacks = stats?.blockedAttacks
      ? (stats.blockedAttacks || 0) + (activeAttacks?.length || 0)
      : eventFeed.length;
    const blockedAttacks = stats?.blockedAttacks || eventFeed.filter((e) => e.blocked).length;
    const activeThreats = activeAttacks?.filter((a) => !protocolEnabled).length || 0;
    const attacksPerMinute = Math.max(
      Math.round(((activeAttacks?.length || 0) * 60) / 10),
      eventFeed.length
    );

    return {
      totalAttacks,
      blockedAttacks,
      activeThreats,
      attacksPerMinute,
    };
  }, [stats, activeAttacks, protocolEnabled, eventFeed]);

  // Map attack definitions for the type distribution sidebar
  const typeDistribution = useMemo(() => {
    return attackDefinitions.map((def) => ({
      name: def.shortName,
      count: attackTypeCounts[def.shortName] || 0,
      color: def.color,
    }));
  }, [attackTypeCounts]);

  const totalTypeCount = useMemo(
    () => typeDistribution.reduce((sum, t) => sum + t.count, 0),
    [typeDistribution]
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#030712]">
      {/* Full-screen map layer */}
      <div className="absolute inset-0 z-0">
        <WorldMap
          attackLines={attackLines}
          protocolEnabled={protocolEnabled}
          targetLocation={targetLocation}
        />
      </div>

      {/* Overlay: top-left stats panel */}
      <div className="absolute top-4 left-4 z-[1000]">
        <AttackStats stats={mapStats} />
      </div>

      {/* Overlay: top-right attack type distribution */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-4 right-4 z-[1000] w-72"
      >
        <div className="cyber-panel p-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
            <Radio className="w-4 h-4 text-cyber-purple" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">
              Attack Distribution
            </span>
          </div>

          {/* Type list */}
          <div className="flex flex-col">
            {typeDistribution.map((type) => (
              <AttackTypeBadge
                key={type.name}
                name={type.name}
                count={type.count}
                color={type.color}
                total={totalTypeCount}
              />
            ))}
          </div>

          {/* Protocol toggle */}
          <div className="mt-3 pt-3 border-t border-slate-800">
            <button
              onClick={toggleProtocol}
              className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                protocolEnabled
                  ? 'bg-cyber-green/10 text-cyber-green border border-cyber-green/30 hover:bg-cyber-green/20'
                  : 'bg-cyber-red/10 text-cyber-red border border-cyber-red/30 hover:bg-cyber-red/20'
              }`}
            >
              {protocolEnabled ? (
                <>
                  <Shield className="w-4 h-4" />
                  Protocol Active
                </>
              ) : (
                <>
                  <ShieldOff className="w-4 h-4" />
                  Protocol Disabled
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Overlay: page title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]"
      >
        <div className="cyber-panel px-6 py-2.5 flex items-center gap-3">
          <Globe className="w-5 h-5 text-cyber-blue" />
          <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-200">
            World Cyber Attack Map
          </h1>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-red opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyber-red" />
          </span>
        </div>
      </motion.div>

      {/* Overlay: bottom event feed */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="absolute bottom-0 left-0 right-0 z-[1000]"
      >
        <div className="cyber-panel mx-4 mb-4 rounded-xl overflow-hidden">
          {/* Feed header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-900/50">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-red opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-red" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">
                Live Attack Feed
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <ChevronDown className="w-3 h-3" />
              <span className="text-[10px]">
                {eventFeed.length} events
              </span>
            </div>
          </div>

          {/* Scrolling events list */}
          <div className="max-h-48 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {eventFeed.length > 0 ? (
                eventFeed.map((event, index) => (
                  <EventFeedItem key={event.id} event={event} index={index} />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-4 py-6 text-center"
                >
                  <p className="text-xs text-slate-500">
                    No attack events detected. Monitoring...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
