'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Save, Trash2, ArrowLeft } from 'lucide-react';
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

export default function EditServicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  // Unwrap params using React.use for Next.js 15+ compatibility or standard access if not async in this setup
  // For safety in this template environment, assuming standard access or simple unwrapping
  const { lang, id } = useParams(); 
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<ServiceForm>({
    name: '',
    category: '',
    status: 'ACTIVE',
  });

  // Mock Fetch Data
  useEffect(() => {
    // Simulate API fetch
    const fetchService = () => {
        setTimeout(() => {
            setFormData({
                name: 'Limpieza de Oficina', // Mock data
                category: 'Limpieza',
                status: 'ACTIVE',
            });
            setIsLoading(false);
        }, 500);
    };
    fetchService();
  }, [id]);

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
        toast.success('Service updated successfully (Mock)');
        router.push(`/${lang}/admin/catalog/services`);
    }, 1000);
  };

  const handleDelete = () => {
    if(confirm('Are you sure you want to delete this service?')) {
        toast.success('Service deleted (Mock)');
        router.push(`/${lang}/admin/catalog/services`);
    }
  }

  if (isLoading) {
      return <div className="p-6">Loading service details...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title={`Editar Servicio: ${formData.name}`}
        description="Modifica los detalles del servicio."
        backHref={`/${lang}/admin/catalog/services`}
        backLabel="Volver a Servicios"
        actions={
            <Button variant="destructive" onClick={handleDelete} iconLeft={<Trash2 className="h-4 w-4" />}>
                Eliminar
            </Button>
        }
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
                {isSubmitting ? 'Guardar Cambios' : 'Guardar Cambios'}
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
