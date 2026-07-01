import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, User, Zap, Package, Tag, BarChart2, Megaphone, Mail, Loader, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
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
    welcome: 'გამარჯობა! მე ვარ პროდუქტის სრული აგენტი.\n\nშემიძლია:\n• პროდუქტის დამატება + აღწერა + SEO ერთად\n• პროდუქტის ძიება\n• ფასისა და სტოკის განახლება\n\nმაგ: "დაამატე iPhone 16 Pro" — ყველაფერს ავტომატურად გავაკეთებ!',
    quickPrompts: [
      { label: '➕ iPhone 16 Pro',      text: 'დაამატე iPhone 16 Pro Max 256GB' },
      { label: '➕ Samsung S25 Ultra',  text: 'დაამატე Samsung Galaxy S25 Ultra 512GB' },
      { label: '➕ MacBook Air M4',     text: 'დაამატე MacBook Air M4 16GB 256GB' },
      { label: '🔍 პროდუქტის ძიება',   text: 'იპოვე ყველა Apple პროდუქტი' },
    ],
  },
  {
    id: 'price',
    name: 'ფასის აგენტი',
    icon: Tag,
    color: '#10b981',
    hint: 'Price Agent',
    welcome: 'გამარჯობა! მე ვარ ფასის აგენტი.\n\nშემიძლია:\n• ფასების შეცვლა\n• ფასდაკლებების დამატება ბრენდზე ან კატეგორიაზე\n\nმაგ: "Apple-ს 10% ფასდაკლება"',
    quickPrompts: [
      { label: '💰 10% ფასდაკლება Apple',  text: 'Apple-ის ყველა პროდუქტს დაამატე 10% ფასდაკლება' },
      { label: '💰 5% ფასდაკლება Samsung', text: 'Samsung-ის ყველა პროდუქტს დაამატე 5% ფასდაკლება' },
      { label: '📊 დაბალი სტოკი',          text: 'რომელ პროდუქტებს აქვთ 5-ზე ნაკლები სტოკი?' },
    ],
  },
  {
    id: 'inventory',
    name: 'სტოკის აგენტი',
    icon: BarChart2,
    color: '#f59e0b',
    hint: 'Inventory Agent',
    welcome: 'გამარჯობა! მე ვარ სტოკის აგენტი.\n\nშემიძლია:\n• სტოკის შემოწმება და განახლება\n• დაბალი სტოკის პროდუქტები\n• ნულოვანი სტოკის ალერტი\n\nმაგ: "რომელ პროდუქტებს აქვს 5-ზე ნაკლები სტოკი?"',
    quickPrompts: [
      { label: '📦 დაბალი სტოკი',   text: 'რომელ პროდუქტებს აქვთ 5-ზე ნაკლები სტოკი?' },
      { label: '📦 ნულოვანი სტოკი', text: 'რომელ პროდუქტებს სტოკი არ აქვს?' },
    ],
  },
  {
    id: 'social',
    name: 'სოციალური რეკლამა',
    icon: Megaphone,
    color: '#f97316',
    hint: 'Social Ads Agent',
    welcome: 'გამარჯობა! მე ვარ სოციალური მედიის რეკლამის აგენტი.\n\nშემიძლია:\n• Facebook Post — 3 ვარიანტი A/B/C\n• Instagram Caption + Hashtag-ები\n• Story ტექსტი\n\nმაგ: "გაუკეთე რეკლამა iPhone 16 Pro-ს"',
    quickPrompts: [
      { label: '📘 FB რეკლამა iPhone',    text: 'გაუკეთე Facebook რეკლამა iPhone 16 Pro-ს, ფასი 3999₾' },
      { label: '📸 Instagram Samsung',    text: 'გაუკეთე Instagram caption Samsung S25 Ultra-ს' },
      { label: '🎬 Story MacBook',        text: 'გაუკეთე Story ტექსტი MacBook Air M4-ს' },
      { label: '🔥 სრული კამპანია',       text: 'გაუკეთე სრული სოც.მედია კამპანია AirPods Pro-ს, ფასი 799₾' },
    ],
  },
  {
    id: 'email',
    name: 'Email მარკეტინგი',
    icon: Mail,
    color: '#8b5cf6',
    hint: 'Email Marketing Agent',
    welcome: 'გამარჯობა! მე ვარ Email მარკეტინგის აგენტი.\n\nშემიძლია:\n• პრომო Email-ის დაწერა\n• Newsletter შაბლონი\n• სეზონური აქცია Email\n\nმაგ: "დაწერე Email Black Friday-ს სმარტფონების აქციაზე"',
    quickPrompts: [
      { label: '📧 Black Friday Email',  text: 'დაწერე Black Friday Email — სმარტფონებზე 20% ფასდაკლება' },
      { label: '📧 ახალი პროდუქტი',     text: 'დაწერე Email iPhone 16 Pro-ს გამოშვებაზე' },
      { label: '📧 Newsletter',         text: 'დაწერე ყოველთვიური Newsletter MobiX-ის საუკეთესო შეთავაზებებზე' },
    ],
  },
];

