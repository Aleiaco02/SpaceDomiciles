// Il CartContext gestisce tutto lo stato del carrello a livello globale.
// L’app salva e recupera gli articoli dal localStorage, così il carrello rimane anche dopo il refresh.
// La funzione addToCart controlla anche lo stock e mostra notifiche tramite un componente Toast.
// La funzione onQtyChange permette di modificare la quantità con limite allo stock.
// Inoltre il provider espone anche setDrawerOpen, così l’header o altri componenti possono aprire/chiudere il cassetto del carrello.

// Import dei metodi React e del componente Toast
import { createContext, useState, useContext, useEffect } from "react";
import Toast from "../Components/MicroComponents/Toast";

// Creo il contesto del carrello
const CartContext = createContext();

// Provider che avvolge tutta l'app e gestisce lo stato del carrello
export function CartProvider({ children, setDrawerOpen }) {
  // Oggetto degli articoli: struttura { id: {productData} }
  const [items, setItems] = useState({});

  // Indica se il carrello sta caricando i dati dal localStorage
  const [loading, setLoading] = useState(true);

  // Gestione toast (popup di notifica)
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Funzione per svuotare completamente il carrello
  const clearCart = () => setItems({});

  // Recupero carrello dal localStorage al primo avvio
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      setItems(savedCart ? JSON.parse(savedCart) : {}); // ripristina o crea vuoto
    } catch (err) {
      setItems({});
    }
    setLoading(false); // segna che il caricamento è terminato
  }, []);

  // Salvataggio del carrello su localStorage ogni volta che items cambia
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, loading]);

  // addToCart - Aggiunge un elemento al carrello (controlla anche lo stock prima di aggiungere)
  const addToCart = (product) => {
    setItems((current) => {
      const exists = current[product.id]; // già presente nel carrello?

      // Caso 1: il prodotto è già nel carrello
      if (exists) {
        const newQuantity = exists.quantity + 1;

        // Se supero lo stock, impedisco l'aggiunta
        if (newQuantity > product.stock) {
          setToastMessage(
            `Disponibili solo ${product.stock} unità di ${product.name}!`
          );
          setShowToast(true);
          return current; // non modifico nulla
        }

        // Aggiunta riuscita
        setToastMessage(`${product.name} aggiunto al carrello!`);
        setShowToast(true);

        return {
          ...current,
          [product.id]: { ...exists, quantity: newQuantity },
        };
      }

      // Caso 2: prima volta che viene aggiunto
      if (product.stock < 1) {
        setToastMessage(`${product.name} non disponibile!`);
        setShowToast(true);
        return current;
      }

      setToastMessage(`${product.name} aggiunto al carrello!`);
      setShowToast(true);

      return {
        ...current,
        [product.id]: { ...product, quantity: 1 },
      };
    });
  };

  // Modifica quantità da dentro il carrello
  const onQtyChange = (id, newQty) => {
    setItems((current) => {
      const copy = { ...current };
      const maxStock = copy[id].stock; // limite

      const safeQty = Math.min(newQty, maxStock);

      // Se la quantità diventa 0 → rimuovi prodotto
      if (newQty <= 0) {
        delete copy[id];
        return copy;
      }

      // Se supera lo stock → mostra toast
      if (newQty > maxStock) {
        setToastMessage("Hai raggiunto la massima quantità disponibile!");
        setShowToast(true);
      } else {
        copy[id] = { ...copy[id], quantity: safeQty };
      }

      return copy;
    });
  };

  // Il Provider esporta valori e funzioni
  return (
    <CartContext.Provider
      value={{
        items,         // oggetto con tutti gli articoli
        addToCart,     // funzione per aggiungere articoli
        onQtyChange,   // modificare quantità
        loading,       // stato di caricamento
        clearCart,     // svuota il carrello
        setDrawerOpen, // permette di aprire il Drawer dal context
      }}
    >
      {children}

      {/* Toast visualizzato globalmente ogni volta che serve */}
      <Toast
        show={showToast}
        message={toastMessage}
        onClose={() => setShowToast(false)}
        setDrawerOpen={setDrawerOpen}
      />
    </CartContext.Provider>
  );
}

// Hook personalizzato per usare facilmente il contesto
export function useCart() {
  return useContext(CartContext);
}