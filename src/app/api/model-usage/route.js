import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

// Limiti giornalieri REALI del free tier Google (Aprile 2026)
// I Pro richiedono billing attivo. Reset a mezzanotte PT.
const DAILY_LIMITS = {
  'gemini-2.5-flash': 250,
  'gemini-2.5-flash-lite': 1000,
  'gemini-2.5-pro': 100,
  'gemini-3.1-flash-lite-preview': 1000,
  'gemini-3.1-pro-preview': 50,
};

export async function GET() {
  const usageFile = path.join(process.cwd(), '_system', 'memory', 'model_usage.json');
  let usage = {};
  try {
    if (fs.existsSync(usageFile)) usage = JSON.parse(fs.readFileSync(usageFile, 'utf-8'));
  } catch (e) { /* vuoto */ }

  const today = new Date().toISOString().slice(0, 10);
  if (usage._date !== today) usage = { _date: today };

  const stats = {};
  for (const [modelId, limit] of Object.entries(DAILY_LIMITS)) {
    const used = usage[modelId] || 0;
    stats[modelId] = {
      used,
      limit,
      percentage: Math.min(100, Math.round((used / limit) * 100)),
      remaining: Math.max(0, limit - used),
    };
  }

  return NextResponse.json({ date: today, stats });
}
