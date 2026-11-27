import { cp, mkdir, writeFile } from 'node:fs/promises';
import { renderPage } from './render.js';

const root = new URL('../', import.meta.url);
const page = await renderPage();
await mkdir(new URL('dist/', root), { recursive: true });
await cp(new URL('assets/', root), new URL('dist/assets/', root), { recursive: true });
for (const file of ['index.html', 'dist/index.html']) {
  await writeFile(new URL(file, root), page);
}
