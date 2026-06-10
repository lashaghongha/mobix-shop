import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Tablet, Watch, Laptop, Headphones, Gamepad2, Tv, Camera } from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import SidebarPopup from '../components/SidebarPopup';
import useScrollReveal from '../hooks/useScrollReveal';
import './Home.css';

const CATEGORIES = [
  { id: 1, name: 'მობილურები',      Icon: Smartphone },
  { id: 4, name: 'ტაბლეტი',         Icon: Tablet },
  { id: 8, name: 'სმარტ საათები',   Icon: Watch },
  { id: 2, name: 'ლეპტოპები | IT',  Icon: Laptop },
  { id: 5, name: 'აუდიო სისტემა',   Icon: Headphones },
  { id: 7, name: 'Gaming',           Icon: Gamepad2 },
  { id: 3, name: 'TV | მონიტორები', Icon: Tv },
  { id: 6, name: 'ფოტო | ვიდეო',   Icon: Camera },
];

const BANNERS = [
  {
    bg: 'linear-gradient(135deg,#0f0f0f 0%,#1a0a00 100%)',
    img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=700',
    title: 'iPhone 15 Pro Max',
    price: '3 999', oldPrice: '4 299', tag: 'NEW',
  },
  {
    bg: 'linear-gradient(135deg,#0d1117 0%,#0a1628 100%)',
    img: 'https://images.unsplash.com/photo-1706016851122-8bdc1d560823?w=700',
    title: 'Samsung Galaxy S24 Ultra',
    price: '3 499', oldPrice: '3 799', tag: 'BEST PRICE',
  },
  {
    bg: 'linear-gradient(135deg,#1a1a2e 0%,#0e1628 100%)',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700',
    title: 'MacBook Pro M3',
    price: '5 999', oldPrice: '6 299', tag: 'HOT',
  },
];

