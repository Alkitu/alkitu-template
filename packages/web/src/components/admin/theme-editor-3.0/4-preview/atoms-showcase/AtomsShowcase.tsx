'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Search, X } from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { ButtonShowcase } from './ButtonShowcase';
import { InputShowcase } from './InputShowcase';
import { TextareaShowcase } from './TextareaShowcase';

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
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Header del grupo */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-foreground">{atomType}</h3>
        </div>
      </button>
      
      {/* Contenido del grupo */}
      {isOpen && (
        <div className="p-4 border-t border-border bg-card/30">
          <div className="space-y-8">
            {atoms.map((atom) => {
              const AtomComponent = atom.component;
              return (
                <div key={atom.id} className="space-y-4">
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
    <div className="space-y-6">
      {/* Header del showcase */}
      <div className="text-center">
        <h2 
          className="text-3xl font-bold mb-2 text-foreground"
          style={{ 
            fontFamily: 'var(--typography-h2-font-family)',
            fontSize: 'var(--typography-h2-font-size)',
            fontWeight: 'var(--typography-h2-font-weight)',
            letterSpacing: 'var(--typography-h2-letter-spacing)'
          }}
        >
          Átomos del Design System
        </h2>
      </div>

      {/* Buscador y filtros */}
      <div className="space-y-4">
        {/* Barra de búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar átomos por nombre o características..."
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filtros por categoría */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
          >
            Todas las categorías
          </Button>
          {(Object.keys(ATOM_CATEGORIES) as AtomCategory[]).map(category => (
            <Button
              key={category}
              size="sm"
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
            >
              {ATOM_CATEGORIES[category]}
            </Button>
          ))}
        </div>

        {/* Indicador de filtros activos */}
        {(searchTerm || selectedCategory !== 'all') && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Mostrando {filteredAtoms.length} de {AVAILABLE_ATOMS.length} átomos
            </span>
            <Button size="sm" variant="ghost" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>

      {/* Controles de grupos */}
      {groupedAtoms.size > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {groupedAtoms.size} {groupedAtoms.size === 1 ? 'tipo de átomo' : 'tipos de átomos'} encontrados
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setOpenAtomTypes(new Set(Array.from(groupedAtoms.keys())))}
            >
              Abrir todos
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setOpenAtomTypes(new Set())}
            >
              Cerrar todos
            </Button>
          </div>
        </div>
      )}

      {/* Grupos de átomos */}
      <div className="space-y-4">
        {groupedAtoms.size === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron átomos con los filtros aplicados</p>
              <Button size="sm" variant="ghost" onClick={clearFilters} className="mt-2">
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