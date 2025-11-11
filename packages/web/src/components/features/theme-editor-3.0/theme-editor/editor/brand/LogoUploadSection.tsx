'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Card } from '../../../design-system/primitives/card';
import { Button } from '../../../design-system/primitives/Button';
import { Label } from '../../../design-system/primitives/label';
import { Badge } from '../../../design-system/primitives/badge';
import { Upload, X, AlertCircle, Info, RotateCcw, Lock, Unlock, Moon } from 'lucide-react';
import { LogoVariant } from './types';
import { detectColorsFromSVG, generateColorVariants, validateAspectRatio, readSVGContent, replaceColorInSVG, extractSVGMetadata, createDefaultModeConfig as createDefaultModeConfigUtil } from './utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../design-system/primitives/accordion';
import { Input } from '../../../design-system/primitives/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../design-system/primitives/tooltip';
import { HsvColorPicker } from '../colors/HsvColorPicker';
import { ColorToken } from '../../../core/types/theme.types';
import { updateColorTokenFromHex } from '../../../lib/utils/color/color-conversions-v2';
import { useThemeEditor } from '../../../core/context/ThemeEditorContext';

interface LogoUploadSectionProps {
  title: string;
  type: 'icon' | 'horizontal' | 'vertical';
  aspectRatio: string;
  instructions: string;
  logo: LogoVariant | null;
  onLogoChange: (logo: LogoVariant | null) => void;
  className?: string;
}

