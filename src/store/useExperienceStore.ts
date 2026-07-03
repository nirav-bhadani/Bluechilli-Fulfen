"use client";

import { create } from "zustand";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  images?: string[];
}

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

interface ExperienceState {
  chatOpen: boolean;
  toggleChat: (open?: boolean) => void;
  messages: ChatMessage[];
  addMessage: (m: ChatMessage) => void;
  updateLastAssistant: (content: string) => void;
  conversations: Conversation[];
  currentId: string;
  newChat: () => void;
  loadConversation: (id: string) => void;
  clearChat: () => void;
}

const STORAGE_KEY = "fulfen-chat-conversations";

function makeId() {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function titleFrom(messages: ChatMessage[]) {
  const firstUser = messages.find((m) => m.role === "user")?.content?.trim();
  if (!firstUser) return "New chat";
  return firstUser.length > 48 ? `${firstUser.slice(0, 48)}…` : firstUser;
}

// Persisted copy strips base64 image payloads to keep localStorage small.
function stripImages(messages: ChatMessage[]): ChatMessage[] {
  return messages.map(({ role, content }) => ({ role, content }));
}

function loadStored(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Conversation[]) : [];
  } catch {
    return [];
  }
}

function persist(conversations: Conversation[]) {
  if (typeof window === "undefined") return;
  try {
    const slim = conversations
      .filter((c) => c.messages.length > 0)
      .slice(0, 30)
      .map((c) => ({ ...c, messages: stripImages(c.messages) }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slim));
  } catch {
    // Storage full or unavailable — history is best-effort only.
  }
}

// Upsert the live thread into the conversation list.
function syncActive(
  conversations: Conversation[],
  currentId: string,
  messages: ChatMessage[],
): Conversation[] {
  if (messages.length === 0) return conversations;
  const entry: Conversation = {
    id: currentId,
    title: titleFrom(messages),
    messages,
    updatedAt: Date.now(),
  };
  const rest = conversations.filter((c) => c.id !== currentId);
  return [entry, ...rest];
}

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  chatOpen: false,
  toggleChat: (open) => set((s) => ({ chatOpen: open ?? !s.chatOpen })),
  messages: [],
  conversations: loadStored(),
  currentId: makeId(),

  addMessage: (m) =>
    set((s) => {
      const messages = [...s.messages, m];
      const conversations = syncActive(s.conversations, s.currentId, messages);
      persist(conversations);
      return { messages, conversations };
    }),

  updateLastAssistant: (content) =>
    set((s) => {
      const msgs = s.messages.slice();
      for (let i = msgs.length - 1; i >= 0; i--) {
        if (msgs[i].role === "assistant") {
          msgs[i] = { ...msgs[i], content };
          break;
        }
      }
      // Update in-memory conversation snapshot without writing to storage on
      // every streamed token; the next addMessage / newChat call persists it.
      const conversations = syncActive(s.conversations, s.currentId, msgs);
      return { messages: msgs, conversations };
    }),

  newChat: () =>
    set((s) => {
      const conversations = syncActive(s.conversations, s.currentId, s.messages);
      persist(conversations);
      return { messages: [], currentId: makeId(), conversations };
    }),

  loadConversation: (id) =>
    set((s) => {
      const conversations = syncActive(s.conversations, s.currentId, s.messages);
      const target = conversations.find((c) => c.id === id);
      persist(conversations);
      if (!target) return { conversations };
      return {
        conversations,
        messages: target.messages.slice(),
        currentId: id,
      };
    }),

  clearChat: () => get().newChat(),
}));

export type { ChatMessage, Conversation };
