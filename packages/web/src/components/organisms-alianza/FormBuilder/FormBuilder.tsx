'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/molecules-alianza/Button';
import { Card } from '@/components/primitives/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/primitives/ui/alert-dialog';
import { FieldsList } from './FieldsList';
import { FieldEditor } from './FieldEditor';
import { TemplatePreview } from './TemplatePreview';
import type { FormBuilderProps, TemplateField, RequestTemplate } from './FormBuilder.types';

export function FormBuilder({
  initialTemplate,
  onSave,
  onCancel,
  mode = 'create',
}: FormBuilderProps) {
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [editingField, setEditingField] = useState<TemplateField | null>(null);
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [deleteFieldId, setDeleteFieldId] = useState<string | null>(null);

  useEffect(() => {
    if (initialTemplate) {
      setFields(initialTemplate.fields);
    }
  }, [initialTemplate]);

  const handleAddField = () => {
    setEditingField(null);
    setShowFieldEditor(true);
  };

  const handleEditField = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field) {
      setEditingField(field);
      setShowFieldEditor(true);
    }
  };

  const handleDeleteField = (fieldId: string) => {
    setDeleteFieldId(fieldId);
  };

  const confirmDeleteField = () => {
    if (deleteFieldId) {
      setFields(fields.filter((f) => f.id !== deleteFieldId));
      setDeleteFieldId(null);
    }
  };

  const handleSaveField = (field: TemplateField) => {
    if (editingField) {
      // Update existing field
      setFields(fields.map((f) => (f.id === editingField.id ? field : f)));
    } else {
      // Add new field
      setFields([...fields, { ...field, order: fields.length }]);
    }
    setShowFieldEditor(false);
    setEditingField(null);
  };

  const handleSaveTemplate = () => {
    // Validate template
    if (fields.length === 0) {
      alert('El formulario debe tener al menos un campo');
      return;
    }

    // Check for duplicate IDs
    const ids = fields.map((f) => f.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      alert(`IDs duplicados encontrados: ${duplicateIds.join(', ')}`);
      return;
    }

    // Create template with version
    const template: RequestTemplate = {
      version: '1.0',
      fields: fields.map((field, index) => ({
        ...field,
        order: index,
      })),
    };

    onSave(template);
  };

  const currentTemplate: RequestTemplate = {
    version: '1.0',
    fields,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">
          {mode === 'create' ? 'Diseñar Formulario' : 'Editar Formulario'}
        </h2>
        <p className="text-muted-foreground mt-1">
          Configure los campos que los clientes deberán completar al solicitar este servicio
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Fields List */}
        <Card className="p-6">
          <FieldsList
            fields={fields}
            onAdd={handleAddField}
            onEdit={handleEditField}
            onDelete={handleDeleteField}
          />
        </Card>

        {/* Right: Preview */}
        <Card className="p-6 lg:sticky lg:top-6 lg:self-start">
          <TemplatePreview template={currentTemplate} />
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          {fields.length} {fields.length === 1 ? 'campo agregado' : 'campos agregados'}
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button onClick={handleSaveTemplate} disabled={fields.length === 0}>
            {mode === 'create' ? 'Guardar' : 'Actualizar'} Template
          </Button>
        </div>
      </div>

      {/* Field Editor Modal */}
      <FieldEditor
        field={editingField}
        isOpen={showFieldEditor}
        onClose={() => {
          setShowFieldEditor(false);
          setEditingField(null);
        }}
        onSave={handleSaveField}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteFieldId !== null} onOpenChange={() => setDeleteFieldId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar campo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El campo será eliminado permanentemente del
              formulario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteField}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
