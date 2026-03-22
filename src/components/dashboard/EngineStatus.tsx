import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Database, Cpu, Server } from "lucide-react";

export function EngineStatus() {
  const metrics = [
    { label: "Claude Opus", value: "Ativo", icon: Cpu, status: "success" },
    { label: "Supabase DB", value: "14ms", icon: Database, status: "neon" },
    { label: "Memory Load", value: "84%", icon: Activity, status: "warning" },
    { label: "Worker Queue", value: "Zero", icon: Server, status: "info" },
  ];

  const getStatusColor = (s: string) => {
    if (s === 'success') return 'var(--success)';
    if (s === 'warning') return 'var(--warning)';
    if (s === 'danger') return 'var(--danger)';
    if (s === 'neon') return 'var(--neon)';
    return 'var(--neon-dim)';
  };

  return (
    <Card className="gradient-border border-none bg-transparent h-full">
      <CardHeader>
        <CardTitle className="section-title text-[#e2e8f0]">Status do Motor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {metrics.map((m, i) => (
            <div key={i} className="flex flex-col gap-2.5 p-4 bg-[#080d16] rounded-lg border border-[rgba(0,234,255,0.05)] hover:border-[rgba(0,234,255,0.2)] hover:shadow-[0_0_15px_rgba(0,234,255,0.05)] transition-all group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,234,255,0.02)] to-transparent group-hover:from-[rgba(0,234,255,0.05)] transition-colors pointer-events-none" />
              <div className="flex items-center gap-2 text-[#4b6584] text-[11px] font-black uppercase tracking-[2px] z-10">
                <m.icon className="h-3.5 w-3.5 group-hover:text-neon transition-colors" />
                {m.label}
              </div>
              <div 
                className="text-xl font-mono font-black z-10 tracking-tight" 
                style={{ color: getStatusColor(m.status), textShadow: `0 0 10px ${getStatusColor(m.status)}` }}
              >
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
