import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Search.css";
import { useDefaultContext } from "../Contexts/DefaultContext";
import FilterDrawer from "../Components/MicroComponents/FilterDrawer";

export default function SearchPage() {
  const { filters, setFilters, updateFilters, defaultFilter } =
    useDefaultContext();

  // gestione url condivisibile
  const [searchParams, setSearchParams] = useSearchParams();
  
  // attiva i filtri dall'url
  useEffect(() => {
    const urlFilters = Object.fromEntries([...searchParams]);

    // Converti numeri (URL li mette come stringhe)
    const parsedFilters = {};
    for (const key in urlFilters) {
      const val = urlFilters[key];
      parsedFilters[key] = isNaN(val) ? val : Number(val);
    }

    setFilters((prev) => ({ ...prev, ...parsedFilters }));
  }, []);

  // Ogni volta che i filtri cambiano → aggiorna l'URL
  useEffect(() => {
    const cleanFilters = {};

    for (const key in filters) {
      // evita di sporcare l'URL con valori identici ai default
      if (filters[key] !== defaultFilter[key]) {
        cleanFilters[key] = filters[key];
      }
    }

    setSearchParams(cleanFilters);
  }, [filters]);

  // funzione che gestisce il valore massimo temperatura
  const handleMinTChange = (e) => {
    const value = Number(e.target.value);
    if (value < filters.temperatureMax) {
      updateFilters("temperatureMin", value);
    }
  };

  // funzione che gestisce il valore minimo temperatura
  const handleMaxTChange = (e) => {
    const value = Number(e.target.value);
    if (value > filters.temperatureMin) {
      updateFilters("temperatureMax", value);
    }
  };

  // funzione che gestisce il valore massimo dimensione
  const handleMinSChange = (e) => {
    const value = Number(e.target.value);
    if (value < filters.sizeMax) {
      updateFilters("sizeMin", value);
    }
  };

  // funzione che gestisce il valore minimo dimensione
  const handleMaxSChange = (e) => {
    const value = Number(e.target.value);
    if (value > filters.sizeMin) {
      updateFilters("sizeMax", value);
    }
  };

  // Converto l'oggetto filter in query string
  const queryString = new URLSearchParams(filters).toString();

  const apiBaseUrl = "http://localhost:3000";

  const [planets, setPlanets] = useState([]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/planets/filter?${queryString}`)
      .then((res) => res.json())
      .then((data) => setPlanets(data))
      .catch((err) => console.error("Errore nel caricamento pianeti:", err));
  }, [filters]);

  // scrivo il numero in notazione scientifica
  const formatToScientificNotation = (num, decimalPlaces = 2) => {
    if (num === 0) {
      return num;
    }

    // Uso toExponential() per ottenere la notazione
    const exponentialString = num.toExponential(decimalPlaces);

    // Sostituisco la 'e' con la parte "x 10 alla n-esima" per un output più leggibile
    const [coefficient, exponent] = exponentialString.split("e");

    // Formatto l'esponente per includere il simbolo ^
    const formattedExponent = exponent.replace("+", "").replace("-", "⁻");

    return `${coefficient} \u00D7 10${formattedExponent
      .split("")
      .map((char) => {
        // Mappa i numeri normali ai loro equivalenti in apice (superscript)
        const superscriptMap = {
          0: "⁰",
          1: "¹",
          2: "²",
          3: "³",
          4: "⁴",
          5: "⁵",
          6: "⁶",
          7: "⁷",
          8: "⁸",
          9: "⁹",
        };
        return superscriptMap[char] || char; // Usa l'apice o il carattere stesso
      })
      .join("")}`;
  };

  // gestione menù a tendina
  const [isOpen, setIsOpen] = useState(false);

  // numero di card visibili a inizio pagina
  const [visibleCount, setVisibleCount] = useState(8);

  // reset quando cambiano i filtri
  useEffect(() => {
    setVisibleCount(8);
  }, [filters]);

  // crea la lista visibile
  const displayedPlanets = planets.slice(0, visibleCount);

  return (
    <div className="galaxy-page pos">
      <h1 className="mw-subtitle-s">Cerca il tuo pianeta nell'universo</h1>

      {/* Sezione filtri */}
      <div className="filter-dropdown-s">
        <div className="search-container-s">
          <button className="filter-btn-s" onClick={() => setIsOpen(true)}>
            Filtri
          </button>

          <FilterDrawer
            open={isOpen}
            onClose={() => setIsOpen(false)}
            filters={filters}
            updateFilters={updateFilters}
          />
        </div>
      </div>

      <div className="mw-cards-grid-s">
        {displayedPlanets.length > 0 ? (
          displayedPlanets.map((planet) => (
            <Link
              to={`/galaxies/${planet.galaxy_slug}/${planet.slug}`}
              key={planet.id}
              className="mw-card-search-s"
            >
              <div>
                <div className="mw-explore-s">
                  <h3>{planet.name}</h3>
                </div>
                <div
                  className={`mw-planet-img-s mw-img-${planet.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  style={{ backgroundImage: `url(${planet.image})` }}
                ></div>
                <div className="mw-bottom-s">
                  <p className="mw-desc-s">{planet.description}</p>
                  <div className="mw-divider-s"></div>
                  <div className="mw-explore-s">Esplora il pianeta →</div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="no-results-s">Nessun pianeta rispetta i parametri inseriti</p>
        )}
      </div>

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
