import React, { useState } from "react";

export default function Vote() {
  const [vote, setVote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitVote = () => {
    if (!vote) {
      alert("Please select a candidate.");
      return;
    }
    setSubmitted(true);
    localStorage.setItem("vote", vote); // Simulating vote storage
  };

  return (
    <div className="page">
      <h1>🗳 Cast Your Vote</h1>
      {submitted ? (
        <h2>✅ Your vote has been submitted!</h2>
      ) : (
        <>
          <button onClick={() => setVote("Candidate A")}>Vote Candidate A</button>
          <button onClick={() => setVote("Candidate B")}>Vote Candidate B</button>
          <button onClick={submitVote}>Submit Vote</button>
        </>
      )}
    </div>
  );
}
