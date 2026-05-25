/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#22c55e',
          'green-mid': '#16a34a',
          'green-deep': '#0d4a1a',
          gold: '#eab308',
          'gold-light': '#fde047',
          dark: '#0a0a0a',
          card: '#111111',
          'card-2': '#161616',
          border: '#1f2937',
          'border-subtle': 'rgba(255,255,255,0.06)',
        }
      },
      animation: {
        'pulse-dot': 'pulseDot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-green': 'glowGreen 2.5s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 7s ease-in-out infinite',
        'float-delayed': 'float 5s ease-in-out 1.5s infinite',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-up': 'slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-scale': 'fadeInScale 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'shimmer': 'shimmer 2.2s linear infinite',
        'shimmer-btn': 'shimmerBtn 3s linear infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'orb': 'orbFloat 8s ease-in-out infinite',
        'orb-reverse': 'orbFloatReverse 10s ease-in-out infinite',
        'ticket-enter': 'ticketEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'count-up': 'countUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'slide-left': 'slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-right': 'slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'gradient-x': 'gradientX 4s ease infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
        'drift-y': 'driftY 8s ease-in-out infinite',
        'drift-y-slow': 'driftY 14s ease-in-out 3s infinite',
        'rotate-slow': 'rotateSlow 28s linear infinite',
        'rotate-reverse': 'rotateReverse 20s linear infinite',
        'scan': 'scanLine 8s linear infinite',
        'particle-rise': 'particleRise 5s ease-in infinite',
        'morph': 'morphBlob 12s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3.5s ease-in-out infinite',
        'meteor': 'meteor 6s linear infinite',
        'aurora-shift': 'auroraShift 10s ease-in-out infinite',
        'flicker': 'flicker 4s ease-in-out infinite',
        'beam-rotate': 'beamRotate 18s linear infinite',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        glowGreen: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(34,197,94,0.2)' },
          '50%': { boxShadow: '0 0 28px rgba(34,197,94,0.45), 0 0 60px rgba(34,197,94,0.12)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        shimmerBtn: {
          '0%': { backgroundPosition: '-300% 0' },
          '100%': { backgroundPosition: '300% 0' },
        },
        orbFloat: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(20px, -15px) scale(1.05)' },
          '66%': { transform: 'translate(-10px, 10px) scale(0.97)' },
        },
        orbFloatReverse: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(-20px, 15px) scale(0.96)' },
          '66%': { transform: 'translate(12px, -8px) scale(1.04)' },
        },
        ticketEnter: {
          '0%': { opacity: '0', transform: 'translateY(20px) rotateX(8deg)' },
          '100%': { opacity: '1', transform: 'translateY(0) rotateX(0deg)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(0.5)' },
        },
        driftY: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-22px) rotate(4deg)' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        rotateReverse: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        scanLine: {
          '0%': { top: '-1px', opacity: '0' },
          '5%': { opacity: '1' },
          '95%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
        particleRise: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.7' },
          '60%': { opacity: '0.3' },
          '100%': { transform: 'translateY(-280px) scale(0.2)', opacity: '0' },
        },
        morphBlob: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '33%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '66%': { borderRadius: '50% 60% 40% 60% / 40% 70% 30% 60%' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.04', transform: 'scale(1)' },
          '50%': { opacity: '0.14', transform: 'scale(1.06)' },
        },
        meteor: {
          '0%': { transform: 'translateX(0) translateY(0)', opacity: '1' },
          '70%': { opacity: '0.6' },
          '100%': { transform: 'translateX(-300px) translateY(200px)', opacity: '0' },
        },
        auroraShift: {
          '0%, 100%': { transform: 'translateX(-10%) scaleX(1.1)', opacity: '0.6' },
          '50%': { transform: 'translateX(10%) scaleX(0.9)', opacity: '1' },
        },
        flicker: {
          '0%, 100%': { opacity: '0.18' },
          '25%': { opacity: '0.08' },
          '50%': { opacity: '0.22' },
          '75%': { opacity: '0.12' },
        },
        beamRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ['dark'],
  },
}
