/**
 * useAttackMap — real-time attack-line generator for the world map.
 *
 * Produces a stream of animated "attack lines" that fly from random
 * global origins to the target location.  Each line represents a
 * simulated attack event and carries metadata (type, blocked status,
 * country of origin) used by the map visualisation layer.
 *
 * The hook keeps at most 20 active lines and automatically prunes
 * older ones, giving the map a steady heartbeat of activity without
 * unbounded memory growth.
 *
 * @module hooks/useAttackMap
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  attackOrigins,
  attackDefinitions,
  targetLocation,
} from '../data/attacks';
import { generateId, randomBetween, randomElement } from '../utils/helpers';

/** Maximum number of attack lines visible on the map at once. */
const MAX_LINES = 20;

/**
 * Pick an origin weighted by the `weight` field so higher-weight
 * countries are selected more often.
 *
 * @param {Array<{country: string, lat: number, lng: number, weight: number}>} origins
 * @returns {{country: string, lat: number, lng: number, weight: number}}
 */
function weightedRandomOrigin(origins) {
  const totalWeight = origins.reduce((sum, o) => sum + o.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const origin of origins) {
    roll -= origin.weight;
    if (roll <= 0) return origin;
  }

  // Fallback (should never happen unless weights are zero).
  return origins[origins.length - 1];
}

/**
 * Custom hook that continuously generates attack-map lines.
 *
 * @param {boolean} [protocolEnabled=true] - When `true`, generated
 *   attacks are marked as `blocked`.  Mirrors the simulation protocol
 *   toggle so the map stays in sync with the dashboard.
 *
 * @returns {{
 *   attackLines: Array<{
 *     id: string,
 *     from: { lat: number, lng: number, country: string },
 *     to: { lat: number, lng: number, city: string },
 *     type: string,
 *     timestamp: number,
 *     blocked: boolean,
 *   }>,
 *   stats: {
 *     total: number,
 *     blocked: number,
 *     activeThreats: number,
 *   },
 * }}
 */
export default function useAttackMap(protocolEnabled = true) {
  const [attackLines, setAttackLines] = useState([]);

  /** Cumulative counters that persist across prune cycles. */
  const counters = useRef({ total: 0, blocked: 0 });

  /**
   * Create a single attack line object.
   *
   * @returns {Object} A new attack-line record.
   */
  const createAttackLine = useCallback(() => {
    const origin = weightedRandomOrigin(attackOrigins);
    const definition = randomElement(attackDefinitions);
    const blocked = protocolEnabled;

    counters.current.total += 1;
    if (blocked) counters.current.blocked += 1;

    return {
      id: generateId(),
      from: {
        lat: origin.lat,
        lng: origin.lng,
        country: origin.country,
      },
      to: targetLocation,
      type: definition.id,
      name: definition.shortName,
      severity: definition.severity,
      color: definition.color,
      timestamp: Date.now(),
      blocked,
    };
  }, [protocolEnabled]);

  /* ── generation interval ───────────────────────────────────────────── */

  useEffect(() => {
    let timeoutId;

    /**
     * Schedule the next attack line after a random 1-3 second pause.
     * Uses recursive setTimeout for a non-uniform cadence that feels
     * more organic than a fixed setInterval.
     */
    const scheduleNext = () => {
      const delay = randomBetween(1000, 3000);
      timeoutId = setTimeout(() => {
        setAttackLines((prev) => {
          const next = [...prev, createAttackLine()];
          // Trim to MAX_LINES, dropping the oldest entries first.
          return next.length > MAX_LINES ? next.slice(-MAX_LINES) : next;
        });
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => clearTimeout(timeoutId);
  }, [createAttackLine]);

  /* ── derived stats ─────────────────────────────────────────────────── */

  const stats = {
    total: counters.current.total,
    blocked: counters.current.blocked,
    activeThreats: attackLines.filter((line) => !line.blocked).length,
  };

  /* ── public API ────────────────────────────────────────────────────── */

  return { attackLines, stats };
}
