# Roadmap Operativa

*Storia in sunto delle decisioni chiave, dei pivot e dello stato di avanzamento per questo sotto-progetto.*
---
### Log 20260503 (V3 Creative Engine)
# Digest Sessione 20260503_2236
- Lancio **Versione v3 (Creative Engine)** con rotta e componenti isolati.
- Implementata **Chat Multimodale** con supporto Vision e selezione dinamica tra 11 modelli (Free/Pro).
- Integrazione **Live Canvas (1080x1350)** per il rendering istantaneo di p5.js, GSAP e Vanilla JS.
- Layout **Split-Screen 50/50** fisso con tela bianca persistente per design iterativo.
- Sistema di **Error Handling** granulare per Quota (429), Auth (403) e modelli (404).
- Unificazione **Tiering (Free/Pro)** e Monitoraggio RPM (Usage Monitor) nell'header.
- Configurato oscuramento dinamico del `VersionSwitcher` legacy nella rotta v3.

---
### Log 20260503 (Grid Engine)
- Risolto bug Modelli AI (Errore 404 e 429 su tier Pro) mascherando quelli non accessibili (API KEY REQ) ed eliminando l'ingannevole auto-fallback.
- Pivot Architetturale: Abbandonato l'uso dei template Flexbox pre-compilati.
- Sviluppato e implementato il "Motore a Griglia Dinamica" (12-Column CSS Grid).
- L'AI funge ora da Art Director puro generando le `gridArea` per un posizionamento infinito dei contenuti senza overlapping.
- Creato `_note.md` in `/session/` per documentare il nuovo funzionamento e guidare l'eventuale implementazione di nuovi decoratori stilistici.
- Pulizia del codice: Rimossa tutta la logica legacy di Vision/Pattern e la dipendenza dalle cartelle `design_refs` e `design_patterns` dalle API.

---
### Log 20260502
# Digest Sessione 20260502
- Setup architettura V1/V2.
- Setup sistema parametri Art Director.
- Setup Pipeline AI con debug.
