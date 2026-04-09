"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User as UserIcon } from "lucide-react";

export default function ChatWidget({ itemId, isOwner }: { itemId: string, isOwner: boolean }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simple polling for hackathon real-time effect
  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetch(`/api/chat?itemId=${itemId}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.chats);
      }
    };
    
    fetchChats();
    const interval = setInterval(fetchChats, 3000);
    return () => clearInterval(interval);
  }, [itemId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const sender = isOwner ? "owner" : "finder";
    
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, message: newMessage, sender }),
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[400px] bg-background border border-border rounded-xl overflow-hidden mt-6 shadow-lg shadow-black/5">
      <div className="bg-muted p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2">
          Secure Proxy Chat
        </h3>
        <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded-full animate-pulse">Live Secure</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-muted-foreground mt-10">No messages yet. Send a message to securely contact the other party.</p>
        ) : (
          messages.map((msg) => {
            const isMe = (isOwner && msg.sender === "owner") || (!isOwner && msg.sender === "finder");
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${isMe ? "bg-primary text-white" : "bg-muted text-foreground"}`}>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-3 border-t border-border bg-background flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a secure message..."
          className="flex-1 bg-input/50 border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button type="submit" className="bg-primary text-white p-2 w-10 h-10 rounded-lg flex flex-shrink-0 items-center justify-center hover:bg-primary/90 transition">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
