import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const PIE_COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#06B6D4",
  "#14B8A6",
];

function RequestPieChart({ pieData }) {
  return (
    <div className="chartCard">
      <h2 className="chartTitle">Calls by Request Type</h2>

      <ResponsiveContainer width="100%" height={430}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={120}
          >
            {pieData.map((entry, index) => (
              <Cell
                key={index}
                fill={PIE_COLORS[index % PIE_COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RequestPieChart;