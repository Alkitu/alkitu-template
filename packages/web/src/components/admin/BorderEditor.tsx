import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Monitor, Tablet, Smartphone, Tv, Save, Download, RotateCcw, Settings } from "lucide-react";
import { SimpleRadiusEditor } from "./SimpleRadiusEditor";
import { CheckboxRadiusModal } from "./theme-editor-3.0/modals/CheckboxRadiusModal";

// Breakpoints
const BREAKPOINTS = [
  { key: 'tv', name: 'TV', icon: Tv, minWidth: 1920 },
  { key: 'desktop', name: 'Desktop', icon: Monitor, minWidth: 1024 },
  { key: 'tablet', name: 'Tablet', icon: Tablet, minWidth: 768 },
  { key: 'mobile', name: 'Mobile', icon: Smartphone, minWidth: 0 }
] as const;

// Border Widths disponibles
const BORDER_WIDTHS = [
  { value: 0, label: '0', description: 'Sin borde' },
  { value: 1, label: '1', description: '1px' },
  { value: 2, label: '2', description: '2px' },
  { value: 4, label: '4', description: '4px' },
  { value: 8, label: '8', description: '8px' },
];

// Border Styles disponibles
const BORDER_STYLES = [
  { key: 'solid', name: 'Solid', value: 'solid', description: 'Línea continua' },
  { key: 'dashed', name: 'Dashed', value: 'dashed', description: 'Línea discontinua' },
  { key: 'dotted', name: 'Dotted', value: 'dotted', description: 'Línea punteada' },
  { key: 'double', name: 'Double', value: 'double', description: 'Línea doble' },
  { key: 'hidden', name: 'Hidden', value: 'hidden', description: 'Oculto' },
  { key: 'none', name: 'None', value: 'none', description: 'Sin estilo' },
] as const;

// Outline Widths disponibles
const OUTLINE_WIDTHS = [
  { value: 0, label: '0', description: 'Sin outline' },
  { value: 1, label: '1', description: '1px' },
  { value: 2, label: '2', description: '2px' },
  { value: 4, label: '4', description: '4px' },
  { value: 8, label: '8', description: '8px' },
];

// Outline Styles disponibles
const OUTLINE_STYLES = [
  { key: 'solid', name: 'Solid', value: 'solid', description: 'Línea continua' },
  { key: 'dashed', name: 'Dashed', value: 'dashed', description: 'Línea discontinua' },
  { key: 'dotted', name: 'Dotted', value: 'dotted', description: 'Línea punteada' },
  { key: 'double', name: 'Double', value: 'double', description: 'Línea doble' },
  { key: 'none', name: 'None', value: 'none', description: 'Sin estilo' },
  { key: 'hidden', name: 'Hidden', value: 'hidden', description: 'Transparente con offset' },
] as const;

// Outline Offsets disponibles
const OUTLINE_OFFSETS = [
  { value: -8, label: '-8', description: '-8px hacia adentro' },
  { value: -4, label: '-4', description: '-4px hacia adentro' },
  { value: -2, label: '-2', description: '-2px hacia adentro' },
  { value: -1, label: '-1', description: '-1px hacia adentro' },
  { value: 0, label: '0', description: 'Sin offset' },
  { value: 1, label: '1', description: '1px hacia afuera' },
  { value: 2, label: '2', description: '2px hacia afuera' },
  { value: 4, label: '4', description: '4px hacia afuera' },
  { value: 8, label: '8', description: '8px hacia afuera' },
];

// Direcciones de borde
const BORDER_DIRECTIONS = [
  { key: 'all', name: 'All', description: 'border', properties: ['borderWidth', 'borderStyle'] },
  { key: 't', name: 'Top', description: 'border-t', properties: ['borderTopWidth', 'borderTopStyle'] },
  { key: 'r', name: 'Right', description: 'border-r', properties: ['borderRightWidth', 'borderRightStyle'] },
  { key: 'b', name: 'Bottom', description: 'border-b', properties: ['borderBottomWidth', 'borderBottomStyle'] },
  { key: 'l', name: 'Left', description: 'border-l', properties: ['borderLeftWidth', 'borderLeftStyle'] },
] as const;

type BreakpointKey = typeof BREAKPOINTS[number]['key'];
type BorderStyleKey = typeof BORDER_STYLES[number]['key'];
type OutlineStyleKey = typeof OUTLINE_STYLES[number]['key'];
type BorderDirectionKey = typeof BORDER_DIRECTIONS[number]['key'];

// Estado de border por breakpoint
type BorderState = {
  [K in BreakpointKey]: {
    width: number; // Ancho global
    style: BorderStyleKey; // Estilo global
    directions: {
      [D in BorderDirectionKey]: {
        width: number;
        style: BorderStyleKey;
        isCustom: boolean; // Si usa valores diferentes al global
      }
    };
    outline: {
      width: number;
      style: OutlineStyleKey;
      offset: number;
    }
  }
}

interface BorderEditorProps {
  onChange?: (state: BorderState) => void;
  onSave?: (state: BorderState) => void;
}

