import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import axios from "axios";

export const DefaultContext = createContext();

export function DefaultProvider({ children }) {
  const apiBaseUrl = "http://localhost:3000";
  // caricamento pianeti
  const [planets, setPlanets] = useState([]);
  useEffect(() => {
    fetch(apiBaseUrl + "/api/planets")
      .then((res) => res.json())
      .then((data) => setPlanets(data))
      .catch((err) => console.error("Errore nel caricamento pianeti:", err));
  }, []);

  // logica pagina search
  const defaultFilter = {
    search: "",
    temperatureMin: -273,
    temperatureMax: 500,
    sizeMin: 0,
    sizeMax: 70000000000,
    surfaceAvailable: 0,
  };
  // variabile di stato che contiene l'elenco dei filtri
  const [filters, setFilters] = useState(defaultFilter);

  // funzione che aggiorna l'elenco dei filtri
  const updateFilters = (newValues) =>
    setFilters((prev) => ({ ...prev, ...newValues }));

  return (
    <DefaultContext.Provider
      value={{
        filters,
        updateFilters,
        planets,
        defaultFilter,
      }}
    >
      {children}
    </DefaultContext.Provider>
  );
}

export function useDefaultContext() {
  return useContext(DefaultContext);
}
