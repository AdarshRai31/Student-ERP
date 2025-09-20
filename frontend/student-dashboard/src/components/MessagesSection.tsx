import React, { useEffect, useState } from "react";
import { Message } from "../types";
import { fetchJSON } from "../utils/api";

type MessagesResponse = { success: boolean; data: Array<{ id: string; sender: string; content: string; timestamp: string; status?: string; student?: string }> };

const MessagesSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([] as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        // Infer student identifier from localStorage
        const possibleKeys = ['userEmail','email','username','auth_user_email','auth_username'];
        let student: string | null = null;
        for (const k of possibleKeys) {
          const v = localStorage.getItem(k);
          if (v && v.includes('@')) { student = v; break; }
          if (!student && v) { student = v; }
        }
        if (!student) {
          const blob = localStorage.getItem('auth_user') || localStorage.getItem('user');
          if (blob) {
            try { const obj = JSON.parse(blob); student = obj?.email || obj?.username || null; } catch {}
          }
        }
        if (alive) setStudentId(student);

        const path = student ? `/public/messages?student=${encodeURIComponent(student)}` : `/public/messages`;
        const res = await fetchJSON<MessagesResponse>(path);
        if (!alive) return;
        const mapped: Message[] = (res.data || []).map((m) => ({
          id: typeof m.id === 'string' ? parseInt(m.id) || Date.now() : (m.id as any) || Date.now(),
          sender: m.sender || 'System',
          content: m.content || '',
          timestamp: m.timestamp || '',
          type: (m.sender && m.sender.toLowerCase() === 'you') ? 'sent' : 'received'
        }));
        setMessages(mapped);
        setError(null);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || 'Failed to load messages');
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      const student = studentId || localStorage.getItem('userEmail') || '';
      const payload = { student, sender: 'You', content: input };
      const res = await fetchJSON<{ success: boolean; data: { id: string; timestamp: string } }>(`/public/messages`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const now = new Date().toLocaleTimeString();
      setMessages(prev => ([...prev, { id: Date.now(), sender: "You", content: input, timestamp: res?.data?.timestamp || now, type: "sent" as const }]));
      setInput("");
    } catch (e) {
      // fallback local echo on failure
      setMessages(prev => ([...prev, { id: Date.now(), sender: "You", content: input, timestamp: new Date().toLocaleTimeString(), type: "sent" as const }]));
      setInput("");
    }
  };

  return (
    <section className="communication-section">
      <div className="card">
        <div className="card__header"><h3>Messages {studentId ? <span className="text-xs text-gray-500">(for {studentId})</span> : null}</h3></div>
        <div className="card__body">
          {loading && <div className="text-sm text-gray-500">Loading messages...</div>}
          {error && <div className="text-sm text-red-500">{error}</div>}
          <div className="messages-list scroll-area">
            {messages.map((m) => (
              <div key={m.id} className={`message ${m.type}`}>
                <strong>{m.sender}</strong>
                <p>{m.content}</p>
                <small>{m.timestamp}</small>
              </div>
            ))}
            {!loading && !error && messages.length === 0 && (
              <div className="text-sm text-gray-500">No messages.</div>
            )}
          </div>
          <div className="message-input">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
            <button onClick={sendMessage} className="btn btn--primary"><i className="fas fa-paper-plane"></i></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessagesSection;
