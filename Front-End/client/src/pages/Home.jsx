import PropTypes from "prop-types";
import "./home.css";
import AsapEntity from "../components/AsapEntity";  
import { useNavigate } from "react-router-dom";

const Home = ({ setUser }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="home-container">
      <button className="logout-btn" onClick={logout}>Logout</button>
      <div className="content">
        <h1>Welcome to ASAP Project</h1>
        <p>Contact: S.Rithik@gmail.com</p>
      </div>

      <AsapEntity 
        title="Sample Entity" 
        description="This is a placeholder entity with dummy data."
      />
    </div>
  );
};

export default Home;
Home.propTypes = {
  setUser: PropTypes.func.isRequired,
};