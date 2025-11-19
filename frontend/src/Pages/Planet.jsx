// import axios
import axios from "axios";

// import di router-dom per link
import { Link, useParams, useNavigate } from "react-router-dom";
// useParams mi permette di leggere il paramanetro dinamico per capire quale pianetac devo caricare

// import state e effetc
import { useState, useEffect } from "react";

//importo funzionalità carrello
import { useCart } from "../Contexts/CartContext";


// importo gli stili css della pagina
import "../styles/Planet.css";

import packageCard from "../Components/MicroComponents/packageCard";
const Planet = () => {
    // creo istanza di Navigate
    const redirect = useNavigate();

    // variabile di stato del singolo pianeta
    const [planet, setPlanet] = useState();
    // variabile di stato delle stack del pianeta
    const [stacks, setStacks] = useState();
    // recupero il parametro dinamico grazie a useParams
    const { slug } = useParams();

    //funzione carrello
    const { addToCart } = useCart();

    // preparo la funzione per la chiamata axios
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
    // faccio partire la chiamata solo al primo montaggio del componente
    useEffect(fecthPlanet, []);
    useEffect(fetchStack, []);

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
                                        <span> Da </span>
                                        {planet?.temperature_min} <span> a </span>{" "}
                                        {planet?.temperature_max} <span> °C</span>
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
                                        {planet?.planet_size} <span> KM&#178;</span>
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
                                stacks.map((stack) =>
                                    packageCard({
                                        ...stack,
                                        planet_name: planet.name,
                                        planet_image: planet.image,
                                        onAddToCart: addToCart,
                                    })
                                )
                            ) : (
                                <p>Caricamento pacchetti...</p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );

};

export default Planet;
