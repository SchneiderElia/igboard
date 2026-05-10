"use client";
import React, { useRef, useEffect, useState } from 'react';
import { DESIGN_MASTER_GRIDS } from '../../constants/design-master-grids';

export default function Canvas({ design }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  // LOGICA DI SCALING: Fa stare un post da 1350px in qualunque schermo
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Calcola lo spazio disponibile direttamente dal viewport (finestra)
        // Sottraiamo un po' di margine per navbar e padding
        const availableWidth = window.innerWidth - 64;
        const availableHeight = window.innerHeight - 150;

        const scaleX = availableWidth / 1080;
        const scaleY = availableHeight / 1350;

        // Sceglie la scala minore per assicurarsi che entri perfettamente nello schermo senza uscire
        const scaleVal = Math.min(scaleX, scaleY);
        setScale(scaleVal);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // LOGICA DI ZOOM MANUALE (Trackpad / Mouse Wheel)
    // Ascoltiamo su window così intercettiamo il pinch-to-zoom in tutta la pagina senza zoomare la UI (nav bar, ecc.)
    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault(); // Blocca lo zoom nativo del browser
      }

      // Moltiplicatore di sensibilità: se e.ctrlKey è true (pinch-to-zoom sul trackpad), è più rapido
      const zoomSensitivity = e.ctrlKey ? 0.005 : 0.001;

      setScale((prevScale) => {
        const newScale = prevScale - (e.deltaY * zoomSensitivity);
        return Math.min(Math.max(0.1, newScale), 5); // Limita lo zoom tra 10% e 500%
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  if (!design) return <div className="text-zinc-500">Incolla un testo e genera...</div>;

  const content = design.content || design || {};
  const colors = design.colors || { bg: '#000000', text: '#ffffff', accent: '#ffff00' };
  const designParams = design.designParams || { tension: 5, balance: 5, archetype: 'Magazine' };
  const fontConfig = design.fontConfig || { pair: 'Editorial', headlineSize: '110px', bodySize: '32px' };

  // Recupera il template master dal nostro database usando l'ID deciso da Gemini
  const templateId = design.layoutTemplate || 'vogue_cover';
  const layout = DESIGN_MASTER_GRIDS[templateId] || DESIGN_MASTER_GRIDS['vogue_cover'];

  // Il Kit delle "Coppie d'Oro" (Typography System)
  const FONT_PAIRS = {
    Editorial: {
      headline: "'Playfair Display', serif",
      body: "'Montserrat', sans-serif",
      googleQuery: 'Montserrat:wght@300;400&family=Playfair+Display:wght@700'
    },
    Brutalist: {
      headline: "'Syne', sans-serif",
      body: "'Space Mono', monospace",
      googleQuery: 'Space+Mono&family=Syne:wght@800'
    },
    Swiss: {
      headline: "'Inter', sans-serif",
      body: "'Inter', sans-serif",
      googleQuery: 'Inter:wght@400;900'
    },
    Minimal: {
      headline: "'Prata', serif",
      body: "'Lato', sans-serif",
      googleQuery: 'Lato:wght@300;400&family=Prata'
    },
    'Neo-Abstract': {
      headline: "'Archivo Black', sans-serif",
      body: "'Archivo', sans-serif",
      googleQuery: 'Archivo:wght@400&family=Archivo+Black'
    }
  };

  const fontPair = FONT_PAIRS[fontConfig.pair] || FONT_PAIRS.Editorial;

  return (
    <div
      ref={containerRef}
      className="w-full flex justify-center items-center p-4 overflow-hidden"
    >
      <link
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?family=${fontPair.googleQuery}&display=swap`}
      />
      {/* Questo wrapper serve a non far occupare 1080px reali al DOM quando scali */}
      <div style={{ width: 1080 * scale, height: 1350 * scale }} className="flex justify-center items-center">
        <div
          id="ig-canvas-capture"
          style={{
            width: '1080px',
            height: '1350px',
            backgroundColor: colors.bg,
            color: colors.text,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
          className="relative shadow-2xl overflow-hidden shrink-0"
        >
          {(() => {
            switch (templateId) {
              case 'vogue_cover':
                return (
                  <div className="w-full h-full p-20 flex flex-col justify-between">
                    <div className="flex justify-end w-full">
                      <h2 className="text-[30px] uppercase tracking-[0.3em] font-light opacity-80 max-w-[50%] text-right" style={{ fontFamily: fontPair.body, color: colors.accent, textWrap: 'balance' }}>
                        {content.subheadline}
                      </h2>
                    </div>
                    <div className="flex-1 flex justify-center items-center py-10">
                      <h1 className="text-[140px] leading-[0.85] text-center" style={{ fontFamily: fontPair.headline, color: colors.accent, fontWeight: 900, textWrap: 'balance' }}>
                        {content.headline}
                      </h1>
                    </div>
                    <div className="flex justify-between items-end w-full">
                      <div className="w-[55%]">
                        {Array.isArray(content.body) ? content.body.map((p, i) => <p key={i} className="text-[28px] mb-4 leading-relaxed" style={{ fontFamily: fontPair.body }}>• {p}</p>) : <p className="text-[28px] leading-relaxed" style={{ fontFamily: fontPair.body }}>{content.body}</p>}
                      </div>
                      <div className="text-[35px] font-bold uppercase tracking-widest flex items-center gap-4" style={{ fontFamily: fontPair.body, color: colors.accent }}>
                        {content.cta} <span className="text-[50px] font-light">→</span>
                      </div>
                    </div>
                  </div>
                );
              case 'koto_minimal':
                return (
                  <div className="w-full h-full p-24 flex flex-col">
                    <h1 className="text-[120px] leading-[0.9] mb-12" style={{ fontFamily: fontPair.headline, color: colors.accent, fontWeight: 800, textWrap: 'balance' }}>
                      {content.headline}
                    </h1>
                    <h2 className="text-[40px] mb-20 opacity-90 border-l-8 pl-8" style={{ borderColor: colors.accent, fontFamily: fontPair.body, textWrap: 'balance' }}>
                      {content.subheadline}
                    </h2>
                    <div className="w-[80%] mb-auto">
                      {Array.isArray(content.body) ? content.body.map((p, i) => <p key={i} className="text-[32px] mb-6 leading-relaxed" style={{ fontFamily: fontPair.body }}>{p}</p>) : <p className="text-[32px] leading-relaxed" style={{ fontFamily: fontPair.body }}>{content.body}</p>}
                    </div>
                    <div className="text-[40px] font-bold uppercase tracking-widest inline-block border-b-4 pb-2" style={{ fontFamily: fontPair.body, color: colors.accent, borderColor: colors.accent, alignSelf: 'flex-start' }}>
                      {content.cta}
                    </div>
                  </div>
                );
              case 'carson_chaos':
                return (
                  <div className="w-full h-full p-12 flex flex-col relative justify-center items-center">
                    <h2 className="absolute top-32 right-12 text-[60px] font-black uppercase text-right leading-[0.9] opacity-80 rotate-6 mix-blend-exclusion" style={{ fontFamily: fontPair.body, color: colors.accent, maxWidth: '60%' }}>
                      {content.subheadline}
                    </h2>
                    <h1 className="text-[180px] leading-[0.75] text-center font-black uppercase -rotate-3 mix-blend-difference z-10" style={{ fontFamily: fontPair.headline, color: colors.accent, textWrap: 'balance' }}>
                      {content.headline}
                    </h1>
                    <div className="absolute bottom-40 left-16 w-[50%]">
                      {Array.isArray(content.body) ? content.body.map((p, i) => <p key={i} className="text-[35px] mb-4 uppercase font-bold leading-none break-words" style={{ fontFamily: fontPair.body }}>{p}</p>) : <p className="text-[35px] uppercase font-bold leading-none break-words" style={{ fontFamily: fontPair.body }}>{content.body}</p>}
                    </div>
                    <div className="absolute top-16 left-12 px-8 py-4 text-[45px] font-black uppercase -rotate-12" style={{ backgroundColor: colors.accent, color: colors.bg, fontFamily: fontPair.headline }}>
                      {content.cta}
                    </div>
                  </div>
                );
              case 'bauhaus_structure':
                return (
                  <div className="w-full h-full flex flex-col p-16">
                    <div className="flex flex-[0.45] border-b-8" style={{ borderColor: colors.accent }}>
                      <div className="w-[60%] border-r-8 pr-16 flex items-end pb-12" style={{ borderColor: colors.accent }}>
                        <h1 className="text-[95px] leading-[0.85] font-black uppercase break-words" style={{ fontFamily: fontPair.headline, color: colors.accent, textWrap: 'balance' }}>
                          {content.headline}
                        </h1>
                      </div>
                      <div className="w-[40%] pl-16 flex items-start pt-12">
                        <h2 className="text-[32px] font-bold uppercase leading-tight break-words" style={{ fontFamily: fontPair.body, textWrap: 'balance' }}>
                          {content.subheadline}
                        </h2>
                      </div>
                    </div>
                    <div className="flex flex-[0.55] pt-12 pb-4">
                      <div className="w-[45%]"></div>
                      <div className="w-[55%] flex flex-col justify-between h-full pl-12">
                        <div>
                          {Array.isArray(content.body) ? content.body.map((p, i) => <p key={i} className="text-[25px] mb-6 text-justify leading-relaxed" style={{ fontFamily: fontPair.body }}>{p}</p>) : <p className="text-[25px] text-justify leading-relaxed" style={{ fontFamily: fontPair.body }}>{content.body}</p>}
                        </div>
                        {content.cta && (
                          <div className="text-[38px] font-black uppercase text-right leading-none mt-4" style={{ color: colors.accent, fontFamily: fontPair.headline }}>
                            {content.cta}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              case 'swiss_grid_strict':
                return (
                  <div className="w-full h-full p-20 flex flex-col">
                    <div className="border-t-8 pt-8 mb-16" style={{ borderColor: colors.accent }}>
                      <h1 className="text-[110px] leading-[0.9] font-bold tracking-tighter" style={{ fontFamily: fontPair.headline, color: colors.accent, textWrap: 'balance' }}>
                        {content.headline}
                      </h1>
                    </div>
                    <div className="w-2/3 mb-16">
                      <h2 className="text-[45px] font-semibold leading-tight" style={{ fontFamily: fontPair.body }}>
                        {content.subheadline}
                      </h2>
                    </div>
                    <div className="flex justify-between mt-auto border-t-4 pt-12" style={{ borderColor: colors.accent }}>
                      <div className="w-1/2">
                        {Array.isArray(content.body) ? content.body.map((p, i) => <p key={i} className="text-[26px] mb-4" style={{ fontFamily: fontPair.body }}>{p}</p>) : <p className="text-[26px]" style={{ fontFamily: fontPair.body }}>{content.body}</p>}
                      </div>
                      <div className="w-1/3">
                        <div className="text-[35px] font-bold pb-2" style={{ color: colors.accent, fontFamily: fontPair.body }}>
                          {content.cta}
                        </div>
                        <div className="h-4 w-full" style={{ backgroundColor: colors.accent }}></div>
                      </div>
                    </div>
                  </div>
                );
              case 'muji_void':
              default:
                return (
                  <div className="w-full h-full p-20 flex flex-col justify-center items-center relative">
                    <div className="text-center w-[60%]">
                      <h1 className="text-[65px] font-light leading-snug tracking-widest mb-8" style={{ fontFamily: fontPair.headline, color: colors.accent, textWrap: 'balance' }}>
                        {content.headline}
                      </h1>
                      <h2 className="text-[22px] font-normal opacity-60 tracking-wider mx-auto" style={{ fontFamily: fontPair.body, textWrap: 'balance' }}>
                        {content.subheadline}
                      </h2>
                    </div>
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center w-[50%] opacity-40">
                      {Array.isArray(content.body) ? content.body.map((p, i) => <p key={i} className="text-[16px] mb-2 tracking-wide" style={{ fontFamily: fontPair.body }}>{p}</p>) : <p className="text-[16px] tracking-wide" style={{ fontFamily: fontPair.body }}>{content.body}</p>}
                    </div>
                    <div className="absolute bottom-40 right-20 flex items-center gap-4 text-[20px] uppercase tracking-widest" style={{ color: colors.accent, fontFamily: fontPair.body }}>
                      <span className="text-[12px]">●</span> {content.cta}
                    </div>
                  </div>
                );
            }
          })()}
        </div>
      </div>
    </div>
  );
}
