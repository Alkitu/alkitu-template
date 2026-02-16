import { Injectable, Logger } from '@nestjs/common';
import * as React from 'react';
import { render } from '@react-email/render';
import { BaseEmailLayout } from '../templates/BaseEmailLayout';
import { Section } from '@react-email/components';

@Injectable()
export class EmailRendererService {
  private readonly logger = new Logger(EmailRendererService.name);

  /**
   * Detects if body starts with <!DOCTYPE or <html> (case-insensitive, trimmed).
   * Used for backward compatibility during transition.
   */
  isLegacyFullDocument(body: string): boolean {
    const trimmed = body.trim().toLowerCase();
    return trimmed.startsWith('<!doctype') || trimmed.startsWith('<html');
  }

  /**
   * Strips <!DOCTYPE>, <html>, <head>, <body> tags and the outermost container div.
   * Keeps the template-specific colored headers and content sections.
   * Strips the common footer (since BaseEmailLayout provides one).
   */
  extractInnerContent(fullHtml: string): string {
    let content = fullHtml;

    // Remove DOCTYPE
    content = content.replace(/<!DOCTYPE[^>]*>/i, '');

    // Remove <html> tags
    content = content.replace(/<html[^>]*>/i, '');
    content = content.replace(/<\/html>/i, '');

    // Remove <head>...</head> entirely
    content = content.replace(/<head[\s\S]*?<\/head>/i, '');

    // Remove <body> tags but keep content
    content = content.replace(/<body[^>]*>/i, '');
    content = content.replace(/<\/body>/i, '');

    // Remove the hidden preheader div (display:none)
    content = content.replace(
      /<div[^>]*display:\s*none[^>]*>[\s\S]*?<\/div>/i,
      '',
    );

    // Remove the outermost container div (max-width: 600px wrapper)
    // We extract its inner content
    const outerDivMatch = content.match(
      /^\s*<div[^>]*max-width:\s*600px[^>]*>([\s\S]*)<\/div>\s*$/i,
    );
    if (outerDivMatch) {
      content = outerDivMatch[1];
    }

    // Remove the common footer section (copyright footer at the bottom)
    // Footer pattern: <div> with background-color: #f7fafc and containing copyright text
    content = content.replace(
      /\s*<!--\s*Footer\s*-->[\s\S]*?<div[^>]*background-color:\s*#f7fafc[^>]*>[\s\S]*?<\/div>\s*$/i,
      '',
    );

    // If no comment-based footer found, try to remove by pattern
    if (
      content.includes('Todos los derechos reservados') ||
      content.includes('All rights reserved')
    ) {
      content = content.replace(
        /\s*<div[^>]*background-color:\s*#f7fafc[^>]*padding[^>]*border-top[^>]*>[\s\S]*?(?:derechos reservados|rights reserved)[\s\S]*?<\/div>\s*$/i,
        '',
      );
    }

    return content.trim();
  }

  /**
   * Creates BaseEmailLayout React element with the inner HTML content,
   * uses render() from @react-email/render to produce final HTML string.
   *
   * Automatically detects legacy full HTML documents and extracts inner content.
   */
  async renderWithLayout(
    bodyHtml: string,
    locale: string = 'es',
    previewText?: string,
  ): Promise<string> {
    try {
      let innerContent = bodyHtml;

      // Auto-detect and extract inner content from legacy full HTML documents
      if (this.isLegacyFullDocument(bodyHtml)) {
        innerContent = this.extractInnerContent(bodyHtml);
        this.logger.debug(
          'Detected legacy full HTML document, extracted inner content',
        );
      }

      const emailElement = React.createElement(
        BaseEmailLayout,
        { locale, previewText },
        React.createElement(Section, {
          dangerouslySetInnerHTML: { __html: innerContent },
        }),
      );

      const html = await render(emailElement);
      return html;
    } catch (error) {
      this.logger.error(
        `Failed to render email with layout: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      // Fallback: return the body as-is to avoid blocking email delivery
      return bodyHtml;
    }
  }
}
