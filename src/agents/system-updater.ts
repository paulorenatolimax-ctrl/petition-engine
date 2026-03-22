import { SupabaseClient } from '@supabase/supabase-js';

interface ProposedUpdate {
  systemName: string;
  affected_section: string;
  before: string;
  after: string;
  justification: string;
  risk: string;
  change_type: 'add' | 'modify' | 'remove';
  originalQuote: string;
  status: 'proposed' | 'confirmed' | 'applied' | 'rolled_back';
}

interface SystemMeta {
  current_version: string;
  versions: Array<{
    version: string;
    timestamp: string;
    change: string;
    quote: string;
    change_type: string;
  }>;
}

/**
 * SystemUpdater — assembles update proposal prompts and manages system versions.
 * Does NOT call any LLM API. Returns prompts for Claude Code.
 */
export class SystemUpdater {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Assembles a prompt for Claude Code to generate a system update proposal.
   */
  async assembleProposalPrompt(feedback: {
    systemName: string;
    changeDescription: string;
    originalQuote: string;
    currentDocType: string;
  }): Promise<string> {
    const { readSystemFiles } = await import('@/lib/file-reader');
    let currentSystem: string;
    try {
      const result = await readSystemFiles(feedback.systemName);
      currentSystem = result.content;
    } catch {
      currentSystem = '[Sistema não encontrado]';
    }

    return `Você é um especialista em atualização de sistemas de prompts para geração de documentos de imigração dos EUA.

Seu trabalho é:
1. Ler o sistema atual
2. Entender o feedback do operador (Paulo)
3. Propor uma mudança CIRÚRGICA — alterar APENAS o que precisa mudar
4. NÃO reescrever o sistema inteiro
5. Gerar um diff claro mostrando antes/depois

REGRA ABSOLUTA: Nunca apagar o que já funciona. Adicionar ou modificar, nunca deletar sem confirmação explícita.

SISTEMA ATUAL (${feedback.systemName}):
${currentSystem.substring(0, 15000)}

FEEDBACK DO PAULO:
"${feedback.originalQuote}"

INTERPRETAÇÃO: ${feedback.changeDescription}

Gere um JSON:
{
  "affected_section": "nome/path da seção",
  "before": "texto atual (até 500 chars)",
  "after": "texto proposto (até 500 chars)",
  "justification": "...",
  "risk": "...",
  "change_type": "add|modify|remove"
}`;
  }

