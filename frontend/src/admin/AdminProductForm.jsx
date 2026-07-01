import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp, Upload, Link2 } from 'lucide-react';
import { api } from '../services/api';
import { getCategorySpecs } from './categorySpecs';
import './Dashboard.css';
import './AdminProductForm.css';

// ── Predefined spec groups (legacy fallback) ────────────────────────────────
const SPEC_GROUPS = [
  {
    key: 'brand_info', label: 'ბრენდი / ზომა',
    fields: [
      { key: 'brand_spec', label: 'ბრენდი', placeholder: 'Apple' },
      { key: 'weight', label: 'წონა', placeholder: '194 g' },
    ],
  },
  {
    key: 'battery', label: 'ელემენტი',
    fields: [
      { key: 'battery_capacity', label: 'ელემენტი', placeholder: '3279 mAh, Li-Ion' },
      { key: 'charging_speed', label: 'დამუხტვის სიჩქარე', placeholder: '25W' },
      { key: 'wireless_charging', label: 'უსადენო დამუხტვა', placeholder: 'Yes', type: 'yesno' },
      { key: 'wireless_speed', label: 'უსადენო დამუხტვის სიჩქარე', placeholder: '15W' },
      { key: 'nfc', label: 'NFC', placeholder: 'Yes', type: 'yesno' },
      { key: 'release_year', label: 'გამოშვების თარიღი', placeholder: '2024' },
    ],
  },
  {
    key: 'screen', label: 'ეკრანი',
    fields: [
      { key: 'screen_size', label: 'ეკრანის ზომა', placeholder: '6.1 inches' },
      { key: 'resolution', label: 'რეზოლუცია', placeholder: '2532×1170 px' },
      { key: 'refresh_rate', label: 'განახლების სიხშირე', placeholder: '120 Hz' },
      { key: 'brightness', label: 'სიკაშკაშე', placeholder: '2000 nits' },
      { key: 'screen_type', label: 'ეკრანის ტიპი', placeholder: 'Super Retina XDR OLED' },
      { key: 'screen_protection', label: 'ეკრანის დაცვა', placeholder: 'Ceramic Shield' },
    ],
  },
  {
    key: 'tech', label: 'ტექნიკური მახასიათებლები',
    fields: [
      { key: 'sim', label: 'SIM ბარათი', placeholder: 'Nano-SIM + eSIM' },
      { key: 'esim', label: 'E-SIM', placeholder: 'Yes', type: 'yesno' },
      { key: '5g', label: '5G', placeholder: 'Yes', type: 'yesno' },
      { key: 'body', label: 'კორპუსი', placeholder: 'Aluminum / Glass' },
      { key: 'ip', label: 'IP დაცვა', placeholder: 'IP68' },
      { key: 'chipset', label: 'ჩიპსეტი', placeholder: 'Apple A17 Pro' },
      { key: 'gpu', label: 'გრაფიკული პროცესორი', placeholder: 'Apple GPU' },
      { key: 'os', label: 'სისტემა', placeholder: 'iOS' },
      { key: 'os_version', label: 'სისტემის ვერსია', placeholder: 'iOS 18' },
      { key: 'stereo', label: 'სტერეო სპიკერი', placeholder: 'Yes', type: 'yesno' },
      { key: 'bluetooth', label: 'Bluetooth', placeholder: '5.3' },
    ],
  },
  {
    key: 'camera', label: 'კამერა',
    fields: [
      { key: 'main_camera', label: 'ძირითადი კამერა', placeholder: '48 MP, f/1.78' },
      { key: 'extra_cameras', label: 'დამატებითი კამერა', placeholder: 'Ultra Wide: 12 MP, f/2.2' },
      { key: 'front_camera', label: 'წინა კამერა', placeholder: '12 MP, f/1.9' },
      { key: 'main_video', label: 'ძირითადი კამერის ვიდეო', placeholder: '4K@60fps' },
      { key: 'front_video', label: 'წინა კამერის ვიდეო', placeholder: '4K@30fps' },
    ],
  },
  {
    key: 'memory', label: 'მეხსიერება',
    fields: [
      { key: 'storage', label: 'შიდა მეხსიერება', placeholder: '128 GB' },
      { key: 'storage_type', label: 'მეხსიერების სტანდარტი', placeholder: 'NVMe' },
      { key: 'ram', label: 'ოპერატიული მეხსიერება', placeholder: '8 GB' },
      { key: 'microsd', label: 'Micro SD სლოტი', placeholder: 'No', type: 'yesno' },
    ],
  },
  {
    key: 'ports', label: 'პორტები',
    fields: [
      { key: 'jack35', label: '3.5mm', placeholder: 'No', type: 'yesno' },
      { key: 'charging_port', label: 'დასამუხტი პორტი', placeholder: 'USB-C' },
    ],
  },
];

