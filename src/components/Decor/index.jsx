import React from 'react'

/* ─── Dot grid background ─────────────────────────────────────── */
export const DotGrid = ({ opacity = 0.055, size = 28, color = '255,255,255', className = '' }) => (
  <div
    aria-hidden="true"
    className={`absolute inset-0 pointer-events-none ${className}`}
    style={{
      backgroundImage: `radial-gradient(circle, rgba(${color},${opacity}) 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px`,
    }}
  />
)

/* ─── Cross-hatch grid lines ──────────────────────────────────── */
export const GridLines = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.7" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
)

/* ─── Event ticket outline ────────────────────────────────────── */
export const TicketOutline = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 520 210"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Left body */}
    <rect x="1" y="1" width="354" height="208" rx="18" stroke="currentColor" strokeWidth="1.5" />
    {/* Right stub */}
    <rect x="355" y="1" width="164" height="208" rx="18" stroke="currentColor" strokeWidth="1.5" />
    {/* Perforation notch circles */}
    <circle cx="356" cy="0"   r="20" fill="#0a0a0a" />
    <circle cx="356" cy="210" r="20" fill="#0a0a0a" />
    {/* Perforation dashes */}
    <line x1="356" y1="21"  x2="356" y2="84"  stroke="currentColor" strokeWidth="1.5" strokeDasharray="7 5" />
    <line x1="356" y1="126" x2="356" y2="189" stroke="currentColor" strokeWidth="1.5" strokeDasharray="7 5" />
    {/* Left side — text placeholder lines */}
    <rect x="24" y="42"  width="220" height="16" rx="8"  fill="currentColor" opacity="0.18" />
    <rect x="24" y="68"  width="150" height="10" rx="5"  fill="currentColor" opacity="0.12" />
    <rect x="24" y="108" width="85"  height="9"  rx="4"  fill="currentColor" opacity="0.1" />
    <rect x="24" y="124" width="130" height="9"  rx="4"  fill="currentColor" opacity="0.1" />
    <rect x="24" y="162" width="60"  height="8"  rx="4"  fill="currentColor" opacity="0.08" />
    <rect x="100" y="162" width="90" height="8"  rx="4"  fill="currentColor" opacity="0.08" />
    {/* Right side — QR code block */}
    <rect x="378" y="32"  width="84" height="84" rx="6" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
    <rect x="385" y="39"  width="26" height="26" rx="3" fill="currentColor" opacity="0.2" />
    <rect x="419" y="39"  width="26" height="26" rx="3" fill="currentColor" opacity="0.2" />
    <rect x="385" y="71"  width="26" height="26" rx="3" fill="currentColor" opacity="0.2" />
    <rect x="410" y="71"  width="10" height="10" rx="2" fill="currentColor" opacity="0.15" />
    <rect x="424" y="71"  width="14" height="10" rx="2" fill="currentColor" opacity="0.15" />
    <rect x="410" y="85"  width="16" height="12" rx="2" fill="currentColor" opacity="0.15" />
    {/* Barcode */}
    {[[0,1],[5,2],[10,1],[15,2.5],[20,1],[25,2],[30,1.5],[35,1],[40,2],[45,1.5],[50,3],[56,1],[61,2],[66,1.5],[71,2.5],[77,1]].map(([x, w], i) => (
      <line key={i} x1={375 + x} y1="132" x2={375 + x} y2="168" stroke="currentColor" strokeWidth={w} opacity="0.25" />
    ))}
    <rect x="375" y="172" width="88" height="6" rx="3" fill="currentColor" opacity="0.12" />
  </svg>
)

/* ─── Music note ──────────────────────────────────────────────── */
export const MusicNote = ({ className = '' }) => (
  <svg aria-hidden="true" viewBox="0 0 40 48" fill="currentColor" className={className}>
    <path d="M38 0L14 6v28a8 8 0 1 0 4-6.93V10l20-5V38a8 8 0 1 0 4-6.93V0H38z" />
  </svg>
)

/* ─── 4-pointed sparkle ───────────────────────────────────────── */
export const Sparkle = ({ className = '' }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0 L13.8 10.2 L24 12 L13.8 13.8 L12 24 L10.2 13.8 L0 12 L10.2 10.2 Z" />
  </svg>
)

