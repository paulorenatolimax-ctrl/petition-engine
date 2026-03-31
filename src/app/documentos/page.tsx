'use client';

import { useEffect, useState } from 'react';
import {
  FileText,
  Check,
  X,
  MessageSquare,
  Send,
  ChevronDown,
  ChevronUp,
  Clock,
  RefreshCw,
  GitBranch,
  Upload,
  AlertTriangle,
} from 'lucide-react';

interface Generation {
  id: string;
  client_id: string;
  client_name: string;
  doc_type: string;
  prompt_file: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  output_path: string;
  output_files: string[];
  error_message: string | null;
  duration_seconds: number | null;
  current_phase?: string;
  current_phase_label?: string;
}

interface Feedback {
  section: string;
  page: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'fixed' | 'accepted' | 'rejected';
}

const DOC_TYPE_LABELS: Record<string, string> = {
  resume_eb1a: 'Résumé EB-1A',
  resume_eb2_niw: 'Résumé EB-2 NIW',
  cover_letter_eb1a: 'Cover Letter EB-1A',
  cover_letter_eb2_niw: 'Cover Letter EB-2 NIW',
  business_plan: 'Business Plan',
  methodology: 'Metodologia',
  declaration_of_intentions: 'Declaração de Intenções',
  anteprojeto_eb1a: 'Case Compass EB-1A',
  anteprojeto_eb2_niw: 'Case Compass EB-2 NIW',
  projeto_base_eb1a: 'Case Blueprint EB-1A',
  projeto_base_eb2_niw: 'Case Blueprint EB-2 NIW',
  impacto_report: 'IMPACTO',
  strategy_eb1: 'Estratégia EB-1A',
  strategy_eb2: 'Estratégia EB-2 NIW',
  saas_evidence: 'SaaS Evidence Architect',
  rfe_response: 'Resposta a RFE',
};

const PHASE_LABELS: Record<string, string> = {
  'phase_1': 'Gerando documento...',
  'phase_1.5': 'Quality Gate — Validação automática',
  'phase_2': 'Separation of Concerns — Revisão cruzada',
  'completed': 'Concluído',
  'failed': 'Falhou',
};

