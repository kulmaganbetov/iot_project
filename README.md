# IoT Security Platform — Smart Home Protection

> **Web Platform for Visual Analysis of IoT Security and Demonstration of a Custom Protection Protocol for Smart Home Systems**

A highly visual, interactive web platform built as a bachelor diploma project. It demonstrates security threats in IoT smart home environments, the operation of a custom IoT protection protocol, and provides a visual comparison between unsecured and secured smart home systems.

---

## Table of Contents

- [Project Description](#project-description)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment (Vercel)](#deployment-vercel)
- [API Endpoints](#api-endpoints)
- [Academic Requirements](#academic-requirements)

---

## Project Description

### Purpose

This platform serves as an educational and demonstration tool for understanding IoT security challenges in smart home environments. It provides:

1. **Visual Threat Demonstration** — Interactive 3D visualization of common IoT attack vectors (brute force, MITM, unauthorized access, DoS, replay attacks, firmware exploits)
2. **Custom Protection Protocol** — A 4-stage security protocol (Authentication, Key Exchange, Encryption, Integrity Verification) visualized in real-time
3. **Before/After Comparison** — Toggle protection on/off to see immediate visual impact on device security

### Goals

- Make complex cybersecurity concepts accessible through visualization
- Demonstrate practical IoT security mechanisms
- Provide an interactive tool for academic presentation
- Showcase modern web development technologies

---

## Architecture

```
+-------------------------------------------------------+
|                    Frontend (React)                     |
|                                                         |
|  +----------+  +----------+  +--------------------+     |
|  |  3D Scene |  | World Map|  |  Security Dashboard |    |
|  | (Three.js)|  | (Leaflet)|  |    (Recharts)       |    |
|  +-----+----+  +-----+----+  +--------+-----------+     |
|        |              |                |                  |
|        +--------------+----------------+                  |
|                       |                                   |
|               SimulationContext                            |
|            (useSimulation hook)                            |
|                       |                                   |
|  +--------------------+-------------------------------+   |
|  |  React Router (SPA with 5 pages)                   |   |
|  |  Home | Attack Map | Dashboard | Protocol | About  |   |
|  +----------------------------------------------------+   |
+-----------------------+-----------------------------------+
                        | /api/*
               +--------+--------+
               |  Mock Backend   |
               |  (Express.js)   |
               |  /api/devices   |
               |  /api/attacks   |
               |  /api/protocol  |
               |  /api/events    |
               +-----------------+
```

### Data Flow

1. **useSimulation** hook manages all device states, attack events, and protocol status
2. **SimulationContext** distributes state to all page components
3. **3D Scene** renders devices, attack beams, data flows, and protocol shield based on state
4. **Dashboard** displays real-time KPIs, charts, and event log
5. **World Map** shows animated attack lines from global origins to the smart home

---

## Technologies

| Technology | Role | Version |
|---|---|---|
| **React** | UI framework — component-based SPA | 19.x |
| **Vite** | Build tool — fast development server and optimized builds | 7.x |
| **Three.js** | 3D rendering — smart home scene, devices, effects | 0.182 |
| **@react-three/fiber** | React renderer for Three.js | 9.x |
| **@react-three/drei** | Helpers for R3F (OrbitControls, Stars, Grid, Html) | 10.x |
| **Leaflet + react-leaflet** | Interactive world map for attack visualization | 1.9 / 5.0 |
| **Recharts** | Data visualization — line charts, pie charts | 3.x |
| **Tailwind CSS** | Utility-first CSS framework — dark SOC theme | 4.x |
| **Framer Motion** | Animation library — page transitions, element animations | 12.x |
| **Lucide React** | Icon set — consistent cybersecurity-themed iconography | 0.563 |
| **React Router** | Client-side routing between pages | 7.x |
| **Express.js** | Mock backend API server | 5.x |
| **Node.js** | Runtime for backend server | 18+ |

---

## Features

### 1. 3D Smart Home Scene (Home Page)

- **Procedural house model** built from Three.js geometry with transparent walls and glowing edges
- **6 IoT devices**: Wi-Fi Router, Smart Camera, Smart Door Lock, Thermostat, Motion Sensor, Smart Light
- **Device interaction**: hover tooltips, click for detail panel, status-colored halos
- **Attack beams**: animated red beams from external positions to targeted devices
- **Data flow lines**: animated connections between devices and router hub
- **Protocol shield dome**: hexagonal wireframe dome with pulsing animation when protection is enabled
- **Orbit controls**: rotate, zoom, and pan the 3D scene

### 2. Attack Simulation

- **6 attack types**: Brute Force, MITM, Unauthorized Access, DoS, Replay, Firmware Exploit
- **Auto-generation**: random attacks every 2-4 seconds
- **Manual triggers**: launch specific attack types from control panel
- **Visual effects**: red beams, device status changes, alert notifications
- **Blocked vs successful**: visual difference when protocol is on/off

### 3. Protection Protocol Demo

- **Toggle button**: enable/disable protocol with immediate visual feedback
- **4 protocol stages** visualized:
  1. Device Authentication (X.509 certificates, challenge-response)
  2. Key Exchange (ECDHE, Perfect Forward Secrecy)
  3. Encrypted Communication (AES-256-GCM)
  4. Integrity Verification (HMAC-SHA256, anomaly detection)
- **Visual comparison**: green data flows when protected, red attack effects when vulnerable

### 4. World Cyber Attack Map

- **Leaflet dark-themed map** with inverted tile styling
- **Animated attack arcs** from 13 global origins to Astana, Kazakhstan
- **Real-time stats overlay**: total attacks, blocked, active threats
- **Attack type distribution** panel with animated progress bars
- **Scrolling event feed** at bottom

### 5. Security Dashboard

- **4 KPI cards**: Connected Devices, Risk Level, Attacks/Min, Blocked Rate
- **Attacks over time** area chart with dual series (total vs blocked)
- **Attack types** donut chart with type distribution
- **Device status grid** with per-device health indicators
- **Live event log** with animated new entries

### 6. Protocol Description Page

- **Protocol pipeline** visualization with 4 connected stage cards
- **Security comparison table**: unprotected vs protected for each threat
- **Risk reduction** animated progress bars
- **Architecture diagram** showing device-to-hub protocol flow

### 7. About Page

- Project overview for diploma committee
- Technology stack showcase
- Architecture description
- Academic requirements mapping

---

## Project Structure

```
iot_project/
├── api/
│   └── index.js              # Vercel serverless API endpoint
├── server/
│   └── index.js              # Local Express mock server
├── src/
│   ├── components/
│   │   ├── common/           # Reusable UI components (Panel, StatusBadge)
│   │   ├── dashboard/        # Dashboard widgets (KPICard, Charts, EventLog)
│   │   ├── layout/           # App shell (Header, Sidebar, Layout)
│   │   ├── map/              # World map components (WorldMap, AttackLine, AttackStats)
│   │   └── three/            # Three.js 3D components (Scene, House, Devices, Beams, Shield)
│   ├── context/              # React Context (SimulationContext)
│   ├── data/                 # Static data (devices, attacks, protocol definitions)
│   ├── hooks/                # Custom hooks (useSimulation, useAttackMap)
│   ├── pages/                # Page components (Home, AttackMap, Dashboard, Protocol, About)
│   ├── utils/                # Utility functions
│   ├── App.jsx               # Router configuration
│   ├── index.css             # Global styles + Tailwind
│   └── main.jsx              # Entry point
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
├── vercel.json               # Vercel deployment configuration
├── vite.config.js            # Vite + Tailwind configuration
└── README.md                 # This file
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** 9+

### Installation

```bash
git clone <repository-url>
cd iot_project
npm install
```

### Development

```bash
# Start both frontend and backend simultaneously
npm run dev

# Or start them separately:
npm run dev:frontend   # Vite dev server on http://localhost:5173
npm run dev:backend    # Express API on http://localhost:3001
```

### Production Build

```bash
npm run build     # Output to dist/
npm run preview   # Preview production build
```

---

## Deployment (Vercel)

The project is configured for Vercel deployment out of the box.

1. Push to a Git repository
2. Import the project in Vercel dashboard
3. Vercel auto-detects the Vite framework
4. The `api/index.js` file is deployed as a serverless function
5. Client-side routing is handled via `vercel.json` rewrites

### Configuration

- `vercel.json` defines build command, output directory, and URL rewrites
- API routes are served from `/api/*` via the serverless function
- All other routes are rewritten to `index.html` for SPA routing

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/devices` | List all IoT devices with status |
| GET | `/api/attacks` | Recent simulated attack events |
| GET | `/api/attacks/stats` | Aggregate attack statistics |
| GET | `/api/protocol/status` | Current protocol state and stages |
| POST | `/api/protocol/toggle` | Toggle protocol on/off |
| GET | `/api/events` | Security event log entries |

All data is mock/simulated — no real network attacks are performed.

---

## Academic Requirements

### How This Project Meets Diploma Criteria

1. **Research Component**: Analysis of IoT security threats, attack vectors, and defense mechanisms applied to smart home systems
2. **Technical Implementation**: Full-stack web application with 3D visualization, real-time simulation, and data analytics
3. **Visualization Approach**: Complex security concepts made accessible through interactive 3D scenes, animated maps, and dashboard analytics
4. **Custom Protocol Design**: 4-stage security protocol (Auth -> Key Exchange -> Encryption -> Integrity) demonstrated visually
5. **Comparative Analysis**: Before/after comparison of unprotected vs protected smart home systems with quantified risk reduction metrics
6. **Modern Technology Stack**: React, Three.js, Leaflet, Recharts — demonstrating proficiency in current web technologies
7. **Architecture**: Clean component-based architecture with separation of concerns, React Context for state management, and modular data layer

### Why Visualization?

- Cybersecurity concepts are inherently abstract and difficult to grasp
- Visual representation of attack flows and defense mechanisms provides immediate comprehension
- Interactive elements allow exploration of "what-if" scenarios
- 3D visualization of the smart home creates a tangible connection to real-world IoT deployments
- Dashboard analytics provide quantitative insight alongside qualitative visual demonstration

---

## License

This project is developed as an academic diploma work. All rights reserved.

---

*Built with React, Three.js, Leaflet, and Recharts.*