const EMPTY_FORM = {
  name: '', description: '', price: '', oldPrice: '', imageUrl: '',
  images: [], categoryId: '', brand: '', stock: '',
  isFeatured: false, isNew: false, hasInstallment: false,
  isPublished: false,
  searchAlias: '',
  specFields: {},
  colors: [],
  variants: [],
};

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = !!id && id !== 'new';

  const [form, setForm] = useState(EMPTY_FORM);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [openGroups, setOpenGroups] = useState({ brand_info: true, battery: true });
  const [agentPrefilled, setAgentPrefilled] = useState(false);

  // Color add
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('#000000');

  // Variant add
  const [variantLabel, setVariantLabel] = useState('');
  const [variantPrice, setVariantPrice] = useState('');
  const [variantOldPrice, setVariantOldPrice] = useState('');
  const [variantStock, setVariantStock] = useState('');

  useEffect(() => {
    api.adminGetCategories().then(r => setCategories(Array.isArray(r.data) ? r.data : []));

    // Pre-fill from AI agent
    if (!isEdit && location.state?.prefill) {
      const p = location.state.prefill;
      const specFields = {};
      const colors = [];
      if (p.specs) Object.entries(p.specs).forEach(([k, v]) => { specFields[k] = v; });
      if (p.colors) p.colors.forEach(c => colors.push({ name: c.name, hex: c.hex }));
      setForm({
        name: p.name || '', description: p.description || '',
        price: p.price || '', oldPrice: p.oldPrice || '',
        imageUrl: '', images: [],
        categoryId: p.categoryId || '',
        brand: p.brand || '',
        stock: p.stock || '',
        isFeatured: p.isFeatured || false,
        isNew: p.isNew ?? true,
        hasInstallment: p.hasInstallment ?? true,
        isPublished: false,
        searchAlias: p.searchAlias || '',
        specFields,
        colors,
        variants: (p.variants || []).map(v => ({
          label: v.label, price: v.price, oldPrice: v.oldPrice ?? '', stock: v.stock ?? 10
        })),
      });
      setAgentPrefilled(true);
    }

    if (isEdit) {
      api.getProduct(id).then(r => {
        const p = r.data;
        // Parse existing specs back into specFields + colors
        const specFields = {};
        const colors = [];
        if (p.specs) {
          Object.entries(p.specs).forEach(([k, v]) => {
            if (k.startsWith('color_')) {
              const [, name] = k.split('color_');
              colors.push({ name, hex: v });
            } else {
              specFields[k] = v;
            }
          });
        }
        setForm({
          name: p.name, description: p.description,
          price: p.price, oldPrice: p.oldPrice ?? '',
          imageUrl: p.imageUrl, images: p.images || [],
          categoryId: p.categoryId, brand: p.brand, stock: p.stock,
          isFeatured: p.isFeatured, isNew: p.isNew, hasInstallment: p.hasInstallment,
          isPublished: p.isPublished,
          searchAlias: p.searchAlias || '',
          specFields, colors,
          variants: p.variants || [],
        });
      });
    }
  }, [id]);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setSpec = (k, v) => setForm(f => ({ ...f, specFields: { ...f.specFields, [k]: v } }));

  const mainImgRef = useRef();
  const extraImgRef = useRef();
  const [uploading, setUploading] = useState({ main: false, extra: false });

  const uploadFile = async (file, target) => {
    setUploading(u => ({ ...u, [target]: true }));
    try {
      const { data } = await api.adminUploadImage(file);
      if (target === 'main') {
        setField('imageUrl', data.url);
      } else {
        setForm(f => ({ ...f, images: [...f.images, data.url] }));
      }
    } catch {
      alert('ატვირთვა ვერ მოხდა');
    } finally {
      setUploading(u => ({ ...u, [target]: false }));
    }
  };

  const removeImage = (i) => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const addColor = () => {
    if (!colorName.trim()) return;
    setForm(f => ({ ...f, colors: [...f.colors, { name: colorName, hex: colorHex }] }));
    setColorName(''); setColorHex('#000000');
  };
  const removeColor = (i) => setForm(f => ({ ...f, colors: f.colors.filter((_, idx) => idx !== i) }));

  const addVariant = () => {
    if (!variantLabel.trim() || !variantPrice) return;
    setForm(f => ({ ...f, variants: [...f.variants, {
      label: variantLabel.trim(),
      price: parseFloat(variantPrice),
      oldPrice: variantOldPrice ? parseFloat(variantOldPrice) : null,
      stock: parseInt(variantStock) || 0,
    }]}));
    setVariantLabel(''); setVariantPrice(''); setVariantOldPrice(''); setVariantStock('');
  };
  const removeVariant = (i) => setForm(f => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }));

  const toggleGroup = (key) => setOpenGroups(g => ({ ...g, [key]: !g[key] }));

  const buildSpecs = () => {
    const specs = {};
    Object.entries(form.specFields).forEach(([k, v]) => {
      if (v && v.trim()) specs[k] = v.trim();
    });
    form.colors.forEach(({ name, hex }) => {
      specs[`color_${name}`] = hex;
    });
    return specs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.price || !form.categoryId || !form.brand) {
      setError('შეავსეთ სავალდებულო ველები (*).'); return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name, description: form.description,
        price: parseFloat(form.price),
        oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null,
        imageUrl: form.imageUrl, images: form.images,
        categoryId: parseInt(form.categoryId), brand: form.brand,
        stock: parseInt(form.stock) || 0,
        isFeatured: form.isFeatured, isNew: form.isNew, hasInstallment: form.hasInstallment,
        isPublished: form.isPublished,
        searchAlias: form.searchAlias || '',
        specs: buildSpecs(),
        variants: form.variants.map(v => ({
          label: v.label,
          price: parseFloat(v.price) || 0,
          oldPrice: v.oldPrice ? parseFloat(v.oldPrice) : null,
          stock: parseInt(v.stock) || 0,
        })),
      };
      if (isEdit) await api.adminUpdateProduct(id, payload);
      else await api.adminCreateProduct(payload);
      navigate('/admin/products');
    } catch (err) {
      const d = err.response?.data;
      const msg = typeof d === 'string' ? d : d?.title || d?.errors ? JSON.stringify(d.errors || d) : err.message;
      setError('შეცდომა: ' + msg);
    } finally {
      setSaving(false);
    }
  };


  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <Link to="/admin/products" className="adm-btn adm-btn-secondary" style={{ padding: '8px 12px' }}>
          <ArrowLeft size={16} />
        </Link>
        <h1 className="adm-page-title" style={{ margin: 0 }}>
          {isEdit ? 'პროდუქტის რედაქტირება' : 'ახალი პროდუქტი'}
        </h1>
      </div>

      {agentPrefilled && (
        <div style={{ background: '#dbeafe', color: '#1e40af', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 13, fontWeight: 600 }}>
          🤖 AI-მ შეავსო ფორმა. შეამოწმე და დააჭირე "Draft-ად შენახვა" ან "გამოქვეყნება".
        </div>
      )}
      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 13 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* ── Step 1: Category picker (always visible) ── */}
        {!isEdit && (
          <div className="adm-card" style={{ marginBottom: 18 }}>
            <div className="adm-card-title" style={{ marginBottom: 12 }}>
              {form.categoryId ? '✅ კატეგორია არჩეულია' : '1. ჯერ აირჩიე კატეგორია'}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {categories.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setField('categoryId', String(c.id))}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 10,
                    border: form.categoryId === String(c.id) ? '2px solid #c0152a' : '2px solid #e5e7eb',
                    background: form.categoryId === String(c.id) ? '#fff1f2' : '#fff',
                    color: form.categoryId === String(c.id) ? '#c0152a' : '#444',
                    fontWeight: form.categoryId === String(c.id) ? 700 : 500,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all .15s',
                  }}
                >
                  {c.nameGe}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Rest of form (only after category chosen) ── */}
        {(form.categoryId || isEdit) && (
        <div className="apf-layout">

          {/* ── Left column ── */}
          <div className="apf-left">

            {/* Basic info */}
            <div className="adm-card">
              <div className="adm-card-title">ძირითადი ინფო</div>
              <div className="apf-fields">
                <Field label="სახელი *">
                  <input value={form.name} onChange={e => setField('name', e.target.value)} placeholder="პროდუქტის სახელი" required />
                </Field>
                <Field label="ქართული სერჩის საკვანძო სიტყვები">
                  <input
                    value={form.searchAlias}
                    onChange={e => setField('searchAlias', e.target.value)}
                    placeholder="ქართული სიტყვები მძიმით, მაგ: სამსუნგი, გალაქსი..."
                  />
                  <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>
                    მომხმარებელს არ ეჩვენება — მხოლოდ სერჩისთვის (მძიმით გამოყავი)
                  </div>
                </Field>
                <Field label="ბრენდი *">
                  <input value={form.brand} onChange={e => setField('brand', e.target.value)} placeholder="მაგ: Samsung, Apple, Sony..." required />
                </Field>
                {isEdit && (
                  <Field label="კატეგორია *">
                    <select value={form.categoryId} onChange={e => setField('categoryId', e.target.value)} required>
                      <option value="">აირჩიე...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.nameGe}</option>)}
                    </select>
                  </Field>
                )}
                <Field label="აღწერა">
                  <textarea value={form.description} onChange={e => setField('description', e.target.value)} placeholder="პროდუქტის სრული აღწერა..." />
                </Field>
              </div>
            </div>

            {/* Price & stock */}
            <div className="adm-card">
              <div className="adm-card-title">ფასი და მარაგი</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <Field label="ფასი (₾) *">
                  <input type="number" min="0" step="0.01" value={form.price} onChange={e => setField('price', e.target.value)} placeholder="1999" required />
                </Field>
                <Field label="ძველი ფასი (₾)">
                  <input type="number" min="0" step="0.01" value={form.oldPrice} onChange={e => setField('oldPrice', e.target.value)} placeholder="2299" />
                </Field>
                <Field label="მარაგი">
                  <input type="number" min="0" value={form.stock} onChange={e => setField('stock', e.target.value)} placeholder="10" />
                </Field>
              </div>
            </div>

            {/* Flags */}
            <div className="adm-card">
              <div className="adm-card-title">პარამეტრები</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['isFeatured', 'Featured — მთავარ გვერდზე ჩვენება'],
                  ['isNew', 'New — "ახალი" ბეჯი'],
                  ['hasInstallment', 'განვადება ხელმისაწვდომია'],
                ].map(([key, lbl]) => (
                  <label key={key} className="adm-check-row">
                    <input type="checkbox" checked={form[key]} onChange={e => setField(key, e.target.checked)} />
                    {lbl}
                  </label>
                ))}
              </div>
            </div>

            {/* ── Colors ── */}
            <div className="adm-card">
              <div className="adm-card-title">ფერები</div>
              <div className="apf-color-add">
                <input
                  value={colorName}
                  onChange={e => setColorName(e.target.value)}
                  placeholder="ფერის სახელი (მაგ: Midnight)"
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addColor())}
                />
                <input type="color" value={colorHex} onChange={e => setColorHex(e.target.value)} className="apf-color-picker" title="HEX კოდი" />
                <button type="button" className="adm-btn adm-btn-primary" style={{ padding: '8px 12px' }} onClick={addColor}>
                  <Plus size={16} />
                </button>
              </div>
              <div className="apf-color-list">
                {form.colors.length === 0 && (
                  <div style={{ color: '#aaa', fontSize: 13 }}>ფერები არ არის დამატებული</div>
                )}
                {form.colors.map((c, i) => (
                  <div key={i} className="apf-color-item">
                    <span className="apf-color-dot" style={{ background: c.hex }} />
                    <span className="apf-color-name">{c.name}</span>
                    <span className="apf-color-hex">{c.hex}</span>
                    <button type="button" onClick={() => removeColor(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', marginLeft: 'auto' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* ── Variants ── */}
            <div className="adm-card">
              <div className="adm-card-title">მეხსიერების ვარიანტები</div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>
                მაგ: 128GB, 256GB, 512GB — თითოეულს საკუთარი ფასი და მარაგი
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 8, marginBottom: 8, alignItems: 'end' }}>
                <div className="adm-field" style={{ marginBottom: 0 }}>
                  <label>მეხსიერება *</label>
                  <input value={variantLabel} onChange={e => setVariantLabel(e.target.value)} placeholder="256GB" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addVariant())} />
                </div>
                <div className="adm-field" style={{ marginBottom: 0 }}>
                  <label>ფასი (₾) *</label>
                  <input type="number" min="0" value={variantPrice} onChange={e => setVariantPrice(e.target.value)} placeholder="1999" />
                </div>
                <div className="adm-field" style={{ marginBottom: 0 }}>
                  <label>ძვ. ფასი (₾)</label>
                  <input type="number" min="0" value={variantOldPrice} onChange={e => setVariantOldPrice(e.target.value)} placeholder="2299" />
                </div>
                <div className="adm-field" style={{ marginBottom: 0 }}>
                  <label>მარაგი</label>
                  <input type="number" min="0" value={variantStock} onChange={e => setVariantStock(e.target.value)} placeholder="10" />
                </div>
                <button type="button" className="adm-btn adm-btn-primary" style={{ padding: '8px 12px' }} onClick={addVariant}>
                  <Plus size={16} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                {form.variants.length === 0 && (
                  <div style={{ color: '#aaa', fontSize: 13 }}>ვარიანტები არ არის დამატებული</div>
                )}
                {form.variants.map((v, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f9f9f9', borderRadius: 8, padding: '8px 12px', border: '1px solid #eee' }}>
                    <span style={{ fontWeight: 700, fontSize: 13, minWidth: 60 }}>{v.label}</span>
                    <span style={{ color: '#c0152a', fontWeight: 700, fontSize: 13 }}>₾{v.price}</span>
                    {v.oldPrice && <span style={{ color: '#bbb', textDecoration: 'line-through', fontSize: 12 }}>₾{v.oldPrice}</span>}
                    <span style={{ color: '#888', fontSize: 12, marginLeft: 4 }}>მარაგი: {v.stock}</span>
                    <button type="button" onClick={() => removeVariant(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', marginLeft: 'auto' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="apf-right">

            {/* Images */}
            <div className="adm-card">
              <div className="adm-card-title">სურათები</div>

              {/* Main image */}
              <div className="apf-img-label">მთავარი სურათი</div>
              <input
                ref={mainImgRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => e.target.files[0] && uploadFile(e.target.files[0], 'main')}
              />
              <div className="apf-main-img-row">
                {form.imageUrl ? (
                  <div className="apf-main-preview">
                    <img src={form.imageUrl} alt="" />
                    <button type="button" className="apf-img-remove" onClick={() => setField('imageUrl', '')}>✕</button>
                  </div>
                ) : (
                  <div
                    className="apf-upload-zone"
                    onClick={() => mainImgRef.current.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) uploadFile(f, 'main'); }}
                  >
                    {uploading.main ? <span className="apf-uploading">იტვირთება…</span> : (
                      <><Upload size={22} /><span>ატვირთე ან გადმოიტანე</span></>
                    )}
                  </div>
                )}
              </div>
              <div className="apf-or-row">
                <div className="apf-or-line" /><span>ან URL</span><div className="apf-or-line" />
              </div>
              <div className="apf-url-row">
                <Link2 size={14} className="apf-url-icon" />
                <input
                  className="apf-url-input"
                  value={form.imageUrl}
                  onChange={e => setField('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Extra images */}
              <div className="apf-img-label" style={{ marginTop: 18 }}>დამატებითი სურათები</div>
              <input
                ref={extraImgRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={e => {
                  Array.from(e.target.files).forEach(f => uploadFile(f, 'extra'));
                  e.target.value = '';
                }}
              />
              <div className="apf-extra-grid">
                {form.images.map((img, i) => (
                  <div key={i} className="apf-extra-item">
                    <img src={img} alt="" />
                    <button type="button" className="apf-img-remove" onClick={() => removeImage(i)}>✕</button>
                  </div>
                ))}
                <div
                  className="apf-extra-add"
                  onClick={() => extraImgRef.current.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); Array.from(e.dataTransfer.files).forEach(f => uploadFile(f, 'extra')); }}
                >
                  {uploading.extra ? <span style={{ fontSize: 10, color: '#888' }}>…</span> : <Plus size={18} />}
                </div>
              </div>
            </div>

            {/* ── Spec groups (category-specific) ── */}
            <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px 14px', borderBottom: '1.5px solid #eee' }}>
                <div className="adm-card-title" style={{ margin: 0 }}>ტექნიკური მახასიათებლები</div>
                <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
                  {form.categoryId ? 'ცარიელი ველები არ შეინახება' : '⚠ ჯერ კატეგორია აირჩიე'}
                </div>
              </div>
              {form.categoryId ? (
                getCategorySpecs(form.categoryId).map(({ group, fields }) => (
                  <div key={group} className="apf-spec-group">
                    <button
                      type="button"
                      className="apf-spec-header"
                      onClick={() => toggleGroup(group)}
                    >
                      <span>{group}</span>
                      {openGroups[group] ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                    {openGroups[group] !== false && (
                      <div className="apf-spec-body">
                        {fields.map(({ key: fk, label: fl, placeholder, type, options }) => (
                          <div key={fk} className="apf-spec-row">
                            <label className="apf-spec-label">{fl}</label>
                            {type === 'yesno' ? (
                              <select
                                value={form.specFields[fk] || ''}
                                onChange={e => setSpec(fk, e.target.value)}
                                className="apf-spec-select"
                              >
                                <option value="">—</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                            ) : type === 'select' ? (
                              <select
                                value={form.specFields[fk] || ''}
                                onChange={e => setSpec(fk, e.target.value)}
                                className="apf-spec-select"
                              >
                                <option value="">—</option>
                                {options.map(o => <option key={o} value={o}>{o}</option>)}
                              </select>
                            ) : (
                              <input
                                value={form.specFields[fk] || ''}
                                onChange={e => setSpec(fk, e.target.value)}
                                placeholder={placeholder}
                                className="apf-spec-input"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ padding: '30px 20px', textAlign: 'center', color: '#bbb', fontSize: 14 }}>
                  კატეგორია არჩეულის შემდეგ მახასიათებლები გამოჩნდება
                </div>
              )}
            </div>

          </div>
        </div>

        )} {/* end category-dependent block */}

        {/* Submit */}
        <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Draft */}
          <button
            type="button"
            className="adm-btn adm-btn-secondary"
            style={{ padding: '13px 24px', fontSize: 14 }}
            disabled={saving}
            onClick={() => { setField('isPublished', false); setTimeout(() => document.getElementById('apf-submit').click(), 0); }}
          >
            {saving && !form.isPublished ? 'ინახება...' : '📝 Draft-ად შენახვა'}
          </button>
          {/* Publish */}
          <button
            id="apf-submit"
            type="submit"
            className="adm-btn adm-btn-primary"
            style={{ padding: '13px 28px', fontSize: 14 }}
            disabled={saving}
            onClick={() => setField('isPublished', true)}
          >
            {saving && form.isPublished ? 'ქვეყნდება...' : isEdit ? '🌐 განახლება და გამოქვეყნება' : '🌐 გამოქვეყნება'}
          </button>
          <Link to="/admin/products" className="adm-btn adm-btn-secondary" style={{ padding: '13px 20px', fontSize: 14 }}>
            გაუქმება
          </Link>
          {!form.isPublished && (
            <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              ⚠ Draft — საიტზე არ ჩანს
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="adm-field" style={{ marginBottom: 0 }}>
      <label>{label}</label>
      {children}
    </div>
  );
}
