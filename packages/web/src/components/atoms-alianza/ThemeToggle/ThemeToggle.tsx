'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useGlobalTheme } from '@/hooks/useGlobalTheme';
import type { ThemeToggleProps } from './ThemeToggle.types';

/**
 * ThemeToggle - Botón circular para cambiar entre modo claro y oscuro
 *
 * Características:
 * - Botón circular con animación de iconos sol/luna
 * - Persiste el estado en localStorage
 * - Se sincroniza automáticamente con GlobalThemeProvider
 * - Funciona en todas las páginas de la aplicación
 * - Previene errores de hidratación SSR/CSR
 *
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */
export function ThemeToggle({ onThemeChange }: ThemeToggleProps = {}) {
  const { state, setThemeMode } = useGlobalTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = state.themeMode === 'dark';

  // Marcar componente como montado y cargar tema desde localStorage
  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark' | null;
    if (savedMode && savedMode !== state.themeMode) {
      setThemeMode(savedMode);
    }
  }, []);

  // Guardar en localStorage cuando cambia
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme-mode', state.themeMode);
    }
  }, [state.themeMode, mounted]);

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
    onThemeChange?.(newMode);
  };

  // Prevenir renderizado hasta que el componente esté montado en el cliente
  if (!mounted) {
    return (
      <button
        className="cursor-pointer relative w-10 h-10 rounded-full border border-primary bg-transparent text-primary hover:bg-primary/10 transition-all duration-300 flex items-center justify-center group"
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="absolute w-5 h-5 text-current opacity-0" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="cursor-pointer relative w-10 h-10 rounded-full border border-primary bg-transparent text-primary hover:bg-primary/10 transition-all duration-300 flex items-center justify-center group"
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      suppressHydrationWarning
    >
      {/* Sol - visible en modo oscuro */}
      <Sun
        className={`absolute w-5 h-5 text-current transition-all duration-300 ${
          isDark
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 rotate-90 scale-0'
        }`}
      />

      {/* Luna - visible en modo claro */}
      <Moon
        className={`absolute w-5 h-5 text-current transition-all duration-300 ${
          !isDark
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 -rotate-90 scale-0'
        }`}
      />
    </button>
  );
}
