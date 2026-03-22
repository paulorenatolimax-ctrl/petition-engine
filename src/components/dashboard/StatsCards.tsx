"use client";

import { Users, FileText, CheckCircle, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const stats = [
  { 
    title: "Clientes Ativos", 
    value: "24", 
    description: "+12% este mês",
    icon: Users,
    color: "var(--neon)"
  },
  { 
    title: "Docs Gerados", 
    value: "156", 
    description: "Últimos 7 dias",
    icon: FileText,
    color: "var(--purple)"
  },
  { 
    title: "Sistemas Ativos", 
    value: "8", 
    description: "Agents disponíveis",
    icon: Zap,
    color: "var(--neon-dim)"
  },
  { 
    title: "Taxa Qualidade", 
    value: "94%", 
    description: "Aprovação do USCIS",
    icon: CheckCircle,
    color: "var(--success)"
  }
];

export function StatsCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="gradient-border gradient-border-glow-animation transition-shadow duration-500"
        >
          <Card className="bg-transparent border-none overflow-hidden relative group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="section-title text-[#a1b1cc]">
                {stat.title}
              </CardTitle>
              <stat.icon style={{ color: stat.color, filter: `drop-shadow(0 0 8px ${stat.color})` }} className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-[36px] font-black text-neon font-mono tracking-tight leading-tight pt-1">
                {stat.value}
              </div>
              <div className="h-px w-full bg-gradient-to-r from-[rgba(0,234,255,0.2)] to-transparent my-2" />
              <p className="text-xs text-[#4b6584] font-medium uppercase tracking-wider">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
