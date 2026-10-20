import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const filePath = './node_modules/json-server/lib/service.js';

if (existsSync(filePath)) {
  const content = readFileSync(filePath, 'utf-8');
  const target = 'const item = { ...data, id: randomId() };';
  const replacement = 'const item = { ...data, id: data.id ?? randomId() };';

  if (content.includes(target)) {
    writeFileSync(filePath, content.replace(target, replacement), 'utf-8');
    console.log('[fix-json-server] json-server ajustado para respeitar IDs sequenciais enviados pelo frontend.');
  }
}
