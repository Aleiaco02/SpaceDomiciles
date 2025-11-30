// Nel Checkout gestisco tutto il flusso finale dell’acquisto.
// Inizio raccogliendo i dati di spedizione e, se l’utente lo richiede, anche i dati di fatturazione (anche opzione azienda).
// Eseguo una validazione completa dei campi (email, telefono, CAP, partita IVA ecc.), poi preparo l’ordine creando un oggetto con tutti gli items del carrello e gli indirizzi formattati.
// A questo punto chiamo un’API backend (POST /api/create_order) che genera l’ordine e la fattura e mi restituisce un invoiceId.
// Una volta ricevuto l’ID, mostro il componente Braintree per il pagamento.
// Se il pagamento va a buon fine, aggiorno lo stock dei prodotti nel database, svuoto il carrello, e reindirizzo l’utente alla pagina di successo.

// Hook React
import { useEffect, useState } from "react";

// Context del carrello: items = prodotti nel carrello, clearCart = svuota carrello
import { useCart } from "../Contexts/CartContext";

// Navigazione (per tornare al carrello o andare alla pagina success)
import { useNavigate } from "react-router-dom";

// Stili della pagina checkout
import "./Checkout.css";

// Componente per il pagamento tramite Braintree
import BraintreeDropIn from "../Components/MicroComponents/braintreeDropIn";

// Axios per chiamate API
import axios from "axios";

