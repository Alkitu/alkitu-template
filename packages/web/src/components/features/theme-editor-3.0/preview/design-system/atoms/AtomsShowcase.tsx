'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Search, X } from 'lucide-react';
import { Input } from '../../../design-system/atoms/Input';
import { Button } from '../../../design-system/primitives/Button';
import { Badge } from '../../../design-system/primitives/badge';
import { ButtonShowcase } from './ButtonShowcase';
import { InputShowcase } from './InputShowcase';
import { TextareaShowcase } from './TextareaShowcase';
import { SelectShowcase } from './SelectShowcase';
import { CheckboxShowcase } from './CheckboxShowcase';
import { RadioButtonShowcase } from './RadioButtonShowcase';
import { ToggleShowcase } from './ToggleShowcase';
import { BadgeShowcase } from './BadgeShowcase';
import { AvatarShowcase } from './AvatarShowcase';
import { ProgressBarShowcase } from './ProgressBarShowcase';
import { IconShowcase } from './IconShowcase';
import { PreviewImageShowcase } from './PreviewImageShowcase';
import { SpinnerShowcase } from './SpinnerShowcase';
import { TooltipShowcase } from './TooltipShowcase';
import { ChipShowcase } from './ChipShowcase';
import { BreadcrumbShowcase } from './BreadcrumbShowcase';
import { AlertShowcase } from './AlertShowcase';
import { SeparatorShowcase } from './SeparatorShowcase';
import { SliderShowcase } from './SliderShowcase';
import { ToggleGroupShowcase } from './ToggleGroupShowcase';

// Definición de categorías de átomos
const ATOM_CATEGORIES = {
  'visual-structure': 'Elementos Visuales y de Estructura',
  'form-inputs': 'Entradas de Datos (Form Inputs)', 
  'navigation': 'Navegación',
  'actions-controls': 'Acciones y Controles',
  'feedback-state': 'Feedback y Estado',
  'media-user': 'Medios y Usuario'
} as const;

type AtomCategory = keyof typeof ATOM_CATEGORIES;

// Definición de átomos disponibles
interface AtomDefinition {
  id: string;
  name: string;
  component: React.ComponentType;
  category: AtomCategory;
  keywords: string[];
}

