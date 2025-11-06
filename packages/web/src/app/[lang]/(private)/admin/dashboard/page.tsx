'use client';

import { Card } from '@/components/ui/card';
import { Construction, Settings, Wrench } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Panel de administración del sistema
        </p>
      </div>

      {/* Under Construction Card */}
      <div className="max-w-4xl mx-auto">
        <Card className="p-12 text-center border-dashed border-2 border-muted-foreground/20">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Construction className="h-16 w-16 text-orange-500" />
              <div className="absolute -top-2 -right-2">
                <div className="h-6 w-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Wrench className="h-3 w-3 text-yellow-800" />
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Dashboard en Construcción
          </h2>
          
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Estamos trabajando en el panel de administración. 
            Pronto tendrás acceso a todas las herramientas de gestión.
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Settings className="h-4 w-4" />
            <span>Sistema en desarrollo activo</span>
          </div>
        </Card>

        {/* Quick Stats Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="p-6 bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Usuarios</p>
                <p className="text-lg font-semibold">---</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Empresas</p>
                <p className="text-lg font-semibold">---</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Actividad</p>
                <p className="text-lg font-semibold">---</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}