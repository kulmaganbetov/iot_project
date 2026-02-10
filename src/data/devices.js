/**
 * IoT Device Registry
 *
 * Defines all smart home IoT devices used in the 3D visualization.
 * Each device has a type, position in 3D space, and security metadata.
 * This data drives the Three.js scene and the security dashboard.
 */

export const DEVICE_TYPES = {
  CAMERA: 'camera',
  DOOR_LOCK: 'door_lock',
  THERMOSTAT: 'thermostat',
  MOTION_SENSOR: 'motion_sensor',
  SMART_LIGHT: 'smart_light',
  ROUTER: 'router',
};

export const STATUS = {
  SECURE: 'secure',
  WARNING: 'warning',
  COMPROMISED: 'compromised',
};

export const devices = [
  {
    id: 'router-01',
    name: 'Wi-Fi Router',
    type: DEVICE_TYPES.ROUTER,
    position: [0, 1.2, 0],
    description: 'Central hub — routes all smart home traffic',
    firmware: 'v3.2.1',
    protocol: 'WPA3',
    vulnerabilities: ['Default credentials', 'Open management port'],
    icon: 'Wifi',
  },
  {
    id: 'camera-01',
    name: 'Smart Camera',
    type: DEVICE_TYPES.CAMERA,
    position: [2.5, 2.0, 1.5],
    description: 'IP surveillance camera — entrance monitoring',
    firmware: 'v1.4.0',
    protocol: 'RTSP',
    vulnerabilities: ['Unencrypted video stream', 'Weak authentication'],
    icon: 'Camera',
  },
  {
    id: 'lock-01',
    name: 'Smart Door Lock',
    type: DEVICE_TYPES.DOOR_LOCK,
    position: [3.0, 1.0, 0],
    description: 'Electronic lock with remote access',
    firmware: 'v2.1.0',
    protocol: 'BLE/Zigbee',
    vulnerabilities: ['Replay attack vector', 'BLE sniffing'],
    icon: 'Lock',
  },
  {
    id: 'thermostat-01',
    name: 'Smart Thermostat',
    type: DEVICE_TYPES.THERMOSTAT,
    position: [-2.0, 1.5, 1.0],
    description: 'Climate control with remote scheduling',
    firmware: 'v1.8.3',
    protocol: 'Z-Wave',
    vulnerabilities: ['Insecure API endpoint', 'No certificate pinning'],
    icon: 'Thermometer',
  },
  {
    id: 'motion-01',
    name: 'Motion Sensor',
    type: DEVICE_TYPES.MOTION_SENSOR,
    position: [0, 2.8, -2.0],
    description: 'PIR motion detector for security system',
    firmware: 'v1.0.2',
    protocol: 'Zigbee',
    vulnerabilities: ['Signal jamming', 'No tamper detection'],
    icon: 'Activity',
  },
  {
    id: 'light-01',
    name: 'Smart Light',
    type: DEVICE_TYPES.SMART_LIGHT,
    position: [-1.5, 2.5, -1.0],
    description: 'RGB smart bulb with scheduling',
    firmware: 'v2.0.1',
    protocol: 'Wi-Fi',
    vulnerabilities: ['Network enumeration via bulb', 'Cleartext commands'],
    icon: 'Lightbulb',
  },
];

export default devices;
