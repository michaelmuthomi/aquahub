import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import supabase from "../supabaseClient";

const Scanned = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const qrCodeId = query.get("id");

  useEffect(() => {
    const updateScanStatus = async () => {
      if (qrCodeId) {
        const { error } = await supabase
          .from("qr_scans")
          .update({ is_scanned: true, scanned_at: new Date() })
          .eq("qr_code_id", qrCodeId);

        if (error) {
          console.error("Error updating scan status:", error);
        } else {
          setTimeout(() => navigate("/vote"), 2000); // Redirect to vote after 2 seconds
        }
      }
    };

    updateScanStatus();
  }, [qrCodeId, navigate]);

  return (
    <div>
      <h2>✅ QR Code Scanned Successfully</h2>
      <p>Redirecting to the voting page...</p>
    </div>
  );
};

export default Scanned;
