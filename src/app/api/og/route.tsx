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
          backgroundColor: "#0d0d0d",
          fontFamily: "sans-serif",
          padding: "80px 90px",
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
              fontSize: 16,
              color: "#737373",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Língua Portuguesa Brasileira
          </span>
          <div
            style={{
              width: "48px",
              height: "3px",
              backgroundColor: "#dc2626",
            }}
          />
        </div>

        {/* Bloco central construtivista: G + Títulos directos no fundo */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "56px",
            width: "100%",
          }}
        >
          {/* Bloco tipográfico puro do G */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#dc2626",
              width: "140px",
              height: "140px",
            }}
          >
            <span
              style={{
                fontSize: "92px",
                fontWeight: 900,
                color: "#0d0d0d",
                lineHeight: 1,
              }}
            >
              G
            </span>
          </div>

          {/* Tipografia */}
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
                fontSize: 68,
                fontWeight: 900,
                color: "#fafafa",
                margin: "0 0 14px 0",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              Conjugador Gules
            </h1>

            <p
              style={{
                fontSize: 24,
                color: "#a3a3a3",
                margin: 0,
                lineHeight: 1.4,
                maxWidth: "640px",
              }}
            >
              Consulte a conjugação completa de verbos a partir da base de
              palavras do projeto VERO.
            </p>
          </div>
        </div>

        {/* Rodapé cru */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              fontSize: 14,
              color: "#dc2626",
              fontWeight: 900,
            }}
          >
            //
          </span>
          <span
            style={{
              fontSize: 15,
              color: "#737373",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: 600,
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
