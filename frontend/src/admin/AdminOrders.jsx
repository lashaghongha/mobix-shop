import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { api } from '../services/api';
import './Dashboard.css';

const STATUSES = ['', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_LABEL = {
  '': 'ყველა', Pending: 'მომლოდინე', Confirmed: 'დადასტურებული',
  Shipped: 'გამოგზავნილი', Delivered: 'ჩაბარებული', Cancelled: 'გაუქმებული',
};

export default function AdminOrders() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const load = () => {
    api.adminGetOrders({ status: status || undefined, page, pageSize: 20 })
      .then(r => setData(r.data))
      .catch(() => setData({ items: [], total: 0 }));
  };

  useEffect(() => { setPage(1); }, [status]);
  useEffect(() => { load(); }, [status, page]);

  const totalPages = data ? Math.ceil(data.total / 20) : 1;

  return (
    <div>
      <h1 className="adm-page-title">შეკვეთები</h1>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {STATUSES.map(s => (
          <button
            key={s}
            className={`adm-btn ${status === s ? 'adm-btn-primary' : 'adm-btn-secondary'}`}
            onClick={() => setStatus(s)}
          >
            {STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <div className="adm-card">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>#ID</th>
                <th>მომხმარებელი</th>
                <th>ტელ / მეილი</th>
                <th>მისამართი</th>
                <th>თანხა</th>
                <th>გადახდა</th>
                <th>სტატუსი</th>
                <th>თარიღი</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700 }}>#{o.id}</td>
                  <td>{o.firstName} {o.lastName}</td>
                  <td>
                    <div style={{ fontSize: 12 }}>{o.phone}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{o.email}</div>
                  </td>
                  <td style={{ fontSize: 12 }}>{o.city}, {o.address}</td>
                  <td style={{ fontWeight: 800, color: '#c0152a' }}>{o.total?.toLocaleString()} ₾</td>
                  <td style={{ fontSize: 12 }}>{o.paymentMethod}</td>
                  <td><StatusSelect orderId={o.id} current={o.status} onUpdate={load} /></td>
                  <td style={{ color: '#888', fontSize: 12 }}>{new Date(o.createdAt).toLocaleDateString('ka-GE')}</td>
                  <td>
                    <Link to={`/admin/orders/${o.id}`} className="adm-btn adm-btn-secondary" style={{ padding: '6px 10px' }}>
                      <Eye size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
              {data?.items.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', color: '#aaa', padding: 40 }}>შეკვეთები არ არის</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 18 }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`adm-btn ${page === p ? 'adm-btn-primary' : 'adm-btn-secondary'}`}
                style={{ padding: '6px 12px' }} onClick={() => setPage(p)}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const STATUS_OPTIONS = [
  { value: 'Pending',    label: 'მომლოდინე',      color: '#f59e0b' },
  { value: 'Confirmed',  label: 'დადასტურებული',  color: '#3b82f6' },
  { value: 'Shipped',    label: 'გამოგზავნილი',   color: '#8b5cf6' },
  { value: 'Delivered',  label: 'ჩაბარებული',     color: '#10b981' },
  { value: 'Cancelled',  label: 'გაუქმებული',     color: '#ef4444' },
];

function StatusSelect({ orderId, current, onUpdate }) {
  const [val, setVal] = useState(current);
  const opt = STATUS_OPTIONS.find(o => o.value === val);

  const handleChange = async (e) => {
    const s = e.target.value;
    setVal(s);
    await api.adminUpdateOrderStatus(orderId, s);
    onUpdate();
  };

  return (
    <select
      value={val}
      onChange={handleChange}
      style={{
        padding: '4px 8px', borderRadius: 6,
        border: `1.5px solid ${opt?.color || '#eee'}`,
        fontSize: 12, fontWeight: 600, cursor: 'pointer', outline: 'none',
        color: opt?.color, background: `${opt?.color}15`,
      }}
    >
      {STATUS_OPTIONS.map(s => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}
