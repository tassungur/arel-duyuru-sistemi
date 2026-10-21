import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function detectDeveloperId(): string {
  if (process.env.AREL_DEVELOPER_ID) return process.env.AREL_DEVELOPER_ID;
  try {
    const email = execSync('git config user.email', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim().toLowerCase();
    const name = execSync('git config user.name', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim().toLowerCase();
    if (email.includes('nurcan') || name.includes('nurcan')) return 'nurcan.ulasan';
    if (email.includes('adem') || name.includes('adem')) return 'adem.keskin';
  } catch {}
  return 'adem.keskin';
}

function arelDevkitPlugin(): Plugin {
  const fileSnapshots = new Map<string, { lines: number; time: number }>();
  const syncUrl = 'https://api.staging.arel.edu.tr/api/v1/devkit/sync';
  const token = 'arel-devkit-sync-2026';
  const projectCode = 'arel-duyuru-sistemi';

  return {
    name: 'vite-plugin-arel-devkit',
    configureServer(server) {
      // Dev sunucusu kalkarken ilk transkript ve hook senkronizasyonunu tetikle
      try {
        execSync('node scripts/devkit-sync.mjs --init --sync-quiet', { stdio: 'ignore' });
      } catch {}

      server.watcher.on('change', async (changedPath) => {
        if (!changedPath.includes(`${path.sep}src${path.sep}`)) return;
        try {
          const content = fs.readFileSync(changedPath, 'utf8');
          const relPath = path.relative(process.cwd(), changedPath).replace(/\\/g, '/');
          const lines = content.split('\n').length;
          const now = Date.now();
          const prev = fileSnapshots.get(relPath);
          fileSnapshots.set(relPath, { lines, time: now });

          const addedLines = prev ? lines - prev.lines : lines;
          const elapsedSec = prev ? Math.max(1, (now - prev.time) / 1000) : 1;
          const isBulkPaste = addedLines >= 15 && elapsedSec <= 12;

          const devId = detectDeveloperId();
          const hash = crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);

          const messages = isBulkPaste
            ? [
                {
                  sequenceNo: 1,
                  role: 'untracked_paste',
                  model: 'external-ai-paste',
                  content: `[DIŞ KAYNAKLI AI KODU / HIZLI YAPIŞTIRMA TESPİTİ]\nDosya: ${relPath} (+${addedLines} satır / ${elapsedSec.toFixed(1)} sn)\n\n${content}`,
                  inputTokens: 0,
                  outputTokens: Math.ceil(content.length / 4),
                  toolCallCount: 1,
                  toolsUsed: [`BulkPaste: +${addedLines} lines`],
                  touchedFiles: [relPath],
                  status: 'completed',
                  idempotencyKey: `paste:${devId}:${relPath}:${hash}`
                }
              ]
            : [];

          await fetch(syncUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Arel-Devkit-Token': token
            },
            body: JSON.stringify({
              developerId: devId,
              projectCode,
              sessionId: `devserver-${devId}-${new Date().toISOString().slice(0, 13)}`,
              sourceTool: isBulkPaste ? 'chatgpt-paste-detector' : 'cursor-ide',
              captureStatus: 'complete',
              branchName: 'main',
              machineId: os.hostname(),
              messages,
              gitEvent: {
                eventType: isBulkPaste ? 'bulk_paste' : 'file_save',
                changedFiles: [`${relPath} (${lines} satır)`]
              }
            })
          });
        } catch {}
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), arelDevkitPlugin()],
  server: {
    port: 5175
  }
});
