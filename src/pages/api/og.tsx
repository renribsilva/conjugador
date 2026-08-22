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
          justifyContent: "space-between",
          backgroundColor: "#090d16",
          fontFamily: "sans-serif",
          padding: "70px 80px",
        }}
      >
        {/* Linha superior minimalista */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <span
            style={{
              fontSize: 18,
              color: "#64748b",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Conjugador de Verbos
          </span>
          <div
            style={{
              width: "40px",
              height: "2px",
              backgroundColor: "#ef4444",
            }}
          />
        </div>

        {/* Bloco central construtivista (G + Textos) */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "60px",
            width: "100%",
          }}
        >
          {/* Bloco geométrico do G */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ef4444",
              borderRadius: "20px",
              width: "130px",
              height: "130px",
            }}
          >
            <span
              style={{
                fontSize: "80px",
                fontWeight: 900,
                color: "#090d16",
                lineHeight: 1,
              }}
            >
              G
            </span>
          </div>

          {/* Tipografia principal */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <h1
              style={{
                fontSize: 64,
                fontWeight: 800,
                color: "#ffffff",
                margin: "0 0 16px 0",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
              }}
            >
              Conjugador Gules
            </h1>

            <p
              style={{
                fontSize: 22,
                color: "#94a3b8",
                margin: 0,
                lineHeight: 1.5,
                maxWidth: "700px",
              }}
            >
              Consulte a conjugação completa de verbos da Língua Portuguesa
              Brasileira a partir da base do projeto VERO.
            </p>
          </div>
        </div>

        {/* Rodapé minimalista */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontSize: 16,
              color: "#ef4444",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            ●
          </span>
          <span
            style={{
              fontSize: 16,
              color: "#64748b",
              letterSpacing: "0.05em",
            }}
          >
            conjugador-gules.vercel.app
          </span>
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
