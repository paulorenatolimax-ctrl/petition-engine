'use client';

import { useEffect, useState } from 'react';
import { FileText, Zap, Copy, Check, X, ChevronRight, AlertTriangle, User, Loader2, Sparkles, AlertCircle } from 'lucide-react';

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
      setPromptPath(result.prompt_path || '');
    } catch (err: any) {
      setError(err.message || 'Erro de conexão');
    } finally {
      setGenerating(false);
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
        <div className="bg-[#ff4757]/10 border border-[#ff4757]/30 rounded-xl p-5 flex items-start gap-4 shadow-[0_0_20px_rgba(255,71,87,0.1)]">
          <AlertCircle className="w-6 h-6 text-[#ff4757] flex-shrink-0 animate-pulse" />
          <div className="flex flex-col gap-1">
            <h4 className="text-[#ff4757] font-bold text-sm tracking-wide">PERFIL NÃO EXTRAÍDO</h4>
            <p className="text-[#ff4757] opacity-80 text-xs font-mono">
              O prompt será gerado sem baselines ricas. Execute a extração de perfil no painel de clientes primeiro.
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
              className={`p-6 rounded-xl border ${selectedClient ? 'bg-[#0a1320] border-[rgba(0,234,255,0.06)] hover:border-[rgba(0,234,255,0.4)] hover:shadow-[0_0_30px_rgba(0,234,255,0.15)] cursor-pointer' : 'bg-[#080d16] border-[rgba(255,255,255,0.02)] opacity-50 cursor-not-allowed'} relative overflow-hidden transition-all group`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-50"><FileText className="w-16 h-16 text-[#ffffff05]" /></div>
              
              <div className="flex flex-col h-full relative z-10">
                <div className="w-10 h-10 rounded-lg bg-[#ffffff05] border border-[#ffffff0a] flex items-center justify-center mb-5 group-hover:bg-[#00eaff]/10 group-hover:border-[#00eaff]/30 transition-colors">
                  <Sparkles className="w-5 h-5 text-[#00eaff]" />
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

                            <button onClick={handleGenerate} className="w-full py-4 rounded-lg bg-[rgba(0,234,255,0.1)] border border-[rgba(0,234,255,0.3)] hover:bg-[#00eaff] hover:text-[#03060a] text-[#00eaff] font-mono font-bold tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,234,255,0.1)] group">
                                <Zap className="w-5 h-5 group-hover:scale-110" /> INITIATE GENERATION
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
                        <div className="flex flex-col gap-4">
                            {/* Stats */}
                            <div className="grid grid-cols-4 gap-3">
                                <div className="bg-[rgba(0,234,255,0.05)] border border-[rgba(0,234,255,0.15)] rounded-lg p-4 text-center">
                                    <div className="text-[10px] text-[#00eaff] font-mono uppercase tracking-widest font-bold">Target Context</div>
                                    <div className="text-xl md:text-2xl font-black font-mono text-[#e2e8f0] mt-2 v2-kpi">{promptMetadata?.system || promptMetadata?.systemName || 'N/A'}</div>
                                </div>
                                <div className="bg-[rgba(0,234,255,0.05)] border border-[rgba(0,234,255,0.15)] rounded-lg p-4 text-center">
                                    <div className="text-[10px] text-[#00eaff] font-mono uppercase tracking-widest font-bold">Chunks Read</div>
                                    <div className="text-xl md:text-2xl font-black font-mono text-[#e2e8f0] mt-2 v2-kpi">{promptMetadata?.filesRead || promptMetadata?.files_read?.length || 0}</div>
                                </div>
                                <div className="bg-[rgba(0,234,255,0.05)] border border-[rgba(0,234,255,0.15)] rounded-lg p-4 text-center">
                                    <div className="text-[10px] text-[#00eaff] font-mono uppercase tracking-widest font-bold">Rules</div>
                                    <div className="text-xl md:text-2xl font-black font-mono text-[#e2e8f0] mt-2 v2-kpi">{promptMetadata?.rulesApplied || promptMetadata?.rules_count || 0}</div>
                                </div>
                                <div className="bg-[rgba(0,234,255,0.05)] border border-[rgba(0,234,255,0.15)] rounded-lg p-4 text-center">
                                    <div className="text-[10px] text-[#00eaff] font-mono uppercase tracking-widest font-bold">Tokens</div>
                                    <div className="text-xl md:text-2xl font-black font-mono text-[#00eaff] mt-2 v2-kpi">~{(promptMetadata?.estimatedTokens || promptMetadata?.estimated_tokens || 0).toLocaleString()}</div>
                                </div>
                            </div>

                            {/* Button Claude Code */}
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(claudeCommand);
                                    setCommandCopied(true);
                                    setTimeout(() => setCommandCopied(false), 3000);
                                }}
                                className={`w-full py-5 mt-2 rounded-xl border font-mono font-bold tracking-widest flex items-center justify-center gap-3 transition-all ${commandCopied ? 'bg-[#2ed573]/20 border-[#2ed573] text-[#2ed573] shadow-[0_0_20px_rgba(46,213,115,0.4)]' : 'bg-[#00eaff]/10 border-[#00eaff]/30 text-[#00eaff] hover:bg-[#00eaff] hover:text-[#03060a] shadow-[0_0_20px_rgba(0,234,255,0.2)] hover:shadow-[0_0_30px_rgba(0,234,255,0.6)]'}`}
                            >
                                <Zap className="w-5 h-5" /> 
                                {commandCopied ? 'COMANDO COPIADO PARA O CLIPBOARD!' : '⚡ PROMPT SALVO — COPIAR COMANDO CLAUDE CODE'}
                            </button>

                            {/* Collapsible: ver prompt completo */}
                            <details className="mt-2 group">
                                <summary className="text-[#a1b1cc] font-mono text-xs cursor-pointer flex items-center gap-2 hover:text-[#00eaff] transition-colors p-3 rounded-lg hover:bg-[#ffffff05] outline-none">
                                    <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                                    Visualizar Prompt Cru ({(promptMetadata?.estimatedTokens || promptMetadata?.estimated_tokens || 0).toLocaleString()} tokens)
                                </summary>
                                <div className="mt-2 relative">
                                    <textarea
                                        readOnly
                                        value={generatedPrompt}
                                        className="w-full h-[250px] bg-[#03060a] border border-[#ffffff10] rounded-xl p-5 font-mono text-[11px] text-[#4b6584] outline-none resize-none focus:border-[#00eaff]/30 focus:shadow-[0_0_15px_rgba(0,234,255,0.1)] transition-all"
                                    />
                                    <button
                                        onClick={copyPrompt}
                                        className="absolute top-4 right-4 bg-[#101e30] border border-[#ffffff10] text-[#a1b1cc] rounded-md px-3 py-1.5 text-[10px] font-mono hover:text-[#00eaff] hover:border-[#00eaff]/30 transition-all flex items-center gap-2 shadow-lg"
                                    >
                                        {copied ? <Check className="w-3 h-3 text-[#2ed573]"/> : <Copy className="w-3 h-3"/>}
                                        {copied ? 'COPIADO' : 'COPIAR RAW'}
                                    </button>
                                </div>
                            </details>
                        </div>
                    )}
                </div>
             </div>
         </div>
      )}
    </div>
  );
}
