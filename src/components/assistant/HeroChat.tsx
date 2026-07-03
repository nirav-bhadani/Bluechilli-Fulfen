"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { IconType } from "react-icons";
import {
  IoSendOutline,
  IoAttachOutline,
  IoImageOutline,
  IoDocumentAttachOutline,
  IoChatbubbleEllipses,
  IoSchoolOutline,
  IoTimeOutline,
  IoShirtOutline,
  IoColorPaletteOutline,
  IoCloseOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";
import { quickActions, school } from "@/content/fulfen";
import { useChat } from "./useChat";
import { filesToAttachments, type Attachment } from "./attachments";

const ACTION_ICONS: Record<string, IconType> = {
  school: IoSchoolOutline,
  time: IoTimeOutline,
  shirt: IoShirtOutline,
  clubs: IoColorPaletteOutline,
};

export default function HeroChat() {
  const { messages, send, loading } = useChat();
  const [input, setInput] = useState("");
  const [attachOpen, setAttachOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const attachRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!attachOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (attachRef.current && !attachRef.current.contains(e.target as Node)) {
        setAttachOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [attachOpen]);

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const next = await filesToAttachments(files);
    setAttachments((prev) => [...prev, ...next].slice(0, 4));
  };

  const removeAttachment = (id: string) =>
    setAttachments((prev) => prev.filter((a) => a.id !== id));

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input;
    const images = attachments.filter((a) => a.isImage).map((a) => a.dataUrl);
    if (!text.trim() && images.length === 0) return;
    setInput("");
    setAttachments([]);
    send(text, images);
  };

  const hasThread = messages.length > 0;
  const lastAssistantEmpty =
    loading &&
    hasThread &&
    messages[messages.length - 1].role === "assistant" &&
    messages[messages.length - 1].content === "";

  return (
    <div className="hero-chat">
      <div className="hero-chat-head">
        <img className="hero-chat-avatar" src={school.logo} alt={school.name} />
        <span>
          <strong>Fulfen Assistant</strong>
          <span className="hero-chat-status">
            <i /> Online — ask me anything
          </span>
        </span>
      </div>

      <div className="hero-chat-body" ref={bodyRef} data-lenis-prevent>
        {!hasThread ? (
          <div className="hero-chat-welcome">
            <div className="hero-chat-titlebubble">How can I help you today?</div>
            <p className="hero-chat-welcome-sub">
              Ask about admissions, the school day, uniform or clubs.
            </p>
            <div className="hero-chat-cards">
              {quickActions.map((a) => {
                const Icon = ACTION_ICONS[a.icon] ?? IoChatbubbleEllipses;
                return (
                  <button
                    key={a.label}
                    className="hero-chat-card"
                    onClick={() => send(a.prompt)}
                  >
                    <span className="hero-chat-card-ic">
                      <Icon />
                    </span>
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="hero-chat-thread">
            {messages.map((m, i) => {
              const isLast = i === messages.length - 1;
              if (m.role === "assistant" && isLast && lastAssistantEmpty) {
                return (
                  <div key={i} className="hc-msg bot">
                    <span className="hc-typing">
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                );
              }
              return (
                <div key={i} className={`hc-msg ${m.role === "user" ? "user" : "bot"}`}>
                  <div className="hc-msg-body">
                    {m.images && m.images.length > 0 && (
                      <div className="hc-msg-imgs">
                        {m.images.map((src, k) => (
                          <img key={k} src={src} alt="Attachment" />
                        ))}
                      </div>
                    )}
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {attachments.length > 0 && (
        <div className="hero-chat-chips">
          {attachments.map((a) => (
            <span key={a.id} className={`hc-chip ${a.isImage ? "img" : "file"}`}>
              {a.isImage ? (
                <img src={a.dataUrl} alt={a.name} />
              ) : (
                <IoDocumentTextOutline />
              )}
              <span className="hc-chip-name">{a.name}</span>
              <button
                type="button"
                aria-label={`Remove ${a.name}`}
                onClick={() => removeAttachment(a.id)}
              >
                <IoCloseOutline />
              </button>
            </span>
          ))}
        </div>
      )}
      <form className="hero-chat-form" onSubmit={submit}>
        <div className="hero-chat-attach-wrap" ref={attachRef}>
          <button
            type="button"
            className="hero-chat-attach"
            aria-label="Attach a file"
            title="Attach a file"
            aria-haspopup="menu"
            aria-expanded={attachOpen}
            onClick={() => setAttachOpen((v) => !v)}
          >
            <IoAttachOutline />
          </button>
          {attachOpen && (
            <div className="hero-chat-attach-menu" role="menu">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  photoInputRef.current?.click();
                  setAttachOpen(false);
                }}
              >
                <IoImageOutline /> Add photos
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  fileInputRef.current?.click();
                  setAttachOpen(false);
                }}
              >
                <IoDocumentAttachOutline /> Add files
              </button>
            </div>
          )}
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              onFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            onChange={(e) => {
              onFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          aria-label="Ask the Fulfen Assistant"
        />
        <button
          type="submit"
          disabled={loading || (!input.trim() && attachments.length === 0)}
          aria-label="Send"
        >
          <IoSendOutline />
        </button>
      </form>
      <p className="hero-chat-disclaimer">
        Fulfen Assistant can make mistakes. For anything important, call {school.phone}.
      </p>
    </div>
  );
}
