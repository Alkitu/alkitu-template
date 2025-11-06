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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import {
  CreditCard,
  DollarSign,
  Calendar,
  Download,
  Eye,
  MoreVertical,
  Building2,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Receipt,
  FileText,
  Search,
  Filter,
  Plus,
  BarChart,
} from 'lucide-react';
import Link from 'next/link';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface BillingRecord {
  id: string;
  companyId: string;
  companyName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
  billingPeriod: {
    start: string;
    end: string;
  };
  dueDate: string;
  paidDate?: string;
  invoiceNumber: string;
  description: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  paymentMethod?: {
    type: 'card' | 'bank_transfer' | 'paypal';
    last4?: string;
    brand?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface BillingStats {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingAmount: number;
  paidInvoices: number;
  pendingInvoices: number;
  failedInvoices: number;
  revenueGrowth: number;
  averageInvoiceValue: number;
}

// Mock data
const mockBillingRecords: BillingRecord[] = [
  {
    id: '1',
    companyId: '1',
    companyName: 'Acme Corporation',
    amount: 299.99,
    currency: 'EUR',
    status: 'paid',
    billingPeriod: {
      start: '2024-01-01',
      end: '2024-01-31',
    },
    dueDate: '2024-02-15',
    paidDate: '2024-02-10',
    invoiceNumber: 'INV-2024-001',
    description: 'Plan Pro - Enero 2024',
    items: [
      {
        description: 'Plan Pro (100 usuarios)',
        quantity: 1,
        unitPrice: 249.99,
        total: 249.99,
      },
      {
        description: 'Usuarios adicionales (10)',
        quantity: 10,
        unitPrice: 5.0,
        total: 50.0,
      },
    ],
    paymentMethod: {
      type: 'card',
      last4: '4242',
      brand: 'Visa',
    },
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-10T15:30:00Z',
  },
  {
    id: '2',
    companyId: '2',
    companyName: 'EcoTech Solutions',
    amount: 99.99,
    currency: 'EUR',
    status: 'pending',
    billingPeriod: {
      start: '2024-01-01',
      end: '2024-01-31',
    },
    dueDate: '2024-02-15',
    invoiceNumber: 'INV-2024-002',
    description: 'Plan Básico - Enero 2024',
    items: [
      {
        description: 'Plan Básico (25 usuarios)',
        quantity: 1,
        unitPrice: 99.99,
        total: 99.99,
      },
    ],
    paymentMethod: {
      type: 'bank_transfer',
    },
    createdAt: '2024-02-01T11:00:00Z',
    updatedAt: '2024-02-01T11:00:00Z',
  },
  {
    id: '3',
    companyId: '3',
    companyName: 'StartupCo',
    amount: 29.99,
    currency: 'EUR',
    status: 'failed',
    billingPeriod: {
      start: '2024-01-01',
      end: '2024-01-31',
    },
    dueDate: '2024-02-15',
    invoiceNumber: 'INV-2024-003',
    description: 'Plan Básico - Enero 2024',
    items: [
      {
        description: 'Plan Básico (5 usuarios)',
        quantity: 1,
        unitPrice: 29.99,
        total: 29.99,
      },
    ],
    paymentMethod: {
      type: 'card',
      last4: '0001',
      brand: 'Mastercard',
    },
    createdAt: '2024-02-01T12:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z',
  },
];

const mockStats: BillingStats = {
  totalRevenue: 12845.67,
  monthlyRevenue: 429.97,
  pendingAmount: 129.98,
  paidInvoices: 28,
  pendingInvoices: 5,
  failedInvoices: 2,
  revenueGrowth: 15.8,
  averageInvoiceValue: 186.32,
};

const statusColors = {
  paid: 'bg-success/10 text-success-foreground',
  pending: 'bg-warning/10 text-warning-foreground',
  failed: 'bg-destructive/10 text-destructive-foreground',
  cancelled: 'bg-muted text-muted-foreground',
  refunded: 'bg-info/10 text-info-foreground',
};

const statusLabels = {
  paid: 'Pagado',
  pending: 'Pendiente',
  failed: 'Fallido',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
};

const statusIcons = {
  paid: CheckCircle,
  pending: Clock,
  failed: AlertTriangle,
  cancelled: MoreVertical,
  refunded: TrendingDown,
};

const BillingRecordRow: React.FC<{
  record: BillingRecord;
  onView: (record: BillingRecord) => void;
  onDownload: (record: BillingRecord) => void;
}> = ({ record, onView, onDownload }) => {
  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateString));

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
    }).format(amount);

  const StatusIcon = statusIcons[record.status];

  return (
    <TableRow>
      <TableCell className="font-medium">{record.invoiceNumber}</TableCell>
      <TableCell>{record.companyName}</TableCell>
      <TableCell>{formatCurrency(record.amount, record.currency)}</TableCell>
      <TableCell>
        <Badge className={cn('text-xs', statusColors[record.status])}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {statusLabels[record.status]}
        </Badge>
      </TableCell>
      <TableCell>{formatDate(record.dueDate)}</TableCell>
      <TableCell>
        {record.paidDate ? formatDate(record.paidDate) : '-'}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(record)}>
              <Eye className="w-4 h-4 mr-2" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDownload(record)}>
              <Download className="w-4 h-4 mr-2" />
              Descargar factura
            </DropdownMenuItem>
            {record.status === 'failed' && (
              <DropdownMenuItem>
                <CreditCard className="w-4 h-4 mr-2" />
                Reintentar pago
              </DropdownMenuItem>
            )}
            {record.status === 'paid' && (
              <DropdownMenuItem className="text-red-600">
                <TrendingDown className="w-4 h-4 mr-2" />
                Reembolsar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

const InvoiceDetailModal: React.FC<{
  record: BillingRecord | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ record, isOpen, onClose }) => {
  if (!record) return null;

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateString));

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
    }).format(amount);

  const subtotal = record.items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.21; // 21% IVA
  const total = subtotal + tax;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Factura {record.invoiceNumber}
          </DialogTitle>
          <DialogDescription>
            Detalles completos de la facturación
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                INFORMACIÓN DEL CLIENTE
              </h4>
              <p className="font-medium">{record.companyName}</p>
              <p className="text-sm text-muted-foreground">
                ID: {record.companyId}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                INFORMACIÓN DE FACTURA
              </h4>
              <p>
                Número:{' '}
                <span className="font-medium">{record.invoiceNumber}</span>
              </p>
              <p>
                Fecha:{' '}
                <span className="font-medium">
                  {formatDate(record.createdAt)}
                </span>
              </p>
              <p>
                Vencimiento:{' '}
                <span className="font-medium">
                  {formatDate(record.dueDate)}
                </span>
              </p>
              {record.paidDate && (
                <p>
                  Pagado:{' '}
                  <span className="font-medium">
                    {formatDate(record.paidDate)}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <Badge className={cn('mt-1', statusColors[record.status])}>
                {statusLabels[record.status]}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Período de facturación
              </p>
              <p className="font-medium">
                {formatDate(record.billingPeriod.start)} -{' '}
                {formatDate(record.billingPeriod.end)}
              </p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="font-semibold mb-3">Elementos facturados</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Cant.</TableHead>
                  <TableHead className="text-right">Precio Unit.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {record.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.unitPrice, record.currency)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.total, record.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals */}
          <div className="border-t pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal, record.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA (21%):</span>
                  <span>{formatCurrency(tax, record.currency)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(total, record.currency)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          {record.paymentMethod && (
            <div>
              <h4 className="font-semibold mb-2">Método de pago</h4>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <CreditCard className="w-4 h-4" />
                <span>
                  {record.paymentMethod.type === 'card'
                    ? `${record.paymentMethod.brand} **** **** **** ${record.paymentMethod.last4}`
                    : 'Transferencia bancaria'}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Descargar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function BillingPage() {
  const t = useTranslations('billing');
  const [billingRecords, setBillingRecords] =
    useState<BillingRecord[]>(mockBillingRecords);
  const [stats] = useState<BillingStats>(mockStats);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<BillingRecord | null>(
    null,
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // TODO: Replace with real tRPC queries
  // const { data: billingRecords, refetch } = trpc.billing.getBillingRecords.useQuery();
  // const { data: stats } = trpc.billing.getBillingStats.useQuery();

  const filteredRecords = billingRecords.filter((record) => {
    const matchesSearch =
      record.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewRecord = (record: BillingRecord) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const handleDownloadInvoice = (record: BillingRecord) => {
    // TODO: Implement invoice download
    toast.info(`Descargando factura ${record.invoiceNumber} (próximamente)`);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h1" className="text-3xl font-bold">
            <CreditCard className="w-8 h-8 inline mr-3" />
            Facturación
          </Typography>
          <Typography variant="p" className="text-muted-foreground mt-1">
            Gestiona la facturación y pagos de todas las empresas
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generar reporte
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva factura
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
                  Ingresos Totales
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ingresos Mensuales
                </p>
                <p className="text-2xl font-bold text-info">
                  {formatCurrency(stats.monthlyRevenue)}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">
                    +{stats.revenueGrowth}%
                  </span>
                </div>
              </div>
              <Calendar className="w-8 h-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pendiente de Cobro
                </p>
                <p className="text-2xl font-bold text-warning">
                  {formatCurrency(stats.pendingAmount)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.pendingInvoices} facturas
                </p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Valor Promedio
                </p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(stats.averageInvoiceValue)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  por factura
                </p>
              </div>
              <Receipt className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Facturas</CardTitle>
          <CardDescription>
            Estado actual de todas las facturas del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-success" />
                <div>
                  <p className="font-medium">Facturas Pagadas</p>
                  <p className="text-2xl font-bold text-success">
                    {stats.paidInvoices}
                  </p>
                </div>
              </div>
              <Progress value={85} className="w-16 h-2" />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-warning" />
                <div>
                  <p className="font-medium">Facturas Pendientes</p>
                  <p className="text-2xl font-bold text-warning">
                    {stats.pendingInvoices}
                  </p>
                </div>
              </div>
              <Progress value={12} className="w-16 h-2" />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="font-medium">Facturas Fallidas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.failedInvoices}
                  </p>
                </div>
              </div>
              <Progress value={3} className="w-16 h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList>
          <TabsTrigger value="invoices">
            Facturas ({billingRecords.length})
          </TabsTrigger>
          <TabsTrigger value="subscriptions">Suscripciones</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar por empresa o número..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">Todos los estados</option>
                  <option value="paid">Pagado</option>
                  <option value="pending">Pendiente</option>
                  <option value="failed">Fallido</option>
                  <option value="cancelled">Cancelado</option>
                  <option value="refunded">Reembolsado</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Invoices Table */}
          <Card>
            <CardHeader>
              <CardTitle>Facturas</CardTitle>
              <CardDescription>
                Listado completo de todas las facturas generadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Importe</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Pagado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <BillingRecordRow
                      key={record.id}
                      record={record}
                      onView={handleViewRecord}
                      onDownload={handleDownloadInvoice}
                    />
                  ))}
                </TableBody>
              </Table>

              {filteredRecords.length === 0 && (
                <div className="text-center py-8">
                  <Receipt className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No se encontraron facturas
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== 'all'
                      ? 'No hay facturas que coincidan con los filtros aplicados.'
                      : 'Aún no hay facturas en el sistema.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Gestión de Suscripciones
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Administra las suscripciones de las empresas y sus planes
              </p>
              <Button asChild>
                <Link href="/dashboard/billing/subscriptions">
                  Ver Suscripciones
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BarChart className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Reportes de Facturación
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Genera reportes detallados de ingresos y facturación
              </p>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Generar Reporte
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal
        record={selectedRecord}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRecord(null);
        }}
      />
    </div>
  );
}
