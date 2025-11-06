'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from '@/context/TranslationContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/atomic-design/atoms/typography';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  ArrowLeft,
  Users,
  Settings,
  Crown,
  Calendar,
  Mail,
  Phone,
  Globe,
  MapPin,
  Edit,
  Plus,
  MoreVertical,
  UserPlus,
  Shield,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Company {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  website?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  logoUrl?: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  maxUsers: number;
}

interface CompanyMember {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'owner' | 'admin' | 'manager' | 'employee' | 'guest';
  status: 'active' | 'inactive' | 'pending';
  joinedAt: string;
  lastLogin?: string;
  avatar?: string;
}

// Mock data
const mockCompany: Company = {
  id: '1',
  name: 'Acme Corporation',
  description:
    'Leading technology solutions provider specializing in cloud infrastructure and AI-powered business tools.',
  industry: 'Technology',
  website: 'https://www.acme-corp.com',
  phone: '+34 91 123 45 67',
  address: 'Calle Gran Vía, 123',
  city: 'Madrid',
  country: 'España',
  logoUrl: undefined,
  memberCount: 25,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T15:30:00Z',
  isActive: true,
  plan: 'pro',
  maxUsers: 100,
};

const mockMembers: CompanyMember[] = [
  {
    id: '1',
    userId: '1',
    email: 'john.doe@acme-corp.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'owner',
    status: 'active',
    joinedAt: '2024-01-15T10:00:00Z',
    lastLogin: '2024-01-22T14:30:00Z',
  },
  {
    id: '2',
    userId: '2',
    email: 'jane.smith@acme-corp.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-01-16T09:15:00Z',
    lastLogin: '2024-01-22T11:45:00Z',
  },
  {
    id: '3',
    userId: '3',
    email: 'mike.johnson@acme-corp.com',
    firstName: 'Mike',
    lastName: 'Johnson',
    role: 'manager',
    status: 'active',
    joinedAt: '2024-01-18T16:20:00Z',
    lastLogin: '2024-01-21T10:15:00Z',
  },
  {
    id: '4',
    userId: '4',
    email: 'sarah.wilson@acme-corp.com',
    firstName: 'Sarah',
    lastName: 'Wilson',
    role: 'employee',
    status: 'pending',
    joinedAt: '2024-01-20T12:00:00Z',
  },
];

const roleLabels = {
  owner: 'Propietario',
  admin: 'Administrador',
  manager: 'Gerente',
  employee: 'Empleado',
  guest: 'Invitado',
};

const roleColors = {
  owner: 'bg-yellow-100 text-yellow-800',
  admin: 'bg-red-100 text-red-800',
  manager: 'bg-blue-100 text-blue-800',
  employee: 'bg-green-100 text-green-800',
  guest: 'bg-gray-100 text-gray-800',
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
};

