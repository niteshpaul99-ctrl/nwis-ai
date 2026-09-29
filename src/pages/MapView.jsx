import React, { useState } from 'react';
import { MapPin, Target, Search, Filter, ZoomIn, ZoomOut, Navigation, Layers } from 'lucide-react';
import { ACTIVE_WELL, OFFSET_WELLS, FORMATION_LOG } from '../data/mockData';

// SVG Geospatial Map
function SVGMap({ selectedWell, onSelect, radius }) {
  const cx = 50; // active well center %
  const cy = 48;

  // Convert km radius to SVG units (approx)
  const radiusSVG = (radius / 5) * 35;

  return (
    <div className="relative w-full h-full bg-[#050a12] rounded-xl overflow-hidden border border-slate-800">
      {/* Grid */}
      <div className="absolute inset-0 bg-grid opacity-60" />

      {/* Map SVG */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {/* Topo lines */}
        <g opacity="0.12" stroke="#475569" strokeWidth="0.4" fill="none">
          <path d="M0,40 Q20,25 40,42 T80,38 T100,35" />
          <path d="M0,60 Q25,75 50,58 T90,65 T100,62" />
          <path d="M0,20 Q35,8 55,22 T95,18" />
          <path d="M10,80 Q40,92 65,78 T100,82" />
          <ellipse cx="35" cy="50" rx="28" ry="18" />
          <ellipse cx="70" cy="45" rx="20" ry="12" />
        </g>

        {/* Contour labels */}
        <text x="8" y="22" fontSize="2" fill="#475569">+120m</text>
        <text x="8" y="42" fontSize="2" fill="#475569">+80m</text>
        <text x="8" y="62" fontSize="2" fill="#475569">+40m</text>

        {/* Search radius circle */}
        <circle
          cx={cx} cy={cy} r={radiusSVG}
          fill="rgba(6,182,212,0.03)"
          stroke="#22d3ee"
          strokeWidth="0.3"
          strokeDasharray="2 2"
        />
        <text x={cx + radiusSVG - 1} y={cy - 1} fontSize="2" fill="#22d3ee" opacity="0.7">{radius}km</text>

        {/* Connection lines from active to offset wells */}
        {OFFSET_WELLS.map(w => (
          <line
            key={w.id + '-line'}
            x1={cx} y1={cy}
            x2={w.x} y2={w.y}
            stroke={selectedWell?.id === w.id ? '#f59e0b' : '#1e293b'}
            strokeWidth={selectedWell?.id === w.id ? '0.5' : '0.3'}
            strokeDasharray="1.5 2"
            opacity={selectedWell?.id === w.id ? 0.8 : 0.4}
          />
        ))}

        {/* Distance labels on lines */}
        {OFFSET_WELLS.map(w => {
          const midX = (cx + w.x) / 2;
          const midY = (cy + w.y) / 2;
          return (
            <text key={w.id + '-dist'} x={midX} y={midY} fontSize="1.8" fill="#475569" textAnchor="middle">
              {w.distance}
            </text>
          );
        })}

        {/* Offset wells */}
        {OFFSET_WELLS.map(w => {
          const isSelected = selectedWell?.id === w.id;
          const hasHighRisk = w.incidents.some(i => i.severity === 'critical');
          const incColor = hasHighRisk ? '#e11d48' : '#f59e0b';

          return (
            <g key={w.id} style={{ cursor: 'pointer' }} onClick={() => onSelect(isSelected ? null : w)}>
              {/* Outer glow for selected */}
              {isSelected && (
                <circle cx={w.x} cy={w.y} r="3.5" fill={incColor} opacity="0.2" />
              )}
              <circle
                cx={w.x} cy={w.y} r="2"
                fill={isSelected ? incColor : '#1e293b'}
                stroke={isSelected ? incColor : '#475569'}
                strokeWidth="0.5"
              />
              {/* Well marker */}
              <line x1={w.x} y1={w.y - 2.5} x2={w.x} y2={w.y - 5} stroke={isSelected ? incColor : '#475569'} strokeWidth="0.5" />
              <text x={w.x + 2.5} y={w.y - 2} fontSize="2.2" fill={isSelected ? incColor : '#64748b'} fontWeight={isSelected ? 'bold' : 'normal'}>
                {w.name}
              </text>
              <text x={w.x + 2.5} y={w.y + 0.5} fontSize="1.6" fill="#374151">
                {w.status === 'Abandoned' ? '✕ Abandoned' : `TD: ${w.finalDepth}m`}
              </text>
              {/* Incident dots */}
              {w.incidents.map((inc, i) => (
                <circle
                  key={i}
                  cx={w.x + i * 2.5 - 1}
                  cy={w.y + 3}
                  r="0.8"
                  fill={inc.severity === 'critical' ? '#e11d48' : inc.severity === 'high' ? '#f59e0b' : '#64748b'}
                  opacity="0.8"
                />
              ))}
            </g>
          );
        })}

        {/* Active well — pulsing */}
        <g style={{ cursor: 'default' }}>
          <circle cx={cx} cy={cy} r="5" fill="rgba(6,182,212,0.06)" stroke="#22d3ee" strokeWidth="0.3" opacity="0.6">
            <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx} cy={cy} r="2" fill="#22d3ee" opacity="0.9" />
          <circle cx={cx} cy={cy} r="1" fill="white" />
          <text x={cx + 3} y={cy - 3} fontSize="2.4" fill="#22d3ee" fontWeight="bold">{ACTIVE_WELL.name}</text>
          <text x={cx + 3} y={cy - 0.5} fontSize="1.8" fill="#94a3b8">ACTIVE · {ACTIVE_WELL.depth?.toFixed(0)}m</text>
        </g>

        {/* Compass rose */}
        <g transform="translate(93,8)">
          <text x="0" y="-3.5" fontSize="2" fill="#334155" textAnchor="middle">N</text>
          <line x1="0" y1="-2.5" x2="0" y2="2.5" stroke="#334155" strokeWidth="0.4" />
          <line x1="-2.5" y1="0" x2="2.5" y2="0" stroke="#334155" strokeWidth="0.4" />
          <circle cx="0" cy="0" r="0.8" fill="#22d3ee" />
        </g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur rounded-xl border border-slate-700/60 p-3 space-y-1.5">
        <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mb-2">Legend</p>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          <span className="text-[11px] text-slate-300">Active Well</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-[11px] text-slate-300">Offset (Risk)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <span className="text-[11px] text-slate-300">Critical Incident</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-slate-600" />
          <span className="text-[11px] text-slate-300">Low Risk</span>
        </div>
      </div>
    </div>
  );
}

