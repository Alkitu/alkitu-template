'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/primitives/ui/dialog';
import { Button } from '@/components/primitives/ui/button';
import { Label } from '@/components/primitives/ui/label';
import { Checkbox } from '../atoms/Checkbox';
import { RotateCcw } from 'lucide-react';

interface CheckboxRadiusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RADIUS_PRESETS = [
  { value: 0, label: '0px', description: 'Square corners' },
  { value: 2, label: '2px', description: 'Subtle rounding' },
  { value: 4, label: '4px', description: 'Standard rounding' },
  { value: 6, label: '6px', description: 'Moderate rounding' },
  { value: 8, label: '8px', description: 'Rounded' },
  { value: 12, label: '12px', description: 'Very rounded' },
  { value: 16, label: '16px', description: 'Extra rounded' },
  { value: 9999, label: 'Full', description: 'Completely round' },
];

export function CheckboxRadiusModal({
  open,
  onOpenChange,
}: CheckboxRadiusModalProps) {
  const [currentRadius, setCurrentRadius] = useState(4);

  // Get current radius from CSS variable
  useEffect(() => {
    if (open) {
      const root = document.documentElement;
      const currentValue = getComputedStyle(root)
        .getPropertyValue('--radius-checkbox')
        .trim();

      if (currentValue === '50%') {
        setCurrentRadius(9999);
      } else {
        const numericValue = parseInt(currentValue.replace('px', '')) || 4;
        setCurrentRadius(numericValue);
      }
    }
  }, [open]);

  const applyRadius = (value: number) => {
    const root = document.documentElement;
    const radiusValue = value === 9999 ? '50%' : `${value}px`;
    root.style.setProperty('--radius-checkbox', radiusValue);
    setCurrentRadius(value);
  };

  const resetRadius = () => {
    applyRadius(4); // Default value
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Checkbox Border Radius</DialogTitle>
          <DialogDescription>
            Customize the border radius for all checkboxes in your theme.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Preview</Label>
            <div className="flex items-center justify-center p-6 border rounded-lg bg-muted/30">
              <div className="flex flex-col gap-4">
                <Checkbox
                  id="preview-1"
                  label="Unchecked checkbox"
                  checked={false}
                />
                <Checkbox
                  id="preview-2"
                  label="Checked checkbox"
                  checked={true}
                />
                <Checkbox
                  id="preview-3"
                  label="Error state"
                  variant="error"
                  checked={false}
                />
              </div>
            </div>
          </div>

          {/* Radius Presets */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Radius Presets</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={resetRadius}
                className="flex items-center gap-1 h-8 px-2"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {RADIUS_PRESETS.map((preset) => (
                <Button
                  key={preset.value}
                  variant={
                    currentRadius === preset.value ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => applyRadius(preset.value)}
                  className="flex flex-col h-auto p-2 text-center"
                  title={preset.description}
                >
                  <span className="text-xs font-medium">{preset.label}</span>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {preset.description}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Current Value Display */}
          <div className="text-sm text-muted-foreground text-center">
            Current radius:{' '}
            <span className="font-mono font-medium">
              {currentRadius === 9999 ? '50%' : `${currentRadius}px`}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
