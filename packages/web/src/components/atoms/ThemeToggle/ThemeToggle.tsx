'use client';

import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useGlobalTheme } from '@/hooks/useGlobalTheme';

/**
 * ThemeToggle - Botón circular para cambiar entre modo claro y oscuro
 *
 * Características:
 * - Botón circular con animación de iconos sol/luna
 * - Persiste el estado en localStorage
 * - Se sincroniza automáticamente con GlobalThemeProvider
 * - Funciona en todas las páginas de la aplicación
 *
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */
export function ThemeToggle() {
  const { state, setThemeMode } = useGlobalTheme();
  const isDark = state.themeMode === 'dark';

  // Cargar tema desde localStorage al montar
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark' | null;
    if (savedMode && savedMode !== state.themeMode) {
      setThemeMode(savedMode);
    }
  }, []);

  // Guardar en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('theme-mode', state.themeMode);
  }, [state.themeMode]);

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full bg-muted hover:bg-muted/80 transition-all duration-300 flex items-center justify-center group"
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {/* Sol - visible en modo oscuro */}
      <Sun
        className={`absolute w-5 h-5 text-foreground transition-all duration-300 ${
          isDark
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 rotate-90 scale-0'
        }`}
      />

      {/* Luna - visible en modo claro */}
      <Moon
        className={`absolute w-5 h-5 text-foreground transition-all duration-300 ${
          !isDark
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 -rotate-90 scale-0'
        }`}
      />
    </button>
  );
}
