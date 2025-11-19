import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);

  // Carica carrello da localStorage al montaggio
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  // Salva carrello su localStorage ad ogni modifica
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product) => {
    setItems((current) => {
      const exists = current[product.id];
      if (exists) {
        return {
          ...current,
          [product.id]: { ...exists, quantity: exists.quantity + 1 },
        };
      } else {
        return { ...current, [product.id]: { ...product, quantity: 1 } };
      }
    });
  };

  const onQtyChange = (id, newQty) => {
    setItems((current) => {
      const copy = { ...current };
      if (newQty <= 0) {
        delete copy[id];
      } else {
        copy[id] = { ...copy[id], quantity: newQty };
      }
      return copy;
    });
  };

  return (
    <CartContext.Provider value={{ items, addToCart, onQtyChange, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
