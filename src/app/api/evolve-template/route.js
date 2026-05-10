import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// ═══════════════════════════════════════════════════════════════
// TEMPLATE EVOLUTION ENGINE
// L'AI legge i template "buoni", ne capisce la struttura,
// e propone VARIANTI infinite con diverse posizioni, allineamenti
// e decoratori. Tutto viene validato prima di essere salvato.
// ═══════════════════════════════════════════════════════════════

// Regole di validazione per i template generati
const VALID_TYPES = ['column', 'cover', 'split', 'centered'];
const VALID_ALIGNS = ['left', 'center', 'right', 'justify'];
const VALID_JUSTIFIES = ['flex-start', 'center', 'flex-end', 'space-between'];
const VALID_DECORATOR_TYPES = ['bar', 'block', 'frame', 'circle', 'splitBg', 'diagonal'];
const VALID_TEXT_FITS = ['short', 'medium', 'long'];

function validateTemplate(t) {
  const errors = [];
  
  if (!t.type || !VALID_TYPES.includes(t.type)) errors.push(`type invalido: ${t.type}`);
  if (!t.textFit || !Array.isArray(t.textFit)) errors.push('textFit mancante');
  if (!t.headline?.baseFontSize) errors.push('headline.baseFontSize mancante');
  if (!t.subheadline?.baseFontSize) errors.push('subheadline.baseFontSize mancante');
  if (!t.body?.baseFontSize) errors.push('body.baseFontSize mancante');
  
  // Range check: font size tra 14 e 250
  ['headline', 'subheadline', 'body', 'cta'].forEach(slot => {
    if (t[slot]?.baseFontSize && (t[slot].baseFontSize < 14 || t[slot].baseFontSize > 250)) {
      errors.push(`${slot}.baseFontSize fuori range: ${t[slot].baseFontSize}`);
    }
  });

  // Validazione decoratori
  if (t.decorators && Array.isArray(t.decorators)) {
    t.decorators.forEach((d, i) => {
      if (!VALID_DECORATOR_TYPES.includes(d.type)) {
        errors.push(`decorators[${i}].type invalido: ${d.type}`);
      }
    });
  }

  // Split: verifica che abbia le colonne
  if (t.type === 'split') {
    if (!t.leftContains || !t.rightContains) errors.push('split senza leftContains/rightContains');
  }

  return { valid: errors.length === 0, errors };
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { seedTemplateId, count = 1 } = body;

    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

    // Leggi i template master come esempi
    const masterGridsPath = path.join(process.cwd(), 'src', 'constants', 'design-master-grids.js');
    const masterContent = fs.readFileSync(masterGridsPath, 'utf-8');

    // Leggi i template in review esistenti (se ci sono)
    const memoryDir = path.join(process.cwd(), '_system', 'memory');
    const reviewFile = path.join(memoryDir, 'templates_review.json');
    let existingReview = {};
    try {
      if (fs.existsSync(reviewFile)) {
        existingReview = JSON.parse(fs.readFileSync(reviewFile, 'utf-8'));
      }
    } catch (e) { /* vuoto */ }

    const evolvePrompt = `Sei un Senior Design System Architect. Il tuo compito è GENERARE VARIANTI di template per un layout engine basato su Flexbox.

ECCO IL CODICE SORGENTE dei template esistenti che funzionano bene. Studiali attentamente:
\`\`\`javascript
${masterContent}
\`\`\`

REGOLE STRUTTURALI INVIOLABILI:
1. type DEVE essere uno tra: "column", "cover", "split", "centered"
2. textFit DEVE essere un array con valori tra: "short", "medium", "long"
3. Ogni slot (headline, subheadline, body, cta) DEVE avere: baseFontSize (14-250), align ("left"/"center"/"right"), fontWeight (100-900)
4. I decoratori DEVONO essere uno tra: "bar", "block", "frame", "circle", "splitBg", "diagonal"
5. Per type "split": DEVI includere leftContains, rightContains, leftWidth, rightWidth
6. Per type "cover": DEVI includere topZone, centerZone, bottomZone
7. container DEVE avere almeno "padding"

COSA VARIARE per creare composizioni NUOVE:
- Posizioni diverse dei testi (headline in basso invece che in alto, body a destra, CTA centrata)
- Allineamenti diversi (tutto a destra, tutto centrato, asimmetrico)
- Proporzioni split diverse (30/70, 65/35, 20/80)
- Font size diversi (headline piccola + body grande = inversione gerarchica)
- Decoratori in posizioni nuove (barra verticale a metà, cerchio in angolo, frame doppia)
- Padding asimmetrico (più spazio in alto, meno ai lati)
- Combinazioni di decoratori mai viste (diagonale + barra + cerchio)

${seedTemplateId ? `USA COME SEME il template "${seedTemplateId}" e crea ${count} variazione/i basata/e su di esso.` : `Crea ${count} template/i completamente NUOVI, diversi da quelli esistenti.`}

RISPONDI IN JSON PURO con questa struttura:
{
  "templates": {
    "nome_unico_del_template": {
      "family": "editorial",
      "type": "column|cover|split|centered",
      "textFit": ["short", "medium"],
      "description": "Descrizione della composizione",
      "container": { "padding": "...", "gap": "..." },
      "headline": { "baseFontSize": 130, "align": "left", "fontWeight": 800, "maxWidth": "90%" },
      "subheadline": { "baseFontSize": 30, "align": "left", "fontWeight": 400 },
      "body": { "baseFontSize": 22, "align": "left", "fontWeight": 300 },
      "cta": { "baseFontSize": 18, "align": "left", "fontWeight": 600 },
      "decorators": []
    }
  }
}
I nomi dei template DEVONO iniziare con "evolved_" per distinguerli dai master.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: evolvePrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 1.3,
      },
    });

    const response = await result.response;
    let text = response.text().replace(/```json/gi, "").replace(/```/g, "").trim();
    const data = JSON.parse(text);

    if (!data.templates) {
      return NextResponse.json({ error: "Risposta AI senza templates" }, { status: 400 });
    }

    // Validazione di ogni template generato
    const results = { accepted: {}, rejected: {} };

    for (const [id, template] of Object.entries(data.templates)) {
      const { valid, errors } = validateTemplate(template);
      
      if (valid) {
        const safeId = id.startsWith('evolved_') ? id : `evolved_${id}`;
        template._evolved = true;
        template._status = 'review';
        template._createdAt = new Date().toISOString();
        template._seedTemplate = seedTemplateId || 'freeform';
        
        results.accepted[safeId] = template;
        existingReview[safeId] = template;
      } else {
        results.rejected[id] = { template, errors };
      }
    }

    // Salva nella coda di review
    if (!fs.existsSync(memoryDir)) fs.mkdirSync(memoryDir, { recursive: true });
    fs.writeFileSync(reviewFile, JSON.stringify(existingReview, null, 2));

    console.log(`🧬 Evoluzione: ${Object.keys(results.accepted).length} → REVIEW, ${Object.keys(results.rejected).length} rigettati (validazione)`);

    return NextResponse.json({
      accepted: results.accepted,
      rejected: results.rejected,
      totalInReview: Object.keys(existingReview).length,
    });

  } catch (error) {
    console.error("❌ ERRORE EVOLUZIONE:", error);
    return NextResponse.json({ error: "Errore evoluzione", details: error.message }, { status: 500 });
  }
}
