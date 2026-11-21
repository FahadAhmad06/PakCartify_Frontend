import React from 'react'

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-[3px] border-[#0E5D33]/20"></div>
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#0E5D33] animate-spin"></div>
        <div className="absolute inset-[10px] rounded-full border-2 border-transparent border-t-[#1D9E75] animate-spin" style={{ animationDuration: '1.2s', animationDirection: 'reverse' }}></div>
        <div className="absolute inset-[22px] rounded-full bg-[#0E5D33]/10 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#0E5D33] animate-pulse"></div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-[15px] font-medium text-gray-800">Loading product</p>
        <div className="flex gap-1 items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0E5D33] animate-bounce" style={{ animationDelay: '0s' }}></span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0E5D33] animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0E5D33] animate-bounce" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>

    </div>
  )
}

export default Loader;
