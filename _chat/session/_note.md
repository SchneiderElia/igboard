# Note Architetturali: Motore a Griglia Dinamica (CSS Grid)

**Data:** 03 Maggio 2026
**Autore:** AI Art Director / Gemini CLI

---

## 1. Come funziona l'impaginazione ora
Abbiamo abbandonato il vecchio sistema a template statici (Flexbox). Ora il motore funziona come un vero **Art Director programmabile**.
- La tavola (Canvas) è divisa in una **griglia CSS invisibile di 12x12** (12 righe e 12 colonne).
- L'Intelligenza Artificiale legge il testo e "mappa" ogni elemento assegnandogli una coordinata precisa tramite la proprietà `gridArea` (es: `gridArea: 2 / 2 / 6 / 12`).
- Questo garantisce una varietà teoricamente **infinita** di impaginazioni, pur mantenendo un allineamento rigoroso e zero problemi di overlapping "sporco" (che avveniva con i posizionamenti assoluti), dato che il browser adatta i contenuti alle celle del CSS Grid in modo nativo.

---

## 2. Come si fanno le modifiche (Ricalibrazione)
Se i layout generati non piacciono, sembrano troppo stravaganti o si vuole imporre un nuovo stile, **NON** si tocca il codice CSS del Canvas. 

Tutte le "Regole d'Oro" risiedono nel file `src/app/api/generate/route.js`, all'interno della costante **`SYSTEM_CORE`** (il Prompt di sistema). 

### Modificare le proporzioni e le scelte:
- **Font Size:** Se i titoli sono enormi, basta abbassare il tetto massimo nel prompt (es. cambiare `FontSize tra 80 e 200` in `FontSize tra 60 e 130`).
- **Margini (Negative Space):** Puoi inserire regole fisse come: *"Usa sempre le colonne 2-11, lascia la 1 e la 12 vuote come margini protetti."*
- **Layout Fissi Guidati:** Puoi scrivere nel prompt micro-regole condizionali: *"Se il testo è elegante, posiziona sempre l'headline in basso (righe 10-12)."*

---

## 3. Aggiungere nuovi stili grafici (Decoratori)
Attualmente l'AI sa maneggiare tre forme di base: `block`, `bar`, e `circle`.
L'architettura è pensata per espandersi facilmente. Se in futuro vogliamo abilitare **griglie a puntini (stile brutalista), sfumature (gradienti), o bordi arrotondati**, il processo è semplicissimo:

1. **Aggiungere la chiave nel Prompt (`route.js`)**: Dici all'AI che ora esistono nuovi tipi di decoratori, ad esempio `types: "block", "bar", "circle", "dotted-grid", "gradient"`.
2. **Aggiornare il Renderer (`Canvas.jsx`)**: Vai nel componente `DecoratorRenderer` e aggiungi lo switch (il caso) corrispondente per renderizzare il CSS.

Esempio pratico per un gradiente:
\`\`\`javascript
case 'gradient':
  return (
    <div style={{
      gridArea: d.gridArea, // L'AI decide dove posizionarlo sulla griglia 12x12
      background: \`linear-gradient(45deg, \${colors.bg}, \${colors.accent})\`,
      borderRadius: d.rounded ? '20px' : '0' // Esempio di implementazione bordi arrotondati
    }} />
  );
\`\`\`

Modificando semplicemente il prompt, insegni all'AI nuovi stili senza dover stravolgere la logica di posizionamento spaziale.
