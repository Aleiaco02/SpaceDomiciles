// Questa pagina viene mostrata quando l’utente accede a una galassia o funzionalità non ancora disponibile. Informa che la sezione è in sviluppo.
// Include un’icona della galassia che permette di tornare velocemente alla Home.

// Link di React Router per navigare verso la Home senza ricaricare la pagina
import { Link } from "react-router-dom";

// Icona della galassia, usata come pulsante grafico
import galaxyIcon from "/img/galaxy-icon.png";

// PAGINA "COMING SOON" - Per galassie o sezioni non ancora sviluppate
const ComingSoon = () => {
  return (
    // Contenitore principale della pagina con stile dedicato
    <div className="galaxy-page container-coming-soon">

      {/* Titolo principale */}
      <h1>COMING SOON</h1>

      {/* Messaggio descrittivo, leggermente narrativo */}
      <p>
        Nel silenzio profondo dello spazio, qualcosa sta nascendo.
        <br />
        Un progetto che pulsa come una nuova stella, pronto a illuminare la galassia digitale.
      </p>

      {/* Icona cliccabile che porta l’utente alla Home */}
      <div className="gal-dim">
        <Link to="/">
          <img
            src={galaxyIcon}
            alt="Galassia"
            className="galaxy-header-icon"
          />
        </Link>
      </div>

      {/* Testo sotto l'icona */}
      <p className="go-back-text">
        Tocca la galassia: la Forza ti guiderà verso la Home
      </p>
    </div>
  );
};

export default ComingSoon;