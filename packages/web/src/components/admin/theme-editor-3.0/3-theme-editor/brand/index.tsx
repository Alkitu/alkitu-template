'use client';

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion';
import { ThemeBrand } from '../../types/theme.types';
import { LogoUploadSection } from './LogoUploadSection';
import { LogoVariant } from './types';
import { useThemeEditor } from '../../context/ThemeEditorContext';

interface BrandEditorProps {
  brand: ThemeBrand;
  onBrandChange: (brand: ThemeBrand) => void;
  className?: string;
}

export function BrandEditor({ 
  brand, 
  onBrandChange, 
  className = ""
}: BrandEditorProps) {
  const { state } = useThemeEditor();

  const handleInputChange = (field: keyof ThemeBrand, value: string) => {
    const updatedBrand = {
      ...brand,
      [field]: value
    };
    onBrandChange(updatedBrand);
  };

  const handleLogoChange = (type: 'icon' | 'horizontal' | 'vertical', logo: LogoVariant | null) => {
    const updatedBrand = {
      ...brand,
      logos: {
        ...brand.logos,
        [type]: logo
      }
    };
    onBrandChange(updatedBrand);
  };


  return (
    <div className={className}>
      <Accordion type="multiple" defaultValue={["logo-icon", "logo-horizontal", "logo-vertical"]} className="w-full">

        {/* LOGO_ICON_SECTION */}
        <AccordionItem value="logo-icon">
          <AccordionTrigger style={{
            fontFamily: 'var(--typography-h4-font-family)',
            fontSize: 'var(--typography-h4-font-size)',
            fontWeight: 'var(--typography-h4-font-weight)',
            lineHeight: 'var(--typography-h4-line-height)',
            letterSpacing: 'var(--typography-h4-letter-spacing)'
          }} className="text-foreground">
            Logo (V1) - Icono
          </AccordionTrigger>
          <AccordionContent>
            <LogoUploadSection
              title="Icono"
              type="icon"
              aspectRatio="1:1"
              instructions="Sube tu logo en formato cuadrado (1:1). Ideal para favicons, app icons y espacios reducidos."
              logo={brand.logos.icon}
              onLogoChange={(logo) => handleLogoChange('icon', logo)}
            />
          </AccordionContent>
        </AccordionItem>

        {/* LOGO_HORIZONTAL_SECTION */}
        <AccordionItem value="logo-horizontal">
          <AccordionTrigger style={{
            fontFamily: 'var(--typography-h4-font-family)',
            fontSize: 'var(--typography-h4-font-size)',
            fontWeight: 'var(--typography-h4-font-weight)',
            lineHeight: 'var(--typography-h4-line-height)',
            letterSpacing: 'var(--typography-h4-letter-spacing)'
          }} className="text-foreground">
            Logo (V2) - Horizontal
          </AccordionTrigger>
          <AccordionContent>
            <LogoUploadSection
              title="Horizontal"
              type="horizontal"
              aspectRatio="3:1"
              instructions="Sube tu logo en formato horizontal (3:1). Perfecto para headers y navegación principal."
              logo={brand.logos.horizontal}
              onLogoChange={(logo) => handleLogoChange('horizontal', logo)}
            />
          </AccordionContent>
        </AccordionItem>

        {/* LOGO_VERTICAL_SECTION */}
        <AccordionItem value="logo-vertical">
          <AccordionTrigger style={{
            fontFamily: 'var(--typography-h4-font-family)',
            fontSize: 'var(--typography-h4-font-size)',
            fontWeight: 'var(--typography-h4-font-weight)',
            lineHeight: 'var(--typography-h4-line-height)',
            letterSpacing: 'var(--typography-h4-letter-spacing)'
          }} className="text-foreground">
            Logo (V3) - Vertical
          </AccordionTrigger>
          <AccordionContent>
            <LogoUploadSection
              title="Vertical"
              type="vertical"
              aspectRatio="3:4"
              instructions="Sube tu logo en formato vertical (3:4). Ideal para sidebars y espacios altos."
              logo={brand.logos.vertical}
              onLogoChange={(logo) => handleLogoChange('vertical', logo)}
            />
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}