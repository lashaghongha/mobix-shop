import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, Zap, Package, Tag, BarChart2, Search, FileText, Loader, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import './AdminAgents.css';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const AGENTS = [
  {
    id: 'product',
    name: 'პროდუქტის აგენტი',
    icon: Package,
    color: '#3b82f6',
    hint: 'Product Agent',
    welcome: 'გამარჯობა! მე ვარ პროდუქტის აგენტი.\n\nშემიძლია:\n• პროდუქტის დამატება Draft-ად\n• პროდუქტის ძიება და ნახვა\n• ინფორმაციის განახლება\n\nმაგ: "დაამატე iPhone 16 Pro"',
    quickPrompts: [
      { label: '➕ iPhone 16 Pro დამატება', text: 'დაამატე iPhone 16 Pro' },
      { label: '🔍 Samsung ძიება',          text: 'იპოვე ყველა Samsung პროდუქტი' },
      { label: '➕ MacBook Air დამატება',   text: 'დაამატე MacBook Air M3' },
    ],
  },
  {
    id: 'price',
    name: 'ფასის აგენტი',
    icon: Tag,
    color: '#10b981',
    hint: 'Price Agent',
    welcome: 'გამარჯობა! მე ვარ ფასის აგენტი.\n\nშემიძლია:\n• ფასების შეცვლა\n• ფასდაკლებების დამატება\n• ძველი ფასის დაყენება\n\nმაგ: "Apple-ს 10% ფასდაკლება"',
    quickPrompts: [
      { label: '💰 10% ფასდაკლება Apple',  text: 'Apple-ის ყველა პროდუქტს დაამატე 10% ფასდაკლება' },
      { label: '💰 5% ფასდაკლება Samsung', text: 'Samsung-ის ყველა პროდუქტს დაამატე 5% ფასდაკლება' },
    ],
  },
  {
    id: 'inventory',
    name: 'სტოკის აგენტი',
    icon: BarChart2,
    color: '#f59e0b',
    hint: 'Inventory Agent',
    welcome: 'გამარჯობა! მე ვარ სტოკის აგენტი.\n\nშემიძლია:\n• სტოკის შემოწმება\n• დაბალი სტოკის პროდუქტები\n• სტოკის განახლება\n\nმაგ: "რომელ პროდუქტებს აქვს 5-ზე ნაკლები სტოკი?"',
    quickPrompts: [
      { label: '📦 დაბალი სტოკი',    text: 'რომელ პროდუქტებს აქვთ 5-ზე ნაკლები სტოკი?' },
      { label: '📦 ნულოვანი სტოკი',  text: 'რომელ პროდუქტებს სტოკი არ აქვს?' },
    ],
  },
  {
    id: 'seo',
    name: 'SEO აგენტი',
    icon: Search,
    color: '#8b5cf6',
    hint: 'SEO Agent',
    welcome: 'გამარჯობა! მე ვარ SEO აგენტი.\n\nშემიძლია:\n• სერჩის საკვანძო სიტყვების გენერაცია\n• ქართული სერჩ ალიასების დამატება\n\nმაგ: "გააკეთე SEO Samsung S24 Ultra-სთვის"',
    quickPrompts: [
      { label: '📝 SEO Samsung S24',  text: 'გააკეთე SEO Samsung Galaxy S24 Ultra-სთვის' },
      { label: '📝 SEO iPhone 15',    text: 'გააკეთე SEO iPhone 15 Pro-სთვის' },
    ],
  },
  {
    id: 'description',
    name: 'აღწერის აგენტი',
    icon: FileText,
    color: '#ec4899',
    hint: 'Description Agent',
    welcome: 'გამარჯობა! მე ვარ აღწერის აგენტი.\n\nშემიძლია:\n• პროდუქტის აღწერის გენერაცია\n• კრეატიული და SEO-ოპტიმიზებული ტექსტი\n\nმაგ: "დაწერე აღწერა iPhone 16 Pro-სთვის"',
    quickPrompts: [
      { label: '✍️ iPhone 16 Pro აღწერა',   text: 'დაწერე აღწერა iPhone 16 Pro-სთვის' },
      { label: '✍️ Samsung S24 Ultra აღწერა', text: 'დაწერე აღწერა Samsung Galaxy S24 Ultra-სთვის' },
    ],
  },
];

