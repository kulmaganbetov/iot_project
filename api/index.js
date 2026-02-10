import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

/**
 * Simulated IoT device inventory.
 * Each device represents a node on the monitored network and carries
 * identifying metadata together with its current operational status.
 *
 * @type {Array<{id: string, name: string, type: string, status: string, firmware: string, protocol: string}>}
 */
const devices = [
  {
    id: 'dev-001',
    name: 'Smart Thermostat Hub',
    type: 'thermostat',
    status: 'online',
    firmware: 'v2.4.1',
    protocol: 'MQTT',
  },
  {
    id: 'dev-002',
    name: 'IP Camera - Front Entrance',
    type: 'camera',
    status: 'online',
    firmware: 'v3.1.0',
    protocol: 'RTSP',
  },
  {
    id: 'dev-003',
    name: 'Industrial PLC Controller',
    type: 'plc',
    status: 'warning',
    firmware: 'v1.8.7',
    protocol: 'Modbus',
  },
  {
    id: 'dev-004',
    name: 'Smart Door Lock - Main',
    type: 'lock',
    status: 'online',
    firmware: 'v4.0.2',
    protocol: 'Zigbee',
  },
  {
    id: 'dev-005',
    name: 'Environmental Sensor Array',
    type: 'sensor',
    status: 'offline',
    firmware: 'v1.2.0',
    protocol: 'CoAP',
  },
  {
    id: 'dev-006',
    name: 'Network Gateway Bridge',
    type: 'gateway',
    status: 'online',
    firmware: 'v5.3.1',
    protocol: 'AMQP',
  },
  {
    id: 'dev-007',
    name: 'Smart Plug - Server Room',
    type: 'plug',
    status: 'online',
    firmware: 'v2.0.5',
    protocol: 'Z-Wave',
  },
  {
    id: 'dev-008',
    name: 'HVAC Control Unit',
    type: 'hvac',
    status: 'warning',
    firmware: 'v3.6.4',
    protocol: 'BACnet',
  },
];

/**
 * Simulated recent attack events detected by the security platform.
 * Each entry describes a single observed intrusion attempt or anomalous
 * activity, including whether the platform successfully blocked it.
 *
 * @type {Array<{id: string, type: string, source: string, target: string, timestamp: string, blocked: boolean}>}
 */
const attacks = [
  {
    id: 'atk-001',
    type: 'Brute Force',
    source: '203.0.113.42',
    target: 'dev-004',
    timestamp: '2026-02-10T08:14:32Z',
    blocked: true,
  },
  {
    id: 'atk-002',
    type: 'MQTT Injection',
    source: '198.51.100.17',
    target: 'dev-001',
    timestamp: '2026-02-10T08:22:11Z',
    blocked: true,
  },
  {
    id: 'atk-003',
    type: 'Firmware Tampering',
    source: '192.0.2.88',
    target: 'dev-003',
    timestamp: '2026-02-10T08:45:05Z',
    blocked: false,
  },
  {
    id: 'atk-004',
    type: 'DDoS Flood',
    source: '203.0.113.200',
    target: 'dev-006',
    timestamp: '2026-02-10T09:01:47Z',
    blocked: true,
  },
  {
    id: 'atk-005',
    type: 'Man-in-the-Middle',
    source: '198.51.100.55',
    target: 'dev-002',
    timestamp: '2026-02-10T09:15:23Z',
    blocked: true,
  },
  {
    id: 'atk-006',
    type: 'Replay Attack',
    source: '192.0.2.134',
    target: 'dev-007',
    timestamp: '2026-02-10T09:33:58Z',
    blocked: false,
  },
  {
    id: 'atk-007',
    type: 'Port Scanning',
    source: '203.0.113.77',
    target: 'dev-006',
    timestamp: '2026-02-10T09:48:12Z',
    blocked: true,
  },
  {
    id: 'atk-008',
    type: 'SQL Injection',
    source: '198.51.100.99',
    target: 'dev-008',
    timestamp: '2026-02-10T10:02:36Z',
    blocked: true,
  },
  {
    id: 'atk-009',
    type: 'Credential Stuffing',
    source: '192.0.2.201',
    target: 'dev-004',
    timestamp: '2026-02-10T10:17:44Z',
    blocked: true,
  },
  {
    id: 'atk-010',
    type: 'Zero-Day Exploit',
    source: '203.0.113.150',
    target: 'dev-003',
    timestamp: '2026-02-10T10:31:09Z',
    blocked: false,
  },
];

/**
 * Mutable security-protocol state.
 * `enabled` tracks whether the protection protocol is currently active.
 * `stages` enumerates the discrete phases of the protocol and whether
 * each has completed its initialisation sequence.
 *
 * NOTE: Because Vercel serverless functions are stateless across invocations
 * the toggled state will only persist for the lifetime of a single warm
 * instance.  For production use, back this with a database or KV store.
 *
 * @type {{enabled: boolean, stages: Array<{name: string, completed: boolean}>}}
 */
