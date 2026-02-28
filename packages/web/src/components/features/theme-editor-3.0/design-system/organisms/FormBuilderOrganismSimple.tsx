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
  Phone
} from 'lucide-react';

// Import our design system components
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/atoms-alianza/Input';
import { Textarea } from '@/components/primitives/ui/textarea';
import { Checkbox } from '../atoms/Checkbox';
import { RadioButton } from '@/components/atoms-alianza/RadioButton';
import { Select } from '@/components/atoms-alianza/Select';
import { Toggle } from '@/components/atoms-alianza/Toggle';
import { Badge } from '@/components/atoms-alianza/Badge';
import { Separator } from '@/components/atoms-alianza/Separator';
import { DatePickerMolecule } from '../molecules/DatePickerMolecule';
import { CardMolecule } from '../molecules/CardMolecule';
import { TabsMolecule } from '../molecules/TabsMolecule';
import { ScrollArea } from '@/components/primitives/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/primitives/ui/dialog';

// Import typography system
import { getTypographyClass } from '../../core/constants/typography-classes';

// Form Field Types
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
    customValidator?: string;
  };
  options?: { label: string; value: string }[];
  defaultValue?: any;
  width?: 'full' | 'half' | 'third' | 'custom';
  
  // Enhanced styling properties
  styling?: {
    variant?: 'default' | 'outline' | 'ghost' | 'filled';
    size?: 'sm' | 'default' | 'lg';
    customWidth?: string;
  };
  
  // Conditional logic
  conditional?: {
    dependsOn?: string;
    showWhen?: string | boolean;
    hideWhen?: string | boolean;
  };
}

export interface FormBuilderOrganismProps {
  onFormChange?: (fields: FormField[]) => void;
  onFormSubmit?: (formData: any) => void;
  initialFields?: FormField[];
  className?: string;
}

// Enhanced Categorized Form Elements
interface FormElementItem {
  type: FormFieldType;
  label: string;
  icon: React.ComponentType<any>;
  category: string;
  description?: string;
  isPremium?: boolean;
}

const ENHANCED_FORM_ELEMENTS: FormElementItem[] = [
  // Basic Input Elements
  { type: 'text', label: 'Text Input', icon: Type, category: 'basic', description: 'Single line text input' },
  { type: 'email', label: 'Email Input', icon: Mail, category: 'basic', description: 'Email validation input' },
  { type: 'password', label: 'Password Input', icon: Type, category: 'basic', description: 'Password input with toggle' },
  { type: 'number', label: 'Number Input', icon: Hash, category: 'basic', description: 'Numeric input with validation' },
  { type: 'textarea', label: 'Textarea', icon: FileText, category: 'basic', description: 'Multi-line text input' },
  
  // Selection Elements
  { type: 'select', label: 'Select Dropdown', icon: List, category: 'selection', description: 'Single choice dropdown' },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, category: 'selection', description: 'Boolean checkbox input' },
  { type: 'radio', label: 'Radio Group', icon: CheckSquare, category: 'selection', description: 'Single choice from multiple options' },
  { type: 'toggle', label: 'Toggle Switch', icon: ToggleLeft, category: 'selection', description: 'On/off toggle switch' },
  
  // Advanced Elements
  { type: 'date', label: 'Date Picker', icon: Calendar, category: 'advanced', description: 'Calendar date picker' },
  { type: 'file', label: 'File Upload', icon: Upload, category: 'advanced', description: 'File upload input' },
  { type: 'url', label: 'URL Input', icon: Link, category: 'advanced', description: 'URL validation input' },
  { type: 'tel', label: 'Phone Input', icon: Phone, category: 'advanced', description: 'Phone number input' },
  
  // Layout Elements
  { type: 'divider', label: 'Divider', icon: Separator, category: 'layout', description: 'Visual separator line' }
];

