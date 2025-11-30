// In questa pagina recupero lo slug della galassia dall’URL e faccio due fetch: uno per i dati della galassia e uno per i pianeti appartenenti a quella galassia.
// Se il backend restituisce un 404 per i pianeti, reindirizzo automaticamente alla pagina ComingSoon.jsx.
// Le card dei pianeti sono generate dinamicamente e il link viene costruito usando il percorso corrente, quindi la navigazione è sempre coerente.
// Questo permette di avere galassie scalabili: basta aggiungerle nel database perché compaiano automaticamente nel frontend.

// Importo lo stile dedicato alla pagina della galassia
import "./MilkyWayPage.css";

// Strumenti React Router
import { Link, useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

// Hook React
import { useState, useEffect } from "react";

export default function MilkyWayPage() {
  // Recupero lo slug della galassia dall'URL (es: /galaxies/milky-way)
  const { galaxySlug } = useParams();

  // Recupero informazioni sulla route corrente
  const Location = useLocation();
  const currLocation = Location.pathname;

  // STATE LOCALE DELLA PAGINA
  const [currGalaxy, setCurrGalaxy] = useState();   // dati della galassia
  const [currPlanets, setCurrPlanets] = useState(); // pianeti della galassia

  // Serve per fare redirect (es: se la galassia non ha pianeti → coming soon)
  const navigate = useNavigate();

  // FETCH DELLA GALASSIA ATTUALE - Carica i dati della galassia quando la pagina viene caricata
  useEffect(() => {
    fetch(`http://localhost:3000/api/galaxies/${galaxySlug}`)
      .then((res) => res.json())
      .then((data) => setCurrGalaxy(data))
      .catch((err) =>
        console.error("Errore nel caricamento galassia:", err)
      );
  }, []); // eseguito solo al mount della pagina

  // Funzione per riportare l'utente all'inizio della pagina
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };


  // FETCH DEI PIANETI DELLA GALASSIA ATTUALE - Quando change lo slug della galassia → carica pianeti. Se non ci sono pianeti → redirect /coming-soon
  useEffect(() => {
    fetch("http://localhost:3000/api/planets/from/" + galaxySlug)
      .then((res) => {
        // Se la galassia non esiste o non ha pianeti disponibili
        if (!res.ok) {
          if (res.status === 404) {
            navigate("/coming-soon");
            return null;
          }
        }
        return res.json();
      })
      .then((data) => {
        if (data) setCurrPlanets(data);
      })
      .catch((err) =>
        console.error("Errore nel caricamento pianeti", err)
      );
  }, [galaxySlug, navigate]);

  // RENDER DELLA PAGINA
  return (
    <>
      <div className="galaxy-page">
        <div className="mw-wrapper">

          {/* HEADER GALASSIA */}
          <div className="mw-header">
            <h1>{currGalaxy?.name}</h1>
            <p>{currGalaxy?.description}</p>
          </div>

          {/* Lista dei pianeti della galassia */}
          {currPlanets?.length > 0 && (
            <div onClick={scrollToTop}>
              <h2 className="mw-subtitle">I pianeti</h2>

              {/* GRID DEI PIANETI */}
              <div className="mw-cards-grid">
                {currPlanets?.map((planet) => (
                  <Link
                    to={`${currLocation}/${planet.slug}`}
                    key={planet.id}
                  >
                    <div className="mw-card">

                      {/* TITOLO DEL PIANETA */}
                      <div className="mw-explore">
                        <h3>{planet.name}</h3>
                      </div>

                      {/* IMMAGINE DEL PIANETA (background dinamico) */}
                      <div
                        className={`mw-planet-img mw-img-${planet.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        style={{ backgroundImage: `url(${planet.image})` }}
                      ></div>

                      {/* DESCRIZIONE + CTA */}
                      <div className="mw-bottom">
                        <p className="mw-desc">{planet.description}</p>
                        <div className="mw-divider"></div>
                        <div className="mw-explore">Esplora il pianeta →</div>
                      </div>

                    </div>
                  </Link>
                ))}
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}