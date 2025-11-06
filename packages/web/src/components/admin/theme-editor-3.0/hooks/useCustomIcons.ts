'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CustomIcon {
  id: string;
  name: string;
  svg: string;
  uploadedAt: number;
}

const STORAGE_KEY = 'theme-editor-custom-icons';
const MAX_FILE_SIZE = 100 * 1024; // 100KB

/**
 * Hook for managing custom uploaded SVG icons
 * Provides storage, validation, and management of user-uploaded icons
 */
export function useCustomIcons() {
  const [customIcons, setCustomIcons] = useState<CustomIcon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load custom icons from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const icons = JSON.parse(stored);
        setCustomIcons(Array.isArray(icons) ? icons : []);
      }
    } catch (error) {
      console.error('Failed to load custom icons:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save custom icons to localStorage
  const saveIcons = useCallback((icons: CustomIcon[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(icons));
      setCustomIcons(icons);
    } catch (error) {
      console.error('Failed to save custom icons:', error);
      throw new Error('Failed to save icons. Storage might be full.');
    }
  }, []);

  // Process and normalize SVG content
  const processSVG = useCallback((svgContent: string): string => {
    try {
      // Parse SVG
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');

      if (!svgElement) {
        throw new Error('Invalid SVG file');
      }

      // Check for parse errors
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Invalid SVG structure');
      }

      // Normalize viewBox and dimensions
      if (!svgElement.getAttribute('viewBox')) {
        const width = svgElement.getAttribute('width') || '24';
        const height = svgElement.getAttribute('height') || '24';
        svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
      }

      // Remove fixed dimensions to allow sizing via CSS
      svgElement.removeAttribute('width');
      svgElement.removeAttribute('height');

      // Replace fill and stroke colors with currentColor for theme integration
      const elements = svgElement.querySelectorAll('*');
      elements.forEach(el => {
        const fill = el.getAttribute('fill');
        const stroke = el.getAttribute('stroke');

        // Skip if fill="none" or stroke="none"
        if (fill && fill !== 'none' && fill !== 'transparent') {
          el.setAttribute('fill', 'currentColor');
        }
        if (stroke && stroke !== 'none' && stroke !== 'transparent') {
          el.setAttribute('stroke', 'currentColor');
        }
      });

      // Also check the SVG element itself
      const svgFill = svgElement.getAttribute('fill');
      const svgStroke = svgElement.getAttribute('stroke');
      if (svgFill && svgFill !== 'none' && svgFill !== 'transparent') {
        svgElement.setAttribute('fill', 'currentColor');
      }
      if (svgStroke && svgStroke !== 'none' && svgStroke !== 'transparent') {
        svgElement.setAttribute('stroke', 'currentColor');
      }

      // Return cleaned SVG string
      return new XMLSerializer().serializeToString(svgElement);
    } catch (error) {
      console.error('SVG processing error:', error);
      throw error instanceof Error ? error : new Error('Failed to process SVG');
    }
  }, []);

  // Validate SVG file
  const validateSVG = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Check file type
      if (!file.type.includes('svg') && !file.name.endsWith('.svg')) {
        reject(new Error('File must be an SVG'));
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        reject(new Error(`File size must be less than ${MAX_FILE_SIZE / 1024}KB`));
        return;
      }

      // Read and validate content
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const processed = processSVG(content);
          resolve(processed);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, [processSVG]);

  // Add a new custom icon
  const addIcon = useCallback(async (file: File, name?: string): Promise<void> => {
    try {
      // Validate and process SVG
      const processedSVG = await validateSVG(file);

      // Generate name from filename if not provided
      const iconName = name || file.name.replace(/\.svg$/i, '').replace(/[^a-zA-Z0-9-_]/g, '_');

      // Check for duplicate names
      if (customIcons.some(icon => icon.name === iconName)) {
        throw new Error(`An icon named "${iconName}" already exists`);
      }

      // Create new icon entry
      const newIcon: CustomIcon = {
        id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: iconName,
        svg: processedSVG,
        uploadedAt: Date.now()
      };

      // Save updated icons
      saveIcons([...customIcons, newIcon]);
    } catch (error) {
      console.error('Failed to add icon:', error);
      throw error;
    }
  }, [customIcons, saveIcons, validateSVG]);

  // Remove a custom icon
  const removeIcon = useCallback((iconId: string) => {
    const updatedIcons = customIcons.filter(icon => icon.id !== iconId);
    saveIcons(updatedIcons);
  }, [customIcons, saveIcons]);

  // Clear all custom icons
  const clearAllIcons = useCallback(() => {
    if (window.confirm('Are you sure you want to remove all custom icons?')) {
      saveIcons([]);
    }
  }, [saveIcons]);

  // Get icon by name
  const getIconByName = useCallback((name: string): CustomIcon | undefined => {
    return customIcons.find(icon => icon.name === name);
  }, [customIcons]);

  return {
    customIcons,
    isLoading,
    addIcon,
    removeIcon,
    clearAllIcons,
    getIconByName,
    validateSVG,
    processSVG
  };
}