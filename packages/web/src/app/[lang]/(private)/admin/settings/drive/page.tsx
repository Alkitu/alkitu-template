'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';
import { Card } from '@/components/primitives/ui/card';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/ui/input';
import { Label } from '@/components/primitives/ui/label';
import { Badge } from '@/components/atoms-alianza/Badge';
import { toast } from 'sonner';
import {
  HardDrive,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  FolderOpen,
  Mail,
  Share2,
} from 'lucide-react';

const ROOT_FOLDER_ID = process.env.NEXT_PUBLIC_DRIVE_ROOT_FOLDER_ID || '';
const SERVICE_EMAIL = process.env.NEXT_PUBLIC_DRIVE_SERVICE_EMAIL || '';

export default function DriveSettingsPage() {
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [folderName, setFolderName] = useState<string | null>(null);
  const [driveMode, setDriveMode] = useState<string | null>(null);
  const [sharedDriveId, setSharedDriveId] = useState<string | null>(null);

  const handleTestConnection = async () => {
    if (!ROOT_FOLDER_ID) {
      toast.error('No se ha configurado NEXT_PUBLIC_DRIVE_ROOT_FOLDER_ID');
      return;
    }

    setTesting(true);
    setConnectionStatus('idle');

    try {
      const res = await fetch(
        `/api/drive/folders/${ROOT_FOLDER_ID}/contents`
      );

      if (res.ok) {
        const data = await res.json();
        setConnectionStatus('success');
        setFolderName(data.folder?.name || 'Root');
        toast.success('Conexion exitosa con Google Drive');

        // Fetch drive status to show mode
        try {
          const statusRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/drive/status`,
            {
              headers: {
                Authorization: `Bearer ${document.cookie.match(/auth-token=([^;]+)/)?.[1] || ''}`,
              },
            }
          );
          if (statusRes.ok) {
            const status = await statusRes.json();
            setDriveMode(status.mode);
            setSharedDriveId(status.sharedDriveId || null);
          }
        } catch {
          // Non-critical - just won't show mode info
        }
      } else {
        setConnectionStatus('error');
        const errorData = await res.json().catch(() => ({}));
        toast.error(
          errorData.error || `Error de conexion: ${res.status}`
        );
      }
    } catch {
      setConnectionStatus('error');
      toast.error('No se pudo conectar con el servidor');
    } finally {
      setTesting(false);
    }
  };

  const driveUrl = ROOT_FOLDER_ID
    ? `https://drive.google.com/drive/folders/${ROOT_FOLDER_ID}`
    : null;

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Google Drive"
        description="Configuracion de la integracion con Google Drive"
        backHref="/admin/settings"
        backLabel="Back to Settings"
      />

      {/* Connection Status Card */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <HardDrive className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Estado de Conexion</h3>
            <p className="text-sm text-muted-foreground">
              Verifica que las credenciales y la carpeta raiz esten
              configuradas correctamente
            </p>
          </div>
          <div className="ml-auto">
            {connectionStatus === 'success' && (
              <Badge variant="default" className="bg-green-600">
                Conectado
              </Badge>
            )}
            {connectionStatus === 'error' && (
              <Badge variant="destructive">Error</Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleTestConnection}
            disabled={testing || !ROOT_FOLDER_ID}
          >
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Probando...
              </>
            ) : (
              'Probar Conexion'
            )}
          </Button>

          {connectionStatus === 'success' && folderName && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>
                Carpeta encontrada: <strong>{folderName}</strong>
              </span>
              {driveMode && (
                <Badge variant="outline" className="ml-2">
                  {driveMode === 'shared_drive' ? (
                    <><Share2 className="h-3 w-3 mr-1" />Shared Drive</>
                  ) : (
                    'My Drive'
                  )}
                </Badge>
              )}
            </div>
          )}

          {connectionStatus === 'error' && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <XCircle className="h-4 w-4" />
              <span>No se pudo acceder a la carpeta</span>
            </div>
          )}
        </div>
      </Card>

      {/* Configuration Card */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Configuracion Actual</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Estas variables se configuran en el archivo{' '}
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
            .env
          </code>{' '}
          del servidor. Reinicia el servidor despues de cambiarlas.
        </p>

        <div className="space-y-4">
          {/* Root Folder ID */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Root Folder ID
            </Label>
            <div className="flex gap-2">
              <Input
                value={ROOT_FOLDER_ID || 'No configurado'}
                readOnly
                className="font-mono text-sm bg-muted"
              />
              {driveUrl && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(driveUrl, '_blank')}
                  title="Abrir en Google Drive"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Variable:{' '}
              <code className="bg-muted px-1 py-0.5 rounded">
                NEXT_PUBLIC_DRIVE_ROOT_FOLDER_ID
              </code>
            </p>
          </div>

          {/* Service Account Email */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Service Account Email
            </Label>
            <Input
              value={SERVICE_EMAIL || 'No configurado'}
              readOnly
              className="font-mono text-sm bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Variable:{' '}
              <code className="bg-muted px-1 py-0.5 rounded">
                NEXT_PUBLIC_DRIVE_SERVICE_EMAIL
              </code>
            </p>
          </div>

          {/* Shared Drive ID (shown when detected) */}
          {sharedDriveId && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Shared Drive ID
              </Label>
              <Input
                value={sharedDriveId}
                readOnly
                className="font-mono text-sm bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Variable:{' '}
                <code className="bg-muted px-1 py-0.5 rounded">
                  GOOGLE_DRIVE_SHARED_DRIVE_ID
                </code>
                {' '} — Modo: Shared Drive (Google Workspace)
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Help Card */}
      <Card className="p-6 border-dashed">
        <h3 className="font-semibold mb-2">Como configurar Google Drive</h3>
        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
          <li>
            Crea una Service Account en{' '}
            <a
              href="https://console.cloud.google.com/iam-admin/serviceaccounts"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary"
            >
              Google Cloud Console
            </a>
          </li>
          <li>
            Genera una clave privada (JSON) y extrae{' '}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">
              client_email
            </code>{' '}
            y{' '}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">
              private_key
            </code>
          </li>
          <li>
            <strong>My Drive:</strong> Comparte la carpeta con el email de la
            Service Account (rol Editor)
          </li>
          <li>
            <strong>Shared Drive (Workspace):</strong> Agrega la Service Account
            como miembro de la unidad compartida con rol{' '}
            <em>Content Manager</em> o superior, y configura{' '}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">
              GOOGLE_DRIVE_SHARED_DRIVE_ID
            </code>
          </li>
          <li>
            Copia el ID de la carpeta desde la URL de Google Drive
          </li>
          <li>
            Configura las variables de entorno en el archivo{' '}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">
              .env
            </code>{' '}
            del backend y frontend
          </li>
        </ol>
      </Card>
    </div>
  );
}
