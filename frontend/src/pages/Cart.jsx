import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { cartItems, updateQuantity, removeItem, total } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart container">
        <div className="empty-cart-inner">
          <span className="cart-empty-icon">🛒</span>
          <h2>კალათა ცარიელია</h2>
          <p>დაამატეთ პროდუქტები კალათაში</p>
          <Link to="/" className="continue-shopping">შეძენის გაგრძელება</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1>კალათა ({cartItems.length} პოზიცია)</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <Link to={`/product/${item.productId}`}>
                <img src={item.product.imageUrl} alt={item.product.name} />
              </Link>
              <div className="item-info">
                <div className="item-brand">{item.product.brand}</div>
                <Link to={`/product/${item.productId}`} className="item-name">
                  {item.product.name}
                </Link>
                {item.product.hasInstallment && (
                  <div className="item-installment">
                    განვადება: {Math.round(item.product.price / 12).toLocaleString()} ₾/თვე
                  </div>
                )}
              </div>
              <div className="item-qty">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <div className="item-price">
                {(item.product.price * item.quantity).toLocaleString()} ₾
              </div>
              <button className="remove-btn" onClick={() => removeItem(item.id)}>✕</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>შეკვეთის ჯამი</h3>

          <div className="summary-rows">
            {cartItems.map(item => (
              <div key={item.id} className="summary-row">
                <span>{item.product.name.slice(0, 25)}... ×{item.quantity}</span>
                <span>{(item.product.price * item.quantity).toLocaleString()} ₾</span>
              </div>
            ))}
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span>სულ:</span>
            <span>{total.toLocaleString()} ₾</span>
          </div>

          {total >= 500 && (
            <div className="free-delivery">✓ უფასო მიწოდება</div>
          )}

          <Link to="/checkout" className="checkout-btn">გადახდაზე გადასვლა</Link>
          <Link to="/products" className="continue-link">← შეძენის გაგრძელება</Link>
        </div>
      </div>
    </div>
  );
}
