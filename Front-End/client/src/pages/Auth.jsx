import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
import "./Auth.css";
import { useNavigate } from "react-router-dom";

function Auth({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (endpoint) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, { username, password });
      localStorage.setItem("token", res.data.token);
      setUser("User");
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login / Register</h2>
      {error && <p className="error">{error}</p>}
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => handleAuth("login")}>Login</button>
      <button onClick={() => handleAuth("register")}>Register</button>
    </div>
  );
}

export default Auth;
Auth.propTypes = {
  setUser: PropTypes.func.isRequired,
};