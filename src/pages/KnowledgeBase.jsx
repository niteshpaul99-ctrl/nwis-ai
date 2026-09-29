import React, { useState, useMemo } from 'react';
import {
  Search, Filter, FileText, CheckCircle2, Clock, AlertTriangle,
  ChevronRight, Tag, Database, Cpu, Upload, Eye, X, Download,
  BookOpen, Brain
} from 'lucide-react';
import { HISTORICAL_INCIDENTS, NLP_DOCUMENTS } from '../data/mockData';

// ── NLP Entity chip ──────────────────────────────────────────
const EntityChip = ({ type, value, confidence }) => {
  const colors = {
    WELL_NAME:  'bg-cyan-950/40 text-cyan-400 border-cyan-800/40',
    DEPTH:      'bg-amber-950/40 text-amber-400 border-amber-800/40',
    FORMATION:  'bg-emerald-950/40 text-emerald-400 border-emerald-800/40',
    EVENT:      'bg-rose-950/40 text-rose-400 border-rose-800/40',
    MITIGATION: 'bg-violet-950/40 text-violet-400 border-violet-800/40',
    NPT:        'bg-orange-950/40 text-orange-400 border-orange-800/40',
    MUD_WEIGHT: 'bg-blue-950/40 text-blue-400 border-blue-800/40',
    DECISION:   'bg-slate-800 text-slate-300 border-slate-700',
    PRESSURE:   'bg-pink-950/40 text-pink-400 border-pink-800/40',
  };
  return (
    <div className={`rounded-lg border px-2.5 py-1.5 ${colors[type] || colors.DECISION}`}>
      <p className="text-[9px] font-bold uppercase tracking-wide opacity-70 mb-0.5">{type.replace(/_/g, ' ')}</p>
      <p className="text-xs font-semibold">{value}</p>
      <div className="flex items-center space-x-1 mt-1">
        <div className="h-0.5 flex-1 bg-current opacity-20 rounded-full">
          <div className="h-full bg-current opacity-60 rounded-full" style={{ width: `${confidence}%` }} />
        </div>
        <span className="text-[9px] opacity-60">{confidence}%</span>
      </div>
    </div>
  );
};

