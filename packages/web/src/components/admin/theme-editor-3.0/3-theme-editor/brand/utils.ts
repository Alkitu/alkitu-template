import { LogoModeConfig, LogoColorVariants } from './types';

// Utilidades para procesamiento de SVG

export const detectColorsFromSVG = (svgContent: string): string[] => {
  const colors = new Set<string>();
  
  // Expresiones regulares mejoradas para detectar diferentes formatos de colores
  const hexColorRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g;
  const rgbColorRegex = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g;
  const rgbaColorRegex = /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)/g;
  const hslColorRegex = /hsl\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/g;
  const namedColorRegex = /\b(red|blue|green|yellow|orange|purple|pink|brown|gray|grey|black|white|cyan|magenta|lime|navy|olive|teal|silver|maroon|aqua|fuchsia|darkred|darkblue|darkgreen|lightblue|lightgreen|lightgray|lightgrey|darkgray|darkgrey)\b/gi;
  
  // También buscar en atributos específicos
  const fillRegex = /fill\s*=\s*["']([^"']+)["']/g;
  const strokeRegex = /stroke\s*=\s*["']([^"']+)["']/g;
  const stopColorRegex = /stop-color\s*=\s*["']([^"']+)["']/g;
  const colorPropertyRegex = /color\s*:\s*([^;]+);/g;
  const fillPropertyRegex = /fill\s*:\s*([^;]+);/g;
  const strokePropertyRegex = /stroke\s*:\s*([^;]+);/g;
  
  // Función helper para convertir RGB a HEX
  const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).padStart(6, '0')}`;
  };
  
  // Función helper para convertir HSL a HEX
  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };
  
  // Detectar colores hexadecimales
  let match;
  while ((match = hexColorRegex.exec(svgContent)) !== null) {
    let hex = match[0].toLowerCase();
    // Convertir hex de 3 caracteres a 6
    if (hex.length === 4) {
      hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    colors.add(hex);
  }
  
  // Detectar colores RGB
  while ((match = rgbColorRegex.exec(svgContent)) !== null) {
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const hex = rgbToHex(r, g, b);
    colors.add(hex);
  }
  
  // Detectar colores RGBA (ignorar alpha por ahora)
  while ((match = rgbaColorRegex.exec(svgContent)) !== null) {
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const hex = rgbToHex(r, g, b);
    colors.add(hex);
  }
  
  // Detectar colores HSL
  while ((match = hslColorRegex.exec(svgContent)) !== null) {
    const h = parseInt(match[1]);
    const s = parseInt(match[2]);
    const l = parseInt(match[3]);
    const hex = hslToHex(h, s, l);
    colors.add(hex);
  }
  
  // Detectar colores en atributos fill
  while ((match = fillRegex.exec(svgContent)) !== null) {
    const colorValue = match[1];
    if (colorValue !== 'none' && colorValue !== 'transparent' && !colorValue.startsWith('url(')) {
      if (colorValue.startsWith('#')) {
        let hex = colorValue.toLowerCase();
        if (hex.length === 4) {
          hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
        }
        colors.add(hex);
      }
    }
  }
  
  // Detectar colores en atributos stroke
  while ((match = strokeRegex.exec(svgContent)) !== null) {
    const colorValue = match[1];
    if (colorValue !== 'none' && colorValue !== 'transparent' && !colorValue.startsWith('url(')) {
      if (colorValue.startsWith('#')) {
        let hex = colorValue.toLowerCase();
        if (hex.length === 4) {
          hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
        }
        colors.add(hex);
      }
    }
  }
  
  // Detectar colores en stop-color (gradientes)
  while ((match = stopColorRegex.exec(svgContent)) !== null) {
    const colorValue = match[1];
    if (colorValue.startsWith('#')) {
      let hex = colorValue.toLowerCase();
      if (hex.length === 4) {
        hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
      }
      colors.add(hex);
    }
  }
  
  // Detectar colores con nombres en atributos
  const namedColors: Record<string, string> = {
    'red': '#ff0000', 'blue': '#0000ff', 'green': '#008000', 'yellow': '#ffff00',
    'orange': '#ffa500', 'purple': '#800080', 'pink': '#ffc0cb', 'brown': '#a52a2a',
    'gray': '#808080', 'grey': '#808080', 'black': '#000000', 'white': '#ffffff',
    'cyan': '#00ffff', 'magenta': '#ff00ff', 'lime': '#00ff00', 'navy': '#000080',
    'olive': '#808000', 'teal': '#008080', 'silver': '#c0c0c0', 'maroon': '#800000',
    'aqua': '#00ffff', 'fuchsia': '#ff00ff', 'darkred': '#8b0000', 'darkblue': '#00008b',
    'darkgreen': '#006400', 'lightblue': '#add8e6', 'lightgreen': '#90ee90',
    'lightgray': '#d3d3d3', 'lightgrey': '#d3d3d3', 'darkgray': '#a9a9a9', 'darkgrey': '#a9a9a9'
  };
  
  // Buscar colores nombrados en atributos específicos
  Object.entries(namedColors).forEach(([name, hex]) => {
    const namedInAttrRegex = new RegExp(`(fill|stroke|stop-color|flood-color|color)\\s*=\\s*["']${name}["']`, 'gi');
    const namedInStyleRegex = new RegExp(`(fill|stroke|stop-color|flood-color|color)\\s*:\\s*${name}`, 'gi');
    
    if (namedInAttrRegex.test(svgContent) || namedInStyleRegex.test(svgContent)) {
      colors.add(hex);
    }
  });
  
  // Detectar colores en elementos <text> y <tspan>
  const textColorRegex = /<(text|tspan)[^>]*(?:fill|stroke|color)\s*=\s*["']([^"']+)["'][^>]*>/gi;
  while ((match = textColorRegex.exec(svgContent)) !== null) {
    const colorValue = match[2];
    if (colorValue.startsWith('#')) {
      let hex = colorValue.toLowerCase();
      if (hex.length === 4) {
        hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
      }
      colors.add(hex);
    } else if (namedColors[colorValue.toLowerCase()]) {
      colors.add(namedColors[colorValue.toLowerCase()]);
    }
  }
  
  // NO filtrar ningún color - devolver TODOS los detectados incluyendo negro y blanco
  const allColors = Array.from(colors);
  
  // Ordenar por frecuencia de aparición (colores más usados primero)
  const colorFrequency = new Map<string, number>();
  allColors.forEach(color => {
    const frequency = (svgContent.match(new RegExp(color.replace('#', '#?'), 'gi')) || []).length;
    colorFrequency.set(color, frequency);
  });
  
  return allColors.sort((a, b) => (colorFrequency.get(b) || 0) - (colorFrequency.get(a) || 0));
};

