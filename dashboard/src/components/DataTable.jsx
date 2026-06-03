import React from "react";

function DataTable({ data }) {
  return (
    <div className="table-container">

      <h2>Call Metrics</h2>

      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Clinic</th>
            <th>User Request</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.month_name}</td>
              <td>{row.clinic_name}</td>
              <td>{row.user_request}</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default DataTable;