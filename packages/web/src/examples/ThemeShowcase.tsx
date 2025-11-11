import React from 'react';
import { DynamicThemeProvider } from '../components/providers/DynamicThemeProvider';
import { Button } from '../components/atoms';
import { useCompanyTheme } from '../components/providers/DynamicThemeProvider';

// Diferentes temas de empresa para demostración
const COMPANY_THEMES = {
  default: {
    id: 'default',
    name: 'Alkitu Default',
    companyId: 'alkitu',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lightModeConfig: {
      primary: 'oklch(0.5634 0.1517 146.7438)', // Verde Alkitu
      'primary-foreground': 'oklch(1 0 0)',
      secondary: 'oklch(0.9683 0.0069 247.8956)',
      'secondary-foreground': 'oklch(0.1363 0.0364 259.2010)',
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.1363 0.0364 259.2010)',
      border: 'oklch(0.9288 0.0126 255.5078)',
      ring: 'oklch(0.5634 0.1517 146.7438)',
      radius: '0.5rem',
    },
  },
  tech: {
    id: 'tech',
    name: 'TechCorp Blue',
    companyId: 'techcorp',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lightModeConfig: {
      primary: 'oklch(0.5 0.2 260)', // Azul tech
      'primary-foreground': 'oklch(1 0 0)',
      secondary: 'oklch(0.9683 0.0069 247.8956)',
      'secondary-foreground': 'oklch(0.1363 0.0364 259.2010)',
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.1363 0.0364 259.2010)',
      border: 'oklch(0.9288 0.0126 255.5078)',
      ring: 'oklch(0.5 0.2 260)',
      radius: '0.75rem',
    },
  },
  creative: {
    id: 'creative',
    name: 'Creative Pink',
    companyId: 'creative',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lightModeConfig: {
      primary: 'oklch(0.65 0.2 340)', // Rosa creativo
      'primary-foreground': 'oklch(1 0 0)',
      secondary: 'oklch(0.9683 0.0069 247.8956)',
      'secondary-foreground': 'oklch(0.1363 0.0364 259.2010)',
      background: 'oklch(0.99 0.01 340)',
      foreground: 'oklch(0.1363 0.0364 259.2010)',
      border: 'oklch(0.9288 0.0126 255.5078)',
      ring: 'oklch(0.65 0.2 340)',
      radius: '1rem',
    },
  },
};

const ThemeInfo: React.FC = () => {
  const { theme, tokens } = useCompanyTheme();

  return (
    <div className="mb-6 p-4 bg-muted rounded-lg border">
      <h3 className="font-semibold text-sm text-foreground mb-2">
        Active Theme: {theme?.name}
      </h3>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          Primary: <span className="font-mono">{tokens['primary']}</span>
        </div>
        <div>
          Radius: <span className="font-mono">{tokens['radius']}</span>
        </div>
      </div>
    </div>
  );
};

const ButtonShowcase: React.FC = () => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-foreground">Button Variants</h4>
      <div className="flex gap-3 flex-wrap">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>

      <h4 className="font-medium text-foreground">Sizes</h4>
      <div className="flex gap-3 items-center">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>

      <h4 className="font-medium text-foreground">States</h4>
      <div className="flex gap-3">
        <Button>Normal</Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
      </div>

      <h4 className="font-medium text-foreground">Custom Theme Override</h4>
      <div className="flex gap-3">
        <Button
          themeOverride={{
            primary: 'oklch(0.6 0.2 60)', // Yellow override
            'primary-foreground': 'oklch(0.1 0 0)',
          }}
        >
          Yellow Override
        </Button>
        <Button
          themeOverride={{
            primary: 'oklch(0.5 0.2 180)', // Cyan override
          }}
        >
          Cyan Override
        </Button>
      </div>
    </div>
  );
};

export const ThemeShowcase: React.FC = () => {
  const [selectedTheme, setSelectedTheme] =
    React.useState<keyof typeof COMPANY_THEMES>('default');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Sistema de Temas Dinámico
        </h1>
        <p className="text-muted-foreground">
          Demostración de componentes adaptándose a diferentes temas de empresa
        </p>
      </div>

      {/* Theme selector */}
      <div className="flex justify-center gap-2">
        {Object.entries(COMPANY_THEMES).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => setSelectedTheme(key as keyof typeof COMPANY_THEMES)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              selectedTheme === key
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:bg-muted'
            }`}
          >
            {theme.name}
          </button>
        ))}
      </div>

      {/* Theme showcase with provider */}
      <DynamicThemeProvider themeData={COMPANY_THEMES[selectedTheme]}>
        <div className="bg-background border rounded-xl p-6 transition-colors duration-200">
          <ThemeInfo />
          <ButtonShowcase />
        </div>
      </DynamicThemeProvider>

      {/* Info section */}
      <div className="bg-muted p-6 rounded-lg">
        <h3 className="font-semibold mb-3">✨ Características del Sistema:</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Cambio de temas en tiempo real sin recarga</li>
          <li>• Colores en formato OKLCH para máxima precisión</li>
          <li>• Override de temas por componente individual</li>
          <li>• Integración completa con Tailwind CSS</li>
          <li>• Soporte para temas personalizados por empresa</li>
          <li>• Fallbacks automáticos en caso de error</li>
        </ul>
      </div>
    </div>
  );
};

export default ThemeShowcase;
