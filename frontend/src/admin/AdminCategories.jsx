import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { api } from '../services/api';
import './Dashboard.css';
import './AdminCategories.css';

const EMPTY = { name: '', nameGe: '', icon: '', slug: '', parentId: null };

const PRESET_CATEGORIES = [
  { name: 'Smartphones',     nameGe: 'სმარტფონები',      slug: 'smartphones',      icon: '📱' },
  { name: 'Tablets',         nameGe: 'ტაბლეტები',         slug: 'tablets',           icon: '📟' },
  { name: 'Laptops',         nameGe: 'ლეპტოპები',         slug: 'laptops',           icon: '💻' },
  { name: 'TVs',             nameGe: 'ტელევიზორები',      slug: 'tvs',               icon: '📺' },
  { name: 'Audio',           nameGe: 'აუდიო',             slug: 'audio',             icon: '🎧' },
  { name: 'Cameras',         nameGe: 'კამერები',          slug: 'cameras',           icon: '📷' },
  { name: 'Gaming',          nameGe: 'გეიმინგი',          slug: 'gaming',            icon: '🎮' },
  { name: 'Smart Home',      nameGe: 'სმარტ ჰომი',        slug: 'smart-home',        icon: '🏠' },
  { name: 'Smartwatches',    nameGe: 'სმარტ საათები',     slug: 'smartwatches',      icon: '⌚' },
  { name: 'Accessories',     nameGe: 'აქსესუარები',       slug: 'accessories',       icon: '🔌' },
  { name: 'Printers',        nameGe: 'პრინტერები',        slug: 'printers',          icon: '🖨️' },
  { name: 'Monitors',        nameGe: 'მონიტორები',        slug: 'monitors',          icon: '🖥️' },
  { name: 'Networking',      nameGe: 'ქსელი',             slug: 'networking',        icon: '📡' },
  { name: 'Drones',          nameGe: 'დრონები',           slug: 'drones',            icon: '✈️' },
  { name: 'E-Readers',       nameGe: 'ელ-წიგნები',        slug: 'e-readers',         icon: '📚' },
  { name: 'Power Banks',     nameGe: 'პაუერბანკები',      slug: 'power-banks',       icon: '🔋' },
];

