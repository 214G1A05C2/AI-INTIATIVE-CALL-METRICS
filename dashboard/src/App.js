import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Label
} from "recharts";
import SummaryCards from "./components/SummaryCards";
import API from "./services/api";
import RequestPieChart from "./components/RequestPieChart";
import "./App.css";
import styles from "./styles";
import { exportPDF } from "./utils/exportPDF";
import theme from "./theme";
// =========================================
// COLORS
// =========================================

// =========================================
// APP
// =========================================

function App() {
  const [calls, setCalls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [selectedClinic, setSelectedClinic] =
    useState("All Clinics");

  const [selectedMonth, setSelectedMonth] =
    useState("All Months");

  // =========================================
  // FETCH DATA
  // =========================================
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setLoadError("");

      try {
        const response = await API.get("/api/call-metrics");

        if (!isMounted) return;

        if (Array.isArray(response.data)) {
          setCalls(response.data);
        } else {
          setCalls([]);
        }
      } catch (error) {
        if (!isMounted) return;

        console.error(error);
        setCalls([]);
        setLoadError(
          error?.response?.status
            ? `The API returned ${error.response.status}. The dashboard can still open, but the data source is failing right now.`
            : "The dashboard could not reach the API."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================================
  // FILTER DATA
  // =========================================

  const filteredCalls = calls.filter((item) => {
    const clinicMatch =
      selectedClinic === "All Clinics" ||
      item.clinic_name === selectedClinic;

    const month =
  item.created_at
    ? new Date(
        item.created_at
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

  const appointmentsHandled = filteredCalls.filter(
  (item) =>
    item.primary_intent === "schedule_appointment"
).length;

const frontDeskCalls = filteredCalls.filter(
  (item) =>
    item.primary_intent === "front_desk_request"
).length;

const silentCalls = filteredCalls.filter(
  (item) =>
    String(item.blocker_data || "")
      .toLowerCase()
      .includes("silent") ||
    String(item.final_output || "")
      .toLowerCase()
      .includes("silent")
).length;
  // =========================================
  // PIE DATA
  // =========================================

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
  key.length > 25
    ? key.substring(0, 25) + "..."
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
  if (!item.created_at) return;

  const month = new Date(
    item.created_at
  ).toLocaleString("default", {
    month: "short",
  });

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
  // =========================================
  // LOADING
  // =========================================

  if (isLoading) {
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
          AI Voice Agent
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
            onClick={() =>
              exportPDF({
                calls,
                filteredCalls,
                selectedClinic,
                selectedMonth,
                totalCalls,
                appointmentsHandled,
                frontDeskCalls,
                silentCalls,
              })
            }
            style={styles.button}
          >
            Export PDF
          </button>
        </div>
      </div>

      {loadError ? (
        <div style={styles.errorBanner}>
          <div>
            <div style={styles.errorTitle}>Data source unavailable</div>
            <div style={styles.errorText}>{loadError}</div>
          </div>
          <button
            onClick={() => window.location.reload()}
            style={styles.retryButton}
          >
            Retry
          </button>
        </div>
      ) : null}

      {/* KPI CARDS */}

     <SummaryCards
  totalCalls={totalCalls}
  appointments={appointmentsHandled}
  frontDeskCalls={frontDeskCalls}
  silentCalls={silentCalls}
/>
      {/* TOP CHARTS */}

      <div style={styles.chartGrid}>
        {/* PIE CHART */}

        <RequestPieChart
  filteredCalls={filteredCalls}
/>
        {/* CLINIC BAR CHART */}

        <div style={styles.chartCard}>
          <h2 style={styles.chartTitle}>
            Calls by Clinic
          </h2>

          <ResponsiveContainer
            width="100%"
            height={500}
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
                angle={-20}
textAnchor="end"
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
                        theme.chartColors[
                          index %
                            theme.chartColors.length
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
export default App;
