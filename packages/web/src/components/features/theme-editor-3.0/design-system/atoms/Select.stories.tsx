/**
 * Select Component Stories - ETAPA 5: Documentation & Polish
 *
 * Stories que documentan las props EXISTENTES del Select component
 * SIN modificar funcionalidad - solo documentando el estado actual
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Select, MemoizedSelect, SelectOption } from './Select';
import React from 'react';

// Sample data para las stories
const basicOptions: SelectOption[] = [
  { value: 'default', label: 'Default Theme' },
  { value: 'dark', label: 'Dark Theme' },
  { value: 'light', label: 'Light Theme' },
  { value: 'custom', label: 'Custom Theme' },
];

const themeOptions: SelectOption[] = [
  { value: 'modern', label: 'Modern Design' },
  { value: 'classic', label: 'Classic Design' },
  { value: 'minimal', label: 'Minimal Design' },
  { value: 'colorful', label: 'Colorful Design' },
  { value: 'corporate', label: 'Corporate Design', disabled: true },
  { value: 'experimental', label: 'Experimental Design' },
];

const colorOptions: SelectOption[] = [
  { value: '#3B82F6', label: '🔵 Blue' },
  { value: '#EF4444', label: '🔴 Red' },
  { value: '#10B981', label: '🟢 Green' },
  { value: '#F59E0B', label: '🟡 Yellow' },
  { value: '#8B5CF6', label: '🟣 Purple' },
  { value: '#F97316', label: '🟠 Orange' },
];

const sizeOptions: SelectOption[] = [
  { value: 'xs', label: 'Extra Small' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
];

const meta: Meta<typeof Select> = {
  title: 'Theme Editor 3.0/Atoms/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Select Component

Componente de selección desplegable con soporte completo para accesibilidad, navegación por teclado, estados de validación y opciones deshabilitadas.

## Características Implementadas (ETAPA 2-4)
- ✅ WCAG 2.1 AA compliance
- ✅ Navegación por teclado (Enter, Space, Arrow keys, Escape)
- ✅ Focus indicators adaptativos por estado de validación
- ✅ Estados de validación con prioridad automática
- ✅ Soporte para opciones deshabilitadas
- ✅ Dropdown con selección visual activa
- ✅ Performance optimizado (MemoizedSelect)
- ✅ Click outside para cerrar dropdown
- ✅ Controlled y Uncontrolled mode

## Uso
\`\`\`tsx
import { Select, MemoizedSelect } from './Select';

// Componente estándar
<Select options={options} onValueChange={handleChange} />

// Versión optimizada
<MemoizedSelect options={options} variant="default" />
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    options: {
      control: false,
      description: 'Array de opciones con value, label y disabled opcional',
    },
    value: {
      control: 'text',
      description: 'Valor controlado del select',
    },
    defaultValue: {
      control: 'text',
      description: 'Valor por defecto para modo no controlado',
    },
    placeholder: {
      control: 'text',
      description: 'Texto mostrado cuando no hay selección',
    },
    variant: {
      control: 'select',
      options: ['default', 'ghost', 'filled'],
      description: 'Variante visual del select (sobrescrita automáticamente por estados de validación)',
    },
    selectSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño del select - afecta altura y padding',
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado',
    },
    isInvalid: {
      control: 'boolean',
      description: 'Estado de error (prioridad máxima) - automáticamente aplica estilo de error',
    },
    isValid: {
      control: 'boolean',
      description: 'Estado de validación exitosa - aplica estilo de éxito',
    },
    isWarning: {
      control: 'boolean',
      description: 'Estado de advertencia - aplica estilo de warning',
    },
    'aria-label': {
      control: 'text',
      description: 'Etiqueta accesible (auto-generada si no se especifica)',
    },
    'aria-describedby': {
      control: 'text',
      description: 'ID del elemento de descripción (añadida en ETAPA 2)',
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Estado de validación para screen readers (automático basado en isInvalid)',
    },
    'aria-required': {
      control: 'boolean',
      description: 'Indica campo requerido para screen readers',
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// ===== VARIANTES BÁSICAS =====
export const Default: Story = {
  args: {
    options: basicOptions,
    placeholder: 'Choose a theme...',
    variant: 'default',
  },
};

export const Ghost: Story = {
  args: {
    options: basicOptions,
    placeholder: 'Transparent style...',
    variant: 'ghost',
  },
  parameters: {
    docs: {
      description: {
        story: 'Variante ghost con fondo transparente hasta hover/focus',
      },
    },
  },
};

export const Filled: Story = {
  args: {
    options: basicOptions,
    placeholder: 'Filled background...',
    variant: 'filled',
  },
  parameters: {
    docs: {
      description: {
        story: 'Variante filled con fondo gris que se despeja al focus',
      },
    },
  },
};

// ===== TAMAÑOS =====
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '250px' }}>
      <Select
        options={basicOptions}
        selectSize="sm"
        placeholder="Small select"
        defaultValue="default"
      />
      <Select
        options={basicOptions}
        selectSize="md"
        placeholder="Medium select"
        defaultValue="dark"
      />
      <Select
        options={basicOptions}
        selectSize="lg"
        placeholder="Large select"
        defaultValue="light"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes tamaños: sm (32px), md (40px), lg (48px) con ajustes de padding',
      },
    },
  },
};

// ===== ESTADOS DE VALIDACIÓN =====
export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <div>
        <Select
          options={themeOptions}
          placeholder="Normal state"
          variant="default"
        />
        <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
          Estado inicial sin validación
        </div>
      </div>

      <div>
        <Select
          options={themeOptions}
          placeholder="Select theme"
          isInvalid={true}
          aria-describedby="theme-error"
          value=""
        />
        <div id="theme-error" style={{ fontSize: '0.875rem', color: '#dc2626', marginTop: '0.25rem' }}>
          Please select a theme
        </div>
      </div>

      <div>
        <Select
          options={themeOptions}
          placeholder="Select theme"
          isWarning={true}
          aria-describedby="theme-warning"
          value="experimental"
        />
        <div id="theme-warning" style={{ fontSize: '0.875rem', color: '#d97706', marginTop: '0.25rem' }}>
          Experimental themes may have bugs
        </div>
      </div>

      <div>
        <Select
          options={themeOptions}
          placeholder="Select theme"
          isValid={true}
          aria-describedby="theme-success"
          value="modern"
        />
        <div id="theme-success" style={{ fontSize: '0.875rem', color: '#16a34a', marginTop: '0.25rem' }}>
          Great choice! Modern theme selected
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Sistema de validación con prioridad automática:
1. isInvalid → error styling (máxima prioridad)
2. isWarning → warning styling
3. isValid → success styling
4. Default → variant prop`,
      },
    },
  },
};

export const ValidationPriority: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <div>
        <h4>Prioridad de Estados de Validación</h4>
        <p style={{ fontSize: '0.875rem', color: '#666' }}>
          Cuando múltiples estados están activos, se aplica la prioridad automática:
        </p>
      </div>

      <Select
        options={themeOptions}
        placeholder="Error tiene máxima prioridad"
        isInvalid={true}
        isWarning={true}
        isValid={true}
        value="modern"
      />

      <Select
        options={themeOptions}
        placeholder="Warning sin error"
        isWarning={true}
        isValid={true}
        value="classic"
      />

      <Select
        options={themeOptions}
        placeholder="Success sin error ni warning"
        isValid={true}
        value="minimal"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demostración del sistema de prioridad automática de estados de validación',
      },
    },
  },
};

// ===== OPCIONES DESHABILITADAS =====
export const DisabledOptions: Story = {
  args: {
    options: themeOptions, // Incluye 'corporate' deshabilitada
    placeholder: 'Some options are disabled...',
    defaultValue: 'modern',
  },
  parameters: {
    docs: {
      description: {
        story: 'Opciones individuales pueden estar deshabilitadas con visual feedback',
      },
    },
  },
};

export const DisabledSelect: Story = {
  args: {
    options: basicOptions,
    placeholder: 'This select is disabled',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Select completamente deshabilitado con opacidad y cursor not-allowed',
      },
    },
  },
};

// ===== MODO CONTROLADO VS NO CONTROLADO =====
export const ControlledMode: Story = {
  render: () => {
    const [selectedTheme, setSelectedTheme] = React.useState('dark');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
        <h4>Controlled Select</h4>
        <Select
          options={basicOptions}
          value={selectedTheme}
          onValueChange={setSelectedTheme}
          placeholder="Controlled by React state"
        />
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          Current value: <strong>{selectedTheme}</strong>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button
            onClick={() => setSelectedTheme('light')}
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            Set Light
          </button>
          <button
            onClick={() => setSelectedTheme('dark')}
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            Set Dark
          </button>
          <button
            onClick={() => setSelectedTheme('')}
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            Clear
          </button>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Select controlado por React state con controles externos para cambiar valor',
      },
    },
  },
};

export const UncontrolledMode: Story = {
  render: () => {
    const [lastChange, setLastChange] = React.useState('');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
        <h4>Uncontrolled Select</h4>
        <Select
          options={basicOptions}
          defaultValue="custom"
          onValueChange={(value) => setLastChange(`Changed to: ${value}`)}
          placeholder="Uncontrolled with defaultValue"
        />
        {lastChange && (
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            {lastChange}
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Select no controlado con defaultValue - maneja su propio estado interno',
      },
    },
  },
};

// ===== NAVEGACIÓN POR TECLADO =====
export const KeyboardNavigation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <h4>Navegación por Teclado</h4>
      <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
        <strong>Teclas soportadas:</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
          <li><kbd>Enter</kbd> o <kbd>Space</kbd> - Abrir/cerrar dropdown</li>
          <li><kbd>↓</kbd> - Navegar hacia abajo</li>
          <li><kbd>↑</kbd> - Navegar hacia arriba</li>
          <li><kbd>Escape</kbd> - Cerrar dropdown</li>
        </ul>
      </div>

      <Select
        options={colorOptions}
        placeholder="Try keyboard navigation..."
        aria-label="Color selection with keyboard navigation"
      />

      <div style={{ fontSize: '0.875rem', color: '#666' }}>
        Haz clic en el select y usa las teclas de flecha para navegar
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Navegación completa por teclado con soporte para todas las teclas estándar',
      },
    },
  },
};

// ===== ACCESIBILIDAD =====
export const AccessibilityFeatures: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <div>
        <h4>Auto-generated Accessibility</h4>
        <Select
          options={basicOptions}
          placeholder="Auto aria-label"
        />
        <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
          Automáticamente agrega aria-label="Select an option"
        </div>
      </div>

      <div>
        <h4>Custom Accessibility</h4>
        <Select
          options={themeOptions}
          placeholder="Select your theme"
          aria-label="Theme selection dropdown"
          aria-describedby="theme-help"
          aria-required={true}
        />
        <div id="theme-help" style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
          Choose the visual theme for your application
        </div>
      </div>

      <div>
        <h4>Validation Accessibility</h4>
        <Select
          options={basicOptions}
          placeholder="Required field"
          isInvalid={true}
          aria-describedby="select-error"
          aria-required={true}
          aria-invalid={true}
        />
        <div id="select-error" style={{ fontSize: '0.875rem', color: '#dc2626', marginTop: '0.25rem' }}>
          Please select an option
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Características de accesibilidad WCAG 2.1 AA:
- Auto-generated aria-labels
- role="combobox" y role="listbox" apropiados
- aria-expanded, aria-haspopup automáticos
- Soporte completo para screen readers`,
      },
    },
  },
};

// ===== CASOS DE USO REALES =====
export const ThemeEditorSelectors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h4>Theme Editor - Configuration Selects</h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
            Base Theme
          </label>
          <Select
            options={themeOptions}
            defaultValue="modern"
            aria-label="Base theme selection"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
            Primary Color
          </label>
          <Select
            options={colorOptions}
            defaultValue="#3B82F6"
            aria-label="Primary color selection"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
            Component Size
          </label>
          <Select
            options={sizeOptions}
            defaultValue="md"
            selectSize="sm"
            aria-label="Component size selection"
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
          Export Format
        </label>
        <Select
          options={[
            { value: 'css', label: '📄 CSS Variables' },
            { value: 'json', label: '🔧 JSON Config' },
            { value: 'tailwind', label: '💨 Tailwind Config' },
            { value: 'scss', label: '🎨 SCSS Variables' },
          ]}
          placeholder="Choose export format..."
          variant="filled"
          aria-label="Export format selection"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Casos de uso reales del Theme Editor con diferentes tipos de selecciones',
      },
    },
  },
};

export const FilteringSelector: Story = {
  render: () => {
    const [selectedCategory, setSelectedCategory] = React.useState('');

    const categories = [
      { value: 'colors', label: '🎨 Colors' },
      { value: 'typography', label: '📝 Typography' },
      { value: 'spacing', label: '📏 Spacing' },
      { value: 'borders', label: '🔲 Borders' },
      { value: 'shadows', label: '✨ Shadows' },
    ];

    return (
      <div style={{ width: '300px' }}>
        <h4>Theme Category Filter</h4>
        <Select
          options={categories}
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          placeholder="Filter by category..."
          variant="ghost"
          aria-label="Theme category filter"
        />
        {selectedCategory && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '4px',
            fontSize: '0.875rem'
          }}>
            Showing settings for: <strong>{categories.find(c => c.value === selectedCategory)?.label}</strong>
            <br />
            <button
              onClick={() => setSelectedCategory('')}
              style={{
                marginTop: '0.5rem',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Select usado como filtro con actualización de contenido dinámico',
      },
    },
  },
};

// ===== PERFORMANCE OPTIMIZATION =====
export const PerformanceComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h4>Componente Original</h4>
      <Select options={themeOptions} placeholder="Standard Select" />

      <h4>Componente Optimizado (ETAPA 3)</h4>
      <MemoizedSelect options={themeOptions} placeholder="Memoized Select" />

      <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
        MemoizedSelect previene re-renders innecesarios usando React.memo()
        con comparación optimizada de props críticas y shallow comparison de options array.
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Comparación entre componente original y optimizado:
- MemoizedSelect usa React.memo() con comparación personalizada
- Optimización específica para arrays de opciones
- Previene re-renders cuando opciones no cambian
- Recomendado para selects con opciones complejas o frecuentes updates`,
      },
    },
  },
};

// ===== TESTING SHOWCASE =====
export const TestingCoverage: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h4>Cobertura de Testing (ETAPA 4)</h4>
      <div style={{ fontSize: '0.875rem', color: '#666' }}>
        <strong>Casos de prueba implementados:</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
          <li>✅ Todas las combinaciones variant × selectSize</li>
          <li>✅ Estados de validación con todas las variantes</li>
          <li>✅ Navegación por teclado completa</li>
          <li>✅ Opciones deshabilitadas y select deshabilitado</li>
          <li>✅ Controlled vs Uncontrolled modes</li>
          <li>✅ Click outside para cerrar dropdown</li>
          <li>✅ Accesibilidad WCAG AA compliance</li>
          <li>✅ Performance optimization testing</li>
        </ul>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem', marginTop: '1rem' }}>
        <Select options={[{value:'test1', label:'Tested ✅'}]} selectSize="sm" variant="default" defaultValue="test1" />
        <Select options={[{value:'test2', label:'Tested ✅'}]} selectSize="md" variant="ghost" defaultValue="test2" />
        <Select options={[{value:'test3', label:'Tested ✅'}]} selectSize="lg" isValid={true} defaultValue="test3" />
        <Select options={[{value:'test4', label:'Tested ✅'}]} isInvalid={true} defaultValue="test4" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demostración de la cobertura exhaustiva de testing implementada en ETAPA 4',
      },
    },
  },
};

// ===== TODAS LAS VARIANTES =====
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
      <Select options={basicOptions} variant="default" placeholder="Default variant" />
      <Select options={basicOptions} variant="ghost" placeholder="Ghost variant" />
      <Select options={basicOptions} variant="filled" placeholder="Filled variant" />
      <Select options={basicOptions} isInvalid={true} placeholder="Error state" />
      <Select options={basicOptions} isValid={true} defaultValue="default" />
      <Select options={basicOptions} isWarning={true} defaultValue="custom" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Todas las variantes y estados disponibles en el Select component',
      },
    },
  },
};