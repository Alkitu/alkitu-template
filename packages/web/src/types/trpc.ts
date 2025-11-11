// AppRouter type inference from backend
// Nota: Este tipo debe coincidir exactamente con el AppRouter del backend

export interface AppRouter {
  hello: {
    input: { name: string };
    output: { greeting: string };
  };
  chat: {
    getConversations: any;
    startConversation: any;
    sendMessage: any;
    getMessages: any;
    assignConversation: any;
    updateStatus: any;
    replyToMessage: any;
    addInternalNote: any;
    markAsRead: any;
    getChatAnalytics: any;
  };
  notification: any;
  billing: any;
  user: any;
  chatbotConfig: any;
  theme: any;
  company: any;
}

// Utility types for tRPC
export interface HelloInput {
  name: string;
}

export interface HelloOutput {
  greeting: string;
}
