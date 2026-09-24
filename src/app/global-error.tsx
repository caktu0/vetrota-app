"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("VetRota Global Error:", error);
  }, [error]);

  return (
    <html lang="tr">
      <head>
        <title>VetRota — Sistem Hatası</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          padding: "24px",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FDFBF7",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          color: "#2D241E",
        }}
      >
        <div
          style={{
            maxWidth: "420px",
            width: "100%",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E8DFD3",
            borderRadius: "24px",
            padding: "32px 24px",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              backgroundColor: "#FEF2F2",
              border: "1px solid #FCA5A5",
              color: "#B91C1C",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
            }}
          >
            ⚠️
          </div>

          <h1
            style={{
              fontSize: "22px",
              fontWeight: "800",
              marginBottom: "8px",
              color: "#2D241E",
            }}
          >
            Sistem Hatası Oluştu
          </h1>

          <p
            style={{
              fontSize: "13px",
              lineHeight: "1.6",
              color: "#5C3D2E",
              marginBottom: "24px",
            }}
          >
            VetRota uygulamasında kritik bir hata meydana geldi. Yeniden başlatmak için aşağıdaki butona tıklayın.
          </p>

          <button
            onClick={() => reset()}
            style={{
              width: "100%",
              backgroundColor: "#C67B5C",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "12px",
              padding: "12px 20px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(198,123,92,0.25)",
            }}
          >
            Uygulamayı Yeniden Yükle
          </button>
        </div>
      </body>
    </html>
  );
}
