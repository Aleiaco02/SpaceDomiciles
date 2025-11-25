import express from "express";
import gateway from "../config/braintree.js";
import connection from "../data/db.js";

const router = express.Router();

// GET TOKEN
router.get("/token", async (req, res) => {
    try {
        const { clientToken } = await gateway.clientToken.generate({});
        res.json({ clientToken });
    } catch (error) {
        res.status(500).json({ error: "Errore generazione token" });
    }
});

// CHECKOUT
router.post("/checkout", async (req, res) => {
    const { amount, nonce, invoice_id, method } = req.body;

    if (!amount || !nonce || !invoice_id) {
        return res.status(400).json({ error: "Dati mancanti" });
    }

    try {
        const sale = await gateway.transaction.sale({
            amount,
            paymentMethodNonce: nonce,
            options: { submitForSettlement: true },
        });

        if (!sale.success) {
            return res
                .status(400)
                .json({ success: false, error: sale.message });
        }

        const transactionId = sale.transaction.id;

        // se non arriva method, di default usiamo "credit_card"
        const paymentMethod = method || "credit_card";

        const sql = `
      INSERT INTO payments (invoice_id, amount, method, status, transaction_id, paid_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

        connection.query(
            sql,
            [invoice_id, amount, paymentMethod, "completed", transactionId],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Errore DB", details: err });
                }

                res.json({
                    success: true,
                    transactionId,
                    payment_id: result.insertId,
                });
            }
        );
    } catch (err) {
        res.status(500).json({ error: "Errore transazione", details: err });
    }
});

export default router;
