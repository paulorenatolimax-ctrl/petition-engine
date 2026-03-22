import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function VisaChart() {
  const visas = [
    { name: "EB-2 NIW", count: 42, color: "var(--neon)" },
    { name: "EB-1A", count: 28, color: "var(--purple)" },
    { name: "O-1A", count: 14, color: "var(--success)" },
    { name: "L-1A", count: 8, color: "var(--warning)" },
  ];
  
  const max = Math.max(...visas.map(v => v.count));

  return (
    <Card className="gradient-border border-none bg-transparent h-full">
      <CardHeader>
        <CardTitle className="section-title text-[#e2e8f0]">Clientes por Visto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 mt-2">
          {visas.map((v) => (
             <div key={v.name} className="space-y-2 group">
               <div className="flex justify-between text-xs font-bold uppercase tracking-[2px] text-[#a1b1cc] group-hover:text-[#e2e8f0] transition-colors">
                 <span>{v.name}</span>
                 <span style={{ color: v.color, textShadow: `0 0 10px ${v.color}` }} className="font-mono">{v.count}</span>
               </div>
               <div className="h-1.5 w-full bg-[#0c1624] rounded-full overflow-hidden border border-[#101e30] group-hover:border-[#00eaff]/20 transition-colors">
                 <div 
                   className="h-full rounded-full relative progress-fill" 
                   style={{ 
                     width: `${(v.count / max) * 100}%`,
                     background: `linear-gradient(90deg, transparent, ${v.color})`,
                     boxShadow: `0 0 15px ${v.color}`
                   }}
                 >
                   <div className="absolute right-0 top-[-2px] bottom-[-2px] w-1.5 bg-white rounded-full" style={{ boxShadow: `0 0 15px ${v.color}` }} />
                 </div>
               </div>
             </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
