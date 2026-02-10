/**
 * Panel
 *
 * Reusable dark glass-morphism container with an optional title bar
 * and cyber-blue accent border. Provides the signature SOC-style
 * look used throughout the IoT Security Platform.
 *
 * @param {Object}      props
 * @param {string}      props.title     - Optional panel heading.
 * @param {React.ElementType} props.icon - Optional lucide-react icon component.
 * @param {string}      props.className - Additional CSS classes for the outer wrapper.
 * @param {React.ReactNode} props.children - Panel body content.
 */
export default function Panel({ title, icon: Icon, className = '', children }) {
  return (
    <div
      className={`
        rounded-xl
        bg-[rgba(15,23,42,0.85)]
        border border-[rgba(0,170,255,0.15)]
        backdrop-blur-md
        transition-all duration-300
        hover:shadow-[0_0_20px_rgba(0,170,255,0.08),inset_0_0_20px_rgba(0,170,255,0.03)]
        hover:border-[rgba(0,170,255,0.3)]
        ${className}
      `}
    >
      {/* ── Title bar ──────────────────────────────────────────────── */}
      {title && (
        <div
          className="
            flex items-center gap-2.5 px-4 py-3
            border-b border-[rgba(0,170,255,0.1)]
          "
        >
          {Icon && (
            <Icon
              size={16}
              className="text-[#00aaff] shrink-0 drop-shadow-[0_0_4px_rgba(0,170,255,0.4)]"
            />
          )}
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide">
            {title}
          </h3>
        </div>
      )}

      {/* ── Body ───────────────────────────────────────────────────── */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
