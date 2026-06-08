import React from "react";

function DataTable({ filteredCalls }) {
  return (
    <div className="chartCard">
      <h2 className="chartTitle">Call Records</h2>

      <table className="dataTable">
        <thead>
          <tr>
            <th>Clinic</th>
            <th>Request</th>
            <th>Month</th>
          </tr>
        </thead>

        <tbody>
          {filteredCalls.map((item, index) => (
            <tr key={index}>
              <td>{item.clinic_name}</td>
              <td>{item.user_request}</td>
              <td>{item.month_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;