import { Octokit } from 'octokit';

function getOctokit() {
  const token = process.env.GITHUB_TOKEN;
  if (!token || token === 'PREENCHER') {
    console.warn('[GitHub] Token nao configurado — commits desabilitados');
    return null;
  }
  return new Octokit({ auth: token });
}

const REPO = process.env.GITHUB_REPO || 'paulorenatolimax-ctrl/petition-engine';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const [owner, repo] = REPO.split('/');

export async function commitToGitHub(filePath: string, content: string, message: string): Promise<string | null> {
  const octokit = getOctokit();
  if (!octokit) return null;

  try {
    const { data: ref } = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${BRANCH}` });
    const latestCommitSha = ref.object.sha;

    const { data: commit } = await octokit.rest.git.getCommit({ owner, repo, commit_sha: latestCommitSha });

    const { data: blob } = await octokit.rest.git.createBlob({
      owner, repo,
      content: Buffer.from(content).toString('base64'),
      encoding: 'base64',
    });

    const { data: newTree } = await octokit.rest.git.createTree({
      owner, repo,
      base_tree: commit.tree.sha,
      tree: [{ path: filePath, mode: '100644', type: 'blob', sha: blob.sha }],
    });

    const { data: newCommit } = await octokit.rest.git.createCommit({
      owner, repo, message,
      tree: newTree.sha,
      parents: [latestCommitSha],
    });

    await octokit.rest.git.updateRef({ owner, repo, ref: `heads/${BRANCH}`, sha: newCommit.sha });

    return newCommit.sha;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('[GitHub] Commit falhou:', err.message);
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function commitErrorRule(rule: any): Promise<string | null> {
  return commitToGitHub(
    `error-rules/${rule.rule_type}/${rule.id}.json`,
    JSON.stringify(rule, null, 2),
    `fix(error-rules): add ${rule.rule_type} rule — ${rule.rule_description?.substring(0, 50)}`
  );
}
