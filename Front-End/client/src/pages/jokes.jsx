import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import "./jokes.css";
import { useNavigate } from "react-router-dom";

function Jokes({ setUser }) {
  const [jokes, setJokes] = useState([]);
  const [newJoke, setNewJoke] = useState("");
  const [randomJoke, setRandomJoke] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(""); // Store selected user
  const navigate = useNavigate();

  // Fetch users for dropdown
  useEffect(() => {
    axios.get("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // Fetch jokes (filtered by user if selected)
  useEffect(() => {
    const fetchJokes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/jokes", {
          params: selectedUser ? { userId: selectedUser } : {},
        });
        setJokes(res.data);
      } catch (error) {
        console.error("Error fetching jokes:", error);
      }
    };
    fetchJokes();
  }, [selectedUser]); // Re-fetch when selectedUser changes

  // Fetch a random joke (Filtered by user if selected)
  const fetchRandomJoke = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/jokes", {
        params: selectedUser ? { userId: selectedUser } : {},
      });
      if (res.data.length === 0) return setRandomJoke("No jokes available!");
      const randomJoke = res.data[Math.floor(Math.random() * res.data.length)];
      setRandomJoke(randomJoke.text);
    } catch (error) {
      console.error("Error fetching random joke:", error);
    }
  };

  // Add a new joke
  const addJoke = async () => {
    if (!newJoke.trim()) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/jokes",
        { text: newJoke },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setJokes([...jokes, res.data]); // Add new joke to the list
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

        {/* User Dropdown */}
        <label>Select User:</label>
        <select onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser}>
          <option value="">All Users</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>{user.username}</option>
          ))}
        </select>

        {/* Random Joke Section */}
        <button className="random-btn" onClick={fetchRandomJoke}>Get Random Joke</button>
        {randomJoke && <p className="random-joke">{randomJoke}</p>}

        {/* Jokes List */}
        <h2>Jokes</h2>
        <ul>
          {jokes.map((joke) => (
            <li key={joke._id}>{joke.text} - <i>by {joke.created_by?.username || "Unknown"}</i></li>
          ))}
        </ul>

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