// ── Document viewer modal ────────────────────────────────────
function DocModal({ doc, onClose }) {
  if (!doc) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0a0f1a] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Modal header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <FileText size={15} className="text-cyan-400" />
              <span>{doc.filename}</span>
            </h3>
            <div className="flex items-center space-x-3 mt-1">
              <span className="text-[10px] text-slate-500">{doc.type}</span>
              <span className="text-[10px] text-slate-600">·</span>
              <span className="text-[10px] text-slate-500">{doc.pages} pages</span>
              <span className="text-[10px] text-slate-600">·</span>
              <span className="text-[10px] text-slate-500">Processed {doc.extractedAt}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Extracted entities */}
        <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-center space-x-2 mb-4">
            <Brain size={14} className="text-violet-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">NLP-Extracted Entities</h4>
            <span className="text-[10px] text-slate-500">{doc.entities.length} entities</span>
          </div>

          {doc.entities.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              <Cpu size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Processing in progress…</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {doc.entities.map((e, i) => <EntityChip key={i} {...e} />)}
            </div>
          )}

          {/* Simulated raw text excerpt */}
          {doc.entities.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Source Text Excerpt</h4>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[10px] text-slate-400 leading-relaxed">
                <span className="text-slate-600">...encountered severe mud losses in the </span>
                <span className="bg-emerald-900/30 text-emerald-400 px-0.5 rounded">Barail Sandstone</span>
                <span className="text-slate-600"> interval at </span>
                <span className="bg-amber-900/30 text-amber-400 px-0.5 rounded">2450m TVD</span>
                <span className="text-slate-600">. Loss rate estimated at 50 bbl/hr. No returns observed for </span>
                <span className="bg-orange-900/30 text-orange-400 px-0.5 rounded">14.5 hours</span>
                <span className="text-slate-600">. Pumped </span>
                <span className="bg-violet-900/30 text-violet-400 px-0.5 rounded">50 bbl LCM pill</span>
                <span className="text-slate-600"> (coarse nut plug + cellophane flakes) at </span>
                <span className="bg-blue-900/30 text-blue-400 px-0.5 rounded">MW 1.19 SG</span>
                <span className="text-slate-600">. Returns regained after 6 hours...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Incident detail modal ────────────────────────────────────
function IncidentModal({ inc, onClose }) {
  if (!inc) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0a0f1a] border border-slate-700 rounded-2xl w-full max-w-lg">
        <div className="flex items-start justify-between p-5 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-200">{inc.event} — {inc.well}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{inc.id} · {inc.date} · {inc.depth}m · {inc.formation}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: 'NPT', v: `${inc.nptHours} hrs`, c: 'text-rose-400' },
              { l: 'Severity', v: inc.severity, c: inc.severity === 'Critical' ? 'text-rose-400' : 'text-amber-400' },
              { l: 'ROP at event', v: `${inc.parameters.rop} m/hr`, c: 'text-slate-200' },
              { l: 'Mud Weight', v: `${inc.parameters.mudWeight} SG`, c: 'text-slate-200' },
              { l: 'WOB', v: `${inc.parameters.wob} t`, c: 'text-slate-200' },
              { l: 'Flow Rate', v: `${inc.parameters.flowRate} GPM`, c: 'text-slate-200' },
            ].map(s => (
              <div key={s.l} className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5">
                <p className="text-[10px] text-slate-500 mb-1">{s.l}</p>
                <p className={`text-sm font-bold font-mono ${s.c}`}>{s.v}</p>
              </div>
            ))}
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <p className="text-[10px] text-emerald-400 font-bold mb-2 uppercase tracking-wide">Mitigation Applied</p>
            <p className="text-xs text-slate-300 leading-relaxed">{inc.mitigation}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {inc.tags.map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full border border-slate-700 text-slate-400 bg-slate-800/50">#{t}</span>
            ))}
          </div>
          <p className="text-[10px] text-slate-600 flex items-center space-x-1">
            <FileText size={10} />
            <span>Source: {inc.extractedFrom}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Knowledge Base page ─────────────────────────────────
