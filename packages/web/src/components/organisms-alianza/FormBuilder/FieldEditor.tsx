'use client';

import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/primitives/ui/sheet';
import { Button } from '@/components/molecules-alianza/Button';
import { Input } from '@/components/primitives/ui/input';
import { Label } from '@/components/primitives/ui/label';
import { Switch } from '@/components/primitives/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/ui/select';
import { Textarea } from '@/components/primitives/ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { FieldEditorProps, TemplateField, FieldType, FieldOption } from './FormBuilder.types';

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Texto' },
  { value: 'textarea', label: 'Área de texto' },
  { value: 'number', label: 'Número' },
  { value: 'select', label: 'Selector' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'checkboxGroup', label: 'Grupo de Checkboxes' },
  { value: 'date', label: 'Fecha' },
  { value: 'time', label: 'Hora' },
  { value: 'file', label: 'Archivo' },
];

export function FieldEditor({ field, isOpen, onClose, onSave }: FieldEditorProps) {
  const [editedField, setEditedField] = useState<TemplateField>({
    id: '',
    type: 'text',
    label: '',
    required: false,
  });

  const [options, setOptions] = useState<FieldOption[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    if (field) {
      setEditedField(field);
      setOptions(field.options || []);
      setShowValidation(!!field.validation);
    } else {
      // Reset for new field
      setEditedField({
        id: '',
        type: 'text',
        label: '',
        required: false,
      });
      setOptions([]);
      setShowValidation(false);
    }
  }, [field]);

  const generateFieldId = (label: string): string => {
    return label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  };

  const handleLabelChange = (newLabel: string) => {
    setEditedField((prev) => ({
      ...prev,
      label: newLabel,
      id: prev.id || generateFieldId(newLabel),
    }));
  };

  const handleTypeChange = (newType: FieldType) => {
    setEditedField((prev) => ({ ...prev, type: newType }));

    // Clear options if type doesn't support them
    if (!['select', 'radio', 'checkboxGroup'].includes(newType)) {
      setOptions([]);
    }
  };

  const addOption = () => {
    setOptions([...options, { value: '', label: '' }]);
  };

  const updateOption = (index: number, key: 'value' | 'label', value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [key]: value };
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const fieldToSave: TemplateField = {
      ...editedField,
      options: ['select', 'radio', 'checkboxGroup'].includes(editedField.type) ? options : undefined,
    };

    onSave(fieldToSave);
    onClose();
  };

  const isValid = editedField.label.trim() !== '' && editedField.id.trim() !== '';
  const needsOptions = ['select', 'radio', 'checkboxGroup'].includes(editedField.type);
  const hasValidOptions = !needsOptions || options.length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{field ? 'Editar Campo' : 'Nuevo Campo'}</SheetTitle>
          <SheetDescription>
            Configure las propiedades del campo del formulario
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Field Type */}
          <div className="space-y-2">
            <Label htmlFor="field-type">Tipo de Campo *</Label>
            <Select value={editedField.type} onValueChange={handleTypeChange}>
              <SelectTrigger id="field-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Label */}
          <div className="space-y-2">
            <Label htmlFor="field-label">Etiqueta *</Label>
            <Input
              id="field-label"
              value={editedField.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="Ej: Describe el problema"
            />
          </div>

          {/* ID */}
          <div className="space-y-2">
            <Label htmlFor="field-id">ID del Campo *</Label>
            <Input
              id="field-id"
              value={editedField.id}
              onChange={(e) => setEditedField({ ...editedField, id: e.target.value })}
              placeholder="ej: describe_el_problema"
            />
            <p className="text-xs text-muted-foreground">
              Se genera automáticamente desde la etiqueta
            </p>
          </div>

          {/* Required */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="field-required">Campo Requerido</Label>
              <p className="text-xs text-muted-foreground">
                Los usuarios deben completar este campo
              </p>
            </div>
            <Switch
              id="field-required"
              checked={editedField.required}
              onCheckedChange={(checked) => setEditedField({ ...editedField, required: checked })}
            />
          </div>

          {/* Placeholder */}
          <div className="space-y-2">
            <Label htmlFor="field-placeholder">Placeholder</Label>
            <Input
              id="field-placeholder"
              value={editedField.placeholder || ''}
              onChange={(e) => setEditedField({ ...editedField, placeholder: e.target.value })}
              placeholder="Texto de ayuda en el campo"
            />
          </div>

          {/* Help Text */}
          <div className="space-y-2">
            <Label htmlFor="field-help">Texto de Ayuda</Label>
            <Textarea
              id="field-help"
              value={editedField.helpText || ''}
              onChange={(e) => setEditedField({ ...editedField, helpText: e.target.value })}
              placeholder="Información adicional para el usuario"
              rows={3}
            />
          </div>

          {/* Options (for select, radio, checkboxGroup) */}
          {needsOptions && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Opciones *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Agregar Opción
                </Button>
              </div>

              {options.map((option, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Valor (ej: baja)"
                      value={option.value}
                      onChange={(e) => updateOption(index, 'value', e.target.value)}
                    />
                    <Input
                      placeholder="Etiqueta (ej: Baja)"
                      value={option.label}
                      onChange={(e) => updateOption(index, 'label', e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                    className="mt-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {options.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Agregue al menos una opción
                </p>
              )}
            </div>
          )}

          {/* Validation (expandable) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-validation">Validaciones Avanzadas</Label>
              <Switch
                id="show-validation"
                checked={showValidation}
                onCheckedChange={setShowValidation}
              />
            </div>

            {showValidation && (
              <div className="space-y-3 pl-4 border-l-2">
                {(editedField.type === 'text' || editedField.type === 'textarea') && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="min-length">Longitud Mínima</Label>
                      <Input
                        id="min-length"
                        type="number"
                        value={editedField.validation?.minLength || ''}
                        onChange={(e) =>
                          setEditedField({
                            ...editedField,
                            validation: {
                              ...editedField.validation,
                              minLength: parseInt(e.target.value) || undefined,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-length">Longitud Máxima</Label>
                      <Input
                        id="max-length"
                        type="number"
                        value={editedField.validation?.maxLength || ''}
                        onChange={(e) =>
                          setEditedField({
                            ...editedField,
                            validation: {
                              ...editedField.validation,
                              maxLength: parseInt(e.target.value) || undefined,
                            },
                          })
                        }
                      />
                    </div>
                  </>
                )}

                {editedField.type === 'number' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="min-value">Valor Mínimo</Label>
                      <Input
                        id="min-value"
                        type="number"
                        value={editedField.validation?.min || ''}
                        onChange={(e) =>
                          setEditedField({
                            ...editedField,
                            validation: {
                              ...editedField.validation,
                              min: parseInt(e.target.value) || undefined,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-value">Valor Máximo</Label>
                      <Input
                        id="max-value"
                        type="number"
                        value={editedField.validation?.max || ''}
                        onChange={(e) =>
                          setEditedField({
                            ...editedField,
                            validation: {
                              ...editedField.validation,
                              max: parseInt(e.target.value) || undefined,
                            },
                          })
                        }
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="custom-message">Mensaje de Error Personalizado</Label>
                  <Input
                    id="custom-message"
                    value={editedField.validation?.customMessage || ''}
                    onChange={(e) =>
                      setEditedField({
                        ...editedField,
                        validation: {
                          ...editedField.validation,
                          customMessage: e.target.value,
                        },
                      })
                    }
                    placeholder="Mensaje cuando falla la validación"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!isValid || !hasValidOptions}>
            {field ? 'Actualizar' : 'Agregar'} Campo
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
