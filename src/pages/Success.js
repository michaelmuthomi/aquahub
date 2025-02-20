import React from "react";
import { useLocation, Link } from "react-router-dom";

const Success = () => {
  // Get the message from the URL query parameter
  const query = new URLSearchParams(useLocation().search);
  const message = query.get("msg") || "Thank you for voting! ✅";

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎉 Success! 🎉</h2>
      <p style={styles.message}>{message}</p>
      <Link to="/" style={styles.button}>🏠 Back to Home</Link>
    </div>
  );
};

// Basic styles
const styles = {
  container: {
    textAlign: "center",
    padding: "50px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "28px",
    color: "#4CAF50",
  },
  message: {
    fontSize: "20px",
    margin: "20px 0",
  },
  button: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "16px",
  },
};

export default Success;
