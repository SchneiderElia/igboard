import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('file');

    if (!fileName) {
      return new NextResponse("File non specificato", { status: 400 });
    }

    const imagePath = path.join(process.cwd(), '_system', 'memory', 'feedback_images', fileName);

    if (!fs.existsSync(imagePath)) {
      return new NextResponse("Immagine non trovata", { status: 404 });
    }

    const imageBuffer = fs.readFileSync(imagePath);
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    return new NextResponse("Errore interno", { status: 500 });
  }
}
