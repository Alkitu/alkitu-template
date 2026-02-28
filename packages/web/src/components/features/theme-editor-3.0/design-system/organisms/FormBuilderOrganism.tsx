'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Settings, 
  Eye, 
  Code, 
  Copy, 
  Type,
  CheckSquare,
  Calendar,
  FileText,
  List,
  ToggleLeft,
  Mail,
  Hash,
  Upload,
  ChevronUp,
  ChevronDown,
  Link,
  Phone,
  Search
} from 'lucide-react';

import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/atoms-alianza/Input';
import { Checkbox } from '../atoms/Checkbox';
import { RadioButton } from '@/components/atoms-alianza/RadioButton';
import { Select } from '@/components/atoms-alianza/Select';
import { Toggle } from '@/components/atoms-alianza/Toggle';
import { Badge } from '@/components/atoms-alianza/Badge';
import { Separator } from '@/components/atoms-alianza/Separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/primitives/ui/card';
import { Textarea } from '@/components/primitives/ui/textarea';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';

export type FormFieldType = 
  | 'text' | 'email' | 'password' | 'number' 
  | 'textarea' | 'select' | 'checkbox' | 'radio' 
  | 'date' | 'toggle' | 'divider' | 'file' | 'url' | 'tel';

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    message?: string;
  };
  options?: { label: string; value: string }[];
  defaultValue?: any;
  width?: 'full' | 'half' | 'third';
}

export interface FormBuilderOrganismProps {
  onFormChange?: (fields: FormField[]) => void;
  onFormSubmit?: (formData: any) => void;
  initialFields?: FormField[];
  className?: string;
}

interface FormElementItem {
  type: FormFieldType;
  label: string;
  icon: React.ComponentType<any>;
  category: string;
  description: string;
}

const FORM_ELEMENTS: FormElementItem[] = [
  // Basic Elements
  { type: 'text', label: 'Text Input', icon: Type, category: 'basic', description: 'Single line text input' },
  { type: 'email', label: 'Email', icon: Mail, category: 'basic', description: 'Email validation input' },
  { type: 'password', label: 'Password', icon: Type, category: 'basic', description: 'Password input field' },
  { type: 'number', label: 'Number', icon: Hash, category: 'basic', description: 'Numeric input field' },
  { type: 'textarea', label: 'Textarea', icon: FileText, category: 'basic', description: 'Multi-line text input' },
  
  // Selection Elements
  { type: 'select', label: 'Select', icon: List, category: 'selection', description: 'Dropdown selection' },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, category: 'selection', description: 'Boolean checkbox' },
  { type: 'radio', label: 'Radio Group', icon: CheckSquare, category: 'selection', description: 'Single choice options' },
  { type: 'toggle', label: 'Toggle', icon: ToggleLeft, category: 'selection', description: 'Switch toggle' },
  
  // Advanced Elements
  { type: 'date', label: 'Date', icon: Calendar, category: 'advanced', description: 'Date picker input' },
  { type: 'file', label: 'File Upload', icon: Upload, category: 'advanced', description: 'File upload field' },
  { type: 'url', label: 'URL', icon: Link, category: 'advanced', description: 'URL validation input' },
  { type: 'tel', label: 'Phone', icon: Phone, category: 'advanced', description: 'Phone number input' },
  
  // Layout Elements
  { type: 'divider', label: 'Divider', icon: Separator, category: 'layout', description: 'Visual separator' }
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'basic', label: 'Basic' },
  { id: 'selection', label: 'Selection' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'layout', label: 'Layout' }
];

