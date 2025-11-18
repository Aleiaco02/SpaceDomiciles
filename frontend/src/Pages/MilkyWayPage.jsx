import { useState, useEffect, useContext } from "react";
import { DefaultContext } from "../Contexts/DefaultContext";
import "./MilkyWayPage.css";
import galaxyIcon from "/img/galaxy-icon.png";

export default function MilkyWayPage() {
  const { apiBaseUrl } = useContext(DefaultContext);
  const [galaxy, setGalaxy] = useState(null);
  const [planets, setPlanets] = useState([]);

  useEffect(() => {
    async function load() {
      const galaxyRes = await fetch(`${apiBaseUrl}/api/galaxies/1`);
      const planetsRes = await fetch(`${apiBaseUrl}/api/planets`);

      setGalaxy(await galaxyRes.json());
      setPlanets(await planetsRes.json());
    }
    load();
  }, [apiBaseUrl]);

  if (!galaxy) return <p>Loading...</p>;

  return (
    <div className="galaxy-page">

      
      <div className="mw-wrapper">
        <div className="mw-header">
          <img src={galaxyIcon} alt="Galassia" className="galaxy-header-icon"/>
          <h1>{galaxy.name}</h1>
          <h2>{galaxy.description}</h2>
        </div>

        <h2 className="mw-subtitle">Pianeti Disponibili </h2>

        <div className="mw-cards-grid">
          {planets.map((planet) => (
            <div key={planet.id} className="mw-card" style={{backgroundImage: `url(${planet.image})`}}>
              <img src={planet.image} alt={planet.name} className="mw-planet-top"/>
              <h3>{planet.name}</h3>
              <p className="mw-desc">{planet.description}</p>
              <div className="mw-divider"></div>
              <a className="mw-explore" href="#"> Esplora il pianeta → </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
