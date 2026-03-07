export interface RichTextEditorProps {
  content: string;
  onContentChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export interface RichTextEditorRef {
  insertContent: (text: string) => void;
}
