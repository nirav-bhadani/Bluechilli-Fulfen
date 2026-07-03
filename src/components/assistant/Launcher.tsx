"use client";

import { IoChatbubbleEllipses } from "react-icons/io5";
import { useExperienceStore } from "@/store/useExperienceStore";

export default function Launcher() {
  const open = useExperienceStore((s) => s.chatOpen);
  const toggleChat = useExperienceStore((s) => s.toggleChat);

  if (open) return null;

  return (
    <button className="launcher" onClick={() => toggleChat(true)} aria-label="Open Fulfen Assistant">
      <span className="launcher-icon">
        <IoChatbubbleEllipses />
      </span>
      Ask Fulfen
    </button>
  );
}
