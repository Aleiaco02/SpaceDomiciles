import BlurText from "../Components/ReactBits/BlurText";
import Galaxy from "../Components/ReactBits/Galaxy";
import GradientText from "../Components/ReactBits/GradientText";

export default function HomePage() {
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  return (
    // Basic usage
    <div style={{ width: '100%', height: '700px', position: 'relative' }} className="container-jumbotrone">
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
        alignItems: "start",
        justifyContent: "center",
        pointerEvents: "none",
        padding: "0 40px"
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
          style={{ display: "inline-block", width: "auto", textAlign: "center" }}
        >
          Il futuro dell’umanità non è più sulla Terra.
          <br />
          Oggi puoi rivendicare il tuo posto tra le stelle.
          <br />
          Non guardare lo spazio. Entraci dentro.
        </GradientText>

      </div>
    </div>


  );
}
