import React from "react";

export default function Admin() {
  const votes = localStorage.getItem("vote") || "No votes yet";

  return (
    <div className="page">
      <h1>📊 Admin Dashboard</h1>
      <p>Latest vote: {votes}</p>
    </div>
  );
}
