/**
 * ProtocolPage.jsx
 * ----------------
 * Describes the custom 4-stage IoT protection protocol.
 *
 * Sections:
 *   1. Hero with title & subtitle
 *   2. Protocol Pipeline — 4 connected stage cards (framer-motion stagger)
 *   3. Security Comparison — dark table with animated risk-reduction bars
 *   4. Protocol Architecture — div-based device-to-hub diagram
 *   5. Summary statistics box
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Key,
  Lock,
  CheckCircle,
  ArrowRight,
  Cpu,
  Wifi,
  ShieldCheck,
  ChevronRight,
  BarChart3,
  AlertTriangle,
  ShieldOff,
} from 'lucide-react';
import { protocolStages, securityComparison } from '../data/protocol';

/* ── Icon map to resolve stage.icon strings ──────────────────────────────── */
const iconMap = {
  Shield,
  Key,
  Lock,
  CheckCircle,
};

/* ── Framer-motion variants ──────────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 16 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const barVariants = {
  hidden: { width: 0 },
  visible: (percent) => ({
    width: `${percent}%`,
    transition: { duration: 1.2, ease: 'easeOut' },
  }),
};

/* ── Architecture node component ─────────────────────────────────────────── */
function ArchNode({ icon: Icon, label, color = '#00aaff', sublabel }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-20 h-20 rounded-xl border-2 flex items-center justify-center"
        style={{
          borderColor: color,
          background: `${color}10`,
          boxShadow: `0 0 20px ${color}22`,
        }}
      >
        <Icon size={32} style={{ color }} />
      </div>
      <span className="text-sm font-semibold text-slate-200">{label}</span>
      {sublabel && (
        <span className="text-[11px] text-slate-500 -mt-1">{sublabel}</span>
      )}
    </div>
  );
}

