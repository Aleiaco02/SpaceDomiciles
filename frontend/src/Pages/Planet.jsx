// import axios
import axios from "axios";

// import di router-dom per link
import { Link, useParams, useNavigate } from "react-router-dom";
// useParams mi permette di leggere il parametro dinamico per capire quale pianeta devo caricare

// import state e effetc
import { useState, useEffect } from "react";

// importo funzionalità carrello
import { useCart } from "../Contexts/CartContext";

// importo gli stili css della pagina
import "../styles/Planet.css";

// IMPORT CONVENZIONALE COMPONENTE REACT (MAIUSCOLA)
import PackageCard from "../Components/MicroComponents/packageCard";

const Planet = () => {
  // Creo istanza di Navigate
  const redirect = useNavigate();

  // Stato pagina
  const [planet, setPlanet] = useState();
  const [stacks, setStacks] = useState();
  const { slug } = useParams();
  const [nextId, setNextId] = useState();
  const [prevId, setPrevId] = useState();
  const [planets, setPlanets] = useState();
  const [nextPlanet, setNextPlanet] = useState();
  const [prevPlanet, setPrevPlanet] = useState();

  // Funzionalità carrello
  const { addToCart } = useCart();

  // Stato popup overlay
  const [showModal, setShowModal] = useState(false);
  const [modalPackageName, setModalPackageName] = useState("");

  // Funzioni per chiamate API
  const fecthPlanet = () => {
    axios
      .get("http://localhost:3000/api/planets/" + slug)
      .then((response) => {
        setPlanet(response.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.status === 404) redirect("/404");
      });
  };

  const fetchStack = () => {
    axios
      .get("http://localhost:3000/api/stacks/planet/" + slug)
      .then((response) => {
        setStacks(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchClosePlanets = () => {
    setNextId(planet?.id + 1);
    setPrevId(planet?.id - 1);
    axios
      .get("http://localhost:3000/api/planets/")
      .then((response) => {
        setPlanets(response.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.status === 404) redirect("/404");
      });
  };

  const findClosePlanets = () => {
    if (planets && nextId) {
      setPrevPlanet(prevId > 0 ? planets.find(p => p.id === prevId) : null);
      setNextPlanet(planets.find(p => p.id === nextId));
    }
  };

  // Effetti dati
  useEffect(fecthPlanet, [slug]);
  useEffect(fetchStack, []);
  useEffect(fetchClosePlanets, [planet]);
  useEffect(findClosePlanets, [planets]);

  // Funzione da passare alle card: aggiunge al carrello + mostra il modal
  const handleAddToCartAndModal = (packageProps) => {
    addToCart(packageProps);
    setModalPackageName(packageProps.name);
    setShowModal(true);
  };

  const handleGoToCart = () => {
    setShowModal(false);
    redirect("/cart");
  };

  const handleContinueShopping = () => setShowModal(false);

  // Render completo
  return (
    <>
      <div className="planet-page">
        {/* Dettagli pianeta */}
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
            <div className="planet-specs">
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
              <div className="planet-spec-item">
                <div className="planet-spec-icon">
                  <i className="fas fa-mountain"></i>
                </div>
                <div>
                  <div className="planet-spec-label">Sperficie</div>
                  <div className="planet-spec-value">
                    {planet?.planet_size} <span>KM&#178;</span>
                  </div>
                </div>
              </div>
              <div className="planet-spec-item">
                <div className="planet-spec-icon">
                  <i className="fas fa-globe"></i>
                </div>
                <div>
                  <div className="planet-spec-label">Galassia</div>
                  <div className="planet-spec-value">
                    {planet?.id_galaxy === 1 ? "Via Lattea" : "Andromeda"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="packages-section">
          <div className="cosmic-container">
            <h2 className="section-title">Scegli il Tuo Pacchetto</h2>
            <div className="packages">
              {(planet && stacks) ? (
                stacks.map((stack) => (
                  <PackageCard
                    key={stack.id}
                    {...stack}
                    planet_name={planet.name}
                    planet_image={planet.image}
                    onAddToCart={handleAddToCartAndModal}
                  />
                ))
              ) : (
                <p>Caricamento pacchetti...</p>
              )}
            </div>
          </div>
        </section>

        {/* Sezione prodotti correlati (pianeti vicini) */}
        <section className="planet-close">
          <h2 className="section-title">Pianeti vicini</h2>
          <div className="planet-close-container">
            {prevPlanet &&
              <div className="planet-close-card">
                <h2 className="section-title">Previous</h2>
                <Link to={`/milky-way/${prevPlanet.slug}`} className="planet-visual close-planet">
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
            }
            {nextPlanet &&
              <div className="planet-close-card">
                <h2 className="section-title">Next</h2>
                <Link to={`/milky-way/${nextPlanet.slug}`} className="planet-visual close-planet">
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
            }
          </div >
        </section >
      </div>

      {/* MODAL OVERLAY */}
      {showModal && (
        <div className="addtocart-modal-overlay">
          <div className="addtocart-modal">
            <span className="addtocart-check">&#10003;</span>
            <div className="addtocart-msg">
              {modalPackageName} aggiunto al carrello con successo!
            </div>
            <div className="addtocart-btn-group">
              <button className="alert-cart-btn" onClick={handleGoToCart}>
                Vai al carrello
              </button>
              <button className="alert-continue-btn" onClick={handleContinueShopping}>
                Continua ad acquistare
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Planet;
