'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Search,
  Monitor,
  Smartphone,
  Globe,
  Key,
  Clock,
  MapPin,
  Ban,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  Lock,
  Unlock,
  LogOut
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Mock data for user sessions
const mockUserSessions = [
  {
    id: '1',
    userId: '1',
    user: { name: 'Juan Pérez', email: 'juan.perez@email.com' },
    deviceType: 'desktop',
    browser: 'Chrome 127',
    os: 'Windows 11',
    ipAddress: '192.168.1.100',
    location: 'Madrid, España',
    createdAt: '2024-07-22T09:30:00Z',
    lastActivity: '2024-07-22T11:45:00Z',
    isActive: true,
    isCurrent: false
  },
  {
    id: '2',
    userId: '1',
    user: { name: 'Juan Pérez', email: 'juan.perez@email.com' },
    deviceType: 'mobile',
    browser: 'Safari Mobile',
    os: 'iOS 17',
    ipAddress: '10.0.0.1',
    location: 'Madrid, España',
    createdAt: '2024-07-22T08:00:00Z',
    lastActivity: '2024-07-22T10:30:00Z',
    isActive: true,
    isCurrent: true
  },
  {
    id: '3',
    userId: '2',
    user: { name: 'María González', email: 'maria.gonzalez@empresa.com' },
    deviceType: 'desktop',
    browser: 'Firefox 126',
    os: 'macOS 14',
    ipAddress: '203.45.67.89',
    location: 'Barcelona, España',
    createdAt: '2024-07-21T16:20:00Z',
    lastActivity: '2024-07-22T09:15:00Z',
    isActive: false,
    isCurrent: false
  },
  {
    id: '4',
    userId: '3',
    user: { name: 'Carlos López', email: 'carlos.lopez@startup.io' },
    deviceType: 'tablet',
    browser: 'Edge 127',
    os: 'Android 14',
    ipAddress: '78.123.45.67',
    location: 'Valencia, España',
    createdAt: '2024-07-22T07:45:00Z',
    lastActivity: '2024-07-22T11:20:00Z',
    isActive: true,
    isCurrent: false
  }
];

// Mock data for API tokens
const mockApiTokens = [
  {
    id: '1',
    userId: '1',
    user: { name: 'Juan Pérez', email: 'juan.perez@email.com' },
    name: 'API Production',
    tokenPrefix: 'tok_1a2b3c4d',
    permissions: ['read', 'write'],
    createdAt: '2024-07-01T10:00:00Z',
    lastUsed: '2024-07-22T11:30:00Z',
    expiresAt: '2024-12-31T23:59:59Z',
    isActive: true
  },
  {
    id: '2',
    userId: '2',
    user: { name: 'María González', email: 'maria.gonzalez@empresa.com' },
    name: 'Mobile App Token',
    tokenPrefix: 'tok_5e6f7g8h',
    permissions: ['read'],
    createdAt: '2024-06-15T14:30:00Z',
    lastUsed: '2024-07-20T16:45:00Z',
    expiresAt: '2025-06-15T14:30:00Z',
    isActive: true
  },
  {
    id: '3',
    userId: '1',
    user: { name: 'Juan Pérez', email: 'juan.perez@email.com' },
    name: 'Test Integration',
    tokenPrefix: 'tok_9i0j1k2l',
    permissions: ['read', 'write', 'delete'],
    createdAt: '2024-07-15T09:00:00Z',
    lastUsed: null,
    expiresAt: '2024-08-15T09:00:00Z',
    isActive: false
  }
];

type DeviceType = 'desktop' | 'mobile' | 'tablet';

interface UserSession {
  id: string;
  userId: string;
  user: { name: string; email: string };
  deviceType: DeviceType;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  createdAt: string;
  lastActivity: string;
  isActive: boolean;
  isCurrent: boolean;
}

interface ApiToken {
  id: string;
  userId: string;
  user: { name: string; email: string };
  name: string;
  tokenPrefix: string;
  permissions: string[];
  createdAt: string;
  lastUsed: string | null;
  expiresAt: string;
  isActive: boolean;
}

