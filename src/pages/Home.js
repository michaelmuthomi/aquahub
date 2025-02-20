import React, { useState } from "react";
import QRCodeGenerator from "../components/QRCodeGenerator";

export default function Home() {
  const [voterId, setVoterId] = useState("");
  const [qrCode, setQrCode] = useState("");

  const generateQRCode = () => {
    if (!voterId.trim()) {
      alert("Please enter a valid Voter ID.");
      return;
    }
    setQrCode(`vote-${voterId}`);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const subscription = supabase
      .channel("qr_scans")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "qr_scans" },
        (payload) => {
          if (payload.new.has_voted) {
            navigate("/success"); // Redirect all connected clients to success page
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [navigate]);
  
  return (
    <div className="page">
      <h1>Secure Voting System</h1>
      <input
        type="text"
        placeholder="Enter Voter ID"
        value={voterId}
        onChange={(e) => setVoterId(e.target.value)}
      />
      <button onClick={generateQRCode}>Generate QR Code</button>
      {qrCode && <QRCodeGenerator qrCode={qrCode} />}
    </div>
  );
}

