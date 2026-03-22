'use client';

import { useEffect, useState } from 'react';
import { Users, FileText, Layers, CheckCircle2, AlertCircle, Database, ShieldAlert, FileOutput } from 'lucide-react';

interface DashboardStats {
  clients: { total: number; active: number; by_visa: Record<string, number> };
  documents: { total: number; generated_today: number; quality_pass_rate: number };
  systems: { total: number; active: number };
  errors: { total_rules: number; triggered_today: number };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(json => setStats(json.data || json))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const s = stats || {
    clients: { total: 0, active: 0, by_visa: {} },
    documents: { total: 0, generated_today: 0, quality_pass_rate: 0 },
    systems: { total: 0, active: 0 },
    errors: { total_rules: 0, triggered_today: 0 },
  };

  const statValues = [
    { key: 'clients', label: 'Clientes Ativos', value: s.clients.active, suffix: '', icon: Users, color: '#2dd4bf' },
    { key: 'docs', label: 'Documentos Gerados', value: s.documents.total, suffix: '', icon: FileText, color: '#8b5cf6' },
    { key: 'sys', label: 'Sistemas Ativos', value: s.systems.active, suffix: '', icon: Layers, color: '#00eaff' },
    { key: 'qual', label: 'Taxa de Qualidade', value: s.documents.quality_pass_rate ?? 0, suffix: '%', icon: CheckCircle2, color: '#2ed573' },
  ];

  const visaTypes = Object.entries(s.clients.by_visa || {});

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 w-full animate-in fade-in duration-500 max-w-[1400px]">
      <div className="flex flex-col gap-1 mb-4">
        <h1 className="section-title v2-section-header text-[#e2e8f0] text-lg w-max">Dashboard</h1>
        <p className="text-[#a1b1cc] font-mono text-xs">Visão geral do Petition Engine</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {statValues.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.key} className="v2-card overflow-hidden group hover:-translate-y-1 transition-transform cursor-default" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="p-5 flex flex-col h-full bg-[#0a1320] rounded-xl relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-[11px] uppercase tracking-[2px] font-bold text-[#4b6584] group-hover:text-[#a1b1cc] transition-colors">{stat.label}</div>
                  <div className="w-8 h-8 rounded-lg bg-[#ffffff05] border border-[#ffffff0a] flex items-center justify-center group-hover:bg-[#00eaff10] group-hover:border-[#00eaff30] transition-colors">
                    <Icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="text-[36px] font-black font-mono tracking-tight text-[#e2e8f0] drop-shadow-md group-hover:text-white v2-kpi transition-all">
                    {loading ? '--' : `${stat.value}${stat.suffix}`}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Visa Chart */}
        <div className="v2-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00eaff] opacity-[0.02] blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:opacity-[0.04] transition-opacity" />
          <h2 className="section-title v2-section-header text-[#e2e8f0] mb-6 w-max">Clientes por Visto</h2>
          
          <div className="flex flex-col gap-6 relative z-10 max-h-[250px] overflow-y-auto pr-2">
            {loading ? (
               <div className="text-center text-[#4b6584] py-8 text-xs font-mono">CARREGANDO DADOS...</div>
            ) : visaTypes.length === 0 ? (
               <div className="text-center text-[#4b6584] py-8 text-xs font-mono">NENHUM CLIENTE CADASTRADO</div>
            ) : (
               visaTypes.map(([visa, count]) => {
                const colors: Record<string, string> = { 'EB-1A': '#f59e0b', 'EB-2-NIW': '#8b5cf6', 'O-1': '#06b6d4', 'L-1': '#ec4899', 'EB-1C': '#10b981' };
                const pct = s.clients.total > 0 ? ((count as number) / s.clients.total * 100) : 0;
                return (
                  <div key={visa} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="font-bold tracking-wider" style={{ color: colors[visa] || '#00eaff' }}>{visa}</span>
                      <span className="text-[#a1b1cc]">{count as number}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#101e30] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${pct}%`, backgroundColor: colors[visa] || '#00eaff', boxShadow: `0 0 10px ${colors[visa] || '#00eaff'}80` }}>
                        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Engine Status */}
        <div className="v2-card p-6 relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8b5cf6] opacity-[0.02] blur-3xl rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none group-hover:opacity-[0.04] transition-opacity" />
          <h2 className="section-title v2-section-header text-[#e2e8f0] mb-6 w-max">Status do Motor</h2>
          
          <div className="grid grid-cols-2 gap-4 relative z-10">
            {[
              { label: 'Total Clientes', value: s.clients.total, icon: Database, color: '#a1b1cc', glow: 'rgba(161, 177, 204, 0.2)' },
              { label: 'Documentos Hoje', value: s.documents.generated_today, icon: FileOutput, color: '#00eaff', glow: 'rgba(0, 234, 255, 0.4)' },
              { label: 'Regras de Erro', value: s.errors.total_rules, icon: ShieldAlert, color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)' },
              { label: 'Erros Hoje', value: s.errors.triggered_today, icon: AlertCircle, color: s.errors.triggered_today > 0 ? '#ff4757' : '#2ed573', glow: s.errors.triggered_today > 0 ? 'rgba(255, 71, 87, 0.4)' : 'rgba(46, 213, 115, 0.4)' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-[#101e30] border border-[#ffffff0a] rounded-lg p-4 flex flex-col gap-3 hover:bg-[#132438] hover:border-[#ffffff15] transition-colors">
                  <div className="flex items-center gap-2 text-[#4b6584]">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">{item.label}</span>
                  </div>
                  <div className="text-2xl font-mono font-bold" style={{ color: item.color, textShadow: `0 0 15px ${item.glow}` }}>
                    {loading ? '--' : item.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