export default function CheckOutPage() {
  const { items, clearCart } = useCart(); // prodotti nel carrello
  const navigate = useNavigate();

  // ERRORI DEL FORM + GESTIONE STATO
  const [errors, setErrors] = useState({});
  const [invoiceId, setInvoiceId] = useState(null); // ID fattura generata dal backend
  const [creatingInvoice, setCreatingInvoice] = useState(false); // indica loading

  // DATI DI SPEDIZIONE
  const [shipping, setShipping] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    indirizzo: "",
    civico: "",
    città: "",
    CAP: "",
    provincia: "",
    paese: "",
  });

  // DATI DI FATTURAZIONE (usati solo se si vuole la fattura)
  const [billing, setBilling] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    indirizzo: "",
    civico: "",
    città: "",
    CAP: "",
    provincia: "",
    paese: "",
    azienda: "",
    piva: "",
    pec: "",
    sdi: "",
  });

  // Flags per attivare o disattivare sezioni
  const [wantInvoice, setWantInvoice] = useState(false); // richiesta fattura
  const [sameAsShipping, setSameAsShipping] = useState(false); // fatturazione = spedizione
  const [isCompany, setIsCompany] = useState(false); // acquisto aziendale

  // HANDLERS PER GESTIRE I CAMBI DI INPUT
  const handleShipping = (e) =>
    setShipping({ ...shipping, [e.target.name]: e.target.value });

  const handleBilling = (e) =>
    setBilling({ ...billing, [e.target.name]: e.target.value });

  // Copia i dati di spedizione nella fatturazione
  const handleSameAsShipping = () => {
    const v = !sameAsShipping;
    setSameAsShipping(v);

    if (v) {
      setBilling({
        ...billing,
        nome: shipping.nome,
        cognome: shipping.cognome,
        email: shipping.email,
        telefono: shipping.telefono,
        indirizzo: shipping.indirizzo,
        civico: shipping.civico,
        città: shipping.città,
        CAP: shipping.CAP,
        provincia: shipping.provincia,
        paese: shipping.paese,
      });
    }
  };

  // VALIDAZIONE FORM
  const validateForm = () => {
    let newErrors = {};

    // Regex per validare email, telefono, CAP italiano
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+ ]{7,20}$/;
    const capRegex = /^[0-9]{5}$/;

    // Funzione riutilizzabile per controlli base
    const check = (key, value, message = "Campo obbligatorio") => {
      if (!value.trim()) newErrors[key] = message;
    };

    // SHIPPING
    check("shipping_nome", shipping.nome);
    check("shipping_cognome", shipping.cognome);
    if (!emailRegex.test(shipping.email))
      newErrors.shipping_email = "Email non valida";
    if (!phoneRegex.test(shipping.telefono))
      newErrors.shipping_telefono = "Numero non valido";
    check("shipping_indirizzo", shipping.indirizzo);
    check("shipping_civico", shipping.civico);
    check("shipping_città", shipping.città);
    if (!capRegex.test(shipping.CAP)) newErrors.shipping_CAP = "CAP non valido";
    check("shipping_provincia", shipping.provincia);
    check("shipping_paese", shipping.paese);

    // BILLING (solo se fattura attivata)
    if (wantInvoice) {
      check("billing_nome", billing.nome);
      check("billing_cognome", billing.cognome);

      if (!emailRegex.test(billing.email))
        newErrors.billing_email = "Email non valida";
      if (!phoneRegex.test(billing.telefono))
        newErrors.billing_telefono = "Numero non valido";

      check("billing_indirizzo", billing.indirizzo);
      check("billing_civico", billing.civico);
      check("billing_città", billing.città);
      if (!capRegex.test(billing.CAP)) newErrors.billing_CAP = "CAP non valido";
      check("billing_provincia", billing.provincia);
      check("billing_paese", billing.paese);

      // Se acquisti come azienda → controlli extra
      if (isCompany) {
        check("billing_azienda", billing.azienda);
        if (!/^[0-9]{11}$/.test(billing.piva))
          newErrors.billing_piva = "Partita IVA non valida";
        if (billing.pec && !emailRegex.test(billing.pec))
          newErrors.billing_pec = "PEC non valida";
        if (billing.sdi && !/^[A-Za-z0-9]{7}$/.test(billing.sdi))
          newErrors.billing_sdi = "SDI non valido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true se nessun errore
  };

  // TOTALE CARRELLO + SPEDIZIONE
  const totale = Object.values(items).reduce(
    (a, item) => a + item.price * item.quantity,
    0
  );

  // Spedizione gratuita sopra 1500€
  const shippingCost = totale >= 1500 ? 0 : 4.99;

  const totaleFinale = totale + shippingCost;

  // AGGIORNA STOCK DEGLI STACK DOPO ACQUISTO
  const updateStockAfterPurchase = async () => {
    try {
      for (const item of Object.values(items)) {
        await axios.post(
          `http://localhost:3000/api/stacks/${item.id}/purchase`,
          { quantity: item.quantity }
        );
      }
      console.log("Stock aggiornato");
    } catch (error) {
      console.error("Errore aggiornamento stock:", error);
    }
  };

  // CREA ORDINE + FATTURA (API create_order)
  const handleCreateOrder = async () => {
    if (!validateForm()) return;

    try {
      setCreatingInvoice(true);

      // Creazione indirizzo in una stringa unica
      const shippingAddress = `${shipping.indirizzo} ${shipping.civico}, ${shipping.città} ${shipping.CAP}, ${shipping.provincia}, ${shipping.paese}`;

      const billingAddress = wantInvoice
        ? `${billing.indirizzo} ${billing.civico}, ${billing.città} ${billing.CAP}, ${billing.provincia}, ${billing.paese}`
        : shippingAddress;

      // Array dei prodotti da mandare al backend
      const itemsArray = Object.values(items).map((item) => ({
        stack_id: item.id,
        quantity: item.quantity,
      }));

      // Chiamata al backend
      const res = await fetch("http://localhost:3000/api/create_order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice_email: shipping.email,
          shipping_address: shippingAddress,
          invoice_address: billingAddress,
          items: itemsArray,
          wantInvoice: wantInvoice,
          billing: wantInvoice ? billing : null,
          shipping_cost: shippingCost,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Errore create_order:", data);
        return;
      }

      // Backend ritorna la fattura creata → salvo ID
      setInvoiceId(data.invoice.id);
    } catch (err) {
      console.error("Errore rete:", err);
    } finally {
      setCreatingInvoice(false);
    }
  };

  // PAGAMENTO COMPLETATO
  const handlePaymentSuccess = async () => {
    await updateStockAfterPurchase(); // aggiorna database
    clearCart();                      // svuota carrello
    navigate("/success");             // vai a pagina di successo
    scrollToTop();                    // torna in cima
  };

  // GESTIONE ERRORI DI PAGAMENTO
  const [isError, setIsError] = useState(true);
  useEffect(() => setIsError(false), []);

  // Per gli scroll
  const scrollToTop = () => {
    window.scrollTo({ top: 0 });
  };

  // RENDER COMPLETO DEL CHECKOUT
  return (
    <div className="galaxy-page">
      <div className="checkout-page">

        <h2>Checkout ordine</h2>

        <div className="checkout-row">

          {/* SEZIONE DATI SPEDIZIONE */}
          <div className="checkout-panel">
            <h3>Dati di spedizione</h3>
            <form>
              {Object.keys(shipping).map((key) => (
                <div key={key}>
                  <input
                    name={key}
                    placeholder={key}
                    value={shipping[key]}
                    onChange={handleShipping}
                  />
                  {errors[`shipping_${key}`] && (
                    <p className="error">{errors[`shipping_${key}`]}</p>
                  )}
                </div>
              ))}
            </form>

            {/* Checkbox per attivare la richiesta fattura */}
            <label>
              <input
                style={{ marginTop: "15px" }}
                type="checkbox"
                checked={wantInvoice}
                onChange={(e) => {
                  const value = e.target.checked;
                  setWantInvoice(value);
                  if (!value) {
                    setSameAsShipping(false);
                    setIsCompany(false);
                  }
                }}
              />{" "}
              Voglio la fattura
            </label>

            <br />

            {/* Copia automatica dei dati */}
            <label>
              <input
                style={{ marginTop: "15px" }}
                type="checkbox"
                disabled={!wantInvoice}
                checked={sameAsShipping}
                onChange={handleSameAsShipping}
              />{" "}
              Usa stessi dati per fatturazione
            </label>
          </div>

          {/* SEZIONE DATI FATTURAZIONE */}
          <div
            className="checkout-panel"
            style={{
              opacity: wantInvoice ? 1 : 0.5,
              pointerEvents: wantInvoice ? "auto" : "none",
            }}
          >
            <h3>Dati di fatturazione</h3>

            <form>
              {Object.keys(billing).map((key) => {
                const isCompanyField = ["azienda", "piva", "pec", "sdi"].includes(key);

                const mustShow = wantInvoice && (!isCompanyField || isCompany);
                if (!mustShow) return null;

                return (
                  <div key={key}>
                    <input
                      name={key}
                      placeholder={key}
                      value={billing[key]}
                      onChange={handleBilling}
                      disabled={!wantInvoice || (sameAsShipping && !isCompanyField)}
                    />
                    {errors[`billing_${key}`] && (
                      <p className="error">{errors[`billing_${key}`]}</p>
                    )}
                  </div>
                );
              })}
            </form>

            {/* Checkbox per attivare campi aziendali */}
            {wantInvoice && (
              <label>
                <input
                  style={{ marginTop: "15px" }}
                  type="checkbox"
                  checked={isCompany}
                  onChange={() => setIsCompany(!isCompany)}
                />{" "}
                Acquisto come azienda
              </label>
            )}
          </div>

          {/* SEZIONE RIEPILOGO ORDINE */}
          <div className="checkout-panel order-summary">
            <h3>Riepilogo ordine</h3>

            <ul>
              {Object.values(items).map((item) => (
                <li key={item.id}>
                  {item.name} × {item.quantity}
                  <span>€{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="checkout-total">
              <strong>Spedizione:</strong>{" "}
              {shippingCost === 0 ? "Gratis" : `€${shippingCost}`}
            </div>

            <div className="checkout-total">
              <strong>Totale:</strong> €{totaleFinale.toFixed(2)}
            </div>
          </div>
        </div>

        {/* BOTTONI */}
        <div className="checkout-btn-row">

          {/* Torna al carrello */}
          <button
            className="back-to-cart-btn"
            onClick={() => {
              navigate("/cart");
              scrollToTop();
            }}
          >
            ⬅ Torna al carrello
          </button>

          {/* Se l'ordine non è ancora stato creato → bottone */}
          {!invoiceId ? (
            <button className="checkout-btn" onClick={handleCreateOrder}>
              {creatingInvoice ? "Creazione ordine..." : "Procedi al pagamento"}
            </button>
          ) : (
            // Se invoiceId esiste → mostra il Braintree
            <BraintreeDropIn
              amount={totaleFinale.toFixed(2)}
              invoiceId={invoiceId}
              onSuccess={handlePaymentSuccess}
              onError={() => setIsError(!isError)}
            />
          )}
        </div>

        {isError && <p className="payerror">Errore nel pagamento</p>}
      </div>
    </div>
  );
}