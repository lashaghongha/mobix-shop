import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, Zap, Package, Tag, BarChart2, Search, FileText, Loader, Trash2, Plus, MessageSquare } from 'lucide-react';
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
  { label: '📦 დაბალი სტოკი',        text: 'რომელ პროდუქტებს აქვთ 5-ზე ნაკლები სტოკი?' },
  { label: '🔍 iPhone ძიება',         text: 'იპოვე ყველა iPhone პროდუქტი' },
  { label: '💰 10% ფასდაკლება Apple', text: 'Apple-ის ყველა პროდუქტს დაამატე 10% ფასდაკლება' },
  { label: '📝 SEO გენერაცია',        text: 'გააკეთე SEO Samsung Galaxy S24 Ultra-სთვის' },
];

const CHATS_KEY  = 'mobix_agent_chats';
const ACTIVE_KEY = 'mobix_agent_active';

const WELCOME = {
  role: 'assistant',
  content: 'გამარჯობა! მე ვარ MobiX AI ასისტენტი. შემიძლია:\n\n• პროდუქტების დამატება/რედაქტირება\n• ფასების შეცვლა და ფასდაკლებები\n• სტოკის მართვა\n• SEO-ს გენერაცია\n• პროდუქტების ძიება\n\nრა გინდა გააკეთო?',
  actions: [],
};

function loadChats() {
  try { return JSON.parse(localStorage.getItem(CHATS_KEY)) || []; } catch { return []; }
}
function saveChats(chats) {
  try { localStorage.setItem(CHATS_KEY, JSON.stringify(chats)); } catch {}
}

function newChat() {
  return { id: Date.now(), title: 'ახალი ჩატი', createdAt: Date.now(), messages: [WELCOME] };
}

export default function AdminAgents() {
  const navigate  = useNavigate();
  const bottomRef = useRef(null);

  const [chats, setChats] = useState(() => {
    const saved = loadChats();
    return saved.length ? saved : [newChat()];
  });

  const [activeId, setActiveId] = useState(() => {
    const saved = localStorage.getItem(ACTIVE_KEY);
    const id = saved ? parseInt(saved) : null;
    const all = loadChats();
    return (all.find(c => c.id === id) ? id : all[0]?.id) ?? Date.now();
  });

  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);

  const activeChat = chats.find(c => c.id === activeId) || chats[0];
  const messages   = activeChat?.messages || [WELCOME];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    saveChats(chats);
  }, [chats]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_KEY, String(activeId));
  }, [activeId]);

  const updateMessages = (msgs) => {
    setChats(prev => prev.map(c => {
      if (c.id !== activeId) return c;
      // update title from first user message
      const firstUser = msgs.find(m => m.role === 'user');
      const title = firstUser ? firstUser.content.slice(0, 35) : c.title;
      return { ...c, messages: msgs, title };
    }));
  };

  const createNewChat = () => {
    const chat = newChat();
    setChats(prev => [chat, ...prev]);
    setActiveId(chat.id);
    setInput('');
  };

  const deleteChat = (id, e) => {
    e.stopPropagation();
    setChats(prev => {
      const next = prev.filter(c => c.id !== id);
      if (!next.length) {
        const fresh = newChat();
        setActiveId(fresh.id);
        return [fresh];
      }
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userText, actions: [] }];
    updateMessages(newMessages);
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
        updateMessages([...newMessages, { role: 'assistant', content: `⚠️ შეცდომა: ${err}`, actions: [] }]);
        return;
      }

      const data = await res.json();
      updateMessages([...newMessages, {
        role: 'assistant',
        content: data.message,
        actions: data.actions || [],
      }]);

      const formAction = (data.actions || []).find(a => a.action === 'prepare_form');
      if (formAction) {
        const id = formAction.entityId;
        if (id) {
          setTimeout(() => navigate(`/admin/products/${id}/edit`), 1200);
        } else if (formAction.formData) {
          const formData = JSON.parse(formAction.formData);
          setTimeout(() => navigate('/admin/products/new', { state: { prefill: formData } }), 800);
        }
      }
    } catch {
      updateMessages([...newMessages, { role: 'assistant', content: '⚠️ კავშირის შეცდომა. სცადე ხელახლა.', actions: [] }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="agents-page">
      {/* Sidebar */}
      <div className="agents-sidebar">
        <button className="agents-new-chat-btn" onClick={createNewChat}>
          <Plus size={14} /> ახალი ჩატი
        </button>
        <div className="agents-chat-list">
          {chats.map(c => (
            <div
              key={c.id}
              className={`agents-chat-item${c.id === activeId ? ' active' : ''}`}
              onClick={() => setActiveId(c.id)}
            >
              <MessageSquare size={13} />
              <span className="agents-chat-item-title">{c.title}</span>
              <button
                className="agents-chat-del"
                onClick={(e) => deleteChat(c.id, e)}
                title="წაშლა"
              ><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="agents-main">
        {/* Header */}
        <div className="agents-header">
          <div className="agents-header-left">
            <div className="agents-avatar"><Bot size={22} /></div>
            <div>
              <h1 className="agents-title">AI ასისტენტი</h1>
              <span className="agents-status"><span className="agents-dot" />მზადაა</span>
            </div>
          </div>
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
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
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
                      const def  = AGENT_ICONS[a.agent] || AGENT_ICONS['System'];
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
        {messages.length <= 1 && (
          <div className="agents-quick">
            {QUICK_PROMPTS.map((q, i) => (
              <button key={i} className="agents-quick-btn" onClick={() => sendMessage(q.text)}>
                {q.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="agents-input-wrap">
          <textarea
            className="agents-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="შეტყობინება... (მაგ: დაამატე Samsung S24, ფასი 2500₾)"
            rows={1}
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
    </div>
  );
}
