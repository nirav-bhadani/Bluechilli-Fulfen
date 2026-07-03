"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  IoAddOutline,
  IoCloseOutline,
  IoSendOutline,
  IoAttachOutline,
  IoImageOutline,
  IoDocumentAttachOutline,
  IoDocumentTextOutline,
  IoSchoolOutline,
  IoTimeOutline,
  IoShirtOutline,
  IoColorPaletteOutline,
  IoChatbubbleEllipses,
  IoTimeOutline as IoRecent,
  IoArrowBackOutline,
  IoArrowForward,
} from "react-icons/io5";
import type { IconType } from "react-icons";
import { useExperienceStore } from "@/store/useExperienceStore";
import { quickActions, school } from "@/content/fulfen";
import { useChat } from "./useChat";
import { filesToAttachments, type Attachment } from "./attachments";

const ACTION_ICONS: Record<string, IconType> = {
  school: IoSchoolOutline,
  time: IoTimeOutline,
  shirt: IoShirtOutline,
  clubs: IoColorPaletteOutline,
};

export default function Chatbot() {
  const open = useExperienceStore((s) => s.chatOpen);
  const toggleChat = useExperienceStore((s) => s.toggleChat);
  const newChat = useExperienceStore((s) => s.newChat);
  const conversations = useExperienceStore((s) => s.conversations);
  const currentId = useExperienceStore((s) => s.currentId);
  const loadConversation = useExperienceStore((s) => s.loadConversation);
  const { messages, send, loading } = useChat();

  const [input, setInput] = useState("");
  const [attachOpen, setAttachOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showRecent, setShowRecent] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const attachRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggleChat(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, toggleChat]);

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

  const startNewChat = () => {
    newChat();
    setShowRecent(false);
    setInput("");
    setAttachments([]);
  };

  const hasThread = messages.length > 0;
  const lastAssistantEmpty =
    loading &&
    hasThread &&
    messages[messages.length - 1].role === "assistant" &&
    messages[messages.length - 1].content === "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cb-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) toggleChat(false);
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="cb-window"
            role="dialog"
            aria-modal="true"
            aria-label={`${school.name} assistant`}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
          >
            {/* Main (light) */}
            <div className="cb-main">
              <div className="cb-topbar">
                <div className="cb-topbar-title">
                  <button
                    className={`cb-tab ${showRecent ? "" : "on"}`}
                    onClick={() => setShowRecent(false)}
                  >
                    {hasThread ? "Conversation" : "New conversation"}
                  </button>
                  <button
                    className={`cb-tab ${showRecent ? "on" : ""}`}
                    onClick={() => setShowRecent(true)}
                  >
                    <IoRecent /> Recent
                  </button>
                </div>
                <div className="cb-topbar-actions">
                  <button className="cb-newchat-btn" onClick={startNewChat}>
                    <IoAddOutline /> <span>New chat</span>
                  </button>
                  <button
                    className="cb-close"
                    onClick={() => toggleChat(false)}
                    aria-label="Close assistant"
                  >
                    <IoCloseOutline />
                  </button>
                </div>
              </div>

              <div className="cb-body" ref={bodyRef} data-lenis-prevent>
                {showRecent ? (
                  <div className="cb-recent-panel">
                    <h3>Recent conversations</h3>
                    {conversations.filter((c) => c.messages.length > 0).length === 0 ? (
                      <p className="cb-recent-empty">
                        Your past conversations will appear here.
                      </p>
                    ) : (
                      <ul className="cb-recent-list">
                        {conversations
                          .filter((c) => c.messages.length > 0)
                          .map((c) => (
                            <li key={c.id}>
                              <button
                                className={`cb-recent-item ${c.id === currentId ? "on" : ""}`}
                                onClick={() => {
                                  loadConversation(c.id);
                                  setShowRecent(false);
                                }}
                              >
                                <IoChatbubbleEllipses />
                                <span>{c.title}</span>
                                <IoArrowForward className="go" />
                              </button>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                ) : !hasThread ? (
                  <div className="cb-welcome">
                    <div className="cb-bubble-icon">
                      <IoChatbubbleEllipses />
                    </div>
                    <h2>How can I help you today?</h2>
                    <p className="sub">
                      Ask about admissions, the school day, uniform or clubs — or
                      arrange a visit in minutes.
                    </p>
                    <div className="cb-actions">
                      {quickActions.map((a) => {
                        const Icon = ACTION_ICONS[a.icon] ?? IoChatbubbleEllipses;
                        return (
                          <button
                            key={a.label}
                            className="cb-action"
                            onClick={() => send(a.prompt)}
                          >
                            <span className="cb-action-ic">
                              <Icon />
                            </span>
                            {a.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="cb-thread">
                    {messages.map((m, i) => {
                      const isLast = i === messages.length - 1;
                      if (m.role === "assistant" && isLast && lastAssistantEmpty) {
                        return (
                          <div key={i} className="cb-msg bot">
                            <span className="cb-msg-av">
                              <IoChatbubbleEllipses />
                            </span>
                            <span className="cb-typing">
                              <span />
                              <span />
                              <span />
                            </span>
                          </div>
                        );
                      }
                      return (
                        <div key={i} className={`cb-msg ${m.role === "user" ? "user" : "bot"}`}>
                          <span className="cb-msg-av">
                            {m.role === "user" ? "You" : <IoChatbubbleEllipses />}
                          </span>
                          <div className="cb-msg-body">
                            {m.images && m.images.length > 0 && (
                              <div className="cb-msg-imgs">
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

              <div className="cb-composer-wrap">
                {attachments.length > 0 && (
                  <div className="cb-chips">
                    {attachments.map((a) => (
                      <span key={a.id} className={`cb-chip ${a.isImage ? "img" : "file"}`}>
                        {a.isImage ? (
                          <img src={a.dataUrl} alt={a.name} />
                        ) : (
                          <IoDocumentTextOutline />
                        )}
                        <span className="cb-chip-name">{a.name}</span>
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
                <form className="cb-composer" onSubmit={submit}>
                  <div className="cb-attach-wrap" ref={attachRef}>
                    <button
                      type="button"
                      className="cb-attach"
                      aria-label="Attach a file"
                      title="Attach a file"
                      aria-haspopup="menu"
                      aria-expanded={attachOpen}
                      onClick={() => setAttachOpen((v) => !v)}
                    >
                      <IoAttachOutline />
                    </button>
                    {attachOpen && (
                      <div className="cb-attach-menu" role="menu">
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
                    aria-label="Message"
                  />
                  <button
                    type="submit"
                    className="cb-send"
                    disabled={loading || (!input.trim() && attachments.length === 0)}
                    aria-label="Send"
                  >
                    <IoSendOutline />
                  </button>
                </form>
                <p className="cb-disclaimer">
                  Fulfen Assistant can make mistakes. For anything important, please
                  call the office on {school.phone}.
                </p>
              </div>
            </div>

            {/* Sidebar (dark) */}
            <aside className="cb-side">
              <div className="cb-side-brand">
                <img src={school.logo} alt={school.name} />
                <div>
                  <strong>{school.shortName} Assistant</strong>
                  <span className="cb-side-status">
                    <i /> Online now
                  </span>
                </div>
              </div>
              <p className="cb-side-intro">
                I can help with admissions, the school day, uniform, clubs and more.
              </p>

              <p className="cb-side-label">Popular questions</p>
              <ol className="cb-popular">
                {quickActions.map((a, i) => (
                  <li key={a.label}>
                    <button onClick={() => send(a.prompt)}>
                      <span className="cb-popular-no">{i + 1}</span>
                      <span>{a.label}</span>
                    </button>
                  </li>
                ))}
              </ol>

              <a
                className="cb-side-back"
                href={school.website}
                target="_blank"
                rel="noreferrer"
              >
                <IoArrowBackOutline /> Back to {school.website.replace(/^https?:\/\//, "")}
              </a>
              <div className="cb-side-foot">
                {school.name}
                <br />
                {school.phone}
              </div>
            </aside>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
