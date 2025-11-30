// Il DefaultContext è un contesto globale che gestisce sia i dati dei pianeti (caricati dal backend) sia la logica dei filtri utilizzati nella SearchPage.
// All’avvio carico la lista completa dei pianeti tramite fetch.
// I filtri utilizzano uno stato persistente: vengono salvati e recuperati dal localStorage, così restano anche dopo il refresh.
// Fornisco due funzioni per aggiornarli:
// – updateFilters: aggiorna un singolo filtro
// – updateFiltersBatch: aggiorna più filtri insieme
// Esporto tutto tramite il Provider, permettendo a qualunque pagina di accedere ai pianeti, ai filtri e alle funzioni di modifica.

// Creo e uso il contesto React
import { createContext, useContext } from "react";
import { useState, useEffect } from "react";

// Export del contesto (per permettere l'import diretto)
export const DefaultContext = createContext();

// Provider: racchiude tutta l'app e fornisce i dati a chi ne ha bisogno
export function DefaultProvider({ children }) {
  const apiBaseUrl = "http://localhost:3000";

  // CARICAMENTO LISTA COMPLETA DEI PIANETI
  const [planets, setPlanets] = useState([]);

  useEffect(() => {
    fetch(apiBaseUrl + "/api/planets")
      .then((res) => res.json())
      .then((data) => setPlanets(data)) // salvo la lista dei pianeti
      .catch((err) => console.error("Errore nel caricamento pianeti:", err));
  }, []); // eseguito solo al primo montaggio


  // FILTRI DI RICERCA — valori di default
  const defaultFilter = {
    search: "",              // testo di ricerca generica
    temperatureMin: -273,    // limite minimo assoluto
    temperatureMax: 550,     // limite massimo
    sizeMin: 0,              // superficie minima pianeta
    sizeMax: 7e10,           // superficie massima (70 miliardi km²)
    price: 5000,             // budget massimo
    galaxy_slug: "",         // filtro per galassia
  };


  // STATO DEI FILTRI — persistente grazie al localStorage
  const [filters, setFilters] = useState(() => {
    // Recupero i filtri salvati (se esistono)
    const saved = localStorage.getItem("filters");
    return saved ? JSON.parse(saved) : defaultFilter;
  });

  // Ogni volta che i filtri cambiano → salva nel localStorage
  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(filters));
  }, [filters]);


  // UPDATE: aggiorna UN solo filtro
  const updateFilters = (key, value) =>
    setFilters((prev) => ({
      ...prev,
      [key]: value, // aggiorna solo il campo specificato
    }));


  // UPDATE MULTIPLO: aggiorna più filtri insieme
  const updateFiltersBatch = (obj) =>
    setFilters((prev) => ({
      ...prev,
      ...obj, // sovrascrive più campi contemporaneamente
    }));


  // RENDER DEL PROVIDER (esporta tutto l'occorrente)
  return (
    <DefaultContext.Provider
      value={{
        filters,             // stato attuale dei filtri
        setFilters,          // funzione grezza per sostituirli tutti
        updateFilters,       // aggiorna un singolo campo
        updateFiltersBatch,  // aggiorna più campi insieme
        planets,             // lista pianeti caricata dal backend
        defaultFilter,       // comodo per resettare
        apiBaseUrl,          // base URL per le API
      }}
    >
      {children}
    </DefaultContext.Provider>
  );
}

// Hook personalizzato per usare il contesto facilmente
export function useDefaultContext() {
  return useContext(DefaultContext);
}