// Well detail panel
function WellDetailPanel({ well, onClose }) {
  if (!well) return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-600">
      <MapPin size={40} className="mb-3 opacity-30" />
      <p className="text-sm font-medium">Click a well on the map to view details</p>
      <p className="text-xs mt-1 text-slate-700">Offset analysis, incidents & parameters</p>
    </div>
  );

  return (
    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-black text-slate-100">{well.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
              well.status === 'Completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
              well.status === 'Abandoned' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' :
                                           'text-amber-400 bg-amber-500/10 border-amber-500/20'
            }`}>{well.status}</span>
            <span className="text-xs text-slate-500">{well.distance} · {well.bearing}</span>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-200 transition-colors text-lg leading-none">&times;</button>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { l: 'Final Depth', v: `${well.finalDepth}m` },
          { l: 'Completed', v: well.completedYear },
          { l: 'Avg ROP', v: `${well.rop_avg} m/hr` },
          { l: 'Mud Weight', v: `${well.mudWeight} SG` },
        ].map(s => (
          <div key={s.l} className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800">
            <p className="text-[10px] text-slate-500 mb-1">{s.l}</p>
            <p className="text-sm font-bold text-slate-200 font-mono">{s.v}</p>
          </div>
        ))}
      </div>

      {/* Formation */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 mb-4">
        <p className="text-[10px] text-slate-500 mb-1">Primary Formation</p>
        <p className="text-sm font-bold text-slate-200">{well.formation}</p>
      </div>

      {/* Incidents */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Recorded Incidents</p>
        <div className="space-y-2">
          {well.incidents.map((inc, i) => (
            <div key={i} className={`rounded-lg p-3 border ${
              inc.severity === 'critical' ? 'bg-rose-950/25 border-rose-900/40' :
              inc.severity === 'high'     ? 'bg-amber-950/20 border-amber-900/30' :
                                           'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${
                  inc.severity === 'critical' ? 'text-rose-400' :
                  inc.severity === 'high'     ? 'text-amber-400' :
                                               'text-slate-400'
                }`}>{inc.type}</span>
                <span className="text-[10px] font-mono text-slate-400">@ {inc.depth}m</span>
              </div>
              <span className={`text-[10px] capitalize font-semibold ${
                inc.severity === 'critical' ? 'text-rose-500' :
                inc.severity === 'high'     ? 'text-amber-500' :
                                             'text-slate-500'
              }`}>{inc.severity} severity</span>
            </div>
          ))}
        </div>
      </div>

      {/* Correlation note */}
      <div className="mt-4 bg-cyan-950/20 border border-cyan-900/30 rounded-lg p-3">
        <p className="text-[10px] text-cyan-400 font-bold mb-1">⚡ AI Correlation Note</p>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {well.name}'s incident pattern at {well.incidents[0]?.depth}m is being used to generate
          predictive alerts for Makum-72 at equivalent formation depth. Confidence: {well.status === 'Abandoned' ? '94' : '87'}%.
        </p>
      </div>
    </div>
  );
}

export default function MapView({ activeWell }) {
  const [selectedWell, setSelectedWell] = useState(null);
  const [radius, setRadius] = useState(3);

  return (
    <div className="h-full overflow-hidden p-4 flex flex-col space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-base font-bold text-slate-200">Geospatial Well Map</h2>
          <p className="text-xs text-slate-500">Interactive offset well visualization · {OFFSET_WELLS.length} wells within {radius}km radius</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Radius control */}
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
            <span className="text-xs text-slate-400">Search Radius:</span>
            <input
              type="range" min="1" max="10" step="0.5"
              value={radius}
              onChange={e => setRadius(+e.target.value)}
              className="w-24 accent-cyan-500"
            />
            <span className="text-xs font-bold text-cyan-400 w-10">{radius}km</span>
          </div>
          <button className="flex items-center space-x-2 px-3 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-medium hover:bg-cyan-500/20 transition-colors">
            <Search size={13} />
            <span>Scan Area</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-slate-900 text-slate-400 border border-slate-700 rounded-xl text-xs font-medium hover:bg-slate-800 transition-colors">
            <Layers size={13} />
            <span>Layers</span>
          </button>
        </div>
      </div>

      {/* Map + detail panel */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map (3/4) */}
        <div className="lg:col-span-3">
          <SVGMap selectedWell={selectedWell} onSelect={setSelectedWell} radius={radius} />
        </div>

        {/* Detail panel (1/4) */}
        <div className="bg-[#0a0f1a] border border-slate-800 rounded-2xl p-4 overflow-hidden">
          <WellDetailPanel well={selectedWell} onClose={() => setSelectedWell(null)} />
        </div>
      </div>

      {/* Bottom stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-shrink-0">
        {[
          { label: 'Wells in Radius', value: OFFSET_WELLS.length, color: 'text-cyan-400' },
          { label: 'Critical Incidents', value: OFFSET_WELLS.reduce((s, w) => s + w.incidents.filter(i => i.severity === 'critical').length, 0), color: 'text-rose-400' },
          { label: 'Nearest Well', value: '0.8km', color: 'text-emerald-400' },
          { label: 'Common Formation', value: 'Barail Ss.', color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#0a0f1a] border border-slate-800 rounded-xl p-3 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">{s.label}</p>
            <p className={`text-lg font-black mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
