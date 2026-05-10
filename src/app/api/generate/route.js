import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

const ALL_TEMPLATES = [
  "vogue_cover",
  "vogue_cover_mirrored",
  "koto_minimal",
  "editorial_statement",
  "poster_pure",
  "poster_bottom",
  "editorial_elegant",
  "editorial_split",
  "editorial_stacked",
  "editorial_stacked_bottom",
  "editorial_poster",
  "editorial_asymmetric",
  "editorial_diagonal",
  "editorial_diagonal_mirrored",
  "carson_chaos",
  "bauhaus_structure",
  "swiss_grid_strict",
  "muji_void",
  "museum_poster",
  "magazine_cover",
  "editorial_framed",
  "editorial_bold_block",
  "editorial_stripe",
  "editorial_layered",
  "creative_asymmetric_split",
  "creative_brutalist_overlap",
  "creative_floating_card",
  "creative_diagonal_news",
];

const ALL_FONT_PAIRS = [
  "Editorial",
  "Brutalist",
  "Swiss",
  "Minimal",
  "Neo-Abstract",
];

const TEXT_FIT_MAP = {
  vogue_cover: ["medium", "long"],
  vogue_cover_mirrored: ["medium", "long"],
  koto_minimal: ["medium", "long"],
  editorial_stacked: ["medium", "long"],
  editorial_stacked_bottom: ["medium", "long"],
  editorial_poster: ["short", "medium"],
  editorial_statement: ["short"],
  poster_pure: ["short"],
  poster_bottom: ["short"],
  editorial_elegant: ["short", "medium"],
  muji_void: ["short"],
  editorial_split: ["medium", "long"],
  editorial_asymmetric: ["medium", "long"],
  editorial_diagonal: ["medium", "long"],
  editorial_diagonal_mirrored: ["medium", "long"],
  bauhaus_structure: ["medium", "long"],
  swiss_grid_strict: ["medium", "long"],
  carson_chaos: ["short", "medium"],
  museum_poster: ["short", "medium"],
  magazine_cover: ["medium", "long"],
  editorial_framed: ["short", "medium"],
  editorial_bold_block: ["medium", "long"],
  editorial_stripe: ["short", "medium"],
  editorial_layered: ["short", "medium"],
  creative_asymmetric_split: ["short", "medium"],
  creative_brutalist_overlap: ["short", "medium"],
  creative_floating_card: ["medium", "long"],
  creative_diagonal_news: ["short", "medium"],
};

function classifyText(textLength) {
  if (textLength < 200) return "short";
  if (textLength <= 500) return "medium";
  return "long";
}

function getNextTemplate(textLength) {
  const memoryDir = path.join(process.cwd(), "_system", "memory");
  const rotationFile = path.join(memoryDir, "template_rotation.json");
  let rotation = { templateIndex: 0, fontIndex: 0, history: [] };
  try {
    if (fs.existsSync(rotationFile)) {
      rotation = JSON.parse(fs.readFileSync(rotationFile, "utf-8"));
    }
  } catch (e) {}

  const textClass = classifyText(textLength);
  const pool = ALL_TEMPLATES.filter((t) =>
    TEXT_FIT_MAP[t]?.includes(textClass),
  );
  const finalPool = pool.length > 0 ? pool : ALL_TEMPLATES;

  const tIdx = rotation.templateIndex % finalPool.length;
  const fIdx = rotation.fontIndex % ALL_FONT_PAIRS.length;

  const template = finalPool[tIdx];
  const font = ALL_FONT_PAIRS[fIdx];

  rotation.templateIndex = tIdx + 1;
  rotation.fontIndex = fIdx + 1;

  if (!fs.existsSync(memoryDir)) fs.mkdirSync(memoryDir, { recursive: true });
  fs.writeFileSync(rotationFile, JSON.stringify(rotation, null, 2));

  return { template, font, textClass };
}

