import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

const Logout = () => {
  const [showModal, setShowModal] = useState(true); // Show modal on page load
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the JWT token
    localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div style={styles.buttonContainer}>
              <button style={styles.cancelButton} onClick={() => navigate(-1)}>Cancel</button>
              <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles for the modal and page
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
  },
  buttonContainer: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "space-around",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Logout;
