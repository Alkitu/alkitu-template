export interface EmailVisualEditorProps {
  content: string;
  onContentChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export interface EmailVisualEditorRef {
  insertContent: (text: string) => void;
}
