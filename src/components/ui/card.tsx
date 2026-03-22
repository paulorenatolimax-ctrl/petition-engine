import * as React from 'react';

export function Card({ className = '', style, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', ...style }} {...props}>{children}</div>;
}

export function CardHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} style={{ padding: '20px 24px 0' }} {...props}>{children}</div>;
}

export function CardTitle({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={className} style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }} {...props}>{children}</h3>;
}

export function CardDescription({ className = '', children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={className} style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }} {...props}>{children}</p>;
}

export function CardContent({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} style={{ padding: '16px 24px 24px' }} {...props}>{children}</div>;
}
