'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ThemeData, ThemeWithCurrentColors, ThemeMode, EditorState, EditorSection, ViewportState, ViewportSize, PreviewState, PreviewSection } from '../types';
import { DEFAULT_THEME, DEFAULT_THEMES } from '../constants/default-themes';
import { applyThemeToRoot, applyThemeMode, applyModeSpecificColors, applyTypographyElements, applyBorderElements, applyScrollElements, applyScrollbarColors, applyScrollbarUtilityClass } from '../../lib/utils/css/css-variables';
import { DEFAULT_TYPOGRAPHY } from '../../theme-editor/editor/typography/types';
import { trpc } from '@/lib/trpc';
import { useThemeAuth } from '../hooks/useThemeAuth';

// History interface for undo/redo functionality
interface HistoryEntry {
  baseTheme: ThemeData;
  themeMode: ThemeMode;
  timestamp: number;
}

interface HistoryState {
  past: HistoryEntry[];
  present: HistoryEntry;
  future: HistoryEntry[];
  maxHistory: number;
}

// State interface
interface ThemeEditorState {
  // Theme data
  baseTheme: ThemeData;              // Base theme with dual configs
  currentTheme: ThemeWithCurrentColors; // Theme with current colors based on mode
  availableThemes: ThemeData[];      // List of available themes
  themeMode: ThemeMode;
  
  // History for undo/redo
  history: HistoryState;
  
  // Editor state
  editor: EditorState;
  
  // Viewport state
  viewport: ViewportState;
  
  // Preview state
  preview: PreviewState;
  
  // UI state
  isLoading: boolean;
  error: string | null;
}

// Helper function to compute current theme with mode-specific colors
function computeCurrentTheme(baseTheme: ThemeData, mode: ThemeMode): ThemeWithCurrentColors {
  const colors = mode === 'dark' ? baseTheme.darkColors : baseTheme.lightColors;
  
  return {
    ...baseTheme,
    colors,
    lightColors: baseTheme.lightColors,
    darkColors: baseTheme.darkColors
  };
}

// Action types
type ThemeEditorAction =
  | { type: 'SET_THEME'; payload: ThemeData }
  | { type: 'SET_THEME_MODE'; payload: ThemeMode }
  | { type: 'UPDATE_CURRENT_COLORS'; payload: { mode: ThemeMode; colors: import('../types/theme.types').ThemeColors } }
  | { type: 'SET_EDITOR_SECTION'; payload: EditorSection }
  | { type: 'SET_VIEWPORT'; payload: ViewportSize }
  | { type: 'SET_PREVIEW_SECTION'; payload: PreviewSection }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_UNSAVED_CHANGES'; payload: boolean }
  | { type: 'ADD_THEME'; payload: ThemeData }
  | { type: 'REMOVE_THEME'; payload: string }
  | { type: 'UNDO' }
  | { type: 'REDO' };

// Helper function to create initial history state
function createInitialHistoryState(theme: ThemeData, mode: ThemeMode): HistoryState {
  const initialEntry: HistoryEntry = {
    baseTheme: theme,
    themeMode: mode,
    timestamp: Date.now()
  };

  return {
    past: [],
    present: initialEntry,
    future: [],
    maxHistory: 30
  };
}

// Helper functions for history management
function addToHistory(history: HistoryState, newEntry: HistoryEntry): HistoryState {
  const newPast = [...history.past, history.present];
  
  // Limit history to maxHistory entries
  if (newPast.length > history.maxHistory) {
    newPast.shift(); // Remove oldest entry
  }

  return {
    ...history,
    past: newPast,
    present: newEntry,
    future: [] // Clear future when new action is performed
  };
}

function canUndo(history: HistoryState): boolean {
  return history.past.length > 0;
}

function canRedo(history: HistoryState): boolean {
  return history.future.length > 0;
}

function performUndo(history: HistoryState): { history: HistoryState; entry: HistoryEntry } | null {
  if (!canUndo(history)) return null;

  const previous = history.past[history.past.length - 1];
  const newPast = history.past.slice(0, -1);
  const newFuture = [history.present, ...history.future];

  return {
    history: {
      ...history,
      past: newPast,
      present: previous,
      future: newFuture
    },
    entry: previous
  };
}

function performRedo(history: HistoryState): { history: HistoryState; entry: HistoryEntry } | null {
  if (!canRedo(history)) return null;

  const next = history.future[0];
  const newFuture = history.future.slice(1);
  const newPast = [...history.past, history.present];

  return {
    history: {
      ...history,
      past: newPast,
      present: next,
      future: newFuture
    },
    entry: next
  };
}