/* ── Animated connecting arrow between arch nodes ────────────────────────── */
function ArchArrow() {
  return (
    <div className="flex items-center mx-1 sm:mx-3">
      <motion.div
        className="h-0.5 w-8 sm:w-14 bg-gradient-to-r from-cyan-500/60 to-cyan-500/20 rounded-full"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      />
      <ChevronRight size={18} className="text-cyan-500/60 -ml-1" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Main Page Component
   ════════════════════════════════════════════════════════════════════════════ */

export default function ProtocolPage() {
  /* ── Derived stats ─────────────────────────────────────────────────────── */
  const avgReduction = useMemo(() => {
    const sum = securityComparison.reduce((a, c) => a + c.riskReduction, 0);
    return (sum / securityComparison.length).toFixed(1);
  }, []);

  const maxReduction = useMemo(
    () => Math.max(...securityComparison.map((c) => c.riskReduction)),
    []
  );

  const minReduction = useMemo(
    () => Math.min(...securityComparison.map((c) => c.riskReduction)),
    []
  );

  /* ═══════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#030712] text-slate-200">
      {/* ── 1. Hero Section ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Decorative gradient blobs */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-14 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 text-xs font-semibold px-4 py-1.5 rounded-full border border-cyan-500/20 mb-6">
              <ShieldCheck size={14} />
              CUSTOM SECURITY PROTOCOL
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Custom IoT Protection Protocol
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-slate-400 text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            A 4-stage security protocol engineered for smart-home IoT
            environments. From device authentication through integrity
            verification, every stage is designed to neutralize real-world
            attack vectors while maintaining sub-second latency.
          </motion.p>
        </div>
      </section>

      {/* ── 2. Protocol Pipeline ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <motion.h2
          className="text-2xl sm:text-3xl font-bold text-center mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Protocol Pipeline
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Connecting line behind cards (xl only) */}
          <div className="hidden xl:block absolute top-1/2 left-[12%] right-[12%] h-0.5 -translate-y-1/2 z-0">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-amber-500/40 rounded-full"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              viewport={{ once: true }}
            />
          </div>

          {protocolStages.map((stage) => {
            const Icon = iconMap[stage.icon] || Shield;
            return (
              <motion.div
                key={stage.id}
                variants={cardVariants}
                className="relative z-10 rounded-2xl border backdrop-blur-md p-6 flex flex-col"
                style={{
                  borderColor: `${stage.color}30`,
                  background: `linear-gradient(160deg, ${stage.color}08 0%, #0f172a 60%)`,
                  boxShadow: `0 0 30px ${stage.color}10`,
                }}
              >
                {/* Stage number badge */}
                <div
                  className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: stage.color }}
                >
                  {stage.stage}
                </div>

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${stage.color}18` }}
                >
                  <Icon size={28} style={{ color: stage.color }} />
                </div>

                {/* Name */}
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: stage.color }}
                >
                  {stage.name}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-grow">
                  {stage.description}
                </p>

                {/* Technical details */}
                <ul className="space-y-1.5 mb-4">
                  {stage.technicalDetails.map((detail, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-slate-400"
                    >
                      <ChevronRight
                        size={12}
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: stage.color }}
                      />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                {/* Duration */}
                <div className="mt-auto pt-3 border-t border-slate-700/50 flex items-center gap-2 text-xs text-slate-500">
                  <Cpu size={12} />
                  <span>Latency: {stage.duration}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Arrows row for xl layout */}
        <div className="hidden xl:flex justify-center items-center gap-4 mt-4">
          {protocolStages.slice(0, -1).map((_, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-1 text-cyan-500/40"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.15 }}
              viewport={{ once: true }}
            >
              <ArrowRight size={20} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 3. Security Comparison Table ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <motion.h2
          className="text-2xl sm:text-3xl font-bold text-center mb-4"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Security Comparison
        </motion.h2>
        <motion.p
          className="text-slate-500 text-center mb-10 max-w-xl mx-auto"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          How the protocol mitigates each major IoT threat vector compared to
          unprotected smart-home deployments.
        </motion.p>

        <motion.div
          className="overflow-x-auto rounded-2xl border border-slate-700/40"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-800/80 text-slate-300 uppercase text-xs tracking-wider">
                <th className="px-5 py-4 font-semibold">Threat</th>
                <th className="px-5 py-4 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <ShieldOff size={13} className="text-red-400" />
                    Unprotected
                  </span>
                </th>
                <th className="px-5 py-4 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-green-400" />
                    Protected
                  </span>
                </th>
                <th className="px-5 py-4 font-semibold w-56">
                  Risk Reduction
                </th>
              </tr>
            </thead>
            <tbody>
              {securityComparison.map((row, idx) => (
                <motion.tr
                  key={row.threat}
                  className={
                    idx % 2 === 0
                      ? 'bg-slate-900/60'
                      : 'bg-slate-800/30'
                  }
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.07, duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <td className="px-5 py-4 font-medium text-slate-200 whitespace-nowrap">
                    <span className="flex items-center gap-2">
                      <AlertTriangle
                        size={14}
                        className="text-amber-400 flex-shrink-0"
                      />
                      {row.threat}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-red-400/80">{row.unprotected}</td>
                  <td className="px-5 py-4 text-green-400/80">{row.protected}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-grow h-3 bg-slate-700/60 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                          custom={row.riskReduction}
                          variants={barVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                        />
                      </div>
                      <span className="text-green-400 font-bold text-xs w-10 text-right">
                        {row.riskReduction}%
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* ── 4. Protocol Architecture Diagram ─────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <motion.h2
          className="text-2xl sm:text-3xl font-bold text-center mb-4"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Protocol Architecture
        </motion.h2>
        <motion.p
          className="text-slate-500 text-center mb-12 max-w-lg mx-auto"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          End-to-end data flow from IoT device to the central hub, secured at
          every stage.
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 p-8 rounded-2xl border border-slate-700/40 bg-slate-900/40 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <ArchNode
            icon={Cpu}
            label="IoT Device"
            color="#00aaff"
            sublabel="Sensor / Actuator"
          />
          <ArchArrow />
          <ArchNode
            icon={Shield}
            label="Authentication"
            color="#00aaff"
            sublabel="Stage 1 — ECDSA"
          />
          <ArchArrow />
          <ArchNode
            icon={Key}
            label="Key Exchange"
            color="#aa44ff"
            sublabel="Stage 2 — ECDHE"
          />
          <ArchArrow />
          <ArchNode
            icon={Lock}
            label="Encrypted Channel"
            color="#00ff88"
            sublabel="Stage 3 — AES-256"
          />
          <ArchArrow />
          <ArchNode
            icon={Wifi}
            label="Central Hub"
            color="#ffaa00"
            sublabel="Secure Gateway"
          />
        </motion.div>

        {/* Stage detail row beneath diagram */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {protocolStages.map((stage) => {
            const Icon = iconMap[stage.icon] || Shield;
            return (
              <motion.div
                key={stage.id}
                className="rounded-xl border border-slate-700/30 bg-slate-900/50 p-4 text-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                <Icon
                  size={20}
                  className="mx-auto mb-2"
                  style={{ color: stage.color }}
                />
                <p className="text-xs font-semibold text-slate-300">
                  Stage {stage.stage}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {stage.shortName}
                </p>
                <p className="text-[11px] text-slate-600 mt-1">
                  {stage.duration}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── 5. Summary Statistics ─────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div
          className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 p-8 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 size={22} className="text-cyan-400" />
            <h3 className="text-xl font-bold text-white">
              Protocol Effectiveness Summary
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Average risk reduction */}
            <div className="text-center">
              <p className="text-4xl font-extrabold text-green-400">
                {avgReduction}%
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Average Risk Reduction
              </p>
            </div>

            {/* Highest */}
            <div className="text-center">
              <p className="text-4xl font-extrabold text-emerald-400">
                {maxReduction}%
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Highest Reduction (MITM)
              </p>
            </div>

            {/* Lowest */}
            <div className="text-center">
              <p className="text-4xl font-extrabold text-amber-400">
                {minReduction}%
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Lowest Reduction (DoS)
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
              Across all {securityComparison.length} evaluated threat vectors,
              the custom IoT protection protocol achieves an average risk
              reduction of{' '}
              <span className="text-green-400 font-semibold">
                {avgReduction}%
              </span>
              , demonstrating that a layered authentication, encryption, and
              integrity approach can effectively secure smart-home
              environments against the most common IoT attacks.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
