import NavBar from "../MicroComponents/NavBar";
import "./MyHeader.css";
export default function MyHeader({setDrawerOpen}) {
  return (
    <header className="back-header">
      <NavBar setDrawerOpen={setDrawerOpen} />
    </header>
  );
}
