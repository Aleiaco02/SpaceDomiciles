import { useDefaultContext } from "../Contexts/DefaultContext";
import { Link } from "react-router-dom";
import "../styles/Search.css";
import { useState, useMemo } from "react";
export default function SearchPage() {
  // dati e funzioni dal context
  const { handleSubmit, UserTitle, setUserTitle, filteredPlanets } =
    useDefaultContext();

  const [sortOption, setSortOption] = useState("");
  const [sortDir, setSortDir] = useState("asc");

  const sortedPlanets = useMemo(() => {
    let arr = [...filteredPlanets]; // evita mutazioni

    arr.sort((a, b) => {
      let valueA, valueB;

      switch (sortOption) {
        case "name":
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;

        case "size":
          valueA = a.planet_size;
          valueB = b.planet_size;
          break;

        case "population":
          valueA = a.population;
          valueB = b.population;
          break;

        case "distance":
          valueA = a.distance_from_earth;
          valueB = b.distance_from_earth;
          break;

        default:
          return 0;
      }

      if (valueA < valueB) return sortDir === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return arr;
  }, [filteredPlanets, sortOption, sortDir]);

  return (
    <div className="galaxy-page pos">
      <form onSubmit={handleSubmit} id="searchbar">
        <h1 className="mw-subtitle">Cerca il tuo pianeta nell'universo</h1>
        <input
          name="title"
          type="text"
          placeholder="Planet name"
          value={UserTitle}
          onChange={(e) => {
            setUserTitle(e.target.value);
          }}
          className="search-input f-arial"
        />
        <button type="submit" className="button-sub-search f-arial">
          Invia
        </button>

        {/* filtro per ordinazione */}
        <div>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="button-sub-search f-arial"
          >
            <option value="">Ordina...</option>
            <option value="alphabetical">Alfabetico (A-Z)</option>
            <option value="size">Per grandezza</option>
            <option value="population">Per popolazione</option>
            <option value="distance">Per distanza dalla terra</option>
          </select>
          <button
            onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
            className="button-sub-search f-arial"
          >
            {sortDir === "asc" ? "Crescente ↑" : "Decrescente ↓"}
          </button>
        </div>
      </form>

      <div className="mw-cards-grid">
        {/* display di tutti i pianeti a meno che non venga submitato qualcosa */}
        {sortedPlanets.length > 0 ? (
          sortedPlanets.map((planet) => (
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
          <p>inserisci il nome di un pianeta</p>
        )}
      </div>
    </div>
  );
}
