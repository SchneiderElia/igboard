import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

// ═══════════════════════════════════════════════════════════════
// TEMPLATE REVIEW PIPELINE
// 
// 3 file separati, 3 stadi puliti:
//   templates_review.json   → AI genera, template atterrano qui
//   templates_approved.json → Feedback positivo → usabili in produzione
//   templates_rejected.json → Feedback negativo → archiviati con note
//
// GET  → Lista lo stato di tutti i template per stadio
// POST → Sposta un template da review → approved/rejected
// ═══════════════════════════════════════════════════════════════

const MEMORY_DIR_REL = '_system/memory';

function getFiles() {
  const memoryDir = path.join(process.cwd(), MEMORY_DIR_REL);
  return {
    review:   path.join(memoryDir, 'templates_review.json'),
    approved: path.join(memoryDir, 'templates_approved.json'),
    rejected: path.join(memoryDir, 'templates_rejected.json'),
    memoryDir,
  };
}

function readJson(filePath) {
  try {
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) { /* corrotto */ }
  return {};
}

function writeJson(filePath, data, memoryDir) {
  if (!fs.existsSync(memoryDir)) fs.mkdirSync(memoryDir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ─────────────────────────────────────────
// GET: Lista tutti i template per stadio
// ─────────────────────────────────────────
export async function GET() {
  const f = getFiles();
  const review   = readJson(f.review);
  const approved = readJson(f.approved);
  const rejected = readJson(f.rejected);

  return NextResponse.json({
    review:   { count: Object.keys(review).length,   templates: review },
    approved: { count: Object.keys(approved).length, templates: approved },
    rejected: { count: Object.keys(rejected).length, templates: rejected },
  });
}

// ─────────────────────────────────────────
// POST: Sposta un template tra gli stadi
// Body: { templateId, action: "approve"|"reject", feedback?: "..." }
// ─────────────────────────────────────────
export async function POST(req) {
  try {
    const body = await req.json();
    const { templateId, action, feedback } = body;

    if (!templateId || !action) {
      return NextResponse.json({ error: "templateId e action sono obbligatori" }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: "action deve essere 'approve' o 'reject'" }, { status: 400 });
    }

    const f = getFiles();
    const review   = readJson(f.review);
    const approved = readJson(f.approved);
    const rejected = readJson(f.rejected);

    // Trova il template (potrebbe essere in review o serve un re-review)
    const template = review[templateId];
    if (!template) {
      return NextResponse.json({ error: `Template "${templateId}" non trovato in review` }, { status: 404 });
    }

    // Rimuovi da review
    delete review[templateId];

    if (action === 'approve') {
      // ✅ Sposta in approved
      template._status = 'approved';
      template._approvedAt = new Date().toISOString();
      template._feedback = feedback || 'Approvato';
      approved[templateId] = template;

      console.log(`✅ Template "${templateId}" → APPROVED`);
    } else {
      // ❌ Sposta in rejected con note
      template._status = 'rejected';
      template._rejectedAt = new Date().toISOString();
      template._feedback = feedback || 'Rigettato senza dettagli';
      rejected[templateId] = template;

      console.log(`❌ Template "${templateId}" → REJECTED: ${feedback || 'no feedback'}`);
    }

    // Salva tutti e 3 i file
    writeJson(f.review, review, f.memoryDir);
    writeJson(f.approved, approved, f.memoryDir);
    writeJson(f.rejected, rejected, f.memoryDir);

    return NextResponse.json({
      success: true,
      templateId,
      action,
      stats: {
        review:   Object.keys(review).length,
        approved: Object.keys(approved).length,
        rejected: Object.keys(rejected).length,
      }
    });

  } catch (error) {
    console.error("❌ ERRORE REVIEW:", error);
    return NextResponse.json({ error: "Errore review", details: error.message }, { status: 500 });
  }
}
