"use client";

import { useCallback, useRef, useState } from "react";
import { useExperienceStore } from "@/store/useExperienceStore";

export function useChat() {
  const messages = useExperienceStore((s) => s.messages);
  const addMessage = useExperienceStore((s) => s.addMessage);
  const updateLastAssistant = useExperienceStore((s) => s.updateLastAssistant);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (text: string, images?: string[]) => {
      const content = text.trim();
      const imgs = (images ?? []).filter(Boolean);
      if ((!content && imgs.length === 0) || loading) return;

      const userMsg = {
        role: "user" as const,
        content: content || "(sent an image)",
        ...(imgs.length ? { images: imgs } : {}),
      };

      const history = [...useExperienceStore.getState().messages, userMsg];

      addMessage(userMsg);
      addMessage({ role: "assistant", content: "" });
      setLoading(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });

        if (!res.body) {
          updateLastAssistant(
            "Sorry, I couldn't respond just now. Please call the office on 01543 226070.",
          );
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          updateLastAssistant(acc);
        }
        if (!acc.trim()) {
          updateLastAssistant("I'm not sure about that one — the office can help on 01543 226070.");
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          updateLastAssistant(
            "Something went wrong reaching the assistant. Please try again shortly.",
          );
        }
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [addMessage, updateLastAssistant, loading],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setLoading(false);
  }, []);

  return { messages, send, stop, loading };
}