export function LogoUploadSection({
  title,
  type,
  aspectRatio,
  instructions,
  logo,
  onLogoChange,
  className = ""
}: LogoUploadSectionProps) {
  const { state } = useThemeEditor();
  const isDarkMode = state.themeMode === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const darkModeFileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingDarkMode, setIsUploadingDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado interno simplificado - ÚNICA FUENTE DE VERDAD
  const createDefaultModeConfig = (monoColor: string, isDark: boolean) => ({
    monoColor,
    isLinkedToPrimary: true,
    variants: {
      original: '',
      white: '',
      black: '',
      gray: ''
    }
  });

  const currentModeConfig = logo ? 
    (isDarkMode ? logo.darkMode : logo.lightMode) : 
    createDefaultModeConfig(state.currentTheme.colors.primary.hex, isDarkMode);

  const currentMonoColor = currentModeConfig.monoColor;
  const currentIsLinked = currentModeConfig.isLinkedToPrimary;
  const currentVariants = currentModeConfig.variants;

  // Función para actualizar SOLO la configuración del modo actual
  const updateCurrentModeConfig = (newColor: string, isManualChange: boolean = false) => {
    if (!logo) return;
    
    const updatedLogo = { ...logo };
    const newModeConfig = {
      monoColor: newColor,
      isLinkedToPrimary: !isManualChange,
      variants: generateColorVariants(logo.svgContent, logo.detectedColors, newColor, isDarkMode)
    };
    
    // ACTUALIZAR SOLO EL MODO ACTUAL - El otro modo queda intacto
    if (isDarkMode) {
      updatedLogo.darkMode = newModeConfig;
      // ✅ lightMode queda intacto
    } else {
      updatedLogo.lightMode = newModeConfig;
      // ✅ darkMode queda intacto
    }
    
    onLogoChange(updatedLogo);
  };

  // Función para re-vincular el modo actual a primary
  const handleLinkToPrimary = () => {
    const primaryColor = state.currentTheme.colors.primary.hex;
    updateCurrentModeConfig(primaryColor, false);
  };

  // Efecto para sincronizar con primary cuando cambie el tema (solo si está vinculado)
  useEffect(() => {
    if (logo && currentIsLinked) {
      const primaryColor = state.currentTheme.colors.primary.hex;
      if (primaryColor !== currentMonoColor) {
        updateCurrentModeConfig(primaryColor, false);
      }
    }
  }, [state.currentTheme.colors.primary.hex, isDarkMode]);
  const [colorPicker, setColorPicker] = useState<{
    isOpen: boolean;
    colorIndex: number;
    originalColor: string;
    currentColor: string;
  }>({
    isOpen: false,
    colorIndex: -1,
    originalColor: '#000000',
    currentColor: '#000000'
  });

  const [colorToken, setColorToken] = useState<ColorToken>(() => ({
    name: 'brand-color',
    hex: '#000000',
    value: '#000000',
    oklch: { l: 0, c: 0, h: 0 },
    oklchString: 'oklch(0 0 0)',
    rgb: { r: 0, g: 0, b: 0 },
    hsv: { h: 0, s: 0, v: 0 }
  }));

  // Usar el mono-color global en lugar del local

  const handleFileSelect = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      // Validar que es SVG
      if (!file.type.includes('svg')) {
        throw new Error('Solo se aceptan archivos SVG');
      }

      // Nota: No validamos aspect ratio, el contenedor se ajustará automáticamente

      // Leer contenido del SVG
      const svgContent = await readSVGContent(file);
      
      // Detectar colores
      const detectedColors = detectColorsFromSVG(svgContent);
      
      // Extraer metadatos
      const metadata = extractSVGMetadata(svgContent, file.name);

      // Crear configuraciones para light y dark mode usando primary color
      const primaryColor = state.currentTheme.colors.primary.hex;
      const lightModeConfig = createDefaultModeConfigUtil(svgContent, detectedColors, primaryColor, false);
      const darkModeConfig = createDefaultModeConfigUtil(svgContent, detectedColors, primaryColor, true);

      // Crear LogoVariant con nueva estructura
      const logoVariant: LogoVariant = {
        id: `${type}_${Date.now()}`,
        name: file.name,
        type,
        aspectRatio,
        svgContent,
        detectedColors,
        lightMode: lightModeConfig,
        darkMode: darkModeConfig,
        metadata
      };

      onLogoChange(logoVariant);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el archivo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeLogo = () => {
    onLogoChange(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (darkModeFileInputRef.current) {
      darkModeFileInputRef.current.value = '';
    }
  };

  // Nueva función para cargar logo específico para modo oscuro
  const handleDarkModeFileSelect = async (file: File) => {
    if (!logo) return; // Solo se puede cargar modo oscuro si ya hay un logo base
    
    setError(null);
    setIsUploadingDarkMode(true);

    try {
      // Validar que es SVG
      if (!file.type.includes('svg')) {
        throw new Error('Solo se aceptan archivos SVG');
      }

      // Leer contenido
      const svgContent = await readSVGContent(file);
      
      // Validar aspect ratio (debe ser similar al logo original)
      if (!validateAspectRatio(svgContent, aspectRatio)) {
        throw new Error(`El archivo debe mantener la proporción ${aspectRatio} para ${type}`);
      }

      // Detectar colores
      const detectedColors = detectColorsFromSVG(svgContent);
      const metadata = extractSVGMetadata(svgContent, file.name);

      // Crear variantes de color para el logo modo oscuro
      const primaryColor = state.currentTheme.colors.primary.hex;
      const variants = generateColorVariants(svgContent, detectedColors, primaryColor, true);

      // Actualizar el logo existente con la versión modo oscuro
      const updatedLogo: LogoVariant = {
        ...logo,
        darkModeVersion: {
          svgContent,
          variants,
          metadata
        }
      };

      onLogoChange(updatedLogo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el archivo para modo oscuro');
    } finally {
      setIsUploadingDarkMode(false);
    }
  };

  const handleDarkModeFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleDarkModeFileSelect(files[0]);
    }
  };

  const removeDarkModeVersion = () => {
    if (!logo) return;
    
    const updatedLogo: LogoVariant = {
      ...logo,
      darkModeVersion: undefined
    };
    
    onLogoChange(updatedLogo);
    if (darkModeFileInputRef.current) {
      darkModeFileInputRef.current.value = '';
    }
  };

  const openColorPicker = (colorIndex: number, currentColor: string) => {
    // Inicializar el colorToken con el color actual
    const initialToken: ColorToken = {
      name: 'brand-color',
      hex: currentColor,
      value: currentColor,
      oklch: { l: 0, c: 0, h: 0 },
      oklchString: 'oklch(0 0 0)',
      rgb: { r: 0, g: 0, b: 0 },
      hsv: { h: 0, s: 0, v: 0 }
    };
    const updatedToken = updateColorTokenFromHex(initialToken, currentColor);
    setColorToken(updatedToken);

    setColorPicker({
      isOpen: true,
      colorIndex,
      originalColor: currentColor,
      currentColor
    });
  };

  const handleColorPickerChange = (newColorToken: ColorToken) => {
    setColorToken(newColorToken);
    setColorPicker(prev => ({ ...prev, currentColor: newColorToken.hex }));
  };

  const acceptColorChange = () => {
    if (!logo) return;

    const { colorIndex, currentColor } = colorPicker;
    const oldColor = logo.detectedColors[colorIndex];
    
    // Asegurarse de que tenemos un color válido en formato hex
    let finalColor = currentColor && currentColor !== '' ? currentColor : oldColor;
    
    // Asegurar que el color está en formato hex válido
    if (!finalColor.startsWith('#')) {
      finalColor = '#' + finalColor;
    }
    
    // Completar a 7 caracteres si es necesario
    if (finalColor.length === 4) {
      finalColor = `#${finalColor[1]}${finalColor[1]}${finalColor[2]}${finalColor[2]}${finalColor[3]}${finalColor[3]}`;
    }
    
    
    // COLOR_REPLACEMENT: Reemplazar color en SVG original
    let newSvgContent = logo.svgContent;
    
    // Reemplazar el color específico
    newSvgContent = newSvgContent.split(oldColor).join(finalColor);
    newSvgContent = newSvgContent.split(oldColor.toUpperCase()).join(finalColor);
    newSvgContent = newSvgContent.split(oldColor.toLowerCase()).join(finalColor);
    
    // Si el color es negro o blanco, también reemplazar sus variantes
    if (oldColor === '#000000' || oldColor === '#000') {
      newSvgContent = newSvgContent.split('black').join(finalColor);
      newSvgContent = newSvgContent.split('#000').join(finalColor);
      newSvgContent = newSvgContent.split('000000').join(finalColor.substring(1));
    }
    if (oldColor === '#ffffff' || oldColor === '#fff') {
      newSvgContent = newSvgContent.split('white').join(finalColor);
      newSvgContent = newSvgContent.split('#fff').join(finalColor);
      newSvgContent = newSvgContent.split('ffffff').join(finalColor.substring(1));
    }
    
    // UPDATE_DETECTED_COLORS: Actualizar lista de colores detectados
    const newDetectedColors = [...logo.detectedColors];
    newDetectedColors[colorIndex] = finalColor;

    // REGENERATE_VARIANTS: Regenerar configuraciones para ambos modos
    const primaryColor = state.currentTheme.colors.primary.hex;
    const updatedLogo: LogoVariant = {
      ...logo,
      svgContent: newSvgContent,
      detectedColors: newDetectedColors,
      lightMode: {
        ...logo.lightMode,
        variants: generateColorVariants(newSvgContent, newDetectedColors, logo.lightMode.monoColor, false)
      },
      darkMode: {
        ...logo.darkMode,
        variants: generateColorVariants(newSvgContent, newDetectedColors, logo.darkMode.monoColor, true)
      },
      metadata: extractSVGMetadata(newSvgContent, logo.name)
    };

    onLogoChange(updatedLogo);
    closeColorPicker();
  };

  const cancelColorChange = () => {
    closeColorPicker();
  };

  const closeColorPicker = () => {
    setColorPicker({
      isOpen: false,
      colorIndex: -1,
      originalColor: '#000000',
      currentColor: '#000000'
    });
  };

  // Función para obtener el SVG correcto según el modo actual
  const getCurrentSvgContent = (): string => {
    if (!logo) return '';
    
    // Si está en modo oscuro y existe una versión específica para modo oscuro, usarla
    if (isDarkMode && logo.darkModeVersion?.svgContent) {
      return logo.darkModeVersion.svgContent;
    }
    
    // Caso contrario, usar el logo original
    return logo.svgContent;
  };

  return (
    <>
      <div className={`flex flex-col gap-4 w-full items-center ${className}`}>
        
        {!logo ? (
          /* UPLOAD_STATE - Estado inicial para subir archivos */
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors relative outline outline-1 outline-muted flex flex-col items-center justify-center
              ${type === 'icon' ? 'aspect-[1/1] w-full max-w-[240px] h-auto' : type === 'horizontal' ? 'aspect-[3/1] w-full max-w-[360px] h-auto' : 'aspect-[1/2] w-full max-w-[180px] h-auto'}
              ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
              min-h-[120px] sm:min-h-[140px]
            `}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center h-full w-full p-2">
              <Upload className="h-6 w-6 sm:h-8 sm:w-8 mb-2 text-muted-foreground flex-shrink-0" />
              <p style={{
                fontFamily: 'var(--typography-emphasis-font-family)',
                fontSize: 'var(--typography-emphasis-font-size)',
                fontWeight: 'var(--typography-emphasis-font-weight)',
                letterSpacing: 'var(--typography-emphasis-letter-spacing)'
              }} className="text-foreground mb-1 text-center text-sm sm:text-base">
                {isUploading ? 'Procesando...' : 'Arrastra tu SVG aquí'}
              </p>
              <p style={{
                fontFamily: 'var(--typography-paragraph-font-family)',
                fontSize: 'var(--typography-paragraph-font-size)',
                fontWeight: 'var(--typography-paragraph-font-weight)',
                lineHeight: 'var(--typography-paragraph-line-height)',
                letterSpacing: 'var(--typography-paragraph-letter-spacing)'
              }} className="text-muted-foreground text-center text-xs sm:text-sm">
                o haz clic para seleccionar
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,image/svg+xml"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isUploading}
            />
          </div>
        ) : (
          /* PREVIEW_STATE - Estado con logo subido */
          <>
            {/* LOGO_CONTAINER_WITH_INFO_AND_ACTIONS */}
            <div className="relative w-full flex justify-center">
              <div 
                className={`
                  bg-muted/10 border rounded-lg p-4 relative overflow-hidden outline outline-1 outline-muted flex items-center justify-center
                  ${type === 'icon' ? 'aspect-[1/1] w-full max-w-[240px] h-auto' : type === 'horizontal' ? 'aspect-[3/1] w-full max-w-[360px] h-auto' : 'aspect-[1/2] w-full max-w-[180px] h-auto'}
                  min-h-[120px] sm:min-h-[140px]
                `}
              >
                <div 
                  dangerouslySetInnerHTML={{ __html: getCurrentSvgContent() }}
                  className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:object-contain"
                />
              </div>
              
              {/* INFO_ICON */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute top-2 right-2 text-muted-foreground hover:text-foreground bg-background/80 backdrop-blur-sm h-8 w-8 p-0 rounded-full"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-card border border-border p-3 max-w-xs">
                    <div className="space-y-2">
                      <p style={{
                        fontFamily: 'var(--typography-emphasis-font-family)',
                        fontSize: 'var(--typography-emphasis-font-size)',
                        fontWeight: 'var(--typography-emphasis-font-weight)',
                        letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                      }} className="text-foreground font-medium">{logo.metadata.fileName}</p>
                      <div className="space-y-1 text-xs">
                        <p style={{
                          fontFamily: 'var(--typography-paragraph-font-family)',
                          fontSize: 'var(--typography-paragraph-font-size)',
                          fontWeight: 'var(--typography-paragraph-font-weight)',
                          letterSpacing: 'var(--typography-paragraph-letter-spacing)'
                        }} className="text-muted-foreground">
                          <span className="text-foreground">Tamaño:</span> {logo.metadata.fileSize}
                        </p>
                        <p style={{
                          fontFamily: 'var(--typography-paragraph-font-family)',
                          fontSize: 'var(--typography-paragraph-font-size)',
                          fontWeight: 'var(--typography-paragraph-font-weight)',
                          letterSpacing: 'var(--typography-paragraph-letter-spacing)'
                        }} className="text-muted-foreground">
                          <span className="text-foreground">Dimensiones:</span> {logo.metadata.dimensions}
                        </p>
                        <p style={{
                          fontFamily: 'var(--typography-paragraph-font-family)',
                          fontSize: 'var(--typography-paragraph-font-size)',
                          fontWeight: 'var(--typography-paragraph-font-weight)',
                          letterSpacing: 'var(--typography-paragraph-letter-spacing)'
                        }} className="text-muted-foreground">
                          <span className="text-foreground">Colores:</span> {logo.metadata.colorCount}
                        </p>
                        {logo.metadata.hasGradients && (
                          <p style={{
                            fontFamily: 'var(--typography-paragraph-font-family)',
                            fontSize: 'var(--typography-paragraph-font-size)',
                            fontWeight: 'var(--typography-paragraph-font-weight)',
                            letterSpacing: 'var(--typography-paragraph-letter-spacing)'
                          }} className="text-primary">✨ Contiene gradientes</p>
                        )}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* REPLACE_IMAGE_LINK */}
            <div className="flex flex-col items-center gap-1 mt-2 w-full">
              <button
                onClick={removeLogo}
                style={{
                  fontFamily: 'var(--typography-emphasis-font-family)',
                  fontSize: 'var(--typography-emphasis-font-size)',
                  fontWeight: 'var(--typography-emphasis-font-weight)',
                  letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                }}
                className="text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-none p-2 text-sm sm:text-base"
              >
                Cambiar imagen
              </button>
              
              {/* DARK MODE UPLOAD BUTTON - Solo visible en modo oscuro */}
              {isDarkMode && (
                <div className="flex flex-col items-center gap-1">
                  {!logo.darkModeVersion ? (
                    <button
                      onClick={() => darkModeFileInputRef.current?.click()}
                      disabled={isUploadingDarkMode}
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none p-1 text-xs"
                      style={{
                        fontFamily: 'var(--typography-paragraph-font-family)',
                        fontSize: 'var(--typography-paragraph-font-size)',
                        fontWeight: 'var(--typography-paragraph-font-weight)',
                        letterSpacing: 'var(--typography-paragraph-letter-spacing)'
                      }}
                    >
                      <Moon className="h-3 w-3" />
                      {isUploadingDarkMode ? 'Cargando...' : 'Subir modo oscuro'}
                    </button>
                  ) : (
                    <button
                      onClick={removeDarkModeVersion}
                      className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer bg-transparent border-none p-1 text-xs"
                      style={{
                        fontFamily: 'var(--typography-paragraph-font-family)',
                        fontSize: 'var(--typography-paragraph-font-size)',
                        fontWeight: 'var(--typography-paragraph-font-weight)',
                        letterSpacing: 'var(--typography-paragraph-letter-spacing)'
                      }}
                    >
                      <X className="h-3 w-3" />
                      Remover modo oscuro
                    </button>
                  )}
                  
                  {/* Hidden file input for dark mode */}
                  <input
                    ref={darkModeFileInputRef}
                    type="file"
                    accept=".svg,image/svg+xml"
                    onChange={handleDarkModeFileInputChange}
                    className="hidden"
                    disabled={isUploadingDarkMode}
                  />
                </div>
              )}
            </div>

            {/* DETECTED_COLORS_CIRCLES */}
            {logo.detectedColors.length > 0 && (
              <div className="flex justify-center mt-4 w-full">
                <div className="flex gap-2 flex-wrap justify-center max-w-full">
                  {logo.detectedColors.map((color, index) => (
                    <Button
                      key={`${logo.id}-color-${index}`}
                      variant="ghost"
                      size="sm"
                      className="w-7 h-7 sm:w-8 sm:h-8 p-0 rounded-full border-2 border-border hover:border-primary transition-colors hover:scale-110 flex-shrink-0"
                      style={{ backgroundColor: color }}
                      onClick={() => openColorPicker(index, color)}
                      title={`Editar color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* MONO_COLOR_SELECTOR */}
            {logo && (
              <div className="mt-4 pt-4 border-t border-border w-full">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {/* CLICKABLE_MONO_COLOR_PILL */}
                  <div className="relative flex-shrink-0">
                    <Badge 
                      variant="secondary" 
                      className="flex items-center gap-2 px-3 py-1 cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => document.getElementById(`mono-color-picker-${type}`)?.click()}
                    >
                      <div 
                        className="w-3 h-3 rounded-full border border-border"
                        style={{ backgroundColor: currentMonoColor }}
                      />
                      <span style={{
                        fontFamily: 'var(--typography-emphasis-font-family)',
                        fontSize: 'var(--typography-emphasis-font-size)',
                        fontWeight: 'var(--typography-emphasis-font-weight)',
                        letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                      }} className="text-xs">
                        Mono-Color
                      </span>
                    </Badge>
                    
                    {/* HIDDEN_COLOR_PICKER_INPUT */}
                    <input
                      id={`mono-color-picker-${type}`}
                      type="color"
                      value={currentMonoColor}
                      onChange={(e) => {
                        const newMonoColor = e.target.value;
                        // Usar handler específico para el modo actual
                        updateCurrentModeConfig(newMonoColor, true);
                      }}
                      className="absolute opacity-0 pointer-events-none"
                      title={`Seleccionar color para variante Mono-Color (${isDarkMode ? 'dark' : 'light'} mode)`}
                    />
                  </div>

                  {/* LOCK_ICON_TOGGLE */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={currentIsLinked ? undefined : handleLinkToPrimary}
                          className={`h-8 w-8 p-0 rounded-full transition-colors ${
                            currentIsLinked 
                              ? 'text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900' 
                              : 'text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 cursor-pointer'
                          }`}
                          disabled={currentIsLinked}
                        >
                          {currentIsLinked ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <Unlock className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p style={{
                          fontFamily: 'var(--typography-emphasis-font-family)',
                          fontSize: 'var(--typography-emphasis-font-size)',
                          fontWeight: 'var(--typography-emphasis-font-weight)',
                          letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                        }} className="text-xs">
                          {currentIsLinked 
                            ? `Vinculado a Primary (${isDarkMode ? 'dark' : 'light'} mode)` 
                            : `Re-vincular a Primary (${isDarkMode ? 'dark' : 'light'} mode)`}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            )}
          </>
        )}

        {/* ERROR_MESSAGE */}
        {error && (
          <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 p-3 rounded-md w-full max-w-md mx-auto">
            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
            <p style={{
              fontFamily: 'var(--typography-paragraph-font-family)',
              fontSize: 'var(--typography-paragraph-font-size)',
              fontWeight: 'var(--typography-paragraph-font-weight)',
              lineHeight: 'var(--typography-paragraph-line-height)',
              letterSpacing: 'var(--typography-paragraph-letter-spacing)'
            }} className="text-destructive">
              {error}
            </p>
          </div>
        )}
      </div>

      {/* COLOR_PICKER_MODAL */}
      {colorPicker.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="p-4 sm:p-6 w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-auto">
            {/* MODAL_HEADER */}
            <div className="flex items-center justify-between mb-4">
              <h5 style={{
                fontFamily: 'var(--typography-h5-font-family)',
                fontSize: 'var(--typography-h5-font-size)',
                fontWeight: 'var(--typography-h5-font-weight)',
                lineHeight: 'var(--typography-h5-line-height)',
                letterSpacing: 'var(--typography-h5-letter-spacing)'
              }} className="text-foreground">
                Seleccionar Color
              </h5>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeColorPicker}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* COLOR_PICKER_COMPONENT */}
            <div className="space-y-4">
              <HsvColorPicker
                colorToken={colorToken}
                onChange={handleColorPickerChange}
                className="w-full"
              />

              {/* PREVIEW_COLOR_CHANGE */}
              <div className="bg-muted/20 rounded-lg p-4 space-y-3">
                {/* Antes */}
                <div className="flex items-center justify-between">
                  <span style={{
                    fontFamily: 'var(--typography-emphasis-font-family)',
                    fontSize: 'var(--typography-emphasis-font-size)',
                    fontWeight: 'var(--typography-emphasis-font-weight)',
                    letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                  }} className="text-muted-foreground">Color original</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-10 h-10 rounded-lg border-2 border-border"
                      style={{ backgroundColor: colorPicker.originalColor }}
                    />
                    <span style={{
                      fontFamily: 'var(--typography-emphasis-font-family)',
                      fontSize: 'var(--typography-emphasis-font-size)',
                      fontWeight: 'var(--typography-emphasis-font-weight)',
                      letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                    }} className="text-foreground font-mono">{colorPicker.originalColor}</span>
                  </div>
                </div>
                
                {/* Flecha indicadora */}
                <div className="flex justify-center">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                
                {/* Después */}
                <div className="flex items-center justify-between">
                  <span style={{
                    fontFamily: 'var(--typography-emphasis-font-family)',
                    fontSize: 'var(--typography-emphasis-font-size)',
                    fontWeight: 'var(--typography-emphasis-font-weight)',
                    letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                  }} className="text-foreground">Color nuevo</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-10 h-10 rounded-lg border-2 border-border"
                      style={{ backgroundColor: colorPicker.currentColor }}
                    />
                    <span style={{
                      fontFamily: 'var(--typography-emphasis-font-family)',
                      fontSize: 'var(--typography-emphasis-font-size)',
                      fontWeight: 'var(--typography-emphasis-font-weight)',
                      letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                    }} className="text-foreground font-mono">{colorPicker.currentColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL_ACTIONS */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <Button variant="ghost" size="sm" onClick={cancelColorChange} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button size="sm" onClick={acceptColorChange} className="w-full sm:w-auto">
                Aceptar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}