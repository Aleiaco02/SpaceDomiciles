// backend/utils/generateCertificatePDF.js
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export default function generateCertificatePDF(certificateCode, certData) {

  // ⚠️ FORZIAMO che ogni certificato rappresenti *1 singola unità*
  const quantity = 1;
  const unitPrice = Number(certData.price);
  const totalValue = unitPrice * quantity;

  return new Promise((resolve, reject) => {
    const fileName = `${certificateCode}.pdf`;

    const outputDir = path.resolve("public/certificates");
    const outputPath = path.join(outputDir, fileName);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // HEADER
    doc.fontSize(26).fillColor("black").text("SpaceDomiciles", { align: "center" });
    doc.moveDown(1.5);

    doc.fontSize(20).text("CERTIFICATO DI PROPRIETÀ SPAZIALE", { align: "center" });
    doc.moveDown(2);

    // DATI DEL CERTIFICATO
    doc.fontSize(12);
    doc.text(`Codice certificato: ${certificateCode}`);
    doc.moveDown(0.7);
    doc.text(`ID Ordine (invoice): ${certData.invoice_id}`);
    doc.moveDown(0.7);
    doc.text(`ID Stack: ${certData.stack_id}`);
    doc.moveDown(0.7);
    doc.text(`Quantità certificata: 1`);
    doc.moveDown(0.7);
    doc.text(`Prezzo unitario: €${unitPrice.toFixed(2)}`);
    doc.moveDown(0.7);
    doc.text(`Valore totale: €${totalValue.toFixed(2)}`);

    doc.end();

    stream.on("finish", () => resolve(`/certificates/${fileName}`));
    stream.on("error", reject);
  });
}
