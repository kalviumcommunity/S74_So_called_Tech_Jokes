/* eslint-disable react/prop-types */  
const AsapEntity = ({ title = "Default Title", description = "Default Description" }) => {
    return (
      <div className="p-4 border border-gray-300 rounded-lg shadow-lg bg-white w-96 mt-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-gray-700">{description}</p>
      </div>
    );
  };
  
  export default AsapEntity;
  