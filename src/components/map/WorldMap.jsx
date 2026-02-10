import { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import AttackLine from './AttackLine';
import { attackOrigins } from '../../data/attacks';

/**
 * TargetPulse
 *
 * Renders the target location marker as concentric pulsing circles.
 * The color reflects whether the security protocol is enabled (green)
 * or disabled (red), giving immediate visual feedback.
 */
function TargetPulse({ position, protocolEnabled }) {
  const color = protocolEnabled ? '#00ff88' : '#ff3366';
  const label = protocolEnabled ? 'Protected Target' : 'Unprotected Target';

  return (
    <>
      {/* Outermost glow ring */}
      <CircleMarker
        center={position}
        radius={20}
        pathOptions={{
          color: color,
          fillColor: color,
          fillOpacity: 0.06,
          weight: 1,
          opacity: 0.3,
        }}
      />
      {/* Middle pulse ring */}
      <CircleMarker
        center={position}
        radius={12}
        pathOptions={{
          color: color,
          fillColor: color,
          fillOpacity: 0.12,
          weight: 1.5,
          opacity: 0.5,
          className: 'threat-pulse',
        }}
      />
      {/* Inner solid core */}
      <CircleMarker
        center={position}
        radius={5}
        pathOptions={{
          color: '#ffffff',
          fillColor: color,
          fillOpacity: 0.9,
          weight: 2,
          opacity: 1,
        }}
      >
        <Tooltip
          direction="top"
          offset={[0, -10]}
          permanent={false}
          className="!bg-slate-900 !border-slate-700 !text-slate-200 !text-xs !rounded-lg !px-3 !py-1.5"
        >
          <span className="font-semibold">{label}</span>
          <br />
          <span className="text-slate-400">Astana, Kazakhstan</span>
        </Tooltip>
      </CircleMarker>
    </>
  );
}

/**
 * OriginMarkers
 *
 * Renders subtle circle markers at each known attack origin country.
 * The marker size is weighted by the origin's relative attack volume.
 */
function OriginMarkers() {
  return (
    <>
      {attackOrigins.map((origin) => (
        <CircleMarker
          key={origin.country}
          center={[origin.lat, origin.lng]}
          radius={3 + origin.weight * 20}
          pathOptions={{
            color: '#ff336650',
            fillColor: '#ff3366',
            fillOpacity: 0.08,
            weight: 1,
            opacity: 0.3,
          }}
        >
          <Tooltip
            direction="top"
            offset={[0, -5]}
            className="!bg-slate-900 !border-slate-700 !text-slate-200 !text-xs !rounded-lg !px-2 !py-1"
          >
            {origin.country}
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
}

/**
 * WorldMap — Leaflet-based Cyber Attack Map
 *
 * Renders a full dark-themed world map using OpenStreetMap tiles
 * (inverted/styled via CSS in index.css). Overlays include:
 *
 *  - Target location pulse marker at Astana, Kazakhstan
 *  - Origin markers for all known attack source countries
 *  - Animated arc lines for each active attack
 *
 * Props:
 *  - attackLines:     Array of attack objects { id, from: {lat,lng}, to: {lat,lng}, color, blocked }
 *  - protocolEnabled: Boolean, whether the security protocol is active
 *  - targetLocation:  { lat, lng } target coordinates (default: Astana)
 */
export default function WorldMap({
  attackLines = [],
  protocolEnabled = false,
  targetLocation: target = { lat: 51.1, lng: 71.4 },
}) {
  const targetPos = useMemo(() => [target.lat, target.lng], [target.lat, target.lng]);

  return (
    <MapContainer
      center={[30, 40]}
      zoom={2}
      minZoom={2}
      maxZoom={6}
      zoomControl={true}
      scrollWheelZoom={true}
      dragging={true}
      doubleClickZoom={true}
      attributionControl={true}
      className="w-full h-full"
      style={{ background: '#0a0f1e' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Background origin markers */}
      <OriginMarkers />

      {/* Target marker with pulsing rings */}
      <TargetPulse position={targetPos} protocolEnabled={protocolEnabled} />

      {/* Animated attack arc lines */}
      {attackLines.map((attack) => (
        <AttackLine
          key={attack.id}
          id={attack.id}
          from={attack.from}
          to={attack.to}
          color={attack.color}
          blocked={attack.blocked}
        />
      ))}
    </MapContainer>
  );
}
