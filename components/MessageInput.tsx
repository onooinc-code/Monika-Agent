import React, { useState, useRef } from "react";
import { Attachment } from "../types/index.ts";
import { useAppContext } from "../contexts/StateProvider.tsx";
import { ActionToolbar } from "./ActionToolbar.tsx";

const SendIconV2 = () => (
  <svg viewBox="0 0 512 512">
    <path
      fill="currentColor"
      d="M473 39.05a24 24 0 0 0-25.5-5.46L47.47 185h-.08a24 24 0 0 0 1 45.16l.41.13l137.3 58.63a16 16 0 0 0 15.54-3.59L422 80a7.07 7.07 0 0 1 10 10L226.66 310.26a16 16 0 0 0-3.59 15.54l58.65 137.38c.06.2.12.38.19.57c3.2 9.27 11.3 15.81 21.09 16.25h1a24.63 24.63 0 0 0 23-15.46L478.39 64.62A24 24 0 0 0 473 39.05"
    />
  </svg>
);

const MAX_FILE_SIZE_MB = 4;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const MessageInput: React.FC = () => {
  const { handleSendMessage, isLoading, sendOnEnter } = useAppContext();
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`File size exceeds ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Only image files are supported.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(",")[1];
        setAttachment({ base64: base64String, mimeType: file.type });
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    if (!text.trim() && !attachment) return;
    handleSendMessage(text, attachment || undefined);
    setText("");
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (sendOnEnter) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    } else {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  return (
    <footer className="flex flex-col w-full">
      {error && (
        <p className="text-red-400 text-sm text-center mb-2">{error}</p>
      )}
      <div className="w-full flex flex-col">
        <div className="message-input-wrapper">
          <div className="message-input-inner flex flex-col">
            <div className="relative flex">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Imagine Something...✦˚"
                className="message-input-textarea min-h-[15px] max-h-12 p-1"
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-between items-end p-1">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="file-input-v2"
                  data-testid="file-input-v2"
                />
                <ActionToolbar
                  onAttachClick={() => fileInputRef.current?.click()}
                />
              </div>
              <button
                onClick={handleSend}
                className="message-input-submit-btn active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={(!text.trim() && !attachment) || isLoading}
                aria-label="Send message"
              >
                <i>
                  <SendIconV2 />
                </i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
