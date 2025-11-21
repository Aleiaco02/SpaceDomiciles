import { useDefaultContext } from "../Contexts/DefaultContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Search.css";
export default function SearchPage() {
  // dati e funzioni dal context
  // const { handleSubmit, UserTitle, setUserTitle } =
  //   useDefaultContext();

  const { filters, updateFilters, defaultFilter } = useDefaultContext();

  const apiBaseUrl = "http://localhost:3000";
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
    .filter((p) => p.name.toLowerCase().includes(filters.search.toLowerCase()))
    .filter((p) => p.temperature_min >= filters.temperatureMin)
    .filter((p) => p.temperature_max <= filters.temperatureMax)
    .filter(
      (p) =>
        p.planet_size >= filters.sizeMin && p.planet_size <= filters.sizeMax
    )
    .filter((p) => p.surface_available >= filters.surfaceAvailable);
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
            type="text"
            placeholder="Cerca pianeta..."
            value={filters.search}
            onChange={(e) => {
              updateFilters({ search: e.target.value });
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
                value={filters.temperatureMin}
                onChange={(e) =>
                  updateFilters({ temperatureMin: Number(e.target.value) })
                }
              />
            </div>
            {/* Filtro temperatura massima */}
            <div>
              <h4>Temperatura Massima</h4>
              <input
                type="range"
                min="-273"
                max="500"
                value={filters.temperatureMax}
                onChange={(e) =>
                  updateFilters({ temperatureMax: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <p>
            Da {filters.temperatureMin}° a {filters.temperatureMax}°
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
                value={filters.sizeMin}
                onChange={(e) =>
                  updateFilters({ sizeMin: Number(e.target.value) })
                }
              />
            </div>
            <div className="slider-container">
              <h4>Dimensione Massima</h4>
              <input
                className="big-bar"
                type="range"
                min="0"
                max="70000000000"
                value={filters.sizeMax}
                onChange={(e) =>
                  updateFilters({ sizeMax: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <p>
            {filters.sizeMin} – {filters.sizeMax} KM2
          </p>
          <button onClick={() => updateFilters(defaultFilter)}>
            Reset filtri
          </button>
        </div>
      </section>
      <div className="mw-cards-grid">
        {/* display di tutti i pianeti a meno che non venga submitato qualcosa */}
        {filtered.length > 0 ? (
          filtered.map((planet) => (
            <Link
              to={`/milky-way/${planet.slug}`}
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
          <p>Pianeta non trovato, inserisci il nome di un pianeta</p>
        )}
      </div>
    </div>
  );
}
