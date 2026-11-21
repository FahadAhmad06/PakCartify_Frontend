import React, { useEffect, useRef } from 'react';
import logo from '/logo.png';
import { Instagram, Telegram } from '@mui/icons-material';

function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden mt-[100px]"
      style={{ background: 'radial-gradient(ellipse at 20% 20%, #e8f8ef 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, #fffbea 0%, transparent 50%), #ffffff' }}>

      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[8%] left-[12%] w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
        <div className="absolute top-[15%] left-[80%] w-1.5 h-1.5 rounded-full bg-[#0B6B3A] animate-ping" />
        <div className="absolute top-[70%] left-[6%] w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
        <div className="absolute top-[75%] left-[88%] w-1.5 h-1.5 rounded-full bg-[#0B6B3A] animate-ping" />
        <div className="absolute top-[40%] left-[3%] w-1 h-1 rounded-full bg-yellow-400 animate-pulse" />
        <div className="absolute top-[30%] left-[93%] w-2 h-2 rounded-full bg-[#0B6B3A] animate-pulse" />
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full border border-[#0B6B3A]/10 animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full border border-yellow-300/20 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
      </div>

      {/* Logo */}
      <div className="animate-bounce mb-6 relative z-10" style={{ animation: 'float 4s ease-in-out infinite' }}>
        <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(11,107,58,0.08), transparent 70%)' }} />
        <img
          src={logo}
          alt="PakMart Logo"
          className="w-72 h-auto object-contain relative"
          style={{ filter: 'drop-shadow(0 24px 48px rgba(11,107,58,0.2)) drop-shadow(0 8px 16px rgba(0,0,0,0.08))' }}
        />
      </div>

      {/* Tagline */}
      <p className="text-[11px] font-semibold tracking-[4px] uppercase mb-2 relative z-10"
        style={{ background: 'linear-gradient(90deg,#0B6B3A,#1E8E5A,#DAA520,#1E8E5A,#0B6B3A)', backgroundSize: '300% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 4s linear infinite' }}>
        Pakistan's Favourite Online Store
      </p>

      {/* Description */}
      <p className="text-gray-500 text-[15px] max-w-md leading-loose mb-8 relative z-10">
        We're crafting an extraordinary shopping experience just for you. Great deals, fast delivery, and so much more — launching very soon!
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-sm bg-white border border-[#d4ede0] rounded-2xl p-5 mb-6 z-10" style={{ boxShadow: '0 4px 24px rgba(11,107,58,0.07)' }}>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-gray-400 font-medium">Development progress</span>
          <span className="text-xs text-[#0B6B3A] font-semibold bg-[#e8f5ee] px-3 py-0.5 rounded-full">72%</span>
        </div>
        <div className="bg-[#f0faf4] rounded-full h-2.5 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: '72%', background: 'linear-gradient(90deg,#054A28,#0B6B3A,#1E8E5A)', boxShadow: '0 2px 8px rgba(11,107,58,0.3)' }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[11px] text-gray-300">Started</span>
          <span className="text-[11px] text-gray-300">Almost there!</span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2 bg-white border border-[#d4ede0] rounded-full px-7 py-3 mb-8 z-10" style={{ boxShadow: '0 6px 24px rgba(11,107,58,0.1)' }}>
        <div className="w-2.5 h-2.5 bg-[#0B6B3A] rounded-full" style={{ animation: 'pulse-green 1.4s infinite' }} />
        <span className="text-sm text-gray-500 font-medium">Still working on it</span>
        <span className="text-xl text-[#0B6B3A] font-bold animate-bounce" style={{ animationDelay: '0s' }}>.</span>
        <span className="text-xl text-[#0B6B3A] font-bold animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
        <span className="text-xl text-[#0B6B3A] font-bold animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
      </div>

      {/* Feature Cards */}
      <div className="flex flex-wrap gap-3 justify-center mb-8 z-10">
        {[
          { icon: '🚚', label: 'Fast delivery', gold: false },
          { icon: '🔒', label: 'Secure pay', gold: false },
          { icon: '🏷️', label: 'Best prices', gold: true },
          { icon: '🎧', label: '24/7 support', gold: false },
          { icon: '⭐', label: 'Top brands', gold: false },
        ].map((f) => (
          <div key={f.label}
            className={`flex flex-col items-center gap-2 px-5 py-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1 cursor-default ${f.gold ? 'border-yellow-200 bg-yellow-50' : 'border-[#e0f0e8] bg-white hover:border-[#0B6B3A]'}`}>
            <span className="text-2xl">{f.icon}</span>
            <span className="text-xs text-gray-500 font-medium">{f.label}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pulse-green { 0%,100%{box-shadow:0 0 0 0 rgba(11,107,58,0.5)} 50%{box-shadow:0 0 0 10px rgba(11,107,58,0)} }
      `}</style>
    </div>
  );
}

export default ComingSoon;





