'use client';

import React, { useState } from 'react';
import { ShowcaseContainer } from './ShowcaseContainer';
import { Icon } from '../../../design-system/atoms/Icon';
import { SystemIcons } from '../../../design-system/atoms/IconLibrary';
import { CustomIcon } from '../../../design-system/atoms/CustomIcon';
import { IconUploader } from '../../../design-system/atoms/IconUploader';
import { useCustomIcons } from '../../../hooks/useCustomIcons';
import { Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/primitives/ui/button';

/**
 * Icon Showcase Component
 * Displays custom icon library in a 20x20 grid with primary color
 */
export function IconShowcase() {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const {
    customIcons,
    addIcon,
    removeIcon
  } = useCustomIcons();

  // Get all system icons
  const systemIconEntries = Object.entries(SystemIcons);

  // Calculate total icons
  const totalIcons = systemIconEntries.length + customIcons.length;

  return (
    <ShowcaseContainer
      name="Icon Library"
      tokenId="icon-library"
      actionButton={
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowUploader(true)}
          className="ml-auto"
        >
          <Upload className="h-3 w-3 mr-1" />
          Upload SVG
        </Button>
      }
    >
      <div className="w-full">
        <p className="text-sm text-muted-foreground mb-4">
          {totalIcons} icons • {systemIconEntries.length} system • {customIcons.length} custom • 16px standard size
        </p>
        
        {/* Custom Icons Section (if any) */}
        {customIcons.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-foreground">Custom Icons</h3>
              <span className="text-xs text-muted-foreground">
                {customIcons.length} custom icon{customIcons.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Custom Icons Grid */}
            <div
              className="grid gap-1 max-w-full overflow-hidden mb-6"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
                width: '100%'
              }}
            >
              {customIcons.map((customIcon) => (
                <div
                  key={customIcon.id}
                  className="relative group"
                  onMouseEnter={() => setHoveredIcon(customIcon.name)}
                  onMouseLeave={() => setHoveredIcon(null)}
                >
                  <div className="aspect-square flex items-center justify-center p-1.5 rounded hover:bg-primary/10 transition-colors cursor-pointer relative">
                    <CustomIcon
                      svg={customIcon.svg}
                      size="sm"
                      variant="primary"
                    />

                    {/* Delete button on hover */}
                    <button
                      onClick={() => removeIcon(customIcon.id)}
                      className="absolute top-0 right-0 p-0.5 bg-destructive text-destructive-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ transform: 'translate(25%, -25%)' }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Tooltip */}
                  {hoveredIcon === customIcon.name && (
                    <div
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg border border-border whitespace-nowrap z-10"
                      style={{ pointerEvents: 'none' }}
                    >
                      {customIcon.name} (custom)
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-b mb-4" />
          </>
        )}

        {/* System Icons Section */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">System Icons</h3>
          <span className="text-xs text-muted-foreground">
            {systemIconEntries.length} essential icons
          </span>
        </div>

        {/* System Icons Grid */}
        <div
          className="grid gap-1 max-w-full overflow-hidden"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
            width: '100%'
          }}
        >
          {systemIconEntries.map(([name, IconComponent]) => (
            <div
              key={name}
              className="relative group"
              onMouseEnter={() => setHoveredIcon(name)}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <div
                className="aspect-square flex items-center justify-center p-1.5 rounded hover:bg-primary/10 transition-colors cursor-pointer"
              >
                <Icon
                  icon={IconComponent as any}
                  size="sm"
                  variant="primary"
                />
              </div>

              {/* Tooltip */}
              {hoveredIcon === name && (
                <div
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg border border-border whitespace-nowrap z-10"
                  style={{ pointerEvents: 'none' }}
                >
                  {name}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Upload Modal */}
        <IconUploader
          isOpen={showUploader}
          onClose={() => setShowUploader(false)}
          onUpload={addIcon}
        />
      </div>
    </ShowcaseContainer>
  );
}

export default IconShowcase;