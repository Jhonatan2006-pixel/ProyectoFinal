/**
 * Convierte una foto (por su ruta web) a JPEG en Base64, reduciéndola para
 * que el lado más grande mida como máximo `maxLado` píxeles.
 *
 * ¿Por qué reducirla? Rekognition no necesita fotos enormes y así el
 * request a la Lambda compareFaces pesa ~50-100 KB en lugar de varios MB.
 *
 * Devuelve SOLO el texto Base64 (sin el prefijo "data:image/jpeg;base64,").
 */
export async function fotoABase64(webPath: string, maxLado = 800): Promise<string> {
  const img = await cargarImagen(webPath);

  const escala = Math.min(1, maxLado / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * escala);
  canvas.height = Math.round(img.height * escala);
  canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  return dataUrl.split(',')[1];
}

function cargarImagen(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('No se pudo leer la foto'));
    img.src = src;
  });
}

/** Agrega el prefijo necesario para mostrar un Base64 en una etiqueta <img>. */
export function base64AUrl(base64: string): string {
  return `data:image/jpeg;base64,${base64}`;
}
