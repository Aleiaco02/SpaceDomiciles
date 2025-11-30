// Qui indichiamo il layout principale dell’applicazione.
// Contiene l’header, il footer e la sezione centrale gestita da Outlet di React Router, dove vengono renderizzate tutte le pagine.
// Riceve anche la funzione setDrawerOpen come prop e la passa all’Header, così da permettere a qualsiasi pagina di aprire il carrello tramite l’icona dell’header.

// Outlet è il punto in cui React Router inserisce la pagina richiesta
import { Outlet } from "react-router-dom";

// Componenti principali del layout
import MyHeader from "../Components/MacroComponents/MyHeader";
import MyFooter from "../Components/MacroComponents/MyFooter";

// Il layout principale dell’app: header → pagina → footer
export default function DefaultLayout({ setDrawerOpen }) {
  return (
    <>
      {/* HEADER PRINCIPALE
          Riceve setDrawerOpen così l’icona del carrello può aprire il Drawer */}
      <MyHeader setDrawerOpen={setDrawerOpen} />

      {/* Contenitore della pagina corrente
          Outlet = punto dove viene renderizzata la pagina attuale */}
      <main>
        <Outlet />
      </main>

      {/* FOOTER */}
      <MyFooter />
    </>
  );
}