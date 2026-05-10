'use client';

const MODELS = [
  { id: 'gemini-2.5-flash', name: '2.5 Flash', tier: 'free', badge: '🏆 Consigliato', color: '#10b981' },
  { id: 'gemini-2.5-flash-lite', name: '2.5 Flash Lite', tier: 'free', badge: '⚡ Veloce', color: '#14b8a6' },
  { id: 'gemini-3-flash-preview', name: '3.0 Flash', tier: 'free', badge: '🚀 Serie 3', color: '#06b6d4' },
  { id: 'gemini-3.1-flash-lite-preview', name: '3.1 Flash Lite', tier: 'free', badge: 'Velocissimo', color: '#0ea5e9' },
  { id: 'gemini-2.0-flash', name: '2.0 Flash', tier: 'free', badge: 'Stabile', color: '#3b82f6' },
  { id: 'gemini-2.0-flash-lite', name: '2.0 Flash Lite', tier: 'free', badge: 'Economico', color: '#6366f1' },
  { id: 'gemini-2.5-flash-image', name: '2.5 Flash Image', tier: 'free', badge: '🖼️ Vision', color: '#ec4899' },
  { id: 'gemini-3.1-flash-image-preview', name: '3.1 Flash Image', tier: 'free', badge: '🖼️ Vision+', color: '#d946ef' },
  { id: 'gemini-2.5-pro', name: '2.5 Pro', tier: 'pro', badge: '💎 Pro', color: '#f59e0b', locked: true },
  { id: 'gemini-3-pro-preview', name: '3.0 Pro', tier: 'pro', badge: '💎 Pro', color: '#f97316', locked: true },
  { id: 'gemini-3.1-pro-preview', name: '3.1 Pro', tier: 'pro', badge: '🔱 Flagship', color: '#6366f1', locked: true },
];

export default function ModelSwitcher({ selectedModel, onSelectModel }) {
  const freeModels = MODELS.filter(m => m.tier === 'free');
  const proModels = MODELS.filter(m => m.tier === 'pro');

  const ModelButton = ({ model }) => (
    <button
      key={model.id}
      onClick={() => onSelectModel(model.id)}
      className={`relative px-3 py-1.5 rounded-xl text-[9px] font-bold transition-all flex items-center gap-2 border ${
        selectedModel === model.id
          ? 'bg-zinc-800 border-white/20 text-white shadow-lg'
          : 'bg-zinc-950/40 border-transparent text-zinc-500 hover:bg-zinc-900/50'
      } ${model.locked ? 'cursor-not-allowed opacity-80' : ''}`}
    >
      <div 
        className={`w-1.5 h-1.5 rounded-full ${selectedModel === model.id ? 'animate-pulse' : ''}`} 
        style={{ backgroundColor: model.color, boxShadow: selectedModel === model.id ? `0 0-8px ${model.color}` : 'none' }}
      />
      <span className="whitespace-nowrap">{model.name}</span>
      {model.locked && <span className="text-[8px] grayscale opacity-50">🔒</span>}
    </button>
  );

  return (
    <div className="flex flex-col gap-2 p-3 bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl">
      {/* SEZIONE FREE */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">Free</span>
        {freeModels.map(m => <ModelButton key={m.id} model={m} />)}
      </div>

      {/* SEZIONE PRO */}
      <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-2">
        <span className="text-[8px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">Pro (Card Req)</span>
        {proModels.map(m => <ModelButton key={m.id} model={m} />)}
      </div>
    </div>
  );
}
