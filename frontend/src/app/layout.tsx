import type { Metadata, Viewport } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import ThemeProvider from '../theme/ThemeProvider';
import { AuthProvider } from '../store/authStore';

export const metadata: Metadata = {
  title: 'Servicios Técnicos - Conecta con Expertos Técnicos de Confianza',
  description:
    'Plataforma para administración de clientes, reparaciones, inventario y seguimiento técnico.',
};

export const viewport: Viewport = {
  themeColor: '#fcf8fa',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth bg-background">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppRouterCacheProvider options={{ key: 'mui' }}>
          <AuthProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
