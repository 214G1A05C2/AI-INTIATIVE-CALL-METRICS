import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Label,
} from "recharts";

import html2canvas from "html2canvas";

import jsPDF from "jspdf"
// =========================================
// COLORS
// =========================================

const PIE_COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#06B6D4",
  "#14B8A6",
  "#6366F1",
  "#0EA5E9",
  "#22C55E",
  "#F97316",
];

const BAR_COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#06B6D4",
  "#14B8A6",
  "#6366F1",
];

// =========================================
// APP
// =========================================

function App() {
  const [calls, setCalls] = useState([]);

  const [selectedClinic, setSelectedClinic] =
    useState("All Clinics");

  const [selectedMonth, setSelectedMonth] =
    useState("All Months");

  // =========================================
  // FETCH DATA
  // =========================================

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/call-metrics"
      );

      if (Array.isArray(response.data)) {
        setCalls(response.data);
      } else {
        setCalls([]);
      }
    } catch (error) {
      console.log(error);
      setCalls([]);
    }
  };

  // =========================================
  // FILTER DATA
  // =========================================

  const filteredCalls = calls.filter((item) => {
    const clinicMatch =
      selectedClinic === "All Clinics" ||
      item.clinic_name === selectedClinic;

    const month =
      item.month_name
        ? new Date(
            item.month_name
          ).toLocaleString("default", {
            month: "short",
          })
        : "";

    const monthMatch =
      selectedMonth === "All Months" ||
      month === selectedMonth;

    return clinicMatch && monthMatch;
  });

  // =========================================
  // KPI CALCULATIONS
  // =========================================

  const totalCalls = filteredCalls.length;

  const appointmentsHandled =
    filteredCalls.filter(
      (item) =>
        item.user_request ===
        "Schedule Appointment"
    ).length;

  const frontDeskCalls =
    filteredCalls.filter(
      (item) =>
        item.user_request ===
        "Front Desk Request"
    ).length;

  const silentCalls = filteredCalls.filter(
    (item) =>
      item.user_request ===
      "No User Request (Silent Call)"
  ).length;

  // =========================================
  // PIE DATA
  // =========================================

  const requestMap = {};

  filteredCalls.forEach((item) => {
    const request = item.user_request;

    requestMap[request] =
      (requestMap[request] || 0) + 1;
  });

  const pieData = Object.keys(requestMap).map(
    (key) => ({
      name: key,
      value: requestMap[key],
    })
  );

  // =========================================
  // CLINIC BAR DATA
  // =========================================

  const clinicMap = {};

  filteredCalls.forEach((item) => {
    const clinic = item.clinic_name;

    clinicMap[clinic] =
      (clinicMap[clinic] || 0) + 1;
  });

  let clinicData = Object.keys(clinicMap).map(
    (key) => ({
      clinic:
        key.length > 14
          ? key.substring(0, 14) + "..."
          : key,
      calls: clinicMap[key],
    })
  );

  // REMOVE HUGE EXTENSION
  clinicData = clinicData
    .sort((a, b) => b.calls - a.calls)
    .slice(0, 6);

  // =========================================
  // MONTH DATA
  // =========================================

  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthMap = {};

  filteredCalls.forEach((item) => {
    const month =
      item.month_name
        ? new Date(
            item.month_name
          ).toLocaleString("default", {
            month: "short",
          })
        : "";

    monthMap[month] =
      (monthMap[month] || 0) + 1;
  });

  const monthData = monthOrder.map((month) => ({
  month,
  calls: monthMap[month] || 0,
}));

  // =========================================
  // DROPDOWNS
  // =========================================

  const clinics = [
    "All Clinics",
    ...new Set(
      calls.map((item) => item.clinic_name)
    ),
  ];

  const months = [
  "All Months",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

  // =========================================
  // EXPORT PDF
  // =========================================

  const exportPDF = async () => {
  try {
    const dashboard = document.getElementById(
      "dashboard-content"
    );

    if (!dashboard) {
      alert("Dashboard not found");
      return;
    }

    const canvas = await html2canvas(
      dashboard,
      {
        scale: 2,
        useCORS: true,
        backgroundColor: "#F1F5F9",
        scrollY: -window.scrollY,
      }
    );

    const imgData =
      canvas.toDataURL("image/png");

    const pdf = new jsPDF(
      "p",
      "mm",
      "a4"
    );

    const pageWidth = 210;
    const pageHeight = 297;

    const imgWidth = pageWidth;
    const imgHeight =
      (canvas.height * imgWidth) /
      canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pageHeight;
    }

    pdf.save(
      "AI_Voice_Agent_Dashboard.pdf"
    );
  } catch (error) {
    console.error(error);
    alert("Error generating PDF");
  }
};

  // =========================================
  // LOADING
  // =========================================

  if (!calls.length) {
    return (
      <div style={styles.loading}>
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div
  id="dashboard-content"
  style={styles.page}
>

      <div style={styles.header}>
        <h1 style={styles.title}>
          Initiative 1 - AI Voice Agent
          Metrics
        </h1>

        <div style={styles.filterContainer}>
          <select
            value={selectedClinic}
            onChange={(e) =>
              setSelectedClinic(e.target.value)
            }
            style={styles.select}
          >
            {clinics.map((clinic, index) => (
              <option key={index}>
                {clinic}
              </option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(e.target.value)
            }
            style={styles.select}
          >
            {months.map((month, index) => (
              <option key={index}>
                {month}
              </option>
            ))}
          </select>

          <button
            onClick={exportPDF}
            style={styles.button}
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* KPI CARDS */}

      <div style={styles.cardGrid}>
        <div
          style={{
            ...styles.card,
            background:
              "linear-gradient(135deg,#2563EB,#3B82F6)",
          }}
        >
          <h3 style={styles.cardTitle}>
            Total Calls
          </h3>
          <h1 style={styles.cardValue}>
            {totalCalls}
          </h1>
        </div>

        <div
          style={{
            ...styles.card,
            background:
              "linear-gradient(135deg,#10B981,#34D399)",
          }}
        >
          <h3 style={styles.cardTitle}>
            Appointments
          </h3>
          <h1 style={styles.cardValue}>
            {appointmentsHandled}
          </h1>
        </div>

        <div
          style={{
            ...styles.card,
            background:
              "linear-gradient(135deg,#F59E0B,#FBBF24)",
          }}
        >
          <h3 style={styles.cardTitle}>
            Front Desk Calls
          </h3>
          <h1 style={styles.cardValue}>
            {frontDeskCalls}
          </h1>
        </div>

        <div
          style={{
            ...styles.card,
            background:
              "linear-gradient(135deg,#8B5CF6,#A78BFA)",
          }}
        >
          <h3 style={styles.cardTitle}>
            Silent Calls
          </h3>
          <h1 style={styles.cardValue}>
            {silentCalls}
          </h1>
        </div>
      </div>

      {/* TOP CHARTS */}

      <div style={styles.chartGrid}>
        {/* PIE CHART */}

        <div style={styles.chartCard}>
          <h2 style={styles.chartTitle}>
            Calls by Request Type
          </h2>

          <ResponsiveContainer
            width="100%"
            height={430}
          >
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={120}
                label={{
                  fontSize: 13,
                  fontWeight: "bold",
                }}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      PIE_COLORS[
                        index % PIE_COLORS.length
                      ]
                    }
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend
                wrapperStyle={{
                  fontSize: "13px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* CLINIC BAR CHART */}

        <div style={styles.chartCard}>
          <h2 style={styles.chartTitle}>
            Calls by Clinic
          </h2>

          <ResponsiveContainer
            width="100%"
            height={430}
          >
            <BarChart
              data={clinicData}
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="clinic"
                tick={{
                  fontSize: 12,
                  fontWeight: 600,
                }}
                angle={-10}
                textAnchor="end"
                interval={0}
              >
                <Label
                  value="Clinics"
                  offset={-40}
                  position="insideBottom"
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                />
              </XAxis>

              <YAxis
                tick={{
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                <Label
                  value="Number of Calls"
                  angle={-90}
                  position="insideLeft"
                  style={{
                    textAnchor: "middle",
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                />
              </YAxis>

              <Tooltip />

              <Bar
                dataKey="calls"
                radius={[10, 10, 0, 0]}
                maxBarSize={60}
              >
                {clinicData.map(
                  (entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        BAR_COLORS[
                          index %
                            BAR_COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MONTH CHART */}

      <div style={styles.monthCard}>
        <h2 style={styles.chartTitle}>
          Monthly Requests
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart
            data={monthData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 50,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="month"
              tick={{
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <Label
                value="Months"
                offset={-35}
                position="insideBottom"
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              />
            </XAxis>

            <YAxis
              tick={{
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <Label
                value="Number of Requests"
                angle={-90}
                position="insideLeft"
                style={{
                  textAnchor: "middle",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              />
            </YAxis>

            <Tooltip />

            <Bar
              dataKey="calls"
              fill="#2563EB"
              radius={[10, 10, 0, 0]}
              maxBarSize={45}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER */}

      <div style={styles.footer}>
        © 2026 EzMedTech | AI Voice Agent
        Dashboard
      </div>
    </div>
  );
}

// =========================================
// STYLES
// =========================================

const styles = {
  page: {
    padding: "20px",
    background: "#F1F5F9",
    minHeight: "100vh",
    fontFamily: "Arial",
  },

  loading: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "30px",
    fontWeight: "bold",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "20px",
  },

  title: {
    fontSize: "38px",
    fontWeight: "bold",
    color: "#0F172A",
  },

  filterContainer: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  select: {
    padding: "12px 18px",
    borderRadius: "12px",
    border: "1px solid #CBD5E1",
    fontSize: "15px",
    fontWeight: "600",
    background: "white",
    minWidth: "160px",
    cursor: "pointer",
  },

  button: {
    padding: "12px 22px",
    borderRadius: "12px",
    border: "none",
    background: "#2563EB",
    color: "white",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    padding: "30px",
    borderRadius: "22px",
    color: "white",
    boxShadow:
      "0 10px 20px rgba(0,0,0,0.12)",
  },

  cardTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "10px",
  },

  cardValue: {
    fontSize: "42px",
    fontWeight: "bold",
  },

  chartGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "25px",
    marginBottom: "30px",
  },

  chartCard: {
    background: "white",
    padding: "25px",
    borderRadius: "22px",
    boxShadow:
      "0 6px 16px rgba(0,0,0,0.08)",
  },

  monthCard: {
    width: "60%",
    margin: "0 auto",
    background: "white",
    padding: "25px",
    borderRadius: "22px",
    boxShadow:
      "0 6px 16px rgba(0,0,0,0.08)",
  },

  chartTitle: {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: "15px",
  },

  footer: {
    marginTop: "25px",
    textAlign: "center",
    fontWeight: "bold",
    color: "#1E3A8A",
    fontSize: "15px",
  },
};

export default App;