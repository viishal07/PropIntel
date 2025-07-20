
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Underwrite from './pages/Underwrite';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/underwrite" element={<Underwrite />} />
      </Routes>
    </Router>
  );
}

export default App;
