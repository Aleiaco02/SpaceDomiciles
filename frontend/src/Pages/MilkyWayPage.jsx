import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MilkyWayPage.css";
import { useDefaultContext } from "../Contexts/DefaultContext";

export default function MilkyWayPage() {
  const { planets } = useDefaultContext();

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
          ))}
        </div>
      </div>
    </div>
  );
}