export const generateColorVariants = (svgContent: string, detectedColors: string[], monoColor: string = '#000000', isDarkMode: boolean = false) => {
  // Normalizar el SVG original primero
  const normalizedOriginal = normalizeSVGForContainer(svgContent);
  
  const variants = {
    original: normalizedOriginal,
    white: '',
    black: '',
    gray: ''
  };
  
  // Generar versión "Negativo" - adaptativa según el tema
  // En modo light: usa blanco / En modo dark: usa negro
  const negativeColor = isDarkMode ? '#000000' : '#ffffff';
  variants.white = replaceColorsInSVG(normalizedOriginal, detectedColors, negativeColor);
  
  // Generar versión mono-color (usa el color primary del tema actual)
  variants.black = replaceColorsInSVG(normalizedOriginal, detectedColors, monoColor);
  
  // Generar versión en gris (reemplazar TODOS los colores detectados con un gris más claro)
  variants.gray = replaceColorsInSVG(normalizedOriginal, detectedColors, '#d1d5db');
  
  return variants;
};

const replaceColorsInSVG = (svgContent: string, originalColors: string[], newColor: string): string => {
  let result = svgContent;
  
  // Si estamos reemplazando con blanco, negro o gris, asegurarnos de reemplazar TODOS los colores
  const isMonochrome = newColor === '#ffffff' || newColor === '#000000' || newColor === '#808080';
  
  originalColors.forEach(color => {
    // Preparar el color para búsqueda (escapar caracteres especiales)
    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Normalizar el color a minúsculas para comparación
    const colorLower = color.toLowerCase();
    const newColorFormatted = newColor.toLowerCase();
    
    // 1. Reemplazar en TODOS los atributos posibles (no solo fill/stroke)
    // Buscar el color en cualquier atributo que pueda contener colores
    const attributeNames = [
      'fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color',
      'color', 'background-color', 'border-color', 'outline-color',
      'text-decoration-color', 'column-rule-color'
    ];
    
    // Reemplazar el color hex completo (#ffffff)
    const hexRegex = new RegExp(escapeRegex(colorLower), 'gi');
    result = result.replace(hexRegex, newColor);
    
    // También buscar variaciones de caso
    const hexRegexCase = new RegExp(escapeRegex(color), 'g');
    result = result.replace(hexRegexCase, newColor);
    
    // 2. Reemplazar en atributos sin #
    if (color.startsWith('#')) {
      const colorWithoutHash = color.substring(1);
      const colorWithoutHashLower = colorWithoutHash.toLowerCase();
      
      // En cualquier atributo
      attributeNames.forEach(attr => {
        // Formato: fill="#ffffff" o fill="#FFFFFF"
        const attrWithHashRegex = new RegExp(`(${attr})\\s*=\\s*["']${escapeRegex(color)}["']`, 'gi');
        result = result.replace(attrWithHashRegex, `$1="${newColor}"`);
        
        // Formato: fill="ffffff" o fill="FFFFFF"
        const attrNoHashRegex = new RegExp(`(${attr})\\s*=\\s*["']${escapeRegex(colorWithoutHash)}["']`, 'gi');
        result = result.replace(attrNoHashRegex, `$1="${newColor.substring(1)}"`);
        
        // En estilos inline: style="fill:#ffffff" o style="fill:ffffff"
        const styleWithHashRegex = new RegExp(`(${attr})\\s*:\\s*${escapeRegex(color)}`, 'gi');
        result = result.replace(styleWithHashRegex, `$1:${newColor}`);
        
        const styleNoHashRegex = new RegExp(`(${attr})\\s*:\\s*${escapeRegex(colorWithoutHash)}`, 'gi');
        result = result.replace(styleNoHashRegex, `$1:${newColor.substring(1)}`);
      });
    }
    
    // 3. Reemplazar colores nombrados (black, white, etc.)
    // Convertir colores comunes a sus nombres si coinciden
    const colorNames: Record<string, string[]> = {
      '#000000': ['black', '#000'],
      '#ffffff': ['white', '#fff'],
      '#ff0000': ['red', '#f00'],
      '#00ff00': ['lime', '#0f0'],
      '#0000ff': ['blue', '#00f'],
      '#808080': ['gray', 'grey'],
    };
    
    // Si el color coincide con un color nombrado, reemplazar también el nombre
    Object.entries(colorNames).forEach(([hex, names]) => {
      if (colorLower === hex || names.some(n => `#${n}` === colorLower)) {
        names.forEach(name => {
          // Reemplazar en atributos
          attributeNames.forEach(attr => {
            const namedAttrRegex = new RegExp(`(${attr})\\s*=\\s*["']${name}["']`, 'gi');
            result = result.replace(namedAttrRegex, `$1="${newColor}"`);
            
            const namedStyleRegex = new RegExp(`(${attr})\\s*:\\s*${name}`, 'gi');
            result = result.replace(namedStyleRegex, `$1:${newColor}`);
          });
        });
      }
    });
    
    // 4. Reemplazar en elementos <text> y <tspan> que pueden tener color directo
    // Buscar en style attributes dentro de text elements
    const textStyleRegex = new RegExp(`(<text[^>]*style="[^"]*)(fill|stroke|color)\\s*:\\s*${escapeRegex(color)}([^"]*")`, 'gi');
    result = result.replace(textStyleRegex, `$1$2:${newColor}$3`);
    
    // 5. Reemplazar formato corto de 3 caracteres
    if (color.length === 7) { // #RRGGBB
      // Verificar si se puede acortar a 3 caracteres
      if (color[1] === color[2] && color[3] === color[4] && color[5] === color[6]) {
        const shortHex = `#${color[1]}${color[3]}${color[5]}`.toLowerCase();
        const shortRegex = new RegExp(escapeRegex(shortHex), 'gi');
        result = result.replace(shortRegex, newColor);
      }
    }
  });
  
  return result;
};

