// Importo StrictMode da React. 
// È un wrapper che attiva controlli aggiuntivi in modalità sviluppo
// per aiutarmi a individuare warning e potenziali problemi.
import { StrictMode } from 'react'

// Importo createRoot da react-dom/client.
// Serve per "agganciare" l'app React a un elemento HTML reale.
import { createRoot } from 'react-dom/client'

// Importo il file di stile globale. 
// Gli stili qui dentro valgono per tutta l'app.
import './index.css'

// Importo il componente principale dell'applicazione.
// Tutta l'interfaccia parte da <App />.
import App from './App.jsx'

// createRoot() crea la radice dell'applicazione React, collegata al nodo HTML con id "root".
// document.getElementById('root') si riferisce al <div id="root"> presente in public/index.html.
createRoot(document.getElementById('root')).render(
  // StrictMode avvolge la nostra app per fornire controlli extra in sviluppo.
  // Non ha effetti in produzione: serve solo per aiutarci a trovare errori.
  <StrictMode>
    {/* Renderizzo il componente principale dell'app */}
    <App />
  </StrictMode>,
)