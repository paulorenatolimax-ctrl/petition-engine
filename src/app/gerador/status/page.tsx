'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RefreshCw, FileText, CheckCircle, XCircle, Clock, FolderOpen, ArrowLeft, Zap } from 'lucide-react';

interface Generation {
  id: string;
  prompt_file: string;
  doc_type: string;
  client_name: string;
  client_id: string | null;
  source?: string;
  status: 'concluido' | 'erro' | 'pendente';
  output_dir: string;
  docx_files: string[];
  created_at: string;
  age_seconds: number;
}

const DOC_LABELS: Record<string, string> = {
  cover_eb1a: 'Cover Letter EB-1A',
  cover_letter_eb1a: 'Cover Letter EB-1A',
  cover_eb2niw: 'Cover Letter EB-2 NIW',
  cover_letter_eb2_niw: 'Cover Letter EB-2 NIW',
  resume: 'Résumé',
  resume_eb2_niw: 'Résumé EB-2 NIW',
  resume_deni_v2: 'Résumé EB-2 NIW',
  bp: 'Business Plan',
  business_plan: 'Business Plan',
  bp_deni: 'Business Plan',
  methodology: 'Metodologia',
};

function formatAge(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

const STATUS_CONFIG = {
  concluido: { icon: CheckCircle, label: 'CONCLUIDO', color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)' },
  erro: { icon: XCircle, label: 'ERRO', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
  pendente: { icon: Clock, label: 'PENDENTE', color: '#ffa502', bg: 'rgba(255,165,2,0.08)', border: 'rgba(255,165,2,0.25)' },
};

export default function StatusPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/generate/status');
      const json = await res.json();
      setGenerations(json.data || []);
      setLastRefresh(new Date());
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

  const concluidos = generations.filter(g => g.status === 'concluido').length;
  const pendentes = generations.filter(g => g.status === 'pendente').length;

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 w-full animate-in fade-in duration-500 max-w-[1400px]">
      {/* Header */}
      <div className="flex justify-between items-end mb-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/gerador" className="text-[#4b6584] hover:text-[#2dd4bf] transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="section-title v2-section-header text-[#e2e8f0] text-lg w-max">Status das Geracoes</h1>
          </div>
          <p className="text-[#4b6584] font-mono text-xs">
            Auto-refresh a cada 10s | Ultima: {lastRefresh.toLocaleTimeString('pt-BR')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-3 text-xs font-mono">
            <span className="text-[#22c55e]">{concluidos} concluidos</span>
            <span className="text-[#4b6584]">|</span>
            <span className="text-[#ffa502]">{pendentes} pendentes</span>
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
          <RefreshCw className="w-5 h-5 animate-spin mr-3" /> SCANNING GENERATIONS...
        </div>
      ) : generations.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 bg-[#0a1320] border border-[rgba(45,212,191,0.06)] rounded-xl">
          <Zap className="w-12 h-12 text-[#4b6584] mb-4" />
          <h3 className="text-[#a1b1cc] font-mono text-sm tracking-widest uppercase mb-1">Nenhuma geracao encontrada</h3>
          <p className="text-[#4b6584] text-xs">Use o Gerador para iniciar uma geracao.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {generations.map((gen) => {
            const cfg = STATUS_CONFIG[gen.status];
            const StatusIcon = cfg.icon;
            const docLabel = DOC_LABELS[gen.doc_type] || gen.doc_type.replace(/_/g, ' ');

            return (
              <div
                key={gen.id}
                className="v2-card p-5 flex items-center gap-5 group"
                style={{ borderLeft: `3px solid ${cfg.color}` }}
              >
                {/* Status icon */}
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: cfg.bg, border: `1px solid ${cfg.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <StatusIcon className="w-5 h-5" style={{ color: cfg.color, filter: `drop-shadow(0 0 6px ${cfg.color}80)` }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[15px] font-bold text-[#e2e8f0] truncate">{gen.client_name}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider bg-[#101e30] border border-[rgba(45,212,191,0.15)] text-[#2dd4bf]">
                      {docLabel}
                    </span>
                    {gen.source && (
                      <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider bg-[rgba(168,85,247,0.1)] border border-[rgba(168,85,247,0.2)] text-[#a855f7]">
                        {gen.source}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-[#4b6584]">
                    <span className="flex items-center gap-1.5"><FileText className="w-3 h-3" />{gen.id}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{formatAge(gen.age_seconds)} atras</span>
                    {gen.docx_files.length > 0 && (
                      <span className="text-[#22c55e] flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3" />{gen.docx_files.length} .docx
                      </span>
                    )}
                  </div>
                </div>

                {/* Status badge */}
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-lg border flex items-center gap-2" style={{ background: cfg.bg, borderColor: cfg.border }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }} />
                    <span className="text-[10px] font-mono tracking-widest font-bold" style={{ color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
