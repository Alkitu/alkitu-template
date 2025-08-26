// Theme Editor 3.0 - Actions Bar Types
import { ThemeData, ThemeMode } from './theme.types';
import { ViewportSize } from './viewport.types';

/**
 * Tipos específicos para Actions Bar
 * Elimina el uso de 'any' en handlers y estados
 */

// Import/Export handlers
export type ThemeImportHandler = (theme: ThemeData) => void;
export type ThemeImportErrorHandler = (error: string) => void;
export type ThemeSaveHandler = (theme: ThemeData) => void;

// History handlers
export type UndoHandler = () => void;
export type RedoHandler = () => void;
export type ResetHandler = () => void;

// Viewport handlers
export type ViewportChangeHandler = (viewport: ViewportSize) => void;
export type ThemeModeChangeHandler = (mode: ThemeMode) => void;

// History state interface
export interface HistoryState {
  canUndo: boolean;
  canRedo: boolean;
  undoCount: number;
  redoCount: number;
}

// Actions Bar logic return type
export interface ActionsBarLogic {
  // State
  state: {
    currentTheme: ThemeData;
    themeMode: ThemeMode;
    viewport: { current: ViewportSize };
    editor: { hasUnsavedChanges: boolean };
  };
  currentTheme: ThemeData;
  historyState: HistoryState;
  
  // Setters
  setViewport: ViewportChangeHandler;
  setThemeMode: ThemeModeChangeHandler;
  
  // Handlers
  handleUndo: UndoHandler;
  handleRedo: RedoHandler;
  handleImport: ThemeImportHandler;
  handleImportError: ThemeImportErrorHandler;
  handleSave: ThemeSaveHandler;
  handleReset: ResetHandler;
}

// Component Props
export interface ActionsBarProps {
  className?: string;
}