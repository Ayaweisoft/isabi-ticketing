import React from 'react'
import Logo from '../../assets/logo.png'

const GentleLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <img src={Logo} alt="i-Sabi" className="w-14 h-14 object-contain animate-[float_2s_ease-in-out_infinite]" />
          <div className="absolute -inset-2 rounded-full border border-[#22c55e]/20 animate-ping" />
        </div>
        <div className="flex gap-1">
          {[0, 0.15, 0.3].map((delay, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"
              style={{ animation: `pulseDot 1.2s ${delay}s ease-in-out infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default GentleLoader
