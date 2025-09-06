/**
 * Custom Icon Library
 * Essential icons for the Theme Editor system - Optimized for Next.js bundling
 */

import {
  // Core Navigation (10 icons)
  ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Home, Menu,
  
  // Basic Actions (10 icons) 
  X, Plus, Minus, Check, Search, Settings, Edit, Save, Copy, Trash2,
  
  // User & Auth (10 icons)
  User, Users, LogIn, LogOut, Lock, Unlock, Shield, Key, Mail, Bell,
  
  // Status & Feedback (10 icons)
  AlertCircle, AlertTriangle, Info, CheckCircle, XCircle, 
  Loader2, Clock, Star, Heart, Eye,
  
  // Media & Controls (10 icons)
  Play, Pause, Volume2, Image, Camera, Video, Mic, Share, Download, Upload,
  
  // Files & Data (10 icons)
  File, FileText, Folder, Database, Package, Grid, Layout, BarChart, Activity, Layers,
  
  // UI Elements (10 icons)
  MoreHorizontal, MoreVertical, Maximize2, Move, Filter, Sliders, Palette, Code, 
  Calendar, Globe,
  
  // Extended Set (20 icons)
  Sun, Moon, Cloud, Zap, Battery, Wifi, Signal, Phone, Send, Target,
  Building, MapPin, ShoppingCart, CreditCard, Gift, Award, Flag, Bookmark,
  Hash, AtSign
} from 'lucide-react';

// Core system icons (80 total)
export const SystemIcons = {
  // Navigation & Arrows (10)
  ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Home, Menu,
  
  // Basic Actions (10)
  X, Plus, Minus, Check, Search, Settings, Edit, Save, Copy, Trash2,
  
  // User & Auth (10)
  User, Users, LogIn, LogOut, Lock, Unlock, Shield, Key, Mail, Bell,
  
  // Status & Feedback (10)
  AlertCircle, AlertTriangle, Info, CheckCircle, XCircle,
  Loader2, Clock, Star, Heart, Eye,
  
  // Media & Controls (10)
  Play, Pause, Volume2, Image, Camera, Video, Mic, Share, Download, Upload,
  
  // Files & Data (10)
  File, FileText, Folder, Database, Package, Grid, Layout, BarChart, Activity, Layers,
  
  // UI Elements (10)
  MoreHorizontal, MoreVertical, Maximize2, Move, Filter, Sliders, Palette, Code,
  Calendar, Globe,
  
  // Extended Set (10)
  Sun, Moon, Cloud, Zap, Battery, Wifi, Signal, Phone, Send, Target,
  Building, MapPin, ShoppingCart, CreditCard, Gift, Award, Flag, Bookmark, Hash, AtSign
} as const;

// Icon categories
export const IconCategories = {
  navigation: ['ChevronRight', 'ChevronLeft', 'ChevronUp', 'ChevronDown', 'Home', 'Menu'],
  actions: ['Plus', 'Minus', 'Check', 'X', 'Search', 'Edit', 'Save', 'Copy'],  
  user: ['User', 'Users', 'LogIn', 'LogOut', 'Lock', 'Shield', 'Key'],
  status: ['AlertCircle', 'AlertTriangle', 'Info', 'CheckCircle', 'Loader2'],
  media: ['Play', 'Pause', 'Volume2', 'Image', 'Camera', 'Video'],
  files: ['File', 'FileText', 'Folder', 'Database', 'Package'],
  ui: ['Grid', 'Layout', 'Layers', 'Palette', 'Sliders', 'Settings']
} as const;

// Get icon by name utility
export function getIconByName(name: string) {
  return SystemIcons[name as keyof typeof SystemIcons];
}

// Export type for icon names
export type IconName = keyof typeof SystemIcons;