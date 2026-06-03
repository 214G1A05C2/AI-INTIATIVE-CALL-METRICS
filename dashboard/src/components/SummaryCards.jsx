import React from "react";

function SummaryCards({ summary }) {
  return (
    <div className="cards">

      <div className="card">
        <h3>Total Calls</h3>
        <p>{summary.total_calls || 0}</p>
      </div>

      <div className="card">
        <h3>Appointments</h3>
        <p>{summary.appointment_requests || 0}</p>
      </div>

      <div className="card">
        <h3>Silent Calls</h3>
        <p>{summary.silent_calls || 0}</p>
      </div>

    </div>
  );
}

export default SummaryCards;