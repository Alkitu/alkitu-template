'use client';

import { Card } from '@/components/primitives/Card';
import { Button } from '@/components/primitives/Button';
import { CheckCircle2, ArrowRight, User, MapPin, Bell } from 'lucide-react';
import Link from 'next/link';

/**
 * Client Onboarding Page
 *
 * Guides new CLIENT users through initial setup steps.
 */
export default function ClientOnboardingPage() {
  // Mock completion status - will be replaced with actual user data
  const onboardingSteps = [
    {
      id: 1,
      title: 'Completa tu perfil',
      description: 'Agrega tu información personal y de contacto',
      completed: false,
      icon: User,
      link: '/profile',
    },
    {
      id: 2,
      title: 'Agrega una ubicación de trabajo',
      description: 'Registra al menos una ubicación donde se realizarán los servicios',
      completed: false,
      icon: MapPin,
      link: '/locations',
    },
    {
      id: 3,
      title: 'Crea tu primera solicitud',
      description: 'Prueba el sistema creando una solicitud de servicio',
      completed: false,
      icon: Bell,
      link: '/client/requests/new',
    },
  ];

  const completedCount = onboardingSteps.filter(step => step.completed).length;
  const totalSteps = onboardingSteps.length;
  const progressPercentage = (completedCount / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bienvenido a Alkitu</h1>
          <p className="text-muted-foreground">
            Completa estos pasos para comenzar a usar la plataforma
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">
              Progreso de configuración
            </span>
            <span className="text-sm text-muted-foreground">
              {completedCount} de {totalSteps} completados
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </Card>

        {/* Onboarding Steps */}
        <div className="space-y-4">
          {onboardingSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <Card
                key={step.id}
                className={`p-6 transition-all ${
                  step.completed
                    ? 'border-green-500/30 bg-green-50/50 dark:bg-green-900/10'
                    : 'hover:shadow-lg'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Step Number / Check */}
                  <div
                    className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${
                      step.completed
                        ? 'bg-green-100 dark:bg-green-900/20'
                        : 'bg-primary/10'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <Icon className="h-6 w-6 text-primary" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                      {index + 1}. {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {step.description}
                    </p>

                    {!step.completed && (
                      <Link href={step.link}>
                        <Button size="sm">
                          Comenzar
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    )}

                    {step.completed && (
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                        ✓ Completado
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Completion Card */}
        {completedCount === totalSteps && (
          <Card className="p-8 mt-8 text-center bg-gradient-to-br from-primary/10 to-primary/5">
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              ¡Configuración Completada!
            </h2>
            <p className="text-muted-foreground mb-6">
              Ya estás listo para usar la plataforma al máximo
            </p>
            <Link href="/client/dashboard">
              <Button size="lg">
                Ir al Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
