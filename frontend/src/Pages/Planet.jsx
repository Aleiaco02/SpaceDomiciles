// import axios
import axios from "axios";

// import di router-dom per link
import { Link, useParams, useNavigate } from "react-router-dom";
// useParams mi permette di leggere il paramanetro dinamico per capire quale pianetac devo caricare

// import state e effetc
import { useState, useEffect } from "react";

// importo gli stili css della pagina
import "../styles/Planet.css";

const Planet = () => {
    // creo istanza di Navigate
    const redirect = useNavigate();

    // variabile di stato del singolo film
    const [planet, setPlanet] = useState();

    // recupero il parametro dinamico grazie a useParams
    const { slug } = useParams();

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

    // faccio partire la chiamata solo al primo montaggio del componente
    useEffect(fecthPlanet, []);


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
                            <div className="package-card">
                                <div className="package-header">
                                    <h3 className="package-name">Starter</h3>
                                    <div className="package-size">50m²</div>
                                </div>
                                <div className="package-price">
                                    <span className="price-currency">&euro; </span>
                                    <span className="price-amount">999</span>
                                </div>
                                <ul className="package-features">
                                    <li>
                                        <i className="fas fa-check"></i> Certificato di proprietà
                                    </li>
                                    <li>
                                        <i className="fas fa-check"></i> Coordinate GPS galattiche
                                    </li>
                                    <li>
                                        <i className="fas fa-check"></i> Mappa personalizzata
                                    </li>
                                    <li>
                                        <i className="fas fa-check"></i> 50m² di terreno
                                    </li>
                                </ul>
                            </div>

                            <div className="package-card">
                                <div className="package-header">
                                    <h3 className="package-name">Explorer</h3>
                                    <div className="package-size">100m²</div>
                                </div>
                                <div className="package-price">
                                    <span className="price-currency">&euro; </span>
                                    <span className="price-amount">1799</span>
                                </div>
                                <ul className="package-features">
                                    <li>
                                        <i className="fas fa-check"></i> Certificato di proprietà
                                    </li>
                                    <li>
                                        <i className="fas fa-check"></i> Coordinate GPS galattiche
                                    </li>
                                    <li>
                                        <i className="fas fa-check"></i> Mappa personalizzata
                                    </li>
                                    <li>
                                        <i className="fas fa-check"></i> 100m² di terreno
                                    </li>
                                    <li>
                                        <i className="fas fa-check"></i> Cornice Premium inclusa
                                    </li>
                                </ul>
                            </div>

                            <div className="package-card">
                                <div className="package-header">
                                    <h3 className="package-name">Pioneer</h3>
                                    <div className="package-size">150m²</div>
                                </div>
                                <div className="package-price">
                                    <span className="price-currency">&euro; </span>
                                    <span className="price-amount">2499</span>
                                </div>
                                <ul className="package-features">
                                    <li>
                                        <i className="fas fa-check"></i> Certificato di proprietà
                                    </li>
                                    <li>
                                        <i className="fas fa-check"></i> Coordinate GPS galattiche
                                    </li>
                                    <li>
                                        <i className="fas fa-check"></i> Mappa personalizzata
                                    </li>
                                    <li>
                                        <i className="fas fa-check"></i> 150m² di terreno
                                    </li>
                                    <li>
                                        <i className="fas fa-check"></i> Cornice Premium inclusa
                                    </li>
                                    <li>
                                        <i className="fas fa-check"></i> Nome sul registro pubblico
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Planet;
