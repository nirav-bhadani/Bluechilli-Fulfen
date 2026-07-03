import { NextRequest } from "next/server";
import { buildSystemPrompt } from "@/content/fulfen";

export const runtime = "edge";

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
  images?: string[];
}

const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "deepseek/deepseek-v4-flash";
const FALLBACK_MODEL = "openai/gpt-5.4-mini";
const VISION_MODEL = process.env.OPENROUTER_VISION_MODEL || "openai/gpt-4o-mini";
const ALLOWED_MODELS = new Set([DEFAULT_MODEL, FALLBACK_MODEL, "openai/gpt-5.4-mini", "deepseek/deepseek-v4-flash"]);
const MAX_IMAGES = 4;

type TextPart = { type: "text"; text: string };
type ImagePart = { type: "image_url"; image_url: { url: string } };
type OutgoingMessage =
  | { role: "system" | "assistant" | "user"; content: string }
  | { role: "user"; content: (TextPart | ImagePart)[] };

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(
      "The assistant isn't configured yet. Please add an OPENROUTER_API_KEY.",
      { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  let body: { messages?: IncomingMessage[]; model?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid request.", { status: 400 });
  }

  const history = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
  const hasImages = history.some(
    (m) => m.role === "user" && Array.isArray(m.images) && m.images.length > 0,
  );
  const model = hasImages
    ? VISION_MODEL
    : body.model && ALLOWED_MODELS.has(body.model)
      ? body.model
      : DEFAULT_MODEL;

  const chatMessages: OutgoingMessage[] = history.map((m) => {
    const text = String(m.content).slice(0, 4000);
    const imgs = Array.isArray(m.images)
      ? m.images.filter((u) => typeof u === "string" && u.startsWith("data:image")).slice(0, MAX_IMAGES)
      : [];
    if (m.role === "user" && imgs.length > 0) {
      return {
        role: "user",
        content: [
          { type: "text", text: text || "Please describe / help with this image." },
          ...imgs.map((url) => ({ type: "image_url" as const, image_url: { url } })),
        ],
      };
    }
    return { role: m.role, content: text };
  });

  const payload = {
    model,
    stream: true,
    temperature: 0.6,
    max_tokens: 700,
    messages: [
      { role: "system" as const, content: buildSystemPrompt() },
      ...chatMessages,
    ],
  };

  const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://www.fulfen.staffs.sch.uk",
      "X-Title": "Fulfen Primary School Assistant",
    },
    body: JSON.stringify(payload),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    return new Response(
      `Sorry, I couldn't reach the assistant right now. Please try again or call the office on 01543 226070.${
        detail ? `\n\n(${detail.slice(0, 200)})` : ""
      }`,
      { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  // Transform OpenRouter SSE into a plain-text token stream for the client.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      let buffer = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const token = json.choices?.[0]?.delta?.content;
              if (token) controller.enqueue(encoder.encode(token));
            } catch {
              // Ignore keep-alive / partial lines.
            }
          }
        }
      } catch {
        // Upstream closed unexpectedly.
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
