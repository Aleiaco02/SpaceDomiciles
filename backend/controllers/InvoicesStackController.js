import connection from "../data/db.js";

// INDEX (Elenco bridge fattura-stack)
export function index(req, res) {
    const sql = "SELECT * FROM invoices_stack";
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
}

// SHOW (Mostra una specifica relazione)
export function show(req, res) {
    const sql = "SELECT * FROM invoices_stack WHERE id = ?";
    connection.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(result[0]);
    });
}

// STORE (Crea una nuova relazione acquisto stack-fattura)
export function store(req, res) {
    const data = {
        stack_id: req.body.stack_id,
        invoices_id: req.body.invoices_id,
        price: req.body.price,
        quantity: req.body.quantity,
        stack_name: req.body.stack_name
    };
    const sql = "INSERT INTO invoices_stack SET ?";
    connection.query(sql, data, (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Created" });
    });
}

// UPDATE (Aggiorna una relazione)
export function update(req, res) {
    const data = {
        stack_id: req.body.stack_id,
        invoices_id: req.body.invoices_id,
        price: req.body.price,
        quantity: req.body.quantity,
        stack_name: req.body.stack_name
    };
    const sql = "UPDATE invoices_stack SET ? WHERE id = ?";
    connection.query(sql, [data, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Updated" });
    });
}

// DESTROY (Elimina una relazione)
export function destroy(req, res) {
    const sql = "DELETE FROM invoices_stack WHERE id = ?";
    connection.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Deleted" });
    });
}
