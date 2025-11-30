// Il FilterContext gestisce centralmente tutti i filtri della funzione di ricerca dei pianeti.
// Definisco un oggetto defaultFilter con i valori iniziali dei filtri (temperatura, dimensioni, prezzo, ecc.).
// Lo stato filters contiene i filtri correnti e viene aggiornato attraverso due funzioni:
// - updateFilters(key, value) aggiorna un singolo campo
// - updateFiltersBatch(obj) aggiorna più campi contemporaneamente
// Il Provider esporta questi valori e funzioni a tutta l’app, in modo che qualsiasi pagina possa leggere o aggiornare i filtri mantenendo un comportamento uniforme.

// Importo le funzioni di React necessarie per creare un contesto, useContext per usarlo e useState per gestire lo stato interno
import { createContext, useContext, useState } from "react";

// Creo il contesto che verrà condiviso con tutta l’app
const DefaultContext = createContext();

// Provider del contesto: avvolge l’app e rende disponibili i filtri
export function DefaultProvider({ children }) {

  // VALORI DI DEFAULT DEI FILTRI
  const defaultFilter = {
    search: "",             // testo inserito nella barra di ricerca
    temperatureMin: -273,   // limite minimo assoluto (zero assoluto)
    temperatureMax: 500,    // limite massimo temperatura
    sizeMin: 0,             // superficie minima del pianeta
    sizeMax: 7e10,          // superficie massima (es. gigante gassoso)
    price: 5000,            // prezzo massimo per gli stack
    category: "",           // categoria aggiuntiva (se usata)
    galaxy_slug: "",        // filtra i pianeti per galassia
  };

  // STATO DEI FILTRI ATTUALI
  const [filters, setFilters] = useState(defaultFilter);


  // updateFilters: aggiorna UN singolo filtro
  const updateFilters = (key, value) => {
    setFilters((prev) => ({
      ...prev,      // mantieni tutti i valori attuali
      [key]: value, // aggiorna SOLO il filtro richiesto
    }));
  };


  // updateFiltersBatch: aggiorna PIÙ filtri insieme
  const updateFiltersBatch = (obj) => {
    setFilters((prev) => ({
      ...prev, // mantieni i filtri attuali
      ...obj,  // sovrascrivi quelli inclusi nel batch
    }));
  };


  // Provider: fornisce valori e funzioni a tutti i componenti figli
  return (
    <DefaultContext.Provider
      value={{
        filters,             // stato dei filtri attivi
        setFilters,          // funzione diretta per sostituire tutti i filtri
        updateFilters,       // aggiorna un singolo filtro
        updateFiltersBatch,  // aggiorna più filtri insieme
        defaultFilter,       // comodo per fare reset
      }}
    >
      {children}
    </DefaultContext.Provider>
  );
}

// Custom hook per usare il contesto in modo più semplice
export const useDefaultContext = () => useContext(DefaultContext);