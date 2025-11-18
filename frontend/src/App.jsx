import "./App.css";
// DIPENDENZE REACT
import { BrowserRouter, Routes, Route } from "react-router-dom";

// LAYOUT
import DefaultLayout from "./Layout/DefaultLayout";

// CONTEXTS
import { DefaultProvider } from "./Contexts/DefaultContext";

// PAGINE
import HomePage from "./Pages/HomePage";
import MilkyWayPage from "./Pages/MilkyWayPage";
import AboutUsPage from "./Pages/AboutUsPage";
import ContactUs from "./Pages/ContactUsPage";
import CartTab from "./Components/MacroComponents/CartTab";
import Planet from "./Pages/Planet";

function App() {
  return (
    <>
      <DefaultProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<DefaultLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/milky-way" element={<MilkyWayPage />} />
              <Route path="/milky-way/:id" element={<Planet />} />
              <Route path="/aboutus" element={<AboutUsPage />} />
              <Route path="/contactus" element={<ContactUs />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DefaultProvider>
    </>
  );
}

export default App;
