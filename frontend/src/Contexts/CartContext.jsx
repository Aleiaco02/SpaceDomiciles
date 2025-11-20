import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);
  const clearCart = () => setItems({});

  // Carica il carrello da localStorage una sola volta al primo render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      setItems(savedCart ? JSON.parse(savedCart) : {});
    } catch (err) {
      setItems({});
    }
    setLoading(false);
  }, []);

  // Salva ogni aggiornamento nel localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, loading]);

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
    <CartContext.Provider value={{ items, addToCart, onQtyChange, loading, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
