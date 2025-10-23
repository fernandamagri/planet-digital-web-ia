import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Planet Digital | Servicio Técnico con IA',
  description: 'Asistencia técnica para PC y notebooks con diagnóstico automático por IA.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
