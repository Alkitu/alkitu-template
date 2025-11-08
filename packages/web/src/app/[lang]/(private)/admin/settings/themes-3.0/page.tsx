'use client';

import { ThemeEditorOrganism } from '@/components/atomic-design/organisms';
import { useTranslations } from '@/context/TranslationContext';

/**
 * Theme Editor 3.0 Page
 *
 * A complete theme customization interface following Atomic Design principles.
 * This page demonstrates the proper pattern for composing organisms with
 * internationalization support.
 *
 * Pattern:
 * 1. Use useTranslations() hook to get translation function
 * 2. Prepare component props with translated labels
 * 3. Render organism with prepared props (page stays thin)
 *
 * @see /docs/00-conventions/atomic-design-architecture.md for architecture details
 */
export default function Themes30Page() {
  const t = useTranslations();

  // Prepare internationalization labels for the Theme Editor
  // All text displayed in the UI is provided through these labels
  const labels = {
    selector: {
      search: t('themeEditor.selector.search'),
      dropdown: t('themeEditor.selector.dropdown'),
      previous: t('themeEditor.selector.previous'),
      next: t('themeEditor.selector.next'),
      random: t('themeEditor.selector.random'),
    },
    actions: {
      save: t('themeEditor.actions.save'),
      reset: t('themeEditor.actions.reset'),
      export: t('themeEditor.actions.export'),
      import: t('themeEditor.actions.import'),
      undo: t('themeEditor.actions.undo'),
      redo: t('themeEditor.actions.redo'),
      viewportMobile: t('themeEditor.actions.viewportMobile'),
      viewportTablet: t('themeEditor.actions.viewportTablet'),
      viewportDesktop: t('themeEditor.actions.viewportDesktop'),
      themeLight: t('themeEditor.actions.themeLight'),
      themeDark: t('themeEditor.actions.themeDark'),
    },
    editor: {
      colors: t('themeEditor.editor.colors'),
      typography: t('themeEditor.editor.typography'),
      brand: t('themeEditor.editor.brand'),
      borders: t('themeEditor.editor.borders'),
      spacing: t('themeEditor.editor.spacing'),
      shadows: t('themeEditor.editor.shadows'),
      scroll: t('themeEditor.editor.scroll'),
    },
    preview: {
      title: t('themeEditor.preview.title'),
      loading: t('themeEditor.preview.loading'),
    },
  };

  // Handler functions (if needed for future enhancements)
  const handleThemeChange = (theme: any) => {
    // Handle theme change if needed
    console.log('Theme changed:', theme);
  };

  const handleThemeSave = (theme: any) => {
    // Handle theme save if needed
    console.log('Theme saved:', theme);
  };

  return (
    <div className="h-screen overflow-hidden">
      <ThemeEditorOrganism
        labels={labels}
        onThemeChange={handleThemeChange}
        onThemeSave={handleThemeSave}
      />
    </div>
  );
}