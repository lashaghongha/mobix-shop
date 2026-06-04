import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import './Checkout.css';

export default function Checkout() {
  const { cartItems, total, sessionId, fetchCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: 'თბილისი', paymentMethod: 'card'
  });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createOrder({ sessionId, ...form });
      await fetchCart();
      navigate(`/order/${res.data.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page container">
      <h1>გადახდა</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <h3>მიწოდების ინფორმაცია</h3>
            <div className="form-row">
              <div className="form-group">
                <label>სახელი</label>
                <input name="firstName" required value={form.firstName} onChange={handleChange} placeholder="სახელი" />
              </div>
              <div className="form-group">
                <label>გვარი</label>
                <input name="lastName" required value={form.lastName} onChange={handleChange} placeholder="გვარი" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>ელ-ფოსტა</label>
                <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="example@gmail.com" />
              </div>
              <div className="form-group">
                <label>ტელეფონი</label>
                <input name="phone" required value={form.phone} onChange={handleChange} placeholder="+995 5XX XX XX XX" />
              </div>
            </div>
            <div className="form-group">
              <label>მისამართი</label>
              <input name="address" required value={form.address} onChange={handleChange} placeholder="ქუჩა, სახლის ნომერი" />
            </div>
            <div className="form-group">
              <label>ქალაქი</label>
              <select name="city" value={form.city} onChange={handleChange}>
                <option>თბილისი</option>
                <option>ბათუმი</option>
                <option>ქუთაისი</option>
                <option>რუსთავი</option>
                <option>გორი</option>
                <option>ზუგდიდი</option>
              </select>
            </div>
          </section>

          <section className="form-section">
            <h3>გადახდის მეთოდი</h3>
            <div className="payment-methods">
              {[
                { value: 'card', label: '💳 საბანკო ბარათი', desc: 'Visa, Mastercard, Amex' },
                { value: 'tbc', label: '🏦 TBC Pay', desc: 'TBC ბანკი' },
                { value: 'bog', label: '🏦 BOG Pay', desc: 'საქართველოს ბანკი' },
                { value: 'cash', label: '💵 ნაღდი ფული', desc: 'მიტანისას' },
              ].map(pm => (
                <label key={pm.value} className={`payment-option ${form.paymentMethod === pm.value ? 'selected' : ''}`}>
                  <input type="radio" name="paymentMethod" value={pm.value} checked={form.paymentMethod === pm.value} onChange={handleChange} />
                  <div>
                    <strong>{pm.label}</strong>
                    <span>{pm.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <button type="submit" className="submit-btn" disabled={submitting || cartItems.length === 0}>
            {submitting ? 'მუშავდება...' : `შეკვეთის განთავსება — ${total.toLocaleString()} ₾`}
          </button>
        </form>

        <div className="order-summary">
          <h3>შეკვეთის ჯამი</h3>
          {cartItems.map(item => (
            <div key={item.id} className="summary-item">
              <img src={item.product.imageUrl} alt={item.product.name} />
              <div>
                <div className="summary-item-name">{item.product.name}</div>
                <div className="summary-item-qty">×{item.quantity}</div>
              </div>
              <div className="summary-item-price">
                {(item.product.price * item.quantity).toLocaleString()} ₾
              </div>
            </div>
          ))}
          <div className="summary-total-row">
            <span>სულ:</span>
            <strong>{total.toLocaleString()} ₾</strong>
          </div>
          {total >= 500 && <div className="free-del">🚚 უფასო მიწოდება</div>}
        </div>
      </div>
    </div>
  );
}
