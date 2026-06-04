import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import './ProductList.css';

const BRANDS = ['Apple', 'Samsung', 'Xiaomi', 'Sony', 'LG', 'Dell', 'ASUS', 'Lenovo', 'Google', 'Microsoft', 'JBL'];
const SORT_OPTIONS = [
  { value: 'featured',   label: 'რეკომენდირებული' },
  { value: 'price-asc',  label: 'ფასი: ზრდადი' },
  { value: 'price-desc', label: 'ფასი: კლებადი' },
  { value: 'rating',     label: 'რეიტინგი' },
  { value: 'newest',     label: 'ახალი' },
];

function SortDropdown({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const current = options.find(o => o.value === value);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="sort-dropdown" ref={ref}>
      <button className="sort-dropdown-btn" onClick={() => setOpen(o => !o)}>
        {current?.label}
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <ul className="sort-dropdown-menu">
          {options.map(o => (
            <li key={o.value}
              className={`sort-dropdown-item${o.value === value ? ' active' : ''}`}
              onClick={() => { onChange(o.value); setOpen(false); }}>
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FiltersPanel({ minPrice, setMinPrice, maxPrice, setMaxPrice, selectedBrands, toggleBrand, onClose }) {
  return (
    <>
      <div className="filter-backdrop" onClick={onClose} />
      <aside className="filters">
        <div className="filters-header">
          <h3>ფილტრი</h3>
          <button className="filter-close" onClick={onClose}>✕</button>
        </div>

        <div className="filter-group">
          <h4>ფასი</h4>
          <div className="price-inputs">
            <input type="number" placeholder="მინ" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
            <span>—</span>
            <input type="number" placeholder="მაქს" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
          </div>
        </div>

        <div className="filter-group">
          <h4>ბრენდი</h4>
          {BRANDS.map(brand => (
            <label key={brand} className="filter-check">
              <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} />
              {brand}
            </label>
          ))}
        </div>

        <button className="filter-apply" onClick={onClose}>შედეგების ნახვა</button>
      </aside>
    </>
  );
}

export default function ProductList() {
  const [params] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categoryId = params.get('categoryId');
  const search     = params.get('search');
  const [sort, setSort]                   = useState('featured');
  const [minPrice, setMinPrice]           = useState('');
  const [maxPrice, setMaxPrice]           = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);

  useEffect(() => { setPage(1); }, [categoryId, search]);

  useEffect(() => {
    setLoading(true);
    const query = {
      page, pageSize: 20, sort,
      ...(categoryId && { categoryId }),
      ...(search     && { search }),
      ...(minPrice   && { minPrice }),
      ...(maxPrice   && { maxPrice }),
      ...(selectedBrands.length > 0 && { brands: selectedBrands.join(',') }),
    };
    api.getProducts(query)
      .then(r => { setProducts(Array.isArray(r.data?.items) ? r.data.items : []); setTotal(r.data?.total || 0); })
      .catch(() => { setProducts([]); setTotal(0); })
      .finally(() => setLoading(false));
  }, [categoryId, search, sort, minPrice, maxPrice, selectedBrands, page]);

  const toggleBrand = (brand) =>
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);

  const totalPages = Math.ceil(total / 20);
  const activeFilters = selectedBrands.length + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

  return (
    <div className="product-list-page container">

      {/* Desktop sidebar — always visible on desktop, hidden on mobile */}
      <div className="filters-desktop">
        <FiltersPanel
          minPrice={minPrice} setMinPrice={setMinPrice}
          maxPrice={maxPrice} setMaxPrice={setMaxPrice}
          selectedBrands={selectedBrands} toggleBrand={toggleBrand}
          onClose={() => {}}
        />
      </div>

      {/* Mobile filter overlay */}
      {filtersOpen && (
        <FiltersPanel
          minPrice={minPrice} setMinPrice={setMinPrice}
          maxPrice={maxPrice} setMaxPrice={setMaxPrice}
          selectedBrands={selectedBrands} toggleBrand={toggleBrand}
          onClose={() => setFiltersOpen(false)}
        />
      )}

      <main className="products-main">
        <div className="list-header">
          <h2>{search ? `"${search}" — ${total}` : `სულ ${total} პროდუქტი`}</h2>
          <div className="list-header-right">
            <button className="filter-toggle-btn" onClick={() => setFiltersOpen(true)}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
                <line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              ფილტრი
              {activeFilters > 0 && <span className="filter-badge">{activeFilters}</span>}
            </button>
            <SortDropdown value={sort} onChange={setSort} options={SORT_OPTIONS} />
          </div>
        </div>

        {loading ? (
          <div className="products-grid">
            {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state"><p>პროდუქტი ვერ მოიძებნა</p></div>
        ) : (
          <div className="products-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