export const replaceColorInSVG = (svgContent: string, oldColor: string, newColor: string): string => {
  // Solo reemplazar el color, no re-normalizar si ya está normalizado
  let result = svgContent;
  
  // Hacer el reemplazo más agresivo para asegurar que funcione
  const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Lista de todas las posibles formas en que puede aparecer el color
  const variations = [];
  
  // Agregar el color original
  variations.push(oldColor);
  variations.push(oldColor.toLowerCase());
  variations.push(oldColor.toUpperCase());
  
  // Si es hex, agregar variaciones sin #
  if (oldColor.startsWith('#')) {
    const withoutHash = oldColor.substring(1);
    variations.push(withoutHash);
    variations.push(withoutHash.toLowerCase());
    variations.push(withoutHash.toUpperCase());
    
    // Si es formato largo, agregar formato corto
    if (oldColor.length === 7 && oldColor[1] === oldColor[2] && oldColor[3] === oldColor[4] && oldColor[5] === oldColor[6]) {
      const shortForm = `#${oldColor[1]}${oldColor[3]}${oldColor[5]}`;
      variations.push(shortForm);
      variations.push(shortForm.toLowerCase());
      variations.push(shortForm.toUpperCase());
    }
  }
  
  // Mapeo de colores especiales
  const specialColors: Record<string, string[]> = {
    '#000000': ['black', '#000', '000000', '000'],
    '#ffffff': ['white', '#fff', 'ffffff', 'fff'],
    '#ff0000': ['red', '#f00', 'ff0000', 'f00'],
    '#00ff00': ['lime', '#0f0', '00ff00', '0f0'],
    '#0000ff': ['blue', '#00f', '0000ff', '00f'],
  };
  
  // Agregar nombres de colores si aplica
  const oldColorLower = oldColor.toLowerCase();
  if (specialColors[oldColorLower]) {
    variations.push(...specialColors[oldColorLower]);
  }
  
  // Reemplazar todas las variaciones
  variations.forEach(variant => {
    // Reemplazo global sin importar el contexto
    const regex = new RegExp(escapeRegex(variant), 'gi');
    result = result.replace(regex, (match) => {
      // Preservar el formato (si venía sin #, devolver sin #)
      if (!variant.includes('#') && newColor.startsWith('#')) {
        return newColor.substring(1);
      }
      return newColor;
    });
  });
  
  
  // Si el SVG no tiene width="100%" entonces normalizarlo
  if (!result.includes('width="100%"')) {
    return normalizeSVGForContainer(result);
  }
  return result;
};

