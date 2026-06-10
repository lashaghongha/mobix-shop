import { useState, useEffect } from 'react';
import { api } from '../services/api';

const EMPTY = { icon: '', title: '', sub: '', order: 0 };

export default function AdminBenefits() {
  const [items, setItems]     = useState([]);
  const [editing, setEditing] = useState(null); // null | { ...item }
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState('');

  const load = () =>
    api.get('/admin/benefits').then(r => setItems(r.data || [])).catch(() => {});

  useEffect(() => { load(); }, []);

  const openNew  = () => setEditing({ ...EMPTY, order: items.length + 1 });
  const openEdit = (b) => setEditing({ ...b });
  const cancel   = () => setEditing(null);

  const save = async () => {
    if (!editing.icon || !editing.title) return;
    setSaving(true);
    try {
      if (editing.id) {
        await api.put(`/admin/benefits/${editing.id}`, editing);
      } else {
        await api.post('/admin/benefits', editing);
      }
      setMsg('შენახულია ✓');
      setTimeout(() => setMsg(''), 2000);
      setEditing(null);
      load();
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm('წაიშალოს?')) return;
    await api.delete(`/admin/benefits/${id}`);
    load();
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>უპირატესობები</h2>
        <button onClick={openNew} style={btnStyle('#c0152a')}>+ დამატება</button>
      </div>

      {msg && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>{msg}</div>}

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(b => (
          <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: '1.5px solid #eee', borderRadius: 12, padding: '14px 16px' }}>
            <span style={{ fontSize: 28 }}>{b.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{b.title}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{b.sub}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => openEdit(b)} style={btnStyle('#3b82f6', true)}>✏️ რედაქტირება</button>
              <button onClick={() => remove(b.id)} style={btnStyle('#ef4444', true)}>🗑️ წაშლა</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>
              {editing.id ? 'რედაქტირება' : 'ახალი უპირატესობა'}
            </h3>
            {[
              ['icon',  'იკონი (emoji)', 'text', '🚚'],
              ['title', 'სათაური',       'text', 'უფასო მიწოდება'],
              ['sub',   'აღწერა',        'text', '500₾-ზე მეტი'],
              ['order', 'თანმიმდევრობა', 'number', '1'],
            ].map(([key, label, type, ph]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>{label}</label>
                <input
                  type={type}
                  placeholder={ph}
                  value={editing[key]}
                  onChange={e => setEditing(p => ({ ...p, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e5e5e5', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={save} disabled={saving} style={{ ...btnStyle('#c0152a'), flex: 1 }}>
                {saving ? 'ინახება...' : 'შენახვა'}
              </button>
              <button onClick={cancel} style={{ ...btnStyle('#666'), flex: 1 }}>გაუქმება</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle = (bg, small = false) => ({
  background: bg, color: '#fff', border: 'none', borderRadius: 8,
  padding: small ? '7px 12px' : '10px 18px',
  fontSize: small ? 12 : 13, fontWeight: 600, cursor: 'pointer',
  whiteSpace: 'nowrap',
});
