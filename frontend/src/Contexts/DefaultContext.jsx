import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import axios from "axios";

export const DefaultContext = createContext();

export function DefaultProvider({ children }) {

  // logica pagina search

  // variabile di stato che contiene l'elenco dei filtri
  const [filters, setFilters] = useState({
    search: "",
    temperatureMin: -273,
    temperatureMax: 500,
    sizeMin: 0,
    sizeMax: 1000000000000,
    surfaceAvailable: 0
  });

  // funzione che aggiorna l'elenco dei filtri
  const updateFilters = (newValues) =>
    setFilters(prev => ({ ...prev, ...newValues }));

  // variabile di stato campo di ricerca utente
  const [UserTitle, setUserTitle] = useState("");
  const [SearchedFilm, setSearchedFilm] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // setSearchedFilm(UserTitle);
    updateFilters(e);
    console.log(UserTitle);
  }

  return (
    <DefaultContext.Provider
      value={{
        // handleSubmit,
        // UserTitle,
        // setUserTitle,
        // setSearchedFilm,
        // SearchedFilm,
        filters,
        updateFilters
      }}
    >
      {children}
    </DefaultContext.Provider>
  );
}

export function useDefaultContext() {
  return useContext(DefaultContext);
}
