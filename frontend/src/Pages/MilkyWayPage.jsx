import { useEffect, useState } from "react";
import "./MilkyWayPage.css";

export default function MilkyWayPage() {
  const [planets, setPlanets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/planets")
      .then((res) => res.json())
      .then((data) => setPlanets(data))
      .catch((err) => console.error("Errore nel caricamento pianeti:", err));
  }, []);

  return (
    <div className="galaxy-page">
      <div className="mw-wrapper">       
        <div className="mw-header">
          <h1>La Via Lattea</h1>
          <p>Esplora i pianeti del nostro sistema solare</p>
        </div>
        <h2 className="mw-subtitle">I pianeti</h2>
        <div className="mw-cards-grid">
          {planets.map((planet) => (
            <div key={planet.id} className="mw-card" style={{ backgroundImage: `url(${planet.image})` }}>
              <h3>{planet.name}</h3>
              <div className="mw-bottom">
                <p className="mw-desc">{planet.description}</p>
                <div className="mw-divider"></div>
                <span className="mw-explore">Esplora il pianeta →</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
