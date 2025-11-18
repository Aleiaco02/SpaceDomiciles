import "./ContactUsPage.css";
import galaxyIcon from "/img/galaxy-icon.png";

export default function ContactUs() {
  return (
    <div className="galaxy-page pos contact">
      <h1>Contattaci</h1>
      <p>Per qualsiasi domanda o informazione, puoi scriverci a questo indirizzo email:</p>
      <p>
        <a href="mailto:info@spacedomicile.com" style={{ color: '#0077cc', textDecoration: 'none' }}>
          info@spacedomicile.com
        </a>
      </p>
      <p>Siamo a disposizione per rispondere alle tue curiosità o per aiutarti nell'acquisto del suolo spaziale.</p>
      <div className="social">
        <i class="fa-brands fa-facebook"></i>
        <i class="fa-brands fa-instagram"></i>
        <i class="fa-brands fa-pinterest"></i>
        <i class="fa-brands fa-square-x-twitter"></i>
      </div>
      <img src={galaxyIcon} alt="Galassia" className="galaxy-header-icon"/>
    </div>
  );
}
