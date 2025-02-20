import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import Vote from "./pages/Vote";
import Admin from "./pages/Admin";
import Success from "./pages/Success";
import Scanned from "./pages/Scanned";

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <nav>
          <Link to="/">🏠 Home</Link> | <Link to="/vote">🗳 Vote</Link> |{" "}
          <Link to="/admin">📊 Admin</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vote" element={<Vote />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/success" element={<Success />} />
          <Route path="/scanned" element={<Scanned />} />
        </Routes>
      </div>
    </Router>
  );
}
