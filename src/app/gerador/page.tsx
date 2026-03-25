'use client';

import { useEffect, useState } from 'react';
import { FileText, Zap, Copy, Check, X, ChevronRight, AlertTriangle, User, Loader2, Sparkles, AlertCircle, Shield, Eye } from 'lucide-react';

// Mapa: system_name (EXATO como vem do banco) → doc_type enum (esperado pela API)
const SYSTEM_TO_ENUM: Record<string, string> = {
  'Résumé EB-1A': 'resume',
  'Resume EB-1A': 'resume',
  'Cover Letter EB-1A': 'cover_letter_eb1a',
  'Cover Letter EB-2 NIW': 'cover_letter_eb2_niw',
  'Cover Letter O-1': 'cover_letter_o1',
  'Business Plan': 'business_plan',
  'Methodology': 'methodology',
  'Metodologia': 'methodology',
  'Declaration of Intentions': 'declaration_of_intentions',
  'Declaração de Intenções': 'declaration_of_intentions',
  'Anteprojeto': 'anteprojeto',
  'Location Analysis': 'location_analysis',
  'Análise de Localização': 'location_analysis',
  'Localização': 'location_analysis',
  'IMPACTO': 'impacto_report',
  'IMPACTO®': 'impacto_report',
  'Impacto Report': 'impacto_report',
  'Strategy EB-1': 'strategy_eb1',
  'Estratégia EB-1A': 'strategy_eb1',
  'Strategy EB-2': 'strategy_eb2',
  'Estratégia EB-2 NIW': 'strategy_eb2',
  'Satellite Letters': 'satellite_letter',
  'Cartas Satélite': 'satellite_letter',
  'Photographic Report': 'photographic_report',
  'Relatório Fotográfico': 'photographic_report',
  'RFE Response': 'rfe_response',
  'Résumé EB-2 NIW': 'resume_eb2_niw',
  'Resume EB-2 NIW': 'resume_eb2_niw',
};

interface SystemVersion {
  id: string;
  system_name: string;
  version_tag: string;
  doc_type: string;
  is_active: boolean;
  recommended_model: string;
  file_count: number;
}

interface Client {
  id: string;
  name: string;
  visa_type: string;
  company_name: string | null;
  client_profiles?: { extracted_at: string | null } | null;
}

const SYSTEM_LABELS: Record<string, string> = {
  'cover-letter-eb1a': 'Cover Letter EB-1A',
  'cover-letter-eb2-niw': 'Cover Letter EB-2 NIW',
  'cover-letter-o1': 'Cover Letter O-1',
  'resume-eb1a': 'Résumé EB-1A',
  'business-plan': 'Business Plan',
  'metodologia': 'Metodologia',
  'declaracao-intencoes': 'Declaração de Intenções',
  'localizacao': 'Análise de Localização',
  'impacto': 'IMPACTO®',
  'estrategia-eb1': 'Estratégia EB-1A',
  'estrategia-eb2': 'Estratégia EB-2 NIW',
  'satellite-letters': 'Cartas Satélite',
  'resume-eb2-niw': 'Résumé EB-2 NIW',
  'Résumé EB-2 NIW': 'Résumé EB-2 NIW',
  'anteprojeto': 'Anteprojeto',
};

