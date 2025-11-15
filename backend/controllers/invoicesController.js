// import connessione al database
import connection from "../data/db.js";

// index
export function index(req, res) {
    // stringa che computa mySQL nel DB
    const sqlString = "SELECT * FROM invoices";

    connection.query(sqlString, (err, results) => {
        if (err) return res.status(500).json({ error: "Database query failed" }); // catch error

        res.json(results);
    });
}

// show
export function show(req, res) {
    const id = req.params.id;

    // stringhe che computa mySQL nel DB
    const invoicesSqlString = `
    SELECT *
    FROM
        invoices 
    WHERE 
        invoices.id = ?`;

    connection.query(invoicesSqlString, [id], (err, invoiceResult) => {
        if (err)
            return res.status(500).json({ error: "Database query error (invoices)" }); // catch error
        if (invoiceResult.length === 0)
            return res.status(404).json({ error: "invoice not found" });
        const invoice = invoiceResult[0];

        res.json(invoice);
    });
}

// post
export function store(req, res) {
    const {
        customer_id,
        shipping_address,
        total_amount,
        invoice_address,
        invoice_email,
        invoice_date,
        invoice_status,
    } = req.body;

    const invoicesSqlString = `
    INSERT INTO invoices
      (customer_id, shipping_address, total_amount, invoice_address, invoice_email, invoice_date, invoice_status)
    VALUES
      (?, ?, ?, ?, ?, ?, ?)
  `;

    connection.query(
        invoicesSqlString,
        [
            customer_id,
            shipping_address,
            total_amount,
            invoice_address,
            invoice_email,
            invoice_date,
            invoice_status,
        ],
        (err, results) => {
            if (err) {
                return res.status(400).json({
                    error: "Failed to insert new invoice",
                    reminder:
                        "USE THESE COL NAMES: customer_id, shipping_address, total_amount, invoice_address, invoice_email, invoice_date, invoice_status",
                    sqlError: err.sqlMessage, // utile per debug
                });
            }

            res.status(201).json({
                id: results.insertId,
                message: "Invoice has been added successfully",
            });

            console.log(results);
        }
    );
}


// update
export function update(req, res) {
    const { id } = req.params;
    const {
        customer_id,
        shipping_address,
        total_amount,
        invoice_address,
        invoice_email,
        invoice_date,
        invoice_status,
    } = req.body;

    // stringa che computa mySQL nel DB
    const sql = `
    UPDATE invoices 
    SET 
        customer_id = ?,
        shipping_address = ?,
        total_amount = ?,
        invoice_address = ?,
        invoice_email = ?,
        invoice_date = ?,
        invoice_status = ?,
    WHERE
        id = ?`;

    connection.query(
        sql,
        [
            customer_id,
            shipping_address,
            total_amount,
            invoice_address,
            invoice_email,
            invoice_date,
            invoice_status,
            id,
        ],
        (err, results) => {
            if (err)
                return res.status(500).json({
                    // catch error
                    error: "Failed to update invoice",
                    reminder:
                        "USE THESE COL NAMES: customer_id, shipping_address, total_amount, invoice_address, invoice_email, invoice_date, invoice_status",
                });
            if (results.insertId === 0)
                return res.status(404).json({ error: "invoice not found" });
            res.status(202).json({ message: "invoice updated correctly" });
        }
    );
}

// patch
export function patch(req, res) {
    const id = req.params.id;
    const value = req.body;

    // stringa che computa mySQL nel DB
    const sql = `
    UPDATE invoices
    SET 
        ?
    WHERE
        id = ?`;

    connection.query(sql, [value, id], (err, results) => {
        if (err)
            return res.status(500).json({
                // catch error
                error: "Failed to modify invoice info/s",
                reminder:
                    "USE THESE COL NAMES: stack_invoices_id, invoice_code, issued_at, pdf_url",
            });
        if (results.affectedRows === 0)
            return res.status(404).json({ error: "invoice not found" });
        console.log(results);
        res.status(202).json({ message: "invoice info modified correctly" });
    });
}

// delete
export function destroy(req, res) {
    const { id } = req.params;

    // stringa che computa mySQL nel DB
    const sql = `
    DELETE 
    FROM
        invoices
    WHERE
        id = ?`;
    connection.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: "Failed to delete invoice" });
    });
    res.sendStatus(204);
}
