'use client';

import React, { useState } from 'react';
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
import { DatePickerMolecule } from '../../../design-system/molecules/DatePickerMolecule';
import { PaginationMolecule } from '../../../design-system/molecules/PaginationMolecule';
import { DropdownMenuMolecule, ExampleMenuItems } from '../../../design-system/molecules/DropdownMenuMolecule';
import { TabsMolecule } from '../../../design-system/molecules/TabsMolecule';
import { ComboboxMolecule } from '../../../design-system/molecules/ComboboxMolecule';
import { NavigationMenuMolecule } from '../../../design-system/molecules/NavigationMenuMolecule';
import { SonnerMolecule, useToast } from '../../../design-system/molecules/SonnerMolecule';
import { Button } from '../../../design-system/atoms/Button';
import { useThemeEditor } from '../../../core/context/ThemeEditorContext';

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
    <div style={getContainerStyles()}>
      {/* Accordion Molecule */}
      <section style={getSectionStyles()}>
        <h2 style={getSectionHeaderStyles()}>Accordion Molecule</h2>
        <AccordionMolecule 
          items={accordionItems}
          variant="card"
          animated={true}
        />
      </section>

      {/* Date Picker Molecule */}
      <section style={getSectionStyles()}>
        <h2 style={getSectionHeaderStyles()}>Date Picker Molecule</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: mediumSpacing }}>
          <DatePickerMolecule
            value={selectedDate}
            onChange={setSelectedDate}
            label="Fecha básica"
            placeholder="Selecciona una fecha"
          />
          <DatePickerMolecule
            value={selectedDate}
            onChange={setSelectedDate}
            variant="datetime"
            label="Fecha y hora"
            placeholder="Selecciona fecha y hora"
          />
          <DatePickerMolecule
            value={selectedDate}
            onChange={setSelectedDate}
            variant="inline"
            label="Calendario inline"
            clearable={true}
          />
        </div>
      </section>

      {/* Pagination Molecule */}
      <section style={getSectionStyles()}>
        <h2 style={getSectionHeaderStyles()}>Pagination Molecule</h2>
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
      </section>

      {/* Dropdown Menu Molecule */}
      <section style={getSectionStyles()}>
        <h2 style={getSectionHeaderStyles()}>Dropdown Menu Molecule</h2>
        <div style={{ display: 'flex', gap: mediumSpacing, flexWrap: 'wrap' }}>
          <DropdownMenuMolecule
            items={ExampleMenuItems.userMenu}
            variant="user"
          />
          <DropdownMenuMolecule
            items={ExampleMenuItems.actionsMenu}
            variant="actions"
          />
          <DropdownMenuMolecule
            items={[
              { id: 'new', label: 'Nuevo documento', icon: <FileText className="h-4 w-4" />, type: 'item' as const },
              { id: 'separator1', label: '', type: 'separator' as const },
              { id: 'recent1', label: 'Documento 1', type: 'checkbox' as const, checked: true },
              { id: 'recent2', label: 'Documento 2', type: 'checkbox' as const },
              { id: 'recent3', label: 'Documento 3', type: 'checkbox' as const }
            ]}
            variant="default"
            trigger={
              <Button variant="outline">
                <FileText className="h-4 w-4" />
                Documentos
              </Button>
            }
          />
        </div>
      </section>

      {/* Tabs Molecule */}
      <section style={getSectionStyles()}>
        <h2 style={getSectionHeaderStyles()}>Tabs Molecule</h2>
        <TabsMolecule
          tabs={tabItems}
          variant="underline"
          addable={true}
          onTabAdd={() => console.log('Añadir tab')}
          onTabClose={(tabId) => console.log('Cerrar tab:', tabId)}
        />
      </section>

      {/* Combobox Molecule */}
      <section style={getSectionStyles()}>
        <h2 style={getSectionHeaderStyles()}>Combobox Molecule</h2>
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
            onChange={setMultiSelectValue}
            variant="multiple"
            placeholder="Selecciona múltiples..."
            maxSelections={3}
          />
        </div>
      </section>

      {/* Navigation Menu Molecule */}
      <section style={getSectionStyles()}>
        <h2 style={getSectionHeaderStyles()}>Navigation Menu Molecule</h2>
        <NavigationMenuMolecule
          items={navigationItems}
          variant="featured"
        />
      </section>

      {/* Sonner (Toast) Molecule */}
      <section style={getSectionStyles()}>
        <h2 style={getSectionHeaderStyles()}>Sonner (Toast) Molecule</h2>
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
      </section>
    </div>
  );
}