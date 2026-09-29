import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceArea, ReferenceLine,
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { TrendingUp, ArrowRight, Activity, Layers, Droplets } from 'lucide-react';
import { ACTIVE_WELL, OFFSET_WELLS, FORMATION_LOG } from '../data/mockData';
import { DEPTH_TORQUE_DATA, DEPTH_ROP_DATA, DEPTH_MUDWEIGHT_DATA } from '../data/chartData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a0f1a] border border-slate-700 rounded-xl p-3 shadow-2xl text-xs">
      <p className="text-slate-400 mb-2 font-semibold">Depth: <span className="text-white">{label}m</span></p>
      {payload.map(p => p.value != null && (
        <p key={p.name} className="flex items-center space-x-2 py-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-slate-400">{p.name}:</span>
          <span className="text-white font-bold">{typeof p.value === 'number' ? p.value.toFixed(3) : p.value}</span>
        </p>
      ))}
    </div>
  );
};

// Radar chart comparing well parameters
const RADAR_DATA = [
  { subject: 'Avg ROP', W72: 18.5, W45: 21.2, W48: 16.8, W61: 19.5, fullMark: 30 },
  { subject: 'Mud Wt', W72: 11.8, W45: 11.9, W48: 12.2, W61: 12.4, fullMark: 15 },
  { subject: 'NPT hrs', W72: 0, W45: 14, W48: 37, W61: 28, fullMark: 80 },
  { subject: 'Incidents', W72: 0, W45: 2, W48: 2, W61: 2, fullMark: 5 },
  { subject: 'TD Ratio', W72: 0.69, W45: 1.00, W48: 0.98, W61: 1.00, fullMark: 1.2 },
];

const WellColorMap = {
  'Makum-72': '#22d3ee',
  'Makum-45': '#f59e0b',
  'Makum-48': '#a78bfa',
  'Makum-61': '#34d399',
  'Makum-12': '#f87171',
  'Makum-33': '#fb923c',
};

const CHART_TABS = [
  { id: 'torque',    label: 'Torque',     icon: Activity },
  { id: 'rop',       label: 'ROP',        icon: TrendingUp },
  { id: 'mudweight', label: 'Mud Weight', icon: Droplets },
];

function FormationBands() {
  // Draw formation bands as reference areas
  const formations = FORMATION_LOG.slice(4); // from Bhuban onwards
  return formations.map(fm => (
    <ReferenceArea
      key={fm.name}
      x1={Math.max(1800, fm.top)}
      x2={Math.min(3500, fm.bottom)}
      fill={fm.color}
      fillOpacity={0.04}
      strokeOpacity={0}
    />
  ));
}

