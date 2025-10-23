'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Msg = { role: 'user' | 'assistant'; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content:
        'Hola! Soy el asistente de Planet Digital 👋 Contame qué le pasa a tu PC o notebook y te doy una mano.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const next = [...messages, { role: 'user', content: input } as Msg];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setMessages([...next, { role: 'assistant', content: 'Uy, se nos cortó la luz 😅 Probá de nuevo.' }]);
    } finally {
      setLoading(false);
    }
  }

  async function sendLead() {
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          transcript: messages.map(m => `${m.role}: ${m.content}`).join('\n')
        })
      });
      alert('¡Listo! Te escribimos a la brevedad 👌');
      setName(''); setPhone('');
    } catch {
      alert('No pude guardar tus datos. Si querés, escribinos por WhatsApp o email.');
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <header className="flex items-center gap-4 mb-6">
        <Image src="/logo.svg" alt="Planet Digital" width={180} height={40} />
        <span className="ml-auto text-sm text-gray-300">Atención 24/7 con IA</span>
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 card">
          <h1 className="text-2xl font-bold mb-2">Asistencia técnica para PC y notebooks</h1>
          <p className="text-gray-300 mb-4">
            Formateo, limpieza, instalación de Windows, recuperación de datos, mantenimiento remoto y soporte online personalizado.
          </p>

          <div className="h-[420px] overflow-y-auto space-y-3 bg-[#0c1428] p-3 rounded-xl border border-white/10">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
                <div className={`inline-block px-3 py-2 rounded-xl ${m.role === 'user' ? 'bg-[#1e293b] text-white' : 'bg-[#101b34] text-gray-100'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-sm text-gray-400">Espera un toque… pensando 🧠</div>}
            <div ref={endRef} />
          </div>

          <form onSubmit={sendMessage} className="mt-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ej: Se me queda la pantalla negra…"
              className="flex-1 px-3 py-2 rounded-xl bg-[#0c1428] border border-white/10 outline-none"
            />
            <button className="btn" type="submit">Enviar</button>
          </form>
        </div>

        <aside className="card space-y-4">
          <h2 className="text-lg font-semibold">¿Querés que te contactemos?</h2>
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Tu nombre" className="w-full px-3 py-2 rounded-xl bg-[#0c1428] border border-white/10 outline-none"/>
          <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Tu WhatsApp" className="w-full px-3 py-2 rounded-xl bg-[#0c1428] border border-white/10 outline-none"/>
          <button onClick={sendLead} className="btn w-full">Guardar y avisarme</button>

          <div className="text-sm text-gray-400 pt-2">
            También podés escribir a <a className="underline" href="mailto:planetdigitalsb@gmail.com">planetdigitalsb@gmail.com</a>
          </div>
        </aside>
      </section>

      <footer className="text-center text-gray-400 mt-8 text-sm">
        © {new Date().getFullYear()} Planet Digital · Hecho con cariño y mucha IA 🛠️
      </footer>
    </main>
  )
}
