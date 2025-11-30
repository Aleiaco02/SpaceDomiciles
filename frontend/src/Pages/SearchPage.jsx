// La pagina Search gestisce un sistema filtri sincronizzato con l’URL.
// Quando la pagina si apre, leggo i parametri dalla query string e li trasformo in numeri o stringhe a seconda del contenuto.
// Ogni volta che i filtri cambiano, aggiorno sia lo stato che l’URL, permettendo condivisione e navigazione diretta con filtri già applicati.
// Uso la query string per fare una fetch al backend /api/planets/filter e mostrare i risultati filtrati.
// Inoltre gestisco un drawer per i filtri su mobile e un sistema di paginazione ‘load more’.

// Importo Link di React Router per permettere la navigazione senza ricaricare la pagina e useParams per leggere parametri dell’URL
import { Link, useSearchParams } from "react-router-dom";

// Hook React per gestire stato ed effetti
import { useState, useEffect } from "react";

// Importo lo stile specifico per questa pagina di ricerca
import "../styles/Search.css";

// Importo il context dei filtri globali
import { useDefaultContext } from "../Contexts/DefaultContext";

// Drawer laterale per la selezione dei filtri
import FilterDrawer from "../Components/MicroComponents/FilterDrawer";

export default function SearchPage() {
  // Estraggo dal contesto i filtri e le funzioni per aggiornarli
  const { filters, setFilters, updateFilters, defaultFilter } =
    useDefaultContext();

  // GESTIONE FILTRI NELL’URL
  // (URL condivisibile, es: ?minTemp=20&maxTemp=100)
  const [searchParams, setSearchParams] = useSearchParams();

  // Al primo caricamento → leggo i parametri nell’URL
  useEffect(() => {
    const urlFilters = Object.fromEntries([...searchParams]);

    // L’URL contiene solo stringhe → qui li riconverto in numeri dove possibile
    const parsedFilters = {};
    for (const key in urlFilters) {
      const val = urlFilters[key];
      parsedFilters[key] = isNaN(val) ? val : Number(val);
    }

    // Merging con i filtri attuali
    setFilters((prev) => ({ ...prev, ...parsedFilters }));
  }, []); // eseguito solo al mount

  // Ogni volta che i filtri cambiano → aggiorno l’URL
  useEffect(() => {
    const cleanFilters = {};

    for (const key in filters) {
      // Evito di aggiungere all'URL valori che coincidono coi default
      if (filters[key] !== defaultFilter[key]) {
        cleanFilters[key] = filters[key];
      }
    }

    // Aggiorno realmente l’URL
    setSearchParams(cleanFilters);
  }, [filters]);

  // Converto l'oggetto filters in query string per la fetch
  const queryString = new URLSearchParams(filters).toString();

  const apiBaseUrl = "http://localhost:3000";


  // FETCH PIANETI FILTRATI
  const [planets, setPlanets] = useState([]);

  // Ogni volta che i filtri cambiano → richiedo i nuovi pianeti
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/planets/filter?${queryString}`)
      .then((res) => res.json())
      .then((data) => setPlanets(data))
      .catch((err) => console.error("Errore nel caricamento pianeti:", err));
  }, [filters]);


  // GESTIONE FILTER DRAWER (mobile)
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // blocco scroll del body quando il drawer è aperto
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [isOpen]);

  // PAGINAZIONE SEMPLICE (load more)
  const [visibleCount, setVisibleCount] = useState(8);

  // Quando i filtri cambiano → resetto il numero delle card visibili
  useEffect(() => {
    setVisibleCount(8);
  }, [filters]);

  // Mostro solo le prime X card
  const displayedPlanets = planets.slice(0, visibleCount);

  // Scorrimento verso l’alto quando si cambia pagina/planet
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="galaxy-page pos">
      <h1 className="mw-subtitle-s">Cerca il tuo pianeta nell'universo</h1>

      {/*SEZIONE FILTRI*/}
      <div className="filter-dropdown-s">
        <div className="search-container-s">
          <button className="filter-btn-s" onClick={() => setIsOpen(true)}>
            Filtri
          </button>

          {/* Drawer laterale */}
          <FilterDrawer
            open={isOpen}
            onClose={() => setIsOpen(false)}
            filters={filters}
            updateFilters={updateFilters}
          />
        </div>
      </div>

      {/*RISULTATI DELLA RICERCA*/}
      <div className="mw-cards-grid-s">
        {displayedPlanets.length > 0 ? (
          displayedPlanets.map((planet) => (
            <Link
              to={`/galaxies/${planet.galaxy_slug}/${planet.slug}`}
              key={planet.id}
              className="mw-card-search-s"
              onClick={scrollToTop}
            >
              <div>
                {/* Titolo del pianeta */}
                <div className="mw-explore-s">
                  <h3>{planet.name}</h3>
                </div>

                {/* Immagine dinamica del pianeta */}
                <div
                  className={`mw-planet-img-s mw-img-${planet.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  style={{ backgroundImage: `url(${planet.image})` }}
                ></div>

                {/* Descrizione breve e link interno */}
                <div className="mw-bottom-s">
                  <p className="mw-desc-s">{planet.description}</p>
                  <div className="mw-divider-s"></div>
                  <div className="mw-explore-s">Esplora il pianeta →</div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          // Nessun risultato trovato
          <p className="no-results-s">
            Nessun pianeta rispetta i parametri inseriti
          </p>
        )}
      </div>

      {/*BOTTONE "CARICA ALTRI"*/}
      {visibleCount < planets.length && (
        <button
          className="buttonload-s"
          onClick={() => setVisibleCount((v) => v + 8)}
        >
          Carica altri
        </button>
      )}
    </div>
  );
}