const MemberCard: React.FC<{
  member: CompanyMember;
  onRoleChange: (memberId: string, newRole: string) => void;
  onRemove: (memberId: string) => void;
  canManage: boolean;
}> = ({ member, onRoleChange, onRemove, canManage }) => {
  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={`${member.firstName} ${member.lastName}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-primary">
                  {member.firstName[0]}
                  {member.lastName[0]}
                </span>
              )}
            </div>
            <div>
              <h4 className="font-medium">
                {member.firstName} {member.lastName}
              </h4>
              <p className="text-sm text-muted-foreground">{member.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className={cn('text-xs', roleColors[member.role])}>
              {roleLabels[member.role]}
            </Badge>
            <Badge className={cn('text-xs', statusColors[member.status])}>
              {member.status === 'active'
                ? 'Activo'
                : member.status === 'inactive'
                  ? 'Inactivo'
                  : 'Pendiente'}
            </Badge>

            {canManage && member.role !== 'owner' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onRoleChange(member.id, 'admin')}
                    disabled={member.role === 'admin'}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Hacer Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onRoleChange(member.id, 'manager')}
                    disabled={member.role === 'manager'}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Hacer Gerente
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onRoleChange(member.id, 'employee')}
                    disabled={member.role === 'employee'}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Hacer Empleado
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onRemove(member.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="mt-3 text-xs text-muted-foreground space-y-1">
          <p>Se unió: {formatDate(member.joinedAt)}</p>
          {member.lastLogin && (
            <p>Último acceso: {formatDate(member.lastLogin)}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('companies');

  const [company] = useState<Company>(mockCompany);
  const [members, setMembers] = useState<CompanyMember[]>(mockMembers);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<string>('employee');
  const [isInviting, setIsInviting] = useState(false);

  // TODO: Replace with real tRPC queries
  // const { data: company, isLoading } = trpc.company.getById.useQuery({ id: params.companyId as string });
  // const { data: members, refetch: refetchMembers } = trpc.company.getMembers.useQuery({ companyId: params.companyId as string });

  const handleInviteMember = async () => {
    if (!inviteEmail) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    setIsInviting(true);
    try {
      // TODO: Replace with real tRPC mutation
      // await inviteMember.mutateAsync({ companyId: company.id, email: inviteEmail, role: inviteRole });

      // Mock invitation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Invitación enviada exitosamente');
      setIsInviteModalOpen(false);
      setInviteEmail('');
      setInviteRole('employee');

      // Add pending member to list (mock)
      const newMember: CompanyMember = {
        id: Date.now().toString(),
        userId: Date.now().toString(),
        email: inviteEmail,
        firstName: 'Usuario',
        lastName: 'Invitado',
        role: inviteRole as any,
        status: 'pending',
        joinedAt: new Date().toISOString(),
      };
      setMembers((prev) => [...prev, newMember]);
    } catch (error) {
      toast.error('Error al enviar la invitación');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      // TODO: Replace with real tRPC mutation
      // await updateMemberRole.mutateAsync({ memberId, role: newRole });

      setMembers((prev) =>
        prev.map((member) =>
          member.id === memberId ? { ...member, role: newRole as any } : member,
        ),
      );
      toast.success('Rol actualizado exitosamente');
    } catch (error) {
      toast.error('Error al actualizar el rol');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este miembro?')) {
      return;
    }

    try {
      // TODO: Replace with real tRPC mutation
      // await removeMember.mutateAsync({ memberId });

      setMembers((prev) => prev.filter((member) => member.id !== memberId));
      toast.success('Miembro eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar el miembro');
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'bg-gray-100 text-gray-800';
      case 'basic':
        return 'bg-blue-100 text-blue-800';
      case 'pro':
        return 'bg-purple-100 text-purple-800';
      case 'enterprise':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateString));

  const activeMembers = members.filter((m) => m.status === 'active').length;
  const pendingMembers = members.filter((m) => m.status === 'pending').length;
  const canManageMembers = true; // TODO: Check permissions

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/companies">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <Typography
              variant="h1"
              className="text-3xl font-bold flex items-center"
            >
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-10 h-10 rounded-lg object-cover mr-3"
                />
              ) : (
                <Building2 className="w-8 h-8 mr-3" />
              )}
              {company.name}
            </Typography>
            <Typography variant="p" className="text-muted-foreground mt-1">
              {company.description}
            </Typography>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={cn('text-sm', getPlanColor(company.plan))}>
            {company.plan.toUpperCase()}
          </Badge>
          <div
            className={cn(
              'w-3 h-3 rounded-full',
              company.isActive ? 'bg-green-500' : 'bg-red-500',
            )}
          />
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="members">Miembros ({members.length})</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Miembros Activos
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {activeMembers}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Invitaciones Pendientes
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {pendingMembers}
                    </p>
                  </div>
                  <Mail className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Límite de Usuarios
                    </p>
                    <p className="text-2xl font-bold">
                      {company.maxUsers === 1000 ? '∞' : company.maxUsers}
                    </p>
                  </div>
                  <Crown className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Fecha de Creación
                    </p>
                    <p className="text-lg font-semibold">
                      {formatDate(company.createdAt)}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Empresa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {company.industry || 'No especificado'}
                    </p>
                    <p className="text-sm text-muted-foreground">Sector</p>
                  </div>
                </div>

                {company.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        {company.website}
                      </a>
                      <p className="text-sm text-muted-foreground">Sitio web</p>
                    </div>
                  </div>
                )}

                {company.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{company.phone}</p>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                    </div>
                  </div>
                )}

                {(company.address || company.city || company.country) && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {[company.address, company.city, company.country]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                      <p className="text-sm text-muted-foreground">Dirección</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Uso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>
                        Usuarios ({activeMembers}/
                        {company.maxUsers === 1000 ? '∞' : company.maxUsers})
                      </span>
                      <span>
                        {company.maxUsers === 1000
                          ? '0%'
                          : Math.round(
                              (activeMembers / company.maxUsers) * 100,
                            )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width:
                            company.maxUsers === 1000
                              ? '25%'
                              : `${(activeMembers / company.maxUsers) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Última actualización: {formatDate(company.updatedAt)}</p>
                    <p>
                      Plan actual:{' '}
                      {company.plan.charAt(0).toUpperCase() +
                        company.plan.slice(1)}
                    </p>
                    <p>Estado: {company.isActive ? 'Activa' : 'Inactiva'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                Miembros de la Empresa ({members.length})
              </h3>
              <p className="text-sm text-muted-foreground">
                Gestiona los miembros y sus roles
              </p>
            </div>
            {canManageMembers && (
              <Button onClick={() => setIsInviteModalOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Invitar Miembro
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {members.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onRoleChange={handleRoleChange}
                onRemove={handleRemoveMember}
                canManage={canManageMembers && member.role !== 'owner'}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de la Empresa</CardTitle>
              <CardDescription>
                Ajustes generales y configuraciones avanzadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Configuración Avanzada
                </h3>
                <p className="text-muted-foreground mb-4">
                  Funcionalidades de configuración empresarial próximamente
                </p>
                <Button variant="outline">Configurar Empresa</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Member Dialog */}
      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invitar Nuevo Miembro</DialogTitle>
            <DialogDescription>
              Envía una invitación por email para unirse a la empresa
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@empresa.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="role">Rol</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Empleado</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsInviteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleInviteMember}
              disabled={isInviting || !inviteEmail}
            >
              {isInviting ? 'Enviando...' : 'Enviar Invitación'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
