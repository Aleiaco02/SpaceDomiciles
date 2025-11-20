// utils/emailService.js
// ==========================================================
// Gestione email tramite Nodemailer
// ==========================================================

import nodemailer from "nodemailer";

// ----------------------------------------------------------
// CONFIGURAZIONE SMTP (ETHEREAL PER TEST)
// ----------------------------------------------------------
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "laney.veum@ethereal.email",
    pass: "M115EQe2kFUN5JV8kS"
  }
});

// ----------------------------------------------------------
// INVIA UNA SOLA EMAIL AL CLIENTE CON TUTTI I CERTIFICATI
// ----------------------------------------------------------
export async function sendAllCertificatesEmail(to, certificates) {
  let listHTML = certificates
    .map(c => `
      <li>
        <strong>${c.certificate_code}</strong> — 
        <a href="${c.pdf_url}">${c.pdf_url}</a>
      </li>
    `)
    .join("");

  const mailOptions = {
    from: '"SpaceDomiciles" <laney.veum@ethereal.email>',
    to: to,
    subject: `Your Certificates (${certificates.length})`,
    html: `
      <h2>Your Certificates Are Ready 🚀</h2>
      <p>Here are all the certificates for your recent purchase:</p>
      <ul>
        ${listHTML}
      </ul>
      <br>
      <p>Thank you for choosing SpaceDomiciles!</p>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("📨 Email unica certificati inviata:", info.messageId);
  return info;
}

// ----------------------------------------------------------
// EMAIL AL VENDITORE
// ----------------------------------------------------------
export async function sendVendorEmail(orderData) {
  const mailOptions = {
    from: '"SpaceDomiciles" <laney.veum@ethereal.email>',
    to: "venditore@spacedomiciles.com",
    subject: `📦 Nuovo ordine ricevuto (#${orderData.order_id})`,
    html: `
      <h2>Nuovo ordine ricevuto</h2>
      <p><strong>ID ordine:</strong> ${orderData.order_id}</p>
      <p><strong>Email cliente:</strong> ${orderData.customer_email}</p>
      <p><strong>Totale:</strong> ${orderData.total_price}€</p>
      <br>
      <p>Accedi al pannello per maggiori dettagli.</p>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("📢 Email venditore inviata:", info.messageId);
  return info;
}