const STORAGE_KEY = 'mobix_agent_chats_v2';

function loadAllChats() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}
function saveAllChats(all) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); } catch {}
}

function welcomeMsg(agent) {
  return { role: 'assistant', content: agent.welcome, actions: [] };
}

export default function AdminAgents() {
  const navigate  = useNavigate();
  const bottomRef = useRef(null);

  const [activeAgentId, setActiveAgentId] = useState('product');
  // { agentId: [ { id, title, messages[] }, ... ] }
  const [allChats, setAllChats] = useState(() => {
    const saved = loadAllChats();
    const result = {};
    AGENTS.forEach(a => {
      result[a.id] = saved[a.id]?.length
        ? saved[a.id]
        : [{ id: Date.now() + a.id, title: 'ახალი ჩატი', messages: [welcomeMsg(a)] }];
    });
    return result;
  });

  const [activeChatIds, setActiveChatIds] = useState(() => {
    const ids = {};
    AGENTS.forEach(a => { ids[a.id] = allChats[a.id]?.[0]?.id; });
    return ids;
  });

  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({ product: true });

  const agent      = AGENTS.find(a => a.id === activeAgentId);
  const agentChats = allChats[activeAgentId] || [];
  const activeChatId = activeChatIds[activeAgentId];
  const activeChat = agentChats.find(c => c.id === activeChatId) || agentChats[0];
  const messages   = activeChat?.messages || [welcomeMsg(agent)];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { saveAllChats(allChats); }, [allChats]);

  const updateMessages = (msgs) => {
    setAllChats(prev => {
      const chats = prev[activeAgentId].map(c => {
        if (c.id !== activeChatId) return c;
        const firstUser = msgs.find(m => m.role === 'user');
        return { ...c, messages: msgs, title: firstUser ? firstUser.content.slice(0, 35) : c.title };
      });
      return { ...prev, [activeAgentId]: chats };
    });
  };

  const createNewChat = () => {
    const hasUser = messages.some(m => m.role === 'user');
    if (!hasUser) return;
    const chat = { id: Date.now(), title: 'ახალი ჩატი', messages: [welcomeMsg(agent)] };
    setAllChats(prev => ({ ...prev, [activeAgentId]: [chat, ...prev[activeAgentId]] }));
    setActiveChatIds(prev => ({ ...prev, [activeAgentId]: chat.id }));
    setInput('');
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    setAllChats(prev => {
      let chats = prev[activeAgentId].filter(c => c.id !== chatId);
      if (!chats.length) chats = [{ id: Date.now(), title: 'ახალი ჩატი', messages: [welcomeMsg(agent)] }];
      if (chatId === activeChatId) setActiveChatIds(p => ({ ...p, [activeAgentId]: chats[0].id }));
      return { ...prev, [activeAgentId]: chats };
    });
  };

  const switchAgent = (agentId) => {
    setActiveAgentId(agentId);
    setInput('');
    setExpanded(prev => ({ ...prev, [agentId]: true }));
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
        body: JSON.stringify({
          message: userText,
          history: history.slice(0, -1),
          agentHint: agent.hint,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        updateMessages([...newMessages, { role: 'assistant', content: `⚠️ შეცდომა: ${err}`, actions: [] }]);
        return;
      }

      const data = await res.json();
      updateMessages([...newMessages, { role: 'assistant', content: data.message, actions: data.actions || [] }]);

      const formAction = (data.actions || []).find(a => a.action === 'prepare_form');
      if (formAction?.entityId) {
        setTimeout(() => navigate(`/admin/products/${formAction.entityId}/edit`), 1200);
      } else if (formAction?.formData) {
        setTimeout(() => navigate('/admin/products/new', { state: { prefill: JSON.parse(formAction.formData) } }), 800);
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

  const AgentIcon = agent.icon;

  return (
    <div className="agents-page">
      {/* Sidebar */}
      <div className="agents-sidebar">
        {AGENTS.map(a => {
          const Icon     = a.icon;
          const isActive = a.id === activeAgentId;
          const chats    = allChats[a.id] || [];
          const isOpen   = expanded[a.id];

          return (
            <div key={a.id} className="agents-agent-group">
              {/* Agent header */}
              <div
                className={`agents-agent-header${isActive ? ' active' : ''}`}
                onClick={() => { switchAgent(a.id); setExpanded(p => ({ ...p, [a.id]: !p[a.id] })); }}
              >
                <div className="agents-agent-icon" style={{ background: a.color + '22', color: a.color }}>
                  <Icon size={15} />
                </div>
                <span className="agents-agent-name">{a.name}</span>
                {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </div>

              {/* Chat list under agent */}
              {isOpen && (
                <div className="agents-chat-list">
                  {chats.map(c => (
                    <div
                      key={c.id}
                      className={`agents-chat-item${c.id === activeChatIds[a.id] && isActive ? ' active' : ''}`}
                      onClick={() => { switchAgent(a.id); setActiveChatIds(p => ({ ...p, [a.id]: c.id })); }}
                    >
                      <span className="agents-chat-item-title">{c.title}</span>
                      <button className="agents-chat-del" onClick={(e) => deleteChat(c.id, e)}><Trash2 size={11} /></button>
                    </div>
                  ))}
                  <button
                    className="agents-new-chat-inline"
                    onClick={(e) => { e.stopPropagation(); switchAgent(a.id); setTimeout(createNewChat, 50); }}
                  >
                    <Plus size={11} /> ახალი ჩატი
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main */}
      <div className="agents-main">
        {/* Header */}
        <div className="agents-header" style={{ borderBottom: `2px solid ${agent.color}22` }}>
          <div className="agents-header-left">
            <div className="agents-avatar" style={{ background: `linear-gradient(135deg, ${agent.color}, ${agent.color}99)` }}>
              <AgentIcon size={20} />
            </div>
            <div>
              <h1 className="agents-title">{agent.name}</h1>
              <span className="agents-status"><span className="agents-dot" />მზადაა</span>
            </div>
          </div>
          <button className="agents-new-chat-btn" onClick={createNewChat} style={{ background: agent.color }}>
            <Plus size={13} /> ახალი ჩატი
          </button>
        </div>

        {/* Messages */}
        <div className="agents-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`agents-msg agents-msg--${msg.role}`}>
              <div className="agents-msg-avatar" style={msg.role === 'assistant' ? { background: `linear-gradient(135deg, ${agent.color}, ${agent.color}99)` } : {}}>
                {msg.role === 'user' ? <User size={15} /> : <AgentIcon size={15} />}
              </div>
              <div className="agents-msg-body">
                <div className="agents-msg-text" style={msg.role === 'user' ? { background: agent.color } : {}}>
                  {msg.content.split('\n').map((line, j) => <span key={j}>{line}<br /></span>)}
                </div>
                {msg.actions?.length > 0 && (
                  <div className="agents-actions">
                    {msg.actions.map((a, j) => {
                      const def  = AGENTS.find(ag => ag.hint === a.agent) || { icon: Zap, color: '#6b7280' };
                      const I    = def.icon;
                      return (
                        <div key={j} className="agents-action-chip" style={{ borderColor: def.color + '44' }}>
                          <I size={12} style={{ color: def.color }} />
                          <span style={{ color: def.color, fontWeight: 700, fontSize: 11 }}>{a.agent}</span>
                          <span style={{ color: '#555', fontSize: 12 }}>{a.summary}</span>
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
              <div className="agents-msg-avatar" style={{ background: `linear-gradient(135deg, ${agent.color}, ${agent.color}99)` }}>
                <AgentIcon size={15} />
              </div>
              <div className="agents-msg-body">
                <div className="agents-typing">
                  <span style={{ background: agent.color }} /><span style={{ background: agent.color }} /><span style={{ background: agent.color }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div className="agents-quick">
            {agent.quickPrompts.map((q, i) => (
              <button key={i} className="agents-quick-btn" style={{ '--qcolor': agent.color }} onClick={() => sendMessage(q.text)}>
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
            placeholder={`${agent.name}-ს შეტყობინება...`}
            rows={1}
            style={{ '--focus-color': agent.color }}
          />
          <button
            className="agents-send-btn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{ background: agent.color }}
          >
            {loading ? <Loader size={18} className="agents-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
