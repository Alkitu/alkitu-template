'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/primitives/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';
import { Icons, iconCategories } from '@/lib/icons';

interface IconSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (iconName: string) => void;
  title?: string;
}

export function IconSelector({
  open,
  onClose,
  onSelect,
  title = 'Biblioteca de iconos',
}: IconSelectorProps) {
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null,
  );

  const filteredIcons = React.useMemo(() => {
    // If no category is selected or "all" is selected, show all icons from all categories
    const icons =
      selectedCategory === 'all' || !selectedCategory
        ? Object.values(iconCategories).flat()
        : iconCategories[selectedCategory as keyof typeof iconCategories];

    return icons.filter(
      (icon) =>
        icon.name.toLowerCase().includes(search.toLowerCase()) ||
        icon.icon.toLowerCase().includes(search.toLowerCase()),
    );
  }, [selectedCategory, search]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-[200px_1fr] gap-4">
          <div className="space-y-4">
            <Select
              value={selectedCategory || 'all'}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los iconos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los iconos</SelectItem>
                {Object.keys(iconCategories).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filtrar por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="grid grid-cols-6 gap-2 p-2">
              {filteredIcons.map((icon) => {
                const IconComponent = Icons[icon.icon as keyof typeof Icons];
                if (!IconComponent) return null;
                return (
                  <Button
                    key={icon.icon}
                    variant="outline"
                    className="h-16 w-16 flex flex-col items-center justify-center gap-1"
                    onClick={() => {
                      onSelect(icon.icon);
                      onClose();
                    }}
                  >
                    <IconComponent className="h-6 w-6" />
                    <span className="text-xs text-muted-foreground truncate w-full px-1">
                      {icon.name}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
