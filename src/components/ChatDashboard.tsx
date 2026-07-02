import { useState, useEffect, useRef, useCallback } from "react";
import { LogOut, Send, Hash, BookOpen } from "lucide-react";

interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  room: string;
  createdAt: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface ChatDashboardProps {
  token: string;
  user: UserProfile;
  onLogout: () => void;
}

const CHANNELS = [
  { id: "general", name: "general", description: "General discussion & study talk" },
  { id: "web-dev", name: "web-development", description: "HTML, CSS, React, and Node.js study room" },
  { id: "dsa-prep", name: "dsa-prep", description: "Data Structures & Algorithms interview prep" },
  { id: "system-design", name: "system-design", description: "Scale, architecture, and system design" },
];

export default function ChatDashboard({ token, user, onLogout }: ChatDashboardProps) {
  const [activeRoom, setActiveRoom] = useState(CHANNELS[0]!.id);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");

  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Fetch Message History from Express API
  const fetchHistory = useCallback(async (room: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/messages/${room}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Map DB schemas to front UI type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedMessages = data.map((msg: any) => ({
          id: msg._id,
          text: msg.text,
          senderId: msg.sender,
          senderName: msg.senderName,
          room: msg.room,
          createdAt: msg.createdAt,
        }));
        setMessages(mappedMessages);
      }
    } catch (error) {
      console.error("Failed to load chat history", error);
    }
  }, [token]);

  // Connect & Join WS Room
  const connectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    setStatus("connecting");

    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
      // Join active room on open
      ws.send(
        JSON.stringify({
          type: "join",
          payload: { roomId: activeRoom, token },
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "message") {
          const { id, text, senderId, senderName, room, createdAt } = data.payload;
          
          // Only append if it belongs to the active room
          if (room === activeRoom) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === id)) return prev;
              return [
                ...prev,
                { id, text, senderId, senderName, room, createdAt },
              ];
            });
          }
        } else if (data.type === "error") {
          console.error("WS Server Error:", data.payload.message);
        }
      } catch (err) {
        console.error("Failed to parse websocket message:", err);
      }
    };

    ws.onerror = () => setStatus("disconnected");
    ws.onclose = () => setStatus("disconnected");
  }, [activeRoom, token]);

  // Load history and reconnect socket when room changes
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) {
        fetchHistory(activeRoom);
        connectWebSocket();
      }
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      wsRef.current?.close();
    };
  }, [activeRoom, connectWebSocket, fetchHistory]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    const text = inputValue.trim();
    const ws = wsRef.current;
    if (!text || !ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(
      JSON.stringify({
        type: "chat",
        payload: { message: text },
      })
    );
    setInputValue("");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-purple-600",
      "bg-emerald-600",
      "bg-indigo-600",
      "bg-amber-600",
      "bg-rose-600",
      "bg-cyan-600",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index] || "bg-purple-600";
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const activeChannel = CHANNELS.find((c) => c.id === activeRoom) || CHANNELS[0]!;

  return (
    <div className="flex h-screen bg-[#0b0c10] text-slate-100 overflow-hidden font-sans antialiased w-full">
      {/* Sidebar */}
      <aside className="w-80 border-r border-slate-900 bg-[#1f2833]/15 backdrop-blur-md flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-wide text-slate-100">
              StudySpace
            </span>
          </div>
        </div>

        {/* Channels Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <div className="px-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-3">
              Study Channels
            </div>
            <nav className="space-y-1">
              {CHANNELS.map((channel) => {
                const isActive = channel.id === activeRoom;
                return (
                  <button
                    key={channel.id}
                    onClick={() => setActiveRoom(channel.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                      isActive
                        ? "bg-purple-600/10 border border-purple-500/20 text-purple-400"
                        : "text-slate-400 hover:bg-slate-900/40 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    <Hash className={`w-4 h-4 ${isActive ? "text-purple-400" : "text-slate-500"}`} />
                    <div className="truncate">
                      <div className="text-sm font-semibold truncate leading-none mb-1">
                        {channel.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate leading-none">
                        {channel.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Account Section */}
        <div className="p-4 border-t border-slate-900 bg-[#1f2833]/5 flex items-center justify-between">
          <div className="flex items-center gap-3 truncate">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${getAvatarColor(user.name)}`}>
              {getInitials(user.name)}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-slate-200 truncate leading-tight">
                {user.name}
              </div>
              <div className="text-[10px] text-slate-500 truncate leading-none mt-0.5">
                {user.email}
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Log Out"
            className="p-2 rounded-lg border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-rose-400 bg-slate-950/20 transition-all hover:bg-rose-500/5 focus:outline-none cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0c0d12]">
        {/* Chat Header */}
        <header className="h-16 px-6 border-b border-slate-900 bg-[#1f2833]/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-purple-400" />
            <div>
              <h1 className="text-sm font-bold text-slate-200 capitalize leading-none">
                {activeChannel.name}
              </h1>
              <p className="text-[10px] text-slate-500 mt-1">
                {activeChannel.description}
              </p>
            </div>
          </div>

          {/* Connection Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/40 border border-slate-900">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status === "connected"
                  ? "bg-emerald-400"
                  : status === "connecting"
                  ? "bg-amber-400 animate-pulse"
                  : "bg-rose-500"
              }`}
            />
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {status}
            </span>
          </div>
        </header>

        {/* Message Panel */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center mb-3 bg-[#1f2833]/10">
                <Hash className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-400">Welcome to #{activeChannel.name}</h3>
              <p className="text-xs text-slate-600 max-w-xs mt-1">
                This is the start of the #{activeChannel.name} history. Send a message to start the study group session.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === user.id;
              return (
                <div key={msg.id} className={`flex gap-3 ${isMe ? "justify-end" : "justify-start"}`}>
                  {!isMe && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 self-end mb-1 ${getAvatarColor(msg.senderName)}`}>
                      {getInitials(msg.senderName)}
                    </div>
                  )}

                  <div className={`flex flex-col max-w-[70%] gap-1 ${isMe ? "items-end" : "items-start"}`}>
                    <span className="text-[10px] text-slate-500 font-semibold px-1">
                      {isMe ? "You" : msg.senderName} • {formatTime(msg.createdAt)}
                    </span>

                    <div
                      className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed wrap-break-word shadow-sm ${
                        isMe
                          ? "bg-purple-600 text-white rounded-tr-none"
                          : "bg-[#1f2833]/40 text-slate-200 border border-slate-800/80 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>

                  {isMe && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 self-end mb-1 ${getAvatarColor(user.name)}`}>
                      {getInitials(user.name)}
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <footer className="p-4 border-t border-slate-900 bg-[#1f2833]/5">
          <div className="flex items-center gap-2 max-w-4xl mx-auto bg-slate-950/40 border border-slate-900 rounded-xl p-1.5 focus-within:border-purple-500/30 transition-all">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={status === "connected" ? `Message #${activeChannel.name}...` : "Connecting to live workspace..."}
              disabled={status !== "connected"}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 bg-transparent border-0 outline-none px-3 py-2 text-xs text-slate-200 placeholder-slate-700 disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || status !== "connected"}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-900 disabled:text-slate-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
