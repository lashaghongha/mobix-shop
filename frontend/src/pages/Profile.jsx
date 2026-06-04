import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, Heart, ChevronRight, ShoppingBag, Pencil, Check, X } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useProfile } from '../context/ProfileContext';
import { api } from '../services/api';
import './Profile.css';

const STATUS_GE = {
  Pending:   'მომლოდინე',
  Confirmed: 'დადასტურებული',
  Shipped:   'გამოგზავნილი',
  Delivered: 'ჩაბარებული',
  Cancelled: 'გაუქმებული',
};
const STATUS_COLOR = {
  Pending:   '#f59e0b',
  Confirmed: '#3b82f6',
  Shipped:   '#8b5cf6',
  Delivered: '#10b981',
  Cancelled: '#ef4444',
};

function formatDate(d) {
  return new Date(d).toLocaleDateString('ka-GE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function Profile() {
  const { items: wishItems, count: wishCount } = useWishlist();
  const { profile, save, clear, isLoggedIn } = useProfile();

  // Registration / edit form state
  const [editing, setEditing] = useState(!isLoggedIn);
  const [draft, setDraft] = useState({
    firstName: profile?.firstName || '',
    lastName:  profile?.lastName  || '',
    email:     profile?.email     || '',
    phone:     profile?.phone     || '',
  });
  const [formError, setFormError] = useState('');

  const handleDraft = e => setDraft(d => ({ ...d, [e.target.name]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    if (!draft.firstName.trim() || !draft.lastName.trim() || !draft.email.trim() || !draft.phone.trim()) {
      setFormError('გთხოვთ შეავსოთ ყველა ველი');
      return;
    }
    save(draft);
    setEditing(false);
    setFormError('');
  };

  const handleEdit = () => {
    setDraft({
      firstName: profile?.firstName || '',
      lastName:  profile?.lastName  || '',
      email:     profile?.email     || '',
      phone:     profile?.phone     || '',
    });
    setEditing(true);
  };

  // Order lookup
  const [lookupEmail, setLookupEmail] = useState('');
  const [orders, setOrders]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const lookup = async (e) => {
    e.preventDefault();
    const q = lookupEmail.trim() || profile?.email || '';
    if (!q) return;
    setLoading(true);
    setOrders(null);
    setSearched(false);
    try {
      const res = await api.adminGetUser(q);
      setOrders(res.data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <div className="profile-page">

      {/* ── Header card ── */}
      <div className="profile-hero">
        <div className="profile-avatar-big">
          <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div className="profile-hero-name">
            {isLoggedIn ? `${profile.firstName} ${profile.lastName}` : 'სტუმარი'}
          </div>
          <div className="profile-hero-sub">
            {isLoggedIn ? profile.email : 'MobiX-ის მომხმარებელი'}
          </div>
        </div>
        {isLoggedIn && !editing && (
          <button className="profile-edit-btn" onClick={handleEdit} title="რედაქტირება">
            <Pencil size={16} />
          </button>
        )}
      </div>

      {/* ── Registration / Edit form ── */}
      <div className="profile-section">
        <div className="profile-section-title">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          {isLoggedIn && !editing ? 'ჩემი მონაცემები' : 'რეგისტრაცია / რედაქტირება'}
        </div>

        {isLoggedIn && !editing ? (
          <div className="profile-info-view">
            <div className="profile-info-row"><span>სახელი</span><strong>{profile.firstName}</strong></div>
            <div className="profile-info-row"><span>გვარი</span><strong>{profile.lastName}</strong></div>
            <div className="profile-info-row"><span>ელ-ფოსტა</span><strong>{profile.email}</strong></div>
            <div className="profile-info-row"><span>ტელეფონი</span><strong>{profile.phone}</strong></div>
            <div className="profile-info-actions">
              <button className="profile-btn-edit" onClick={handleEdit}><Pencil size={14}/> რედაქტირება</button>
              <button className="profile-btn-logout" onClick={clear}><X size={14}/> გასვლა</button>
            </div>
          </div>
        ) : (
          <form className="profile-reg-form" onSubmit={handleSave}>
            <div className="form-row">
              <div className="form-group">
                <label>სახელი</label>
                <input name="firstName" value={draft.firstName} onChange={handleDraft} placeholder="სახელი" required />
              </div>
              <div className="form-group">
                <label>გვარი</label>
                <input name="lastName" value={draft.lastName} onChange={handleDraft} placeholder="გვარი" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>ელ-ფოსტა</label>
                <input name="email" type="email" value={draft.email} onChange={handleDraft} placeholder="example@gmail.com" required />
              </div>
              <div className="form-group">
                <label>ტელეფონი</label>
                <input name="phone" value={draft.phone} onChange={handleDraft} placeholder="+995 5XX XX XX XX" required />
              </div>
            </div>
            {formError && <p className="profile-form-error">{formError}</p>}
            <div className="profile-form-actions">
              <button type="submit" className="profile-btn-save"><Check size={14}/> შენახვა</button>
              {isLoggedIn && (
                <button type="button" className="profile-btn-cancel" onClick={() => setEditing(false)}><X size={14}/> გაუქმება</button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* ── Quick links ── */}
      <div className="profile-quick">
        <Link to="/wishlist" className="profile-quick-item">
          <Heart size={22} className="pqi-icon pqi-red" />
          <span>სურვილების სია</span>
          {wishCount > 0 && <span className="pqi-badge">{wishCount}</span>}
          <ChevronRight size={16} className="pqi-chevron" />
        </Link>
        <Link to="/cart" className="profile-quick-item">
          <ShoppingBag size={22} className="pqi-icon pqi-blue" />
          <span>კალათა</span>
          <ChevronRight size={16} className="pqi-chevron" />
        </Link>
      </div>

      {/* ── Order lookup ── */}
      <div className="profile-section">
        <div className="profile-section-title">
          <Package size={18} />
          შეკვეთების ისტორია
        </div>

        <form className="profile-lookup" onSubmit={lookup}>
          <div className="profile-lookup-row">
            <input
              type="email"
              placeholder={profile?.email || 'შეიყვანე email მისამართი'}
              value={lookupEmail}
              onChange={e => setLookupEmail(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? <span className="profile-spin" /> : <Search size={18} />}
            </button>
          </div>
          {isLoggedIn
            ? <p className="profile-lookup-hint">ცარიელი დატოვე პროფილის email-ის გამოსაყენებლად</p>
            : <p className="profile-lookup-hint">შეკვეთის განთავსებისას გამოყენებული email</p>
          }
        </form>

        {searched && orders !== null && (
          orders.length === 0 ? (
            <div className="profile-no-orders">
              <Package size={40} strokeWidth={1.2} />
              <p>შეკვეთები ვერ მოიძებნა</p>
              <span>შეამოწმე email-ი სწორად არის შეყვანილი</span>
            </div>
          ) : (
            <div className="profile-orders-list">
              {orders.map(order => (
                <div key={order.id} className="profile-order-card">
                  <div
                    className="profile-order-header"
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  >
                    <div className="profile-order-left">
                      <span className="profile-order-id">#{order.id}</span>
                      <span
                        className="profile-order-status"
                        style={{ background: STATUS_COLOR[order.status] + '22', color: STATUS_COLOR[order.status] }}
                      >
                        {STATUS_GE[order.status] || order.status}
                      </span>
                    </div>
                    <div className="profile-order-right">
                      <span className="profile-order-total">₾{order.total?.toFixed(2)}</span>
                      <span className="profile-order-date">{formatDate(order.createdAt)}</span>
                      <ChevronRight
                        size={16}
                        style={{ transform: expanded === order.id ? 'rotate(90deg)' : 'none', transition: '.2s', color: '#aaa' }}
                      />
                    </div>
                  </div>

                  {expanded === order.id && (
                    <div className="profile-order-items">
                      {order.items?.map(item => (
                        <div key={item.id} className="profile-order-item">
                          {item.imageUrl && (
                            <img src={item.imageUrl} alt={item.productName} className="profile-item-img" />
                          )}
                          <div className="profile-item-info">
                            <div className="profile-item-name">{item.productName}</div>
                            <div className="profile-item-meta">{item.quantity} × ₾{item.price?.toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                      <div className="profile-order-foot">
                        <span>{order.city}, {order.address}</span>
                        <strong>სულ: ₾{order.total?.toFixed(2)}</strong>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* ── Wishlist preview ── */}
      {wishItems.length > 0 && (
        <div className="profile-section">
          <div className="profile-section-title">
            <Heart size={18} />
            სურვილების სია
            <span className="profile-sec-count">{wishCount}</span>
          </div>
          <div className="profile-wish-grid">
            {wishItems.slice(0, 4).map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="profile-wish-item">
                <img src={p.imageUrl} alt={p.name} />
                <div className="profile-wish-name">{p.name}</div>
                <div className="profile-wish-price">₾{p.price?.toLocaleString()}</div>
              </Link>
            ))}
          </div>
          {wishItems.length > 4 && (
            <Link to="/wishlist" className="profile-see-all">ყველას ნახვა ({wishItems.length})</Link>
          )}
        </div>
      )}

    </div>
  );
}
