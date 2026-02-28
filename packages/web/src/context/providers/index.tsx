'use client';
import ReactQueryProvider from './ReactQueryProvider';
import { TranslationsProvider } from '@/context/TranslationsContext';
import { TrpcProvider } from './TrpcProvider';
import { Translations } from '@/types/translations';
import { GlobalThemeProvider } from '@/context/GlobalThemeProvider';
import { ThemeErrorBoundaryClass } from './ThemeErrorBoundary';
import { TooltipProvider } from '@/components/primitives/ui/tooltip';
import { ServiceWorkerRegistration } from '@/components/features/ServiceWorkerRegistration';

// MODIFIED: Removed companyId and themeId (global theme model)
interface ProvidersProps {
  children: React.ReactNode;
  initialLocale: 'en' | 'es';
  initialTranslations: Translations;
  initialTheme?: any; // Global active theme from database (server-side)
}

export function Providers({
  children,
  initialLocale,
  initialTranslations,
  initialTheme,
}: ProvidersProps) {
  return (
    <ReactQueryProvider>
      <TrpcProvider>
        <TranslationsProvider
          initialLocale={initialLocale}
          initialTranslations={initialTranslations}
        >
          <ThemeErrorBoundaryClass>
            <GlobalThemeProvider initialTheme={initialTheme}>
              <TooltipProvider>
                <ServiceWorkerRegistration />
                {children}
              </TooltipProvider>
            </GlobalThemeProvider>
          </ThemeErrorBoundaryClass>
        </TranslationsProvider>
      </TrpcProvider>
    </ReactQueryProvider>
  );
}
