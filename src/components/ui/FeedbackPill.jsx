'use client';
import { useState } from 'react';

export default function FeedbackPill({ onApprove, onReject, isCapturing }) {
  const [state, setState] = useState('idle'); // idle | approved | hiding

  const handleApprove = () => {
    setState('approved');
    onApprove();
    setTimeout(() => setState('hiding'), 1400);
    setTimeout(() => setState('gone'), 1800);
  };

  if (state === 'gone') return null;

  return (
    <div
      className={`absolute top-6 right-6 z-50 flex items-center gap-1 backdrop-blur-md rounded-full p-1.5 border shadow-2xl transition-all duration-500 ${
        state === 'approved'
          ? 'bg-emerald-500 border-emerald-400 scale-105'
          : state === 'hiding'
          ? 'bg-emerald-500 border-emerald-400 opacity-0 scale-95 translate-y-[-8px]'
          : 'bg-zinc-900/90 border-zinc-700/50'
      }`}
    >
      {state === 'approved' || state === 'hiding' ? (
        <div className="flex items-center gap-2 px-4 py-1">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
          <span className="text-sm font-bold text-white tracking-wide">Design Approvato</span>
        </div>
      ) : (
        <>
          <span className="px-3 pl-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em]">
            AI Feedback
          </span>

          <button
            onClick={handleApprove}
            title="Approva Layout"
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-emerald-500/10 transition-colors group"
          >
            <div className="w-4 h-4 rounded-full bg-emerald-500/30 border border-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.8)] transition-all duration-300">
              <svg className="w-2.5 h-2.5 text-emerald-200 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </button>

          <button
            onClick={onReject}
            disabled={isCapturing}
            title="Scarta e Correggi"
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-rose-500/10 transition-colors group disabled:opacity-40"
          >
            <div className="w-4 h-4 rounded-full bg-rose-500/30 border border-rose-500 flex items-center justify-center group-hover:bg-rose-500 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.8)] transition-all duration-300">
              <svg className="w-2.5 h-2.5 text-rose-200 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </button>
        </>
      )}
    </div>
  );
}
