/**
 * Utility helpers for the IoT Security Platform.
 *
 * Pure, stateless functions used across components, hooks, and pages.
 * No side-effects — safe to call from render paths.
 */

/**
 * Format a Date object (or timestamp) to a 24-hour HH:MM:SS string.
 *
 * @param {Date|number|string} date - A Date instance, Unix-ms timestamp, or
 *   date string parseable by the Date constructor.
 * @returns {string} Formatted time string, e.g. "14:07:03".
 */
export function formatTimestamp(date) {
  const d = date instanceof Date ? date : new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Return a random number between `min` (inclusive) and `max` (inclusive).
 *
 * Works with integers and floats. When both arguments are integers the
 * result is an integer; otherwise it may be a float.
 *
 * @param {number} min - Lower bound (inclusive).
 * @param {number} max - Upper bound (inclusive).
 * @returns {number} A random number in the range [min, max].
 */
export function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick a random element from the given array.
 *
 * @template T
 * @param {T[]} array - A non-empty array.
 * @returns {T} A randomly selected element.
 */
export function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a random hexadecimal identifier string.
 *
 * The ID is 16 hex characters long (8 random bytes), which gives
 * ~18 quintillion possible values — sufficient for client-side uniqueness.
 *
 * @returns {string} A random hex string, e.g. "a3f1b90c4e27d685".
 */
export function generateId() {
  return Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

/**
 * Map a severity label to a CSS colour string.
 *
 * Used by badges, chart legends, and event-log highlights.
 *
 * @param {'critical'|'high'|'medium'|'low'|'info'} severity
 * @returns {string} A hex colour code.
 */
export function severityColor(severity) {
  const map = {
    critical: '#ff0044',
    high: '#ff3366',
    medium: '#ff9900',
    low: '#ffcc00',
    info: '#00ccff',
  };
  return map[severity] || '#888888';
}

/**
 * Map a device status to a CSS colour string.
 *
 * Mirrors the STATUS enum from `../data/devices.js`.
 *
 * @param {'secure'|'warning'|'compromised'} status
 * @returns {string} A hex colour code.
 */
export function statusColor(status) {
  const map = {
    secure: '#00ff88',
    warning: '#ff9900',
    compromised: '#ff0044',
  };
  return map[status] || '#888888';
}
