// Theme Editor 3.0 - Scrollbar Styles Management

/**
 * Applies custom scrollbar styles using CSS variables
 * This creates dynamic scrollbar theming based on theme colors
 */
export function applyScrollbarStyles(): void {
  // Check if the style element already exists
  let styleElement = document.getElementById('theme-scrollbar-styles') as HTMLStyleElement;
  
  if (!styleElement) {
    // Create the style element if it doesn't exist
    styleElement = document.createElement('style');
    styleElement.id = 'theme-scrollbar-styles';
    document.head.appendChild(styleElement);
  }

  // CSS for custom scrollbar using theme variables
  const scrollbarCSS = `
    /* Webkit Scrollbar Styles */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: var(--scrollbar-track);
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: var(--scrollbar-thumb);
      border-radius: 4px;
      border: 1px solid var(--scrollbar-track);
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: var(--scrollbar-thumb);
      opacity: 0.8;
    }
    
    ::-webkit-scrollbar-corner {
      background: var(--scrollbar-track);
    }
    
    /* Firefox Scrollbar Styles */
    * {
      scrollbar-width: thin;
      scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
    }
    
    /* Tailwind scrollbar utilities override */
    .scrollbar-thin {
      scrollbar-width: thin;
      scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
    }
    
    .scrollbar-thin::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-track {
      background: var(--scrollbar-track);
      border-radius: 4px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-thumb {
      background: var(--scrollbar-thumb);
      border-radius: 4px;
      border: 1px solid var(--scrollbar-track);
    }
    
    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
      background: var(--scrollbar-thumb);
      opacity: 0.8;
    }
    
    .scrollbar-thumb-border {
      scrollbar-color: var(--border) var(--scrollbar-track);
    }
    
    .scrollbar-thumb-border::-webkit-scrollbar-thumb {
      background: var(--border);
    }
    
    .scrollbar-track-background {
      scrollbar-color: var(--scrollbar-thumb) var(--background);
    }
    
    .scrollbar-track-background::-webkit-scrollbar-track {
      background: var(--background);
    }
  `;

  // Apply the CSS to the style element
  styleElement.textContent = scrollbarCSS;
}

/**
 * Removes the custom scrollbar styles
 */
export function removeScrollbarStyles(): void {
  const styleElement = document.getElementById('theme-scrollbar-styles');
  if (styleElement) {
    styleElement.remove();
  }
}

/**
 * Updates scrollbar colors with specific values
 */
export function updateScrollbarColors(trackColor: string, thumbColor: string): void {
  const root = document.documentElement;
  root.style.setProperty('--scrollbar-track', trackColor);
  root.style.setProperty('--scrollbar-thumb', thumbColor);
}