import { cn } from "@/lib/utils";

/**
 * @fileoverview TailwindGrid - Sistema de grid responsivo optimizado para Tailwind CSS v3.4+
 * 
 * Proporciona un sistema de grid de 12 columnas responsivo con soporte para:
 * - Grid responsive: 4 columnas (móvil), 8 columnas (tablet), 12 columnas (desktop)
 * - Container queries y media queries
 * - Soporte RTL con logical properties
 * - Debug visual del grid
 * - Configuración flexible de gaps, padding y max-width
 * 
 * @author Luis Eduardo Urdaneta Martucci
 * @version 1.0.0
 * @since 2025-06-28
 */

/**
 * Valores permitidos para gap en Tailwind CSS.
 * Incluye todos los tamaños estándar de Tailwind desde 0 hasta 96.
 */
type GapSize =
  | 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 
  | 14 | 16 | 20 | 24 | 28 | 32 | 36 | 40 | 44 | 48 | 52 | 56 | 60 | 64 | 72 | 80 | 96;

/**
 * Opciones de color para el modo debug del grid.
 */
type ColorOption = "red" | "blue" | "yellow" | "orange" | "purple" | "green";

/**
 * Opciones de ancho máximo basadas en los breakpoints de Tailwind.
 */
type MaxWidthOption = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "";

/**
 * Opciones de padding responsivo predefinidas.
 */
type PaddingOption = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "";

/**
 * Props del componente TailwindGrid.
 * 
 * @interface TailwindGridProps
 */
type TailwindGridProps = {
  /** Contenido que se renderizará dentro del grid */
  children: React.ReactNode;
  
  /** Mostrar grid visual para debug (default: false) */
  show?: boolean;
  
  /** Usar ancho completo sin padding lateral (default: false) */
  fullSize?: boolean;
  
  /** Clases CSS adicionales para el contenedor */
  className?: string;
  
  /** Gap horizontal en breakpoint base (default: 4) */
  gapX?: GapSize;
  
  /** Gap horizontal en breakpoint md (default: 6) */
  mdGapX?: GapSize;
  
  /** Gap horizontal en breakpoint lg (default: 6) */
  lgGapX?: GapSize;
  
  /** Gap vertical en breakpoint base (default: 0) */
  gapY?: GapSize;
  
  /** Gap vertical en breakpoint md (default: 0) */
  mdGapY?: GapSize;
  
  /** Gap vertical en breakpoint lg (default: 0) */
  lgGapY?: GapSize;
  
  /** Color de fondo para el modo debug (default: "blue") */
  bgColor?: ColorOption;
  
  /** Ancho máximo en breakpoint base */
  maxWidth?: MaxWidthOption;
  
  /** Ancho máximo en breakpoint md */
  mdMaxWidth?: MaxWidthOption;
  
  /** Ancho máximo en breakpoint lg */
  lgMaxWidth?: MaxWidthOption;
  
  /** Padding horizontal responsivo (default: "xs") */
  padding?: PaddingOption;
  
  // Nuevas features Tailwind 3.4+
  
  /** Habilitar soporte para RTL usando logical properties (default: false) */
  rtlSupport?: boolean;
  
  /** Usar container queries en lugar de media queries (default: false) */
  containerQueries?: boolean;
};

/**
 * Genera dinámicamente clases de gap de Tailwind CSS.
 * 
 * Optimizado para Tailwind 3.4+ con mejor handling de valores especiales.
 * 
 * @param size - Tamaño del gap (0-96)
 * @param axis - Eje del gap ('x' para horizontal, 'y' para vertical)
 * @param breakpoint - Breakpoint responsivo opcional ('md' | 'lg')
 * @returns Clase CSS de gap generada
 * 
 * @example
 * ```tsx
 * generateGapClass(4, 'x') // "gap-x-4"
 * generateGapClass(6, 'y', 'md') // "md:gap-y-6"
 * generateGapClass(0.5, 'x') // "gap-x-0.5"
 * ```
 */
const generateGapClass = (size: GapSize, axis: 'x' | 'y', breakpoint?: 'md' | 'lg'): string => {
  const prefix = breakpoint ? `${breakpoint}:` : '';
  const sizeStr = size === 0.5 ? '0.5' : size.toString();
  
  // Optimización para valores comunes en Tailwind 3.4+
  if (size === 0) return `${prefix}gap-${axis}-0`;
  if (size === 0.5) return `${prefix}gap-${axis}-0.5`;
  
  return `${prefix}gap-${axis}-${sizeStr}`;
};

