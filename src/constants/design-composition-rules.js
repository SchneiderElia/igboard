// ═══════════════════════════════════════════════════════════════
// DESIGN COMPOSITION SYSTEM v1
// Il "manuale" di composizione grafica che l'AI deve seguire.
// Codifica le regole usate dai veri designer per posizionare
// elementi, scegliere icone, gestire lo spazio bianco.
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────
// 1. REGOLE DI COMPOSIZIONE (Standard editorialeI)
// ─────────────────────────────────────────
export const COMPOSITION_RULES = {
  // Come i veri design system (Material, HIG) strutturano un layout
  patterns: {
    'rule-of-thirds':  'Dividi il canvas 3x3. Posiziona gli elementi sulle intersezioni, mai al centro esatto.',
    'golden-section':  'Rapporto 1:1.618. Headline occupa il 61.8% dello spazio, body il 38.2%.',
    'z-pattern':       'Lettura a Z: elemento forte in alto-sx → dettaglio alto-dx → headline basso-sx → CTA basso-dx.',
    'f-pattern':       'Lettura a F: headline in alto, scan orizzontale, body a sinistra con indent decrescente.',
    'centered-axis':   'Tutto allineato sull\'asse centrale. Simmetria perfetta. Stile lapidare/monumentale.',
    'diagonal-tension':'Elementi posizionati lungo una diagonale invisibile. Crea movimento e dinamismo.',
    'bottom-heavy':    'Peso visivo concentrato nel terzo inferiore. Ampio respiro sopra. Stile poster.',
    'top-heavy':       'Headline dominante in alto, dettagli piccoli in basso. Stile testata giornale.',
  },

  // Rapporto tra font size degli slot
  typographyScale: {
    poster:    { headline: 1,    sub: 0.14, body: 0.09, cta: 0.10 }, // headline domina tutto
    editorial: { headline: 1,    sub: 0.25, body: 0.18, cta: 0.15 }, // gerarchia classica
    balanced:  { headline: 1,    sub: 0.35, body: 0.25, cta: 0.20 }, // tutto leggibile
    inverted:  { headline: 0.50, sub: 0.30, body: 1,    cta: 0.15 }, // body come protagonista
  },

  // Regole di spacing (multipli di 8px = grid baseline)
  spacing: {
    tight:   { gap: 8,  padding: 40 },
    normal:  { gap: 16, padding: 60 },
    relaxed: { gap: 24, padding: 80 },
    airy:    { gap: 40, padding: 100 },
    poster:  { gap: 8,  padding: 60 },  // gap stretto ma padding ampio
  },
};

