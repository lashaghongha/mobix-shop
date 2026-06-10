import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Package, Tags, Users, LogOut, Menu, X, Star
} from 'lucide-react';
import { useState } from 'react';
import { isAdminLoggedIn } from './AdminLogin';
import './AdminLayout.css';

const NAV = [
  { to: '/admin',          icon: LayoutDashboard, label: 'დეშბორდი',    end: true },
  { to: '/admin/orders',   icon: ShoppingBag,     label: 'შეკვეთები'   },
  { to: '/admin/products', icon: Package,         label: 'პროდუქტები' },
  { to: '/admin/categories', icon: Tags,          label: 'კატეგორიები' },
  { to: '/admin/users',      icon: Users,         label: 'მომხმარებლები' },
  { to: '/admin/benefits',   icon: Star,          label: 'უპირატესობები' },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!isAdminLoggedIn()) return <Navigate to="/admin/login" replace />;

  return (
    <div className="adm-wrap">
      {/* Sidebar */}
      <aside className={`adm-sidebar${open ? ' open' : ''}`}>
        <div className="adm-logo">
          <span>Mobi<span className="adm-logo-x">x</span></span>
          <span className="adm-logo-tag">Admin</span>
        </div>
        <nav className="adm-nav">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="adm-logout" onClick={() => navigate('/')}>
          <LogOut size={16} /> მთავარი გვერდი
        </button>
        <button className="adm-logout" style={{ marginTop: 0, color: '#ef4444' }} onClick={() => { localStorage.removeItem('admin_auth'); navigate('/admin/login'); }}>
          <LogOut size={16} /> გასვლა
        </button>
      </aside>

      {/* Mobile overlay */}
      {open && <div className="adm-overlay" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="adm-main">
        <div className="adm-topbar">
          <button className="adm-burger" onClick={() => setOpen(o => !o)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="adm-topbar-title">Admin Panel</span>
        </div>
        <div className="adm-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
