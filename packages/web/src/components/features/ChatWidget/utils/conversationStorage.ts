/**
 * Chat Conversation Persistence Utilities
 * Manages localStorage for resuming conversations
 */

export interface StoredConversation {
  conversationId: string;
  lastMessage: string;
  timestamp: Date;
  status: 'active' | 'closed';
  unreadCount: number;
  contactInfo?: {
    name?: string;
    email?: string;
  };
}

const STORAGE_KEY = 'chat_conversations';
const ACTIVE_CONVERSATION_KEY = 'active_conversation_id';

/**
 * Get all stored conversations
 */
export function getStoredConversations(): StoredConversation[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const conversations = JSON.parse(stored) as StoredConversation[];
    // Convert timestamp strings back to Date objects
    return conversations.map(conv => ({
      ...conv,
      timestamp: new Date(conv.timestamp),
    }));
  } catch (error) {
    console.error('Error reading stored conversations:', error);
    return [];
  }
}

/**
 * Save a conversation to localStorage
 */
export function saveConversation(conversation: StoredConversation): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getStoredConversations();
    const index = existing.findIndex(c => c.conversationId === conversation.conversationId);
    
    if (index >= 0) {
      existing[index] = conversation;
    } else {
      existing.unshift(conversation); // Add to beginning
    }
    
    // Keep only last 10 conversations
    const limited = existing.slice(0, 10);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Error saving conversation:', error);
  }
}

/**
 * Get active conversation ID
 */
export function getActiveConversationId(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(ACTIVE_CONVERSATION_KEY);
  } catch (error) {
    return null;
  }
}

/**
 * Set active conversation ID
 */
export function setActiveConversationId(conversationId: string | null): void {
  if (typeof window === 'undefined') return;
  
  try {
    if (conversationId) {
      localStorage.setItem(ACTIVE_CONVERSATION_KEY, conversationId);
    } else {
      localStorage.removeItem(ACTIVE_CONVERSATION_KEY);
    }
  } catch (error) {
    console.error('Error setting active conversation:', error);
  }
}

/**
 * Clear all stored conversations
 */
export function clearStoredConversations(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_CONVERSATION_KEY);
  } catch (error) {
    console.error('Error clearing conversations:', error);
  }
}

/**
 * Mark conversation as closed
 */
export function closeConversation(conversationId: string): void {
  const conversations = getStoredConversations();
  const conversation = conversations.find(c => c.conversationId === conversationId);
  
  if (conversation) {
    conversation.status = 'closed';
    saveConversation(conversation);
    
    // Clear active if it's the current one
    if (getActiveConversationId() === conversationId) {
      setActiveConversationId(null);
    }
  }
}
