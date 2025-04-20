import { Link, useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          Expense Tracker
        </Link>
        <div className="navbar-links">
          {!localStorage.getItem("token") ? (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="navbar-link">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="navbar-logout">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
