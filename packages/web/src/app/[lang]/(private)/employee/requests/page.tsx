'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/primitives/Card';
import {
  ClipboardList,
  Filter,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

/**
 * Employee Requests Page
 *
 * Displays all requests assigned to the employee with filtering options.
 */

interface Request {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  client?: {
    name: string;
  };
}

export default function EmployeeRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/requests');
        if (response.ok) {
          const data = await response.json();
          const requestsData = Array.isArray(data) ? data : [];
          setRequests(requestsData);
          setFilteredRequests(requestsData);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    let filtered = requests;

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.client?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  }, [statusFilter, searchTerm, requests]);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; className: string; icon: typeof Clock }> = {
      PENDING: {
        text: 'Pendiente',
        className:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
        icon: Clock,
      },
      ONGOING: {
        text: 'En Proceso',
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
        icon: Clock,
      },
      COMPLETED: {
        text: 'Completada',
        className:
          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        icon: CheckCircle2,
      },
      CANCELLED: {
        text: 'Cancelada',
        className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        icon: XCircle,
      },
    };
    const badge = badges[status] || badges.PENDING;
    const Icon = badge.icon;

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${badge.className}`}
      >
        <Icon className="h-3 w-3" />
        {badge.text}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, { text: string; className: string }> = {
      HIGH: {
        text: 'Alta',
        className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      },
      MEDIUM: {
        text: 'Media',
        className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      },
      LOW: {
        text: 'Baja',
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      },
    };
    const badge = badges[priority] || badges.MEDIUM;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusCounts = {
    ALL: requests.length,
    PENDING: requests.filter((r) => r.status === 'PENDING').length,
    ONGOING: requests.filter((r) => r.status === 'ONGOING').length,
    COMPLETED: requests.filter((r) => r.status === 'COMPLETED').length,
    CANCELLED: requests.filter((r) => r.status === 'CANCELLED').length,
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Mis Solicitudes
        </h1>
        <p className="text-muted-foreground">
          Gestiona y visualiza todas las solicitudes asignadas
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por título, descripción o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">Todas ({statusCounts.ALL})</option>
              <option value="PENDING">Pendientes ({statusCounts.PENDING})</option>
              <option value="ONGOING">En Proceso ({statusCounts.ONGOING})</option>
              <option value="COMPLETED">Completadas ({statusCounts.COMPLETED})</option>
              <option value="CANCELLED">Canceladas ({statusCounts.CANCELLED})</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Requests List */}
      <Card className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse flex gap-4 p-4 border rounded-lg"
              >
                <div className="h-10 w-10 bg-muted rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-center">
            <div>
              <ClipboardList className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'ALL'
                  ? 'No se encontraron solicitudes con los filtros aplicados'
                  : 'No tienes solicitudes asignadas'}
              </p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                {searchTerm || statusFilter !== 'ALL'
                  ? 'Intenta cambiar los filtros de búsqueda'
                  : 'Las nuevas solicitudes aparecerán aquí'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((request) => (
              <Link key={request.id} href={`/employee/requests/${request.id}`}>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border border-muted hover:border-primary/30">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <AlertCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{request.title}</h3>
                          {request.client && (
                            <p className="text-xs text-muted-foreground">
                              Cliente: {request.client.name}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {getStatusBadge(request.status)}
                          {getPriorityBadge(request.priority)}
                        </div>
                      </div>
                      {request.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {request.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Creada: {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
