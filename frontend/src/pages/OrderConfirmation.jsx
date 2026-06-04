import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.getOrder(id).then(r => setOrder(r.data));
  }, [id]);

  if (!order) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div className="order-confirm container">
      <div className="confirm-card">
        <div className="confirm-icon">✅</div>
        <h1>შეკვეთა განთავსებულია!</h1>
        <p>გმადლობთ შეძენისთვის. შეკვეთის ნომერი: <strong>#{order.id}</strong></p>

        <div className="order-items">
          {order.items.map(item => (
            <div key={item.id} className="order-item">
              <img src={item.imageUrl} alt={item.productName} />
              <div>
                <div className="order-item-name">{item.productName}</div>
                <div className="order-item-qty">×{item.quantity}</div>
              </div>
              <div className="order-item-price">{(item.price * item.quantity).toLocaleString()} ₾</div>
            </div>
          ))}
        </div>

        <div className="confirm-total">
          <span>სულ გადახდილი:</span>
          <strong>{order.total.toLocaleString()} ₾</strong>
        </div>

        <div className="confirm-info">
          <p>📧 დადასტურება გამოგზავნილია: <strong>{order.email}</strong></p>
          <p>🚚 მიტანის ვადა: 1-3 სამუშაო დღე</p>
          <p>📞 კითხვის შემთხვევაში: <strong>0322 22-22-22</strong></p>
        </div>

        <Link to="/" className="back-home">მთავარ გვერდზე დაბრუნება</Link>
      </div>
    </div>
  );
}
