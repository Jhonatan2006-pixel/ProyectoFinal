// Genera las imágenes base del ícono y del splash (1024/2732 px) a partir de SVG.
// Luego `npx capacitor-assets generate --android` crea todos los tamaños.
const sharp = require('sharp');

const fondo = `
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#4338ca"/>
  </linearGradient>`;

// Rostro + esquinas de escaneo + check, centrado en (512,512), cabe en un radio de ~300 px
const dibujo = `
  <g fill="none" stroke="#fff" stroke-width="34" stroke-linecap="round" stroke-linejoin="round">
    <path d="M300 370 V330 a30 30 0 0 1 30 -30 H370"/>
    <path d="M654 300 H694 a30 30 0 0 1 30 30 V370"/>
    <path d="M300 654 V694 a30 30 0 0 0 30 30 H370"/>
    <path d="M724 654 V694 a30 30 0 0 1 -30 30 H654"/>
    <ellipse cx="512" cy="500" rx="118" ry="140"/>
    <path d="M462 550 q50 40 100 0"/>
  </g>
  <g fill="#fff"><circle cx="470" cy="470" r="17"/><circle cx="554" cy="470" r="17"/></g>
  <circle cx="680" cy="680" r="74" fill="#22c55e" stroke="#fff" stroke-width="18"/>
  <path d="M645 682 l24 24 l44 -48" fill="none" stroke="#fff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>`;

const svg = (w, h, cuerpo) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${fondo}</defs>${cuerpo}</svg>`);
const centrado = (w, h, escala) => `<g transform="translate(${w / 2 - 512 * escala} ${h / 2 - 512 * escala}) scale(${escala})">${dibujo}</g>`;

(async () => {
  await sharp(svg(1024, 1024, `<rect width="1024" height="1024" fill="url(#g)"/>${centrado(1024, 1024, 1.25)}`)).png().toFile('assets/icon-only.png');
  await sharp(svg(1024, 1024, centrado(1024, 1024, 0.95))).png().toFile('assets/icon-foreground.png');
  await sharp(svg(1024, 1024, `<rect width="1024" height="1024" fill="url(#g)"/>`)).png().toFile('assets/icon-background.png');
  for (const n of ['splash', 'splash-dark']) {
    await sharp(svg(2732, 2732, `<rect width="2732" height="2732" fill="url(#g)"/>${centrado(2732, 2732, 1.4)}`)).png().toFile(`assets/${n}.png`);
  }
  console.log('listo');
})();
