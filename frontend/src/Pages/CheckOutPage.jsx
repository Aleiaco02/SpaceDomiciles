import { useState } from "react";
import { useCart } from "../Contexts/CartContext";
import "./Checkout.css";

export default function CheckOutPage() {
    //oggetti carrello
  const { items } = useCart();
  const [billing, setBilling] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    indirizzo: "",
    città: "",
    CAP: "",
    paese: "",
  });
  const [shipping, setShipping] = useState({
    indirizzo: "",
    città: "",
    CAP: "",
    paese: "",
  });

  // Funzione cambio campi
  const onChangeBilling = (e) =>
    setBilling({ ...billing, [e.target.name]: e.target.value });
  const onChangeShipping = (e) =>
    setShipping({ ...shipping, [e.target.name]: e.target.value });

  // Calcolo totale
  const totale = Object.values(items).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="galaxy-page">
      <div className="checkout-page">
        <h2>Checkout ordine</h2>
        <div className="checkout-row">
          {/* Dati fatturazione */}
          <div className="checkout-panel">
            <h3>Dati di fatturazione</h3>
            <form>
              <input name="nome" placeholder="Nome" onChange={onChangeBilling} value={billing.nome} />
              <input name="cognome" placeholder="Cognome" onChange={onChangeBilling} value={billing.cognome} />
              <input name="email" placeholder="Email" onChange={onChangeBilling} value={billing.email} />
              <input name="telefono" placeholder="Telefono" onChange={onChangeBilling} value={billing.telefono} />
              <input name="indirizzo" placeholder="Indirizzo" onChange={onChangeBilling} value={billing.indirizzo} />
              <input name="città" placeholder="Città" onChange={onChangeBilling} value={billing.città} />
              <input name="CAP" placeholder="CAP" onChange={onChangeBilling} value={billing.CAP} />
              <input name="paese" placeholder="Paese" onChange={onChangeBilling} value={billing.paese} />
            </form>
          </div>
          {/* Dati spedizione */}
          <div className="checkout-panel">
            <h3>Dati di spedizione</h3>
            <form>
              <input name="indirizzo" placeholder="Indirizzo" onChange={onChangeShipping} value={shipping.indirizzo} />
              <input name="città" placeholder="Città" onChange={onChangeShipping} value={shipping.città} />
              <input name="CAP" placeholder="CAP" onChange={onChangeShipping} value={shipping.CAP} />
              <input name="paese" placeholder="Paese" onChange={onChangeShipping} value={shipping.paese} />
            </form>
          </div>
          {/* Riepilogo ordine */}
          <div className="checkout-panel order-summary">
            <h3>Riepilogo ordine</h3>
            <ul>
              {Object.values(items).map((item) => (
                <li key={item.id}>
                  {item.name}
                  {item.planet_name ? ` (${item.planet_name}) ` : " "}
                  &times; {item.quantity}
                  <span>€{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="checkout-total">
              <strong>Totale:</strong> €{totale.toFixed(2)}
            </div>
          </div>
        </div>
        <button className="checkout-btn">Conferma ordine</button>
      </div>
    </div>
  );
}