// Helper function to get persisted active section (client-side only)
function getPersistedActiveSection(): EditorSection | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem('theme-editor-active-section');
    if (stored && ['colors', 'typography', 'brand', 'borders', 'spacing', 'shadows', 'scroll'].includes(stored)) {
      return stored as EditorSection;
    }
  } catch (error) {
    console.warn('Failed to read active section from localStorage:', error);
  }
  
  return null;
}

// Helper function to persist active section
function persistActiveSection(section: EditorSection) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('theme-editor-active-section', section);
  } catch (error) {
    console.warn('Failed to save active section to localStorage:', error);
  }
}

/**
 * Get initial theme mode from localStorage (client-side only)
 * This prevents FOUC by ensuring React hydrates with the same mode as the blocking script
 */
function getInitialThemeMode(): ThemeMode {
  // Only read from localStorage on the client
  if (typeof window !== 'undefined') {
    try {
      const savedMode = localStorage.getItem('theme-mode');
      if (savedMode === 'dark' || savedMode === 'light' || savedMode === 'system') {
        return savedMode;
      }
    } catch (error) {
      console.warn('Failed to read theme-mode from localStorage:', error);
    }
  }
  // Default to 'light' for SSR or if localStorage is not available
  return 'light';
}

/**
 * Create initial state - reads theme mode from localStorage to prevent FOUC
 * This function is called during component initialization to ensure
 * the initial state matches the blocking script's applied mode
 */
function createInitialState(): ThemeEditorState {
  const initialThemeMode = getInitialThemeMode();

  return {
    baseTheme: DEFAULT_THEME,
    currentTheme: computeCurrentTheme(DEFAULT_THEME, initialThemeMode),
    availableThemes: DEFAULT_THEMES,
    themeMode: initialThemeMode,
    history: createInitialHistoryState(DEFAULT_THEME, initialThemeMode),
    editor: {
      activeSection: 'colors', // Always start with 'colors' to prevent hydration mismatch
      isEditing: false,
    hasUnsavedChanges: false
  },
  viewport: {
    current: 'desktop',
    isResponsive: true
  },
  preview: {
    activeSection: 'colors', // Always start with 'colors' to prevent hydration mismatch
    isFullscreen: false,
    showGrid: false,
    showRuler: false
  },
  isLoading: false,
  error: null
  };
}

