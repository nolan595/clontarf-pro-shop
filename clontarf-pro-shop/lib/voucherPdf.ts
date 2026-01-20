import jsPDF from "jspdf";

export type VoucherPdfInput = {
  id: string;
  amount: number;
  recipient_name: string | null;
  message: string | null;
};

export function buildVoucherPdf(p: VoucherPdfInput) {
  const doc = new jsPDF(); // A4 portrait (mm) by default

  // Dark background
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, 210, 297, "F");

  // Header with emerald accent
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, 210, 50, "F");

  // Business name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.text( "Clontarf Paradise Golf", 105, 30, { align: "center" });

  // Amount box
  doc.setFillColor(39, 39, 42);
  doc.roundedRect(50, 80, 110, 50, 8, 8, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text("GIFT VOUCHER", 105, 100, { align: "center" });

  doc.setTextColor(16, 185, 129);
  doc.setFontSize(42);
  doc.text(`€${p.amount}`, 105, 120, { align: "center" });

  // Details section
  let yPos = 160;

  if (p.recipient_name) {
    doc.setFontSize(11);
    doc.setTextColor(161, 161, 170);
    doc.text("TO:", 50, yPos);

    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(p.recipient_name, 50, yPos + 10);

    yPos += 30;
  }

  if (p.message) {
    doc.setFontSize(11);
    doc.setTextColor(161, 161, 170);
    doc.text("MESSAGE:", 50, yPos);

    doc.setFontSize(12);
    doc.setTextColor(228, 228, 231);
    const split = doc.splitTextToSize(p.message, 110);
    doc.text(split, 50, yPos + 10);

    yPos += 15 + split.length * 6;
  }

  // Valid for section
  doc.setFillColor(39, 39, 42);
  doc.roundedRect(50, 220, 110, 30, 5, 5, "F");

  doc.setFontSize(10);
  doc.setTextColor(161, 161, 170);
  doc.text("VALID FOR", 105, 232, { align: "center" });

  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("Lessons • Equipment • Pro Shop", 105, 242, { align: "center" });

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(113, 113, 122);
  doc.text(
    "Redeemable for any golf lessons, equipment, or pro shop merchandise",
    105,
    265,
    { align: "center" },
  );
  doc.text(`Voucher Code: ${p.id.substring(0, 8).toUpperCase()}`, 105, 272, { align: "center" });
  doc.text("Never expires • Non-refundable", 105, 279, { align: "center" });

  return doc;
}

export function voucherPdfBase64(p: VoucherPdfInput) {
  const doc = buildVoucherPdf(p);
  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer).toString("base64");
}
