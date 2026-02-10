import { createContext, useContext } from 'react';

/**
 * SimulationContext
 *
 * Provides global simulation state and control functions to all
 * components in the IoT Security Platform. This context is populated
 * by the useSimulation hook in the Layout component and consumed
 * by any descendant that needs access to device statuses, active
 * attacks, protocol state, or simulation controls.
 */
const SimulationContext = createContext(null);

/**
 * SimulationProvider
 *
 * Wraps children with the simulation context value.
 * The `value` prop should contain the full return value of useSimulation():
 *
 *  - devices           : Array of device objects with current status
 *  - attacks           : Array of currently active attack objects
 *  - protocolEnabled   : Boolean indicating whether the security protocol is on
 *  - threatLevel       : 'low' | 'medium' | 'high' | 'critical'
 *  - stats             : { totalDevices, secureDevices, compromisedDevices, blockedAttacks }
 *  - toggleProtocol    : Function to toggle the security protocol on/off
 *  - launchAttack      : Function(attackTypeId) to manually trigger a simulated attack
 *  - resetSimulation   : Function to reset all devices to secure state
 *  - simulationRunning : Boolean indicating if the auto-simulation loop is active
 *  - setSimulationRunning : Function to start/stop the auto-simulation
 */
export function SimulationProvider({ value, children }) {
  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

/**
 * useSimulationContext
 *
 * Custom hook for consuming simulation context. Throws a descriptive
 * error if used outside of a SimulationProvider.
 */
export function useSimulationContext() {
  const context = useContext(SimulationContext);
  if (context === null) {
    throw new Error(
      'useSimulationContext must be used within a <SimulationProvider>. ' +
      'Wrap your component tree with <Layout> or <SimulationProvider>.'
    );
  }
  return context;
}

export default SimulationContext;
