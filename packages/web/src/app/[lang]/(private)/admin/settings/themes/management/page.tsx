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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Palette,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Download,
  Upload,
  Building2,
  Users,
  Settings,
  Crown,
  MoreVertical,
  Brush,
  Save,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

interface Theme {
  id: string;
  name: string;
  description?: string;
  colors: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
  isPublic: boolean;
  companyId?: string;
  companyName?: string;
  author: string;
  usageCount: number;
  tags: string[];
}

interface ThemeRule {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  themeId: string;
  themeName: string;
  isActive: boolean;
  priority: number;
  conditions: {
    userRoles?: string[];
    timeRange?: { start: string; end: string };
    deviceType?: string[];
    location?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockThemes: Theme[] = [
  {
    id: '1',
    name: 'Ocean Blue',
    description: 'Professional blue theme with ocean vibes',
    colors: {
      primary: '210 70% 50%',
      secondary: '210 40% 90%',
      accent: '200 80% 60%',
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      muted: '210 40% 98%',
      'muted-foreground': '215.4 16.3% 46.9%',
      destructive: '0 84.2% 60.2%',
      border: '214.3 31.8% 91.4%',
      input: '214.3 31.8% 91.4%',
      ring: '210 70% 50%',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    isDefault: true,
    isPublic: true,
    author: 'Sistema',
    usageCount: 125,
    tags: ['professional', 'blue', 'ocean'],
  },
  {
    id: '2',
    name: 'Corporate Red',
    description: 'Bold red theme for enterprise companies',
    colors: {
      primary: '0 70% 50%',
      secondary: '0 40% 90%',
      accent: '10 80% 60%',
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      muted: '0 40% 98%',
      'muted-foreground': '215.4 16.3% 46.9%',
      destructive: '0 84.2% 60.2%',
      border: '214.3 31.8% 91.4%',
      input: '214.3 31.8% 91.4%',
      ring: '0 70% 50%',
    },
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-05T11:20:00Z',
    isDefault: false,
    isPublic: true,
    companyId: '1',
    companyName: 'Acme Corporation',
    author: 'John Doe',
    usageCount: 45,
    tags: ['corporate', 'red', 'bold'],
  },
  {
    id: '3',
    name: 'Nature Green',
    description: 'Eco-friendly green theme',
    colors: {
      primary: '120 70% 40%',
      secondary: '120 40% 85%',
      accent: '140 80% 50%',
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      muted: '120 40% 98%',
      'muted-foreground': '215.4 16.3% 46.9%',
      destructive: '0 84.2% 60.2%',
      border: '214.3 31.8% 91.4%',
      input: '214.3 31.8% 91.4%',
      ring: '120 70% 40%',
    },
    createdAt: '2024-03-10T14:45:00Z',
    updatedAt: '2024-03-12T16:10:00Z',
    isDefault: false,
    isPublic: false,
    companyId: '2',
    companyName: 'EcoTech Solutions',
    author: 'Jane Smith',
    usageCount: 22,
    tags: ['nature', 'green', 'eco-friendly'],
  },
];

const mockThemeRules: ThemeRule[] = [
  {
    id: '1',
    name: 'Executive Theme Rule',
    companyId: '1',
    companyName: 'Acme Corporation',
    themeId: '2',
    themeName: 'Corporate Red',
    isActive: true,
    priority: 1,
    conditions: {
      userRoles: ['owner', 'admin'],
      timeRange: { start: '09:00', end: '18:00' },
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    name: 'Default Company Theme',
    companyId: '2',
    companyName: 'EcoTech Solutions',
    themeId: '3',
    themeName: 'Nature Green',
    isActive: true,
    priority: 5,
    conditions: {},
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-05T11:20:00Z',
  },
];

const ThemeCard: React.FC<{
  theme: Theme;
  onEdit: (theme: Theme) => void;
  onDelete: (themeId: string) => void;
  onDuplicate: (theme: Theme) => void;
  onPreview: (theme: Theme) => void;
  onSetDefault: (themeId: string) => void;
}> = ({ theme, onEdit, onDelete, onDuplicate, onPreview, onSetDefault }) => {
  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateString));

  const colorPreview = Object.entries(theme.colors).slice(0, 5);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {theme.name}
                {theme.isDefault && (
                  <Badge variant="secondary" className="text-xs">
                    <Crown className="w-3 h-3 mr-1" />
                    Por defecto
                  </Badge>
                )}
                {theme.isPublic && (
                  <Badge variant="outline" className="text-xs">
                    Público
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-sm">
                {theme.description || 'Sin descripción'}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onPreview(theme)}>
                <Eye className="w-4 h-4 mr-2" />
                Vista previa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(theme)}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(theme)}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicar
              </DropdownMenuItem>
              {!theme.isDefault && (
                <DropdownMenuItem onClick={() => onSetDefault(theme.id)}>
                  <Crown className="w-4 h-4 mr-2" />
                  Establecer por defecto
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => onDelete(theme.id)}
                className="text-red-600"
                disabled={theme.isDefault}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Color Preview */}
        <div className="flex items-center space-x-2 mb-4">
          {colorPreview.map(([name, value]) => (
            <div
              key={name}
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: `oklch(${value})` }}
              title={name}
            />
          ))}
        </div>

        {/* Tags */}
        {theme.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {theme.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            <p>Por {theme.author}</p>
            {theme.companyName && (
              <p className="flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {theme.companyName}
              </p>
            )}
          </div>
          <div className="text-right">
            <p>{theme.usageCount} usos</p>
            <p>{formatDate(theme.updatedAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ThemeRuleCard: React.FC<{
  rule: ThemeRule;
  onEdit: (rule: ThemeRule) => void;
  onDelete: (ruleId: string) => void;
  onToggle: (ruleId: string, isActive: boolean) => void;
}> = ({ rule, onEdit, onDelete, onToggle }) => {
  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateString));

  const hasConditions = Object.values(rule.conditions).some(
    (condition) =>
      condition && (Array.isArray(condition) ? condition.length > 0 : true),
  );

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Switch
                checked={rule.isActive}
                onCheckedChange={(checked) => onToggle(rule.id, checked)}
              />
              <div>
                <h4 className="font-medium">{rule.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {rule.companyName} → {rule.themeName}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              Prioridad {rule.priority}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(rule)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(rule.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {hasConditions && (
          <div className="text-xs text-muted-foreground space-y-1">
            {rule.conditions.userRoles && (
              <p>Roles: {rule.conditions.userRoles.join(', ')}</p>
            )}
            {rule.conditions.timeRange && (
              <p>
                Horario: {rule.conditions.timeRange.start} -{' '}
                {rule.conditions.timeRange.end}
              </p>
            )}
            {rule.conditions.deviceType && (
              <p>Dispositivos: {rule.conditions.deviceType.join(', ')}</p>
            )}
            <p>Creada: {formatDate(rule.createdAt)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function ThemeManagementPage() {
  const t = useTranslations('themes');
  const [themes, setThemes] = useState<Theme[]>(mockThemes);
  const [themeRules, setThemeRules] = useState<ThemeRule[]>(mockThemeRules);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isCreateThemeModalOpen, setIsCreateThemeModalOpen] = useState(false);
  const [isCreateRuleModalOpen, setIsCreateRuleModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  // TODO: Replace with real tRPC queries
  // const { data: themes, refetch: refetchThemes } = trpc.theme.getCompanyThemes.useQuery();
  // const { data: themeRules, refetch: refetchRules } = trpc.theme.getThemeRulesForCompany.useQuery();

  const filteredThemes = themes.filter((theme) => {
    const matchesSearch =
      theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      theme.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'public' && theme.isPublic) ||
      (filterType === 'private' && !theme.isPublic) ||
      (filterType === 'default' && theme.isDefault);
    return matchesSearch && matchesFilter;
  });

  const handleCreateTheme = () => {
    setIsCreateThemeModalOpen(true);
  };

  const handleEditTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    setIsCreateThemeModalOpen(true);
  };

  const handleDeleteTheme = async (themeId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este tema?')) {
      return;
    }

    try {
      // TODO: Replace with real tRPC mutation
      setThemes((prev) => prev.filter((t) => t.id !== themeId));
      toast.success('Tema eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar el tema');
    }
  };

  const handleDuplicateTheme = async (theme: Theme) => {
    try {
      // TODO: Replace with real tRPC mutation
      const duplicatedTheme: Theme = {
        ...theme,
        id: Date.now().toString(),
        name: `${theme.name} (Copia)`,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
      };
      setThemes((prev) => [duplicatedTheme, ...prev]);
      toast.success('Tema duplicado exitosamente');
    } catch (error) {
      toast.error('Error al duplicar el tema');
    }
  };

  const handlePreviewTheme = (theme: Theme) => {
    // TODO: Implement theme preview
    toast.info(`Vista previa de "${theme.name}" (próximamente)`);
  };

  const handleSetDefaultTheme = async (themeId: string) => {
    try {
      // TODO: Replace with real tRPC mutation
      setThemes((prev) =>
        prev.map((t) => ({ ...t, isDefault: t.id === themeId })),
      );
      toast.success('Tema establecido como predeterminado');
    } catch (error) {
      toast.error('Error al establecer tema predeterminado');
    }
  };

  const handleCreateRule = () => {
    setIsCreateRuleModalOpen(true);
  };

  const handleEditRule = (rule: ThemeRule) => {
    // TODO: Implement rule editing
    toast.info(`Editando regla "${rule.name}" (próximamente)`);
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta regla?')) {
      return;
    }

    try {
      // TODO: Replace with real tRPC mutation
      setThemeRules((prev) => prev.filter((r) => r.id !== ruleId));
      toast.success('Regla eliminada exitosamente');
    } catch (error) {
      toast.error('Error al eliminar la regla');
    }
  };

  const handleToggleRule = async (ruleId: string, isActive: boolean) => {
    try {
      // TODO: Replace with real tRPC mutation
      setThemeRules((prev) =>
        prev.map((r) => (r.id === ruleId ? { ...r, isActive } : r)),
      );
      toast.success(`Regla ${isActive ? 'activada' : 'desactivada'}`);
    } catch (error) {
      toast.error('Error al cambiar el estado de la regla');
    }
  };

  const stats = {
    totalThemes: themes.length,
    publicThemes: themes.filter((t) => t.isPublic).length,
    activeRules: themeRules.filter((r) => r.isActive).length,
    totalUsage: themes.reduce((sum, t) => sum + t.usageCount, 0),
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h1" className="text-3xl font-bold">
            <Palette className="w-8 h-8 inline mr-3" />
            Gestión de Temas
          </Typography>
          <Typography variant="p" className="text-muted-foreground mt-1">
            Administra temas personalizados y reglas de aplicación por empresa
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Temas
                </p>
                <p className="text-2xl font-bold">{stats.totalThemes}</p>
              </div>
              <Palette className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Temas Públicos
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.publicThemes}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Reglas Activas
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.activeRules}
                </p>
              </div>
              <Settings className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Usos Totales
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.totalUsage}
                </p>
              </div>
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="themes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="themes">Temas ({themes.length})</TabsTrigger>
          <TabsTrigger value="rules">Reglas ({themeRules.length})</TabsTrigger>
          <TabsTrigger value="editor">Editor de Temas</TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="space-y-6">
          {/* Filters and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Buscar temas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="public">Públicos</SelectItem>
                  <SelectItem value="private">Privados</SelectItem>
                  <SelectItem value="default">Por defecto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreateTheme}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Tema
            </Button>
          </div>

          {/* Themes Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredThemes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                onEdit={handleEditTheme}
                onDelete={handleDeleteTheme}
                onDuplicate={handleDuplicateTheme}
                onPreview={handlePreviewTheme}
                onSetDefault={handleSetDefaultTheme}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                Reglas de Tema por Empresa
              </h3>
              <p className="text-sm text-muted-foreground">
                Define qué temas se aplican a cada empresa según condiciones
                específicas
              </p>
            </div>
            <Button onClick={handleCreateRule}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Regla
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {themeRules.map((rule) => (
              <ThemeRuleCard
                key={rule.id}
                rule={rule}
                onEdit={handleEditRule}
                onDelete={handleDeleteRule}
                onToggle={handleToggleRule}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Editor de Temas Visual</CardTitle>
              <CardDescription>
                Crea y edita temas usando el editor visual integrado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Brush className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Editor Visual de Temas
                </h3>
                <p className="text-muted-foreground mb-4">
                  Editor de temas con previsualización en tiempo real
                  próximamente
                </p>
                <Button variant="outline">
                  <Palette className="w-4 h-4 mr-2" />
                  Abrir Editor
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Theme Modal */}
      <Dialog
        open={isCreateThemeModalOpen}
        onOpenChange={setIsCreateThemeModalOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedTheme ? 'Editar Tema' : 'Crear Nuevo Tema'}
            </DialogTitle>
            <DialogDescription>
              {selectedTheme
                ? 'Modifica la configuración del tema existente'
                : 'Crea un nuevo tema personalizado para tu empresa'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="theme-name">Nombre del tema *</Label>
                <Input
                  id="theme-name"
                  placeholder="Mi tema personalizado"
                  defaultValue={selectedTheme?.name}
                />
              </div>
              <div>
                <Label htmlFor="theme-author">Autor</Label>
                <Input
                  id="theme-author"
                  placeholder="Tu nombre"
                  defaultValue={selectedTheme?.author}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="theme-description">Descripción</Label>
              <Textarea
                id="theme-description"
                placeholder="Descripción del tema..."
                defaultValue={selectedTheme?.description}
              />
            </div>

            <div>
              <Label htmlFor="theme-tags">
                Etiquetas (separadas por comas)
              </Label>
              <Input
                id="theme-tags"
                placeholder="corporativo, azul, profesional"
                defaultValue={selectedTheme?.tags.join(', ')}
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch defaultChecked={selectedTheme?.isPublic} />
                <Label>Tema público</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch defaultChecked={selectedTheme?.isDefault} />
                <Label>Establecer como predeterminado</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateThemeModalOpen(false);
                setSelectedTheme(null);
              }}
            >
              Cancelar
            </Button>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              {selectedTheme ? 'Guardar Cambios' : 'Crear Tema'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Rule Modal */}
      <Dialog
        open={isCreateRuleModalOpen}
        onOpenChange={setIsCreateRuleModalOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nueva Regla de Tema</DialogTitle>
            <DialogDescription>
              Define condiciones para aplicar un tema específico a una empresa
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="rule-name">Nombre de la regla *</Label>
              <Input id="rule-name" placeholder="Regla de tema ejecutivo" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rule-company">Empresa *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Acme Corporation</SelectItem>
                    <SelectItem value="2">EcoTech Solutions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rule-theme">Tema *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tema" />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((theme) => (
                      <SelectItem key={theme.id} value={theme.id}>
                        {theme.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="rule-priority">Prioridad (1-10)</Label>
              <Input
                id="rule-priority"
                type="number"
                min="1"
                max="10"
                defaultValue="5"
              />
            </div>

            <div>
              <Label>Condiciones (opcional)</Label>
              <div className="space-y-3 mt-2">
                <div>
                  <Label className="text-sm">Roles de usuario</Label>
                  <Input placeholder="owner, admin, manager (separados por comas)" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-sm">Hora inicio</Label>
                    <Input type="time" />
                  </div>
                  <div>
                    <Label className="text-sm">Hora fin</Label>
                    <Input type="time" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateRuleModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Crear Regla
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
