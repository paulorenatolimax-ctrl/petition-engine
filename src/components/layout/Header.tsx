"use client";

import { usePathname } from "next/navigation";
import { Search, Bell } from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { APP_NAV_ITEMS } from "@/lib/config/navigation";

export function Header() {
  const pathname = usePathname();
  const { pendingErrorsCount } = useAppStore();

  const title = APP_NAV_ITEMS.find((item) =>
    pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
  )?.label || "Dashboard";

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      display: 'flex', height: '56px', width: '100%',
      alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(3,6,10,0.9)',
      backdropFilter: 'blur(12px)',
      padding: '0 24px',
    }}>
      <h1 className="section-title">{title}</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search */}
        <div style={{ position: 'relative' }} className="hidden sm:block">
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-tertiary)' }} />
          <input
            type="search"
            placeholder="Buscar..."
            style={{
              height: '36px', width: '220px', borderRadius: '8px',
              background: 'var(--bg-input)', border: '1px solid var(--border-subtle)',
              paddingLeft: '34px', paddingRight: '12px',
              fontSize: '13px', color: 'var(--text-primary)',
              outline: 'none', transition: 'border-color 0.2s',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
          />
        </div>

        {/* Bell */}
        <button style={{
          position: 'relative', background: 'none', border: 'none',
          cursor: 'pointer', padding: '8px', borderRadius: '8px',
          color: 'var(--text-secondary)', transition: 'all 0.2s',
        }}
          onMouseOver={e => { e.currentTarget.style.background = 'var(--neon-bg)'; e.currentTarget.style.color = 'var(--neon)'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          <Bell size={18} />
          {pendingErrorsCount > 0 && (
            <span style={{
              position: 'absolute', right: '6px', top: '6px',
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'var(--neon)', boxShadow: 'var(--neon-glow)',
            }} />
          )}
        </button>
      </div>
    </header>
  );
}
