import {
  RecentTransactionsList,
  TopCustomersList,
} from "@/core/private/Reports/ReportsTypes";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import COMPANY_LOGO_BASE64 from "../assets/loginbg2.png";

interface ReportPDFTypes {
  branchName: string;
  timeInterval: string;
  data: {
    label: string;
    value: string;
  }[];
  topSellingProduct?: {
    name: string;
    soldQuantity: number;
    totalAmount: number;
  }[];
  topCustomers: TopCustomersList[];
  recentTransactions?: RecentTransactionsList[];
}

function getWeekRange(date: Date): string {
  const current = new Date(date);

  const day = current.getDay(); // 0 (Sunday) - 6 (Saturday)
  const sunday = new Date(current);
  sunday.setDate(current.getDate() - day); // Back to Sunday

  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6); // Forward to Saturday

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  return `${sunday.toLocaleDateString(
    "en-GB",
    options
  )} - ${saturday.toLocaleDateString("en-GB", options)}`;
}

export const generateReportPDF = ({
  branchName,
  timeInterval,
  data,
  topSellingProduct,
  topCustomers,
  recentTransactions,
}: ReportPDFTypes) => {
  const doc = new jsPDF();

  // ==== Letterhead ====
  // Add logo
  const logoWidth = 30;
  const logoHeight = 30;
  doc.addImage(COMPANY_LOGO_BASE64, "PNG", 14, 10, logoWidth, logoHeight);

  const now = new Date();

  let finalTimeInterval = "";

  if (timeInterval === "WEEKLY") {
    finalTimeInterval = `${getWeekRange(now)}`;
  } else if (timeInterval === "MONTHLY") {
    finalTimeInterval = now.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  } else if (timeInterval === "DAILY") {
    finalTimeInterval = `${now.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  } else {
    finalTimeInterval = timeInterval;
  }

  const pageWidth = doc.internal.pageSize.getWidth();

  // Company name
  const companyName = "PharmaBill Pvt. Ltd.";
  const companyTextWidth = doc.getTextWidth(companyName);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(companyName, (pageWidth - companyTextWidth) / 2, 20);

  // Branch and Time Info
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`${finalTimeInterval} Report of ${branchName}`, 60, 28);

  // Generated date on right
  const generatedText = `${new Date().toLocaleDateString("en-GB")}`;
  const textWidth = doc.getTextWidth(generatedText);
  doc.text("Date:-", pageWidth - textWidth - 10, 20);
  doc.text(generatedText, pageWidth - textWidth - 14, 25);

  // Report Header Data
  let currentY = 55;

  data.forEach((item) => {
    doc.text(`${item.label}: ${item.value}`, 14, currentY);
    doc.setFontSize(10);
    doc.setTextColor(100);
    // doc.text(`Note: ${item.note}`, 14, currentY + 6);
    doc.setTextColor(0);
    doc.setFontSize(12);
    currentY += 10;
  });

  // Table 1
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Top Selling Products:", 14, currentY + 5);
  autoTable(doc, {
    startY: currentY + 10,
    head: [["S.No", "Name", "Sold Quantity", "Total Amount"]],
    body: topSellingProduct?.map((item, index) => [
      index + 1,
      item.name,
      item.soldQuantity,
      `NPR ${item.totalAmount.toFixed(2)}` || "-",
    ]),
    theme: "grid",
  });

  // Table 2
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");

  doc.text("Top Customers:", 14, (doc as any).lastAutoTable.finalY + 10);
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 15,
    head: [["S.No", "Name", "Total Visit", "Total Amount"]],
    body: topCustomers?.map((item, index) => [
      index + 1,
      item.fullName,
      item.totalVisit,
      `NPR ${item.totalAmount.toFixed(2)}` || "-",
    ]),
    theme: "grid",
  });

  // Table 3
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");

  doc.text("Recent Transactions:", 14, (doc as any).lastAutoTable.finalY + 10);
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 15,
    head: [
      [
        "S.No",
        "Patient Name",
        "Product Name",
        "Item Count",
        "VAT",
        "Total Amount",
        "Date",
        "TransactionId",
      ],
    ],
    body: recentTransactions?.map((item, index) => [
      index + 1,
      item.patientName,
      item.productNames,
      item.itemsCount,
      item.vat,
      `NPR ${item.amount}` || "-",
      item.date,
      item.transactionId,
    ]),
    theme: "grid",
  });

  // Add page numbers after all tables
  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() - 40,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  doc.save(`Report_${branchName}_${timeInterval}.pdf`);
};
