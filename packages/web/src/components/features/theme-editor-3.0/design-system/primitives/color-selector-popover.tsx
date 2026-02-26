'use client';

import React from 'react';

interface ColorSelectorPopoverProps {
  currentColor: string;
  onChange: (color: string) => void;
}

/**
 * ColorSelectorPopover - Stub component
 * TODO: Implement full color selector popover with tailwind palette
 */
export function ColorSelectorPopover({ currentColor, onChange }: ColorSelectorPopoverProps) {
  return (
    <input
      type="color"
      value={currentColor.startsWith('#') ? currentColor : '#000000'}
      onChange={(e) => onChange(e.target.value)}
      className="w-8 h-8 cursor-pointer rounded border border-border"
      title="Select color"
    />
  );
}
