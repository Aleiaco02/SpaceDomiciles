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
  const [UserTitle, setUserTitle] = useState("");
  const [SearchedFilm, setSearchedFilm] = useState("");
  const [filteredPlanets, setFilteredPlanets] = useState([]);
  function handleSubmit(e) {
    e.preventDefault();
    setSearchedFilm(UserTitle);
    console.log(UserTitle);
  }

  useEffect(() => {
    if (!SearchedFilm) {
      setFilteredPlanets(planets);
      return;
    }

    const filtered = planets.filter((p) =>
      p.name.toLowerCase().includes(SearchedFilm.toLowerCase())
    );

    setFilteredPlanets(filtered);
  }, [SearchedFilm, planets]);

  return (
    <DefaultContext.Provider
      value={{
        handleSubmit,
        UserTitle,
        setUserTitle,
        setSearchedFilm,
        SearchedFilm,
        planets,
        setPlanets,
        filteredPlanets,
      }}
    >
      {children}
    </DefaultContext.Provider>
  );
}

export function useDefaultContext() {
  return useContext(DefaultContext);
}