export const BorderEditor = ({ onChange, onSave }: BorderEditorProps) => {
  const [activeBreakpoint, setActiveBreakpoint] = useState<BreakpointKey | 'code'>('desktop');
  
  // Estado del radius desde SimpleRadiusEditor
  const [radiusState, setRadiusState] = useState<any>(null);
  
  // Estado para la modal de checkbox radius
  const [isCheckboxRadiusModalOpen, setIsCheckboxRadiusModalOpen] = useState(false);
  
  // Estados para controlar qué propiedades incluir en el CSS
  const [includeProperties, setIncludeProperties] = useState({
    borderRadius: true,
    borderWidth: true,
    borderStyle: true,
    borderColor: true, // TODO: Implementar componente
    outlineWidth: true,
    outlineStyle: true,
    outlineOffset: true,
    outlineColor: true, // TODO: Implementar componente
  });

  // Estados para controlar qué breakpoints incluir
  const [includeBreakpoints, setIncludeBreakpoints] = useState({
    tv: true,
    desktop: true,
    tablet: true,
    mobile: true,
  });

  // Estados para controlar propiedades por breakpoint individual
  const [includePropertiesByBreakpoint, setIncludePropertiesByBreakpoint] = useState<{
    [K in BreakpointKey]: {
      borderRadius: boolean;
      borderWidth: boolean;
      borderStyle: boolean;
      borderColor: boolean; // TODO: Implementar componente
      outlineWidth: boolean;
      outlineStyle: boolean;
      outlineOffset: boolean;
      outlineColor: boolean; // TODO: Implementar componente
    }
  }>({
    tv: {
      borderRadius: true,
      borderWidth: true,
      borderStyle: true,
      borderColor: true,
      outlineWidth: true,
      outlineStyle: true,
      outlineOffset: true,
      outlineColor: true,
    },
    desktop: {
      borderRadius: true,
      borderWidth: true,
      borderStyle: true,
      borderColor: true,
      outlineWidth: true,
      outlineStyle: true,
      outlineOffset: true,
      outlineColor: true,
    },
    tablet: {
      borderRadius: true,
      borderWidth: true,
      borderStyle: true,
      borderColor: true,
      outlineWidth: true,
      outlineStyle: true,
      outlineOffset: true,
      outlineColor: true,
    },
    mobile: {
      borderRadius: true,
      borderWidth: true,
      borderStyle: true,
      borderColor: true,
      outlineWidth: true,
      outlineStyle: true,
      outlineOffset: true,
      outlineColor: true,
    },
  });
  
  // Estado para tabs dentro de cada breakpoint
  const [activeSubTab, setActiveSubTab] = useState<'preview' | 'code'>('preview');
  
  // Estado inicial de border
  const [borderState, setBorderState] = useState<BorderState>(() => {
    const initialState = {} as BorderState;
    
    BREAKPOINTS.forEach(bp => {
      const defaultWidth = 1;
      const defaultStyle: BorderStyleKey = 'solid';
      const defaultOutlineStyle: OutlineStyleKey = 'solid';
      
      initialState[bp.key] = {
        width: defaultWidth,
        style: defaultStyle,
        directions: {} as BorderState[BreakpointKey]['directions'],
        outline: {
          width: 2,
          style: defaultOutlineStyle,
          offset: 2,
        }
      };
      
      // Inicializar todas las direcciones
      BORDER_DIRECTIONS.forEach(dir => {
        initialState[bp.key].directions[dir.key] = {
          width: defaultWidth,
          style: defaultStyle,
          isCustom: false,
        };
      });
    });
    
    return initialState;
  });

  // Estado actual del breakpoint activo (solo si es un breakpoint real, no 'code')
  const currentState = activeBreakpoint !== 'code' ? borderState[activeBreakpoint] : borderState['desktop'];

  // Actualizar width global
  const updateGlobalWidth = (width: number) => {
    setBorderState(prev => {
      const newState = { ...prev };
      newState[activeBreakpoint] = {
        ...newState[activeBreakpoint],
        width,
        directions: { ...newState[activeBreakpoint].directions }
      };
      
      // Actualizar todas las direcciones que no son custom
      BORDER_DIRECTIONS.forEach(dir => {
        if (!newState[activeBreakpoint].directions[dir.key].isCustom) {
          newState[activeBreakpoint].directions[dir.key].width = width;
        }
      });
      
      return newState;
    });
  };

  // Actualizar style global
  const updateGlobalStyle = (style: BorderStyleKey) => {
    setBorderState(prev => {
      const newState = { ...prev };
      newState[activeBreakpoint] = {
        ...newState[activeBreakpoint],
        style,
        directions: { ...newState[activeBreakpoint].directions }
      };
      
      // Actualizar todas las direcciones que no son custom
      BORDER_DIRECTIONS.forEach(dir => {
        if (!newState[activeBreakpoint].directions[dir.key].isCustom) {
          newState[activeBreakpoint].directions[dir.key].style = style;
        }
      });
      
      return newState;
    });
  };

  // Actualizar dirección específica
  const updateDirectionWidth = (direction: BorderDirectionKey, width: number) => {
    setBorderState(prev => ({
      ...prev,
      [activeBreakpoint]: {
        ...prev[activeBreakpoint],
        directions: {
          ...prev[activeBreakpoint].directions,
          [direction]: {
            ...prev[activeBreakpoint].directions[direction],
            width,
            isCustom: true,
          }
        }
      }
    }));
  };

  const updateDirectionStyle = (direction: BorderDirectionKey, style: BorderStyleKey) => {
    setBorderState(prev => ({
      ...prev,
      [activeBreakpoint]: {
        ...prev[activeBreakpoint],
        directions: {
          ...prev[activeBreakpoint].directions,
          [direction]: {
            ...prev[activeBreakpoint].directions[direction],
            style,
            isCustom: true,
          }
        }
      }
    }));
  };

  // Reset dirección a valores globales
  const resetDirectionToGlobal = (direction: BorderDirectionKey) => {
    setBorderState(prev => ({
      ...prev,
      [activeBreakpoint]: {
        ...prev[activeBreakpoint],
        directions: {
          ...prev[activeBreakpoint].directions,
          [direction]: {
            width: prev[activeBreakpoint].width,
            style: prev[activeBreakpoint].style,
            isCustom: false,
          }
        }
      }
    }));
  };

  // Funciones para outline
  const updateOutlineWidth = (width: number) => {
    setBorderState(prev => ({
      ...prev,
      [activeBreakpoint]: {
        ...prev[activeBreakpoint],
        outline: {
          ...prev[activeBreakpoint].outline,
          width
        }
      }
    }));
  };

  const updateOutlineStyle = (style: OutlineStyleKey) => {
    setBorderState(prev => ({
      ...prev,
      [activeBreakpoint]: {
        ...prev[activeBreakpoint],
        outline: {
          ...prev[activeBreakpoint].outline,
          style
        }
      }
    }));
  };

  const updateOutlineOffset = (offset: number) => {
    setBorderState(prev => ({
      ...prev,
      [activeBreakpoint]: {
        ...prev[activeBreakpoint],
        outline: {
          ...prev[activeBreakpoint].outline,
          offset
        }
      }
    }));
  };

  // FUNCIONES DE RESET
  
  // Reset global - todos los breakpoints a valores por defecto
  const resetAllBreakpoints = () => {
    const defaultState = {} as BorderState;
    
    BREAKPOINTS.forEach(bp => {
      const defaultWidth = 1;
      const defaultStyle: BorderStyleKey = 'solid';
      const defaultOutlineStyle: OutlineStyleKey = 'solid';
      
      defaultState[bp.key] = {
        width: defaultWidth,
        style: defaultStyle,
        directions: {} as BorderState[BreakpointKey]['directions'],
        outline: {
          width: 2,
          style: defaultOutlineStyle,
          offset: 2,
        }
      };
      
      BORDER_DIRECTIONS.forEach(dir => {
        defaultState[bp.key].directions[dir.key] = {
          width: defaultWidth,
          style: defaultStyle,
          isCustom: false,
        };
      });
    });
    
    setBorderState(defaultState);
    setRadiusState(null); // Reset radius también
  };

  // Reset del breakpoint activo
  const resetCurrentBreakpoint = () => {
    if (activeBreakpoint === 'code') return; // No hacer nada si estamos en el tab Code
    
    const defaultWidth = 1;
    const defaultStyle: BorderStyleKey = 'solid';
    const defaultOutlineStyle: OutlineStyleKey = 'solid';
    
    setBorderState(prev => {
      const newState = { ...prev };
      newState[activeBreakpoint as BreakpointKey] = {
        width: defaultWidth,
        style: defaultStyle,
        directions: {} as BorderState[BreakpointKey]['directions'],
        outline: {
          width: 2,
          style: defaultOutlineStyle,
          offset: 2,
        }
      };
      
      BORDER_DIRECTIONS.forEach(dir => {
        newState[activeBreakpoint as BreakpointKey].directions[dir.key] = {
          width: defaultWidth,
          style: defaultStyle,
          isCustom: false,
        };
      });
      
      return newState;
    });
  };

  // Reset de propiedad específica del breakpoint activo
  const resetPropertyInBreakpoint = (property: 'width' | 'style' | 'outline') => {
    if (activeBreakpoint === 'code') return; // No hacer nada si estamos en el tab Code
    
    setBorderState(prev => {
      const newState = { ...prev };
      const bp = activeBreakpoint as BreakpointKey;
      
      if (property === 'width') {
        const defaultWidth = 1;
        newState[bp].width = defaultWidth;
        // Reset todas las direcciones a global
        BORDER_DIRECTIONS.forEach(dir => {
          newState[bp].directions[dir.key].width = defaultWidth;
          newState[bp].directions[dir.key].isCustom = false;
        });
      } else if (property === 'style') {
        const defaultStyle: BorderStyleKey = 'solid';
        newState[bp].style = defaultStyle;
        // Reset todas las direcciones a global
        BORDER_DIRECTIONS.forEach(dir => {
          newState[bp].directions[dir.key].style = defaultStyle;
          newState[bp].directions[dir.key].isCustom = false;
        });
      } else if (property === 'outline') {
        newState[bp].outline = {
          width: 2,
          style: 'solid',
          offset: 2,
        };
      }
      
      return newState;
    });
  };

  // Obtener estilo de preview
  const getPreviewStyle = useCallback(() => {
    const directions = currentState.directions;
    const outline = currentState.outline;
    
    // Manejar el caso especial de outline-hidden
    const outlineStyle = outline.style === 'hidden' 
      ? { outline: '2px solid transparent', outlineOffset: '2px' }
      : {
          outlineWidth: `${outline.width}px`,
          outlineStyle: outline.style,
          outlineOffset: `${outline.offset}px`,
          outlineColor: '#f59e0b', // Color fijo para preview (diferente al border)
        };
    
    return {
      borderTopWidth: `${directions.t.width}px`,
      borderRightWidth: `${directions.r.width}px`,
      borderBottomWidth: `${directions.b.width}px`,
      borderLeftWidth: `${directions.l.width}px`,
      borderTopStyle: directions.t.style,
      borderRightStyle: directions.r.style,
      borderBottomStyle: directions.b.style,
      borderLeftStyle: directions.l.style,
      borderColor: '#3b82f6', // Color fijo para preview
      ...outlineStyle,
    };
  }, [currentState.directions, currentState.outline]);

  // Generar CSS separado por propiedades - CLASES INDIVIDUALES
  const generateBorderThemeCSS = useCallback(() => {
    let css = '/* Border Theme System - Generated by Alkitu Theme Editor */\n';
    css += '/* Clases separadas por propiedad para máxima flexibilidad */\n\n';
    
    BREAKPOINTS.forEach(bp => {
      // Skip breakpoint if not included
      if (!includeBreakpoints[bp.key]) return;
      
      const state = borderState[bp.key];
      css += `/* ${bp.name} Breakpoint (${bp.minWidth}px+) */\n`;
      css += `@media (min-width: ${bp.minWidth}px) {\n`;
      
      // BORDER RADIUS THEME
      if (includeProperties.borderRadius) {
        css += '  .border-radius-theme {\n';
        if (radiusState && radiusState[bp.key]) {
          const bpRadius = radiusState[bp.key];
          if (bpRadius.isLinked) {
            const radius = bpRadius.globalValue === 9999 ? '50%' : `${bpRadius.globalValue}px`;
            css += `    border-radius: ${radius};\n`;
          } else {
            const tl = bpRadius.corners.tl === 9999 ? '50%' : `${bpRadius.corners.tl}px`;
            const tr = bpRadius.corners.tr === 9999 ? '50%' : `${bpRadius.corners.tr}px`;
            const bl = bpRadius.corners.bl === 9999 ? '50%' : `${bpRadius.corners.bl}px`;
            const br = bpRadius.corners.br === 9999 ? '50%' : `${bpRadius.corners.br}px`;
            css += `    border-top-left-radius: ${tl};\n`;
            css += `    border-top-right-radius: ${tr};\n`;
            css += `    border-bottom-left-radius: ${bl};\n`;
            css += `    border-bottom-right-radius: ${br};\n`;
          }
        } else {
          const defaultRadius = bp.key === 'tv' ? 16 : bp.key === 'desktop' ? 12 : bp.key === 'tablet' ? 8 : 6;
          css += `    border-radius: ${defaultRadius}px;\n`;
        }
        css += '  }\n\n';
      }
      
      // BORDER WIDTH THEME
      if (includeProperties.borderWidth) {
        css += '  .border-width-theme {\n';
        BORDER_DIRECTIONS.forEach(dir => {
          const dirState = state.directions[dir.key];
          if (dir.key === 'all') {
            css += `    border-width: ${dirState.width}px;\n`;
          } else {
            const borderSide = dir.key === 't' ? 'top' : dir.key === 'r' ? 'right' : dir.key === 'b' ? 'bottom' : 'left';
            css += `    border-${borderSide}-width: ${dirState.width}px;\n`;
          }
        });
        css += '  }\n\n';
      }
      
      // BORDER STYLE THEME
      if (includeProperties.borderStyle) {
        css += '  .border-style-theme {\n';
        BORDER_DIRECTIONS.forEach(dir => {
          const dirState = state.directions[dir.key];
          if (dir.key === 'all') {
            css += `    border-style: ${dirState.style};\n`;
          } else {
            const borderSide = dir.key === 't' ? 'top' : dir.key === 'r' ? 'right' : dir.key === 'b' ? 'bottom' : 'left';
            css += `    border-${borderSide}-style: ${dirState.style};\n`;
          }
        });
        css += '  }\n\n';
      }
      
      // BORDER COLOR THEME
      if (includeProperties.borderColor) {
        css += '  .border-color-theme {\n';
        css += '    border-color: #3b82f6; /* TODO: Implementar selector de color */\n';
        css += '  }\n\n';
      }
      
      // OUTLINE WIDTH THEME
      if (includeProperties.outlineWidth) {
        css += '  .outline-width-theme {\n';
        css += `    outline-width: ${state.outline.width}px;\n`;
        css += '  }\n\n';
      }
      
      // OUTLINE STYLE THEME
      if (includeProperties.outlineStyle) {
        css += '  .outline-style-theme {\n';
        if (state.outline.style === 'hidden') {
          css += '    outline: 2px solid transparent;\n';
        } else if (state.outline.style === 'none' || state.outline.width === 0) {
          css += '    outline: none;\n';
        } else {
          css += `    outline-style: ${state.outline.style};\n`;
        }
        css += '  }\n\n';
      }
      
      // OUTLINE OFFSET THEME
      if (includeProperties.outlineOffset) {
        css += '  .outline-offset-theme {\n';
        css += `    outline-offset: ${state.outline.offset}px;\n`;
        css += '  }\n\n';
      }
      
      // OUTLINE COLOR THEME
      if (includeProperties.outlineColor) {
        css += '  .outline-color-theme {\n';
        css += '    outline-color: #f59e0b; /* TODO: Implementar selector de color */\n';
        css += '  }\n\n';
      }
      
      css += '}\n\n';
    });
    
    // Agregar comentario de uso
    css += '/* USAGE INSTRUCTIONS:\n';
    css += ' * Use individual classes for maximum flexibility:\n';
    css += ' * - .border-radius-theme (border radius)\n';
    css += ' * - .border-width-theme (border width)\n';
    css += ' * - .border-style-theme (border style)\n';
    css += ' * - .border-color-theme (border color - TODO: implementar selector)\n';
    css += ' * - .outline-width-theme (outline width)\n';
    css += ' * - .outline-style-theme (outline style)\n';
    css += ' * - .outline-offset-theme (outline offset)\n';
    css += ' * - .outline-color-theme (outline color - TODO: implementar selector)\n';
    css += ' * \n';
    css += ' * Example: <div class="border-radius-theme border-width-theme border-color-theme">\n';
    css += ' */\n';
    
    return css.split('\n').map((line, i) => (
      <div key={i} className={line.startsWith('/*') || line.startsWith('@media') || line.startsWith('}') ? 'text-green-600' : ''}>
        {line}
      </div>
    ));
  }, [borderState, radiusState, includeProperties, includeBreakpoints]);

  // Generar CSS para un breakpoint específico
  const generateBreakpointCSS = useCallback((breakpoint: BreakpointKey) => {
    const bp = BREAKPOINTS.find(b => b.key === breakpoint)!;
    const state = borderState[breakpoint];
    const bpProperties = includePropertiesByBreakpoint[breakpoint];
    
    let css = `/* ${bp.name} Breakpoint CSS (${bp.minWidth}px+) */\n`;
    css += `@media (min-width: ${bp.minWidth}px) {\n`;
    
    // BORDER RADIUS THEME
    if (bpProperties.borderRadius) {
      css += '  .border-radius-theme {\n';
      if (radiusState && radiusState[breakpoint]) {
        const bpRadius = radiusState[breakpoint];
        if (bpRadius.isLinked) {
          const radius = bpRadius.globalValue === 9999 ? '50%' : `${bpRadius.globalValue}px`;
          css += `    border-radius: ${radius};\n`;
        } else {
          const tl = bpRadius.corners.tl === 9999 ? '50%' : `${bpRadius.corners.tl}px`;
          const tr = bpRadius.corners.tr === 9999 ? '50%' : `${bpRadius.corners.tr}px`;
          const bl = bpRadius.corners.bl === 9999 ? '50%' : `${bpRadius.corners.bl}px`;
          const br = bpRadius.corners.br === 9999 ? '50%' : `${bpRadius.corners.br}px`;
          css += `    border-top-left-radius: ${tl};\n`;
          css += `    border-top-right-radius: ${tr};\n`;
          css += `    border-bottom-left-radius: ${bl};\n`;
          css += `    border-bottom-right-radius: ${br};\n`;
        }
      } else {
        const defaultRadius = breakpoint === 'tv' ? 16 : breakpoint === 'desktop' ? 12 : breakpoint === 'tablet' ? 8 : 6;
        css += `    border-radius: ${defaultRadius}px;\n`;
      }
      css += '  }\n\n';
    }
    
    // BORDER WIDTH THEME
    if (bpProperties.borderWidth) {
      css += '  .border-width-theme {\n';
      BORDER_DIRECTIONS.forEach(dir => {
        const dirState = state.directions[dir.key];
        if (dir.key === 'all') {
          css += `    border-width: ${dirState.width}px;\n`;
        } else {
          const borderSide = dir.key === 't' ? 'top' : dir.key === 'r' ? 'right' : dir.key === 'b' ? 'bottom' : 'left';
          css += `    border-${borderSide}-width: ${dirState.width}px;\n`;
        }
      });
      css += '  }\n\n';
    }
    
    // BORDER STYLE THEME
    if (bpProperties.borderStyle) {
      css += '  .border-style-theme {\n';
      BORDER_DIRECTIONS.forEach(dir => {
        const dirState = state.directions[dir.key];
        if (dir.key === 'all') {
          css += `    border-style: ${dirState.style};\n`;
        } else {
          const borderSide = dir.key === 't' ? 'top' : dir.key === 'r' ? 'right' : dir.key === 'b' ? 'bottom' : 'left';
          css += `    border-${borderSide}-style: ${dirState.style};\n`;
        }
      });
      css += '  }\n\n';
    }
    
    // BORDER COLOR THEME
    if (bpProperties.borderColor) {
      css += '  .border-color-theme {\n';
      css += '    border-color: #3b82f6; /* TODO: Implementar selector de color */\n';
      css += '  }\n\n';
    }
    
    // OUTLINE WIDTH THEME
    if (bpProperties.outlineWidth) {
      css += '  .outline-width-theme {\n';
      css += `    outline-width: ${state.outline.width}px;\n`;
      css += '  }\n\n';
    }
    
    // OUTLINE STYLE THEME
    if (bpProperties.outlineStyle) {
      css += '  .outline-style-theme {\n';
      if (state.outline.style === 'hidden') {
        css += '    outline: 2px solid transparent;\n';
      } else if (state.outline.style === 'none' || state.outline.width === 0) {
        css += '    outline: none;\n';
      } else {
        css += `    outline-style: ${state.outline.style};\n`;
      }
      css += '  }\n\n';
    }
    
    // OUTLINE OFFSET THEME
    if (bpProperties.outlineOffset) {
      css += '  .outline-offset-theme {\n';
      css += `    outline-offset: ${state.outline.offset}px;\n`;
      css += '  }\n\n';
    }
    
    // OUTLINE COLOR THEME
    if (bpProperties.outlineColor) {
      css += '  .outline-color-theme {\n';
      css += '    outline-color: #f59e0b; /* TODO: Implementar selector de color */\n';
      css += '  }\n\n';
    }
    
    css += '}\n';
    
    return css.split('\n').map((line, i) => (
      <div key={i} className={line.startsWith('/*') || line.startsWith('@media') || line.startsWith('}') ? 'text-green-600' : ''}>
        {line}
      </div>
    ));
  }, [borderState, radiusState, includePropertiesByBreakpoint]);

  // Exportar CSS como archivo
  const exportBorderThemeCSS = () => {
    const cssText = generateBorderThemeCSS().map(element => element.props.children).join('\n');
    const blob = new Blob([cssText], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'border-themes.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Aplicar CSS variables
  const applyCSSVariables = useCallback(() => {
    const root = document.documentElement;
    
    // Variables globales de border
    root.style.setProperty('--border-width', `${currentState.width}px`);
    root.style.setProperty('--border-style', currentState.style);
    
    // Variables por dirección (solo individual: all, t, r, b, l)
    BORDER_DIRECTIONS.forEach(dir => {
      const dirState = currentState.directions[dir.key];
      root.style.setProperty(`--border-${dir.key}-width`, `${dirState.width}px`);
      root.style.setProperty(`--border-${dir.key}-style`, dirState.style);
    });

    // Variables de outline
    const outline = currentState.outline;
    if (outline.style === 'hidden') {
      root.style.setProperty('--outline', '2px solid transparent');
      root.style.setProperty('--outline-offset', '2px');
    } else {
      root.style.setProperty('--outline-width', `${outline.width}px`);
      root.style.setProperty('--outline-style', outline.style);
      root.style.setProperty('--outline-offset', `${outline.offset}px`);
    }
  }, [currentState]);

  // Notificar cambios
  useEffect(() => {
    applyCSSVariables();
    onChange?.(borderState);
  }, [borderState, applyCSSVariables, onChange]);

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Editor de Border Completo</h2>
          <p className="text-muted-foreground">
            Configura radius, width, style y outline por breakpoint. Genera clases border-theme exportables.
          </p>
        </div>
        
        {/* Reset Global */}
        <Button
          variant="outline"
          size="sm"
          onClick={resetAllBreakpoints}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Todo
        </Button>
      </div>

      {/* Breakpoints como Tabs */}
      <Tabs value={activeBreakpoint} onValueChange={(value) => setActiveBreakpoint(value as BreakpointKey | 'code')}>
        <TabsList className="grid w-full grid-cols-5">
          {BREAKPOINTS.map((bp) => {
            const Icon = bp.icon;
            return (
              <TabsTrigger key={bp.key} value={bp.key} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {bp.name}
              </TabsTrigger>
            );
          })}
          {/* Tab Code Global */}
          <TabsTrigger value="code" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Code
          </TabsTrigger>
        </TabsList>
        
        {BREAKPOINTS.map((bp) => (
          <TabsContent key={bp.key} value={bp.key} className="space-y-6">
            {/* Tabs internos: Vista Previa y Code */}
            <Tabs value={activeSubTab} onValueChange={(value) => setActiveSubTab(value as 'preview' | 'code')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Vista Previa</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
              
              {/* Tab Vista Previa */}
              <TabsContent value="preview" className="space-y-6">
                {/* Vista Previa */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span>Vista Previa - {bp.name} ({bp.minWidth}px+)</span>
                      {/* Reset Breakpoint Activo */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetCurrentBreakpoint}
                        className="flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset {bp.name}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <div
                        className="w-32 h-32 bg-primary/10 relative flex items-center justify-center text-primary font-bold border-theme"
                        style={getPreviewStyle()}
                      >
                        Border Preview
                      </div>
                    </div>
                    <div className="mt-4 text-center text-sm text-muted-foreground">
                      Combina las clases que necesites: <code className="bg-muted px-1 rounded">border-radius-theme border-width-theme border-color-theme</code>
                    </div>
                  </CardContent>
                </Card>

                {/* Propiedades como Acordeones - Inicialmente cerrados */}
                <Accordion type="multiple" defaultValue={[]} className="w-full">
                  {/* Radius */}
                  <AccordionItem value="radius">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center justify-between w-full mr-4">
                        <span>Border Radius</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRadiusState(null);
                          }}
                          className="flex items-center gap-1 h-6 px-2"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Reset
                        </Button>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <SimpleRadiusEditor
                        onChange={(newRadiusState) => {
                          setRadiusState(newRadiusState);
                          console.log('Radius changed:', newRadiusState);
                        }}
                        onSave={(newRadiusState) => {
                          setRadiusState(newRadiusState);
                          console.log('Radius saved:', newRadiusState);
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  {/* Checkbox Radius Modal Button */}
                  <div className="p-4 border border-dashed border-muted-foreground/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Checkbox Border Radius</span>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setIsCheckboxRadiusModalOpen(true)}
                        className="flex items-center gap-1"
                      >
                        <Settings className="w-3 h-3" />
                        Configure
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Open dedicated modal to customize checkbox border radius with live preview.
                    </p>
                  </div>
                

                  {/* Width */}
                  <AccordionItem value="width">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center justify-between w-full mr-4">
                        <span>Border Width</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            resetPropertyInBreakpoint('width');
                          }}
                          className="flex items-center gap-1 h-6 px-2"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Reset
                        </Button>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      {/* Width Global */}
                      <div>
                        <div className="text-sm font-medium mb-2">Width Global</div>
                        <div className="flex gap-2">
                          {BORDER_WIDTHS.map(width => (
                            <Button
                              key={width.value}
                              variant={borderState[bp.key].width === width.value ? "default" : "outline"}
                              size="sm"
                              onClick={() => updateGlobalWidth(width.value)}
                              title={width.description}
                            >
                              {width.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Direcciones Específicas */}
                      <div>
                        <div className="text-sm font-medium mb-2">Por Dirección</div>
                        <div className="space-y-3">
                          {BORDER_DIRECTIONS.map(dir => {
                            const dirState = borderState[bp.key].directions[dir.key];
                            return (
                              <div key={dir.key} className="flex items-center justify-between p-2 border rounded">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{dir.name}</span>
                                  <Badge variant={dirState.isCustom ? "default" : "secondary"}>
                                    {dirState.isCustom ? 'Custom' : 'Global'}
                                  </Badge>
                                </div>
                                <div className="flex gap-1">
                                  {BORDER_WIDTHS.map(width => (
                                    <Button
                                      key={width.value}
                                      variant={dirState.width === width.value ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => updateDirectionWidth(dir.key, width.value)}
                                      className="text-xs px-2"
                                    >
                                      {width.label}
                                    </Button>
                                  ))}
                                  {dirState.isCustom && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => resetDirectionToGlobal(dir.key)}
                                      className="text-xs"
                                    >
                                      Reset
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Style */}
                  <AccordionItem value="style">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center justify-between w-full mr-4">
                        <span>Border Style</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            resetPropertyInBreakpoint('style');
                          }}
                          className="flex items-center gap-1 h-6 px-2"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Reset
                        </Button>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      {/* Style Global */}
                      <div>
                        <div className="text-sm font-medium mb-2">Style Global</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {BORDER_STYLES.map(style => (
                            <Button
                              key={style.key}
                              variant={borderState[bp.key].style === style.key ? "default" : "outline"}
                              size="sm"
                              onClick={() => updateGlobalStyle(style.key)}
                              className="flex flex-col items-center gap-1 h-auto py-3"
                              title={style.description}
                            >
                              <div
                                className="w-8 h-1 bg-primary"
                                style={{ borderTop: `2px ${style.value} currentColor` }}
                              />
                              <span className="text-xs">{style.name}</span>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Direcciones Específicas */}
                      <div>
                        <div className="text-sm font-medium mb-2">Por Dirección</div>
                        <div className="space-y-3">
                          {BORDER_DIRECTIONS.map(dir => {
                            const dirState = borderState[bp.key].directions[dir.key];
                            return (
                              <div key={dir.key} className="p-2 border rounded">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">{dir.name}</span>
                                  <Badge variant={dirState.isCustom ? "default" : "secondary"}>
                                    {dirState.isCustom ? 'Custom' : 'Global'}
                                  </Badge>
                                </div>
                                <div className="flex gap-1 flex-wrap">
                                  {BORDER_STYLES.map(style => (
                                    <Button
                                      key={style.key}
                                      variant={dirState.style === style.key ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => updateDirectionStyle(dir.key, style.key)}
                                      className="text-xs px-2"
                                    >
                                      {style.name}
                                    </Button>
                                  ))}
                                  {dirState.isCustom && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => resetDirectionToGlobal(dir.key)}
                                      className="text-xs"
                                    >
                                      Reset
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Outline */}
                  <AccordionItem value="outline">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center justify-between w-full mr-4">
                        <span>Outline</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            resetPropertyInBreakpoint('outline');
                          }}
                          className="flex items-center gap-1 h-6 px-2"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Reset
                        </Button>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      {/* Outline Width */}
                      <div>
                        <div className="text-sm font-medium mb-2">Outline Width</div>
                        <div className="flex gap-2">
                          {OUTLINE_WIDTHS.map(width => (
                            <Button
                              key={width.value}
                              variant={borderState[bp.key].outline.width === width.value ? "default" : "outline"}
                              size="sm"
                              onClick={() => updateOutlineWidth(width.value)}
                              title={width.description}
                            >
                              {width.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Outline Style */}
                      <div>
                        <div className="text-sm font-medium mb-2">Outline Style</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {OUTLINE_STYLES.map(style => (
                            <Button
                              key={style.key}
                              variant={borderState[bp.key].outline.style === style.key ? "default" : "outline"}
                              size="sm"
                              onClick={() => updateOutlineStyle(style.key)}
                              className="flex flex-col items-center gap-1 h-auto py-3"
                              title={style.description}
                            >
                              <div
                                className="w-8 h-1 bg-orange-500"
                                style={{ 
                                  outline: style.key === 'hidden' ? '2px solid transparent' : `1px ${style.value} currentColor`,
                                  outlineOffset: style.key === 'hidden' ? '2px' : '1px'
                                }}
                              />
                              <span className="text-xs">{style.name}</span>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Outline Offset */}
                      <div>
                        <div className="text-sm font-medium mb-2">Outline Offset</div>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                          {OUTLINE_OFFSETS.map(offset => (
                            <Button
                              key={offset.value}
                              variant={borderState[bp.key].outline.offset === offset.value ? "default" : "outline"}
                              size="sm"
                              onClick={() => updateOutlineOffset(offset.value)}
                              title={offset.description}
                              className="text-xs"
                            >
                              {offset.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
              
              {/* Tab Code por Breakpoint */}
              <TabsContent value="code" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">CSS para {bp.name} ({bp.minWidth}px+)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Switches para controlar propiedades de este breakpoint */}
                    <div>
                      <div className="text-sm font-medium mb-3">Propiedades para {bp.name}:</div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${bp.key}-border-radius`}
                            checked={includePropertiesByBreakpoint[bp.key].borderRadius}
                            onCheckedChange={(checked) => {
                              setIncludePropertiesByBreakpoint(prev => ({
                                ...prev,
                                [bp.key]: { ...prev[bp.key], borderRadius: checked }
                              }));
                              // Sync con global si es necesario
                              if (!checked && includeProperties.borderRadius) {
                                const allDisabled = BREAKPOINTS.every(b => 
                                  b.key === bp.key ? false : !includePropertiesByBreakpoint[b.key].borderRadius
                                );
                                if (allDisabled) {
                                  setIncludeProperties(prev => ({ ...prev, borderRadius: false }));
                                }
                              }
                            }}
                          />
                          <Label htmlFor={`${bp.key}-border-radius`} className="text-sm">Border Radius</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${bp.key}-border-width`}
                            checked={includePropertiesByBreakpoint[bp.key].borderWidth}
                            onCheckedChange={(checked) => {
                              setIncludePropertiesByBreakpoint(prev => ({
                                ...prev,
                                [bp.key]: { ...prev[bp.key], borderWidth: checked }
                              }));
                              // Sync con global si es necesario
                              if (!checked && includeProperties.borderWidth) {
                                const allDisabled = BREAKPOINTS.every(b => 
                                  b.key === bp.key ? false : !includePropertiesByBreakpoint[b.key].borderWidth
                                );
                                if (allDisabled) {
                                  setIncludeProperties(prev => ({ ...prev, borderWidth: false }));
                                }
                              }
                            }}
                          />
                          <Label htmlFor={`${bp.key}-border-width`} className="text-sm">Border Width</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${bp.key}-border-style`}
                            checked={includePropertiesByBreakpoint[bp.key].borderStyle}
                            onCheckedChange={(checked) => {
                              setIncludePropertiesByBreakpoint(prev => ({
                                ...prev,
                                [bp.key]: { ...prev[bp.key], borderStyle: checked }
                              }));
                              // Sync con global si es necesario
                              if (!checked && includeProperties.borderStyle) {
                                const allDisabled = BREAKPOINTS.every(b => 
                                  b.key === bp.key ? false : !includePropertiesByBreakpoint[b.key].borderStyle
                                );
                                if (allDisabled) {
                                  setIncludeProperties(prev => ({ ...prev, borderStyle: false }));
                                }
                              }
                            }}
                          />
                          <Label htmlFor={`${bp.key}-border-style`} className="text-sm">Border Style</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${bp.key}-border-color`}
                            checked={includePropertiesByBreakpoint[bp.key].borderColor}
                            onCheckedChange={(checked) => {
                              setIncludePropertiesByBreakpoint(prev => ({
                                ...prev,
                                [bp.key]: { ...prev[bp.key], borderColor: checked }
                              }));
                              // Sync con global si es necesario
                              if (!checked && includeProperties.borderColor) {
                                const allDisabled = BREAKPOINTS.every(b => 
                                  b.key === bp.key ? false : !includePropertiesByBreakpoint[b.key].borderColor
                                );
                                if (allDisabled) {
                                  setIncludeProperties(prev => ({ ...prev, borderColor: false }));
                                }
                              }
                            }}
                          />
                          <Label htmlFor={`${bp.key}-border-color`} className="text-sm">Border Color</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${bp.key}-outline-width`}
                            checked={includePropertiesByBreakpoint[bp.key].outlineWidth}
                            onCheckedChange={(checked) => {
                              setIncludePropertiesByBreakpoint(prev => ({
                                ...prev,
                                [bp.key]: { ...prev[bp.key], outlineWidth: checked }
                              }));
                              // Sync con global si es necesario
                              if (!checked && includeProperties.outlineWidth) {
                                const allDisabled = BREAKPOINTS.every(b => 
                                  b.key === bp.key ? false : !includePropertiesByBreakpoint[b.key].outlineWidth
                                );
                                if (allDisabled) {
                                  setIncludeProperties(prev => ({ ...prev, outlineWidth: false }));
                                }
                              }
                            }}
                          />
                          <Label htmlFor={`${bp.key}-outline-width`} className="text-sm">Outline Width</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${bp.key}-outline-style`}
                            checked={includePropertiesByBreakpoint[bp.key].outlineStyle}
                            onCheckedChange={(checked) => {
                              setIncludePropertiesByBreakpoint(prev => ({
                                ...prev,
                                [bp.key]: { ...prev[bp.key], outlineStyle: checked }
                              }));
                              // Sync con global si es necesario
                              if (!checked && includeProperties.outlineStyle) {
                                const allDisabled = BREAKPOINTS.every(b => 
                                  b.key === bp.key ? false : !includePropertiesByBreakpoint[b.key].outlineStyle
                                );
                                if (allDisabled) {
                                  setIncludeProperties(prev => ({ ...prev, outlineStyle: false }));
                                }
                              }
                            }}
                          />
                          <Label htmlFor={`${bp.key}-outline-style`} className="text-sm">Outline Style</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${bp.key}-outline-offset`}
                            checked={includePropertiesByBreakpoint[bp.key].outlineOffset}
                            onCheckedChange={(checked) => {
                              setIncludePropertiesByBreakpoint(prev => ({
                                ...prev,
                                [bp.key]: { ...prev[bp.key], outlineOffset: checked }
                              }));
                              // Sync con global si es necesario
                              if (!checked && includeProperties.outlineOffset) {
                                const allDisabled = BREAKPOINTS.every(b => 
                                  b.key === bp.key ? false : !includePropertiesByBreakpoint[b.key].outlineOffset
                                );
                                if (allDisabled) {
                                  setIncludeProperties(prev => ({ ...prev, outlineOffset: false }));
                                }
                              }
                            }}
                          />
                          <Label htmlFor={`${bp.key}-outline-offset`} className="text-sm">Outline Offset</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${bp.key}-outline-color`}
                            checked={includePropertiesByBreakpoint[bp.key].outlineColor}
                            onCheckedChange={(checked) => {
                              setIncludePropertiesByBreakpoint(prev => ({
                                ...prev,
                                [bp.key]: { ...prev[bp.key], outlineColor: checked }
                              }));
                              // Sync con global si es necesario
                              if (!checked && includeProperties.outlineColor) {
                                const allDisabled = BREAKPOINTS.every(b => 
                                  b.key === bp.key ? false : !includePropertiesByBreakpoint[b.key].outlineColor
                                );
                                if (allDisabled) {
                                  setIncludeProperties(prev => ({ ...prev, outlineColor: false }));
                                }
                              }
                            }}
                          />
                          <Label htmlFor={`${bp.key}-outline-color`} className="text-sm">Outline Color</Label>
                        </div>
                      </div>
                    </div>

                    {/* CSS Preview */}
                    <div className="bg-muted p-4 rounded text-xs font-mono space-y-1 max-h-96 overflow-y-auto">
                      {generateBreakpointCSS(bp.key)}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        ))}
        
        {/* Tab Code Global */}
        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Clases CSS Separadas por Propiedad - Todos los Breakpoints</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={exportBorderThemeCSS}>
                    <Download className="w-4 h-4 mr-1" />
                    Exportar border-themes.css
                  </Button>
                  <Button size="sm" onClick={() => onSave?.(borderState)}>
                    <Save className="w-4 h-4 mr-1" />
                    Guardar
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Switches para controlar qué breakpoints incluir */}
              <div>
                <div className="text-sm font-medium mb-3">Breakpoints a incluir:</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {BREAKPOINTS.map((bp) => {
                    const Icon = bp.icon;
                    return (
                      <div key={bp.key} className="flex items-center space-x-2">
                        <Switch
                          id={`bp-${bp.key}`}
                          checked={includeBreakpoints[bp.key]}
                          onCheckedChange={(checked) => 
                            setIncludeBreakpoints(prev => ({ ...prev, [bp.key]: checked }))
                          }
                        />
                        <Label htmlFor={`bp-${bp.key}`} className="text-sm flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {bp.name}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Switches para controlar qué propiedades incluir globalmente */}
              <div>
                <div className="text-sm font-medium mb-3">Propiedades globales a incluir:</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="border-radius"
                      checked={includeProperties.borderRadius}
                      onCheckedChange={(checked) => {
                        setIncludeProperties(prev => ({ ...prev, borderRadius: checked }));
                        // Sync con todos los breakpoints
                        if (checked) {
                          setIncludePropertiesByBreakpoint(prev => {
                            const newState = { ...prev };
                            BREAKPOINTS.forEach(bp => {
                              newState[bp.key] = { ...newState[bp.key], borderRadius: true };
                            });
                            return newState;
                          });
                        }
                      }}
                    />
                    <Label htmlFor="border-radius" className="text-sm">Border Radius</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="border-width"
                      checked={includeProperties.borderWidth}
                      onCheckedChange={(checked) => {
                        setIncludeProperties(prev => ({ ...prev, borderWidth: checked }));
                        // Sync con todos los breakpoints
                        if (checked) {
                          setIncludePropertiesByBreakpoint(prev => {
                            const newState = { ...prev };
                            BREAKPOINTS.forEach(bp => {
                              newState[bp.key] = { ...newState[bp.key], borderWidth: true };
                            });
                            return newState;
                          });
                        }
                      }}
                    />
                    <Label htmlFor="border-width" className="text-sm">Border Width</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="border-style"
                      checked={includeProperties.borderStyle}
                      onCheckedChange={(checked) => {
                        setIncludeProperties(prev => ({ ...prev, borderStyle: checked }));
                        // Sync con todos los breakpoints
                        if (checked) {
                          setIncludePropertiesByBreakpoint(prev => {
                            const newState = { ...prev };
                            BREAKPOINTS.forEach(bp => {
                              newState[bp.key] = { ...newState[bp.key], borderStyle: true };
                            });
                            return newState;
                          });
                        }
                      }}
                    />
                    <Label htmlFor="border-style" className="text-sm">Border Style</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="border-color"
                      checked={includeProperties.borderColor}
                      onCheckedChange={(checked) => {
                        setIncludeProperties(prev => ({ ...prev, borderColor: checked }));
                        // Sync con todos los breakpoints
                        if (checked) {
                          setIncludePropertiesByBreakpoint(prev => {
                            const newState = { ...prev };
                            BREAKPOINTS.forEach(bp => {
                              newState[bp.key] = { ...newState[bp.key], borderColor: true };
                            });
                            return newState;
                          });
                        }
                      }}
                    />
                    <Label htmlFor="border-color" className="text-sm">Border Color</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="outline-width"
                      checked={includeProperties.outlineWidth}
                      onCheckedChange={(checked) => {
                        setIncludeProperties(prev => ({ ...prev, outlineWidth: checked }));
                        // Sync con todos los breakpoints
                        if (checked) {
                          setIncludePropertiesByBreakpoint(prev => {
                            const newState = { ...prev };
                            BREAKPOINTS.forEach(bp => {
                              newState[bp.key] = { ...newState[bp.key], outlineWidth: true };
                            });
                            return newState;
                          });
                        }
                      }}
                    />
                    <Label htmlFor="outline-width" className="text-sm">Outline Width</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="outline-style"
                      checked={includeProperties.outlineStyle}
                      onCheckedChange={(checked) => {
                        setIncludeProperties(prev => ({ ...prev, outlineStyle: checked }));
                        // Sync con todos los breakpoints
                        if (checked) {
                          setIncludePropertiesByBreakpoint(prev => {
                            const newState = { ...prev };
                            BREAKPOINTS.forEach(bp => {
                              newState[bp.key] = { ...newState[bp.key], outlineStyle: true };
                            });
                            return newState;
                          });
                        }
                      }}
                    />
                    <Label htmlFor="outline-style" className="text-sm">Outline Style</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="outline-offset"
                      checked={includeProperties.outlineOffset}
                      onCheckedChange={(checked) => {
                        setIncludeProperties(prev => ({ ...prev, outlineOffset: checked }));
                        // Sync con todos los breakpoints
                        if (checked) {
                          setIncludePropertiesByBreakpoint(prev => {
                            const newState = { ...prev };
                            BREAKPOINTS.forEach(bp => {
                              newState[bp.key] = { ...newState[bp.key], outlineOffset: true };
                            });
                            return newState;
                          });
                        }
                      }}
                    />
                    <Label htmlFor="outline-offset" className="text-sm">Outline Offset</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="outline-color"
                      checked={includeProperties.outlineColor}
                      onCheckedChange={(checked) => {
                        setIncludeProperties(prev => ({ ...prev, outlineColor: checked }));
                        // Sync con todos los breakpoints
                        if (checked) {
                          setIncludePropertiesByBreakpoint(prev => {
                            const newState = { ...prev };
                            BREAKPOINTS.forEach(bp => {
                              newState[bp.key] = { ...newState[bp.key], outlineColor: true };
                            });
                            return newState;
                          });
                        }
                      }}
                    />
                    <Label htmlFor="outline-color" className="text-sm">Outline Color</Label>
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-muted-foreground">
                  <strong>Nota:</strong> Border Color y Outline Color requieren componentes de selección de color (pendientes de implementar).
                </div>
              </div>
              
              {/* CSS Preview Completo */}
              <div className="bg-muted p-4 rounded text-xs font-mono space-y-1 max-h-96 overflow-y-auto">
                {generateBorderThemeCSS()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Checkbox Radius Modal */}
      <CheckboxRadiusModal
        open={isCheckboxRadiusModalOpen}
        onOpenChange={setIsCheckboxRadiusModalOpen}
      />
    </div>
  );
};