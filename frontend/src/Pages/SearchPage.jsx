import { useDefaultContext } from "../Contexts/DefaultContext";
import { Link } from "react-router-dom";
export default function SearchPage() {
  // dati e funzioni dal context
  const { handleSubmit, UserTitle, setUserTitle, filteredPlanets } =
    useDefaultContext();

  return (
    <div className="galaxy-page pos contact">
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          type="text"
          placeholder="Planet name"
          value={UserTitle}
          onChange={(e) => {
            setUserTitle(e.target.value);
          }}
        />
      </form>
      <div className="mw-cards-grid">
        {/* display di tutti i pianeti a meno che non venga submitato qualcosa */}
        {filteredPlanets.length > 0 ? (
          filteredPlanets.map((planet) => (
            <Link to={`/milky-way/${planet.slug}`} key={planet.id}>
              <div key={planet.id} className="mw-card">
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
