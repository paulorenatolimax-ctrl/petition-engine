import { LayoutDashboard, Users, Zap, CheckCircle, Bug, Settings } from "lucide-react";

export const APP_NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Clientes', href: '/clientes' },
  { icon: Zap, label: 'Gerador', href: '/gerador' },
  { icon: CheckCircle, label: 'Qualidade', href: '/qualidade' },
  { icon: Bug, label: 'Erros', href: '/erros' },
  { icon: Settings, label: 'Sistemas', href: '/sistemas' },
];
