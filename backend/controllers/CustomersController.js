import connection from "../data/db.js";

// SHOW (Visualizza un cliente con ID)
export function show(req, res) {
    const sql = "SELECT * FROM customers WHERE id = ?";
    connection.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(result[0]);
    });
}

// STORE (Crea un nuovo cliente)
export function store(req, res) {
    const data = {
        email: req.body.email,
        full_name: req.body.full_name,
        billing_address: req.body.billing_address,
        default_shipping_address: req.body.default_shipping_address,
        country: req.body.country,
        phone: req.body.phone
    };
    const sql = "INSERT INTO customers SET ?";
    connection.query(sql, data, (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Created" });
    });
}

// UPDATE (Aggiorna dati cliente)
export function update(req, res) {
    const data = {
        email: req.body.email,
        full_name: req.body.full_name,
        billing_address: req.body.billing_address,
        default_shipping_address: req.body.default_shipping_address,
        country: req.body.country,
        phone: req.body.phone
    };
    const sql = "UPDATE customers SET ? WHERE id = ?";
    connection.query(sql, [data, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Updated" });
    });
}

// DESTROY (Elimina un cliente)
export function destroy(req, res) {
    const sql = "DELETE FROM customers WHERE id = ?";
    connection.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Deleted" });
    });
}

// INDEX (Elenco clienti)
export function index(req, res) {
    const sql = "SELECT * FROM customers";
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
}
