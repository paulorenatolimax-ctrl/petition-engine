'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Mail, Briefcase, FileSignature, AlertCircle, RefreshCw, X, FolderOpen, Trash2 } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  visa_type: string;
  status: string;
  company_name: string;
  created_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client_profiles?: any;
}

const VISA_COLORS: Record<string, string> = {
  'EB-1A': '#f59e0b',
  'EB-2-NIW': '#8b5cf6',
  'O-1': '#06b6d4',
  'L-1': '#ec4899',
  'EB-1C': '#10b981',
};

const STATUS_MAP: Record<string, { label: string; color: string; border: string }> = {
  active: { label: 'ATIVO', color: '#00eaff', border: 'rgba(0,234,255,0.3)' },
  completed: { label: 'CONCLUÍDO', color: '#2ed573', border: 'rgba(46,213,115,0.3)' },
  on_hold: { label: 'ESPERA', color: '#ffa502', border: 'rgba(255,165,2,0.3)' },
  cancelled: { label: 'CANCELADO', color: '#ff4757', border: 'rgba(255,71,87,0.3)' },
};

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterVisa, setFilterVisa] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '', email: '', visa_type: 'EB-2-NIW', company_name: '', docs_folder_path: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchClients(); }, [filterVisa, search]);

  async function fetchClients() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterVisa) params.set('visa_type', filterVisa);
      const res = await fetch(`/api/clients?${params.toString()}`);
      const json = await res.json();
      const data = json.data;
      setClients(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Excluir ${name}? Esta acao nao pode ser desfeita.`)) return;
    try {
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      if (res.ok) fetchClients();
    } catch (err) {
      console.error('Erro ao excluir:', err);
    }
  }

  async function handleCreate() {
    if (!newClient.name.trim()) { setSaveError('Nome e obrigatorio'); return; }
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });
      const json = await res.json();
      if (!res.ok) {
        setSaveError(json.error || `Erro ${res.status}: falha ao salvar cliente`);
        return;
      }
      setShowNewModal(false);
      setSaveError('');
      setNewClient({ name: '', email: '', visa_type: 'EB-2-NIW', company_name: '', docs_folder_path: '' });
      fetchClients();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setSaveError(`Erro de conexao: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = "w-full bg-[#101e30] border border-[rgba(0,234,255,0.06)] rounded-lg px-4 py-2.5 text-[#e2e8f0] text-sm outline-none focus:border-[rgba(0,234,255,0.4)] focus:shadow-[0_0_15px_rgba(0,234,255,0.15)] transition-all font-mono";

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 w-full animate-in fade-in duration-500 max-w-[1400px]">
      <div className="flex justify-between items-end mb-4">
        <div className="flex flex-col gap-1">
          <h1 className="section-title v2-section-header text-[#e2e8f0] text-lg w-max">Pessoas & Entidades</h1>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="relative group overflow-hidden bg-[#101e30] border border-[rgba(0,234,255,0.2)] rounded-lg px-5 py-2.5 text-[#00eaff] text-xs font-mono font-bold tracking-widest uppercase hover:text-[#03060a] transition-colors"
        >
          <div className="absolute inset-0 bg-[#00eaff] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative z-10 flex items-center gap-2">
            <span>+</span> Novo Cliente
          </span>
        </button>
      </div>

      <div className="flex gap-4 items-center bg-[#0a1320] p-3 rounded-xl border border-[rgba(0,234,255,0.06)]">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4b6584]" />
          <input
            type="text"
            placeholder="Search query..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none outline-none pl-11 pr-4 py-2 text-[#e2e8f0] text-sm font-mono placeholder:text-[#4b6584]"
          />
        </div>
        <div className="w-px h-6 bg-[rgba(0,234,255,0.1)]" />
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4b6584] pointer-events-none" />
          <select
            value={filterVisa}
            onChange={(e) => setFilterVisa(e.target.value)}
            className="appearance-none bg-transparent border-none outline-none pl-11 pr-10 py-2 text-[#a1b1cc] text-sm font-mono uppercase tracking-widest cursor-pointer hover:text-[#00eaff] transition-colors"
          >
            <option value="" className="bg-[#0a1320]">ANY VISA</option>
            <option value="EB-1A" className="bg-[#0a1320]">EB-1A</option>
            <option value="EB-2-NIW" className="bg-[#0a1320]">EB-2 NIW</option>
            <option value="O-1" className="bg-[#0a1320]">O-1</option>
            <option value="L-1" className="bg-[#0a1320]">L-1</option>
            <option value="EB-1C" className="bg-[#0a1320]">EB-1C</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20 text-[#00eaff] font-mono text-sm tracking-widest">
          <RefreshCw className="w-5 h-5 animate-spin mr-3" />
          SCANNING DB...
        </div>
      ) : clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 bg-[#0a1320] border border-[rgba(0,234,255,0.06)] rounded-xl">
          <AlertCircle className="w-12 h-12 text-[#4b6584] mb-4" />
          <h3 className="text-[#a1b1cc] font-mono text-sm tracking-widest uppercase mb-1">Database Vazio</h3>
          <p className="text-[#4b6584] text-xs">Ajuste os filtros ou crie um novo registro.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {clients.map((client, i) => {
            const status = STATUS_MAP[client.status] || STATUS_MAP.on_hold;
            const clientColor = VISA_COLORS[client.visa_type] || '#00eaff';
            return (
              <Link
                key={client.id}
                href={`/clientes/${client.id}`}
                className="group relative v2-card p-5 animate-in fade-in flex items-center gap-6 cursor-pointer overflow-hidden"
                style={{ animationDelay: `${i * 0.05}s`, borderLeft: `2px solid ${clientColor}` }}
              >
                <div className="absolute inset-0 to-transparent opacity-0 group-hover:opacity-[0.08] transition-opacity pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, ${clientColor}, transparent)` }} />
                
                <div className="flex-1 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-[#101e30] border flex items-center justify-center text-lg font-black font-mono transition-transform group-hover:scale-110" style={{ color: clientColor, borderColor: `${clientColor}40`, filter: `drop-shadow(0 0 8px ${clientColor}80)` }}>
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-[16px] font-bold text-[#e2e8f0] tracking-wide">{client.name}</h3>
                    <div className="flex items-center gap-4 text-[12px] font-mono text-[#4b6584]">
                      {client.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{client.email}</span>}
                      {client.company_name && <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{client.company_name}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-md border border-[rgba(255,255,255,0.05)] bg-[#101e30] flex items-center gap-2">
                    <FileSignature className="w-3 h-3 text-[rgba(255,255,255,0.4)]" />
                    <span className="text-[11px] font-mono tracking-widest font-bold" style={{ color: VISA_COLORS[client.visa_type] || '#00eaff' }}>
                      {client.visa_type}
                    </span>
                  </div>

                  <div className="px-3 py-1 rounded-full border bg-[#03060a] flex items-center gap-2" style={{ borderColor: status.border }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.color, boxShadow: `0 0 10px ${status.color}` }} />
                    <span className="text-[10px] font-mono tracking-widest font-bold" style={{ color: status.color }}>
                      {status.label}
                    </span>
                  </div>

                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(client.id, client.name); }}
                    className="p-2 rounded-lg text-[#4b6584] hover:text-[#ff4757] hover:bg-[#ff4757]/10 transition-all opacity-0 group-hover:opacity-100"
                    title="Excluir cliente"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Novo Cliente Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-[#03060a]/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowNewModal(false); }}>
          <div className="bg-[#080d16] border border-[rgba(0,234,255,0.2)] shadow-[0_0_50px_rgba(0,234,255,0.1)] rounded-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-[rgba(0,234,255,0.06)] flex justify-between items-center bg-[#0a1320]">
              <h2 className="section-title v2-section-header text-lg font-bold w-max">Novo Cliente</h2>
              <button onClick={() => { setShowNewModal(false); setSaveError(''); }} className="text-[#4b6584] hover:text-[#00eaff] transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-5">
                {/* Erro visivel */}
                {saveError && (
                  <div className="bg-[#ff4757]/10 border border-[#ff4757]/30 rounded-lg px-4 py-3 flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-[#ff4757] flex-shrink-0" />
                    <span className="text-[#ff4757] text-xs font-mono">{saveError}</span>
                  </div>
                )}

                {/* Nome * */}
                <div>
                    <label className="text-[10px] text-[#00eaff] font-mono uppercase tracking-widest block mb-2 font-bold">Nome completo *</label>
                    <input type="text" placeholder="Nome do peticionario" value={newClient.name} onChange={(e) => { setNewClient({ ...newClient, name: e.target.value }); setSaveError(''); }} className={inputStyle} autoFocus />
                </div>

                {/* Tipo de Visto * */}
                <div>
                    <label className="text-[10px] text-[#00eaff] font-mono uppercase tracking-widest block mb-2 font-bold">Tipo de visto *</label>
                    <select value={newClient.visa_type} onChange={(e) => setNewClient({ ...newClient, visa_type: e.target.value })} className={inputStyle}>
                      <option value="EB-1A">EB-1A (Extraordinary Ability)</option>
                      <option value="EB-2-NIW">EB-2 NIW (National Interest Waiver)</option>
                      <option value="O-1">O-1 (Extraordinary Ability)</option>
                      <option value="L-1">L-1 (Intracompany Transfer)</option>
                      <option value="EB-1C">EB-1C (Multinational Manager)</option>
                    </select>
                </div>

                {/* Pasta dos Documentos * */}
                <div>
                    <label className="text-[10px] text-[#00eaff] font-mono uppercase tracking-widest block mb-2 font-bold flex items-center gap-2">
                      <FolderOpen className="w-3.5 h-3.5" /> Pasta dos documentos *
                    </label>
                    <input type="text" placeholder="/Users/paulo1844/Documents/_PROEX/_2. MEUS CASOS/2026/Nome/" value={newClient.docs_folder_path} onChange={(e) => setNewClient({ ...newClient, docs_folder_path: e.target.value })} className={inputStyle} />
                    <p className="text-[9px] text-[#4b6584] font-mono mt-1.5">Caminho absoluto. Documentos gerados serao salvos aqui.</p>
                </div>

                {/* Separador — Opcionais */}
                <div className="flex items-center gap-3 mt-1">
                  <div className="h-px flex-1 bg-[rgba(0,234,255,0.08)]" />
                  <span className="text-[9px] text-[#4b6584] font-mono tracking-widest uppercase">Opcionais</span>
                  <div className="h-px flex-1 bg-[rgba(0,234,255,0.08)]" />
                </div>

                {/* Email + Empresa (opcionais) */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] text-[#4b6584] font-mono uppercase tracking-widest block mb-2 font-bold">Email</label>
                        <input type="email" placeholder="email@exemplo.com" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} className={inputStyle} />
                    </div>
                    <div>
                        <label className="text-[10px] text-[#4b6584] font-mono uppercase tracking-widest block mb-2 font-bold">Empresa</label>
                        <input type="text" placeholder="Nome da empresa LLC" value={newClient.company_name} onChange={(e) => setNewClient({ ...newClient, company_name: e.target.value })} className={inputStyle} />
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 border-t border-[rgba(0,234,255,0.06)] bg-[#0a1320] flex justify-end gap-3">
              <button onClick={() => { setShowNewModal(false); setSaveError(''); }} className="px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-widest text-[#4b6584] hover:text-white transition-colors border border-transparent hover:border-[#ffffff10] bg-transparent">CANCELAR</button>
              <button
                onClick={handleCreate}
                disabled={!newClient.name.trim() || saving}
                className="px-6 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-widest bg-[#00eaff]/10 text-[#00eaff] border border-[#00eaff]/30 hover:bg-[#00eaff] hover:text-[#03060a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,234,255,0.2)]"
              >
                {saving ? 'SALVANDO...' : 'COMMIT ->'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
