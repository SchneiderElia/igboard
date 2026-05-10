// ═══════════════════════════════════════════════════════════════
// DESIGN MASTER GRIDS v3 — Content-Aware Layout Engine
// ═══════════════════════════════════════════════════════════════
// Ogni template definisce:
// - `type`: pattern Flexbox (column/cover/split/centered)
// - `textFit`: array di classi di testo supportate (short/medium/long)
// - `decorators`: elementi grafici in absolute (barre, blocchi, cornici)
//
// Il server analizza la lunghezza del testo in ingresso e filtra
// i template compatibili PRIMA di scegliere. Così un testo breve
// non finirà mai in un layout pensato per testi lunghi e viceversa.
//
// CLASSI DI TESTO:
// - "short"  → < 200 caratteri (headline pura, statement)
// - "medium" → 200–500 caratteri (headline + sub + body breve)
// - "long"   → > 500 caratteri (articolo, lista punti, paragrafi)
// ═══════════════════════════════════════════════════════════════

export const DESIGN_MASTER_GRIDS = {

  // ─────────────────────────────────────────
  //  COVER (3 zone: top / center / bottom)
  // ─────────────────────────────────────────
  vogue_cover: {
    family: 'editorial',
    type: 'cover',
    textFit: ['medium', 'long'],
    description: 'Cover editoriale: subheadline in alto a destra, headline centrata dominante, body e CTA in basso.',
    container: { padding: '60px 80px' },
    topZone:    { justify: 'flex-end' },
    centerZone: { justify: 'center', align: 'center' },
    bottomZone: { direction: 'row', justify: 'space-between', align: 'flex-end' },
    headline:    { baseFontSize: 160, align: 'center', fontWeight: 900 },
    subheadline: { baseFontSize: 28, align: 'right', maxWidth: '50%', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.3em' },
    body:        { baseFontSize: 24, align: 'left', maxWidth: '55%', fontWeight: 300 },
    cta:         { baseFontSize: 30, align: 'right', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' },
    decorators: [
      { type: 'bar', useAccent: true, opacity: 0.12, bottom: '0', left: '0', width: '100%', height: '180px' },
    ],
  },

  vogue_cover_mirrored: {
    family: 'editorial',
    type: 'cover',
    textFit: ['medium', 'long'],
    description: 'Cover speculare: subheadline in alto a sinistra, CTA in basso a sinistra.',
    container: { padding: '60px 80px' },
    topZone:    { justify: 'flex-start' },
    centerZone: { justify: 'center', align: 'center' },
    bottomZone: { direction: 'row-reverse', justify: 'space-between', align: 'flex-end' },
    headline:    { baseFontSize: 160, align: 'center', fontWeight: 900 },
    subheadline: { baseFontSize: 28, align: 'left', maxWidth: '50%', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.3em' },
    body:        { baseFontSize: 24, align: 'right', maxWidth: '55%', fontWeight: 300 },
    cta:         { baseFontSize: 30, align: 'left', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' },
    decorators: [
      { type: 'bar', useAccent: true, opacity: 0.12, top: '0', left: '0', width: '100%', height: '180px' },
    ],
  },

  // ─────────────────────────────────────────
  //  COLUMN (stack verticale naturale)
  // ─────────────────────────────────────────
  koto_minimal: {
    family: 'editorial',
    type: 'column',
    textFit: ['medium', 'long'],
    description: 'Minimal con forte gerarchia verticale discendente.',
    container: { padding: '80px', gap: '28px', justify: 'flex-start', align: 'flex-start' },
    headline:    { baseFontSize: 130, align: 'left', maxWidth: '85%', fontWeight: 800, flex: '0 0 auto' },
    subheadline: { baseFontSize: 38, align: 'left', maxWidth: '70%', fontWeight: 500, borderLeft: true, flex: '0 0 auto' },
    body:        { baseFontSize: 28, align: 'left', maxWidth: '75%', fontWeight: 400, flex: '1 1 auto' },
    cta:         { baseFontSize: 32, align: 'left', fontWeight: 700, textTransform: 'uppercase', flex: '0 0 auto' },
  },

  editorial_stacked: {
    family: 'editorial',
    type: 'column',
    textFit: ['medium', 'long'],
    description: 'Discesa verticale pulita, tutto a sinistra. Stile Kinfolk/Cereal.',
    container: { padding: '80px', gap: '20px', justify: 'flex-start', align: 'flex-start' },
    headline:    { baseFontSize: 140, align: 'left', maxWidth: '90%', fontWeight: 700, flex: '0 0 auto' },
    subheadline: { baseFontSize: 34, align: 'left', maxWidth: '75%', fontWeight: 400, flex: '0 0 auto' },
    body:        { baseFontSize: 26, align: 'left', maxWidth: '75%', fontWeight: 300, flex: '1 1 auto' },
    cta:         { baseFontSize: 22, align: 'left', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', flex: '0 0 auto' },
  },

  editorial_stacked_bottom: {
    family: 'editorial',
    type: 'column',
    textFit: ['medium', 'long'],
    description: 'Come stacked ma tutto ancorato in basso. Headline + sub + body dal fondo del canvas.',
    container: { padding: '80px', gap: '20px', justify: 'flex-end', align: 'flex-start' },
    headline:    { baseFontSize: 140, align: 'left', maxWidth: '90%', fontWeight: 700, flex: '0 0 auto' },
    subheadline: { baseFontSize: 34, align: 'left', maxWidth: '75%', fontWeight: 400, flex: '0 0 auto' },
    body:        { baseFontSize: 26, align: 'left', maxWidth: '75%', fontWeight: 300, flex: '0 0 auto' },
    cta:         { baseFontSize: 22, align: 'left', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', flex: '0 0 auto' },
  },

  editorial_poster: {
    family: 'editorial',
    type: 'column',
    textFit: ['short', 'medium'],
    description: 'Poster cinematografico: subheadline in alto piccola, body centrale, headline ENORME in basso.',
    container: { padding: '60px 80px', gap: '16px', justify: 'flex-start', align: 'flex-start', reverse: true },
    headline:    { baseFontSize: 180, align: 'left', maxWidth: '95%', fontWeight: 900, flex: '0 0 auto' },
    subheadline: { baseFontSize: 20, align: 'left', maxWidth: '60%', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3em', flex: '0 0 auto' },
    body:        { baseFontSize: 28, align: 'left', maxWidth: '65%', fontWeight: 400, flex: '1 1 auto' },
    cta:         { baseFontSize: 18, align: 'right', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', flex: '0 0 auto' },
  },

  // ─────────────────────────────────────────
  //  CENTERED (headline dominante, tutto centrato)
  // ─────────────────────────────────────────
  editorial_statement: {
    family: 'editorial',
    type: 'centered',
    textFit: ['short'],
    description: 'Massimo impatto ARTISTICO: headline gigante centrata, tutto il resto quasi invisibile. Solo per titoli brevi (2-3 parole).',
    container: { padding: '60px 80px' },
    headline:    { baseFontSize: 200, align: 'center', fontWeight: 900 },
    subheadline: { baseFontSize: 26, align: 'center', fontWeight: 300, maxWidth: '70%' },
    body:        { baseFontSize: 16, align: 'center', fontWeight: 300, maxWidth: '60%', opacity: 0.4 },
    cta:         { baseFontSize: 18, align: 'center', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.25em' },
  },

  // Poster puro: solo headline centrata + grafica decorativa
  poster_pure: {
    family: 'editorial',
    type: 'centered',
    textFit: ['short'],
    description: 'Poster puro: headline enorme centrata, tutto il resto nullo. La grafica decorativa fa il design.',
    container: { padding: '60px 80px' },
    headline:    { baseFontSize: 220, align: 'center', fontWeight: 900, textTransform: 'uppercase' },
    subheadline: { baseFontSize: 22, align: 'center', fontWeight: 300, maxWidth: '50%', opacity: 0.5 },
    body:        { baseFontSize: 14, align: 'center', fontWeight: 300, maxWidth: '50%', opacity: 0.3 },
    cta:         { baseFontSize: 16, align: 'center', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3em', opacity: 0.5 },
    decorators: [
      { type: 'block', useAccent: true, opacity: 0.08, top: '0', left: '0', width: '100%', height: '35%' },
      { type: 'bar', useAccent: true, opacity: 1, bottom: '100px', left: '35%', width: '30%', height: '6px' },
      { type: 'circle', useAccent: true, opacity: 0.04, top: '25%', left: '65%', size: '600px' },
    ],
  },

  // Poster bottom: headline ancorata in basso con barra
  poster_bottom: {
    family: 'editorial',
    type: 'column',
    textFit: ['short'],
    description: 'Headline enorme in basso, barra accent orizzontale. Massimo vuoto sopra = massimo impatto.',
    container: { padding: '60px 80px', gap: '16px', justify: 'flex-end', align: 'flex-start' },
    headline:    { baseFontSize: 200, align: 'left', maxWidth: '90%', fontWeight: 900, textTransform: 'uppercase', flex: '0 0 auto' },
    subheadline: { baseFontSize: 22, align: 'left', maxWidth: '60%', fontWeight: 400, opacity: 0.6, flex: '0 0 auto' },
    body:        { baseFontSize: 14, align: 'left', maxWidth: '50%', fontWeight: 300, opacity: 0.3, flex: '0 0 auto' },
    cta:         { baseFontSize: 16, align: 'left', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5, flex: '0 0 auto' },
    decorators: [
      { type: 'bar', useAccent: true, opacity: 1, top: '55%', left: '0', width: '60%', height: '8px' },
      { type: 'bar', useAccent: true, opacity: 0.08, top: '0', left: '0', width: '100%', height: '50%' },
    ],
  },

  editorial_elegant: {
    family: 'editorial',
    type: 'centered',
    textFit: ['short', 'medium'],
    description: 'Centrato perfetto e bilanciato: headline, subheadline e body con respiro uniforme.',
    container: { padding: '80px 100px' },
    headline:    { baseFontSize: 110, align: 'center', fontWeight: 800, maxWidth: '85%' },
    subheadline: { baseFontSize: 32, align: 'center', fontWeight: 400, maxWidth: '75%' },
    body:        { baseFontSize: 22, align: 'center', fontWeight: 300, maxWidth: '70%', opacity: 0.7 },
    cta:         { baseFontSize: 20, align: 'center', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' },
  },

  muji_void: {
    family: 'minimal',
    type: 'centered',
    textFit: ['short'],
    description: 'Vuoto zen: headline sottile centrata, massimo respiro.',
    container: { padding: '80px' },
    headline:    { baseFontSize: 80, align: 'center', fontWeight: 300, letterSpacing: '0.1em' },
    subheadline: { baseFontSize: 24, align: 'center', fontWeight: 400, maxWidth: '65%', opacity: 0.7 },
    body:        { baseFontSize: 16, align: 'center', fontWeight: 300, maxWidth: '55%', opacity: 0.5 },
    cta:         { baseFontSize: 16, align: 'center', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3em' },
  },

  // ─────────────────────────────────────────
  //  SPLIT (2 colonne affiancate)
  // ─────────────────────────────────────────
  editorial_split: {
    family: 'editorial',
    type: 'split',
    textFit: ['medium', 'long'],
    description: 'Split verticale 50/50: headline a sinistra, body e sub a destra. Stile magazine spread.',
    container: { padding: '60px', gap: '40px' },
    leftWidth: '50%',
    rightWidth: '50%',
    leftContains: ['headline'],
    rightContains: ['subheadline', 'body', 'cta'],
    leftAlign: 'flex-start',
    rightAlign: 'flex-start',
    headline:    { baseFontSize: 120, align: 'left', fontWeight: 800 },
    subheadline: { baseFontSize: 32, align: 'left', fontWeight: 500 },
    body:        { baseFontSize: 24, align: 'left', fontWeight: 400 },
    cta:         { baseFontSize: 22, align: 'right', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' },
  },

  editorial_asymmetric: {
    family: 'editorial',
    type: 'split',
    textFit: ['medium', 'long'],
    description: 'Tensione visiva: headline decentrata a destra, body a sinistra. Stile catalogo d\'arte.',
    container: { padding: '60px 80px', gap: '40px' },
    leftWidth: '35%',
    rightWidth: '60%',
    leftContains: ['body', 'cta'],
    rightContains: ['headline', 'subheadline'],
    leftAlign: 'flex-start',
    rightAlign: 'flex-end',
    headline:    { baseFontSize: 130, align: 'right', fontWeight: 800 },
    subheadline: { baseFontSize: 28, align: 'right', fontWeight: 400 },
    body:        { baseFontSize: 22, align: 'left', fontWeight: 300 },
    cta:         { baseFontSize: 18, align: 'left', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' },
  },

  editorial_diagonal: {
    family: 'editorial',
    type: 'split',
    textFit: ['medium', 'long'],
    description: 'Composizione diagonale: headline in alto a sinistra, body in basso a destra.',
    container: { padding: '60px 80px', gap: '40px' },
    leftWidth: '55%',
    rightWidth: '40%',
    leftContains: ['headline'],
    rightContains: ['subheadline', 'body', 'cta'],
    leftAlign: 'flex-start',
    leftJustify: 'flex-start',
    rightAlign: 'flex-end',
    rightJustify: 'flex-end',
    headline:    { baseFontSize: 140, align: 'left', fontWeight: 900 },
    subheadline: { baseFontSize: 24, align: 'right', fontWeight: 400 },
    body:        { baseFontSize: 22, align: 'right', fontWeight: 300 },
    cta:         { baseFontSize: 18, align: 'right', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' },
  },

  editorial_diagonal_mirrored: {
    family: 'editorial',
    type: 'split',
    textFit: ['medium', 'long'],
    description: 'Diagonale speculare: body in alto a destra, headline in basso a sinistra.',
    container: { padding: '60px 80px', gap: '40px' },
    leftWidth: '55%',
    rightWidth: '40%',
    leftContains: ['headline'],
    rightContains: ['subheadline', 'body', 'cta'],
    leftAlign: 'flex-start',
    leftJustify: 'flex-end',
    rightAlign: 'flex-end',
    rightJustify: 'flex-start',
    headline:    { baseFontSize: 140, align: 'left', fontWeight: 900 },
    subheadline: { baseFontSize: 24, align: 'right', fontWeight: 400 },
    body:        { baseFontSize: 22, align: 'right', fontWeight: 300 },
    cta:         { baseFontSize: 18, align: 'right', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' },
  },

  bauhaus_structure: {
    family: 'geometric',
    type: 'split',
    textFit: ['medium', 'long'],
    description: 'Griglia Bauhaus con divisioni geometriche. Headline a sinistra, body a destra.',
    container: { padding: '60px', gap: '0px', border: true },
    leftWidth: '45%',
    rightWidth: '55%',
    leftContains: ['headline'],
    rightContains: ['subheadline', 'body', 'cta'],
    leftAlign: 'flex-end',
    rightAlign: 'flex-start',
    divider: true,
    headline:    { baseFontSize: 140, align: 'left', fontWeight: 900, textTransform: 'uppercase' },
    subheadline: { baseFontSize: 32, align: 'left', fontWeight: 700, textTransform: 'uppercase' },
    body:        { baseFontSize: 24, align: 'justify', fontWeight: 400 },
    cta:         { baseFontSize: 36, align: 'right', fontWeight: 900, textTransform: 'uppercase' },
    decorators: [
      { type: 'bar', useAccent: true, top: '0', left: '0', width: '45%', height: '12px' },
      { type: 'bar', useAccent: true, bottom: '0', right: '0', width: '55%', height: '12px' },
    ],
  },

  // ─────────────────────────────────────────
  //  GEOMETRICHE / SPERIMENTALI
  // ─────────────────────────────────────────

  // Poster museale: griglia svizzera con blocchi decorativi grigi
  museum_poster: {
    family: 'geometric',
    type: 'column',
    textFit: ['short', 'medium'],
    description: 'Poster museale stile 21erHaus: blocchi grigi strutturali, headline enorme in basso-sinistra, CTA come data evento.',
    container: { padding: '80px 60px 60px 60px', gap: '24px', justify: 'flex-end', align: 'flex-start' },
    headline:    { baseFontSize: 180, align: 'left', maxWidth: '80%', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', flex: '0 0 auto' },
    subheadline: { baseFontSize: 28, align: 'left', maxWidth: '70%', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', flex: '0 0 auto' },
    body:        { baseFontSize: 18, align: 'left', maxWidth: '60%', fontWeight: 400, flex: '0 0 auto' },
    cta:         { baseFontSize: 22, align: 'left', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', flex: '0 0 auto' },
    decorators: [
      // Blocchi grigi strutturali (effetto poster da galleria)
      { type: 'block', color: '#d0d0d0', opacity: 1, top: '60px', right: '60px', left: 'auto', width: '35%', height: '28%' },
      { type: 'block', color: '#d0d0d0', opacity: 1, top: '60px', left: '38%', width: '18%', height: '28%' },
      { type: 'block', color: '#d0d0d0', opacity: 1, top: '32%', right: '60px', left: 'auto', width: '53%', height: '22%' },
      // Barra accento in basso
      { type: 'bar', useAccent: true, bottom: '0', left: '0', width: '100%', height: '8px' },
      // Linea accento verticale sinistra
      { type: 'bar', useAccent: true, opacity: 0.15, top: '0', left: '0', width: '8px', height: '100%' },
    ],
  },
  swiss_grid_strict: {
    family: 'geometric',
    type: 'column',
    textFit: ['medium', 'long'],
    description: 'Griglia svizzera rigorosa con linee orizzontali di separazione.',
    container: { padding: '60px 80px', gap: '24px', justify: 'flex-start', align: 'flex-start' },
    topBorder: true,
    headline:    { baseFontSize: 140, align: 'left', maxWidth: '95%', fontWeight: 800, letterSpacing: '-0.03em', flex: '0 0 auto' },
    subheadline: { baseFontSize: 40, align: 'left', maxWidth: '70%', fontWeight: 600, flex: '0 0 auto' },
    body:        { baseFontSize: 24, align: 'left', maxWidth: '55%', fontWeight: 400, flex: '1 1 auto', topBorder: true },
    cta:         { baseFontSize: 30, align: 'left', fontWeight: 700, flex: '0 0 auto' },
    decorators: [
      { type: 'block', useAccent: true, opacity: 0.06, top: '0', right: '0', left: 'auto', width: '35%', height: '100%' },
    ],
  },

  carson_chaos: {
    family: 'experimental',
    type: 'centered',
    textFit: ['short', 'medium'],
    description: 'Chaos controllato. Headline enorme centrata con rotazione leggera.',
    container: { padding: '40px 60px' },
    headline:    { baseFontSize: 200, align: 'center', fontWeight: 900, textTransform: 'uppercase', rotate: -3 },
    subheadline: { baseFontSize: 50, align: 'right', fontWeight: 800, textTransform: 'uppercase', maxWidth: '60%', rotate: 3, opacity: 0.8 },
    body:        { baseFontSize: 30, align: 'left', fontWeight: 700, textTransform: 'uppercase', maxWidth: '50%' },
    cta:         { baseFontSize: 40, align: 'left', fontWeight: 900, textTransform: 'uppercase', invertColors: true, rotate: -12 },
    decorators: [
      { type: 'bar', useAccent: true, opacity: 0.2, top: '30%', left: '0', width: '100%', height: '200px' },
      { type: 'circle', useAccent: true, opacity: 0.06, top: '20%', left: '80%', size: '500px' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  //  PREMIUM TEMPLATES (Elementi grafici avanzati)
  // ═══════════════════════════════════════════════════════════════

  magazine_cover: {
    family: 'editorial',
    type: 'split',
    textFit: ['medium', 'long'],
    description: 'Cover da rivista: blocco accento laterale, headline sovrapposta, stile SHIFT/Monocle.',
    container: { padding: '80px', gap: '30px' },
    leftWidth: '55%',
    rightWidth: '40%',
    leftContains: ['headline'],
    rightContains: ['subheadline', 'body', 'cta'],
    leftAlign: 'flex-start',
    leftJustify: 'flex-end',
    rightAlign: 'flex-start',
    rightJustify: 'flex-end',
    headline:    { baseFontSize: 150, align: 'left', fontWeight: 900, textTransform: 'uppercase' },
    subheadline: { baseFontSize: 22, align: 'left', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.2em' },
    body:        { baseFontSize: 22, align: 'left', fontWeight: 300 },
    cta:         { baseFontSize: 18, align: 'left', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' },
    decorators: [
      { type: 'block', useAccent: true, opacity: 1, top: '0', right: '0', left: 'auto', width: '120px', height: '100%' },
      { type: 'bar', useAccent: true, opacity: 0.15, top: '0', left: '0', width: '100%', height: '45%' },
      { type: 'bar', useAccent: true, opacity: 1, bottom: '140px', left: '80px', width: '200px', height: '6px' },
    ],
  },

  editorial_framed: {
    family: 'editorial',
    type: 'centered',
    textFit: ['short', 'medium'],
    description: 'Cornice elegante: bordo spesso colorato attorno al canvas, contenuto centrato. Stile gallery.',
    container: { padding: '100px 120px' },
    headline:    { baseFontSize: 120, align: 'center', fontWeight: 800, maxWidth: '85%' },
    subheadline: { baseFontSize: 28, align: 'center', fontWeight: 400, maxWidth: '70%' },
    body:        { baseFontSize: 20, align: 'center', fontWeight: 300, maxWidth: '65%', opacity: 0.7 },
    cta:         { baseFontSize: 18, align: 'center', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' },
    decorators: [
      { type: 'frame', useAccent: true, inset: '35px', thickness: '5px', opacity: 0.4 },
      { type: 'frame', useAccent: true, inset: '45px', thickness: '1px', opacity: 0.15 },
    ],
  },

  editorial_bold_block: {
    family: 'editorial',
    type: 'column',
    textFit: ['medium', 'long'],
    description: 'Blocco visivo forte: rettangolo accent colorato domina il lato sinistro. Headline a destra.',
    container: { padding: '80px 80px 80px 200px', gap: '20px', justify: 'center', align: 'flex-start' },
    headline:    { baseFontSize: 130, align: 'left', maxWidth: '90%', fontWeight: 800, flex: '0 0 auto' },
    subheadline: { baseFontSize: 30, align: 'left', maxWidth: '80%', fontWeight: 400, flex: '0 0 auto' },
    body:        { baseFontSize: 22, align: 'left', maxWidth: '75%', fontWeight: 300, flex: '1 1 auto' },
    cta:         { baseFontSize: 20, align: 'left', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', flex: '0 0 auto' },
    decorators: [
      { type: 'block', useAccent: true, opacity: 1, top: '0', left: '0', width: '100px', height: '100%' },
      { type: 'bar', useAccent: true, opacity: 0.3, top: '0', left: '100px', width: '8px', height: '100%' },
    ],
  },

  editorial_stripe: {
    family: 'editorial',
    type: 'cover',
    textFit: ['short', 'medium'],
    description: 'Banda orizzontale accent che taglia il canvas. Headline sopra, body sotto.',
    container: { padding: '80px 80px' },
    topZone:    { justify: 'flex-start' },
    centerZone: { justify: 'flex-end', align: 'flex-start' },
    bottomZone: { direction: 'column', justify: 'flex-start', align: 'flex-start' },
    headline:    { baseFontSize: 150, align: 'left', fontWeight: 900 },
    subheadline: { baseFontSize: 24, align: 'left', maxWidth: '50%', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.2em' },
    body:        { baseFontSize: 24, align: 'left', maxWidth: '60%', fontWeight: 300 },
    cta:         { baseFontSize: 20, align: 'left', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' },
    decorators: [
      { type: 'bar', useAccent: true, opacity: 1, top: '52%', left: '0', width: '100%', height: '80px' },
      { type: 'bar', useAccent: true, opacity: 0.15, top: '52%', left: '0', width: '100%', height: '200px' },
    ],
  },

  editorial_layered: {
    family: 'editorial',
    type: 'centered',
    textFit: ['short', 'medium'],
    description: 'Multi-layer: sfondo diagonale + cerchio decorativo. Profondità visiva massima.',
    container: { padding: '80px 100px' },
    headline:    { baseFontSize: 130, align: 'center', fontWeight: 800, maxWidth: '85%' },
    subheadline: { baseFontSize: 30, align: 'center', fontWeight: 400, maxWidth: '70%' },
    body:        { baseFontSize: 20, align: 'center', fontWeight: 300, maxWidth: '60%', opacity: 0.7 },
    cta:         { baseFontSize: 18, align: 'center', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' },
    decorators: [
      { type: 'diagonal', useAccent: true, opacity: 0.07, angle: '155deg', splitAt: '55%' },
      { type: 'circle', useAccent: true, opacity: 0.05, top: '35%', left: '70%', size: '700px' },
      { type: 'bar', useAccent: true, opacity: 0.5, bottom: '80px', left: '80px', width: '150px', height: '4px' },
      { type: 'bar', useAccent: true, opacity: 0.5, bottom: '80px', right: '80px', left: 'auto', width: '150px', height: '4px' },
    ],
  },
  // ─────────────────────────────────────────
  //  CREATIVE & ASYMMETRIC (Nuovi layout versatili)
  // ─────────────────────────────────────────

  creative_asymmetric_split: {
    family: 'editorial',
    type: 'split',
    textFit: ['short', 'medium'],
    description: 'Rapporto 30/70: Area sinistra stretta per grafica/icone, area destra larga per headline dominante.',
    container: { padding: '40px', gap: '20px' },
    leftWidth: '30%',
    rightWidth: '65%',
    leftContains: ['subheadline'],
    rightContains: ['headline', 'body', 'cta'],
    leftAlign: 'flex-start',
    rightAlign: 'flex-start',
    headline:    { baseFontSize: 160, align: 'left', fontWeight: 900, letterSpacing: '-0.04em' },
    subheadline: { baseFontSize: 24, align: 'left', fontWeight: 600, textTransform: 'uppercase', rotate: -90, flex: '0 0 auto' },
    body:        { baseFontSize: 24, align: 'left', fontWeight: 300, maxWidth: '85%' },
    cta:         { baseFontSize: 20, align: 'right', fontWeight: 700 },
    decorators: [
      { type: 'block', useAccent: true, opacity: 0.05, top: '0', left: '0', width: '30%', height: '100%' },
      { type: 'bar', useAccent: true, top: '10%', left: '30%', width: '4px', height: '80%' },
    ],
  },

  creative_brutalist_overlap: {
    family: 'brutalist',
    type: 'centered',
    textFit: ['short', 'medium'],
    description: 'Sovrapposizione aggressiva: blocchi colorati che tagliano la headline.',
    container: { padding: '60px' },
    headline:    { baseFontSize: 220, align: 'center', fontWeight: 900, textTransform: 'uppercase', rotate: -2 },
    subheadline: { baseFontSize: 30, align: 'left', fontWeight: 800, textTransform: 'uppercase', backgroundColor: 'accent', rotate: 2 },
    body:        { baseFontSize: 24, align: 'right', fontWeight: 600, maxWidth: '60%' },
    cta:         { baseFontSize: 28, align: 'center', fontWeight: 900, border: '4px solid' },
    decorators: [
      { type: 'block', useAccent: true, opacity: 0.15, top: '15%', left: '10%', width: '80%', height: '150px', rotate: 5 },
      { type: 'block', useAccent: true, opacity: 0.1, bottom: '20%', right: '5%', width: '40%', height: '300px', rotate: -10 },
    ],
  },

  creative_floating_card: {
    family: 'minimal',
    type: 'centered',
    textFit: ['medium', 'long'],
    description: 'Contenuto racchiuso in una card centrale "sospesa" sopra uno sfondo di decoratori complessi.',
    container: { padding: '120px' },
    headline:    { baseFontSize: 100, align: 'center', fontWeight: 700 },
    subheadline: { baseFontSize: 24, align: 'center', fontWeight: 400, opacity: 0.6 },
    body:        { baseFontSize: 22, align: 'center', fontWeight: 300 },
    cta:         { baseFontSize: 18, align: 'center', fontWeight: 600, textTransform: 'uppercase' },
    decorators: [
      { type: 'frame', useAccent: true, inset: '80px', thickness: '2px', opacity: 0.3 },
      { type: 'circle', useAccent: true, opacity: 0.03, top: '-10%', left: '-10%', size: '800px' },
      { type: 'diagonal', useAccent: true, opacity: 0.05, angle: '45deg', splitAt: '30%' },
    ],
  },

  creative_diagonal_news: {
    family: 'editorial',
    type: 'cover',
    textFit: ['short', 'medium'],
    description: 'Dinamismo puro: elementi ancorati agli angoli opposti, lasciando il centro alla grafica.',
    container: { padding: '80px' },
    topZone:    { justify: 'flex-start', align: 'flex-start' },
    centerZone: { justify: 'center', align: 'center' },
    bottomZone: { justify: 'flex-end', align: 'flex-end' },
    headline:    { baseFontSize: 140, align: 'left', fontWeight: 900, maxWidth: '70%' },
    subheadline: { baseFontSize: 20, align: 'left', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4em' },
    body:        { baseFontSize: 26, align: 'right', fontWeight: 400, maxWidth: '60%' },
    cta:         { baseFontSize: 22, align: 'right', fontWeight: 700, textTransform: 'uppercase' },
    decorators: [
      { type: 'bar', useAccent: true, top: '0', left: '0', width: '100%', height: '40%' },
      { type: 'bar', useAccent: true, bottom: '0', right: '0', width: '100%', height: '40%', opacity: 0.1 },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
// HELPER EXPORTS
// ═══════════════════════════════════════════════════════════════
export const AVAILABLE_TEMPLATES = Object.keys(DESIGN_MASTER_GRIDS);

export const EDITORIAL_TEMPLATES = Object.entries(DESIGN_MASTER_GRIDS)
  .filter(([, v]) => v.family === 'editorial')
  .map(([k]) => k);

// Filtra i template per classe di testo
export function getTemplatesForTextLength(textLength) {
  let textClass;
  if (textLength < 200) textClass = 'short';
  else if (textLength <= 500) textClass = 'medium';
  else textClass = 'long';

  const compatible = Object.entries(DESIGN_MASTER_GRIDS)
    .filter(([, v]) => v.textFit && v.textFit.includes(textClass))
    .map(([k]) => k);

  // Fallback: se non ci sono template compatibili, ritorna tutti
  return compatible.length > 0 ? compatible : AVAILABLE_TEMPLATES;
}
