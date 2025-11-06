'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, 
  Send, 
  Settings,
  TestTube,
  Server,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Trash2,
  Download,
  Filter,
  Search,
  MailOpen,
  MailX,
  Zap,
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Mock data for email templates
const mockEmailTemplates = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Bienvenido a nuestra plataforma',
    template: 'Hola {{name}}, bienvenido a nuestra plataforma. Estamos emocionados de tenerte a bordo.',
    type: 'transactional' as TemplateType,
    status: 'active' as TemplateStatus,
    usage: 156,
    lastUsed: '2024-07-22T10:30:00Z'
  },
  {
    id: '2',
    name: 'Password Reset',
    subject: 'Restablecer contraseña',
    template: 'Hola {{name}}, haz clic en el siguiente enlace para restablecer tu contraseña: {{reset_link}}',
    type: 'transactional' as TemplateType,
    status: 'active' as TemplateStatus,
    usage: 89,
    lastUsed: '2024-07-22T08:15:00Z'
  },
  {
    id: '3',
    name: 'Newsletter',
    subject: 'Noticias mensuales - {{month}}',
    template: 'Hola {{name}}, aquí tienes las noticias más importantes del mes.',
    type: 'marketing' as TemplateType,
    status: 'draft' as TemplateStatus,
    usage: 0,
    lastUsed: null
  }
];

// Mock data for email logs
const mockEmailLogs = [
  {
    id: '1',
    recipient: 'juan.perez@email.com',
    subject: 'Bienvenido a nuestra plataforma',
    template: 'Welcome Email',
    status: 'delivered' as EmailStatus,
    sentAt: '2024-07-22T10:30:00Z',
    deliveredAt: '2024-07-22T10:31:00Z',
    openedAt: '2024-07-22T10:45:00Z',
    clickedAt: null,
    error: null
  },
  {
    id: '2',
    recipient: 'maria.gonzalez@empresa.com',
    subject: 'Restablecer contraseña',
    template: 'Password Reset',
    status: 'bounced' as EmailStatus,
    sentAt: '2024-07-22T09:15:00Z',
    deliveredAt: null,
    openedAt: null,
    clickedAt: null,
    error: 'Invalid email address'
  },
  {
    id: '3',
    recipient: 'carlos.lopez@startup.io',
    subject: 'Bienvenido a nuestra plataforma',
    template: 'Welcome Email',
    status: 'opened' as EmailStatus,
    sentAt: '2024-07-22T08:00:00Z',
    deliveredAt: '2024-07-22T08:01:00Z',
    openedAt: '2024-07-22T08:30:00Z',
    clickedAt: '2024-07-22T08:35:00Z',
    error: null
  }
];

// Mock SMTP configuration
const mockSmtpConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  username: 'noreply@empresa.com',
  password: '************',
  fromEmail: 'noreply@empresa.com',
  fromName: 'Empresa',
  replyTo: 'support@empresa.com'
};

type EmailStatus = 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
type TemplateType = 'transactional' | 'marketing';
type TemplateStatus = 'active' | 'draft' | 'archived';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  template: string;
  type: TemplateType;
  status: TemplateStatus;
  usage: number;
  lastUsed: string | null;
}

interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  template: string;
  status: EmailStatus;
  sentAt: string;
  deliveredAt: string | null;
  openedAt: string | null;
  clickedAt: string | null;
  error: string | null;
}

