import "./FilterDrawer.css";
import { useDefaultContext } from "../../Contexts/DefaultContext";
import { useState, useEffect } from "react";

export default function FilterDrawer({ open, onClose }) {
  const { filters, updateFilters, setFilters, defaultFilter } =
    useDefaultContext();

  // Stato locale temporaneo
  const [localFilters, setLocalFilters] = useState(filters);

  // Quando apri il drawer, copia i filtri attuali dentro localFilters
  useEffect(() => {
    if (open) setLocalFilters(filters);
  }, [open, filters]);

  // Funzione helper per aggiornare localFilters
  const updateLocal = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Applicazione finale
  const handleApply = () => {
    Object.entries(localFilters).forEach(([key, value]) => {
      updateFilters(key, value);
    });
    onClose();
  };

  return (
    <div className={`cart-drawer ${open ? "open" : ""}`}>
      <div className="cart-drawer-overlay" onClick={onClose} />

      <div className="cart-drawer-panel">
        <button className="cart-drawer-close" onClick={onClose}>
          &times;
        </button>

        <h3 className="cart-drawer-title">Filtri</h3>

        <div className="filters-container">
          {/* Ricerca */}
          <div className="filter-block">
            <label>Ricerca</label>
            <input
              type="text"
              value={localFilters.search}
              onChange={(e) => updateLocal("search", e.target.value)}
              placeholder="Cerca pianeti..."
            />
          </div>

          {/* Prezzo max */}
          <div className="filter-block">
            <label>Prezzo massimo</label>
            <input
              type="number"
              min="0"
              max="5000"
              value={localFilters.price}
              onChange={(e) => updateLocal("price", Number(e.target.value))}
            />
          </div>

          {/* Temperatura */}
          <div className="filter-block">
            <label>Temperatura min</label>
            <input
              type="number"
              value={localFilters.temperatureMin}
              onChange={(e) =>
                updateLocal("temperatureMin", Number(e.target.value))
              }
            />

            <label>Temperatura max</label>
            <input
              type="number"
              value={localFilters.temperatureMax}
              onChange={(e) =>
                updateLocal("temperatureMax", Number(e.target.value))
              }
            />
          </div>

          {/* Dimensione */}
          <div className="filter-block">
            <label>Dimensione min</label>
            <input
              type="number"
              value={localFilters.sizeMin}
              onChange={(e) => updateLocal("sizeMin", Number(e.target.value))}
            />

            <label>Dimensione max</label>
            <input
              type="number"
              value={localFilters.sizeMax}
              onChange={(e) => updateLocal("sizeMax", Number(e.target.value))}
            />
          </div>

          {/* Galassia */}
          <div className="filter-block">
            <label>Galassia</label>
            <select
              value={localFilters.galaxy_slug || ""}
              onChange={(e) => updateLocal("galaxy_slug", e.target.value)}
            >
              <option value="">Tutte</option>
              <option value="milky-way">Via Lattea</option>
              <option value="andromeda">Andromeda</option>
              <option value="sombrero">Sombrero</option>
            </select>
          </div>

          {/* 🔄 Reset */}
          <button
            className="cart-drawer-btn"
            onClick={() => {
              setLocalFilters(defaultFilter);
            }}
          >
            Reset
          </button>

          {/* ✔️ Applica */}
          <button className="cart-drawer-btn" onClick={handleApply}>
            Applica
          </button>
        </div>
      </div>
    </div>
  );
}