const SYSTEM_CORE = `Sei un Senior Art Director specializzato in Editorial Design d'avanguardia (Swiss Style, Brutalism). 
Il tuo compito è trasformare un testo in un'esperienza visiva d'impatto su un canvas 1080x1350 usando una griglia CSS 12x12.

STRUMENTI AVANZATI (LEGO TECHNIC MODE):
1. GRID LINES: Imposta "showGridLines": true nel root per visualizzare la griglia strutturale (stile blueprint).
2. WRITING MODE: Usa "writingMode": "vertical-rl" per testo verticale (stile giapponese/poster d'arte).
3. BLENDING: Usa "mixBlendMode": "multiply" o "overlay" per effetti di sovrapposizione cromatica professionale tra testo e decoratori.
4. ASIMMETRIA & OVERLAP: Rompi la griglia. Sovrapponi elementi usando lo stesso gridArea e diversi zIndex.

REGOLE DELLA GRIGLIA CSS (12x12):
1. Grid Area: "row-start / col-start / row-end / col-end".
2. Gerarchia: HeadlineFontSize (120-250px). Non temere di far uscire il testo o ruotarlo ("rotate": -5).
3. Negative Space: Usa il vuoto come elemento di design.

TIPI DI CONTENUTO:
- headline, subheadline, body (array), cta.`;

const TEMPLATE_INSTRUCTIONS = (font) => `
ESECUZIONE ART DIRECTION:
Stile: Swiss High-Fidelity. 
Font: ${font}. 
Usa gridLines e vertical text se il testo lo permette.`;

const JSON_SCHEMA = (f) => `{
  "isDynamic": true,
  "showGridLines": true,
  "layoutAnalysis": "Descrizione della tensione visiva e dell'uso della griglia svizzera.",
  "gridConfig": { "columns": 12, "rows": 12, "gap": "20px", "padding": "60px" },
  "content": { "headline": "...", "subheadline": "...", "body": ["..."], "cta": "..." },
  "positions": {
    "headline": { "gridArea": "2 / 2 / 7 / 12", "fontSize": 180, "fontWeight": 900, "mixBlendMode": "multiply" },
    "subheadline": { "gridArea": "7 / 2 / 8 / 6", "fontSize": 30, "writingMode": "vertical-rl" }
  },
  "colors": { "bg": "#HEX", "text": "#HEX", "accent": "#HEX" },
  "fontConfig": { "pair": "${f}" },
  "decorators": [
    { "type": "gridLine", "orientation": "horizontal", "y": "50%", "useAccent": true, "opacity": 0.2 },
    { "type": "block", "gridArea": "1 / 1 / 13 / 5", "useAccent": true, "opacity": 0.1 }
  ]
}`;

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt, model: requestedModel, mode = "template" } = body;
    if (!prompt)
      return NextResponse.json({ error: "Prompt mancante" }, { status: 400 });

    const ALLOWED_MODELS = [
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
      "gemini-2.5-flash-image",
      "gemini-3-flash-preview",
      "gemini-3.1-flash-lite-preview",
      "gemini-3.1-flash-image-preview",
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      "gemini-2.5-pro",
      "gemini-3-pro-preview",
      "gemini-3.1-pro-preview",
    ];

    let modelId =
      requestedModel && ALLOWED_MODELS.includes(requestedModel)
        ? requestedModel
        : "gemini-2.5-flash";
    let model = genAI.getGenerativeModel({ model: modelId });

    const { font: forcedFont } = getNextTemplate(prompt.length);
    const neuroPrompt = `${SYSTEM_CORE}\n${TEMPLATE_INSTRUCTIONS(forcedFont)}\n\nREGOLA CRITICA: Restituisci JSON puro.\n\nRISPONDI SOLO IN JSON:\n${JSON_SCHEMA(forcedFont)}\n\nTESTO: ${prompt}`;

    const result = await model.generateContent([{ text: neuroPrompt }]);
    const responseText = result.response.text();
    const cleanJson = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    const data = JSON.parse(cleanJson);

    if (mode === "template" || mode === "default") {
      data.fontConfig = { ...data.fontConfig, pair: forcedFont };
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("ERRORE API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
