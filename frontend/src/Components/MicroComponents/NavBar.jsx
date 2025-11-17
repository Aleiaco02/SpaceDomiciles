import { Link, NavLink } from 'react-router-dom';
import "./NavBar.css";

export default function NavBar() {
  return (
    <nav>
      <div className="flex nav-cont">
        <NavLink to="/">
          <div className="rocket">
            <i className="fa-solid fa-shuttle-space"></i>
            <p>Space Domicile</p>
          </div>
        </NavLink>

        <NavLink to="/planets">
          <span>Pianeti</span>
        </NavLink>

        <NavLink to="/aboutus">
          <span>Chi Siamo</span>
        </NavLink>

        <NavLink to="/cart">
          <div className='cart'>
            <i className="fa-solid fa-cart-arrow-down"></i>
          </div>
        </NavLink>

      </div>
    </nav>
  );
}
