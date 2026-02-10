/**
 * StatusBadge
 *
 * Compact coloured badge that communicates a device or system security
 * status at a glance. Shows a coloured dot (with pulse animation when
 * compromised) and an optional text label.
 *
 * @param {Object} props
 * @param {'secure'|'warning'|'compromised'} props.status - Security state.
 * @param {string} [props.label]  - Optional text beside the dot; defaults to status name.
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Controls dot size and font size.
 * @param {string} [props.className] - Extra CSS classes for the outer wrapper.
 */

const STATUS_STYLES = {
  secure: {
    dot: 'bg-emerald-400 shadow-[0_0_6px_rgba(0,255,136,0.6)]',
    text: 'text-emerald-400',
    displayName: 'Secure',
  },
  warning: {
    dot: 'bg-yellow-400 shadow-[0_0_6px_rgba(255,170,0,0.6)]',
    text: 'text-yellow-400',
    displayName: 'Warning',
  },
  compromised: {
    dot: 'bg-red-400 shadow-[0_0_6px_rgba(255,51,102,0.6)]',
    text: 'text-red-400',
    displayName: 'Compromised',
  },
};

const SIZE_MAP = {
  sm: { dot: 'w-1.5 h-1.5', text: 'text-[10px]', gap: 'gap-1.5', px: 'px-2 py-0.5' },
  md: { dot: 'w-2 h-2',     text: 'text-xs',      gap: 'gap-2',   px: 'px-2.5 py-1' },
  lg: { dot: 'w-2.5 h-2.5', text: 'text-sm',      gap: 'gap-2.5', px: 'px-3 py-1.5' },
};

export default function StatusBadge({
  status = 'secure',
  label,
  size = 'md',
  className = '',
}) {
  const style  = STATUS_STYLES[status] || STATUS_STYLES.secure;
  const sizing = SIZE_MAP[size]        || SIZE_MAP.md;

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${sizing.gap} ${sizing.px}
        ${style.text}
        bg-white/[0.04]
        ${className}
      `}
    >
      {/* Coloured dot — pulses when compromised */}
      <span
        className={`
          rounded-full shrink-0
          ${sizing.dot}
          ${style.dot}
          ${status === 'compromised' ? 'animate-pulse' : ''}
        `}
      />

      {/* Label text */}
      <span className={`${sizing.text} font-semibold tracking-wide`}>
        {label || style.displayName}
      </span>
    </span>
  );
}
