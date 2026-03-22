import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Petition Engine',
  description: 'Plataforma de automação de petições imigratórias',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="flex min-h-screen bg-[var(--bg-void)] text-[var(--text-primary)] overflow-hidden relative">
        <div className="page-glow" />
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 z-10 grid-bg h-screen overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto relative">
            <div className="mx-auto w-full relative z-20">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
