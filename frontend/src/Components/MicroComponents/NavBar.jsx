import { NavLink } from "react-router-dom";
import "./NavBar.css";
import galaxyIcon from "/img/galaxy-icon.png";
import CartBadge from "./CartBadge";

export default function NavBar() {
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
              <i class="fa-solid fa-shuttle-space marg"></i>
            </span>
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>
              Cerca
              <i class="fa-solid fa-magnifying-glass marg"></i>
            </span>
          </NavLink>

          <NavLink
            to="/about-us"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>
              Chi Siamo
            <i class="fa-regular fa-address-card marg"></i>
            </span>
          </NavLink>

          <NavLink
            to="/contact-us"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>
              Contattaci!
              <i class="fa-regular fa-message marg"></i>
              </span>
          </NavLink>
        </div>

        <NavLink to="/cart" className="cart">
          <CartBadge />
        </NavLink>
      </div>
    </nav>
  );
}
