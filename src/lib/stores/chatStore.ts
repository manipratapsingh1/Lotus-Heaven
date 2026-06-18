import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isTyping: boolean;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  setIsOpen: (open: boolean) => void;
  setIsTyping: (typing: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your Hotel Concierge. How can I assist you today?',
      timestamp: new Date(),
    },
  ],
  isOpen: false,
  isTyping: false,
  addMessage: (role, content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now().toString(),
          role,
          content,
          timestamp: new Date(),
        },
      ],
    })),
  setIsOpen: (open) => set({ isOpen: open }),
  setIsTyping: (typing) => set({ isTyping: typing }),
  clearMessages: () =>
    set({
      messages: [
        {
          id: '1',
          role: 'assistant',
          content: 'Hello! I\'m your Hotel Concierge. How can I assist you today?',
          timestamp: new Date(),
        },
      ],
    }),
}));
