// La pagina Success viene mostrata quando il pagamento è andato a buon fine.
// Non contiene logica complessa: mostra un messaggio di conferma, ringrazia l’utente e lo informa che riceverà via email sia il riepilogo dell’ordine che i certificati generati dal backend.
// Include un’icona della galassia cliccabile che riporta l’utente alla Homepage.

// Importo l'icona della galassia che verrà mostrata come bottone per tornare alla home
import galaxyIcon from "/img/galaxy-icon.png";

// Importo Link di React Router per permettere la navigazione senza ricaricare la pagina
import { Link } from "react-router-dom";

// Importo lo stile specifico per questa pagina
import "./Success.css";

// PAGINA DI SUCCESSO DOPO UN ORDINE
const Success = () => {
  return (
    // Container della pagina. "galaxy-page thanks" vengono da Success.css
    <div className="galaxy-page thanks">

      {/* Titolo principale della pagina, con stile inline personalizzato */}
      <h1
        style={{
          marginTop: "90px",
          lineHeight: "1.3",
          marginBottom: "70px",
        }}
      >
        🌌 Ordine Confermato 🌌
        <br />
        Benvenuto nell’Universo di SpaceDomiciles
      </h1>

      {/* Paragrafo descrittivo che spiega al cliente cosa succede dopo l'acquisto */}
      <p
        style={{
          maxWidth: "750px",
          margin: "40px auto",
          textAlign: "center",
          lineHeight: "1.7",
          fontSize: "1.15rem",
          opacity: 0.95,
        }}
      >
        La tua richiesta è stata ricevuta ed è stata proiettata con successo
        nelle profondità del nostro sistema interstellare. <br />
        <br />

        {/* Testo evidenziato con stile inline */}
        <span style={{ color: "violet", fontSize: "28px" }}>
          Tra pochi istanti riceverai una mail contenente: <br />
        </span>

        {/* Lista dei contenuti dell'email */}
        ✨ Il riepilogo dettagliato del tuo ordine <br />
        ✨ Il certificato ufficiale di proprietà del tuo oggetto celeste <br />
        ✨ Tutte le informazioni utili per seguire il viaggio del pacco
        attraverso la galassia <br />
        <br />

        {/* Messaggio di ringraziamento finale */}
        Grazie per aver scelto di viaggiare con noi. Il tuo acquisto non è solo
        un ordine: è un piccolo passo verso l’infinito. 🌠
      </p>

      {/* Contenitore dell'immagine cliccabile */}
      <div
        className="gal-dim"
        style={{ textAlign: "center", marginTop: "30px" }}
      >
        {/* Link alla HomePage */}
        <Link to="/">
          {/* Immagine della galassia che funge da "pulsante" */}
          <img
            src={galaxyIcon}
            alt="Galassia"
            className="galaxy-header-icon"
            style={{
              width: "120px",
              height: "120px",
              cursor: "pointer",
              transition: "0.3s",
            }}

            // Effetto hover: ingrandisce l’immagine quando ci passi sopra
            onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}

            // Ritorna alla dimensione originale quando si toglie l’hover
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          />
        </Link>
      </div>

      {/* Testo che invita l’utente a cliccare l’immagine */}
      <p
        style={{
          textAlign: "center",
          marginTop: "10px",
          fontSize: "1.05rem",
          opacity: 0.8,
          paddingBottom: "42px"
        }}
      >
        Premi la galassia e fai un salto nell’iperspazio verso la Home
      </p>
    </div>
  );
};

// Esporto il componente per poterlo usare nelle rotte
export default Success;