export default function KnowledgeBase() {
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedInc, setSelectedInc] = useState(null);
  const [activeSection, setActiveSection] = useState('incidents');
  const [uploadState, setUploadState] = useState('idle');

  const allTags = useMemo(() => {
    const tags = new Set();
    HISTORICAL_INCIDENTS.forEach(inc => inc.tags.forEach(t => tags.add(t)));
    return [...tags];
  }, []);

  const filteredIncidents = useMemo(() => {
    return HISTORICAL_INCIDENTS.filter(inc => {
      const matchSearch = !search || [inc.event, inc.well, inc.formation, inc.mitigation]
        .some(f => f.toLowerCase().includes(search.toLowerCase()));
      const matchTag = !tagFilter || inc.tags.includes(tagFilter);
      return matchSearch && matchTag;
    });
  }, [search, tagFilter]);

  const simulateUpload = () => {
    setUploadState('uploading');
    setTimeout(() => setUploadState('processing'), 1200);
    setTimeout(() => setUploadState('done'), 3000);
    setTimeout(() => setUploadState('idle'), 5000);
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-4 space-y-4">

      {/* Modals */}
      {selectedDoc && <DocModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />}
      {selectedInc && <IncidentModal inc={selectedInc} onClose={() => setSelectedInc(null)} />}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-200 flex items-center space-x-2">
            <Database size={16} className="text-violet-400" />
            <span>NWIS Knowledge Repository</span>
          </h2>
          <p className="text-xs text-slate-500">NLP-extracted drilling intelligence · WCRs · DDRs · Mud programs</p>
        </div>
        {/* Upload button */}
        <button
          onClick={simulateUpload}
          className="flex items-center space-x-2 px-4 py-2 bg-violet-500/10 text-violet-400 border border-violet-500/30 rounded-xl text-xs font-semibold hover:bg-violet-500/20 transition-colors"
        >
          <Upload size={14} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Upload status */}
      {uploadState !== 'idle' && (
        <div className={`rounded-xl border p-4 flex items-center space-x-4 transition-all ${
          uploadState === 'done' ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-violet-950/20 border-violet-900/40'
        }`}>
          {uploadState === 'uploading' && <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />}
          {uploadState === 'processing' && <Brain size={18} className="text-violet-400 animate-pulse" />}
          {uploadState === 'done' && <CheckCircle2 size={18} className="text-emerald-400" />}
          <div>
            <p className={`text-xs font-bold ${uploadState === 'done' ? 'text-emerald-400' : 'text-violet-400'}`}>
              {uploadState === 'uploading' ? 'Uploading document…' :
               uploadState === 'processing' ? 'NLP processing — extracting entities with AI…' :
               'Document processed! 8 entities extracted and indexed.'}
            </p>
            {uploadState === 'processing' && (
              <p className="text-[10px] text-slate-500 mt-0.5">OCR → tokenization → NER → structured output</p>
            )}
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Documents', value: NLP_DOCUMENTS.length, icon: FileText, color: 'text-violet-400' },
          { label: 'Incidents', value: HISTORICAL_INCIDENTS.length, icon: AlertTriangle, color: 'text-amber-400' },
          { label: 'Entities Extracted', value: NLP_DOCUMENTS.reduce((s, d) => s + d.entities.length, 0), icon: Brain, color: 'text-cyan-400' },
          { label: 'Total NPT hrs', value: HISTORICAL_INCIDENTS.reduce((s, i) => s + i.nptHours, 0).toFixed(1), icon: Clock, color: 'text-rose-400' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-[#0a0f1a] border border-slate-800 rounded-xl p-3 flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-slate-900 ${s.color}`}>
                <Icon size={16} />
              </div>
              <div>
                <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-slate-500">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section toggle */}
      <div className="flex space-x-1 bg-slate-900 border border-slate-800 rounded-xl p-1 w-fit">
        {[['incidents', 'Incident Database', AlertTriangle], ['docs', 'Document Library', FileText]].map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeSection === id ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Icon size={13} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ── INCIDENTS section ── */}
      {activeSection === 'incidents' && (
        <div className="space-y-4">
          {/* Search + filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search events, mitigations, formations…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors placeholder-slate-600"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setTagFilter('')}
                className={`px-3 py-2 rounded-xl text-[10px] font-semibold border transition-colors ${!tagFilter ? 'bg-slate-700 text-white border-slate-600' : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700'}`}
              >
                All tags
              </button>
              {allTags.slice(0, 8).map(t => (
                <button
                  key={t}
                  onClick={() => setTagFilter(tagFilter === t ? '' : t)}
                  className={`px-2.5 py-2 rounded-xl text-[10px] font-semibold border transition-colors flex items-center space-x-1 ${tagFilter === t ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700'}`}
                >
                  <Tag size={9} />
                  <span>#{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <p className="text-xs text-slate-500">{filteredIncidents.length} incidents found</p>

          <div className="space-y-3">
            {filteredIncidents.map(inc => (
              <div
                key={inc.id}
                className="bg-[#0a0f1a] border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors cursor-pointer group"
                onClick={() => setSelectedInc(inc)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                        inc.severity === 'Critical' ? 'bg-rose-950/30 text-rose-400 border-rose-800/40' :
                        inc.severity === 'High'     ? 'bg-amber-950/30 text-amber-400 border-amber-800/40' :
                                                     'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>{inc.severity}</span>
                      <span className="text-xs font-bold text-slate-200">{inc.event}</span>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs text-cyan-400/80 font-medium">{inc.well}</span>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs font-mono text-slate-400">{inc.depth}m</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                      <div className="bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-800">
                        <p className="text-[9px] text-slate-600 mb-0.5">Formation</p>
                        <p className="text-xs text-slate-300 font-medium">{inc.formation}</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-800">
                        <p className="text-[9px] text-slate-600 mb-0.5">NPT</p>
                        <p className="text-xs text-rose-400 font-bold font-mono">{inc.nptHours} hrs</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-800">
                        <p className="text-[9px] text-slate-600 mb-0.5">Date</p>
                        <p className="text-xs text-slate-300 font-medium">{inc.date}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      <span className="text-emerald-400 font-semibold">Mitigation: </span>
                      {inc.mitigation}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {inc.tags.map(t => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full border border-slate-700 text-slate-500 bg-slate-900">#{t}</span>
                      ))}
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full border border-violet-800/30 text-violet-500 bg-violet-950/20">
                        📄 {inc.extractedFrom}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors ml-3 flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DOCUMENTS section ── */}
      {activeSection === 'docs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {NLP_DOCUMENTS.map(doc => (
              <div
                key={doc.id}
                className="bg-[#0a0f1a] border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors cursor-pointer group"
                onClick={() => setSelectedDoc(doc)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 border ${doc.status === 'Processed' ? 'bg-emerald-950/20 border-emerald-900/30' : 'bg-amber-950/20 border-amber-900/30'}`}>
                    <FileText size={18} className={doc.status === 'Processed' ? 'text-emerald-400' : 'text-amber-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-200 truncate">{doc.filename}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{doc.type} · {doc.pages} pages · {doc.well}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                        doc.status === 'Processed' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-800/30' :
                                                    'bg-amber-950/30 text-amber-400 border-amber-800/30'
                      }`}>
                        {doc.status === 'Processed' ? '✓ ' : '⋯ '}{doc.status}
                      </span>
                      {doc.entities.length > 0 && (
                        <span className="text-[10px] text-violet-400">{doc.entities.length} entities extracted</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors">
                      <Eye size={13} />
                    </button>
                    <button className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors">
                      <Download size={13} />
                    </button>
                  </div>
                </div>

                {/* Entity type preview */}
                {doc.entities.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {[...new Set(doc.entities.map(e => e.type))].map(t => (
                      <span key={t} className="text-[9px] px-1.5 py-0.5 rounded border border-slate-700 text-slate-500 bg-slate-900">
                        {t.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Upload placeholder card */}
            <div
              className="bg-[#0a0f1a] border border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-3 hover:border-violet-500/40 hover:bg-violet-950/10 transition-colors cursor-pointer"
              onClick={simulateUpload}
            >
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Upload size={20} className="text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-300">Upload Drilling Report</p>
                <p className="text-xs text-slate-500 mt-1">PDF / DOCX · WCR, DDR, Mud Programs</p>
              </div>
              <span className="text-[10px] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full">
                AI will auto-extract entities
              </span>
            </div>
          </div>

          {/* AI processing pipeline visual */}
          <div className="bg-[#0a0f1a] border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-200 mb-4">AI Processing Pipeline</h3>
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {[
                { icon: Upload, label: 'Upload', desc: 'PDF/DOCX ingestion', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
                { icon: Eye, label: 'OCR', desc: 'Text extraction', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                { icon: Brain, label: 'NLP', desc: 'Named Entity Recognition', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
                { icon: Tag, label: 'Tagging', desc: 'Auto-classification', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                { icon: Database, label: 'Index', desc: 'Knowledge store', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                { icon: Cpu, label: 'ML Engine', desc: 'Risk correlation', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
              ].map((step, i, arr) => {
                const Icon = step.icon;
                return (
                  <React.Fragment key={step.label}>
                    <div className="flex-shrink-0 flex flex-col items-center space-y-2 w-20">
                      <div className={`p-3 rounded-xl border ${step.color}`}>
                        <Icon size={18} />
                      </div>
                      <p className={`text-[11px] font-bold ${step.color.split(' ')[0]}`}>{step.label}</p>
                      <p className="text-[9px] text-slate-600 text-center leading-tight">{step.desc}</p>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="flex-shrink-0 text-slate-700 text-lg">→</div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