let protocolStatus = {
  enabled: true,
  stages: [
    { name: 'Network Discovery', completed: true },
    { name: 'Vulnerability Scan', completed: true },
    { name: 'Firewall Configuration', completed: true },
    { name: 'Intrusion Detection Activation', completed: false },
    { name: 'Anomaly Baseline Calibration', completed: false },
  ],
};

/**
 * Simulated security event log entries.
 * These entries represent a chronological stream of notable occurrences
 * across the monitored IoT infrastructure, ranging from informational
 * notices to critical alerts.
 *
 * @type {Array<{id: string, timestamp: string, level: string, source: string, message: string}>}
 */
const events = [
  {
    id: 'evt-001',
    timestamp: '2026-02-10T07:00:00Z',
    level: 'info',
    source: 'system',
    message: 'Security platform initialised successfully.',
  },
  {
    id: 'evt-002',
    timestamp: '2026-02-10T07:05:12Z',
    level: 'info',
    source: 'dev-006',
    message: 'Network Gateway Bridge came online.',
  },
  {
    id: 'evt-003',
    timestamp: '2026-02-10T07:30:45Z',
    level: 'warning',
    source: 'dev-003',
    message: 'Industrial PLC Controller reported outdated firmware (v1.8.7).',
  },
  {
    id: 'evt-004',
    timestamp: '2026-02-10T08:14:32Z',
    level: 'critical',
    source: 'ids',
    message: 'Brute force attack detected on Smart Door Lock from 203.0.113.42 — blocked.',
  },
  {
    id: 'evt-005',
    timestamp: '2026-02-10T08:22:11Z',
    level: 'critical',
    source: 'ids',
    message: 'MQTT injection attempt on Smart Thermostat Hub from 198.51.100.17 — blocked.',
  },
  {
    id: 'evt-006',
    timestamp: '2026-02-10T08:45:05Z',
    level: 'critical',
    source: 'ids',
    message: 'Firmware tampering attempt on Industrial PLC Controller from 192.0.2.88 — NOT blocked.',
  },
  {
    id: 'evt-007',
    timestamp: '2026-02-10T09:00:00Z',
    level: 'info',
    source: 'system',
    message: 'Scheduled vulnerability scan started.',
  },
  {
    id: 'evt-008',
    timestamp: '2026-02-10T09:01:47Z',
    level: 'critical',
    source: 'ids',
    message: 'DDoS flood targeting Network Gateway Bridge from 203.0.113.200 — blocked.',
  },
  {
    id: 'evt-009',
    timestamp: '2026-02-10T09:15:23Z',
    level: 'critical',
    source: 'ids',
    message: 'Man-in-the-Middle attempt on IP Camera from 198.51.100.55 — blocked.',
  },
  {
    id: 'evt-010',
    timestamp: '2026-02-10T09:20:00Z',
    level: 'warning',
    source: 'dev-005',
    message: 'Environmental Sensor Array went offline — connection timeout.',
  },
  {
    id: 'evt-011',
    timestamp: '2026-02-10T09:33:58Z',
    level: 'warning',
    source: 'ids',
    message: 'Replay attack on Smart Plug from 192.0.2.134 — NOT blocked.',
  },
  {
    id: 'evt-012',
    timestamp: '2026-02-10T10:31:09Z',
    level: 'critical',
    source: 'ids',
    message: 'Zero-day exploit targeting Industrial PLC Controller from 203.0.113.150 — NOT blocked.',
  },
];

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

/**
 * GET /api/devices
 *
 * Returns the full list of registered IoT devices on the network.
 * Each device object contains:
 *   - id       {string}  Unique device identifier (e.g. "dev-001").
 *   - name     {string}  Human-readable label for the device.
 *   - type     {string}  Category of the device (thermostat, camera, plc, etc.).
 *   - status   {string}  Current operational state: "online", "offline", or "warning".
 *   - firmware {string}  Firmware version string currently running on the device.
 *   - protocol {string}  Communication protocol the device uses (MQTT, Zigbee, CoAP, etc.).
 *
 * @route   GET /api/devices
 * @returns {Array<Object>} 200 - JSON array of device objects.
 */
app.get('/api/devices', (_req, res) => {
  res.json(devices);
});

/**
 * GET /api/attacks
 *
 * Returns recent simulated attack events observed by the intrusion-detection
 * subsystem.  Each attack object contains:
 *   - id        {string}   Unique attack event identifier.
 *   - type      {string}   Classification of the attack (e.g. "Brute Force", "DDoS Flood").
 *   - source    {string}   IP address from which the attack originated.
 *   - target    {string}   Device identifier that was targeted.
 *   - timestamp {string}   ISO-8601 timestamp of when the attack was detected.
 *   - blocked   {boolean}  Whether the platform successfully mitigated the attack.
 *
 * @route   GET /api/attacks
 * @returns {Array<Object>} 200 - JSON array of attack event objects.
 */
