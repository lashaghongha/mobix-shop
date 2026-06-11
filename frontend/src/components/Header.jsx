import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProfile } from '../context/ProfileContext';
import { api } from '../services/api';
import CategoryStrip from './CategoryStrip';
import './Header.css';

export default function Header() {
  const [search, setSearch]           = useState('');
  const [results, setResults]         = useState([]);
  const [showDrop, setShowDrop]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [expanded, setExpanded]       = useState(false);
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const { profile, isLoggedIn, clear } = useProfile();
  const navigate   = useNavigate();
  const { pathname } = useLocation();
  const isCat      = pathname === '/categories';
  const debounceRef = useRef(null);
  const wrapRef     = useRef(null);
  const inputRef    = useRef(null);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowDrop(false);
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (search.trim().length < 2) {
      setResults([]);
      setShowDrop(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      if (wrapRef.current) {
        const rect = wrapRef.current.getBoundingClientRect();
        setDropPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
      }
      try {
        const r = await api.getProducts({ search: search.trim(), pageSize: 6 });
        setResults(r.data?.items || []);
        setShowDrop(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  // Recalculate dropdown position when expanded changes
  useEffect(() => {
    if (expanded && wrapRef.current) {
      setTimeout(() => {
        const rect = wrapRef.current.getBoundingClientRect();
        setDropPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
      }, 320);
    }
  }, [expanded]);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      closeSearch();
    }
  };

  const handleSelect = (product) => {
    navigate(`/product/${product.id}`);
    closeSearch();
  };

  const closeSearch = () => {
    setSearch('');
    setShowDrop(false);
    setExpanded(false);
  };

  const handleFocus = () => {
    setExpanded(true);
    if (results.length > 0) setShowDrop(true);
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
        <div className={`header-main${expanded ? ' search-expanded' : ''}`}>
          <div className="container header-main-inner">

            <button
              className={`nav-btn hdr-hide-on-expand${isCat ? ' active' : ''}`}
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

            <Link to="/" className="logo hdr-hide-on-expand" onClick={e => { if (pathname === '/') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}>
              <div className="logo-text">Mobi<span className="logo-x">x</span></div>
            </Link>

            <form className="search-form" onSubmit={handleSearch} ref={wrapRef}>
              <button type="submit" className="search-btn">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
              <input
                ref={inputRef}
                type="text"
                placeholder="მოძებნე პროდუქტი..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={handleFocus}
                autoComplete="off"
              />
              {expanded && (
                <button type="button" className="search-clear-btn" onMouseDown={closeSearch}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}

              {showDrop && (
                <div
                  className="search-dropdown"
                  style={{
                    position: 'fixed',
                    top: dropPos.top + 8,
                    left: dropPos.left,
                    width: dropPos.width,
                    zIndex: 9999,
                  }}
                >
                  {loading && <div className="search-drop-loading">ეძებს...</div>}
                  {!loading && results.length === 0 && (
                    <div className="search-drop-empty">პროდუქტი ვერ მოიძებნა</div>
                  )}
                  {!loading && results.map(p => (
                    <div key={p.id} className="search-drop-item" onMouseDown={() => handleSelect(p)}>
                      <img
                        src={p.imageUrl || p.images?.[0] || '/placeholder.png'}
                        alt={p.name}
                        className="search-drop-img"
                        onError={e => { e.target.src = '/placeholder.png'; }}
                      />
                      <div className="search-drop-info">
                        <div className="search-drop-name">{p.name}</div>
                        <div className="search-drop-brand">{p.brand}</div>
                      </div>
                      <div className="search-drop-price">₾{p.price?.toLocaleString()}</div>
                    </div>
                  ))}
                  {!loading && results.length > 0 && (
                    <button type="submit" className="search-drop-all" onMouseDown={handleSearch}>
                      ყველა შედეგის ნახვა →
                    </button>
                  )}
                </div>
              )}
            </form>

            <div className="header-actions hdr-hide-on-expand">
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
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="hdr-btn">
                    <div className="hdr-avatar">{profile.firstName?.[0]}{profile.lastName?.[0]}</div>
                    <span>{profile.firstName}</span>
                  </Link>
                  <button className="hdr-btn" onClick={() => { clear(); navigate('/'); }} title="გამოსვლა">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                  </button>
                </>
              ) : (
                <Link to="/login" className="hdr-btn">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>შესვლა</span>
                </Link>
              )}
            </div>

          </div>
          <CategoryStrip hidden={isCat} />
        </div>
      </header>
    </>
  );
}