const ELEMENT_CATEGORIES = [
  { id: 'all', label: 'All Elements', icon: List },
  { id: 'basic', label: 'Basic Inputs', icon: Type },
  { id: 'selection', label: 'Selection', icon: CheckSquare },
  { id: 'advanced', label: 'Advanced', icon: Calendar },
  { id: 'layout', label: 'Layout', icon: Separator }
];

/**
 * FormBuilderOrganism - Simplified form builder without drag-and-drop
 */
export function FormBuilderOrganism({
  onFormChange,
  onFormSubmit,
  initialFields = [],
  className = ''
}: FormBuilderOrganismProps) {
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
      placeholder: `Enter ${fieldType}...`,
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

  const tabItems = [
    { 
      id: 'build', 
      label: 'Build', 
      icon: <Settings className="w-4 h-4" />, 
      content: <div>Build Mode</div> 
    },
    { 
      id: 'preview', 
      label: 'Preview', 
      icon: <Eye className="w-4 h-4" />, 
      content: <div>Preview Mode</div> 
    }
  ];

  return (
    <div className={`form-builder-organism w-full bg-background border border-border rounded-[var(--radius)] ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border bg-card">
        <div>
          <h3 className={`${getTypographyClass('h4')} text-foreground m-0`}>
            Form Builder
          </h3>
          <p className={`${getTypographyClass('muted')} mt-1`}>
            Build forms with validation and preview
          </p>
        </div>
        
        <div className="flex gap-2 items-center">
          <Badge variant={mode === 'build' ? 'default' : 'outline'}>
            {fields.length} fields
          </Badge>
          
          <TabsMolecule
            tabs={tabItems}
            value={mode}
            onValueChange={(tab) => setMode(tab as 'build' | 'preview')}
          />

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Code className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Form JSON Schema</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <Textarea
                  value={JSON.stringify(fields, null, 2)}
                  className="min-h-[300px] font-mono text-xs"
                  readOnly
                />
                <Button 
                  className="mt-3"
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(fields, null, 2))}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      {mode === 'build' ? (
        <div className="flex h-[500px]">
          {/* Toolbox */}
          <EnhancedToolbox
            onAddField={addField}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Canvas */}
          <div style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
            {fields.length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                border: '2px dashed var(--color-border)',
                borderRadius: 'var(--radius)',
                background: 'var(--color-muted/20)'
              }}>
                <Plus className="h-10 w-10 mb-3" style={{ color: 'var(--color-muted-foreground)' }} />
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: 'var(--color-muted-foreground)',
                  margin: '0 0 8px 0'
                }}>
                  Start Building Your Form
                </h4>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--color-muted-foreground)',
                  textAlign: 'center'
                }}>
                  Click on form elements to add them
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {fields.map((field, index) => (
                  <CardMolecule
                    key={field.id}
                    variant={selectedField === field.id ? 'interactive' : 'default'}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedField === field.id 
                        ? 'border-2 border-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]' 
                        : 'border border-border'
                    }`}
                    onClick={() => {
                      console.log('Selected field:', field.id);
                      setSelectedField(field.id);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge size="sm" variant="outline">{field.type}</Badge>
                          {field.required && <Badge size="sm" variant="destructive">Required</Badge>}
                        </div>
                        <FormFieldPreview field={field} />
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveField(index, 'up');
                          }}
                          disabled={index === 0}
                          className="px-2 py-1"
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveField(index, 'down');
                          }}
                          disabled={index === fields.length - 1}
                          className="px-2 py-1"
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeField(field.id);
                          }}
                          className="px-2 py-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardMolecule>
                ))}
              </div>
            )}
          </div>

          {/* Properties Panel */}
          {selectedField && (
            <div className="w-80 border-l-2 border-primary bg-background p-5 max-h-full overflow-y-auto">
              <EnhancedFormProperties
                field={fields.find(f => f.id === selectedField)!}
                onUpdate={(updates) => updateField(selectedField, updates)}
              />
            </div>
          )}
        </div>
      ) : (
        <EnhancedFormPreview
          fields={fields}
          selectedFieldId={selectedField}
          onFieldSelect={setSelectedField}
          onSubmit={onFormSubmit}
        />
      )}
    </div>
  );
}

