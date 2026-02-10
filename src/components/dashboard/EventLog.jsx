/**
 * EventLog — Live scrolling event log panel.
 *
 * Displays the most recent security events in a scrollable container.
 * New events animate in from the top using framer-motion.
 * The list auto-scrolls to show the newest entry and caps the
 * visible list at 30 items.
 *
 * @module components/dashboard/EventLog
 */

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTimestamp, severityColor } from '../../utils/helpers';

/** Maximum visible events in the log. */
const MAX_VISIBLE = 30;

/** Severity-based badge styling. */
const SEVERITY_BADGES = {
  critical: { bg: 'rgba(255, 0, 68, 0.15)', text: '#ff0044' },
  high: { bg: 'rgba(255, 51, 102, 0.15)', text: '#ff3366' },
  medium: { bg: 'rgba(255, 153, 0, 0.15)', text: '#ff9900' },
  low: { bg: 'rgba(255, 204, 0, 0.15)', text: '#ffcc00' },
  info: { bg: 'rgba(0, 204, 255, 0.15)', text: '#00ccff' },
};

/**
 * Single event row.
 */
function EventRow({ event }) {
  const severity = event.severity || 'info';
  const borderColor = severityColor(severity);
  const badge = SEVERITY_BADGES[severity] || SEVERITY_BADGES.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20, height: 0 }}
      animate={{ opacity: 1, x: 0, height: 'auto' }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-start gap-3 border-l-2 px-3 py-2"
      style={{ borderLeftColor: borderColor }}
    >
      {/* Timestamp */}
      <span className="shrink-0 pt-0.5 font-mono text-[10px] text-gray-500">
        {formatTimestamp(event.timestamp)}
      </span>

      {/* Severity badge */}
      <span
        className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
        style={{ backgroundColor: badge.bg, color: badge.text }}
      >
        {severity}
      </span>

      {/* Message */}
      <span className="min-w-0 flex-1 text-xs leading-relaxed text-gray-300">
        {event.message}
      </span>

      {/* Blocked indicator */}
      {event.blocked && (
        <span className="shrink-0 rounded bg-emerald-900/40 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
          BLOCKED
        </span>
      )}
    </motion.div>
  );
}

/**
 * @param {Object}  props
 * @param {Array}   props.events - Array of event objects with timestamp, type, message, severity.
 */
export default function EventLog({ events = [] }) {
  const scrollRef = useRef(null);

  /* Auto-scroll to the top (newest) whenever events change. */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [events]);

  const visibleEvents = events.slice(0, MAX_VISIBLE);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="flex h-full flex-col rounded-xl border border-gray-800 bg-gray-900/80 p-5 backdrop-blur-sm"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          Live Event Log
        </h3>
        <span className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-500">
          {visibleEvents.length} events
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-1 overflow-y-auto pr-1"
        style={{ maxHeight: '400px' }}
      >
        {visibleEvents.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-600">
            Waiting for events...
          </div>
        ) : (
          <AnimatePresence initial={false} mode="popLayout">
            {visibleEvents.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