export const extractSVGMetadata = (svgContent: string, fileName: string): {
  fileName: string;
  fileSize: string;
  dimensions: string;
  viewBox: string;
  colorCount: number;
  hasGradients: boolean;
} => {
  // Calcular tamaño aproximado del archivo
  const fileSize = `${(new Blob([svgContent]).size / 1024).toFixed(1)} KB`;
  
  // Extraer dimensiones
  const svgMatch = svgContent.match(/<svg[^>]*>/i);
  let dimensions = 'Auto';
  if (svgMatch) {
    const widthMatch = svgMatch[0].match(/width\s*=\s*["']([^"']*)["']/i);
    const heightMatch = svgMatch[0].match(/height\s*=\s*["']([^"']*)["']/i);
    if (widthMatch && heightMatch) {
      dimensions = `${widthMatch[1]} × ${heightMatch[1]}`;
    }
  }
  
  // Extraer viewBox
  let viewBox = 'None';
  if (svgMatch) {
    const viewBoxMatch = svgMatch[0].match(/viewBox\s*=\s*["']([^"']*)["']/i);
    if (viewBoxMatch) {
      viewBox = viewBoxMatch[1];
    }
  }
  
  // Contar colores
  const detectedColors = detectColorsFromSVG(svgContent);
  const colorCount = detectedColors.length;
  
  // Detectar gradientes
  const hasGradients = svgContent.includes('<gradient') || svgContent.includes('<linearGradient') || svgContent.includes('<radialGradient');
  
  return {
    fileName,
    fileSize,
    dimensions,
    viewBox,
    colorCount,
    hasGradients
  };
};

