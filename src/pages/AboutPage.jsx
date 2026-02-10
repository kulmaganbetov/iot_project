/**
 * AboutPage.jsx
 * -------------
 * "About the Project" page targeted at a diploma committee audience.
 *
 * Sections:
 *   1. Hero — project title
 *   2. Project Overview — purpose, goals, academic relevance
 *   3. Technology Stack — grid of tech cards
 *   4. Architecture — visual diagram + component hierarchy
 *   5. Key Features — feature cards grid
 *   6. Academic Requirements — how the project meets diploma criteria
 *   7. Author — student / supervisor / university placeholders
 */

import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Globe,
  BarChart3,
  Cpu,
  Eye,
  Zap,
  BookOpen,
  GraduationCap,
  Layers,
  Server,
  Monitor,
  ArrowRight,
  ChevronRight,
  Map,
  Box,
  LineChart,
  Paintbrush,
  Code,
  User,
  Target,
  Lightbulb,
  CheckCircle,
} from 'lucide-react';

/* ── Framer-motion shared variants ───────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const containerStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const cardPop = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 130, damping: 17 },
  },
};

/* ── Data: Technology Stack ──────────────────────────────────────────────── */
const techStack = [
  {
    name: 'React + Vite',
    icon: Zap,
    color: '#61dafb',
    description:
      'Core UI framework with fast HMR development server. Component-based architecture enables modular page composition.',
  },
  {
    name: 'Three.js',
    icon: Box,
    color: '#00ff88',
    description:
      '3D rendering engine powering the interactive smart-home visualization with real-time attack and protocol animations.',
  },
  {
    name: 'Leaflet',
    icon: Map,
    color: '#199900',
    description:
      'Interactive world map for geolocation-based attack origin visualization with animated arc overlays.',
  },
  {
    name: 'Recharts',
    icon: LineChart,
    color: '#ff7300',
    description:
      'Declarative charting library for the security analytics dashboard — real-time bar, line, and pie charts.',
  },
  {
    name: 'Tailwind CSS',
    icon: Paintbrush,
    color: '#38bdf8',
    description:
      'Utility-first CSS framework for rapid, consistent dark-theme UI styling across all pages and components.',
  },
  {
    name: 'Node.js',
    icon: Server,
    color: '#68a063',
    description:
      'Runtime for the lightweight Express backend that serves mock IoT telemetry and attack simulation data.',
  },
  {
    name: 'Express',
    icon: Code,
    color: '#ffffff',
    description:
      'Minimal REST API layer providing device data, attack logs, and protocol status endpoints.',
  },
];

/* ── Data: Key Features ──────────────────────────────────────────────────── */
const features = [
  {
    title: '3D Smart Home Visualization',
    icon: Box,
    color: '#00aaff',
    description:
      'Interactive Three.js scene showing a procedural smart-home model with IoT devices, attack beams, data-flow lines, and a protocol shield dome.',
  },
  {
    title: 'Real-time Attack Simulation',
    icon: Zap,
    color: '#ff3366',
    description:
      'Continuous simulation engine generating randomized attacks against devices, with real-time visual feedback showing blocked vs. successful attacks.',
  },
  {
    title: 'Custom Protection Protocol',
    icon: ShieldCheck,
    color: '#00ff88',
    description:
      'A 4-stage security protocol (authentication, key exchange, encryption, integrity) with detailed visual pipeline and comparison analytics.',
  },
  {
    title: 'World Attack Map',
    icon: Globe,
    color: '#aa44ff',
    description:
      'Leaflet-based geographic visualization of simulated attack origins with animated arcs connecting source countries to the target location.',
  },
  {
    title: 'Security Analytics Dashboard',
    icon: BarChart3,
    color: '#ffaa00',
    description:
      'Comprehensive analytics with KPI cards, temporal charts, severity distributions, and attack-type breakdowns using Recharts.',
  },
];

/* ── Data: Academic sections ─────────────────────────────────────────────── */
const academicPoints = [
  {
    title: 'IoT Security Understanding',
    icon: ShieldCheck,
    text: 'The platform demonstrates in-depth knowledge of IoT threat vectors including brute force, MITM, replay attacks, and firmware exploits. Each attack type is modeled with realistic behavior, targeted devices, severity classifications, and MITRE ATT&CK tactic mappings.',
  },
  {
    title: 'Visualization as a Learning Tool',
    icon: Eye,
    text: 'Interactive 3D visualization transforms abstract security concepts into tangible, observable phenomena. Users can watch attacks propagate, see the protocol shield activate, and compare protected vs. unprotected states in real time — significantly aiding comprehension.',
  },
  {
    title: 'Technologies & Methodologies',
    icon: Layers,
    text: 'The project applies modern web technologies (React 19, Three.js, Leaflet, Recharts) with software engineering best practices: component architecture, custom hooks, context-based state management, modular data layer, and responsive Tailwind CSS styling.',
  },
];

