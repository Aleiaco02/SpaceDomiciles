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

function App() {
  return (
    <>
      <DefaultProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<DefaultLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/milky-way" element={<MilkyWayPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DefaultProvider>
    </>
  );
}

export default App;
