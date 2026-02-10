/**
 * useSimulation — core hook for the IoT attack-simulation engine.
 *
 * Manages the full lifecycle of simulated attacks against a set of IoT
 * devices. The hook owns all mutable simulation state and exposes both
 * the state and a set of imperative actions to the consuming component.
 *
 * Key behaviours
 * ──────────────
 * - Auto-generates random attack events every 2-4 seconds.
 * - When the security protocol is **enabled**, incoming attacks are
 *   marked `blocked: true` and devices stay in `secure` status.
 * - When the protocol is **disabled**, attacks succeed and targeted
 *   devices transition to `warning` or `compromised` status.
 * - The event log is capped at 50 entries (FIFO).
 * - Aggregate stats (total, blocked, active threats, attacks/min) are
 *   recomputed on every state change.
 *
 * @module hooks/useSimulation
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { devices as initialDevices, STATUS } from '../data/devices';
import { attackDefinitions, ATTACK_TYPES } from '../data/attacks';
import { generateId, randomBetween, randomElement } from '../utils/helpers';

/** Maximum number of entries kept in the event log. */
const MAX_EVENTS = 50;

/**
 * Build the initial device state by adding a runtime `status` field
 * to each static device record.
 *
 * @returns {Array<Object>} Devices enriched with a `status` property.
 */
function buildInitialDevices() {
  return initialDevices.map((device) => ({
    ...device,
    status: STATUS.SECURE,
  }));
}

/**
 * Custom React hook that drives the entire attack simulation.
 *
 * @returns {{
 *   devices: Array<Object>,
 *   activeAttacks: Array<Object>,
 *   protocolEnabled: boolean,
 *   events: Array<Object>,
 *   stats: { totalAttacks: number, blockedAttacks: number, activeThreats: number, attacksPerMinute: number },
 *   startAttack: (attackType: string) => void,
 *   stopAttack: (attackId: string) => void,
 *   toggleProtocol: () => void,
 *   clearEvents: () => void,
 * }}
 */