app.get('/api/attacks', (_req, res) => {
  res.json(attacks);
});

/**
 * GET /api/attacks/stats
 *
 * Returns aggregate statistics derived from the attack event data.
 * The response object contains:
 *   - totalAttacks    {number} Total number of attack events recorded.
 *   - blockedAttacks  {number} Number of attacks that were successfully blocked.
 *   - activeThreats   {number} Number of attacks that were NOT blocked (unmitigated).
 *   - attacksPerMinute {number} Approximate attack frequency, computed as
 *                               totalAttacks divided by the elapsed minutes
 *                               between the earliest and latest event timestamps.
 *
 * The values are computed dynamically from the in-memory attacks array so
 * they will reflect any future mutations to that data set.
 *
 * @route   GET /api/attacks/stats
 * @returns {Object} 200 - JSON object with attack statistics.
 */
app.get('/api/attacks/stats', (_req, res) => {
  const totalAttacks = attacks.length;
  const blockedAttacks = attacks.filter((a) => a.blocked).length;
  const activeThreats = totalAttacks - blockedAttacks;

  // Derive a rough attacks-per-minute rate from the timestamp window.
  const timestamps = attacks.map((a) => new Date(a.timestamp).getTime());
  const earliest = Math.min(...timestamps);
  const latest = Math.max(...timestamps);
  const elapsedMinutes = Math.max((latest - earliest) / 60000, 1);
  const attacksPerMinute = parseFloat((totalAttacks / elapsedMinutes).toFixed(2));

  res.json({
    totalAttacks,
    blockedAttacks,
    activeThreats,
    attacksPerMinute,
  });
});

/**
 * GET /api/protocol/status
 *
 * Returns the current state of the security protocol, including whether it
 * is enabled and the completion status of each initialisation stage.
 * The response object contains:
 *   - enabled {boolean}                     Whether the protocol is active.
 *   - stages  {Array<{name: string, completed: boolean}>}
 *             Ordered list of protocol stages, each with a human-readable
 *             name and a boolean indicating whether that stage has finished
 *             its setup process.
 *
 * @route   GET /api/protocol/status
 * @returns {Object} 200 - JSON object describing protocol state.
 */
app.get('/api/protocol/status', (_req, res) => {
  res.json(protocolStatus);
});

/**
 * POST /api/protocol/toggle
 *
 * Toggles the security protocol between enabled and disabled states.
 * When the protocol is disabled all stage completion flags are reset to
 * false.  When it is re-enabled the first three stages are marked as
 * completed to simulate a rapid re-initialisation sequence.
 *
 * No request body is required — the server simply flips the current boolean.
 *
 * The response is the updated protocol status object, identical in shape to
 * the one returned by GET /api/protocol/status.
 *
 * NOTE: In Vercel's serverless environment, toggled state persists only
 * for the lifetime of a single warm function instance.
 *
 * @route   POST /api/protocol/toggle
 * @returns {Object} 200 - JSON object with the new protocol state.
 */
app.post('/api/protocol/toggle', (_req, res) => {
  protocolStatus.enabled = !protocolStatus.enabled;

  if (protocolStatus.enabled) {
    // Simulate rapid re-initialisation: first three stages complete immediately.
    protocolStatus.stages = protocolStatus.stages.map((stage, index) => ({
      ...stage,
      completed: index < 3,
    }));
  } else {
    // All stages reset when the protocol is disabled.
    protocolStatus.stages = protocolStatus.stages.map((stage) => ({
      ...stage,
      completed: false,
    }));
  }

  res.json(protocolStatus);
});

/**
 * GET /api/events
 *
 * Returns a chronological list of security event log entries generated by
 * the platform and its connected devices.  Each entry contains:
 *   - id        {string} Unique event identifier.
 *   - timestamp {string} ISO-8601 timestamp of the event.
 *   - level     {string} Severity level: "info", "warning", or "critical".
 *   - source    {string} Originator of the event — either "system", "ids"
 *                        (intrusion detection system), or a device id.
 *   - message   {string} Human-readable description of the event.
 *
 * @route   GET /api/events
 * @returns {Array<Object>} 200 - JSON array of event log objects.
 */
app.get('/api/events', (_req, res) => {
  res.json(events);
});

// ---------------------------------------------------------------------------
// Export for Vercel serverless deployment
// ---------------------------------------------------------------------------

/**
 * Default export for Vercel.
 * Vercel will invoke this Express app as a serverless function.
 * All routes defined above are available under the /api/* path prefix
 * matching the file's location in the project (api/index.js).
 */
export default app;
