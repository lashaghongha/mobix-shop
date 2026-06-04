import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import './Dashboard.css';

const STATUS_LABEL = {
  Pending: 'მომლოდინე', Confirmed: 'დადასტურებული',
  Shipped: 'გამოგზავნილი', Delivered: 'ჩაბარებული', Cancelled: 'გაუქმებული',
};

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => { api.adminGetOrder(id).then(r => setOrder(r.data)); }, [id]);

  if (!order) return <div className="adm-loading">იტვირთება...</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <Link to="/admin/orders" className="adm-btn adm-btn-secondary" style={{ padding: '8px 12px' }}>
          <ArrowLeft size={16} />
        </Link>
        <h1 className="adm-page-title" style={{ margin: 0 }}>შეკვეთა #{order.id}</h1>
        <span className={`adm-badge ${order.status?.toLowerCase()}`}>{STATUS_LABEL[order.status] || order.status}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Customer info */}
        <div className="adm-card">
          <div className="adm-card-title">მომხმარებლის ინფო</div>
          <InfoRow label="სახელი" value={`${order.firstName} ${order.lastName}`} />
          <InfoRow label="ტელეფონი" value={order.phone} />
          <InfoRow label="მეილი" value={order.email} />
          <InfoRow label="ქალაქი" value={order.city} />
          <InfoRow label="მისამართი" value={order.address} />
          <InfoRow label="გადახდა" value={order.paymentMethod} />
        </div>

        {/* Summary */}
        <div className="adm-card">
          <div className="adm-card-title">შეკვეთის დეტალები</div>
          <InfoRow label="თარიღი" value={new Date(order.createdAt).toLocaleString('ka-GE')} />
          <InfoRow label="ნივთები" value={order.items?.length} />
          <InfoRow label="სულ" value={<span style={{ fontWeight: 800, color: '#c0152a', fontSize: 18 }}>{order.total?.toLocaleString()} ₾</span>} />
        </div>
      </div>

      {/* Items */}
      <div className="adm-card">
        <div className="adm-card-title">შეკვეთილი პროდუქტები</div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>სურათი</th><th>პროდუქტი</th><th>ფასი</th><th>რაოდენობა</th><th>სულ</th></tr>
            </thead>
            <tbody>
              {order.items?.map(item => (
                <tr key={item.id}>
                  <td><img src={item.imageUrl} alt="" style={{ width: 50, height: 50, objectFit: 'contain', borderRadius: 8, background: '#f9f9f9', padding: 4 }} /></td>
                  <td style={{ fontWeight: 600 }}>{item.productName}</td>
                  <td>{item.price?.toLocaleString()} ₾</td>
                  <td>{item.quantity}</td>
                  <td style={{ fontWeight: 700 }}>{(item.price * item.quantity).toLocaleString()} ₾</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f3f3', fontSize: 13 }}>
      <span style={{ color: '#888' }}>{label}</span>
      <span style={{ fontWeight: 600, color: '#111' }}>{value}</span>
    </div>
  );
}
