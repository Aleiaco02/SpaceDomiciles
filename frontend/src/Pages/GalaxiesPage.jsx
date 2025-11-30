// Questa pagina recupera dal backend la lista delle galassie disponibili tramite una fetch all’endpoint /api/galaxies.
// Una volta ottenuti i dati, genera dinamicamente una griglia di card, ciascuna con immagine, nome, descrizione e link alla pagina dedicata della galassia.
// La pagina permette quindi all’utente di scegliere la galassia da esplorare. Volendo basta aggiungere una galassia nel database per farla apparire automaticamente.
// Include un’icona galassia per tornare rapidamente alla home.

// Hook React: useState per lo stato, useEffect per il caricamento iniziale
import { useEffect, useState } from "react";

// Link per navigare verso la pagina della singola galassia o tornare alla home
import { Link } from "react-router-dom";

// Icona della galassia (bottone di ritorno alla home)
import galaxyIcon from "/img/galaxy-icon.png";

// Stili della pagina
import "./GalaxiesPage.css";

export default function GalaxiesPage() {

  // Lista delle galassie recuperate dal backend
  const [galaxies, setGalaxies] = useState([]);

  const apiBaseUrl = "http://localhost:3000";

  // FETCH DELLE GALASSIE DAL BACKEND
  useEffect(() => {
    fetch(apiBaseUrl + "/api/galaxies")
      .then((res) => res.json())
      .then((data) => setGalaxies(data))  // salvo le galassie nello stato
      .catch((err) =>
        console.error("Errore nel caricamento galassie:", err)
      );
  }, []); // Questo effetto viene eseguito solo al mount della pagina

  // Funzione per riportare la pagina all'inizio (usata nei link)
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="galaxy-page pos-gal">
      <div className="galaxies-section">

        {/* TITOLO DELLA PAGINA */}
        <h2 className="galaxies-section-title">Galassie disponibili</h2>

        {/* Sottotitolo descrittivo */}
        <p className="galaxies-section-desc">
          Scopri stelle, pianeti e sistemi abitabili
        </p>

        {/* GRID DI CARTE DELLE GALASSIE */}
        <div className="galaxies-cards-container">

          {/* Ciclo su tutte le galassie caricate dal backend */}
          {galaxies.map((galaxy) => (
            <Link
              to={`/galaxies/${galaxy.slug}`}     // URL dinamico
              key={galaxy.id}                     // key React
              className="galaxy-card-link"
              onClick={scrollToTop}               // scroll up quando si apre la galassia
            >
              <div className="galaxy-card">

                {/* Immagine della galassia */}
                <img
                  src={`/img/${galaxy.image}`}
                  alt={galaxy.name}
                  className="galaxy-card-image"
                />

                {/* Nome */}
                <div className="galaxy-card-title">{galaxy.name}</div>

                {/* Descrizione */}
                <div className="galaxy-card-description">
                  {galaxy.description}
                </div>

              </div>
            </Link>
          ))}
        </div>

        {/* Icona finale per tornare alla home */}
        <div className="gal-dim" onClick={scrollToTop}>
          <Link to="/">
            <img
              src={galaxyIcon}
              alt="Galassia"
              className="galaxy-header-icon"
            />
          </Link>
        </div>

        <p className="go-back-text">
          Premi la galassia: la rotta per la Home è già calcolata!
        </p>
      </div>
    </div>
  );
}