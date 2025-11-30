// Importo gli stili globali dell'app.
import "./App.css";

// React Router per la gestione delle rotte
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Hook React per gestire stato ed effetti
import { useState, useEffect } from "react";

// LAYOUT
// DefaultLayout è il layout principale dell’app:
// include header, footer, e la parte dinamica "outlet" delle pagine.
import DefaultLayout from "./Layout/DefaultLayout";

// CONTEXTS
// Involucrano l'app e forniscono valori globali (come il carrello o impostazioni generali)
import { DefaultProvider } from "./Contexts/DefaultContext";
import { CartProvider } from "./Contexts/CartContext";

// PAGINE DELL'APPLICAZIONE
import HomePage from "./Pages/HomePage";
import MilkyWayPage from "./Pages/MilkyWayPage";
import AboutUsPage from "./Pages/AboutUsPage";
import ContactUs from "./Pages/ContactUsPage";
import Planet from "./Pages/Planet";
import CartPage from "./Pages/CartPage";
import SearchPage from "./Pages/SearchPage";
import ComingSoon from "./Pages/ComingSoon";
import CheckOutPage from "./Pages/CheckOutPage";
import GalaxiesPage from "./Pages/GalaxiesPage";
import NotFoundPage from "./Pages/NotFoundPage";
import Success from "./Pages/Success";

// COMPONENTI
import CartDrawer from "./Components/MicroComponents/CartDrawer";

function App() {

  // STATE: gestisce l'apertura del carrello laterale (drawer)
  const [drawerOpen, setDrawerOpen] = useState(false);

  // USEEFFECT: blocca lo scroll della pagina quando il drawer è aperto
  useEffect(() => {
    if (drawerOpen) {
      document.body.classList.add("no-scroll"); // blocca lo scroll
    } else {
      document.body.classList.remove("no-scroll"); // sblocca lo scroll
    }
  }, [drawerOpen]);
  // La dependency [drawerOpen] indica che l'effetto parte ogni volta che drawerOpen cambia

  return (
    <>
      {/* 
        CartProvider → gestisce lo stato del carrello in tutta l'app
        Passo setDrawerOpen per permettere ad altri componenti di aprire/chiudere il drawer
      */}
      <CartProvider setDrawerOpen={setDrawerOpen}>

        {/* DefaultProvider → contesto per impostazioni o valori generali */}
        <DefaultProvider>

          {/* BrowserRouter → abilita la navigazione client-side */}
          <BrowserRouter>

            {/* Tutte le rotte dell'app */}
            <Routes>

              {/* Layout principale, avvolge tutte le pagine */}
              <Route element={<DefaultLayout setDrawerOpen={setDrawerOpen} />}>

                {/* Home (rotta "/" di default) */}
                <Route index element={<HomePage />} />

                {/* Rotte per galassie e pianeti */}
                <Route path="galaxies">

                  {/* Pagina lista galassie */}
                  <Route index element={<GalaxiesPage />} />

                  {/* Pagina singola galassia (es. /galaxies/milky-way) */}
                  <Route path=":galaxySlug" element={<MilkyWayPage />} />

                  {/* Pagina singolo pianeta (es. /galaxies/milky-way/marte) */}
                  <Route
                    path=":galaxySlug/:planetSlug"
                    element={<Planet />}
                  />
                </Route>

                {/* Altre pagine statiche */}
                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/coming-soon" element={<ComingSoon />} />
                <Route path="/checkout" element={<CheckOutPage />} />
                <Route path="/success" element={<Success />} />

                {/* Pagina 404 */}
                <Route path="*" element={<NotFoundPage />} />

              </Route>
            </Routes>

            {/* 
              CartDrawer è il pannello laterale del carrello.
              open → indica se è visibile
              onClose → funzione per chiuderlo
            */}
            <CartDrawer
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            />

          </BrowserRouter>
        </DefaultProvider>
      </CartProvider>
    </>
  );
}

export default App;