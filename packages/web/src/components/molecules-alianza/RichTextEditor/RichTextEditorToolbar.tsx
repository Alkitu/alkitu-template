'use client';

import { type Editor } from '@tiptap/react';
import { Toggle } from '@/components/primitives/ui/toggle';
import { Separator } from '@/components/primitives/ui/separator';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/primitives/ui/tooltip';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/primitives/ui/popover';
import { Input } from '@/components/primitives/ui/input';
import { Button } from '@/components/primitives/ui/button';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  Minus,
  Quote,
  Palette,
  Undo,
  Redo,
} from 'lucide-react';
import { useState, useCallback } from 'react';

interface RichTextEditorToolbarProps {
  editor: Editor;
}

const TEXT_COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#cccccc',
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#14b8a6',
];

function ToolbarButton({
  label,
  pressed,
  onPressedChange,
  children,
}: {
  label: string;
  pressed: boolean;
  onPressedChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle size="sm" pressed={pressed} onPressedChange={onPressedChange}>
          {children}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function RichTextEditorToolbar({ editor }: RichTextEditorToolbarProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkOpen, setLinkOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

  const setLink = useCallback(() => {
    if (!linkUrl) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
    }
    setLinkUrl('');
    setLinkOpen(false);
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
    }
    setImageUrl('');
    setImageOpen(false);
  }, [editor, imageUrl]);

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b p-1">
      {/* Text formatting */}
      <ToolbarButton
        label="Bold"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        pressed={editor.isActive('underline')}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Strikethrough"
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Headings */}
      <ToolbarButton
        label="Heading 1"
        pressed={editor.isActive('heading', { level: 1 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 2"
        pressed={editor.isActive('heading', { level: 2 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        pressed={editor.isActive('heading', { level: 3 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Lists */}
      <ToolbarButton
        label="Bullet List"
        pressed={editor.isActive('bulletList')}
        onPressedChange={() =>
          editor.chain().focus().toggleBulletList().run()
        }
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Ordered List"
        pressed={editor.isActive('orderedList')}
        onPressedChange={() =>
          editor.chain().focus().toggleOrderedList().run()
        }
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Alignment */}
      <ToolbarButton
        label="Align Left"
        pressed={editor.isActive({ textAlign: 'left' })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign('left').run()
        }
      >
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Align Center"
        pressed={editor.isActive({ textAlign: 'center' })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign('center').run()
        }
      >
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Align Right"
        pressed={editor.isActive({ textAlign: 'right' })}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign('right').run()
        }
      >
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Blockquote */}
      <ToolbarButton
        label="Blockquote"
        pressed={editor.isActive('blockquote')}
        onPressedChange={() =>
          editor.chain().focus().toggleBlockquote().run()
        }
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>

      {/* Horizontal Rule */}
      <ToolbarButton
        label="Horizontal Rule"
        pressed={false}
        onPressedChange={() =>
          editor.chain().focus().setHorizontalRule().run()
        }
      >
        <Minus className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Link */}
      <Popover open={linkOpen} onOpenChange={setLinkOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive('link')}
                onPressedChange={() => {
                  if (editor.isActive('link')) {
                    editor.chain().focus().unsetLink().run();
                  } else {
                    const previousUrl = editor.getAttributes('link').href || '';
                    setLinkUrl(previousUrl);
                    setLinkOpen(true);
                  }
                }}
              >
                <Link className="h-4 w-4" />
              </Toggle>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Link</TooltipContent>
        </Tooltip>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <p className="text-sm font-medium">Insert Link</p>
            <Input
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setLink()}
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setLinkOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={setLink}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Image */}
      <Popover open={imageOpen} onOpenChange={setImageOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Toggle
                size="sm"
                pressed={false}
                onPressedChange={() => setImageOpen(true)}
              >
                <Image className="h-4 w-4" />
              </Toggle>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Image</TooltipContent>
        </Tooltip>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <p className="text-sm font-medium">Insert Image</p>
            <Input
              placeholder="https://example.com/image.png"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addImage()}
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setImageOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={addImage}>
                Insert
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Color */}
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Toggle size="sm" pressed={false}>
                <Palette className="h-4 w-4" />
              </Toggle>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Text Color</TooltipContent>
        </Tooltip>
        <PopoverContent className="w-auto">
          <div className="space-y-2">
            <p className="text-sm font-medium">Text Color</p>
            <div className="grid grid-cols-5 gap-1.5">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="h-6 w-6 rounded-md border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() =>
                    editor.chain().focus().setColor(color).run()
                  }
                />
              ))}
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs"
              onClick={() => editor.chain().focus().unsetColor().run()}
            >
              Reset Color
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* History */}
      <ToolbarButton
        label="Undo"
        pressed={false}
        onPressedChange={() => editor.chain().focus().undo().run()}
      >
        <Undo className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        pressed={false}
        onPressedChange={() => editor.chain().focus().redo().run()}
      >
        <Redo className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}
