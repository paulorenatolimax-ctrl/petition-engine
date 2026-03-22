import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, Zap, FileText, Bug } from "lucide-react";

export function ActivityTimeline() {
  const events = [
    { time: "14:32", title: "Cover Letter EB-1A gerada", client: "Maria Kasza", icon: CheckCircle, color: "text-emerald-400 bg-emerald-400/10 border-emerald-500/20" },
    { time: "14:30", title: "Qualidade: 96/100", client: "Maria Kasza", icon: Zap, color: "text-teal-400 bg-teal-400/10 border-teal-500/20" },
    { time: "13:15", title: "Résumé EB-1A v2", client: "João Silva", icon: FileText, color: "text-blue-400 bg-blue-400/10 border-blue-500/20" },
    { time: "11:00", title: 'Erro corrigido: "I believe"', client: "Sistema", icon: Bug, color: "text-amber-400 bg-amber-400/10 border-amber-500/20" },
  ];

  return (
    <Card className="glass-card border-border-subtle bg-card/50 h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Timeline de Atividade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 pt-2">
          {events.map((e, i) => (
            <div key={i} className="flex gap-4 relative group">
              {i !== events.length - 1 && (
                <div className="absolute left-[15px] top-8 bottom-[-24px] w-px bg-border-subtle group-hover:bg-teal-500/30 transition-colors" />
              )}
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border z-10 ${e.color}`}>
                <e.icon className="h-4 w-4" />
              </div>
              <div className="space-y-1 pb-1">
                <p className="text-sm font-medium leading-none text-foreground">{e.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1.5">
                  <span className="font-mono">{e.time}</span>
                  <span>•</span>
                  <span>{e.client}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
