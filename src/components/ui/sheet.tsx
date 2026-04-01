'use client';

import * as React from 'react';

export function Sheet({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SheetTrigger({ children, asChild, ...props }: { children: React.ReactNode; asChild?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}

export function SheetContent({ children, side = 'right', className = '', ...props }: { children: React.ReactNode; side?: string; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={className}
      style={{
        position: 'fixed', top: 0, [side === 'left' ? 'left' : 'right']: 0,
        width: '300px', height: '100vh', background: 'var(--bg-secondary)',
        borderLeft: side === 'right' ? '1px solid var(--border-subtle)' : 'none',
        borderRight: side === 'left' ? '1px solid var(--border-subtle)' : 'none',
        zIndex: 100, padding: '24px',
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function SheetHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className} style={{ marginBottom: '16px' }}>{children}</div>;
}

export function SheetTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h2 className={className} style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{children}</h2>;
}

export function SheetDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={className} style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>{children}</p>;
}
