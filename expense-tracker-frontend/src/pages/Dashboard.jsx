import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register the necessary Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

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
      setExpenses((prev) => prev.filter((expense) => expense._id !== id));
      alert("Expense deleted successfully!");
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert(error.response?.data?.message || "Error deleting expense.");
    }
  };

  // Prepare data for Pie chart
  const pieData = {
    labels: expenses.map((expense) => expense.title),
    datasets: [
      {
        label: "Expense Distribution",
        data: expenses.map((expense) => expense.amount),
        backgroundColor: [
          "#FF5733",
          "#33FF57",
          "#3357FF",
          "#F1C40F",
          "#8E44AD",
          "#E74C3C",
        ],
      },
    ],
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>

      {loading ? (
        <div style={{ textAlign: "center" }}>Loading...</div>
      ) : expenses.length === 0 ? (
        <p style={{ textAlign: "center", fontStyle: "italic" }}>No expenses added yet.</p>
      ) : (
        <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start", gap: "20px" }}>
          {/* Expense List on the Left */}
          <div style={{
            flexGrow: 1,
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            maxHeight: "calc(100vh - 150px)",
            overflowY: "auto",
          }}>
            {expenses.map((expense) => (
              <div
                key={expense._id}
                style={{
                  padding: "20px",
                  marginBottom: "15px",
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>{expense.title}</h3>
                <p style={{ margin: "5px 0", color: "#555" }}>Amount: ${expense.amount}</p>
                <p style={{ margin: "5px 0", color: "#555" }}>
                  Date: {new Date(expense.date).toLocaleDateString()}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                  <Link
                    to={`/update-expense/${expense._id}`}
                    style={{
                      backgroundColor: "#ffbb33",
                      color: "#fff",
                      padding: "5px 15px",
                      borderRadius: "5px",
                      textDecoration: "none",
                    }}
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteExpense(expense._id)}
                    style={{
                      backgroundColor: "#e74c3c",
                      color: "#fff",
                      padding: "5px 15px",
                      borderRadius: "5px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <Link
          to="/add-expense"
          style={{
            backgroundColor: "#28a745",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "5px",
            textDecoration: "none",
          }}
        >
          ➕ Add New Expense
        </Link>
      </div>
          </div>
          

          {/* Pie Chart on the Right */}
          <div style={{
            width: "550px",
            padding: "15px",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            flexShrink: 0,
          }}>
            <h3 style={{ textAlign: "center", marginBottom: "15px" }}>Expense Chart</h3>
            <Pie data={pieData} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
