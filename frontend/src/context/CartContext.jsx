import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const CartContext = createContext();

const SESSION_KEY = 'zoommer_session';

function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const sessionId = getSessionId();

  const fetchCart = async () => {
    try {
      const res = await api.getCart(sessionId);
      setCartItems(Array.isArray(res.data) ? res.data : []);
    } catch {
      setCartItems([]);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      await api.addToCart({ sessionId, productId, quantity });
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    await api.updateCart(itemId, quantity);
    await fetchCart();
  };

  const removeItem = async (itemId) => {
    await api.removeFromCart(itemId);
    await fetchCart();
  };

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, total, count, loading, sessionId, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
