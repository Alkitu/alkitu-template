import './globals.css';
import { Providers } from '@/context/providers';
import { cn, inter } from '@/lib/utils';
import { Toaster } from '@/components/primitives/ui/toaster';
import { ChatWidget } from '@/components/features/ChatWidget/ChatWidget';
// import { Analytics } from '@vercel/analytics/react';
// import { SpeedInsights }m from '@vercel/speed-insights/next';
import esTranslations from '../../locales/es/common.json';
import enTranslations from '../../locales/en/common.json';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const locale = (lang === 'en' ? 'en' : 'es') as 'en' | 'es';
  const translations = locale === 'en' ? enTranslations : esTranslations;
  console.log('layout.tsx - Server Side Locale:', locale);
  console.log('layout.tsx - Server Side Translations:', translations);

  // TODO: Get companyId from session/auth context when available
  // For testing, use a valid 24-character MongoDB ObjectID format
  const companyId = '507f1f77bcf86cd799439011';

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning={true}>
        <Providers
          initialLocale={locale}
          initialTranslations={translations}
          companyId={companyId}
        >
          <main
            className={cn(
              'min-h-screen bg-background font-sans antialiased w-full flex flex-col overflow-x-hidden',
              inter.className,
            )}
          >
            {children}
            <Toaster />
          </main>
          <ChatWidget />
          {/* <Analytics /> */}
          {/* <SpeedInsights /> */}
        </Providers>
      </body>
    </html>
  );
}
