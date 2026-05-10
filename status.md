# Igboard v2 - Project Status & Roadmap

## 🚀 Obiettivo Corrente
Trasformare il generatore di impaginati casuali in un **AI Art Director Engine** autonomo, con capacità di apprendimento (Evolutionary Memory) e correzione basata su feedback visivo (RLHF).

---

## ✅ Traguardi Raggiunti (Fino ad ora)

1. **Abbandono della Griglia Casuale 12x12**
   - Rimosso il sistema che obbligava Gemini a indovinare le coordinate.
   - Sostituito con un **Motore a Componenti (Flexbox/Grid Layout Engine)** simile a Vercel v0 o Framer. L'AI sceglie il template, il CSS si occupa della matematica.

2. **Creazione dei 7 Master Template (DNA Estetico)**
   - `vogue_cover`: Editoriale, testi ampi, asimmetrico.
   - `vogue_cover_mirrored`: Versione specchiata del Vogue.
   - `koto_minimal`: Top-down, fluido e pulito.
   - `carson_chaos`: Testi enormi, ruotati (-12°, -6°), `mix-blend-difference`.
   - `bauhaus_structure`: Spesse linee divisorie architettoniche. (Fixato il quadratino nero hardcoded).
   - `swiss_grid_strict`: Stile svizzero, linee pulite, gerarchia ferrea.
   - `muji_void`: Spazi immensi, minimalismo estremo zen.

3. **Logica di "Ibridazione" (Design Contamination)**
   - L'AI ha imparato a mixare autonomamente i Layout (es. *Swiss Grid*) con Tipografie contrastanti (es. *Editorial Serif*) generando estetiche inedite di altissima qualità (stile "Rivista Museale/Accademica").

4. **Dynamic CTA (Call To Action Intelligente)**
   - La CTA non è più obbligatoria. Se il testo è informativo, l'AI imposta `"cta": null`.
   - Il `Canvas.jsx` esegue uno short-circuiting: se non c'è CTA, i bottoni, le frecce o le linee grafiche a essi associati scompaiono, lasciando un lussuoso "Negative Space" (spazio vuoto) che ribilancia il layout.

5. **Fix Tipografici e Anti-Overflow**
   - Padding aumentato.
   - Titoli centralizzati distanziati (`py-16`) dai bordi.
   - Uso di `break-words`, `text-wrap: balance` e `clamp` font-sizing per evitare che le frasi lunghe "taglino" lo schermo.

---

## 🔮 Roadmap Futura (Evolutionary Visual Memory)

L'utente ha approvato la costruzione di un sistema di **Reinforcement Learning from Human Feedback (RLHF)** integrato direttamente nell'UI:

1. **Feedback Visivo Overlay (V/X)**:
   - Pulsanti per approvare o scartare un layout.
   
2. **Interactive Bug Reporting (Draw & Screenshot)**:
   - Se l'utente clicca "Scarta" (❌), si apre una modalità interattiva.
   - Possibilità di *disegnare/cerchiare* l'errore sul Canvas con il mouse.
   - Inserimento di un commento testuale.
   
3. **Multimodal AI Debugging**:
   - Cattura di uno screenshot **dell'intera tavola/canvas** (tramite `html2canvas`). Avere la foto globale è fondamentale per far capire all'AI come ri-bilanciare i pesi del Flexbox e non solo la singola riga di testo rotta.
   - Invio dello screenshot integrale e delle coordinate del cerchio a Gemini Vision.
   - Oltre a fixare l'errore, Gemini potrà analizzare il problema e **suggerire nuovi archetipi di layout ottimali**, che verranno salvati in memoria e proposti nelle future generazioni casuali.

4. **Auto-Risoluzione e Archiviazione**:
   - L'AI applica il fix (es. cambia grandezza font, taglia il testo).
   - Registra l'errore in un `error_report.json` o `evolution_rules.json`.
   - La memoria viene usata nei prompt futuri per evitare categoricamente lo stesso errore ("Non mettere mai 5 paragrafi nel Vogue Cover perché sfora a destra").
