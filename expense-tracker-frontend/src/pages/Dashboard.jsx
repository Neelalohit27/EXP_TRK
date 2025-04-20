// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(response.data);
      } catch (error) {
        console.error("Failed to fetch expenses", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [navigate]);

  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
  
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(prev => prev.filter(expense => expense._id !== id));
      alert("Expense deleted successfully!");
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert(error.response?.data?.message || "Error deleting expense.");
    }
  };
  
  

  return (
    <div className="dashboard-wrapper">
      <h2 className="dashboard-heading">Dashboard</h2>

      <div className="dashboard-add-btn-container">
        <Link to="/add-expense" className="dashboard-add-btn">
          ➕ Add New Expense
        </Link>
      </div>

      {loading ? (
        <div className="dashboard-loading">Loading...</div>
      ) : expenses.length === 0 ? (
        <p className="dashboard-no-expense">No expenses added yet.</p>
      ) : (
        <div className="dashboard-expense-list">
          {expenses.map((expense) => (
            <div key={expense._id} className="dashboard-expense-card">
              <h3 className="dashboard-expense-title">{expense.title}</h3>
              <p className="dashboard-expense-amount">
                Amount: ${expense.amount}
              </p>
              <p className="dashboard-expense-date">
                Date: {new Date(expense.date).toLocaleDateString()}
              </p>
              <div className="dashboard-expense-actions">
                <Link
                  to={`/update-expense/${expense._id}`}
                  className="dashboard-edit-btn"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => handleDeleteExpense(expense._id)}
                  className="dashboard-delete-btn"
                >
                🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
