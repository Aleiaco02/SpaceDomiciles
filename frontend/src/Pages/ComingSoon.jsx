import { Link } from "react-router-dom";
import galaxyIcon from "/img/galaxy-icon.png";

const ComingSoon = () => {
    return (
        <div className="galaxy-page container-coming-soon">
            <button className="indietro-btn"><Link to="/">INDIETRO</Link></button>
            <img src={galaxyIcon} alt="Galassia" className="galaxy-header-icon" />
            <h1>COMING SOON</h1>
            <p>Nel silenzio profondo dello spazio, qualcosa sta nascendo. <br />
                Un progetto che pulsa come una nuova stella, pronto a illuminare la galassia digitale.</p>

        </div>
    )
}

export default ComingSoon