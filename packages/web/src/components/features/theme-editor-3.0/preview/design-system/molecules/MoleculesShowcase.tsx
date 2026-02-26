'use client';

import React, { useState, useMemo } from 'react';
import { 
  Settings, 
  User, 
  FileText, 
  Database, 
  Calendar,
  Home,
  Info,
  Search,
  Mail,
  Bell,
  Download,
  ExternalLink,
  Check 
} from 'lucide-react';
import { AccordionMolecule } from '../../../design-system/molecules/AccordionMolecule';
import { CardMolecule } from '../../../design-system/molecules/CardMolecule';
import { DatePickerMolecule } from '../../../design-system/molecules/DatePickerMolecule';
import { PaginationMolecule } from '../../../design-system/molecules/PaginationMolecule';
import { DropdownMenuMolecule, ExampleMenuItems } from '../../../design-system/molecules/DropdownMenuMolecule';
import { TabsMolecule } from '../../../design-system/molecules/TabsMolecule';
import { ComboboxMolecule } from '../../../design-system/molecules/ComboboxMolecule';
import { NavigationMenuMolecule } from '../../../design-system/molecules/NavigationMenuMolecule';
import { SonnerMolecule, useToast } from '../../../design-system/molecules/SonnerMolecule';
import { Button } from '../../../design-system/atoms/Button';
import { useThemeEditor } from '../../../core/context/ThemeEditorContext';
import { ComponentSearchFilter, SearchableItem, CategoryMapping } from '../../../design-system/components/ComponentSearchFilter';

// Molecule categories
const MOLECULE_CATEGORIES: CategoryMapping = {
  'data-collection': 'Recolección de Datos',
  'data-display': 'Visualización de Datos',
  'navigation': 'Navegación',
  'feedback': 'Feedback y Notificaciones',
  'layout': 'Diseño y Estructura'
} as const;

type MoleculeCategory = keyof typeof MOLECULE_CATEGORIES;

// Molecule definitions
interface MoleculeDefinition {
  id: string;
  name: string;
  category: MoleculeCategory;
  keywords: string[];
  component?: React.ComponentType;
  renderContent: () => React.ReactNode;
}

/**
 * MoleculesShowcase - Showcase component for all molecule components
 * Displays all molecules with proper theme integration and interactive examples
 */
