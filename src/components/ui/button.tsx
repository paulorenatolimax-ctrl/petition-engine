import * as React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const variantStyles: Record<string, React.CSSProperties> = {
  default: { background: 'linear-gradient(135deg, #2dd4bf, #06b6d4)', color: '#0a0a0a', border: 'none' },
  ghost: { background: 'transparent', color: 'var(--text-secondary)', border: 'none' },
  outline: { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' },
  destructive: { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' },
};

const sizeStyles: Record<string, React.CSSProperties> = {
  default: { padding: '8px 16px', fontSize: '13px' },
  sm: { padding: '6px 12px', fontSize: '12px' },
  lg: { padding: '10px 24px', fontSize: '14px' },
  icon: { padding: '8px', width: '32px', height: '32px' },
};

export function Button({ variant = 'default', size = 'default', className = '', style, children, ...props }: ButtonProps) {
  return (
    <button
      className={className}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        borderRadius: 'var(--radius-md)', fontWeight: 500, cursor: 'pointer',
        transition: 'all 0.15s ease',
        ...variantStyles[variant], ...sizeStyles[size], ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
