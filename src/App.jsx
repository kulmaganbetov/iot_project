// Main App component for the IoT Security Platform.
// Defines the top-level route structure. Every route is nested inside
// the Layout component so that the shared header, sidebar, and footer
// are rendered on every page.

import { Routes, Route } from 'react-router-dom';

// Shared layout wrapper (header, sidebar, footer, etc.)
import Layout from './components/layout/Layout';

// Page-level components
import HomePage from './pages/HomePage';
import AttackMapPage from './pages/AttackMapPage';
import DashboardPage from './pages/DashboardPage';
import ProtocolPage from './pages/ProtocolPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Routes>
      {/* Layout wraps every page via its nested <Outlet /> */}
      <Route path="/" element={<Layout />}>
        {/* Default landing page */}
        <Route index element={<HomePage />} />

        {/* Real-time global attack visualisation */}
        <Route path="attack-map" element={<AttackMapPage />} />

        {/* Device and network security dashboard */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* IoT protocol analysis page */}
        <Route path="protocol" element={<ProtocolPage />} />

        {/* About / information page */}
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}

export default App;
