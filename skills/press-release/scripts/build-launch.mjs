import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { textureStyles } from '../assets/textures.mjs';

const toolchain = ['tailwindcss@4.3.5', '@tailwindcss/cli@4.3.5', 'daisyui@5.8.2'];
const body = { pkg: 'source-sans-3', version: '5.3.1', family: 'Source Sans 3', style: 'normal', weight: '200 900' };
const display = {
  product: { pkg: 'google-sans-flex', version: '5.3.2', family: 'Google Sans Flex', style: 'normal', weight: '100 900' },
  editorial: { pkg: 'fraunces', version: '5.3.0', family: 'Fraunces', style: 'normal', weight: '100 900' },
};
const styleMarker = '<!-- release:styles -->';
const usage = 'Usage: node build-launch.mjs source.html release.html [product|editorial]';

function fontPackage(font) {
  return `@fontsource-variable/${font.pkg}`;
}

function fontFace(modules, font) {
  const file = join(modules, fontPackage(font), 'files', `${font.pkg}-latin-wght-${font.style}.woff2`);
  const data = readFileSync(file).toString('base64');
  return `@font-face{font-family:"${font.family}";font-style:${font.style};font-weight:${font.weight};font-display:swap;src:url(data:font/woff2;base64,${data}) format("woff2");}`;
}

function build(sourcePath, outputPath, preset) {
  const source = resolve(sourcePath);
  const output = resolve(outputPath);
  if (source === output) throw new Error('Choose a separate path for the finished release.');
  const html = readFileSync(source, 'utf8');
  if (html.split(styleMarker).length !== 2) throw new Error(`The source needs one ${styleMarker} inside its head.`);

  const heading = display[preset];
  const fonts = [heading, body];
  if (preset === 'editorial') fonts.push({ ...heading, style: 'italic' });
  const temporary = mkdtempSync(join(tmpdir(), 'ayanostack-release-'));
  try {
    const packages = [...toolchain, ...[...new Set(fonts.map(font => `${fontPackage(font)}@${font.version}`))]];
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    execFileSync(npm, ['install', '--no-save', '--no-package-lock', '--ignore-scripts', '--no-audit', '--no-fund', '--prefer-offline', ...packages], {
      cwd: temporary,
      shell: process.platform === 'win32',
      stdio: 'inherit',
    });

    const modules = join(temporary, 'node_modules');
    const displayFallback = preset === 'editorial' ? 'ui-serif, Georgia, serif' : 'ui-sans-serif, system-ui, sans-serif';
    writeFileSync(join(temporary, 'source.html'), html);
    writeFileSync(join(temporary, 'input.css'), `
@import "tailwindcss" source(none);
@source "./source.html";
@plugin "daisyui" { themes: light --default; logs: false; }
@theme {
  --font-display: "${heading.family}", ${displayFallback};
  --font-body: "${body.family}", ui-sans-serif, system-ui, sans-serif;
}
`);
    execFileSync(process.execPath, [join(modules, '@tailwindcss/cli/dist/index.mjs'), '--input', 'input.css', '--output', 'output.css', '--minify'], {
      cwd: temporary,
      stdio: 'inherit',
    });

    const styles = readFileSync(join(temporary, 'output.css'), 'utf8');
    if (/<\/style/i.test(styles)) throw new Error('Generated CSS contains an HTML style closing tag.');
    const licenses = ['tailwindcss', 'daisyui', ...new Set(fonts.map(fontPackage))].map((pkg) => {
      return `${pkg}\n${readFileSync(join(modules, pkg, 'LICENSE'), 'utf8').trim()}`;
    }).join('\n\n');
    const embedded = `<!-- Third-party notices\n${licenses}\n-->\n<style>\n${fonts.map(font => fontFace(modules, font)).join('\n')}\n${styles}\n${textureStyles(html)}\n</style>`;
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, html.replace(styleMarker, () => embedded));
    process.stdout.write(`${output}\n`);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

const args = process.argv.slice(2);
const [source, output, preset = 'product'] = args;
if (args.includes('--help')) {
  process.stdout.write(`${usage}\n`);
} else if (!source || !output || args.length > 3 || !Object.hasOwn(display, preset)) {
  process.stderr.write(`${usage}\n`);
  process.exitCode = 1;
} else {
  try {
    build(source, output, preset);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