export function FormBuilderOrganism({
  onFormChange,
  onFormSubmit,
  initialFields = [],
  className = ''
}: FormBuilderOrganismProps) {
  const { state } = useThemeEditor();
  
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;
  const spacing = state.currentTheme?.spacing;
  const shadows = state.currentTheme?.shadows;

  const baseSpacing = spacing?.spacing || '1rem';
  const baseValue = parseFloat(baseSpacing.replace('rem', '')) * 16;
  const smallSpacing = `${baseValue * 0.5}px`;
  const mediumSpacing = `${baseValue}px`;
  const largeSpacing = `${baseValue * 1.5}px`;

  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [mode, setMode] = useState<'build' | 'preview'>('build');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const generateId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addField = (fieldType: FormFieldType) => {
    const newField: FormField = {
      id: generateId(),
      type: fieldType,
      label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      placeholder: fieldType === 'divider' ? undefined : `Enter ${fieldType}...`,
      required: false,
      width: 'full',
      ...(fieldType === 'select' || fieldType === 'radio' ? {
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' }
        ]
      } : {})
    };

    setFields(prev => {
      const updatedFields = [...prev, newField];
      onFormChange?.(updatedFields);
      return updatedFields;
    });
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields(prev => {
      const updatedFields = prev.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      );
      onFormChange?.(updatedFields);
      return updatedFields;
    });
  };

  const removeField = (fieldId: string) => {
    setFields(prev => {
      const updatedFields = prev.filter(field => field.id !== fieldId);
      onFormChange?.(updatedFields);
      return updatedFields;
    });
    setSelectedField(null);
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < fields.length) {
      [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
      setFields(newFields);
      onFormChange?.(newFields);
    }
  };

  const exportForm = () => {
    navigator.clipboard.writeText(JSON.stringify(fields, null, 2));
    alert('Form JSON copied to clipboard!');
  };

  return (
    <Card 
      className={`form-builder-organism w-full ${className}`}
      style={{
        background: colors?.card?.value || 'var(--color-card)',
        border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
        boxShadow: shadows?.shadowLg || 'var(--shadow-lg)'
      }}
    >
      {/* Header */}
      <CardHeader style={{ padding: largeSpacing }}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle 
              style={{ 
                color: colors?.foreground?.value || 'var(--color-foreground)',
                fontFamily: 'var(--typography-h3-font-family)',
                fontSize: 'var(--typography-h3-font-size)',
                marginBottom: '4px'
              }}
            >
              Form Builder
            </CardTitle>
            <CardDescription 
              style={{ 
                color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
                fontSize: '14px'
              }}
            >
              Design and preview forms with validation
            </CardDescription>
          </div>
          
          <div className="flex gap-2 items-center">
            <Badge 
              variant="outline"
              style={{
                background: `${colors?.primary?.value || 'var(--color-primary)'}10`,
                borderColor: colors?.primary?.value || 'var(--color-primary)',
                color: colors?.primary?.value || 'var(--color-primary)'
              }}
            >
              {fields.length} fields
            </Badge>
            
            <div className="flex gap-1">
              <Button
                variant={mode === 'build' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('build')}
                style={{
                  background: mode === 'build' ? 
                    colors?.primary?.value || 'var(--color-primary)' : 
                    'transparent',
                  color: mode === 'build' ? 
                    colors?.primaryForeground?.value || 'var(--color-primary-foreground)' :
                    colors?.foreground?.value || 'var(--color-foreground)'
                }}
              >
                <Settings className="h-4 w-4 mr-1" />
                Build
              </Button>
              <Button
                variant={mode === 'preview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('preview')}
                style={{
                  background: mode === 'preview' ? 
                    colors?.primary?.value || 'var(--color-primary)' : 
                    'transparent',
                  color: mode === 'preview' ? 
                    colors?.primaryForeground?.value || 'var(--color-primary-foreground)' :
                    colors?.foreground?.value || 'var(--color-foreground)'
                }}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={exportForm}>
              <Code className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent style={{ padding: 0 }}>
        {mode === 'build' ? (
          <div 
            className="flex"
            style={{ 
              height: '500px',
              borderTop: `1px solid ${colors?.border?.value || 'var(--color-border)'}`
            }}
          >
            {/* Toolbox */}
            <FormToolbox
              onAddField={addField}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {/* Canvas */}
            <div style={{ flex: 1, padding: mediumSpacing, overflowY: 'auto' }}>
              {fields.length === 0 ? (
                <div 
                  className="flex flex-col items-center justify-center h-full"
                  style={{
                    border: `2px dashed ${colors?.border?.value || 'var(--color-border)'}`,
                    borderRadius: 'var(--radius)',
                    background: `${colors?.muted?.value || 'var(--color-muted)'}20`
                  }}
                >
                  <Plus 
                    className="h-12 w-12 mb-4" 
                    style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }} 
                  />
                  <h4 
                    style={{
                      color: colors?.foreground?.value || 'var(--color-foreground)',
                      fontFamily: 'var(--typography-h4-font-family)',
                      fontSize: 'var(--typography-h4-font-size)',
                      marginBottom: '8px'
                    }}
                  >
                    Start Building Your Form
                  </h4>
                  <p 
                    style={{
                      color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
                      fontSize: '14px',
                      textAlign: 'center'
                    }}
                  >
                    Select form elements from the left panel to add them
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {fields.map((field, index) => (
                    <FormFieldItem
                      key={field.id}
                      field={field}
                      index={index}
                      isSelected={selectedField === field.id}
                      onSelect={() => setSelectedField(field.id)}
                      onMoveUp={() => moveField(index, 'up')}
                      onMoveDown={() => moveField(index, 'down')}
                      onRemove={() => removeField(field.id)}
                      canMoveUp={index > 0}
                      canMoveDown={index < fields.length - 1}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Properties Panel */}
            {selectedField && (
              <div 
                className="w-80 max-h-full overflow-y-auto"
                style={{ 
                  borderLeft: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
                  background: colors?.background?.value || 'var(--color-background)',
                  padding: mediumSpacing
                }}
              >
                <FormFieldProperties
                  field={fields.find(f => f.id === selectedField)!}
                  onUpdate={(updates) => updateField(selectedField, updates)}
                />
              </div>
            )}
          </div>
        ) : (
          <FormPreview
            fields={fields}
            onSubmit={onFormSubmit}
          />
        )}
      </CardContent>
    </Card>
  );
}

// Form Toolbox Component
interface FormToolboxProps {
  onAddField: (fieldType: FormFieldType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

function FormToolbox({ 
  onAddField, 
  searchQuery, 
  onSearchChange, 
  activeCategory, 
  onCategoryChange 
}: FormToolboxProps) {
  const { state } = useThemeEditor();
  
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;
  const spacing = state.currentTheme?.spacing;

  const baseSpacing = spacing?.spacing || '1rem';
  const baseValue = parseFloat(baseSpacing.replace('rem', '')) * 16;
  const smallSpacing = `${baseValue * 0.5}px`;
  const mediumSpacing = `${baseValue}px`;

  const filteredElements = FORM_ELEMENTS.filter(element => {
    const matchesSearch = element.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         element.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || element.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div 
      className="w-64 flex flex-col"
      style={{
        borderRight: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
        background: colors?.card?.value || 'var(--color-card)'
      }}
    >
      {/* Search */}
      <div style={{ padding: mediumSpacing }}>
        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
            style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
          />
          <Input
            type="text"
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              paddingLeft: '2.5rem',
              background: colors?.background?.value || 'var(--color-background)',
              border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
              color: colors?.foreground?.value || 'var(--color-foreground)'
            }}
          />
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: `0 ${mediumSpacing} ${mediumSpacing}` }}>
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              style={{
                fontSize: '12px',
                padding: `${smallSpacing} ${smallSpacing}`,
                background: activeCategory === category.id ? 
                  colors?.primary?.value || 'var(--color-primary)' : 
                  'transparent',
                color: activeCategory === category.id ? 
                  colors?.primaryForeground?.value || 'var(--color-primary-foreground)' :
                  colors?.foreground?.value || 'var(--color-foreground)'
              }}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Elements List */}
      <div 
        className="flex-1 overflow-y-auto"
        style={{ padding: `0 ${mediumSpacing} ${mediumSpacing}` }}
      >
        <div className="flex flex-col gap-2">
          {filteredElements.length === 0 ? (
            <div className="text-center py-8">
              <p style={{ 
                color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
                fontSize: '14px'
              }}>
                No elements found
              </p>
            </div>
          ) : (
            filteredElements.map((element) => {
              const IconComponent = element.icon;
              return (
                <Button
                  key={element.type}
                  variant="outline"
                  size="sm"
                  onClick={() => onAddField(element.type)}
                  className="justify-start w-full h-auto min-h-[44px] p-3"
                  style={{
                    border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
                    background: colors?.background?.value || 'var(--color-background)',
                    color: colors?.foreground?.value || 'var(--color-foreground)'
                  }}
                >
                  <div className="flex items-start gap-2 w-full">
                    <IconComponent 
                      className="h-4 w-4 mt-0.5 flex-shrink-0" 
                      style={{ color: colors?.primary?.value || 'var(--color-primary)' }}
                    />
                    <div className="flex flex-col items-start gap-0.5 text-left">
                      <span className="font-medium text-sm">
                        {element.label}
                      </span>
                      <span 
                        className="text-xs leading-tight"
                        style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
                      >
                        {element.description}
                      </span>
                    </div>
                  </div>
                </Button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// Form Field Item Component
interface FormFieldItemProps {
  field: FormField;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

function FormFieldItem({
  field,
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onRemove,
  canMoveUp,
  canMoveDown
}: FormFieldItemProps) {
  const { state } = useThemeEditor();
  
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;
  const spacing = state.currentTheme?.spacing;

  const baseSpacing = spacing?.spacing || '1rem';
  const baseValue = parseFloat(baseSpacing.replace('rem', '')) * 16;
  const mediumSpacing = `${baseValue}px`;

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${isSelected ? 'ring-2' : ''}`}
      onClick={onSelect}
      style={{
        background: colors?.card?.value || 'var(--color-card)',
        border: isSelected 
          ? `2px solid ${colors?.primary?.value || 'var(--color-primary)'}` 
          : `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
        boxShadow: isSelected 
          ? `0 0 0 1px ${colors?.primary?.value || 'var(--color-primary)'}20` 
          : 'none'
      }}
    >
      <CardContent style={{ padding: mediumSpacing }}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                size="sm" 
                variant="outline"
                style={{
                  background: `${colors?.secondary?.value || 'var(--color-secondary)'}20`,
                  borderColor: colors?.border?.value || 'var(--color-border)',
                  color: colors?.foreground?.value || 'var(--color-foreground)'
                }}
              >
                {field.type}
              </Badge>
              {field.required && (
                <Badge
                  size="sm"
                  variant="error"
                  style={{
                    background: colors?.destructive?.value || 'var(--color-destructive)',
                    color: colors?.destructiveForeground?.value || 'var(--color-destructive-foreground)'
                  }}
                >
                  Required
                </Badge>
              )}
            </div>
            <FormFieldPreview field={field} />
          </div>
          
          <div className="flex flex-col gap-1 ml-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              disabled={!canMoveUp}
              className="px-2 py-1 h-auto"
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              disabled={!canMoveDown}
              className="px-2 py-1 h-auto"
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="px-2 py-1 h-auto"
              style={{
                background: colors?.destructive?.value || 'var(--color-destructive)',
                color: colors?.destructiveForeground?.value || 'var(--color-destructive-foreground)'
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Form Field Preview Component
function FormFieldPreview({ field }: { field: FormField }) {
  const { state } = useThemeEditor();
  
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;

  const inputStyle = {
    background: colors?.background?.value || 'var(--color-background)',
    border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
    color: colors?.foreground?.value || 'var(--color-foreground)',
    opacity: 0.6,
    cursor: 'not-allowed'
  };

  const labelStyle = {
    color: colors?.foreground?.value || 'var(--color-foreground)',
    fontFamily: 'var(--typography-paragraph-font-family)',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '4px',
    display: 'block'
  };

  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
    case 'url':
    case 'tel':
      return (
        <div>
          <label style={labelStyle}>{field.label}</label>
          <input
            type={field.type}
            placeholder={field.placeholder}
            disabled
            style={{
              ...inputStyle,
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--typography-paragraph-font-family)',
              fontSize: '14px'
            }}
          />
        </div>
      );
    
    case 'textarea':
      return (
        <div>
          <label style={labelStyle}>{field.label}</label>
          <textarea
            placeholder={field.placeholder}
            disabled
            rows={3}
            style={{
              ...inputStyle,
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--typography-paragraph-font-family)',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>
      );
    
    case 'select':
      return (
        <div>
          <label style={labelStyle}>{field.label}</label>
          <select
            disabled
            style={{
              ...inputStyle,
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--typography-paragraph-font-family)',
              fontSize: '14px'
            }}
          >
            <option>Select an option...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    
    case 'checkbox':
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            disabled
            style={{
              accentColor: colors?.primary?.value || 'var(--color-primary)'
            }}
          />
          <label style={labelStyle}>{field.label}</label>
        </div>
      );
    
    case 'radio':
      return (
        <div>
          <label style={labelStyle}>{field.label}</label>
          <div className="flex flex-col gap-2 mt-2">
            {field.options?.map(option => (
              <div key={option.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field.id}
                  disabled
                  style={{
                    accentColor: colors?.primary?.value || 'var(--color-primary)'
                  }}
                />
                <span style={{ 
                  color: colors?.foreground?.value || 'var(--color-foreground)',
                  fontSize: '14px'
                }}>
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'toggle':
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            role="switch"
            disabled
            style={{
              appearance: 'none',
              width: '44px',
              height: '24px',
              background: colors?.muted?.value || 'var(--color-muted)',
              borderRadius: '12px',
              position: 'relative',
              cursor: 'not-allowed',
              opacity: 0.6
            }}
          />
          <label style={labelStyle}>{field.label}</label>
        </div>
      );
    
    case 'date':
      return (
        <div>
          <label style={labelStyle}>{field.label}</label>
          <input
            type="date"
            disabled
            style={{
              ...inputStyle,
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--typography-paragraph-font-family)',
              fontSize: '14px'
            }}
          />
        </div>
      );
    
    case 'file':
      return (
        <div>
          <label style={labelStyle}>{field.label}</label>
          <input
            type="file"
            disabled
            style={{
              ...inputStyle,
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--typography-paragraph-font-family)',
              fontSize: '14px'
            }}
          />
        </div>
      );
    
    case 'divider':
      return (
        <div
          style={{
            height: '1px',
            background: colors?.border?.value || 'var(--color-border)',
            margin: '8px 0'
          }}
        />
      );
    
    default:
      return <div>Unknown field type</div>;
  }
}

// Form Field Properties Component
interface FormFieldPropertiesProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

function FormFieldProperties({ field, onUpdate }: FormFieldPropertiesProps) {
  const { state } = useThemeEditor();
  
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;

  return (
    <div className="space-y-4">
      <div>
        <h4 
          style={{
            color: colors?.foreground?.value || 'var(--color-foreground)',
            fontFamily: 'var(--typography-h5-font-family)',
            fontSize: 'var(--typography-h5-font-size)',
            marginBottom: '8px'
          }}
        >
          Field Properties
        </h4>
        <p 
          style={{
            color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
            fontSize: '13px'
          }}
        >
          {field.type.charAt(0).toUpperCase() + field.type.slice(1)} • {field.label}
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label 
            style={{
              color: colors?.foreground?.value || 'var(--color-foreground)',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '4px',
              display: 'block'
            }}
          >
            Label
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius)',
              background: colors?.background?.value || 'var(--color-background)',
              border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
              color: colors?.foreground?.value || 'var(--color-foreground)',
              fontFamily: 'var(--typography-paragraph-font-family)',
              fontSize: '14px'
            }}
          />
        </div>

        {field.type !== 'divider' && (
          <>
            <div>
              <label 
                style={{
                  color: colors?.foreground?.value || 'var(--color-foreground)',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '4px',
                  display: 'block'
                }}
              >
                Placeholder
              </label>
              <input
                type="text"
                value={field.placeholder || ''}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius)',
                  background: colors?.background?.value || 'var(--color-background)',
                  border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
                  color: colors?.foreground?.value || 'var(--color-foreground)',
                  fontFamily: 'var(--typography-paragraph-font-family)',
                  fontSize: '14px'
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={field.required || false}
                onChange={(e) => onUpdate({ required: e.target.checked })}
                style={{
                  accentColor: colors?.primary?.value || 'var(--color-primary)'
                }}
              />
              <label 
                style={{
                  color: colors?.foreground?.value || 'var(--color-foreground)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Required Field
              </label>
            </div>
          </>
        )}

        {(field.type === 'select' || field.type === 'radio') && (
          <div>
            <label 
              style={{
                color: colors?.foreground?.value || 'var(--color-foreground)',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                display: 'block'
              }}
            >
              Options
            </label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Option label"
                    value={option.label}
                    onChange={(e) => {
                      const newOptions = [...(field.options || [])];
                      newOptions[index] = { ...option, label: e.target.value };
                      onUpdate({ options: newOptions });
                    }}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      borderRadius: 'var(--radius)',
                      background: colors?.background?.value || 'var(--color-background)',
                      border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
                      color: colors?.foreground?.value || 'var(--color-foreground)',
                      fontFamily: 'var(--typography-paragraph-font-family)',
                      fontSize: '14px'
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newOptions = (field.options || []).filter((_, i) => i !== index);
                      onUpdate({ options: newOptions });
                    }}
                    style={{
                      padding: '6px 8px',
                      background: colors?.destructive?.value || 'var(--color-destructive)',
                      color: colors?.destructiveForeground?.value || 'var(--color-destructive-foreground)',
                      border: 'none'
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newOptions = [
                    ...(field.options || []),
                    { 
                      label: `Option ${(field.options?.length || 0) + 1}`, 
                      value: `option${(field.options?.length || 0) + 1}` 
                    }
                  ];
                  onUpdate({ options: newOptions });
                }}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  background: colors?.secondary?.value || 'var(--color-secondary)',
                  color: colors?.secondaryForeground?.value || 'var(--color-secondary-foreground)',
                  border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`
                }}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Option
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Form Preview Component
interface FormPreviewProps {
  fields: FormField[];
  onSubmit?: (formData: any) => void;
}

function FormPreview({ fields, onSubmit }: FormPreviewProps) {
  const { state } = useThemeEditor();
  
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;
  const spacing = state.currentTheme?.spacing;

  const baseSpacing = spacing?.spacing || '1rem';
  const baseValue = parseFloat(baseSpacing.replace('rem', '')) * 16;
  const mediumSpacing = `${baseValue}px`;
  const largeSpacing = `${baseValue * 2}px`;

  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    alert('Form submitted! Check console for data.');
    console.log('Form Data:', formData);
  };

  const updateFormData = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  return (
    <div 
      style={{ 
        padding: largeSpacing,
        maxWidth: '600px',
        margin: '0 auto',
        background: colors?.background?.value || 'var(--color-background)'
      }}
    >
      {fields.length === 0 ? (
        <div className="text-center py-16">
          <Eye 
            className="h-12 w-12 mx-auto mb-4" 
            style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
          />
          <h4 
            style={{
              color: colors?.foreground?.value || 'var(--color-foreground)',
              fontFamily: 'var(--typography-h4-font-family)',
              fontSize: 'var(--typography-h4-font-size)',
              marginBottom: '8px'
            }}
          >
            Form Preview
          </h4>
          <p 
            style={{
              color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
              fontSize: '14px'
            }}
          >
            Add some fields to see the preview
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div 
            className="space-y-4"
            style={{ marginBottom: largeSpacing }}
          >
            {fields.map((field) => (
              <InteractiveFormField
                key={field.id}
                field={field}
                value={formData[field.id]}
                onChange={(value) => updateFormData(field.id, value)}
              />
            ))}
          </div>
          
          <div className="flex gap-3">
            <Button
              type="submit"
              style={{
                background: colors?.primary?.value || 'var(--color-primary)',
                color: colors?.primaryForeground?.value || 'var(--color-primary-foreground)',
                padding: '12px 24px',
                borderRadius: 'var(--radius)',
                border: 'none',
                fontFamily: 'var(--typography-button-font-family)',
                fontSize: 'var(--typography-button-font-size)',
                fontWeight: 'var(--typography-button-font-weight)',
                cursor: 'pointer'
              }}
            >
              Submit Form
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({})}
              style={{
                background: 'transparent',
                color: colors?.foreground?.value || 'var(--color-foreground)',
                border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
                padding: '12px 24px',
                borderRadius: 'var(--radius)',
                fontFamily: 'var(--typography-button-font-family)',
                fontSize: 'var(--typography-button-font-size)',
                fontWeight: 'var(--typography-button-font-weight)',
                cursor: 'pointer'
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

// Interactive Form Field Component
interface InteractiveFormFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
}

function InteractiveFormField({ field, value, onChange }: InteractiveFormFieldProps) {
  const { state } = useThemeEditor();
  
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 'var(--radius)',
    background: colors?.background?.value || 'var(--color-background)',
    border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
    color: colors?.foreground?.value || 'var(--color-foreground)',
    fontFamily: 'var(--typography-paragraph-font-family)',
    fontSize: '14px'
  };

  const labelStyle = {
    color: colors?.foreground?.value || 'var(--color-foreground)',
    fontFamily: 'var(--typography-paragraph-font-family)',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '6px',
    display: 'block'
  };

  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
    case 'url':
    case 'tel':
      return (
        <div>
          <label style={labelStyle}>
            {field.label}
            {field.required && (
              <span style={{ color: colors?.destructive?.value || 'var(--color-destructive)' }}>
                {' '}*
              </span>
            )}
          </label>
          <input
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            style={inputStyle}
          />
        </div>
      );
    
    case 'textarea':
      return (
        <div>
          <label style={labelStyle}>
            {field.label}
            {field.required && (
              <span style={{ color: colors?.destructive?.value || 'var(--color-destructive)' }}>
                {' '}*
              </span>
            )}
          </label>
          <textarea
            placeholder={field.placeholder}
            required={field.required}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            style={{
              ...inputStyle,
              resize: 'vertical',
              minHeight: '100px'
            }}
          />
        </div>
      );
    
    case 'select':
      return (
        <div>
          <label style={labelStyle}>
            {field.label}
            {field.required && (
              <span style={{ color: colors?.destructive?.value || 'var(--color-destructive)' }}>
                {' '}*
              </span>
            )}
          </label>
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            style={inputStyle}
          >
            <option value="">Select an option...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    
    case 'checkbox':
      return (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            required={field.required}
            style={{
              accentColor: colors?.primary?.value || 'var(--color-primary)',
              width: '18px',
              height: '18px'
            }}
          />
          <label style={labelStyle}>
            {field.label}
            {field.required && (
              <span style={{ color: colors?.destructive?.value || 'var(--color-destructive)' }}>
                {' '}*
              </span>
            )}
          </label>
        </div>
      );
    
    case 'radio':
      return (
        <div>
          <label style={labelStyle}>
            {field.label}
            {field.required && (
              <span style={{ color: colors?.destructive?.value || 'var(--color-destructive)' }}>
                {' '}*
              </span>
            )}
          </label>
          <div className="space-y-2 mt-2">
            {field.options?.map(option => (
              <div key={option.value} className="flex items-center gap-3">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  required={field.required}
                  style={{
                    accentColor: colors?.primary?.value || 'var(--color-primary)',
                    width: '18px',
                    height: '18px'
                  }}
                />
                <span style={{ 
                  color: colors?.foreground?.value || 'var(--color-foreground)',
                  fontSize: '14px'
                }}>
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'toggle':
      return (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            role="switch"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            style={{
              appearance: 'none',
              width: '48px',
              height: '26px',
              background: value
                ? colors?.primary?.value || 'var(--color-primary)'
                : colors?.muted?.value || 'var(--color-muted)',
              borderRadius: '13px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          />
          <label style={labelStyle}>
            {field.label}
            {field.required && (
              <span style={{ color: colors?.destructive?.value || 'var(--color-destructive)' }}>
                {' '}*
              </span>
            )}
          </label>
        </div>
      );
    
    case 'date':
      return (
        <div>
          <label style={labelStyle}>
            {field.label}
            {field.required && (
              <span style={{ color: colors?.destructive?.value || 'var(--color-destructive)' }}>
                {' '}*
              </span>
            )}
          </label>
          <input
            type="date"
            required={field.required}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            style={inputStyle}
          />
        </div>
      );
    
    case 'file':
      return (
        <div>
          <label style={labelStyle}>
            {field.label}
            {field.required && (
              <span style={{ color: colors?.destructive?.value || 'var(--color-destructive)' }}>
                {' '}*
              </span>
            )}
          </label>
          <input
            type="file"
            required={field.required}
            onChange={(e) => onChange((e.target as HTMLInputElement).files?.[0] || null)}
            style={inputStyle}
          />
        </div>
      );
    
    case 'divider':
      return (
        <div
          style={{
            height: '1px',
            background: colors?.border?.value || 'var(--color-border)',
            margin: '24px 0'
          }}
        />
      );
    
    default:
      return null;
  }
}

export function FormBuilderOrganismShowcase() {
  const [formData, setFormData] = useState<any>(null);
  
  const initialFields: FormField[] = [
    {
      id: 'name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
      width: 'full'
    },
    {
      id: 'email',
      type: 'email', 
      label: 'Email Address',
      placeholder: 'your@email.com',
      required: true,
      width: 'full'
    },
    {
      id: 'message',
      type: 'textarea',
      label: 'Message',
      placeholder: 'Type your message here...',
      required: false,
      width: 'full'
    }
  ];

  return (
    <div className="w-full">
      <FormBuilderOrganism
        initialFields={initialFields}
        onFormSubmit={(data) => {
          setFormData(data);
          console.log('Form submitted:', data);
        }}
        onFormChange={(fields) => {
          console.log('Form structure changed:', fields);
        }}
      />
    </div>
  );
}

export default FormBuilderOrganism;