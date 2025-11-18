import NavBar from "../MicroComponents/NavBar";
import "./MyHeader.css";
import CartTab from "./CartTab";
export default function MyHeader() {
  return (
    <header className="back-header">
      <NavBar />
      <CartTab />
    </header>
  );
}
