import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ScatterChart, Scatter, Legend
} from 'recharts';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, Clock, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { AI_ALERTS, RISK_MATRIX_DATA } from '../data/mockData';

// ── Risk Matrix (5x5 grid) ───────────────────────────────────
function RiskMatrix({ incidents }) {
  const labels = {
    y: ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost\nCertain'],
    x: ['Negligible', 'Minor', 'Moderate', 'Major', 'Catastrophic'],
  };

  // Color by probability × severity
  const cellColor = (row, col) => {
    const risk = (row + 1) * (col + 1);
    if (risk >= 16) return '#7f1d1d'; // critical
    if (risk >= 9)  return '#78350f'; // high
    if (risk >= 4)  return '#3d2e04'; // medium
    return '#0c1a10';                  // low
  };

  const cellBorder = (row, col) => {
    const risk = (row + 1) * (col + 1);
    if (risk >= 16) return '#e11d48';
    if (risk >= 9)  return '#f59e0b';
    if (risk >= 4)  return '#eab308';
    return '#166534';
  };

  // Map incident to grid position
  const getGridPos = inc => {
    const probRow = Math.min(4, Math.floor(inc.probability / 20)); // 0-4
    const sevCol  = Math.min(4, inc.severity - 1);                 // 0-4
    return { row: probRow, col: sevCol };
  };

  return (
    <div className="bg-[#0a0f1a] border border-slate-800 rounded-2xl p-5">
      <h3 className="text-sm font-bold text-slate-200 mb-1">Risk Assessment Matrix</h3>
      <p className="text-xs text-slate-500 mb-4">Probability × Severity — plotted from offset-well historical data</p>

      <div className="flex">
        {/* Y-axis label */}
        <div className="flex flex-col items-center justify-center mr-2 space-y-1" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          <span className="text-[9px] text-slate-500 uppercase tracking-widest">Probability →</span>
        </div>

        <div className="flex-1">
          {/* Grid */}
          <div className="grid grid-cols-5 gap-1 mb-2">
            {[4,3,2,1,0].map(row =>
              [0,1,2,3,4].map(col => {
                const incidentsHere = incidents.filter(inc => {
                  const pos = getGridPos(inc);
                  return pos.row === row && pos.col === col;
                });
                return (
                  <div
                    key={`${row}-${col}`}
                    className="relative h-12 rounded-lg flex items-center justify-center transition-all hover:brightness-125 cursor-default border"
                    style={{ backgroundColor: cellColor(row, col), borderColor: cellBorder(row, col) + '40' }}
                    title={`${labels.y[row]} × ${labels.x[col]}`}
                  >
                    {incidentsHere.map((inc, i) => (
                      <div
                        key={inc.id}
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white border border-white/20 cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: inc.color, marginLeft: i * 12 }}
                        title={inc.name}
                      >
                        {inc.id}
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>

          {/* X labels */}
          <div className="grid grid-cols-5 gap-1">
            {labels.x.map(l => (
              <div key={l} className="text-center text-[9px] text-slate-500 leading-tight">{l}</div>
            ))}
          </div>
          <div className="text-center text-[9px] text-slate-500 mt-1 uppercase tracking-widest">← Severity →</div>
        </div>
      </div>

      {/* Incident legend */}
      <div className="mt-4 grid grid-cols-2 gap-1.5">
        {incidents.map(inc => (
          <div key={inc.id} className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[8px] font-black text-white border border-white/20"
                 style={{ backgroundColor: inc.color }}>
              {inc.id}
            </div>
            <span className="text-[10px] text-slate-400 truncate">{inc.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── NPT Breakdown chart ──────────────────────────────────────
const NPT_DATA = [
  { name: 'Mud Loss', npt: 86.5, color: '#f59e0b' },
  { name: 'Stuck Pipe', npt: 36.8, color: '#a78bfa' },
  { name: 'Kick', npt: 28.0, color: '#e11d48' },
  { name: 'ECD/Tight', npt: 11.2, color: '#f97316' },
  { name: 'Torque', npt: 5.5, color: '#06b6d4' },
];

// ── Expanded alert card ──────────────────────────────────────
function ExpandableAlert({ alert }) {
  const [open, setOpen] = useState(false);
  const configs = {
    critical: { bg: 'bg-rose-950/25', border: 'border-rose-500/40', strip: 'bg-rose-500', icon: <ShieldAlert size={16} className="text-rose-400" />, title: 'text-rose-400', badge: 'bg-rose-500/15 text-rose-400 border-rose-500/25' },
    warning:  { bg: 'bg-amber-950/20', border: 'border-amber-500/30', strip: 'bg-amber-500', icon: <AlertTriangle size={16} className="text-amber-400" />, title: 'text-amber-400', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
    info:     { bg: 'bg-slate-800/30', border: 'border-slate-700', strip: 'bg-cyan-500', icon: <Info size={16} className="text-cyan-400" />, title: 'text-cyan-400', badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25' },
  };
  const c = configs[alert.type];

  return (
    <div className={`relative rounded-xl border ${c.bg} ${c.border} overflow-hidden transition-all`}>
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${c.strip}`} />
      <div
        className="pl-4 pr-3 py-3 flex items-start justify-between cursor-pointer select-none"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-start space-x-2.5">
          {c.icon}
          <div>
            <p className={`text-xs font-bold leading-snug ${c.title}`}>{alert.message}</p>
            <div className="flex items-center space-x-2 mt-1.5">
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${c.badge} font-semibold`}>{alert.affectedDepth}</span>
              {alert.probability && (
                <span className="text-[10px] text-slate-500">Confidence: <span className="font-bold text-slate-300">{alert.probability}%</span></span>
              )}
              <span className="text-[10px] text-slate-600 flex items-center">
                <Clock size={9} className="mr-1" />{alert.timestamp}
              </span>
            </div>
          </div>
        </div>
        <button className="text-slate-500 hover:text-slate-200 transition-colors ml-2 flex-shrink-0 mt-0.5">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {open && (
        <div className="pl-4 pr-3 pb-4 space-y-3 border-t border-slate-700/40 pt-3">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-1">Data Source</p>
            <p className="text-xs text-slate-300">{alert.source}</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
            <p className="text-[10px] text-emerald-400 font-bold mb-1.5 flex items-center">
              <CheckCircle2 size={10} className="mr-1" /> RECOMMENDED MITIGATIONS
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">{alert.recommendation}</p>
          </div>
          {alert.wellsRef?.length > 0 && (
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-1">Referenced Wells</p>
              <div className="flex flex-wrap gap-1.5">
                {alert.wellsRef.map(w => (
                  <span key={w} className="text-[10px] px-2 py-0.5 rounded border border-slate-700 text-slate-400 bg-slate-800/60">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}
          {alert.probability && (
            <div className="flex items-center space-x-3">
              <span className="text-[10px] text-slate-500">ML Confidence</span>
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${c.strip}`} style={{ width: `${alert.probability}%` }} />
              </div>
              <span className={`text-xs font-black ${c.title}`}>{alert.probability}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RiskAlerts({ activeWell }) {
  const [filter, setFilter] = useState('all');

  const filteredAlerts = filter === 'all'
    ? AI_ALERTS
    : AI_ALERTS.filter(a => a.type === filter);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-4 space-y-4">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-200 flex items-center space-x-2">
            <Zap size={16} className="text-amber-400" />
            <span>Predictive Risk Alerts & Mitigations</span>
          </h2>
          <p className="text-xs text-slate-500">AI/ML model — real-time risk detection from offset-well patterns</p>
        </div>
        <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
          {[['all','All'], ['critical','Critical'], ['warning','Warning'], ['info','Info']].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === v ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Summary badges */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Critical', count: AI_ALERTS.filter(a => a.type === 'critical').length, color: 'bg-rose-500/10 text-rose-400 border-rose-500/25' },
          { label: 'Warning', count: AI_ALERTS.filter(a => a.type === 'warning').length, color: 'bg-amber-500/10 text-amber-400 border-amber-500/25' },
          { label: 'Info', count: AI_ALERTS.filter(a => a.type === 'info').length, color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25' },
          { label: 'Dismissed', count: 0, color: 'bg-slate-800 text-slate-500 border-slate-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-3 text-center ${s.color}`}>
            <p className="text-2xl font-black">{s.count}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Main content: alerts + charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Alert cards */}
        <div className="lg:col-span-2 space-y-3">
          {filteredAlerts.map(a => <ExpandableAlert key={a.id} alert={a} />)}
        </div>

        {/* Sidebar: Risk matrix + NPT */}
        <div className="space-y-4">
          <RiskMatrix incidents={RISK_MATRIX_DATA} />

          {/* NPT by category */}
          <div className="bg-[#0a0f1a] border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-200 mb-1">NPT by Category</h3>
            <p className="text-xs text-slate-500 mb-3">Total from all offset wells (hrs)</p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={NPT_DATA} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                  <XAxis type="number" stroke="#1e293b" tick={{ fill: '#475569', fontSize: 9 }} />
                  <YAxis type="category" dataKey="name" width={72} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 11 }}
                    formatter={v => [`${v} hrs`]}
                  />
                  <Bar dataKey="npt" radius={[0, 4, 4, 0]}>
                    {NPT_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-center">
              <span className="text-xs text-slate-500">Total NPT tracked: </span>
              <span className="text-sm font-black text-rose-400">
                {NPT_DATA.reduce((s, d) => s + d.npt, 0).toFixed(1)} hrs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Proactive recommendation checklist */}
      <div className="bg-[#0a0f1a] border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-1">Pre-Emptive Action Checklist</h3>
        <p className="text-xs text-slate-500 mb-4">AI-generated actions before entering high-risk zone at 2440m</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { action: 'Stage 50 bbl LCM pill (coarse nut plug + cellophane)', priority: 'Critical', done: false },
            { action: 'Reduce flow rate target to 380 GPM approaching 2440m', priority: 'Critical', done: false },
            { action: 'Increase mud monitoring frequency — check returns every 5 min', priority: 'High', done: false },
            { action: 'Prepare OBM pill (30 bbl) for potential stuck pipe', priority: 'High', done: false },
            { action: 'Notify mud engineer to increase viscosity check frequency', priority: 'Medium', done: true },
            { action: 'Brief driller on tight-hole procedure from W-33 record', priority: 'Medium', done: true },
          ].map((item, i) => (
            <div key={i} className={`flex items-start space-x-3 p-3 rounded-xl border transition-colors ${
              item.done
                ? 'bg-emerald-950/15 border-emerald-900/30'
                : item.priority === 'Critical'
                  ? 'bg-rose-950/20 border-rose-900/30'
                  : item.priority === 'High'
                    ? 'bg-amber-950/15 border-amber-900/25'
                    : 'bg-slate-900/50 border-slate-800'
            }`}>
              <div className={`mt-0.5 flex-shrink-0 ${item.done ? 'text-emerald-400' : item.priority === 'Critical' ? 'text-rose-400' : item.priority === 'High' ? 'text-amber-400' : 'text-slate-500'}`}>
                {item.done ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              </div>
              <div>
                <p className="text-xs text-slate-300 leading-snug">{item.action}</p>
                <span className={`text-[10px] font-bold ${item.done ? 'text-emerald-500' : item.priority === 'Critical' ? 'text-rose-500' : item.priority === 'High' ? 'text-amber-500' : 'text-slate-500'}`}>
                  {item.done ? '✓ DONE' : item.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
