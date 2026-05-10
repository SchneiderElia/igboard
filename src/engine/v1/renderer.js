import satori from 'satori';
import { html } from 'satori-html';

export async function renderV1(component, width, height) {
  // Nota: Questo è un esempio di base. 
  // In un caso reale, qui caricheremo i font necessari.
  const svg = await satori(component, {
    width,
    height,
  });

  return svg;
}
