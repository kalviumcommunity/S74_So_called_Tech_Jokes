import "./home.css";
import AsapEntity from "../components/AsapEntity";  // Import the component

const Home = () => {
  return (
    <div className="home-container">
      <div className="content">
        <h1>Welcome to ASAP Project</h1>
        <p>Contact: S.Rithik@gmail.com</p>
      </div>

      {/* Render the AsapEntity Component with Dummy Data */}
      <AsapEntity 
        title="Sample Entity" 
        description="This is a placeholder entity with dummy data."
      />
    </div>
  );
};

export default Home;
