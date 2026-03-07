'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '@/components/primitives/ui/utils';
import { RichTextEditorToolbar } from './RichTextEditorToolbar';
import type { RichTextEditorProps, RichTextEditorRef } from './RichTextEditor.types';
import '@/styles/tiptap-editor.css';

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  function RichTextEditor(
    { content, onContentChange, placeholder, className, minHeight = '300px' },
    ref,
  ) {
    const isInternalUpdate = useRef(false);

    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit,
        Underline,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        TextStyle,
        Color,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
        }),
        Image.configure({
          HTMLAttributes: { class: 'tiptap-image' },
        }),
        Placeholder.configure({
          placeholder: placeholder || 'Start writing your email content...',
        }),
      ],
      content,
      onUpdate: ({ editor: ed }) => {
        isInternalUpdate.current = true;
        onContentChange(ed.getHTML());
      },
      editorProps: {
        attributes: {
          class: 'prose prose-sm max-w-none focus:outline-none',
        },
      },
    });

    useEffect(() => {
      if (!editor) return;
      if (isInternalUpdate.current) {
        isInternalUpdate.current = false;
        return;
      }
      const currentHtml = editor.getHTML();
      if (currentHtml !== content) {
        editor.commands.setContent(content, { emitUpdate: false });
      }
    }, [editor, content]);

    useImperativeHandle(ref, () => ({
      insertContent: (text: string) => {
        if (editor) {
          editor.chain().focus().insertContent(text).run();
        }
      },
    }));

    if (!editor) return null;

    return (
      <div
        className={cn(
          'tiptap-editor rounded-md border border-input bg-background text-sm',
          className,
        )}
      >
        <RichTextEditorToolbar editor={editor} />
        <div style={{ minHeight }}>
          <EditorContent editor={editor} />
        </div>
      </div>
    );
  },
);
