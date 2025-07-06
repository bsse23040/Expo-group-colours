import './Home.css';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BookSelector from '../components/BookSelector';
import DateSelector from '../components/DateSelector';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedBooks = JSON.parse(localStorage.getItem('checkedBooks')) || [];
    setBooks(storedBooks);
    setStartDate(localStorage.getItem('startDate') || '');
    setEndDate(localStorage.getItem('endDate') || '');
  }, []);

  const handleProceed = () => {
    localStorage.setItem('checkedBooks', JSON.stringify(books));
    localStorage.setItem('startDate', startDate);
    localStorage.setItem('endDate', endDate);
    navigate('/schedule');
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        // Extract dates and books
        const dates = Object.keys(data).sort();
        const firstDate = dates[0];
        const lastDate = dates[dates.length - 1];
        const firstEntry = data[firstDate] || {};
        const booksInFile = Object.keys(firstEntry);

        // Update state
        setBooks(booksInFile);
        setStartDate(firstDate);
        setEndDate(lastDate);

        // Save to localStorage
        localStorage.setItem('checkedBooks', JSON.stringify(booksInFile));
        localStorage.setItem('startDate', firstDate);
        localStorage.setItem('endDate', lastDate);
        localStorage.setItem('scheduleData', JSON.stringify(data));

        navigate('/schedule');
      } catch (err) {
        alert("Invalid JSON file.");
        console.error("Upload error:", err);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="home-container">
      <h1 className="home-heading">📚 Smart Scheduler</h1>
      <div className="home-box">
        <BookSelector books={books} setBooks={setBooks} />
        <DateSelector
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />

        <div className="button-wrap">

        {/* <button  className="proceed-button">
          Proceed to Schedule
        </button> */}

        <button style={{ transform: 'scale(1.1)' }} className="buttonu" onClick={handleProceed} >
          <span className="text_button">Proceed to Schedule</span>
        </button>


        <button style={{ transform: 'scale(1.1)' }} className="buttonu" onClick={handleUploadClick} >
          <span className="text_button">Upload Schedule</span>
        </button>
        </div>

        <input
          type="file"
          accept=".json"
          onChange={handleUpload}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}