export default function useSimulation() {
  /* ── state ─────────────────────────────────────────────────────────── */

  const [devices, setDevices] = useState(buildInitialDevices);
  const [activeAttacks, setActiveAttacks] = useState([]);
  const [protocolEnabled, setProtocolEnabled] = useState(true);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalAttacks: 0,
    blockedAttacks: 0,
    activeThreats: 0,
    attacksPerMinute: 0,
  });

  /**
   * Track timestamps of recent attacks so we can compute a rolling
   * attacks-per-minute rate without storing the full history.
   */
  const attackTimestamps = useRef([]);

  /* ── derived / helpers ─────────────────────────────────────────────── */

  /**
   * Append an entry to the event log (capped at MAX_EVENTS).
   *
   * @param {Object} event - The event object to record.
   */
  const pushEvent = useCallback((event) => {
    setEvents((prev) => [event, ...prev].slice(0, MAX_EVENTS));
  }, []);

  /**
   * Recalculate aggregate stats from the current attack list and
   * the rolling timestamp window.
   *
   * @param {Array<Object>} attacks - Current active attacks array.
   * @param {number}        totalBlocked - Running total of blocked attacks.
   * @param {number}        total - Running total of all attacks.
   */
  const refreshStats = useCallback((attacks, total, totalBlocked) => {
    const now = Date.now();
    // Keep only timestamps from the last 60 seconds.
    attackTimestamps.current = attackTimestamps.current.filter(
      (t) => now - t < 60_000
    );

    setStats({
      totalAttacks: total,
      blockedAttacks: totalBlocked,
      activeThreats: attacks.filter((a) => !a.blocked).length,
      attacksPerMinute: attackTimestamps.current.length,
    });
  }, []);

  /* ── actions ───────────────────────────────────────────────────────── */

  /**
   * Manually start a specific attack type.
   *
   * The attack will target a randomly chosen device from its
   * `targetDevices` list.  If the protocol is active, the attack is
   * immediately marked as blocked.
   *
   * @param {string} attackType - One of the ATTACK_TYPES enum values.
   */
  const startAttack = useCallback(
    (attackType) => {
      const definition = attackDefinitions.find((a) => a.id === attackType);
      if (!definition) return;

      const targetDeviceId = randomElement(definition.targetDevices);
      const blocked = protocolEnabled;
      const now = Date.now();

      const attack = {
        id: generateId(),
        type: definition.id,
        name: definition.name,
        shortName: definition.shortName,
        severity: definition.severity,
        color: definition.color,
        targetDeviceId,
        blocked,
        timestamp: now,
      };

      attackTimestamps.current.push(now);

      setActiveAttacks((prev) => [...prev, attack]);

      /* Update device status when the attack is NOT blocked. */
      if (!blocked) {
        setDevices((prev) =>
          prev.map((d) => {
            if (d.id !== targetDeviceId) return d;
            return {
              ...d,
              status:
                definition.severity === 'critical'
                  ? STATUS.COMPROMISED
                  : STATUS.WARNING,
            };
          })
        );
      }

      /* Log the event. */
      pushEvent({
        id: generateId(),
        timestamp: now,
        attackName: definition.name,
        attackType: definition.id,
        severity: definition.severity,
        targetDeviceId,
        blocked,
        message: blocked
          ? `${definition.shortName} attack on ${targetDeviceId} blocked by protocol.`
          : `${definition.shortName} attack on ${targetDeviceId} succeeded!`,
      });

      /* Refresh stats inline — we need the latest counters. */
      setStats((prev) => {
        const total = prev.totalAttacks + 1;
        const totalBlocked = prev.blockedAttacks + (blocked ? 1 : 0);
        const threats = blocked
          ? prev.activeThreats
          : prev.activeThreats + 1;

        // Prune rolling window
        const cutoff = Date.now() - 60_000;
        attackTimestamps.current = attackTimestamps.current.filter(
          (t) => t > cutoff
        );

        return {
          totalAttacks: total,
          blockedAttacks: totalBlocked,
          activeThreats: threats,
          attacksPerMinute: attackTimestamps.current.length,
        };
      });
    },
    [protocolEnabled, pushEvent]
  );

  /**
   * Stop (dismiss) an active attack by its runtime ID.
   *
   * If the removed attack was unblocked, the targeted device is
   * returned to `secure` status (assuming no other active attacks
   * still target it).
   *
   * @param {string} attackId - The runtime `id` of the attack to remove.
   */
  const stopAttack = useCallback((attackId) => {
    setActiveAttacks((prev) => {
      const target = prev.find((a) => a.id === attackId);
      if (!target) return prev;

      const remaining = prev.filter((a) => a.id !== attackId);

      /* Restore device status if no remaining unblocked attacks target it. */
      const stillTargeted = remaining.some(
        (a) => a.targetDeviceId === target.targetDeviceId && !a.blocked
      );

      if (!target.blocked && !stillTargeted) {
        setDevices((prevDevices) =>
          prevDevices.map((d) =>
            d.id === target.targetDeviceId
              ? { ...d, status: STATUS.SECURE }
              : d
          )
        );
      }

      return remaining;
    });

    /* Recount active threats. */
    setStats((prev) => ({
      ...prev,
      activeThreats: Math.max(0, prev.activeThreats - 1),
    }));
  }, []);

  /**
   * Toggle the security protocol on/off.
   *
   * When toggled **on**, all currently active unblocked attacks are
   * retroactively blocked and devices are restored to secure.
   *
   * When toggled **off**, existing blocked attacks stay as-is but
   * future attacks will succeed.
   */
  const toggleProtocol = useCallback(() => {
    setProtocolEnabled((prev) => {
      const next = !prev;

      if (next) {
        /* Protocol just turned ON — block all active attacks, heal devices. */
        setActiveAttacks((attacks) =>
          attacks.map((a) => ({ ...a, blocked: true }))
        );
        setDevices((devs) =>
          devs.map((d) => ({ ...d, status: STATUS.SECURE }))
        );
        setStats((s) => ({
          ...s,
          activeThreats: 0,
          blockedAttacks: s.blockedAttacks + s.activeThreats,
        }));

        pushEvent({
          id: generateId(),
          timestamp: Date.now(),
          attackName: 'Protocol',
          attackType: 'system',
          severity: 'info',
          targetDeviceId: null,
          blocked: false,
          message: 'Security protocol ENABLED — all active threats neutralized.',
        });
      } else {
        pushEvent({
          id: generateId(),
          timestamp: Date.now(),
          attackName: 'Protocol',
          attackType: 'system',
          severity: 'high',
          targetDeviceId: null,
          blocked: false,
          message: 'Security protocol DISABLED — devices are now vulnerable.',
        });
      }

      return next;
    });
  }, [pushEvent]);

  /**
   * Clear the entire event log.
   */
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  /* ── auto-generation interval ──────────────────────────────────────── */

  useEffect(() => {
    let timeoutId;

    /**
     * Schedule the next random attack after a 2-4 second delay.
     * Uses recursive setTimeout so each interval is independently random.
     */
    const scheduleNext = () => {
      const delay = randomBetween(2000, 4000);
      timeoutId = setTimeout(() => {
        const definition = randomElement(attackDefinitions);
        startAttack(definition.id);
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => clearTimeout(timeoutId);
  }, [startAttack]);

  /* ── public API ────────────────────────────────────────────────────── */

  return {
    devices,
    activeAttacks,
    protocolEnabled,
    events,
    stats,
    startAttack,
    stopAttack,
    toggleProtocol,
    clearEvents,
  };
}
