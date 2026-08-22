import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  try {
    const baseUrl = req.nextUrl.origin;

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          fontFamily: "sans-serif",
          padding: "40px",
        }}
      >
        {/* Caixa central com o logo e o título */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            border: "4px solid #111",
            borderRadius: "24px",
            padding: "50px 70px",
            backgroundColor: "#f8fafc",
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
            gap: "40px",
          }}
        >
          {/* Logo */}
          <img
            src={`${baseUrl}/gules192-v1.png`}
            width="120"
            height="120"
            style={{ objectFit: "contain" }}
          />

          {/* Textos */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h1
              style={{
                fontSize: 60,
                fontWeight: "bold",
                color: "#0f172a",
                margin: "0 0 10px 0",
                letterSpacing: "-0.025em",
              }}
            >
              Conjugador Gules
            </h1>
            <p
              style={{
                fontSize: 24,
                color: "#475569",
                margin: 0,
                maxWidth: "600px",
              }}
            >
              Conjugador de verbos da Língua Portuguesa Brasileira
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
    return new Response(`Failed to generate the image`, { status: 500 });
  }
}
