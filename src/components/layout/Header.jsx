import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, Menu, Wifi, WifiOff, RefreshCw } from 'lucide-react';

export default function Header({ activeWell, onMenuToggle }) {
  const [time, setTime] = useState(new Date());
  const [syncPulse, setSyncPulse] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = time.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = time.toLocaleTimeString('en-IN', { hour12: false });

  // Calculate distance to next risk depth
  const riskDepth = 2440;
  const distToRisk = Math.max(0, riskDepth - activeWell.depth);

  return (
    <header className="h-14 flex-shrink-0 flex items-center justify-between px-4 border-b border-slate-800/60 bg-[#080d17]/90 backdrop-blur-xl z-20 relative">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
        >
          <Menu size={18} />
        </button>

        {/* Active rig selector */}
        <div className="flex items-center space-x-2 bg-slate-900/70 border border-slate-700/60 rounded-xl px-3 py-1.5 cursor-pointer hover:border-cyan-500/40 transition-colors group">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-400 font-medium">Active Rig:</span>
          <span className="text-xs font-bold text-white">{activeWell.name}</span>
          <ChevronDown size={13} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
        </div>

        {/* eRTMAC sync */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
          <Wifi size={13} className="text-emerald-400" />
          <span className="text-xs text-emerald-400 font-semibold tracking-wide">eRTMAC LIVE</span>
          <RefreshCw size={11} className="text-emerald-500 animate-spin" style={{ animationDuration: '3s' }} />
        </div>

        {/* Risk countdown */}
        {distToRisk <= 50 && (
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-rose-500/40 bg-rose-950/30 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-xs text-rose-400 font-bold">
              RISK ZONE IN {distToRisk.toFixed(1)}m
            </span>
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center space-x-3">
        {/* Depth badge */}
        <div className="hidden sm:flex items-center space-x-2 bg-slate-900/60 border border-slate-700/50 rounded-xl px-3 py-1.5">
          <span className="text-xs text-slate-400">Depth</span>
          <span className="text-sm font-black text-cyan-400 font-mono">{activeWell.depth?.toFixed(1)}m</span>
          <span className="text-xs text-slate-600">/ {activeWell.targetDepth}m</span>
        </div>

        {/* Time */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs font-mono text-slate-200 font-semibold">{timeStr}</span>
          <span className="text-[10px] text-slate-500">{dateStr}</span>
        </div>

        {/* Bell */}
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_6px_#e11d48]" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white text-xs font-black border border-cyan-500/30 cursor-pointer hover:border-cyan-400/60 transition-colors">
          OP
        </div>
      </div>
    </header>
  );
}
