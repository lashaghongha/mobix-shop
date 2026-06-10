import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggle, has } = useCompare();
  const { toggle: wishToggle, isWished } = useWishlist();
  const inCompare = has(product.id);
  const wished = isWished(product.id);
  const [status, setStatus] = useState('idle'); // idle | loading | added
  const cardRef = useRef();

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  const handleAdd = async () => {
    if (status !== 'idle') return;
    setStatus('loading');
    await addToCart(product.id);
    setStatus('added');
    setTimeout(() => setStatus('idle'), 1800);
  };

  // 3D tilt on desktop hover
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 14;
    const y = ((e.clientY - top) / height - 0.5) * -14;
    card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-3px)`;
  };
  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = '';
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="pcard"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ textDecoration: 'none' }}
    >
      {discount && <span className="pcard-best">BEST PRICE</span>}
      {product.isNew && !discount && <span className="pcard-new">NEW</span>}
      <button
        className={`pcard-wish${wished ? ' wished' : ''}`}
        onClick={e => { e.preventDefault(); e.stopPropagation(); wishToggle(product); }}
        title={wished ? 'სიებიდან ამოღება' : 'სურვილების სიაში დამატება'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2"
          fill={wished ? 'currentColor' : 'none'}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      <div className="pcard-img">
        <img src={product.imageUrl} alt={product.name} loading="lazy" />
      </div>

      <div className="pcard-body">
        <div className="pcard-brand">{product.brand}</div>
        <div className="pcard-name">{product.name}</div>

        <div className="pcard-price-row">
          <span className="pcard-price">{product.price.toLocaleString()} ₾</span>
          {product.oldPrice && (
            <span className="pcard-old">{product.oldPrice.toLocaleString()} ₾</span>
          )}
        </div>

        {product.hasInstallment && (
          <div className="pcard-inst">
            თვეში {Math.round(product.price / 12).toLocaleString()} ₾-დან
          </div>
        )}

        <div className="pcard-actions">
          <button
            className={`pcard-compare${inCompare ? ' active' : ''}`}
            title={inCompare ? 'შედარებიდან ამოღება' : 'შედარებაში დამატება'}
            onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(product); }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4"/>
            </svg>
          </button>
          <button
            className={`pcard-btn ${status}`}
            onClick={e => { e.preventDefault(); e.stopPropagation(); handleAdd(); }}
            disabled={product.stock === 0}
          >
            {status === 'added' ? (
              <>
                <svg className="check-icon" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                დამატებულია
              </>
            ) : status === 'loading' ? (
              <span className="btn-spinner" />
            ) : product.stock === 0 ? 'არ არის' : (
              <>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                დამატება
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
