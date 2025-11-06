'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ThemeData, ThemeWithCurrentColors, ThemeMode, EditorState, EditorSection, ViewportState, ViewportSize, PreviewState, PreviewSection } from '../types';
import { DEFAULT_THEME, DEFAULT_THEMES } from '../constants/default-themes';
import { applyThemeToRoot, applyThemeMode, applyModeSpecificColors, applyTypographyElements } from '../utils/css-variables';
import { applyScrollbarStyles } from '../utils/scrollbar-styles';
import { DEFAULT_TYPOGRAPHY } from '../3-theme-editor/typography/types';

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

// Initial state
const initialState: ThemeEditorState = {
  baseTheme: DEFAULT_THEME,
  currentTheme: computeCurrentTheme(DEFAULT_THEME, 'light'),
  availableThemes: DEFAULT_THEMES,
  themeMode: 'light',
  history: createInitialHistoryState(DEFAULT_THEME, 'light'),
  editor: {
    activeSection: 'colors',
    isEditing: false,
    hasUnsavedChanges: false
  },
  viewport: {
    current: 'desktop',
    isResponsive: true
  },
  preview: {
    activeSection: 'colors',
    isFullscreen: false,
    showGrid: false,
    showRuler: false
  },
  isLoading: false,
  error: null
};

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
      return {
        ...state,
        editor: { ...state.editor, activeSection: action.payload }
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
}

export function ThemeEditorProvider({ children }: ThemeEditorProviderProps) {
  const [state, dispatch] = useReducer(themeEditorReducer, initialState);
  
  // Apply initial theme and mode on load
  useEffect(() => {
    const initialColors = state.themeMode === 'dark' ? DEFAULT_THEME.darkColors : DEFAULT_THEME.lightColors;
    applyModeSpecificColors(initialColors);
    applyThemeMode(state.themeMode);
    applyScrollbarStyles();
    // Apply default typography elements so Preview works immediately
    applyTypographyElements(DEFAULT_TYPOGRAPHY);
  }, []);
  
  // Apply colors and mode when theme mode changes
  useEffect(() => {
    const currentColors = state.themeMode === 'dark' ? state.baseTheme.darkColors : state.baseTheme.lightColors;
    applyModeSpecificColors(currentColors);
    applyThemeMode(state.themeMode);
    applyScrollbarStyles();
  }, [state.themeMode, state.baseTheme]);

  // Apply CSS changes when undo/redo affects the base theme (for immediate visual feedback)
  useEffect(() => {
    const currentColors = state.themeMode === 'dark' ? state.baseTheme.darkColors : state.baseTheme.lightColors;
    applyModeSpecificColors(currentColors);
    applyScrollbarStyles();
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
    applyScrollbarStyles();
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