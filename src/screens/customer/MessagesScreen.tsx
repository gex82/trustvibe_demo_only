import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Send, FolderOpen } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { INITIAL_THREADS } from "../../data/messages";
import { findUserById } from "../../data/users";
import type { Message, MessageThread } from "../../types";
import TopBar from "../../components/layout/TopBar";
import Avatar from "../../components/ui/Avatar";
import { formatTime } from "../../utils/formatters";

export default function MessagesScreen() {
  const { currentUser } = useAuth();
  const { t } = useApp();
  const [threads, setThreads] = useState<MessageThread[]>(INITIAL_THREADS);
  const [activeThread, setActiveThread] = useState<MessageThread | null>(threads[0] ?? null);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread?.messages.length]);

  const sendMessage = () => {
    if (!input.trim() || !activeThread || !currentUser) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      threadId: activeThread.id,
      senderId: currentUser.id,
      text: input.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    };
    setThreads((prev) =>
      prev.map((th) =>
        th.id === activeThread.id
          ? { ...th, messages: [...th.messages, newMsg] }
          : th
      )
    );
    setActiveThread((prev) =>
      prev ? { ...prev, messages: [...prev.messages, newMsg] } : null
    );
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!activeThread) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <TopBar title={t("nav.messages")} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <FolderOpen size={36} className="text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No messages yet</p>
          <p className="text-gray-400 text-sm mt-1">Accept a quote to start chatting with your contractor.</p>
        </div>
      </div>
    );
  }

  const otherUserId = activeThread.participants.find((p) => p !== currentUser?.id);
  const otherUser = findUserById(otherUserId ?? "");

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-teal-600 pressable"
          style={{ display: "none" }}
        />
        {otherUser && <Avatar src={otherUser.avatarUrl} name={otherUser.name} size="sm" />}
        <div>
          <p className="font-bold text-gray-900 text-[14px]">
            {otherUser?.role === "contractor"
              ? (otherUser as any).businessName ?? otherUser.name
              : otherUser?.name}
          </p>
          <p className="text-gray-400 text-[11px] truncate max-w-[200px]">
            {activeThread.projectTitle}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
        {activeThread.messages.map((msg, i) => {
          const isMe = msg.senderId === currentUser?.id;
          const showAvatar =
            !isMe &&
            (i === 0 || activeThread.messages[i - 1]?.senderId !== msg.senderId);

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
            >
              {!isMe && (
                <div className="w-7 flex-shrink-0">
                  {showAvatar && otherUser && (
                    <Avatar src={otherUser.avatarUrl} name={otherUser.name} size="xs" />
                  )}
                </div>
              )}
              <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                    isMe
                      ? "bg-teal-600 text-white rounded-br-sm"
                      : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-gray-400 mt-1 px-1">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-3 py-3 flex items-end gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={t("msg.placeholder")}
          className="flex-1 bg-gray-100 rounded-2xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="w-9 h-9 bg-teal-600 rounded-full flex items-center justify-center pressable disabled:opacity-40"
        >
          <Send size={15} className="text-white" />
        </button>
      </div>
    </div>
  );
}
