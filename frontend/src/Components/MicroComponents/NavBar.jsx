import { NavLink } from "react-router-dom";
import "./NavBar.css";
import galaxyIcon from "/img/galaxy-icon.png";
import CartBadge from "./CartBadge";

export default function NavBar({ setDrawerOpen }) {
  return (
    <nav>
      <div className="nav-cont">
        <NavLink to="/">
          <div className="rocket">
            <img
              src={galaxyIcon}
              alt="Galassia"
              className="galaxy-header-icon logo-dim"
            />
            <p>Space Domicile</p>
          </div>
        </NavLink>
        <div className="links">
          <NavLink
            to="/galaxies"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>
              Galassie
              <i className="fa-solid fa-shuttle-space marg"></i>
            </span>
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>
              Cerca
              <i className="fa-solid fa-magnifying-glass marg"></i>
            </span>
          </NavLink>

          <NavLink
            to="/about-us"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>
              Chi Siamo
              <i className="fa-regular fa-address-card marg"></i>
            </span>
          </NavLink>

          <NavLink
            to="/contact-us"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>
              Contattaci!
              <i className="fa-regular fa-message marg"></i>
            </span>
          </NavLink>
        </div>

        <button onClick={() => setDrawerOpen(true)} className="cart">
          <CartBadge />
        </button>
      </div>
    </nav>
  );
}
