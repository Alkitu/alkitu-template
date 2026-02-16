'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/primitives/ui/card';
import { Badge } from '@/components/atoms-alianza/Badge';
import { Button } from '@/components/primitives/ui/button';
import { Switch } from '@/components/primitives/ui/switch';
import {
  Mail,
  Shield,
  Bell,
  Megaphone,
  Edit,
  Eye,
  EyeOff,
} from 'lucide-react';
import { EmailTemplate, TemplateCategory } from '@alkitu/shared';
import { cn } from '@/lib/utils'; // Assuming this exists, verify if not

const categoryIcons: Record<TemplateCategory, typeof Mail> = {
  REQUEST: Mail,
  AUTH: Shield,
  NOTIFICATION: Bell,
  MARKETING: Megaphone,
};

interface EmailTemplateCardProps {
  template: EmailTemplate;
  onEdit: (template: EmailTemplate) => void;
  onToggleActive: (template: EmailTemplate) => void;
}

export function EmailTemplateCard({
  template,
  onEdit,
  onToggleActive,
}: EmailTemplateCardProps) {
  const CategoryIcon = categoryIcons[template.category] || Mail;

  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md border-border/60">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CategoryIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold line-clamp-1" title={template.name}>
                {template.name}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                 Trigger: <span className="font-mono text-foreground/80">{template.trigger}</span>
              </CardDescription>
            </div>
          </div>
          <Badge
            variant={template.active ? 'success' : 'secondary'}
            className="capitalize"
          >
            {template.active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pb-3">
         <div className="bg-muted/30 p-3 rounded-md border border-border/50 text-xs text-muted-foreground h-24 overflow-hidden relative">
            <p className="font-medium text-foreground/80 mb-1">Subject:</p>
            <p className="line-clamp-3">{template.subject}</p>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-muted/30 to-transparent" />
         </div>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
           <Switch
              checked={template.active}
              onCheckedChange={() => onToggleActive(template)}
              id={`active-${template.id}`}
           />
           <label 
              htmlFor={`active-${template.id}`}
              className="text-xs font-medium cursor-pointer select-none text-muted-foreground"
            >
              {template.active ? 'Enabled' : 'Disabled'}
            </label>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(template)}
          className="gap-1.5"
        >
          <Edit className="h-3.5 w-3.5" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
