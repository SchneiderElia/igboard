'use client';
import { useState, useRef } from 'react';

export default function ChatInput({ onSendMessage, isLoading }) {
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((input.trim() || image) && !isLoading) {
      onSendMessage(input, image);
      setInput('');
      setImage(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Anteprima Immagine */}
      {image && (
        <div className="mb-4 relative w-24 h-24 group">
          <img src={image} alt="Upload preview" className="w-full h-full object-cover rounded-xl border border-white/20 shadow-lg" />
          <button 
            onClick={() => setImage(null)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          >
            ✕
          </button>
        </div>
      )}

      <form 
        onSubmit={handleSubmit}
        className="relative bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Incolla un'immagine o scrivi un prompt creativo..."
          className="w-full bg-transparent text-white placeholder-zinc-500 outline-none resize-none py-4 px-6 max-h-40 min-h-[56px]"
          rows={1}
        />
        
        <div className="flex justify-between items-center pb-4 px-6">
          <div className="flex gap-4">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">📷</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Immagine</span>
            </button>
            <button 
              type="button" 
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">📎</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">File</span>
            </button>
          </div>
          
          <button
            type="submit"
            disabled={(!input.trim() && !image) || isLoading}
            className={`px-8 py-2 rounded-full font-bold transition-all shadow-xl ${
              (input.trim() || image) && !isLoading 
                ? 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-105 active:scale-95' 
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Sto pensando...</span>
              </div>
            ) : 'Genera'}
          </button>
        </div>
      </form>
    </div>
  );
}
