import connection from "../data/db.js";

// INDEX - lista di tutti i pianeti
export function index(req, res) {
  const sql = "SELECT * FROM planets";

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({error: "Database error"});
    res.json(results);
  });
}

// SHOW - dettaglio di un singolo pianeta
export function show(req, res) {
  const {id} = req.params;

  const sql = `
    SELECT *
    FROM planets
    WHERE id = ?
  `;

  connection.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({error: "Query failed"});

    if (result.length === 0) {
      return res.status(404).json({error: "Planet not found"});
    }

    res.json(result[0]);
  });
}

// STORE - crea un nuovo pianeta
export function store(req, res) {
  const {id_galaxy, name, planet_size, temperature_min, temperature_max, population, surface_available, distance_from_earth, description, image} = req.body;

  const sql = `
    INSERT INTO planets 
    (id_galaxy, name, planet_size, temperature_min, temperature_max, population, surface_available, distance_from_earth, description, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [id_galaxy, name, planet_size, temperature_min, temperature_max, population, surface_available, distance_from_earth, description, image],
    (err, result) => {
      if (err) {
        return res.status(400).json({ 
            error: "Insert failed", 
            sqlError: err.sqlMessage 
        });
      }

      res.status(201).json({
        id: result.insertId,
        message: "Pianeta creato con successo"});
    }
  );
}

// UPDATE - aggiorna completamente un pianeta esistente
export function update(req, res) {
  const {id} = req.params;

  const {id_galaxy, name, planet_size, temperature_min, temperature_max, population, surface_available, distance_from_earth, description, image} = req.body;

  const sql = `
    UPDATE planets
    SET id_galaxy = ?, name = ?, planet_size = ?, temperature_min = ?, temperature_max = ?,
        population = ?, surface_available = ?, distance_from_earth = ?, description = ?, image = ?
    WHERE id = ?
  `;

  connection.query(
    sql,
    [id_galaxy, name, planet_size, temperature_min, temperature_max, population, surface_available, distance_from_earth, description, image, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ 
          error: "Update failed", 
          sqlError: err.sqlMessage 
        });
      }

      if (result.affectedRows === 0)
        return res.status(404).json({error: "Planet not found"});

      res.status(200).json({message: "Pianeta modificato completamente"});
    }
  );
}

// PATCH - aggiorna parzialmente un pianeta esistente
export function patch(req, res) {
  const {id} = req.params;
  const fields = req.body; // campi da aggiornare

  const sql = `
    UPDATE planets
    SET ?
    WHERE id = ?
  `;

  connection.query(sql, [fields, id], (err, result) => {
    if (err) return res.status(500).json({error: "Patch failed"});
    if (result.affectedRows === 0)
      return res.status(404).json({error: "Planet not found"});

    res.status(200).json({message: "Pianeta modificato parzialmente"});
  });
}

// DELETE - elimina un pianeta esistente
export function destroy(req, res) {
  const {id} = req.params;

  const sql = `
    DELETE FROM planets
    WHERE id = ?
  `;

  connection.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({error: "Delete failed"});

    if (result.affectedRows === 0)
      return res.status(404).json({error: "Planet not found"});

    res.status(200).json({message: "Pianeta eliminato con successo"});
  });
}
