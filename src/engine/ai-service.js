import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function generateDesignParams(userText) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analizza questo testo seguendo le regole di neuromarketing e design:
    "${userText}"
    
    Estrai: Headline, Subheadline, Body, CTA.
    Poi, definisci i parametri di layout basandoti su queste regole:
    - Tension (0-10): Tensione visiva.
    - Balance (0-10): Allineamento.
    - Archetype: 'Brutalist', 'Magazine', o 'Modular'.
    - Density: 'minimal', 'dense', o 'airy'.
    
    Rispondi SOLO con un oggetto JSON puro nel formato:
    {
      "text": { "headline": "...", "subheadline": "...", "body": "...", "cta": "..." },
      "layout": { "tension": 5, "balance": 5, "archetype": "Modular", "density": "dense" }
    }
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  // Pulizia per estrarre solo il JSON se l'AI aggiunge markdown
  const jsonMatch = text.match(/\{.*\}/s);
  return JSON.parse(jsonMatch ? jsonMatch[0] : text);
}