const AVAILABLE_ATOMS: AtomDefinition[] = [
  {
    id: 'icon',
    name: 'Icon',
    component: IconShowcase,
    category: 'visual-structure',
    keywords: ['icon', 'lucide', 'svg', 'symbol', 'graphic', 'visual', 'ui', 'interface', 'arrow', 'star', 'heart']
  },
  {
    id: 'preview-image',
    name: 'Preview Image',
    component: PreviewImageShowcase,
    category: 'media-user',
    keywords: ['image', 'preview', 'aspect', 'ratio', 'responsive', 'picture', 'photo', 'media', 'visual', 'thumbnail']
  },
  {
    id: 'button',
    name: 'Button',
    component: ButtonShowcase,
    category: 'actions-controls',
    keywords: ['button', 'btn', 'click', 'action', 'submit', 'primary', 'secondary', 'outline', 'ghost', 'destructive']
  },
  {
    id: 'input',
    name: 'Input',
    component: InputShowcase,
    category: 'form-inputs',
    keywords: ['input', 'form', 'text', 'field', 'email', 'password', 'number', 'search']
  },
  {
    id: 'textarea',
    name: 'Textarea',
    component: TextareaShowcase,
    category: 'form-inputs',
    keywords: ['textarea', 'form', 'text', 'multiline', 'message', 'description', 'comment', 'autosize']
  },
  {
    id: 'select',
    name: 'Select',
    component: SelectShowcase,
    category: 'form-inputs',
    keywords: ['select', 'dropdown', 'form', 'options', 'choose', 'picker', 'menu', 'combobox']
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    component: CheckboxShowcase,
    category: 'form-inputs',
    keywords: ['checkbox', 'form', 'check', 'select', 'multiple', 'toggle', 'boolean', 'validate']
  },
  {
    id: 'radio',
    name: 'Radio Button',
    component: RadioButtonShowcase,
    category: 'form-inputs',
    keywords: ['radio', 'form', 'select', 'single', 'choice', 'option', 'group', 'exclusive']
  },
  {
    id: 'toggle',
    name: 'Toggle',
    component: ToggleShowcase,
    category: 'actions-controls',
    keywords: ['toggle', 'switch', 'boolean', 'on', 'off', 'state', 'enable', 'disable']
  },
  {
    id: 'badge',
    name: 'Badge',
    component: BadgeShowcase,
    category: 'visual-structure',
    keywords: ['badge', 'tag', 'label', 'status', 'notification', 'count', 'chip', 'pill']
  },
  {
    id: 'avatar',
    name: 'Avatar',
    component: AvatarShowcase,
    category: 'media-user',
    keywords: ['avatar', 'profile', 'user', 'image', 'photo', 'initials', 'status', 'online']
  },
  {
    id: 'progress',
    name: 'Progress Bar',
    component: ProgressBarShowcase,
    category: 'feedback-state',
    keywords: ['progress', 'bar', 'loading', 'percentage', 'completion', 'status', 'meter', 'indicator']
  },
  {
    id: 'spinner',
    name: 'Spinner',
    component: SpinnerShowcase,
    category: 'feedback-state',
    keywords: ['spinner', 'loading', 'loader', 'circular', 'dots', 'pulse', 'animation', 'progress', 'wait']
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    component: TooltipShowcase,
    category: 'feedback-state',
    keywords: ['tooltip', 'hover', 'popup', 'overlay', 'hint', 'help', 'contextual', 'information', 'placement']
  },
  {
    id: 'chip',
    name: 'Chip',
    component: ChipShowcase,
    category: 'visual-structure',
    keywords: ['chip', 'tag', 'filter', 'removable', 'selectable', 'badge', 'label', 'category', 'pill']
  },
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    component: BreadcrumbShowcase,
    category: 'navigation',
    keywords: ['breadcrumb', 'navigation', 'path', 'hierarchy', 'trail', 'crumb', 'location', 'route']
  },
  {
    id: 'alert',
    name: 'Alert',
    component: AlertShowcase,
    category: 'feedback-state',
    keywords: ['alert', 'notification', 'message', 'info', 'success', 'warning', 'error', 'dismissible', 'toast']
  },
  {
    id: 'separator',
    name: 'Separator',
    component: SeparatorShowcase,
    category: 'visual-structure',
    keywords: ['separator', 'divider', 'line', 'horizontal', 'vertical', 'decorative', 'section', 'break']
  },
  {
    id: 'slider',
    name: 'Slider',
    component: SliderShowcase,
    category: 'form-inputs',
    keywords: ['slider', 'range', 'input', 'numeric', 'value', 'thumb', 'track', 'control', 'adjust']
  },
  {
    id: 'toggle-group',
    name: 'Toggle Group',
    component: ToggleGroupShowcase,
    category: 'actions-controls',
    keywords: ['toggle', 'group', 'button', 'selection', 'multiple', 'single', 'toolbar', 'tab', 'switch']
  }
  // Aquí se pueden añadir más átomos en el futuro
];

// Componente para el contenedor de grupo colapsable por tipo de átomo
interface CollapsibleAtomTypeProps {
  atomType: string;
  atoms: AtomDefinition[];
  isOpen: boolean;
  onToggle: () => void;
}