/**
 * Configuración estática optimizada para el TailwindGrid.
 * 
 * Contiene todas las clases CSS predefinidas organizadas por categoría
 * para mejor performance y mantenibilidad.
 */
const CONFIG = {
  /**
   * Colores de fondo para el modo debug.
   * Usa transparencia 20% para no interferir con el contenido.
   */
  bgColors: {
    red: "bg-red-200/20",
    blue: "bg-blue-200/20", 
    yellow: "bg-yellow-200/20",
    orange: "bg-orange-200/20",
    purple: "bg-purple-200/20",
    green: "bg-green-200/20",
  } as const,

  /**
   * Anchos máximos basados en los breakpoints estándar de Tailwind.
   * Valores en píxeles para mayor precisión.
   */
  maxWidths: {
    xs: "max-w-[320px]",   // Extra small - móviles pequeños
    sm: "max-w-[640px]",   // Small - móviles grandes
    md: "max-w-[768px]",   // Medium - tablets
    lg: "max-w-[1024px]",  // Large - laptops
    xl: "max-w-[1280px]",  // Extra large - desktops
    "2xl": "max-w-[1536px]", // 2X large - pantallas grandes
    "": "",                // Sin límite de ancho
  } as const,

  /**
   * Padding horizontal responsivo predefinido.
   * Escalado progresivo: base -> md -> lg
   */
  paddings: {
    xs: "px-4 md:px-6 lg:px-8",     // Minimalista
    sm: "px-6 md:px-8 lg:px-10",    // Compacto
    md: "px-8 md:px-10 lg:px-12",   // Estándar
    lg: "px-10 md:px-12 lg:px-14",  // Amplio
    xl: "px-12 md:px-14 lg:px-16",  // Muy amplio
    "2xl": "px-14 md:px-16 lg:px-20", // Extra amplio
    "": "",                          // Sin padding
  } as const,

  /**
   * Padding usando logical properties para soporte RTL (Tailwind 3.4+).
   * Actualmente usa fallback a px- pero preparado para ps-/pe- en el futuro.
   */
  paddingsRTL: {
    xs: "px-4 md:px-6 lg:px-8",     // TODO: Migrar a ps-4/pe-4 cuando esté disponible
    sm: "px-6 md:px-8 lg:px-10", 
    md: "px-8 md:px-10 lg:px-12",
    lg: "px-10 md:px-12 lg:px-14",
    xl: "px-12 md:px-14 lg:px-16",
    "2xl": "px-14 md:px-16 lg:px-20",
    "": "",
  } as const,

  /**
   * Breakpoints modernos de Tailwind 3.4+.
   * Incluye el nuevo breakpoint 'xs' para dispositivos muy pequeños.
   */
  breakpoints: {
    xs: '475px',   // Nuevo en 3.4+
    sm: '640px',   // Estándar
    md: '768px',   // Estándar
    lg: '1024px',  // Estándar
    xl: '1280px',  // Estándar
    '2xl': '1536px', // Estándar
  } as const,
} as const;

/**
 * Genera clases responsivas de maxWidth con centramiento automático.
 * 
 * Solo aplica `mx-auto` cuando hay un maxWidth definido para evitar
 * centrado innecesario en layouts de ancho completo.
 * 
 * @param maxWidth - Ancho máximo base
 * @param mdMaxWidth - Ancho máximo en breakpoint md
 * @param lgMaxWidth - Ancho máximo en breakpoint lg
 * @returns Array de clases CSS generadas
 * 
 * @example
 * ```tsx
 * generateMaxWidthClasses("lg", "xl", "2xl")
 * // ["mx-auto max-w-[1024px]", "md:max-w-[1280px]", "lg:max-w-[1536px]"]
 * ```
 */
const generateMaxWidthClasses = (
  maxWidth?: MaxWidthOption,
  mdMaxWidth?: MaxWidthOption,
  lgMaxWidth?: MaxWidthOption
): string[] => {
  const classes: string[] = [];
  
  // Solo aplicar mx-auto cuando hay un maxWidth definido
  if (maxWidth && CONFIG.maxWidths[maxWidth]) {
    classes.push(`mx-auto ${CONFIG.maxWidths[maxWidth]}`);
  }
  
  // Breakpoints responsivos adicionales
  if (mdMaxWidth && CONFIG.maxWidths[mdMaxWidth]) {
    classes.push(`md:${CONFIG.maxWidths[mdMaxWidth]}`);
  }
  if (lgMaxWidth && CONFIG.maxWidths[lgMaxWidth]) {
    classes.push(`lg:${CONFIG.maxWidths[lgMaxWidth]}`);
  }
  
  return classes;
};

