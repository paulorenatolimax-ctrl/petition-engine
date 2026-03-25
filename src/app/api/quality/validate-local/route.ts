import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { file_path, doc_type, client_name } = body;

  if (!file_path) {
    return NextResponse.json({ error: 'file_path obrigatorio' }, { status: 400 });
  }

  try {
    // Read document text (supports .md and .docx via raw text)
    let documentText = '';
    if (file_path.endsWith('.md') || file_path.endsWith('.txt')) {
      documentText = readFileSync(file_path, 'utf-8');
    } else if (file_path.endsWith('.docx')) {
      // Extract text from DOCX
      const { execSync } = require('child_process');
      documentText = execSync(
        `python3 -c "from docx import Document; doc=Document('${file_path}'); print('\\n'.join(p.text for p in doc.paragraphs))"`,
        { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
      );
    } else {
      return NextResponse.json({ error: 'Formato nao suportado (use .md, .txt ou .docx)' }, { status: 400 });
    }

    const { runQualityLocal } = await import('@/agents/quality-local');
    const result = await runQualityLocal({
      documentText,
      docType: doc_type || 'unknown',
      clientName: client_name || '',
    });

    return NextResponse.json({
      data: {
        score: result.score,
        passed: result.passed,
        notes: result.notes,
        violations: result.violations,
        autoFixes: result.autoFixes,
        warnings: result.warnings,
        stats: {
          originalLength: documentText.length,
          cleanedLength: result.cleanedText.length,
          charsRemoved: documentText.length - result.cleanedText.length,
          violationsCount: result.violations.length,
          autoFixesCount: result.autoFixes.length,
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