// Reducer
function themeEditorReducer(state: ThemeEditorState, action: ThemeEditorAction): ThemeEditorState {
  switch (action.type) {
    case 'SET_THEME':
      const newCurrentTheme = computeCurrentTheme(action.payload, state.themeMode);
      return {
        ...state,
        baseTheme: action.payload,
        currentTheme: newCurrentTheme,
        editor: { ...state.editor, hasUnsavedChanges: false }
      };
    
    case 'SET_THEME_MODE':
      const updatedCurrentTheme = computeCurrentTheme(state.baseTheme, action.payload);
      return {
        ...state,
        themeMode: action.payload,
        currentTheme: updatedCurrentTheme
      };
    
    case 'UPDATE_CURRENT_COLORS':
      // Add current state to history BEFORE making changes
      const { mode, colors } = action.payload;
      const previousHistoryEntry: HistoryEntry = {
        baseTheme: state.baseTheme, // Save current state before changing
        themeMode: state.themeMode,
        timestamp: Date.now()
      };
      const updatedHistory = addToHistory(state.history, previousHistoryEntry);
      
      // Update colors for the current mode in the base theme
      const updatedBaseTheme = {
        ...state.baseTheme,
        [mode === 'dark' ? 'darkColors' : 'lightColors']: colors
      };
      
      // Recompute current theme if we're updating colors for the active mode
      const shouldUpdateCurrent = mode === state.themeMode;
      const newCurrentForColorUpdate = shouldUpdateCurrent 
        ? { 
            ...state.currentTheme, 
            colors,
            [mode === 'dark' ? 'darkColors' : 'lightColors']: colors
          }
        : {
            ...state.currentTheme,
            [mode === 'dark' ? 'darkColors' : 'lightColors']: colors
          };
      
      return {
        ...state,
        baseTheme: updatedBaseTheme,
        currentTheme: newCurrentForColorUpdate,
        history: updatedHistory,
        editor: { ...state.editor, hasUnsavedChanges: true }
      };
    
    case 'SET_EDITOR_SECTION':
      // Persist the active section to localStorage
      persistActiveSection(action.payload);
      
      return {
        ...state,
        editor: { ...state.editor, activeSection: action.payload }
        // Preview section remains independent - no automatic update
      };
    
    case 'SET_VIEWPORT':
      return {
        ...state,
        viewport: { ...state.viewport, current: action.payload }
      };
    
    case 'SET_PREVIEW_SECTION':
      return {
        ...state,
        preview: { ...state.preview, activeSection: action.payload }
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case 'TOGGLE_UNSAVED_CHANGES':
      return {
        ...state,
        editor: { ...state.editor, hasUnsavedChanges: action.payload }
      };
    
    case 'ADD_THEME':
      return {
        ...state,
        availableThemes: [...state.availableThemes, action.payload],
        currentTheme: computeCurrentTheme(action.payload, state.themeMode),
        baseTheme: action.payload,
        editor: { ...state.editor, hasUnsavedChanges: false }
      };

    case 'REMOVE_THEME':
      return {
        ...state,
        availableThemes: state.availableThemes.filter(t => t.id !== action.payload),
      };

    case 'UNDO':
      const undoResult = performUndo(state.history);
      if (!undoResult) return state;
      
      const undoCurrentTheme = computeCurrentTheme(undoResult.entry.baseTheme, undoResult.entry.themeMode);
      return {
        ...state,
        baseTheme: undoResult.entry.baseTheme,
        themeMode: undoResult.entry.themeMode,
        currentTheme: undoCurrentTheme,
        history: undoResult.history,
        editor: { ...state.editor, hasUnsavedChanges: true }
      };
    
    case 'REDO':
      const redoResult = performRedo(state.history);
      if (!redoResult) return state;
      
      const redoCurrentTheme = computeCurrentTheme(redoResult.entry.baseTheme, redoResult.entry.themeMode);
      return {
        ...state,
        baseTheme: redoResult.entry.baseTheme,
        themeMode: redoResult.entry.themeMode,
        currentTheme: redoCurrentTheme,
        history: redoResult.history,
        editor: { ...state.editor, hasUnsavedChanges: true }
      };
    
    default:
      return state;
  }
}

// Context
interface ThemeEditorContextType {
  state: ThemeEditorState;
  dispatch: React.Dispatch<ThemeEditorAction>;

  // Helper actions
  setTheme: (theme: ThemeData) => void;
  updateTheme: (theme: ThemeData) => void;
  setThemeMode: (mode: ThemeMode) => void;
  updateCurrentModeColors: (colors: import('../types/theme.types').ThemeColors) => void;
  setEditorSection: (section: EditorSection) => void;
  setViewport: (viewport: ViewportSize) => void;
  setPreviewSection: (section: PreviewSection) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  markUnsaved: () => void;
  markSaved: () => void;
  addTheme: (theme: ThemeData) => void;
  removeTheme: (themeId: string) => void;

  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  undoCount: number;
  redoCount: number;
}

const ThemeEditorContext = createContext<ThemeEditorContextType | undefined>(undefined);

// Provider
interface ThemeEditorProviderProps {
  children: ReactNode;
  companyId?: string;
  initialTheme?: any; // Theme from server-side (DB theme object)
  isEditorMode?: boolean; // Flag to enable/disable editor-specific features
}

export function ThemeEditorProvider({ children, companyId: propCompanyId, initialTheme, isEditorMode = false }: ThemeEditorProviderProps) {
  // Initialize state with localStorage theme mode to prevent FOUC
  const [state, dispatch] = useReducer(themeEditorReducer, undefined, createInitialState);

  // Get authenticated user data to determine correct companyId
  const { userId, companyId: authCompanyId } = useThemeAuth();

  // Load themes from database
  // Logic: Use prop if provided and not default, otherwise try auth data (company or user), then fallback to hardcoded
  // This matches the logic in useThemeSelector
  const HARDCODED_ID = '6733c2fd80b7b58d4c36d966';
  const companyId = (propCompanyId && propCompanyId !== HARDCODED_ID)
    ? propCompanyId
    : (authCompanyId || userId || propCompanyId || HARDCODED_ID);

  // Debug log to verify we are using the correct ID
  // console.log('🔍 [ThemeEditorProvider] Loading themes for companyId:', companyId);

  // FIX: Only execute query on client side to prevent React 19 hydration errors
  const isClient = typeof window !== 'undefined';

  // Always fetch from database to detect theme updates (favorite/default changes)
  const { data: dbThemes, refetch: refetchThemes } = trpc.theme.listAllThemes.useQuery(
    undefined,
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
      enabled: isClient, // Only fetch on client side
    }
  );

  // MODIFIED: Load theme with priority: Server initialTheme (SSR) → DB themes → Hardcoded
  // This prevents FOUC by prioritizing the server-side theme
  useEffect(() => {
    let themeToLoad: any = null;

    // Priority 1 (HIGHEST): Server-side initialTheme (SSR) - prevents FOUC
    if (initialTheme) {
      themeToLoad = initialTheme;
      console.log('🎨 [ThemeContext] Using initialTheme from SSR:', initialTheme.name);
    }
    // Priority 2: Database themes - only if no initialTheme from server
    else if (dbThemes && dbThemes.length > 0) {
      // Find active theme (user selected)
      themeToLoad = dbThemes.find(t => t.isActive);

      // If no active, find default theme (company default)
      if (!themeToLoad) {
        themeToLoad = dbThemes.find(t => t.isDefault);
      }

      // If no default, find favorite theme
      if (!themeToLoad) {
        themeToLoad = dbThemes.find(t => t.isFavorite);
      }

      // If no default or favorite, use the most recently updated theme
      if (!themeToLoad) {
        themeToLoad = dbThemes[0]; // Already sorted by updatedAt desc from backend
      }

      console.log('🎨 [ThemeContext] Using theme from DB:', themeToLoad?.name);
    }
    // Priority 3 (LOWEST): Use hardcoded default as last resort
    else {
      const initialColors = state.themeMode === 'dark' ? DEFAULT_THEME.darkColors : DEFAULT_THEME.lightColors;
      applyModeSpecificColors(initialColors);
      applyThemeMode(state.themeMode);
      applyScrollElements(state.baseTheme.scroll);
      applyTypographyElements(DEFAULT_TYPOGRAPHY);
      console.log('🎨 [ThemeContext] Using hardcoded default theme');
      return;
    }

    // Convert theme to ThemeData format (works for both DB themes and initialTheme)
    const dbThemeData = (themeToLoad.themeData as any) || {};

    const loadedTheme: ThemeData = {
      id: themeToLoad.id,
      name: themeToLoad.name,
      description: themeToLoad.description || '',
      lightColors: themeToLoad.lightModeConfig as any,
      darkColors: themeToLoad.darkModeConfig as any,
      typography: themeToLoad.typography as any,
      brand: dbThemeData.brand || {
        name: themeToLoad.name + ' Brand',
        logos: { icon: null, horizontal: null, vertical: null }
      },
      spacing: dbThemeData.spacing || {},
      borders: dbThemeData.borders || {},
      shadows: dbThemeData.shadows || {},
      scroll: dbThemeData.scroll || {},
      isDefault: themeToLoad.isDefault,
      isFavorite: themeToLoad.isFavorite,
    };

    // Ensure brand logos structure exists
    if (!loadedTheme.brand.logos) {
      loadedTheme.brand.logos = { icon: null, horizontal: null, vertical: null };
    }

    // Apply the loaded theme
    dispatch({ type: 'SET_THEME', payload: loadedTheme });

    const colors = state.themeMode === 'dark' ? loadedTheme.darkColors : loadedTheme.lightColors;
    applyModeSpecificColors(colors);
    applyThemeMode(state.themeMode);
    applyScrollElements(loadedTheme.scroll || {});
    applyScrollElements(loadedTheme.scroll || {});
    const typography = { ...DEFAULT_TYPOGRAPHY, ...(loadedTheme.typography || {}) };
    applyTypographyElements(typography);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTheme]); // MODIFIED: Only depend on initialTheme to prevent re-loading from dbThemes

  // Hydrate persisted active section after initial render to prevent hydration mismatch
  useEffect(() => {
    const persistedSection = getPersistedActiveSection();
    if (persistedSection && persistedSection !== state.editor.activeSection) {
      dispatch({ type: 'SET_EDITOR_SECTION', payload: persistedSection });
    }
  }, []);
  
  // Apply colors and mode when theme mode changes
  useEffect(() => {
    const currentColors = state.themeMode === 'dark' ? state.baseTheme.darkColors : state.baseTheme.lightColors;
    applyModeSpecificColors(currentColors);
    // IMPORTANT: Apply scrollbar colors specifically to ensure they work
    applyScrollbarColors(currentColors);
    applyThemeMode(state.themeMode);
    applyScrollElements(state.baseTheme.scroll);
  }, [state.themeMode, state.baseTheme]);

  // Apply borders when they change
  useEffect(() => {
    if (state.baseTheme.borders) {
      applyBorderElements(state.baseTheme.borders);
    }
  }, [state.baseTheme.borders]);

  // Apply scroll settings when they change - SOLUTION 1
  useEffect(() => {
    if (state.baseTheme.scroll) {
      const currentColors = state.themeMode === 'dark' ? state.baseTheme.darkColors : state.baseTheme.lightColors;
      // Use SOLUTION 1: Utility Classes + CSS Variables
      applyScrollbarUtilityClass(state.baseTheme.scroll, {
        scrollbarTrack: currentColors.scrollbarTrack,
        scrollbarThumb: currentColors.scrollbarThumb
      });
    }
  }, [state.baseTheme.scroll, state.themeMode]);

  // Apply CSS changes when undo/redo affects the base theme (for immediate visual feedback)
  useEffect(() => {
    const currentColors = state.themeMode === 'dark' ? state.baseTheme.darkColors : state.baseTheme.lightColors;
    applyModeSpecificColors(currentColors);
    // IMPORTANT: Apply scrollbar colors specifically to ensure they work
    applyScrollbarColors(currentColors);
    applyScrollElements(state.baseTheme.scroll);
  }, [state.baseTheme.lightColors, state.baseTheme.darkColors, state.themeMode]);
  
  // Helper actions
  const setTheme = (theme: ThemeData) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };
  
  const setThemeMode = (mode: ThemeMode) => {
    dispatch({ type: 'SET_THEME_MODE', payload: mode });
  };
  
  const updateCurrentModeColors = (colors: import('../types/theme.types').ThemeColors) => {
    dispatch({ 
      type: 'UPDATE_CURRENT_COLORS', 
      payload: { mode: state.themeMode, colors }
    });
    // Apply colors immediately for live preview
    applyModeSpecificColors(colors);
    // SOLUTION 1: Apply scrollbar styling with new colors
    applyScrollbarUtilityClass(state.baseTheme.scroll, {
      scrollbarTrack: colors.scrollbarTrack,
      scrollbarThumb: colors.scrollbarThumb
    });
  };
  
  const setEditorSection = (section: EditorSection) => dispatch({ type: 'SET_EDITOR_SECTION', payload: section });
  const setViewport = (viewport: ViewportSize) => dispatch({ type: 'SET_VIEWPORT', payload: viewport });
  const setPreviewSection = (section: PreviewSection) => dispatch({ type: 'SET_PREVIEW_SECTION', payload: section });
  const setLoading = (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading });
  const setError = (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error });
  const markUnsaved = () => dispatch({ type: 'TOGGLE_UNSAVED_CHANGES', payload: true });
  const markSaved = () => dispatch({ type: 'TOGGLE_UNSAVED_CHANGES', payload: false });
  
  const updateTheme = (theme: ThemeData) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    markUnsaved();
  };
  
  const addTheme = (theme: ThemeData) => {
    dispatch({ type: 'ADD_THEME', payload: theme });
  };

  const removeTheme = (themeId: string) => {
    dispatch({ type: 'REMOVE_THEME', payload: themeId });
  };

  // History functions
  const undo = () => {
    dispatch({ type: 'UNDO' });
  };
  
  const redo = () => {
    dispatch({ type: 'REDO' });
  };
  
  // History state computed from current state
  const canUndoValue = canUndo(state.history);
  const canRedoValue = canRedo(state.history);
  const undoCount = state.history.past.length;
  const redoCount = state.history.future.length;
  
  const value: ThemeEditorContextType = {
    state,
    dispatch,
    setTheme,
    updateTheme,
    setThemeMode,
    updateCurrentModeColors,
    setEditorSection,
    setViewport,
    setPreviewSection,
    setLoading,
    setError,
    markUnsaved,
    markSaved,
    addTheme,
    removeTheme,
    undo,
    redo,
    canUndo: canUndoValue,
    canRedo: canRedoValue,
    undoCount,
    redoCount
  };
  
  return (
    <ThemeEditorContext.Provider value={value}>
      {children}
    </ThemeEditorContext.Provider>
  );
}

// Hook
export function useThemeEditor() {
  const context = useContext(ThemeEditorContext);
  if (context === undefined) {
    throw new Error('useThemeEditor must be used within a ThemeEditorProvider');
  }
  return context;
}