export const validateAspectRatio = (file: File, expectedRatio: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const actualRatio = img.width / img.height;
      const [expectedW, expectedH] = expectedRatio.split(':').map(Number);
      const expectedRatioValue = expectedW / expectedH;
      
      // Permitir una tolerancia del 10%
      const tolerance = 0.1;
      const isValid = Math.abs(actualRatio - expectedRatioValue) <= tolerance;
      
      resolve(isValid);
    };
    
    img.onerror = () => resolve(false);
    
    // Convertir SVG a data URL para poder cargar en Image
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const readSVGContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const normalizedContent = normalizeSVGForContainer(content);
      resolve(normalizedContent);
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

export const normalizeSVGForContainer = (svgContent: string): string => {
  // Normalizar el SVG para que se ajuste al contenedor
  let normalizedSVG = svgContent;
  
  // Buscar el tag svg y sus atributos
  const svgTagRegex = /<svg([^>]*)>/i;
  const match = normalizedSVG.match(svgTagRegex);
  
  if (match) {
    let svgAttributes = match[1];
    
    // Eliminar atributos de width y height fijos
    svgAttributes = svgAttributes.replace(/\s*width\s*=\s*["'][^"']*["']/gi, '');
    svgAttributes = svgAttributes.replace(/\s*height\s*=\s*["'][^"']*["']/gi, '');
    
    // Asegurar que tenga viewBox si no lo tiene
    if (!svgAttributes.includes('viewBox')) {
      // Si no tiene viewBox, intentar extraerlo de width/height originales
      const originalSvg = svgContent.match(/<svg([^>]*)>/i)?.[1] || '';
      const widthMatch = originalSvg.match(/width\s*=\s*["']([^"']*)["']/i);
      const heightMatch = originalSvg.match(/height\s*=\s*["']([^"']*)["']/i);
      
      if (widthMatch && heightMatch) {
        const width = parseFloat(widthMatch[1]);
        const height = parseFloat(heightMatch[1]);
        if (!isNaN(width) && !isNaN(height)) {
          svgAttributes += ` viewBox="0 0 ${width} ${height}"`;
        }
      } else {
        // ViewBox por defecto si no se puede determinar
        svgAttributes += ` viewBox="0 0 100 100"`;
      }
    }
    
    // Añadir atributos para que se ajuste al contenedor
    svgAttributes += ` width="100%" height="100%" preserveAspectRatio="xMidYMid meet"`;
    
    // Reemplazar el tag svg original
    normalizedSVG = normalizedSVG.replace(svgTagRegex, `<svg${svgAttributes}>`);
  }
  
  return normalizedSVG;
};

// Funciones helper para configuraciones de modo

// Función helper para crear configuración por defecto de un modo
export const createDefaultModeConfig = (svgContent: string, detectedColors: string[], monoColor: string, isDarkMode: boolean): LogoModeConfig => {
  return {
    variants: generateColorVariants(svgContent, detectedColors, monoColor, isDarkMode),
    monoColor,
    isLinkedToPrimary: true
  };
};

// Función para obtener las variantes de color según el modo actual
export const getCurrentModeVariants = (logo: LogoVariant, isDarkMode: boolean): LogoColorVariants => {
  // Usar ÚNICAMENTE la configuración específica del modo
  return isDarkMode ? logo.darkMode.variants : logo.lightMode.variants;
};

// Función para obtener el mono-color según el modo actual
export const getCurrentModeMonoColor = (logo: LogoVariant, isDarkMode: boolean): string => {
  return isDarkMode ? logo.darkMode.monoColor : logo.lightMode.monoColor;
};

// Función para obtener el estado de vinculación según el modo actual
export const getCurrentModeIsLinked = (logo: LogoVariant, isDarkMode: boolean): boolean => {
  return isDarkMode ? logo.darkMode.isLinkedToPrimary : logo.lightMode.isLinkedToPrimary;
};