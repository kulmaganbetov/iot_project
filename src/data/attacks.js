/**
 * Attack Type Definitions
 *
 * Defines the IoT attack types demonstrated in the platform.
 * Each attack type includes metadata about how it works, which devices
 * it targets, and how it's visualized in the 3D scene.
 *
 * These are SIMULATED attacks for educational demonstration only.
 */

export const ATTACK_TYPES = {
  BRUTE_FORCE: 'brute_force',
  MITM: 'man_in_the_middle',
  UNAUTHORIZED_ACCESS: 'unauthorized_access',
  DOS: 'denial_of_service',
  REPLAY: 'replay_attack',
  FIRMWARE_EXPLOIT: 'firmware_exploit',
};

export const attackDefinitions = [
  {
    id: ATTACK_TYPES.BRUTE_FORCE,
    name: 'Brute Force Attack',
    shortName: 'Brute Force',
    description: 'Automated password guessing against device authentication.',
    targetDevices: ['camera-01', 'lock-01', 'router-01'],
    severity: 'high',
    color: '#ff3366',
    protocolBlock: 'Authentication layer blocks after 3 failed attempts and triggers alert.',
    mitreTactic: 'Credential Access (T1110)',
  },
  {
    id: ATTACK_TYPES.MITM,
    name: 'Man-in-the-Middle',
    shortName: 'MITM',
    description: 'Attacker intercepts communication between IoT device and hub.',
    targetDevices: ['thermostat-01', 'camera-01', 'router-01'],
    severity: 'critical',
    color: '#ff0044',
    protocolBlock: 'Encrypted tunnel with mutual TLS prevents interception.',
    mitreTactic: 'Collection (T1557)',
  },
  {
    id: ATTACK_TYPES.UNAUTHORIZED_ACCESS,
    name: 'Unauthorized Access',
    shortName: 'Unauth Access',
    description: 'Exploiting default credentials or API weaknesses.',
    targetDevices: ['lock-01', 'light-01', 'thermostat-01'],
    severity: 'high',
    color: '#ff6600',
    protocolBlock: 'Multi-factor device authentication and RBAC deny unauthorized requests.',
    mitreTactic: 'Initial Access (T1078)',
  },
  {
    id: ATTACK_TYPES.DOS,
    name: 'Denial of Service',
    shortName: 'DoS',
    description: 'Flooding device with requests to make it unresponsive.',
    targetDevices: ['router-01', 'camera-01'],
    severity: 'medium',
    color: '#ff9900',
    protocolBlock: 'Rate limiting and traffic analysis detect anomalous patterns.',
    mitreTactic: 'Impact (T1499)',
  },
  {
    id: ATTACK_TYPES.REPLAY,
    name: 'Replay Attack',
    shortName: 'Replay',
    description: 'Capturing and retransmitting valid commands.',
    targetDevices: ['lock-01', 'light-01'],
    severity: 'high',
    color: '#cc3399',
    protocolBlock: 'Nonce-based message authentication ensures each command is unique.',
    mitreTactic: 'Credential Access (T1040)',
  },
  {
    id: ATTACK_TYPES.FIRMWARE_EXPLOIT,
    name: 'Firmware Exploit',
    shortName: 'Firmware',
    description: 'Exploiting vulnerabilities in outdated device firmware.',
    targetDevices: ['motion-01', 'camera-01', 'thermostat-01'],
    severity: 'critical',
    color: '#ff0066',
    protocolBlock: 'Secure boot chain and signed firmware updates prevent exploitation.',
    mitreTactic: 'Execution (T1195)',
  },
];

export const attackOrigins = [
  { country: 'China', lat: 39.9, lng: 116.4, weight: 0.25 },
  { country: 'Russia', lat: 55.75, lng: 37.62, weight: 0.20 },
  { country: 'USA', lat: 38.9, lng: -77.04, weight: 0.10 },
  { country: 'Brazil', lat: -15.8, lng: -47.9, weight: 0.08 },
  { country: 'India', lat: 28.6, lng: 77.2, weight: 0.07 },
  { country: 'Iran', lat: 35.7, lng: 51.4, weight: 0.06 },
  { country: 'North Korea', lat: 39.0, lng: 125.8, weight: 0.05 },
  { country: 'Nigeria', lat: 9.06, lng: 7.49, weight: 0.04 },
  { country: 'Vietnam', lat: 21.03, lng: 105.85, weight: 0.04 },
  { country: 'Turkey', lat: 39.93, lng: 32.86, weight: 0.03 },
  { country: 'Germany', lat: 52.52, lng: 13.41, weight: 0.03 },
  { country: 'Romania', lat: 44.43, lng: 26.1, weight: 0.03 },
  { country: 'Ukraine', lat: 50.45, lng: 30.52, weight: 0.02 },
];

export const targetLocation = { lat: 51.1, lng: 71.4, city: 'Astana, Kazakhstan' };

export default attackDefinitions;
