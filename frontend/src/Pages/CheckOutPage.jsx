import { useState } from "react";
import { useCart } from "../Contexts/CartContext";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

export default function CheckOutPage() {
    // oggetti carrello
    const { items } = useCart();

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
    // DEFAULT = false → billing libero e modificabile
    const [sameAsShipping, setSameAsShipping] = useState(false);

    // Toggle: acquisto come azienda (se vorrai riattivarlo in futuro)
    const [isCompany, setIsCompany] = useState(false);

    // Shipping handler
    const handleShipping = (e) =>
        setShipping({ ...shipping, [e.target.name]: e.target.value });

    // Billing handler
    const handleBilling = (e) =>
        setBilling({ ...billing, [e.target.name]: e.target.value });

    // Copia dati spedizione → fatturazione OPPURE reset se togli la spunta
    const handleSameAsShipping = () => {
        const newVal = !sameAsShipping;
        setSameAsShipping(newVal);

        if (newVal) {
            // Copia tutti i valori shipping → billing
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
            // ❗ Svuota completamente tutti i campi di fatturazione
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

    const shippingCost =
        totale >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const totaleFinale = totale + shippingCost;

    const navigate = useNavigate();

    return (
        <div className="galaxy-page">
            <div className="checkout-page">
                <h2>Checkout ordine</h2>

                <div className="checkout-row">
                    
                    {/* 📦 DATI DI SPEDIZIONE */}
                    <div className="checkout-panel">
                        <h3>Dati di spedizione</h3>

                        <form>
                            <input name="nome" placeholder="Nome" value={shipping.nome} onChange={handleShipping} />
                            <input name="cognome" placeholder="Cognome" value={shipping.cognome} onChange={handleShipping} />
                            <input name="email" placeholder="Email" value={shipping.email} onChange={handleShipping} />
                            <input name="telefono" placeholder="Telefono" value={shipping.telefono} onChange={handleShipping} />

                            <input name="indirizzo" placeholder="Indirizzo" value={shipping.indirizzo} onChange={handleShipping} />
                            <input name="civico" placeholder="Civico" value={shipping.civico} onChange={handleShipping} />
                            <input name="città" placeholder="Città" value={shipping.città} onChange={handleShipping} />
                            <input name="CAP" placeholder="CAP" value={shipping.CAP} onChange={handleShipping} />
                            <input name="provincia" placeholder="Provincia" value={shipping.provincia} onChange={handleShipping} />
                            <input name="paese" placeholder="Paese" value={shipping.paese} onChange={handleShipping} />
                        </form>

                        {/* Checkbox: stessi dati della spedizione */}
                        <div style={{ marginTop: "10px" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                                    {item.planet_name ? ` (${item.planet_name}) ` : " "}
                                    × {item.quantity}
                                    <span>€{(item.price * item.quantity).toFixed(2)}</span>
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

                    <button className="checkout-btn">Conferma ordine</button>
                </div>
            </div>
        </div>
    );
}
