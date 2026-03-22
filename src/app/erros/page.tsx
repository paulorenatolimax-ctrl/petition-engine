'use client';

import { useEffect, useState } from 'react';
import {
  Shield,
  AlertCircle,
  AlertTriangle,
  CircleDot,
  Filter,
  Power,
  Bot,
  User,
} from 'lucide-react';

interface ErrorRule {
  id: string;
  rule_type: string;
  doc_type?: string;
  rule_description: string;
  rule_pattern?: string;
  rule_action: string;
  severity: string;
  source: string;
  active: boolean;
  times_triggered: number;
  created_at: string;
}

const SEVERITY_ICON: Record<string, { icon: React.ElementType; color: string; glow: string }> = {
  critical: { icon: CircleDot, color: '#ff4757', glow: 'rgba(255,71,87,0.5)' },
  high: { icon: AlertTriangle, color: '#ffa502', glow: 'rgba(255,165,2,0.5)' },
  medium: { icon: AlertCircle, color: '#eccc68', glow: 'rgba(236,204,104,0.5)' },
  low: { icon: CircleDot, color: '#a1b1cc', glow: 'rgba(161,177,204,0.5)' },
};

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  block: { label: 'BLOCK', color: '#ff4757' },
  warn: { label: 'WARN', color: '#ffa502' },
  auto_fix: { label: 'AUTO-FIX', color: '#00eaff' },
};

const TYPE_OPTIONS = ['forbidden_term', 'formatting', 'content', 'logic', 'legal', 'terminology', 'visual'];
const SEVERITY_OPTIONS = ['critical', 'high', 'medium', 'low'];