  /**
   * Applies a confirmed update (after Claude Code returns the proposal JSON).
   */
  async applyUpdate(proposal: ProposedUpdate) {
    const fs = await import('fs/promises');
    const path = await import('path');

    const systemDir = path.join(process.cwd(), 'systems', proposal.systemName);
    const versionsDir = path.join(systemDir, 'versions');
    const metaPath = path.join(systemDir, 'meta.json');

    // 1. Read current meta
    let meta: SystemMeta;
    try {
      meta = JSON.parse(await fs.readFile(metaPath, 'utf-8'));
    } catch {
      meta = { current_version: '1.0.0', versions: [] };
    }

    // 2. Calculate new version (patch bump)
    const [major, minor, patch] = meta.current_version.split('.').map(Number);
    const newVersion = `${major}.${minor}.${patch + 1}`;

    // 3. Create versions directory
    await fs.mkdir(versionsDir, { recursive: true });

    // 4. Read current system content
    const { readSystemFiles } = await import('@/lib/file-reader');
    let currentContent: string;
    try {
      const result = await readSystemFiles(proposal.systemName);
      currentContent = result.content;
    } catch {
      currentContent = '';
    }

    // 5. Apply the change
    let newContent: string;
    if (proposal.change_type === 'add') {
      newContent = currentContent + '\n\n' + proposal.after;
    } else if (proposal.change_type === 'modify') {
      newContent = currentContent.replace(proposal.before, proposal.after);
    } else {
      newContent = currentContent.replace(proposal.before, '');
    }

    // 6. Save previous version
    const oldVersionPath = path.join(versionsDir, `v${meta.current_version}.md`);
    await fs.writeFile(oldVersionPath, currentContent, 'utf-8');

    // 7. Save new version
    const newVersionPath = path.join(versionsDir, `v${newVersion}.md`);
    await fs.writeFile(newVersionPath, newContent, 'utf-8');

    // 8. Update current.md symlink
    const currentPath = path.join(systemDir, 'current.md');
    try { await fs.unlink(currentPath); } catch { /* doesn't exist */ }
    await fs.symlink(newVersionPath, currentPath);

    // 9. Update meta.json
    const previousVersion = meta.current_version;
    meta.current_version = newVersion;
    meta.versions.push({
      version: newVersion,
      timestamp: new Date().toISOString(),
      change: proposal.justification,
      quote: proposal.originalQuote,
      change_type: proposal.change_type,
    });
    await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf-8');

    // 10. Update changelog
    const changelogPath = path.join(versionsDir, 'changelog.md');
    const changelogEntry = `\n## v${newVersion} — ${new Date().toISOString().split('T')[0]}\n\n**Mudança:** ${proposal.justification}\n**Quote:** "${proposal.originalQuote.substring(0, 100)}"\n**Seção:** ${proposal.affected_section}\n**Tipo:** ${proposal.change_type}\n`;
    await fs.appendFile(changelogPath, changelogEntry, 'utf-8');

    // 11. Commit to GitHub
    let commitSha: string | null = null;
    try {
      const { commitToGitHub } = await import('@/lib/github');
      commitSha = await commitToGitHub(
        `systems/${proposal.systemName}/versions/v${newVersion}.md`,
        newContent,
        `update(${proposal.systemName}): v${previousVersion}→v${newVersion} — ${proposal.justification.substring(0, 50)}`,
      );
    } catch (err) {
      console.warn('GitHub commit failed:', err);
    }

    // 12. Update Supabase
    await this.supabase
      .from('system_versions')
      .update({ version_tag: newVersion })
      .eq('system_name', proposal.systemName);

    // 13. Log
    await this.supabase.from('activity_log').insert({
      action: 'system_updated',
      details: {
        system: proposal.systemName,
        from_version: previousVersion,
        to_version: newVersion,
        change: proposal.justification,
        commit_sha: commitSha,
      },
    });

    return {
      systemName: proposal.systemName,
      fromVersion: previousVersion,
      toVersion: newVersion,
      commitSha,
      canRollback: true,
    };
  }

  async rollback(systemName: string, targetVersion?: string): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');

    const systemDir = path.join(process.cwd(), 'systems', systemName);
    const metaPath = path.join(systemDir, 'meta.json');
    const meta: SystemMeta = JSON.parse(await fs.readFile(metaPath, 'utf-8'));

    if (!targetVersion) {
      const versions = meta.versions.map((v) => v.version);
      const currentIdx = versions.indexOf(meta.current_version);
      if (currentIdx <= 0) throw new Error('Não há versão anterior para rollback');
      targetVersion = versions[currentIdx - 1];
    }

    const targetPath = path.join(systemDir, 'versions', `v${targetVersion}.md`);
    const currentPath = path.join(systemDir, 'current.md');

    try { await fs.access(targetPath); } catch {
      throw new Error(`Versão ${targetVersion} não encontrada`);
    }

    try { await fs.unlink(currentPath); } catch { /* doesn't exist */ }
    await fs.symlink(targetPath, currentPath);

    meta.current_version = targetVersion;
    meta.versions.push({
      version: targetVersion,
      timestamp: new Date().toISOString(),
      change: `ROLLBACK para v${targetVersion}`,
      quote: 'Rollback manual',
      change_type: 'rollback',
    });
    await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf-8');

    try {
      const { commitToGitHub } = await import('@/lib/github');
      const content = await fs.readFile(targetPath, 'utf-8');
      await commitToGitHub(
        `systems/${systemName}/current.md`,
        content,
        `rollback(${systemName}): revert to v${targetVersion}`,
      );
    } catch (err) {
      console.warn('GitHub rollback commit failed:', err);
    }

    await this.supabase.from('activity_log').insert({
      action: 'system_rollback',
      details: { system: systemName, rolled_back_to: targetVersion },
    });
  }
}