// Form Field Preview Component
function FormFieldPreview({ field }: { field: FormField }) {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
    case 'url':
    case 'tel':
      return <Input type={field.type} placeholder={field.placeholder} disabled />;
    
    case 'textarea':
      return (
        <div>
          <label className={`${getTypographyClass('input-label')} text-foreground mb-1.5 block`}>{field.label}</label>
          <Textarea placeholder={field.placeholder} disabled />
        </div>
      );
    
    case 'select':
      return (
        <div>
          <label className={`${getTypographyClass('input-label')} text-foreground mb-1.5 block`}>
            {field.label}
          </label>
          <Select
            options={field.options?.map(o => ({ value: o.value, label: o.label })) || []}
            disabled
          />
        </div>
      );
    
    case 'checkbox':
      return <Checkbox label={field.label} disabled />;
    
    case 'radio':
      return (
        <div>
          <label className={`${getTypographyClass('input-label')} text-foreground mb-2 block`}>
            {field.label}
          </label>
          <div className="flex flex-col gap-1.5">
            {field.options?.map(option => (
              <RadioButton key={option.value} name={field.id} value={option.value} label={option.label} disabled />
            ))}
          </div>
        </div>
      );
    
    case 'date':
      return <DatePickerMolecule label={field.label} disabled />;
    
    case 'toggle':
      return <Toggle label={field.label} disabled />;
    
    case 'file':
      return <Input type="file" placeholder={field.placeholder} disabled />;
    
    case 'divider':
      return <Separator />;
    
    default:
      return <div>Unknown field type</div>;
  }
}

// Enhanced Properties Panel with Tabs
interface EnhancedFormPropertiesProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

function EnhancedFormProperties({ field, onUpdate }: EnhancedFormPropertiesProps) {
  const [activeTab, setActiveTab] = useState<string>('basic');
  
  const tabItems = [
    { id: 'basic', label: 'Basic', icon: <Settings className="w-4 h-4" />, content: <BasicProperties field={field} onUpdate={onUpdate} /> },
    { id: 'styling', label: 'Style', icon: <Eye className="w-4 h-4" />, content: <StylingProperties field={field} onUpdate={onUpdate} /> },
    { id: 'validation', label: 'Validation', icon: <CheckSquare className="w-4 h-4" />, content: <ValidationProperties field={field} onUpdate={onUpdate} /> }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h4 className={`${getTypographyClass('h6')} text-foreground mb-1`}>
          Field Properties
        </h4>
        <p className={`${getTypographyClass('caption')} text-muted-foreground m-0`}>
          {field.type.charAt(0).toUpperCase() + field.type.slice(1)} • {field.label}
        </p>
      </div>
      
      {/* Tabs */}
      <TabsMolecule
        tabs={tabItems}
        value={activeTab}
        onValueChange={setActiveTab}
      />
    </div>
  );
}

