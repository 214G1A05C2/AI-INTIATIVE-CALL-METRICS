import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import theme from "../theme";

const formatMonth = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("default", { month: "short" });
};

const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
};

const countBy = (items, getter) => {
  const map = {};
  items.forEach((item) => {
    const key = getter(item) || "Unknown";
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
};

const addSectionHeader = (doc, title, subtitle) => {
  const x = 14;
  const y = doc.lastAutoTable
    ? doc.lastAutoTable.finalY + 14
    : 52;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(x, y, 182, 10, 3, 3, "F");
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(title, x + 4, y + 6.8);

  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(subtitle, x + 4, y + 14);
  }
};

const addKpiCard = (doc, { x, y, w, title, value, accent }) => {
  const fill = accent.fill;
  const text = accent.text;

  doc.setFillColor(fill[0], fill[1], fill[2]);
  doc.setDrawColor(255, 255, 255);
  doc.roundedRect(x, y, w, 26, 4, 4, "F");

  doc.setTextColor(text[0], text[1], text[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(title, x + 4, y + 7);

  doc.setFontSize(15);
  doc.text(String(value), x + 4, y + 18);
};

export const exportPDF = ({
  calls = [],
  filteredCalls = [],
  selectedClinic = "All Clinics",
  selectedMonth = "All Months",
  totalCalls = 0,
  appointmentsHandled = 0,
  frontDeskCalls = 0,
  silentCalls = 0,
} = {}) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  const requestCounts = countBy(
    filteredCalls,
    (item) => item.primary_intent
  );
  const clinicCounts = countBy(
    filteredCalls,
    (item) => item.clinic_name
  );
  const monthCounts = countBy(
    filteredCalls,
    (item) => formatMonth(item.created_at)
  );

  // Header
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 34, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("AI Voice Agent Metrics Report", 14, 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Operational summary generated from the current dashboard data", 14, 21);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

  doc.setFont("helvetica", "bold");
  doc.text(`Clinic: ${selectedClinic}`, 125, 13);
  doc.text(`Month: ${selectedMonth}`, 125, 21);
  doc.text(`Records: ${filteredCalls.length}`, 125, 28);

  // KPI row
  addKpiCard(doc, {
    x: 14,
    y: 42,
    w: 42,
    title: "Total Calls",
    value: totalCalls,
    accent: { fill: [219, 234, 254], text: [30, 64, 175] },
  });
  addKpiCard(doc, {
    x: 59,
    y: 42,
    w: 42,
    title: "Appointments",
    value: appointmentsHandled,
    accent: { fill: [209, 250, 229], text: [6, 95, 70] },
  });
  addKpiCard(doc, {
    x: 104,
    y: 42,
    w: 42,
    title: "Front Desk",
    value: frontDeskCalls,
    accent: { fill: [254, 243, 199], text: [146, 64, 14] },
  });
  addKpiCard(doc, {
    x: 149,
    y: 42,
    w: 47,
    title: "Silent Calls",
    value: silentCalls,
    accent: { fill: [237, 233, 254], text: [91, 33, 182] },
  });

  // Summary tables
  addSectionHeader(doc, "Request Type Summary", "Breakdown of the selected records by request type");
  autoTable(doc, {
    startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 62,
    head: [["Request Type", "Count", "Share"]],
    body: requestCounts.map((row) => [
      row.label,
      row.value,
      `${((row.value / Math.max(filteredCalls.length, 1)) * 100).toFixed(1)}%`,
    ]),
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 3,
      textColor: theme.colors.text,
      lineColor: [226, 232, 240],
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  addSectionHeader(doc, "Clinic Summary", "Calls grouped by clinic");
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Clinic", "Count"]],
    body: clinicCounts.map((row) => [row.label, row.value]),
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 3,
      textColor: theme.colors.text,
      lineColor: [226, 232, 240],
    },
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  addSectionHeader(doc, "Monthly Summary", "Calls grouped by month");
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Month", "Count"]],
    body: monthCounts.map((row) => [row.label, row.value]),
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 3,
      textColor: theme.colors.text,
      lineColor: [226, 232, 240],
    },
    headStyles: {
      fillColor: [139, 92, 246],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  // Detail section
  addSectionHeader(doc, "Call Detail Report", "Individual records from the selected dashboard view");
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Call ID", "Clinic", "Request", "Created At", "Outcome"]],
    body: filteredCalls.map((item) => [
      item.call_id ?? "",
      item.clinic_name ?? "",
      item.primary_intent ?? "",
      formatDateTime(item.created_at),
      item.final_output ?? "",
    ]),
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 2.5,
      textColor: theme.colors.text,
      lineColor: [226, 232, 240],
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14, bottom: 12 },
  });

  doc.save("dashboard-report.pdf");
};
