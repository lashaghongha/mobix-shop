import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, Download } from 'lucide-react';
import { api } from '../services/api';
import './Dashboard.css';

export default function AdminProducts() {
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [catFilter, setCatFilter] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(null);
  const [toggling, setToggling] = useState(null);
  const [draftOnly, setDraftOnly] = useState(false);

  const load = () => {
    api.adminGetProducts({ categoryId: catFilter || undefined, search: search || undefined, page, pageSize: 20, draftOnly: draftOnly || undefined })
      .then(r => setData(r.data))
      .catch(() => setData({ items: [], total: 0 }));
  };

  useEffect(() => {
    api.adminGetCategories().then(r => setCategories(Array.isArray(r.data) ? r.data : []));
  }, []);

  useEffect(() => { setPage(1); }, [catFilter, search, draftOnly]);
  useEffect(() => { load(); }, [catFilter, search, page, draftOnly]);

  const handleDelete = async (id) => {
    if (!window.confirm('დარწმუნებული ხარ?')) return;
    setDeleting(id);
    await api.adminDeleteProduct(id);
    setDeleting(null);
    load();
  };

  const handleTogglePublish = async (id) => {
    setToggling(id);
    await api.adminTogglePublish(id);
    setToggling(null);
    load();
  };

  const totalPages = data ? Math.ceil(data.total / 20) : 1;

  const handleExport = async () => {
    const apiBase = import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/api`
      : '/api';
    const res = await fetch(`${apiBase}/admin/export/products`);
    if (!res.ok) return alert('ექსპორტი ვერ მოხდა');
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `mobix-products-${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <h1 className="adm-page-title" style={{ margin: 0 }}>პროდუქტები</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="adm-btn adm-btn-secondary" onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Download size={16} /> Excel-ში გამოტანა
          </button>
          <Link to="/admin/products/new" className="adm-btn adm-btn-primary">
            <Plus size={16} /> პროდუქტის დამატება
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); }}
          style={{ display: 'flex', gap: 0, border: '1.5px solid #e5e7eb', borderRadius: 9, overflow: 'hidden', background: '#fff' }}>
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="ძიება..."
            style={{ padding: '8px 12px', border: 'none', outline: 'none', fontSize: 13, width: 200 }}
          />
          <button type="submit" style={{ padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
            <Search size={16} />
          </button>
        </form>
        <button
          onClick={() => setDraftOnly(d => !d)}
          style={{
            padding: '8px 16px', border: '1.5px solid #e5e7eb', borderRadius: 9, fontSize: 13,
            background: draftOnly ? '#f59e0b' : '#fff', color: draftOnly ? '#fff' : '#555',
            cursor: 'pointer', fontWeight: draftOnly ? 700 : 400, transition: 'all .15s'
          }}
        >
          📝 Draft{draftOnly ? ' ✓' : ''}
        </button>
        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          style={{ padding: '8px 12px', border: '1.5px solid #e5e7eb', borderRadius: 9, fontSize: 13, outline: 'none', background: '#fff' }}
        >
          <option value="">ყველა კატეგორია</option>
          {(categories || []).map(c => <option key={c.id} value={c.id}>{c.nameGe}</option>)}
        </select>
      </div>

      <div className="adm-card">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>სურათი</th>
                <th>სახელი</th>
                <th>კატეგორია</th>
                <th>ბრენდი</th>
                <th>ფასი</th>
                <th>მარაგი</th>
                <th>Featured</th>
                <th>სტატუსი</th>
                <th>მოქმედება</th>
              </tr>
            </thead>
            <tbody>
              {(data?.items || []).map(p => (
                <tr key={p.id}>
                  <td>
                    <img src={p.imageUrl} alt="" style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 8, background: '#f9f9f9', padding: 4 }} />
                  </td>
                  <td style={{ fontWeight: 600, maxWidth: 200 }}>
                    <div>{p.name}</div>
                    {p.isNew && <span style={{ fontSize: 10, background: '#dbeafe', color: '#1e40af', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>NEW</span>}
                  </td>
                  <td style={{ fontSize: 12 }}>{p.category?.nameGe}</td>
                  <td style={{ fontSize: 12 }}>{p.brand}</td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{p.price?.toLocaleString()} ₾</div>
                    {p.oldPrice && <div style={{ fontSize: 11, color: '#aaa', textDecoration: 'line-through' }}>{p.oldPrice?.toLocaleString()} ₾</div>}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: p.stock === 0 ? '#ef4444' : p.stock < 5 ? '#f59e0b' : '#22c55e' }}>
                      {p.stock}
                    </span>
                  </td>
                  <td>{p.isFeatured ? '✓' : '—'}</td>
                  <td>
                    {p.isPublished
                      ? <span className="adm-badge delivered">გამოქვეყნებული</span>
                      : <span className="adm-badge pending">Draft</span>
                    }
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className={`adm-btn ${p.isPublished ? 'adm-btn-secondary' : 'adm-btn-primary'}`}
                        style={{ padding: '6px 10px' }}
                        title={p.isPublished ? 'საიტიდან დამალვა' : 'საიტზე გამოქვეყნება'}
                        onClick={() => handleTogglePublish(p.id)}
                        disabled={toggling === p.id}
                      >
                        {p.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <Link to={`/admin/products/${p.id}/edit`} className="adm-btn adm-btn-secondary" style={{ padding: '6px 10px' }}>
                        <Pencil size={14} />
                      </Link>
                      <button
                        className="adm-btn adm-btn-danger"
                        style={{ padding: '6px 10px' }}
                        onClick={() => handleDelete(p.id)}
                        disabled={deleting === p.id}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(data?.items || []).length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: '#aaa', padding: 40 }}>პროდუქტები არ მოიძებნა</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 18 }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`adm-btn ${page === p ? 'adm-btn-primary' : 'adm-btn-secondary'}`}
                style={{ padding: '6px 12px' }} onClick={() => setPage(p)}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
