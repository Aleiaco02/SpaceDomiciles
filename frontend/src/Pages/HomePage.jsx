import BlurText from "../Components/ReactBits/BlurText";
import Galaxy from "../Components/ReactBits/Galaxy";
import GradientText from "../Components/ReactBits/GradientText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faCertificate,
  faStar,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import milkyWay from "/img/milky-way.png";
import andromeda from "/img/andromeda.png";
import sombrero from "/img/sombrero.png";
import axios from "axios";

export default function HomePage() {
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  const [planet1, setPlanet1] = useState(null);
  const [planet2, setPlanet2] = useState(null);
  const [planet3, setPlanet3] = useState(null);

  const fetchPlanets = async () => {
    try {
      const [p1, p2, p3] = await Promise.all([
        axios.get("http://localhost:3000/api/planets/mars"),
        axios.get("http://localhost:3000/api/planets/jupiter"),
        axios.get("http://localhost:3000/api/planets/saturn"),
      ]);

      setPlanet1(p1.data);
      setPlanet2(p2.data);
      setPlanet3(p3.data);

    } catch (error) {
      console.log(error);
    }
  };

  // 👇 FETCH ALL'AVVIO
  useEffect(() => {
    fetchPlanets();
  }, []);

  // 👇 LOG DEI DATI QUANDO ARRIVANO
  useEffect(() => {
    console.log("PLANET1:", planet1);
    console.log("PLANET2:", planet2);
    console.log("PLANET3:", planet3);
  }, [planet1, planet2, planet3]);

  return (
    <div
      style={{ width: "100%", height: "280vh", position: "relative" }}
      className="container-jumbotrone"
    >
      <Galaxy
        saturation={0.8}
        hueShift={140}
        density={1.9}
        starSpeed={1.3}
        mouseRepulsion={false}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
          paddingTop: 200,
        }}
      >
        <BlurText
          text="Benvenuto in Space Domicile"
          delay={400}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="titolo-jumbotrone"
        />

        <GradientText
          className="descrizione-jumbotrone"
          style={{ display: "inline-block", textAlign: "center" }}
        >
          Il futuro dell’umanità non è più sulla Terra. Oggi puoi rivendicare il
          tuo posto tra le stelle.
          <br />
          Non guardare lo spazio. Entraci dentro.
        </GradientText>

        <div className="cards-wrapper">
          <div className="glass-card">
            <div className="icon">
              <FontAwesomeIcon icon={faGlobe} />
            </div>
            <GradientText className="card-title">Pianeti Reali</GradientText>
            <p>Terreni su pianeti realmente scoperti dalla NASA e dall’ESA</p>
          </div>

          <div className="glass-card">
            <div className="icon">
              <FontAwesomeIcon icon={faCertificate} />
            </div>
            <GradientText className="card-title">
              Certificato Ufficiale
            </GradientText>
            <p>Ricevi un certificato di proprietà galattica registrato</p>
          </div>

          <div className="glass-card">
            <div className="icon">
              <FontAwesomeIcon icon={faStar} />
            </div>
            <GradientText className="card-title">
              Investimento Unico
            </GradientText>
            <p>Possiedi un pezzo di universo per sempre</p>
          </div>

          <div className="glass-card">
            <div className="icon">
              <FontAwesomeIcon icon={faRocket} />
            </div>
            <GradientText className="card-title">
              Spedizione gratuita
            </GradientText>
            <p>Del tuo attestato con un minimo d'acquisto di 1500€</p>
          </div>
        </div>

        <h2 className="classe">SCEGLI LA TUA GALASSIA PREFERITA</h2>

        <div className="container-galassie">
          <div className="cards-container-2">
            <Link to="/milky-way" className="glass-card-2">
              <img src={milkyWay} alt="Via Lattea" className="card-image" />

              <GradientText className="card-title">
                <h2>Esplora la Via Lattea</h2>
              </GradientText>
              <p>Scopri stelle, pianeti e sistemi abitabili.</p>
            </Link>
          </div>

          <div className="cards-container-2">
            <Link to="/coming-soon" className="glass-card-2">
              <img src={andromeda} alt="Andromeda" className="card-image" />

              <GradientText className="card-title">
                <h2>Esplora Andromeda</h2>
              </GradientText>
              <p>Scopri stelle, pianeti e sistemi abitabili.</p>
            </Link>
          </div>

          <div className="cards-container-2">
            <Link to="/coming-soon" className="glass-card-2">
              <img src={sombrero} alt="Sombrero" className="card-image card-image-sombrero" />

              <GradientText className="card-title">
                <h2>Esplora Sombrero</h2>
              </GradientText>
              <p>Scopri stelle, pianeti e sistemi abitabili.</p>
            </Link>
          </div>
        </div>

        <h2 className="classe">I PIANETI PIU' POPOLARI</h2>

        <div className="container-galassie">

          {planet1 && (
            <div className="cards-container-2">
              <Link to={`milky-way/${planet1.slug}`} className="glass-card-2">
                <img src={planet1.image} className="card-image" />
                <GradientText className="card-title">
                  <h2>{planet1.name}</h2>
                </GradientText>
                <p>{planet1.description}</p>
              </Link>
            </div>
          )}

          {planet2 && (
            <div className="cards-container-2">
              <Link to={`milky-way/${planet2.slug}`} className="glass-card-2">
                <img
                  src={planet2.image}
                  className="card-image pianeta-piccolo"
                />
                <GradientText className="card-title">
                  <h2>{planet2.name}</h2>
                </GradientText>
                <p>{planet2.description}</p>
              </Link>
            </div>
          )}

          {planet3 && (
            <div className="cards-container-2">
              <Link to={`milky-way/${planet3.slug}`} className="glass-card-2">
                <img
                  src={planet3.image}
                  className="card-image pianeta-piccolo"
                />
                <GradientText className="card-title">
                  <h2>{planet3.name}</h2>
                </GradientText>
                <p>{planet3.description}</p>
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}