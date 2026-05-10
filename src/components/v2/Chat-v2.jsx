'use client';
import React, { useState, useRef, useEffect } from 'react';

export default function ChatV2() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Ciao! Sono il tuo Art Director AI. Carica un design o scrivimi come vuoi trasformare il tuo canvas.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [showUsage, setShowUsage] = useState(false);
  const [usageStats, setUsageStats] = useState({});
  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);

  const MODELS = [
    { id: 'gemini-2.5-flash', name: '2.5 Flash', tier: 'Free', color: '#10b981' },
    { id: 'gemini-2.5-flash-lite', name: '2.5 Flash Lite', tier: 'Free', color: '#14b8a6' },
    { id: 'gemini-2.5-pro', name: '2.5 Pro', tier: 'Free/Pro', color: '#f59e0b' },
    { id: 'gemini-3.1-flash-lite-preview', name: '3.1 Flash Lite', tier: 'Free', color: '#06b6d4' },
    { id: 'gemini-3.1-pro-preview', name: '3.1 Pro Preview', tier: 'Pro', color: '#6366f1' },
  ];

  useEffect(() => {
    const fetchUsage = () => {
      fetch('/api/model-usage')
        .then(r => r.json())
        .then(data => setUsageStats(data.stats || {}))
        .catch(() => {});
    };
    fetchUsage();
    const interval = setInterval(fetchUsage, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setUploadedImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    if (!input.trim() && !uploadedImage) return;
    
    const userMsg = { 
      id: Date.now(), 
      role: 'user', 
      content: input,
      image: uploadedImage 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setUploadedImage(null);
    setIsTyping(true);

    try {
      const response = await fetch('/api/v2/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Errore nella comunicazione con Gemini');
      }

      const assistantMsgId = Date.now() + 1;
      setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);
      setIsTyping(false);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        accumulatedText += chunkValue;

        setMessages(prev => prev.map(m => 
          m.id === assistantMsgId ? { ...m, content: accumulatedText } : m
        ));
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        role: 'assistant', 
        content: 'Scusa, si è verificato un errore nella connessione.' 
      }]);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0e0e0e] text-zinc-200 font-sans">
      {/* ═══ TOP BAR ═══ */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-zinc-800/50 backdrop-blur-md bg-[#0e0e0e]/80 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-[10px] font-black italic">V2</span>
          </div>
          <h2 className="text-sm font-bold tracking-tight text-zinc-100">Editorial Engine</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-zinc-900 rounded-full p-1 border border-zinc-800">
            {MODELS.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                  selectedModel === m.id 
                    ? 'bg-zinc-700 text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setShowUsage(!showUsage)}
            className={`p-2 rounded-full transition-colors ${showUsage ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        </div>
      </header>

      {/* ═══ USAGE MONITOR PANEL (Terminal Style) ═══ */}
      {showUsage && (
        <div className="absolute top-16 right-6 w-80 bg-black/90 border border-zinc-800 rounded-xl p-4 z-30 font-mono shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Usage Monitor</span>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
              <div className="w-2 h-2 rounded-full bg-green-500/50" />
            </div>
          </div>
          
          <div className="space-y-4">
            {MODELS.map(m => {
              const stat = usageStats[m.id] || { used: 0, limit: 100, percentage: 0 };
              return (
                <div key={m.id} className="space-y-1.5">
                  <div className="flex justify-between text-[9px] uppercase font-bold">
                    <span style={{ color: m.color }}>{m.name}</span>
                    <span className="text-zinc-500">{stat.used}/{stat.limit} RPM</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
                    <div 
                      className="h-full transition-all duration-500"
                      style={{ 
                        width: `${stat.percentage}%`, 
                        backgroundColor: m.color,
                        boxShadow: `0 0 8px ${m.color}40`
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-2 border-t border-zinc-800 text-[8px] text-zinc-600 uppercase text-center">
            System Status: Nominal // PT Reset active
          </div>
        </div>
      )}

      {/* ═══ MESSAGES AREA ═══ */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-8 sm:px-0 scroll-smooth"
      >
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-violet-500 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              )}
              
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-zinc-800 text-zinc-100 rounded-tr-none' 
                  : 'text-zinc-300'
              }`}>
                {msg.image && (
                  <img src={msg.image} alt="DNA Uploaded" className="w-full max-w-[200px] rounded-lg mb-2 border border-zinc-700" />
                )}
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                  USER
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center animate-pulse">
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
              </div>
              <div className="flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ INPUT AREA (The Pill) ═══ */}
      <div className="p-4 sm:pb-8">
        <div className="max-w-3xl mx-auto relative">
          
          {/* Image Preview inside Pill */}
          {uploadedImage && (
            <div className="absolute -top-20 left-4 bg-zinc-800 p-1.5 rounded-xl border border-zinc-700 shadow-xl flex items-center gap-2 group animate-in slide-in-from-bottom-2">
              <img src={uploadedImage} className="w-12 h-12 object-cover rounded-lg" />
              <button 
                onClick={() => setUploadedImage(null)}
                className="p-1 hover:bg-zinc-700 rounded-full text-zinc-400"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <div className="relative flex items-center bg-[#1e1e1e] border border-zinc-700/50 rounded-[32px] p-2 pr-3 shadow-2xl focus-within:border-zinc-500 transition-all group">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-5-8l-5-5m0 0l-5 5m5-5v12" />
              </svg>
            </button>
            
            <textarea
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Chiedi a Gemini di creare un design..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-zinc-100 placeholder-zinc-500 py-3 px-2 resize-none max-h-32 text-sm"
            />

            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className={`p-3 rounded-full transition-all ${
                input.trim() 
                  ? 'bg-zinc-100 text-black shadow-lg shadow-white/10' 
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          
          <div className="mt-3 text-center">
            <p className="text-[10px] text-zinc-600 font-medium tracking-tight">
              Gemini può produrre errori. Verifica le informazioni importanti.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        textarea::-webkit-scrollbar { width: 0; }
        .rounded-2xl { border-radius: 1.25rem; }
        .rounded-[32px] { border-radius: 2rem; }
      `}</style>
    </div>
  );
}