export function MoleculesShowcase() {
  const { state } = useThemeEditor();
  const { addToast } = useToast();
  
  // Theme integration
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;
  const spacing = state.currentTheme?.spacing;

  // Spacing system
  const baseSpacing = spacing?.spacing || '2.2rem';
  const baseValue = parseFloat(baseSpacing.replace('rem', '')) * 16;
  const mediumSpacing = `var(--spacing-medium, ${baseValue * 2}px)`;
  const largeSpacing = `var(--spacing-large, ${baseValue * 4}px)`;

  // Local state for demos
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [comboboxValue, setComboboxValue] = useState<string | string[]>('');
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openMolecules, setOpenMolecules] = useState<Set<string>>(new Set());

  // Sample data
  const accordionItems = [
    {
      id: 'features',
      title: 'Características del Producto',
      content: 'Este producto incluye múltiples características avanzadas diseñadas para mejorar tu productividad y experiencia de usuario.',
      badge: { text: 'Nuevo', variant: 'default' as const },
      icon: <Info className="h-4 w-4" />
    },
    {
      id: 'pricing',
      title: 'Planes y Precios',
      content: 'Ofrecemos diferentes planes para adaptarse a tus necesidades, desde básico hasta empresarial con funciones avanzadas.',
      badge: { text: 'Popular', variant: 'secondary' as const }
    },
    {
      id: 'support',
      title: 'Soporte Técnico',
      content: 'Nuestro equipo de soporte está disponible 24/7 para ayudarte con cualquier duda o problema que puedas tener.'
    }
  ];

  const comboboxOptions = [
    { 
      id: '1', 
      label: 'React', 
      value: 'react', 
      description: 'Librería para construir interfaces de usuario',
      icon: <FileText className="h-4 w-4" />,
      badge: { text: 'Popular', variant: 'secondary' as const }
    },
    { 
      id: '2', 
      label: 'Vue.js', 
      value: 'vue', 
      description: 'Framework progresivo para JavaScript',
      icon: <FileText className="h-4 w-4" />
    },
    { 
      id: '3', 
      label: 'Angular', 
      value: 'angular', 
      description: 'Plataforma para aplicaciones web',
      icon: <FileText className="h-4 w-4" />
    },
    { 
      id: '4', 
      label: 'Svelte', 
      value: 'svelte', 
      description: 'Framework compilado',
      icon: <FileText className="h-4 w-4" />,
      badge: { text: 'Nuevo', variant: 'default' as const }
    }
  ];

  const navigationItems = [
    {
      id: 'products',
      label: 'Productos',
      children: [
        {
          id: 'web-apps',
          label: 'Aplicaciones Web',
          href: '#web-apps',
          description: 'Soluciones web completas y escalables',
          icon: <Database className="h-4 w-4" />,
          featured: true
        },
        {
          id: 'mobile-apps',
          label: 'Aplicaciones Móviles',
          href: '#mobile-apps',
          description: 'Apps nativas para iOS y Android',
          icon: <FileText className="h-4 w-4" />,
          featured: true
        },
        {
          id: 'apis',
          label: 'APIs',
          href: '#apis',
          description: 'Servicios y APIs robustas'
        }
      ]
    },
    {
      id: 'docs',
      label: 'Documentación',
      href: '#docs'
    },
    {
      id: 'support',
      label: 'Soporte',
      href: '#support',
      badge: { text: 'Nuevo', variant: 'outline' as const }
    }
  ];

  const tabItems = [
    {
      id: 'overview',
      label: 'Resumen',
      icon: <Home className="h-4 w-4" />,
      content: (
        <div>
          <h3 style={{ 
            fontFamily: 'var(--typography-h3-font-family)',
            fontSize: 'var(--typography-h3-font-size)',
            marginBottom: '1rem',
            color: colors?.foreground?.value || 'var(--color-foreground)'
          }}>
            Resumen del Proyecto
          </h3>
          <p style={{ 
            color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
            lineHeight: '1.6'
          }}>
            Este es el contenido del tab de resumen donde puedes mostrar información general sobre tu proyecto o aplicación.
          </p>
        </div>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <Database className="h-4 w-4" />,
      badge: { text: 'Beta', variant: 'outline' as const },
      content: (
        <div>
          <h3 style={{ 
            fontFamily: 'var(--typography-h3-font-family)',
            fontSize: 'var(--typography-h3-font-size)',
            marginBottom: '1rem',
            color: colors?.foreground?.value || 'var(--color-foreground)'
          }}>
            Datos y Analytics
          </h3>
          <p style={{ 
            color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
            lineHeight: '1.6'
          }}>
            Aquí puedes mostrar gráficos, métricas y datos importantes de tu aplicación.
          </p>
        </div>
      )
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: <Settings className="h-4 w-4" />,
      closeable: true,
      content: (
        <div>
          <h3 style={{ 
            fontFamily: 'var(--typography-h3-font-family)',
            fontSize: 'var(--typography-h3-font-size)',
            marginBottom: '1rem',
            color: colors?.foreground?.value || 'var(--color-foreground)'
          }}>
            Configuraciones
          </h3>
          <p style={{ 
            color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
            lineHeight: '1.6'
          }}>
            Panel de configuraciones donde los usuarios pueden ajustar preferencias y opciones.
          </p>
        </div>
      )
    }
  ];

  // Toast demo functions
  const showSuccessToast = () => {
    addToast({
      title: '¡Éxito!',
      description: 'La operación se completó correctamente.',
      type: 'success'
    });
  };

  const showErrorToast = () => {
    addToast({
      title: 'Error',
      description: 'Hubo un problema al procesar la solicitud.',
      type: 'error',
      action: {
        label: 'Reintentar',
        onClick: () => console.log('Reintentando...')
      }
    });
  };

  const showWarningToast = () => {
    addToast({
      title: 'Advertencia',
      description: 'Esta acción no se puede deshacer.',
      type: 'warning'
    });
  };

  const showInfoToast = () => {
    addToast({
      title: 'Información',
      description: 'Nueva actualización disponible.',
      type: 'info',
      duration: 6000
    });
  };

  // Available molecules definitions
  const AVAILABLE_MOLECULES: MoleculeDefinition[] = useMemo(() => [
    {
      id: 'accordion',
      name: 'Accordion',
      category: 'data-display',
      keywords: ['accordion', 'collapse', 'expandable', 'faq', 'sections', 'panels'],
      renderContent: () => (
        <AccordionMolecule
          items={accordionItems}
          variant="card"
          animated={true}
        />
      )
    },
    {
      id: 'card',
      name: 'Card',
      category: 'layout',
      keywords: ['card', 'container', 'panel', 'surface', 'content', 'image', 'featured', 'compact'],
      renderContent: () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: mediumSpacing }}>
          <CardMolecule
            title="Card Básica"
            description="Esta es una card básica con título y descripción"
            content="El contenido de la card puede incluir cualquier elemento React o texto simple."
            actions={[
              { label: 'Acción Principal', onClick: () => console.log('Primary action') },
              { label: 'Secundaria', onClick: () => console.log('Secondary action'), variant: 'outline' }
            ]}
          />
          <CardMolecule
            variant="interactive"
            title="Card con Imagen"
            description="Card interactiva con imagen"
            image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop"
            imageAlt="Preview image"
            badge={{ text: 'Nuevo', variant: 'default' }}
            content="Las cards con imágenes son perfectas para mostrar contenido visual."
            actions={[
              { label: 'Ver más', onClick: () => console.log('View more'), icon: <ExternalLink className="h-4 w-4" /> }
            ]}
          />
        </div>
      )
    },
    {
      id: 'datepicker',
      name: 'Date Picker',
      category: 'data-collection',
      keywords: ['date', 'picker', 'calendar', 'datetime', 'time', 'form', 'input'],
      renderContent: () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: mediumSpacing }}>
          <DatePickerMolecule
            value={selectedDate}
            onChange={(d) => setSelectedDate(d instanceof Date ? d : undefined)}
            label="Fecha básica"
            placeholder="Selecciona una fecha"
          />
          <DatePickerMolecule
            value={selectedDate}
            onChange={(d) => setSelectedDate(d instanceof Date ? d : undefined)}
            variant="datetime"
            label="Fecha y hora"
            placeholder="Selecciona fecha y hora"
          />
        </div>
      )
    },
    {
      id: 'pagination',
      name: 'Pagination',
      category: 'navigation',
      keywords: ['pagination', 'pages', 'navigation', 'items', 'table', 'list'],
      renderContent: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: mediumSpacing }}>
          <PaginationMolecule
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
            variant="detailed"
            showTotal={true}
            totalItems={250}
            showPageSize={true}
            pageSize={25}
          />
          <PaginationMolecule
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
            variant="compact"
          />
        </div>
      )
    },
    {
      id: 'dropdown-menu',
      name: 'Dropdown Menu',
      category: 'navigation',
      keywords: ['dropdown', 'menu', 'context', 'actions', 'user', 'popover'],
      renderContent: () => (
        <div style={{ display: 'flex', gap: mediumSpacing, flexWrap: 'wrap' }}>
          <DropdownMenuMolecule
            items={ExampleMenuItems.userMenu}
            variant="user"
          />
          <DropdownMenuMolecule
            items={ExampleMenuItems.actionsMenu}
            variant="actions"
          />
        </div>
      )
    },
    {
      id: 'tabs',
      name: 'Tabs',
      category: 'navigation',
      keywords: ['tabs', 'navigation', 'panels', 'sections', 'toggle'],
      renderContent: () => (
        <TabsMolecule
          tabs={tabItems}
          variant="underline"
          addable={true}
          onTabAdd={() => console.log('Añadir tab')}
          onTabClose={(tabId) => console.log('Cerrar tab:', tabId)}
        />
      )
    },
    {
      id: 'combobox',
      name: 'Combobox',
      category: 'data-collection',
      keywords: ['combobox', 'select', 'autocomplete', 'search', 'dropdown', 'multiple'],
      renderContent: () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: mediumSpacing }}>
          <ComboboxMolecule
            options={comboboxOptions}
            value={comboboxValue}
            onChange={setComboboxValue}
            placeholder="Selecciona un framework..."
            searchPlaceholder="Buscar frameworks..."
          />
          <ComboboxMolecule
            options={comboboxOptions}
            value={multiSelectValue}
            onChange={(v) => setMultiSelectValue(Array.isArray(v) ? v : [v])}
            variant="multiple"
            placeholder="Selecciona múltiples..."
            maxSelections={3}
          />
        </div>
      )
    },
    {
      id: 'navigation-menu',
      name: 'Navigation Menu',
      category: 'navigation',
      keywords: ['navigation', 'menu', 'header', 'navbar', 'featured'],
      renderContent: () => (
        <NavigationMenuMolecule
          items={navigationItems}
          variant="featured"
        />
      )
    },
    {
      id: 'toast',
      name: 'Toast (Sonner)',
      category: 'feedback',
      keywords: ['toast', 'notification', 'sonner', 'alert', 'message', 'success', 'error'],
      renderContent: () => (
        <div style={{ display: 'flex', gap: mediumSpacing, flexWrap: 'wrap' }}>
          <Button variant="default" onClick={showSuccessToast}>
            <Check className="h-4 w-4" />
            Toast Éxito
          </Button>
          <Button variant="destructive" onClick={showErrorToast}>
            Toast Error
          </Button>
          <Button variant="outline" onClick={showWarningToast}>
            Toast Advertencia
          </Button>
          <Button variant="secondary" onClick={showInfoToast}>
            <Info className="h-4 w-4" />
            Toast Info
          </Button>
        </div>
      )
    }
  ], [accordionItems, selectedDate, setSelectedDate, currentPage, setCurrentPage, comboboxValue, setComboboxValue, multiSelectValue, setMultiSelectValue, comboboxOptions, tabItems, navigationItems, mediumSpacing, showSuccessToast, showErrorToast, showWarningToast, showInfoToast]);

  // Search filter functions
  const handleToggleMolecule = (moleculeName: string) => {
    setOpenMolecules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moleculeName)) {
        newSet.delete(moleculeName);
      } else {
        newSet.add(moleculeName);
      }
      return newSet;
    });
  };

  const handleOpenAllMolecules = () => {
    setOpenMolecules(new Set(AVAILABLE_MOLECULES.map(m => m.name)));
  };

  const handleCloseAllMolecules = () => {
    setOpenMolecules(new Set());
  };

  // Render molecule function
  const renderMolecule = (molecule: MoleculeDefinition) => {
    return (
      <div>
        {molecule.renderContent()}
      </div>
    );
  };

  // Styles
  const getContainerStyles = () => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: largeSpacing,
    padding: mediumSpacing
  });

  const getSectionStyles = () => ({
    padding: mediumSpacing,
    background: colors?.card?.value || 'var(--color-card)',
    border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
    borderRadius: 'var(--radius-card, 8px)',
    marginBottom: largeSpacing
  });

  const getSectionHeaderStyles = () => ({
    fontFamily: 'var(--typography-h2-font-family)',
    fontSize: 'var(--typography-h2-font-size)',
    fontWeight: 'var(--typography-h2-font-weight)',
    color: colors?.foreground?.value || 'var(--color-foreground)',
    marginBottom: mediumSpacing
  });

  return (
    <ComponentSearchFilter
      items={AVAILABLE_MOLECULES as unknown as SearchableItem[]}
      categories={MOLECULE_CATEGORIES}
      searchTerm={searchTerm}
      selectedCategory={selectedCategory as string}
      onSearchChange={setSearchTerm}
      onCategoryChange={setSelectedCategory as (category: string) => void}
      openGroups={openMolecules}
      onToggleGroup={handleToggleMolecule}
      onOpenAllGroups={handleOpenAllMolecules}
      onCloseAllGroups={handleCloseAllMolecules}
      renderItem={renderMolecule as (item: SearchableItem) => React.ReactNode}
      searchPlaceholder="Buscar moléculas por nombre o características..."
      noResultsMessage="No se encontraron moléculas con los filtros aplicados"
      className="w-full"
    />
  );
}