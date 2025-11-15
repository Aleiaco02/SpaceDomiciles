
import connection from "../data/db.js";

// INDEX – lista di tutti gli stacks
export function index(req, res) {
    const sql = "SELECT * FROM stacks";

    connection.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(result);
    });
}

// SHOW – singolo stack
export function show(req, res) {
    const sql = "SELECT * FROM stacks WHERE id = ?";
    const id = req.params.id;

    connection.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (result.length === 0) {
            return res.status(404).json({ error: "Stack not found" });
        }

        res.json(result[0]);
    });
}

// STORE – crea un nuovo stack
export function store(req, res) {
    // recupero i dati dal body
    const { id_planet, name, price, stock, slug, title, description } = req.body;

    const sql = `
        INSERT INTO stacks
        (id_planet, name, price, stock, slug, title, description)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(sql, [id_planet, name, price, stock, slug, title, description], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });

        res.status(201).json({
            id: result.insertId,
            message: "Stack created"
        });
    });
}


// UPDATE – aggiorna stack esistente
export function update(req, res) {
    const id = req.params.id;
    const data = req.body;

    const sql = "UPDATE stacks SET ? WHERE id = ?";

    connection.query(sql, [data, id], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });

        res.json({ message: "Stack updated" });
    });
}

// DESTROY – elimina uno stack
export function destroy(req, res) {
    const id = req.params.id;

    const sql = "DELETE FROM stacks WHERE id = ?";

    connection.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });

        // se nessuno stack con quell'id
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Stack not found" });
        }

        res.json({ message: "Stack deleted" });
    });
}

