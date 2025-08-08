import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export function combineFilesToHtml(files) {
  const index = files.find(f => f.path.toLowerCase() === 'index.html');
  const css = files.find(f => f.path.toLowerCase().endsWith('.css'));
  const js = files.find(f => f.path.toLowerCase().endsWith('.js'));
  let html = index ? index.content : '<!doctype html><html><body><div>Missing index.html</div></body></html>';

  if (css) {
    // inject CSS inline
    html = html.replace('</head>', `  <style>\n${css.content}\n</style>\n</head>`);
  }
  if (js) {
    // inject JS inline at end of body
    html = html.replace('</body>', `  <script>\n${js.content}\n</script>\n</body>`);
  }
  return html;
}

export async function exportAsZip(files, name = 'generated-app') {
  const zip = new JSZip();
  files.forEach(f => {
    zip.file(f.path, f.content);
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${name}.zip`);
}