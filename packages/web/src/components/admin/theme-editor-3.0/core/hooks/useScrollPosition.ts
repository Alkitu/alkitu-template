'use client';

import { useRef, useEffect, useCallback } from 'react';

/**
 * Hook para mantener la posición del scroll al re-renderizar componentes
 * @param dependencies - Array de dependencias que pueden causar re-render
 * @param sectionId - ID único de la sección para almacenar posiciones múltiples
 */
export function useScrollPosition(dependencies: any[], sectionId: string) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  
  // Guardar la posición actual del scroll
  const saveScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollPositionRef.current = scrollContainerRef.current.scrollTop;
    }
  }, []);

  // Restaurar la posición del scroll
  const restoreScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollPositionRef.current;
    }
  }, []);

  // Guardar posición antes de cada re-render
  useEffect(() => {
    saveScrollPosition();
  }, dependencies);

  // Restaurar posición después del re-render
  useEffect(() => {
    // Usar setTimeout para asegurar que el DOM esté actualizado
    const timeoutId = setTimeout(() => {
      restoreScrollPosition();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, dependencies);

  // Manejar el evento scroll para actualizar la posición guardada
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    scrollPositionRef.current = event.currentTarget.scrollTop;
  }, []);

  return {
    scrollContainerRef,
    handleScroll,
    saveScrollPosition,
    restoreScrollPosition
  };
}