// src/components/ScheduleTable.jsx
import React, { useEffect, useState } from 'react';
import './ScheduleTable.css';

export default function ScheduleTable({ books, startDate, endDate, scheduleData, setScheduleData }) {
  const [dates, setDates] = useState([]);
  const [pendingClearBook, setPendingClearBook] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null); // New

  useEffect(() => {
    const generatedDates = getDatesArray(new Date(startDate), new Date(endDate));
    setDates(generatedDates);

    const newSchedule = { ...scheduleData };
    generatedDates.forEach(dateStr => {
      if (!newSchedule[dateStr]) {
        newSchedule[dateStr] = {};
        books.forEach(book => {
          newSchedule[dateStr][book] = "";
        });
      } else {
        books.forEach(book => {
          if (!(book in newSchedule[dateStr])) {
            newSchedule[dateStr][book] = "";
          }
        });
      }
    });

    setScheduleData(newSchedule);
  }, [books, startDate, endDate]);

  const getDatesArray = (start, end) => {
    const arr = [];
    let current = new Date(start);
    while (current <= end) {
      arr.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return arr;
  };

  const getDayName = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", { weekday: 'short' });
  };

  const handleInputChange = (date, book, value) => {
    const updated = { ...scheduleData };
    updated[date][book] = value;
    setScheduleData(updated);
  };

  const handleClearBook = (book) => {
    setPopupMessage(`Click a cell in "${book}" column to start shifting schedule`);
    setPendingClearBook(book);
  };

  const handleSmartClear = (book, startDateInput) => {
    const startIndex = dates.indexOf(startDateInput);
    if (startIndex === -1) return;

    const updated = { ...scheduleData };
    for (let i = dates.length - 1; i > startIndex; i--) {
      updated[dates[i]][book] = updated[dates[i - 1]][book];
    }
    updated[dates[startIndex]][book] = '';
    setScheduleData(updated);

    setPendingClearBook(null);
    setPopupMessage(null);
  };

  const handleDownload = () => {
    const filteredSchedule = {};

    for (const date in scheduleData) {
      filteredSchedule[date] = {};
      books.forEach(book => {
        if (scheduleData[date].hasOwnProperty(book)) {
          filteredSchedule[date][book] = scheduleData[date][book];
        } else {
          filteredSchedule[date][book] = '';
        }
      });
    }

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' }); // "July", "August"
      return `${day}${month}`;
    };

    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);

    const fileName = `Schedule_${books.join(',')}_${formattedStart}_${formattedEnd}.json`;

    const blob = new Blob([JSON.stringify(filteredSchedule, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="schedule-table-container">
      {popupMessage && (
        <div className="popup-message">
          {popupMessage}
        </div>
      )}

      <table className="schedule-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Day</th>
            {books.map(book => (
              <th key={book}>
                {book}
                <button className="clear-btn" onClick={() => handleClearBook(book)}>
                  Clear
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dates.map(date => (
            <tr key={date}>
              <td>{date}</td>
              <td>{getDayName(date)}</td>
              {books.map(book => (
                <td key={book}>
                  <textarea
                    className={pendingClearBook === book ? 'highlight-clear-target' : ''}
                    value={scheduleData[date][book]}
                    onClick={() => {
                      if (pendingClearBook === book) {
                        handleSmartClear(book, date);
                      }
                    }}
                    onChange={(e) => handleInputChange(date, book, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="buttons">
        <button onClick={handleDownload} className="download-btn">📥 Download</button>
      </div>
    </div>
  );
}
