import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, ShoppingBag, TrendingUp, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import './AdminUsers.css';

const STATUS_GE = {
  Pending:   'მოლოდინში',
  Processing:'მუშავდება',
  Shipped:   'გაგზავნილია',
  Delivered: 'მიღებულია',
  Cancelled: 'გაუქმებული',
};
const STATUS_COLOR = {
  Pending:   '#f59e0b',
  Processing:'#3b82f6',
  Shipped:   '#8b5cf6',
  Delivered: '#10b981',
  Cancelled: '#ef4444',
};

function formatDate(d) {
  return new Date(d).toLocaleDateString('ka-GE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

export default function AdminUsers() {
  const [data,    setData]    = useState({ items: [], total: 0 });
  const [search,  setSearch]  = useState('');
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // user detail
  const [detail,   setDetail]   = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const navigate = useNavigate();

  const PAGE_SIZE = 20;

  useEffect(() => {
    setLoading(true);
    api.adminGetUsers({ search: search || undefined, page, pageSize: PAGE_SIZE })
      .then(r => setData(r.data))
      .catch(() => setData({ items: [], total: 0 }))
      .finally(() => setLoading(false));
  }, [search, page]);

  function openUser(email) {
    setSelected(email);
    setDetail(null);
    setDetailLoading(true);
    api.adminGetUser(email)
      .then(r => setDetail(r.data))
      .catch(() => setDetail(null))
      .finally(() => setDetailLoading(false));
  }

  const totalPages = Math.ceil(data.total / PAGE_SIZE);

  return (
    <div className="au-root">
      {/* ── List panel ── */}
      <div className={`au-list-panel${selected ? ' au-list-panel--shrink' : ''}`}>
        {/* Header */}
        <div className="au-header">
          <div className="au-header-left">
            <h1 className="au-title">მომხმარებლები</h1>
            <span className="au-count">{data.total}</span>
          </div>
          <div className="au-search-wrap">
            <Search size={15} className="au-search-icon" />
            <input
              className="au-search"
              placeholder="სახელი, email, ტელ…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="au-spinner">იტვირთება…</div>
        ) : data.items.length === 0 ? (
          <div className="au-empty">
            <Users size={40} strokeWidth={1.2} />
            <p>მომხმარებლები არ მოიძებნა</p>
          </div>
        ) : (
          <>
            <div className="au-table-wrap">
              <table className="au-table">
                <thead>
                  <tr>
                    <th>მომხმარებელი</th>
                    <th>ტელ.</th>
                    <th>ქ.</th>
                    <th className="au-th-num">შეკვეთები</th>
                    <th className="au-th-num">სულ</th>
                    <th className="au-th-num">ბოლო შეკვ.</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map(u => (
                    <tr
                      key={u.email}
                      className={`au-row${selected === u.email ? ' au-row--active' : ''}`}
                      onClick={() => openUser(u.email)}
                    >
                      <td>
                        <div className="au-user-cell">
                          <div className="au-avatar">{(u.firstName?.[0] || '?').toUpperCase()}</div>
                          <div>
                            <div className="au-name">{u.firstName} {u.lastName}</div>
                            <div className="au-email">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="au-phone">{u.phone}</td>
                      <td className="au-city">{u.city || '—'}</td>
                      <td className="au-td-num">
                        <span className="au-badge-orders">{u.orderCount}</span>
                      </td>
                      <td className="au-td-num au-total">₾{u.totalSpent.toFixed(2)}</td>
                      <td className="au-td-num au-date">{formatDate(u.lastOrderAt)}</td>
                      <td><ChevronRight size={15} className="au-chevron" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="au-pagination">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>←</button>
                <span>{page} / {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>→</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Detail panel ── */}
      {selected && (
        <div className="au-detail-panel">
          <button className="au-detail-close" onClick={() => setSelected(null)}>✕</button>

          {detailLoading && <div className="au-spinner">იტვირთება…</div>}

          {!detailLoading && !detail && (
            <div className="au-empty"><p>ვერ ჩაიტვირთა</p></div>
          )}

          {!detailLoading && detail && (
            <>
              {/* Profile card */}
              <div className="au-profile-card">
                <div className="au-profile-avatar">
                  {(detail.firstName?.[0] || '?').toUpperCase()}
                </div>
                <div className="au-profile-info">
                  <div className="au-profile-name">{detail.firstName} {detail.lastName}</div>
                  <div className="au-profile-email">{detail.email}</div>
                  <div className="au-profile-sub">{detail.phone} {detail.city ? `· ${detail.city}` : ''}</div>
                  {detail.address && <div className="au-profile-sub">{detail.address}</div>}
                </div>
              </div>

              {/* Stats row */}
              <div className="au-stats-row">
                <div className="au-stat">
                  <ShoppingBag size={18} className="au-stat-icon" />
                  <div>
                    <div className="au-stat-val">{detail.orderCount}</div>
                    <div className="au-stat-lbl">შეკვეთა</div>
                  </div>
                </div>
                <div className="au-stat">
                  <TrendingUp size={18} className="au-stat-icon" />
                  <div>
                    <div className="au-stat-val">₾{detail.totalSpent.toFixed(2)}</div>
                    <div className="au-stat-lbl">სულ დახარჯული</div>
                  </div>
                </div>
                <div className="au-stat">
                  <div className="au-stat-icon" style={{ width: 18 }} />
                  <div>
                    <div className="au-stat-val">{formatDate(detail.firstOrder)}</div>
                    <div className="au-stat-lbl">პირველი შეკვ.</div>
                  </div>
                </div>
              </div>

              {/* Orders history */}
              <div className="au-orders-section">
                <h3 className="au-orders-title">შეკვეთების ისტორია</h3>
                <div className="au-orders-list">
                  {detail.orders.map(order => (
                    <div
                      key={order.id}
                      className="au-order-card"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      <div className="au-order-top">
                        <span className="au-order-id">#{order.id}</span>
                        <span
                          className="au-order-status"
                          style={{ background: STATUS_COLOR[order.status] + '22', color: STATUS_COLOR[order.status] }}
                        >
                          {STATUS_GE[order.status] || order.status}
                        </span>
                        <span className="au-order-date">{formatDate(order.createdAt)}</span>
                      </div>

                      <div className="au-order-items">
                        {order.items.map(item => (
                          <div key={item.id} className="au-order-item">
                            {item.imageUrl && (
                              <img src={item.imageUrl} alt={item.productName} className="au-item-img" />
                            )}
                            <div className="au-item-info">
                              <div className="au-item-name">{item.productName}</div>
                              <div className="au-item-meta">
                                {item.quantity} × ₾{item.price.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="au-order-footer">
                        <span>{order.paymentMethod}</span>
                        <span className="au-order-total">₾{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
