import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './ProductDetail.css';

// Maps admin spec keys → Georgian labels + group info
const SPEC_MAP = [
  {
    group: 'ბრენდი / ზომა', icon: '✦',
    keys: [
      ['brand_spec', 'ბრენდი'],
      ['weight', 'წონა'],
      ['release_year', 'გამოშვების წელი'],
    ],
  },
  {
    group: 'ელემენტი', icon: '🔋',
    keys: [
      ['battery_capacity', 'ელემენტი'],
      ['charging_speed', 'დამუხტვის სიჩქარე'],
      ['wireless_charging', 'უსადენო დამუხტვა'],
      ['wireless_speed', 'უსადენო დამუხტვის სიჩქარე'],
      ['nfc', 'NFC'],
    ],
  },
  {
    group: 'ეკრანი', icon: '📱',
    keys: [
      ['screen_size', 'ეკრანის ზომა'],
      ['resolution', 'რეზოლუცია'],
      ['refresh_rate', 'განახლების სიხშირე'],
      ['brightness', 'სიკაშკაშე'],
      ['screen_type', 'ეკრანის ტიპი'],
      ['screen_protection', 'ეკრანის დაცვა'],
    ],
  },
  {
    group: 'ტექნიკური მახასიათებლები', icon: '⚙️',
    keys: [
      ['sim', 'SIM ბარათი'],
      ['esim', 'E-SIM'],
      ['5g', '5G'],
      ['body', 'კორპუსი'],
      ['ip', 'IP დაცვა'],
      ['chipset', 'ჩიპსეტი'],
      ['gpu', 'გრაფიკული პროცესორი'],
      ['os', 'სისტემა'],
      ['os_version', 'სისტემის ვერსია'],
      ['stereo', 'სტერეო სპიკერი'],
      ['bluetooth', 'Bluetooth'],
    ],
  },
  {
    group: 'კამერა', icon: '📷',
    keys: [
      ['main_camera', 'ძირითადი კამერა'],
      ['extra_cameras', 'დამატებითი კამერა'],
      ['front_camera', 'წინა კამერა'],
      ['main_video', 'ძირითადი კამერის ვიდეო'],
      ['front_video', 'წინა კამერის ვიდეო'],
    ],
  },
  {
    group: 'მეხსიერება', icon: '💾',
    keys: [
      ['storage', 'შიდა მეხსიერება'],
      ['storage_type', 'მეხსიერების სტანდარტი'],
      ['ram', 'ოპერატიული მეხსიერება'],
      ['microsd', 'Micro SD სლოტი'],
    ],
  },
  {
    group: 'პორტები', icon: '🔌',
    keys: [
      ['jack35', '3.5mm'],
      ['charging_port', 'დასამუხტი პორტი'],
    ],
  },
];

// Build spec groups from product.specs dict
function buildSpecGroups(specs) {
  if (!specs || Object.keys(specs).length === 0) return [];
  const groups = [];
  for (const { group, icon, keys } of SPEC_MAP) {
    const rows = [];
    for (const [key, label] of keys) {
      if (specs[key]) rows.push([label, specs[key]]);
    }
    if (rows.length > 0) groups.push({ group, icon, rows });
  }
  // Any unknown keys not in map → extra group
  const knownKeys = new Set([
    ...SPEC_MAP.flatMap(g => g.keys.map(([k]) => k)),
  ]);
  const extraRows = Object.entries(specs)
    .filter(([k]) => !knownKeys.has(k) && !k.startsWith('color_'))
    .map(([k, v]) => [k, v]);
  if (extraRows.length > 0) groups.push({ group: 'სხვა', icon: '📋', rows: extraRows });
  return groups;
}

// Parse colors from specs (color_Name → hex)
function parseColors(specs) {
  if (!specs) return [];
  return Object.entries(specs)
    .filter(([k]) => k.startsWith('color_'))
    .map(([k, hex]) => ({ label: k.replace('color_', ''), hex }));
}

const PREVIEW_GROUPS = 2;

