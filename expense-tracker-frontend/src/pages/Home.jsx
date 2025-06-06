// src/pages/Home.jsx
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to Expense Tracker</h1>
      <p className="text-lg text-gray-700 mb-6">Track your expenses easily with our app</p>
      <div className="flex space-x-4">
        <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Login
        </Link>
        <Link to="/register" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Register
        </Link>
      </div>
    </div>
  );
}

export default Home;
