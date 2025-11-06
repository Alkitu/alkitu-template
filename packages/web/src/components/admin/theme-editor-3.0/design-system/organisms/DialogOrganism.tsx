'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../primitives/dialog';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { Input } from '../atoms/Input';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';
import { 
  Plus,
  Edit,
  Trash2,
  Settings,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Upload,
  Download,
  Share2,
  Eye,
  EyeOff
} from 'lucide-react';

export interface DialogOrganismProps {
  variant?: 'form' | 'confirmation' | 'info' | 'selection' | 'media';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * DialogOrganism - Complex dialog component with theme integration
 * 
 * Combines: Dialog + Form + Button + Badge + Input + Typography
 * Features: Multiple dialog types, theme-responsive design, form handling
 * Spacing: Small (internal padding), Medium (component gaps), Large (section spacing)
 */
export function DialogOrganism({
  variant = 'form',
  size = 'md',
  className = ''
}: DialogOrganismProps) {
  const { state } = useThemeEditor();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [selectedOption, setSelectedOption] = useState('');
  
  // Theme integration
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;
  const shadows = state.currentTheme?.shadows;
  const spacing = state.currentTheme?.spacing;

  // Spacing system
  const baseSpacing = spacing?.spacing || '2.2rem';
  const baseValue = parseFloat(baseSpacing.replace('rem', '')) * 16;
  const smallSpacing = `var(--spacing-small, ${baseValue}px)`;
  const mediumSpacing = `var(--spacing-medium, ${baseValue * 2}px)`;

  const getDialogSize = () => {
    const sizes = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl'
    };
    return sizes[size];
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    // Handle form submission here
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderFormDialog = () => (
    <DialogContent 
      className={getDialogSize()}
      style={{
        background: colors?.card?.value || 'var(--color-card)',
        border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
        boxShadow: shadows?.shadowXl || 'var(--shadow-xl)'
      }}
    >
      <DialogHeader style={{ padding: `${mediumSpacing} ${mediumSpacing} 0` }}>
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: `${colors?.primary?.value || 'var(--color-primary)'}20`,
              color: colors?.primary?.value || 'var(--color-primary)'
            }}
          >
            <Plus size={18} />
          </div>
          <div>
            <DialogTitle 
              style={{ 
                color: colors?.foreground?.value || 'var(--color-foreground)',
                fontFamily: 'var(--typography-h3-font-family)',
                fontSize: 'var(--typography-h3-font-size)',
                marginBottom: '4px'
              }}
            >
              Create New Contact
            </DialogTitle>
            <DialogDescription 
              style={{ 
                color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
                fontSize: '14px'
              }}
            >
              Add a new contact to your address book with their details
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>
      
      <div style={{ padding: mediumSpacing }}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label 
                className="text-sm font-medium"
                style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
              >
                Full Name
              </label>
              <Input
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                leftIcon={<User size={16} />}
              />
            </div>
            
            <div className="space-y-2">
              <label 
                className="text-sm font-medium"
                style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
              >
                Email Address
              </label>
              <Input
                placeholder="john@example.com"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                leftIcon={<Mail size={16} />}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label 
                className="text-sm font-medium"
                style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
              >
                Phone Number
              </label>
              <Input
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                leftIcon={<Phone size={16} />}
              />
            </div>
            
