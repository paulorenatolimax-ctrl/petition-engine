import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      send({ stage: 'scanning', message: `Escaneando pasta: ${body.folder_path}` });
      await new Promise(r => setTimeout(r, 500));

      send({
        stage: 'complete',
        prompt: `# Extracao de Perfil\n\nPasta: ${body.folder_path}\n\nEste e um prompt stub. Em producao, o Petition Engine geraria um prompt de extracao real baseado nos documentos encontrados na pasta do cliente.`,
      });

      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
  });
}
