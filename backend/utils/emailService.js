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
    subject: `Your Certificates! (${certificates.length})`,
    html: `<div style="font-family: Arial, sans-serif; background:#f5f7fa; padding:40px;">
              <div style="max-width:600px; margin:auto; background:white; border-radius:10px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                <!-- HEADER -->
                <div style="text-align:center; margin-bottom:30px;">
                  <img src="https://i.imgur.com/EJg8kYB.png" alt="SpaceDomiciles Logo" style="width:120px; margin-bottom:10px;">
                  <h2 style="color:#1a237e; margin:0;">Your Certificates Are Ready 🚀</h2>
                  <p style="color:#555; margin-top:8px;">Thank you for your purchase!</p>
                </div>
                <!-- BODY -->
                <p style="font-size:15px; color:#333;">
                  Below you can find all the certificates generated for your recent order:
                </p>
                <ul style="padding-left:20px; margin-top:20px;">
                  ${certificates
                    .map(
                      c => `
                      <li style="margin-bottom:12px; font-size:15px;">
                        <span style="display:inline-block; background:#e3f2fd; color:#0d47a1; padding:6px 10px; border-radius:6px; font-weight:bold;">
                          ${c.certificate_code}
                        </span>
                        &nbsp;—&nbsp;
                        <a href="${c.pdf_url}" style="color:#1565c0; text-decoration:none; font-weight:bold;">
                          Download PDF
                        </a>
                      </li>
                    `
                    )
                    .join("")}
                </ul>
                <!-- DIVIDER -->
                <hr style="margin:30px 0; border:none; border-top:1px solid #ddd;">    
                <!-- FOOTER -->
                <p style="color:#777; font-size:14px; text-align:center; margin-top:10px;">
                  SpaceDomiciles • Explore new worlds, one plot at a time.
                </p>                  
              </div>
            </div>`
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email unica certificati inviata:", info.messageId);
  return info;
}

// ----------------------------------------------------------
// EMAIL AL VENDITORE
// ----------------------------------------------------------
export async function sendVendorEmail(orderData) {
  const mailOptions = {
    from: '"SpaceDomiciles" <laney.veum@ethereal.email>',
    to: "venditore@spacedomiciles.com",
    subject: `Nuovo ordine ricevuto (#${orderData.order_id})`,
    html: `<div style="font-family: Arial, sans-serif; background:#f5f5f5; padding:40px;">
            <div style="max-width:600px; margin:auto; background:white; border-radius:10px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

              <div style="text-align:center; margin-bottom:25px;">
                <h2 style="color:#1a237e; margin-bottom:5px;">📦 Nuovo Ordine Ricevuto</h2>
                <p style="color:#666; margin:0;">Un cliente ha appena completato un acquisto.</p>
              </div>

              <p style="font-size:15px; color:#333;">
                <strong>ID ordine:</strong> ${orderData.order_id}<br>
                <strong>Email cliente:</strong> ${orderData.customer_email}<br>
                <strong>Totale:</strong> ${orderData.total_price}€
              </p>

              <div style="margin-top:25px; text-align:center;">
                <a href="https://spacedomiciles.com/dashboard"
                  style="background:#1a237e; padding:12px 20px; color:white; text-decoration:none; 
                  border-radius:6px; font-weight:bold; display:inline-block;">
                  Apri il pannello venditore
                </a>
              </div>

              <hr style="margin:30px 0; border:none; border-top:1px solid #ddd;">
              <p style="color:#777; font-size:14px; text-align:center;">
                SpaceDomiciles • Admin Notification System
              </p>
            </div>
          </div>`
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email venditore inviata:", info.messageId);
  return info;
}