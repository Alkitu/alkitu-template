/**
 * Input Component Stories - ETAPA 5: Documentation & Polish
 *
 * Stories que documentan las props EXISTENTES del Input component
 * SIN modificar funcionalidad - solo documentando el estado actual
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Input, MemoizedInput } from './Input';
import React from 'react';

// Icons para las stories (usando emojis para evitar dependencias)
const SearchIcon = () => <span>🔍</span>;
const UserIcon = () => <span>👤</span>;
const LockIcon = () => <span>🔒</span>;
const CheckIcon = () => <span>✅</span>;
const PaletteIcon = () => <span>🎨</span>;
const EmailIcon = () => <span>📧</span>;
const PhoneIcon = () => <span>📞</span>;
const ClearIcon = () => <span>✖️</span>;

const meta: Meta<typeof Input> = {
  title: 'Theme Editor 3.0/Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Input Component

Campo de entrada de datos con soporte completo para validación, iconos, estados visuales y accesibilidad. Incluye funcionalidad especializada para campos de contraseña con toggle de visibilidad.

## Características Implementadas (ETAPA 2-4)
- ✅ WCAG 2.1 AA compliance
- ✅ Auto-generated accessibility labels
- ✅ Validation state system con prioridad automática
- ✅ Soporte para iconos izquierdos y derechos
- ✅ Password toggle con Eye/EyeOff
- ✅ Performance optimizado (MemoizedInput)
- ✅ 59 pruebas de edge cases
- ✅ Soporte para todos los tipos HTML5

## Uso
\`\`\`tsx
import { Input, MemoizedInput } from './Input';

// Componente estándar
<Input type="text" variant="default" />

// Versión optimizada
<MemoizedInput type="email" inputSize="lg" />
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning', 'ghost', 'filled'],
      description: 'Variante visual del input (determinada automáticamente por estados de validación)',
    },
    inputSize: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Tamaño del input - afecta altura, padding y font-size',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time', 'color', 'file'],
      description: 'Tipo de input HTML5 - determina validación y comportamiento',
    },
    isInvalid: {
      control: 'boolean',
      description: 'Estado de error (prioridad máxima) - automáticamente aplica variant="error"',
    },
    isValid: {
      control: 'boolean',
      description: 'Estado de validación exitosa - aplica variant="success"',
    },
    isWarning: {
      control: 'boolean',
      description: 'Estado de advertencia - aplica variant="warning"',
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado',
    },
    leftIcon: {
      control: false,
      description: 'Icono izquierdo (React.ReactNode)',
    },
    rightIcon: {
      control: false,
      description: 'Icono derecho (React.ReactNode)',
    },
    showPasswordToggle: {
      control: 'boolean',
      description: 'Muestra toggle para campos de contraseña (solo type="password")',
    },
    placeholder: {
      control: 'text',
      description: 'Texto de placeholder',
    },
    'aria-label': {
      control: 'text',
      description: 'Etiqueta accesible (auto-generada por tipo si no se especifica)',
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
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// ===== VARIANTES BÁSICAS =====
export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    variant: 'default',
  },
};

export const Error: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    variant: 'error',
  },
  parameters: {
    docs: {
      description: {
        story: 'Variante de error con bordes y focus rojos para validación fallida',
      },
    },
  },
};

export const Success: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    variant: 'success',
    value: 'Valid input',
  },
  parameters: {
    docs: {
      description: {
        story: 'Variante de éxito con bordes y focus verdes para validación exitosa',
      },
    },
  },
};

export const Warning: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    variant: 'warning',
    value: 'Warning state',
  },
  parameters: {
    docs: {
      description: {
        story: 'Variante de advertencia con bordes y focus amarillos',
      },
    },
  },
};

export const Ghost: Story = {
  args: {
    type: 'text',
    placeholder: 'Transparent until focus...',
    variant: 'ghost',
  },
  parameters: {
    docs: {
      description: {
        story: 'Campo transparente que se activa al hacer focus',
      },
    },
  },
};

export const Filled: Story = {
  args: {
    type: 'text',
    placeholder: 'Filled background...',
    variant: 'filled',
  },
  parameters: {
    docs: {
      description: {
        story: 'Campo con fondo gris que se despeja al focus',
      },
    },
  },
};

// ===== TAMAÑOS =====
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <Input inputSize="sm" placeholder="Small input (36px height)" />
      <Input inputSize="default" placeholder="Default input (40px height)" />
      <Input inputSize="lg" placeholder="Large input (48px height)" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes tamaños: sm (36px), default (40px), lg (48px) con padding y font-size adaptativos',
      },
    },
  },
};

// ===== TIPOS DE INPUT =====
export const InputTypes: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
      <Input type="text" placeholder="Text input" />
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
      <Input type="number" placeholder="Number input" />
      <Input type="tel" placeholder="Phone input" />
      <Input type="url" placeholder="URL input" />
      <Input type="search" placeholder="Search input" />
      <Input type="date" />
      <Input type="time" />
      <Input type="color" defaultValue="#3b82f6" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Todos los tipos de input HTML5 soportados con validación y comportamiento específico',
      },
    },
  },
};

// ===== ESTADOS DE VALIDACIÓN =====
export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <div>
        <Input
          type="text"
          placeholder="Normal state"
          variant="default"
        />
        <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
          Estado inicial sin validación
        </div>
      </div>

      <div>
        <Input
          type="email"
          placeholder="Enter email"
          isInvalid={true}
          aria-describedby="email-error"
          value="invalid-email"
        />
        <div id="email-error" style={{ fontSize: '0.875rem', color: '#dc2626', marginTop: '0.25rem' }}>
          Please enter a valid email address
        </div>
      </div>

      <div>
        <Input
          type="text"
          placeholder="Enter name"
          isWarning={true}
          aria-describedby="name-warning"
          value="J"
        />
        <div id="name-warning" style={{ fontSize: '0.875rem', color: '#d97706', marginTop: '0.25rem' }}>
          Name should be at least 3 characters
        </div>
      </div>

      <div>
        <Input
          type="email"
          placeholder="Enter email"
          isValid={true}
          aria-describedby="email-success"
          value="user@example.com"
        />
        <div id="email-success" style={{ fontSize: '0.875rem', color: '#16a34a', marginTop: '0.25rem' }}>
          Email format is valid
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Sistema de validación con prioridad automática:
1. isInvalid → error variant (máxima prioridad)
2. isWarning → warning variant
3. isValid → success variant
4. Default → variant prop`,
      },
    },
  },
};

export const ValidationPriority: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <div>
        <h4>Prioridad de Estados de Validación</h4>
        <p style={{ fontSize: '0.875rem', color: '#666' }}>
          Cuando múltiples estados están activos, se aplica la prioridad automática:
        </p>
      </div>

      <Input
        type="text"
        placeholder="Error tiene máxima prioridad"
        isInvalid={true}
        isWarning={true}
        isValid={true}
        value="Multiple states - shows error"
      />

      <Input
        type="text"
        placeholder="Warning sin error"
        isWarning={true}
        isValid={true}
        value="Warning + Valid - shows warning"
      />

      <Input
        type="text"
        placeholder="Success sin error ni warning"
        isValid={true}
        value="Only valid - shows success"
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

// ===== ICONOS =====
export const WithLeftIcon: Story = {
  args: {
    type: 'search',
    placeholder: 'Search themes...',
    leftIcon: React.createElement(SearchIcon),
  },
  parameters: {
    docs: {
      description: {
        story: 'Input con icono izquierdo - el padding se ajusta automáticamente',
      },
    },
  },
};

export const WithRightIcon: Story = {
  args: {
    type: 'text',
    placeholder: 'Validated input',
    rightIcon: React.createElement(CheckIcon),
    isValid: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Input con icono derecho - común para indicadores de estado',
      },
    },
  },
};

export const WithBothIcons: Story = {
  args: {
    type: 'text',
    placeholder: 'User validated',
    leftIcon: React.createElement(UserIcon),
    rightIcon: React.createElement(CheckIcon),
    isValid: true,
    value: 'john_doe',
  },
  parameters: {
    docs: {
      description: {
        story: 'Input con ambos iconos - izquierdo para tipo, derecho para estado',
      },
    },
  },
};

export const IconSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <Input
        inputSize="sm"
        leftIcon={React.createElement(UserIcon)}
        placeholder="Small with icon"
      />
      <Input
        inputSize="default"
        leftIcon={React.createElement(UserIcon)}
        placeholder="Default with icon"
      />
      <Input
        inputSize="lg"
        leftIcon={React.createElement(UserIcon)}
        placeholder="Large with icon"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Iconos adaptativos a diferentes tamaños de input',
      },
    },
  },
};

// ===== PASSWORD TOGGLE =====
export const PasswordField: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
    showPasswordToggle: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Campo de contraseña con toggle de visibilidad automático',
      },
    },
  },
};

export const PasswordWithIcon: Story = {
  args: {
    type: 'password',
    placeholder: 'Secure password',
    leftIcon: React.createElement(LockIcon),
    showPasswordToggle: true,
    value: 'secretpassword123',
  },
  parameters: {
    docs: {
      description: {
        story: 'Contraseña con icono izquierdo y toggle - compatible con todos los iconos',
      },
    },
  },
};

export const PasswordStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <Input
        type="password"
        placeholder="Valid password"
        showPasswordToggle={true}
        isValid={true}
        value="strongpassword123"
      />
      <Input
        type="password"
        placeholder="Invalid password"
        showPasswordToggle={true}
        isInvalid={true}
        value="weak"
      />
      <Input
        type="password"
        placeholder="Password warning"
        showPasswordToggle={true}
        isWarning={true}
        value="password123"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Password toggle compatible con todos los estados de validación',
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
        <Input type="email" placeholder="Auto aria-label" />
        <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
          Automáticamente agrega aria-label="Email address"
        </div>
      </div>

      <div>
        <h4>Custom Accessibility</h4>
        <Input
          type="text"
          placeholder="Theme name"
          aria-label="Custom theme name"
          aria-describedby="theme-help"
          aria-required={true}
        />
        <div id="theme-help" style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
          Choose a unique name for your theme
        </div>
      </div>

      <div>
        <h4>Validation Accessibility</h4>
        <Input
          type="text"
          placeholder="Required field"
          isInvalid={true}
          aria-describedby="error-message"
          aria-required={true}
        />
        <div id="error-message" style={{ fontSize: '0.875rem', color: '#dc2626', marginTop: '0.25rem' }}>
          This field is required
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Características de accesibilidad WCAG 2.1 AA:
- Auto-generated aria-labels por tipo
- aria-invalid automático basado en isInvalid
- Soporte completo para aria-describedby
- Focus indicators adaptativos`,
      },
    },
  },
};

// ===== CASOS DE USO REALES =====
export const ThemeEditorInputs: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h4>Theme Editor - Color Inputs</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <Input
          type="color"
          defaultValue="#3b82f6"
          aria-label="Primary theme color"
          leftIcon={React.createElement(PaletteIcon)}
        />
        <Input
          type="color"
          defaultValue="#ef4444"
          aria-label="Accent theme color"
          leftIcon={React.createElement(PaletteIcon)}
        />
      </div>

      <h4>Theme Editor - Settings</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Input
          type="text"
          placeholder="My Beautiful Theme"
          leftIcon={React.createElement(() => <span>🎨</span>)}
          isValid={true}
        />
        <Input
          type="number"
          placeholder="Border radius (px)"
          leftIcon={React.createElement(() => <span>📐</span>)}
          min="0"
          max="50"
          defaultValue="8"
        />
        <Input
          type="range"
          min="0"
          max="100"
          defaultValue="80"
          aria-label="Theme opacity"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Casos de uso específicos del Theme Editor con inputs especializados',
      },
    },
  },
};

export const SearchFunctionality: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = React.useState('');

    return (
      <div style={{ width: '400px' }}>
        <Input
          type="search"
          placeholder="Search themes, colors, styles..."
          leftIcon={React.createElement(SearchIcon)}
          rightIcon={searchQuery && React.createElement(() => (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label="Clear search"
            >
              <ClearIcon />
            </button>
          ))}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
            Searching for: "{searchQuery}"
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Input de búsqueda interactivo con icono de borrar condicional',
      },
    },
  },
};

export const FormIntegration: Story = {
  render: () => (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <h4>Theme Creation Form</h4>

      <Input
        type="text"
        placeholder="Theme name"
        required
        aria-label="Theme name"
        leftIcon={React.createElement(() => <span>🎨</span>)}
      />

      <Input
        type="email"
        placeholder="Author email"
        required
        aria-label="Author email address"
        leftIcon={React.createElement(EmailIcon)}
      />

      <Input
        type="url"
        placeholder="Homepage URL (optional)"
        aria-label="Theme homepage URL"
        leftIcon={React.createElement(() => <span>🌐</span>)}
      />

      <Input
        type="file"
        accept=".json,.theme"
        aria-label="Import existing theme"
      />

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}>
          Create Theme
        </button>
        <button type="reset" style={{ padding: '0.5rem 1rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px' }}>
          Reset
        </button>
      </div>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Integración completa con formularios usando diferentes tipos de input',
      },
    },
  },
};

// ===== PERFORMANCE OPTIMIZATION =====
export const PerformanceComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h4>Componente Original</h4>
      <Input type="text" placeholder="Standard Input" />

      <h4>Componente Optimizado (ETAPA 3)</h4>
      <MemoizedInput type="text" placeholder="Memoized Input" />

      <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
        MemoizedInput previene re-renders innecesarios usando React.memo()
        con comparación optimizada de props críticas (type, value, variant, inputSize, estados de validación).
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Comparación entre componente original y optimizado:
- MemoizedInput usa React.memo() para prevenir re-renders
- Comparación inteligente de props críticas
- API idéntica al componente original
- Recomendado para forms con muchos campos`,
      },
    },
  },
};

// ===== EDGE CASES =====
export const EdgeCases: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <h4>Edge Cases y Casos Límite</h4>

      <div>
        <h5>Input muy largo</h5>
        <Input
          type="text"
          value="This is a very long input value that demonstrates how the component handles extensive text content without breaking the layout or causing overflow issues"
          leftIcon={React.createElement(() => <span>📝</span>)}
        />
      </div>

      <div>
        <h5>Múltiples estados simultáneos</h5>
        <Input
          type="text"
          placeholder="Multiple states"
          isInvalid={true}
          disabled={true}
          showPasswordToggle={true}
          leftIcon={React.createElement(UserIcon)}
        />
      </div>

      <div>
        <h5>Input vacío con iconos</h5>
        <Input
          type="text"
          leftIcon={React.createElement(SearchIcon)}
          rightIcon={React.createElement(CheckIcon)}
          placeholder=""
        />
      </div>

      <div>
        <h5>Valores numéricos extremos</h5>
        <Input
          type="number"
          min="-999999"
          max="999999"
          step="0.01"
          defaultValue="999999"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Edge cases y situaciones límite manejadas por el componente',
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
        <strong>59 pruebas de edge cases implementadas:</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
          <li>✅ Todas las combinaciones variant × inputSize × type</li>
          <li>✅ Estados de validación con todas las variantes</li>
          <li>✅ Password toggle con todos los estados</li>
          <li>✅ Casos de iconos (tipos, posiciones, combinaciones)</li>
          <li>✅ Accesibilidad completa (auto-generated + manual)</li>
          <li>✅ Event handlers múltiples</li>
          <li>✅ Integración con formularios</li>
          <li>✅ Performance optimization testing</li>
        </ul>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem', marginTop: '1rem' }}>
        <Input type="text" placeholder="Tested ✅" variant="default" inputSize="sm" />
        <Input type="email" placeholder="Tested ✅" variant="success" inputSize="default" />
        <Input type="password" placeholder="Tested ✅" variant="error" inputSize="lg" showPasswordToggle={true} />
        <Input type="search" placeholder="Tested ✅" leftIcon={React.createElement(() => <span>✅</span>)} />
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
      <Input variant="default" placeholder="Default variant" />
      <Input variant="error" placeholder="Error variant" />
      <Input variant="success" placeholder="Success variant" value="Valid" />
      <Input variant="warning" placeholder="Warning variant" value="Warning" />
      <Input variant="ghost" placeholder="Ghost variant" />
      <Input variant="filled" placeholder="Filled variant" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Todas las variantes visuales disponibles en el Input component',
      },
    },
  },
};