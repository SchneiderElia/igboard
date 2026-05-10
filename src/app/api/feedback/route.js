import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const data = await req.json();
    const { image, comment, design, annotations_json } = data;

    // Definiamo i path secondo le tue regole workspace GEMINI.md
    // Salveremo tutto dentro _system/memory per mantenere il progetto pulito
    const memoryDir = path.join(process.cwd(), '_system', 'memory');
    const imagesDir = path.join(memoryDir, 'feedback_images');
    const logFile = path.join(memoryDir, 'feedback_log.json');

    // Creiamo le directory se non esistono
    if (!fs.existsSync(memoryDir)) fs.mkdirSync(memoryDir, { recursive: true });
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

    const timestamp = Date.now();
    const isoDate = new Date(timestamp).toISOString();

    let imageFileName = null;

    // Salviamo fisicamente l'immagine base64 sul disco come .png
    if (image) {
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const imageBuffer = Buffer.from(matches[2], 'base64');
        imageFileName = `feedback_${timestamp}.png`;
        const imagePath = path.join(imagesDir, imageFileName);
        fs.writeFileSync(imagePath, imageBuffer);
      }
    }

    // Prepariamo la voce di log (Il Record del Feedback)
    const newEntry = {
      id: timestamp,
      date: isoDate,
      comment: comment || "",
      annotations: annotations_json || [], // Struttura grezza (x, y, width, height, text) per la futura Dashboard Interattiva
      imageFile: imageFileName,
      // Salviamo anche l'intero JSON generato dall'AI, così sappiamo ESATTAMENTE 
      // cosa ha causato l'errore grafico (quale template, testo, ecc.)
      design_context: design || {}
    };

    // Leggiamo il file di memoria esistente (se c'è) e aggiungiamo il nuovo record
    let logs = [];
    if (fs.existsSync(logFile)) {
      const fileData = fs.readFileSync(logFile, 'utf-8');
      if (fileData) {
        try { logs = JSON.parse(fileData); } catch(e) {}
      }
    }

    logs.push(newEntry);
    
    // Riscriviamo il JSON formattato a dovere
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2), 'utf-8');

    return NextResponse.json({ success: true, message: "Feedback archiviato con successo in _system/memory" });

  } catch (error) {
    console.error("API Error - Salavataggio feedback:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const logFile = path.join(process.cwd(), '_system', 'memory', 'feedback_log.json');
    if (fs.existsSync(logFile)) {
      const logs = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
      return NextResponse.json(logs);
    }
    return NextResponse.json([]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
