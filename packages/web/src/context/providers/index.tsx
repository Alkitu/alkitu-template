'use client';
import ReactQueryProvider from './ReactQueryProvider';
import { ThemeContextProvider } from '@/context/providers/NextThemesProvider';
import { TranslationsProvider } from '@/context/TranslationsContext';
import { TrpcProvider } from './TrpcProvider';
import { Translations } from '@/types/translations';
import { DynamicThemeProvider } from '@/context/ThemeContext';
import { ThemeErrorBoundaryClass } from './ThemeErrorBoundary';
import { TooltipProvider } from '@/components/primitives/ui/tooltip';

interface ProvidersProps {
  children: React.ReactNode;
  initialLocale: 'en' | 'es';
  initialTranslations: Translations;
  companyId?: string;
  themeId?: string;
}

export function Providers({
  children,
  initialLocale,
  initialTranslations,
  companyId,
  themeId,
}: ProvidersProps) {
  return (
    <ReactQueryProvider>
      <TrpcProvider>
        <ThemeErrorBoundaryClass>
          <DynamicThemeProvider companyId={companyId} themeId={themeId}>
            <ThemeContextProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>
                <TranslationsProvider
                  initialLocale={initialLocale}
                  initialTranslations={initialTranslations}
                >
                  {children}
                </TranslationsProvider>
              </TooltipProvider>
            </ThemeContextProvider>
          </DynamicThemeProvider>
        </ThemeErrorBoundaryClass>
      </TrpcProvider>
    </ReactQueryProvider>
  );
}
