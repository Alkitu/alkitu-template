/**
 * Button Component Stories - ETAPA 5: Documentation & Polish
 *
 * Stories que documentan las props EXISTENTES del Button component
 * SIN modificar funcionalidad - solo documentando el estado actual
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Button, MemoizedButton } from './Button';
import React from 'react';

// Icons para las stories (usando emojis para evitar dependencias)
const HomeIcon = () => <span>🏠</span>;
const SearchIcon = () => <span>🔍</span>;
const SaveIcon = () => <span>💾</span>;
const DeleteIcon = () => <span>🗑️</span>;

const meta: Meta<typeof Button> = {
  title: 'Theme Editor 3.0/Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Button Component

Botón interactivo con soporte completo para accesibilidad, estados de carga, iconos y múltiples variantes.

## Características Implementadas (ETAPA 2-4)
- ✅ WCAG 2.1 AA compliance
- ✅ Navegación por teclado (Enter, Space)
- ✅ Focus indicators adaptativos
- ✅ Estados de loading con spinner
- ✅ Soporte para iconos
- ✅ Performance optimizado (MemoizedButton)
- ✅ 49 pruebas de edge cases

## Uso
\`\`\`tsx
import { Button, MemoizedButton } from './Button';

// Componente estándar
<Button variant="default">Click me</Button>

// Versión optimizada
<MemoizedButton variant="default">Optimized</MemoizedButton>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'destructive', 'secondary', 'loading', 'icon'],
      description: 'Variante visual del botón',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Tamaño del botón',
    },
    loading: {
      control: 'boolean',
      description: 'Estado de carga con spinner automático',
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado',
    },
    icon: {
      control: false,
      description: 'Icono a mostrar (React.ReactNode)',
    },
    children: {
      control: 'text',
      description: 'Contenido del botón',
    },
    'aria-label': {
      control: 'text',
      description: 'Etiqueta accesible (añadida en ETAPA 2)',
    },
    'aria-describedby': {
      control: 'text',
      description: 'ID del elemento de descripción (añadida en ETAPA 2)',
    },
    'aria-live': {
      control: 'select',
      options: ['off', 'polite', 'assertive'],
      description: 'Tipo de anuncio para screen readers (añadida en ETAPA 2)',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ===== VARIANTES BÁSICAS =====
export const Default: Story = {
  args: {
    children: 'Default Button',
    variant: 'default',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Delete Theme',
    variant: 'destructive',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

// ===== TAMAÑOS =====
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes tamaños disponibles: sm (36px), default (40px), lg (44px)',
      },
    },
  },
};

// ===== ESTADOS =====
export const Loading: Story = {
  args: {
    children: 'Saving Theme...',
    loading: true,
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Estado de loading con spinner automático y aria-busy="true"',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Estado deshabilitado con aria-disabled="true" y cursor: not-allowed',
      },
    },
  },
};

export const LoadingAndDisabled: Story = {
  args: {
    children: 'Processing...',
    loading: true,
    disabled: true,
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Combinación de loading y disabled - común durante operaciones async',
      },
    },
  },
};

// ===== CON ICONOS =====
export const WithIcon: Story = {
  args: {
    children: 'Save Theme',
    icon: React.createElement(SaveIcon),
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón con icono izquierdo - el spacing se ajusta automáticamente',
      },
    },
  },
};

export const IconOnly: Story = {
  args: {
    icon: React.createElement(HomeIcon),
    variant: 'icon',
    size: 'icon',
    'aria-label': 'Go to home',
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón solo-icono con aria-label obligatorio para accesibilidad',
      },
    },
  },
};

export const IconSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button icon={React.createElement(SearchIcon)} size="sm">Small</Button>
      <Button icon={React.createElement(SearchIcon)} size="default">Default</Button>
      <Button icon={React.createElement(SearchIcon)} size="lg">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Iconos adaptativos a diferentes tamaños de botón',
      },
    },
  },
};

// ===== ACCESIBILIDAD =====
export const AccessibilityFeatures: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
      <Button
        variant="default"
        aria-label="Save current theme configuration"
        aria-describedby="save-help"
      >
        Save Theme
      </Button>
      <div id="save-help" style={{ fontSize: '0.875rem', color: '#666' }}>
        This will save your current theme settings permanently
      </div>

      <Button
        variant="icon"
        size="icon"
        icon={React.createElement(() => <span>🌙</span>)}
        aria-label="Toggle dark mode"
        aria-pressed="false"
      />

      <Button
        variant="default"
        loading={true}
        aria-live="polite"
      >
        Applying Theme...
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Características de accesibilidad implementadas en ETAPA 2:
- aria-label para botones descriptivos
- aria-describedby para contexto adicional
- aria-pressed para botones toggle
- aria-live para anuncios de estado
- Focus indicators automáticos
        `,
      },
    },
  },
};

// ===== CASOS DE USO REALES =====
export const ThemeEditorActions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button variant="ghost" size="sm" icon={React.createElement(() => <span>🎨</span>)}>
          Pick Color
        </Button>
        <Button variant="outline" size="sm">
          Preview
        </Button>
        <Button variant="default" size="sm">
          Apply
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button variant="outline">
          Export Theme
        </Button>
        <Button variant="secondary">
          Import Theme
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button variant="default" loading={false}>
          Save Custom Theme
        </Button>
        <Button variant="destructive">
          Reset to Default
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Casos de uso reales del Theme Editor con combinaciones típicas',
      },
    },
  },
};

export const FormIntegration: Story = {
  render: () => (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
      <input
        type="text"
        placeholder="Theme name"
        style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
      />

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button type="submit" variant="default">
          Create Theme
        </Button>
        <Button type="reset" variant="outline">
          Reset Form
        </Button>
        <Button type="button" variant="ghost">
          Cancel
        </Button>
      </div>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Integración con formularios usando type="submit", "reset", "button"',
      },
    },
  },
};

// ===== PERFORMANCE OPTIMIZATION =====
export const PerformanceComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h4>Componente Original</h4>
      <Button variant="default">Standard Button</Button>

      <h4>Componente Optimizado (ETAPA 3)</h4>
      <MemoizedButton variant="default">Memoized Button</MemoizedButton>

      <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
        MemoizedButton previene re-renders innecesarios usando React.memo()
        con comparación optimizada de props críticas.
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Comparación entre componente original y optimizado:
- MemoizedButton usa React.memo() para prevenir re-renders
- Comparación inteligente de props críticas
- API idéntica al componente original
- Recomendado para workflows intensivos del Theme Editor
        `,
      },
    },
  },
};

// ===== TODAS LAS VARIANTES =====
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="loading" loading={true}>Loading</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Todas las variantes disponibles en el Button component',
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
        <strong>49 pruebas de edge cases implementadas:</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
          <li>✅ Todas las combinaciones variant × size</li>
          <li>✅ Estados loading con todas las variantes</li>
          <li>✅ Estados disabled con combinaciones</li>
          <li>✅ Casos de iconos (tipos, tamaños, solo-icono)</li>
          <li>✅ Event handlers múltiples</li>
          <li>✅ Propiedades de accesibilidad completas</li>
          <li>✅ Integración con formularios</li>
          <li>✅ Casos de performance complejos</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Button variant="default" size="sm">Tested ✅</Button>
        <Button variant="outline" size="default">Tested ✅</Button>
        <Button variant="ghost" size="lg">Tested ✅</Button>
        <Button variant="destructive" loading={true}>Tested ✅</Button>
        <Button variant="icon" size="icon" icon={React.createElement(() => <span>✅</span>)} aria-label="All tested" />
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