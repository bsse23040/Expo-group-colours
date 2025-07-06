import React from 'react';
import './DateSelector.css';

export default function DateSelector({ startDate, endDate, setStartDate, setEndDate }) {
  return (
    <div className="date-selector-container">
      <h2 className="date-selector-title">📆 Select Dates</h2>
      <div className="date-picker-row">
        <div className="date-picker-group">
          <label className="date-label">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
          />
        </div>
        <div className="date-picker-group">
          <label className="date-label">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-input"
          />
        </div>
      </div>
    </div>
  );
}
