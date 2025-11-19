// import "./CartPage.css";
// import galaxyIcon from "/img/galaxy-icon.png";
// import { Link } from "react-router-dom";

// export default function CartPage() {
//     return (
//         <div className="galaxy-page">
//             <div className="cont-cart">
//                 <h1>Carrello</h1>
//                 <Link path to="/">
//                     <img src={galaxyIcon} alt="Galassia" className="galaxy-header-icon" />
//                 </Link>
//             </div>
//         </div>
//     );
// }


import "./CartPage.css";
import galaxyIcon from "/img/galaxy-icon.png";
import { Link } from "react-router-dom";
import { useCart } from "../Contexts/CartContext";
import CartItem from "../Components/MicroComponents/CartItem";

export default function CarrelloPage() {
  const { items, onQtyChange, loading } = useCart();

  const itemsArray = Object.values(items);
  const total = itemsArray.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 0),
    0
  );

  if (loading) return <p>Caricamento carrello...</p>;

  return (
    <div className="galaxy-page">
      <div className="cont-cart">
        <h1>Carrello</h1>
        {itemsArray.length === 0 ? (
          <p>Il carrello è vuoto</p>
        ) : (
          itemsArray.map((item) => (
            <CartItem key={item.id} item={item} onQtyChange={onQtyChange} />
          ))
        )}
        <h2>Totale: €{total.toFixed(2)}</h2>
      </div>
      <Link to="/">
        <img src={galaxyIcon} alt="Galassia" className="galaxy-header-icon" />
      </Link>
    </div>
  );
}







