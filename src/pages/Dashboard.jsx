import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceArea, ReferenceLine,
  AreaChart, Area
} from 'recharts';
import {
  Activity, Target, Droplets, Cpu, Gauge, Thermometer,
  TrendingUp, TrendingDown, ShieldAlert, AlertTriangle,
  Info, Zap, MapPin, CheckCircle2, Clock, ArrowRight,
  BarChart2, ChevronRight, RefreshCw
} from 'lucide-react';
import { ACTIVE_WELL, AI_ALERTS, HISTORICAL_INCIDENTS, FORMATION_LOG, OFFSET_WELLS, REALTIME_STREAM } from '../data/mockData';
import { DEPTH_TORQUE_DATA, TIME_SERIES_DATA } from '../data/chartData';

// ── KPI Card ────────────────────────────────────────────────
function KPICard({ label, value, unit, icon: Icon, color, trend, subtitle }) {
  const colorMap = {
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  };
  const cls = colorMap[color] || colorMap.cyan;

  return (
    <div className="bg-[#0a0f1a] border border-slate-800/70 rounded-2xl p-4 flex items-start justify-between hover:border-slate-700 transition-colors group">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{label}</p>
        <div className="flex items-baseline space-x-1.5">
          <span className={`text-2xl font-black font-mono ${cls.split(' ')[0]}`}>{value}</span>
          {unit && <span className="text-xs text-slate-500 font-medium">{unit}</span>}
        </div>
        {subtitle && <p className="text-[10px] text-slate-600 mt-0.5 truncate">{subtitle}</p>}
        {trend && (
          <div className={`flex items-center space-x-1 mt-1.5 ${trend.up ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            <span className="text-[10px] font-semibold">{trend.label}</span>
          </div>
        )}
      </div>
      <div className={`p-2.5 rounded-xl border ${cls} ml-3 flex-shrink-0 group-hover:scale-105 transition-transform`}>
        <Icon size={20} />
      </div>
    </div>
  );
}

// ── Real-time parameter grid ─────────────────────────────────
function RealTimeGrid({ params }) {
  const channels = REALTIME_STREAM.channels;
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
      {channels.map(ch => {
        const val = params[ch.key];
        const display = val !== undefined
          ? (typeof val === 'number' ? val.toFixed(ch.precision) : val)
          : ch.value.toFixed(ch.precision);
        return (
          <div key={ch.key} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1 truncate">{ch.label}</p>
            <p className="text-base font-black font-mono text-slate-100">{display}</p>
            <p className="text-[10px] text-slate-600 mt-0.5">{ch.unit}</p>
          </div>
        );
      })}
    </div>
  );
}

// ── Formation log strip ──────────────────────────────────────
function FormationStrip({ currentDepth }) {
  const totalDepth = 3500;
  return (
    <div className="flex h-6 rounded-full overflow-hidden border border-slate-700 relative">
      {FORMATION_LOG.map(fm => {
        const pct = ((fm.bottom - fm.top) / totalDepth) * 100;
        return (
          <div
            key={fm.name}
            title={`${fm.name}: ${fm.top}–${fm.bottom}m`}
            className="flex items-center justify-center text-[8px] font-bold text-white/60 truncate px-1 hover:opacity-90 transition-opacity cursor-help"
            style={{ width: `${pct}%`, backgroundColor: fm.color + '40', borderRight: `1px solid ${fm.color}30` }}
          >
            {pct > 8 ? fm.name.split(' ')[0] : ''}
          </div>
        );
      })}
      {/* Current depth marker */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_6px_#22d3ee]"
        style={{ left: `${(currentDepth / totalDepth) * 100}%` }}
      />
    </div>
  );
}

// ── AI Alert card ────────────────────────────────────────────
function AlertCard({ alert }) {
  const configs = {
    critical: {
      bg: 'bg-rose-950/25',
      border: 'border-rose-500/40',
      strip: 'bg-rose-500',
      icon: <ShieldAlert size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />,
      title: 'text-rose-400',
      badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      bar: 'bg-rose-500',
    },
    warning: {
      bg: 'bg-amber-950/20',
      border: 'border-amber-500/35',
      strip: 'bg-amber-500',
      icon: <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />,
      title: 'text-amber-400',
      badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      bar: 'bg-amber-500',
    },
    info: {
      bg: 'bg-slate-800/30',
      border: 'border-slate-700',
      strip: 'bg-cyan-500',
      icon: <Info size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />,
      title: 'text-cyan-400',
      badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      bar: 'bg-cyan-500',
    },
  };
  const c = configs[alert.type];

  return (
    <div className={`relative rounded-xl border ${c.bg} ${c.border} overflow-hidden`}>
      {/* Left strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${c.strip}`} />

      <div className="pl-4 pr-3 py-3">
        <div className="flex items-start space-x-2">
          {c.icon}
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold leading-tight ${c.title}`}>{alert.message}</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{alert.source}</p>

            {/* Recommendation */}
            <div className="mt-2 bg-slate-900/50 rounded-lg p-2 border border-slate-800">
              <p className="text-[10px] text-slate-400 font-semibold mb-0.5 flex items-center">
                <CheckCircle2 size={10} className="mr-1 text-slate-500" /> RECOMMENDED ACTION
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">{alert.recommendation}</p>
            </div>

            {/* Meta row */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${c.badge} font-medium`}>
                  {alert.affectedDepth}
                </span>
                {alert.wellsRef?.map(w => (
                  <span key={w} className="text-[10px] px-1.5 py-0.5 rounded border border-slate-700 text-slate-400 bg-slate-800/50">
                    {w}
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-slate-600 flex items-center">
                <Clock size={9} className="mr-1" />{alert.timestamp}
              </span>
            </div>

            {/* Confidence bar */}
            {alert.probability && (
              <div className="mt-2.5 flex items-center space-x-2">
                <span className="text-[10px] text-slate-500 flex-shrink-0">Confidence</span>
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${c.bar}`}
                    style={{ width: `${alert.probability}%` }}
                  />
                </div>
                <span className={`text-[11px] font-black ${c.title}`}>{alert.probability}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Custom Recharts Tooltip ──────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a0f1a] border border-slate-700 rounded-xl p-3 shadow-2xl text-xs">
      <p className="text-slate-400 mb-2 font-semibold">Depth: <span className="text-white">{label}m</span></p>
      {payload.map(p => p.value != null && (
        <p key={p.name} className="flex items-center space-x-2 py-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-slate-400">{p.name}:</span>
          <span className="text-white font-bold">{p.value.toFixed(2)}</span>
        </p>
      ))}
    </div>
  );
};

// ── Main Dashboard page ──────────────────────────────────────
export default function Dashboard({ activeWell }) {
  const [chartParam, setChartParam] = useState('torque');

  const depthProgress = ((activeWell.depth / activeWell.targetDepth) * 100).toFixed(1);
  const currentFormation = FORMATION_LOG.find(f => activeWell.depth >= f.top && activeWell.depth < f.bottom) || FORMATION_LOG[5];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-4 space-y-4">

      {/* ── Formation strip banner ── */}
      <div className="bg-[#0a0f1a] border border-slate-800 rounded-2xl px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: currentFormation.color }} />
            <span className="text-sm font-bold text-slate-200">{currentFormation.name}</span>
            <span className="text-xs text-slate-500">| {currentFormation.lithology}</span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span>Progress: <span className="text-cyan-400 font-bold">{depthProgress}%</span></span>
            <span className="text-slate-600">TD: {activeWell.targetDepth}m</span>
          </div>
        </div>
        <FormationStrip currentDepth={activeWell.depth} />
      </div>

      {/* ── Top KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard
          label="Current Depth" icon={Target} color="cyan"
          value={activeWell.depth?.toFixed(1)} unit="m"
          trend={{ up: true, label: '+45m vs plan' }}
          subtitle={`TD: ${activeWell.targetDepth}m`}
        />
        <KPICard
          label="Rate of Penetration" icon={Activity} color="emerald"
          value={activeWell.rop?.toFixed(1)} unit="m/hr"
          trend={{ up: false, label: 'Opt: 22–24 m/hr' }}
          subtitle="AI suggests ↑WOB"
        />
        <KPICard
          label="Torque" icon={Gauge} color="amber"
          value={activeWell.torque?.toFixed(1)} unit="kNm"
          subtitle={`RPM: ${activeWell.rpm}`}
        />
        <KPICard
          label="ECD / MW" icon={Droplets} color="indigo"
          value={`${activeWell.ecd?.toFixed(3)}`} unit="SG"
          subtitle={`MW: ${activeWell.mudWeight?.toFixed(3)} SG`}
        />
      </div>

      {/* ── Real-time channel grid ── */}
      <div className="bg-[#0a0f1a] border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
            <RefreshCw size={14} className="text-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
            <span>eRTMAC Live Channel Feed</span>
          </h3>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full font-semibold">
            Streaming @ 2s
          </span>
        </div>
        <RealTimeGrid params={activeWell} />
      </div>

      {/* ── Middle: Chart + Alerts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Depth vs Torque Chart */}
        <div className="lg:col-span-2 bg-[#0a0f1a] border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Depth vs Parameter Analysis</h3>
              <p className="text-xs text-slate-500">Active vs offset wells & AI prediction</p>
            </div>
            <div className="flex space-x-2">
              {['torque', 'rop'].map(p => (
                <button
                  key={p}
                  onClick={() => setChartParam(p)}
                  className={`px-3 py-1 text-xs rounded-lg border font-medium transition-colors ${
                    chartParam === p
                      ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DEPTH_TORQUE_DATA} margin={{ top: 4, right: 20, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="depth" stroke="#334155"
                  tick={{ fill: '#475569', fontSize: 10 }}
                  tickLine={false}
                />
                <YAxis stroke="#334155" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />

                {/* Risk zone */}
                <ReferenceArea x1={2440} x2={2500} fill="#e11d48" fillOpacity={0.08} strokeOpacity={0} />
                {/* Current depth */}
                <ReferenceLine
                  x={activeWell.depth}
                  stroke="#22d3ee"
                  strokeDasharray="4 3"
                  strokeWidth={1.5}
                  label={{ position: 'top', value: '▼ Now', fill: '#22d3ee', fontSize: 10 }}
                />
                {/* Risk zone label */}
                <ReferenceLine
                  x={2440}
                  stroke="#e11d48"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  label={{ position: 'insideTopLeft', value: '⚠ Risk Zone', fill: '#e11d48', fontSize: 9 }}
                />

                <Line type="monotone" dataKey="offset_W45" name="Makum-45" stroke="#475569" strokeWidth={1.5} dot={false} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="offset_W48" name="Makum-48" stroke="#374151" strokeWidth={1.5} dot={false} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="predicted"   name="AI Predicted" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="5 4" />
                <Line type="monotone" dataKey="actual"      name="Makum-72 (Live)" stroke="#22d3ee" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Alerts panel */}
        <div className="bg-[#0a0f1a] border border-slate-800 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <Zap size={15} className="text-amber-400" />
              <span>AI Risk Alerts</span>
            </h3>
            <span className="text-[10px] px-2 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/25 font-semibold flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse mr-1.5" />
              LIVE
            </span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-1">
            {AI_ALERTS.map(a => <AlertCard key={a.id} alert={a} />)}
          </div>
        </div>
      </div>

      {/* ── Bottom: Incident table + offset summary ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Historical incident table */}
        <div className="lg:col-span-3 bg-[#0a0f1a] border border-slate-800 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Correlated Historical Incidents</h3>
              <p className="text-xs text-slate-500">NLP-extracted from WCRs & DDRs</p>
            </div>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-900 z-10">
                <tr>
                  {['Depth','Well','Severity','Event','NPT hrs','Mitigation'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-[10px] text-slate-500 font-semibold uppercase tracking-wide border-b border-slate-800 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HISTORICAL_INCIDENTS.map(inc => (
                  <tr key={inc.id} className="border-b border-slate-800/60 hover:bg-slate-800/20 transition-colors">
                    <td className="px-3 py-2.5 font-mono text-slate-200 font-semibold whitespace-nowrap">{inc.depth}m</td>
                    <td className="px-3 py-2.5 text-cyan-400/90 whitespace-nowrap font-medium">{inc.well}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        inc.severity === 'Critical' ? 'bg-rose-950/40 text-rose-400 border-rose-800/50' :
                        inc.severity === 'High'     ? 'bg-amber-950/40 text-amber-400 border-amber-800/50' :
                                                     'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-300 whitespace-nowrap">{inc.event}</td>
                    <td className="px-3 py-2.5 font-mono text-rose-400 text-center">{inc.nptHours}</td>
                    <td className="px-3 py-2.5 text-slate-400 leading-relaxed max-w-xs">{inc.mitigation.slice(0, 80)}…</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Offset well summary cards */}
        <div className="lg:col-span-2 bg-[#0a0f1a] border border-slate-800 rounded-2xl p-4">
          <h3 className="text-sm font-bold text-slate-200 mb-3">Nearest Offset Wells</h3>
          <div className="space-y-2.5">
            {OFFSET_WELLS.map(w => (
              <div key={w.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 hover:border-slate-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin size={13} className="text-slate-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-200">{w.name}</p>
                      <p className="text-[10px] text-slate-500">{w.distance} · {w.bearing}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${
                    w.status === 'Completed'  ? 'bg-emerald-950/30 text-emerald-400 border-emerald-800/30' :
                    w.status === 'Abandoned'  ? 'bg-rose-950/30 text-rose-400 border-rose-800/30' :
                                               'bg-amber-950/30 text-amber-400 border-amber-800/30'
                  }`}>{w.status}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {w.incidents.map((inc, i) => (
                    <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded border ${
                      inc.severity === 'critical' ? 'bg-rose-950/30 text-rose-400 border-rose-900/40' :
                      inc.severity === 'high'     ? 'bg-amber-950/30 text-amber-400 border-amber-900/40' :
                                                   'bg-slate-800 text-slate-500 border-slate-700'
                    }`}>
                      ⚠ {inc.type} @ {inc.depth}m
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
