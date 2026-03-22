import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText } from "lucide-react";

export function RecentClients() {
  const clients = [
    { name: "Maria Kasza", visa: "EB-2 NIW", docs: 12, quality: 94, avatar: "MK" },
    { name: "João Silva", visa: "EB-1A", docs: 8, quality: 97, avatar: "JS" },
    { name: "Ana Costa", visa: "O-1", docs: 3, quality: null, avatar: "AC", status: "Em espera" },
  ];

  return (
    <Card className="glass-card border-border-subtle bg-card/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>Últimos Clientes</span>
          <Badge variant="outline" className="text-xs font-normal bg-background/50 hover:bg-background/80 cursor-pointer">Ver todos</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {clients.map(c => (
             <div key={c.name} className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-border-subtle transition-all hover:bg-background/60 hover:border-border-medium group">
               <div className="flex items-center gap-4">
                 <Avatar className="h-10 w-10 border border-border-subtle bg-sidebar-accent">
                   <AvatarFallback className="text-sidebar-foreground font-medium">{c.avatar}</AvatarFallback>
                 </Avatar>
                 <div>
                   <div className="flex items-center gap-2">
                     <p className="text-sm font-medium leading-none text-foreground">{c.name}</p>
                     <Badge variant="outline" className="text-[10px] bg-background border-border-medium px-1.5 py-0 h-4 leading-4">{c.visa}</Badge>
                     {c.status && <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0 h-4 leading-4 border-amber-500/20">{c.status}</Badge>}
                   </div>
                   <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-2">
                     <span className="flex items-center gap-1"><FileText className="h-3 w-3"/> {c.docs} docs</span>
                     {c.quality && <span>• <span className="text-emerald-400 font-medium">{c.quality}% qual</span></span>}
                   </p>
                 </div>
               </div>
               <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
               </div>
             </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
