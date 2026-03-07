'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { cn } from '@/components/primitives/ui/utils';
import type {
  EmailVisualEditorProps,
  EmailVisualEditorRef,
} from './EmailVisualEditor.types';

const EDITABLE_TAGS = new Set([
  'P',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'LI',
  'TD',
  'TH',
  'LABEL',
  'SPAN',
]);

const VARIABLE_REGEX = /(\{\{[^}]+\}\})/g;

function isEntirelyVariables(text: string): boolean {
  return text.replace(VARIABLE_REGEX, '').trim() === '';
}

function hasDirectTextContent(el: Element): boolean {
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      return true;
    }
  }
  return false;
}

function hasNestedEditableChildren(el: Element): boolean {
  for (const tag of EDITABLE_TAGS) {
    if (el.querySelector(tag.toLowerCase())) return true;
  }
  return false;
}

function protectVariables(el: Element, doc: Document): void {
  const textNodes: Text[] = [];
  const walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    if (node.textContent && VARIABLE_REGEX.test(node.textContent)) {
      textNodes.push(node);
    }
  }

  for (const textNode of textNodes) {
    const text = textNode.textContent || '';
    const parts = text.split(VARIABLE_REGEX);
    if (parts.length <= 1) continue;

    const fragment = doc.createDocumentFragment();
    for (const part of parts) {
      if (VARIABLE_REGEX.test(part)) {
        VARIABLE_REGEX.lastIndex = 0;
        const span = doc.createElement('span');
        span.setAttribute('data-variable', 'true');
        span.setAttribute('contenteditable', 'false');
        span.style.cssText =
          'font-family: monospace; background-color: rgba(6, 182, 212, 0.12); color: #0e7490; padding: 1px 4px; border-radius: 3px; user-select: none;';
        span.textContent = part;
        fragment.appendChild(span);
      } else if (part) {
        fragment.appendChild(doc.createTextNode(part));
      }
    }
    textNode.parentNode?.replaceChild(fragment, textNode);
  }
}

function makeEditable(doc: Document): void {
  const walker = doc.createTreeWalker(
    doc.body,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        const el = node as Element;
        if (el.tagName === 'A') return NodeFilter.FILTER_SKIP;
        if (!EDITABLE_TAGS.has(el.tagName)) return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      },
    },
  );

  const candidates: Element[] = [];
  let current: Element | null;
  while ((current = walker.nextNode() as Element | null)) {
    candidates.push(current);
  }

  for (const el of candidates) {
    const text = el.textContent || '';
    if (!text.trim()) continue;
    if (isEntirelyVariables(text)) continue;
    if (EDITABLE_TAGS.has(el.tagName) && el.tagName !== 'SPAN' && hasNestedEditableChildren(el)) {
      continue;
    }
    if (el.tagName === 'SPAN' && !hasDirectTextContent(el)) continue;

    el.setAttribute('contenteditable', 'true');
    el.setAttribute('data-editable', 'true');
    protectVariables(el, doc);
  }

  // Handle <a> tags: wrap inner text nodes in editable spans
  const links = doc.body.querySelectorAll('a');
  for (const link of Array.from(links)) {
    const text = link.textContent || '';
    if (!text.trim() || isEntirelyVariables(text)) continue;

    const textNodes: Text[] = [];
    for (const child of Array.from(link.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
        textNodes.push(child as Text);
      }
    }

    for (const textNode of textNodes) {
      const wrapper = doc.createElement('span');
      wrapper.setAttribute('contenteditable', 'true');
      wrapper.setAttribute('data-editable', 'true');
      wrapper.textContent = textNode.textContent;
      protectVariables(wrapper, doc);
      textNode.parentNode?.replaceChild(wrapper, textNode);
    }
  }
}

function extractCleanHtml(doc: Document): string {
  const clone = doc.body.cloneNode(true) as HTMLElement;

  // Remove editable attributes
  const editables = clone.querySelectorAll('[data-editable]');
  for (const el of Array.from(editables)) {
    el.removeAttribute('contenteditable');
    el.removeAttribute('data-editable');
  }

  // Unwrap variable spans back to plain text
  const varSpans = clone.querySelectorAll('[data-variable]');
  for (const span of Array.from(varSpans)) {
    const text = span.ownerDocument.createTextNode(span.textContent || '');
    span.parentNode?.replaceChild(text, span);
  }

  // Remove editable spans inside links (unwrap them)
  const editableSpans = clone.querySelectorAll('a span[data-editable]');
  for (const span of Array.from(editableSpans)) {
    const parent = span.parentNode;
    if (!parent) continue;
    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }
    parent.removeChild(span);
  }

  // Normalize adjacent text nodes
  clone.normalize();

  return clone.innerHTML;
}

