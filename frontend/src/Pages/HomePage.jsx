// La homepage combina un background animato con il componente Galaxy e un sistema che ricalcola dinamicamente l’altezza del contenitore per adattarsi al contenuto.
// Utilizzo useRef per misurare l’altezza reale del contenuto e useEffect per aggiornarla quando cambia la finestra o quando arrivano i dati.
// Inoltre faccio tre fetch parallele tramite axios per mostrare tre pianeti in evidenza.
// La pagina è divisa in sezioni: presentazione, valori aziendali, scelta della galassia, e pianeti popolari.

// Effetti grafici ReactBits (testo sfocato, testo gradient, animazioni)
import BlurText from "../Components/ReactBits/BlurText";
import Galaxy from "../Components/ReactBits/Galaxy";
import GradientText from "../Components/ReactBits/GradientText";

// Icone FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe,faCertificate,faStar,faRocket } from "@fortawesome/free-solid-svg-icons";

// Navigazione React Router
import { Link } from "react-router-dom";

// Hook React
import { useState, useEffect, useRef } from "react";

// Immagini galassie per le card
import milkyWay from "/img/milky-way.png";
import andromeda from "/img/andromeda.png";
import sombrero from "/img/sombrero.png";

// Libreria per chiamate API
import axios from "axios";

