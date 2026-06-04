import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import './Wishlist.css';

export default function Wishlist() {
  const { items } = useWishlist();

  return (
    <div className="wishlist-page container">
      <div className="wishlist-header">
        <h1>სასურველი პროდუქტები</h1>
        {items.length > 0 && <span className="wishlist-count">{items.length}</span>}
      </div>

      {items.length === 0 ? (
        <div className="wishlist-empty">
          <Heart size={56} strokeWidth={1.2} />
          <h2>სია ცარიელია</h2>
          <p>პროდუქტებს გულის ღილაკით დაამატე</p>
          <Link to="/products" className="wishlist-browse-btn">პროდუქტების ნახვა</Link>
        </div>
      ) : (
        <div className="products-grid">
          {items.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
