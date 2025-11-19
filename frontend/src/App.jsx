import "./App.css";
// DIPENDENZE REACT
import { BrowserRouter, Routes, Route } from "react-router-dom";

// LAYOUT
import DefaultLayout from "./Layout/DefaultLayout";

// CONTEXTS
import { DefaultProvider } from "./Contexts/DefaultContext";
import { CartProvider } from "./Contexts/CartContext";

// PAGINE
import HomePage from "./Pages/HomePage";
import MilkyWayPage from "./Pages/MilkyWayPage";
import AboutUsPage from "./Pages/AboutUsPage";
import ContactUs from "./Pages/ContactUsPage";
import Planet from "./Pages/Planet";
import CartPage from "./Pages/CartPage";
import SearchPage from "./Pages/SearchPage";
import ComingSoon from "./Pages/ComingSoon";


function App() {
  return (
    <>
      <CartProvider>
        <DefaultProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<DefaultLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/milky-way" element={<MilkyWayPage />} />
                <Route path="/milky-way/:slug" element={<Planet />} />
                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/coming-soon" element={<ComingSoon />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </DefaultProvider>
      </CartProvider>
    </>
  );
}

export default App;
