'use client';

export default function MessageList({ messages }) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full opacity-20">
        <h2 className="text-4xl font-bold tracking-tighter">Ciao, sono Gemini v3</h2>
        <p className="mt-2 text-zinc-400">Come posso aiutarti oggi?</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto py-10 px-4 overflow-y-auto">
      {messages.map((msg, idx) => (
        <div 
          key={idx} 
          className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
            msg.role === 'user' ? 'bg-zinc-700' : 'bg-blue-600'
          }`}>
            {msg.role === 'user' ? 'U' : 'G'}
          </div>
          <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-zinc-800 text-white' 
                : 'text-zinc-200'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
