// Questa pagina viene visualizzata quando l’utente tenta di accedere a una route inesistente.
// Mostra un semplice errore 404 con un messaggio e un’icona che permette di tornare alla Home.

// Importo Link di react-router-dom per tornare alla home senza ricaricare la pagina
import { Link } from "react-router-dom";

// Importo l’icona della galassia, usata come “bottone” grafico
import galaxyIcon from "/img/galaxy-icon.png";

// PAGINA 404 — NOT FOUND - Viene mostrata quando l’utente visita una route inesistente
export default function NotFoundPage() {
  return (
    // Contenitore principale della pagina
    <div className="galaxy-page container-coming-soon">

      {/* Titolo grande "404" per indicare errore di pagina non trovata */}
      <h1>404</h1>

      {/* Messaggio informativo */}
      <p>La pagina da che cerchi é persa nello spazio piú profondo</p>

      {/* Icona cliccabile che riporta l’utente alla HomePage */}
      <div className="gal-dim">
        <Link to="/">
          <img
            src={galaxyIcon}
            alt="Galassia"
            className="galaxy-header-icon"
          />
        </Link>
      </div>

      {/* Testo di accompagnamento sotto l’icona */}
      <p className="go-back-text">
        Tocca la galassia: la Forza ti guiderà verso la Home
      </p>
    </div>
  );
}