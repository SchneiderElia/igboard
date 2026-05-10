/**
 * GRID ENGINE V1
 * Trasforma i parametri AI in configurazioni CSS reali.
 */

export const calculateLayout = (aiParams) => {
  const { tension, balance, archetype } = aiParams;

  // 1. Calcolo dello Spacing (Tensione)
  // Più alta è la tensione, più gli elementi sono "compressi" e vicini.
  const baseGap = tension > 7 ? 10 : tension < 3 ? 100 : 40;
  const padding = (10 - tension) * 15; // Tensione 10 = 0px padding (Full edge)

  // 2. Calcolo dell'Allineamento (Equilibrio)
  // Balance 1-3: Asimmetrico (estremo sinistra/destra)
  // Balance 4-7: Bilanciato (classico)
  // Balance 8-10: Perfettamente centrato o specchiato
  const alignment = balance > 7 ? 'center' : balance < 4 ? 'flex-start' : 'flex-start';

  // 3. Definizione della Griglia in base all'Archetipo
  let gridStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: `${baseGap}px`,
    padding: `${padding}px`,
    alignItems: alignment,
    justifyContent: 'center',
    textAlign: alignment === 'center' ? 'center' : 'left',
  };

  // Logica "Over" per Archetipi specifici
  if (archetype === 'Brutalist') {
    gridStyle = {
      ...gridStyle,
      display: 'grid',
      gridTemplateColumns: tension > 5 ? '1fr 1fr' : '1fr',
      gap: '0px', // I blocchi si toccano
      padding: '0px',
    };
  }

  if (archetype === 'Magazine') {
    gridStyle = {
      ...gridStyle,
      padding: '80px 60px',
      justifyContent: 'flex-start',
    };
  }

  return gridStyle;
};
