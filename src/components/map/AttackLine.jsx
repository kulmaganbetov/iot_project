import { useState, useEffect, useRef, useMemo } from 'react';
import { Polyline, CircleMarker } from 'react-leaflet';

/**
 * computeArcPath
 *
 * Generates a curved polyline between two geographic coordinates.
 * The arc is created by inserting intermediate points that are offset
 * above the great-circle midpoint, giving a visually appealing parabolic
 * trajectory. The arc height is proportional to the distance between
 * the origin and target.
 */
function computeArcPath(from, to, segments = 40) {
  const points = [];
  const midLat = (from.lat + to.lat) / 2;
  const midLng = (from.lng + to.lng) / 2;

  // Calculate distance-based arc height
  const dLat = to.lat - from.lat;
  const dLng = to.lng - from.lng;
  const distance = Math.sqrt(dLat * dLat + dLng * dLng);
  const arcHeight = Math.min(distance * 0.3, 25);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Quadratic bezier interpolation: P = (1-t)^2*P0 + 2*(1-t)*t*Pmid + t^2*P1
    const controlLat = midLat + arcHeight;
    const controlLng = midLng;

    const lat =
      (1 - t) * (1 - t) * from.lat +
      2 * (1 - t) * t * controlLat +
      t * t * to.lat;
    const lng =
      (1 - t) * (1 - t) * from.lng +
      2 * (1 - t) * t * controlLng +
      t * t * to.lng;

    points.push([lat, lng]);
  }

  return points;
}

/**
 * AttackLine — Animated Arc Attack Line
 *
 * Renders a curved polyline from an attack origin to the target on the
 * Leaflet map. The line animates via a cycling dashOffset to create a
 * "traveling" flow effect. Active (unblocked) attacks pulse in red;
 * blocked attacks briefly flash green then fade out.
 *
 * Props:
 *  - from:    { lat, lng } origin coordinates
 *  - to:      { lat, lng } target coordinates
 *  - color:   stroke color (defaults based on blocked status)
 *  - blocked: boolean, whether this attack was blocked
 *  - id:      unique key for the attack line
 */
export default function AttackLine({ from, to, color, blocked, id }) {
  const [dashOffset, setDashOffset] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [lineColor, setLineColor] = useState(color || '#ff3366');
  const frameRef = useRef(null);
  const mountedRef = useRef(true);

  // Memoize the arc path so it does not recompute every render
  const arcPath = useMemo(() => computeArcPath(from, to), [from, to]);

  // Animate the dash offset to create a flowing effect along the arc
  useEffect(() => {
    mountedRef.current = true;
    let startTime = null;

    // Fade in
    setOpacity(0);
    const fadeIn = setTimeout(() => {
      if (mountedRef.current) setOpacity(0.85);
    }, 50);

    function animate(timestamp) {
      if (!mountedRef.current) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Cycle the dash offset for the flowing animation
      const offset = (elapsed * 0.05) % 200;
      setDashOffset(offset);

      frameRef.current = requestAnimationFrame(animate);
    }

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      mountedRef.current = false;
      clearTimeout(fadeIn);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [id]);

  // Handle blocked attack: flash green then fade out
  useEffect(() => {
    if (!blocked) {
      setLineColor(color || '#ff3366');
      return;
    }

    // Flash green
    setLineColor('#00ff88');
    setOpacity(1);

    const fadeTimer = setTimeout(() => {
      if (mountedRef.current) {
        setOpacity(0.3);
      }
    }, 400);

    const removeTimer = setTimeout(() => {
      if (mountedRef.current) {
        setOpacity(0);
      }
    }, 1200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [blocked, color]);

  const dashArray = blocked ? '8 12' : '12 8';

  return (
    <>
      {/* Glow underlay — wider, more transparent line for a neon glow */}
      <Polyline
        positions={arcPath}
        pathOptions={{
          color: lineColor,
          weight: 5,
          opacity: opacity * 0.25,
          dashArray: null,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />

      {/* Main animated line */}
      <Polyline
        positions={arcPath}
        pathOptions={{
          color: lineColor,
          weight: 2,
          opacity: opacity,
          dashArray: dashArray,
          dashOffset: String(dashOffset),
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />

      {/* Origin pulse marker */}
      <CircleMarker
        center={[from.lat, from.lng]}
        radius={4}
        pathOptions={{
          color: lineColor,
          fillColor: lineColor,
          fillOpacity: opacity * 0.7,
          weight: 1,
          opacity: opacity,
        }}
      />

      {/* Outer glow ring at origin */}
      <CircleMarker
        center={[from.lat, from.lng]}
        radius={8}
        pathOptions={{
          color: lineColor,
          fillColor: lineColor,
          fillOpacity: opacity * 0.15,
          weight: 1,
          opacity: opacity * 0.4,
        }}
      />
    </>
  );
}
