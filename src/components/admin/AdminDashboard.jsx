'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [activeAnnotationId, setActiveAnnotationId] = useState(null);

  useEffect(() => {
    fetch('/api/feedback')
      .then(res => res.json())
      .then(data => setLogs(data.reverse())) // dal più recente
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex h-screen w-full bg-neutral-950 text-white overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <div className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full shrink-0">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-xl font-bold tracking-tight">RLHF Dashboard</h1>
          <p className="text-xs text-zinc-400 mt-1">Database Errori & Self-Healing</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {logs.map((log) => (
            <div 
              key={log.id} 
              onClick={() => { setSelectedLog(log); setActiveAnnotationId(null); }}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedLog?.id === log.id ? 'bg-zinc-800 border-zinc-600 shadow-lg' : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50'}`}
            >
              <div className="text-xs text-zinc-500 mb-2">{new Date(log.date).toLocaleString()}</div>
              <div className="text-sm font-medium line-clamp-2">{log.comment || "Nessun commento globale"}</div>
              <div className="mt-3 flex gap-2">
                <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[10px] rounded uppercase font-bold">
                  {log.annotations?.length || 0} Errori
                </span>
                <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-[10px] rounded uppercase font-bold">
                  {log.design_context?.layoutTemplate || 'Unknown'}
                </span>
              </div>
            </div>
          ))}
          {logs.length === 0 && <div className="text-zinc-500 text-sm p-4 text-center">Nessun log trovato.</div>}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full bg-neutral-950 relative overflow-hidden">
        {selectedLog ? (
          <div className="flex-1 flex items-center justify-center p-12 relative">
            
            {/* L'immagine con le aree sensibili invisibili sovrapposte */}
            <div className="relative h-full aspect-[4/5] shadow-2xl bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shrink-0">
              {/* L'immagine di background (contiene già i rettangoli disegnati dal canvas) */}
              <img 
                src={`/api/image?file=${selectedLog.imageFile}`} 
                alt="Feedback Screenshot"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />
              
              {/* Hotspots interattivi basati sul JSON */}
              {selectedLog.annotations?.map(ann => (
                <div 
                  key={ann.id}
                  className={`absolute cursor-pointer transition-colors ${activeAnnotationId === ann.id ? 'bg-yellow-400/30 border-2 border-yellow-400' : 'bg-transparent hover:bg-white/10'}`}
                  style={{ left: `${ann.x}%`, top: `${ann.y}%`, width: `${ann.width}%`, height: `${ann.height}%` }}
                  onClick={(e) => { e.stopPropagation(); setActiveAnnotationId(ann.id); }}
                >
                  {/* Etichetta Testuale Dettagliata (visibile al click) */}
                  {activeAnnotationId === ann.id && (
                    <div 
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-zinc-900 border border-zinc-700 shadow-2xl p-4 rounded-xl text-sm z-50"
                      onClick={e => e.stopPropagation()}
                    >
                      <strong className="block text-red-400 text-xs mb-1 uppercase tracking-wider">Errore Segnalato:</strong>
                      {ann.text}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-600">
            Seleziona un log dalla barra laterale per visualizzare il report.
          </div>
        )}
      </div>

    </div>
  );
}
