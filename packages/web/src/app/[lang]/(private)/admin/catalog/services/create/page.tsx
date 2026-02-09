'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/primitives/Card';
import { Button } from '@/components/molecules-alianza/Button';
import { FormInput } from '@/components/molecules-alianza/FormInput';
import { FormSelect } from '@/components/molecules-alianza/FormSelect';
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';

interface ServiceForm {
  name: string;
  category: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export default function CreateServicePage() {
  const router = useRouter();
  const { lang } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ServiceForm>({
    name: '',
    category: '',
    status: 'ACTIVE',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
        setIsSubmitting(false);
        toast.success('Service created successfully (Mock)');
        router.push(`/${lang}/admin/catalog/services`);
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Crear Nuevo Servicio"
        description="Añade un nuevo servicio al catálogo."
        backHref={`/${lang}/admin/catalog/services`}
        backLabel="Volver a Servicios"
      />

      <Card>
        <CardHeader>
          <CardTitle>Información del Servicio</CardTitle>
          <CardDescription>
            Detalles básicos del servicio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <FormInput
              label="Nombre del Servicio *"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej. Limpieza de Oficina"
            />

            <FormSelect
              label="Categoría *"
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              options={[
                { value: 'Limpieza', label: 'Limpieza' },
                { value: 'Mantenimiento', label: 'Mantenimiento' },
                { value: 'Jardinería', label: 'Jardinería' },
              ]}
              placeholder="Seleccionar categoría"
            />

            <FormSelect
                label="Estado"
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as 'ACTIVE' | 'INACTIVE' })}
                options={[
                    { value: 'ACTIVE', label: 'Activo' },
                    { value: 'INACTIVE', label: 'Inactivo' },
                ]}
            />

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                variant="active" 
                disabled={isSubmitting}
                iconLeft={<Save className="h-4 w-4" />}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? 'Creando...' : 'Crear Servicio'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
