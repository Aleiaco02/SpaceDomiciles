import { useState } from "react";
import { useCart } from "../Contexts/CartContext";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

export default function CheckOutPage() {
    // oggetti carrello
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

    // ➤ Checkbox: dati di fatturazione uguali alla spedizione
    const [sameAsShipping, setSameAsShipping] = useState(false);

    // Funzione cambio campi
    const onChangeBilling = (e) =>
        setBilling({ ...billing, [e.target.name]: e.target.value });

    const onChangeShipping = (e) =>
        setShipping({ ...shipping, [e.target.name]: e.target.value });

    // Copia dati spedizione → fatturazione
    const handleSameAsShipping = () => {
        const newValue = !sameAsShipping;
        setSameAsShipping(newValue);

        if (newValue) {
            // copia indirizzo spedizione nei dati di fatturazione
            setBilling((prev) => ({
                ...prev,
                indirizzo: shipping.indirizzo,
                città: shipping.città,
                CAP: shipping.CAP,
                paese: shipping.paese,
            }));
        } else {
            // reset se deselezioni
            setBilling((prev) => ({
                ...prev,
                indirizzo: "",
                città: "",
                CAP: "",
                paese: "",
            }));
        }
    };

    // Calcolo totale
    const totale = Object.values(items).reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    // LOGICA SPEDIZIONE GRATIS
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
                    {/* Dati spedizione */}
                    <div className="checkout-panel">
                        <h3>Dati di spedizione</h3>
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

                    {/* Dati fatturazione */}
                    <div className="checkout-panel">
                        <h3>Dati di fatturazione</h3>

                        {/* Checkbox SAME AS SHIPPING */}
                        <div style={{ marginBottom: "10px" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <input
                                    type="checkbox"
                                    checked={sameAsShipping}
                                    onChange={handleSameAsShipping}
                                />
                                I dati di fatturazione sono gli stessi della spedizione
                            </label>
                        </div>

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

                        {/* Spedizione */}
                        <div className="checkout-total">
                            <strong>Costi di spedizione:</strong>{" "}
                            {shippingCost === 0 ? (
                                <span style={{ color: "white" }}>Gratis 🚀</span>
                            ) : (
                                `€${shippingCost.toFixed(2)}`
                            )}
                        </div>

                        {/* Totale finale */}
                        <div className="checkout-total">
                            <strong>Totale:</strong> €{totaleFinale.toFixed(2)}
                        </div>
                    </div>
                </div>

                <div className="checkout-btn-row">
                    <button
                        className="back-to-cart-btn"
                        onClick={() => navigate("/cart")}
                        style={{ marginBottom: "14px" }}
                    >
                        ⬅ Torna al carrello
                    </button>

                    <button className="checkout-btn">Conferma ordine</button>
                </div>
            </div>
        </div>
    );
}