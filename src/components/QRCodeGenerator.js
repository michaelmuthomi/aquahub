import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import supabase from "../supabaseClient";

const MyQRCode = () => {
  const navigate = useNavigate();
  const [qrCodeId] = useState("vote123"); // Example QR Code ID

  // Insert QR code scan status in Supabase
  useEffect(() => {
    const insertQRCode = async () => {
      const { data, error } = await supabase
        .from("qr_scans")
        .upsert([{ qr_code_id: qrCodeId, is_scanned: false }]); // Upsert ensures no duplicate entries

      if (error) console.error("Error inserting QR code:", error);
    };

    insertQRCode();
  }, [qrCodeId]);

  // Monitor the scan status in Supabase
  useEffect(() => {
    const subscription = supabase
      .channel("qr_scans")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "qr_scans" },
        (payload) => {
          if (payload.new.qr_code_id === qrCodeId && payload.new.is_scanned) {
            navigate("/vote"); // Redirect to vote page once scanned
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [qrCodeId, navigate]);

  const qrValue = `https://aquahub.vercel.app/scanned?id=${qrCodeId}`;

  return (
    <div>
      <h2>Scan the QR Code to Proceed:</h2>
      <QRCodeCanvas value={qrValue} size={200} />
    </div>
  );
};

export default MyQRCode;
