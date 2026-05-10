'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import Canvas from "@/components/canvas/Canvas";
import BottomNavbar from "@/components/layout/BottomNavbar";
import FeedbackPill from "@/components/ui/FeedbackPill";
import VisualFeedbackOverlay from "@/components/ui/VisualFeedbackOverlay";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function Home() {
  const [design, setDesign] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('super') === 'true') {
        setIsAdmin(true);
      }
    }
  }, []);

  if (isAdmin) {
    return <AdminDashboard />;
  }

  const handleApprove = () => {
    console.log("✅ Design Approvato:", design?.layoutTemplate);
  };

  const handleReject = async () => {
    try {
      setIsCapturing(true);
      const canvasNode = document.getElementById('ig-canvas-capture');
      if (!canvasNode) throw new Error("Canvas non trovato");

      // html2canvas fa una "fotografia" del div esatto
      const canvas = await html2canvas(canvasNode, {
        scale: 1, // scala 1 per tenere le dimensioni originali
        useCORS: true,
        backgroundColor: null
      });
      
      const imageBase64 = canvas.toDataURL("image/png");
      setCapturedImage(imageBase64);
    } catch (err) {
      console.error("Errore durante la cattura dello schermo:", err);
      alert("Si è verificato un errore durante l'acquisizione dell'immagine.");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      console.log("Salvataggio del feedback in memoria...");
      
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...feedbackData,
          design: design // Passiamo anche i dati originali del design (il DNA del layout che ha fallito)
        })
      });

      if (!response.ok) {
        throw new Error("Errore salvataggio API");
      }

      alert("🚀 Feedback e Screenshot salvati correttamente in _system/memory!");
    } catch (err) {
      console.error(err);
      alert("Si è verificato un errore durante il salvataggio.");
    } finally {
      setCapturedImage(null); // Chiudi l'overlay in ogni caso
    }
  };

  return (
    <div className="flex flex-1 flex-col relative h-screen w-full overflow-hidden bg-neutral-900">
      {/* V3 LINK */}
      <Link 
        href="/v3" 
        className="absolute top-6 right-6 z-[60] px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-bold tracking-widest uppercase transition-all"
      >
        v3
      </Link>

      <div className="flex flex-1 items-center justify-center p-4 relative">
        <Canvas design={design} />

        {/* AI ADVICE PILL (Lassù a sinistra, stile FeedbackPill) */}
        {design?.designParams?.textWarning && !capturedImage && (
          <div className="absolute top-6 left-6 z-50 flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md rounded-full p-1.5 px-4 border border-yellow-500/50 shadow-2xl animate-in fade-in slide-in-from-top-2">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
            <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">
              Suggerito: Carosello
            </span>
          </div>
        )}

        {/* FEEDBACK OVERLAY (Evolutionary Memory - Fase 1) */}
        {design && !capturedImage && (
          <FeedbackPill 
            key={design._meta?.id || 'initial'} 
            onApprove={handleApprove} 
            onReject={handleReject} 
            isCapturing={isCapturing} 
          />
        )}

        {/* OVERLAY INTERATTIVO (Fase 2) */}
        {capturedImage && (
          <VisualFeedbackOverlay 
            capturedImage={capturedImage}
            onClose={() => setCapturedImage(null)}
            onSubmitFeedback={handleFeedbackSubmit}
          />
        )}
      </div>
      <BottomNavbar onUpdateDesign={setDesign} />
    </div>
  );
}
