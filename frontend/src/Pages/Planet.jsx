// La pagina Planet recupera lo slug del pianeta dall’URL, poi scarica dal backend sia i dati del pianeta che i pacchetti (ovvero gli stack) associati.
// Inoltre scarico tutti i pianeti della stessa galassia per trovare dinamicamente il ‘previous’ e ‘next’ planet tramite il loro indice nell’array.
// La pagina mostra le specifiche del pianeta, tutti gli stack acquistabili e i pianeti vicini.
// Quando si aggiunge un pacchetto al carrello, non aggiorno ancora lo stock: lo stock viene aggiornato solo a pagamento avvenuto.

// Axios per effettuare richieste HTTP verso il backend
import axios from "axios";

// Strumenti di react-router-dom:
// - Link per navigare tramite link
// - useParams per leggere parametri dell’URL (es: :planetSlug)
// - useNavigate per reindirizzare
import { Link, useParams, useNavigate } from "react-router-dom";

// Hook React per gestire stato ed effetti
import { useState, useEffect } from "react";

// Funzionalità del carrello tramite context
import { useCart } from "../Contexts/CartContext";

// Stili CSS della pagina
import "../styles/Planet.css";

// Componente che mostra il singolo pacchetto (stack)
import PackageCard from "../Components/MicroComponents/packageCard";

