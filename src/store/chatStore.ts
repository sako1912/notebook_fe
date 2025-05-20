import { create } from "zustand";

export interface Message {
  id: number;
  content: string;
  timestamp: string;
  role: "human" | "ai";
}

export interface Chat {
  uuid: string;
  messages: Message[];
}

export interface ChatHistory {
  uuid: string;
  firstMessage: Message | null;
}

interface ChatStore {
  currentUuid: string | null;
  chats: Record<string, Chat>;
  chatHistories: ChatHistory[];
  isLoading: boolean;
  createNewChat: () => Promise<void>;
  selectChat: (uuid: string) => Promise<void>;
  addMessage: (content: string, role: Message["role"]) => Promise<void>;
  setLoading: (loading: boolean) => void;
  fetchChatHistories: () => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  currentUuid: null,
  chats: {},
  chatHistories: [],
  isLoading: false,

  createNewChat: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/chats", {
        method: "POST",
      });
      const newChat = (await response.json()) as ChatHistory;

      set((state) => ({
        currentUuid: newChat.uuid,
        chatHistories: [newChat, ...state.chatHistories],
        chats: {
          ...state.chats,
          [newChat.uuid]: { uuid: newChat.uuid, messages: [] },
        },
      }));
    } catch (error) {
      console.error("Failed to create new chat:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  selectChat: async (uuid) => {
    const { chats } = get();
    set({ currentUuid: uuid });

    // 메시지가 없는 경우에만 해당 채팅방의 메시지를 가져옴
    if (!chats[uuid]?.messages.length) {
      try {
        set({ isLoading: true });
        const response = await fetch(`/api/chats/${uuid}`);
        const chat = (await response.json()) as Chat;

        set((state) => ({
          chats: {
            ...state.chats,
            [uuid]: chat,
          },
        }));
      } catch (error) {
        console.error("Failed to fetch chat:", error);
      } finally {
        set({ isLoading: false });
      }
    }
  },

  addMessage: async (content, role) => {
    const { currentUuid, chats } = get();
    if (!currentUuid) return;

    try {
      set({ isLoading: true });

      const response = await fetch(`/api/chats/${currentUuid}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, role }),
      });

      const updatedChat = (await response.json()) as Chat;
      const firstMessage = updatedChat.messages[0] || null;

      set((state) => ({
        chats: {
          ...state.chats,
          [currentUuid]: updatedChat,
        },
        chatHistories: state.chatHistories.map((chat) =>
          chat.uuid === currentUuid ? { ...chat, firstMessage } : chat
        ),
      }));
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchChatHistories: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/chats");
      const chatHistories = (await response.json()) as ChatHistory[];
      set({ chatHistories });
    } catch (error) {
      console.error("Failed to fetch chat histories:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));
