import { Outlet, useLocation } from 'react-router-dom';
import useSimulation from '../../hooks/useSimulation';
import { SimulationProvider } from '../../context/SimulationContext';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * Route-to-title mapping.
 * Provides a human-readable page name for the Header bar.
 */
const PAGE_TITLES = {
  '/':          'Home',
  '/attack-map': 'Global Attack Map',
  '/dashboard': 'Security Dashboard',
  '/protocol':  'Protocol Visualizer',
  '/about':     'About',
};

/**
 * Layout
 *
 * Top-level shell for the IoT Security Platform. Renders the fixed
 * Sidebar, the sticky Header, and the routed page content via Outlet.
 *
 * Initialises the simulation engine (useSimulation) and distributes
 * its state to all descendants through SimulationContext, so any
 * page or widget can read device statuses, active attacks, stats,
 * and invoke control actions without prop-drilling.
 */
export default function Layout() {
  const simulation = useSimulation();
  const location   = useLocation();

  /* Derive a threat level string from the simulation stats. */
  const threatLevel = (() => {
    const { activeThreats } = simulation.stats;
    if (activeThreats >= 4) return 'critical';
    if (activeThreats >= 2) return 'high';
    if (activeThreats >= 1) return 'medium';
    return 'low';
  })();

  /* Resolve the current page title from the pathname. */
  const pageTitle =
    PAGE_TITLES[location.pathname] || 'IoT Security Platform';

  return (
    <SimulationProvider value={simulation}>
      <div className="flex min-h-screen bg-[#030712] text-slate-200">
        {/* ── Fixed sidebar ──────────────────────────────────────── */}
        <Sidebar />

        {/* ── Main area (offset by sidebar width) ────────────────── */}
        <div className="flex-1 flex flex-col ml-16 min-h-screen">
          <Header
            title={pageTitle}
            threatLevel={threatLevel}
            protocolEnabled={simulation.protocolEnabled}
            onToggleProtocol={simulation.toggleProtocol}
          />

          {/* ── Page content ───────────────────────────────────── */}
          <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SimulationProvider>
  );
}
