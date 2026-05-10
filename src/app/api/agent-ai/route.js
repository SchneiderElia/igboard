import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

const SYSTEM_CORE = `Sei un AI AGENT (Senior Art Director). Il tuo compito è il "Visual Cloning Forense" di altissima precisione.

IL TUO OBIETTIVO:
Analizza l'immagine di riferimento. Estrai coordinate X/Y, pesi visivi e allineamenti. Applica questi dati al testo dell'utente.

STRUMENTI DI PRECISIONE:
1. ANCHOR POINTS (X, Y): Usa percentuali (es: "10%", "15%") per posizionare ogni elemento sul canvas 1080x1350.
2. WRITING MODE: Usa "writingMode": "vertical-rl" se vedi testo ruotato verticalmente nella reference.
3. MIX BLEND MODE: Usa "mixBlendMode": "multiply" o "overlay" se vedi colori che si fondono (stile stampa offset).
4. GRID LINES: Usa "showGridLines": true se vuoi mostrare la struttura sottostante.
5. DECORATORS: Usa type "gridLine" (orientation "horizontal"/"vertical") per replicare linee strutturali.

MODIFICA DEL TESTO:
Puoi manipolare il testo per farlo aderire all'ingombro dell'immagine originale.`;

const JSON_SCHEMA = `{
  "isDynamic": false,
  "style": "VisualCloning",
  "showGridLines": false,
  "layoutAnalysis": "Analisi del DNA visivo estratto...",
  "content": { "headline": "...", "subheadline": "...", "body": ["..."], "cta": "..." },
  "anchorPoints": {
    "headline": { "x": "10%", "y": "15%", "width": "80%", "align": "left", "fontSize": 150, "fontWeight": 900, "mixBlendMode": "multiply" },
    "subheadline": { "x": "85%", "y": "10%", "width": "5%", "align": "left", "fontSize": 24, "writingMode": "vertical-rl" },
    "body": { "x": "10%", "y": "55%", "width": "60%", "align": "left", "fontSize": 24 },
    "cta": { "x": "10%", "y": "85%", "width": "40%", "align": "left", "fontSize": 22 }
  },
  "colors": { "bg": "#HEX", "text": "#HEX", "accent": "#HEX" },
  "fontConfig": { "pair": "Swiss" },
  "decorators": [
    { "type": "gridLine", "orientation": "vertical", "x": "10%", "useAccent": true, "opacity": 0.3 },
    { "type": "block", "x": "0", "y": "0", "width": "20%", "height": "100%", "useAccent": true, "opacity": 0.1 }
  ]
}`;

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt, isReMap, model: requestedModel, image: base64Image } = body;
    
    if (!prompt && !isReMap) {
      return NextResponse.json({ error: "Prompt mancante" }, { status: 400 });
    }

    const ALLOWED_MODELS = [
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-3-flash-preview',
      'gemini-3.1-flash-lite-preview',
      'gemini-2.5-pro',
      'gemini-3-pro-preview',
      'gemini-3.1-pro-preview',
    ];

    // Usa il modello scelto dall'utente o il default flash
    let modelId = (requestedModel && ALLOWED_MODELS.includes(requestedModel))
      ? requestedModel
      : 'gemini-2.5-flash';

    let model = genAI.getGenerativeModel({ model: modelId });

    let imageParts = [];

    // 1. Priorità: Immagine inviata direttamente nel body (Upload)
    if (base64Image) {
      imageParts.push({ 
        inlineData: { 
          data: base64Image.split(',')[1] || base64Image, 
          mimeType: "image/png" 
        } 
      });
      console.log(`👁️ AGENT AI: Usando immagine inviata via Upload.`);
    } 
    // 2. Fallback: Prendi l'ultima immagine salvata in public/dna_vision (Memory)
    else {
      const refsDir = path.join(process.cwd(), 'public', 'dna_vision');
      if (fs.existsSync(refsDir)) {
        const files = fs.readdirSync(refsDir)
          .filter(f => f.endsWith('.png') || f.endsWith('.jpg'))
          .map(f => ({ name: f, time: fs.statSync(path.join(refsDir, f)).mtime.getTime() }))
          .sort((a, b) => b.time - a.time); // Ordina per data decrescente (più recente prima)

        if (files.length > 0) {
          const latestFile = files[0].name;
          const imageData = fs.readFileSync(path.join(refsDir, latestFile));
          imageParts.push({ inlineData: { data: imageData.toString("base64"), mimeType: "image/png" } });
          console.log(`👁️ AGENT AI: Analizzando ULTIMO DNA Master -> ${latestFile}`);
        }
      }
    }

    const finalPrompt = isReMap 
      ? "PROTOCOLLO RE-MAP: Ignora il testo originale. Analizza la reference e ricostruisci la struttura usando Lorem Ipsum. Rispetta ossessivamente le proporzioni dei blocchi di testo."
      : prompt;

    const neuroPrompt = `${SYSTEM_CORE}

REGOLA CRITICA DI RICOSTRUZIONE FORENSE:
1. ANALISI SPAZIALE: Identifica le coordinate X/Y e Width/Height di ogni blocco di testo nell'immagine.
2. MAPPATURA: Traduci quelle zone nel JSON schema fornito.
3. VOLUMETRIA: Se l'immagine ha un titolo enorme su 2 righe, la tua headline deve avere un fontSize enorme e occupare lo stesso spazio.

RISPONDI ESCLUSIVAMENTE IN JSON PURO:
${JSON_SCHEMA}

CONTENUTO DA INTEGRARE: ${finalPrompt}`;

    let result = await model.generateContent([{ text: neuroPrompt }, ...imageParts]);

    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanJson);

    return NextResponse.json(data);
  } catch (error) {
    console.error("ERRORE AGENT AI:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
