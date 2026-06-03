import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8"
];

function RequestPieChart({ data }) {

  return (
    <div className="chart-card">
      <h2>Request Types</h2>

      <PieChart width={500} height={350}>
        <Pie
          data={data}
          dataKey="count"
          nameKey="user_request"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default RequestPieChart;