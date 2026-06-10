import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, TrendingUp, Clock } from 'lucide-react';
import { api } from '../services/api';
import './Dashboard.css';

const STATUS_LABEL = {
  Pending: 'მომლოდინე', Confirmed: 'დადასტურებული',
  Shipped: 'გამოგზავნილი', Delivered: 'ჩაბარებული', Cancelled: 'გაუქმებული',
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.adminStats()
      .then(r => setStats(r.data))
      .catch(() => setStats({
        totalOrders: 0, totalRevenue: 0, totalProducts: 0,
        pendingOrders: 0, recentOrders: []
      }));
  }, []);

  if (!stats) return (
    <div className="adm-loading">
      <div className="adm-spinner" />
      <div style={{ marginTop: 14 }}>იტვირთება...</div>
    </div>
  );

  const cards = [
    { icon: ShoppingBag, label: 'სულ შეკვეთები',  value: stats.totalOrders,   color: '#3b82f6' },
    { icon: TrendingUp,  label: 'სულ შემოსავალი', value: `${stats.totalRevenue?.toLocaleString()} ₾`, color: '#22c55e' },
    { icon: Package,     label: 'პროდუქტები',     value: stats.totalProducts, color: '#f59e0b' },
    { icon: Clock,       label: 'მომლოდინე',       value: stats.pendingOrders, color: '#c0152a' },
  ];

  return (
    <div>
      <h1 className="adm-page-title">დეშბორდი</h1>

      <div className="dash-stats">
        {cards.map(({ icon: Icon, label, value, color }) => (
          <div className="dash-stat-card adm-card" key={label}>
            <div className="dash-stat-icon" style={{ background: color + '1a', color }}>
              <Icon size={22} />
            </div>
            <div>
              <div className="dash-stat-value">{value}</div>
              <div className="dash-stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="adm-card">
        <div className="adm-card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          ბოლო შეკვეთები
          <Link to="/admin/orders" className="adm-btn adm-btn-secondary" style={{ fontSize: 12 }}>ყველა →</Link>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>#ID</th>
                <th>მომხმარებელი</th>
                <th>თანხა</th>
                <th>სტატუსი</th>
                <th>თარიღი</th>
              </tr>
            </thead>
            <tbody>
              {(stats.recentOrders || []).map(o => (
                <tr key={o.id}>
                  <td><Link to={`/admin/orders/${o.id}`} style={{ color: '#c0152a', fontWeight: 700 }}>#{o.id}</Link></td>
                  <td>{o.firstName} {o.lastName}</td>
                  <td style={{ fontWeight: 700 }}>{o.total?.toLocaleString()} ₾</td>
                  <td><span className={`adm-badge ${o.status?.toLowerCase()}`}>{STATUS_LABEL[o.status] || o.status}</span></td>
                  <td style={{ color: '#888' }}>{new Date(o.createdAt).toLocaleDateString('ka-GE')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
