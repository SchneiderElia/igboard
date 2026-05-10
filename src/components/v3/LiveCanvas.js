'use client';
import { useEffect, useRef } from 'react';

export default function LiveCanvas({ codeBlocks }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const html = codeBlocks?.find(b => b.lang === 'html')?.code || '<canvas id="canvas"></canvas>';
    const css = codeBlocks?.find(b => b.lang === 'css')?.code || '';
    const js = codeBlocks?.find(b => b.lang === 'javascript')?.code || '';

    // Determinazione delle librerie da caricare
    const scripts = [];
    if (js.includes('setup()') || js.includes('draw()') || js.toLowerCase().includes('p5')) {
      scripts.push('https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.js');
    }
    if (js.includes('gsap')) {
      scripts.push('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
    }
    if (js.includes('fabric')) {
      scripts.push('https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js');
    }

    const scriptTags = scripts.map(src => `<script src="${src}"></script>`).join('\n');

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              margin: 0; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: 100vh; 
              background: transparent; 
              overflow: hidden;
              font-family: sans-serif;
            }
            #canvas-container {
              width: 1080px;
              height: 1350px;
              background: white;
              position: relative;
              box-shadow: 0 0 100px rgba(0, 0, 0, 0.8);
              display: flex;
              justify-content: center;
              align-items: center;
              transform: scale(0.4);
              transform-origin: center;
              overflow: hidden;
            }
            canvas {
              max-width: 100%;
              max-height: 100%;
            }
            ${css}
          </style>
          ${scriptTags}
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          <div id="canvas-container">
            ${html}
          </div>
          <script>
            // Autoresize logic to fit container
            function resize() {
              const container = document.getElementById('canvas-container');
              const availableW = window.innerWidth * 0.95;
              const availableH = window.innerHeight * 0.95;
              const scale = Math.min(availableW / 1080, availableH / 1350);
              container.style.transform = \`scale(\${scale})\`;
            }
            window.addEventListener('resize', resize);
            resize();

            try {
              ${js}
            } catch (err) {
              console.error("Canvas Error:", err);
              document.body.innerHTML += \`<div style="position:fixed; top:0; left:0; background:rgba(255,0,0,0.8); color:white; padding:10px; font-family:monospace; font-size:12px; z-index:9999;">\${err.message}</div>\`;
            }
          </script>
        </body>
      </html>
    `;

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;

    return () => URL.revokeObjectURL(url);
  }, [codeBlocks]);

  return (
    <div className="w-full h-full bg-transparent overflow-hidden relative">
      <iframe
        ref={iframeRef}
        className="w-full h-full border-none"
        title="Live Canvas Preview"
        sandbox="allow-scripts"
      />
    </div>
  );
}
