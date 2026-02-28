/**
 * RequestListOrganism - List of requests with status badges
 * Atomic Design: Organism
 *
 * @example
 * <RequestListOrganism
 *   requests={recentRequests}
 *   isLoading={false}
 *   baseHref="/client/requests"
 *   emptyMessage="No hay solicitudes"
 *   emptyActionLabel="Nueva Solicitud"
 *   emptyActionHref="/client/requests/new"
 *   title="Actividad Reciente"
 *   showClientName={false}
 * />
 */

import Link from 'next/link';
import { Card } from '@/components/primitives/ui/card';
import { Button } from '@/components/primitives/ui/button';
import { RequestStatusBadgeMolecule } from '@/components/molecules/request';
import { PriorityIcon } from '@/components/atoms-alianza/PriorityIcon';
import { formatDate } from '@/lib/utils/date';
import { ClipboardList, Plus } from 'lucide-react';
import { RequestListOrganismProps } from './RequestListOrganism.types';

export function RequestListOrganism({
  requests,
  isLoading,
  emptyMessage,
  emptyActionLabel,
  emptyActionHref,
  baseHref,
  title = 'Actividad Reciente',
  showClientName = false,
}: RequestListOrganismProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-4 p-4 border rounded-lg">
              <div className="h-10 w-10 bg-muted rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-center">
          <div>
            <ClipboardList className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">{emptyMessage}</p>
            {emptyActionLabel && emptyActionHref && (
              <>
                <p className="text-sm text-muted-foreground/70 mt-2">
                  {emptyActionLabel.includes('Nueva') ? 'Crea tu primera solicitud para comenzar' : 'Las nuevas solicitudes aparecerán aquí'}
                </p>
                <Link href={emptyActionHref}>
                  <Button className="mt-4" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    {emptyActionLabel}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <Link key={request.id} href={`${baseHref}/${request.id}`}>
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border border-muted hover:border-primary/30">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <PriorityIcon priority={request.priority} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{request.title}</h3>
                        {showClientName && request.client && (
                          <p className="text-xs text-muted-foreground">
                            Cliente: {request.client.name}
                          </p>
                        )}
                      </div>
                      <RequestStatusBadgeMolecule status={request.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
