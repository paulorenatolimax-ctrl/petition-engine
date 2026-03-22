import * as React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

const variantStyles: Record<string, React.CSSProperties> = {
  default: { background: 'var(--accent-subtle)', color: 'var(--accent)', border: '1px solid var(--accent-border)' },
  secondary: { background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' },
  destructive: { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' },
  outline: { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' },
};

export function Badge({ variant = 'default', className = '', style, children, ...props }: BadgeProps) {
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '6px', ...variantStyles[variant], ...style }}
      {...props}
    >
      {children}
    </span>
  );
}
