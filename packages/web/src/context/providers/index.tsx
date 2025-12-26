'use client';
import ReactQueryProvider from './ReactQueryProvider';
import { TranslationsProvider } from '@/context/TranslationsContext';
import { TrpcProvider } from './TrpcProvider';
import { Translations } from '@/types/translations';
import { GlobalThemeProvider } from '@/context/GlobalThemeProvider';
import { ThemeErrorBoundaryClass } from './ThemeErrorBoundary';
import { TooltipProvider } from '@/components/primitives/ui/tooltip';
import { ServiceWorkerRegistration } from '@/components/features/ServiceWorkerRegistration';

interface ProvidersProps {
  children: React.ReactNode;
  initialLocale: 'en' | 'es';
  initialTranslations: Translations;
  companyId?: string;
  themeId?: string;
  initialTheme?: any; // Theme from database (server-side)
}

export function Providers({
  children,
  initialLocale,
  initialTranslations,
  companyId,
  themeId,
  initialTheme,
}: ProvidersProps) {
  return (
    <ReactQueryProvider>
      <TrpcProvider>
        <ThemeErrorBoundaryClass>
          <GlobalThemeProvider companyId={companyId} initialTheme={initialTheme}>
            <TooltipProvider>
              <TranslationsProvider
                initialLocale={initialLocale}
                initialTranslations={initialTranslations}
              >
                <ServiceWorkerRegistration />
                {children}
              </TranslationsProvider>
            </TooltipProvider>
          </GlobalThemeProvider>
        </ThemeErrorBoundaryClass>
      </TrpcProvider>
    </ReactQueryProvider>
  );
}
