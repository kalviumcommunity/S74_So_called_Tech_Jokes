import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import "./jokes.css";
import { useNavigate } from "react-router-dom";

function Jokes({ setUser }) {
  const [jokes, setJokes] = useState([]);
  const [newJoke, setNewJoke] = useState("");
  const [randomJoke, setRandomJoke] = useState("");
  const navigate = useNavigate();

  // Fetch all jokes on load
  useEffect(() => {
    axios.get("http://localhost:5000/api/jokes", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => setJokes(res.data))
    .catch((err) => console.error("Error fetching jokes:", err));
  }, []);

  // Fetch a random joke
  const fetchRandomJoke = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/jokes/random");
      setRandomJoke(res.data.text);
    } catch (error) {
      console.error("Error fetching random joke:", error);
    }
  };

  // Add a new joke
  const addJoke = async () => {
    if (!newJoke.trim()) return;
    try {
      const res = await axios.post("http://localhost:5000/api/jokes",
        { text: newJoke },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setJokes([...jokes, res.data]);
      setNewJoke("");
    } catch (error) {
      console.error("Error adding joke:", error);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="app">
      <button className="logout-btn" onClick={logout}>Logout</button>

      <div className="container">
        <h1>😂 Tech Joke Generator</h1>

        {/* Random Joke Section */}
        <button className="random-btn" onClick={fetchRandomJoke}>Get Random Joke</button>
        {randomJoke && <p className="random-joke">{randomJoke}</p>}

        {/* Add New Joke Section */}
        <h2>Add Your Own Joke</h2>
        <div className="input-container">
          <input
            type="text"
            value={newJoke}
            onChange={(e) => setNewJoke(e.target.value)}
            placeholder="Enter a funny tech joke"
          />
          <button onClick={addJoke}>Add Joke</button>
        </div>
      </div>
    </div>
  );
}

export default Jokes;

Jokes.propTypes = {
  setUser: PropTypes.func.isRequired,
};
