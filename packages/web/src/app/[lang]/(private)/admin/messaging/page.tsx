'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, 
  Search, 
  Filter,
  MessageSquare,
  Users,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye,
  Archive
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

// Mock data for messages
const mockMessages = [
  {
    id: '1',
    subject: 'Bienvenido a la plataforma',
    content: 'Gracias por registrarte en nuestra plataforma. Esperamos que tengas una gran experiencia.',
    recipient: {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      avatar: null
    },
    status: 'delivered',
    sentAt: '2024-07-22T10:30:00Z',
    readAt: '2024-07-22T10:45:00Z',
    type: 'individual'
  },
  {
    id: '2',
    subject: 'Actualización de términos de servicio',
    content: 'Hemos actualizado nuestros términos de servicio. Por favor, revísalos en tu panel de configuración.',
    recipient: null,
    status: 'sent',
    sentAt: '2024-07-22T09:00:00Z',
    readAt: null,
    type: 'broadcast',
    recipientCount: 156
  },
  {
    id: '3',
    subject: 'Problema con tu cuenta',
    content: 'Hemos detectado actividad sospechosa en tu cuenta. Por favor, cambia tu contraseña inmediatamente.',
    recipient: {
      id: '2',
      name: 'María González',
      email: 'maria.gonzalez@empresa.com',
      avatar: null
    },
    status: 'failed',
    sentAt: '2024-07-22T08:15:00Z',
    readAt: null,
    type: 'individual'
  },
  {
    id: '4',
    subject: 'Recordatorio de pago',
    content: 'Tu suscripción vence en 3 días. Renueva ahora para evitar interrupciones en el servicio.',
    recipient: {
      id: '3',
      name: 'Carlos López',
      email: 'carlos.lopez@startup.io',
      avatar: null
    },
    status: 'delivered',
    sentAt: '2024-07-21T16:20:00Z',
    readAt: null,
    type: 'individual'
  }
];

// Mock data for users
const mockUsers = [
  { id: '1', name: 'Juan Pérez', email: 'juan.perez@email.com', avatar: null },
  { id: '2', name: 'María González', email: 'maria.gonzalez@empresa.com', avatar: null },
  { id: '3', name: 'Carlos López', email: 'carlos.lopez@startup.io', avatar: null },
  { id: '4', name: 'Ana Martínez', email: 'ana.martinez@corp.com', avatar: null },
  { id: '5', name: 'David Rodríguez', email: 'david.rodriguez@dev.com', avatar: null }
];

type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';
type MessageType = 'individual' | 'broadcast';

interface Message {
  id: string;
  subject: string;
  content: string;
  recipient: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  } | null;
  status: MessageStatus;
  sentAt: string;
  readAt: string | null;
  type: MessageType;
  recipientCount?: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

export default function AdminMessagingPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [users] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [composeDialogOpen, setComposeDialogOpen] = useState(false);
  
  // New message form
  const [messageType, setMessageType] = useState<'individual' | 'broadcast'>('individual');
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (message.recipient?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (message.recipient?.email.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    const matchesType = typeFilter === 'all' || message.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: MessageStatus) => {
    switch (status) {
      case 'sent': return 'default';
      case 'delivered': return 'secondary';
      case 'read': return 'outline';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case 'sent': return <Clock className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'read': return <Eye className="w-4 h-4" />;
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

  const sendMessage = () => {
    if (!messageSubject.trim() || !messageContent.trim()) return;
    
    if (messageType === 'individual' && !selectedRecipient) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      subject: messageSubject,
      content: messageContent,
      recipient: messageType === 'individual' 
        ? users.find(u => u.id === selectedRecipient) || null
        : null,
      status: 'sent',
      sentAt: new Date().toISOString(),
      readAt: null,
      type: messageType,
      recipientCount: messageType === 'broadcast' ? users.length : undefined
    };

    setMessages(prev => [newMessage, ...prev]);
    
    // Reset form
    setMessageSubject('');
    setMessageContent('');
    setSelectedRecipient('');
    setComposeDialogOpen(false);

    // Simulate delivery after 2 seconds
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id 
          ? { ...msg, status: 'delivered' as MessageStatus }
          : msg
      ));
    }, 2000);
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sistema de Mensajería</h1>
          <p className="text-muted-foreground">
            Envía mensajes directos a usuarios o difusiones masivas
          </p>
        </div>
        <Dialog open={composeDialogOpen} onOpenChange={setComposeDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <MessageSquare className="w-4 h-4 mr-2" />
              Nuevo Mensaje
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Componer Mensaje</DialogTitle>
              <DialogDescription>
                Envía un mensaje directo a un usuario específico o una difusión a todos los usuarios
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tipo de mensaje</label>
                <Select value={messageType} onValueChange={(value) => setMessageType(value as 'individual' | 'broadcast')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Mensaje Individual</SelectItem>
                    <SelectItem value="broadcast">Difusión Masiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {messageType === 'individual' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Destinatario</label>
                  <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={user.avatar || undefined} />
                              <AvatarFallback className="text-xs">
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {messageType === 'broadcast' && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700">
                      Este mensaje se enviará a todos los usuarios ({users.length} destinatarios)
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Asunto</label>
                <Input
                  placeholder="Ingresa el asunto del mensaje"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Mensaje</label>
                <Textarea
                  placeholder="Escribe tu mensaje aquí..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setComposeDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={sendMessage}
                disabled={!messageSubject.trim() || !messageContent.trim() || (messageType === 'individual' && !selectedRecipient)}
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Mensaje
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Mensajes</p>
                <p className="text-2xl font-bold">{messages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Entregados</p>
                <p className="text-2xl font-bold">
                  {messages.filter(m => m.status === 'delivered' || m.status === 'read').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Leídos</p>
                <p className="text-2xl font-bold">
                  {messages.filter(m => m.status === 'read').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Fallidos</p>
                <p className="text-2xl font-bold">
                  {messages.filter(m => m.status === 'failed').length}
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
                  placeholder="Buscar mensajes..."
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
                <SelectItem value="read">Leídos</SelectItem>
                <SelectItem value="failed">Fallidos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="individual">Individuales</SelectItem>
                <SelectItem value="broadcast">Difusiones</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Mensajes ({filteredMessages.length})</CardTitle>
          <CardDescription>
            Historial de mensajes enviados y su estado de entrega
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div key={message.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                    {message.type === 'broadcast' ? (
                      <Users className="w-5 h-5" />
                    ) : (
                      <Mail className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{message.subject}</h3>
                      <Badge variant={getStatusColor(message.status)} className="text-xs flex items-center gap-1">
                        {getStatusIcon(message.status)}
                        {message.status}
                      </Badge>
                      {message.type === 'broadcast' && (
                        <Badge variant="outline" className="text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          {message.recipientCount} destinatarios
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {message.content}
                    </p>
                    
                    {message.recipient && (
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={message.recipient.avatar || undefined} />
                          <AvatarFallback className="text-xs">
                            {message.recipient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{message.recipient.name}</p>
                          <p className="text-xs text-muted-foreground">{message.recipient.email}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Enviado: {formatDate(message.sentAt)}</span>
                      {message.readAt && (
                        <span>Leído: {formatDate(message.readAt)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMessage(message.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredMessages.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hay mensajes que coincidan con los filtros seleccionados</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}