export default function GeradorPage() {
  const [systems, setSystems] = useState<SystemVersion[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<SystemVersion | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [promptMetadata, setPromptMetadata] = useState<any>(null);
  const [claudeCommand, setClaudeCommand] = useState<string>('');
  const [promptPath, setPromptPath] = useState<string>('');
  const [commandCopied, setCommandCopied] = useState(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [executionStages, setExecutionStages] = useState<{ stage: string; message?: string; text?: string }[]>([]);
  const [executionResult, setExecutionResult] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/systems').then(r => r.json()),
      fetch('/api/clients').then(r => r.json()),
    ]).then(([sysRes, cliRes]) => {
      const sysData = Array.isArray(sysRes.data) ? sysRes.data : sysRes.data?.data || [];
      const cliData = Array.isArray(cliRes.data) ? cliRes.data : cliRes.data?.data || [];
      setSystems(sysData);
      setClients(cliData);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  function openGenModal(sys: SystemVersion) {
    setSelectedSystem(sys);
    setGeneratedPrompt('');
    setPromptMetadata(null);
    setError('');
    setGenerating(false);
    setCopied(false);
    setExecuting(false);
    setExecutionStages([]);
    setExecutionResult(null);
    setShowModal(true);
  }

  async function handleGenerate() {
    if (!selectedClient || !selectedSystem) return;
    setGenerating(true);
    setError('');
    setGeneratedPrompt('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: selectedClient,
          doc_type: SYSTEM_TO_ENUM[selectedSystem.system_name] || selectedSystem.system_name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Erro ao gerar prompt');
        return;
      }

      const result = json.data;
      setGeneratedPrompt(result.prompt);
      setPromptMetadata(result.metadata);
      setClaudeCommand(result.claude_command || '');
      setPromptPath(result.prompt_path || result.prompt_file || '');

      // AUTO-EXECUTE: call Claude Code automatically
      const pFile = result.prompt_path || result.prompt_file;
      if (pFile) {
        setGenerating(false);
        handleExecute(pFile, selectedClientData?.name || 'Cliente', SYSTEM_TO_ENUM[selectedSystem.system_name] || selectedSystem.system_name);
        return;
      }
    } catch (err: any) {
      setError(err.message || 'Erro de conexão');
    } finally {
      setGenerating(false);
    }
  }

  async function handleExecute(promptFile: string, clientName: string, docType: string) {
    setExecuting(true);
    setExecutionStages([]);
    setExecutionResult(null);

    try {
      const res = await fetch('/api/generate/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_file: promptFile, client_name: clientName, doc_type: docType }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value);
          const events = text.split('\n\n').filter(Boolean);

          for (const event of events) {
            try {
              const lines = event.split('\n');
              const eventLine = lines.find(l => l.startsWith('event:'));
              const dataLine = lines.find(l => l.startsWith('data:'));

              if (eventLine && dataLine) {
                const eventType = eventLine.replace('event: ', '');
                const data = JSON.parse(dataLine.replace('data: ', ''));

                if (eventType === 'complete') {
                  setExecutionResult(data);
                } else {
                  setExecutionStages(prev => [...prev, data]);
                }
              }
            } catch { /* parse error */ }
          }
        }
      }
    } catch (err: any) {
      setExecutionStages(prev => [...prev, { stage: 'error', message: `Erro de conexão: ${err.message}` }]);
    } finally {
      setExecuting(false);
    }
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = generatedPrompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  const selectedClientData = clients.find(c => c.id === selectedClient);
  const hasProfile = selectedClientData?.client_profiles?.extracted_at;

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 w-full animate-in fade-in duration-500 max-w-[1400px]">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="section-title text-[#e2e8f0] text-lg">Gerador de Prompts</h1>
      </div>

      <div className="bg-[#0a1320] border border-[rgba(0,234,255,0.06)] rounded-xl p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#00eaff]/10 to-transparent blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        
        <div className="flex flex-col gap-4 relative z-10">
          <label className="text-[10px] text-[#00eaff] font-mono uppercase tracking-widest font-bold flex items-center gap-2">
            <User className="w-4 h-4" /> Contexto do Cliente
          </label>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full max-w-2xl bg-[#080d16] border border-[rgba(0,234,255,0.2)] rounded-lg px-5 py-4 text-[#e2e8f0] text-lg font-mono outline-none focus:border-[#00eaff] focus:shadow-[0_0_20px_rgba(0,234,255,0.2)] transition-all cursor-pointer shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] appearance-none"
          >
            <option value="">-- SELECIONAR CLIENTE ALVO --</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} • Visa: {c.visa_type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedClient && !hasProfile && (
        <div className="bg-[#ffa502]/5 border border-[#ffa502]/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#ffa502] flex-shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <h4 className="text-[#ffa502] font-bold text-xs tracking-wide font-mono">SEM PERFIL EXTRAIDO</h4>
            <p className="text-[#ffa502]/70 text-[11px] font-mono">
              Geracao disponivel. O prompt usara apenas os documentos da pasta do cliente.
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex p-20 justify-center text-[#00eaff] font-mono"><Loader2 className="animate-spin mr-2" /> READING MODULES...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          {systems.map((sys) => (
            <div
              key={sys.id}
              onClick={() => selectedClient ? openGenModal(sys) : null}
              className={`p-6 relative overflow-hidden group transition-all ${selectedClient ? 'v2-card cursor-pointer' : 'bg-[#080d16] border border-[rgba(255,255,255,0.02)] rounded-xl opacity-50 cursor-not-allowed'}`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-50"><FileText className="w-16 h-16 text-[#ffffff05]" /></div>
              
              <div className="flex flex-col h-full relative z-10">
                <div className="w-10 h-10 rounded-lg bg-[#ffffff05] border border-[#ffffff0a] flex items-center justify-center mb-5 transition-colors group-hover:bg-[rgba(255,171,0,0.1)] group-hover:border-[rgba(255,171,0,0.3)]">
                  <Sparkles className="w-5 h-5 text-[#00eaff] group-hover:text-[#ffab00] transition-colors" />
                </div>
                
                <h3 className="text-[15px] font-bold text-[#e2e8f0] tracking-wide mb-1 leading-tight h-10">
                  {SYSTEM_LABELS[sys.system_name] || sys.system_name}
                </h3>
                
                <div className="flex flex-col gap-2 mt-auto pt-4 font-mono">
                  <div className="flex justify-between items-center text-[10px] text-[#4b6584]">
                    <span className="uppercase tracking-widest">Version</span>
                    <span className="text-[#a1b1cc]">v{sys.version_tag}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-[#4b6584]">
                    <span className="uppercase tracking-widest">Chunks</span>
                    <span className="text-[#a1b1cc]">{sys.file_count} read</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-[#4b6584] mt-2 pt-2 border-t border-[#ffffff0a]">
                    <span className="uppercase tracking-widest">Target</span>
                    <span className="text-[#00eaff] bg-[#00eaff]/10 px-2 py-0.5 rounded text-[9px] font-bold">PRO</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal - Basic rewrite using premium styles */}
      {showModal && selectedSystem && (
         <div className="fixed inset-0 bg-[#03060a]/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
             <div className={`bg-[#080d16] border border-[rgba(0,234,255,0.2)] shadow-[0_0_50px_rgba(0,234,255,0.15)] rounded-xl w-full ${generatedPrompt ? 'max-w-4xl' : 'max-w-xl'} max-h-[90vh] overflow-hidden flex flex-col transition-all duration-300`}>
                <div className="px-6 py-4 border-b border-[rgba(0,234,255,0.06)] flex justify-between items-center bg-[#0a1320]">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-[#00eaff] font-mono uppercase tracking-widest font-bold">Montagem do Prompt</span>
                        <h2 className="text-lg font-bold text-[#e2e8f0]">{SYSTEM_LABELS[selectedSystem.system_name] || selectedSystem.system_name}</h2>
                    </div>
                    <button onClick={() => setShowModal(false)} className="text-[#4b6584] hover:text-[#00eaff]"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {!generating && !generatedPrompt && !error && (
                        <div className="flex flex-col gap-6">
                            <div className="bg-[#101e30] border border-[rgba(0,234,255,0.1)] rounded-lg p-5 flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#0a1320] border border-[rgba(255,255,255,0.05)] rounded-full flex items-center justify-center"><User className="w-5 h-5 text-[#a1b1cc]" /></div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-[#e2e8f0]">{selectedClientData?.name}</span>
                                    <span className="text-xs font-mono text-[#4b6584]">{selectedClientData?.visa_type} {hasProfile ? '· Baseline OK' : '· Sem Baseline'}</span>
                                </div>
                            </div>

                            <button onClick={handleGenerate} className="w-full py-4 rounded-lg bg-[rgba(255,171,0,0.08)] border border-[rgba(255,171,0,0.3)] hover:bg-[#ffab00] hover:text-[#03060a] text-[#ffab00] font-mono font-bold tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,171,0,0.15)] hover:shadow-[0_0_40px_rgba(255,171,0,0.4)] group">
                                <Zap className="w-5 h-5 group-hover:scale-110" style={{ filter: 'drop-shadow(0 0 8px rgba(255,171,0,0.8))' }} /> INITIATE GENERATION
                            </button>
                        </div>
                    )}

                    {generating && (
                        <div className="flex flex-col items-center justify-center py-12 text-[#00eaff] font-mono gap-4">
                            <Loader2 className="w-10 h-10 animate-spin" />
                            <span className="tracking-widest uppercase text-xs">Aguarde... Engajando RAG</span>
                        </div>
                    )}

                    {error && (
                        <div className="p-5 border border-[#ff4757]/30 bg-[#ff4757]/10 rounded-lg">
                            <h4 className="text-[#ff4757] font-bold text-sm mb-2">ERRO:</h4>
                            <p className="font-mono text-xs text-[#ff4757]">{error}</p>
                            <button onClick={handleGenerate} className="mt-4 px-4 py-2 bg-[#ff4757]/20 border border-[#ff4757]/40 text-[#ff4757] font-mono text-xs uppercase rounded">Tentar de novo</button>
                        </div>
                    )}

                    {generatedPrompt && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Success header */}
                            <div style={{ textAlign: 'center', padding: '12px 0' }}>
                                <div style={{ color: '#22c55e', fontSize: '36px', marginBottom: '8px' }}>✓</div>
                                <h3 style={{ color: '#00eaff', fontSize: '18px', fontWeight: 700, margin: 0, textShadow: '0 0 10px rgba(0,234,255,0.3)' }}>
                                    PROMPT MONTADO COM SUCESSO
                                </h3>
                                <p style={{ color: '#4b6584', fontSize: '13px', margin: '4px 0 0' }}>
                                    {promptMetadata?.system || promptMetadata?.systemName} — {selectedClientData?.name}
                                </p>
                            </div>

                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                {[
                                    { label: 'Target', value: promptMetadata?.system || promptMetadata?.systemName || 'N/A', color: '#e2e8f0', size: '14px' },
                                    { label: 'Chunks', value: promptMetadata?.filesRead || promptMetadata?.files_read?.length || 0, color: '#e2e8f0', size: '20px' },
                                    { label: 'Rules', value: promptMetadata?.rulesApplied || promptMetadata?.rules_count || 0, color: '#e2e8f0', size: '20px' },
                                    { label: 'Tokens', value: `~${(promptMetadata?.estimatedTokens || promptMetadata?.estimated_tokens || 0).toLocaleString()}`, color: '#00eaff', size: '20px' },
                                ].map((s, i) => (
                                    <div key={i} style={{ background: '#0d1117', border: '1px solid rgba(0,234,255,0.15)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                                        <div style={{ color: '#4b6584', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
                                        <div style={{ color: s.color, fontSize: s.size, fontWeight: 700, fontFamily: 'monospace', marginTop: '4px' }}>{s.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* PIPELINE: 2 Phases Visual Indicator */}
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                              {(() => {
                                const phase1Done = executionStages.some((s: any) => s.stage === 'gen_complete');
                                const phase2Active = executionStages.some((s: any) => s.phase === 2);
                                const phase2Done = executionResult?.success;
                                return (
                                  <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', background: phase1Done ? 'rgba(34,197,94,0.1)' : executing ? 'rgba(0,234,255,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${phase1Done ? 'rgba(34,197,94,0.3)' : executing && !phase2Active ? 'rgba(0,234,255,0.3)' : 'rgba(255,255,255,0.06)'}`, transition: 'all 0.3s' }}>
                                      <Zap size={14} style={{ color: phase1Done ? '#22c55e' : '#00eaff' }} />
                                      <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '1px', color: phase1Done ? '#22c55e' : '#00eaff' }}>GERAÇÃO</span>
                                    </div>
                                    <div style={{ width: '24px', height: '2px', background: phase1Done ? 'linear-gradient(90deg, #22c55e, #a855f7)' : 'rgba(255,255,255,0.1)', borderRadius: '1px', transition: 'all 0.5s' }} />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', background: phase2Done ? 'rgba(168,85,247,0.1)' : phase2Active ? 'rgba(168,85,247,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${phase2Done ? 'rgba(168,85,247,0.4)' : phase2Active ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.06)'}`, transition: 'all 0.3s' }}>
                                      <Shield size={14} style={{ color: phase2Done ? '#a855f7' : phase2Active ? '#a855f7' : '#4b6584' }} />
                                      <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '1px', color: phase2Done ? '#a855f7' : phase2Active ? '#a855f7' : '#4b6584' }}>REVISÃO CRUZADA</span>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>

                            {/* Execution Progress */}
                            <div style={{ background: '#0d1117', border: '1px solid rgba(0,234,255,0.2)', borderRadius: '12px', padding: '20px' }}>
                                {/* Step 1 — Prompt saved */}
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>✓</div>
                                    <div>
                                        <div style={{ color: '#f5f5f5', fontSize: '14px', fontWeight: 600 }}>Prompt salvo automaticamente</div>
                                        <div style={{ color: '#4b6584', fontSize: '11px', marginTop: '2px', fontFamily: 'monospace', wordBreak: 'break-all' }}>{promptPath}</div>
                                    </div>
                                </div>

                                {/* Execution log — Phase 1 & Phase 2 stages */}
                                {executionStages.length > 0 && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                                    {executionStages.map((s: any, i: number) => {
                                      const isPhaseHeader = s.stage === 'phase';
                                      const isPhase2 = s.phase === 2;
                                      const isPersona = s.stage === 'review_persona';
                                      const isReviewComplete = s.stage === 'review_complete';
                                      const isGenComplete = s.stage === 'gen_complete';

                                      if (isPhaseHeader) {
                                        return (
                                          <div key={i} style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '2px', color: isPhase2 ? '#a855f7' : '#00eaff', textShadow: `0 0 10px ${isPhase2 ? 'rgba(168,85,247,0.5)' : 'rgba(0,234,255,0.5)'}`, padding: '8px 0 4px', borderTop: i > 0 ? `1px solid ${isPhase2 ? 'rgba(168,85,247,0.15)' : 'rgba(0,234,255,0.1)'}` : 'none', marginTop: i > 0 ? '8px' : '0' }}>
                                            {isPhase2 ? '🔬' : '⚡'} {s.message}
                                          </div>
                                        );
                                      }

                                      return (
                                        <div key={i} style={{ fontSize: '12px', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px', color: isReviewComplete || isGenComplete ? '#22c55e' : isPersona ? '#c084fc' : s.stage === 'error' ? '#ef4444' : isPhase2 ? '#a1b1cc' : '#64748b', paddingLeft: isPersona ? '12px' : '0' }}>
                                          <span>{isReviewComplete || isGenComplete ? '✓' : isPersona ? '👁' : s.stage === 'error' ? '✗' : '→'}</span>
                                          <span>{s.message || (s as any).text?.slice(0, 120)}</span>
                                        </div>
                                      );
                                    })}
                                    {executing && (
                                      <div style={{ fontSize: '12px', color: '#00eaff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span> Processando...
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Final Result — with SoC review summary */}
                                {executionResult?.success && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {/* Review Verdict */}
                                    <div style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: '10px', padding: '16px' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <Shield size={18} style={{ color: '#a855f7', filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.6))' }} />
                                          <span style={{ color: '#a855f7', fontSize: '12px', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '2px' }}>SEPARATION OF CONCERNS</span>
                                        </div>
                                        <span style={{ color: executionResult.review_summary?.blocking > 0 ? '#ef4444' : executionResult.review_summary?.score >= 90 ? '#22c55e' : '#eab308', fontSize: '12px', fontFamily: 'monospace', fontWeight: 700, padding: '3px 10px', borderRadius: '6px', background: executionResult.review_summary?.blocking > 0 ? 'rgba(239,68,68,0.1)' : executionResult.review_summary?.score >= 90 ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)', border: `1px solid ${executionResult.review_summary?.blocking > 0 ? 'rgba(239,68,68,0.3)' : executionResult.review_summary?.score >= 90 ? 'rgba(34,197,94,0.3)' : 'rgba(234,179,8,0.3)'}` }}>
                                          {executionResult.review_verdict}
                                        </span>
                                      </div>

                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                                        {[
                                          { label: 'Score', value: `${executionResult.review_summary?.score || 0}/100`, color: '#a855f7' },
                                          { label: 'Bloqueantes', value: executionResult.review_summary?.blocking || 0, color: executionResult.review_summary?.blocking > 0 ? '#ef4444' : '#22c55e' },
                                          { label: 'Criticos', value: executionResult.review_summary?.critical || 0, color: '#ef4444' },
                                          { label: 'Altos', value: executionResult.review_summary?.high || 0, color: '#eab308' },
                                          { label: 'Medios', value: executionResult.review_summary?.medium || 0, color: '#a1b1cc' },
                                        ].map((item, i) => (
                                          <div key={i} style={{ textAlign: 'center', padding: '8px 4px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
                                            <div style={{ fontSize: '9px', color: '#4b6584', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase' }}>{item.label}</div>
                                            <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'monospace', color: item.color, marginTop: '2px' }}>{item.value}</div>
                                          </div>
                                        ))}
                                      </div>

                                      <div style={{ marginTop: '10px', display: 'flex', gap: '8px', fontSize: '10px', fontFamily: 'monospace', color: '#4b6584' }}>
                                        <span>4 personas</span>
                                        <span>|</span>
                                        <span>{((executionResult.phases?.review?.tokens || 0) / 1000).toFixed(0)}K tokens</span>
                                        <span>|</span>
                                        <span>{executionResult.phases?.review?.duration || 0}s</span>
                                      </div>
                                    </div>

                                    {/* Document saved */}
                                    <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                      <div style={{ color: '#22c55e', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Check size={16} /> Documento REVISADO salvo na pasta do cliente
                                      </div>
                                      <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#4b6584' }}>
                                        DOCX: {executionResult.docx_reviewed?.split('/').pop() || 'documento_REVIEWED.docx'}
                                      </div>
                                      <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#4b6584' }}>
                                        Relatorio: {executionResult.review_report?.split('/').pop() || 'REVIEW_REPORT.md'}
                                      </div>
                                      <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#4b6584', marginTop: '4px' }}>
                                        Total: {((executionResult.tokens_used || 0) / 1000).toFixed(0)}K tokens | {executionResult.duration_seconds || 0}s
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Fallback: manual command (only on failure) */}
                                {executionResult && !executionResult.success && claudeCommand && (
                                  <div style={{ marginTop: '12px' }}>
                                    <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '6px' }}>Comando manual (fallback):</div>
                                    <div
                                      onClick={() => { navigator.clipboard.writeText(claudeCommand); setCommandCopied(true); setTimeout(() => setCommandCopied(false), 2000); }}
                                      style={{ background: '#000', border: '1px solid rgba(255,171,0,0.4)', borderRadius: '8px', padding: '10px 14px', fontFamily: 'monospace', fontSize: '12px', color: '#ffab00', textShadow: '0 0 10px rgba(255,171,0,0.3)', cursor: 'pointer', wordBreak: 'break-all', transition: 'all 0.3s' }}
                                    >
                                      <span style={{ opacity: 0.5 }}>$ </span>{claudeCommand}
                                    </div>
                                    <div style={{ color: '#ffab00', fontSize: '11px', marginTop: '4px', opacity: 0.8 }}>Clique para copiar → Cole no terminal do Claude Code</div>
                                  </div>
                                )}
                            </div>

                            {/* Collapsible prompt */}
                            <details style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                                <summary style={{ padding: '12px 16px', cursor: 'pointer', color: '#4b6584', fontSize: '13px', listStyle: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <ChevronRight size={14} style={{ transition: 'transform 0.2s' }} />
                                    Visualizar Prompt Cru ({(promptMetadata?.estimatedTokens || promptMetadata?.estimated_tokens || 0).toLocaleString()} tokens)
                                </summary>
                                <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', maxHeight: '300px', overflow: 'auto', position: 'relative' }}>
                                    <pre style={{ fontFamily: 'monospace', fontSize: '11px', color: '#64748b', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>{generatedPrompt}</pre>
                                    <button onClick={copyPrompt} style={{ position: 'absolute', top: '20px', right: '20px', background: copied ? 'rgba(34,197,94,0.15)' : '#101e30', border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`, color: copied ? '#22c55e' : '#a1b1cc', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer', fontFamily: 'monospace' }}>
                                        {copied ? '✓ Copiado' : 'Copiar'}
                                    </button>
                                </div>
                            </details>

                            {/* Close */}
                            <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#4b6584', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', alignSelf: 'center' }}>
                                Fechar
                            </button>
                        </div>
                    )}
                </div>
             </div>
         </div>
      )}
    </div>
  );
}