function welcomeMsg(agent) {
  return { role: 'assistant', content: agent.welcome, actions: [] };
}

// API helpers
async function apiGetChats(agentId) {
  const res = await fetch(`${API_BASE}/admin/agents/chats/${agentId}`);
  if (!res.ok) throw new Error('Failed to load chats');
  return res.json();
}
async function apiCreateChat(agentId, title) {
  const res = await fetch(`${API_BASE}/admin/agents/chats/${agentId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Failed to create chat');
  return res.json();
}
async function apiGetMessages(agentId, chatId) {
  const res = await fetch(`${API_BASE}/admin/agents/chats/${agentId}/${chatId}/messages`);
  if (!res.ok) throw new Error('Failed to load messages');
  return res.json();
}
async function apiAddMessage(agentId, chatId, role, content, actionsJson) {
  const res = await fetch(`${API_BASE}/admin/agents/chats/${agentId}/${chatId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, content, actionsJson: JSON.stringify(actionsJson || []) }),
  });
  if (!res.ok) throw new Error('Failed to save message');
  return res.json();
}
async function apiDeleteChat(agentId, chatId) {
  await fetch(`${API_BASE}/admin/agents/chats/${agentId}/${chatId}`, { method: 'DELETE' });
}

export default function AdminAgents() {
  const navigate  = useNavigate();
  const bottomRef = useRef(null);

  const [activeAgentId, setActiveAgentId] = useState('product');
  // { agentId: [ { id, agentId, title, createdAt, updatedAt } ] }
  const [chatLists, setChatLists] = useState({});
  // { agentId: chatId }
  const [activeChatIds, setActiveChatIds] = useState({});
  // messages for the currently open chat
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [expanded, setExpanded] = useState({ product: true });
  const [chatsLoading, setChatsLoading] = useState({});

  const agent      = AGENTS.find(a => a.id === activeAgentId);
  const agentChats = chatLists[activeAgentId] || [];
  const activeChatId = activeChatIds[activeAgentId];

  // Load chats for an agent from API
  const loadChats = useCallback(async (agentId) => {
    setChatsLoading(p => ({ ...p, [agentId]: true }));
    try {
      const chats = await apiGetChats(agentId);
      setChatLists(p => ({ ...p, [agentId]: chats }));
      return chats;
    } catch {
      return [];
    } finally {
      setChatsLoading(p => ({ ...p, [agentId]: false }));
    }
  }, []);

  // Load messages for a chat
  const loadMessages = useCallback(async (agentId, chatId) => {
    try {
      const msgs = await apiGetMessages(agentId, chatId);
      const parsed = msgs.map(m => ({
        role: m.role,
        content: m.content,
        actions: (() => { try { return JSON.parse(m.actionsJson); } catch { return []; } })(),
      }));
      // Prepend welcome message if no messages yet
      if (parsed.length === 0) {
        const ag = AGENTS.find(a => a.id === agentId);
        setMessages([welcomeMsg(ag)]);
      } else {
        setMessages(parsed);
      }
    } catch {
      const ag = AGENTS.find(a => a.id === agentId);
      setMessages([welcomeMsg(ag)]);
    }
  }, []);

  // Initial load: load chats for the active agent
  useEffect(() => {
    (async () => {
      const chats = await loadChats(activeAgentId);
      if (chats.length > 0) {
        const firstId = chats[0].id;
        setActiveChatIds(p => ({ ...p, [activeAgentId]: firstId }));
        await loadMessages(activeAgentId, firstId);
      } else {
        // No chats yet — create one
        const ag = AGENTS.find(a => a.id === activeAgentId);
        const newChat = await apiCreateChat(activeAgentId, 'ახალი ჩატი');
        setChatLists(p => ({ ...p, [activeAgentId]: [newChat] }));
        setActiveChatIds(p => ({ ...p, [activeAgentId]: newChat.id }));
        setMessages([welcomeMsg(ag)]);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const switchAgent = async (agentId) => {
    setActiveAgentId(agentId);
    setInput('');
    setMessages([welcomeMsg(AGENTS.find(a => a.id === agentId))]);

    // Load chats if not yet loaded
    let chats = chatLists[agentId];
    if (!chats) {
      chats = await loadChats(agentId);
    }

    const existingChatId = activeChatIds[agentId];
    if (existingChatId) {
      await loadMessages(agentId, existingChatId);
    } else if (chats && chats.length > 0) {
      const firstId = chats[0].id;
      setActiveChatIds(p => ({ ...p, [agentId]: firstId }));
      await loadMessages(agentId, firstId);
    } else {
      // Create first chat for this agent
      const ag = AGENTS.find(a => a.id === agentId);
      const newChat = await apiCreateChat(agentId, 'ახალი ჩატი');
      setChatLists(p => ({ ...p, [agentId]: [newChat] }));
      setActiveChatIds(p => ({ ...p, [agentId]: newChat.id }));
      setMessages([welcomeMsg(ag)]);
    }
  };

  const selectChat = async (agentId, chatId) => {
    if (agentId !== activeAgentId) {
      setActiveAgentId(agentId);
    }
    setActiveChatIds(p => ({ ...p, [agentId]: chatId }));
    await loadMessages(agentId, chatId);
    setInput('');
  };

  const createNewChat = async (agentId) => {
    const hasUser = messages.some(m => m.role === 'user');
    if (agentId === activeAgentId && !hasUser) return; // don't create if current has no user msg
    const ag = AGENTS.find(a => a.id === agentId);
    try {
      const newChat = await apiCreateChat(agentId, 'ახალი ჩატი');
      setChatLists(p => ({ ...p, [agentId]: [newChat, ...(p[agentId] || [])] }));
      setActiveChatIds(p => ({ ...p, [agentId]: newChat.id }));
      if (agentId !== activeAgentId) { setActiveAgentId(agentId); }
      setMessages([welcomeMsg(ag)]);
      setInput('');
    } catch {
      // ignore
    }
  };

  const deleteChat = async (agentId, chatId, e) => {
    e.stopPropagation();
    await apiDeleteChat(agentId, chatId);
    const chats = await loadChats(agentId);
    if (chatId === activeChatIds[agentId]) {
      if (chats.length > 0) {
        setActiveChatIds(p => ({ ...p, [agentId]: chats[0].id }));
        if (agentId === activeAgentId) await loadMessages(agentId, chats[0].id);
      } else {
        // Create a fresh chat
        const ag = AGENTS.find(a => a.id === agentId);
        const newChat = await apiCreateChat(agentId, 'ახალი ჩატი');
        setChatLists(p => ({ ...p, [agentId]: [newChat] }));
        setActiveChatIds(p => ({ ...p, [agentId]: newChat.id }));
        if (agentId === activeAgentId) setMessages([welcomeMsg(ag)]);
      }
    }
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userText, actions: [] }];
    setMessages(newMessages);
    setLoading(true);

    // Save user message to DB
    const currentChatId = activeChatIds[activeAgentId];
    if (currentChatId) {
      apiAddMessage(activeAgentId, currentChatId, 'user', userText, []).catch(() => {});
    }

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
        const errMsg = { role: 'assistant', content: `⚠️ შეცდომა: ${err}`, actions: [] };
        setMessages([...newMessages, errMsg]);
        if (currentChatId) apiAddMessage(activeAgentId, currentChatId, 'assistant', errMsg.content, []).catch(() => {});
        return;
      }

      const data = await res.json();
      const assistantMsg = { role: 'assistant', content: data.message, actions: data.actions || [] };
      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);

      // Save assistant message + update chat title
      if (currentChatId) {
        apiAddMessage(activeAgentId, currentChatId, 'assistant', data.message, data.actions || []).catch(() => {});
        // Update chat list to refresh title
        loadChats(activeAgentId).then(chats => setChatLists(p => ({ ...p, [activeAgentId]: chats }))).catch(() => {});
      }

      const formAction = (data.actions || []).find(a => a.action === 'prepare_form');
      if (formAction?.entityId) {
        setTimeout(() => navigate(`/admin/products/${formAction.entityId}/edit`), 1200);
      } else if (formAction?.formData) {
        setTimeout(() => navigate('/admin/products/new', { state: { prefill: JSON.parse(formAction.formData) } }), 800);
      }
    } catch {
      const errMsg = { role: 'assistant', content: '⚠️ კავშირის შეცდომა. სცადე ხელახლა.', actions: [] };
      setMessages([...newMessages, errMsg]);
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
          const isOpen   = !!expanded[a.id];
          const chats    = chatLists[a.id] || [];

          return (
            <div key={a.id} className="agents-agent-group">
              {/* Agent header */}
              <div
                className={`agents-agent-header${isActive ? ' active' : ''}`}
                onClick={() => {
                  switchAgent(a.id);
                  setExpanded(p => ({ ...p, [a.id]: !p[a.id] }));
                }}
              >
                <div className="agents-agent-icon" style={{ background: a.color + '22', color: a.color }}>
                  <Icon size={15} />
                </div>
                <span className="agents-agent-name">{a.name}</span>
                {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </div>

              {isOpen && (
                <div className="agents-chat-list">
                  {chats.map(c => (
                    <div
                      key={c.id}
                      className={`agents-chat-item${c.id === activeChatIds[a.id] && isActive ? ' active' : ''}`}
                      onClick={() => selectChat(a.id, c.id)}
                    >
                      <span className="agents-chat-item-title">{c.title}</span>
                      <button className="agents-chat-del" onClick={(e) => deleteChat(a.id, c.id, e)}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
                  <button
                    className="agents-new-chat-inline"
                    onClick={(e) => { e.stopPropagation(); createNewChat(a.id); }}
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
          <button
            className="agents-new-chat-btn"
            onClick={() => createNewChat(activeAgentId)}
            style={{ background: agent.color }}
          >
            <Plus size={13} /> ახალი ჩატი
          </button>
        </div>

        {/* Messages */}
        <div className="agents-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`agents-msg agents-msg--${msg.role}`}>
              <div
                className="agents-msg-avatar"
                style={msg.role === 'assistant' ? { background: `linear-gradient(135deg, ${agent.color}, ${agent.color}99)` } : {}}
              >
                {msg.role === 'user' ? <User size={15} /> : <AgentIcon size={15} />}
              </div>
              <div className="agents-msg-body">
                <div
                  className="agents-msg-text"
                  style={msg.role === 'user' ? { background: agent.color } : {}}
                >
                  {msg.content.split('\n').map((line, j) => <span key={j}>{line}<br /></span>)}
                </div>
                {msg.actions?.length > 0 && (
                  <div className="agents-actions">
                    {msg.actions.map((a, j) => {
                      const def = AGENTS.find(ag => ag.hint === a.agent) || { icon: Zap, color: '#6b7280' };
                      const I   = def.icon;
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
              <div
                className="agents-msg-avatar"
                style={{ background: `linear-gradient(135deg, ${agent.color}, ${agent.color}99)` }}
              >
                <AgentIcon size={15} />
              </div>
              <div className="agents-msg-body">
                <div className="agents-typing">
                  <span style={{ background: agent.color }} />
                  <span style={{ background: agent.color }} />
                  <span style={{ background: agent.color }} />
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
              <button
                key={i}
                className="agents-quick-btn"
                onClick={() => sendMessage(q.text)}
              >
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
