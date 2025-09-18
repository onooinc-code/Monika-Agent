import React, { useState, useRef } from "react";
import { Attachment } from "../types/index.ts";
import { useAppContext } from "../contexts/StateProvider.tsx";

// Icons from user's code
const AttachmentIconV2 = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    viewBox="0 0 24 24"
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 8v8a5 5 0 1 0 10 0V6.5a3.5 3.5 0 1 0-7 0V15a2 2 0 0 0 4 0V8"
    />
  </svg>
);
const GridIcon = () => (
  <svg
    viewBox="0 0 24 24"
    height={20}
    width={20}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm0 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm0-8h6m-3-3v6"
      strokeWidth={2}
      strokeLinejoin="round"
      strokeLinecap="round"
      stroke="currentColor"
      fill="none"
    />
  </svg>
);
const GlobeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    height={20}
    width={20}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m-2.29-2.333A17.9 17.9 0 0 1 8.027 13H4.062a8.01 8.01 0 0 0 5.648 6.667M10.03 13c.151 2.439.848 4.73 1.97 6.752A15.9 15.9 0 0 0 13.97 13zm9.908 0h-3.965a17.9 17.9 0 0 1-1.683 6.667A8.01 8.01 0 0 0 19.938 13M4.062 11h3.965A17.9 17.9 0 0 1 9.71 4.333A8.01 8.01 0 0 0 4.062 11m5.969 0h3.938A15.9 15.9 0 0 0 12 4.248A15.9 15.9 0 0 0 10.03 11m4.259-6.667A17.9 17.9 0 0 1 15.973 11h3.965a8.01 8.01 0 0 0-5.648-6.667"
      fill="currentColor"
    />
  </svg>
);
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
    <footer className="glass-pane rounded-2xl flex flex-col items-center">
      {error && (
        <p className="text-red-400 text-sm text-center mb-2">{error}</p>
      )}
      <div className="w-full max-w-full">
        <div className="relative p-0.5 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-900">
          <div className="bg-black/50 rounded-[15px] flex flex-col">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Imagine Something...✦˚"
              className="w-full bg-transparent text-white placeholder-gray-300 focus:placeholder-gray-700 transition-colors duration-300 focus:outline-none resize-none p-3 text-sm min-h-[50px] max-h-40"
              disabled={isLoading}
            />
            <div className="flex justify-between items-end p-2.5">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="file-input-v2"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-700 hover:text-white hover:-translate-y-1 transition-all"
                  title="Attach an image"
                >
                  <AttachmentIconV2 />
                </button>
                <button
                  className="text-gray-700 hover:text-white hover:-translate-y-1 transition-all"
                  title="Add template"
                >
                  <GridIcon />
                </button>
                <button
                  className="text-gray-700 hover:text-white hover:-translate-y-1 transition-all"
                  title="Browse web"
                >
                  <GlobeIcon />
                </button>
              </div>
              <button
                onClick={handleSend}
                className="p-0.5 bg-gradient-to-t from-gray-800 via-gray-600 to-gray-800 rounded-lg submit-btn-shadow active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={(!text.trim() && !attachment) || isLoading}
                aria-label="Send message"
              >
                <div className="w-8 h-8 p-1.5 rounded-[7px] submit-btn-icon-wrapper">
                  <div className="text-gray-500 submit-btn-svg transition-all duration-300 focus:text-white">
                    <SendIconV2 />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
