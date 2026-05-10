'use client';
import { useState, useRef } from 'react';

export default function VisualFeedbackOverlay({ capturedImage, onClose, onSubmitFeedback }) {
  const containerRef = useRef(null);
  const [annotations, setAnnotations] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentRect, setCurrentRect] = useState(null);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCoordinates = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x, y };
  };

  const handleMouseDown = (e) => {
    if (activeCommentId !== null) return; 
    const { x, y } = getCoordinates(e);
    setStartPos({ x, y });
    setIsDrawing(true);
    setCurrentRect({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    const width = x - startPos.x;
    const height = y - startPos.y;
    
    setCurrentRect({
      x: width < 0 ? x : startPos.x,
      y: height < 0 ? y : startPos.y,
      width: Math.abs(width),
      height: Math.abs(height)
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    if (currentRect && currentRect.width > 2 && currentRect.height > 2) {
      const newId = Date.now();
      const newAnnotation = { id: newId, ...currentRect, text: '' };
      setAnnotations([...annotations, newAnnotation]);
      setActiveCommentId(newId);
    }
    setCurrentRect(null);
  };

  const updateAnnotationText = (id, text) => {
    setAnnotations(annotations.map(a => a.id === id ? { ...a, text } : a));
  };

  const deleteAnnotation = (id) => {
    setAnnotations(annotations.filter(a => a.id !== id));
    setActiveCommentId(null);
  };

  const renderCompositedImage = async () => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(img, 0, 0);
        ctx.strokeStyle = '#ef4444'; 
        ctx.lineWidth = 6;
        
        annotations.forEach(a => {
          const xPx = (a.x / 100) * canvas.width;
          const yPx = (a.y / 100) * canvas.height;
          const wPx = (a.width / 100) * canvas.width;
          const hPx = (a.height / 100) * canvas.height;
          
          ctx.strokeRect(xPx, yPx, wPx, hPx);

          if (a.text) {
             ctx.fillStyle = '#ef4444';
             ctx.fillRect(xPx, yPx - 40, Math.max(wPx, 200), 40);
             ctx.fillStyle = 'white';
             ctx.font = '24px sans-serif';
             ctx.fillText(a.text.substring(0, 30) + (a.text.length > 30 ? '...' : ''), xPx + 10, yPx - 12);
          }
        });
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = capturedImage;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const compositedImageBase64 = await renderCompositedImage();
      const allComments = annotations.map((a, i) => `Errore ${i+1}: ${a.text}`).join('\n\n');
      
      await onSubmitFeedback({
        image: compositedImageBase64,
        comment: allComments,
        annotations_json: annotations
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ottieni l'annotazione attualmente attiva per mostrarne il testo nella bottom bar
  const activeAnnotation = annotations.find(a => a.id === activeCommentId);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-neutral-950/90 backdrop-blur-sm">
      
      {/* TOP PILL BAR (Sempre Visibile) */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[250] flex items-center gap-3 bg-zinc-900/90 backdrop-blur-md rounded-full px-5 py-2 border border-zinc-700/50 shadow-2xl">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
          Debug Mode
        </span>
        <div className="w-px h-4 bg-zinc-700 mx-1"></div>
        <span className="text-xs font-medium text-zinc-400">
          Aree: <strong className="text-white">{annotations.length}</strong>
        </span>
      </div>

      {/* Area Canvas */}
      <div className="flex-1 flex items-center justify-center pt-24 pb-32 px-12 overflow-hidden relative" onClick={() => setActiveCommentId(null)}>
        {/* Tavola Sensibile al Mouse */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={(e) => e.stopPropagation()} // Evita di deselezionare se si clicca sull'immagine senza muovere
          className="relative h-[85%] aspect-[4/5] shadow-2xl rounded-xl overflow-hidden border border-white/10 cursor-crosshair select-none shrink-0 bg-zinc-900"
          style={{ backgroundImage: `url(${capturedImage})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
        >
          {/* Rettangolo temporaneo */}
          {currentRect && (
            <div 
              className="absolute border-2 border-red-500 bg-red-500/10 pointer-events-none"
              style={{
                left: `${currentRect.x}%`, top: `${currentRect.y}%`,
                width: `${currentRect.width}%`, height: `${currentRect.height}%`
              }}
            />
          )}

          {/* Rettangoli consolidati */}
          {annotations.map(ann => (
            <div 
              key={ann.id}
              className={`absolute border-2 transition-colors ${activeCommentId === ann.id ? 'border-yellow-400 bg-yellow-400/20 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'border-red-500 bg-red-500/10 hover:border-red-400 hover:bg-red-500/20'}`}
              style={{ left: `${ann.x}%`, top: `${ann.y}%`, width: `${ann.width}%`, height: `${ann.height}%` }}
              onClick={(e) => { e.stopPropagation(); setActiveCommentId(ann.id); }}
            />
          ))}
        </div>
      </div>

      {/* OVERLAY SFOCATURA QUANDO SI DIGITA (senza grana) */}
      {activeCommentId !== null && (
        <div 
          className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-md transition-all"
          onClick={() => setActiveCommentId(null)}
        />
      )}

      {/* BOTTOM BAR CONDIZIONALE */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-2xl">
        {activeCommentId !== null && activeAnnotation ? (
          /* BARRA INPUT COMMENTO SOTTILE */
          <div 
            className="flex items-center gap-2 bg-zinc-900/90 backdrop-blur-xl border border-zinc-700 shadow-2xl rounded-2xl p-2"
            onClick={e => e.stopPropagation()}
          >
            <input
              autoFocus
              type="text"
              placeholder="Descrivi l'errore qui..."
              value={activeAnnotation.text}
              onChange={(e) => updateAnnotationText(activeCommentId, e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setActiveCommentId(null)}
              className="flex-1 bg-transparent border-none text-white text-sm px-4 focus:outline-none placeholder-zinc-500"
            />
            <button 
              onClick={() => deleteAnnotation(activeCommentId)} 
              title="Elimina selezione"
              className="p-3 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
            <button 
              onClick={() => setActiveCommentId(null)} 
              title="Salva nota"
              className="p-3 bg-white text-black hover:bg-zinc-200 rounded-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </div>
        ) : (
          /* BARRA AZIONI GLOBALI */
          <div className="flex items-center justify-between bg-zinc-900/90 backdrop-blur-xl border border-zinc-700 shadow-2xl rounded-2xl p-2">
            <button 
              onClick={onClose} 
              className="px-6 py-3 text-zinc-400 hover:text-white rounded-xl transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              Annulla Tutto
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || annotations.length === 0}
              className="px-8 py-3 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              {isSubmitting ? 'Invio...' : 'Invia a Gemini'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
