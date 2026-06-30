import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, Zap, Package, Tag, BarChart2, Search, FileText, Loader, Trash2, Plus } from 'lucide-react';
import './AdminAgents.css';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const AGENT_ICONS = {
  'Product Agent':     { icon: Package,  color: '#3b82f6' },
  'Price Agent':       { icon: Tag,      color: '#10b981' },
  'Inventory Agent':   { icon: BarChart2,color: '#f59e0b' },
  'SEO Agent':         { icon: Search,   color: '#8b5cf6' },
  'Description Agent': { icon: FileText, color: '#ec4899' },
  'System':            { icon: Zap,      color: '#6b7280' },
};

const QUICK_PROMPTS = [
  { label: '📦 დაბალი სტოკი',      text: 'რომელ პროდუქტებს აქვთ 5-ზე ნაკლები სტოკი?' },
  { label: '🔍 iPhone ძიება',       text: 'იპოვე ყველა iPhone პროდუქტი' },
  { label: '💰 10% ფასდაკლება Apple', text: 'Apple-ის ყველა პროდუქტს დაამატე 10% ფასდაკლება' },
  { label: '📝 SEO გენერაცია',      text: 'გააკეთე SEO Samsung Galaxy S24 Ultra-სთვის' },
];

export default function AdminAgents() {
  const navigate = useNavigate();
  const STORAGE_KEY = 'mobix_agent_chat';
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [{
        role: 'assistant',
        content: 'გამარჯობა! მე ვარ MobiX AI ასისტენტი. შემიძლია:\n\n• პროდუქტების დამატება/რედაქტირება\n• ფასების შეცვლა და ფასდაკლებები\n• სტოკის მართვა\n• SEO-ს გენერაცია\n• პროდუქტების ძიება\n\nრა გინდა გააკეთო?',
        actions: [],
      }];
    } catch { return []; }
  });
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userText, actions: [] }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages
        .filter(m => m.role !== 'system')
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch(`${API_BASE}/admin/agents/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history: history.slice(0, -1) }),
      });

      if (!res.ok) {
        const err = await res.text();
        setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ შეცდომა: ${err}`, actions: [] }]);
        return;
      }

      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        actions: data.actions || [],
      }]);

      // If agent prepared a product form, redirect to the form with pre-filled data
      const formAction = (data.actions || []).find(a => a.action === 'prepare_form' && a.formData);
      if (formAction) {
        const formData = JSON.parse(formAction.formData);
        setTimeout(() => navigate('/admin/products/new', { state: { prefill: formData } }), 800);
      }
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ კავშირის შეცდომა. სცადე ხელახლა.',
        actions: [],
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="agents-page">
      {/* Header */}
      <div className="agents-header">
        <div className="agents-header-left">
          <div className="agents-avatar"><Bot size={22} /></div>
          <div>
            <h1 className="agents-title">AI ასისტენტი</h1>
            <span className="agents-status"><span className="agents-dot" />მზადაა</span>
          </div>
        </div>
        <button className="agents-new-chat-btn" title="ახალი ჩატი" onClick={() => {
          const initial = [{ role: 'assistant', content: 'გამარჯობა! მე ვარ MobiX AI ასისტენტი. შემიძლია:\n\n• პროდუქტების დამატება/რედაქტირება\n• ფასების შეცვლა და ფასდაკლებები\n• სტოკის მართვა\n• SEO-ს გენერაცია\n• პროდუქტების ძიება\n\nრა გინდა გააკეთო?', actions: [] }];
          setMessages(initial);
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(initial)); } catch {}
        }}><Plus size={14} /> ახალი ჩატი</button>
        <button className="agents-clear-btn" title="ჩატის გასუფთავება" onClick={() => {
          const initial = [{ role: 'assistant', content: 'გამარჯობა! მე ვარ MobiX AI ასისტენტი. შემიძლია:\n\n• პროდუქტების დამატება/რედაქტირება\n• ფასების შეცვლა და ფასდაკლებები\n• სტოკის მართვა\n• SEO-ს გენერაცია\n• პროდუქტების ძიება\n\nრა გინდა გააკეთო?', actions: [] }];
          setMessages(initial);
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(initial)); } catch {}
        }}><Trash2 size={15} /></button>
        <div className="agents-chips">
          {Object.entries(AGENT_ICONS).filter(([k]) => k !== 'System').map(([name, { icon: Icon, color }]) => (
            <span key={name} className="agent-chip" style={{ borderColor: color + '33', color }}>
              <Icon size={12} /> {name}
            </span>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="agents-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`agents-msg agents-msg--${msg.role}`}>
            <div className="agents-msg-avatar">
              {msg.role === 'user'
                ? <User size={16} />
                : <Bot size={16} />}
            </div>
            <div className="agents-msg-body">
              <div className="agents-msg-text">
                {msg.content.split('\n').map((line, j) => (
                  <span key={j}>{line}<br /></span>
                ))}
              </div>
              {msg.actions?.length > 0 && (
                <div className="agents-actions">
                  {msg.actions.map((a, j) => {
                    const def = AGENT_ICONS[a.agent] || AGENT_ICONS['System'];
                    const Icon = def.icon;
                    return (
                      <div key={j} className="agents-action-chip" style={{ borderColor: def.color + '44' }}>
                        <Icon size={12} style={{ color: def.color }} />
                        <span className="agents-action-agent" style={{ color: def.color }}>{a.agent}</span>
                        <span className="agents-action-summary">{a.summary}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="agents-msg agents-msg--assistant">
            <div className="agents-msg-avatar"><Bot size={16} /></div>
            <div className="agents-msg-body">
              <div className="agents-typing">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="agents-quick">
        {QUICK_PROMPTS.map((q, i) => (
          <button key={i} className="agents-quick-btn" onClick={() => sendMessage(q.text)}>
            {q.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="agents-input-wrap">
        <textarea
          className="agents-input"
          placeholder="შეტყობინება... (მაგ: დაამატე Samsung S24, ფასი 2500₾)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
          disabled={loading}
        />
        <button
          className="agents-send-btn"
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
        >
          {loading ? <Loader size={18} className="agents-spin" /> : <Send size={18} />}
        </button>
      </div>
    </div>
  );
}
