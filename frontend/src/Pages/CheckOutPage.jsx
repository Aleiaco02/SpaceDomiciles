// src/pages/CheckOutPage.jsx (o percorso equivalente)

import { useState } from "react";
import { useCart } from "../Contexts/CartContext";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import BraintreeDropIn from "../Components/MicroComponents/braintreeDropIn";

export default function CheckOutPage() {
    // oggetti carrello
    const { items } = useCart();
    const navigate = useNavigate();

    // ID invoice creato sul backend
    const [invoiceId, setInvoiceId] = useState(null);
    const [creatingInvoice, setCreatingInvoice] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState(false);

    // SHIPPING DATA (dati di spedizione)
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
        paese: "Italia",
    });

    // BILLING DATA (dati di fatturazione)
    const [billing, setBilling] = useState({
        nome: "",
        cognome: "",
        indirizzo: "",
        civico: "",
        città: "",
        CAP: "",
        provincia: "",
        paese: "Italia",

        // Campi aziendali (eventuali)
        azienda: "",
        piva: "",
        pec: "",
        sdi: "",
    });

    // Checkbox: dati di fatturazione uguali alla spedizione
    const [sameAsShipping, setSameAsShipping] = useState(false);

    // NON lo usiamo ora, ma lo lascio se ti serve in futuro
    const [isCompany, setIsCompany] = useState(false);

    // handler shipping
    const handleShipping = (e) =>
        setShipping({ ...shipping, [e.target.name]: e.target.value });

    // handler billing
    const handleBilling = (e) =>
        setBilling({ ...billing, [e.target.name]: e.target.value });

    // copia dati spedizione → fatturazione
    const handleSameAsShipping = () => {
        const newVal = !sameAsShipping;
        setSameAsShipping(newVal);

        if (newVal) {
            setBilling((prev) => ({
                ...prev,
                nome: shipping.nome,
                cognome: shipping.cognome,
                indirizzo: shipping.indirizzo,
                civico: shipping.civico,
                città: shipping.città,
                CAP: shipping.CAP,
                provincia: shipping.provincia,
                paese: shipping.paese,
            }));
        } else {
            setBilling({
                nome: "",
                cognome: "",
                indirizzo: "",
                civico: "",
                città: "",
                CAP: "",
                provincia: "",
                paese: "Italia",
                azienda: "",
                piva: "",
                pec: "",
                sdi: "",
            });
        }
    };

    // Totale carrello
    const totale = Object.values(items).reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const FREE_SHIPPING_THRESHOLD = 1500;
    const SHIPPING_COST = 4.99;

    const shippingCost = totale >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const totaleFinale = totale + shippingCost;

    // 🔹 STEP 1: crea l’invoice sul backend
    const handleConfirmOrder = async () => {
        try {
            setCreatingInvoice(true);

            const full_name = `${shipping.nome} ${shipping.cognome}`.trim();
            const email = shipping.email;

            // indirizzo spedizione
            const shipping_address = `${shipping.indirizzo} ${shipping.civico}, ${shipping.CAP} ${shipping.città} (${shipping.provincia}), ${shipping.paese}`;

            // indirizzo fatturazione (se sameAsShipping prendo shipping)
            const src = sameAsShipping ? shipping : billing;
            const invoice_address = `${src.indirizzo} ${src.civico}, ${src.CAP} ${src.città} (${src.provincia}), ${src.paese}`;

            // validazione minima (puoi rafforzarla tu)
            if (!full_name || !email || !shipping.indirizzo || !shipping.città) {
                alert("Compila almeno nome, cognome, email e indirizzo di spedizione.");
                setCreatingInvoice(false);
                return;
            }

            const res = await fetch("http://localhost:3000/api/create-invoice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name,
                    email,
                    shipping_address,
                    invoice_address,
                    total_amount: totaleFinale,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                console.error(data);
                alert(data.error || "Errore nella creazione della invoice");
                setCreatingInvoice(false);
                return;
            }

            setInvoiceId(data.invoice_id);
            setOrderConfirmed(true);
            alert("Ordine creato! Ora puoi procedere con il pagamento.");
        } catch (err) {
            console.error(err);
            alert("Errore nella creazione dell'ordine/invoice");
        } finally {
            setCreatingInvoice(false);
        }
    };

    return (
        <div className="galaxy-page">
            <div className="checkout-page">
                <h2>Checkout ordine</h2>

                <div className="checkout-row">
                    {/* 📦 DATI DI SPEDIZIONE */}
                    <div className="checkout-panel">
                        <h3>Dati di spedizione</h3>

                        <form>
                            <input
                                name="nome"
                                placeholder="Nome"
                                value={shipping.nome}
                                onChange={handleShipping}
                            />
                            <input
                                name="cognome"
                                placeholder="Cognome"
                                value={shipping.cognome}
                                onChange={handleShipping}
                            />
                            <input
                                name="email"
                                placeholder="Email"
                                value={shipping.email}
                                onChange={handleShipping}
                            />
                            <input
                                name="telefono"
                                placeholder="Telefono"
                                value={shipping.telefono}
                                onChange={handleShipping}
                            />

                            <input
                                name="indirizzo"
                                placeholder="Indirizzo"
                                value={shipping.indirizzo}
                                onChange={handleShipping}
                            />
                            <input
                                name="civico"
                                placeholder="Civico"
                                value={shipping.civico}
                                onChange={handleShipping}
                            />
                            <input
                                name="città"
                                placeholder="Città"
                                value={shipping.città}
                                onChange={handleShipping}
                            />
                            <input
                                name="CAP"
                                placeholder="CAP"
                                value={shipping.CAP}
                                onChange={handleShipping}
                            />
                            <input
                                name="provincia"
                                placeholder="Provincia"
                                value={shipping.provincia}
                                onChange={handleShipping}
                            />
                            <input
                                name="paese"
                                placeholder="Paese"
                                value={shipping.paese}
                                onChange={handleShipping}
                            />
                        </form>

                        {/* Checkbox: stessi dati della spedizione */}
                        <div style={{ marginTop: "10px" }}>
                            <label
                                style={{ display: "flex", alignItems: "center", gap: "8px" }}
                            >
                                <input
                                    type="checkbox"
                                    checked={sameAsShipping}
                                    onChange={handleSameAsShipping}
                                />
                                Usa gli stessi dati per la fatturazione
                            </label>
                        </div>
                    </div>

                    {/* 🧾 DATI DI FATTURAZIONE */}
                    <div className="checkout-panel">
                        <h3>Dati di fatturazione</h3>

                        <form>
                            <input
                                name="nome"
                                placeholder="Nome"
                                value={billing.nome}
                                onChange={handleBilling}
                                disabled={sameAsShipping}
                            />
                            <input
                                name="cognome"
                                placeholder="Cognome"
                                value={billing.cognome}
                                onChange={handleBilling}
                                disabled={sameAsShipping}
                            />

                            <input
                                name="indirizzo"
                                placeholder="Indirizzo"
                                value={billing.indirizzo}
                                onChange={handleBilling}
                                disabled={sameAsShipping}
                            />
                            <input
                                name="civico"
                                placeholder="Civico"
                                value={billing.civico}
                                onChange={handleBilling}
                                disabled={sameAsShipping}
                            />
                            <input
                                name="città"
                                placeholder="Città"
                                value={billing.città}
                                onChange={handleBilling}
                                disabled={sameAsShipping}
                            />
                            <input
                                name="CAP"
                                placeholder="CAP"
                                value={billing.CAP}
                                onChange={handleBilling}
                                disabled={sameAsShipping}
                            />
                            <input
                                name="provincia"
                                placeholder="Provincia"
                                value={billing.provincia}
                                onChange={handleBilling}
                                disabled={sameAsShipping}
                            />
                            <input
                                name="paese"
                                placeholder="Paese"
                                value={billing.paese}
                                onChange={handleBilling}
                                disabled={sameAsShipping}
                            />
                        </form>
                    </div>

                    {/* 🧮 RIEPILOGO ORDINE */}
                    <div className="checkout-panel order-summary">
                        <h3>Riepilogo ordine</h3>

                        <ul>
                            {Object.values(items).map((item) => (
                                <li key={item.id}>
                                    {item.name}
                                    {item.planet_name ? ` (${item.planet_name}) ` : " "}×{" "}
                                    {item.quantity}
                                    <span>
                                        €
                                        {(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className="checkout-total">
                            <strong>Costi di spedizione:</strong>{" "}
                            {shippingCost === 0 ? (
                                <span style={{ color: "white" }}>Gratis 🚀</span>
                            ) : (
                                `€${shippingCost.toFixed(2)}`
                            )}
                        </div>

                        <div className="checkout-total">
                            <strong>Totale:</strong> €{totaleFinale.toFixed(2)}
                        </div>
                    </div>
                </div>

                <div className="checkout-btn-row">
                    <button
                        className="back-to-cart-btn"
                        onClick={() => navigate("/cart")}
                    >
                        ⬅ Torna al carrello
                    </button>

                    {/* 🔹 Prima confermi l’ordine (crea invoice) */}
                    <button
                        className="checkout-btn"
                        onClick={handleConfirmOrder}
                        disabled={creatingInvoice || orderConfirmed}
                    >
                        {creatingInvoice
                            ? "Creazione ordine..."
                            : orderConfirmed
                                ? "Ordine confermato ✅"
                                : "Conferma ordine"}
                    </button>
                </div>

                {/* 🔹 Solo dopo che l’ordine è confermato mostro Braintree */}
                {orderConfirmed && invoiceId && (
                    <div style={{ marginTop: "20px" }}>
                        <BraintreeDropIn
                            amount={totaleFinale.toFixed(2)}
                            invoiceId={invoiceId}
                            onSuccess={(data) => {
                                alert("Pagamento completato!");
                                console.log("Risposta pagamento:", data);
                                navigate("/success");
                            }}
                            onError={(err) => {
                                console.error(err);
                                alert("Errore nel pagamento");
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
