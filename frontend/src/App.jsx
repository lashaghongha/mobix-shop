import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { CompareProvider } from './context/CompareContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProfileProvider } from './context/ProfileContext';
import Header from './components/Header';
import CategoryStrip from './components/CategoryStrip';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import CompareBar from './components/CompareBar';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Categories from './pages/Categories';
import Compare from './pages/Compare';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import AdminOrders from './admin/AdminOrders';
import AdminOrderDetail from './admin/AdminOrderDetail';
import AdminProducts from './admin/AdminProducts';
import AdminProductForm from './admin/AdminProductForm';
import AdminCategories from './admin/AdminCategories';
import AdminUsers from './admin/AdminUsers';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Login from './pages/Login';

function ShopRoutes() {
  return (
    <>
      <Header />
      <CategoryStrip />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderConfirmation />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
      <BottomNav />
      <CompareBar />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ProfileProvider>
      <CartProvider>
        <WishlistProvider>
        <CompareProvider>
          <Routes>
            {/* Admin login */}
            <Route path="/admin/login" element={<AdminLogin />} />
            {/* Admin routes — standalone layout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/:id/edit" element={<AdminProductForm />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
            {/* Shop routes */}
            <Route path="/*" element={<ShopRoutes />} />
          </Routes>
        </CompareProvider>
        </WishlistProvider>
      </CartProvider>
      </ProfileProvider>
    </BrowserRouter>
  );
}
