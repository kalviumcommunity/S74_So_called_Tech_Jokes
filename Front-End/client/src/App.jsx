import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Joke from "./pages/jokes"; // Ensure the filename matches

function App() {
  const [user, setUser] = useState(localStorage.getItem("token") ? "User" : null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Auth setUser={setUser} />} />
        <Route path="/home" element={user ? <Home setUser={setUser} /> : <Navigate to="/" />} />
        <Route path="/jokes" element={user ? <Joke setUser={setUser} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