            <div className="space-y-2">
              <label 
                className="text-sm font-medium"
                style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
              >
                Location
              </label>
              <Input
                placeholder="New York, NY"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                leftIcon={<MapPin size={16} />}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label 
              className="text-sm font-medium"
              style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
            >
              Notes (Optional)
            </label>
            <textarea
              placeholder="Additional notes about this contact..."
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-md border resize-none"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              style={{
                background: colors?.background?.value || 'var(--color-background)',
                border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
                color: colors?.foreground?.value || 'var(--color-foreground)'
              }}
            />
          </div>
        </form>
      </div>
      
      <DialogFooter style={{ padding: `0 ${mediumSpacing} ${mediumSpacing}` }}>
        <div className="flex items-center justify-between w-full">
          <Badge 
            variant="outline"
            style={{
              borderColor: colors?.border?.value || 'var(--color-border)',
              color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)'
            }}
          >
            <Clock size={12} className="mr-1" />
            Auto-save enabled
          </Badge>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              style={{
                color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)'
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              style={{
                background: colors?.primary?.value || 'var(--color-primary)',
                color: colors?.primaryForeground?.value || 'var(--color-primary-foreground)'
              }}
            >
              Create Contact
            </Button>
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  );

  const renderConfirmationDialog = () => (
    <DialogContent 
      className="max-w-md"
      style={{
        background: colors?.card?.value || 'var(--color-card)',
        border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
        boxShadow: shadows?.shadowXl || 'var(--shadow-xl)'
      }}
    >
      <DialogHeader style={{ padding: `${mediumSpacing} ${mediumSpacing} 0` }}>
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: '#ef444420',
              color: '#ef4444'
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <div>
            <DialogTitle 
              style={{ 
                color: colors?.foreground?.value || 'var(--color-foreground)',
                fontSize: '18px',
                marginBottom: '4px'
              }}
            >
              Delete Contact
            </DialogTitle>
            <DialogDescription 
              style={{ 
                color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
                fontSize: '14px'
              }}
            >
              This action cannot be undone
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>
      
      <div style={{ padding: mediumSpacing }}>
        <p 
          className="text-sm leading-relaxed"
          style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
        >
          Are you sure you want to delete <strong>John Doe</strong>? This will permanently remove 
          the contact from your address book along with all associated information.
        </p>
      </div>
      
      <DialogFooter style={{ padding: `0 ${mediumSpacing} ${mediumSpacing}` }}>
        <div className="flex justify-end gap-2 w-full">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            style={{
              color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            style={{
              background: '#ef4444',
              color: 'white'
            }}
          >
            <Trash2 size={14} className="mr-1" />
            Delete Contact
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );

  const renderInfoDialog = () => (
    <DialogContent 
      className="max-w-lg"
      style={{
        background: colors?.card?.value || 'var(--color-card)',
        border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
        boxShadow: shadows?.shadowXl || 'var(--shadow-xl)'
      }}
    >
      <DialogHeader style={{ padding: `${mediumSpacing} ${mediumSpacing} 0` }}>
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${colors?.primary?.value || 'var(--color-primary)'}, ${colors?.secondary?.value || 'var(--color-secondary)'})`
            }}
          >
            <CheckCircle size={24} color="white" />
          </div>
          <div>
            <DialogTitle 
              style={{ 
                color: colors?.foreground?.value || 'var(--color-foreground)',
                fontSize: '18px',
                marginBottom: '4px'
              }}
            >
              Success!
            </DialogTitle>
            <DialogDescription 
              style={{ 
                color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
                fontSize: '14px'
              }}
            >
              Your action has been completed
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>
      
      <div style={{ padding: mediumSpacing }}>
        <div className="space-y-4">
          <p 
            className="text-sm leading-relaxed"
            style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
          >
            Your contact has been successfully created and added to your address book. 
            You can now find them in your contacts list and start communicating.
          </p>
          
          <div 
            className="p-4 rounded-lg border"
            style={{
              background: `${colors?.accent?.value || 'var(--color-accent)'}10`,
              border: `1px solid ${colors?.border?.value || 'var(--color-border)'}40`
            }}
          >
            <h4 
              className="font-medium mb-2"
              style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
            >
              Next Steps:
            </h4>
            <ul 
              className="text-sm space-y-1"
              style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
            >
              <li>• Send a welcome message</li>
              <li>• Add to contact groups</li>
              <li>• Schedule a meeting</li>
            </ul>
          </div>
        </div>
      </div>
      
      <DialogFooter style={{ padding: `0 ${mediumSpacing} ${mediumSpacing}` }}>
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              style={{
                borderColor: colors?.border?.value || 'var(--color-border)',
                color: colors?.foreground?.value || 'var(--color-foreground)'
              }}
            >
              <Share2 size={14} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              style={{
                borderColor: colors?.border?.value || 'var(--color-border)',
                color: colors?.foreground?.value || 'var(--color-foreground)'
              }}
            >
              <Download size={14} />
            </Button>
          </div>
          
          <Button
            onClick={() => setIsOpen(false)}
            style={{
              background: colors?.primary?.value || 'var(--color-primary)',
              color: colors?.primaryForeground?.value || 'var(--color-primary-foreground)'
            }}
          >
            Continue
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );

  const renderSelectionDialog = () => (
    <DialogContent 
      className="max-w-md"
      style={{
        background: colors?.card?.value || 'var(--color-card)',
        border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
        boxShadow: shadows?.shadowXl || 'var(--shadow-xl)'
      }}
    >
      <DialogHeader style={{ padding: `${mediumSpacing} ${mediumSpacing} 0` }}>
        <DialogTitle 
          style={{ 
            color: colors?.foreground?.value || 'var(--color-foreground)',
            fontSize: '18px',
            marginBottom: '4px'
          }}
        >
          Choose Export Format
        </DialogTitle>
        <DialogDescription 
          style={{ 
            color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
            fontSize: '14px'
          }}
        >
          Select the format you want to export your data
        </DialogDescription>
      </DialogHeader>
      
      <div style={{ padding: mediumSpacing }}>
        <div className="space-y-2">
          {[
            { id: 'csv', name: 'CSV File', desc: 'Comma-separated values for spreadsheets' },
            { id: 'json', name: 'JSON File', desc: 'JavaScript Object Notation for developers' },
            { id: 'pdf', name: 'PDF Document', desc: 'Portable document format for sharing' },
            { id: 'xlsx', name: 'Excel File', desc: 'Microsoft Excel workbook format' }
          ].map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
              style={{
                border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
                background: selectedOption === option.id ? 
                  `${colors?.primary?.value || 'var(--color-primary)'}10` : 
                  'transparent'
              }}
            >
              <input
                type="radio"
                name="exportFormat"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-4 h-4"
                style={{ accentColor: colors?.primary?.value || 'var(--color-primary)' }}
              />
              <div className="flex-1">
                <div 
                  className="font-medium"
                  style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
                >
                  {option.name}
                </div>
                <div 
                  className="text-sm"
                  style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
                >
                  {option.desc}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
      
      <DialogFooter style={{ padding: `0 ${mediumSpacing} ${mediumSpacing}` }}>
        <div className="flex justify-end gap-2 w-full">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            style={{
              color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)'
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={!selectedOption}
            onClick={() => setIsOpen(false)}
            style={{
              background: selectedOption ? 
                (colors?.primary?.value || 'var(--color-primary)') : 
                (colors?.muted?.value || 'var(--color-muted)'),
              color: selectedOption ?
                (colors?.primaryForeground?.value || 'var(--color-primary-foreground)') :
                (colors?.mutedForeground?.value || 'var(--color-muted-foreground)')
            }}
          >
            <Download size={14} className="mr-1" />
            Export
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );

  const renderMediaDialog = () => (
    <DialogContent 
      className="max-w-3xl"
      style={{
        background: colors?.card?.value || 'var(--color-card)',
        border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
        boxShadow: shadows?.shadowXl || 'var(--shadow-xl)'
      }}
    >
      <DialogHeader style={{ padding: `${mediumSpacing} ${mediumSpacing} 0` }}>
        <div className="flex items-center justify-between">
          <div>
            <DialogTitle 
              style={{ 
                color: colors?.foreground?.value || 'var(--color-foreground)',
                fontSize: '18px',
                marginBottom: '4px'
              }}
            >
              Media Gallery
            </DialogTitle>
            <DialogDescription 
              style={{ 
                color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
                fontSize: '14px'
              }}
            >
              Browse and manage your media files
            </DialogDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline"
              style={{
                borderColor: colors?.border?.value || 'var(--color-border)',
                color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)'
              }}
            >
              24 files
            </Badge>
            <Button
              size="sm"
              style={{
                background: colors?.primary?.value || 'var(--color-primary)',
                color: colors?.primaryForeground?.value || 'var(--color-primary-foreground)'
              }}
            >
              <Upload size={14} className="mr-1" />
              Upload
            </Button>
          </div>
        </div>
      </DialogHeader>
      
      <div style={{ padding: mediumSpacing }}>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i}
              className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center relative group cursor-pointer"
              style={{
                border: `2px dashed ${colors?.border?.value || 'var(--color-border)'}`,
                background: `${colors?.accent?.value || 'var(--color-accent)'}10`
              }}
            >
              <Eye 
                size={24} 
                style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
              />
              
              {/* Hover overlay */}
              <div 
                className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
              >
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <Eye size={14} />
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <Download size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <DialogFooter style={{ padding: `0 ${mediumSpacing} ${mediumSpacing}` }}>
        <div className="flex justify-between items-center w-full">
          <p 
            className="text-sm"
            style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
          >
            2.4 GB of 5 GB used
          </p>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              style={{
                color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)'
              }}
            >
              Close
            </Button>
            <Button
              style={{
                background: colors?.primary?.value || 'var(--color-primary)',
                color: colors?.primaryForeground?.value || 'var(--color-primary-foreground)'
              }}
            >
              Manage Storage
            </Button>
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  );

  const renderDialogContent = () => {
    switch (variant) {
      case 'confirmation': return renderConfirmationDialog();
      case 'info': return renderInfoDialog();
      case 'selection': return renderSelectionDialog();
      case 'media': return renderMediaDialog();
      case 'form':
      default: return renderFormDialog();
    }
  };

  const getTriggerButton = () => {
    const buttonConfig = {
      form: { icon: <Plus size={16} />, text: 'Add Contact' },
      confirmation: { icon: <Trash2 size={16} />, text: 'Delete Item' },
      info: { icon: <CheckCircle size={16} />, text: 'Show Success' },
      selection: { icon: <Download size={16} />, text: 'Export Data' },
      media: { icon: <Upload size={16} />, text: 'View Gallery' }
    };

    const config = buttonConfig[variant];
    
    return (
      <Button
        onClick={() => setIsOpen(true)}
        style={{
          background: colors?.primary?.value || 'var(--color-primary)',
          color: colors?.primaryForeground?.value || 'var(--color-primary-foreground)'
        }}
      >
        {config.icon}
        <span className="ml-2">{config.text}</span>
      </Button>
    );
  };

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {getTriggerButton()}
        </DialogTrigger>
        {renderDialogContent()}
      </Dialog>
    </div>
  );
}

/**
 * DialogOrganismShowcase - Demo component showing different dialog variants
 */
export function DialogOrganismShowcase() {
  const { state } = useThemeEditor();
  
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;

  return (
    <div className="flex flex-wrap gap-4 w-full">
      <div className="space-y-3">
        <h4 
          className="text-sm font-medium"
          style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
        >
          Form Dialog
        </h4>
        <p 
          className="text-xs"
          style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
        >
          Complex forms with validation
        </p>
        <DialogOrganism variant="form" size="lg" />
      </div>
      
      <div className="space-y-3">
        <h4 
          className="text-sm font-medium"
          style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
        >
          Confirmation Dialog
        </h4>
        <p 
          className="text-xs"
          style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
        >
          Destructive action confirmations
        </p>
        <DialogOrganism variant="confirmation" size="sm" />
      </div>
      
      <div className="space-y-3">
        <h4 
          className="text-sm font-medium"
          style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
        >
          Info Dialog
        </h4>
        <p 
          className="text-xs"
          style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
        >
          Success messages and information
        </p>
        <DialogOrganism variant="info" size="md" />
      </div>
      
      <div className="space-y-3">
        <h4 
          className="text-sm font-medium"
          style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
        >
          Selection Dialog
        </h4>
        <p 
          className="text-xs"
          style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
        >
          Multiple choice selections
        </p>
        <DialogOrganism variant="selection" size="md" />
      </div>
      
      <div className="space-y-3">
        <h4 
          className="text-sm font-medium"
          style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
        >
          Media Dialog
        </h4>
        <p 
          className="text-xs"
          style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
        >
          Media gallery and file management
        </p>
        <DialogOrganism variant="media" size="xl" />
      </div>
    </div>
  );
}