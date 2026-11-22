const viewport = '0 0 960 540';

function coordinate(value) {
  return Math.round(value * 10) / 10;
}

function point(x, y) {
  return `${coordinate(x)} ${coordinate(y)}`;
}

function streaks() {
  const segments = [];
  for (let row = 0; row < 13; row++) {
    for (let column = 0; column < 21; column++) {
      if ((row * 13 + column * 7) % 11 < 3) continue;
      const phase = row * 1.7 + column * 2.3;
      const x = 17 + column * 46 + Math.sin(phase * 2) * 16;
      const y = 15 + row * 43 + Math.cos(phase * 3) * 14;
      const angle = Math.atan2(y - 265, x - 590) + Math.sin(phase) * 0.46;
      const length = 3 + 5 * (1 + Math.cos(phase * 2.8)) / 2;
      segments.push(`M${point(x, y)}l${point(Math.cos(angle) * length, Math.sin(angle) * length)}`);
    }
  }
  return `<path stroke-width="2.2" d="${segments.join('')}"/>`;
}

function contours() {
  const basins = [
    { x: 160, y: 88, stepX: 30, stepY: 22, phase: 0.8, count: 10 },
    { x: 755, y: 314, stepX: 29, stepY: 19, phase: 2.4, count: 12 },
    { x: 207, y: 610, stepX: 33, stepY: 18, phase: 4.2, count: 8 },
  ];
  return basins.flatMap(({ x, y, stepX, stepY, phase, count }) => {
    return Array.from({ length: count }, (_, index) => {
      const ring = index + 1;
      const points = Array.from({ length: 72 }, (_, sample) => {
        const angle = sample * Math.PI / 36;
        const variation = 1 + 0.14 * Math.cos(3 * angle + phase) + 0.08 * Math.sin(5 * angle + ring * 0.2);
        return point(x + ring * 4 + stepX * ring * Math.cos(angle) * variation,
          y - ring * 3 + stepY * ring * Math.sin(angle) * variation);
      });
      return `<path stroke-width="${ring % 4 === 0 ? 1.7 : 0.95}" d="M${points.join('L')}Z"/>`;
    });
  }).join('');
}

function dottedWaves() {
  const paths = Array.from({ length: 43 }, (_, index) => {
    const x = index * 29 - 125;
    const bend = 54 + 27 * Math.sin(index * 0.42);
    return `<path d="M${x} -20 C${x + bend} 80 ${x - bend} 145 ${x - 38} 244 S${x + bend} 360 ${x - 5} 428 S${x - bend} 510 ${x + 18} 563"/>`;
  }).join('');
  return `<g stroke-width="2.1" stroke-dasharray="0.2 7.5">${paths}</g>`;
}

function instrument() {
  const crosses = [[85, 142], [895, 152], [780, 424], [178, 441]].map(([x, y]) => {
    return `<path d="M${x - 9} ${y}h18 M${x} ${y - 9}v18"/>`;
  }).join('');
  const ticks = [0, 15, 32, 52, 74, 91, 109, 132].map((offset, index) => {
    const height = index % 3 === 0 ? 27 : 14;
    return `<path d="M${offset + 38} 484v${height} M${919 - offset} 31v${height}"/>`;
  }).join('');
  return `
    <path stroke-width="1.5" d="M-20 91 Q445 329 989 -51 M-35 490 Q538 192 1005 374"/>
    <path stroke-width="0.8" stroke-dasharray="4 8" d="M-20 109 Q445 347 989 -33 M-35 508 Q538 210 1005 392"/>
    <g stroke-width="1.4">${crosses}${ticks}</g>
    <path stroke-width="1.5" d="M35 79V40h44 M925 445v47h-40 M34 367h54 M884 275h44"/>
    <circle cx="178" cy="441" r="16" stroke-width="0.9"/>
    <circle cx="780" cy="424" r="16" stroke-width="0.9"/>
    <path fill="black" stroke="none" d="M44 381h17v8H44z M66 381h31v8H66z M874 292h13v7h-13z M892 292h27v7h-27z"/>
  `;
}

const patterns = { streaks, contours, 'dotted-waves': dottedWaves, instrument };

function maskImage(shapes) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewport}" fill="none" stroke="black" stroke-linejoin="round" stroke-linecap="round">${shapes}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function textureStyles(html) {
  const requested = new Set();
  for (const [, doubleQuoted, singleQuoted, unquoted] of html.matchAll(/\bdata-release-texture\s*=\s*(?:"([\w-]+)"|'([\w-]+)'|([\w-]+)(?=[\s/>]|$))/gi)) {
    const name = doubleQuoted ?? singleQuoted ?? unquoted;
    if (Object.hasOwn(patterns, name)) requested.add(name);
  }
  if (!requested.size) return '';

  const selectors = [...requested].map((name) => `[data-release-texture="${name}"]`);
  const assets = [...requested].map((name) => {
    return `[data-release-texture="${name}"] { --release-texture-mask: ${maskImage(patterns[name]())}; }`;
  }).join('\n');
  return `
${selectors.join(',\n')} {
  position: relative;
  isolation: isolate;
}
${selectors.map((selector) => `${selector}::before`).join(',\n')} {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  pointer-events: none;
  background-color: var(--release-texture-color, var(--color-primary, currentColor));
  opacity: var(--release-texture-opacity, 0.23);
  mask-image: var(--release-texture-mask), radial-gradient(ellipse at var(--release-texture-clear-x, 32%) var(--release-texture-clear-y, 45%), transparent 7%, #0005 35%, #000 78%);
  mask-composite: intersect;
  mask-position: center;
  mask-size: cover, 100% 100%;
  mask-repeat: no-repeat;
}
${assets}`;
}
