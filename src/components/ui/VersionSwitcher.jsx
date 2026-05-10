'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function VersionSwitcher() {
  const [version, setVersion] = useState('v1');
  const pathname = usePathname();

  // Nascondi se siamo in rotta v3
  if (pathname?.startsWith('/v3')) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex bg-zinc-900/90 backdrop-blur rounded-full p-1 border border-zinc-700 shadow-xl">
      <button
        onClick={() => setVersion('v1')}
        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
          version === 'v1' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
        }`}
      >
        V1 (Satori)
      </button>
      <button
        onClick={() => setVersion('v2')}
        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
          version === 'v2' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
        }`}
      >
        V2 (Puppeteer)
      </button>
    </div>
  );
}
