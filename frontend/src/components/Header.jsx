import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Header.css';

export default function Header() {
  const [search, setSearch] = useState('');
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isCat = pathname === '/categories';

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      setSearch('');
    }
  };

  return (
    <>
      <header>
        {/* Top bar */}
        <div className="topbar">
          <div className="container topbar-inner">
            <div className="topbar-links">
              <a href="#">საქმო პოლიტიკა</a>
              <a href="#">განვადება</a>
              <a href="#">კარიერა</a>
              <a href="#">Trade In</a>
              <a href="#">ფილიალები</a>
              <button className="flag-btn">🇬🇪</button>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="header-main">
          <div className="container header-main-inner">
            <button
              className={`nav-btn${isCat ? ' active' : ''}`}
              onClick={() => isCat ? navigate(-1) : navigate('/categories')}
            >
              {isCat ? (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
              <span>კატეგორიები</span>
            </button>

            <Link to="/" className="logo">
              <div className="logo-text">Mobi<span className="logo-x">x</span></div>
            </Link>

            <form className="search-form" onSubmit={handleSearch}>
              <button type="submit" className="search-btn">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            <div className="header-actions">
              <Link to="/wishlist" className="hdr-btn" style={{ position: 'relative' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span>სია</span>
                {wishCount > 0 && <span className="cart-badge" style={{ background: '#c0152a' }}>{wishCount}</span>}
              </Link>
              <Link to="/cart" className="hdr-btn" style={{ position: 'relative' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <span>კალათა</span>
                {count > 0 && <span className="cart-badge">{count}</span>}
              </Link>
              <Link to="/products" className="hdr-btn orange">
                <span style={{ fontWeight: 800, fontSize: 16 }}>%</span>
              </Link>
              <Link to="/login" className="hdr-btn">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>შესვლა</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

    </>
  );
}