/**
 * TailwindGrid - Componente de grid responsivo de 12 columnas.
 * 
 * Sistema de grid moderno y flexible que se adapta automáticamente:
 * - 4 columnas en móviles (< 768px)
 * - 8 columnas en tablets (768px - 1024px)  
 * - 12 columnas en desktop (> 1024px)
 * 
 * @param props - Propiedades del componente
 * @returns JSX.Element - Grid responsivo renderizado
 * 
 * @example
 * ```tsx
 * // Uso básico
 * <TailwindGrid maxWidth="xl" padding="md">
 *   <div className="col-span-4 lg:col-span-6">Contenido</div>
 * </TailwindGrid>
 * 
 * // Con debug visual
 * <TailwindGrid show={true} bgColor="red" gapX={6}>
 *   <div className="col-span-4">Item 1</div>
 *   <div className="col-span-4">Item 2</div>
 * </TailwindGrid>
 * 
 * // Con container queries (Tailwind 3.4+)
 * <TailwindGrid containerQueries={true} maxWidth="lg">
 *   <div className="col-span-4">Responsive content</div>
 * </TailwindGrid>
 * 
 * // Con soporte RTL
 * <TailwindGrid rtlSupport={true} padding="lg">
 *   <div className="col-span-4">محتوى عربي</div>
 * </TailwindGrid>
 * ```
 */
function TailwindGrid({
  children,
  show = false,
  className,
  fullSize = false,
  gapX = 4,
  mdGapX = 6,
  lgGapX = 6,
  gapY = 0,
  mdGapY = 0,
  lgGapY = 0,
  bgColor = "blue",
  maxWidth = "",
  mdMaxWidth = "",
  lgMaxWidth = "",
  padding = "xs",
  rtlSupport = false,
  containerQueries = false,
}: TailwindGridProps) {
  
  // Generar clases de gap dinámicamente para todos los breakpoints
  const gapClasses = [
    generateGapClass(gapX, 'x'),        // Base: gap-x-4
    generateGapClass(mdGapX, 'x', 'md'), // Medium: md:gap-x-6
    generateGapClass(lgGapX, 'x', 'lg'), // Large: lg:gap-x-6
    generateGapClass(gapY, 'y'),        // Base: gap-y-0
    generateGapClass(mdGapY, 'y', 'md'), // Medium: md:gap-y-0
    generateGapClass(lgGapY, 'y', 'lg'), // Large: lg:gap-y-0
  ].filter(Boolean); // Remover valores vacíos

  // Seleccionar padding con soporte RTL (Tailwind 3.4+)
  const currentPadding = (fullSize || padding === "") ? "" : 
    rtlSupport ? CONFIG.paddingsRTL[padding] : CONFIG.paddings[padding];
  
  // Generar clases de ancho máximo responsivas
  const maxWidthClasses = generateMaxWidthClasses(maxWidth, mdMaxWidth, lgMaxWidth);

  // Clases base del grid optimizadas para Tailwind 3.4+
  const baseGridClasses = [
    "w-full",
    // Elegir entre container queries (3.4+) o media queries tradicionales
    containerQueries 
      ? "@container grid @md:grid-cols-8 @lg:grid-cols-12 grid-cols-4" 
      : "grid-cols-4 md:grid-cols-8 lg:grid-cols-12",
    "grid relative",
    ...gapClasses,      // Espaciado entre elementos
    ...maxWidthClasses, // Límites de ancho y centrado
  ];

  // Clases para la sección de debug visual
  const debugSectionClasses = cn(
    ...baseGridClasses,
    currentPadding,
    "bg-red-500/10 z-50 pointer-events-none" // No interfiere con interacciones
  );

  // Clases para la sección de contenido principal
  const contentSectionClasses = cn(
    ...baseGridClasses,
    currentPadding,
    className // Permite clases personalizadas
  );

  return (
    <>
      {/* Sección de debug: Grid visual superpuesto */}
      <section className={debugSectionClasses}>
        {show && (
          <div className={cn(...baseGridClasses, currentPadding, "absolute w-full z-50 box-border")}>
            {/* Generar 12 columnas numeradas para visualización */}
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-screen text-center text-zinc-900 col-span-1",
                  CONFIG.bgColors[bgColor],
                  // Lógica de visibility responsiva
                  index >= 4 && index < 8 && "hidden md:block", // Columnas 5-8: solo md+
                  index >= 8 && "hidden lg:block"               // Columnas 9-12: solo lg+
                )}
              >
                {index + 1}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sección de contenido: Donde se renderizan los children */}
      <section className={contentSectionClasses}>
        {children}
      </section>
    </>
  );
}

export default TailwindGrid;