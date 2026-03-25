'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RefreshCw, FileText, CheckCircle, XCircle, Clock, FolderOpen, ArrowLeft, Zap, X, Loader2 } from 'lucide-react';

interface Generation {
  id: string;
  prompt_file: string;
  doc_type: string;
  client_name: string;
  client_id: string | null;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  started_at: string;
  completed_at: string | null;
  output_path: string;
  output_files: string[];
  error_message: string | null;
  duration_seconds: number | null;
  duration_display: string | null;
  age_seconds: number;
}

const DOC_LABELS: Record<string, string> = {
  cover_letter_eb1a: 'Cover Letter EB-1A',
  cover_letter_eb2_niw: 'Cover Letter EB-2 NIW',
  resume_eb2_niw: 'Résumé EB-2 NIW',
  resume_eb1a: 'Résumé EB-1A',
  business_plan: 'Business Plan',
  methodology: 'Metodologia',
  declaration_of_intentions: 'Declaração',
  impacto_report: 'IMPACTO®',
  strategy_eb1: 'Estratégia EB-1',
  strategy_eb2: 'Estratégia EB-2',
  eb1_letters: 'Cartas EB-1',
};

function formatAge(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

const STATUS_CONFIG: Record<string, { icon: any; label: string; color: string; bg: string; border: string }> = {
  completed: { icon: CheckCircle, label: 'CONCLUÍDO', color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)' },
  failed: { icon: XCircle, label: 'ERRO', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
  processing: { icon: Loader2, label: 'GERANDO', color: '#2dd4bf', bg: 'rgba(45,212,191,0.08)', border: 'rgba(45,212,191,0.25)' },
  queued: { icon: Clock, label: 'NA FILA', color: '#ffa502', bg: 'rgba(255,165,2,0.08)', border: 'rgba(255,165,2,0.25)' },
};

export default function StatusPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [selected, setSelected] = useState<Generation | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/generate/status');
      const json = await res.json();
      setGenerations(json.data || []);
      setLastRefresh(new Date());
      // Update selected if open
      if (selected) {
        const updated = (json.data || []).find((g: any) => g.id === selected.id);
        if (updated) setSelected(updated);
      }
    } catch (err) {
      console.error('Erro ao carregar status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const completed = generations.filter(g => g.status === 'completed').length;
  const processing = generations.filter(g => g.status === 'processing').length;

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 w-full animate-in fade-in duration-500 max-w-[1400px]">
      {/* Header */}
      <div className="flex justify-between items-end mb-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/gerador" className="text-[#4b6584] hover:text-[#2dd4bf] transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="section-title v2-section-header text-[#e2e8f0] text-lg w-max">{"Status das Gerações"}</h1>
          </div>
          <p className="text-[#4b6584] font-mono text-xs">
            Auto-refresh a cada 10s | Última: {lastRefresh.toLocaleTimeString('pt-BR')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-3 text-xs font-mono">
            <span className="text-[#22c55e]">{completed} {"concluídos"}</span>
            <span className="text-[#4b6584]">|</span>
            <span className="text-[#2dd4bf]">{processing} gerando</span>
            <span className="text-[#4b6584]">|</span>
            <span className="text-[#a1b1cc]">{generations.length} total</span>
          </div>
          <button
            onClick={() => { setLoading(true); fetchStatus(); }}
            className="relative group overflow-hidden bg-[#101e30] border border-[rgba(45,212,191,0.2)] rounded-lg px-4 py-2 text-[#2dd4bf] text-xs font-mono font-bold tracking-widest uppercase hover:text-[#03060a] transition-colors"
          >
            <div className="absolute inset-0 bg-[#2dd4bf] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center gap-2">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> REFRESH
            </span>
          </button>
        </div>
      </div>

      {/* List */}
      {loading && generations.length === 0 ? (
        <div className="flex items-center justify-center p-20 text-[#2dd4bf] font-mono text-sm tracking-widest">
          <RefreshCw className="w-5 h-5 animate-spin mr-3" /> CARREGANDO...
        </div>
      ) : generations.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 bg-[#0a1320] border border-[rgba(45,212,191,0.06)] rounded-xl">
          <Zap className="w-12 h-12 text-[#4b6584] mb-4" />
          <h3 className="text-[#a1b1cc] font-mono text-sm tracking-widest uppercase mb-1">{"Nenhuma geração encontrada"}</h3>
          <p className="text-[#4b6584] text-xs">{"Use o Gerador para iniciar uma geração."}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {generations.map((gen) => {
            const cfg = STATUS_CONFIG[gen.status] || STATUS_CONFIG.queued;
            const StatusIcon = cfg.icon;
            const docLabel = DOC_LABELS[gen.doc_type] || gen.doc_type.replace(/_/g, ' ');

            return (
              <div
                key={gen.id}
                onClick={() => setSelected(gen)}
                className="v2-card p-5 flex items-center gap-5 group cursor-pointer"
                style={{ borderLeft: `3px solid ${cfg.color}` }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: cfg.bg, border: `1px solid ${cfg.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <StatusIcon className={`w-5 h-5 ${gen.status === 'processing' ? 'animate-spin' : ''}`} style={{ color: cfg.color, filter: `drop-shadow(0 0 6px ${cfg.color}80)` }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[15px] font-bold text-[#e2e8f0] truncate">{gen.client_name}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider bg-[#101e30] border border-[rgba(45,212,191,0.15)] text-[#2dd4bf]">
                      {docLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-[#4b6584]">
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{gen.duration_display || formatAge(gen.age_seconds)}</span>
                    {gen.output_files?.length > 0 && (
                      <span className="text-[#22c55e] flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3" />{gen.output_files.length} arquivo(s)
                      </span>
                    )}
                    {gen.error_message && (
                      <span className="text-[#ef4444] truncate max-w-[200px]">{gen.error_message}</span>
                    )}
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-lg border flex items-center gap-2" style={{ background: cfg.bg, borderColor: cfg.border }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }} />
                  <span className="text-[10px] font-mono tracking-widest font-bold" style={{ color: cfg.color }}>
                    {cfg.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Panel */}
      {selected && (
        <div className="fixed inset-0 bg-[#03060a]/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="bg-[#080d16] border border-[rgba(45,212,191,0.2)] shadow-[0_0_50px_rgba(45,212,191,0.1)] rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[rgba(45,212,191,0.06)] flex justify-between items-center bg-[#0a1320]">
              <div>
                <span className="text-[10px] text-[#2dd4bf] font-mono uppercase tracking-widest font-bold">{"Detalhes da Geração"}</span>
                <h2 className="text-lg font-bold text-[#e2e8f0]">{selected.client_name} — {DOC_LABELS[selected.doc_type] || selected.doc_type}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="text-[#4b6584] hover:text-[#2dd4bf]"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-5">
              {/* Status + Time */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Status', value: (STATUS_CONFIG[selected.status] || STATUS_CONFIG.queued).label, color: (STATUS_CONFIG[selected.status] || STATUS_CONFIG.queued).color },
                  { label: 'Duração', value: selected.duration_display || (selected.duration_seconds ? `${selected.duration_seconds}s` : '—'), color: '#2dd4bf' },
                  { label: 'Iniciado', value: selected.started_at ? new Date(selected.started_at).toLocaleString('pt-BR') : '—', color: '#a1b1cc' },
                ].map((item, i) => (
                  <div key={i} className="bg-[#101e30] rounded-lg p-4 text-center">
                    <div className="text-[9px] text-[#4b6584] font-mono tracking-widest uppercase mb-1">{item.label}</div>
                    <div className="text-sm font-mono font-bold" style={{ color: item.color }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Output Path */}
              <div className="bg-[#101e30] rounded-lg p-4">
                <div className="text-[9px] text-[#2dd4bf] font-mono tracking-widest uppercase mb-2 font-bold flex items-center gap-2">
                  <FolderOpen className="w-3.5 h-3.5" /> Pasta de Output
                </div>
                <div className="text-[12px] font-mono text-[#a1b1cc] break-all">{selected.output_path || '—'}</div>
              </div>

              {/* Output Files */}
              {selected.output_files?.length > 0 && (
                <div className="bg-[#101e30] rounded-lg p-4">
                  <div className="text-[9px] text-[#22c55e] font-mono tracking-widest uppercase mb-2 font-bold">Arquivos Gerados</div>
                  {selected.output_files.map((f: string, i: number) => (
                    <div key={i} className="text-[12px] font-mono text-[#a1b1cc] py-1 flex items-center gap-2">
                      <FileText className="w-3 h-3 text-[#22c55e]" /> {f}
                    </div>
                  ))}
                </div>
              )}

              {/* Prompt File */}
              <div className="bg-[#101e30] rounded-lg p-4">
                <div className="text-[9px] text-[#4b6584] font-mono tracking-widest uppercase mb-2 font-bold">{"Instrução"}</div>
                <div className="text-[11px] font-mono text-[#4b6584] break-all">{selected.prompt_file}</div>
              </div>

              {/* Error */}
              {selected.error_message && (
                <div className="bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-lg p-4">
                  <div className="text-[9px] text-[#ef4444] font-mono tracking-widest uppercase mb-2 font-bold">Erro</div>
                  <div className="text-[12px] font-mono text-[#ef4444]/80">{selected.error_message}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
