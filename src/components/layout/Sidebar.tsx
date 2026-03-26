'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Orbit,
  Cpu,
  ShieldCheck,
  TerminalSquare,
  SlidersHorizontal,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { icon: Activity, label: 'Dashboard', href: '/' },
  { icon: Orbit, label: 'Clientes', href: '/clientes' },
  { icon: Cpu, label: 'Gerador', href: '/gerador' },
  { icon: FileText, label: 'Documentos', href: '/documentos' },
  { icon: ShieldCheck, label: 'Qualidade', href: '/qualidade' },
  { icon: TerminalSquare, label: 'Erros', href: '/erros' },
  { icon: SlidersHorizontal, label: 'Sistemas', href: '/sistemas' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: collapsed ? '72px' : '240px',
        minHeight: '100vh',
        backgroundColor: '#050a12',
        backgroundImage: `
          radial-gradient(circle at 0% 0%, rgba(212, 175, 55, 0.12) 0%, transparent 60%),
          linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.12'/%3E%3C/svg%3E")
        `,
        backgroundSize: '100% 100%, 60px 60px, 60px 60px, 150px 150px',
        borderRight: '1px solid rgba(212, 175, 55, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        zIndex: 40,
      }}
    >
      {/* Logo with animated orb */}
      <div style={{
        padding: collapsed ? '20px 16px' : '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid rgba(0, 234, 255, 0.08)',
      }}>
        {/* Energy Core Logo — dentro do Sidebar, no topo */}
        <div style={{
          width: '36px',
          height: '36px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          perspective: '120px',
        }}>
          {/* Core — esfera central pequena */}
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #00eaff, #6366f1)',
            boxShadow: '0 0 12px rgba(0, 234, 255, 0.6), 0 0 24px rgba(0, 234, 255, 0.2)',
            animation: 'core-pulse 2s ease-in-out infinite',
            position: 'relative',
            zIndex: 2,
          }} />

          {/* Violet Elliptical Orbit */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            animation: 'orbit-cyan 2.5s linear infinite',
            transformStyle: 'preserve-3d',
            zIndex: 3,
          }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '1px solid rgba(139,92,246,0.1)' }} />
            <div style={{
              width: '4px', height: '4px', borderRadius: '50%',
              background: '#8b5cf6',
              boxShadow: '0 0 8px rgba(139, 92, 246, 1)',
              position: 'absolute', top: '-2px', left: '50%', transform: 'translateX(-50%)',
            }} />
          </div>

          {/* Copper Elliptical Orbit */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            animation: 'orbit-gold 3s linear infinite reverse',
            transformStyle: 'preserve-3d',
            zIndex: 1,
          }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '1px solid rgba(217,119,6,0.15)' }} />
            <div style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: '#d97706',
              boxShadow: '0 0 10px rgba(217, 119, 6, 1)',
              position: 'absolute', bottom: '-2.5px', left: '50%', transform: 'translateX(-50%)',
            }} />
          </div>
        </div>
        {!collapsed && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#00eaff', fontWeight: 800, fontSize: '15px', letterSpacing: '3px', textShadow: '0 0 10px rgba(0,234,255,0.4)', fontFamily: "'Space Grotesk', sans-serif" }}>
              PETITION
            </span>
            <span style={{ color: '#4b6584', fontWeight: 500, fontSize: '10px', letterSpacing: '4px', marginTop: '-2px', fontFamily: "'Space Grotesk', sans-serif" }}>
              ENGINE
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: collapsed ? '12px 16px' : '10px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="sidebar-icon" size={18} strokeWidth={1.5} style={{ flexShrink: 0 }} />
              {!collapsed && <span className="sidebar-text">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          margin: '12px 8px',
          padding: '8px',
          background: 'rgba(0, 234, 255, 0.04)',
          border: '1px solid rgba(0, 234, 255, 0.1)',
          borderRadius: '8px',
          color: '#4b6584',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.15s ease',
        }}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}

export default Sidebar;