/* ─── Small diamond sparkle ───────────────────────────────────── */
export const SparkleSmall = ({ className = '' }) => (
  <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M8 0l1.6 6.4L16 8l-6.4 1.6L8 16 6.4 9.6 0 8l6.4-1.6Z" />
  </svg>
)

/* ─── Animated sound-wave equalizer ──────────────────────────── */
export const SoundWave = ({ className = '' }) => (
  <svg aria-hidden="true" viewBox="0 0 96 48" className={className}>
    {[
      { x: 2,  h: 14, d: '0s'   },
      { x: 9,  h: 30, d: '0.1s' },
      { x: 16, h: 42, d: '0.2s' },
      { x: 23, h: 24, d: '0.05s'},
      { x: 30, h: 48, d: '0.15s'},
      { x: 37, h: 32, d: '0.25s'},
      { x: 44, h: 48, d: '0s'   },
      { x: 51, h: 36, d: '0.1s' },
      { x: 58, h: 22, d: '0.2s' },
      { x: 65, h: 40, d: '0.05s'},
      { x: 72, h: 28, d: '0.15s'},
      { x: 79, h: 16, d: '0.25s'},
      { x: 86, h: 36, d: '0s'   },
      { x: 93, h: 10, d: '0.1s' },
    ].map(({ x, h, d }, i) => (
      <rect
        key={i}
        x={x}
        y={(48 - h) / 2}
        width="5"
        height={h}
        rx="2.5"
        fill="currentColor"
        style={{ animation: `wave 1.4s ease-in-out ${d} infinite` }}
      />
    ))}
  </svg>
)

/* ─── Stage light cones ───────────────────────────────────────── */
export const StageLights = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 800 300"
    fill="none"
    preserveAspectRatio="xMidYMid slice"
    className={className}
  >
    <defs>
      <radialGradient id="light1" cx="20%" cy="0%" r="70%">
        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="light2" cx="50%" cy="0%" r="60%">
        <stop offset="0%" stopColor="#4ade80" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="light3" cx="80%" cy="0%" r="65%">
        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Cone left */}
    <path d="M0 0 L180 280 L-10 280 Z" fill="url(#light1)" />
    {/* Cone center */}
    <path d="M400 0 L520 280 L280 280 Z" fill="url(#light2)" />
    {/* Cone right */}
    <path d="M800 0 L900 280 L650 280 Z" fill="url(#light3)" />
    {/* Top bar (rig) */}
    <rect x="0" y="0" width="800" height="4" fill="rgba(255,255,255,0.04)" />
    {/* Light fixtures */}
    <circle cx="140" cy="6" r="5" fill="rgba(34,197,94,0.5)" />
    <circle cx="400" cy="6" r="5" fill="rgba(74,222,128,0.4)" />
    <circle cx="660" cy="6" r="5" fill="rgba(34,197,94,0.5)" />
  </svg>
)

/* ─── Confetti scatter ────────────────────────────────────────── */
export const ConfettiScatter = ({ count = 20, className = '' }) => {
  const pieces = Array.from({ length: count }, (_, i) => {
    const seed = i * 137.5
    const x = (seed % 100)
    const y = ((seed * 1.3) % 100)
    const rotate = seed % 360
    const size = 3 + (seed % 8)
    const colors = ['#22c55e', '#4ade80', '#fbbf24', '#ffffff', '#86efac', '#f9a8d4']
    const color = colors[i % colors.length]
    return { x, y, rotate, size, color }
  })

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    >
      {pieces.map(({ x, y, rotate, size, color }, i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={size}
          height={size * 0.45}
          rx="0.5"
          fill={color}
          opacity={0.06 + (i % 5) * 0.012}
          transform={`rotate(${rotate} ${x + size / 2} ${y + size * 0.22})`}
        />
      ))}
    </svg>
  )
}

