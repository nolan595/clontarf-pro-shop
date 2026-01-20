import jsPDF from "jspdf";

export type VoucherPdfInput = {
  id: string;
  amount: number;
  recipient_name: string | null;
  message: string | null;
  buyer_name?: string | null; // NEW
  currency?: string | null; // optional, defaults to EUR
};

const PAGE_W = 210;
const PAGE_H = 297;

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function groupCode(value: string) {
  return (
    value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .match(/.{1,4}/g)
      ?.join("-") ?? value
  );
}

export function buildVoucherPdf(p: VoucherPdfInput) {
  const doc = new jsPDF(); // A4 portrait (mm)

  const emerald = [27, 74, 44] as const;
  const bg = [0, 0, 0] as const;
  const panel = [24, 24, 27] as const;
  const panel2 = [39, 39, 42] as const;
  const textMuted = [161, 161, 170] as const;
  const textSoft = [228, 228, 231] as const;
  const textGray = [113, 113, 122] as const;
  const white = [255, 255, 255] as const;

  const currency = (p.currency ?? "EUR").toUpperCase();
  const formattedAmount = formatCurrency(p.amount, currency);

  /* ================= BACKGROUND ================= */

  doc.setFillColor(...bg);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  // Subtle diagonal texture (premium feel, low contrast)
  doc.setDrawColor(28, 28, 30);
  doc.setLineWidth(0.15);
  const step = 12;
  for (let x = -PAGE_H; x < PAGE_W + PAGE_H; x += step) {
    doc.line(x, 0, x + PAGE_H, PAGE_H);
  }

  /* ================= BORDERS ================= */

  // Outer border ONLY (inner border removed)
  doc.setDrawColor(63, 63, 70);
  doc.setLineWidth(0.6);
  doc.roundedRect(6, 6, PAGE_W - 12, PAGE_H - 12, 6, 6, "S");

  /* ================= HEADER ================= */

  doc.setFillColor(...emerald);
  doc.roundedRect(10, 10, PAGE_W - 20, 48, 6, 6, "F");

  doc.setTextColor(...white);
  doc.setFontSize(28);
  doc.text("Clontarf Paradise Golf", PAGE_W / 2, 32, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(235, 235, 235);
  doc.text("Gift vouchers for lessons, equipment & pro shop gear", PAGE_W / 2, 44, {
    align: "center",
  });

  /* ================= AMOUNT CARD ================= */

  const cardX = 28;
  const cardY = 78;
  const cardW = 154;
  const cardH = 62;

  // Shadow
  doc.setFillColor(0, 0, 0);
  doc.roundedRect(cardX + 2, cardY + 2, cardW, cardH, 10, 10, "F");

  // Card
  doc.setFillColor(...panel);
  doc.roundedRect(cardX, cardY, cardW, cardH, 10, 10, "F");

  // Card stroke
  doc.setDrawColor(63, 63, 70);
  doc.setLineWidth(0.4);
  doc.roundedRect(cardX, cardY, cardW, cardH, 10, 10, "S");

  // Small badge
  doc.setFillColor(...panel2);
  doc.roundedRect(cardX + 10, cardY + 10, 48, 10, 5, 5, "F");

  doc.setFontSize(9);
  doc.setTextColor(...textMuted);
  doc.text("GIFT VOUCHER", cardX + 34, cardY + 17, { align: "center" });

  // Amount
  doc.setFontSize(44);
  doc.setTextColor(...emerald);
  doc.text(formattedAmount, PAGE_W / 2, cardY + 44, { align: "center" });

  // Microcopy
  doc.setFontSize(10);
  doc.setTextColor(...textSoft);
  doc.text("Present this voucher at checkout", PAGE_W / 2, cardY + 56, {
    align: "center",
  });

  /* ================= DETAILS ================= */

  let yPos = 160;

  // Issued + From (buyer) on one line (premium + gift feel)
  const issued = new Date().toLocaleDateString("en-IE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const from = p.buyer_name?.trim();
  const issuedLine = from ? `Issued: ${issued}  •  From: ${from}` : `Issued: ${issued}`;

  doc.setFontSize(10);
  doc.setTextColor(...textGray);
  doc.text(issuedLine, cardX, yPos - 12);

  if (p.recipient_name) {
    doc.setFontSize(10);
    doc.setTextColor(...textMuted);
    doc.text("TO", cardX, yPos);

    doc.setFontSize(16);
    doc.setTextColor(...white);
    doc.text(p.recipient_name, cardX, yPos + 9);

    yPos += 26;
  }

  if (p.message) {
    doc.setFontSize(10);
    doc.setTextColor(...textMuted);
    doc.text("MESSAGE", cardX, yPos);

    // Message box (cleaner than free text)
    doc.setFillColor(...panel2);
    doc.roundedRect(cardX, yPos + 6, cardW, 38, 7, 7, "F");

    doc.setDrawColor(63, 63, 70);
    doc.setLineWidth(0.3);
    doc.roundedRect(cardX, yPos + 6, cardW, 38, 7, 7, "S");

    doc.setFontSize(11);
    doc.setTextColor(...textSoft);

    const split = doc.splitTextToSize(p.message, cardW - 18);
    const maxLines = 4;
    const lines =
      split.length > maxLines
        ? [...split.slice(0, maxLines - 1), (split[maxLines - 1] ?? "") + "…"]
        : split;

    doc.text(lines, cardX + 9, yPos + 20);

    yPos += 52;
  }

  /* ================= VALID FOR ================= */

  const validY = 222;

  // Shadow
  doc.setFillColor(0, 0, 0);
  doc.roundedRect(cardX + 2, validY + 2, cardW, 34, 8, 8, "F");

  doc.setFillColor(...panel);
  doc.roundedRect(cardX, validY, cardW, 34, 8, 8, "F");

  doc.setDrawColor(63, 63, 70);
  doc.setLineWidth(0.3);
  doc.roundedRect(cardX, validY, cardW, 34, 8, 8, "S");

  doc.setFontSize(10);
  doc.setTextColor(...textMuted);
  doc.text("VALID FOR", PAGE_W / 2, validY + 13, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(...white);
  doc.text("Lessons • Equipment • Pro Shop", PAGE_W / 2, validY + 25, {
    align: "center",
  });

  /* ================= FOOTER ================= */

  doc.setDrawColor(39, 39, 42);
  doc.setLineWidth(0.4);
  doc.line(18, 262, PAGE_W - 18, 262);

  const codeDisplay = groupCode(p.id);

  doc.setFontSize(9);
  doc.setTextColor(...textMuted);
  doc.text("VOUCHER CODE", PAGE_W / 2, 277, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(...white);
  doc.text(codeDisplay, PAGE_W / 2, 284, { align: "center" });

  return doc;
}

export function voucherPdfBase64(p: VoucherPdfInput) {
  const doc = buildVoucherPdf(p);
  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer).toString("base64");
}
