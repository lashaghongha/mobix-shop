import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './BottomNav.css';

export default function BottomNav() {
  const { pathname } = useLocation();
  const { count } = useCart();
  const { count: wishCount } = useWishlist();

  const active = (path) => pathname === path ? 'bnav-item active' : 'bnav-item';

  return (
    <nav className="bottom-nav">
      <Link to="/" className={active('/')}>
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>
          <polyline points="9 21 9 12 15 12 15 21"/>
        </svg>
        <span>მთავარი</span>
      </Link>

      <Link to="/categories" className={active('/categories')}>
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
        <span>კატეგორიები</span>
      </Link>

      <Link to="/products" className="bnav-promo">
        <span>%</span>
      </Link>

      <Link to="/cart" className={active('/cart')} style={{ position: 'relative' }}>
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        {count > 0 && <span className="bnav-badge">{count}</span>}
        <span>კალათა</span>
      </Link>

      <Link to="/profile" className={active('/profile')}>
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span>პროფილი</span>
      </Link>
    </nav>
  );
}