export default function SecurityPage() {
  const [userSessions, setUserSessions] = useState<UserSession[]>(mockUserSessions);
  const [apiTokens, setApiTokens] = useState<ApiToken[]>(mockApiTokens);
  const [searchTerm, setSearchTerm] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UserSession | ApiToken | null>(null);

  const filteredSessions = userSessions.filter(session => {
    const matchesSearch = session.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.ipAddress.includes(searchTerm) ||
                         session.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDevice = deviceFilter === 'all' || session.deviceType === deviceFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && session.isActive) ||
                         (statusFilter === 'inactive' && !session.isActive);
    
    return matchesSearch && matchesDevice && matchesStatus;
  });

  const filteredTokens = apiTokens.filter(token => {
    const matchesSearch = token.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.tokenPrefix.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && token.isActive) ||
                         (statusFilter === 'inactive' && !token.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const getDeviceIcon = (deviceType: DeviceType) => {
    switch (deviceType) {
      case 'desktop': return <Monitor className="w-5 h-5" />;
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      case 'tablet': return <Monitor className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
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

  const calculateSessionDuration = (createdAt: string, lastActivity: string) => {
    const created = new Date(createdAt);
    const lastActive = new Date(lastActivity);
    const diff = lastActive.getTime() - created.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const revokeSession = (sessionId: string) => {
    setUserSessions(prev => prev.filter(session => session.id !== sessionId));
    setRevokeDialogOpen(false);
  };

  const revokeToken = (tokenId: string) => {
    setApiTokens(prev => prev.map(token => 
      token.id === tokenId ? { ...token, isActive: false } : token
    ));
    setRevokeDialogOpen(false);
  };

  const revokeAllUserSessions = (userId: string) => {
    setUserSessions(prev => prev.filter(session => 
      session.userId !== userId || session.isCurrent
    ));
  };

  const regenerateToken = (tokenId: string) => {
    // Simulate token regeneration
    alert(`Token ${tokenId} regenerado exitosamente`);
  };

  const isSessionExpired = (lastActivity: string) => {
    const lastActive = new Date(lastActivity);
    const now = new Date();
    const diff = now.getTime() - lastActive.getTime();
    return diff > (24 * 60 * 60 * 1000); // 24 hours
  };

  const isTokenExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Seguridad</h1>
          <p className="text-muted-foreground">
            Administra sesiones de usuario y tokens de API
          </p>
        </div>
      </div>

      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sessions">Sesiones de Usuario</TabsTrigger>
          <TabsTrigger value="tokens">Tokens de API</TabsTrigger>
          <TabsTrigger value="security">Configuración de Seguridad</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Sesiones Activas</p>
                    <p className="text-2xl font-bold">
                      {userSessions.filter(s => s.isActive).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Monitor className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Dispositivos Desktop</p>
                    <p className="text-2xl font-bold">
                      {userSessions.filter(s => s.deviceType === 'desktop').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Dispositivos Móviles</p>
                    <p className="text-2xl font-bold">
                      {userSessions.filter(s => s.deviceType === 'mobile').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium">Sesiones Sospechosas</p>
                    <p className="text-2xl font-bold">
                      {userSessions.filter(s => isSessionExpired(s.lastActivity)).length}
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
                      placeholder="Buscar por usuario, IP o ubicación..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Dispositivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los dispositivos</SelectItem>
                    <SelectItem value="desktop">Desktop</SelectItem>
                    <SelectItem value="mobile">Móvil</SelectItem>
                    <SelectItem value="tablet">Tablet</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="active">Activas</SelectItem>
                    <SelectItem value="inactive">Inactivas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Sessions List */}
          <Card>
            <CardHeader>
              <CardTitle>Sesiones de Usuario ({filteredSessions.length})</CardTitle>
              <CardDescription>
                Gestiona las sesiones activas y el acceso de usuarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                        {getDeviceIcon(session.deviceType)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">{session.user.name}</h3>
                          {session.isCurrent && (
                            <Badge variant="default" className="text-xs">
                              Sesión actual
                            </Badge>
                          )}
                          <Badge variant={session.isActive ? 'default' : 'secondary'} className="text-xs">
                            {session.isActive ? 'Activa' : 'Inactiva'}
                          </Badge>
                          {isSessionExpired(session.lastActivity) && (
                            <Badge variant="destructive" className="text-xs">
                              Expirada
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-1">{session.user.email}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">Dispositivo:</span><br />
                            {session.browser} - {session.os}
                          </div>
                          <div>
                            <span className="font-medium">IP:</span><br />
                            {session.ipAddress}
                          </div>
                          <div>
                            <span className="font-medium">Ubicación:</span><br />
                            {session.location}
                          </div>
                          <div>
                            <span className="font-medium">Duración:</span><br />
                            {calculateSessionDuration(session.createdAt, session.lastActivity)}
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground mt-2">
                          <span>Iniciada: {formatDate(session.createdAt)}</span>
                          <span className="mx-2">•</span>
                          <span>Última actividad: {formatDate(session.lastActivity)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => revokeAllUserSessions(session.userId)}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        disabled={session.isCurrent}
                      >
                        <LogOut className="w-4 h-4 mr-1" />
                        Cerrar todas
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(session);
                          setRevokeDialogOpen(true);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={session.isCurrent}
                      >
                        <Ban className="w-4 h-4 mr-1" />
                        Revocar
                      </Button>
                    </div>
                  </div>
                ))}
                
                {filteredSessions.length === 0 && (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No hay sesiones que coincidan con los filtros</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-6">
          {/* Token Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Key className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Tokens Activos</p>
                    <p className="text-2xl font-bold">
                      {apiTokens.filter(t => t.isActive).length}
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
                    <p className="text-sm font-medium">Próximos a Expirar</p>
                    <p className="text-2xl font-bold">
                      {apiTokens.filter(t => {
                        const expires = new Date(t.expiresAt);
                        const in30Days = new Date();
                        in30Days.setDate(in30Days.getDate() + 30);
                        return expires < in30Days && expires > new Date();
                      }).length}
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
                    <p className="text-sm font-medium">Expirados</p>
                    <p className="text-2xl font-bold">
                      {apiTokens.filter(t => isTokenExpired(t.expiresAt)).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Ban className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium">Revocados</p>
                    <p className="text-2xl font-bold">
                      {apiTokens.filter(t => !t.isActive).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tokens List */}
          <Card>
            <CardHeader>
              <CardTitle>Tokens de API ({filteredTokens.length})</CardTitle>
              <CardDescription>
                Gestiona los tokens de acceso a la API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTokens.map((token) => (
                  <div key={token.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                        <Key className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">{token.name}</h3>
                          <Badge variant={token.isActive ? 'default' : 'secondary'} className="text-xs">
                            {token.isActive ? 'Activo' : 'Revocado'}
                          </Badge>
                          {isTokenExpired(token.expiresAt) && (
                            <Badge variant="destructive" className="text-xs">
                              Expirado
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-1">{token.user.email}</p>
                        <p className="text-sm font-mono text-muted-foreground mb-2">{token.tokenPrefix}...</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">Permisos:</span>
                            <div className="flex gap-1 mt-1">
                              {token.permissions.map(permission => (
                                <Badge key={permission} variant="outline" className="text-xs">
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground mt-2">
                          <span>Creado: {formatDate(token.createdAt)}</span>
                          <span className="mx-2">•</span>
                          <span>Expira: {formatDate(token.expiresAt)}</span>
                          {token.lastUsed && (
                            <>
                              <span className="mx-2">•</span>
                              <span>Último uso: {formatDate(token.lastUsed)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {token.isActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => regenerateToken(token.id)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Regenerar
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(token);
                          setRevokeDialogOpen(true);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={!token.isActive}
                      >
                        <Ban className="w-4 h-4 mr-1" />
                        Revocar
                      </Button>
                    </div>
                  </div>
                ))}
                
                {filteredTokens.length === 0 && (
                  <div className="text-center py-8">
                    <Key className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No hay tokens que coincidan con los filtros</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Configuración de Seguridad
                </CardTitle>
                <CardDescription>
                  Configuraciones globales de seguridad del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Autenticación de dos factores</Label>
                      <p className="text-sm text-muted-foreground">Requerir 2FA para todos los usuarios</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Expiración de sesiones</Label>
                      <p className="text-sm text-muted-foreground">Cerrar sesiones después de 24h de inactividad</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Detección de dispositivos nuevos</Label>
                      <p className="text-sm text-muted-foreground">Notificar sobre inicios de sesión desde nuevos dispositivos</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Límite de sesiones concurrentes</Label>
                      <p className="text-sm text-muted-foreground">Máximo 5 sesiones por usuario</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Seguridad de API
                </CardTitle>
                <CardDescription>
                  Configuraciones de seguridad para tokens y API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Rate limiting</Label>
                      <p className="text-sm text-muted-foreground">1000 requests por minuto por token</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>IP whitelisting</Label>
                      <p className="text-sm text-muted-foreground">Restringir tokens a IPs específicas</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Expiración automática</Label>
                      <p className="text-sm text-muted-foreground">Tokens expiran después de 1 año</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Logs de auditoría</Label>
                      <p className="text-sm text-muted-foreground">Registrar todos los usos de tokens</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Seguridad</CardTitle>
              <CardDescription>
                Últimas alertas y eventos de seguridad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Múltiples intentos de acceso fallidos</AlertTitle>
                  <AlertDescription>
                    Se detectaron 5 intentos fallidos de login desde la IP 203.45.67.89 en los últimos 10 minutos.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Nuevo dispositivo autorizado</AlertTitle>
                  <AlertDescription>
                    Juan Pérez autorizó un nuevo dispositivo iPhone desde Madrid, España.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertTitle>Token próximo a expirar</AlertTitle>
                  <AlertDescription>
                    El token &quot;API Production&quot; expirará en 7 días. Considera renovarlo pronto.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Revoke Confirmation Dialog */}
      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedItem && 'user' in selectedItem ? 'Revocar Sesión' : 'Revocar Token'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem && 'user' in selectedItem 
                ? 'Esta acción cerrará la sesión del usuario inmediatamente. El usuario deberá iniciar sesión nuevamente.'
                : 'Esta acción revocará el token permanentemente. Las aplicaciones que lo usen dejarán de funcionar.'
              }
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="py-4">
              <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background">
                  {'user' in selectedItem ? <Monitor className="w-5 h-5" /> : <Key className="w-5 h-5" />}
                </div>
                <div>
                  {'user' in selectedItem ? (
                    <>
                      <p className="font-medium">{selectedItem.user.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedItem.user.email}</p>
                      <p className="text-sm text-muted-foreground">{selectedItem.ipAddress}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium">{selectedItem.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedItem.user.email}</p>
                      <p className="text-sm font-mono text-muted-foreground">{selectedItem.tokenPrefix}...</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                if (selectedItem) {
                  if ('user' in selectedItem) {
                    revokeSession(selectedItem.id);
                  } else {
                    revokeToken(selectedItem.id);
                  }
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmar Revocación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}