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
            to="/milky-way"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>
              Via Lattea<i className="fa-regular fa-heart marg"></i>
            </span>
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>Cerca</span>
          </NavLink>

          <NavLink
            to="/about-us"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>Chi Siamo</span>
          </NavLink>

          <NavLink
            to="/contact-us"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>Contattaci!</span>
          </NavLink>
        </div>

        <NavLink to="/cart" className="cart">
          <CartBadge />
        </NavLink>
      </div>
    </nav>
  );
}