function SpecsTable({ specs }) {
  const [expanded, setExpanded] = useState(false);
  const groups = buildSpecGroups(specs);

  if (groups.length === 0) return null;

  const visibleSpecs = expanded ? groups : groups.slice(0, PREVIEW_GROUPS);

  return (
    <div className="specs-section">
      <h3 className="specs-title">ტექნიკური მახასიათებლები</h3>
      <div className={`specs-body${expanded ? ' expanded' : ''}`}>
        {visibleSpecs.map(({ group, icon, rows }) => (
          <div className="spec-group" key={group}>
            <div className="spec-group-header">
              <span className="spec-group-label">
                <span className="spec-icon">{icon}</span>{group}
              </span>
            </div>
            <table className="spec-table">
              <tbody>
                {rows.map(([k, v]) => (
                  <tr key={k}>
                    <td className="spec-key">{k}</td>
                    <td className="spec-val">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        {!expanded && groups.length > PREVIEW_GROUPS && <div className="specs-fade" />}
      </div>
      <button className="specs-toggle-btn" onClick={() => setExpanded(e => !e)}>
        {expanded ? (
          <>აკეცვა <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg></>
        ) : (
          <>მეტის ნახვა <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></>
        )}
      </button>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct]         = useState(null);
  const [qty, setQty]                 = useState(1);
  const [added, setAdded]             = useState(false);
  const [activeImg, setActiveImg]     = useState(0);
  const [color, setColor]             = useState(0);
  const [accessories, setAccessories] = useState([]);
  const { addToCart, loading } = useCart();

  useEffect(() => {
    api.getProduct(id).then(r => { setProduct(r.data); setActiveImg(0); setColor(0); });
    api.getProducts({ categoryId: 5, pageSize: 8 }).then(r => setAccessories(r.data.items));
  }, [id]);

  if (!product) return <div className="loading-page"><div className="spinner" /></div>;

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  const colors = parseColors(product.specs);

  // Gallery
  const gallery = product.images?.length > 1
    ? product.images
    : [product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl];

  const handleAdd = async () => {
    await addToCart(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-detail container">
      <div className="breadcrumb">
        <Link to="/">მთავარი</Link> ›
        <Link to={`/products?categoryId=${product.categoryId}`}>{product.category?.nameGe}</Link> ›
        <span>{product.name}</span>
      </div>

      <div className="detail-grid">
        {/* ── Gallery ── */}
        <div className="detail-images">
          <div className="main-image">
            <img src={gallery[activeImg] || product.imageUrl} alt={product.name} />
            {discount && <span className="detail-discount">-{discount}%</span>}
          </div>
          <div className="thumb-strip">
            {gallery.map((src, i) => (
              <button
                key={i}
                className={`thumb-btn${activeImg === i ? ' active' : ''}`}
                onClick={() => setActiveImg(i)}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Info ── */}
        <div className="detail-info">
          <div className="detail-brand">{product.brand}</div>
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-price-block">
            <span className="detail-price">{product.price.toLocaleString()} ₾</span>
            {product.oldPrice && <span className="detail-old-price">{product.oldPrice.toLocaleString()} ₾</span>}
            {discount && <span className="detail-save">დაზოგე {(product.oldPrice - product.price).toLocaleString()} ₾</span>}
          </div>

          {/* ── Colors from DB ── */}
          {colors.length > 0 && (
            <div className="variant-group">
              <div className="variant-label">ფერი: <strong>{colors[color]?.label}</strong></div>
              <div className="color-options">
                {colors.map((c, i) => {
                  const isLight = c.hex === '#ffffff' || c.hex === '#f0f0f0' || c.hex === '#fff';
                  return (
                    <button
                      key={i}
                      className={`color-btn${color === i ? ' active' : ''}`}
                      style={{ background: c.hex, border: isLight ? '1.5px solid #ddd' : 'none' }}
                      title={c.label}
                      onClick={() => setColor(i)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {product.hasInstallment && (
            <div className="installment-block">
              <div className="inst-icon">💳</div>
              <div>
                <strong>0%-იანი განვადება</strong>
                <p>12 თვე × {Math.round(product.price / 12).toLocaleString()} ₾</p>
              </div>
            </div>
          )}

          <div className="stock-info">
            {product.stock > 0
              ? <span className="in-stock">✓ მარაგშია ({product.stock} ერთეული)</span>
              : <span className="out-stock">✗ არ არის მარაგში</span>}
          </div>

          <div className="qty-row">
            <label>რაოდენობა:</label>
            <div className="qty-control">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
            </div>
          </div>

          <div className="detail-actions">
            <button
              className={`add-btn ${added ? 'added' : ''}`}
              onClick={handleAdd}
              disabled={loading || product.stock === 0}
            >
              {added ? '✓ კალათაში დამატებულია' : '🛒 კალათაში დამატება'}
            </button>
            <Link to="/cart" className="buy-now-btn">ახლავე შეიძინე</Link>
          </div>

          <div className="detail-features">
            <div className="feat"><span>🚚</span> უფასო მიწოდება</div>
            <div className="feat"><span>🛡️</span> 24 თვის გარანტია</div>
            <div className="feat"><span>🔄</span> 14 დღე დაბრუნება</div>
          </div>
        </div>
      </div>

      {/* ── Description ── */}
      {product.description && (
        <div className="detail-tabs">
          <h3>აღწერა</h3>
          <p className="description">{product.description}</p>
        </div>
      )}

      {/* ── Specs from DB ── */}
      <SpecsTable specs={product.specs} />

      {/* ── Accessories ── */}
      {accessories.length > 0 && (
        <div className="accessories-section">
          <div className="accessories-header">
            <h2 className="accessories-title"><span>⚡</span> შეთავაზებები — აქსესუარები</h2>
            <Link to="/products?categoryId=5" className="accessories-all">ყველა →</Link>
          </div>
          <div className="accessories-slider">
            {accessories.map(p => (
              <div className="accessories-item" key={p.id}><ProductCard product={p} /></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
