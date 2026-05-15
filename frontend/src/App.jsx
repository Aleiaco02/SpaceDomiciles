import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";

import DefaultLayout from "./Layout/DefaultLayout";
import { DefaultProvider } from "./Contexts/DefaultContext";
import { CartProvider } from "./Contexts/CartContext";
import CartDrawer from "./Components/MicroComponents/CartDrawer";
import CookieBanner from "./Components/MicroComponents/CookieBanner";

const HomePage = lazy(() => import("./Pages/HomePage"));
const MilkyWayPage = lazy(() => import("./Pages/MilkyWayPage"));
const AboutUsPage = lazy(() => import("./Pages/AboutUsPage"));
const ContactUs = lazy(() => import("./Pages/ContactUsPage"));
const Planet = lazy(() => import("./Pages/Planet"));
const CartPage = lazy(() => import("./Pages/CartPage"));
const SearchPage = lazy(() => import("./Pages/SearchPage"));
const ComingSoon = lazy(() => import("./Pages/ComingSoon"));
const CheckOutPage = lazy(() => import("./Pages/CheckOutPage"));
const GalaxiesPage = lazy(() => import("./Pages/GalaxiesPage"));
const NotFoundPage = lazy(() => import("./Pages/NotFoundPage"));
const Success = lazy(() => import("./Pages/Success"));

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    if (drawerOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [drawerOpen]);
  return (
    <>
      <Analytics />
      <SpeedInsights />
      <CookieBanner />
      <CartProvider setDrawerOpen={setDrawerOpen}>
        <DefaultProvider>
          <BrowserRouter>
            <Suspense fallback={null}>
              <Routes>
                <Route element={<DefaultLayout setDrawerOpen={setDrawerOpen} />}>
                  <Route index element={<HomePage />} />
                  <Route path="galaxies">
                    <Route index element={<GalaxiesPage />} />
                    <Route path=":galaxySlug" element={<MilkyWayPage />} />
                    <Route path=":galaxySlug/:planetSlug" element={<Planet />} />
                  </Route>
                  <Route path="/about-us" element={<AboutUsPage />} />
                  <Route path="/contact-us" element={<ContactUs />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/coming-soon" element={<ComingSoon />} />
                  <Route path="/checkout" element={<CheckOutPage />} />
                  <Route path="/success" element={<Success />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Suspense>
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