/* ─── QR code pattern ─────────────────────────────────────────── */
export const QRPattern = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 120 120"
    className={`absolute pointer-events-none ${className}`}
  >
    {/* Outer frame */}
    <rect x="2" y="2" width="116" height="116" rx="8" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
    {/* Top-left finder */}
    <rect x="10" y="10" width="34" height="34" rx="4" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
    <rect x="17" y="17" width="20" height="20" rx="2" fill="currentColor" opacity="0.25" />
    {/* Top-right finder */}
    <rect x="76" y="10" width="34" height="34" rx="4" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
    <rect x="83" y="17" width="20" height="20" rx="2" fill="currentColor" opacity="0.25" />
    {/* Bottom-left finder */}
    <rect x="10" y="76" width="34" height="34" rx="4" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
    <rect x="17" y="83" width="20" height="20" rx="2" fill="currentColor" opacity="0.25" />
    {/* Data modules (scattered dots) */}
    {[
      [55,10],[62,10],[69,10],[55,17],[69,17],[62,24],[55,31],[62,31],[69,31],
      [55,76],[62,76],[76,55],[76,62],[76,69],[83,55],[90,55],[97,62],[83,69],
      [55,55],[62,62],[69,55],[55,62],[62,69],[69,62],
    ].map(([cx, cy], i) => (
      <rect key={i} x={cx} y={cy} width="5" height="5" rx="1" fill="currentColor" opacity="0.2" />
    ))}
  </svg>
)

/* ─── Waveform (horizontal sound ripple) ─────────────────────── */
export const Waveform = ({ className = '' }) => (
  <svg aria-hidden="true" viewBox="0 0 800 60" preserveAspectRatio="none" className={className}>
    <path
      d="M0 30 Q40 5 80 30 Q120 55 160 30 Q200 5 240 30 Q280 55 320 30 Q360 5 400 30 Q440 55 480 30 Q520 5 560 30 Q600 55 640 30 Q680 5 720 30 Q760 55 800 30"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      opacity="0.5"
    />
    <path
      d="M0 30 Q40 12 80 30 Q120 48 160 30 Q200 12 240 30 Q280 48 320 30 Q360 12 400 30 Q440 48 480 30 Q520 12 560 30 Q600 48 640 30 Q680 12 720 30 Q760 48 800 30"
      stroke="currentColor"
      strokeWidth="0.8"
      fill="none"
      opacity="0.25"
    />
  </svg>
)

/* ─── Radial lines (sunburst) ─────────────────────────────────── */
export const Sunburst = ({ className = '' }) => (
  <svg aria-hidden="true" viewBox="0 0 400 400" className={className}>
    {Array.from({ length: 24 }, (_, i) => {
      const angle = (i * 360) / 24
      const rad = (angle * Math.PI) / 180
      const x2 = 200 + Math.cos(rad) * 200
      const y2 = 200 + Math.sin(rad) * 200
      return (
        <line
          key={i}
          x1="200" y1="200"
          x2={x2} y2={y2}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity={0.05 + (i % 3) * 0.02}
        />
      )
    })}
    <circle cx="200" cy="200" r="30" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.08" />
    <circle cx="200" cy="200" r="70" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.05" />
    <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.04" />
    <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.03" />
  </svg>
)