export default function OffsetAnalysis({ activeWell }) {
  const [activeChart, setActiveChart] = useState('torque');
  const [depthMarker, setDepthMarker] = useState(null);

  const chartData = {
    torque:    DEPTH_TORQUE_DATA,
    rop:       DEPTH_ROP_DATA,
    mudweight: DEPTH_MUDWEIGHT_DATA,
  };
  const data = chartData[activeChart];

  // Casing depths reference lines
  const casingDepths = [350, 1850];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-4 space-y-4">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-200">Offset Well Parameter Correlation</h2>
          <p className="text-xs text-slate-500">Depth-synced cross-well analysis · Formation banding active</p>
        </div>
        <div className="flex space-x-2">
          {CHART_TABS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveChart(t.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  activeChart === t.id
                    ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-600'
                }`}
              >
                <Icon size={13} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Formation legend */}
      <div className="flex flex-wrap gap-2">
        {FORMATION_LOG.slice(4).map(fm => (
          <div key={fm.name} className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: fm.color + '80' }} />
            <span className="text-[10px] text-slate-500">{fm.name}</span>
          </div>
        ))}
      </div>

      {/* Main comparison chart */}
      <div className="bg-[#0a0f1a] border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200">
              {activeChart === 'torque'    ? 'Torque (kNm) vs Depth' :
               activeChart === 'rop'       ? 'Rate of Penetration (m/hr) vs Depth' :
                                             'Mud Weight & Pressure Windows vs Depth'}
            </h3>
            <p className="text-xs text-slate-500">All offset wells correlated by formation depth</p>
          </div>
          <div className="text-xs text-slate-500 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
            Formation bands overlaid
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#0f172a" vertical={false} />
              {/* Formation bands */}
              <FormationBands />
              {/* Casing shoe references */}
              {casingDepths.map(d => (
                <ReferenceLine key={d} x={d} stroke="#7c3aed" strokeDasharray="2 4" strokeWidth={1} opacity={0.5}
                  label={{ position: 'insideTopLeft', value: `Casing ${d}m`, fill: '#7c3aed', fontSize: 9 }} />
              ))}
              {/* Current depth */}
              <ReferenceLine
                x={activeWell.depth}
                stroke="#22d3ee"
                strokeDasharray="4 3"
                strokeWidth={1.5}
                label={{ position: 'top', value: '▼ Now', fill: '#22d3ee', fontSize: 10 }}
              />
              {/* Risk zone */}
              {activeChart === 'torque' && (
                <ReferenceArea x1={2440} x2={2500} fill="#e11d48" fillOpacity={0.07} strokeOpacity={0} />
              )}

              <XAxis dataKey="depth" stroke="#1e293b" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false}
                label={{ value: 'Depth (m)', position: 'insideBottomRight', offset: -10, fill: '#475569', fontSize: 11 }} />
              <YAxis stroke="#1e293b" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />

              {activeChart === 'torque' && <>
                <Line dataKey="offset_W45" name="Makum-45" stroke={WellColorMap['Makum-45']} strokeWidth={1.5} dot={false} strokeDasharray="3 3" opacity={0.7} />
                <Line dataKey="offset_W48" name="Makum-48" stroke={WellColorMap['Makum-48']} strokeWidth={1.5} dot={false} strokeDasharray="3 3" opacity={0.7} />
                <Line dataKey="offset_W61" name="Makum-61" stroke={WellColorMap['Makum-61']} strokeWidth={1.5} dot={false} strokeDasharray="3 3" opacity={0.7} />
                <Line dataKey="predicted"  name="AI Predicted" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="5 4" />
                <Line dataKey="actual"     name="Makum-72 (Live)" stroke="#22d3ee" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }} />
              </>}

              {activeChart === 'rop' && <>
                <Line dataKey="w45"       name="Makum-45" stroke={WellColorMap['Makum-45']} strokeWidth={1.5} dot={false} strokeDasharray="3 3" opacity={0.7} />
                <Line dataKey="w61"       name="Makum-61" stroke={WellColorMap['Makum-61']} strokeWidth={1.5} dot={false} strokeDasharray="3 3" opacity={0.7} />
                <Line dataKey="predicted" name="AI Predicted" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="5 4" />
                <Line dataKey="actual"    name="Makum-72 (Live)" stroke="#22d3ee" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }} />
              </>}

              {activeChart === 'mudweight' && <>
                <Line dataKey="pore"     name="Pore Pressure (SG)" stroke="#34d399" strokeWidth={1.5} dot={false} strokeDasharray="2 3" />
                <Line dataKey="fracture" name="Fracture Gradient" stroke="#f87171" strokeWidth={1.5} dot={false} strokeDasharray="2 3" />
                <Line dataKey="w45"      name="Makum-45 MW" stroke={WellColorMap['Makum-45']} strokeWidth={1.5} dot={false} strokeDasharray="3 3" opacity={0.7} />
                <Line dataKey="w61"      name="Makum-61 MW" stroke={WellColorMap['Makum-61']} strokeWidth={1.5} dot={false} strokeDasharray="3 3" opacity={0.7} />
                <Line dataKey="active"   name="Makum-72 (Live)" stroke="#22d3ee" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }} />
              </>}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom: Radar + Casing program side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Radar — performance comparison */}
        <div className="bg-[#0a0f1a] border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-200 mb-1">Well Performance Radar</h3>
          <p className="text-xs text-slate-500 mb-4">Comparative multi-parameter analysis across offset wells</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                <PolarRadiusAxis tick={{ fill: '#334155', fontSize: 9 }} />
                <Radar name="Makum-72" dataKey="W72" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Makum-45" dataKey="W45" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.08} strokeWidth={1.5} />
                <Radar name="Makum-48" dataKey="W48" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.08} strokeWidth={1.5} />
                <Radar name="Makum-61" dataKey="W61" stroke="#34d399" fill="#34d399" fillOpacity={0.08} strokeWidth={1.5} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, color: '#f1f5f9', fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Casing program table */}
        <div className="bg-[#0a0f1a] border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-200 mb-1">Casing Program — Makum-72</h3>
          <p className="text-xs text-slate-500 mb-4">Planned vs executed casing & cementing schedule</p>
          <div className="space-y-3">
            {[
              { name: 'Conductor', od: '30"', depth: '40m', grade: 'K-55', cement: 'To surface', done: true },
              { name: 'Surface Casing', od: '20"', depth: '350m', grade: 'K-55', cement: 'To surface', done: true },
              { name: 'Intermediate', od: '13⅜"', depth: '1850m', grade: 'L-80', cement: '300m above shoe', done: true },
              { name: 'Production Liner', od: '9⅝"', depth: '3500m (planned)', grade: 'L-80', cement: '200m overlap', done: false },
            ].map((c, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${c.done ? 'bg-slate-900/50 border-slate-800' : 'bg-cyan-950/20 border-cyan-900/30'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-8 rounded-full ${c.done ? 'bg-emerald-500' : 'bg-cyan-500/50'}`} />
                  <div>
                    <p className="text-xs font-bold text-slate-200">{c.name} <span className="text-slate-500 font-normal">{c.od}</span></p>
                    <p className="text-[10px] text-slate-500">Grade: {c.grade} · Cement: {c.cement}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-slate-200">{c.depth}</p>
                  <span className={`text-[10px] font-semibold ${c.done ? 'text-emerald-400' : 'text-cyan-400'}`}>
                    {c.done ? '✓ Run' : '⋯ Planned'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Formation-by-formation risk summary */}
      <div className="bg-[#0a0f1a] border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-1">Formation-Specific Risk Summary</h3>
        <p className="text-xs text-slate-500 mb-4">Aggregated from all offset well historical data per formation</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800">
                {['Formation','Depth Range','Primary Risk','Offset Occurrences','Recommended Precaution'].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-[10px] text-slate-500 uppercase tracking-wide font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                { fm: 'Bhuban Ss.', range: '1480–1850m', risk: 'Gas shows', occ: '1/5 wells', rec: 'Increase MW to 1.18 SG entering Bhuban top', riskColor: 'text-amber-400' },
                { fm: 'Barail Ss.', range: '1850–2700m', risk: 'Mud Loss / Tight Hole', occ: '4/5 wells', rec: 'Pre-stage LCM pill. Reduce flow to <400 GPM at 2440m.', riskColor: 'text-rose-400' },
                { fm: 'Kopili Sh.', range: '2700–3100m', risk: 'Stuck Pipe / Torque', occ: '2/5 wells', rec: 'OBM pill on standby. Reduce WOB to 8–9t in shale.', riskColor: 'text-amber-400' },
                { fm: 'Sylhet Ls.', range: '3100–3500m', risk: 'Overpressure (Kick)', occ: '1/5 wells', rec: 'CBOP test before entering Sylhet. MW margin +0.03 SG.', riskColor: 'text-rose-400' },
              ].map((r, i) => (
                <tr key={i} className="hover:bg-slate-900/30 transition-colors">
                  <td className="px-3 py-2.5 font-medium text-slate-200">{r.fm}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-400">{r.range}</td>
                  <td className={`px-3 py-2.5 font-bold ${r.riskColor}`}>{r.risk}</td>
                  <td className="px-3 py-2.5 text-slate-400">{r.occ}</td>
                  <td className="px-3 py-2.5 text-slate-400 leading-relaxed">{r.rec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
