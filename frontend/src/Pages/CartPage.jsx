// In quest pagina si gestisce tutta la logica del carrello. Ci sono due azioni principali: andare al checkout o svuotare il carrello.
// Si recuperano gli articoli tramite il CartContext, che centralizza quantità, aggiornamenti e rimozione dei prodotti.
// La pagina mostra la lista degli articoli, calcola il totale aggiornato in tempo reale e verifica se viene raggiunta la soglia per la spedizione gratuita.
// Gestisco anche un overlay di conferma tramite Framer Motion quando l’utente vuole svuotare l’intero carrello.

// Stili della pagina carrello
import "./CartPage.css";

// Navigazione e link
import { Link, useNavigate } from "react-router-dom";

// Stato locale
import { useState } from "react";

// Context del carrello (items, modifica quantità, loading, svuotamento)
import { useCart } from "../Contexts/CartContext";

// Per animare l’overlay di conferma svuotamento
import { AnimatePresence } from "framer-motion";

// Icona per tornare alla home
import galaxyIcon from "/img/galaxy-icon.png";

// Componenti riutilizzabili
import CartItem from "../Components/MicroComponents/CartItem";
import DeleteCartOverlay from "../Components/MicroComponents/deleteCartOverlay";

export default function CarrelloPage() {
  // Dal CartContext recupero:
  // - items: prodotti nel carrello
  // - onQtyChange: modifica quantità
  // - loading: caricamento del contesto
  // - clearCart: svuota l’intero carrello
  const { items, onQtyChange, loading, clearCart } = useCart();

  const navigate = useNavigate();

  // Stato per aprire/chiudere il popup di conferma
  const [open, setOpen] = useState(false);

  // Funzione eseguita quando l’utente conferma "svuota carrello"
  const emptyCart = () => {
    console.log("Carrello svuotato");
    clearCart();  // pulisce tutto il carrello
    setOpen(false); // chiude l’overlay
  };

  // Trasformo items da oggetto → array per ciclarlo facilmente
  const itemsArray = Object.values(items);

  // Calcolo totale
  const total = itemsArray.reduce(
    (acc, item) =>
      acc + (Number(item.price) || 0) * (item.quantity || 0),
    0
  );

  // Soglia spedizione gratuita
  const FREE_SHIPPING_THRESHOLD = 1500;

  if (loading) return <p>Caricamento carrello...</p>;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="galaxy-page">

      {/* Overlay di conferma svuotamento carrello */}
      <AnimatePresence>
        {open && (
          <DeleteCartOverlay
            open={open}
            onConfirm={emptyCart}
            onCancel={() => setOpen(false)}
            text={"Stai svuotando l'intero carrello, vuoi procedere?"}
          />
        )}
      </AnimatePresence>

      <div className="cont-cart">
        <h1>Carrello</h1>

        {/* SE IL CARRELLO È VUOTO */}
        {itemsArray.length === 0 ? (
          <p>Il carrello è vuoto</p>
        ) : (
          // ALTRIMENTI mostra tutti gli articoli
          itemsArray.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onQtyChange={onQtyChange}
            />
          ))
        )}

        {/* Totale */}
        <h2>Totale: €{total.toFixed(2)}</h2>

        {/* Messaggio sulla spedizione gratuita */}
        {itemsArray.length > 0 &&
          (total >= FREE_SHIPPING_THRESHOLD ? (
            <p className="shipping-text free-shipping">
              Hai diritto alla spedizione gratuita! 🚀
            </p>
          ) : (
            <p className="shipping-text partial-shipping">
              Ti mancano{" "}
              <strong>
                €{(FREE_SHIPPING_THRESHOLD - total).toFixed(2)}
              </strong>{" "}
              per ottenere la spedizione gratuita 🚀
            </p>
          ))}

        {/* Pulsanti: checkout + svuota carrello */}
        <div className="cart-buttons-container">

          {/* Vai al checkout */}
          <button
            className="checkout-btn"
            onClick={() => {
              navigate("/checkout");
              scrollToTop();
            }}
            disabled={itemsArray.length === 0}
          >
            Vai al checkout
          </button>

          {/* Svuota carrello */}
          <button
            className="empty-cart-btn"
            onClick={() => setOpen(true)}
            disabled={itemsArray.length === 0}
          >
            Svuota carrello
          </button>
        </div>
      </div>

      {/* Icona per tornare alla home */}
      <div className="gal-dim">
        <Link to="/">
          <img
            src={galaxyIcon}
            alt="Galassia"
            className="galaxy-header-icon"
          />
        </Link>
      </div>

      {/* Testo sotto la galassia */}
      <p className="go-back-text">
        Non sei pronto all’atterraggio? Clicca la galassia e rientra alla Home
      </p>
    </div>
  );
}