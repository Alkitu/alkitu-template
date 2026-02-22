import './globals.css';
import { Providers } from '@/context/providers';
import { cn, inter } from '@/lib/utils';
import { Toaster } from '@/components/primitives/ui/sonner';
import { ChatWidgetWrapper } from '@/components/features/ChatWidget/ChatWidgetWrapper';
// import { Analytics } from '@vercel/analytics/react';
// import { SpeedInsights }m from '@vercel/speed-insights/next';
import esTranslations from '../../locales/es/common.json';
import enTranslations from '../../locales/en/common.json';
import { getGlobalActiveTheme } from '@/lib/server-trpc';
import { generateInlineThemeCSS } from '@/lib/theme/inline-css-generator';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const locale = (lang === 'en' ? 'en' : 'es') as 'en' | 'es';
  const translations = locale === 'en' ? enTranslations : esTranslations;
  // console.log('layout.tsx - Server Side Locale:', locale);
  // console.log('layout.tsx - Server Side Translations:', translations);
  console.log('layout.tsx - Debug: NEXT_PUBLIC_API_URL =', process.env.NEXT_PUBLIC_API_URL);

  // MODIFIED: Simplified to use global platform theme
  // Fetch global active theme server-side to prevent FOUC
  let defaultTheme = null;
  let themeCSS = '';

  try {
    console.log('🎨 [SSR Layout] Fetching global active theme...');
    // Get the GLOBAL active theme (platform-wide)
    defaultTheme = await getGlobalActiveTheme();

    if (defaultTheme) {
      console.log('✅ [SSR Layout] Loaded theme:', defaultTheme.name, 'ID:', defaultTheme.id);
      themeCSS = generateInlineThemeCSS(defaultTheme);
      console.log('✅ [SSR Layout] Generated CSS:', themeCSS.length, 'chars');
    } else {
      console.warn('⚠️  [SSR Layout] No theme returned from getGlobalActiveTheme');
    }
  } catch (error) {
    console.error('❌ [SSR Layout] Failed to load global theme:', error);
    // Fallback: App will load theme client-side via ThemeEditorContext
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

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
          initialTheme={defaultTheme}
        >
          <main
            className={cn(
              'min-h-screen bg-background text-foreground font-sans antialiased w-full flex flex-col overflow-x-hidden',
              inter.className,
            )}
          >
            {children}
            <Toaster />
          </main>
          <ChatWidgetWrapper />
          {/* <Analytics /> */}
          {/* <SpeedInsights /> */}
        </Providers>
      </body>
    </html>
  );
}
