'use client';

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/primitives/ui/accordion';
import { Input } from '@/components/primitives/ui/input';
import { Label } from '@/components/primitives/ui/label';
import { ThemeBrand } from '../../../core/types/theme.types';
import { LogoUploadSection } from './LogoUploadSection';
import { LogoVariant } from './types';
import { useThemeEditor } from '../../../core/context/ThemeEditorContext';

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
    const updatedBrand: ThemeBrand = {
      ...brand,
      logos: {
        icon: brand.logos?.icon ?? null,
        horizontal: brand.logos?.horizontal ?? null,
        vertical: brand.logos?.vertical ?? null,
        [type]: logo
      }
    };
    onBrandChange(updatedBrand);
  };


  return (
    <div className={`flex flex-col gap-4 w-full min-w-0 ${className}`}>
      <Accordion type="multiple" defaultValue={["brand-identity", "logo-icon", "logo-horizontal", "logo-vertical"]} className="w-full flex flex-col gap-2">

        {/* BRAND_IDENTITY_SECTION */}
        <AccordionItem value="brand-identity" className="border rounded-lg">
          <AccordionTrigger style={{
            fontFamily: 'var(--typography-h5-font-family)',
            fontSize: 'var(--typography-h5-font-size)',
            fontWeight: 'var(--typography-h5-font-weight)',
            lineHeight: 'var(--typography-h5-line-height)',
            letterSpacing: 'var(--typography-h5-letter-spacing)'
          }} className="text-foreground px-4 py-3 min-w-0">
            <span className="flex-1 text-left truncate">Identidad de Marca</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="flex flex-col gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="brand-name" className="text-xs text-muted-foreground">
                  Nombre de la empresa
                </Label>
                <Input
                  id="brand-name"
                  type="text"
                  value={brand.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: Mi Empresa"
                  className="h-8 text-sm bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="brand-tagline" className="text-xs text-muted-foreground">
                  Tagline
                </Label>
                <Input
                  id="brand-tagline"
                  type="text"
                  value={brand.tagline || ''}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  placeholder="Ej: Innovación y excelencia"
                  className="h-8 text-sm bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="brand-description" className="text-xs text-muted-foreground">
                  Descripción
                </Label>
                <Input
                  id="brand-description"
                  type="text"
                  value={brand.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Breve descripción de la marca"
                  className="h-8 text-sm bg-background border-border text-foreground"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* LOGO_ICON_SECTION */}
        <AccordionItem value="logo-icon" className="border rounded-lg">
          <AccordionTrigger style={{
            fontFamily: 'var(--typography-h5-font-family)',
            fontSize: 'var(--typography-h5-font-size)',
            fontWeight: 'var(--typography-h5-font-weight)',
            lineHeight: 'var(--typography-h5-line-height)',
            letterSpacing: 'var(--typography-h5-letter-spacing)'
          }} className="text-foreground px-4 py-3 min-w-0">
            <span className="flex-1 text-left truncate">Logo (V1) - Icono</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <LogoUploadSection
              title="Icono"
              type="icon"
              aspectRatio="1:1"
              instructions="Sube tu logo en formato cuadrado (1:1). Ideal para favicons, app icons y espacios reducidos."
              logo={brand.logos?.icon ?? null}
              onLogoChange={(logo) => handleLogoChange('icon', logo)}
              className="w-full"
            />
          </AccordionContent>
        </AccordionItem>

        {/* LOGO_HORIZONTAL_SECTION */}
        <AccordionItem value="logo-horizontal" className="border rounded-lg">
          <AccordionTrigger style={{
            fontFamily: 'var(--typography-h5-font-family)',
            fontSize: 'var(--typography-h5-font-size)',
            fontWeight: 'var(--typography-h5-font-weight)',
            lineHeight: 'var(--typography-h5-line-height)',
            letterSpacing: 'var(--typography-h5-letter-spacing)'
          }} className="text-foreground px-4 py-3 min-w-0">
            <span className="flex-1 text-left truncate">Logo (V2) - Horizontal</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <LogoUploadSection
              title="Horizontal"
              type="horizontal"
              aspectRatio="3:1"
              instructions="Sube tu logo en formato horizontal (3:1). Perfecto para headers y navegación principal."
              logo={brand.logos?.horizontal ?? null}
              onLogoChange={(logo) => handleLogoChange('horizontal', logo)}
              className="w-full"
            />
          </AccordionContent>
        </AccordionItem>

        {/* LOGO_VERTICAL_SECTION */}
        <AccordionItem value="logo-vertical" className="border rounded-lg">
          <AccordionTrigger style={{
            fontFamily: 'var(--typography-h5-font-family)',
            fontSize: 'var(--typography-h5-font-size)',
            fontWeight: 'var(--typography-h5-font-weight)',
            lineHeight: 'var(--typography-h5-line-height)',
            letterSpacing: 'var(--typography-h5-letter-spacing)'
          }} className="text-foreground px-4 py-3 min-w-0">
            <span className="flex-1 text-left truncate">Logo (V3) - Vertical</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <LogoUploadSection
              title="Vertical"
              type="vertical"
              aspectRatio="3:4"
              instructions="Sube tu logo en formato vertical (3:4). Ideal para sidebars y espacios altos."
              logo={brand.logos?.vertical ?? null}
              onLogoChange={(logo) => handleLogoChange('vertical', logo)}
              className="w-full"
            />
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}