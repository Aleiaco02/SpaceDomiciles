import connection from "../data/db.js";

// INDEX - lista di tutti i pianeti
export function index(req, res) {
  const sql = "SELECT * FROM planets";

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    results.map((x) => {
      if (x.image.search("https") === -1) {
        // check sul percorso se é giá esistente e preso da fuori progetto
        x.image = x.image === "" ? null : req.imagePath + x.image;
      }
    });
    res.json(results);
  });
}

// SHOW - dettaglio di un singolo pianeta
export function show(req, res) {
  const { id } = req.params;

  const sql = `
    SELECT *
    FROM planets
    WHERE id = ?
  `;

  connection.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Query failed" });

    if (result.length === 0) {
      return res.status(404).json({ error: "Planet not found" });
    }

    result.map((x) => {
      if (x.image.search("https") === -1) {
        // check sul percorso se é giá esistente e preso da fuori progetto
        x.image = x.image === "" ? null : req.imagePath + x.image;
      }
    });
    res.json(result[0]);
  });
}

// STORE - crea un nuovo pianeta
export function store(req, res) {
  const {
    id_galaxy,
    name,
    planet_size,
    temperature_min,
    temperature_max,
    population,
    surface_available,
    distance_from_earth,
    description,
  } = req.body;
  let { image } = req.body;
  // Se l'immagine NON contiene http/https, aggiungi req.imagePath
  if (image && !image.startsWith("http")) {
    image = req.imagePath + image;
  }

  const sql = `
    INSERT INTO planets 
    (id_galaxy, name, planet_size, temperature_min, temperature_max, population, surface_available, distance_from_earth, description, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [
      id_galaxy,
      name,
      planet_size,
      temperature_min,
      temperature_max,
      population,
      surface_available,
      distance_from_earth,
      description,
      image,
    ],
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Insert failed",
          sqlError: err.sqlMessage,
        });
      }

      res.status(201).json({
        id: result.insertId,
        message: "Pianeta creato con successo",
      });
    }
  );
}

// UPDATE - aggiorna completamente un pianeta esistente
export function update(req, res) {
  const { id } = req.params;

  const {
    id_galaxy,
    name,
    planet_size,
    temperature_min,
    temperature_max,
    population,
    surface_available,
    distance_from_earth,
    description,
  } = req.body;
  let { image } = req.body;

  // Se l'immagine NON contiene http/https, aggiungi req.imagePath
  if (image && !image.startsWith("http")) {
    image = req.imagePath + image;
  }

  const sql = `
    UPDATE planets
    SET id_galaxy = ?, name = ?, planet_size = ?, temperature_min = ?, temperature_max = ?,
        population = ?, surface_available = ?, distance_from_earth = ?, description = ?, image = ?
    WHERE id = ?
  `;

  connection.query(
    sql,
    [
      id_galaxy,
      name,
      planet_size,
      temperature_min,
      temperature_max,
      population,
      surface_available,
      distance_from_earth,
      description,
      image,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Update failed",
          sqlError: err.sqlMessage,
        });
      }

      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Planet not found" });

      res.status(200).json({ message: "Pianeta modificato completamente" });
    }
  );
}

// PATCH - aggiorna parzialmente un pianeta esistente
export function patch(req, res) {
  const { id } = req.params;
  const fields = req.body; // campi da aggiornare

  const sql = `
    UPDATE planets
    SET ?
    WHERE id = ?
  `;

  connection.query(sql, [fields, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Patch failed" });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Planet not found" });

    res.status(200).json({ message: "Pianeta modificato parzialmente" });
  });
}

// PATCH
export function patch(req, res) {
  const { id } = req.params;

  const {
    id_galaxy,
    name,
    planet_size,
    temperature_min,
    temperature_max,
    population,
    surface_available,
    distance_from_earth,
    description,
  } = req.body;
  let { image } = req.body;

  // Se l'immagine NON contiene http/https, aggiungi req.imagePath
  if (image && !image.startsWith("http")) {
    image = req.imagePath + image;
  }

  // Campi aggiornabili
  const fields = [];
  const values = [];

  if (id_galaxy !== undefined) {
    fields.push("id_galaxy = ?");
    values.push(id_galaxy);
  }

  if (name !== undefined) {
    fields.push("name = ?");
    values.push(name);
  }

  if (planet_size !== undefined) {
    fields.push("planet_size = ?");
    values.push(planet_size);
  }

  if (temperature_min !== undefined) {
    fields.push("temperature_min = ?");
    values.push(temperature_min);
  }

  if (temperature_max !== undefined) {
    fields.push("temperature_max = ?");
    values.push(temperature_max);
  }

  if (population !== undefined) {
    fields.push("population = ?");
    values.push(population);
  }

  if (surface_available !== undefined) {
    fields.push("surface_available = ?");
    values.push(surface_available);
  }

  if (distance_from_earth !== undefined) {
    fields.push("distance_from_earth = ?");
    values.push(distance_from_earth);
  }

  if (description !== undefined) {
    fields.push("description = ?");
    values.push(description);
  }

  if (image !== undefined) {
    fields.push("image = ?");
    values.push(image);
  }

  // Nessun campo inviato
  if (fields.length === 0) {
    return res.status(400).json({ error: "No valid fields provided" });
  }

  const sql = `
    UPDATE planets
    SET ${fields.join(", ")}
    WHERE id = ?
  `;

  values.push(id);

  connection.query(sql, values, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Patch failed", sqlError: err.sqlMessage });

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Planet not found" });

    res.status(200).json({ message: "Pianeta modificato parzialmente" });
  });
}


// DELETE - elimina un pianeta esistente
export function destroy(req, res) {
  const { id } = req.params;

  const sql = `
    DELETE FROM planets
    WHERE id = ?
  `;

  connection.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Delete failed" });

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Planet not found" });

    res.status(200).json({ message: "Pianeta eliminato con successo" });
  });
}
