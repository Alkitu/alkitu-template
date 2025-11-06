'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  Search, 
  Download,
  UserX,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2,
  Eye,
  Lock,
  Key,
  Database
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

// Mock data for users and anonymization requests
const mockUsers = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    avatar: null,
    personalData: {
      phone: '+34 123 456 789',
      address: 'Calle Mayor 123, Madrid',
      company: 'Tech Solutions',
      jobTitle: 'Developer'
    },
    dataRetention: '2025-07-22',
    lastActivity: '2024-07-22T10:30:00Z',
    gdprStatus: 'compliant' as GDPRStatus
  },
  {
    id: '2',
    name: 'María González',
    email: 'maria.gonzalez@empresa.com',
    avatar: null,
    personalData: {
      phone: '+34 987 654 321',
      address: 'Avenida Principal 456, Barcelona',
      company: 'Digital Marketing',
      jobTitle: 'Marketing Manager'
    },
    dataRetention: '2025-03-15',
    lastActivity: '2024-07-21T15:45:00Z',
    gdprStatus: 'pending_review' as GDPRStatus
  },
  {
    id: '3',
    name: 'Carlos López',
    email: 'carlos.lopez@startup.io',
    avatar: null,
    personalData: {
      phone: '+34 555 123 456',
      address: 'Plaza Central 789, Valencia',
      company: 'Innovate Co',
      jobTitle: 'CTO'
    },
    dataRetention: '2024-12-31',
    lastActivity: '2024-07-20T08:15:00Z',
    gdprStatus: 'requires_action' as GDPRStatus
  }
];

const mockAnonymizationRequests = [
  {
    id: '1',
    userId: '2',
    user: {
      name: 'María González',
      email: 'maria.gonzalez@empresa.com'
    },
    requestedAt: '2024-07-20T10:00:00Z',
    reason: 'Solicitud de derecho al olvido - RGPD',
    status: 'pending' as AnonymizationStatus,
    reviewedBy: null,
    processedAt: null
  },
  {
    id: '2',
    userId: '3',
    user: {
      name: 'Carlos López',
      email: 'carlos.lopez@startup.io'
    },
    requestedAt: '2024-07-19T14:30:00Z',
    reason: 'Cuenta inactiva - eliminación automática',
    status: 'approved' as AnonymizationStatus,
    reviewedBy: 'Admin User',
    processedAt: '2024-07-20T09:00:00Z'
  }
];

type GDPRStatus = 'compliant' | 'pending_review' | 'requires_action';
type AnonymizationStatus = 'pending' | 'approved' | 'rejected' | 'completed';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  personalData: {
    phone: string;
    address: string;
    company: string;
    jobTitle: string;
  };
  dataRetention: string;
  lastActivity: string;
  gdprStatus: GDPRStatus;
}

interface AnonymizationRequest {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  requestedAt: string;
  reason: string;
  status: AnonymizationStatus;
  reviewedBy: string | null;
  processedAt: string | null;
}

