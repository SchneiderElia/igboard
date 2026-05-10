import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { design, rating } = await req.json();
    
    if (!design || !rating) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const memoryDir = path.join(process.cwd(), '_system', 'memory');
    if (!fs.existsSync(memoryDir)) {
      fs.mkdirSync(memoryDir, { recursive: true });
    }

    // Salviamo in file separati a seconda del rating
    const fileName = rating === 'good' ? 'golden_grids.json' : 'rejected_grids.json';
    const filePath = path.join(memoryDir, fileName);

    let grids = [];
    if (fs.existsSync(filePath)) {
      try {
        grids = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } catch (e) {
        grids = [];
      }
    }

    // Aggiungiamo timestamp e ID unico
    const entry = {
      id: `grid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      gridConfig: design.gridConfig,
      positions: design.positions,
      decorators: design.decorators,
      // Salviamo il testo esatto per permettere una riproduzione fedele e analisi errori
      content: design.content
    };

    grids.unshift(entry); // Aggiungiamo in cima
    
    fs.writeFileSync(filePath, JSON.stringify(grids, null, 2));

    return NextResponse.json({ success: true, id: entry.id });

  } catch (error) {
    console.error("Errore salvataggio feedback grid:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
