import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import supabase from "../supabaseClient";

const Vote = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const qrCodeId = query.get("id"); // Get QR Code ID from URL

  const handleVote = async () => {
    if (!qrCodeId) return;

    const { error } = await supabase
      .from("qr_scans")
      .update({ has_voted: true })
      .eq("qr_code_id", qrCodeId);

    if (error) {
      console.error("Error updating vote status:", error);
    } else {
      navigate("/success"); // Redirect voter to success page
    }
  };

  return (
    <div>
      <h2>Cast Your Vote</h2>
      <button onClick={handleVote}>Submit Vote</button>
    </div>
  );
};

export default Vote;
