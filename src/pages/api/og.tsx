import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export const config = {
  runtime: "nodejs", // Alterado para nodejs para permitir a leitura do arquivo local com fs
};

export default async function handler(req: NextRequest) {
  try {
    // Lê o logo diretamente da pasta public de forma síncrona
    const filePath = path.join(process.cwd(), "public", "gules192-v1.png");
    const logoBuffer = fs.readFileSync(filePath);
    const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        {/* Card principal estilo glassmorphism */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "32px",
            padding: "60px 80px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            gap: "50px",
            width: "100%",
            maxWidth: "1050px",
          }}
        >
          {/* Logo com sombra e container */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "24px",
              padding: "20px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            }}
          >
            <img
              src={logoBase64}
              width="130"
              height="130"
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Textos */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
            }}
          >
            {/* Badge superior */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(99, 102, 241, 0.2)",
                color: "#818cf8",
                padding: "6px 16px",
                borderRadius: "20px",
                fontSize: 16,
                fontWeight: 600,
                marginBottom: "16px",
                width: "fit-content",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Língua Portuguesa
            </div>

            <h1
              style={{
                fontSize: 56,
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
                lineHeight: 1.4,
              }}
            >
              Conjugador de verbos da Língua Portuguesa Brasileira construído
              com base no projeto VERO.
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
