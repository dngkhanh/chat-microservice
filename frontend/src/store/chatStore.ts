import { create } from 'zustand'
import type { Conversation, Message } from '@/services/chatService'

interface ChatState {
  conversations: Conversation[]
  selectedConversation: Conversation | null
  messages: Message[]
  setConversations: (conversations: Conversation[]) => void
  addConversation: (conversation: Conversation) => void
  selectConversation: (conversation: Conversation | null) => void
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  updateConversationLastMessage: (conversationId: string, message: Message) => void
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  selectedConversation: null,
  messages: [],

  setConversations: (conversations) => set({ conversations }),

  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),

  selectConversation: (conversation) =>
    set({ selectedConversation: conversation, messages: [] }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateConversationLastMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: {
                content: message.content,
                createdAt: message.createdAt,
                sender: message.sender,
              },
            }
          : conv
      ),
    })),
}))
