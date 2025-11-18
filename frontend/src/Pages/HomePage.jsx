import BlurText from "../Components/ReactBits/BlurText";
import Galaxy from "../Components/ReactBits/Galaxy";
import GradientText from "../Components/ReactBits/GradientText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faCertificate, faStar } from "@fortawesome/free-solid-svg-icons";


export default function HomePage() {
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  return (
    // Basic usage
    <div style={{ width: '100%', height: '100vh', position: 'relative' }} className="container-jumbotrone">
      <Galaxy
        saturation={0.8}
        hueShift={140}
        density={1.9}
        starSpeed={1.3}
        mouseRepulsion={false}
      />
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none"
      }}>
        <BlurText
          text="Benvenuto in Space Domiciles"
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
          Il futuro dell’umanità non è più sulla Terra.
          Oggi puoi rivendicare il tuo posto tra le stelle.
          <br />
          Non guardare lo spazio. Entraci dentro.
        </GradientText>

        <div className="cards-wrapper">

          <div className="glass-card">
            <div className="icon">
              <FontAwesomeIcon icon={faGlobe} />
            </div>
            <GradientText className="card-title">
              Pianeti Reali
            </GradientText>
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

        </div>



      </div>
    </div>


  );
}
