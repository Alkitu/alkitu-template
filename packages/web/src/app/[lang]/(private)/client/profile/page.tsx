'use client';

import { Card } from '@/components/primitives/Card';
import { Button } from '@/components/primitives/Button';
import { User, Mail, Phone, Building2, MapPin } from 'lucide-react';
import Link from 'next/link';

/**
 * Client Profile Page
 *
 * Displays and allows editing of CLIENT user profile information.
 * Reuses the existing profile functionality but adds CLIENT-specific fields.
 */
export default function ClientProfilePage() {
  // This is a redirect/wrapper to the existing profile page
  // In production, this would either:
  // 1. Redirect to /profile with CLIENT context
  // 2. Render profile components with CLIENT-specific customization

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Perfil del Cliente</h1>

        <Card className="p-8 mb-6">
          <p className="text-muted-foreground mb-6">
            Para editar tu perfil completo, visita la página de perfil principal.
          </p>

          <Link href="/client/profile">
            <Button>
              <User className="h-4 w-4 mr-2" />
              Ir a Mi Perfil
            </Button>
          </Link>
        </Card>

        {/* Quick Info Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <User className="h-4 w-4" />
              Información Personal
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                Ver en perfil principal
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                Ver en perfil principal
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Información de Empresa
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Ver en perfil principal
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