function CollapsibleAtomType({ atomType, atoms, isOpen, onToggle }: CollapsibleAtomTypeProps) {
  return (
    <div 
      className="border border-border overflow-visible"
      style={{ borderRadius: 'var(--radius-card, 8px)' }}
    >
      {/* Header del grupo */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors min-w-0"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-shrink-0">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-foreground min-w-0 truncate">{atomType}</h3>
        </div>
      </button>
      
      {/* Contenido del grupo */}
      {isOpen && (
        <div className="p-4 border-t border-border bg-card/30">
          <div className="flex flex-col gap-6">
            {atoms.map((atom) => {
              const AtomComponent = atom.component;
              return (
                <div key={atom.id} className="flex flex-col gap-4">
                  <AtomComponent />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente principal del showcase de átomos
export function AtomsShowcase() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AtomCategory | 'all'>('all');
  const [openAtomTypes, setOpenAtomTypes] = useState<Set<string>>(
    // Por defecto todos abiertos - inicializamos con los tipos de átomos disponibles
    new Set(AVAILABLE_ATOMS.map(atom => atom.name))
  );

  // Filtrar átomos basado en búsqueda y categoría
  const filteredAtoms = useMemo(() => {
    return AVAILABLE_ATOMS.filter(atom => {
      // Filtro por categoría
      if (selectedCategory !== 'all' && atom.category !== selectedCategory) {
        return false;
      }
      
      // Filtro por búsqueda
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return atom.name.toLowerCase().includes(searchLower) ||
               atom.keywords.some(keyword => keyword.toLowerCase().includes(searchLower));
      }
      
      return true;
    });
  }, [searchTerm, selectedCategory]);

  // Agrupar átomos filtrados por tipo de átomo (nombre)
  const groupedAtoms = useMemo(() => {
    const groups = new Map<string, AtomDefinition[]>();
    
    filteredAtoms.forEach(atom => {
      const atomType = atom.name; // Agrupamos por el nombre del átomo (Button, Input, etc.)
      if (!groups.has(atomType)) {
        groups.set(atomType, []);
      }
      groups.get(atomType)!.push(atom);
    });
    
    return groups;
  }, [filteredAtoms]);

  // Función para toggle de tipos de átomos
  const toggleAtomType = (atomType: string) => {
    setOpenAtomTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(atomType)) {
        newSet.delete(atomType);
      } else {
        newSet.add(atomType);
      }
      return newSet;
    });
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  return (
    <div className="flex flex-col gap-6 w-full min-w-0">

      {/* Buscador y filtros */}
      <div className="flex flex-col gap-4">
        {/* Barra de búsqueda */}
        <div className="flex relative w-full">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar átomos por nombre o características..."
            className="w-full flex-1 min-w-0"
            leftIcon={<Search className="h-4 w-4" />}
            rightIcon={searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="text-muted-foreground hover:text-foreground"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            ) : undefined}
          />
        </div>

        {/* Filtros por categoría */}
        <div className="flex flex-wrap gap-2 justify-start items-center">
          <Button
            size="sm"
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className="flex-shrink-0"
          >
            Todas las categorías
          </Button>
          {(Object.keys(ATOM_CATEGORIES) as AtomCategory[]).map(category => (
            <Button
              key={category}
              size="sm"
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="flex-shrink-0"
            >
              {ATOM_CATEGORIES[category]}
            </Button>
          ))}
        </div>

        {/* Indicador de filtros activos */}
        {(searchTerm || selectedCategory !== 'all') && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
            <span className="flex-1 min-w-0">
              Mostrando {filteredAtoms.length} de {AVAILABLE_ATOMS.length} átomos
            </span>
            <Button size="sm" variant="ghost" onClick={clearFilters} className="flex-shrink-0">
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>

      {/* Controles de grupos */}
      {groupedAtoms.size > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-sm text-muted-foreground flex-1 min-w-0">
            {groupedAtoms.size} {groupedAtoms.size === 1 ? 'tipo de átomo' : 'tipos de átomos'} encontrados
          </span>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setOpenAtomTypes(new Set(Array.from(groupedAtoms.keys())))}
              className="flex-1 sm:flex-initial"
            >
              Abrir todos
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setOpenAtomTypes(new Set())}
              className="flex-1 sm:flex-initial"
            >
              Cerrar todos
            </Button>
          </div>
        </div>
      )}

      {/* Grupos de átomos */}
      <div className="flex flex-col gap-4 w-full">
        {groupedAtoms.size === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex flex-col items-center text-muted-foreground">
              <Search className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-center mb-2">No se encontraron átomos con los filtros aplicados</p>
              <Button size="sm" variant="ghost" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </div>
          </div>
        ) : (
          Array.from(groupedAtoms.entries()).map(([atomType, atoms]) => (
            <CollapsibleAtomType
              key={atomType}
              atomType={atomType}
              atoms={atoms}
              isOpen={openAtomTypes.has(atomType)}
              onToggle={() => toggleAtomType(atomType)}
            />
          ))
        )}
      </div>
    </div>
  );
}