'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ThemeEditor as ThemeEditor30 } from '@/components/admin/theme-editor-3.0';
import type { ThemeEditorOrganismProps } from './ThemeEditorOrganism.types';

/**
 * ThemeEditorOrganism
 *
 * A complete theme editing system organism that follows Atomic Design principles.
 * This component wraps the Theme Editor 3.0 implementation and provides a clean,
 * reusable interface for page-level integration.
 *
 * Features:
 * - Complete theme customization (colors, typography, spacing, etc.)
 * - Real-time preview
 * - Import/Export functionality
 * - Undo/Redo support
 * - Responsive viewport preview
 * - Multi-theme management
 *
 * @example
 * ```tsx
 * import { ThemeEditorOrganism } from '@/components/atomic-design/organisms';
 * import { useTranslations } from '@/context/TranslationContext';
 *
 * export default function ThemeEditorPage() {
 *   const t = useTranslations();
 *
 *   const labels = {
 *     selector: {
 *       search: t('themeEditor.selector.search'),
 *       dropdown: t('themeEditor.selector.dropdown'),
 *     },
 *     actions: {
 *       save: t('themeEditor.actions.save'),
 *       reset: t('themeEditor.actions.reset'),
 *     },
 *     editor: {
 *       colors: t('themeEditor.editor.colors'),
 *       typography: t('themeEditor.editor.typography'),
 *     }
 *   };
 *
 *   return (
 *     <div className="h-screen">
 *       <ThemeEditorOrganism labels={labels} />
 *     </div>
 *   );
 * }
 * ```
 */
export const ThemeEditorOrganism = React.forwardRef<
  HTMLDivElement,
  ThemeEditorOrganismProps
>(
  (
    {
      className = '',
      themeOverride,
      useSystemColors = true,
      initialTheme,
      onThemeChange,
      onThemeSave,
      labels,
      ...props
    },
    ref,
  ) => {
    // Apply theme override styles
    const styles = themeOverride
      ? Object.entries(themeOverride).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [`--${key}`]: value,
          }),
          {} as Record<string, string>,
        )
      : undefined;

    const classes = cn([
      'theme-editor-organism',
      'h-full',
      'w-full',
      'overflow-hidden',
      className,
    ]);

    return (
      <div
        ref={ref}
        className={classes}
        style={styles}
        data-testid="theme-editor-organism"
        {...props}
      >
        {/*
          Theme Editor 3.0 Component

          This wraps the complete Theme Editor implementation which includes:
          - ThemeEditorProvider (context for state management)
          - ResizableLayout (template for panel layout)
          - ThemeSelector (organism for theme selection)
          - ActionsBar (organism for editor actions)
          - ThemeEditorPanel (organism for editing UI)
          - Preview (organism for theme preview)

          The ThemeEditor 3.0 is already well-structured with its own
          atomic design system internally. This wrapper provides a clean
          interface for page-level integration following project conventions.
        */}
        <ThemeEditor30 />
      </div>
    );
  },
);

ThemeEditorOrganism.displayName = 'ThemeEditorOrganism';

export default ThemeEditorOrganism;
