import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'Petition Engine',
  description: 'Plataforma de automação de petições imigratórias',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body style={{ background: '#0a0a0a', color: '#f5f5f5', margin: 0, fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main style={{ flex: 1, overflowY: 'auto', height: '100vh' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
