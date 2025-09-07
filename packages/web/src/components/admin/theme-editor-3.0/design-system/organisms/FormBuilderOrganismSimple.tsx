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
  ChevronDown
} from 'lucide-react';

// Import our design system components
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Textarea } from '../atoms/Textarea';
import { Checkbox } from '../atoms/Checkbox';
import { RadioButton } from '../atoms/RadioButton';
import { Select } from '../atoms/Select';
import { Toggle } from '../atoms/Toggle';
import { Badge } from '../atoms/Badge';
import { Separator } from '../atoms/Separator';
import { DatePickerMolecule } from '../molecules/DatePickerMolecule';
import { CardMolecule } from '../molecules/CardMolecule';
import { TabsMolecule } from '../molecules/TabsMolecule';
import { ScrollArea } from '../primitives/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../primitives/dialog';

// Form Field Types
export type FormFieldType = 
  | 'text' | 'email' | 'password' | 'number' 
  | 'textarea' | 'select' | 'checkbox' | 'radio' 
  | 'date' | 'toggle' | 'divider';

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
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

// Available Form Elements
const FORM_ELEMENTS = [
  { type: 'text', label: 'Text Input', icon: Type },
  { type: 'email', label: 'Email Input', icon: Mail },
  { type: 'password', label: 'Password Input', icon: Type },
  { type: 'number', label: 'Number Input', icon: Hash },
  { type: 'textarea', label: 'Textarea', icon: FileText },
  { type: 'select', label: 'Select Dropdown', icon: List },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { type: 'radio', label: 'Radio Group', icon: CheckSquare },
  { type: 'date', label: 'Date Picker', icon: Calendar },
  { type: 'toggle', label: 'Toggle Switch', icon: ToggleLeft },
  { type: 'divider', label: 'Divider', icon: Separator }
] as const;

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
    <div className={`form-builder-organism w-full ${className}`} style={{
      background: 'var(--color-background)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--color-border)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-card)',
      }}>
        <div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'var(--typography-h3-font-weight)',
            color: 'var(--color-foreground)',
            margin: 0
          }}>
            Form Builder
          </h3>
          <p style={{
            fontSize: '13px',
            color: 'var(--color-muted-foreground)',
            margin: '4px 0 0 0'
          }}>
            Build forms with validation and preview
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
              <div style={{ marginTop: '16px' }}>
                <Textarea
                  value={JSON.stringify(fields, null, 2)}
                  style={{ minHeight: '300px', fontFamily: 'monospace', fontSize: '12px' }}
                  readOnly
                />
                <Button 
                  style={{ marginTop: '12px' }}
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
        <div style={{ display: 'flex', height: '500px' }}>
          {/* Toolbox */}
          <div style={{
            width: '250px',
            borderRight: '1px solid var(--color-border)',
            background: 'var(--color-card)',
            padding: '16px'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-foreground)',
              marginBottom: '12px'
            }}>
              Form Elements
            </h4>
            <ScrollArea className="h-full">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {FORM_ELEMENTS.map((element) => {
                  const IconComponent = element.icon;
                  return (
                    <Button
                      key={element.type}
                      variant="outline"
                      size="sm"
                      onClick={() => addField(element.type as FormFieldType)}
                      style={{
                        justifyContent: 'flex-start',
                        width: '100%',
                        padding: '8px 12px'
                      }}
                    >
                      <IconComponent className="h-4 w-4 mr-2" style={{ color: 'var(--color-primary)' }} />
                      <span style={{ fontSize: '13px' }}>{element.label}</span>
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {fields.map((field, index) => (
                  <CardMolecule
                    key={field.id}
                    variant={selectedField === field.id ? 'primary' : 'default'}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: selectedField === field.id ? 
                        `2px solid ${colors?.primary?.value || 'var(--color-primary)'}` : 
                        '1px solid var(--color-border)',
                      boxShadow: selectedField === field.id ? 
                        `0 0 0 1px ${colors?.primary?.value || 'var(--color-primary)'}20` : 
                        'none'
                    }}
                    onClick={() => {
                      console.log('Selected field:', field.id);
                      setSelectedField(field.id);
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <Badge size="sm" variant="outline">{field.type}</Badge>
                          {field.required && <Badge size="sm" variant="destructive">Required</Badge>}
                        </div>
                        <FormFieldPreview field={field} />
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveField(index, 'up');
                          }}
                          disabled={index === 0}
                          style={{ padding: '4px 8px' }}
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
                          style={{ padding: '4px 8px' }}
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
                          style={{ padding: '4px 8px' }}
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
            <div style={{
              width: '320px',
              borderLeft: `2px solid ${colors?.primary?.value || 'var(--color-primary)'}`,
              background: `${colors?.background?.value || 'var(--color-background)'}`,
              padding: '20px',
              maxHeight: '100%',
              overflowY: 'auto'
            }}>
              <FormProperties
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
      return <Input type={field.type} label={field.label} placeholder={field.placeholder} disabled />;
    
    case 'textarea':
      return <Textarea label={field.label} placeholder={field.placeholder} disabled />;
    
    case 'select':
      return (
        <div>
          <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-foreground)', marginBottom: '6px', display: 'block' }}>
            {field.label}
          </label>
          <Select disabled>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      );
    
    case 'checkbox':
      return <Checkbox label={field.label} disabled />;
    
    case 'radio':
      return (
        <div>
          <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-foreground)', marginBottom: '8px', display: 'block' }}>
            {field.label}
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {field.options?.map(option => (
              <RadioButton key={option.value} name={field.id} label={option.label} disabled />
            ))}
          </div>
        </div>
      );
    
    case 'date':
      return <DatePickerMolecule label={field.label} disabled />;
    
    case 'toggle':
      return <Toggle label={field.label} disabled />;
    
    case 'divider':
      return <Separator />;
    
    default:
      return <div>Unknown field type</div>;
  }
}

// Properties Panel Component
function FormProperties({ field, onUpdate }: { field: FormField; onUpdate: (updates: Partial<FormField>) => void }) {
  console.log('FormProperties rendering for field:', field);
  
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--color-foreground)',
          marginBottom: '4px'
        }}>
          Field Properties
        </h4>
        <p style={{
          fontSize: '12px',
          color: 'var(--color-muted-foreground)',
          margin: 0
        }}>
          {field.type.charAt(0).toUpperCase() + field.type.slice(1)} • {field.label}
        </p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Input
          label="Label"
          value={field.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
        />
        
        {field.type !== 'divider' && (
          <>
            <Input
              label="Placeholder"
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
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-foreground)', marginBottom: '8px', display: 'block' }}>
              Options
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {field.options?.map((option, index) => (
                <div key={index} style={{ display: 'flex', gap: '6px' }}>
                  <Input
                    placeholder="Option label"
                    value={option.label}
                    onChange={(e) => {
                      const newOptions = [...(field.options || [])];
                      newOptions[index] = { ...option, label: e.target.value };
                      onUpdate({ options: newOptions });
                    }}
                    style={{ flex: 1 }}
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
    </div>
  );
}

// Preview Component
function FormPreview({ fields, onSubmit }: { fields: FormField[]; onSubmit?: (data: any) => void }) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div style={{ padding: '32px', maxWidth: '600px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {fields.map((field) => (
            <PreviewField
              key={field.id}
              field={field}
              value={formData[field.id]}
              onChange={(value) => setFormData(prev => ({ ...prev, [field.id]: value }))}
            />
          ))}
        </div>
        
        {fields.length > 0 && (
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <Button type="submit">Submit Form</Button>
            <Button type="button" variant="outline" onClick={() => setFormData({})}>
              Reset
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

// Preview Field Component
function PreviewField({ field, value, onChange }: { field: FormField; value: any; onChange: (value: any) => void }) {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
      return (
        <Input
          type={field.type}
          label={field.label}
          placeholder={field.placeholder}
          required={field.required}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    
    case 'textarea':
      return (
        <Textarea
          label={field.label}
          placeholder={field.placeholder}
          required={field.required}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    
    case 'select':
      return (
        <div>
          <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-foreground)', marginBottom: '6px', display: 'block' }}>
            {field.label}
            {field.required && <span style={{ color: 'var(--color-destructive)' }}> *</span>}
          </label>
          <Select value={value || ''} onChange={(e) => onChange(e.target.value)} required={field.required}>
            <option value="">Select an option...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      );
    
    case 'checkbox':
      return (
        <Checkbox
          label={field.label}
          checked={value || false}
          onChange={onChange}
          required={field.required}
        />
      );
    
    case 'radio':
      return (
        <div>
          <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-foreground)', marginBottom: '8px', display: 'block' }}>
            {field.label}
            {field.required && <span style={{ color: 'var(--color-destructive)' }}> *</span>}
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {field.options?.map(option => (
              <RadioButton
                key={option.value}
                name={field.id}
                label={option.label}
                value={option.value}
                checked={value === option.value}
                onChange={(checked) => checked && onChange(option.value)}
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

export default FormBuilderOrganism;