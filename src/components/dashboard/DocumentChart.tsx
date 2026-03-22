import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function DocumentChart() {
  const data = [
    { day: "Seg", value: 12 },
    { day: "Ter", value: 18 },
    { day: "Qua", value: 14 },
    { day: "Qui", value: 24 },
    { day: "Sex", value: 10 },
    { day: "Sáb", value: 5 },
    { day: "Dom", value: 8 },
  ];
  
  const max = Math.max(...data.map(d => d.value));

  return (
    <Card className="glass-card border-border-subtle bg-card/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Docs Gerados (7d)</CardTitle>
      </CardHeader>
      <CardContent className="h-56">
        <div className="flex h-full items-end justify-between gap-1 sm:gap-2 pt-4">
          {data.map((d) => (
             <div key={d.day} className="flex flex-col items-center gap-2 flex-1 group h-full justify-end">
               <div className="relative w-full rounded-t-sm bg-accent/50 overflow-hidden flex flex-col justify-end transition-all duration-300 group-hover:bg-accent" style={{ height: `${(d.value / max) * 100}%` }}>
                 <div className="absolute bottom-0 w-full bg-gradient-to-t from-teal-500/20 to-teal-400/80 h-[10%] group-hover:h-full transition-all duration-500 rounded-t-sm" />
                 <div className="absolute top-0 w-full h-[2px] bg-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
               <span className="text-[10px] uppercase font-medium text-muted-foreground truncate">{d.day}</span>
             </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
