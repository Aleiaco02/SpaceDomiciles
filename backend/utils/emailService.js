// utils/emailService.js
// ==========================================================
// Questo file gestisce l'invio delle email tramite Nodemailer.
// Viene usato dal createOrderController per inviare al cliente
// l'email con il certificato generato.
// ==========================================================

import nodemailer from "nodemailer";

// ----------------------------------------------------------
// 1) Configurazione SMTP
// ----------------------------------------------------------
// Usiamo Ethereal: un servizio che permette di vedere email
// finte (solo per test), senza inviarle realmente.
// ----------------------------------------------------------

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "laney.veum@ethereal.email",   // <-- tuo user Ethereal
    pass: "M115EQe2kFUN5JV8kS"            // <-- tua password Ethereal
  }
});

// ----------------------------------------------------------
// 2) Funzione che invia l'email del certificato al cliente
// ----------------------------------------------------------
// - "to" = email del cliente
// - "certificate" = oggetto con informazioni sul certificato
// ----------------------------------------------------------

export async function sendCertificateEmail(to, certificate) {

  const mailOptions = {
    from: '"SpaceDomiciles" <laney.veum@ethereal.email>',
    to: to,
    subject: `Your Certificate #${certificate.certificate_code}`,
    html: `
      <h2> Certificate Issued!</h2>
      <p>Your purchase has been confirmed and your certificate is ready.</p>

      <p><strong>Certificate Code:</strong> ${certificate.certificate_code}</p>
      <p><strong>Issued At:</strong> ${certificate.issued_at}</p>

      <p>You can download the PDF here:</p>
      <a href="${certificate.pdf_url}">${certificate.pdf_url}</a>

      <br><br>
      <p>Thank you for choosing SpaceDomiciles 🚀</p>
    `
  };

  // Invia realmente l'email via Nodemailer
  const info = await transporter.sendMail(mailOptions);

  console.log("📨 Email sent:", info.messageId);

  return info;
}