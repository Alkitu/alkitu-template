'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Settings } from 'lucide-react';

/**
 * Feature Disabled Page
 *
 * Displayed when a user tries to access a feature-gated route
 * while the feature flag is disabled.
 *
 * Query params:
 * - feature: The feature flag key that is disabled
 * - redirect: The original URL the user tried to access
 */
export default function FeatureDisabledPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const feature = searchParams.get('feature') || 'unknown';
  const redirect = searchParams.get('redirect') || '/admin/dashboard';

  // Map feature keys to user-friendly names
  const featureNames: Record<string, string> = {
    'support-chat': 'Chat de Soporte',
    'team-channels': 'Canales de Equipo',
    'analytics': 'Análisis y Reportes',
    'notifications': 'Notificaciones',
    'request-collaboration': 'Colaboración en Solicitudes',
  };

  const featureName = featureNames[feature] || feature;

  const handleGoBack = () => {
    router.back();
  };

  const handleGoToDashboard = () => {
    router.push('/admin/dashboard');
  };

  const handleGoToSettings = () => {
    router.push('/admin/settings/addons');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-warning-100 p-4">
            <AlertCircle className="h-12 w-12 text-warning-600" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Función No Disponible
          </h1>
          <p className="text-base text-foreground-600">
            La función <span className="font-semibold">{featureName}</span>{' '}
            está actualmente deshabilitada.
          </p>
        </div>

        {/* Description */}
        <div className="rounded-lg bg-default-100 p-4 text-left">
          <h3 className="mb-2 text-sm font-semibold text-foreground">
            ¿Por qué veo esto?
          </h3>
          <p className="text-sm text-foreground-600">
            Esta función ha sido deshabilitada temporalmente por un
            administrador. Si crees que esto es un error o necesitas acceso a
            esta función, por favor contacta a tu administrador del sistema.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-blue-700"
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver Atrás
          </button>

          <button
            className="w-full rounded-lg bg-gray-100 px-6 py-3 text-lg font-medium text-gray-900 transition-colors hover:bg-gray-200"
            onClick={handleGoToDashboard}
          >
            Ir al Dashboard
          </button>

          <button
            className="flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-lg font-medium text-gray-600 transition-colors hover:bg-gray-50"
            onClick={handleGoToSettings}
          >
            <Settings className="h-4 w-4" />
            Ver Configuración de Funciones
          </button>
        </div>

        {/* Additional Info */}
        <div className="pt-4 text-xs text-foreground-500">
          <p>
            Intentabas acceder a:{' '}
            <code className="rounded bg-default-200 px-1 py-0.5">
              {redirect}
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
