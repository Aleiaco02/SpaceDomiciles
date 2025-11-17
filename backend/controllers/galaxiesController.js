import connection from "../data/db.js";

// INDEX
export function index(req, res) {
  const sql = "SELECT * FROM galaxies";

  connection.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    result.map((x) => {
      if (x.image.search("https") === -1) {
        // check sul percorso se é giá esistente e preso da fuori progetto
        x.image = x.image === "" ? null : req.imagePath + x.image;
      }
    });
    res.json(result);
  });
}

// SHOW
export function show(req, res) {
  const sql = "SELECT * FROM galaxies WHERE id = ?";

  connection.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (result.length === 0) {
      return res.status(404).json({ error: "Galaxy not found" });
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

// STORE
export function store(req, res) {
  // recupero i dati dal body
  const { name, description } = req.body;

  const sql = `
        INSERT INTO galaxies 
        (name, description)
        VALUES (?, ?)
    `;

  connection.query(sql, [name, description], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    res.status(201).json({
      id: result.insertId,
      message: "Galaxy created",
    });
  });
}

// UPDATE
export function update(req, res) {
  const id = req.params.id;
  const { name, description } = req.body;

  const sql = `
        UPDATE galaxies
        SET name = ?, description = ?
        WHERE id = ?
    `;

  connection.query(sql, [name, description, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Galaxy not found" });
    }

    res.json({ message: "Galaxy updated" });
  });
}

// DESTROY
export function destroy(req, res) {
  const id = req.params.id;

  const sql = "DELETE FROM galaxies WHERE id = ?";

  connection.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    // se nessuna riga è stata eliminata → ID non trovato
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Galaxy not found" });
    }

    res.json({ message: "Galaxy deleted" });
  });
}
