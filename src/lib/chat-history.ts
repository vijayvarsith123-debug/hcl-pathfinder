import { BuddyMood } from "@/components/buddy/BuddyAvatar";

export interface StoredChatMessage {
  id: string;
  userId: string;
  userMessage: string;
  buddyResponse: string;
  intent: string;
  source: "rule_based" | "gemini" | "system";
  mood: BuddyMood;
  timestamp: string;
  action?: any;
  card?: any;
}

const inMemoryHistoryStore: { [userId: string]: StoredChatMessage[] } = {};

export function getChatHistory(userId: string = "default_user"): StoredChatMessage[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`pathai_buddy_history_${userId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to read chat history from localStorage:", e);
    }
  }

  return inMemoryHistoryStore[userId] || [];
}

export function saveChatMessage(
  userId: string = "default_user",
  entry: Omit<StoredChatMessage, "id" | "userId" | "timestamp">
): StoredChatMessage {
  const fullEntry: StoredChatMessage = {
    ...entry,
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    userId,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  if (!inMemoryHistoryStore[userId]) {
    inMemoryHistoryStore[userId] = [];
  }
  inMemoryHistoryStore[userId].push(fullEntry);

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        `pathai_buddy_history_${userId}`,
        JSON.stringify(inMemoryHistoryStore[userId].slice(-50)) // Keep last 50 messages
      );
    } catch (e) {
      console.warn("Failed to persist chat history to localStorage:", e);
    }
  }

  return fullEntry;
}

export function clearChatHistory(userId: string = "default_user") {
  inMemoryHistoryStore[userId] = [];
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(`pathai_buddy_history_${userId}`);
    } catch (e) {
      // ignore
    }
  }
}
