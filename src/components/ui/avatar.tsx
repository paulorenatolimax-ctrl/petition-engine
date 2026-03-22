import * as React from 'react';

export function Avatar({ className = '', style, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={className}
      style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

export function AvatarFallback({ className = '', style, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={className}
      style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-subtle)', color: 'var(--accent)', fontSize: '13px', fontWeight: 600, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  if (!src) return null;
  return <img src={src} alt={alt || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} {...props} />;
}
