import connection from "../data/db.js";

// INDEX - lista di tutti i pagamenti
export function index(req, res) {
  const sql = "SELECT * FROM payments";

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({error: "Database error"});
    res.json(results);
  });
}

// SHOW - dettaglio di un pagamento
export function show(req, res) {
  const {id} = req.params;

  const sql = `
    SELECT *
    FROM payments
    WHERE id = ?
  `;

  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({error: "Database error"});

    if (results.length === 0) {
      return res.status(404).json({error: "Payment not found"});
    }

    res.json(results[0]);
  });
}

// STORE - crea un nuovo pagamento
export function store(req, res) {
  const {invoices_id, amount, method, status, transaction_id, paid_at} = req.body;

  const sql = `
    INSERT INTO payments
    (invoices_id, amount, method, status, transaction_id, paid_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [invoices_id, amount, method, status, transaction_id, paid_at],
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Insert failed",
          sqlError: err.sqlMessage,
        });
      }

      res.status(201).json({
        id: result.insertId,
        message: "Payment created",
      });
    }
  );
}

// UPDATE - aggiorna completamente un pagamento
export function update(req, res) {
  const {id} = req.params;

  const {invoices_id, amount, method, status, transaction_id, paid_at} = req.body;

  const sql = `
    UPDATE payments
    SET invoices_id = ?, amount = ?, method = ?, status = ?, transaction_id = ?, paid_at = ?
    WHERE id = ?
  `;

  connection.query(
    sql,
    [invoices_id, amount, method, status, transaction_id, paid_at, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Update failed",
          sqlError: err.sqlMessage,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({error: "Payment not found"});
      }

      res.json({message: "Payment updated"});
    }
  );
}

// PATCH - aggiorna solo alcuni campi del pagamento
export function patch(req, res) {
  const {id} = req.params;
  const fields = req.body;

  const sql = `
    UPDATE payments
    SET ?
    WHERE id = ?
  `;

  connection.query(sql, [fields, id], (err, result) => {
    if (err) return res.status(500).json({error: "Patch failed"});

    if (result.affectedRows === 0) {
      return res.status(404).json({error: "Payment not found"});
    }

    res.json({message: "Payment partially updated"});
  });
}

// DESTROY - elimina un pagamento
export function destroy(req, res) {
  const {id} = req.params;

  const sql = "DELETE FROM payments WHERE id = ?";

  connection.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({error: "Delete failed"});

    if (result.affectedRows === 0) {
      return res.status(404).json({error: "Payment not found"});
    }

    res.sendStatus(204);
  });
}