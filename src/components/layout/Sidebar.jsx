import React from 'react';
import {
  Activity, Map, Target, AlertTriangle, Database,
  Settings, ChevronRight, Zap, Layers
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Live Dashboard', icon: Activity, badge: null },
  { id: 'map',       label: 'Geospatial Map',  icon: Map,       badge: null },
  { id: 'analysis',  label: 'Offset Analysis', icon: Layers,    badge: null },
  { id: 'alerts',    label: 'Risk & Alerts',   icon: AlertTriangle, badge: 3 },
  { id: 'kb',        label: 'Knowledge Base',  icon: Database,  badge: null },
];

const SidebarItem = ({ item, active, onClick }) => {
  const { icon: Icon, label, badge } = item;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${
        active
          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]'
          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 border border-transparent'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-1.5 rounded-lg transition-colors ${active ? 'bg-cyan-500/15' : 'bg-transparent group-hover:bg-slate-700/50'}`}>
          <Icon size={17} className={active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'} />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center space-x-2">
        {badge && (
          <span className="bg-rose-500/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {badge}
          </span>
        )}
        {active && <ChevronRight size={14} className="text-cyan-500" />}
      </div>
    </button>
  );
};

export default function Sidebar({ activeTab, setActiveTab, isOpen }) {
  return (
    <aside
      className={`${isOpen ? 'w-60' : 'w-0 overflow-hidden'} flex-shrink-0 bg-[#080d17] border-r border-slate-800/60 flex flex-col transition-all duration-300 z-30`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800/60 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Zap size={18} className="text-cyan-400" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#080d17]" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-widest text-white leading-tight">
              NWIS<span className="text-cyan-400">.AI</span>
            </h1>
            <p className="text-[8px] text-slate-600 font-semibold uppercase tracking-[0.2em] leading-none">
              Oil India Limited
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.18em] px-3 pt-2 pb-3">
          Navigation
        </p>
        {NAV_ITEMS.map(item => (
          <SidebarItem
            key={item.id}
            item={item}
            active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800/60 space-y-1">
        <SidebarItem
          item={{ id: 'settings', label: 'System Config', icon: Settings, badge: null }}
          active={false}
          onClick={() => {}}
        />
        {/* Version tag */}
        <div className="px-3 pt-2 flex items-center justify-between">
          <span className="text-[10px] text-slate-600">v2.4.1 — SIH 2024</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 font-mono">BETA</span>
        </div>
      </div>
    </aside>
  );
}
