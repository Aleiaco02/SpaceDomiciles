import { Link, NavLink } from 'react-router-dom';
import "./NavBar.css";

export default function NavBar() {
  return (
    <nav>
      <div className="nav-cont">
        <NavLink to="/">
          <div className="rocket">
            <i className="fa-solid fa-shuttle-space"></i>
            <p>Space Domicile</p>
          </div>
        </NavLink>
        <div className="links">
        <NavLink to="/planets">
          <span>Pianeti</span>
        </NavLink>

        <NavLink to="/aboutus">
          <span>Chi Siamo</span>
        </NavLink>

        <NavLink to="/contactus">
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
