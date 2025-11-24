import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Search.css";
import useFilteredList from "../Components/MicroComponents/useFilteredList";
export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchList, setSearchList] = useState("");

  const apiBaseUrl = "http://localhost:3000";

  //valori dell'url
  const search = searchParams.get("q") || "";
  const tempMin = Number(searchParams.get("tmin") || -273);
  const tempMax = Number(searchParams.get("tmax") || 500);
  const sizeMin = Number(searchParams.get("smin") || 0);
  const sizeMax = Number(searchParams.get("smax") || 70000000000);
  const surfaceAvailable = Number(searchParams.get("surf") || 0);

  // funzione per aggiornare l'url
  function updateQuery(newValues) {
    const updated = {
      q: search,
      tmin: tempMin,
      tmax: tempMax,
      smin: sizeMin,
      smax: sizeMax,
      surf: surfaceAvailable,
      ...newValues,
    };

    // fixa i valora vuoti
    Object.keys(updated).forEach((key) => {
      if (updated[key] === "" || updated[key] === null) {
        delete updated[key];
      }
    });

    setSearchParams(updated);
  }

  // caricamento lista pianeti
  const [planets, setPlanets] = useState([]);

  useEffect(() => {
    fetch(apiBaseUrl + "/api/planets")
      .then((res) => res.json())
      .then((data) => setPlanets(data))
      .catch((err) => console.error("Errore nel caricamento pianeti:", err));
  }, []);

  // pianeti filtrati
  const filtered = planets
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => p.temperature_min >= tempMin)
    .filter((p) => p.temperature_max <= tempMax)
    .filter((p) => p.planet_size >= sizeMin && p.planet_size <= sizeMax)
    .filter((p) => p.surface_available >= surfaceAvailable);

  // display di x numero di pianeti
  const {
    displayed: displayedPlanets,
    filtered: filteredPlanets,
    visibleCount,
    setVisibleCount,
  } = useFilteredList(filtered, search, 8);

  return (
    <div className="galaxy-page pos">
      {/* Sezione filtri */}
      <h1 className="mw-subtitle">Cerca il tuo pianeta nell'universo</h1>
      <section className="searchbar">
        {/* Filtro ricerca */}
        <div className="filter-element">
          <h4>Nome pianeta</h4>
          <input
            name="title"
            type="search"
            placeholder="Cerca pianeta..."
            value={search}
            onChange={(e) => {
              updateQuery({ q: e.target.value });
            }}
            className="search-input"
          />
        </div>
        {/* Filtro temperatura minima */}
        <div className="filter-element">
          <div className="range">
            <div>
              <h4>Temperatura Minima</h4>
              <input
                type="range"
                min="-273"
                max="500"
                value={tempMin}
                onChange={(e) => updateQuery({ tmin: Number(e.target.value) })}
              />
            </div>
            {/* Filtro temperatura massima */}
            <div>
              <h4>Temperatura Massima</h4>
              <input
                type="range"
                min="-273"
                max="500"
                value={tempMax}
                onChange={(e) => updateQuery({ tmax: Number(e.target.value) })}
              />
            </div>
          </div>
          <p>
            Da {tempMin}° a {tempMax}°
          </p>
        </div>
        {/* Size Range */}
        <div className="filter-element">
          <div className="range">
            <div>
              <h4>Dimensione Minima</h4>
              <input
                type="range"
                min="0"
                max="10000000000"
                value={sizeMin}
                onChange={(e) => updateQuery({ smin: Number(e.target.value) })}
              />
            </div>
            <div className="slider-container">
              <h4>Dimensione Massima</h4>
              <input
                className="big-bar"
                type="range"
                min="0"
                max="70000000000"
                value={sizeMax}
                onChange={(e) => updateQuery({ smax: Number(e.target.value) })}
              />
            </div>
          </div>
          <p>
            {sizeMin} – {sizeMax} KM2
          </p>
          <button onClick={() => setSearchParams({})}>Reset filtri</button>
        </div>
      </section>
      <div className="mw-cards-grid">
        {/* display di tutti i pianeti a meno che non venga submitato qualcosa */}
        {filteredPlanets.length > 0 ? (
          displayedPlanets.map((planet) => (
            <>
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
            </>
          ))
        ) : (
          <p>Pianeta non trovato, inserisci il nome di un pianeta</p>
        )}
      </div>
      {visibleCount < filteredPlanets.length && (
        <button
          className="buttonload"
          onClick={() => setVisibleCount((v) => v + 10)}
        >
          Carica altri
        </button>
      )}
    </div>
  );
}
