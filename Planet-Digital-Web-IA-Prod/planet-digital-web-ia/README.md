# Planet Digital — Web con IA (Producción)

Sitio listo para desplegar en **Vercel** con chat de diagnóstico por IA y captura de clientes.

## 🧰 Qué incluye
- Next.js 14 (App Router)
- Chat con IA (OpenAI)
- Captura de leads a **Google Sheets**
- Estilo moderno sin dependencias pesadas
- Preparado para **Mercado Pago** (vía link)

## 🚀 Despliegue en Vercel (3 pasos)
1. Creá una cuenta en https://vercel.com e iniciá sesión.
2. En Vercel, **New Project → Import…** y subí el `.zip` o conectá un repo.
3. En **Project → Settings → Environment Variables** cargá las claves del archivo `.env.local` (ver abajo). Luego **Deploy**.

## 🔐 Variables de entorno (.env.local)
- `OPENAI_API_KEY`: tu API Key de OpenAI.
- `OPENAI_MODEL`: recomendado `gpt-4o-mini`.
- `GOOGLE_SERVICE_ACCOUNT_JSON`: JSON de cuenta de servicio con acceso a Sheets (pegalo en una sola línea).
- `GOOGLE_SHEET_ID`: ID de tu Google Sheet. Crea una hoja llamada `Leads` con columnas: Fecha, Nombre, Teléfono, Transcript.
- `LEAD_TO_SHEETS`: `true` para guardar en Sheets.
- `CONTACT_EMAIL`: opcional, correo destino.
- `CONTACT_WPP`: opcional, WhatsApp para botón.
- `PAYMENT_LINK`: opcional, link de Mercado Pago.

> **Nota**: compartí tu Sheet con el `client_email` de la cuenta de servicio (Permitir Editor).

## 🧪 Probar en local
```bash
npm i
npm run dev
```
Recordá crear `.env.local` con las claves.

## 🧾 Texto y tono del chat
El asistente usa un **tono cercano argentino** y ofrece **precios orientativos en ARS**, además de pasos simples.

## 📁 Estructura
```
app/
  api/chat/route.ts      → Chat con OpenAI
  api/lead/route.ts      → Guarda lead en Google Sheets
  components/            → (espacio para ampliar)
  page.tsx               → UI principal (chat + formulario)
public/logo.svg          → Logo
```

## 💳 Cobros
Pegá tu link en `PAYMENT_LINK` para incluirlo en respuestas del chat (puede agregarse en el prompt o en la UI).

## 📋 Privacidad
No se almacenan datos en el servidor salvo que actives Google Sheets.

---

© 2025 Planet Digital
