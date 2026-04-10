"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Avatar } from "./avatar";
import { CURRENT_USER } from "@/lib/constants";

interface ReplyComposerProps {
  onSubmit: (text: string) => void;
  onCancel: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function ReplyComposer({
  onSubmit,
  onCancel,
  placeholder = "Write a reply\u2026",
  autoFocus = true,
}: ReplyComposerProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
      setText("");
    }
  };

  return (
    <div
      className="mt-3 flex gap-2.5 items-start"
      style={{ animation: "comment-enter 0.25s cubic-bezier(0, 0, 0, 1) both" }}
    >
      <div className="shrink-0 mt-1">
        <Avatar initials="" bg="" src={CURRENT_USER.avatarUrl} size={24} />
      </div>
      <div className="flex-1 rounded-xl bg-bg-elevated/60 border border-bg-overlay focus-within:border-accent-secondary/40 transition-colors">
        <textarea
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); handleSubmit(); }
            if (e.key === "Escape") onCancel();
          }}
          placeholder={placeholder}
          rows={2}
          className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted px-3 pt-2.5 pb-1 resize-none outline-none focus-visible:outline-none"
        />
        <div className="flex items-center justify-between px-3 pb-2">
          <span className="text-[10px] text-text-muted">
            {text.length > 0 ? `${text.length} chars` : "Cmd+Enter to send"}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="text-[11px] text-text-muted hover:text-text-secondary transition-colors px-2 py-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!text.trim()}
              className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-accent-secondary text-white disabled:opacity-30 hover:bg-accent-secondary/80 transition-all"
            >
              <Send size={10} />
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
