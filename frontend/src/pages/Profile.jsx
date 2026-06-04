import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, Heart, ChevronRight, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
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
  const [email, setEmail]       = useState('');
  const [orders, setOrders]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const lookup = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setOrders(null);
    setSearched(false);
    try {
      const res = await api.adminGetUser(email.trim());
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
        <div>
          <div className="profile-hero-name">სტუმარი</div>
          <div className="profile-hero-sub">MobiX-ის მომხმარებელი</div>
        </div>
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
              placeholder="შეიყვანე email მისამართი"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? <span className="profile-spin" /> : <Search size={18} />}
            </button>
          </div>
          <p className="profile-lookup-hint">შეკვეთის განთავსებისას გამოყენებული email</p>
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
