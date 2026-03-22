import { exec } from 'child_process';
import path from 'path';

const SCRIPTS_DIR = path.join(process.cwd(), 'scripts');

export function runPython(scriptName: string, args: string[] = []): Promise<string> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(SCRIPTS_DIR, scriptName);
    const escapedArgs = args.map(a => `"${a.replace(/"/g, '\\"')}"`).join(' ');
    const cmd = `python3 "${scriptPath}" ${escapedArgs}`;

    exec(cmd, { maxBuffer: 50 * 1024 * 1024, timeout: 120000 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Python error (${scriptName}): ${stderr || error.message}`));
        return;
      }
      resolve(stdout.trim());
    });
  });
}
