// src/pages/CheckOutPage.jsx
import { useState } from "react";
import { useCart } from "../Contexts/CartContext";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import BraintreeDropIn from "../Components/MicroComponents/braintreeDropIn";

export default function CheckOutPage() {
    const { items } = useCart();
    const navigate = useNavigate();

    // -------------------------
    // STATE
    // -------------------------
    const [errors, setErrors] = useState({});
    const [invoiceId, setInvoiceId] = useState(null);
    const [creatingInvoice, setCreatingInvoice] = useState(false);

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

    // -------------------------
    // HANDLERS
    // -------------------------
    const handleShipping = (e) =>
        setShipping({ ...shipping, [e.target.name]: e.target.value });

    const handleBilling = (e) =>
        setBilling({ ...billing, [e.target.name]: e.target.value });

    // Copy shipping → billing
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
                azienda: "",
                piva: "",
                pec: "",
                sdi: "",
            }));
        }
    };

    // -------------------------
    // VALIDAZIONE FORM
    // -------------------------
    const validateForm = () => {
        let newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9+ ]{7,20}$/;
        const capRegex = /^[0-9]{5}$/;
        const civicRegex = /^[0-9]{1,4}[A-Za-z0-9\/-]{0,4}$/;

        const check = (field, value) => {
            if (!value.trim()) newErrors[field] = "Campo obbligatorio";
        };

        // SHIPPING
        Object.entries(shipping).forEach(([key, value]) => {
            if (["email", "telefono", "CAP", "civico"].includes(key)) return;
            check(`shipping_${key}`, value);
        });

        if (!emailRegex.test(shipping.email))
            newErrors.shipping_email = "Email non valida";

        if (!phoneRegex.test(shipping.telefono))
            newErrors.shipping_telefono = "Numero non valido";

        if (!capRegex.test(shipping.CAP))
            newErrors.shipping_CAP = "CAP non valido";

        if (!civicRegex.test(shipping.civico))
            newErrors.shipping_civico = "Civico non valido";

        // BILLING (solo se vuole fattura)
        if (wantInvoice) {
            Object.entries(billing).forEach(([key, value]) => {
                if (["azienda", "piva", "pec", "sdi"].includes(key)) return;
                check(`billing_${key}`, value);
            });

            if (!emailRegex.test(billing.email))
                newErrors.billing_email = "Email non valida";

            if (!phoneRegex.test(billing.telefono))
                newErrors.billing_telefono = "Numero non valido";

            if (!capRegex.test(billing.CAP))
                newErrors.billing_CAP = "CAP non valido";

            if (!civicRegex.test(billing.civico))
                newErrors.billing_civico = "Civico non valido";

            // DATI AZIENDA
            if (isCompany) {
                if (!billing.azienda.trim())
                    newErrors.billing_azienda = "Obbligatorio";

                if (!/^[0-9]{11}$/.test(billing.piva))
                    newErrors.billing_piva = "Partita IVA non valida";

                if (billing.pec.trim() && !emailRegex.test(billing.pec))
                    newErrors.billing_pec = "PEC non valida";

                if (billing.sdi.trim() && !/^[A-Za-z0-9]{7}$/.test(billing.sdi))
                    newErrors.billing_sdi = "SDI non valido";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // -------------------------
    // TOTALE
    // -------------------------
    const totale = Object.values(items).reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const SHIPPING_COST = 4.99;
    const FREE_SHIPPING_THRESHOLD = 1500;
    const shippingCost = totale >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const totaleFinale = totale + shippingCost;

    // -------------------------
    // CREA INVOICE DOPO FORM VALIDO
    // -------------------------
    const handleCreateInvoice = async () => {
        if (!validateForm()) return;

        try {
            setCreatingInvoice(true);

            const shippingAddress = `${shipping.indirizzo} ${shipping.civico}, ${shipping.città}`;

            const res = await fetch("http://localhost:3000/api/create-invoice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: `${shipping.nome} ${shipping.cognome}`,
                    email: shipping.email,
                    shipping_address: shippingAddress,
                    invoice_address: wantInvoice ? shippingAddress : null,
                    total_amount: totaleFinale,
                }),
            });

            const data = await res.json();

            if (!data.success) {
                alert("Errore creazione invoice");
                return;
            }

            setInvoiceId(data.invoice_id);
        } catch {
            alert("Errore di rete");
        } finally {
            setCreatingInvoice(false);
        }
    };

    // -------------------------
    // RENDER
    // -------------------------
    return (
        <div className="galaxy-page">
            <div className="checkout-page">
                <h2>Checkout ordine</h2>

                <div className="checkout-row">

                    {/* SHIPPING */}
                    <div className="checkout-panel">
                        <h3>Dati di spedizione</h3>

                        <form>
                            {Object.entries(shipping).map(([key, value]) => (
                                <div key={key}>
                                    <input
                                        name={key}
                                        placeholder={key}
                                        value={value}
                                        onChange={handleShipping}
                                    />
                                    {errors[`shipping_${key}`] && (
                                        <p className="error">{errors[`shipping_${key}`]}</p>
                                    )}
                                </div>
                            ))}
                        </form>

                        <label style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                            <input
                                type="checkbox"
                                checked={wantInvoice}
                                onChange={() => {
                                    setWantInvoice(!wantInvoice);
                                    setSameAsShipping(false);
                                    setIsCompany(false);
                                }}
                            />
                            Voglio la fattura
                        </label>

                        <label style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                            <input
                                type="checkbox"
                                disabled={!wantInvoice}
                                checked={sameAsShipping}
                                onChange={handleSameAsShipping}
                            />
                            Usa stessi dati per fatturazione
                        </label>
                    </div>

                    {/* BILLING */}
                    <div className="checkout-panel">
                        <h3>Dati di fatturazione</h3>

                        <form>
                            {Object.entries(billing)
                                .filter(([key]) =>
                                    // Mostra TUTTI i campi normali + i campi aziendali SOLO se isCompany = true
                                    !["azienda", "piva", "pec", "sdi"].includes(key)
                                )
                                .map(([key, value]) => (
                                    <div key={key}>
                                        <input
                                            name={key}
                                            placeholder={key}
                                            value={value}
                                            disabled={!wantInvoice || sameAsShipping}
                                            onChange={handleBilling}
                                        />
                                        {errors[`billing_${key}`] && (
                                            <p className="error">{errors[`billing_${key}`]}</p>
                                        )}
                                    </div>
                                ))}

                            {/* COMPANY CHECKBOX */}
                            <label style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                                <input
                                    type="checkbox"
                                    checked={isCompany}
                                    disabled={!wantInvoice}
                                    onChange={() => setIsCompany(!isCompany)}
                                />
                                Acquisto come azienda
                            </label>

                            {/* COMPANY FIELDS visibili solo se isCompany */}
                            {isCompany && (
                                <>
                                    {["azienda", "piva", "pec", "sdi"].map((key) => (
                                        <div key={key}>
                                            <input
                                                name={key}
                                                placeholder={key}
                                                value={billing[key]}
                                                onChange={handleBilling}
                                            />
                                            {errors[`billing_${key}`] && (
                                                <p className="error">{errors[`billing_${key}`]}</p>
                                            )}
                                        </div>
                                    ))}
                                </>
                            )}
                        </form>
                    </div>

                    {/* ORDER SUMMARY */}
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

                <div className="checkout-btn-row">
                    <button className="back-to-cart-btn" onClick={() => navigate("/cart")}>
                        ⬅ Torna al carrello
                    </button>

                    {!invoiceId ? (
                        <button
                            className="checkout-btn"
                            onClick={handleCreateInvoice}
                            disabled={creatingInvoice}
                        >
                            {creatingInvoice ? "Creazione ordine..." : "Procedi al pagamento"}
                        </button>
                    ) : (
                        <BraintreeDropIn
                            amount={totaleFinale.toFixed(2)}
                            invoiceId={invoiceId}
                            onSuccess={() => navigate("/success")}
                            onError={() => alert("Errore pagamento")}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
