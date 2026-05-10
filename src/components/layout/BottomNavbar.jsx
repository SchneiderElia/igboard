'use client';
import { useState, useRef, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// MODELLI DISPONIBILI
// Fonte: GET /v1beta/models (API Key verificata live)
// tier: 'free' = usabile subito | 'pro' = richiede billing attivo
// ═══════════════════════════════════════════════════════════════
const MODELS = [

  // ── TIER FREE — usabili subito con API key standard ──────────
  {
    id: 'gemini-2.5-flash',
    name: '2.5 Flash',
    badge: '🏆 Consigliato',
    desc: 'Miglior compromesso per questo progetto: segue istruzioni complesse, veloce, analisi immagini ottima.',
    speed: 85,
    quality: 90,
    tier: 'free',
  },
  {
    id: 'gemini-2.5-flash-lite',
    name: '2.5 Flash Lite',
    badge: '⚡ Veloce',
    desc: 'Versione alleggerita del 2.5 Flash. Perfetto per generazioni rapide e prototipazione.',
    speed: 93,
    quality: 74,
    tier: 'free',
  },
  {
    id: 'gemini-3-flash-preview',
    name: '3.0 Flash',
    badge: '🚀 Serie 3',
    desc: 'Prima gen della serie 3 ottimizzata per velocità. Buona visione artificiale per analisi layout.',
    speed: 88,
    quality: 82,
    tier: 'free',
  },
  {
    id: 'gemini-3.1-flash-lite-preview',
    name: '3.1 Flash Lite',
    badge: 'Velocissimo',
    desc: 'Il più rapido disponibile. Ideale per test rapidi. Meno preciso su istruzioni strutturate.',
    speed: 98,
    quality: 62,
    tier: 'free',
  },
  {
    id: 'gemini-2.0-flash',
    name: '2.0 Flash',
    badge: 'Stabile',
    desc: 'Modello solido e affidabile della serie 2.0. Buon fallback se i modelli più recenti sono instabili.',
    speed: 88,
    quality: 78,
    tier: 'free',
  },
  {
    id: 'gemini-2.0-flash-lite',
    name: '2.0 Flash Lite',
    badge: 'Economico',
    desc: 'Versione lite della serie 2.0. Molto economica per generazioni in volume.',
    speed: 95,
    quality: 60,
    tier: 'free',
  },

  // ── TIER PRO — richiedono billing/account Google Cloud attivo ─
  {
    id: 'gemini-2.5-pro',
    name: '2.5 Pro',
    badge: '💎 Pro',
    desc: 'Massima precisione nella serie 2.5. Segue istruzioni JSON complesse perfettamente. Richiede billing.',
    speed: 55,
    quality: 98,
    tier: 'pro',
    disabled: true,
  },
  {
    id: 'gemini-3-pro-preview',
    name: '3.0 Pro',
    badge: '💎 Pro',
    desc: 'Versione Pro della serie 3. Ricalco strutturale eccellente. Richiede billing attivo.',
    speed: 50,
    quality: 96,
    tier: 'pro',
    disabled: true,
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: '3.1 Pro',
    badge: '🔱 Flagship',
    desc: 'Il modello più avanzato disponibile. Per layout critici e analisi visiva di massima precisione. Richiede billing.',
    speed: 45,
    quality: 100,
    tier: 'pro',
    disabled: true,
  },

  // ── VISION / SPERIMENTALI — ottimizzati per analisi immagini ─
  {
    id: 'gemini-2.5-flash-image',
    name: '2.5 Flash Image',
    badge: '🖼️ Vision',
    desc: 'Specializzato nella comprensione di immagini. Ottimo per modalità Vision e Pattern Reconstructor.',
    speed: 82,
    quality: 88,
    tier: 'free',
  },
  {
    id: 'gemini-3.1-flash-image-preview',
    name: '3.1 Flash Image',
    badge: '🖼️ Vision+',
    desc: 'Ultima gen ottimizzata per vision. Ideale per clonare layout da screenshot con precisione forense.',
    speed: 85,
    quality: 92,
    tier: 'free',
  },
];

// ═══════════════════════════════════════════════════════════════
// SPINNER
// ═══════════════════════════════════════════════════════════════
function TriangleSpinner() {
  return (
    <div className="relative w-5 h-5">
      <style jsx>{`
        @keyframes orbit { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.7); } }
        .orbit-ring { animation: orbit 1.2s linear infinite; }
        .dot-1 { animation: pulse 1.2s ease-in-out infinite; }
        .dot-2 { animation: pulse 1.2s ease-in-out infinite 0.4s; }
        .dot-3 { animation: pulse 1.2s ease-in-out infinite 0.8s; }
      `}</style>
      <div className="orbit-ring absolute inset-0">
        <div className="dot-1 absolute w-[6px] h-[6px] rounded-full bg-current" style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }} />
        <div className="dot-2 absolute w-[6px] h-[6px] rounded-full bg-current" style={{ bottom: '1px', left: '2px' }} />
        <div className="dot-3 absolute w-[6px] h-[6px] rounded-full bg-current" style={{ bottom: '1px', right: '2px' }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MINI BAR
// ═══════════════════════════════════════════════════════════════
function MiniBar({ value, color = 'emerald' }) {
  const cls = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    violet: 'bg-violet-500',
    rose: 'bg-rose-500',
    sky: 'bg-sky-500',
  };
  return (
    <div className="w-full h-1.5 bg-zinc-700/50 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${cls[color]} transition-all duration-500`} style={{ width: `${value}%` }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODEL CARD (componente singola card nel panel)
// ═══════════════════════════════════════════════════════════════
function ModelCard({ model, isActive, stats, onSelect }) {
  const usageColor = stats.percentage > 85 ? 'rose' : stats.percentage > 60 ? 'amber' : 'sky';
  const badgeClass = model.tier === 'pro'
    ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
    : model.badge.includes('Consigliato')
    ? 'bg-emerald-500/20 text-emerald-400'
    : model.badge.includes('Vision')
    ? 'bg-sky-500/15 text-sky-400'
    : 'bg-zinc-700/50 text-zinc-400';

  return (
    <button
      onClick={() => onSelect(model.id)}
      className={`relative flex flex-col p-3 rounded-xl border transition-all duration-200 ${
        isActive
          ? 'bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/5'
          : model.tier === 'pro'
          ? 'bg-violet-900/10 border-violet-700/20 hover:border-violet-600/40 hover:bg-violet-900/20'
          : 'bg-zinc-800/40 border-zinc-700/30 hover:bg-zinc-800/80 hover:border-zinc-600/50'
      }`}
    >
      {/* Pin attivo */}
      {isActive && (
        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Nome + badge */}
      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
        <span className={`text-sm font-bold ${isActive ? 'text-emerald-400' : model.tier === 'pro' ? 'text-violet-300' : 'text-zinc-200'}`}>
          {model.name}
        </span>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeClass}`}>
          {model.badge}
        </span>
      </div>

      {/* Descrizione */}
      <p className="text-[11px] text-zinc-400 leading-snug mb-2 pr-2">{model.desc}</p>

      {/* Barre: Velocità, Qualità, Uso oggi */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Velocità</span>
          <MiniBar value={model.speed} color="amber" />
        </div>
        <div className="flex-1">
          <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Qualità</span>
          <MiniBar value={model.quality} color="emerald" />
        </div>
        {model.tier === 'free' && (
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Uso oggi</span>
              <span className={`text-[9px] font-bold ${stats.percentage > 85 ? 'text-rose-400' : 'text-zinc-400'}`}>
                {stats.used}/{stats.limit}
              </span>
            </div>
            <MiniBar value={stats.percentage} color={usageColor} />
          </div>
        )}
        {model.tier === 'pro' && (
          <div className="flex-1">
            <span className="text-[9px] text-violet-500 uppercase tracking-wider">Billing req.</span>
            <div className="h-1.5 bg-violet-900/30 rounded-full mt-0.5 flex items-center justify-center">
              <span className="text-[8px] text-violet-500">🔒</span>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// FASI DI GENERAZIONE
// ═══════════════════════════════════════════════════════════════
const PHASES = [
  { text: 'Analisi testo…' },
  { text: 'Selezione template…' },
  { text: 'Art Direction AI…' },
  { text: 'Composizione…' },
];

export default function BottomNavbar({ onUpdateDesign }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [showModelPanel, setShowModelPanel] = useState(false);
  const [usageStats, setUsageStats] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const [genMode, setGenMode] = useState('template'); // 'template' | 'vision' | 'mixed'
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);
  const panelRef = useRef(null);

  // Chiudi panel cliccando fuori
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setShowModelPanel(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Carica usage stats quando si apre il panel
  useEffect(() => {
    if (showModelPanel) {
      fetch('/api/model-usage')
        .then(r => r.json())
        .then(data => setUsageStats(data.stats || {}))
        .catch(() => {});
    }
  }, [showModelPanel]);

  const handleGenerate = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setShowModelPanel(false);
    setErrorMsg(null);

    let idx = 0;
    const iv = setInterval(() => {
      if (idx < PHASES.length) { setPhase(PHASES[idx].text); idx++; }
    }, 1200);

    try {
      setPhase(PHASES[0].text);
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt: text, model: selectedModel, mode: genMode }),
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.details || errData.error || "Errore sconosciuto");
      }

      const design = await res.json();
      if (design.error) throw new Error(design.error);
      setPhase('Rendering ✓');

      // Aggiorna stats d'uso dopo la generazione
      fetch('/api/model-usage').then(r => r.json()).then(d => setUsageStats(d.stats || {})).catch(() => {});

      setTimeout(() => { onUpdateDesign(design); setPhase(''); setLoading(false); }, 400);
    } catch (e) {
      console.error("Errore:", e);
      setPhase('Errore ✕');
      setErrorMsg(e.message);
      setTimeout(() => { setPhase(''); setLoading(false); }, 1500);
      // Auto-hide errore dopo 5s
      setTimeout(() => setErrorMsg(null), 5000);
    }
    clearInterval(iv);
  };

  const handleAgentAI = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setShowModelPanel(false);
    setErrorMsg(null);

    let idx = 0;
    const iv = setInterval(() => {
      if (idx < PHASES.length) { setPhase(PHASES[idx].text); idx++; }
    }, 1200);

    try {
      setPhase('Vision Analysis…');
      const res = await fetch('/api/agent-ai', {
        method: 'POST',
        body: JSON.stringify({ 
          prompt: text, 
          model: selectedModel,
          image: uploadedImage // Passa l'immagine caricata se presente
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.details || errData.error || "Errore sconosciuto (Forse Quota Pro)");
      }

      const design = await res.json();
      if (design.error) throw new Error(design.error);
      setPhase('Rendering ✓');

      // Aggiorna stats d'uso dopo la generazione
      fetch('/api/model-usage').then(r => r.json()).then(d => setUsageStats(d.stats || {})).catch(() => {});

      setTimeout(() => { onUpdateDesign(design); setPhase(''); setLoading(false); }, 400);
    } catch (e) {
      console.error("Errore Agent AI:", e);
      setPhase('Errore ✕');
      setErrorMsg(e.message);
      setTimeout(() => { setPhase(''); setLoading(false); }, 1500);
      setTimeout(() => setErrorMsg(null), 5000);
    }
    clearInterval(iv);
  };

  const handleReMap = async () => {
    if (loading) return;
    setLoading(true);
    setShowModelPanel(false);
    setErrorMsg(null);

    let idx = 0;
    const iv = setInterval(() => {
      if (idx < PHASES.length) { setPhase(PHASES[idx].text); idx++; }
    }, 1200);

    try {
      setPhase('ReMap Analysis…');
      const res = await fetch('/api/agent-ai', {
        method: 'POST',
        body: JSON.stringify({ 
          prompt: "", 
          isReMap: true, 
          model: selectedModel,
          image: uploadedImage // Passa l'immagine caricata se presente
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.details || errData.error || "Errore sconosciuto");
      }

      const design = await res.json();
      if (design.error) throw new Error(design.error);
      setPhase('Rendering ✓');

      setTimeout(() => { onUpdateDesign(design); setPhase(''); setLoading(false); }, 400);
    } catch (e) {
      console.error("Errore ReMap:", e);
      setPhase('Errore ✕');
      setErrorMsg(e.message);
      setTimeout(() => { setPhase(''); setLoading(false); }, 1500);
      setTimeout(() => setErrorMsg(null), 5000);
    }
    clearInterval(iv);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const currentModel = MODELS.find(m => m.id === selectedModel) || MODELS[0];

  return (
    <>
      {/* ═══ MODEL SELECTOR PANEL (full-width, fuori dal wrapper stretto) ═══ */}
      {showModelPanel && (
        <div
          className="fixed bottom-24 left-4 right-4 z-50 rounded-2xl bg-zinc-900/97 backdrop-blur-xl border border-zinc-700/60 shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
          style={{ animation: 'slideUp 0.25s ease-out' }}
          ref={panelRef}
        >
          <style jsx>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(16px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Header (Sticky) */}
          <div className="px-5 py-4 border-b border-zinc-700/40 flex items-center justify-between shrink-0 bg-zinc-900/50">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-widest">Seleziona Intelligenza</h3>
                <p className="text-[10px] text-zinc-500 font-medium">
                  {MODELS.filter(m => m.tier === 'free').length} Modelli Disponibili · {MODELS.filter(m => m.tier === 'pro').length} Premium (Billing req.)
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowModelPanel(false)} 
              className="p-2 rounded-full hover:bg-white/5 text-zinc-500 hover:text-zinc-200 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Area Contenuto (Scrollabile) */}
          <div className="p-4 overflow-y-auto custom-scrollbar space-y-8 pb-8">
            
            {/* ── SEZIONE FREE ── */}
            <section>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/80 shrink-0">Free Tier</span>
                <div className="h-px flex-1 bg-gradient-to-right from-emerald-500/20 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {MODELS.filter(m => m.tier === 'free').map((model) => (
                  <ModelCard 
                    key={model.id} 
                    model={model} 
                    isActive={selectedModel === model.id} 
                    stats={usageStats[model.id] || { used: 0, limit: 500, percentage: 0, remaining: 500 }} 
                    onSelect={(id) => { setSelectedModel(id); setShowModelPanel(false); }} 
                  />
                ))}
              </div>
            </section>

            {/* ── SEZIONE PRO ── */}
            <section>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-500/80 shrink-0">Premium Tier</span>
                <div className="h-px flex-1 bg-gradient-to-right from-violet-500/20 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {MODELS.filter(m => m.tier === 'pro').map((model) => (
                  <ModelCard 
                    key={model.id} 
                    model={model} 
                    isActive={selectedModel === model.id} 
                    stats={usageStats[model.id] || { used: 0, limit: 500, percentage: 0, remaining: 500 }} 
                    onSelect={(id) => { setSelectedModel(id); setShowModelPanel(false); }} 
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ═══ WRAPPER STRETTO BOTTOM BAR ═══ */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50" ref={showModelPanel ? null : panelRef}>

      {errorMsg && (
        <div 
          className="mb-3 p-4 rounded-xl border-2 border-red-600 bg-black/40 backdrop-blur-md relative overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-2"
        >
          {/* Overlay nero 20% sotto il testo */}
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          
          <div className="relative z-10 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Errore Generazione</h4>
              <p className="text-sm text-white font-medium leading-snug">{errorMsg}</p>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-zinc-400 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* ═══ BOTTOM BAR ═══ */}
      <div className="flex items-end gap-3 px-4">
        <nav className="flex-1 rounded-2xl bg-white/80 backdrop-blur-md border border-zinc-200 shadow-lg dark:bg-black/80 dark:border-zinc-800 p-2">
          <div className="flex items-center gap-2 h-12 px-2">
            {/* Model selector button */}
            <button
              onClick={() => setShowModelPanel(!showModelPanel)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
                showModelPanel
                  ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 border border-transparent'
              }`}
              title={`Modello: ${currentModel.name}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden sm:inline">{currentModel.name}</span>
            </button>

            {/* Input */}
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="Incolla il tuo testo qui…"
              disabled={loading}
              className="flex-1 bg-transparent px-3 py-2 text-sm outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 disabled:opacity-40 min-w-0"
            />

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !text.trim()}
              className="relative bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium dark:bg-white dark:text-black hover:opacity-80 transition-all disabled:opacity-50 min-w-[120px] flex items-center justify-center gap-2 shrink-0"
            >
              {loading ? (
                <>
                  <TriangleSpinner />
                  <span className="text-xs tracking-wide">{phase}</span>
                </>
              ) : (
                'Genera'
              )}
            </button>

            {/* Agent AI Button (Solo in Pro Mode) */}
            {genMode === 'pro' && (
              <>
                <button
                  onClick={handleAgentAI}
                  disabled={loading || !text.trim()}
                  className="relative bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-violet-500/30"
                >
                  ✨ Agent AI
                </button>
                <button
                  onClick={handleReMap}
                  disabled={loading}
                  className="relative bg-zinc-900 border border-zinc-700 text-white px-4 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
                  title="Clona visivamente il DNA senza prompt (Usa Lorem Ipsum)"
                >
                  🎯 reMap
                </button>
                <div className="flex items-center">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-2.5 rounded-xl border transition-all ${
                      uploadedImage 
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                        : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                    title={uploadedImage ? "DNA Caricato (clicca per cambiare)" : "Carica immagine DNA Master"}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-5-8l-5-5m0 0l-5 5m5-5v12" />
                    </svg>
                    {uploadedImage && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </nav>

        {/* DESIGN MODE SELECTOR (Pillola a destra) */}
        <div className="flex gap-1 bg-zinc-800/50 p-1 rounded-xl border border-zinc-700/50">
          <button
            onClick={() => setGenMode('default')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
              genMode === 'default' || genMode === 'template' 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Auto-Grid (Generazione Dinamica)"
          >
            Modo: Def
          </button>
          <button
            onClick={() => setGenMode('pro')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
              genMode === 'pro' 
                ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/20' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Pro Mode (Agent AI & Visual Cloning)"
          >
            Modo: Pro
          </button>
        </div>

        {/* AI STATUS INDICATOR (Fisso, bianco opaco, rosso su errore) */}
        <div 
          className={`h-16 w-16 rounded-2xl flex flex-col items-center justify-center gap-0.5 shadow-lg border shrink-0 translate-y-0.5 bg-white dark:bg-zinc-900 ${
            errorMsg 
              ? 'border-red-500' 
              : 'border-zinc-200 dark:border-zinc-800'
          }`}
        >
          <svg className={`w-7 h-7 transition-colors duration-300 ${errorMsg ? 'text-red-500' : 'text-zinc-400 dark:text-zinc-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-4M9 5a2 2 0 012 2v12a2 2 0 01-2 2M15 5a2 2 0 01-2 2v12a2 2 0 012 2m-6-4h6" />
          </svg>
          <span className={`text-[9px] font-black tracking-tighter uppercase leading-none ${errorMsg ? 'text-red-500' : 'text-zinc-400 dark:text-zinc-500'}`}>
            {errorMsg ? 'Err' : 'IA'}
          </span>
        </div>
      </div>
    </div>
    </>
  );
}