export default function ErrosPage() {
  const [rules, setRules] = useState<ErrorRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [activeOnly, setActiveOnly] = useState(true);

  const fetchRules = () => {
    const params = new URLSearchParams();
    if (typeFilter) params.set('rule_type', typeFilter);
    if (severityFilter) params.set('severity', severityFilter);
    params.set('active', String(activeOnly));
    fetch(`/api/errors?${params}`)
      .then(r => r.json())
      .then(d => setRules(d.data || []))
      .catch(() => setRules([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    fetchRules();
  }, [typeFilter, severityFilter, activeOnly]);

  const toggleRule = async (id: string, active: boolean) => {
    await fetch(`/api/errors/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    });
    fetchRules();
  };

  const totalTriggers = rules.reduce((s, r) => s + r.times_triggered, 0);
  const criticalCount = rules.filter(r => r.severity === 'critical').length;
  const autoCount = rules.filter(r => r.source !== 'manual').length;
  const manualCount = rules.filter(r => r.source === 'manual').length;

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 w-full animate-in fade-in duration-500 max-w-[1400px]">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="section-title v2-section-header text-[#e2e8f0] text-lg w-max">Regras de Erro</h1>
        <p className="text-[#a1b1cc] font-mono text-xs mt-2">Sistema de auto-aprendizado · O Engine incorpora novas restrições</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[
          { label: 'Regras Ativas', value: rules.length, color: '#00eaff', glow: 'rgba(0,234,255,0.2)' },
          { label: 'Disparos Engine', value: totalTriggers, color: '#8b5cf6', glow: 'rgba(139,92,246,0.2)' },
          { label: 'Falhas Críticas', value: criticalCount, color: '#ff4757', glow: 'rgba(255,71,87,0.2)' },
          { label: 'Fontes: AI / HUMANO', value: `${autoCount} / ${manualCount}`, color: '#a1b1cc', glow: 'rgba(161,177,204,0.2)' }
        ].map((stat, i) => (
          <div key={i} className="v2-card relative overflow-hidden group hover:-translate-y-1 transition-transform cursor-default p-5 flex flex-col justify-between" style={{ borderLeft: `2px solid ${stat.color}` }}>
             <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10" style={{ backgroundColor: stat.color }} />
             <span className="text-[10px] text-[#4b6584] font-mono tracking-[2px] font-bold uppercase z-10">{stat.label}</span>
             <span className="text-3xl font-black font-mono text-[#e2e8f0] z-10 mt-2 tracking-tight group-hover:text-white transition-colors v2-kpi" style={{ textShadow: `0 0 15px ${stat.glow}` }}>{loading ? '--' : stat.value}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-4 items-center bg-[#0a1320] p-3 rounded-xl border border-[rgba(0,234,255,0.06)]">
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4b6584] pointer-events-none" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none bg-transparent border-none outline-none pl-10 pr-10 py-2 text-[#a1b1cc] text-xs font-mono uppercase tracking-widest cursor-pointer hover:text-[#00eaff] transition-colors"
          >
            <option value="" className="bg-[#0a1320]">ANY TYPE</option>
            {TYPE_OPTIONS.map(t => <option key={t} value={t} className="bg-[#0a1320]">{t}</option>)}
          </select>
        </div>
        <div className="w-px h-6 bg-[rgba(0,234,255,0.1)]" />
        <div className="relative">
          <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4b6584] pointer-events-none" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="appearance-none bg-transparent border-none outline-none pl-10 pr-10 py-2 text-[#a1b1cc] text-xs font-mono uppercase tracking-widest cursor-pointer hover:text-[#00eaff] transition-colors"
          >
            <option value="" className="bg-[#0a1320]">ANY SEVERITY</option>
            {SEVERITY_OPTIONS.map(s => <option key={s} value={s} className="bg-[#0a1320]">{s}</option>)}
          </select>
        </div>
        <div className="w-px h-6 bg-[rgba(0,234,255,0.1)]" />
        
        <button
          onClick={() => setActiveOnly(!activeOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono tracking-widest uppercase transition-all font-bold ${activeOnly ? 'bg-[rgba(0,234,255,0.1)] text-[#00eaff]' : 'bg-transparent text-[#4b6584] hover:text-[#e2e8f0]'}`}
        >
          <Power className="w-3.5 h-3.5" /> {activeOnly ? 'ON ONLY' : 'ALL RULES'}
        </button>
      </div>

      <div className="v2-card overflow-hidden">
        {loading ? (
             <div className="flex flex-col items-center justify-center p-20 font-mono text-sm tracking-widest text-[#00eaff] animate-pulse">CARREGANDO ENGINE RULES...</div>
        ) : rules.length === 0 ? (
             <div className="flex flex-col items-center justify-center p-20 text-[#4b6584]">
               <Shield className="w-12 h-12 mb-4 opacity-50" />
               <span className="font-mono text-sm tracking-widest">NENHUMA REGRA CONSTRUÍDA</span>
             </div>
        ) : (
            <div className="flex flex-col w-full">
              {/* Table Header */}
              <div className="grid grid-cols-[16px_100px_1fr_100px_80px_60px_80px] gap-6 px-6 py-3 border-b border-[rgba(0,234,255,0.1)] bg-[#03060a]/50 text-[10px] text-[#00eaff] font-mono font-bold uppercase tracking-widest items-center">
                 <div />
                 <div>TYPE / SCOPE</div>
                 <div>RULE DESCRIPTION [REGEX/LOGIC]</div>
                 <div>ACTION</div>
                 <div className="text-center">TRIGGERS</div>
                 <div className="text-center">SRC</div>
                 <div className="text-right">STATE</div>
              </div>

              {/* Table Body */}
              {rules.map((rule, i) => {
                const action = ACTION_LABELS[rule.rule_action] || { label: rule.rule_action, color: '#a1b1cc' };
                const sev = SEVERITY_ICON[rule.severity] || SEVERITY_ICON.low;
                const SevIcon = sev.icon;
                
                return (
                  <div key={rule.id} className={`grid grid-cols-[16px_100px_1fr_100px_80px_60px_80px] gap-6 px-6 py-4 border-b border-[#ffffff05] items-center group transition-colors ${i % 2 === 0 ? 'bg-[#0a1320]' : 'bg-[#080d16]'} hover:bg-[#101e30]`}>
                     <div className="flex items-center justify-center shrink-0">
                        <SevIcon className="w-4 h-4" style={{ color: sev.color, filter: `drop-shadow(0 0 5px ${sev.glow})` }} />
                     </div>
                     <div className="text-[11px] font-mono text-[#a1b1cc] truncate bg-[#101e30] px-2 py-1 rounded inline-block w-fit tracking-wider">
                        {rule.rule_type}
                     </div>
                     <div className="text-sm font-medium text-[#e2e8f0] truncate w-full group-hover:text-white transition-colors cursor-default" title={rule.rule_description}>
                        {rule.rule_description}
                     </div>
                     <div>
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold font-mono tracking-widest border" style={{ color: action.color, backgroundColor: `${action.color}10`, borderColor: `${action.color}30` }}>
                          {action.label}
                        </span>
                     </div>
                     <div className="text-center font-mono text-[13px] text-[#a1b1cc]">
                        {rule.times_triggered}
                     </div>
                     <div className="flex justify-center text-[#4b6584]">
                        {rule.source === 'manual' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                     </div>
                     <div className="flex justify-end">
                        <button
                          onClick={() => toggleRule(rule.id, rule.active)}
                          className={`flex items-center justify-between w-[52px] h-6 rounded-full px-1 border transition-all ${rule.active ? 'bg-[#00eaff]/10 border-[#00eaff]/30 shadow-[0_0_10px_rgba(0,234,255,0.2)]' : 'bg-transparent border-[#ffffff20]'}`}
                        >
                          {rule.active ? (
                             <>
                               <span className="text-[8px] font-bold tracking-widest font-mono text-[#00eaff] pl-1 drop-shadow-[0_0_5px_rgba(0,234,255,0.8)]">ON</span>
                               <div className="w-4 h-4 rounded-full bg-[#00eaff] shadow-[0_0_8px_rgba(0,234,255,0.8)]" />
                             </>
                          ) : (
                             <>
                               <div className="w-4 h-4 rounded-full bg-[#4b6584]" />
                               <span className="text-[8px] font-bold tracking-widest font-mono text-[#4b6584] pr-1">OFF</span>
                             </>
                          )}
                        </button>
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
