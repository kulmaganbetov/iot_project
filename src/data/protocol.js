/**
 * Custom IoT Protection Protocol Definition
 *
 * Describes the 4 stages of the custom security protocol for smart home IoT.
 * This data powers the protocol visualization in the 3D scene and protocol page.
 */

export const protocolStages = [
  {
    id: 'auth',
    stage: 1,
    name: 'Device Authentication',
    shortName: 'Auth',
    description: 'Each IoT device must prove its identity using a unique device certificate and challenge-response mechanism before joining the network.',
    technicalDetails: [
      'X.509 device certificates issued during manufacturing',
      'Challenge-response using ECDSA signatures',
      'Device fingerprinting (hardware ID + firmware hash)',
      'Failed auth triggers automatic lockout after 3 attempts',
    ],
    color: '#00aaff',
    icon: 'Shield',
    duration: '~200ms',
  },
  {
    id: 'key-exchange',
    stage: 2,
    name: 'Key Exchange',
    shortName: 'Key Exchange',
    description: 'Secure key negotiation using Diffie-Hellman to establish a shared session secret without transmitting keys over the network.',
    technicalDetails: [
      'ECDHE (Elliptic Curve Diffie-Hellman Ephemeral)',
      'Perfect Forward Secrecy — new keys per session',
      'Key derivation using HKDF-SHA256',
      'Session keys rotate every 30 minutes',
    ],
    color: '#aa44ff',
    icon: 'Key',
    duration: '~150ms',
  },
  {
    id: 'encryption',
    stage: 3,
    name: 'Encrypted Communication',
    shortName: 'Encryption',
    description: 'All data between devices and the hub is encrypted using AES-256-GCM, ensuring confidentiality even if traffic is intercepted.',
    technicalDetails: [
      'AES-256-GCM authenticated encryption',
      'Unique nonce per message prevents replay attacks',
      'Lightweight encryption suitable for constrained IoT devices',
      'TLS 1.3 for device-to-cloud communication',
    ],
    color: '#00ff88',
    icon: 'Lock',
    duration: '~5ms per message',
  },
  {
    id: 'integrity',
    stage: 4,
    name: 'Integrity Verification',
    shortName: 'Integrity',
    description: 'Every message includes a cryptographic HMAC that verifies data has not been modified in transit. Anomaly detection flags unusual patterns.',
    technicalDetails: [
      'HMAC-SHA256 message authentication codes',
      'Sequence numbering prevents message reordering',
      'Anomaly detection using traffic pattern analysis',
      'Automatic quarantine of compromised devices',
    ],
    color: '#ffaa00',
    icon: 'CheckCircle',
    duration: '~2ms per verification',
  },
];

export const securityComparison = [
  {
    threat: 'Password Brute Force',
    unprotected: 'Default credentials, unlimited attempts',
    protected: 'Certificate-based auth, lockout after 3 failures',
    riskReduction: 95,
  },
  {
    threat: 'Data Interception (MITM)',
    unprotected: 'Cleartext communication, no verification',
    protected: 'AES-256-GCM encryption, mutual TLS',
    riskReduction: 99,
  },
  {
    threat: 'Unauthorized Device Access',
    unprotected: 'Open API endpoints, no access control',
    protected: 'Device certificates + RBAC + MFA',
    riskReduction: 97,
  },
  {
    threat: 'Replay Attacks',
    unprotected: 'No message freshness checks',
    protected: 'Nonce + timestamp + sequence numbers',
    riskReduction: 98,
  },
  {
    threat: 'Firmware Tampering',
    unprotected: 'Unsigned updates, no boot verification',
    protected: 'Secure boot chain + signed firmware',
    riskReduction: 96,
  },
  {
    threat: 'Network Flooding (DoS)',
    unprotected: 'No rate limiting or traffic analysis',
    protected: 'Rate limiting + anomaly detection + auto-quarantine',
    riskReduction: 88,
  },
];

export default protocolStages;
