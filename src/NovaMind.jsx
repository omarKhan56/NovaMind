import { useState, useRef, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  html, body {
    height: 100%;
    font-family: 'Rajdhani', sans-serif;
    background: #0a0a0f;
    color: #eef0f5;
    overflow: hidden;
  }

  #root {
    height: 100%;
  }

  .ambient {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 60% 40% at 15% 85%, rgba(0,229,255,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 50% 35% at 85% 15%, rgba(120,60,255,0.05) 0%, transparent 70%),
      radial-gradient(ellipse 30% 25% at 50% 50%, rgba(0,180,200,0.03) 0%, transparent 60%);
  }

  .app {
    position: relative; z-index: 1;
    display: flex; flex-direction: column;
    height: 100%;
    max-width: 740px; margin: 0 auto;
    padding: 0 18px;
  }

  /* Header */
  .header { padding: 22px 0 10px; text-align: center; flex-shrink: 0; }
  .logo-row { display: flex; align-items: center; justify-content: center; gap: 11px; }
  .logo-icon {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, #00e5ff, #7c4dff);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 20px rgba(0,229,255,0.3);
  }
  .logo-text { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.4rem; letter-spacing: -0.3px; }
  .logo-text span { color: #00e5ff; }

  /* Messages */
  .messages {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 10px 0 6px;
    min-height: 0;
  }
  .messages::-webkit-scrollbar { width: 4px; }
  .messages::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 2px; }

  .msg { display: flex; gap: 11px; animation: fadeUp 0.28s ease; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: translateY(0); } }
  .msg.user { flex-direction: row-reverse; }

  .avatar {
    flex-shrink: 0; width: 32px; height: 32px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
  }
  .avatar.user { background: linear-gradient(135deg, #1a2535, #252545); }
  .avatar.bot { background: linear-gradient(135deg, #00e5ff, #7c4dff); box-shadow: 0 0 10px rgba(0,229,255,0.28); }

  .bubble {
    padding: 11px 15px; border-radius: 14px; font-size: 0.9rem; line-height: 1.65;
    word-break: break-word; max-width: 82%;
  }
  .msg.user .bubble {
    background: linear-gradient(135deg, #1a2a4a, #1e1e3a);
    border: 1px solid rgba(0,229,255,0.1);
    border-top-right-radius: 4px;
  }
  .msg.bot .bubble {
    background: #141420;
    border: 1px solid rgba(255,255,255,0.07);
    border-top-left-radius: 4px;
  }

  .bubble code {
    background: rgba(0,229,255,0.1); padding: 2px 7px; border-radius: 5px;
    font-family: 'Space Mono', monospace; font-size: 0.77rem; color: #00e5ff;
  }
  .bubble pre {
    background: rgba(0,0,0,0.35); padding: 11px; border-radius: 8px;
    overflow-x: auto; margin: 7px 0; border: 1px solid rgba(255,255,255,0.07);
  }
  .bubble pre code { background: none; padding: 0; color: #c8cad4; font-size: 0.76rem; }
  .bubble strong { color: #00e5ff; font-weight: 600; }
  .bubble em { color: #7a7d8e; font-style: italic; }
  .bubble ul { padding-left: 18px; margin: 5px 0; }
  .bubble li { margin: 3px 0; color: #9a9dae; }
  .bubble h3 { color: #00e5ff; font-size: 0.95rem; margin: 8px 0 3px; font-weight: 600; }
  .bubble p { margin: 3px 0; }

  /* Typing */
  .typing { display: flex; gap: 5px; padding: 5px 0; }
  .typing span {
    width: 7px; height: 7px; border-radius: 50%; background: #00e5ff;
    animation: dot 1.3s infinite ease-in-out;
  }
  .typing span:nth-child(2) { animation-delay: 0.16s; }
  .typing span:nth-child(3) { animation-delay: 0.32s; }
  @keyframes dot { 0%,78%,100% { opacity: 0.18; transform: scale(0.75); } 38% { opacity: 1; transform: scale(1); } }

  /* Welcome */
  .welcome {
    flex: 1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 24px 10px;
    min-height: 0;
  }
  .welcome-icon {
    width: 68px; height: 68px; border-radius: 20px;
    background: linear-gradient(135deg, #00e5ff, #7c4dff);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 36px rgba(0,229,255,0.32); margin-bottom: 20px;
    animation: float 3.2s ease-in-out infinite;
  }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
  .welcome h2 { font-family: 'Syne', sans-serif; font-size: 1.55rem; font-weight: 800; margin-bottom: 7px; }
  .welcome h2 span { color: #00e5ff; }
  .welcome p { color: #6e7080; font-size: 0.83rem; max-width: 310px; line-height: 1.55; }

  .chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; margin-top: 22px; }
  .chip {
    padding: 7px 14px; border-radius: 18px; border: 1px solid rgba(255,255,255,0.08);
    background: #12121c; color: #7a7d8e; font-size: 0.78rem; cursor: pointer;
    font-family: 'Rajdhani', sans-serif; transition: all 0.2s;
  }
  .chip:hover { border-color: #00e5ff; color: #00e5ff; background: rgba(0,229,255,0.07); }

  /* Input area — always sticks to the bottom */
  .input-section { flex-shrink: 0; padding-bottom: 10px; }

  .input-wrap {
    background: #14141f; border: 1px solid rgba(255,255,255,0.09);
    border-radius: 14px; padding: 9px 11px;
    display: flex; align-items: flex-end; gap: 9px;
    transition: border-color 0.22s, box-shadow 0.22s;
  }
  .input-wrap:focus-within {
    border-color: rgba(0,229,255,0.32);
    box-shadow: 0 0 14px rgba(0,229,255,0.1);
  }
  .input-wrap textarea {
    flex: 1; background: none; border: none; outline: none;
    color: #eef0f5; font-family: 'Rajdhani', sans-serif; font-size: 0.93rem;
    resize: none; min-height: 36px; max-height: 130px; line-height: 1.55;
  }
  .input-wrap textarea::placeholder { color: #4a4d5e; }

  .send-btn {
    width: 40px; height: 40px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, #00e5ff, #7c4dff);
    color: #fff; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.18s, box-shadow 0.18s;
    box-shadow: 0 3px 12px rgba(0,229,255,0.28); flex-shrink: 0;
  }
  .send-btn:hover { transform: scale(1.06); box-shadow: 0 4px 18px rgba(0,229,255,0.4); }
  .send-btn:disabled { opacity: 0.28; cursor: not-allowed; transform: none; box-shadow: none; }

  .stop-btn {
    width: 40px; height: 40px; border-radius: 10px;
    border: 1px solid rgba(255,92,107,0.3);
    background: rgba(255,92,107,0.1); color: #ff5c6b; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: background 0.18s;
  }
  .stop-btn:hover { background: rgba(255,92,107,0.22); }

  .footer-note { text-align: center; font-size: 0.66rem; color: #3e4050; margin-top: 8px; }

  /* Toast */
  .toast {
    position: fixed; bottom: 65px; left: 50%; transform: translateX(-50%);
    background: rgba(255,92,107,0.14); border: 1px solid rgba(255,92,107,0.28);
    color: #ff5c6b; padding: 9px 20px; border-radius: 9px;
    font-size: 0.77rem; z-index: 10; animation: fadeUp 0.25s ease;
    white-space: nowrap;
  }
`;

function renderMarkdown(text) {
  return text
    .replace(/```(\w*)\n?([\s\S]*?)```/g, "<pre><code>$2</code></pre>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/### (.+)/g, "<h3>$1</h3>")
    .replace(/^- (.+)/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>")
    .replace(/\n/g, "<br/>");
}

export default function NovaMind() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const bottomRef = useRef(null);
  const textRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3200); return () => clearTimeout(t); }
  }, [toast]);

  const chips = [
    "Explain quantum computing simply",
    "Write a short poem about the ocean",
    "What are the best practices for React?",
    "Tell me a fun fact about space"
  ];

  const send = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    const geminiHistory = updated.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    try {
      abortRef.current = new AbortController();

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
?key=${import.meta.env.VITE_GEMINI_API_KEY}`;

      const res = await fetch(url, {
        method: "POST",
        signal: abortRef.current.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: geminiHistory,
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setToast(err?.error?.message || "Something went wrong");
        setLoading(false);
        return;
      }

      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      if (e.name !== "AbortError") setToast("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const onInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 130) + "px";
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ambient" />
      <div className="app">

        {/* Header */}
        <div className="header">
          <div className="logo-row">
            <div className="logo-icon">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="logo-text">Nova<span>Mind</span></div>
          </div>
        </div>

        {/* Messages or Welcome */}
        {messages.length === 0 ? (
          <div className="welcome">
            <div className="welcome-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h2>Hi, I'm <span>NovaMind</span></h2>
            <p>Your AI assistant. Just type a question and I'll answer instantly — no setup needed.</p>
            <div className="chips">
              {chips.map((c) => (
                <button key={c} className="chip" onClick={() => { setInput(c); textRef.current?.focus(); }}>{c}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role === "user" ? "user" : ""}`}>
                <div className={`avatar ${m.role === "user" ? "user" : "bot"}`}>
                  {m.role === "user" ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="8" r="4"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                    </svg>
                  )}
                </div>
                <div className="bubble">
                  {m.role === "user"
                    ? m.content
                    : <span dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }} />
                  }
                </div>
              </div>
            ))}

            {loading && (
              <div className="msg">
                <div className="avatar bot">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div className="bubble" style={{ background:"#141420", border:"1px solid rgba(255,255,255,0.07)", borderTopLeftRadius:4 }}>
                  <div className="typing"><span></span><span></span><span></span></div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input — always at the bottom */}
        <div className="input-section">
          <div className="input-wrap">
            <textarea
              ref={textRef}
              value={input}
              onChange={onInput}
              onKeyDown={onKey}
              placeholder="Ask me anything…"
              rows={1}
              disabled={loading}
            />
            {loading ? (
              <button className="stop-btn" onClick={() => { abortRef.current?.abort(); setLoading(false); }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#ff5c6b">
                  <rect x="6" y="6" width="12" height="12" rx="2"/>
                </svg>
              </button>
            ) : (
              <button className="send-btn" disabled={!input.trim()} onClick={send}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff">
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            )}
          </div>
          <div className="footer-note">NovaMind · powered by Gemini · just ask anything</div>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