// ─────────────────────────────────────────
// 2. ICONE DI SUPPORTO (SVG path data)
// L'AI può scegliere un'icona per arricchire il visual.
// ─────────────────────────────────────────
export const ICON_LIBRARY = {
  // Frecce e direzione
  arrow_right:    { path: 'M5 12h14m-7-7l7 7-7 7', viewBox: '0 0 24 24' },
  arrow_up:       { path: 'M12 19V5m-7 7l7-7 7 7', viewBox: '0 0 24 24' },
  arrow_diagonal: { path: 'M7 17L17 7m0 0H7m10 0v10', viewBox: '0 0 24 24' },

  // Comunicazione
  quote:          { path: 'M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4', viewBox: '0 0 24 24' },
  megaphone:      { path: 'M3 11l18-5v12L3 13v-2zm0 0v8h4v-6', viewBox: '0 0 24 24' },

  // Pensiero / Idea
  lightbulb:      { path: 'M9 18h6m-5 4h4M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17H8v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z', viewBox: '0 0 24 24' },
  brain:          { path: 'M12 2a5 5 0 015 5v2a5 5 0 01-3 4.58V18a2 2 0 01-4 0v-4.42A5 5 0 017 9V7a5 5 0 015-5z', viewBox: '0 0 24 24' },
  target:         { path: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-6a4 4 0 100-8 4 4 0 000 8zm0-2a2 2 0 100-4 2 2 0 000 4z', viewBox: '0 0 24 24' },

  // Crescita / Business
  trending_up:    { path: 'M22 7l-8.5 8.5-5-5L2 17', viewBox: '0 0 24 24' },
  bar_chart:      { path: 'M12 20V10m6 10V4M6 20v-4', viewBox: '0 0 24 24' },
  star:           { path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', viewBox: '0 0 24 24' },

  // Connessione / Social
  heart:          { path: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z', viewBox: '0 0 24 24' },
  users:          { path: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m22-2v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 7a4 4 0 100 8 4 4 0 000-8z', viewBox: '0 0 24 24' },
  link:           { path: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71', viewBox: '0 0 24 24' },

  // Tempo / Urgenza
  clock:          { path: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-14v4l3 3', viewBox: '0 0 24 24' },
  zap:            { path: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', viewBox: '0 0 24 24' },

  // Check / Stato
  check_circle:   { path: 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3', viewBox: '0 0 24 24' },
  alert_triangle: { path: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01', viewBox: '0 0 24 24' },

  // Geometriche pure (decorative)
  circle:         { path: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z', viewBox: '0 0 24 24' },
  square:         { path: 'M3 3h18v18H3z', viewBox: '0 0 24 24' },
  triangle:       { path: 'M12 2l10 18H2L12 2z', viewBox: '0 0 24 24' },
  diamond:        { path: 'M12 2l10 10-10 10L2 12 12 2z', viewBox: '0 0 24 24' },
  plus:           { path: 'M12 5v14m-7-7h14', viewBox: '0 0 24 24' },
  cross:          { path: 'M18 6L6 18M6 6l12 12', viewBox: '0 0 24 24' },
};

export const AVAILABLE_ICONS = Object.keys(ICON_LIBRARY);

// ─────────────────────────────────────────
// 3. STILI GRAFICI (come applicare le regole)
// ─────────────────────────────────────────
export const GRAPHIC_STYLES = {
  editorial: {
    description: 'Stile rivista: gerarchia chiara, serif per headline, sans per body. Decoratori sottili.',
    iconStyle: 'Icone grandi (80-120px), outline thin (strokeWidth 1.5), posizionate come punto focale.',
    decoratorStyle: 'Barre sottili, cornici eleganti, accent discreto. Mai sopra il testo.',
    colorApproach: 'Palette raffinata: 2 colori + accent. Mai più di 3 colori.',
  },
  minimal: {
    description: 'Riduzione all\'essenziale: tanto spazio bianco, pochi elementi.',
    iconStyle: 'Icone piccole (40-60px), outline ultrathin (strokeWidth 1), come accento decorativo.',
    decoratorStyle: 'Singola linea o singolo punto. Meno è meglio.',
    colorApproach: 'Monocromatico o bicolore. Mai vivace.',
  },
  brutalist: {
    description: 'Impatto grezzo: contrasti forti, elementi sovrapposti, font enormi.',
    iconStyle: 'Icone enormi (150-300px), fill o stroke spesso (strokeWidth 3), usate come sfondo.',
    decoratorStyle: 'Blocchi pieni, barre spesse, forme geometriche pesanti.',
    colorApproach: 'Contrasto violento: nero/bianco + singolo colore saturo.',
  },
  geometric: {
    description: 'Forme pure: cerchi, quadrati, linee. Griglia rigida.',
    iconStyle: 'Solo forme geometriche pure (circle, square, triangle, diamond). Mai icone figurative.',
    decoratorStyle: 'Grid visibile, blocchi colorati, linee di costruzione.',
    colorApproach: 'Colori primari o monocromo. Palette Bauhaus.',
  },
};

// ─────────────────────────────────────────
// 4. PROMPT HELPER: genera il contesto per l'AI
// ─────────────────────────────────────────
export function getCompositionContext(templateFamily) {
  const style = GRAPHIC_STYLES[templateFamily] || GRAPHIC_STYLES.editorial;
  return `
STILE GRAFICO: ${templateFamily.toUpperCase()}
${style.description}
- ICONE: ${style.iconStyle}
- DECORATORI: ${style.decoratorStyle}
- COLORI: ${style.colorApproach}

REGOLE DI COMPOSIZIONE DA SEGUIRE:
- Ogni layout deve seguire almeno UNO dei pattern classici: ${Object.keys(COMPOSITION_RULES.patterns).join(', ')}.
- La gerarchia tipografica deve rispettare uno dei modelli: poster, editorial, balanced, inverted.
- Lo spacing deve usare multipli di 8px.
- ICONE DI SUPPORTO: Se il contenuto ha un tema chiaro (business, crescita, amore, tempo, idea...), PUOI aggiungere un'icona di supporto.
  Icone disponibili: ${AVAILABLE_ICONS.join(', ')}.
  L'icona va posizionata come elemento decorativo, MAI al centro del testo.
`;
}