export default function DocumentosPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [feedbackSection, setFeedbackSection] = useState('');
  const [feedbackPage, setFeedbackPage] = useState('');
  const [feedbackDesc, setFeedbackDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<Record<string, Feedback[]>>({});
  const [showUpload, setShowUpload] = useState(false);
  const [uploadPath, setUploadPath] = useState('');
  const [uploadDocType, setUploadDocType] = useState('business_plan');
  const [uploadClientName, setUploadClientName] = useState('');
  const [uploadNotes, setUploadNotes] = useState('');
  const [feedbackMode, setFeedbackMode] = useState<'cirurgico' | 'cascalho'>('cirurgico');

  const fetchGenerations = () => {
    fetch('/api/documents')
      .then(r => r.json())
      .then(d => setGenerations((d.data || []).sort((a: Generation, b: Generation) =>
        new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
      )))
      .catch(() => setGenerations([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGenerations();
    // Auto-refresh every 10s to catch updates from running generations
    const interval = setInterval(fetchGenerations, 10000);
    return () => clearInterval(interval);
  }, []);

  const submitFeedback = async (genId: string, docType: string) => {
    if (!feedbackDesc.trim()) return;
    setSubmitting(true);
    setFeedbackResult(null);

    const feedbackText = [
      feedbackSection ? `Secao ${feedbackSection}` : '',
      feedbackPage ? `pagina ${feedbackPage}` : '',
      feedbackDesc,
    ].filter(Boolean).join(' — ');

    try {
      // 1. Create error rule from feedback
      const res = await fetch('/api/errors/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error_description: feedbackText,
          doc_type: docType,
          severity: 'high',
        }),
      });

      if (res.ok) {
        // Track feedback locally
        const newFb: Feedback = {
          section: feedbackSection,
          page: feedbackPage,
          description: feedbackDesc,
          timestamp: new Date().toISOString(),
          status: 'pending',
        };
        setFeedbacks(prev => ({
          ...prev,
          [genId]: [...(prev[genId] || []), newFb],
        }));

        setFeedbackResult('Apontamento registrado. O Engine aprendeu e vai corrigir na próxima versão.');
        setFeedbackSection('');
        setFeedbackPage('');
        setFeedbackDesc('');
        setTimeout(() => setFeedbackResult(null), 5000);
      } else {
        setFeedbackResult('Erro ao registrar o apontamento');
      }
    } catch {
      setFeedbackResult('Erro de conexão');
    }
    setSubmitting(false);
  };

  const acceptDocument = async (genId: string) => {
    setFeedbackResult('Documento ACEITO. Regras incorporadas ao sistema.');
    setTimeout(() => setFeedbackResult(null), 5000);
  };

  const importDocument = async () => {
    if (!uploadPath.trim()) return;
    setSubmitting(true);
    try {
      // 1. If there are notes, create error rules from them FIRST
      // Only lines with 30+ chars are real rules (skip fragments from textarea wrapping)
      if (uploadNotes.trim()) {
        const noteLines = uploadNotes.split('\n').filter(l => l.trim().length >= 30);
        for (const note of noteLines) {
          await fetch('/api/errors/report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              error_description: note.trim(),
              doc_type: uploadDocType,
              severity: 'high',
            }),
          });
        }
      }

      // 2. Register the document
      const genId = `ext_${Date.now()}`;
      const newGen: Generation = {
        id: genId,
        client_id: '',
        client_name: uploadClientName || 'Documento Externo',
        doc_type: uploadDocType,
        prompt_file: '',
        status: 'completed',
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        output_path: uploadPath,
        output_files: [uploadPath.split('/').pop() || ''],
        error_message: null,
        duration_seconds: null,
      };

      // Save to generations.json via API
      try {
        await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file_path: uploadPath,
            doc_type: uploadDocType,
            client_name: uploadClientName || 'Documento Externo',
            source: 'external_import',
            notes: uploadNotes,
          }),
        });
      } catch {}

      // Add to local list
      setGenerations(prev => [newGen, ...prev]);

      // Track initial notes as feedbacks (only real lines, not fragments)
      if (uploadNotes.trim()) {
        const realNotes = uploadNotes.split('\n').filter(l => l.trim().length >= 30);
        setFeedbacks(prev => ({
          ...prev,
          [genId]: realNotes.map(note => ({
            section: '',
            page: '',
            description: note.trim(),
            timestamp: new Date().toISOString(),
            status: 'pending' as const,
          })),
        }));
      }

      const rulesCreated = uploadNotes.trim() ? uploadNotes.split('\n').filter(l => l.trim().length >= 30).length : 0;
      setUploadPath('');
      setUploadClientName('');
      setUploadNotes('');
      setShowUpload(false);
      setFeedbackResult(
        rulesCreated > 0
          ? `Documento importado + ${rulesCreated} consideração(ões) registrada(s) como regras no Engine.`
          : 'Documento importado com sucesso. Clique nele para revisar.'
      );
      setTimeout(() => setFeedbackResult(null), 5000);
    } catch {
      setFeedbackResult('Erro ao importar documento');
    }
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 w-full animate-in fade-in duration-500 max-w-[1400px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-col gap-1">
          <h1 className="section-title v2-section-header text-[#e2e8f0] text-lg w-max">Documentos</h1>
          <p className="text-[#a1b1cc] font-mono text-xs mt-2">
            Histórico de gerações · Clique para revisar e apontar ajustes
          </p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono tracking-widest uppercase font-bold bg-[rgba(139,92,246,0.1)] text-[#8b5cf6] border border-[rgba(139,92,246,0.2)] hover:bg-[rgba(139,92,246,0.2)] transition-all"
        >
          <Upload className="w-3.5 h-3.5" /> IMPORTAR DOCUMENTO
        </button>
      </div>

      {/* Upload Panel */}
      {showUpload && (
        <div className="v2-card p-6">
          <h3 className="text-xs font-mono text-[#8b5cf6] tracking-widest uppercase mb-3 flex items-center gap-2">
            <Upload className="w-4 h-4" /> Importar Documento Externo
          </h3>
          <p className="text-[#4b6584] text-xs mb-4">
            Importe um documento de outro escritório ou consultor para passar pelo sistema de qualidade.
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[9px] text-[#4b6584] font-mono tracking-widest uppercase">Caminho do arquivo (.docx ou .md)</label>
                <input
                  value={uploadPath}
                  onChange={e => setUploadPath(e.target.value)}
                  placeholder="/Users/paulo1844/Documents/..."
                  className="w-full bg-[#03060a] border border-[rgba(139,92,246,0.15)] rounded px-3 py-2 text-xs text-[#e2e8f0] font-mono placeholder-[#4b6584] focus:outline-none focus:border-[#8b5cf6]"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-[#4b6584] font-mono tracking-widest uppercase">Cliente / Escritório</label>
                <input
                  value={uploadClientName}
                  onChange={e => setUploadClientName(e.target.value)}
                  placeholder="Nome do cliente ou escritório"
                  className="w-60 bg-[#03060a] border border-[rgba(139,92,246,0.15)] rounded px-3 py-2 text-xs text-[#e2e8f0] placeholder-[#4b6584] focus:outline-none focus:border-[#8b5cf6]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-[#4b6584] font-mono tracking-widest uppercase">Tipo de documento</label>
                <select
                  value={uploadDocType}
                  onChange={e => setUploadDocType(e.target.value)}
                  className="bg-[#03060a] border border-[rgba(139,92,246,0.15)] rounded px-3 py-2 text-xs text-[#a1b1cc] font-mono"
                >
                  <option value="business_plan">Business Plan</option>
                  <option value="cover_letter_eb1a">Cover Letter EB-1A</option>
                  <option value="cover_letter_eb2_niw">Cover Letter EB-2 NIW</option>
                  <option value="resume_eb1a">Résumé EB-1A</option>
                  <option value="resume_eb2_niw">Résumé EB-2 NIW</option>
                  <option value="methodology">Metodologia</option>
                  <option value="declaration_of_intentions">Declaração de Intenções</option>
                  <option value="anteprojeto_eb1a">Anteprojeto EB-1A</option>
                  <option value="anteprojeto_eb2_niw">Anteprojeto EB-2 NIW</option>
                  <option value="rfe_response">Resposta a RFE</option>
                  <option value="other">Outro</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-[#4b6584] font-mono tracking-widest uppercase">
                Considerações e apontamentos iniciais (cada linha vira uma regra no Engine)
              </label>
              <textarea
                value={uploadNotes}
                onChange={e => setUploadNotes(e.target.value)}
                placeholder={"Descreva os problemas que você já identificou, um por linha. Exemplos:\nSeção 2.3 — dados de mercado desatualizados, usar fonte BLS 2025\nTabelas sem parágrafos de contexto antes e depois\nTom inconsistente entre seções 3 e 4\nFalta de notas de rodapé com fontes verificáveis"}
                className="w-full h-28 bg-[#03060a] border border-[rgba(139,92,246,0.15)] rounded-lg p-3 text-sm text-[#e2e8f0] placeholder-[#4b6584] resize-none focus:outline-none focus:border-[#8b5cf6]"
              />
              <p className="text-[9px] text-[#4b6584] font-mono mt-1">
                Cada linha será convertida em uma regra de qualidade ativa no Engine e será aplicada automaticamente nas próximas gerações.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={importDocument}
                disabled={submitting || !uploadPath.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono tracking-widest uppercase font-bold bg-[#8b5cf6] text-white hover:bg-[#9d6ff7] transition-all disabled:opacity-30 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                <Upload className="w-3.5 h-3.5" /> {submitting ? 'IMPORTANDO...' : 'IMPORTAR E REGISTRAR REGRAS'}
              </button>
              {uploadNotes.trim() && (
                <span className="text-[10px] text-[#8b5cf6] font-mono">
                  {uploadNotes.split('\n').filter(l => l.trim().length >= 30).length} regra(s) serão criadas
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
        <div className="v2-card p-5" style={{ borderBottom: '3px solid #8b5cf6' }}>
          <span className="text-[10px] text-[#4b6584] font-mono tracking-[2px] font-bold uppercase">Total Gerados</span>
          <div className="text-3xl font-black font-mono text-[#e2e8f0] mt-2" style={{ textShadow: '0 0 20px #8b5cf680' }}>
            {loading ? '--' : generations.length}
          </div>
        </div>
        <div className="v2-card p-5" style={{ borderBottom: '3px solid #00eaff' }}>
          <span className="text-[10px] text-[#4b6584] font-mono tracking-[2px] font-bold uppercase">Em Andamento</span>
          <div className="text-3xl font-black font-mono text-[#00eaff] mt-2 flex items-center gap-2" style={{ textShadow: '0 0 20px #00eaff80' }}>
            {loading ? '--' : generations.filter(g => g.status === 'processing').length}
            {!loading && generations.some(g => g.status === 'processing') && (
              <RefreshCw className="w-4 h-4 animate-spin" />
            )}
          </div>
        </div>
        <div className="v2-card p-5" style={{ borderBottom: '3px solid #ffa502' }}>
          <span className="text-[10px] text-[#4b6584] font-mono tracking-[2px] font-bold uppercase">Pendentes Revisao</span>
          <div className="text-3xl font-black font-mono text-[#e2e8f0] mt-2" style={{ textShadow: '0 0 20px #ffa50280' }}>
            {loading ? '--' : generations.filter(g => g.status === 'completed').length}
          </div>
        </div>
        <div className="v2-card p-5" style={{ borderBottom: '3px solid #2ed573' }}>
          <span className="text-[10px] text-[#4b6584] font-mono tracking-[2px] font-bold uppercase">Aceitos</span>
          <div className="text-3xl font-black font-mono text-[#e2e8f0] mt-2" style={{ textShadow: '0 0 20px #2ed57380' }}>
            {loading ? '--' : generations.filter(g => g.status === 'accepted').length}
          </div>
        </div>
      </div>

      {/* Active generation banner */}
      {generations.some(g => g.status === 'processing') && (
        <div className="v2-card p-4 border border-[#00eaff30] bg-[#00eaff05]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#00eaff] animate-pulse shadow-[0_0_10px_#00eaff]" />
            <div className="flex flex-col">
              <span className="text-sm font-mono text-[#00eaff]">
                Geracao em andamento — {generations.filter(g => g.status === 'processing').map(g =>
                  `${g.client_name} (${DOC_TYPE_LABELS[g.doc_type] || g.doc_type})`
                ).join(', ')}
              </span>
              {generations.filter(g => g.status === 'processing').map(g => g.current_phase_label).filter(Boolean).map((label, i) => (
                <span key={i} className="text-[10px] font-mono text-[#4b6584] mt-1">
                  Fase atual: {label}
                </span>
              ))}
            </div>
            <span className="text-[10px] font-mono text-[#4b6584] ml-auto">
              Auto-refresh a cada 10s
            </span>
          </div>
        </div>
      )}

      {/* Document List */}
      <div className="v2-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-20 font-mono text-sm tracking-widest text-[#00eaff] animate-pulse">
            CARREGANDO DOCUMENTOS...
          </div>
        ) : generations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-[#4b6584]">
            <FileText className="w-12 h-12 mb-4 opacity-50" />
            <span className="font-mono text-sm tracking-widest">NENHUM DOCUMENTO ENCONTRADO</span>
            <p className="text-xs mt-2 text-center max-w-md">
              Gere um documento pelo Gerador ou importe um documento externo para revisão.
            </p>
          </div>
        ) : (
          <div className="flex flex-col w-full">
            {generations.map((gen) => {
              const isExpanded = expandedId === gen.id;
              const genFeedbacks = feedbacks[gen.id] || [];
              const docLabel = DOC_TYPE_LABELS[gen.doc_type] || gen.doc_type;
              const date = new Date(gen.started_at).toLocaleDateString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
              });

              return (
                <div key={gen.id} className="border-b border-[#ffffff05]">
                  {/* Document Row */}
                  <div
                    className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-[#101e30] transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : gen.id)}
                  >
                    <FileText className="w-5 h-5 text-[#8b5cf6] flex-shrink-0" style={{ filter: 'drop-shadow(0 0 5px rgba(139,92,246,0.5))' }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-[#e2e8f0] truncate">{gen.client_name}</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-wider bg-[#8b5cf610] text-[#8b5cf6] border border-[#8b5cf630]">
                          {docLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-[#4b6584] font-mono">{date}</span>
                        {gen.output_files?.length > 0 && (
                          <span className="text-[10px] text-[#4b6584] font-mono">{gen.output_files[0]}</span>
                        )}
                        {gen.duration_seconds && (
                          <span className="text-[10px] text-[#4b6584] font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {gen.duration_seconds}s
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {gen.status === 'processing' ? (
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            <div className="w-2 h-2 rounded-full bg-[#00eaff] animate-pulse" />
                            <div className="w-2 h-2 rounded-full bg-[#00eaff40]" />
                            <div className="w-2 h-2 rounded-full bg-[#00eaff20]" />
                          </div>
                          <span className="px-2 py-1 rounded text-[9px] font-bold font-mono tracking-wider bg-[#00eaff10] text-[#00eaff] border border-[#00eaff30] animate-pulse">
                            GERANDO...
                          </span>
                        </div>
                      ) : (
                        <span className={`px-2 py-1 rounded text-[9px] font-bold font-mono tracking-wider ${
                          gen.status === 'completed' ? 'bg-[#ffa50210] text-[#ffa502] border border-[#ffa50230]' :
                          gen.status === 'accepted' ? 'bg-[#2ed57310] text-[#2ed573] border border-[#2ed57330]' :
                          gen.status === 'failed' ? 'bg-[#ff475710] text-[#ff4757] border border-[#ff475730]' :
                          'bg-[#00eaff10] text-[#00eaff] border border-[#00eaff30]'
                        }`}>
                          {gen.status === 'completed' ? 'PENDENTE REVISAO' :
                           gen.status === 'accepted' ? 'ACEITO' :
                           gen.status === 'failed' ? 'FALHOU' :
                           gen.status?.toUpperCase() || 'DESCONHECIDO'}
                        </span>
                      )}
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-[#4b6584]" /> : <ChevronDown className="w-4 h-4 text-[#4b6584]" />}
                    </div>
                  </div>

                  {/* Expanded Panel */}
                  {isExpanded && (
                    <div className="px-6 pb-6 bg-[#03060a] border-t border-[rgba(0,234,255,0.06)]">
                      {/* Progress phases for processing/completed */}
                      <div className="mt-4 mb-4">
                        <h3 className="text-xs font-mono text-[#4b6584] tracking-widest uppercase mb-3">
                          Pipeline de Execucao
                        </h3>
                        <div className="flex items-center gap-2">
                          {[
                            { key: 'phase_1', label: 'Geracao', icon: '1' },
                            { key: 'phase_1.5', label: 'Quality Gate', icon: '2' },
                            { key: 'phase_2', label: 'SOC Review', icon: '3' },
                          ].map((phase, pi) => {
                            const isProcessing = gen.status === 'processing';
                            const isComplete = gen.status === 'completed' || gen.status === 'accepted';
                            const isFailed = gen.status === 'failed';
                            const phaseOrder = ['phase_1', 'phase_1.5', 'phase_2'];
                            const currentIdx = gen.current_phase ? phaseOrder.indexOf(gen.current_phase) : -1;
                            const phaseComplete = isComplete || (isProcessing && pi < currentIdx);
                            const phaseActive = isProcessing && pi === currentIdx;
                            return (
                              <div key={phase.key} className="flex items-center gap-2 flex-1">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                                  phaseComplete ? 'bg-[#2ed573] text-[#03060a]' :
                                  phaseActive ? 'bg-[#00eaff] text-[#03060a] animate-pulse' :
                                  isFailed && pi === 0 ? 'bg-[#ff4757] text-white' :
                                  'bg-[#1a2a3a] text-[#4b6584]'
                                }`}>
                                  {phaseComplete ? '\u2713' : phase.icon}
                                </div>
                                <span className={`text-[10px] font-mono ${
                                  phaseComplete ? 'text-[#2ed573]' :
                                  phaseActive ? 'text-[#00eaff]' :
                                  'text-[#4b6584]'
                                }`}>{phase.label}</span>
                                {pi < 2 && <div className={`flex-1 h-px ${phaseComplete ? 'bg-[#2ed573]' : 'bg-[#1a2a3a]'}`} />}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Output files */}
                      {gen.output_files && gen.output_files.length > 0 && (
                        <div className="mb-4 p-3 rounded-lg bg-[#0a1320] border border-[#ffffff08]">
                          <h3 className="text-[10px] font-mono text-[#2ed573] tracking-widest uppercase mb-2 flex items-center gap-2">
                            <FileText className="w-3 h-3" /> Arquivos Gerados ({gen.output_files.length})
                          </h3>
                          <div className="flex flex-col gap-1">
                            {gen.output_files.map((f, fi) => (
                              <div key={fi} className="flex items-center gap-2 text-xs font-mono text-[#a1b1cc]">
                                <span className="text-[#4b6584]">{fi + 1}.</span>
                                <span>{f}</span>
                                {f.endsWith('.pptx') && <span className="px-1.5 py-0.5 rounded text-[8px] bg-[#8b5cf610] text-[#8b5cf6] border border-[#8b5cf620]">PPTX</span>}
                                {f.includes('REVIEWED') && <span className="px-1.5 py-0.5 rounded text-[8px] bg-[#2ed57310] text-[#2ed573] border border-[#2ed57320]">REVISADO</span>}
                              </div>
                            ))}
                          </div>
                          {gen.output_path && (
                            <p className="text-[9px] font-mono text-[#4b6584] mt-2">
                              Pasta: {gen.output_path}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Error message */}
                      {gen.error_message && (
                        <div className="mb-4 p-3 rounded-lg bg-[#ff475710] border border-[#ff475730]">
                          <p className="text-xs font-mono text-[#ff4757]">{gen.error_message}</p>
                        </div>
                      )}

                      {/* Previous feedbacks */}
                      {genFeedbacks.length > 0 && (
                        <div className="mt-4 mb-4">
                          <h3 className="text-xs font-mono text-[#00eaff] tracking-widest uppercase mb-3">
                            Apontamentos Anteriores ({genFeedbacks.length})
                          </h3>
                          {genFeedbacks.map((fb, fi) => (
                            <div key={fi} className="flex items-start gap-3 p-3 rounded-lg bg-[#0a1320] border border-[#ffffff08] mb-2">
                              <MessageSquare className="w-4 h-4 text-[#ffa502] mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 text-[10px] text-[#4b6584] font-mono">
                                  {fb.section && <span>Secao {fb.section}</span>}
                                  {fb.page && <span>· Pag. {fb.page}</span>}
                                  <span>· {new Date(fb.timestamp).toLocaleTimeString('pt-BR')}</span>
                                </div>
                                <p className="text-xs text-[#a1b1cc] mt-1">{fb.description}</p>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold ${
                                fb.status === 'fixed' ? 'text-[#2ed573] bg-[#2ed57310]' :
                                fb.status === 'accepted' ? 'text-[#00eaff] bg-[#00eaff10]' :
                                'text-[#ffa502] bg-[#ffa50210]'
                              }`}>
                                {fb.status.toUpperCase()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* New Feedback Form */}
                      <div className="mt-4 p-4 bg-[#0a1320] rounded-xl border border-[rgba(0,234,255,0.1)]">
                        <h3 className="text-xs font-mono text-[#00eaff] tracking-widest uppercase mb-3 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" /> Apontamento de Revisão
                        </h3>

                        {/* Toggle: Cirúrgico vs Cascalho */}
                        <div className="flex gap-2 mb-3">
                          <button
                            onClick={() => setFeedbackMode('cirurgico')}
                            className={`px-3 py-1.5 rounded text-[10px] font-mono tracking-wider font-bold transition-all ${
                              feedbackMode === 'cirurgico'
                                ? 'bg-[#00eaff15] text-[#00eaff] border border-[#00eaff40]'
                                : 'bg-transparent text-[#4b6584] border border-[#ffffff10] hover:text-[#a1b1cc]'
                            }`}
                          >
                            CIRÚRGICO (seção específica)
                          </button>
                          <button
                            onClick={() => setFeedbackMode('cascalho')}
                            className={`px-3 py-1.5 rounded text-[10px] font-mono tracking-wider font-bold transition-all ${
                              feedbackMode === 'cascalho'
                                ? 'bg-[#ff475715] text-[#ff4757] border border-[#ff475740]'
                                : 'bg-transparent text-[#4b6584] border border-[#ffffff10] hover:text-[#a1b1cc]'
                            }`}
                          >
                            <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> CASCALHO (refazer seção/bloco inteiro)</span>
                          </button>
                        </div>

                        {/* Campos de seção/página (só no modo cirúrgico) */}
                        {feedbackMode === 'cirurgico' && (
                          <div className="flex gap-3 mb-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] text-[#4b6584] font-mono tracking-widest uppercase">Seção</label>
                              <input
                                value={feedbackSection}
                                onChange={e => setFeedbackSection(e.target.value)}
                                placeholder="Ex: 2.3.1"
                                className="w-24 bg-[#03060a] border border-[rgba(0,234,255,0.1)] rounded px-3 py-2 text-xs text-[#e2e8f0] font-mono placeholder-[#4b6584] focus:outline-none focus:border-[#00eaff]"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] text-[#4b6584] font-mono tracking-widest uppercase">Página</label>
                              <input
                                value={feedbackPage}
                                onChange={e => setFeedbackPage(e.target.value)}
                                placeholder="Ex: 12"
                                className="w-20 bg-[#03060a] border border-[rgba(0,234,255,0.1)] rounded px-3 py-2 text-xs text-[#e2e8f0] font-mono placeholder-[#4b6584] focus:outline-none focus:border-[#00eaff]"
                              />
                            </div>
                          </div>
                        )}

                        <textarea
                          value={feedbackDesc}
                          onChange={e => setFeedbackDesc(e.target.value)}
                          placeholder={feedbackMode === 'cirurgico'
                            ? "Descreva o problema com precisão. Ex: 'Dados de mercado estão com fonte de 2023, precisa atualizar pra 2025 do BLS'"
                            : "Descreva o que está errado no bloco inteiro. Ex: 'Seção inteira de Localização está com linhas quebradas e dados inconsistentes. Refazer do zero com base nos dados do Census.gov'"
                          }
                          className={`w-full ${feedbackMode === 'cascalho' ? 'h-32' : 'h-20'} bg-[#03060a] border ${
                            feedbackMode === 'cascalho' ? 'border-[rgba(255,71,87,0.2)]' : 'border-[rgba(0,234,255,0.1)]'
                          } rounded-lg p-3 text-sm text-[#e2e8f0] placeholder-[#4b6584] resize-none focus:outline-none ${
                            feedbackMode === 'cascalho' ? 'focus:border-[#ff4757]' : 'focus:border-[#00eaff]'
                          }`}
                        />
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => submitFeedback(gen.id, gen.doc_type)}
                            disabled={submitting || !feedbackDesc.trim()}
                            className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono tracking-widest uppercase font-bold bg-[#ffa502] text-[#03060a] hover:bg-[#ffb732] transition-all disabled:opacity-30 shadow-[0_0_15px_rgba(255,165,2,0.3)]"
                          >
                            <Send className="w-3.5 h-3.5" /> {submitting ? 'REGISTRANDO...' : 'APONTAR PROBLEMA'}
                          </button>
                          <button
                            onClick={() => acceptDocument(gen.id)}
                            className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono tracking-widest uppercase font-bold bg-[#2ed573] text-[#03060a] hover:bg-[#4de68a] transition-all shadow-[0_0_15px_rgba(46,213,115,0.3)]"
                          >
                            <Check className="w-3.5 h-3.5" /> ACEITAR DOCUMENTO
                          </button>
                          <button
                            className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono tracking-widest uppercase font-bold border border-[#ff475730] text-[#ff4757] hover:bg-[#ff475710] transition-all"
                          >
                            <X className="w-3.5 h-3.5" /> REJEITAR
                          </button>
                        </div>
                        {feedbackResult && (
                          <div className={`mt-3 text-xs font-mono px-4 py-2 rounded-lg ${
                            feedbackResult.includes('Erro') ? 'bg-[#ff475710] text-[#ff4757] border border-[#ff475730]' :
                            'bg-[#2ed57310] text-[#2ed573] border border-[#2ed57330]'
                          }`}>
                            {feedbackResult}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
