'use client';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import ModelSwitcher from '@/components/v3/ModelSwitcher';
import MessageList from '@/components/v3/MessageList';
import ChatInput from '@/components/v3/ChatInput';
import LiveCanvas from '@/components/v3/LiveCanvas';

export default function V3Page() {
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [isLoading, setIsLoading] = useState(false);
  const [showUsage, setShowUsage] = useState(false);
  const [usageStats, setUsageStats] = useState({});
  const [isCanvasOpen, setIsCanvasOpen] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const r = await fetch('/api/model-usage');
        const data = await r.json();
        setUsageStats(data.stats || {});
      } catch (err) {}
    };
    fetchUsage();
    const interval = setInterval(fetchUsage, 10000);
    return () => clearInterval(interval);
  }, []);

  // Estrazione blocchi di codice per il Canvas
  const activeCodeBlocks = useMemo(() => {
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
    if (!lastAssistantMessage) return null;

    const blocks = [];
    const regex = /```(html|css|javascript)\n([\s\S]*?)```/g;
    let match;
    while ((match = regex.exec(lastAssistantMessage.content)) !== null) {
      blocks.push({ lang: match[1], code: match[2].trim() });
    }
    return blocks.length > 0 ? blocks : null;
  }, [messages]);

  const handleSendMessage = async (content, image = null) => {
    const newUserMessage = { role: 'user', content };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/v3/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          model: selectedModel,
          image: image
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Errore nella risposta dell\'AI');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error('Errore chat:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `⚠️ SISTEMA: ${error.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const MODELS_CONFIG = [
    { id: 'gemini-2.5-flash', name: '2.5 Flash', color: '#10b981' },
    { id: 'gemini-2.0-flash', name: '2.0 Flash', color: '#14b8a6' },
    { id: 'gemini-2.5-pro', name: '2.5 Pro', color: '#f59e0b' },
    { id: 'gemini-3.1-pro-preview', name: '3.1 Pro', color: '#6366f1' },
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-black text-white font-sans overflow-hidden">
      {/* HEADER ESTESO */}
      <header className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl shrink-0 z-20">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-zinc-500 hover:text-white transition-colors">←</Link>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-[8px] font-black">V3</span>
              </div>
              <h1 className="text-sm font-bold tracking-tighter">Creative Engine</h1>
            </div>
          </div>
          <button 
            onClick={() => setShowUsage(!showUsage)}
            className={`sm:hidden p-2 rounded-full transition-colors ${showUsage ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}
          >📊</button>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
          <ModelSwitcher selectedModel={selectedModel} onSelectModel={setSelectedModel} />
          <button 
            onClick={() => setShowUsage(!showUsage)}
            className={`hidden sm:block p-2 rounded-full transition-colors ${showUsage ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}
          >📊</button>
        </div>
      </header>

      {/* USAGE PANEL */}
      {showUsage && (
        <div className="absolute top-16 right-6 w-64 bg-zinc-900/95 border border-white/10 rounded-2xl p-4 z-[100] font-mono shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4">
          <div className="text-[9px] text-zinc-500 font-bold uppercase mb-3 tracking-widest">Usage Monitor</div>
          <div className="space-y-3">
            {MODELS_CONFIG.map(m => {
              const stat = usageStats[m.id] || { used: 0, limit: 100, percentage: 0 };
              return (
                <div key={m.id} className="space-y-1">
                  <div className="flex justify-between text-[8px] uppercase font-bold">
                    <span style={{ color: m.color }}>{m.name}</span>
                    <span className="text-zinc-500">{stat.used}/{stat.limit}</span>
                  </div>
                  <div className="h-1 w-full bg-black rounded-full overflow-hidden">
                    <div className="h-full transition-all duration-500" style={{ width: `${stat.percentage}%`, backgroundColor: m.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTENT AREA (SPLIT SCREEN) */}
      <div className="flex flex-1 overflow-hidden relative">
        <main className={`transition-all duration-500 flex flex-col ${isCanvasOpen ? 'w-1/2 border-r border-white/5' : 'w-full'}`}>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <MessageList messages={messages} />
          </div>
          <footer className="p-6 bg-gradient-to-t from-black via-black to-transparent shrink-0">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            <p className="text-[10px] text-zinc-600 text-center mt-4 uppercase tracking-widest font-bold">
              v3 Experimental Interface • 1080x1350 Fixed Canvas
            </p>
          </footer>
        </main>

        {isCanvasOpen && (
          <aside className="w-1/2 p-6 bg-zinc-950 flex flex-col animate-in slide-in-from-right-10 duration-500 relative z-10 overflow-hidden">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Live Render Engine (1080x1350)</span>
              <button onClick={() => setIsCanvasOpen(false)} className="text-zinc-500 hover:text-white text-xs">✕</button>
            </div>
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <LiveCanvas codeBlocks={activeCodeBlocks} />
            </div>
          </aside>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>
    </div>
  );
}
