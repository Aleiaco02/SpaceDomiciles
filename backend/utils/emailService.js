// utils/emailService.js
// ==========================================================
// Email SpaceDomiciles – Versione Semplificata (Emoji Edition)
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

// ==========================================================
// EMAIL AL CLIENTE — MISSION REPORT (SEMPLIFICATA)
// ==========================================================
export async function sendAllCertificatesEmail(to, certificates, orderData, items) {

  // Lista certificati in HTML (solo emoji)
  const certsHTML = certificates
    .map(
      c => `
        <div style="padding:12px; background:#0b0f2b; border:1px solid #232a60; border-radius:8px; margin-bottom:12px;">
          <p style="margin:0; color:#d0d4ff;">
            🔹 <strong>Certificate Code:</strong> ${c.certificate_code}<br>
            📘 <strong>Download:</strong> <a href="${c.pdf_url}" style="color:#7aa2ff;">${c.pdf_url}</a><br>
          </p>
        </div>
      `
    )
    .join("");

  // Lista items acquistati
  const itemsHTML = items
    .map(
      i => `
      <tr>
        <td style="padding:8px; border-bottom:1px solid #2a2d55; color:#dfe3ff;">${i.stack_name}</td>
        <td style="padding:8px; border-bottom:1px solid #2a2d55; color:#dfe3ff;">${i.planet_name}</td>
        <td style="padding:8px; border-bottom:1px solid #2a2d55; color:#dfe3ff;">${i.quantity}</td>
        <td style="padding:8px; border-bottom:1px solid #2a2d55; color:#dfe3ff;">€${i.price}</td>
      </tr>`
    )
    .join("");

  const mailOptions = {
    from: '"SpaceDomiciles" <laney.veum@ethereal.email>',
    to,
    subject: `🚀 Mission Report — Order #${orderData.order_id}`,
    html: `
      <div style="font-family:Arial, sans-serif; background:#05071a; padding:32px; color:white;">
        <div style="max-width:700px; margin:auto; background:#090b27; border-radius:12px; padding:28px; border:1px solid #1e2260;">

          <!-- HEADER -->
          <h1 style="text-align:center; margin-top:0; color:#9bb5ff;">
            🚀 MISSION REPORT
          </h1>
          <p style="text-align:center; color:#7f8dff; margin-top:-8px;">
            Order #${orderData.order_id}
          </p>

          <!-- SUMMARY -->
          <h3 style="color:#9bb5ff;">🧾 Order Summary</h3>
          <p style="color:#dfe3ff;">
            📄 <strong>Order ID:</strong> ${orderData.order_id}<br>
            📅 <strong>Date:</strong> ${orderData.date}<br>
            💰 <strong>Total:</strong> €${orderData.total_price}<br>
            💳 <strong>Payment:</strong> ${orderData.payment_method}
          </p>

          <!-- ITEMS -->
          <h3 style="color:#9bb5ff; margin-top:26px;">📦 Items Acquistati</h3>
          <table width="100%" style="border-collapse:collapse; margin-top:10px;">
            <thead>
              <tr>
                <th style="padding:8px; color:#9bb5ff; text-align:left;">Stack</th>
                <th style="padding:8px; color:#9bb5ff; text-align:left;">Pianeta</th>
                <th style="padding:8px; color:#9bb5ff; text-align:left;">Qty</th>
                <th style="padding:8px; color:#9bb5ff; text-align:left;">Prezzo</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <!-- CERTIFICATI -->
          <h3 style="color:#9bb5ff; margin-top:26px;">🪐 Planetary Certificates</h3>
          ${certsHTML}

          <!-- ADDRESSES -->
          <h3 style="color:#9bb5ff; margin-top:26px;">📡 Customer Coordinates</h3>
          <p style="color:#dfe3ff;">
            <strong>Shipping:</strong><br>
            ${orderData.shipping_address}<br><br>

            <strong>Billing:</strong><br>
            ${orderData.billing_address}
          </p>

          <hr style="border:0; border-top:1px solid #23285c; margin:28px 0;">

          <p style="text-align:center; color:#7f8dff; font-size:13px;">
            🌌 SpaceDomiciles — Explore New Worlds
          </p>

        </div>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Mission Report inviato:", info.messageId);
  return info;
}

// ==========================================================
// EMAIL AL VENDITORE — VERSIONE SEMPLIFICATA
// ==========================================================
export async function sendVendorEmail(orderData, items) {

  const itemsHTML = items
    .map(
      i => `
      <tr>
        <td style="padding:8px; border-bottom:1px solid #2a2d55; color:#dfe3ff;">${i.stack_name}</td>
        <td style="padding:8px; border-bottom:1px solid #2a2d55; color:#dfe3ff;">${i.planet_name}</td>
        <td style="padding:8px; border-bottom:1px solid #2a2d55; color:#dfe3ff;">${i.quantity}</td>
        <td style="padding:8px; border-bottom:1px solid #2a2d55; color:#dfe3ff;">€${i.price}</td>
      </tr>`
    )
    .join("");

  const mailOptions = {
    from: '"SpaceDomiciles" <laney.veum@ethereal.email>',
    to: "venditore@spacedomiciles.com",
    subject: `📡 NEW ORDER — #${orderData.order_id}`,
    html: `
      <div style="font-family:Arial, sans-serif; background:#05071a; padding:32px; color:white;">
        <div style="max-width:700px; margin:auto; background:#090b27; border-radius:12px; padding:28px; border:1px solid #1e2260;">

          <h1 style="text-align:center; color:#9bb5ff;">
            📡 NEW ORDER RECEIVED
          </h1>

          <p style="color:#dfe3ff;">
            Un nuovo ordine è stato completato su SpaceDomiciles.
          </p>

          <h3 style="color:#9bb5ff;">📊 Order Details</h3>
          <p style="color:#dfe3ff;">
            📄 <strong>Order ID:</strong> ${orderData.order_id}<br>
            📅 <strong>Date:</strong> ${orderData.date}<br>
            👤 <strong>Customer:</strong> ${orderData.customer_email}<br>
            💰 <strong>Total:</strong> €${orderData.total_price}
          </p>

          <h3 style="color:#9bb5ff; margin-top:20px;">📦 Items</h3>
          <table width="100%" style="border-collapse:collapse; margin-top:12px;">
            <thead>
              <tr>
                <th style="padding:8px; color:#9bb5ff; text-align:left;">Stack</th>
                <th style="padding:8px; color:#9bb5ff; text-align:left;">Pianeta</th>
                <th style="padding:8px; color:#9bb5ff; text-align:left;">Qty</th>
                <th style="padding:8px; color:#9bb5ff; text-align:left;">Prezzo</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <hr style="border:0; border-top:1px solid #23285c; margin:28px 0;">

          <p style="text-align:center; color:#7f8dff; font-size:13px;">
            SpaceDomiciles — Admin Panel
          </p>

        </div>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email venditore inviata:", info.messageId);
  return info;
}