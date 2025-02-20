import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const MyQRCode = () => {
  const message = encodeURIComponent("Thank you for voting! ✅");
  const qrValue = `https://your-voting-app.com/success?msg=${message}`;

  return (
    <div>
      <h2>Scan to Get Your Message:</h2>
      <QRCodeCanvas value={qrValue} size={200} />
    </div>
  );
};

export default MyQRCode;
