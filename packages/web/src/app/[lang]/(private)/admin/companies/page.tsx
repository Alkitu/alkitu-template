'use client';

import React, { useState } from 'react';
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
import {
  Building2,
  Plus,
  Search,
  Users,
  Settings,
  Crown,
  Calendar,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Company {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  plan?: 'free' | 'basic' | 'pro' | 'enterprise';
  logoUrl?: string;
}

// Mock data - will be replaced with real tRPC queries
const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    description: 'Leading technology solutions provider',
    industry: 'Technology',
    memberCount: 25,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    isActive: true,
    plan: 'pro',
  },
  {
    id: '2',
    name: 'Global Industries',
    description: 'Manufacturing and logistics',
    industry: 'Manufacturing',
    memberCount: 45,
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-05T11:20:00Z',
    isActive: true,
    plan: 'enterprise',
  },
  {
    id: '3',
    name: 'StartupCo',
    description: 'Innovative startup in fintech',
    industry: 'Finance',
    memberCount: 8,
    createdAt: '2024-03-10T14:45:00Z',
    updatedAt: '2024-03-12T16:10:00Z',
    isActive: false,
    plan: 'basic',
  },
];

const CompanyCard: React.FC<{
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (companyId: string) => void;
  onView: (companyId: string) => void;
}> = ({ company, onEdit, onDelete, onView }) => {
  const t = useTranslations('companies');

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

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
              ) : (
                <Building2 className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{company.name}</CardTitle>
              <CardDescription className="text-sm">
                {company.industry || 'Sin especificar'}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              className={cn('text-xs', getPlanColor(company.plan || 'free'))}
              variant="secondary"
            >
              {company.plan?.toUpperCase() || 'FREE'}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(company.id)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver detalles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(company)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(company.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {company.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {company.description}
          </p>
        )}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{company.memberCount} miembros</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Creada {formatDate(company.createdAt)}</span>
            </div>
          </div>
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              company.isActive ? 'bg-green-500' : 'bg-red-500',
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default function CompaniesPage() {
  const t = useTranslations('companies');
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');

  // TODO: Replace with real tRPC queries
  // const { data: companies, isLoading, refetch } = trpc.company.getUserCompanies.useQuery();

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPlan = selectedPlan === 'all' || company.plan === selectedPlan;
    return matchesSearch && matchesPlan;
  });

  const handleEdit = (company: Company) => {
    // TODO: Open edit modal or navigate to edit page
    toast.info(`Editando ${company.name} (próximamente)`);
  };

  const handleDelete = async (companyId: string) => {
    if (
      !window.confirm(
        '¿Estás seguro de que deseas eliminar esta empresa? Esta acción no se puede deshacer.',
      )
    ) {
      return;
    }

    try {
      // TODO: Replace with real tRPC mutation
      // await deleteCompany.mutateAsync({ companyId });
      setCompanies((prev) => prev.filter((c) => c.id !== companyId));
      toast.success('Empresa eliminada exitosamente');
    } catch (error) {
      toast.error('Error al eliminar la empresa');
    }
  };

  const handleView = (companyId: string) => {
    // Navigate to company details
    window.location.href = `/dashboard/companies/${companyId}`;
  };

  const stats = {
    total: companies.length,
    active: companies.filter((c) => c.isActive).length,
    inactive: companies.filter((c) => !c.isActive).length,
    totalMembers: companies.reduce((sum, c) => sum + c.memberCount, 0),
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h1" className="text-3xl font-bold">
            <Building2 className="w-8 h-8 inline mr-3" />
            Gestión de Empresas
          </Typography>
          <Typography variant="p" className="text-muted-foreground mt-1">
            Administra y supervisa todas las empresas registradas
          </Typography>
        </div>
        <Button asChild>
          <Link
            href="/dashboard/companies/create"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Empresa
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Empresas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Empresas Activas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Empresas Inactivas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-red-600">
              {stats.inactive}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Miembros
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalMembers}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar empresas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Todos los planes</option>
              <option value="free">Gratuito</option>
              <option value="basic">Básico</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Companies Grid */}
      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="w-16 h-16 text-muted-foreground mb-4" />
            <CardTitle className="text-xl mb-2">
              No se encontraron empresas
            </CardTitle>
            <CardDescription className="text-center">
              {searchTerm || selectedPlan !== 'all'
                ? 'No hay empresas que coincidan con los filtros aplicados.'
                : 'Aún no hay empresas registradas. Crea la primera empresa.'}
            </CardDescription>
            {!searchTerm && selectedPlan === 'all' && (
              <Button asChild className="mt-4">
                <Link href="/dashboard/companies/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Empresa
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