const Planet = () => {
  // Hook per effettuare redirect programmati (es: se 404)
  const redirect = useNavigate();

  // STATE LOCALE DELLA PAGINA
  const [planet, setPlanet] = useState();
  const [stacks, setStacks] = useState();
  const { planetSlug } = useParams(); // slug del pianeta preso dall’URL

  // Per i pianeti vicini (navigazione next/prev)
  const [nextId, setNextId] = useState();
  const [prevId, setPrevId] = useState();
  const [planets, setPlanets] = useState(); // tutti i pianeti della stessa galassia
  const [nextPlanet, setNextPlanet] = useState();
  const [prevPlanet, setPrevPlanet] = useState();

  // Funzione presa dal contesto del carrello
  const { addToCart } = useCart();

  // FETCH DATI PIANETA
  const fecthPlanet = () => {
    axios
      .get("http://localhost:3000/api/planets/" + planetSlug)
      .then((response) => {
        setPlanet(response.data); // salvo dati pianeta
      })
      .catch((error) => {
        console.log(error);
        if (error.status === 404) redirect("/404"); // se non esiste → pagina not found
      });
  };

  // FETCH STACK (PACCHETTI DEL PIANETA)
  const fetchStack = () => {
    axios
      .get("http://localhost:3000/api/stacks/planet/" + planetSlug)
      .then((response) => {
        setStacks(response.data); // salvo i pacchetti
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // FETCH DEI PIANETI DELLA STESSA GALASSIA
  // serve per calcolare "pianeta successivo" e "precedente"
  const fetchClosePlanets = () => {
    // Calcolo ID successivo e precedente (per compatibilità futura)
    setNextId(planet?.id + 1);
    setPrevId(planet?.id - 1);

    axios
      .get(`http://localhost:3000/api/planets/from/${planet.galaxy_slug}`)
      .then((response) => {
        setPlanets(response.data); // salvo tutti i pianeti di quella galassia
      })
      .catch((error) => {
        console.log(error);
        if (error.status === 404) redirect("/404");
      });
  };

  // TROVA INDICE DEL PIANETA ATTUALE NELLA LISTA E CALCOLA I CORRISPETTIVI VICINI
  const findClosePlanets = () => {
    if (!planets || !planet) return;

    // Trovo l’indice del pianeta attuale nella lista dei pianeti
    const index = planets.findIndex((p) => p.slug === planet.slug);

    if (index === -1) return;

    // Pianeta precedente se esiste
    setPrevPlanet(index > 0 ? planets[index - 1] : null);

    // Pianeta successivo se esiste
    setNextPlanet(index < planets.length - 1 ? planets[index + 1] : null);
  };

  // Scroll to Top quando cambio pianeta
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // AGGIUNTA AL CARRELLO
  const handleAddToCart = (packageProps) => {
    if (packageProps.stock <= 0) return; // evita acquisto se out of stock

    addToCart(packageProps); // aggiunge al carrello
  };

  // COMPLETE PURCHASE
  // (viene chiamata dopo il checkout per aggiornare lo stock)
  const completePurchase = async (cartItems) => {
    try {
      for (const item of cartItems) {
        await axios.post(
          `http://localhost:3000/api/stacks/${item.id}/purchase`,
          { quantity: 1 }
        );
      }

      // Aggiorno i pacchetti dopo l'acquisto
      fetchStack();

      console.log("Acquisto completato con successo!");
    } catch (error) {
      console.error("Errore durante l'acquisto:", error);
    }
  };

  // USE EFFECTS
  // Quando cambia planetSlug → ricarica dati del pianeta
  useEffect(fecthPlanet, [planetSlug]);

  // Quando cambio pianeta → ricarico i suoi stack
  useEffect(fetchStack, [planetSlug]);

  // Quando ho caricato il pianeta → cerco i pianeti vicini nella stessa galassia
  useEffect(() => {
    if (!planet) return;
    fetchClosePlanets();
  }, [planet]);

  // Quando ho la lista dei pianeti + id next/prev → li calcolo
  useEffect(() => {
    findClosePlanets();
  }, [planets, nextId, prevId]);

  // RENDER DELLA PAGINA
  return (
    <>
      <div className="planet-page">

        {/* SEZIONE DETTAGLI PIANETA */}
        <section className="planet-details-section">
          <div className="planet-visual">
            <div className="planet-visual-container">
              <img
                className="planet-visual-image"
                src={planet?.image}
                alt={planet?.name}
              />
              <div className="planet-visual-name">{planet?.name}</div>
            </div>
          </div>

          <div className="planet-details-content">
            <h1 className="planet-details-title">{planet?.name}</h1>
            <p className="planet-details-description">{planet?.description}</p>

            {/* SPECIFICHE DEL PIANETA */}
            <div className="planet-specs">
              
              {/* Temperatura */}
              <div className="planet-spec-item">
                <div className="planet-spec-icon">
                  <i className="fas fa-temperature-half"></i>
                </div>
                <div>
                  <div className="planet-spec-label">Temperatura</div>
                  <div className="planet-spec-value">
                    <span>Da </span>
                    {planet?.temperature_min} <span>a</span>{" "}
                    {planet?.temperature_max} <span>°C</span>
                  </div>
                </div>
              </div>

              {/* Superficie */}
              <div className="planet-spec-item">
                <div className="planet-spec-icon">
                  <i className="fas fa-mountain"></i>
                </div>
                <div>
                  <div className="planet-spec-label">Superficie</div>
                  <div className="planet-spec-value">
                    {planet?.planet_size} <span>KM&#178;</span>
                  </div>
                </div>
              </div>

              {/* Galassia */}
              <div className="planet-spec-item">
                <div className="planet-spec-icon">
                  <i className="fas fa-globe"></i>
                </div>
                <div>
                  <div className="planet-spec-label">Galassia</div>
                  <div className="planet-spec-value">{planet?.galaxy_name}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PACKAGES (STACKS DISPONIBILI) */}
        <section className="packages-section">
          <div className="cosmic-container">
            <h2 className="section-title">Scegli il Tuo Pacchetto</h2>

            <div className="packages">
              {planet && stacks ? (
                stacks.map((stack) => (
                  <PackageCard
                    key={stack.id}
                    {...stack} // passi dell'oggetto stack
                    planet_name={planet.name}
                    planet_image={planet.image}
                    onAddToCart={handleAddToCart}
                  />
                ))
              ) : (
                <p className="planet-spec-value">Caricamento pacchetti...</p>
              )}
            </div>
          </div>
        </section>

        {/* PIANETI VICINI */}
        <section className="planet-close">
          <h2 className="section-title">Pianeti vicini</h2>
          <div className="planet-close-container">

            {/* PREVIOUS */}
            {prevPlanet && (
              <div className="planet-close-card">
                <h2 className="section-title">Previous</h2>
                <Link
                  to={`/galaxies/${prevPlanet.galaxy_slug}/${prevPlanet.slug}`}
                  onClick={scrollToTop}
                  className="planet-visual close-planet"
                >
                  <div className="planet-visual-container">
                    <img
                      className="planet-visual-image"
                      src={prevPlanet?.image}
                      alt={prevPlanet?.name}
                    />
                    <div className="planet-visual-name">{prevPlanet?.name}</div>
                  </div>
                </Link>
              </div>
            )}

            {/* NEXT */}
            {nextPlanet && (
              <div className="planet-close-card">
                <h2 className="section-title">Next</h2>
                <Link
                  to={`/galaxies/${nextPlanet.galaxy_slug}/${nextPlanet.slug}`}
                  onClick={scrollToTop}
                  className="planet-visual close-planet"
                >
                  <div className="planet-visual-container">
                    <img
                      className="planet-visual-image"
                      src={nextPlanet?.image}
                      alt={nextPlanet?.name}
                    />
                    <div className="planet-visual-name">{nextPlanet?.name}</div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Planet;