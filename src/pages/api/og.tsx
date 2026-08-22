import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  try {
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #090d16 0%, #171f33 100%)",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        {/* Card Glassmorphism Principal */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "32px",
            padding: "50px 70px",
            boxShadow: "0 30px 60px rgba(0, 0, 0, 0.5)",
            gap: "48px",
            width: "100%",
            maxWidth: "1060px",
          }}
        >
          {/* Ícone do G Vermelho Estilizado à Esquerda */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(239, 68, 68, 0.12)",
              border: "2px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "32px",
              width: "140px",
              height: "140px",
              boxShadow: "0 10px 30px rgba(239, 68, 68, 0.2)",
            }}
          >
            <span
              style={{
                fontSize: "90px",
                fontWeight: 900,
                color: "#ef4444",
                lineHeight: 1,
                fontFamily: "sans-serif",
              }}
            >
              G
            </span>
          </div>

          {/* Bloco de Textos */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
            }}
          >
            {/* Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                color: "#60a5fa",
                padding: "6px 16px",
                borderRadius: "20px",
                fontSize: 15,
                fontWeight: 700,
                marginBottom: "14px",
                width: "fit-content",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Língua Portuguesa Brasileira
            </div>

            <h1
              style={{
                fontSize: 58,
                fontWeight: 800,
                color: "#ffffff",
                margin: "0 0 12px 0",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Conjugador Gules
            </h1>

            <p
              style={{
                fontSize: 22,
                color: "#94a3b8",
                margin: 0,
                lineHeight: 1.45,
                maxWidth: "580px",
              }}
            >
              Consulte a conjugação completa de verbos construída a partir da
              base de palavras do projeto VERO.
            </p>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.error(e);
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