function BannerSlider() {
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef();

  const go = (n) => {
    setAnimating(true);
    setTimeout(() => {
      setIdx((i) => (i + n + BANNERS.length) % BANNERS.length);
      setAnimating(false);
    }, 200);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(autoNext, 5000);
  };

  const autoNext = () => {
    setAnimating(true);
    setTimeout(() => {
      setIdx(i => (i + 1) % BANNERS.length);
      setAnimating(false);
    }, 200);
  };

  useEffect(() => {
    timerRef.current = setInterval(autoNext, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const b = BANNERS[idx];
  return (
    <div className="banner-slider" style={{ background: b.bg }}>
      <button className="banner-arrow left" onClick={() => go(-1)}>‹</button>
      <div className={`banner-content ${animating ? 'banner-exit' : 'banner-enter'}`}>
        <img src={b.img} alt={b.title} className="banner-img" />
        <div className="banner-info">
          <div className="banner-tag">{b.tag}</div>
          <div className="banner-title">{b.title}</div>
          <div className="banner-price-block">
            <span className="banner-price">{b.price} ₾</span>
            <span className="banner-old">{b.oldPrice} ₾</span>
          </div>
        </div>
      </div>
      <button className="banner-arrow right" onClick={() => go(1)}>›</button>
      <div className="banner-dots">
        {BANNERS.map((_, i) => (
          <button key={i} className={`bdot ${i === idx ? 'active' : ''}`} onClick={() => go(i - idx)} />
        ))}
      </div>
    </div>
  );
}

function ProductRow({ title, products, link, loading }) {
  const rowRef = useRef();
  const revealRef = useScrollReveal();
  const scroll = (dir) => rowRef.current.scrollBy({ left: dir * 220, behavior: 'smooth' });

  return (
    <section className="product-row-section reveal-section" ref={revealRef}>
      <div className="row-header">
        <h2>{title}</h2>
        <Link to={link} className="row-see-all">ყველა →</Link>
      </div>
      <div className="row-wrap">
        <button className="row-arrow left" onClick={() => scroll(-1)}>‹</button>
        <div className="product-row" ref={rowRef}>
          {loading
            ? Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : products.map(p => <ProductCard key={p.id} product={p} />)
          }
        </div>
        <button className="row-arrow right" onClick={() => scroll(1)}>›</button>
      </div>
    </section>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <button
      className={`back-to-top ${visible ? 'visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="ზემოთ"
    >
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>
  );
}


export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [deals, setDeals]       = useState([]);
  const [phones, setPhones]     = useState([]);
  const [laptops, setLaptops]   = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [loadingDeals, setLoadingDeals]     = useState(true);
  const [loadingPhones, setLoadingPhones]   = useState(true);
  const [loadingLaptops, setLoadingLaptops] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  const [menuOpen, setMenuOpen]   = useState(false);
  const [menuCatId, setMenuCatId] = useState(null);
  const [menuTop, setMenuTop]     = useState(0);
  const [menuLeft, setMenuLeft]   = useState(0);
  const leaveTimer = useRef(null);
  const benefitsRevealRef = useScrollReveal();
  const promoRevealRef    = useScrollReveal();

  useEffect(() => {
    api.getDeals().then(r => { setDeals(Array.isArray(r.data) ? r.data : []); }).catch(() => {}).finally(() => setLoadingDeals(false));
    api.get('/products/benefits').then(r => setBenefits(Array.isArray(r.data) ? r.data : [])).catch(() => {});
    api.getProducts({ categoryId: 1, pageSize: 10 }).then(r => { setPhones(Array.isArray(r.data?.items) ? r.data.items : []); }).catch(() => {}).finally(() => setLoadingPhones(false));
    api.getProducts({ categoryId: 2, pageSize: 10 }).then(r => { setLaptops(Array.isArray(r.data?.items) ? r.data.items : []); }).catch(() => {}).finally(() => setLoadingLaptops(false));
    api.getFeatured().then(r => { setFeatured(Array.isArray(r.data) ? r.data : []); }).catch(() => {}).finally(() => setLoadingFeatured(false));
  }, []);

  const handleSidebarEnter = (catId, e) => {
    clearTimeout(leaveTimer.current);
    const rect = e.currentTarget.getBoundingClientRect();
    const sidebarRect = e.currentTarget.closest('aside').getBoundingClientRect();
    setMenuTop(rect.top);
    setMenuLeft(sidebarRect.right + 4);
    setMenuCatId(catId);
    setMenuOpen(true);
  };
  const handleSidebarLeave = () => {
    leaveTimer.current = setTimeout(() => setMenuOpen(false), 120);
  };
  const handleMenuEnter = () => clearTimeout(leaveTimer.current);
  const handleMenuLeave = () => {
    leaveTimer.current = setTimeout(() => setMenuOpen(false), 120);
  };

  return (
    <div className="home">

      {/* Hero */}
      <div className="container hero-section">
        <aside className="sidebar-categories" style={{ position: 'relative' }} onMouseLeave={handleSidebarLeave}>
          {CATEGORIES.map(({ id, name, Icon }) => (
            <Link
              key={id}
              to={`/products?categoryId=${id}`}
              className={`sidebar-item${menuCatId === id && menuOpen ? ' active' : ''}`}
              onMouseEnter={(e) => handleSidebarEnter(id, e)}
            >
              <span className="sidebar-icon"><Icon size={18} strokeWidth={1.5} /></span>
              <span>{name}</span>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginLeft:'auto', opacity:0.3 }}>
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          ))}
          {menuOpen && menuCatId && (
            <SidebarPopup
              catId={menuCatId}
              top={menuTop}
              left={menuLeft}
              onClose={() => setMenuOpen(false)}
              onMouseEnter={handleMenuEnter}
              onMouseLeave={handleMenuLeave}
            />
          )}
        </aside>
        <BannerSlider />
      </div>

      {/* Product rows */}
      <div className="container">
        <ProductRow title="⚡ სულსნრაფი შეთავაზებები" products={deals} link="/products" loading={loadingDeals} />
      </div>
      <div className="container">
        <ProductRow title="📱 მობილური ტელეფონები" products={phones} link="/products?categoryId=1" loading={loadingPhones} />
      </div>

      {/* Promo strip */}
      <div className="container promo-strip reveal-section" ref={promoRevealRef}>
        <Link to="/products?categoryId=7" className="promo-tile gaming">
          <div><div className="promo-label">Gaming Zone</div><div className="promo-sub">PlayStation 5 • Xbox Series X</div></div>
          <span style={{ fontSize:48 }}>🎮</span>
        </Link>
        <Link to="/products?categoryId=5" className="promo-tile audio">
          <div><div className="promo-label">Audio World</div><div className="promo-sub">Sony • JBL • Apple</div></div>
          <span style={{ fontSize:48 }}>🎧</span>
        </Link>
        <Link to="/products?categoryId=3" className="promo-tile tv">
          <div><div className="promo-label">Smart TV</div><div className="promo-sub">OLED • QLED • 4K</div></div>
          <span style={{ fontSize:48 }}>📺</span>
        </Link>
      </div>

      <div className="container">
        <ProductRow title="💻 ლეპტოპები" products={laptops} link="/products?categoryId=2" loading={loadingLaptops} />
      </div>
      <div className="container">
        <ProductRow title="⭐ პოპულარული პროდუქტები" products={featured} link="/products" loading={loadingFeatured} />
      </div>

      {/* Benefits */}
      {benefits.length > 0 && (
        <div className="container benefits-bar reveal-section" ref={benefitsRevealRef}>
          {benefits.map(b => (
            <div key={b.id} className="benefit-item">
              <span>{b.icon}</span>
              <div><strong>{b.title}</strong><p>{b.sub}</p></div>
            </div>
          ))}
        </div>
      )}

      <BackToTop />
    </div>
  );
}
