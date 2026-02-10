import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Shield,
  Home,
  Globe,
  LayoutDashboard,
  ShieldCheck,
  Info,
} from 'lucide-react';

/**
 * Navigation link definitions.
 * Each entry maps to a route and provides an icon + label for display.
 */
const navItems = [
  { to: '/',          label: 'Home',        Icon: Home },
  { to: '/attack-map', label: 'Attack Map',  Icon: Globe },
  { to: '/dashboard', label: 'Dashboard',   Icon: LayoutDashboard },
  { to: '/protocol',  label: 'Protocol',    Icon: ShieldCheck },
  { to: '/about',     label: 'About',       Icon: Info },
];

/**
 * Sidebar
 *
 * Fixed left navigation panel for the IoT Security Platform.
 * Compact by default (64 px), expands to 240 px on hover to reveal labels.
 * Uses a dark SOC-style palette with cyber-blue active state glow.
 */
export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`
        fixed left-0 top-0 z-50 h-screen
        flex flex-col
        bg-[#0f172a] border-r border-[rgba(0,170,255,0.1)]
        transition-all duration-300 ease-in-out
        ${expanded ? 'w-60' : 'w-16'}
      `}
    >
      {/* ── Brand / Logo ──────────────────────────────────────────────── */}
      <div className="flex items-center h-16 px-4 gap-3 border-b border-[rgba(0,170,255,0.1)]">
        <Shield
          size={28}
          className="text-[#00aaff] shrink-0 drop-shadow-[0_0_6px_rgba(0,170,255,0.5)]"
        />
        <span
          className={`
            text-sm font-bold tracking-wide text-white whitespace-nowrap
            transition-opacity duration-300
            ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}
          `}
        >
          IoT Shield
        </span>
      </div>

      {/* ── Navigation Links ──────────────────────────────────────────── */}
      <nav className="flex-1 flex flex-col gap-1 py-4 px-2">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `
              group relative flex items-center gap-3 px-3 py-2.5 rounded-lg
              transition-all duration-200 no-underline
              ${
                isActive
                  ? 'bg-[rgba(0,170,255,0.12)] text-[#00aaff] shadow-[0_0_12px_rgba(0,170,255,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-[rgba(255,255,255,0.04)]'
              }
            `}
          >
            {({ isActive }) => (
              <>
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r bg-[#00aaff] shadow-[0_0_8px_rgba(0,170,255,0.6)]" />
                )}

                <Icon
                  size={20}
                  className={`shrink-0 transition-all duration-200 ${
                    isActive
                      ? 'drop-shadow-[0_0_6px_rgba(0,170,255,0.5)]'
                      : 'group-hover:scale-110'
                  }`}
                />

                <span
                  className={`
                    text-sm font-medium whitespace-nowrap
                    transition-opacity duration-300
                    ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}
                  `}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Version Tag ───────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-t border-[rgba(0,170,255,0.1)]">
        <span
          className={`
            text-[10px] text-slate-600 font-mono
            transition-opacity duration-300
            ${expanded ? 'opacity-100' : 'opacity-0'}
          `}
        >
          v1.0
        </span>
      </div>
    </aside>
  );
}