function buildSrcDoc(content: string, minHeight: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 0; }
  [data-editable] {
    outline: 1px dashed transparent;
    transition: outline-color 0.15s;
    border-radius: 2px;
  }
  [data-editable]:hover {
    outline-color: rgba(59, 130, 246, 0.4);
  }
  [data-editable]:focus {
    outline: 2px solid rgba(59, 130, 246, 0.7);
    outline-offset: 1px;
  }
  [data-variable] {
    cursor: default;
  }
</style>
</head>
<body style="min-height: ${minHeight};">${content}</body>
</html>`;
}

export const EmailVisualEditor = forwardRef<
  EmailVisualEditorRef,
  EmailVisualEditorProps
>(function EmailVisualEditor(
  { content, onContentChange, placeholder, className, minHeight = '300px' },
  ref,
) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isInternalUpdate = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [hasEditableContent, setHasEditableContent] = useState(true);

  const syncChanges = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    isInternalUpdate.current = true;
    const cleanHtml = extractCleanHtml(doc);
    onContentChange(cleanHtml);
  }, [onContentChange]);

  const resizeIframe = useCallback(() => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!iframe || !doc?.body) return;

    const height = Math.max(doc.body.scrollHeight + 20, parseInt(minHeight));
    iframe.style.height = `${height}px`;
  }, [minHeight]);

  const handleLoad = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    makeEditable(doc);

    const editableEls = doc.querySelectorAll('[data-editable]');
    setHasEditableContent(editableEls.length > 0);

    // Listen for input events
    doc.body.addEventListener('input', () => {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        syncChanges();
        resizeIframe();
      }, 300);
    });

    // Paste sanitization — plain text only
    doc.body.addEventListener('paste', (e: ClipboardEvent) => {
      const target = e.target as Element;
      if (!target.closest?.('[data-editable]')) return;

      e.preventDefault();
      const text = e.clipboardData?.getData('text/plain') || '';
      const sel = doc.getSelection();
      if (!sel?.rangeCount) return;

      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(doc.createTextNode(text));
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);

      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        syncChanges();
        resizeIframe();
      }, 300);
    });

    // Prevent Enter from creating new block elements (keep editing simple)
    doc.body.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const target = e.target as Element;
        if (target.closest?.('[data-editable]')) {
          e.preventDefault();
          // Insert a <br> instead
          const sel = doc.getSelection();
          if (!sel?.rangeCount) return;
          const range = sel.getRangeAt(0);
          range.deleteContents();
          const br = doc.createElement('br');
          range.insertNode(br);
          range.setStartAfter(br);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    });

    resizeIframe();
  }, [syncChanges, resizeIframe]);

  // Reload iframe when content changes externally
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    // External content change — iframe needs to reload
    const iframe = iframeRef.current;
    if (!iframe) return;
    iframe.srcdoc = buildSrcDoc(content, minHeight);
  }, [content, minHeight]);

  useImperativeHandle(ref, () => ({
    insertContent: (text: string) => {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;

      const sel = doc.getSelection();
      const editable = sel?.focusNode
        ? (sel.focusNode as Element).closest?.('[data-editable]') ||
          (sel.focusNode.parentElement as Element)?.closest?.(
            '[data-editable]',
          )
        : null;

      // Build protected variable span
      const varSpan = doc.createElement('span');
      varSpan.setAttribute('data-variable', 'true');
      varSpan.setAttribute('contenteditable', 'false');
      varSpan.style.cssText =
        'font-family: monospace; background-color: rgba(6, 182, 212, 0.12); color: #0e7490; padding: 1px 4px; border-radius: 3px; user-select: none;';
      varSpan.textContent = text;

      if (editable && sel?.rangeCount) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(varSpan);
        range.setStartAfter(varSpan);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        // No cursor — insert into first editable element
        const firstEditable = doc.querySelector('[data-editable]');
        if (firstEditable) {
          firstEditable.appendChild(varSpan);
          (firstEditable as HTMLElement).focus();
        }
      }

      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(syncChanges, 100);
    },
  }));

  useEffect(() => {
    return () => {
      clearTimeout(debounceTimer.current);
    };
  }, []);

  return (
    <div
      className={cn(
        'rounded-md border border-input bg-background text-sm overflow-hidden',
        className,
      )}
    >
      {!hasEditableContent && content.trim() && (
        <div className="px-3 py-2 bg-blue-50 text-blue-700 text-xs border-b dark:bg-blue-950/30 dark:text-blue-300">
          This template contains only variables and structural elements.
          Switch to HTML mode to edit.
        </div>
      )}
      <iframe
        ref={iframeRef}
        srcDoc={buildSrcDoc(content, minHeight)}
        title="Email Visual Editor"
        className="w-full border-0 block bg-white"
        style={{ minHeight }}
        sandbox="allow-same-origin"
        onLoad={handleLoad}
      />
      {!content.trim() && placeholder && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-muted-foreground text-sm">
          {placeholder}
        </div>
      )}
    </div>
  );
});
