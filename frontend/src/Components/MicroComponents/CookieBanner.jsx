import { useState, useEffect } from "react";
import "./CookieBanner.css";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const choice = localStorage.getItem("cookie_consent");
    if (!choice) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem("cookie_consent", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-content">
        <p>
          🍪 Questo sito usa cookie tecnici per il carrello e cookie di analytics
          per migliorare l'esperienza. Puoi accettare o rifiutare i cookie non
          essenziali.
        </p>
        <div className="cookie-buttons">
          <button className="cookie-btn cookie-reject" onClick={reject}>
            Rifiuta
          </button>
          <button className="cookie-btn cookie-accept" onClick={accept}>
            Accetta tutti
          </button>
        </div>
      </div>
    </div>
  );
}