/* ── Architecture Node ───────────────────────────────────────────────────── */
function ArchBlock({ icon: Icon, label, sublabel, color = '#00aaff' }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-24 h-20 rounded-xl border-2 flex items-center justify-center"
        style={{
          borderColor: color,
          background: `${color}10`,
          boxShadow: `0 0 24px ${color}15`,
        }}
      >
        <Icon size={30} style={{ color }} />
      </div>
      <span className="text-sm font-semibold text-slate-200">{label}</span>
      {sublabel && (
        <span className="text-[11px] text-slate-500 -mt-1">{sublabel}</span>
      )}
    </div>
  );
}

function ArchConnector() {
  return (
    <div className="flex items-center mx-2 sm:mx-4">
      <motion.div
        className="h-0.5 w-10 sm:w-16 bg-gradient-to-r from-cyan-500/50 to-cyan-500/10 rounded-full"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      />
      <ChevronRight size={18} className="text-cyan-500/50 -ml-1" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Main Page Component
   ════════════════════════════════════════════════════════════════════════════ */

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-200">
      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-14 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 text-xs font-semibold px-4 py-1.5 rounded-full border border-purple-500/20 mb-6">
              <GraduationCap size={14} />
              DIPLOMA PROJECT
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            Web Platform for Visual Analysis of IoT Security
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-slate-400 text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            An interactive educational platform that combines 3D
            visualization, real-time simulation, and data analytics to
            demonstrate IoT security concepts and a custom protection
            protocol.
          </motion.p>
        </div>
      </section>

      {/* ── 2. Project Overview ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <motion.h2
          className="text-2xl sm:text-3xl font-bold text-center mb-10"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Project Overview
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Purpose */}
          <motion.div
            variants={cardPop}
            className="rounded-2xl border border-cyan-500/15 bg-slate-900/50 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Target size={20} className="text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-cyan-400">Purpose</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              To create an accessible, visually engaging web platform that
              demonstrates how common IoT attacks operate and how a layered
              security protocol can mitigate them. The platform serves as
              both an educational tool and a proof-of-concept for the
              proposed protection protocol.
            </p>
          </motion.div>

          {/* Goals */}
          <motion.div
            variants={cardPop}
            className="rounded-2xl border border-purple-500/15 bg-slate-900/50 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Lightbulb size={20} className="text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-purple-400">Goals</h3>
            </div>
            <ul className="space-y-2">
              {[
                'Visualize smart-home IoT device topology in 3D',
                'Simulate real-world attack vectors in real time',
                'Design and implement a custom 4-stage security protocol',
                'Provide comparative analytics (protected vs. unprotected)',
                'Map global attack origins geographically',
              ].map((goal, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-400"
                >
                  <CheckCircle
                    size={14}
                    className="text-purple-400 mt-0.5 flex-shrink-0"
                  />
                  {goal}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Academic Relevance */}
          <motion.div
            variants={cardPop}
            className="rounded-2xl border border-green-500/15 bg-slate-900/50 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <GraduationCap size={20} className="text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-green-400">
                Academic Relevance
              </h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              IoT security is one of the most rapidly growing areas in
              cybersecurity research. This project bridges the gap between
              theoretical knowledge and practical understanding by providing
              a hands-on interactive environment where security concepts are
              made observable and measurable.
            </p>
          </motion.div>

          {/* Why Visualization */}
          <motion.div
            variants={cardPop}
            className="rounded-2xl border border-amber-500/15 bg-slate-900/50 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Eye size={20} className="text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-amber-400">
                Why Visualization?
              </h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Security threats are inherently invisible and abstract.
              Visualization transforms these concepts into tangible,
              interactive experiences. A 3D smart-home model with animated
              attack beams and shield domes provides immediate intuitive
              understanding that no textual description can replicate.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 3. Technology Stack ──────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <motion.h2
          className="text-2xl sm:text-3xl font-bold text-center mb-4"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Technology Stack
        </motion.h2>
        <motion.p
          className="text-slate-500 text-center mb-10 max-w-lg mx-auto"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Modern tools chosen for performance, developer experience, and
          suitability for real-time interactive visualization.
        </motion.p>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {techStack.map((tech) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.name}
                variants={cardPop}
                className="group rounded-2xl border border-slate-700/40 bg-slate-900/50 p-5 hover:border-slate-600/60 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${tech.color}12` }}
                >
                  <Icon
                    size={24}
                    style={{ color: tech.color }}
                    className="group-hover:scale-110 transition-transform"
                  />
                </div>
                <h3 className="text-base font-bold text-slate-200 mb-2">
                  {tech.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {tech.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── 4. Architecture Diagram ──────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <motion.h2
          className="text-2xl sm:text-3xl font-bold text-center mb-4"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Architecture
        </motion.h2>
        <motion.p
          className="text-slate-500 text-center mb-10 max-w-lg mx-auto"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          High-level system architecture showing the data flow from the
          React frontend through the API layer to the mock backend.
        </motion.p>

        {/* Visual diagram */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 p-8 rounded-2xl border border-slate-700/40 bg-slate-900/40 backdrop-blur-sm mb-8"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <ArchBlock
            icon={Monitor}
            label="Frontend (React)"
            sublabel="Pages, Components, Hooks"
            color="#61dafb"
          />
          <ArchConnector />
          <ArchBlock
            icon={Layers}
            label="API Layer"
            sublabel="REST Endpoints"
            color="#aa44ff"
          />
          <ArchConnector />
          <ArchBlock
            icon={Server}
            label="Mock Backend"
            sublabel="Express + Node.js"
            color="#68a063"
          />
        </motion.div>

        {/* Component hierarchy */}
        <motion.div
          className="rounded-2xl border border-slate-700/40 bg-slate-900/40 p-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Layers size={18} className="text-cyan-400" />
            Component Hierarchy
          </h3>
          <div className="font-mono text-xs text-slate-400 space-y-1 leading-relaxed">
            <p className="text-cyan-400">App</p>
            <p className="pl-4">
              <span className="text-slate-600">|--</span>{' '}
              <span className="text-purple-400">SimulationProvider</span>{' '}
              <span className="text-slate-600">(context)</span>
            </p>
            <p className="pl-8">
              <span className="text-slate-600">|--</span>{' '}
              <span className="text-blue-400">Layout</span>{' '}
              <span className="text-slate-600">(nav + outlet)</span>
            </p>
            <p className="pl-12">
              <span className="text-slate-600">|--</span> HomePage{' '}
              <span className="text-slate-600">
                <ArrowRight size={10} className="inline" /> SmartHomeScene
                (Three.js Canvas)
              </span>
            </p>
            <p className="pl-12">
              <span className="text-slate-600">|--</span> DashboardPage{' '}
              <span className="text-slate-600">
                <ArrowRight size={10} className="inline" /> KPICards,
                Recharts panels
              </span>
            </p>
            <p className="pl-12">
              <span className="text-slate-600">|--</span> MapPage{' '}
              <span className="text-slate-600">
                <ArrowRight size={10} className="inline" /> Leaflet world
                map
              </span>
            </p>
            <p className="pl-12">
              <span className="text-slate-600">|--</span> ProtocolPage{' '}
              <span className="text-slate-600">
                <ArrowRight size={10} className="inline" /> Pipeline,
                comparison table
              </span>
            </p>
            <p className="pl-12">
              <span className="text-slate-600">|--</span> AboutPage{' '}
              <span className="text-slate-600">
                <ArrowRight size={10} className="inline" /> Project info
              </span>
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── 5. Key Features ──────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <motion.h2
          className="text-2xl sm:text-3xl font-bold text-center mb-10"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Key Features
        </motion.h2>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                variants={cardPop}
                className="rounded-2xl border bg-slate-900/50 p-6 hover:bg-slate-900/70 transition-colors"
                style={{ borderColor: `${feat.color}20` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${feat.color}15` }}
                >
                  <Icon size={24} style={{ color: feat.color }} />
                </div>
                <h3 className="text-base font-bold text-slate-200 mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── 6. Academic Requirements ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <motion.h2
          className="text-2xl sm:text-3xl font-bold text-center mb-4"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Academic Requirements
        </motion.h2>
        <motion.p
          className="text-slate-500 text-center mb-10 max-w-lg mx-auto"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          How this project fulfils the diploma criteria for demonstrating
          applied cybersecurity knowledge.
        </motion.p>

        <motion.div
          className="space-y-5"
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {academicPoints.map((point) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                variants={cardPop}
                className="rounded-2xl border border-slate-700/30 bg-slate-900/50 p-6 flex gap-5 items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-200 mb-2">
                    {point.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {point.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── 7. Author Section ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div
          className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 p-8 backdrop-blur-sm text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-slate-800 border-2 border-purple-500/30 flex items-center justify-center">
            <User size={36} className="text-purple-400" />
          </div>

          <h3 className="text-xl font-bold text-white mb-1">
            Student Name
          </h3>
          <p className="text-sm text-slate-400 mb-6">Diploma Author</p>

          <div className="grid sm:grid-cols-2 gap-4 text-left max-w-md mx-auto">
            <div className="rounded-xl bg-slate-800/50 p-4 border border-slate-700/30">
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">
                Supervisor
              </p>
              <p className="text-sm text-slate-300 font-medium">
                Prof. Supervisor Name
              </p>
            </div>
            <div className="rounded-xl bg-slate-800/50 p-4 border border-slate-700/30">
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">
                University
              </p>
              <p className="text-sm text-slate-300 font-medium">
                University Name
              </p>
            </div>
            <div className="rounded-xl bg-slate-800/50 p-4 border border-slate-700/30">
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">
                Department
              </p>
              <p className="text-sm text-slate-300 font-medium">
                Computer Science / Cybersecurity
              </p>
            </div>
            <div className="rounded-xl bg-slate-800/50 p-4 border border-slate-700/30">
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">
                Year
              </p>
              <p className="text-sm text-slate-300 font-medium">2025</p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-700/40">
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
              <BookOpen size={12} />
              Diploma project submitted in partial fulfilment of the
              requirements for the degree
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
