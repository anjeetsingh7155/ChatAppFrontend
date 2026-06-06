import { useEffect, useRef, useState, useCallback } from "react";

type ChatMessage = {
  id: number;
  text: string;
  isMine: boolean;
  timestamp: string;
};

type ConnectionStatus = "connecting" | "connected" | "disconnected";

const DEFAULT_ROOM = "purple";

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

let msgCounter = 0;

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState<ConnectionStatus>("connecting");

  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  
  const connect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    setStatus("connecting");

    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
      
      ws.send(JSON.stringify({ type: "join", payload: { roomId: DEFAULT_ROOM } }));
    };

    ws.onmessage = (event: MessageEvent) => {
      const incomingText = event.data as string;
      
      setMessages((prev) => {
        
        const isDuplicateSelfBroadcast = 
          prev.length > 0 && 
          prev[prev.length - 1].isMine && 
          prev[prev.length - 1].text === incomingText;

        if (isDuplicateSelfBroadcast) {
          return prev;
        }

        return [
          ...prev,
          {
            id: ++msgCounter,
            text: incomingText,
            isMine: false, 
            timestamp: getTime(),
          },
        ];
      });
    };

    ws.onerror = () => setStatus("disconnected");
    ws.onclose = () => setStatus("disconnected");
  }, []);

  
  useEffect(() => {
    let isMounted = true;
    const timer = window.setTimeout(() => {
      if (isMounted) {
        connect();
      }
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      wsRef.current?.close();
    };
  }, [connect]);

  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const text = inputValue.trim();
    const ws = wsRef.current;
    if (!text || !ws || ws.readyState !== WebSocket.OPEN) return;

    
    setMessages((prev) => [
      ...prev,
      { id: ++msgCounter, text, isMine: true, timestamp: getTime() },
    ]);

  
    ws.send(JSON.stringify({ type: "chat", payload: { message: text } }));
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0c10] text-slate-100 font-sans antialiased">
     
      <header className="h-16 border-b border-slate-900 px-6 flex items-center justify-between bg-[#1f2833]/30 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-purple-400">#</span>
          <span className="font-semibold text-slate-200">Global Chat</span>
        </div>
        
      
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/50 border border-slate-800 text-xs">
          <span className={`w-2 h-2 rounded-full ${status === "connected" ? "bg-emerald-400" : status === "connecting" ? "bg-amber-400" : "bg-rose-500"}`} />
          <span className="text-[11px] font-medium text-slate-400 lowercase">{status}</span>
        </div>
      </header>

   
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}>
            <div className={`flex flex-col max-w-[70%] gap-1 ${msg.isMine ? "items-end" : "items-start"}`}>
              
              
              <span className="text-[11px] text-slate-500 font-medium px-1">
                {msg.isMine ? "You" : "Peer"} • {msg.timestamp}
              </span>

            
              <div className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed break-words shadow-sm
                ${msg.isMine 
                  ? "bg-purple-600 text-white rounded-tr-none" 
                  : "bg-[#1f2833] text-slate-200 border border-slate-800 rounded-tl-none"}`}
              >
                {msg.text}
              </div>

            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </main>

      <footer className="p-4 border-t border-slate-900 bg-[#1f2833]/10 shrink-0">
        <div className="flex items-center gap-2 max-w-4xl mx-auto bg-[#1a1b23] border border-slate-800 rounded-xl p-1.5 focus-within:border-purple-500/50 transition-all">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={status === "connected" ? "Type your message here..." : "Connecting to server..."}
            disabled={status !== "connected"}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1 bg-transparent border-0 outline-none px-3 py-2 text-sm text-slate-200 placeholder-slate-600 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || status !== "connected"}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-semibold rounded-lg transition-all"
          >
            Send
          </button>
        </div>
      </footer>

    </div>
  );
}