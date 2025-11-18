import { Link, NavLink } from 'react-router-dom';
import "./NavBar.css";
import galaxyIcon from "/img/galaxy-icon.png";

export default function NavBar() {
  return (
    <nav>
      <div className="nav-cont">
        <NavLink to="/">
          <div className="rocket">
            <img src={galaxyIcon} alt="Galassia" className="galaxy-header-icon logo-dim" />
            <p>Space Domicile</p>
          </div>
        </NavLink>
        <div className="links">
        <NavLink to="/milky-way" className={({ isActive }) => isActive ? "active" : ""}>
          <span>Via Lattea<i class="fa-regular fa-heart marg"></i></span>
        </NavLink>

        <NavLink to="/aboutus" className={({ isActive }) => isActive ? "active" : ""}>
          <span>Chi Siamo</span>
        </NavLink>

        <NavLink to="/contactus" className={({ isActive }) => isActive ? "active" : ""}>
          <span>Contattaci!</span>
        </NavLink>
        </div>

        <NavLink to="/cart">
          <div className='cart'>
            <i className="fa-solid fa-cart-arrow-down"></i>
          </div>
        </NavLink>

      </div>
    </nav>
  );
}
