// src/pages/CheckOutPage.jsx (o percorso equivalente)

import { useState } from "react";
import { useCart } from "../Contexts/CartContext";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import BraintreeDropIn from "../Components/MicroComponents/braintreeDropIn";

export default function CheckOutPage() {
    const { items } = useCart();
    const navigate = useNavigate();

    // ID invoice creato sul backend
    const [invoiceId, setInvoiceId] = useState(null);
    const [creatingInvoice, setCreatingInvoice] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState(false);

    // =============================
    // STATE
    // =============================
    const [errors, setErrors] = useState({});

    // SHIPPING
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

    // BILLING
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

    const [wantInvoice, setWantInvoice] = useState(false);
    const [sameAsShipping, setSameAsShipping] = useState(false);
    const [isCompany, setIsCompany] = useState(false);

    // =============================
    // HANDLERS
    // =============================
    const handleShipping = (e) =>
        setShipping({ ...shipping, [e.target.name]: e.target.value });

    const handleBilling = (e) =>
        setBilling({ ...billing, [e.target.name]: e.target.value });

    // =============================
    // COPY SHIPPING → BILLING
    // =============================
    const handleSameAsShipping = () => {
        const val = !sameAsShipping;
        setSameAsShipping(val);

        if (val) {
            setBilling((prev) => ({
                ...prev,
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
            }));
        } else {
            setBilling((prev) => ({
                ...prev,
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
            }));
        }
    };

    // =============================
    // VALIDAZIONE FORM
    // =============================
    const validateForm = () => {
        let newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9+ ]{7,20}$/;
        const capRegex = /^[0-9]{5}$/;
        const civicRegex = /^[0-9]{1,4}[A-Za-z0-9\/-]{0,4}$/;

        const check = (field, value, message) => {
            if (!value.trim()) newErrors[field] = "Campo obbligatorio";
            else if (message) newErrors[field] = message;
        };

        // -------------------------
        // VALIDAZIONE SHIPPING
        // -------------------------
        check("shipping_nome", shipping.nome);
        check("shipping_cognome", shipping.cognome);

        if (!emailRegex.test(shipping.email))
            newErrors.shipping_email = "Email non valida";

        if (!phoneRegex.test(shipping.telefono))
            newErrors.shipping_telefono = "Numero non valido";

        check("shipping_indirizzo", shipping.indirizzo);

        if (!civicRegex.test(shipping.civico))
            newErrors.shipping_civico = "Civico non valido";

        check("shipping_città", shipping.città);

        if (!capRegex.test(shipping.CAP))
            newErrors.shipping_CAP = "CAP non valido";

        check("shipping_provincia", shipping.provincia);
        check("shipping_paese", shipping.paese);

        // -------------------------
        // VALIDAZIONE BILLING
        // SOLO SE L'UTENTE VUOLE LA FATTURA
        // -------------------------
        if (wantInvoice) {
            check("billing_nome", billing.nome);
            check("billing_cognome", billing.cognome);

            if (!emailRegex.test(billing.email))
                newErrors.billing_email = "Email non valida";

            if (!phoneRegex.test(billing.telefono))
                newErrors.billing_telefono = "Numero non valido";

            check("billing_indirizzo", billing.indirizzo);

            if (!civicRegex.test(billing.civico))
                newErrors.billing_civico = "Civico non valido";

            check("billing_città", billing.città);

            if (!capRegex.test(billing.CAP))
                newErrors.billing_CAP = "CAP non valido";

            check("billing_provincia", billing.provincia);
            check("billing_paese", billing.paese);

            // -------------------------
            // SE AZIENDA → VALIDAZIONI EXTRA
            // -------------------------
            if (isCompany) {
                if (!billing.azienda.trim())
                    newErrors.billing_azienda = "Obbligatorio";

                if (!/^[0-9]{11}$/.test(billing.piva))
                    newErrors.billing_piva = "Partita IVA non valida (11 cifre)";

                if (billing.pec.trim() && !emailRegex.test(billing.pec))
                    newErrors.billing_pec = "PEC non valida";

                if (billing.sdi.trim() && !/^[A-Za-z0-9]{7}$/.test(billing.sdi))
                    newErrors.billing_sdi = "SDI non valido (7 caratteri)";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // =============================
    // SUBMIT
    // =============================
    const handleSubmit = () => {
        if (!validateForm()) return;

        alert("Form valido! (qui parte la chiamata API)");
    };

    // =============================
    // TOTALE ORDINE
    // =============================
    const totale = Object.values(items).reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const SHIPPING_COST = 4.99;
    const FREE_SHIPPING_THRESHOLD = 1500;
    const shippingCost =
        totale >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const totaleFinale = totale + shippingCost;

    // =============================
    // RENDER
    // =============================
    return (
        <div className="galaxy-page">
            <div className="checkout-page">
                <h2>Checkout ordine</h2>

                <div className="checkout-row">

                    {/* --------------------------------------------------------
                SHIPPING
          --------------------------------------------------------- */}
                    <div className="checkout-panel">
                        <h3>Dati di spedizione</h3>

                        <form>
                            <input name="nome" placeholder="Nome" value={shipping.nome} onChange={handleShipping} />
                            {errors.shipping_nome && <p className="error">{errors.shipping_nome}</p>}

                            <input name="cognome" placeholder="Cognome" value={shipping.cognome} onChange={handleShipping} />
                            {errors.shipping_cognome && <p className="error">{errors.shipping_cognome}</p>}

                            <input name="email" placeholder="Email" value={shipping.email} onChange={handleShipping} />
                            {errors.shipping_email && <p className="error">{errors.shipping_email}</p>}

                            <input name="telefono" placeholder="Telefono" value={shipping.telefono} onChange={handleShipping} />
                            {errors.shipping_telefono && <p className="error">{errors.shipping_telefono}</p>}

                            <input name="indirizzo" placeholder="Indirizzo" value={shipping.indirizzo} onChange={handleShipping} />
                            {errors.shipping_indirizzo && <p className="error">{errors.shipping_indirizzo}</p>}

                            <input name="civico" placeholder="Civico" value={shipping.civico} onChange={handleShipping} />
                            {errors.shipping_civico && <p className="error">{errors.shipping_civico}</p>}

                            <input name="città" placeholder="Città" value={shipping.città} onChange={handleShipping} />
                            {errors.shipping_città && <p className="error">{errors.shipping_città}</p>}

                            <input name="CAP" placeholder="CAP" value={shipping.CAP} onChange={handleShipping} />
                            {errors.shipping_CAP && <p className="error">{errors.shipping_CAP}</p>}

                            <input name="provincia" placeholder="Provincia" value={shipping.provincia} onChange={handleShipping} />
                            {errors.shipping_provincia && <p className="error">{errors.shipping_provincia}</p>}

                            <input name="paese" placeholder="Paese" value={shipping.paese} onChange={handleShipping} />
                            {errors.shipping_paese && <p className="error">{errors.shipping_paese}</p>}
                        </form>

                        {/* WANT INVOICE CHECKBOX */}
                        <label style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                            <input
                                type="checkbox"
                                checked={wantInvoice}
                                onChange={() => {
                                    setWantInvoice(!wantInvoice);
                                    if (!wantInvoice) {
                                        setSameAsShipping(false);
                                        setIsCompany(false);
                                    }
                                }}
                            />
                            Voglio la fattura
                        </label>

                        {/* SAME AS SHIPPING */}
                        <label style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                            <input
                                type="checkbox"
                                disabled={!wantInvoice}
                                checked={sameAsShipping}
                                onChange={handleSameAsShipping}
                            />
                            Usa gli stessi dati per la fatturazione
                        </label>
                    </div>

                    {/* --------------------------------------------------------
                BILLING
          --------------------------------------------------------- */}
                    <div
                        className="checkout-panel"
                        style={{
                            opacity: wantInvoice ? 1 : 0.55,
                            pointerEvents: wantInvoice ? "auto" : "none",
                        }}
                    >
                        <h3>Dati di fatturazione</h3>

                        <form>
                            <input name="nome" placeholder="Nome"
                                value={billing.nome}
                                disabled={!wantInvoice}
                                onChange={handleBilling} />
                            {errors.billing_nome && <p className="error">{errors.billing_nome}</p>}

                            <input name="cognome" placeholder="Cognome"
                                value={billing.cognome}
                                disabled={!wantInvoice}
                                onChange={handleBilling} />
                            {errors.billing_cognome && <p className="error">{errors.billing_cognome}</p>}

                            <input name="email" placeholder="Email fatturazione"
                                value={billing.email}
                                disabled={!wantInvoice}
                                onChange={handleBilling} />
                            {errors.billing_email && <p className="error">{errors.billing_email}</p>}

                            <input name="telefono" placeholder="Telefono"
                                value={billing.telefono}
                                disabled={!wantInvoice}
                                onChange={handleBilling} />
                            {errors.billing_telefono && <p className="error">{errors.billing_telefono}</p>}

                            <input name="indirizzo" placeholder="Indirizzo"
                                value={billing.indirizzo}
                                disabled={!wantInvoice}
                                onChange={handleBilling} />
                            {errors.billing_indirizzo && <p className="error">{errors.billing_indirizzo}</p>}

                            <input name="civico" placeholder="Civico"
                                value={billing.civico}
                                disabled={!wantInvoice}
                                onChange={handleBilling} />
                            {errors.billing_civico && <p className="error">{errors.billing_civico}</p>}

                            <input name="città" placeholder="Città"
                                value={billing.città}
                                disabled={!wantInvoice}
                                onChange={handleBilling} />
                            {errors.billing_città && <p className="error">{errors.billing_città}</p>}

                            <input name="CAP" placeholder="CAP"
                                value={billing.CAP}
                                disabled={!wantInvoice}
                                onChange={handleBilling} />
                            {errors.billing_CAP && <p className="error">{errors.billing_CAP}</p>}

                            <input name="provincia" placeholder="Provincia"
                                value={billing.provincia}
                                disabled={!wantInvoice}
                                onChange={handleBilling} />
                            {errors.billing_provincia && <p className="error">{errors.billing_provincia}</p>}

                            <input name="paese" placeholder="Paese"
                                value={billing.paese}
                                disabled={!wantInvoice}
                                onChange={handleBilling} />
                            {errors.billing_paese && <p className="error">{errors.billing_paese}</p>}
                        </form>

                        {/* COMPANY */}
                        <label style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                            <input
                                type="checkbox"
                                checked={isCompany}
                                disabled={!wantInvoice}
                                onChange={() => setIsCompany(!isCompany)}
                            />
                            Acquisto come azienda
                        </label>

                        {isCompany && wantInvoice && (
                            <form style={{ marginTop: "10px" }}>
                                <input name="azienda" placeholder="Ragione sociale"
                                    value={billing.azienda}
                                    onChange={handleBilling} />
                                {errors.billing_azienda && <p className="error">{errors.billing_azienda}</p>}

                                <input name="piva" placeholder="Partita IVA"
                                    value={billing.piva}
                                    onChange={handleBilling} />
                                {errors.billing_piva && <p className="error">{errors.billing_piva}</p>}

                                <input name="pec" placeholder="PEC"
                                    value={billing.pec}
                                    onChange={handleBilling} />
                                {errors.billing_pec && <p className="error">{errors.billing_pec}</p>}

                                <input name="sdi" placeholder="Codice SDI"
                                    value={billing.sdi}
                                    onChange={handleBilling} />
                                {errors.billing_sdi && <p className="error">{errors.billing_sdi}</p>}
                            </form>
                        )}
                    </div>

                    {/* --------------------------------------------------------
                ORDER SUMMARY
          --------------------------------------------------------- */}
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
                    <button className="back-to-cart-btn" onClick={() => navigate("/cart")}>
                        ⬅ Torna al carrello
                    </button>

                    <button className="checkout-btn" onClick={handleSubmit}>
                        Conferma ordine
                    </button>
                </div>
            </div>
        </div>
    );
}
