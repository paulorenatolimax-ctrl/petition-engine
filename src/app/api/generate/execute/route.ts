import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: object) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      send('stage', { stage: 'loading', message: `Carregando sistema ${body.doc_type}...` });
      await new Promise(r => setTimeout(r, 800));

      send('stage', { stage: 'profile', message: `Montando prompt com perfil de ${body.client_name}...` });
      await new Promise(r => setTimeout(r, 600));

      send('stage', { stage: 'rules', message: 'Aplicando 12 regras de erro...' });
      await new Promise(r => setTimeout(r, 400));

      send('stage', { stage: 'generating', message: 'Gerando documento via Claude Code... (stub)' });
      await new Promise(r => setTimeout(r, 1500));

      send('stage', { stage: 'complete', message: 'Documento gerado com sucesso!' });

      send('complete', {
        success: true,
        output_path: `/Users/paulo1844/Documents/_PROEX/_2. MEUS CASOS/2026/${body.client_name}/`,
        tokens_used: 45000,
        duration_seconds: 45,
      });

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