export default function EmailManagementPage() {
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(mockEmailTemplates);
  const [emailLogs] = useState<EmailLog[]>(mockEmailLogs);
  const [smtpConfig, setSmtpConfig] = useState(mockSmtpConfig);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [templateFilter, setTemplateFilter] = useState<string>('all');
  const [testEmailDialogOpen, setTestEmailDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [smtpDialogOpen, setSmtpDialogOpen] = useState(false);
  
  // Test email form
  const [testEmail, setTestEmail] = useState({
    to: '',
    templateId: '',
    variables: '{}'
  });

  // New template form
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    template: '',
    type: 'transactional' as TemplateType
  });

  const filteredEmailLogs = emailLogs.filter(log => {
    const matchesSearch = log.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.template.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesTemplate = templateFilter === 'all' || log.template === templateFilter;
    
    return matchesSearch && matchesStatus && matchesTemplate;
  });

  const getStatusColor = (status: EmailStatus) => {
    switch (status) {
      case 'sent': return 'secondary';
      case 'delivered': return 'default';
      case 'opened': return 'outline';
      case 'clicked': return 'default';
      case 'bounced': return 'destructive';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: EmailStatus) => {
    switch (status) {
      case 'sent': return <Send className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'opened': return <MailOpen className="w-4 h-4" />;
      case 'clicked': return <Zap className="w-4 h-4" />;
      case 'bounced': return <MailX className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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

  const sendTestEmail = () => {
    if (!testEmail.to || !testEmail.templateId) return;
    
    // Simulate sending test email
    console.log('Sending test email:', testEmail);
    alert(`Email de prueba enviado a ${testEmail.to}`);
    
    setTestEmailDialogOpen(false);
    setTestEmail({ to: '', templateId: '', variables: '{}' });
  };

  const createTemplate = () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.template) return;
    
    const template: EmailTemplate = {
      id: Date.now().toString(),
      ...newTemplate,
      status: 'draft' as TemplateStatus,
      usage: 0,
      lastUsed: null
    };

    setEmailTemplates(prev => [...prev, template]);
    setTemplateDialogOpen(false);
    setNewTemplate({ name: '', subject: '', template: '', type: 'transactional' });
  };

  const updateSmtpConfig = () => {
    console.log('Updating SMTP config:', smtpConfig);
    alert('Configuración SMTP actualizada');
    setSmtpDialogOpen(false);
  };

  const testSmtpConnection = () => {
    // Simulate testing SMTP connection
    console.log('Testing SMTP connection...');
    alert('Conexión SMTP exitosa');
  };

  const exportEmailLogs = () => {
    const rows = filteredEmailLogs.map(log => ({
      recipient: log.recipient,
      subject: log.subject.replace(/"/g, '""'),
      template: log.template,
      status: log.status,
      sentAt: formatDate(log.sentAt),
      deliveredAt: log.deliveredAt ? formatDate(log.deliveredAt) : '',
      openedAt: log.openedAt ? formatDate(log.openedAt) : '',
      clickedAt: log.clickedAt ? formatDate(log.clickedAt) : '',
      error: log.error || ''
    }));
    
    const csv = [
      ['Recipient', 'Subject', 'Template', 'Status', 'Sent At', 'Delivered At', 'Opened At', 'Clicked At', 'Error'],
      ...rows.map(row => [
        row.recipient,
        `"${row.subject}"`,
        row.template,
        row.status,
        row.sentAt,
        row.deliveredAt,
        row.openedAt,
        row.clickedAt,
        row.error
      ])
    ]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-logs.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const calculateDeliveryRate = () => {
    const delivered = emailLogs.filter(log => ['delivered', 'opened', 'clicked'].includes(log.status)).length;
    return Math.round((delivered / emailLogs.length) * 100);
  };

  const calculateOpenRate = () => {
    const opened = emailLogs.filter(log => ['opened', 'clicked'].includes(log.status)).length;
    const delivered = emailLogs.filter(log => ['delivered', 'opened', 'clicked'].includes(log.status)).length;
    return delivered > 0 ? Math.round((opened / delivered) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Email</h1>
          <p className="text-muted-foreground">
            Configura y gestiona el sistema de correo electrónico
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={testEmailDialogOpen} onOpenChange={setTestEmailDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <TestTube className="w-4 h-4 mr-2" />
                Enviar Prueba
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={smtpDialogOpen} onOpenChange={setSmtpDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                SMTP
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="logs">Historial de Emails</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="configuration">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Send className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Emails Enviados</p>
                    <p className="text-2xl font-bold">{emailLogs.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Tasa de Entrega</p>
                    <p className="text-2xl font-bold">{calculateDeliveryRate()}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <MailOpen className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Tasa de Apertura</p>
                    <p className="text-2xl font-bold">{calculateOpenRate()}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <MailX className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium">Rebotes</p>
                    <p className="text-2xl font-bold">
                      {emailLogs.filter(log => log.status === 'bounced').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Template Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Uso de Plantillas</CardTitle>
              <CardDescription>
                Estadísticas de uso de las plantillas de email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emailTemplates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.subject}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={template.type === 'transactional' ? 'default' : 'secondary'}>
                          {template.type}
                        </Badge>
                        <Badge variant={template.status === 'active' ? 'default' : 'secondary'}>
                          {template.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{template.usage}</p>
                      <p className="text-sm text-muted-foreground">usos</p>
                      {template.lastUsed && (
                        <p className="text-xs text-muted-foreground">
                          Último: {formatDate(template.lastUsed)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por destinatario, asunto o plantilla..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="sent">Enviados</SelectItem>
                    <SelectItem value="delivered">Entregados</SelectItem>
                    <SelectItem value="opened">Abiertos</SelectItem>
                    <SelectItem value="clicked">Con clicks</SelectItem>
                    <SelectItem value="bounced">Rebotados</SelectItem>
                    <SelectItem value="failed">Fallidos</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={templateFilter} onValueChange={setTemplateFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Plantilla" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las plantillas</SelectItem>
                    {emailTemplates.map(template => (
                      <SelectItem key={template.id} value={template.name}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={exportEmailLogs}>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Email Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Emails ({filteredEmailLogs.length})</CardTitle>
              <CardDescription>
                Registro detallado de todos los emails enviados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEmailLogs.map((log) => (
                  <div key={log.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                        {getStatusIcon(log.status)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">{log.subject}</h3>
                          <Badge variant={getStatusColor(log.status)} className="text-xs flex items-center gap-1">
                            {getStatusIcon(log.status)}
                            {log.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-1">
                          Para: {log.recipient}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          Plantilla: {log.template}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">Enviado:</span><br />
                            {formatDate(log.sentAt)}
                          </div>
                          {log.deliveredAt && (
                            <div>
                              <span className="font-medium">Entregado:</span><br />
                              {formatDate(log.deliveredAt)}
                            </div>
                          )}
                          {log.openedAt && (
                            <div>
                              <span className="font-medium">Abierto:</span><br />
                              {formatDate(log.openedAt)}
                            </div>
                          )}
                          {log.clickedAt && (
                            <div>
                              <span className="font-medium">Click:</span><br />
                              {formatDate(log.clickedAt)}
                            </div>
                          )}
                        </div>
                        
                        {log.error && (
                          <div className="mt-2">
                            <Alert>
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Error</AlertTitle>
                              <AlertDescription>{log.error}</AlertDescription>
                            </Alert>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredEmailLogs.length === 0 && (
                  <div className="text-center py-8">
                    <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No hay emails que coincidan con los filtros</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Plantillas de Email</h2>
            <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Mail className="w-4 h-4 mr-2" />
                  Nueva Plantilla
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emailTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex gap-1">
                      <Badge variant={template.type === 'transactional' ? 'default' : 'secondary'}>
                        {template.type}
                      </Badge>
                      <Badge variant={template.status === 'active' ? 'default' : 'secondary'}>
                        {template.status}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{template.subject}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded text-sm">
                      {template.template.substring(0, 100)}...
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{template.usage} usos</span>
                      {template.lastUsed && (
                        <span>Último: {formatDate(template.lastUsed)}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <TestTube className="w-4 h-4 mr-1" />
                        Probar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SMTP Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Configuración SMTP
                </CardTitle>
                <CardDescription>
                  Configurar el servidor de correo saliente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Host</Label>
                      <p className="text-sm text-muted-foreground">{smtpConfig.host}</p>
                    </div>
                    <div>
                      <Label>Puerto</Label>
                      <p className="text-sm text-muted-foreground">{smtpConfig.port}</p>
                    </div>
                  </div>
                  <div>
                    <Label>Usuario</Label>
                    <p className="text-sm text-muted-foreground">{smtpConfig.username}</p>
                  </div>
                  <div>
                    <Label>Email remitente</Label>
                    <p className="text-sm text-muted-foreground">{smtpConfig.fromEmail}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={testSmtpConnection} variant="outline">
                      <TestTube className="w-4 h-4 mr-2" />
                      Probar Conexión
                    </Button>
                    <Button onClick={() => setSmtpDialogOpen(true)}>
                      <Settings className="w-4 h-4 mr-2" />
                      Configurar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Configuración General
                </CardTitle>
                <CardDescription>
                  Configuración general del sistema de email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Emails de prueba</Label>
                      <p className="text-sm text-muted-foreground">Permitir envío de emails de prueba</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Tracking de apertura</Label>
                      <p className="text-sm text-muted-foreground">Rastrear cuando los emails son abiertos</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Tracking de clicks</Label>
                      <p className="text-sm text-muted-foreground">Rastrear clicks en enlaces</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Logs detallados</Label>
                      <p className="text-sm text-muted-foreground">Mantener logs detallados de emails</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Test Email Dialog */}
      <Dialog open={testEmailDialogOpen} onOpenChange={setTestEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Email de Prueba</DialogTitle>
            <DialogDescription>
              Envía un email de prueba usando una de las plantillas existentes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Email destinatario</Label>
              <Input
                placeholder="ejemplo@email.com"
                value={testEmail.to}
                onChange={(e) => setTestEmail(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>
            <div>
              <Label>Plantilla</Label>
              <Select 
                value={testEmail.templateId}
                onValueChange={(value) => setTestEmail(prev => ({ ...prev, templateId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una plantilla" />
                </SelectTrigger>
                <SelectContent>
                  {emailTemplates.filter(t => t.status === 'active').map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Variables (JSON)</Label>
              <Textarea
                placeholder='{"name": "Juan", "company": "Empresa"}'
                value={testEmail.variables}
                onChange={(e) => setTestEmail(prev => ({ ...prev, variables: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestEmailDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={sendTestEmail}
              disabled={!testEmail.to || !testEmail.templateId}
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Prueba
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nueva Plantilla de Email</DialogTitle>
            <DialogDescription>
              Crea una nueva plantilla de email para usar en el sistema
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre de la plantilla</Label>
                <Input
                  placeholder="Welcome Email"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label>Tipo</Label>
                <Select 
                  value={newTemplate.type}
                  onValueChange={(value) => setNewTemplate(prev => ({ ...prev, type: value as TemplateType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transactional">Transaccional</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Asunto</Label>
              <Input
                placeholder="Bienvenido a {{company}}"
                value={newTemplate.subject}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            <div>
              <Label>Plantilla HTML</Label>
              <Textarea
                placeholder="Hola {{name}}, bienvenido a nuestra plataforma..."
                value={newTemplate.template}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, template: e.target.value }))}
                rows={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={createTemplate}
              disabled={!newTemplate.name || !newTemplate.subject || !newTemplate.template}
            >
              Crear Plantilla
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SMTP Configuration Dialog */}
      <Dialog open={smtpDialogOpen} onOpenChange={setSmtpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configuración SMTP</DialogTitle>
            <DialogDescription>
              Configura los parámetros del servidor de correo saliente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Host SMTP</Label>
                <Input
                  value={smtpConfig.host}
                  onChange={(e) => setSmtpConfig(prev => ({ ...prev, host: e.target.value }))}
                />
              </div>
              <div>
                <Label>Puerto</Label>
                <Input
                  type="number"
                  value={smtpConfig.port}
                  onChange={(e) => setSmtpConfig(prev => ({ ...prev, port: parseInt(e.target.value) }))}
                />
              </div>
            </div>
            <div>
              <Label>Usuario</Label>
              <Input
                value={smtpConfig.username}
                onChange={(e) => setSmtpConfig(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div>
              <Label>Contraseña</Label>
              <Input
                type="password"
                value={smtpConfig.password}
                onChange={(e) => setSmtpConfig(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email remitente</Label>
                <Input
                  value={smtpConfig.fromEmail}
                  onChange={(e) => setSmtpConfig(prev => ({ ...prev, fromEmail: e.target.value }))}
                />
              </div>
              <div>
                <Label>Nombre remitente</Label>
                <Input
                  value={smtpConfig.fromName}
                  onChange={(e) => setSmtpConfig(prev => ({ ...prev, fromName: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={smtpConfig.secure}
                onCheckedChange={(checked) => setSmtpConfig(prev => ({ ...prev, secure: checked }))}
              />
              <Label>Usar SSL/TLS</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSmtpDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={updateSmtpConfig}>
              Guardar Configuración
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}