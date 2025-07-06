import React from "react";
import './App.css';

import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<Schedule />} />
      </Routes>
    </Router>
  );
}

