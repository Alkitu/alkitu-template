/**
 * Border Radius Calculator Utilities
 * Implementa la fórmula automática: R_int = R_ext - P
 */

import { BorderRadiusController, ThemeBorders } from '../types/theme.types';

// Padding estándar para diferentes componentes (en px)
export const COMPONENT_PADDING = {
  CARD: 16, // padding estándar de cards
  BUTTON: 8, // padding estándar de buttons
  CARD_INNER: 12, // padding de elementos dentro de cards
  BUTTON_INNER: 4, // padding de elementos dentro de buttons
} as const;

/**
 * Calcula el border-radius interior usando la fórmula: R_int = R_ext - P
 * @param outerRadius Radio exterior en px
 * @param padding Padding en px
 * @returns Radio interior calculado (mínimo 0)
 */
export function calculateInnerRadius(outerRadius: number, padding: number): number {
  return Math.max(0, outerRadius - padding);
}

/**
 * Genera la fórmula CSS calc() para border-radius anidados
 * @param outerRadiusVar Variable CSS del radio exterior
 * @param padding Padding en px
 * @returns String CSS calc()
 */
export function generateRadiusFormula(outerRadiusVar: string, padding: number): string {
  if (padding === 0) {
    return `var(${outerRadiusVar})`;
  }
  return `calc(var(${outerRadiusVar}) - ${padding}px)`;
}

/**
 * Crea un controlador de border-radius por defecto
 * @param value Valor inicial en px
 * @param isLinked Si está vinculado a global
 * @param padding Padding para la fórmula
 * @returns BorderRadiusController
 */
export function createBorderRadiusController(
  value: number, 
  isLinked: boolean = true,
  padding: number = 0
): BorderRadiusController {
  return {
    value,
    isLinked,
    formula: padding > 0 ? generateRadiusFormula('--radius', padding) : `${value}px`
  };
}

/**
 * Actualiza los valores computados de ThemeBorders basado en los controladores
 * @param borders Configuración actual de borders
 * @returns ThemeBorders con valores actualizados
 */
export function computeBorderValues(borders: Partial<ThemeBorders>): ThemeBorders {
  // Obtener valores de los controladores o valores por defecto
  const globalValue = borders.globalRadius?.value ?? 8;
  const cardsValue = borders.cardsRadius?.isLinked ? globalValue : (borders.cardsRadius?.value ?? globalValue);
  const buttonsValue = borders.buttonsRadius?.isLinked ? globalValue : (borders.buttonsRadius?.value ?? globalValue);

  // Valores base computados
  const radius = `${globalValue}px`;
  const radiusSm = globalValue >= 4 ? `calc(var(--radius) - 4px)` : '0px';
  const radiusMd = globalValue >= 2 ? `calc(var(--radius) - 2px)` : '0px';
  const radiusLg = `var(--radius)`;
  const radiusXl = `calc(var(--radius) + 4px)`;

  // Valores específicos de componentes
  const radiusCard = `${cardsValue}px`;
  const radiusCardInner = `${calculateInnerRadius(cardsValue, COMPONENT_PADDING.CARD_INNER)}px`;
  const radiusButton = `${buttonsValue}px`;
  const radiusButtonInner = `${calculateInnerRadius(buttonsValue, COMPONENT_PADDING.BUTTON_INNER)}px`;

  return {
    // Controladores (mantener existentes o crear por defecto)
    globalRadius: borders.globalRadius ?? createBorderRadiusController(globalValue),
    cardsRadius: borders.cardsRadius ?? createBorderRadiusController(cardsValue, true, COMPONENT_PADDING.CARD_INNER),
    buttonsRadius: borders.buttonsRadius ?? createBorderRadiusController(buttonsValue, true, COMPONENT_PADDING.BUTTON_INNER),
    
    // Valores computados
    radius,
    radiusSm,
    radiusMd,
    radiusLg,
    radiusXl,
    radiusCard,
    radiusCardInner,
    radiusButton,
    radiusButtonInner,
  };
}

/**
 * Actualiza un controlador específico y recalcula todos los valores
 * @param borders Configuración actual
 * @param controllerName Nombre del controlador a actualizar
 * @param newValue Nuevo valor en px
 * @param forceUnlink Si se debe desvincular automáticamente
 * @returns ThemeBorders actualizada
 */
export function updateBorderController(
  borders: ThemeBorders,
  controllerName: 'globalRadius' | 'cardsRadius' | 'buttonsRadius',
  newValue: number,
  forceUnlink: boolean = false
): ThemeBorders {
  // Asegurar que tenemos controladores válidos
  const safeBorders = computeBorderValues(borders);
  const updatedBorders = { ...safeBorders };
  
  // Actualizar el controlador específico
  const controller = { ...updatedBorders[controllerName] };
  controller.value = newValue;
  
  // Si se cambia manualmente un controlador no-global, desvincularlo
  if (forceUnlink && controllerName !== 'globalRadius') {
    controller.isLinked = false;
  }
  
  // Si se cambia el global, propagar a los vinculados
  if (controllerName === 'globalRadius') {
    if (updatedBorders.cardsRadius?.isLinked) {
      updatedBorders.cardsRadius = { ...updatedBorders.cardsRadius, value: newValue };
    }
    if (updatedBorders.buttonsRadius?.isLinked) {
      updatedBorders.buttonsRadius = { ...updatedBorders.buttonsRadius, value: newValue };
    }
  }
  
  updatedBorders[controllerName] = controller;
  
  // Recalcular todos los valores
  return computeBorderValues(updatedBorders);
}

/**
 * Vincula/desvincula un controlador al global
 * @param borders Configuración actual
 * @param controllerName Controlador a modificar
 * @param shouldLink Si debe vincularse o no
 * @returns ThemeBorders actualizada
 */
export function toggleBorderLink(
  borders: ThemeBorders,
  controllerName: 'cardsRadius' | 'buttonsRadius',
  shouldLink: boolean
): ThemeBorders {
  // Asegurar que tenemos controladores válidos
  const safeBorders = computeBorderValues(borders);
  const updatedBorders = { ...safeBorders };
  const controller = { ...updatedBorders[controllerName] };
  
  controller.isLinked = shouldLink;
  
  // Si se vincula, sincronizar con el valor global
  if (shouldLink) {
    controller.value = updatedBorders.globalRadius?.value || 8;
  }
  
  updatedBorders[controllerName] = controller;
  
  // Recalcular valores
  return computeBorderValues(updatedBorders);
}

/**
 * Genera variables CSS para usar en el sistema de diseño
 * @param borders Configuración de borders
 * @returns Record con variables CSS
 */
export function generateBorderCSSVariables(borders: ThemeBorders): Record<string, string> {
  return {
    '--radius': borders.radius,
    '--radius-sm': borders.radiusSm,
    '--radius-md': borders.radiusMd,
    '--radius-lg': borders.radiusLg,
    '--radius-xl': borders.radiusXl,
    '--radius-card': borders.radiusCard,
    '--radius-card-inner': borders.radiusCardInner,
    '--radius-button': borders.radiusButton,
    '--radius-button-inner': borders.radiusButtonInner,
  };
}