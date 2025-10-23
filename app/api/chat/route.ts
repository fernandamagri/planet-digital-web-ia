import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type Msg = { role: 'user' | 'assistant'; content: string };

export async function POST(req: Request) {
  try {
    const { messages } = await req.json() as { messages: Msg[] };
    const prompt = buildPrompt(messages);

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
      // Dev fallback
      return NextResponse.json({ reply: 'Para responder de verdad necesito la clave de OpenAI en el servidor. Mientras tanto, te recomiendo reiniciar la PC y revisar que el cargador funcione. Si querés, dejanos tu contacto y te escribimos 😉' });
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              'Sos un técnico informático argentino, cercano y claro. Diagnosticá paso a paso, explicá en lenguaje simple, ofrecé precios orientativos en ARS y proponé siguientes pasos. Si hay riesgo de pérdida de datos, advertí de backups.',
          },
          ...prompt
        ],
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      return NextResponse.json({ reply: 'No pude contactar a la IA por ahora. Probá de nuevo en un ratito.' });
    }
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || 'Listo.';
    return NextResponse.json({ reply });
  } catch (e) {
    return NextResponse.json({ reply: 'Se nos trabó el destornillador 🪛 Probemos de nuevo.' });
  }
}

function buildPrompt(messages: Msg[]) {
  const mapped = messages.map(m => ({
    role: m.role,
    content: m.content,
  }));
  mapped.push({
    role: 'assistant',
    content: 'Recordá que podemos agendar diagnóstico remoto y pago por Mercado Pago si lo necesitás.',
  });
  return mapped;
}