// Basic Properties Component
function BasicProperties({ field, onUpdate }: { field: FormField; onUpdate: (updates: Partial<FormField>) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="Label"
        value={field.label}
        onChange={(e) => onUpdate({ label: e.target.value })}
      />

      {field.type !== 'divider' && (
        <>
          <Input
            placeholder="Placeholder"
            value={field.placeholder || ''}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
          />
          
          <Checkbox
            label="Required Field"
            checked={field.required || false}
            onChange={(checked) => onUpdate({ required: checked })}
          />
        </>
      )}
      
      {(field.type === 'select' || field.type === 'radio') && (
        <div>
          <label className={`${getTypographyClass('input-label')} text-foreground mb-2 block`}>
            Options
          </label>
          <div className="flex flex-col gap-1.5">
            {field.options?.map((option, index) => (
              <div key={index} className="flex gap-1.5">
                <Input
                  placeholder="Option label"
                  value={option.label}
                  onChange={(e) => {
                    const newOptions = [...(field.options || [])];
                    newOptions[index] = { ...option, label: e.target.value };
                    onUpdate({ options: newOptions });
                  }}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newOptions = (field.options || []).filter((_, i) => i !== index);
                    onUpdate({ options: newOptions });
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
                  { label: `Option ${(field.options?.length || 0) + 1}`, value: `option${(field.options?.length || 0) + 1}` }
                ];
                onUpdate({ options: newOptions });
              }}
            >
              <Plus className="h-3 w-3 mr-2" />
              Add Option
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Styling Properties Component  
function StylingProperties({ field, onUpdate }: { field: FormField; onUpdate: (updates: Partial<FormField>) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={`${getTypographyClass('input-label')} text-foreground mb-1.5 block`}>Variant</label>
        <Select
          options={[
            { value: 'default', label: 'Default' },
            { value: 'outline', label: 'Outline' },
            { value: 'ghost', label: 'Ghost' },
            { value: 'filled', label: 'Filled' },
          ]}
          value={field.styling?.variant || 'default'}
          onValueChange={(val: string) => onUpdate({
            styling: { ...field.styling, variant: val as any }
          })}
        />
      </div>
      
      <div>
        <label className={`${getTypographyClass('input-label')} text-foreground mb-2 block`}>Size</label>
        <div className="flex flex-col gap-1.5">
          <RadioButton
            name={`${field.id}-size`}
            value="sm"
            label="Small"
            checked={field.styling?.size === 'sm'}
            onChange={() => onUpdate({
              styling: { ...field.styling, size: 'sm' }
            })}
          />
          <RadioButton
            name={`${field.id}-size`}
            value="default"
            label="Default"
            checked={field.styling?.size === 'default' || !field.styling?.size}
            onChange={() => onUpdate({
              styling: { ...field.styling, size: 'default' }
            })}
          />
          <RadioButton
            name={`${field.id}-size`}
            value="lg"
            label="Large"
            checked={field.styling?.size === 'lg'}
            onChange={() => onUpdate({
              styling: { ...field.styling, size: 'lg' }
            })}
          />
        </div>
      </div>
      
      <div>
        <label className={`${getTypographyClass('input-label')} text-foreground mb-1.5 block`}>Width</label>
        <Select
          options={[
            { value: 'full', label: 'Full Width' },
            { value: 'half', label: 'Half Width' },
            { value: 'third', label: 'Third Width' },
            { value: 'custom', label: 'Custom Width' },
          ]}
          value={field.width || 'full'}
          onValueChange={(val: string) => onUpdate({ width: val as any })}
        />
        
        {field.width === 'custom' && (
          <Input
            type="text"
            placeholder="e.g., 300px, 50%, 20rem"
            value={field.styling?.customWidth || ''}
            onChange={(e) => onUpdate({ 
              styling: { ...field.styling, customWidth: e.target.value } 
            })}
            className="mt-2"
          />
        )}
      </div>
    </div>
  );
}

// Validation Properties Component
function ValidationProperties({ field, onUpdate }: { field: FormField; onUpdate: (updates: Partial<FormField>) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={`${getTypographyClass('input-label')} text-foreground mb-1.5 block`}>Validation Rules</label>
        
        {field.type === 'text' || field.type === 'textarea' ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min Length"
                value={field.validation?.minLength || ''}
                onChange={(e) => onUpdate({
                  validation: { ...field.validation, minLength: parseInt(e.target.value) || undefined }
                })}
              />
              <Input
                type="number"
                placeholder="Max Length"
                value={field.validation?.maxLength || ''}
                onChange={(e) => onUpdate({
                  validation: { ...field.validation, maxLength: parseInt(e.target.value) || undefined }
                })}
              />
            </div>
          </>
        ) : null}
        
        {field.type === 'number' ? (
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Minimum Value"
              value={field.validation?.min || ''}
              onChange={(e) => onUpdate({
                validation: { ...field.validation, min: parseInt(e.target.value) || undefined }
              })}
            />
            <Input
              type="number"
              placeholder="Maximum Value"
              value={field.validation?.max || ''}
              onChange={(e) => onUpdate({
                validation: { ...field.validation, max: parseInt(e.target.value) || undefined }
              })}
            />
          </div>
        ) : null}
        
        <Input
          placeholder="Regex Pattern (e.g., ^[A-Za-z]+$)"
          value={field.validation?.pattern || ''}
          onChange={(e) => onUpdate({ 
            validation: { ...field.validation, pattern: e.target.value } 
          })}
        />
        
        <Input
          placeholder="Custom validation error message"
          value={field.validation?.message || ''}
          onChange={(e) => onUpdate({ 
            validation: { ...field.validation, message: e.target.value } 
          })}
        />
      </div>
    </div>
  );
}

// Enhanced Preview Component with Selection
interface EnhancedFormPreviewProps {
  fields: FormField[];
  selectedFieldId: string | null;
  onFieldSelect: (fieldId: string) => void;
  onSubmit?: (data: any) => void;
}

function EnhancedFormPreview({ fields, selectedFieldId, onFieldSelect, onSubmit }: EnhancedFormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          {fields.map((field) => (
            <PreviewFieldWrapper
              key={field.id}
              field={field}
              isSelected={selectedFieldId === field.id}
              onSelect={() => onFieldSelect(field.id)}
            >
              <InteractivePreviewField
                field={field}
                value={formData[field.id]}
                onChange={(value) => setFormData(prev => ({ ...prev, [field.id]: value }))}
              />
            </PreviewFieldWrapper>
          ))}
        </div>
        
        {fields.length > 0 && (
          <div className="mt-6 flex gap-3">
            <Button type="submit" className={getTypographyClass('button-base')}>
              Submit Form
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setFormData({})}
              className={getTypographyClass('button-base')}
            >
              Reset
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

// Preview Field Wrapper for Selection
interface PreviewFieldWrapperProps {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}

function PreviewFieldWrapper({ field, isSelected, onSelect, children }: PreviewFieldWrapperProps) {
  return (
    <div 
      className={`
        relative transition-all duration-200 rounded-md p-2 -m-2 cursor-pointer
        hover:bg-muted/50
        ${
          isSelected 
            ? 'ring-2 ring-primary ring-offset-2 bg-primary/5' 
            : ''
        }
      `}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge variant="default" className="text-xs animate-pulse">
            Editing
          </Badge>
        </div>
      )}
      {children}
    </div>
  );
}

// Interactive Preview Field Component
function InteractivePreviewField({ field, value, onChange }: { field: FormField; value: any; onChange: (value: any) => void }) {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
    case 'url':
    case 'tel':
      return (
        <Input
          type={field.type}
          placeholder={field.placeholder}
          required={field.required}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    
    case 'textarea':
      return (
        <div>
          <label className={`${getTypographyClass('input-label')} text-foreground mb-1.5 block`}>
            {field.label}
            {field.required && <span className="text-destructive"> *</span>}
          </label>
          <Textarea
            placeholder={field.placeholder}
            required={field.required}
            value={value || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          />
        </div>
      );

    case 'select':
      return (
        <div>
          <label className={`${getTypographyClass('input-label')} text-foreground mb-1.5 block`}>
            {field.label}
            {field.required && <span className="text-destructive"> *</span>}
          </label>
          <Select
            options={[
              { value: '', label: 'Select an option...' },
              ...(field.options?.map(o => ({ value: o.value, label: o.label })) || [])
            ]}
            value={value || ''}
            onValueChange={(val: string) => onChange(val)}
          />
        </div>
      );

    case 'checkbox':
      return (
        <Checkbox
          label={field.label}
          checked={value || false}
          onChange={(checked: boolean) => onChange(checked)}
        />
      );
    
    case 'radio':
      return (
        <div>
          <label className={`${getTypographyClass('input-label')} text-foreground mb-2 block`}>
            {field.label}
            {field.required && <span className="text-destructive"> *</span>}
          </label>
          <div className="flex flex-col gap-1.5">
            {field.options?.map(option => (
              <RadioButton
                key={option.value}
                name={field.id}
                label={option.label}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
              />
            ))}
          </div>
        </div>
      );
    
    case 'date':
      return (
        <DatePickerMolecule
          label={field.label}
          value={value}
          onChange={onChange}
          required={field.required}
        />
      );
    
    case 'toggle':
      return (
        <Toggle
          label={field.label}
          checked={value || false}
          onChange={onChange}
        />
      );
    
    case 'file':
      return (
        <Input
          type="file"
          required={field.required}
          onChange={(e) => onChange((e.target as HTMLInputElement).files?.[0] || null)}
        />
      );
    
    case 'divider':
      return <Separator />;
    
    default:
      return null;
  }
}

/**
 * FormBuilderOrganismShowcase - Demo component
 */
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
      width: 'half'
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
    <div>
      <FormBuilderOrganism
        initialFields={initialFields}
        onFormSubmit={(data) => {
          setFormData(data);
          console.log('Form submitted:', data);
          alert('Form submitted! Check console for data.');
        }}
        onFormChange={(fields) => {
          console.log('Form structure changed:', fields);
        }}
      />
    </div>
  );
}

// Enhanced Toolbox Component
interface EnhancedToolboxProps {
  onAddField: (fieldType: FormFieldType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

function EnhancedToolbox({ onAddField, searchQuery, onSearchChange, activeCategory, onCategoryChange }: EnhancedToolboxProps) {
  // Filter elements based on search and category
  const filteredElements = ENHANCED_FORM_ELEMENTS.filter(element => {
    const matchesSearch = element.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         element.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || element.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h4 className={`${getTypographyClass('input-label')} text-foreground mb-3`}>
          Form Elements
        </h4>
        
        {/* Search */}
        <Input
          type="text"
          placeholder="Search elements..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          variant="outline"
          size="sm"
        />
      </div>
      
      {/* Categories */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-wrap gap-1">
          {ELEMENT_CATEGORIES.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onCategoryChange(category.id)}
                className="text-xs px-2 py-1 h-auto"
              >
                <IconComponent className="h-3 w-3 mr-1" />
                {category.label}
              </Button>
            );
          })}
        </div>
      </div>
      
      {/* Elements List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="flex flex-col gap-2">
            {filteredElements.length === 0 ? (
              <div className="text-center py-8">
                <p className={`${getTypographyClass('muted')} text-muted-foreground`}>
                  No elements found
                </p>
              </div>
            ) : (
              filteredElements.map((element) => {
                const IconComponent = element.icon;
                return (
                  <div key={element.type} className="group">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAddField(element.type)}
                      className="justify-start w-full px-3 py-2 h-auto min-h-[44px] hover:bg-primary/10 transition-all duration-200"
                    >
                      <div className="flex items-start gap-2 w-full">
                        <IconComponent className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                        <div className="flex flex-col items-start gap-0.5 text-left">
                          <span className={`${getTypographyClass('small')} font-medium`}>
                            {element.label}
                          </span>
                          {element.description && (
                            <span className={`${getTypographyClass('caption')} text-muted-foreground leading-tight`}>
                              {element.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className={`${getTypographyClass('caption')} text-muted-foreground text-center`}>
          {filteredElements.length} element{filteredElements.length !== 1 ? 's' : ''} available
        </p>
      </div>
    </div>
  );
}

export default FormBuilderOrganism;