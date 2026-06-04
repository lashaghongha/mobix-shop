import { createContext, useContext, useState } from 'react';

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [items, setItems] = useState([]); // max 3 products

  const toggle = (product) => {
    setItems(prev => {
      if (prev.find(p => p.id === product.id)) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 3) return prev; // max 3
      return [...prev, product];
    });
  };

  const remove = (id) => setItems(prev => prev.filter(p => p.id !== id));
  const clear   = ()  => setItems([]);
  const has     = (id) => items.some(p => p.id === id);

  return (
    <CompareContext.Provider value={{ items, toggle, remove, clear, has }}>
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => useContext(CompareContext);