// Popular emoji icons for quick pick
const QUICK_ICONS = [
  '📱','💻','📺','🎧','📷','🎮','🏠','⌚',
  '🖨️','🖥️','⌨️','🖱️','📡','🔋','💡','🎙️',
  '📻','🎵','🔌','🔧','📦','🛒','🎁','✨',
];

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [modal, setModal] = useState(null); // null | 'add' | {id, ...cat}
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const load = () => api.adminGetCategories().then(r => setCats(r.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setError(''); setModal('add'); };
  const openEdit = (cat) => {
    setForm({ name: cat.name, nameGe: cat.nameGe, icon: cat.icon, slug: cat.slug, parentId: cat.parentId ?? null });
    setError('');
    setModal(cat);
  };

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Auto-generate slug from English name + show suggestions
  const handleNameChange = (v) => {
    setF('name', v);
    if (modal === 'add') {
      setF('slug', v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
    if (v.trim().length >= 2) {
      const filtered = PRESET_CATEGORIES.filter(p =>
        p.name.toLowerCase().includes(v.toLowerCase()) ||
        p.nameGe.toLowerCase().includes(v.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const applySuggestion = (preset) => {
    setForm(f => ({
      ...f,
      name: preset.name,
      nameGe: f.nameGe || preset.nameGe,
      slug: preset.slug,
      icon: f.icon || preset.icon,
    }));
    setSuggestions([]);
  };

  const handleSave = async () => {
    if (!form.nameGe.trim() || !form.name.trim()) { setError('სახელები სავალდებულოა'); return; }
    setSaving(true); setError('');
    try {
      const payload = { ...form, parentId: form.parentId ? parseInt(form.parentId) : null };
      if (modal === 'add') await api.adminCreateCategory(payload);
      else await api.adminUpdateCategory(modal.id, payload);
      await load();
      setModal(null);
    } catch (e) {
      setError(e.response?.data || 'შეცდომა');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('დარწმუნებული ხარ? წაშლა შეუძლებელია თუ კატეგორიაში პროდუქტებია.')) return;
    setDeleting(id);
    try {
      await api.adminDeleteCategory(id);
      await load();
    } catch (e) {
      alert(e.response?.data || 'შეცდომა');
    } finally { setDeleting(null); }
  };

  // Group: top-level + children
  const topLevel = (cats || []).filter(c => !c.parentId);
  const children = (parentId) => (cats || []).filter(c => c.parentId === parentId);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <h1 className="adm-page-title" style={{ margin: 0 }}>კატეგორიები</h1>
        <button className="adm-btn adm-btn-primary" onClick={openAdd}>
          <Plus size={16} /> კატეგორიის დამატება
        </button>
      </div>

      <div className="adm-card" style={{ padding: 0 }}>
        <table className="adm-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th style={{ width: 44 }}>Icon</th>
              <th>სახელი (GE)</th>
              <th>სახელი (EN)</th>
              <th>Slug</th>
              <th>პროდუქტები</th>
              <th>მოქმედება</th>
            </tr>
          </thead>
          <tbody>
            {topLevel.map(cat => (
              <>
                <CatRow
                  key={cat.id}
                  cat={cat}
                  onEdit={() => openEdit(cat)}
                  onDelete={() => handleDelete(cat.id)}
                  deleting={deleting === cat.id}
                  indent={false}
                />
                {children(cat.id).map(child => (
                  <CatRow
                    key={child.id}
                    cat={child}
                    onEdit={() => openEdit(child)}
                    onDelete={() => handleDelete(child.id)}
                    deleting={deleting === child.id}
                    indent={true}
                  />
                ))}
              </>
            ))}
            {cats.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#aaa', padding: 40 }}>კატეგორიები არ არის</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal ── */}
      {modal && (
        <div className="cat-modal-bg" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="cat-modal">
            <div className="cat-modal-header">
              <span>{modal === 'add' ? 'ახალი კატეგორია' : 'კატეგორიის რედაქტირება'}</span>
              <button className="cat-modal-close" onClick={() => setModal(null)}><X size={18} /></button>
            </div>

            {error && (
              <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: 8, marginBottom: 14, fontSize: 13 }}>
                {error}
              </div>
            )}

            <div className="cat-modal-body">
              {/* Icon preview + quick pick */}
              <div className="cat-icon-section">
                <div className="cat-icon-preview">{form.icon || '?'}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>
                    სწრაფი არჩევა
                  </div>
                  <div className="cat-icon-grid">
                    {QUICK_ICONS.map(ic => (
                      <button
                        key={ic}
                        type="button"
                        className={`cat-icon-btn${form.icon === ic ? ' active' : ''}`}
                        onClick={() => setF('icon', ic)}
                      >
                        {ic}
                      </button>
                    ))}
                  </div>
                  <div className="adm-field" style={{ marginTop: 8 }}>
                    <label>ან ხელით შეიყვანე emoji</label>
                    <input
                      value={form.icon}
                      onChange={e => setF('icon', e.target.value)}
                      placeholder="📱"
                      maxLength={8}
                      style={{ width: 80 }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
                <div className="adm-field">
                  <label>სახელი ქართულად *</label>
                  <input value={form.nameGe} onChange={e => setF('nameGe', e.target.value)} placeholder="სმარტფონები" />
                </div>
                <div className="adm-field">
                  <label>სახელი ინგლისურად *</label>
                  <select
                    value={form.name}
                    onChange={e => {
                      const val = e.target.value;
                      const preset = PRESET_CATEGORIES.find(p => p.name === val);
                      if (preset) {
                        setForm(f => ({ ...f, name: preset.name, nameGe: f.nameGe || preset.nameGe, slug: f.slug || preset.slug, icon: f.icon || preset.icon }));
                      } else {
                        handleNameChange(val);
                      }
                    }}
                  >
                    <option value="">— აირჩიე ან ჩაწერე —</option>
                    {PRESET_CATEGORIES.map(p => (
                      <option key={p.name} value={p.name}>{p.name} — {p.nameGe}</option>
                    ))}
                  </select>
                  <div style={{ position: 'relative', marginTop: 6 }}>
                    <input
                      value={form.name}
                      onChange={e => handleNameChange(e.target.value)}
                      onBlur={() => setTimeout(() => setSuggestions([]), 150)}
                      placeholder="ან ხელით: Smartphones"
                      style={{ width: '100%' }}
                    />
                    {suggestions.length > 0 && (
                      <div className="cat-suggestions">
                        {suggestions.map(p => (
                          <div
                            key={p.name}
                            className="cat-suggestion-item"
                            onMouseDown={() => applySuggestion(p)}
                          >
                            <span className="cat-sug-icon">{p.icon}</span>
                            <span className="cat-sug-en">{p.name}</span>
                            <span className="cat-sug-ge">{p.nameGe}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="adm-field" style={{ gridColumn: '1 / -1' }}>
                  <label>Slug (URL) — ავტომატურად ივსება</label>
                  <input value={form.slug} onChange={e => setF('slug', e.target.value)} placeholder="smartphones" />
                </div>
              </div>
            </div>

            <div className="cat-modal-footer">
              <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving}>
                <Check size={15} /> {saving ? 'ინახება...' : modal === 'add' ? 'შენახვა' : 'განახლება'}
              </button>
              <button className="adm-btn adm-btn-secondary" onClick={() => setModal(null)}>გაუქმება</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CatRow({ cat, onEdit, onDelete, deleting, indent }) {
  return (
    <tr>
      <td style={{ color: '#aaa' }}>{cat.id}</td>
      <td style={{ fontSize: 22, textAlign: 'center' }}>{cat.icon}</td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {indent && <span style={{ color: '#ddd', fontSize: 16 }}>└</span>}
          <span style={{ fontWeight: indent ? 500 : 700 }}>{cat.nameGe}</span>
        </div>
      </td>
      <td style={{ color: '#666' }}>{cat.name}</td>
      <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#888' }}>{cat.slug}</td>
      <td>
        <span style={{ fontWeight: 700, color: cat.productCount > 0 ? '#111' : '#bbb' }}>
          {cat.productCount}
        </span>
      </td>
      <td>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="adm-btn adm-btn-secondary" style={{ padding: '6px 10px' }} onClick={onEdit}>
            <Pencil size={14} />
          </button>
          <button
            className="adm-btn adm-btn-danger"
            style={{ padding: '6px 10px' }}
            onClick={onDelete}
            disabled={deleting || cat.productCount > 0}
            title={cat.productCount > 0 ? 'პროდუქტები არსებობს' : 'წაშლა'}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
