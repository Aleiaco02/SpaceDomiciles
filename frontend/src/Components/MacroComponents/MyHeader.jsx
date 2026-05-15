import { useEffect, useRef } from "react";
import NavBar from "../MicroComponents/NavBar";
import "./MyHeader.css";

export default function MyHeader({ setDrawerOpen }) {
  const prevScrollY = useRef(0);

  useEffect(() => {
    const navbar = document.getElementById("navbar");

    const handleScroll = () => {
      // Su mobile la navbar è sempre visibile
      if (window.innerWidth <= 1024) {
        navbar.style.top = "0";
        return;
      }

      const current = window.scrollY;
      if (current < 10 || prevScrollY.current > current) {
        navbar.style.top = "0";
      } else {
        navbar.style.top = "-101px";
      }
      prevScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="back-header" id="navbar">
      <NavBar setDrawerOpen={setDrawerOpen} />
    </header>
  );
}
