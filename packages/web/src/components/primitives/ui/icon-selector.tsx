'use client';

import * as React from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/ui/input';

import { ScrollArea } from '@/components/primitives/ui/scroll-area';
import { Icons, iconLibraries } from '@/lib/icons';
import {
  categorizedEmojis,
  emojiCategoryLabels,
  ALL_EMOJI_CATEGORIES,
  type EmojiCategory,
  type CategorizedEmoji,
} from '@/lib/emojis';
import { ResponsiveModal } from '@/components/primitives/ui/responsive-modal';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/primitives/ui/tooltip';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/primitives/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/ui/select';

interface IconSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (iconName: string) => void;
  title?: string;
}

const PAGE_SIZE = 60;

export function IconSelector({
  open,
  onClose,
  onSelect,
  title = 'Selector de medios',
}: IconSelectorProps) {
  const [activeTab, setActiveTab] = React.useState('icon');
  const [search, setSearch] = React.useState('');
  const selectedLibrary = 'Lucide';
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedEmojiCategory, setSelectedEmojiCategory] = React.useState<EmojiCategory | null>(null);

  // Filter Icons
  const filteredIcons = React.useMemo(() => {
    if (activeTab !== 'icon') return [];
    const _icons = iconLibraries[selectedLibrary as keyof typeof iconLibraries] || [];
    return _icons.filter(
      (icon) =>
        icon.name.toLowerCase().includes(search.toLowerCase()) ||
        icon.icon.toLowerCase().includes(search.toLowerCase()),
    );
  }, [activeTab, selectedLibrary, search]);

  // Filter Emojis (with category support)
  const filteredEmojis = React.useMemo(() => {
    if (activeTab !== 'emoji') return [];
    let filtered: CategorizedEmoji[] = categorizedEmojis;

    // Filter by category
    if (selectedEmojiCategory) {
      filtered = filtered.filter((e) => e.category === selectedEmojiCategory);
    }

    // Filter by search
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (e) => e.name.toLowerCase().includes(q) || e.emoji.includes(search)
      );
    }

    return filtered;
  }, [activeTab, search, selectedEmojiCategory]);

  const activeItems = activeTab === 'icon' ? filteredIcons : filteredEmojis;
  const totalPages = Math.ceil(activeItems.length / PAGE_SIZE);
  
  const paginatedItems = React.useMemo(() => {
    return activeItems.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE,
    );
  }, [activeItems, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
    setSearch('');
    setSelectedEmojiCategory(null);
  }, [activeTab]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onClose}
      title={title}
      contentClassName="max-w-3xl max-h-[80vh] flex flex-col "
    >
      <Tabs defaultValue="icon" value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
        <div className="px-6 flex shrink-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="icon">Iconos</TabsTrigger>
            <TabsTrigger value="emoji">Emojis</TabsTrigger>
            <Tooltip>
               <TooltipTrigger asChild>
                 <span tabIndex={0} className="w-full">
                    <TabsTrigger value="picture" disabled className="w-full pointer-events-none opacity-50">Imágenes</TabsTrigger>
                 </span>
               </TooltipTrigger>
               <TooltipContent>Coming Soon</TooltipContent>
            </Tooltip>
          </TabsList>
        </div>

        <TabsContent value="icon" className="flex-1 flex flex-col min-h-0 data-[state=active]:flex">
            <div className="flex flex-col gap-4 px-6 pb-6 w-full h-full pt-4">
                <div className="relative shrink-0">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Filtrar iconos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>

              <ScrollArea className="flex-1 border rounded-md bg-muted/10 p-4 max-h-[40vh] overflow-auto">
                {activeTab === 'icon' && paginatedItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Search className="h-8 w-8 mb-2 opacity-50" />
                    <p>No se encontraron iconos</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-2">
                    {paginatedItems.map((item: any) => {
                      const IconComponent = Icons[item.icon as keyof typeof Icons];
                      if (!IconComponent) return null;
                      return (
                        <Tooltip key={item.icon}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-12 w-full flex items-center justify-center p-2 hover:bg-accent hover:text-accent-foreground"
                              onClick={() => {
                                onSelect(item.icon);
                                onClose();
                              }}
                            >
                              <IconComponent className="h-6 w-6" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>

              <div className="flex items-center justify-between pt-2 border-t shrink-0">
                <div className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages} ({activeItems.length} iconos)
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
        </TabsContent>
        
        <TabsContent value="emoji" className="flex-1 flex flex-col min-h-0 data-[state=active]:flex">
             <div className="flex flex-col gap-4 px-6 pb-6 w-full h-full pt-4">
                <div className="flex gap-2 shrink-0">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar emojis..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select
                    value={selectedEmojiCategory ?? 'all'}
                    onValueChange={(val) => {
                      setSelectedEmojiCategory(val === 'all' ? null : val as EmojiCategory);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[180px] shrink-0">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent style={{ zIndex: 1060 }}>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {ALL_EMOJI_CATEGORIES.map((cat) => {
                        const { label, icon } = emojiCategoryLabels[cat];
                        return (
                          <SelectItem key={cat} value={cat}>
                            <span className="flex items-center gap-2">
                              <span>{icon}</span>
                              <span>{label}</span>
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

              <ScrollArea className="flex-1 border rounded-md bg-muted/10 p-4 max-h-[40vh] overflow-auto">
                {activeTab === 'emoji' && paginatedItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Search className="h-8 w-8 mb-2 opacity-50" />
                    <p>No se encontraron emojis</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-2">
                    {paginatedItems.map((item: any) => (
                      <Tooltip key={`${item.emoji}-${item.name}`}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-12 w-full flex items-center justify-center p-2 text-2xl hover:bg-accent hover:text-accent-foreground"
                            onClick={() => {
                              onSelect(item.emoji);
                              onClose();
                            }}
                          >
                            {item.emoji}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{item.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <div className="flex items-center justify-between pt-2 border-t shrink-0">
                <div className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages} ({activeItems.length} emojis)
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
        </TabsContent>

        <TabsContent value="picture" className="flex-1 px-6 pb-6 pt-4">
             <div className="flex items-center justify-center h-full text-muted-foreground border rounded-md bg-muted/10">
                <p>Selector de Imágenes (Próximamente)</p>
             </div>
        </TabsContent>
      </Tabs>
    </ResponsiveModal>
  );
}
