'use client';

import React from 'react';
import { Card } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { ThemeBrand } from '../../types/theme.types';

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
  
  const handleInputChange = (field: keyof ThemeBrand, value: string) => {
    const updatedBrand = {
      ...brand,
      [field]: value
    };
    onBrandChange(updatedBrand);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Brand Identity */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Brand Identity</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Brand Name */}
          <div className="space-y-2">
            <Label className="text-xs">Brand Name</Label>
            <Input
              value={brand.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter brand name"
              className="h-8"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <Label className="text-xs">Tagline</Label>
            <Input
              value={brand.tagline || ''}
              onChange={(e) => handleInputChange('tagline', e.target.value)}
              placeholder="Enter brand tagline"
              className="h-8"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 mt-4">
          <Label className="text-xs">Description</Label>
          <Textarea
            value={brand.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter brand description"
            rows={3}
            className="resize-none"
          />
        </div>
      </Card>

      {/* Brand Assets */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Brand Assets</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Logo URL */}
          <div className="space-y-2">
            <Label className="text-xs">Logo URL</Label>
            <Input
              value={brand.logoUrl || ''}
              onChange={(e) => handleInputChange('logoUrl', e.target.value)}
              placeholder="https://example.com/logo.svg"
              className="h-8"
            />
            {brand.logoUrl && (
              <div className="mt-2">
                <img 
                  src={brand.logoUrl} 
                  alt="Brand Logo" 
                  className="h-8 w-auto border rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Favicon URL */}
          <div className="space-y-2">
            <Label className="text-xs">Favicon URL</Label>
            <Input
              value={brand.faviconUrl || ''}
              onChange={(e) => handleInputChange('faviconUrl', e.target.value)}
              placeholder="https://example.com/favicon.ico"
              className="h-8"
            />
            {brand.faviconUrl && (
              <div className="mt-2">
                <img 
                  src={brand.faviconUrl} 
                  alt="Favicon" 
                  className="h-4 w-4 border rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Brand Colors Reference */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Brand Color Guidelines</h3>
        <div className="space-y-3">
          <div className="text-xs text-muted-foreground">
            Brand colors are defined in the Colors tab. Use this section to document color usage guidelines.
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs">Color Usage Guidelines</Label>
            <Textarea
              value={brand.colorGuidelines || ''}
              onChange={(e) => handleInputChange('colorGuidelines', e.target.value)}
              placeholder="Describe how brand colors should be used..."
              rows={4}
              className="resize-none"
            />
          </div>
        </div>
      </Card>

      {/* Brand Voice & Tone */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Brand Voice & Tone</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Brand Voice</Label>
            <Textarea
              value={brand.voice || ''}
              onChange={(e) => handleInputChange('voice', e.target.value)}
              placeholder="Describe the brand's voice (e.g., friendly, professional, casual)"
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Brand Tone</Label>
            <Textarea
              value={brand.tone || ''}
              onChange={(e) => handleInputChange('tone', e.target.value)}
              placeholder="Describe the brand's tone (e.g., encouraging, authoritative, playful)"
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}