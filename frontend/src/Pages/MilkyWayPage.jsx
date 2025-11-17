import { useState, useEffect, useContext } from "react";
import { DefaultContext } from "../Contexts/DefaultContext";

export default function MilkyWayPage() {
  const [galaxy, setGalaxy] = useState(null);
  const [planets, setPlanets] = useState([]);

  const { apiBaseUrl } = useContext(DefaultContext);

  useEffect(() => {
    async function loadData() {
      // fetch galaxy
      const resGalaxy = await fetch(`${apiBaseUrl}/api/galaxies/1`);
      const galaxyData = await resGalaxy.json();
      setGalaxy(galaxyData);

      // fetch planets
      const resPlanets = await fetch(`${apiBaseUrl}/api/planets`);
      const planetsData = await resPlanets.json();
      setPlanets(planetsData);
    }

    loadData();
  }, [apiBaseUrl]);

  // Se la galassia non è ancora stata caricata, non mostrare nulla
  if (!galaxy) {
    return null;
  }

  return (
    <div>
      <h1>{galaxy.name}</h1>
      <p>{galaxy.description}</p>

      <section>
        <h2>Available Planets</h2>

        {planets.length === 0 ? (
          <p>No planets available.</p>
        ) : (
          <ul>
            {planets.map((planet) => (
              <li key={planet.id}>{planet.name}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