export default function HomePage() {

  // ANIMAZIONE TESTO (solo log quando finisce)
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  // GESTIONE ALTEZZA CONTAINER (JUMBOTRONE) - contentRef serve per leggere l’altezza reale del contenuto
  const contentRef = useRef(null);

  // Lo sfondo Galaxy deve essere sempre alto almeno quanto il contenuto
  const [containerHeight, setContainerHeight] = useState("100vh");

  useEffect(() => {
    // Funzione che ricalcola l’altezza
    const updateHeight = () => {
      if (contentRef.current) {
        // Reset temporaneo per recuperare l’altezza reale
        setContainerHeight("auto");

        setTimeout(() => {
          if (contentRef.current) {
            const contentHeight = contentRef.current.scrollHeight; // altezza interna
            const windowHeight = window.innerHeight; // altezza viewport

            // L’altezza finale è il maggiore tra contenuto e viewport
            const calculatedHeight = Math.max(contentHeight + 42, windowHeight);

            setContainerHeight(`${calculatedHeight}px`);
          }
        }, 0);
      }
    };

    // Prima misurazione iniziale
    setTimeout(updateHeight, 500);

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // FETCH 3 PIANETI IN EVIDENZA (POPULAR)
  const [planet1, setPlanet1] = useState(null);
  const [planet2, setPlanet2] = useState(null);
  const [planet3, setPlanet3] = useState(null);

  const fetchPlanets = async () => {
    try {
      // Chiamo 3 API in parallelo (Promise.all)
      const [p1, p2, p3] = await Promise.all([
        axios.get("http://localhost:3000/api/planets/mars"),
        axios.get("http://localhost:3000/api/planets/jupiter"),
        axios.get("http://localhost:3000/api/planets/saturn"),
      ]);

      // Salvo i risultati nello stato
      setPlanet1(p1.data);
      setPlanet2(p2.data);
      setPlanet3(p3.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Chiamo la fetch al mount della pagina
  useEffect(() => {
    fetchPlanets();
  }, []);

  // Ricalcolo l’altezza quando arrivano i dati dei pianeti
  useEffect(() => {
    if (planet1 && planet2 && planet3) {
      setTimeout(() => {
        if (contentRef.current) {
          const contentHeight = contentRef.current.scrollHeight;
          const windowHeight = window.innerHeight;
          const calculatedHeight = Math.max(contentHeight + 42, windowHeight);
          setContainerHeight(`${calculatedHeight}px`);
        }
      }, 100);
    }
  }, [planet1, planet2, planet3]);

  // RENDER DELLA HOMEPAGE
  return (
    <div
      style={{
        width: "100%",
        height: containerHeight,
        position: "relative",
        minHeight: "100vh",
      }}
      className="container-jumbotrone"
    >
      {/* SFONDO DINAMICO DELLA GALASSIA — Effetto animato */}
      <Galaxy
        saturation={0.8}
        hueShift={140}
        density={1.9}
        starSpeed={1.3}
        mouseRepulsion={false}
      />

      {/* CONTENUTO PRINCIPALE DELLA HOMEPAGE */}
      <div
        ref={contentRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none", // rende il contenuto “trasparente” al mouse
          paddingTop: 200,
        }}
      >

        {/* TITOLO PRINCIPALE CON ANIMAZIONE */}
        <BlurText
          text="Benvenuto in Space Domicile"
          delay={400}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="titolo-jumbotrone"
        />

        {/* SOTTOTITOLO DESCRITTIVO CON TESTO GRADIENT */}
        <GradientText
          className="descrizione-jumbotrone"
          style={{ display: "inline-block", textAlign: "center" }}
        >
          Il futuro dell'umanità non è più sulla Terra. Oggi puoi rivendicare il
          tuo posto tra le stelle.
          <br />
          Non guardare lo spazio. Entraci dentro.
        </GradientText>

        {/* CARDS — SERVIZI PRINCIPALI */}
        <div className="cards-wrapper">
          {/* PLANETI REALI */}
          <div className="glass-card">
            <div className="icon">
              <FontAwesomeIcon icon={faGlobe} />
            </div>
            <GradientText className="card-title">Pianeti Reali</GradientText>
            <p>Terreni su pianeti realmente scoperti dalla NASA e dall'ESA</p>
          </div>

          {/* CERTIFICATO UFFICIALE */}
          <div className="glass-card">
            <div className="icon">
              <FontAwesomeIcon icon={faCertificate} />
            </div>
            <GradientText className="card-title">Certificato Ufficiale</GradientText>
            <p>Ricevi un certificato di proprietà galattica registrato</p>
          </div>

          {/* INVESTIMENTO UNICO */}
          <div className="glass-card">
            <div className="icon">
              <FontAwesomeIcon icon={faStar} />
            </div>
            <GradientText className="card-title">Investimento Unico</GradientText>
            <p>Possiedi un pezzo di universo per sempre</p>
          </div>

          {/* SPEDIZIONE */}
          <div className="glass-card">
            <div className="icon">
              <FontAwesomeIcon icon={faRocket} />
            </div>
            <GradientText className="card-title">Spedizione gratuita</GradientText>
            <p>Del tuo attestato con un minimo d'acquisto di 1500€</p>
          </div>
        </div>

        {/* SEZIONE GALASSIE PRINCIPALI */}
        <h2 className="classe">SCEGLI LA TUA GALASSIA PREFERITA</h2>

        <div className="container-galassie">

          {/* VIA LATTEA */}
          <div className="cards-container-2">
            <Link to="/galaxies/milky-way" className="glass-card-2">
              <img src={milkyWay} alt="Via Lattea" className="card-image" />
              <GradientText className="card-title">
                <h2>Esplora la Via Lattea</h2>
              </GradientText>
              <p>Scopri stelle, pianeti e sistemi abitabili.</p>
            </Link>
          </div>

          {/* ANDROMEDA */}
          <div className="cards-container-2">
            <Link to="/galaxies/andromeda" className="glass-card-2">
              <img src={andromeda} alt="Andromeda" className="card-image" />
              <GradientText className="card-title">
                <h2>Esplora Andromeda</h2>
              </GradientText>
              <p>Scopri stelle, pianeti e sistemi abitabili.</p>
            </Link>
          </div>

          {/* SOMBRERO */}
          <div className="cards-container-2">
            <Link to="/galaxies/sombrero" className="glass-card-2">
              <img
                src={sombrero}
                alt="Sombrero"
                className="card-image card-image-sombrero"
              />
              <GradientText className="card-title">
                <h2>Esplora Sombrero</h2>
              </GradientText>
              <p>Scopri stelle, pianeti e sistemi abitabili.</p>
            </Link>
          </div>
        </div>

        {/* SEZIONE: PIANETI POPOLARI (da API) */}
        <h2 className="classe">I PIANETI PIU' POPOLARI</h2>

        <div className="container-galassie">
          {/* Pianeta 1 */}
          {planet1 && (
            <div className="cards-container-2">
              <Link
                to={`/galaxies/${planet1.galaxy_slug}/${planet1.slug}`}
                className="glass-card-2"
              >
                <img src={planet1.image} alt={planet1.name} className="card-image" />
                <GradientText className="card-title">
                  <h2>{planet1.name}</h2>
                </GradientText>
                <p>{planet1.description}</p>
              </Link>
            </div>
          )}

          {/* Pianeta 2 */}
          {planet2 && (
            <div className="cards-container-2">
              <Link
                to={`/galaxies/${planet2.galaxy_slug}/${planet2.slug}`}
                className="glass-card-2"
              >
                <img
                  src={planet2.image}
                  alt={planet2.name}
                  className="card-image pianeta-piccolo"
                />
                <GradientText className="card-title">
                  <h2>{planet2.name}</h2>
                </GradientText>
                <p>{planet2.description}</p>
              </Link>
            </div>
          )}

          {/* Pianeta 3 */}
          {planet3 && (
            <div className="cards-container-2">
              <Link
                to={`/galaxies/${planet3.galaxy_slug}/${planet3.slug}`}
                className="glass-card-2"
              >
                <img
                  src={planet3.image}
                  alt={planet3.name}
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