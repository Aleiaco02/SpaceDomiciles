// controllers/createOrderController.js
// ==========================================================
// Questa API gestisce la creazione completa di un ordine.
// In UN SOLO colpo:
// 1) crea la invoice (senza customer_id, perché non usiamo login)
// 2) crea le righe in invoices_stack
// 3) genera i certificati
// 4) invia UNA sola email al cliente (layout galattico)
// 5) invia email al venditore
// ==========================================================

import connection from "../data/db.js";
import { sendAllCertificatesEmail, sendVendorEmail } from "../utils/emailService.js";

// ----------------------------------------------------------
// Utility: genera codice univoco per i certificati
// ----------------------------------------------------------
function generateCertificateCode() {
  return "C-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

// ----------------------------------------------------------
// Utility: wrapper per usare MySQL con async/await
// ----------------------------------------------------------
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

// ----------------------------------------------------------
// FUNZIONE PRINCIPALE: createOrder
// ----------------------------------------------------------
export async function createOrder(req, res) {
  try {
    const {
      shipping_address,
      invoice_address,
      invoice_email,
      items
    } = req.body;

    // ------------------------------------------------------
    // VALIDAZIONI INPUT (SENZA CUSTOMER_ID)
    // ------------------------------------------------------
    if (!shipping_address || !invoice_address || !invoice_email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items must be an array" });
    }

    for (let item of items) {
      if (!item.stack_id || item.quantity <= 0) {
        return res.status(400).json({
          error: "Each item must have stack_id and quantity > 0"
        });
      }
    }

    // ------------------------------------------------------
    // RECUPERARE I PREZZI DELLE STACK DAL DATABASE
    // ------------------------------------------------------
    const stackIds = items.map(i => i.stack_id);

    const sqlStacks = `
      SELECT id, price
      FROM stacks
      WHERE id IN (${stackIds.join(",")})
    `;

    const stacksResults = await query(sqlStacks);

    if (stacksResults.length !== items.length) {
      return res.status(400).json({ error: "Some stack_id does not exist" });
    }

    const priceMap = {};
    stacksResults.forEach(s => (priceMap[s.id] = s.price));

    // ------------------------------------------------------
    // CALCOLARE IL TOTALE
    // ------------------------------------------------------
    let total_amount = 0;

    items.forEach(item => {
      total_amount += priceMap[item.stack_id] * item.quantity;
    });

    // ------------------------------------------------------
    // CREARE LA INVOICE (customer_id = NULL)
    // ------------------------------------------------------
    const sqlInvoice = `
      INSERT INTO invoices
      (customer_id, shipping_address, invoice_address, invoice_email, total_amount, invoice_date, invoice_status)
      VALUES (NULL, ?, ?, ?, ?, NOW(), 'pending')
    `;

    const invoiceResult = await query(sqlInvoice, [
      shipping_address,
      invoice_address,
      invoice_email,
      total_amount
    ]);

    const invoice_id = invoiceResult.insertId;

    // ------------------------------------------------------
    // CREARE GLI ITEMS DELLA INVOICE (invoices_stack)
    // ------------------------------------------------------
    const createdItems = [];

    for (let item of items) {
      const sqlItem = `
        INSERT INTO invoices_stack
        (invoice_id, stack_id, price, quantity)
        VALUES (?, ?, ?, ?)
      `;

      const itemResult = await query(sqlItem, [
        invoice_id,
        item.stack_id,
        priceMap[item.stack_id],
        item.quantity
      ]);

      createdItems.push({
        invoices_stack_id: itemResult.insertId,
        stack_id: item.stack_id,
        quantity: item.quantity,
        price: priceMap[item.stack_id]
      });
    }

    // ------------------------------------------------------
    // GENERARE I CERTIFICATI
    // ------------------------------------------------------
    const certificates = [];

    for (let item of createdItems) {
      const code = generateCertificateCode();
      const pdf_url = `/certificates/${code}.pdf`;

      const sqlCert = `
        INSERT INTO certificates
        (stack_invoices_id, certificate_code, issued_at, pdf_url)
        VALUES (?, ?, NOW(), ?)
      `;

      const certResult = await query(sqlCert, [
        item.invoices_stack_id,
        code,
        pdf_url
      ]);

      certificates.push({
        id: certResult.insertId,
        invoices_stack_id: item.invoices_stack_id,
        certificate_code: code,
        issued_at: new Date(),
        pdf_url
      });
    }

    // ------------------------------------------------------
    // PRENDI I DETTAGLI (STACK + PIANETI) PER L'EMAIL
    // ------------------------------------------------------
    const sqlItemsDetail = `
      SELECT 
        invoices_stack.quantity,
        invoices_stack.price,
        stacks.name AS stack_name,
        planets.name AS planet_name
      FROM invoices_stack
      JOIN stacks ON stacks.id = invoices_stack.stack_id
      JOIN planets ON planets.id = stacks.id_planet
      WHERE invoices_stack.invoice_id = ?
    `;

    const itemsDetail = await query(sqlItemsDetail, [invoice_id]);

    // ------------------------------------------------------
    // PREPARA orderData PER L'EMAIL
    // ------------------------------------------------------
    const orderData = {
      order_id: invoice_id,
      customer_name: "Cliente",
      customer_email: invoice_email,
      date: new Date().toLocaleString("it-IT"),
      total_price: total_amount,
      payment_method: "N/A",
      shipping_address,
      billing_address: invoice_address
    };

    // ------------------------------------------------------
    // INVIA EMAIL GALATTICA AL CLIENTE
    // ------------------------------------------------------
    await sendAllCertificatesEmail(
      invoice_email,
      certificates,
      orderData,
      itemsDetail
    );

    // ------------------------------------------------------
    // INVIA EMAIL AL VENDITORE
    // ------------------------------------------------------
    await sendVendorEmail(orderData, itemsDetail);

    // ------------------------------------------------------
    // RISPOSTA FINALE
    // ------------------------------------------------------
    return res.status(201).json({
      message: "Order created successfully",
      invoice: {
        id: invoice_id,
        customer_id: null,
        shipping_address,
        invoice_address,
        invoice_email,
        total_amount
      },
      items: createdItems,
      certificates
    });

  } catch (err) {
    console.error("ORDER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
