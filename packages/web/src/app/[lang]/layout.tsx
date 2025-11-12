import './globals.css';
import { Providers } from '@/context/providers';
import { cn, inter } from '@/lib/utils';
import { Toaster } from '@/components/primitives/ui/toaster';
import { ChatWidget } from '@/components/features/ChatWidget/ChatWidget';
// import { Analytics } from '@vercel/analytics/react';
// import { SpeedInsights }m from '@vercel/speed-insights/next';
import esTranslations from '../../locales/es/common.json';
import enTranslations from '../../locales/en/common.json';
import { getDefaultTheme } from '@/lib/server-trpc';
import { generateInlineThemeCSS } from '@/lib/theme/inline-css-generator';

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
  const companyId = '6733c2fd80b7b58d4c36d966';

  // Fetch default theme server-side to prevent FOUC
  let defaultTheme = null;
  let themeCSS = '';

  try {
    defaultTheme = await getDefaultTheme(companyId);
    themeCSS = generateInlineThemeCSS(defaultTheme);
    console.log('layout.tsx - Server Side Theme:', defaultTheme?.name || 'No theme loaded');
  } catch (error) {
    console.error('layout.tsx - Failed to load theme server-side:', error);
    // Fallback: App will load theme client-side via ThemeEditorContext
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Inject theme CSS server-side to prevent FOUC */}
        {themeCSS && (
          <style
            dangerouslySetInnerHTML={{ __html: themeCSS }}
            data-theme-id={defaultTheme?.id}
          />
        )}

        {/* Blocking script to prevent FOUC - runs BEFORE React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const mode = localStorage.getItem('theme-mode') || 'system';
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const isDark = mode === 'dark' || (mode === 'system' && prefersDark);

                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // localStorage might not be available (SSR, private browsing)
                  console.error('Theme initialization error:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning={true}>
        <Providers
          initialLocale={locale}
          initialTranslations={translations}
          companyId={companyId}
          initialTheme={defaultTheme}
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