/* ─── Floating particles (rising dots) ────────────────────────── */
export const FloatingParticles = ({ count = 22, className = '' }) => {
  const items = Array.from({ length: count }, (_, i) => {
    const seed = i * 137.508
    const x = (seed % 100)
    const size = 1 + ((seed * 0.7) % 2)
    const delay = (seed * 0.4) % 7
    const duration = 4 + ((seed * 0.9) % 4)
    const opacity = 0.12 + ((seed * 0.3) % 0.35)
    return { x, size, delay, duration, opacity }
  })
  return (
    <div aria-hidden="true" className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {items.map(({ x, size, delay, duration, opacity }, i) => (
        <div
          key={i}
          className="absolute bottom-0 rounded-full bg-[#22c55e]"
          style={{
            left: `${x}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity,
            animation: `particleRise ${duration}s ease-in ${delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

/* ─── Star field (twinkling dots) ─────────────────────────────── */
export const StarField = ({ count = 45, className = '' }) => {
  const stars = Array.from({ length: count }, (_, i) => {
    const seed = i * 73.137
    const cx = (seed % 100)
    const cy = ((seed * 1.618) % 100)
    const r = 0.3 + ((seed * 0.4) % 1.2)
    const opacity = 0.04 + ((seed * 0.5) % 0.18)
    const delay = (seed * 0.35) % 5
    const dur = 2 + ((seed * 0.6) % 3)
    return { cx, cy, r, opacity, delay, dur }
  })
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    >
      {stars.map(({ cx, cy, r, opacity, delay, dur }, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="white"
          opacity={opacity}
          style={{ animation: `sparkle ${dur}s ease-in-out ${delay}s infinite` }}
        />
      ))}
    </svg>
  )
}

/* ─── Rotating concentric rings ───────────────────────────────── */
export const SpinRings = ({ className = '' }) => (
  <svg aria-hidden="true" viewBox="0 0 400 400" className={`absolute pointer-events-none ${className}`}>
    <circle
      cx="200" cy="200" r="100"
      stroke="rgba(34,197,94,0.07)" strokeWidth="1" fill="none"
      style={{ animation: 'rotateSlow 28s linear infinite', transformOrigin: '200px 200px' }}
    />
    <circle
      cx="200" cy="200" r="145"
      stroke="rgba(34,197,94,0.045)" strokeWidth="0.8" fill="none" strokeDasharray="10 18"
      style={{ animation: 'rotateReverse 20s linear infinite', transformOrigin: '200px 200px' }}
    />
    <circle
      cx="200" cy="200" r="188"
      stroke="rgba(34,197,94,0.03)" strokeWidth="0.6" fill="none" strokeDasharray="5 14"
      style={{ animation: 'rotateSlow 35s linear infinite', transformOrigin: '200px 200px' }}
    />
    <circle cx="200" cy="200" r="6" fill="rgba(34,197,94,0.15)" />
    <circle
      cx="200" cy="200" r="16"
      stroke="rgba(34,197,94,0.1)" strokeWidth="0.8" fill="none"
      style={{ animation: 'glowPulse 3.5s ease-in-out infinite' }}
    />
  </svg>
)

/* ─── Aurora gradient bar ─────────────────────────────────────── */
export const Aurora = ({ className = '' }) => (
  <div
    aria-hidden="true"
    className={`aurora-bar pointer-events-none ${className}`}
    style={{
      height: '180px',
      background: 'linear-gradient(180deg, transparent 0%, rgba(34,197,94,0.05) 40%, rgba(22,163,74,0.03) 70%, transparent 100%)',
    }}
  />
)

/* ─── Scan line sweep ─────────────────────────────────────────── */
export const ScanLine = ({ className = '' }) => (
  <div aria-hidden="true" className={`scan-line ${className}`} />
)

/* ─── Meteor streaks ──────────────────────────────────────────── */
export const Meteors = ({ count = 5, className = '' }) => {
  const items = Array.from({ length: count }, (_, i) => {
    const seed = i * 89.7
    const top = 5 + ((seed * 1.3) % 55)
    const right = ((seed * 0.7) % 80)
    const delay = (seed * 0.5) % 9
    const duration = 4 + ((seed * 0.8) % 5)
    return { top, right, delay, duration }
  })
  return (
    <div aria-hidden="true" className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {items.map(({ top, right, delay, duration }, i) => (
        <div
          key={i}
          className="meteor-streak"
          style={{
            top: `${top}%`,
            right: `${right}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ─── Noise grain texture ─────────────────────────────────────── */
export const NoiseLayer = ({ className = '' }) => (
  <div aria-hidden="true" className={`noise-layer ${className}`} />
)

/* ─── Glow rings pulse ────────────────────────────────────────── */
export const GlowRings = ({ className = '' }) => (
  <div aria-hidden="true" className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}>
    {[120, 220, 340, 480].map((size, i) => (
      <div
        key={size}
        className="glow-ring absolute"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${i * 0.7}s`,
          animationDuration: `${3.5 + i * 0.4}s`,
          borderColor: `rgba(34,197,94,${0.10 - i * 0.02})`,
        }}
      />
    ))}
  </div>
)
