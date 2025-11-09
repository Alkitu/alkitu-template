'use client';

import React from 'react';
import { AuthCardWrapper } from '@/components/atomic-design/molecules';
import type { AuthPageOrganismProps } from './AuthPageOrganism.types';

/**
 * AuthPageOrganism
 *
 * A reusable organism for authentication pages following Atomic Design principles.
 * Wraps the AuthCardWrapper component and provides a clean interface for
 * page-level integration with proper translation support.
 *
 * This organism encapsulates the common authentication page pattern used across
 * login, register, password reset, and other auth flows.
 *
 * @example
 * ```tsx
 * import { AuthPageOrganism } from '@/components/atomic-design/organisms';
 * import { LoginFormOrganism } from '@/components/atomic-design/organisms';
 * import { useTranslations } from '@/context/TranslationContext';
 *
 * export default function LoginPage() {
 *   const t = useTranslations();
 *
 *   return (
 *     <AuthPageOrganism
 *       headerLabel={t('auth.login.title')}
 *       backButtonLabel={t('auth.login.backButton')}
 *       backButtonHref="/"
 *       showSocial
 *       socialDividerText={t('auth.socialDivider')}
 *     >
 *       <LoginFormOrganism />
 *     </AuthPageOrganism>
 *   );
 * }
 * ```
 */
export const AuthPageOrganism = React.forwardRef<HTMLDivElement, AuthPageOrganismProps>(
  (
    {
      children,
      headerLabel,
      backButtonLabel,
      backButtonHref,
      showSocial = false,
      socialDividerText,
      socialPlaceholderText,
      className,
      themeOverride,
      ...props
    },
    ref,
  ) => {
    // Note: AuthCardWrapper handles its own styling and layout
    // This organism simply provides a typed interface with translation support

    return (
      <div ref={ref} className={className} style={themeOverride} {...props}>
        <AuthCardWrapper
          headerLabel={headerLabel}
          backButtonLabel={backButtonLabel}
          backButtonHref={backButtonHref}
          showSocial={showSocial}
          socialDividerText={socialDividerText}
          socialPlaceholderText={socialPlaceholderText}
        >
          {children}
        </AuthCardWrapper>
      </div>
    );
  },
);

AuthPageOrganism.displayName = 'AuthPageOrganism';

export default AuthPageOrganism;
