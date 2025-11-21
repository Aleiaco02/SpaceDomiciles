import "./AboutUsPage.css";
import galaxyIcon from "/img/galaxy-icon.png";
import { Link } from "react-router-dom";

export default function AboutUsPage() {
  return (
    <>
      <div className="galaxy-page pos">
        <div className="about-container">
          <h1>Chi Siamo</h1>
          <p>
            Benvenuti a Space Domicile, la prima piattaforma dedicata
            all'acquisto di suolo **spaziale**. La nostra missione è permettere
            a chiunque di possedere un pezzo di universo e ricevere un
            certificato ufficiale per il proprio territorio stellare.
          </p>
          <p>
            Crediamo nell'innovazione, nella fantascienza resa realtà e nel
            potere di esplorare nuovi orizzonti con la tecnologia. Il nostro
            team è composto da appassionati di astronomia, sviluppo software e
            creativi che lavorano insieme per offrirti un'esperienza unica.
          </p>
          <p>
            Grazie a un processo semplice e sicuro, potrai scegliere il tuo
            frammento di spazio e diventare un vero "pioniere dello spazio".
            Unisciti a noi in questa avventura cosmica!
          </p>
          <h2>Perché scegliere Space Domicile?</h2>
          <ul>
            <li>
              Certificati unici e personalizzati di possesso del suolo spaziale
            </li>
            <li>Un sistema di acquisto semplice e trasparente</li>
            <li>Assistenza dedicata e supporto costante</li>
          </ul>
          <p>
            Se vuoi saperne di più o contattarci, visita la nostra pagina{" "}
            <a href="/contact-us" style={{ color: "#75eaff" }}>
              Contattaci!
            </a>
          </p>
          <div className="gal-dim">
            <Link to="/">
              <img src={galaxyIcon} alt="Galassia" className="galaxy-header-icon" />
            </Link>
          </div>
          <p className="go-back-text">Premi la galassia e fai un salto nell’iperspazio fino alla Home</p>
        </div>
      </div>
    </>
  );
}
