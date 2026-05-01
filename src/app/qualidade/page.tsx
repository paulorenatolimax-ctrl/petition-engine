'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, FileText, Plus } from 'lucide-react';

interface QualityStats {
  total_documents: number;
  passed: number;
  failed: number;
  pending: number;
  average_score: number;
  by_doc_type: Record<string, { total: number; passed: number; avg_score: number }>;
}

const DOC_TYPE_LABELS: Record<string, string> = {
  resume: 'Resume',
  cover_letter_eb1a: 'Cover Letter EB-1A',
  cover_letter_eb2_niw: 'Cover Letter EB-2 NIW',
  business_plan: 'Business Plan',
  methodology: 'Metodologia',
  declaration_of_intentions: 'Declaracao',
  anteprojeto: 'Anteprojeto',
  location_analysis: 'Localizacao',
  impacto_report: 'IMPACTO',
  satellite_letter: 'Carta Satelite',
  strategy_eb1: 'Estrategia EB-1A',
  strategy_eb2: 'Estrategia EB-2',
};

function getBarColor(pct: number): string {
  if (pct >= 90) return '#2ed573';
  if (pct >= 80) return '#ffa502';
  return '#ff4757';
}

export default function QualidadePage() {
  const [stats, setStats] = useState<QualityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(false);
  // CHUNK 8 (F2.3) — formulário inline pra aceitar violação manual e criar regra
  const [showAcceptForm, setShowAcceptForm] = useState(false);
  const [violationDesc, setViolationDesc] = useState('');
  const [violationDocType, setViolationDocType] = useState('');
  const [violationSeverity, setViolationSeverity] = useState<'critical' | 'high' | 'medium' | 'low'>('medium');
  const [acceptResult, setAcceptResult] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submitViolation() {
    if (violationDesc.length < 5) {
      setAcceptResult('descrição precisa de ≥5 caracteres');
      return;
    }
    setSubmitting(true);
    setAcceptResult(null);
    try {
      const r = await fetch('/api/quality/accept-violation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          errorDescription: violationDesc,
          docType: violationDocType || null,
          severity: violationSeverity,
        }),
      });
      const data = await r.json();
      if (data.error) {
        setAcceptResult(`erro: ${data.error}`);
      } else {
        setAcceptResult(`✓ ${data.action} — ${data.rule_id}: ${data.message}`);
        setViolationDesc('');
      }
    } catch (e) {
      setAcceptResult(`erro: ${(e as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    fetch('/api/quality/stats')
      .then(r => r.json())
      .then(d => {
        if (d.error) {
          setError(true);
          return;
        }
        setStats(d.data || d.stats || d);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const docTypes = Object.entries(stats?.by_doc_type || {});

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 w-full animate-in fade-in duration-500 max-w-[1400px]">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="section-title v2-section-header text-[#e2e8f0] text-lg w-max">Qualidade Engine</h1>
        <p className="text-[#a1b1cc] font-mono text-xs mt-2">Relatórios de Validação Automática & AI Check</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center v2-card py-10 px-8 relative overflow-hidden group mb-4">
         <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-[#00eaff] opacity-[0.015] blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:opacity-[0.03] transition-opacity" />
         
         <div className="relative z-10 flex border-[8px] border-[rgba(0,234,255,0.05)] rounded-full w-64 h-64 shrink-0 flex-col items-center justify-center bg-[#05090f] shadow-[inset_0_0_50px_rgba(0,0,0,0.8),_0_0_30px_rgba(0,234,255,0.1)] hover:border-[rgba(0,234,255,0.2)] transition-colors">
            <span className="text-[12px] uppercase text-[#00eaff] font-mono tracking-widest font-bold drop-shadow-[0_0_5px_rgba(0,234,255,0.5)] mb-1">SCORE MÉDIO</span>
            <div className="flex items-end">
               <span className="text-[80px] font-black font-mono leading-none tracking-tighter text-[#e2e8f0] drop-shadow-[0_0_15px_rgba(0,234,255,0.3)]">
                  {loading ? '--' : (stats?.average_score || 0)}
               </span>
               <span className="text-xl font-bold font-mono text-[#a1b1cc] mb-3 ml-1">%</span>
            </div>
            {/* Pulsing ring inside */}
            <div className="absolute inset-2 border border-[#00eaff]/30 rounded-full animate-[ping_4s_ease-out_infinite]" />
         </div>

         <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4 z-10 pl-8 md:border-l border-[rgba(0,234,255,0.06)]">
            {[
              { label: 'Documentos', value: stats?.total_documents || 0, icon: FileText, color: '#a1b1cc' },
              { label: 'Aprovados', value: stats?.passed || 0, icon: CheckCircle2, color: '#2ed573', glow: 'rgba(46,213,115,0.4)' },
              { label: 'Falhas/Rejeitados', value: stats?.failed || 0, icon: XCircle, color: '#ff4757', glow: 'rgba(255,71,87,0.4)' },
            ].map((stat, i) => (
              <div key={i} className="bg-[#101e30] border border-[#ffffff0a] rounded-lg p-5 flex flex-col gap-4 hover:bg-[#132438] transition-colors" style={{ borderBottom: `2px solid ${stat.color}` }}>
                  <div className="flex items-center gap-2 text-[#4b6584]">
                      <stat.icon className="w-4 h-4" style={{ color: stat.color, filter: stat.glow ? `drop-shadow(0 0 8px ${stat.glow})` : 'none' }} />
                      <span className="text-[11px] uppercase tracking-[2px] font-bold font-mono">{stat.label}</span>
                  </div>
                  <div className="text-3xl font-black font-mono tracking-tight" style={{ color: stat.color, textShadow: stat.glow ? `0 0 15px ${stat.glow}` : 'none' }}>
                      {loading ? '--' : stat.value}
                  </div>
              </div>
            ))}
         </div>
      </div>

      {/* CHUNK 8 (F2.3) — Aceitar violação manual → criar regra */}
      <div className="v2-card p-6 relative overflow-hidden group">
         <div className="flex items-center justify-between mb-4">
           <h2 className="section-title v2-section-header text-[#e2e8f0] w-max">Aprendizado Manual</h2>
           <button onClick={() => setShowAcceptForm(s => !s)} className="flex items-center gap-2 px-4 py-2 bg-[#101e30] border border-[#00eaff]/30 hover:border-[#00eaff] rounded-lg text-[#00eaff] text-xs font-mono uppercase tracking-wider transition">
             <Plus className="w-4 h-4" />
             {showAcceptForm ? 'Fechar' : 'Aceitar Violação → Criar Regra'}
           </button>
         </div>
         {showAcceptForm && (
           <div className="flex flex-col gap-3 bg-[#0a121f] border border-[#ffffff0a] rounded p-4">
             <textarea
               value={violationDesc}
               onChange={e => setViolationDesc(e.target.value)}
               placeholder="Descrição da violação (ex: 'Termo proibido X encontrado em parágrafo Y')"
               className="bg-[#05090f] border border-[#ffffff10] rounded p-3 text-[#e2e8f0] text-sm font-mono"
               rows={3}
             />
             <div className="flex gap-3">
               <input
                 type="text"
                 value={violationDocType}
                 onChange={e => setViolationDocType(e.target.value)}
                 placeholder="doc_type (opcional, ex: testimony_letter_eb2_niw)"
                 className="flex-1 bg-[#05090f] border border-[#ffffff10] rounded p-2 text-[#e2e8f0] text-xs font-mono"
               />
               <select
                 value={violationSeverity}
                 onChange={e => setViolationSeverity(e.target.value as 'critical'|'high'|'medium'|'low')}
                 className="bg-[#05090f] border border-[#ffffff10] rounded p-2 text-[#e2e8f0] text-xs font-mono"
               >
                 <option value="critical">critical</option>
                 <option value="high">high</option>
                 <option value="medium">medium</option>
                 <option value="low">low</option>
               </select>
               <button onClick={submitViolation} disabled={submitting} className="px-4 py-2 bg-[#00eaff]/10 border border-[#00eaff] rounded text-[#00eaff] text-xs font-mono uppercase hover:bg-[#00eaff]/20 transition disabled:opacity-50">
                 {submitting ? '...' : 'Criar Regra'}
               </button>
             </div>
             {acceptResult && (
               <div className="text-xs font-mono text-[#a1b1cc] bg-[#101e30] p-2 rounded">{acceptResult}</div>
             )}
           </div>
         )}
      </div>

      <div className="v2-card p-6 relative overflow-hidden group">
         <h2 className="section-title v2-section-header text-[#e2e8f0] mb-6 w-max">Qualidade de Inferência por Target</h2>

         {loading ? (
             <div className="flex justify-center text-[#4b6584] py-8 font-mono text-sm tracking-widest uppercase">LOADING QUALITY LOGS...</div>
         ) : docTypes.length === 0 ? (
             <div className="flex justify-center text-[#4b6584] py-8 font-mono text-sm tracking-widest uppercase">NO DATA AVAILABLE</div>
         ) : (
            <div className="flex flex-col gap-5 pr-2">
               {docTypes.map(([type, data]) => {
                  const pct = data.total > 0 ? Math.round((data.passed / data.total) * 100) : 0;
                  const color = getBarColor(pct);
                  return (
                      <div key={type} className="flex flex-col gap-2 relative group/bar">
                         <div className="flex justify-between items-center text-xs font-mono">
                            <span className="font-bold tracking-wider text-[#e2e8f0] uppercase" style={{ color, textShadow: `0 0 8px ${color}80` }}>{DOC_TYPE_LABELS[type] || type}</span>
                            <span className="font-bold text-sm drop-shadow-md" style={{ color, textShadow: `0 0 10px ${color}80` }}>{pct}% PASS</span>
                         </div>
                         <div className="h-2 w-full bg-[#101e30] rounded-full overflow-hidden border border-[#ffffff05]">
                            <div className="h-full rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 15px ${color}` }}>
                               {/* Inner gradient sweep */}
                               <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/40" />
                            </div>
                         </div>
                         <div className="text-[10px] text-[#4b6584] font-mono tracking-widest flex justify-between absolute -bottom-5 left-0 right-0 opacity-0 group-hover/bar:opacity-100 transition-opacity">
                             <span>TOTAL: {data.total} DOCS</span>
                             <span>FAILURES: {data.total - data.passed}</span>
                         </div>
                      </div>
                  );
               })}
            </div>
         )}
      </div>
    </div>
  );
}
