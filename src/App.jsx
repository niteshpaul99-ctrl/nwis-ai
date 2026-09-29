import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import OffsetAnalysis from './pages/OffsetAnalysis';
import RiskAlerts from './pages/RiskAlerts';
import KnowledgeBase from './pages/KnowledgeBase';
import { ACTIVE_WELL, REALTIME_STREAM } from './data/mockData';

// ────────────────────────────────────────────────────────────
// Live drilling simulator — updates params every 2 seconds
// ────────────────────────────────────────────────────────────
function useDrillingSimulator(initial) {
  const [params, setParams] = useState(() => {
    const init = {};
    REALTIME_STREAM.channels.forEach(ch => { init[ch.key] = ch.value; });
    return init;
  });

  useEffect(() => {
    const tick = setInterval(() => {
      setParams(prev => {
        const next = { ...prev };
        next.depth = +(prev.depth + (Math.random() * 0.08 + 0.02)).toFixed(1);
        next.rop = +(prev.rop + (Math.random() * 1.2 - 0.6)).toFixed(1);
        next.rop = Math.max(8, Math.min(35, next.rop));
        next.wob = +(prev.wob + (Math.random() * 0.4 - 0.2)).toFixed(1);
        next.wob = Math.max(6, Math.min(20, next.wob));
        next.rpm = +(prev.rpm + (Math.random() * 2 - 1)).toFixed(0);
        next.rpm = Math.max(40, Math.min(110, next.rpm));
        next.torque = +(prev.torque + (Math.random() * 1.2 - 0.6)).toFixed(1);
        next.torque = Math.max(8, Math.min(35, next.torque));
        next.spp = +(prev.spp + (Math.random() * 40 - 20)).toFixed(0);
        next.spp = Math.max(2200, Math.min(3600, next.spp));
        next.ecd = +(prev.ecd + (Math.random() * 0.004 - 0.002)).toFixed(3);
        next.ecd = Math.max(1.15, Math.min(1.35, next.ecd));
        next.mudWeight = +(prev.mudWeight + (Math.random() * 0.002 - 0.001)).toFixed(3);
        next.temperature = +(prev.temperature + (Math.random() * 0.3 - 0.1)).toFixed(1);
        next.hookLoad = +(prev.hookLoad + (Math.random() * 2 - 1)).toFixed(0);
        next.blockSpeed = +(prev.blockSpeed + (Math.random() * 0.02 - 0.01)).toFixed(2);
        next.blockSpeed = Math.max(0, Math.min(1.5, next.blockSpeed));
        next.flowRate = +(prev.flowRate + (Math.random() * 4 - 2)).toFixed(0);
        next.flowRate = Math.max(360, Math.min(520, next.flowRate));
        return next;
      });
    }, 2000);
    return () => clearInterval(tick);
  }, []);

  return params;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const liveParams = useDrillingSimulator();

  const activeWell = { ...ACTIVE_WELL, ...liveParams };

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-200 font-sans flex overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── Sidebar ── */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* ── Main ── */}
      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-0' : 'ml-0'}`}>
        <Header
          activeWell={activeWell}
          onMenuToggle={() => setSidebarOpen(o => !o)}
        />

        <main className="flex-1 overflow-hidden relative">
          {/* Ambient top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-40 bg-cyan-900/15 blur-[120px] rounded-full pointer-events-none z-0" />

          <div className="relative z-10 h-full">
            {activeTab === 'dashboard'  && <Dashboard  activeWell={activeWell} />}
            {activeTab === 'map'        && <MapView     activeWell={activeWell} />}
            {activeTab === 'analysis'   && <OffsetAnalysis activeWell={activeWell} />}
            {activeTab === 'alerts'     && <RiskAlerts  activeWell={activeWell} />}
            {activeTab === 'kb'         && <KnowledgeBase />}
          </div>
        </main>
      </div>
    </div>
  );
}
