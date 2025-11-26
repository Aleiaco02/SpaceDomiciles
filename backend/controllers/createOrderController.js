// controllers/createOrderController.js
import connection from "../data/db.js";
import { sendAllCertificatesEmail, sendVendorEmail } from "../utils/emailService.js";
import generateInvoicePDF from "../utils/generateInvoicePDF.js";
import generateCertificatePDF from "../utils/generateCertificatePDF.js";

function generateCertificateCode() {
  return "C-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export async function createOrder(req, res) {
  try {
    const {
      shipping_address,
      invoice_address,
      invoice_email,
      items,
      wantInvoice = false,
      billing = null,
    } = req.body;

    const stackIds = items.map((i) => i.stack_id);
    const stacksResults = await query(
      `SELECT id, price FROM stacks WHERE id IN (${stackIds.join(",")})`
    );

    const priceMap = {};
    stacksResults.forEach((s) => (priceMap[s.id] = s.price));

    let total_amount = 0;
    items.forEach((item) => {
      total_amount += priceMap[item.stack_id] * item.quantity;
    });

    const invoiceResult = await query(
      `INSERT INTO invoices
      (customer_id, shipping_address, invoice_address, invoice_email, total_amount, invoice_date, invoice_status)
      VALUES (NULL, ?, ?, ?, ?, NOW(), 'pending')`,
      [shipping_address, invoice_address, invoice_email, total_amount]
    );
    const invoice_id = invoiceResult.insertId;

    const createdItems = [];

    for (let item of items) {
      const itemResult = await query(
        `INSERT INTO invoices_stack (invoice_id, stack_id, price, quantity)
        VALUES (?, ?, ?, ?)`,
        [invoice_id, item.stack_id, priceMap[item.stack_id], item.quantity]
      );

      createdItems.push({
        invoices_stack_id: itemResult.insertId,
        stack_id: item.stack_id,
        quantity: item.quantity,
        price: priceMap[item.stack_id],
      });
    }

    // GENERA I CERTIFICATI + PDF
    const certificates = [];

    for (let item of createdItems) {
    
      // 🔥 genera 1 certificato per ogni unità acquistata
      for (let i = 0; i < item.quantity; i++) {
      
        const code = generateCertificateCode();
      
        const pdf_url = await generateCertificatePDF(code, {
          invoice_id,
          stack_id: item.stack_id,
          quantity: 1, // sempre uno per certificato
          price: item.price
        });
      
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
    }


    const itemsDetail = await query(
      `SELECT invoices_stack.quantity, invoices_stack.price,
              stacks.name AS stack_name, planets.name AS planet_name
       FROM invoices_stack
       JOIN stacks ON stacks.id = invoices_stack.stack_id
       JOIN planets ON planets.id = stacks.id_planet
       WHERE invoices_stack.invoice_id = ?`,
      [invoice_id]
    );

    let invoicePdfUrl = null;

    if (wantInvoice && billing) {
      invoicePdfUrl = await generateInvoicePDF(
        invoice_id,
        billing,
        {
          order_id: invoice_id,
          total_price: total_amount,
          date: new Date().toLocaleString("it-IT"),
        },
        itemsDetail
      );

      await query(
        `UPDATE invoices SET invoice_pdf_url = ? WHERE id = ?`,
        [invoicePdfUrl, invoice_id]
      );
    }

    const orderData = {
      order_id: invoice_id,
      customer_email: invoice_email,
      date: new Date().toLocaleString("it-IT"),
      total_price: total_amount,
      payment_method: "N/A",
      shipping_address,
      billing_address: invoice_address,
      invoice_pdf_url: invoicePdfUrl,
      wantInvoice,
      billing_data: billing,
    };

    await sendAllCertificatesEmail(
      invoice_email,
      certificates,
      orderData,
      itemsDetail,
      invoicePdfUrl
    );

    await sendVendorEmail(orderData, itemsDetail);

    return res.status(201).json({
      message: "Order created successfully",
      invoice: { id: invoice_id },
      certificates,
    });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
}