export default function DataProtectionPage() {
  const [users] = useState<User[]>(mockUsers);
  const [anonymizationRequests, setAnonymizationRequests] = useState<AnonymizationRequest[]>(mockAnonymizationRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [gdprFilter, setGdprFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [anonymizeDialogOpen, setAnonymizeDialogOpen] = useState(false);
  const [dataExportDialogOpen, setDataExportDialogOpen] = useState(false);
  const [anonymizationReason, setAnonymizationReason] = useState('');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGdpr = gdprFilter === 'all' || user.gdprStatus === gdprFilter;
    
    return matchesSearch && matchesGdpr;
  });

  const getGdprStatusColor = (status: GDPRStatus) => {
    switch (status) {
      case 'compliant': return 'default';
      case 'pending_review': return 'secondary';
      case 'requires_action': return 'destructive';
      default: return 'secondary';
    }
  };

  const getGdprStatusIcon = (status: GDPRStatus) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-4 h-4" />;
      case 'pending_review': return <Clock className="w-4 h-4" />;
      case 'requires_action': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getAnonymizationStatusColor = (status: AnonymizationStatus) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'completed': return 'outline';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAnonymizeUser = (user: User) => {
    setSelectedUser(user);
    setAnonymizeDialogOpen(true);
  };

  const handleExportData = (user: User) => {
    setSelectedUser(user);
    setDataExportDialogOpen(true);
  };

  const confirmAnonymization = () => {
    if (selectedUser && anonymizationReason.trim()) {
      const newRequest: AnonymizationRequest = {
        id: Date.now().toString(),
        userId: selectedUser.id,
        user: {
          name: selectedUser.name,
          email: selectedUser.email
        },
        requestedAt: new Date().toISOString(),
        reason: anonymizationReason,
        status: 'pending' as AnonymizationStatus,
        reviewedBy: null,
        processedAt: null
      };

      setAnonymizationRequests(prev => [newRequest, ...prev]);
      setAnonymizeDialogOpen(false);
      setAnonymizationReason('');
    }
  };

  const exportUserData = () => {
    if (selectedUser) {
      // Simulate data export
      const userData = {
        user: selectedUser,
        exportedAt: new Date().toISOString(),
        dataTypes: ['profile', 'activity', 'preferences', 'messages']
      };
      
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${selectedUser.email}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setDataExportDialogOpen(false);
    }
  };

  const updateRequestStatus = (requestId: string, status: AnonymizationStatus) => {
    setAnonymizationRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { 
            ...request, 
            status, 
            reviewedBy: 'Admin User',
            processedAt: new Date().toISOString()
          }
        : request
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Protección de Datos</h1>
          <p className="text-muted-foreground">
            Gestiona el cumplimiento RGPD, anonimización y exportación de datos
          </p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Gestión de Usuarios</TabsTrigger>
          <TabsTrigger value="requests">Solicitudes de Anonimización</TabsTrigger>
          <TabsTrigger value="compliance">Cumplimiento RGPD</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Usuarios Conformes</p>
                    <p className="text-2xl font-bold">
                      {users.filter(u => u.gdprStatus === 'compliant').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium">Revisión Pendiente</p>
                    <p className="text-2xl font-bold">
                      {users.filter(u => u.gdprStatus === 'pending_review').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium">Requiere Acción</p>
                    <p className="text-2xl font-bold">
                      {users.filter(u => u.gdprStatus === 'requires_action').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <UserX className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Solicitudes Activas</p>
                    <p className="text-2xl font-bold">
                      {anonymizationRequests.filter(r => r.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar usuarios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={gdprFilter} onValueChange={setGdprFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Estado RGPD" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="compliant">Conformes</SelectItem>
                    <SelectItem value="pending_review">Revisión pendiente</SelectItem>
                    <SelectItem value="requires_action">Requiere acción</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>Usuarios y Protección de Datos ({filteredUsers.length})</CardTitle>
              <CardDescription>
                Gestiona la protección de datos personales y cumplimiento RGPD
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={user.avatar || undefined} />
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium truncate">{user.name}</h3>
                          <Badge variant={getGdprStatusColor(user.gdprStatus)} className="text-xs flex items-center gap-1">
                            {getGdprStatusIcon(user.gdprStatus)}
                            {user.gdprStatus}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        <div className="text-xs text-muted-foreground mt-1">
                          <p>Retención hasta: {formatDate(user.dataRetention)}</p>
                          <p>Última actividad: {formatDate(user.lastActivity)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportData(user)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Exportar
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAnonymizeUser(user)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <UserX className="w-4 h-4 mr-1" />
                        Anonimizar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes de Anonimización</CardTitle>
              <CardDescription>
                Revisa y procesa solicitudes de eliminación y anonimización de datos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {anonymizationRequests.map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{request.user.name}</h3>
                          <Badge variant={getAnonymizationStatusColor(request.status)} className="text-xs">
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{request.user.email}</p>
                        <p className="text-sm mb-2">{request.reason}</p>
                        <div className="text-xs text-muted-foreground">
                          <p>Solicitado: {formatDate(request.requestedAt)}</p>
                          {request.reviewedBy && (
                            <p>Revisado por: {request.reviewedBy}</p>
                          )}
                          {request.processedAt && (
                            <p>Procesado: {formatDate(request.processedAt)}</p>
                          )}
                        </div>
                      </div>

                      {request.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateRequestStatus(request.id, 'approved')}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            Aprobar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateRequestStatus(request.id, 'rejected')}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Rechazar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {anonymizationRequests.length === 0 && (
                  <div className="text-center py-8">
                    <UserX className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No hay solicitudes de anonimización</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Estado del Cumplimiento RGPD
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Sistema Conforme</AlertTitle>
                    <AlertDescription>
                      El sistema cumple con los requisitos básicos del RGPD
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Política de Privacidad</span>
                      <Badge variant="default">Actualizada</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Consentimiento Explícito</span>
                      <Badge variant="default">Implementado</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Derecho de Acceso</span>
                      <Badge variant="default">Funcional</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Derecho al Olvido</span>
                      <Badge variant="default">Implementado</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Portabilidad de Datos</span>
                      <Badge variant="secondary">Parcial</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Gestión de Datos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Database className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-2xl font-bold">2.4GB</p>
                      <p className="text-sm text-muted-foreground">Datos almacenados</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl font-bold">47</p>
                      <p className="text-sm text-muted-foreground">Exportaciones</p>
                    </div>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Atención Requerida</AlertTitle>
                    <AlertDescription>
                      3 usuarios requieren revisión de retención de datos
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Anonymization Dialog */}
      <Dialog open={anonymizeDialogOpen} onOpenChange={setAnonymizeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Anonimización de Usuario</DialogTitle>
            <DialogDescription>
              Esta acción iniciará el proceso de anonimización para {selectedUser?.name}. 
              Los datos personales serán eliminados de forma permanente.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg mb-4">
              <Avatar>
                <AvatarFallback>
                  {selectedUser?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedUser?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Motivo de la anonimización</label>
              <Textarea
                placeholder="Describe el motivo de esta solicitud..."
                value={anonymizationReason}
                onChange={(e) => setAnonymizationReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnonymizeDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={confirmAnonymization}
              disabled={!anonymizationReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              Crear Solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Data Export Dialog */}
      <Dialog open={dataExportDialogOpen} onOpenChange={setDataExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exportar Datos del Usuario</DialogTitle>
            <DialogDescription>
              Descargar todos los datos personales de {selectedUser?.name} en formato JSON
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg mb-4">
              <Avatar>
                <AvatarFallback>
                  {selectedUser?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedUser?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
              </div>
            </div>
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertTitle>Datos incluidos en la exportación:</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Información de perfil</li>
                  <li>Historial de actividad</li>
                  <li>Preferencias y configuración</li>
                  <li>Mensajes y comunicaciones</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDataExportDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={exportUserData}>
              <Download className="w-4 h-4 mr-2" />
              Descargar Datos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}