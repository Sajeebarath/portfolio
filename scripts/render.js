import { readFile } from 'node:fs/promises';

export async function renderPage() {
  const [template, css, client] = await Promise.all(
    ['page.html', 'style.css', 'theme.js'].map(file =>
      readFile(new URL('../src/' + file, import.meta.url), 'utf8')
    )
  );
  const pdf = await readFile(new URL('../assets/Sajeebarath_Suntharalingam_CV.pdf', import.meta.url));
  return template.replace('__CV_BYTES__', pdf.toString('base64')).replace('/* STYLES */', () => css)
    .replace('/* CLIENT */', () => client);
}
