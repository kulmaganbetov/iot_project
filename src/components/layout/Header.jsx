import { useState, useEffect } from 'react';
import { Clock, ShieldCheck, ShieldOff } from 'lucide-react';

/**
 * Threat-level colour mapping.
 * Each level gets a background, text colour, and optional glow.
 */
const THREAT_COLORS = {
  low:      { bg: 'bg-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  medium:   { bg: 'bg-yellow-500/20',  text: 'text-yellow-400',  dot: 'bg-yellow-400'  },
  high:     { bg: 'bg-orange-500/20',  text: 'text-orange-400',  dot: 'bg-orange-400'  },
  critical: { bg: 'bg-red-500/20',     text: 'text-red-400',     dot: 'bg-red-400'     },
};

/**
 * Header
 *
 * Sticky top bar for the IoT Security Platform.
 * Shows the current page title (left), and on the right a live clock,
 * a colour-coded threat-level badge, and a protocol on/off toggle.
 *
 * @param {Object}   props
 * @param {string}   props.title             - Current page name.
 * @param {string}   props.threatLevel       - 'low' | 'medium' | 'high' | 'critical'
 * @param {boolean}  props.protocolEnabled   - Whether the security protocol is active.
 * @param {Function} props.onToggleProtocol  - Callback to flip the protocol state.
 */
export default function Header({
  title = 'Dashboard',
  threatLevel = 'low',
  protocolEnabled = true,
  onToggleProtocol,
}) {
  /* ── Live clock ──────────────────────────────────────────────────── */
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = time.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  /* ── Threat palette ──────────────────────────────────────────────── */
  const threat = THREAT_COLORS[threatLevel] || THREAT_COLORS.low;

  return (
    <header
      className="
        sticky top-0 z-40
        flex items-center justify-between
        h-14 px-6
        bg-[#0f172a]/80 backdrop-blur-md
        border-b border-[rgba(0,170,255,0.08)]
      "
    >
      {/* ── Left: page title ──────────────────────────────────────── */}
      <h1 className="text-base font-semibold text-white tracking-wide">
        {title}
      </h1>

      {/* ── Right: clock + threat + protocol ──────────────────────── */}
      <div className="flex items-center gap-5">
        {/* Live clock */}
        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
          <Clock size={14} className="text-slate-500" />
          <span>{formattedDate}</span>
          <span className="text-[#00aaff]">{formattedTime}</span>
        </div>

        {/* Threat level badge */}
        <div
          className={`
            flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
            ${threat.bg} ${threat.text}
          `}
        >
          <span
            className={`
              w-2 h-2 rounded-full ${threat.dot}
              ${threatLevel === 'critical' ? 'animate-pulse' : ''}
            `}
          />
          <span className="uppercase tracking-wider">
            {threatLevel}
          </span>
        </div>

        {/* Protocol toggle badge */}
        <button
          onClick={onToggleProtocol}
          className={`
            flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
            cursor-pointer transition-all duration-300 border
            ${
              protocolEnabled
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25 shadow-[0_0_10px_rgba(0,255,136,0.1)]'
                : 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25 shadow-[0_0_10px_rgba(255,51,102,0.1)]'
            }
          `}
          title={protocolEnabled ? 'Protocol is active' : 'Protocol is disabled'}
        >
          {protocolEnabled ? (
            <ShieldCheck size={14} />
          ) : (
            <ShieldOff size={14} />
          )}
          <span>
            Protocol: {protocolEnabled ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>
    </header>
  );
}
