// Pagina statica che mostra le informazioni di contatto del progetto, con un link mail-to per scrivere direttamente al team e alcune icone social. 
// Di base contribuisce al branding e alla comunicazione del sito.
// Include anche l’icona della galassia per tornare alla Home tramite click.

// Importo lo stile specifico della pagina Contattaci
import "./ContactUsPage.css";

// Icona della galassia usata per tornare alla Home
import galaxyIcon from "/img/galaxy-icon.png";

// Navigazione intra-app tramite Link (senza ricaricare la pagina)
import { Link } from "react-router-dom";

export default function ContactUs() {

  // Funzione che riporta l’utente all’inizio della pagina quando clicca la galassia
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    // Contenitore principale della pagina, con classi CSS dedicate
    <div className="galaxy-page pos contact">

      {/* Titolo principale */}
      <h1>Contattaci</h1>

      {/* Testo introduttivo */}
      <p>
        Per qualsiasi domanda o informazione, puoi scriverci a questo indirizzo
        email:
      </p>

      {/* Indirizzo email cliccabile: apre il client di posta */}
      <p>
        <a
          href="mailto:info@spacedomicile.com"
          style={{ color: "#0077cc", textDecoration: "none" }}
        >
          info@spacedomicile.com
        </a>
      </p>

      {/* Messaggio aggiuntivo */}
      <p>
        Siamo a disposizione per rispondere alle tue curiosità o per aiutarti
        nell'acquisto del suolo spaziale.
      </p>

      {/* Icone social (Font Awesome) */}
      <div className="social">
        <i className="fa-brands fa-facebook"></i>
        <i className="fa-brands fa-instagram"></i>
        <i className="fa-brands fa-pinterest"></i>
        <i className="fa-brands fa-square-x-twitter"></i>
      </div>

      {/* Icona della galassia che funge da bottone per tornare alla home */}
      <div className="gal-dim" onClick={scrollToTop}>
        <Link to="/">
          <img
            src={galaxyIcon}
            alt="Galassia"
            className="galaxy-header-icon"
          />
        </Link>
      </div>

      {/* Testo di invito al click */}
      <p className="go-back-text">
        Tocca la galassia per il respawn in Home
      </p>
    </div>
  );
}