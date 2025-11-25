import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Search.css";
import { useDefaultContext } from "../Contexts/DefaultContext";
import useFilteredList from "../Components/MicroComponents/useFilteredList";
export default function SearchPage() {
  const { filters, setFilters, updateFilters, defaultFilter } =
    useDefaultContext();

  // variabile di stato gestione range a doppia manopola della temperatura
  const [minT, setMinT] = useState(filters.temperatureMin);
  const [maxT, setMaxT] = useState(filters.temperatureMax);

  // variabile di stato gestione range a doppia manopola della dimensione del pianeta
  const [minS, setMinS] = useState(filters.sizeMin);
  const [maxS, setMaxS] = useState(filters.sizeMax);

  // funzione che gestisce il valore massimo temperatura
  const handleMinTChange = (e) => {
    const value = Number(e.target.value);
    if (value < maxT) setMinT(value);
  };

  // funzione che gestisce il valore minimo temperatura
  const handleMaxTChange = (e) => {
    const value = Number(e.target.value);
    if (value > minT) setMaxT(value);
  };

  // funzione che gestisce il valore massimo dimensione
  const handleMinSChange = (e) => {
    const val = Number(e.target.value);
    if (val < maxS) setMinS(val);
  };

  // funzione che gestisce il valore minimo dimensione
  const handleMaxSChange = (e) => {
    const val = Number(e.target.value);
    if (val > minS) setMaxS(val);
  };

  // Converto l’oggetto filter in query string
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

  //gestione menù a tendina
  const [isOpen, setIsOpen] = useState(false); // stato apertura/chiusura

  const toggleMenu = () => setIsOpen(!isOpen);

  // aggiorno il context ogni volta che min o max cambiano
  useEffect(() => {
    updateFilters("temperatureMin", minT);
  }, [minT]);

  useEffect(() => {
    updateFilters("temperatureMax", maxT);
  }, [maxT]);

  useEffect(() => {
    updateFilters("sizeMin", minS);
  }, [minS]);

  useEffect(() => {
    updateFilters("sizeMax", maxS);
  }, [maxS]);

  // // pianeti filtrati
  // const filtered = planets
  //   .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  //   .filter((p) => p.temperature_min >= tempMin)
  //   .filter((p) => p.temperature_max <= tempMax)
  //   .filter((p) => p.planet_size >= sizeMin && p.planet_size <= sizeMax)
  //   .filter((p) => p.surface_available >= surfaceAvailable);

  // // display di x numero di pianeti
  // const {
  //   displayed: displayedPlanets,
  //   filtered: filteredPlanets,
  //   visibleCount,
  //   setVisibleCount,
  // } = useFilteredList(filtered, search, 8);

  return (
    <div className="galaxy-page pos">
      {/* Sezione filtri */}
      <h1 className="mw-subtitle">Cerca il tuo pianeta nell'universo</h1>

      <div className="filter-dropdown">
        {/* Bottone apertura/chiusura */}
        <button onClick={toggleMenu} className="filter-button">
          Filtri {isOpen ? "▲" : "▼"}
        </button>
        {/* Contenuto del menu */}
        {isOpen && (
          <section className="searchbar">
            {/* Filtro ricerca */}
            <div className="filter-element">
              <h4>Nome pianeta</h4>
              <input
                name="title"
                type="search"
                placeholder="Cerca pianeta..."
                value={filters.search}
                onChange={(e) => {
                  updateFilters("search", e.target.value);
                }}
                className="search-input"
              />
            </div>
            {/* Filtro temperatura */}
            <div className="filter-element range-container">
              <h4 className="range-title">Temperatura </h4>

              <input
                type="range"
                min="-273"
                max="500"
                value={filters.temperatureMin}
                onChange={handleMinTChange}
                className="thumb thumb-left"
              />
              <input
                type="range"
                min="-273"
                max="500"
                value={filters.temperatureMax}
                onChange={handleMaxTChange}
                className="thumb thumb-right"
              />
              <p>
                Da {filters.temperatureMin}° a {filters.temperatureMax}°
              </p>
            </div>

            {/* Size Range */}

            <div className="filter-element range-container big">
              <h4 className="range-title">Dimensione</h4>
              <input
                type="range"
                min="0"
                max="7e+10"
                value={filters.sizeMin}
                onChange={handleMinSChange}
                className="thumb thumb-left"
              />
              <input
                type="range"
                min="0"
                max="7e+10"
                value={filters.sizeMax}
                onChange={handleMaxSChange}
                className="thumb thumb-right"
              />
              <p>
                {formatToScientificNotation(filters.sizeMin)} –{" "}
                {formatToScientificNotation(filters.sizeMax)} KM2
              </p>
            </div>
            <div className="filter-element slider-container">
              <h4>Prezzo</h4>
              <input
                type="range"
                min="0"
                max="5000"
                value={filters.price}
                onChange={(e) => updateFilters("price", Number(e.target.value))}

                // max="70000000000"
                // value={sizeMax}
                // onChange={(e) => updateQuery({ smax: Number(e.target.value) })}
              />
              <p>{filters.price} &euro; </p>
            </div>

            <div className="filter-element">
              <button
                className="reset"
                onClick={() => setFilters(defaultFilter)}
              >
                Reset filtri
              </button>
            </div>
          </section>
        )}
      </div>
      <div className="mw-cards-grid">
        {/* display di tutti i pianeti a meno che non venga submitato qualcosa */}
        {planets.length > 0 ? (
          planets.map((planet) => (
            <Link
              to={`/galaxies/${planet.galaxy_slug}/${planet.slug}`}
              key={planet.id}
              className="mw-card-search"
            >
              <div key={planet.id}>
                <div className="mw-explore">
                  <h3>{planet.name}</h3>
                </div>
                <div
                  className={`mw-planet-img mw-img-${planet.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  style={{ backgroundImage: `url(${planet.image})` }}
                ></div>
                <div className="mw-bottom">
                  <p className="mw-desc">{planet.description}</p>
                  <div className="mw-divider"></div>
                  <div className="mw-explore">Esplora il pianeta →</div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>Nessun pianeta rispetta i parametri inseriti</p>
        )}
      </div>
      {/* {visibleCount < filteredPlanets.length && (
        <button
          className="buttonload"
          onClick={() => setVisibleCount((v) => v + 8)}
        >
          Carica altri
        </button>
      )} */}
    </div>
  );
}
