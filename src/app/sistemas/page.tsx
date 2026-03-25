'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Link2, Unlink, Cpu, Settings, Server, CheckCircle2, AlertCircle } from 'lucide-react';

interface System {
  id: string;
  system_name: string;
  system_path: string;
  version_tag: string;
  file_count?: number;
  is_active: boolean;
  created_at: string;
  symlink_ok?: boolean;
  file_count_actual?: number;
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return 'N/A';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m atras`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h atras`;
  const days = Math.floor(hours / 24);
  return `${days}d atras`;
}

export default function SistemasPage() {
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const fetchSystems = () => {
    fetch('/api/systems')
      .then(r => r.json())
      .then(d => setSystems(d.data || []))
      .catch(() => setSystems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSystems();
  }, []);

  const rescanAll = async () => {
    setScanning(true);
    await fetch('/api/systems/setup-symlinks', { method: 'POST' });
    await new Promise(r => setTimeout(r, 1000));
    fetchSystems();
    setScanning(false);
  };

  const totalFiles = systems.reduce((s, sys) => s + (sys.file_count_actual || sys.file_count || 0), 0);

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 w-full animate-in fade-in duration-500 max-w-[1400px]">
      <div className="flex justify-between items-end mb-4">
        <div className="flex flex-col gap-1">
          <h1 className="section-title v2-section-header text-[#e2e8f0] text-lg w-max">Sistemas Instalados <span className="text-[#00eaff] ml-2 font-mono">[{systems.length}]</span></h1>
          <p className="text-[#a1b1cc] font-mono text-xs mt-2">Conexões M2M e repassagem de arquivos estáticos Claude Code</p>
        </div>
        <button
          onClick={rescanAll} disabled={scanning}
          className="relative group overflow-hidden bg-[#101e30] border border-[rgba(0,234,255,0.2)] rounded-lg px-5 py-2.5 text-[#00eaff] text-xs font-mono font-bold tracking-widest uppercase hover:text-[#03060a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-[#00eaff] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative z-10 flex items-center gap-2">
            <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} /> {scanning ? 'SCANNING...' : 'SCAN SYMLINKS'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[
          { label: 'Instalados', value: systems.length, color: '#00eaff', glow: 'rgba(0,234,255,0.2)' },
          { label: 'Total Markdown', value: totalFiles, color: '#2ed573', glow: 'rgba(46,213,115,0.2)' },
          { label: 'Engine Central', value: 'PRO', color: '#ff4757', glow: 'rgba(255,71,87,0.2)' },
          { label: 'Extrator', value: 'IMPACT', color: '#ffa502', glow: 'rgba(255,165,2,0.2)' }
        ].map((stat, i) => (
          <div key={i} className="v2-card relative overflow-hidden group cursor-default p-5 flex flex-col justify-between" style={{ borderBottom: `3px solid ${stat.color}` }}>
             <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10" style={{ backgroundColor: stat.color }} />
             <span className="text-[10px] text-[#4b6584] font-mono tracking-[2px] font-bold uppercase z-10">{stat.label}</span>
             <span className="text-2xl font-black font-mono text-[#e2e8f0] z-10 mt-2 tracking-tight group-hover:text-white transition-colors" style={{ textShadow: `0 0 20px ${stat.color}80` }}>{loading ? '--' : stat.value}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 font-mono text-sm tracking-widest text-[#00eaff] animate-pulse mt-4">PULLING SYSTEM LINKS...</div>
      ) : systems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 font-mono text-[#4b6584] mt-4 bg-[#0a1320] rounded-xl border border-[rgba(0,234,255,0.06)]">
            <Settings className="w-10 h-10 mb-4 opacity-50" />
            <span className="text-sm tracking-widest">NO SYSTEMS INITIALIZED</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 w-full">
          {systems.map(sys => {
            const fileCount = sys.file_count_actual || sys.file_count || 0;
            const isOk = sys.symlink_ok !== false && fileCount > 0;
            
            return (
              <div key={sys.id} className={`p-6 ${isOk ? 'v2-card shadow-md' : 'rounded-xl bg-[#1a0f14] border border-[#ff4757]/30 shadow-[0_0_20px_rgba(255,71,87,0.1)]'} relative overflow-hidden group transition-all cursor-default`}>
                   {isOk && <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-[#00eaff]/5 blur-2xl group-hover:bg-[#00eaff]/10 transition-colors pointer-events-none" />}
                   
                   <div className="flex justify-between items-start mb-6 border-b border-[#ffffff0a] pb-4">
                     <div className="flex flex-col gap-1.5">
                        <span className="text-[16px] font-bold text-[#e2e8f0] tracking-wide relative z-10 font-mono">{sys.system_name}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-mono text-[#4b6584] uppercase tracking-widest border border-dashed border-[#4b6584]/50 px-1 py-0.5 rounded">v{sys.version_tag}</span>
                           <span className="text-[10px] font-mono text-[#4b6584] uppercase tracking-widest flex items-center gap-1"><Cpu className="w-3 h-3"/> Claude Code</span>
                        </div>
                     </div>
                     <div className={`px-2.5 py-1 rounded text-[9px] uppercase font-mono tracking-widest font-bold border ${isOk ? 'bg-[#00eaff]/10 text-[#00eaff] border-[#00eaff]/30 shadow-[0_0_8px_rgba(0,234,255,0.2)]' : 'bg-[#ff4757]/10 text-[#ff4757] border-[#ff4757]/30 shadow-[0_0_8px_rgba(255,71,87,0.2)]'}`}>
                       {isOk ? 'CONNECTED' : 'SYMLINK ERR'}
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-4 text-[12px] font-mono text-[#a1b1cc]">
                     <span className="flex items-center gap-2"><Server className="w-3.5 h-3.5 text-[#4b6584]"/> {fileCount} arquivos carregados</span>
                   </div>
                   <div className="flex items-center gap-4 text-[10px] font-mono text-[#4b6584] mt-2">
                     <span className="flex items-center gap-2 text-ellipsis overflow-hidden whitespace-nowrap" title={sys.system_path}>PATH: {sys.system_path}</span>
                   </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
