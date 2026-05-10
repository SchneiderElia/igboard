import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

const SYSTEM_PROMPT = `Sei un SENIOR CREATIVE CODER e ART DIRECTOR. Il tuo obiettivo è trasformare visioni artistiche in codice Canvas/Web performante e bellissimo.

REGOLE DI RAGIONAMENTO:
1. ANALISI: Scomponi l'immagine o l'idea in forme geometriche, colori (HEX) e livelli.
2. STRUMENTI: 
   - Vanilla JS: Per logiche semplici e performance massime.
   - p5.js: Per arte generativa, pattern complessi e matematica visuale.
   - GSAP: Per animazioni fluide e timeline.
   - Fabric.js/Konva: Per editor interattivi e manipolazione oggetti.
3. STRUTTURA: Fornisci sempre codice pronto all'uso. Se usi librerie esterne, specifica quali (p5, gsap, fabric).

FORMATO DI OUTPUT:
Quando generi un "Artifact" (codice da renderizzare nel Canvas), usa SEMPRE questo formato di blocchi markdown:

\`\`\`html (opzionale se serve struttura extra)
...
\`\`\`

\`\`\`css (opzionale per styling)
...
\`\`\`

\`\`\`javascript (La logica di disegno)
...
\`\`\`

Se usi p5.js, scrivi le funzioni setup() e draw() globali. Se usi Vanilla, inizializza il canvas con ID "canvas".
Sii audace, usa gradienti, ombre e algoritmi di rumore (noise) per dare vita alle creazioni.`;

export async function POST(req) {
  try {
    const { messages, model: requestedModel, image } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messaggi mancanti o non validi" }, { status: 400 });
    }

    const ALLOWED_MODELS = [
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-2.5-pro',
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
      'gemini-3-flash-preview',
      'gemini-3.1-flash-lite-preview',
      'gemini-3-pro-preview',
      'gemini-3.1-pro-preview',
      'gemini-2.5-flash-image',
      'gemini-3.1-flash-image-preview',
    ];

    const modelId = (requestedModel && ALLOWED_MODELS.includes(requestedModel))
      ? requestedModel
      : 'gemini-2.5-flash';

    console.log(`🤖 Chat v3: Modello richiesto -> ${modelId}`);

    let model = genAI.getGenerativeModel({ 
      model: modelId,
      systemInstruction: SYSTEM_PROMPT 
    });

    const lastMessage = messages[messages.length - 1].content;
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    let promptContent = [{ text: lastMessage }];

    // Integrazione immagine se presente
    if (image) {
      promptContent.push({
        inlineData: {
          data: image.split(',')[1] || image,
          mimeType: "image/png"
        }
      });
      console.log("📸 Vision: Analizzando immagine caricata in v3...");
    }

    const chat = model.startChat({
      history: history,
    });

    try {
      const result = await chat.sendMessage(promptContent);
      const response = await result.response;
      const text = response.text();
      return NextResponse.json({ role: "assistant", content: text });
    } catch (modelError) {
      console.error(`❌ ERRORE MODELLO [${modelId}]:`, modelError);
      
      let errorMessage = "Si è verificato un errore con il modello selezionato.";
      let status = 500;

      if (modelError.message?.includes("429") || modelError.message?.includes("quota")) {
        errorMessage = `LIMITE RAGGIUNTO: Hai esaurito i token gratuiti per ${modelId}. Attendi o passa a una API Key a pagamento (Pay-as-you-go).`;
        status = 429;
      } else if (modelError.message?.includes("API_KEY_INVALID") || modelError.message?.includes("403")) {
        errorMessage = "ERRORE AUTENTICAZIONE: La tua API Key non è valida o non ha i permessi per questo modello Pro.";
        status = 403;
      } else if (modelError.message?.includes("not found") || modelError.message?.includes("404")) {
        errorMessage = `MODELLO NON DISPONIBILE: Il modello ${modelId} non sembra essere supportato dalla tua API Key o regione.`;
        status = 404;
      }

      return NextResponse.json({ error: errorMessage }, { status });
    }
  } catch (error) {
    console.error("ERRORE GENERALE CHAT V3:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
