const esbuild = require('esbuild');
const fs = require('fs');

async function build() {
  // Build the plugin code (backend)
  await esbuild.build({
    entryPoints: ['src/plugin/code.ts'],
    bundle: true,
    outfile: 'dist/code.js',
    target: 'es6',
  });

  // Build the UI code (frontend)
  await esbuild.build({
    entryPoints: ['src/ui/ui.ts'],
    bundle: true,
    outfile: 'dist/ui.js',
    target: 'es6',
  });

  // Bundle UI CSS (if any)
  await esbuild.build({
    entryPoints: ['src/ui/ui.css'],
    bundle: true,
    outfile: 'dist/ui.css',
    minify: true,
  }).catch(() => {}); // ignore error if CSS doesn't exist yet

  // Combine UI HTML, JS, and CSS into a single ui.html
  let html = fs.readFileSync('src/ui/ui.html', 'utf8');
  let js = '';
  let css = '';
  try { js = fs.readFileSync('dist/ui.js', 'utf8'); } catch (e) {}
  try { css = fs.readFileSync('dist/ui.css', 'utf8'); } catch (e) {}
  
  const finalHtml = `
    <style>${css}</style>
    ${html}
    <script>${js}</script>
  `;
  
  fs.writeFileSync('dist/ui.html', finalHtml);
  console.log('Build complete');
}

build();
