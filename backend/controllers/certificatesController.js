// import connessione al database
import connection from "../data/db.js";

// index
export function index(req, res) {
  // stringa che computa mySQL nel DB
  const sqlString = "SELECT * FROM certificates";

  connection.query(sqlString, (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" }); // catch error

    res.json(results);
  });
}

// show
export function show(req, res) {
  const id = req.params.id;

  // stringhe che computa mySQL nel DB
  const certificatesSqlString = `
    SELECT *
    FROM
        certificates 
    WHERE 
        certificates.id = ?`;

  connection.query(certificatesSqlString, [id], (err, certificateResult) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Database query error (Certificates)" }); // catch error
    if (certificateResult.length === 0)
      return res.status(404).json({ error: "Certificate not found" });
    const certificate = certificateResult[0];
    res.json(certificate);
  });
}

// post
export function store(req, res) {
  const { stack_invoices_id, certificate_code, issued_at, pdf_url } = req.body;

  const certificatesSqlString = `INSERT INTO certificates
      (stack_invoices_id, certificate_code, issued_at, pdf_url)
    VALUES
      (?, ?, ?, ?)`;

  connection.query(
    certificatesSqlString,
    [stack_invoices_id, certificate_code, issued_at, pdf_url],
    (err, results) => {
      if (err)
        return res.status(400).json({
          error: "Failed to insert new certificate",
          reminder:
            "USE THESE COL NAMES: stack_invoices_id, certificate_code, issued_at, pdf_url",
          sqlError: err.sqlMessage, // utile per debug
        });

      res.status(201).json({
        id: results.insertId,
        message: "Certificate has been added successfully",
      });

      console.log(results);
    }
  );
}

// update
export function update(req, res) {
  const { id } = req.params;
  const { stack_invoices_id, certificate_code, issued_at, pdf_url } = req.body;

  // stringa che computa mySQL nel DB
  const sql = `
    UPDATE certificates 
    SET 
        stack_invoices_id = ?,
        certificate_code = ?,
        issued_at = ?,
        pdf_url = ?
    WHERE
        id = ?`;

  connection.query(
    sql,
    [stack_invoices_id, certificate_code, issued_at, pdf_url, id],
    (err, results) => {
      if (err)
        return res.status(500).json({
          // catch error
          error: "Failed to update certificate",
          reminder:
            "USE THESE COL NAMES: stack_invoices_id, certificate_code, issued_at, pdf_url",
          sqlError: err.sqlMessage, // utile per debug
        });
      res.status(202).json({ message: "Certificate updated correctly" });
    }
  );
}

// patch
export function patch(req, res) {
  const id = req.params.id;
  const value = req.body;

  // stringa che computa mySQL nel DB
  const sql = `
    UPDATE certificates
    SET 
        ?
    WHERE
        id = ?`;

  connection.query(sql, [value, id], (err, results) => {
    if (err)
      return res.status(500).json({
        // catch error
        error: "Failed to modify certificate info/s",
        reminder:
          "USE THESE COL NAMES: stack_invoices_id, certificate_code, issued_at, pdf_url",
      });
    if (results.affectedRows === 0)
      return res.status(404).json({ error: "Certificate not found" });
    console.log(results);
    res.status(202).json({ message: "Certificate info modified correctly" });
  });
}

// delete
export function destroy(req, res) {
  const { id } = req.params;

  // stringa che computa mySQL nel DB
  const sql = `
    DELETE 
    FROM
        certificates
    WHERE
        id = ?`;
  connection.query(sql, [id], (err) => {
    if (err)
      return res.status(500).json({ error: "Failed to delete certificate" });
  });
  res.sendStatus(204);
}
