'use client';

import React from 'react';
import { Separator } from '../../../design-system/primitives/separator';
import { ThemeBorders } from '../../../core/types/theme.types';
import { BorderRadiusController } from './BorderRadiusController';
import { 
  updateBorderController, 
  toggleBorderLink, 
  computeBorderValues 
} from '../../../lib/utils/theme/border-radius-calculator';

interface BordersEditorProps {
  borders: ThemeBorders;
  onBordersChange: (borders: ThemeBorders) => void;
  className?: string;
}

export function BordersEditor({ 
  borders, 
  onBordersChange, 
  className = ""
}: BordersEditorProps) {
  
  // Manejadores para los controladores de border-radius
  const handleGlobalRadiusChange = (value: number) => {
    const updatedBorders = updateBorderController(borders, 'globalRadius', value);
    onBordersChange(updatedBorders);
  };

  const handleCardsRadiusChange = (value: number, forceUnlink: boolean = false) => {
    const updatedBorders = updateBorderController(borders, 'cardsRadius', value, forceUnlink);
    onBordersChange(updatedBorders);
  };

  const handleButtonsRadiusChange = (value: number, forceUnlink: boolean = false) => {
    const updatedBorders = updateBorderController(borders, 'buttonsRadius', value, forceUnlink);
    onBordersChange(updatedBorders);
  };

  const handleCheckboxRadiusChange = (value: number, forceUnlink: boolean = false) => {
    const updatedBorders = updateBorderController(borders, 'checkboxRadius', value, forceUnlink);
    onBordersChange(updatedBorders);
  };

  const handleCardsLinkToggle = (shouldLink: boolean) => {
    const updatedBorders = toggleBorderLink(borders, 'cardsRadius', shouldLink);
    onBordersChange(updatedBorders);
  };

  const handleButtonsLinkToggle = (shouldLink: boolean) => {
    const updatedBorders = toggleBorderLink(borders, 'buttonsRadius', shouldLink);
    onBordersChange(updatedBorders);
  };

  const handleCheckboxLinkToggle = (shouldLink: boolean) => {
    const updatedBorders = toggleBorderLink(borders, 'checkboxRadius', shouldLink);
    onBordersChange(updatedBorders);
  };

  // Asegurar que tenemos controladores válidos
  const safeBorders = computeBorderValues(borders);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* GLOBAL_RADIUS_CONTROLLER */}
      <div className="space-y-4">
        <BorderRadiusController
          label="Global Radius"
          description="Controla el border-radius base para todo el sistema de diseño"
          controller={safeBorders.globalRadius}
          isGlobal={true}
          onValueChange={handleGlobalRadiusChange}
        />
      </div>

      <Separator className="my-4" />

      {/* COMPONENT_CONTROLLERS */}
      <div className="space-y-4">
        <BorderRadiusController
          label="Cards Radius"
          description="Border-radius específico para cards y contenedores"
          controller={safeBorders.cardsRadius}
          globalValue={safeBorders.globalRadius.value}
          onValueChange={handleCardsRadiusChange}
          onToggleLink={handleCardsLinkToggle}
        />
        
        <BorderRadiusController
          label="Buttons Radius"
          description="Border-radius específico para botones y elementos interactivos"
          controller={safeBorders.buttonsRadius}
          globalValue={safeBorders.globalRadius.value}
          onValueChange={handleButtonsRadiusChange}
          onToggleLink={handleButtonsLinkToggle}
        />

        <BorderRadiusController
          label="Checkbox Radius"
          description="Border-radius específico para checkboxes y elementos de selección"
          controller={safeBorders.checkboxRadius}
          globalValue={safeBorders.globalRadius.value}
          onValueChange={handleCheckboxRadiusChange}
          onToggleLink={handleCheckboxLinkToggle}
        />
      </div>
    </div>
  );
}