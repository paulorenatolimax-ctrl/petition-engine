import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { client_id, doc_type } = body;

  if (!client_id || !doc_type) {
    return NextResponse.json({ error: 'client_id e doc_type sao obrigatorios' }, { status: 400 });
  }

  const promptPath = `/tmp/petition-engine/prompts/GERAR_${doc_type.toUpperCase()}_${client_id}.md`;

  return NextResponse.json({
    data: {
      prompt: `# Instrucao de Geracao\n\n## Sistema: ${doc_type}\n## Cliente: ${client_id}\n\nEste e um prompt stub. Em producao, o Petition Engine montara o prompt real\nlendo os arquivos .md do sistema validado e os dados do perfil do cliente.\n\nO documento final sera gerado via:\nclaude -p "Leia ${promptPath} e execute tudo." --allowedTools Bash,Read,Write,Edit,Glob,Grep`,
      metadata: {
        system: doc_type,
        systemName: doc_type,
        filesRead: 4,
        files_read: ['SISTEMA.md', 'TEMPLATE.md', 'FORMATTING.md', 'QUALITY.md'],
        rulesApplied: 12,
        rules_count: 12,
        estimatedTokens: 15000,
        estimated_tokens: 15000,
      },
      prompt_path: promptPath,
      prompt_file: promptPath,
      claude_command: `claude -p "Leia ${promptPath} e execute tudo." --allowedTools Bash,Read,Write,Edit,Glob,Grep`,
    },
  });
}
