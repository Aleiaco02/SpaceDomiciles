import "./CartTabCSS.css";
export default function CartTab() {
  return (
    <div className="cartTab">
      <h1>Shopping Cart</h1>
      <div className="listCart"></div>
      <div className="btn">
        <button className="close">CLOSE</button>
        <button className="checkOut">Check Out</button>
      </div>
    </div>
  );
}
