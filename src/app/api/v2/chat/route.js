import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// Force re-compile v2.1

export async function POST(req) {
  try {
    const { messages, model: requestedModel } = await req.json();

    const model = genAI.getGenerativeModel({ 
      model: requestedModel || "gemini-2.5-flash" 
    });

    // Trasformiamo la history per il formato Gemini
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 2000,
      },
    });

    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage.content;
    const imagePart = lastMessage.image ? {
      inlineData: {
        data: lastMessage.image.split(',')[1],
        mimeType: "image/png"
      }
    } : null;

    const result = await chat.sendMessageStream(
      imagePart ? [userMessage, imagePart] : userMessage
    );

    // Creiamo un ReadableStream per inviare i dati al client in tempo reale
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          controller.enqueue(new TextEncoder().encode(chunkText));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error) {
    console.error("Chat Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
